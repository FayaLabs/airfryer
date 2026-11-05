// Paged.js-based HTML → PDF generator.
// Uses the CSS Paged Media spec polyfill — industry standard for paginated PDF output.
// Handles fragmentation, image protection, running headers/footers, multi-page sections cleanly.
//
// Usage:
//   node html-to-pdf-paged.mjs <input-html-absolute-path> <output-pdf-absolute-path> [--config=selvaggio-dark|selvaggio-light|airfryer|generic]
//
// Default config: selvaggio-dark (matches Andre's deck)

import puppeteer from 'puppeteer';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const inputPath = args[0];
const outputPath = args[1];
const configArg = args.find(a => a.startsWith('--config='));
const config = configArg ? configArg.split('=')[1] : 'selvaggio-dark';

if (!inputPath || !outputPath) {
  console.error('Usage: node html-to-pdf-paged.mjs <input-html> <output-pdf> [--config=selvaggio-dark|selvaggio-light|generic]');
  process.exit(1);
}

// ════════════════════════════════════════════════════════════════
// CONFIGS — print stylesheets per deck type
// ════════════════════════════════════════════════════════════════

const CONFIGS = {
  'selvaggio-dark-portrait': `
    /* PORTRAIT A4 — partnership-package format
       Fixes vs landscape: 46% more vertical space per page, fewer orphan pages,
       images capped at 420px height so they never trigger blank-page artifacts. */
    @page {
      size: A4 portrait;
      margin: 18mm 16mm 18mm 16mm;
      background: #000000;
      marks: none;

      @bottom-left {
        content: 'Selvaggio × Hashidata · PlumeTwin for Gexcon';
        font-family: 'JetBrains Mono', monospace;
        font-size: 7.5pt;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.42);
      }
      @bottom-right {
        content: counter(page) ' / ' counter(pages);
        font-family: 'JetBrains Mono', monospace;
        font-size: 7.5pt;
        color: rgba(255,255,255,0.42);
      }
    }

    @page :first {
      @bottom-left  { content: ''; }
      @bottom-right { content: ''; }
      @top-left     { content: ''; }
      @top-right    { content: ''; }
    }

    /* DARK PALETTE OVERRIDE */
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

    /* HIDE UI CHROME */
    .sidebar, .theme-toggle { display: none !important; }
    .app { display: block !important; }

    /* SECTION PAGINATION */
    section {
      padding: 0 0 16px !important;
      max-width: none !important;
    }
    section:not(.cover) {
      break-before: page;
      break-inside: auto;
    }
    .cover {
      break-after: page;
    }

    /* IMAGE HEIGHT CAP — THE critical fix.
       Prevents images that exceed page height from triggering blank-page artifacts.
       object-fit: contain ensures NO cropping ever. */
    img {
      max-width: 100% !important;
      max-height: 420px !important;
      width: auto !important;
      height: auto !important;
      object-fit: contain !important;
      break-inside: avoid;
      display: block;
    }
    .chart-wrap img,
    .chart-wrap svg {
      max-height: 420px !important;
      width: auto !important;
      height: auto !important;
    }

    /* MULTI-COL GRIDS — keep portrait-friendly */
    .kpi-grid, .kpi-grid.three, .kpi-grid.two {
      grid-template-columns: 1fr 1fr !important;
      gap: 12px !important;
    }
    .compare, .compare.three, .compare.four {
      grid-template-columns: 1fr 1fr !important;
      gap: 14px !important;
    }
    .value-grid { grid-template-columns: 1fr 1fr !important; gap: 14px !important; }
    .cover-bottom { grid-template-columns: 1fr 1fr !important; gap: 18px !important; }

    /* BREAK PROTECTION for visual blocks (atomic, never split)
       .evidence-card and .evidence-inner kept atomic — splitting them caused
       worse artifacts than leaving them whole. */
    .cmatrix-wrap, .cmatrix,
    .chart-wrap, .chart-wrap > *,
    .evidence-card, .evidence-inner,
    .kpi-grid > *,
    .quote-card,
    .compare > *,
    .value-grid > *,
    .cover-bottom > *,
    .section-head,
    figure, picture,
    pre, blockquote,
    table, tr {
      break-inside: avoid;
    }

    /* Note: tried (1) section > *:last-child { break-before: avoid }
       and (2) body font-size reduction — both introduced blank pages.
       Iteration 3's settings (above) produced the cleanest result: 49 pages,
       4 orphan pages (all section-ending small blocks, no blanks). */

    /* PAIR HEADINGS WITH CONTENT */
    h1, h2, h3, h4 { break-after: avoid; }
    .section-head { break-after: avoid; }

    /* ORPHAN/WIDOW + ATOMIC PARAGRAPHS
       Paragraphs are kept whole — Paged.js moves them entire if they can't fit.
       Prevents the "two-words-on-a-page" widow that broke page 8 in iteration 3. */
    p {
      break-inside: avoid;
      orphans: 4;
      widows: 4;
    }
    li {
      break-inside: avoid;
      orphans: 3;
      widows: 3;
    }

    /* KILL REVEAL ANIMATIONS */
    section[id] > * {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
      transition-delay: 0s !important;
    }

    /* KILL GRAIN OVERLAY */
    body::before { display: none !important; }

    /* PAGED.JS PAGE STYLING */
    .pagedjs_page,
    .pagedjs_pagebox,
    .pagedjs_area,
    .pagedjs_page_content {
      background: #000000 !important;
    }
  `,

  'selvaggio-dark': `
    /* PAGE SETUP — A4 landscape, dark, with running header/footer */
    @page {
      size: A4 landscape;
      margin: 14mm 16mm 18mm 16mm;
      background: #000000;

      @bottom-left {
        content: 'Selvaggio × Hashidata · PlumeTwin for Gexcon';
        font-family: 'JetBrains Mono', monospace;
        font-size: 7.5pt;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.45);
      }
      @bottom-right {
        content: counter(page) ' / ' counter(pages);
        font-family: 'JetBrains Mono', monospace;
        font-size: 7.5pt;
        letter-spacing: 0.14em;
        color: rgba(255,255,255,0.45);
      }
    }

    @page :first {
      @bottom-left  { content: ''; }
      @bottom-right { content: ''; }
    }

    /* FORCE DARK PALETTE — overrides Andre's @media print light switch */
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

    /* HIDE UI CHROME */
    .sidebar, .theme-toggle { display: none !important; }
    .app { display: block !important; }

    /* SECTION PAGINATION
       - Every section starts on a new page (except cover which is already first)
       - Sections may span multiple pages cleanly
       - Tight padding so content uses full page area */
    section {
      break-before: page;
      break-inside: auto;
      padding: 24px 8px 16px !important;
      max-width: none !important;
    }
    section.cover, section:first-of-type {
      break-before: avoid;
    }
    .cover { break-after: page; }

    /* BREAK PROTECTION — these blocks MUST stay together (no mid-image cuts) */
    .cmatrix-wrap, .cmatrix, .cmatrix > *,
    .chart-wrap, .chart-wrap svg, .chart-wrap > *,
    .evidence-card, .evidence-inner,
    .kpi-grid, .kpi-grid > *,
    .quote-card,
    .compare, .compare > *,
    .value-grid > *,
    .cover-bottom,
    .section-head,
    figure, img, svg,
    pre, blockquote,
    table, tr {
      break-inside: avoid;
    }

    /* PAIR HEADINGS WITH FOLLOWING CONTENT */
    h1, h2, h3, h4 { break-after: avoid; }

    /* ORPHAN/WIDOW CONTROL */
    p, li { orphans: 3; widows: 3; }

    /* DISABLE SCROLL-REVEAL — opacity:0 elements would render invisible */
    section[id] > * {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
      transition-delay: 0s !important;
    }

    /* DISABLE FIXED GRAIN OVERLAY — interferes with Paged.js layout */
    body::before { display: none !important; }

    /* PAGED.JS PAGE STYLING — pure black page background */
    .pagedjs_page,
    .pagedjs_pagebox,
    .pagedjs_area,
    .pagedjs_page_content {
      background: #000000 !important;
    }
  `,

  'selvaggio-light': `
    @page {
      size: A4 landscape;
      margin: 16mm 18mm 20mm 18mm;
      background: #F4F2EC;

      @bottom-left {
        content: 'Selvaggio × Hashidata · PlumeTwin for Gexcon';
        font-family: 'JetBrains Mono', monospace;
        font-size: 7.5pt;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: rgba(15,27,45,0.45);
      }
      @bottom-right {
        content: counter(page) ' / ' counter(pages);
        font-family: 'JetBrains Mono', monospace;
        font-size: 7.5pt;
        color: rgba(15,27,45,0.45);
      }
    }
    @page :first {
      @bottom-left { content: ''; }
      @bottom-right { content: ''; }
    }

    /* Activate Andre's light theme */
    :root { /* matches data-theme="light" */ }
    html { data-theme: light; }

    .sidebar, .theme-toggle { display: none !important; }
    .app { display: block !important; }

    section {
      break-before: page;
      break-inside: auto;
      padding: 24px 8px 16px !important;
      max-width: none !important;
    }
    section.cover, section:first-of-type { break-before: avoid; }
    .cover { break-after: page; }

    .cmatrix-wrap, .cmatrix, .chart-wrap, .evidence-card, .kpi-grid,
    .quote-card, .compare, .value-grid > *, .section-head,
    figure, img, svg, pre, blockquote, table { break-inside: avoid; }

    h1, h2, h3, h4 { break-after: avoid; }
    p, li { orphans: 3; widows: 3; }

    section[id] > * {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }
    body::before { display: none !important; }
  `,

  'generic': `
    @page { size: A4; margin: 15mm; }
    section, article, .page { break-before: page; break-inside: auto; }
    img, svg, figure, table, pre { break-inside: avoid; }
    h1, h2, h3, h4 { break-after: avoid; }
    p, li { orphans: 3; widows: 3; }
  `,
};

