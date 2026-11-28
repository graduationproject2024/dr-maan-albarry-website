// Lens Lab evidence screenshots (public /lens-lab/ page, production build).
// usage: node scripts/lens-lab-shots.mjs <outDir> [port=4721] [filter]
// Drives the page through its shareable URL (?lens=&dist=&light=), the same path a visitor's link takes.
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const [outDir, port = '4721', filter = ''] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const gpu = ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'];
const VIEW = { d: [1440, 900], m: [390, 844], l: [844, 390] };

// [name, viewport, lang, theme, lens, dist, light, extra]
const SHOTS = [];
const lenses = ['monofocal', 'enhanced', 'edof', 'trifocal', 'toric'];
for (const l of lenses) SHOTS.push([`d-en-light-${l}-far-day`, 'd', 'en', 'light', l, 'far', 'day']);
for (const l of ['monofocal', 'edof', 'trifocal']) for (const d of ['near', 'intermediate']) SHOTS.push([`d-en-light-${l}-${d}-day`, 'd', 'en', 'light', l, d, 'day']);
for (const l of ['monofocal', 'trifocal', 'edof']) SHOTS.push([`d-en-dark-${l}-far-night`, 'd', 'en', 'dark', l, 'far', 'night']);
SHOTS.push(['d-ar-light-trifocal-near-day', 'd', 'ar', 'light', 'trifocal', 'near', 'day']);
SHOTS.push(['d-ar-dark-enhanced-intermediate-dim', 'd', 'ar', 'dark', 'enhanced', 'intermediate', 'dim']);
SHOTS.push(['d-ar-light-toric-far-day', 'd', 'ar', 'light', 'edof-toric', 'far', 'day']);
SHOTS.push(['d-en-light-lab-compare', 'd', 'en', 'light', 'monofocal', 'far', 'day', 'lab']);
SHOTS.push(['d-ar-dark-lab-compare', 'd', 'ar', 'dark', 'monofocal', 'far', 'day', 'lab']);
for (const l of lenses) SHOTS.push([`m-en-light-${l}-near-day`, 'm', 'en', 'light', l, 'near', 'day']);
SHOTS.push(['m-ar-light-monofocal-far-day', 'm', 'ar', 'light', 'monofocal', 'far', 'day']);
SHOTS.push(['m-ar-dark-trifocal-far-night', 'm', 'ar', 'dark', 'trifocal', 'far', 'night']);
SHOTS.push(['m-en-dark-edof-intermediate-day', 'm', 'en', 'dark', 'edof', 'intermediate', 'day']);
SHOTS.push(['m-ar-light-edof-intermediate-dim', 'm', 'ar', 'light', 'edof', 'intermediate', 'dim']);
SHOTS.push(['m-en-light-monofocal-far-night', 'm', 'en', 'light', 'monofocal', 'far', 'night']);
SHOTS.push(['m-en-light-more-settings', 'm', 'en', 'light', 'enhanced', 'far', 'day', 'more']);
SHOTS.push(['l-en-light-trifocal-near-day', 'l', 'en', 'light', 'trifocal', 'near', 'day']);
SHOTS.push(['l-ar-dark-monofocal-far-night', 'l', 'ar', 'dark', 'monofocal', 'far', 'night']);
SHOTS.push(['l-en-light-edof-intermediate-day', 'l', 'en', 'light', 'edof', 'intermediate', 'day']);
SHOTS.push(['l-ar-light-enhanced-far-day', 'l', 'ar', 'light', 'enhanced', 'far', 'day']);

const browser = await chromium.launch({ args: gpu });
const results = [];
for (const [name, v, lang, theme, lens, dist, light, extra] of SHOTS) {
  if (filter && !name.includes(filter)) continue;
  const [w, h] = VIEW[v];
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: v === 'd' ? 1 : 2, hasTouch: v !== 'd', isMobile: v !== 'd', colorScheme: theme });
  await ctx.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch { /* ignore */ } }, theme);
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(e.message));
  const q = new URLSearchParams({ lens, dist, light }).toString();
  await page.goto(`http://localhost:${port}${lang === 'en' ? '/en' : ''}/lens-lab/?${q}`);
  await page.locator('main h1').waitFor();
  const H = '#simulator-host';
  await page.locator(H).scrollIntoViewIfNeeded();
  await page.waitForFunction((host) => document.querySelector(`${host} canvas, ${host} .vsim--fallback, ${host} .vsim-load-error`) && !document.querySelector(`${host} .vsim-loading:not([hidden])`), H, { timeout: 45_000 }).catch(() => {});
  if (extra === 'lab') {
    await page.locator('#lab').scrollIntoViewIfNeeded();
    await page.locator('#lens-lab-host [data-lens-lab-sim]').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('#lens-lab-host .llab')?.dataset.sim === 'ready' || document.querySelector('#lens-lab-host .llab')?.dataset.sim === 'failed', null, { timeout: 30_000 }).catch(() => {});
    await page.waitForTimeout(900);
    await page.evaluate(() => { const s = document.querySelector('#lens-lab-host .llab-sim'); const hh = document.getElementById('site-header').offsetHeight; window.scrollTo(0, s.getBoundingClientRect().top + scrollY - hh - 8); });
  } else {
    if (extra === 'more') await page.locator(`${H} .vsim-more`).click();
    await page.evaluate((host) => {
      const b = document.querySelector(`${host} .vsim-bench`) || document.querySelector(host);
      const hh = document.getElementById('site-header').offsetHeight;
      window.scrollTo(0, b.getBoundingClientRect().top + window.scrollY - hh);
    }, H);
  }
  await page.waitForTimeout(1100);
  await page.screenshot({ path: `${outDir}/${name}.jpg`, type: 'jpeg', quality: 70 });
  results.push(`${name} errors=${errs.length}${errs.length ? ' ' + JSON.stringify(errs.slice(0, 2)) : ''}`);
  await ctx.close();
}
await browser.close();
console.log(results.join('\n'));
