// Build-time prerender: renders the built SPA in a real browser and writes the
// resulting markup into static HTML, so crawlers and no-JS visitors get content.
//   dist/index.html     → Arabic (default route "/")
//   dist/en/index.html  → English ("/en/"), with <base href="../"> so relative assets resolve
// The client script still boots and re-renders #app as before.
// Run after `vite build` (wired into `npm run build`).
import { chromium } from '@playwright/test';
import { preview } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { ROUTES } from '../vite.config.js';

const dist = path.resolve('dist');
const indexPath = path.join(dist, 'index.html');
const template = fs.readFileSync(indexPath, 'utf8');
const META = {
  ar: null, // index.html already carries the Arabic title/description
  en: {
    title: 'Dr. Maan bin Abdullah Al Barry | Consultant Ophthalmologist (Cornea, Cataract & Refractive Surgery) | Madinah',
    description: 'Official website of Dr. Maan bin Abdullah Al Barry, Consultant Ophthalmologist (cornea, cataract and refractive surgery), Chief of Staff at Magrabi Health Madinah. Experience since 1998. Book an appointment.'
  }
};

const server = await preview({ preview: { port: 4176, strictPort: true }, logLevel: 'silent' });
const browser = await chromium.launch();
async function render(lang) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.addInitScript(l => { try { localStorage.setItem('lang', l); localStorage.removeItem('theme'); } catch (e) { /* ignore */ } }, lang);
  await page.goto('http://localhost:4176/', { waitUntil: 'load' });
  await page.waitForFunction(l => document.documentElement.lang === l && document.querySelector('#app h1'), lang);
  // Static markup only: drop live canvases / injected runtime nodes that make no sense without JS.
  const html = await page.evaluate(() => {
    const app = document.querySelector('#app').cloneNode(true);
    app.querySelectorAll('canvas, script').forEach(n => n.remove());
    app.querySelectorAll('.fade-in, .reveal').forEach(n => n.classList.add('visible'));
    return app.innerHTML;
  });
  await ctx.close();
  if (errors.length) throw new Error(`prerender ${lang}: ${errors.join('\n')}`);
  return html;
}

try {
  const ar = await render('ar');
  const en = await render('en');
  const fill = (doc, html) => doc.replace(/<div id="app"><\/div>/, () => `<div id="app">${html}</div>`);
  if (!template.includes('<div id="app"></div>')) throw new Error('dist/index.html: empty #app root not found');
  fs.writeFileSync(indexPath, fill(template, ar));

  let enDoc = fill(template, en)
    .replace('<html lang="ar" dir="rtl">', '<html lang="en" dir="ltr">')
    .replace(/<head>/, '<head>\n  <base href="../">')
    .replace(/<title>[^<]*<\/title>/, `<title>${META.en.title}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${META.en.description}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${ROUTES.en}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${ROUTES.en}">`)
    .replace(/<meta property="og:locale" content="ar_SA">\s*<meta property="og:locale:alternate" content="en_US">/,
      '<meta property="og:locale" content="en_US">\n  <meta property="og:locale:alternate" content="ar_SA">');
  if (!enDoc.includes('<html lang="en" dir="ltr">')) throw new Error('en: <html> tag not rewritten');
  fs.mkdirSync(path.join(dist, 'en'), { recursive: true });
  fs.writeFileSync(path.join(dist, 'en', 'index.html'), enDoc);
  console.log(`prerender: / (${ar.length} chars), /en/ (${en.length} chars)`);
} finally {
  await browser.close();
  await new Promise(r => server.httpServer.close(r));
}
