// Evidence capture for the ICL illustration rebuild (before / after).
//   npm run build && npx vite preview --port 4751 --strictPort   (in another shell)
//   node docs/implementation/phase-2-final-closure/evidence/icl/capture.mjs before|after
// Chromium via @playwright/test, GPU through ANGLE (Windows), 1440 x 900 and 390 x 844, AR + EN, light + dark.
// Per combination: the procedure page's first screen, the L2 hero figure, the opened L3 close-up and the homepage
// gallery card. The ICL image files themselves are copied next to the screenshots.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const phase = process.argv[2];
if (!['before', 'after'].includes(phase)) throw new Error('usage: capture.mjs before|after');
const out = path.join(here, phase);
const root = path.resolve(here, '../../../../..');
const BASE = process.env.BASE || 'http://localhost:4751';
fs.mkdirSync(path.join(out, 'images'), { recursive: true });

// The ICL image files as shipped (L1 card, L2 hero, L3 close-up; 1024/800 px neutral WebP + transparent master).
const atlas = path.join(root, 'public/images/procedures/atlas');
for (const f of fs.readdirSync(atlas).filter((f) => f.startsWith('icl-') && /(-1024\.webp|-800\.webp|l2-hero-alpha-1600\.webp|anchors\.json)$/.test(f))) {
  fs.copyFileSync(path.join(atlas, f), path.join(out, 'images', f));
}

const args = process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : ['--use-gl=angle', '--ignore-gpu-blocklist'];
const browser = await chromium.launch({ args });
const shots = [];
for (const [w, h, mobile] of [[1440, 900, false], [390, 844, true]]) {
  for (const lang of ['ar', 'en']) {
    for (const theme of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce' });
      await ctx.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch (e) { /* none */ } }, theme);
      const page = await ctx.newPage();
      const tag = `${w}-${lang}-${theme}`;
      const pre = lang === 'en' ? '/en/' : '/';
      await page.goto(`${BASE}${pre}procedures/icl/`, { waitUntil: 'networkidle' });
      await page.locator('.proc-figure img').first().evaluate((img) => img.complete || new Promise((ok) => img.addEventListener('load', ok, { once: true })));
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(out, `page-${tag}.jpg`), type: 'jpeg', quality: 84 });
      const fig = page.locator('.proc-figure').first();
      await fig.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await fig.screenshot({ path: path.join(out, `hero-figure-${tag}.jpg`), type: 'jpeg', quality: 84 });
      const toggle = fig.locator('.labels-toggle');
      if (await toggle.count()) {
        await toggle.click();
        await page.waitForTimeout(250);
        await fig.screenshot({ path: path.join(out, `hero-figure-all-labels-${tag}.jpg`), type: 'jpeg', quality: 84 });
      }
      const detail = page.locator('.anat-detail').first();
      if (await detail.count()) {
        await detail.locator('summary').click();
        const img = detail.locator('img').first();
        await img.scrollIntoViewIfNeeded();
        await img.evaluate((i) => i.complete || new Promise((ok) => i.addEventListener('load', ok, { once: true })));
        await page.waitForTimeout(250);
        await detail.screenshot({ path: path.join(out, `closeup-${tag}.jpg`), type: 'jpeg', quality: 84 });
      }
      await page.goto(`${BASE}${pre}`, { waitUntil: 'networkidle' });
      const card = page.locator('.pgal-item[data-slug="icl"]').first();
      if (await card.count()) {
        await card.scrollIntoViewIfNeeded();
        await card.locator('img').first().evaluate((i) => i.complete || new Promise((ok) => i.addEventListener('load', ok, { once: true })));
        await page.waitForTimeout(400);
        await card.screenshot({ path: path.join(out, `home-card-${tag}.jpg`), type: 'jpeg', quality: 84 });
      }
      shots.push(tag);
      await ctx.close();
    }
  }
}
await browser.close();
console.log(`${phase}: ${shots.length} combinations ->`, path.relative(root, out));
