// Build-time prerender: renders every route of the built SPA in a real browser and writes the
// resulting markup into static HTML, so crawlers and no-JS visitors get the full content.
//   dist/index.html                          → Arabic home ("/")
//   dist/en/index.html                       → English home ("/en/")
//   dist/<page>/index.html                   → Arabic section pages (about, procedures, lens-lab, …)
//   dist/en/<page>/index.html                → English section pages
//   dist/procedures/<slug>/index.html        → Arabic procedure pages
//   dist/en/procedures/<slug>/index.html     → English procedure pages
// Each page gets the right lang/dir, a <base> pointing at the site root (relative, so the same files
// work on a domain root and on a GitHub Pages subpath), its own title/description/canonical/hreflang/
// og tags, and — for procedure pages — MedicalWebPage/MedicalProcedure/FAQPage/BreadcrumbList JSON-LD; section
// pages get their own page type (ProfilePage, CollectionPage, ContactPage + MedicalClinic, MedicalWebPage) plus
// a BreadcrumbList.
// Interactive modules (vision simulator, Lens Lab, Light Journey) cannot run without JavaScript: their hosts are
// emptied and their reserved height dropped, so no-JS readers get the static text summary instead of a blank gap.
// The client script still boots and re-renders #app.
// Run after `vite build` (wired into `npm run build`).
import { chromium } from '@playwright/test';
import { preview } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { PAGE_URLS, SITE_URL, pageUrl } from '../vite.config.js';
import { pageMeta, breadcrumbFor, pathFor } from '../site-routes.js';
import { buildProcedureJsonLd, buildSectionJsonLd, PROCEDURES } from '../doctor-data.js';
import { CONTENT } from '../src/procedures/content.js';

const dist = path.resolve('dist');
const indexPath = path.join(dist, 'index.html');
const template = fs.readFileSync(indexPath, 'utf8');
if (!template.includes('<div id="app"></div>')) throw new Error('dist/index.html: empty #app root not found');

const PORT = Number(process.env.PRERENDER_PORT || 4176);
const server = await preview({ preview: { port: PORT, strictPort: true }, logLevel: 'silent' });
const browser = await chromium.launch();

