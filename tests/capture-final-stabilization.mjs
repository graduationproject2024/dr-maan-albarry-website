// Evidence capture for the final stabilization milestone. Run against a running preview of the production build:
//   PW_PORT=4174 node tests/capture-final-stabilization.mjs before|after
// Writes JPEG screenshots to docs/implementation/final-stabilization-phase-2-3-readiness/evidence/<phase>/ and
// evidence/lens-lab/, and prints the measurements as JSON.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const port = Number(process.env.PW_PORT || 4174);
const phase = process.argv[2] === 'after' ? 'after' : 'before';
const ROOT = 'docs/implementation/final-stabilization-phase-2-3-readiness/evidence';
const OUT = path.join(ROOT, phase);
const LL = path.join(ROOT, 'lens-lab');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(LL, { recursive: true });
const args = process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : [];
const browser = await chromium.launch({ args });
const base = `http://127.0.0.1:${port}/`;
const report = { phase, pages: [], lensLab: [] };

// 1. key pages, phone and desktop
for (const [name, url] of [['home-ar', ''], ['home-en', 'en/'], ['cataract-ar', 'procedures/cataract-surgery/'], ['lens-lab-ar', 'lens-lab/']]) {
  for (const [w, h, tag] of [[390, 844, 'phone'], [1440, 900, 'desktop']]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: tag === 'phone' ? 2 : 1, isMobile: tag === 'phone', hasTouch: tag === 'phone', reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(base + url);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(OUT, `${name}-${tag}.jpg`), type: 'jpeg', quality: 80 });
    report.pages.push({ name, tag, errors, overflowX: await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) });
    await ctx.close();
  }
}

// 2. Lens Lab: each distance preset, with the picture hashed so "did the picture change" is a fact, not an opinion
for (const [w, h] of [[390, 844], [320, 640], [844, 390]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(`${base}en/lens-lab/`);
  await page.locator('#simulator-host').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('#simulator-host canvas'), null, { timeout: 45000 });
  await page.waitForTimeout(900);
  await page.evaluate(() => {
    const top = document.querySelector('#simulator-host .vsim-stage').getBoundingClientRect().top;
    window.scrollBy(0, top - document.getElementById('site-header').offsetHeight);
  });
  await page.waitForTimeout(400);
  for (const preset of ['distance', 'intermediate', 'near']) {
    const y0 = await page.evaluate(() => scrollY);
    await page.evaluate((p) => document.querySelector(`#simulator-host input[data-group="preset"][value="${p}"]`).click(), preset);
    await page.waitForTimeout(900);
    const shot = await page.locator('#simulator-host .vsim-viewport').screenshot({ type: 'png' });
    let hash = 0;
    for (let i = 0; i < shot.length; i += 7) hash = (hash * 31 + shot[i]) >>> 0;
    const m = await page.evaluate(() => ({
      caption: document.querySelector('#simulator-host .vsim-caption')?.textContent || '',
      canvases: document.querySelectorAll('canvas').length,
      y: scrollY,
    }));
    report.lensLab.push({ size: `${w}x${h}`, preset, viewerHash: hash, scrollMoved: m.y - y0, canvases: m.canvases, caption: m.caption });
    await page.screenshot({ path: path.join(LL, `${phase}-${w}x${h}-${preset}.jpg`), type: 'jpeg', quality: 82 });
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'capture.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));
