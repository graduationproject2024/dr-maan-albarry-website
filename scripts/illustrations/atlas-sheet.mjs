#!/usr/bin/env node
// Review contact sheets for the anatomical atlas.
//   node scripts/illustrations/atlas-sheet.mjs <out.jpg> [slug|all] [--dark] [--dir <previewDir>] [--suffix .anchors.jpg]
// Default source: public/images/procedures/manifest.json (largest WebP per asset). `--dark` shows the transparent
// (alpha) masters composited on the series' dark surface instead of the neutral variant.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const argv = process.argv.slice(2);
const out = argv[0];
const filter = argv[1] && !argv[1].startsWith('--') ? argv[1] : 'all';
const dark = argv.includes('--dark');
const dirArg = argv.includes('--dir') ? argv[argv.indexOf('--dir') + 1] : null;
const suffix = argv.includes('--suffix') ? argv[argv.indexOf('--suffix') + 1] : '.jpg';
const tileH = argv.includes('--h') ? Number(argv[argv.indexOf('--h') + 1]) : 300;

let tiles = [];
if (dirArg) {
  tiles = fs.readdirSync(dirArg).filter((f) => f.endsWith(suffix) && (filter === 'all' || f.startsWith(filter)) && !(suffix === '.jpg' && f.endsWith('.anchors.jpg')))
    .sort().map((f) => ({ label: f.replace(suffix, ''), file: path.join(dirArg, f), mime: 'image/jpeg' }));
} else {
  const m = JSON.parse(fs.readFileSync(path.join(root, 'public/images/procedures/manifest.json'), 'utf8'));
  for (const a of m.assets) {
    if (filter !== 'all' && a.procedure !== filter) continue;
    const bg = dark ? 'transparent' : 'neutral';
    const f = a.files.filter((x) => x.format === 'webp' && x.background === bg).sort((p, q) => q.width - p.width)[0];
    tiles.push({ label: `${a.assetId}  (${a.level}, ${a.camera})`, file: path.join(root, 'public', f.file), mime: 'image/webp', level: a.level });
  }
}
const uri = (t) => `data:${t.mime};base64,${fs.readFileSync(t.file).toString('base64')}`;
const bg = dark ? '#16181C' : '#8a8f94';
const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;padding:24px;background:${dark ? '#0d0e10' : '#6f747a'};font:600 14px system-ui;color:#fff}
h1{margin:0 0 14px;font-size:19px}
main{display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start}
figure{margin:0;background:${bg};border-radius:6px;overflow:hidden}
figure img{display:block;height:${tileH}px}
figcaption{padding:5px 8px;font-size:12px}
</style><h1>Anatomical atlas: ${filter}${dark ? ' (transparent masters on dark)' : ''}</h1><main>${tiles.map((t) => `<figure><img src="${uri(t)}"><figcaption>${t.label}</figcaption></figure>`).join('')}</main>`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 2200, height: 900 } });
await page.setContent(html);
await page.waitForFunction(() => [...document.images].every((i) => i.complete));
fs.mkdirSync(path.dirname(out), { recursive: true });
await page.screenshot({ path: out, fullPage: true, type: 'jpeg', quality: 80 });
await browser.close();
console.log('wrote', out, tiles.length, 'tiles');
