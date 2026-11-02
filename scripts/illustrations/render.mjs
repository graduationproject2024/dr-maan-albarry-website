#!/usr/bin/env node
// Renders the procedure-library illustrations to public/images/procedures/*.webp.
//   node scripts/illustrations/render.mjs                 (all slugs)
//   node scripts/illustrations/render.mjs icl lens-implants   (selected slugs)
//   PREVIEW_DIR=some/dir node scripts/illustrations/render.mjs  (also writes PNG previews there)
// A tiny static server on 127.0.0.1:4573 (override with ILLU_PORT) serves this folder plus the
// installed `three` package; headless Playwright Chromium does the WebGL render and WebP encoding.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const require = createRequire(import.meta.url);
const threeDir = path.resolve(path.dirname(require.resolve('three')), '..'); // node_modules/three
const outDir = path.join(root, 'public/images/procedures');
const PORT = Number(process.env.ILLU_PORT || 4573);
const MAX_BYTES = 180 * 1024;

const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let file;
  if (url.startsWith('/node_modules/three/')) file = path.join(threeDir, url.slice('/node_modules/three/'.length));
  else file = path.join(here, url === '/' ? 'index.html' : url);
  const base = url.startsWith('/node_modules/three/') ? threeDir : here;
  if (!path.resolve(file).startsWith(base) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((ok) => server.listen(PORT, '127.0.0.1', ok));

const launchArgs = process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : ['--use-gl=angle', '--ignore-gpu-blocklist'];
const browser = await chromium.launch({ args: launchArgs });
const page = await browser.newPage({ viewport: { width: 900, height: 600 } });
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('[page]', m.text()); });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.goto(`http://127.0.0.1:${PORT}/`);
await page.waitForFunction(() => window.READY === true, null, { timeout: 60000 });

const all = await page.evaluate(() => window.SLUGS);
const slugs = process.argv.slice(2).length ? process.argv.slice(2) : all;
fs.mkdirSync(outDir, { recursive: true });
const previewDir = process.env.PREVIEW_DIR;
if (previewDir) fs.mkdirSync(previewDir, { recursive: true });

const save = (file, dataUrl) => { const buf = Buffer.from(dataUrl.split(',')[1], 'base64'); fs.writeFileSync(file, buf); return buf.length; };
for (const slug of slugs) {
  if (!all.includes(slug)) { console.error(`unknown slug ${slug}`); continue; }
  const t0 = Date.now();
  await page.evaluate((s) => window.renderSlug(s), slug);
  for (const [variant, suffix] of [['light', ''], ['dark', '-dark'], ['light-800', '-800'], ['dark-800', '-dark-800']]) {
    let q = 0.9, url, bytes;
    for (;;) { // highest quality that fits the size budget
      url = await page.evaluate(([n, qq]) => window.encode(n, qq), [variant, q]);
      bytes = Math.round((url.length - url.indexOf(',') - 1) * 3 / 4);
      if (bytes <= MAX_BYTES || q <= 0.5) break;
      q = Math.round((q - 0.04) * 100) / 100;
    }
    if (!url.startsWith('data:image/webp')) throw new Error('browser did not produce WebP');
    const size = save(path.join(outDir, `${slug}${suffix}.webp`), url);
    console.log(`${slug}${suffix}.webp  ${(size / 1024).toFixed(1)} KB  q=${q}`);
    if (previewDir) save(path.join(previewDir, `${slug}${suffix}.jpg`), await page.evaluate((n) => window.encode(n, 0.9, 'image/jpeg'), variant));
  }
  console.log(`  rendered in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}
await browser.close();
server.close();
