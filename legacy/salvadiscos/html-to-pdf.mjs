// Generic HTML → PDF generator (Puppeteer / Chrome headless).
// Reuses the Puppeteer install in this folder (originally for the Airfryer Salva Discos dossier).
//
// Usage:
//   node html-to-pdf.mjs <input-html-absolute-path> <output-pdf-absolute-path> [options]
//
// Options:
//   --theme=dark|light    Force theme. Default: dark (overrides @media print light palette).
//   --orientation=landscape|portrait  Default: landscape.
//   --margin=<mm>         Page margin in mm. Default: 10.
//   --no-print-media      Skip emulateMediaType('print'). Use the screen layout as-is.
//
// Examples:
//   node html-to-pdf.mjs /abs/path/deck.html /abs/path/deck.pdf
//   node html-to-pdf.mjs /abs/path/deck.html /abs/path/deck.pdf --theme=light --orientation=portrait

import puppeteer from 'puppeteer';

const args = process.argv.slice(2);
const inputPath = args[0];
const outputPath = args[1];

if (!inputPath || !outputPath) {
  console.error('Usage: node html-to-pdf.mjs <input-html> <output-pdf> [--theme=dark|light] [--orientation=landscape|portrait] [--margin=10] [--no-print-media]');
  process.exit(1);
}

const getArg = (name, def) => {
  const m = args.find(a => a.startsWith('--' + name + '='));
  return m ? m.split('=')[1] : def;
};
const hasFlag = (name) => args.includes('--' + name);

const theme = getArg('theme', 'dark');
const orientation = getArg('orientation', 'landscape');
const margin = getArg('margin', '10');
const skipPrintMedia = hasFlag('no-print-media');

const fileUrl = 'file://' + inputPath;

console.log('[html-to-pdf] Launching Chromium...');
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

console.log('[html-to-pdf] Loading: ' + fileUrl);
await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 60000 });

if (!skipPrintMedia) {
  await page.emulateMediaType('print');
}

// Inject overrides for dark theme — re-asserts dark palette inside @media print.
if (theme === 'dark') {
  await page.addStyleTag({
    content: `
      @media print {
        :root {
          --bg-base:#000000 !important;
          --bg-surface:#0A0A0A !important;
          --bg-lift:#111111 !important;
          --text-headline:#FFFFFF !important;
          --text-body:#B0B0B0 !important;
          --text-muted:#8A8A8A !important;
          --text-faint:#6E6E6E !important;
          --hairline:rgba(255,255,255,0.08) !important;
          --hairline-strong:rgba(255,255,255,0.14) !important;
        }
        html, body { background:#000000 !important; }
      }
    `
  });
} else if (theme === 'light') {
  // No override needed — Andre's @media print already switches to light.
}

await page.evaluateHandle('document.fonts.ready');

console.log('[html-to-pdf] Generating PDF (' + orientation + ', ' + margin + 'mm margins, theme=' + theme + ')...');
await page.pdf({
  path: outputPath,
  format: 'A4',
  landscape: orientation === 'landscape',
  printBackground: true,
  margin: {
    top: margin + 'mm',
    right: margin + 'mm',
    bottom: margin + 'mm',
    left: margin + 'mm'
  },
  preferCSSPageSize: false
});

await browser.close();
console.log('[html-to-pdf] Done: ' + outputPath);
