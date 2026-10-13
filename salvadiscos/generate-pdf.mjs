import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

await page.goto('http://localhost:8889/salvadiscos/print.html', {
  waitUntil: 'networkidle0',
  timeout: 30000
});

// Wait for fonts to load
await page.evaluateHandle('document.fonts.ready');

await page.pdf({
  path: '/Users/douglasmonroe/hashidata-framework/Projects/Airfryer Collective/AF_Dossier/Airfryer_Dossier_SalvaDiscos.pdf',
  format: 'A4',
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: '<span></span>',
  footerTemplate: `
    <div style="width:100%;padding:0 20mm;display:flex;justify-content:space-between;align-items:center;border-top:0.5px solid rgba(26,23,20,0.15);margin:0 20mm;padding-top:3mm;">
      <span style="font-family:'Space Grotesk','Helvetica Neue',Arial,sans-serif;font-size:7pt;letter-spacing:0.14em;text-transform:uppercase;color:rgba(26,23,20,0.35);">Airfryer Collective &middot; Dossier 2026</span>
      <span style="font-family:'Space Grotesk','Helvetica Neue',Arial,sans-serif;font-size:7pt;letter-spacing:0.14em;text-transform:uppercase;color:rgba(26,23,20,0.35);"><span class="pageNumber"></span> / <span class="totalPages"></span></span>
    </div>
  `,
  margin: { top: 0, right: 0, bottom: '14mm', left: 0 },
  preferCSSPageSize: false
});

await browser.close();
console.log('PDF generated successfully');
