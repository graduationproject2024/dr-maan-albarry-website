#!/usr/bin/env node
// Builds a review contact sheet (JPEG) of the procedure illustrations.
//   node scripts/illustrations/contact-sheet.mjs <imageDir> <out.jpg> [light|dark|both] [title]
// Each slug gets one tile (the 1600 px file scaled down); `both` puts light and dark side by side.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const SLUGS = ['cataract-surgery', 'laser-vision-correction', 'icl', 'keratoconus-cxl', 'corneal-transplant', 'intravitreal-injections', 'lens-implants'];
const [dir, out, mode = 'both', title = ''] = process.argv.slice(2);
if (!dir || !out) { console.error('usage: contact-sheet.mjs <imageDir> <out.jpg> [light|dark|both] [title]'); process.exit(1); }

const uri = (f) => `data:image/webp;base64,${fs.readFileSync(path.join(dir, f)).toString('base64')}`;
const variants = mode === 'both' ? ['', '-dark'] : [mode === 'dark' ? '-dark' : ''];
const tiles = SLUGS.flatMap((s) => variants.map((v) => `<figure><img src="${uri(`${s}${v}.webp`)}"><figcaption>${s}${v}</figcaption></figure>`)).join('');
const cols = mode === 'both' ? 4 : 3;
const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;padding:24px;background:#8a8f94;font:600 15px system-ui;color:#fff}
h1{margin:0 0 16px;font-size:20px}
main{display:grid;grid-template-columns:repeat(${cols},1fr);gap:14px}
figure{margin:0}img{width:100%;display:block;border-radius:6px}figcaption{padding:4px 2px}
</style><h1>${title}</h1><main>${tiles}</main>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: cols * 520, height: 800 } });
await page.setContent(html);
await page.waitForFunction(() => [...document.images].every((i) => i.complete));
fs.mkdirSync(path.dirname(out), { recursive: true });
await page.screenshot({ path: out, fullPage: true, type: 'jpeg', quality: 82 });
await browser.close();
console.log('wrote', out);
