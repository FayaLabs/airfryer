import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
// Set viewport to A4 width at 96dpi (210mm = ~794px)
await page.setViewport({ width: 794, height: 1123 });

await page.goto('http://localhost:8889/salvadiscos/print.html', {
  waitUntil: 'networkidle0',
  timeout: 30000
});
await page.evaluateHandle('document.fonts.ready');

// Measure each .pg section height
const heights = await page.evaluate(() => {
  const pageMargin = 36; // 18mm top + 18mm bottom in mm
  const availableHeight = 297 - pageMargin; // ~261mm available
  const pxPerMm = 96 / 25.4; // ~3.78 px per mm
  const availablePx = availableHeight * pxPerMm; // ~987px

  const sections = document.querySelectorAll('.pg');
  const cover = document.querySelector('.pg')?.previousElementSibling;

  const results = [];

  // Measure cover (first child of body, not a .pg)
  const firstChild = document.body.children[1]; // skip print button
  if (firstChild && !firstChild.classList.contains('pg')) {
    const rect = firstChild.getBoundingClientRect();
    results.push({
      name: 'Cover',
      heightPx: Math.round(rect.height),
      heightMm: Math.round(rect.height / pxPerMm),
      fits: rect.height <= availablePx,
      overflowMm: Math.round((rect.height - availablePx) / pxPerMm)
    });
  }

  sections.forEach((s, i) => {
    const rect = s.getBoundingClientRect();
    const heading = s.querySelector('h2')?.textContent || s.querySelector('.subtitle')?.textContent || `Section ${i+1}`;
    results.push({
      name: heading.trim(),
      heightPx: Math.round(rect.height),
      heightMm: Math.round(rect.height / pxPerMm),
      fits: rect.height <= availablePx,
      overflowMm: rect.height > availablePx ? Math.round((rect.height - availablePx) / pxPerMm) : 0
    });
  });

  return { availableMm: Math.round(availableHeight), results };
});

console.log(`\nA4 available content area: ${heights.availableMm}mm\n`);
console.log('Section'.padEnd(30) + 'Height(mm)'.padEnd(14) + 'Fits?'.padEnd(8) + 'Overflow');
console.log('-'.repeat(65));
heights.results.forEach(r => {
  const status = r.fits ? '✅' : '❌';
  const overflow = r.overflowMm > 0 ? `+${r.overflowMm}mm` : '';
  console.log(r.name.padEnd(30) + `${r.heightMm}mm`.padEnd(14) + status.padEnd(8) + overflow);
});

await browser.close();