async function render(page) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, reducedMotion: 'reduce' });
  const tab = await ctx.newPage();
  const errors = [];
  tab.on('pageerror', e => errors.push(String(e)));
  await tab.addInitScript(() => { try { localStorage.removeItem('lang'); localStorage.removeItem('theme'); } catch (e) { /* ignore */ } });
  // Deep routes do not exist on disk yet: serve the SPA shell for every document request.
  await tab.route(`http://localhost:${PORT}/**`, (r) => r.request().resourceType() === 'document'
    ? r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: template })
    : r.continue());
  await tab.goto(`http://localhost:${PORT}/${page.path}`, { waitUntil: 'load' });
  await tab.waitForFunction(({ lang, slug, key }) => document.documentElement.lang === lang
    && document.querySelector('#app main h1')
    && (slug ? document.querySelector(`.proc-page[data-slug="${slug}"] #p-faq`) : document.querySelector(`#app main[data-page="${key}"]`)), { lang: page.lang, slug: page.slug, key: page.page });
  // Static markup only: drop live canvases / injected runtime nodes that make no sense without JS.
  const html = await tab.evaluate(() => {
    const app = document.querySelector('#app').cloneNode(true);
    app.querySelectorAll('canvas, script').forEach(n => n.remove());
    // no simulator can mount without JS: drop the reserved height so no-JS readers get no blank gap (BUG-10)
    app.querySelectorAll('[data-vision-host], [data-lens-lab-host], [data-light-journey-host]').forEach(n => { n.innerHTML = ''; n.removeAttribute('data-reserve'); });
    app.querySelectorAll('.feature').forEach(n => { n.classList.remove('is-mounted', 'is-loading', 'is-failed'); n.querySelectorAll('.feature-status').forEach(s => s.remove()); });
    app.querySelectorAll('.fade-in, .reveal').forEach(n => n.classList.add('visible'));
    return app.innerHTML;
  });
  await ctx.close();
  if (errors.length) throw new Error(`prerender ${page.path || '/'}: ${errors.join('\n')}`);
  return html;
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function documentFor(page, appHtml) {
  const { lang, slug } = page;
  const key = page.page;
  const meta = pageMeta(lang, slug, key);
  const url = pageUrl(lang, slug, key);
  const depth = page.path.split('/').filter(Boolean).length;
  const base = depth ? '../'.repeat(depth) : './';
  let doc = template
    .replace(/<div id="app"><\/div>/, () => `<div id="app">${appHtml}</div>`)
    .replace('<html lang="ar" dir="rtl">', `<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">`)
    .replace(/<head>/, `<head>\n  <base href="${base}">
  <meta name="site-route" content="${page.path}">`)
    .replace(/<title>[^<]*<\/title>/, () => `<title>${esc(meta.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, () => `<meta name="description" content="${esc(meta.description)}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`)
    .replace(/<link rel="alternate" hreflang="ar" href="[^"]*">/, `<link rel="alternate" hreflang="ar" href="${pageUrl('ar', slug, key)}">`)
    .replace(/<link rel="alternate" hreflang="en" href="[^"]*">/, `<link rel="alternate" hreflang="en" href="${pageUrl('en', slug, key)}">`)
    .replace(/<link rel="alternate" hreflang="x-default" href="[^"]*">/, `<link rel="alternate" hreflang="x-default" href="${pageUrl('ar', slug, key)}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
  if (lang === 'en') {
    doc = doc.replace(/<meta property="og:locale" content="ar_SA">\s*<meta property="og:locale:alternate" content="en_US">/,
      '<meta property="og:locale" content="en_US">\n  <meta property="og:locale:alternate" content="ar_SA">');
  }
  if (slug || key !== 'home' || lang === 'en') {
    doc = doc
      .replace(/<meta property="og:title" content="[^"]*">/, () => `<meta property="og:title" content="${esc(meta.title)}">`)
      .replace(/<meta property="og:description" content="[^"]*">/, () => `<meta property="og:description" content="${esc(meta.description)}">`)
      .replace(/<meta name="twitter:title" content="[^"]*">/, () => `<meta name="twitter:title" content="${esc(meta.title)}">`)
      .replace(/<meta name="twitter:description" content="[^"]*">/, () => `<meta name="twitter:description" content="${esc(meta.description)}">`);
  }
  const trail = breadcrumbFor(lang, slug, key);
  let graph = null;
  if (slug) graph = buildProcedureJsonLd(slug, lang, url, SITE_URL, CONTENT[slug][lang].faq, trail);
  else if (key !== 'home') {
    const procedureUrls = PROCEDURES.map(p => ({ name: p.name[lang], url: pageUrl(lang, p.slug) }));
    graph = buildSectionJsonLd(key, lang, url, SITE_URL, meta, trail, { procedureUrls });
  }
  if (graph) {
    const ld = JSON.stringify(graph, null, 2).replace(/</g, '\\u003c');
    if (key !== 'about') doc = doc.replace(/<meta property="og:type" content="profile">/, '<meta property="og:type" content="article">');
    doc = doc.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, () => `<script type="application/ld+json">\n${ld}\n</script>`);
  }
  for (const must of [`<html lang="${lang}"`, `<link rel="canonical" href="${url}">`, `<base href="${base}">`]) {
    if (!doc.includes(must)) throw new Error(`${page.path || '/'}: missing ${must}`);
  }
  return doc;
}

try {
  const out = [];
  for (const page of PAGE_URLS) out.push([page, documentFor(page, await render(page))]);
  for (const [page, doc] of out) {
    const dir = path.join(dist, page.path);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), doc);
  }
  console.log(`prerender: ${out.length} pages → ${out.map(([p]) => '/' + p.path).join(' ')}`);
} finally {
  await browser.close();
  await new Promise(r => server.httpServer.close(r));
}
