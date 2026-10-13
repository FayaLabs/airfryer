import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

await page.goto('http://localhost:8889/salvadiscos/print.html', {
  waitUntil: 'networkidle0',
  timeout: 30000
});
await page.evaluateHandle('document.fonts.ready');

const pdfPath = '/Users/douglasmonroe/Downloads/Airfryer_Dossier_Test.pdf';
await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  preferCSSPageSize: true
});

console.log('PDF generated');

// Now open the PDF and screenshot each page to verify
const pdfPage = await browser.newPage();

// Read PDF to get page count
const fs = await import('fs');
const pdfBuffer = fs.readFileSync(pdfPath);
// Count pages by looking for /Type /Page in the PDF
const pdfText = pdfBuffer.toString('latin1');
const pageCount = (pdfText.match(/\/Type\s*\/Page[^s]/g) || []).length;
console.log(`PDF has ${pageCount} pages`);

// Screenshot each page using Chrome's PDF viewer
await pdfPage.goto(`file://${pdfPath}`, { waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});

// Take screenshots of the print HTML at each page position instead
const screenshotPage = await browser.newPage();
await screenshotPage.setViewport({ width: 794, height: 1123 }); // A4 at 96dpi
await screenshotPage.goto('http://localhost:8889/salvadiscos/print.html', {
  waitUntil: 'networkidle0'
});

// Get all .pg elements positions
const positions = await screenshotPage.evaluate(() => {
  const els = [document.body.children[1], ...document.querySelectorAll('.pg')];
  return els.map((el, i) => ({
    index: i,
    top: el.getBoundingClientRect().top + window.scrollY,
    height: el.getBoundingClientRect().height,
    name: el.querySelector('h2')?.textContent || el.querySelector('.subtitle')?.textContent || `Page ${i}`
  }));
});

// Screenshot each section
for (const pos of positions) {
  await screenshotPage.evaluate(y => window.scrollTo(0, y), pos.top);
  await screenshotPage.screenshot({
    path: `/Users/douglasmonroe/Downloads/dossier-page-${pos.index}.png`,
    clip: { x: 0, y: pos.top, width: 794, height: Math.min(pos.height, 1123) }
  });
  console.log(`Screenshotted: ${pos.name} (${Math.round(pos.height)}px = ${Math.round(pos.height/3.78)}mm)`);
}

await browser.close();
console.log('\nDone. Check /Users/douglasmonroe/Downloads/dossier-page-*.png');
