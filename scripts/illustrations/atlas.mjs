#!/usr/bin/env node
// Renders the anatomical atlas image library (L1 cards, L2 heroes, L3 close-ups) and writes the asset manifest.
//   node scripts/illustrations/atlas.mjs                       all shots -> public/images/procedures/atlas/ + manifest.json
//   node scripts/illustrations/atlas.mjs <id|slug> ...         selected shots (the manifest is merged, not replaced)
//   PREVIEW_DIR=<dir> node scripts/illustrations/atlas.mjs ... also writes review JPEGs (neutral, alpha-on-dark, anchors)
//   DRY=1 ...                                                  previews only, nothing written to public/
// Headless Playwright Chromium renders (WebGL via ANGLE) and encodes (canvas.toDataURL WebP / JPEG); no new dependency.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const require = createRequire(import.meta.url);
const threeDir = path.resolve(path.dirname(require.resolve('three')), '..');
const outDir = path.join(root, 'public/images/procedures/atlas');
const manifestPath = path.join(root, 'public/images/procedures/manifest.json');
const PORT = Number(process.env.ILLU_PORT || 4574);
const DRY = !!process.env.DRY;
const previewDir = process.env.PREVIEW_DIR;

// Size budgets (bytes) for the alpha WebP at a given width; the neutral WebP gets the same budget.
const KB = 1024;
const BUDGET = {
  L1: { default: 120 * KB },
  L2: { 2400: 420 * KB, 1600: 250 * KB, default: 250 * KB },
  L3: { default: 150 * KB }
};
const JPEG_WIDTHS = { L1: [800], L2: [1024, 1600], L3: [1024] };

const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const isThree = url.startsWith('/node_modules/three/');
  const base = isThree ? threeDir : here;
  const file = isThree ? path.join(threeDir, url.slice('/node_modules/three/'.length)) : path.join(here, url === '/' ? 'atlas.html' : url);
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

const all = await page.evaluate(() => window.SHOTS);
const args = process.argv.slice(2);
const shots = args.length ? all.filter((s) => args.includes(s.id) || args.includes(s.slug) || args.includes(s.level)) : all;
if (!DRY) fs.mkdirSync(outDir, { recursive: true });
if (previewDir) fs.mkdirSync(previewDir, { recursive: true });

const bytesOf = (url) => Math.round((url.length - url.indexOf(',') - 1) * 3 / 4);
const save = (file, url) => { const buf = Buffer.from(url.split(',')[1], 'base64'); fs.writeFileSync(file, buf); return buf.length; };
async function fit(bg, w, type, budget, q0 = 0.9) {
  let q = q0, url, blur = 0, aq = 4;
  for (;;) {
    url = await page.evaluate(([b, ww, t, qq, bl, a]) => window.encode(b, ww, t, qq, bl, a), [bg, w, type, q, blur, aq]);
    if (bytesOf(url) <= budget) break;
    if (q <= 0.6) { // quality floor: coarser alpha steps first, then a sub-pixel softening of fine texture
      if (bg === 'alpha' && aq < 8) { aq = 8; q = 0.8; continue; }
      if (blur >= 0.8) break;
      blur = Math.round((blur + 0.4) * 10) / 10; q = 0.8; continue;
    }
    q = Math.round((q - 0.04) * 100) / 100;
  }
  return { url, q, blur, aq };
}

const results = {};
for (const s of shots) {
  const t0 = Date.now();
  const r = await page.evaluate((id) => window.renderShot(id), s.id);
  const files = [];
  const budgetOf = (w) => BUDGET[s.level][w] ?? BUDGET[s.level].default;
  for (const w of s.sizes) {
    const h = Math.round(w * s.H / s.W);
    for (const bg of ['alpha', 'neutral']) {
      const { url, q, blur, aq } = await fit(bg, w, 'image/webp', budgetOf(w));
      if (!url.startsWith('data:image/webp')) throw new Error('browser did not produce WebP');
      const name = `${s.id}-${bg}-${w}.webp`;
      const bytes = DRY ? bytesOf(url) : save(path.join(outDir, name), url);
      files.push({ file: `images/procedures/atlas/${name}`, background: bg === 'alpha' ? 'transparent' : 'neutral', format: 'webp', width: w, height: h, bytes, quality: q, ...(bg === 'alpha' ? { alphaStep: aq } : {}), ...(blur ? { softenPx: blur } : {}) });
      if (bytes > budgetOf(w)) console.warn(`  ! ${name} ${(bytes / KB).toFixed(1)} KB over budget`);
    }
  }
  for (const w of JPEG_WIDTHS[s.level].filter((x) => x <= s.W)) {
    const h = Math.round(w * s.H / s.W);
    const { url, q } = await fit('neutral', w, 'image/jpeg', Math.round(budgetOf(w) * 1.5), 0.86);
    const name = `${s.id}-neutral-${w}.jpg`;
    const bytes = DRY ? bytesOf(url) : save(path.join(outDir, name), url);
    files.push({ file: `images/procedures/atlas/${name}`, background: 'neutral', format: 'jpeg', width: w, height: h, bytes, quality: q });
  }
  if (!DRY) fs.writeFileSync(path.join(outDir, `${s.id}.anchors.json`), JSON.stringify({ assetId: s.id, frame: { width: s.W, height: s.H }, coordinates: 'normalised x (0 = left, 1 = right), y (0 = top, 1 = bottom) in the image frame; identical for every size and background', anchors: r.anchors }, null, 2) + '\n');
  if (previewDir) {
    const pw = Math.min(1600, s.W);
    save(path.join(previewDir, `${s.id}.jpg`), await page.evaluate((w) => window.encode('neutral', w, 'image/jpeg', 0.9), pw));
    save(path.join(previewDir, `${s.id}.anchors.jpg`), await page.evaluate(([a, w]) => window.debugAnchors(a, w), [r.anchors, pw]));
    fs.writeFileSync(path.join(previewDir, `${s.id}.alpha.webp`), Buffer.from((await page.evaluate((w) => window.encode('alpha', w, 'image/webp', 0.92), pw)).split(',')[1], 'base64'));
  }
  results[s.id] = { files, anchors: r.anchors, camera: r.camera, coverage: r.coverage };
  const sum = files.filter((f) => f.format === 'webp' && f.background === 'transparent').map((f) => `${f.width}:${(f.bytes / KB).toFixed(0)}K`).join(' ');
  console.log(`${s.id}  [${s.level}]  ${((Date.now() - t0) / 1000).toFixed(1)} s  cover ${r.coverage}  alpha ${sum}`);
}
await browser.close();
server.close();

if (!DRY) {
  const { buildManifest } = await import(pathToFileURL(path.join(here, 'atlas-manifest.mjs')).href);
  const prev = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : null;
  const manifest = buildManifest(all, results, prev);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log('wrote', path.relative(root, manifestPath), `(${manifest.assets.length} assets)`);
}