const PRINT_CSS = CONFIGS[config];
if (!PRINT_CSS) {
  console.error('Unknown config: ' + config + '. Available: ' + Object.keys(CONFIGS).join(', '));
  process.exit(1);
}

// ════════════════════════════════════════════════════════════════
// RUN
// ════════════════════════════════════════════════════════════════

const fileUrl = 'file://' + inputPath;
const pagedJsPath = resolve(__dirname, 'node_modules/pagedjs/dist/paged.polyfill.js');
const pagedJsContent = readFileSync(pagedJsPath, 'utf-8');

console.log('[paged.js] config:', config);
console.log('[paged.js] launching Chromium...');
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-web-security']
});
const page = await browser.newPage();
page.on('console', msg => {
  const t = msg.text();
  if (!t.includes('JQMIGRATE') && !t.includes('DevTools')) console.log('  [browser]', t);
});
page.on('pageerror', err => console.log('  [browser error]', err.message));

console.log('[paged.js] loading:', fileUrl);
await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 120000 });

console.log('[paged.js] waiting for fonts...');
await page.evaluateHandle('document.fonts.ready');

console.log('[paged.js] injecting print CSS (' + PRINT_CSS.length + ' chars)...');
await page.addStyleTag({ content: PRINT_CSS });

console.log('[paged.js] injecting Paged.js polyfill...');
await page.addScriptTag({ content: pagedJsContent });

console.log('[paged.js] waiting for pagination to complete...');
await page.waitForFunction(
  () => {
    const pages = document.querySelector('.pagedjs_pages');
    if (!pages) return false;
    // Wait until rendering is settled
    return document.body.classList.contains('pagedjs_pages_rendered') ||
           document.querySelectorAll('.pagedjs_page').length > 0;
  },
  { timeout: 240000, polling: 1000 }
);

// Extra wait for any final rendering
await new Promise(r => setTimeout(r, 3000));

const pageCount = await page.evaluate(() => document.querySelectorAll('.pagedjs_page').length);
console.log('[paged.js] paginated into ' + pageCount + ' pages.');

console.log('[paged.js] generating PDF...');
await page.pdf({
  path: outputPath,
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  timeout: 120000,
});

await browser.close();
console.log('[paged.js] done:', outputPath);
