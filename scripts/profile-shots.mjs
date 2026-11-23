// Evidence screenshots for docs/implementation/clinical-profile-expansion-and-ux-refinement/evidence/.
// Run against a production preview: node scripts/profile-shots.mjs http://127.0.0.1:4174
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const BASE = (process.argv[2] || 'http://127.0.0.1:4174').replace(/\/$/, '');
const OUT = path.resolve('docs/implementation/clinical-profile-expansion-and-ux-refinement/evidence');
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ args: process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : [] });
const shots = [
  ['01-home-hero-1440-ar', '/', 1440, 900, null],
  ['02-home-gallery-1440-ar', '/', 1440, 900, '#procedures'],
  ['03-home-hero-390-en', '/en/', 390, 844, null],
  ['04-home-gallery-390-en', '/en/', 390, 844, '#procedures'],
  ['05-about-timeline-1440-en', '/en/about/', 1440, 900, '#record'],
  ['06-about-innovation-1440-ar', '/about/', 1440, 900, '#innovation'],
  ['07-about-devices-1440-en', '/en/about/', 1440, 900, '#diagnostics'],
  ['08-about-publications-1440-en', '/en/about/', 1440, 900, '#publications'],
  ['09-lens-lab-ocular-surface-1440-ar', '/lens-lab/', 1440, 900, '#ocular-surface'],
  ['10-lens-lab-simulator-1440-en', '/en/lens-lab/', 1440, 900, '#simulator'],
  ['11-light-journey-1440-en', '/en/how-vision-works/', 1440, 900, '.lj'],
  ['12-lens-implants-os-note-390-ar', '/procedures/lens-implants/', 390, 844, '.os-note'],
];
for (const [name, url, w, h, sel] of shots) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE + url, { waitUntil: 'load' });
  if (sel) { await page.locator(sel).first().scrollIntoViewIfNeeded(); await page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'start' }), sel); }
  await page.waitForTimeout(2500);
  await page.evaluate(() => document.querySelectorAll('.fade-in').forEach((e) => e.classList.add('visible')));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, `${name}.jpg`), type: 'jpeg', quality: 72 });
  await ctx.close();
}
// simulators: details on, Before / After
for (const [name, slug, variant] of [['13-icl-details-after', 'icl', null], ['14-cxl-after', 'keratoconus-cxl', 'cxl'], ['15-injection-after', 'intravitreal-injections', null]]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/en/procedures/${slug}/`);
  await page.locator('#procedure-3d-start').click();
  await page.waitForFunction(() => window.__procedureSim && window.__procedureSim.getState().state === 'ready', null, { timeout: 30000 });
  if (variant) await page.locator(`[data-variant="${variant}"]`).click();
  await page.locator('.ssim-details').click();
  await page.locator('.ssim-ba-btn[data-value="after"]').click();
  await page.waitForTimeout(1800);
  await page.locator('#procedure-3d-stage').screenshot({ path: path.join(OUT, `${name}.jpg`), type: 'jpeg', quality: 72 });
  await ctx.close();
}
await browser.close();
console.log('ok', fs.readdirSync(OUT).length);
