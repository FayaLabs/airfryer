import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';

// Generate PDF
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

// Now open the PDF and screenshot each page
const pdfPage = await browser.newPage();
await pdfPage.goto('file://' + pdfPath, { waitUntil: 'networkidle0' });

// Get page count by checking the PDF viewer
const pageCount = await pdfPage.evaluate(() => {
  // Try to get page count from PDF viewer
  return document.querySelectorAll('.page').length || 'unknown';
});

console.log('PDF generated at:', pdfPath);
console.log('Check it manually');

await browser.close();
