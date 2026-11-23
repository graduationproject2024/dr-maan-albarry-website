// Evidence screenshots of a procedure simulator: every technique and stage, plus Arabic and phone views.
//   node scripts/sim-shots.mjs <base-url> <slug> <out-dir> [--quick]
// The page must serve the site (vite dev or preview). Screens are JPEG (quality 80) of the simulator card only.
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const [base = 'http://localhost:5173', slug = 'lens-implants', out = 'shots', flag] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const gpu = process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : [];
const browser = await chromium.launch({ args: gpu });
const errors = [];

async function session({ lang, width, height, theme = 'light' }) {
  const page = await browser.newPage({ viewport: { width, height } });
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch { /* ignore */ } }, theme);
  await page.goto(`${base}/${lang === 'en' ? 'en/' : ''}procedures/${slug}/`);
  await page.locator('#procedure-3d-start').click();
  try { await page.waitForFunction(() => window.__procedureSim && window.__procedureSim.getState().state === 'ready', null, { timeout: 45000 }); }
  catch (e) { console.log(JSON.stringify({ errors, sec: await page.evaluate(() => document.getElementById('procedure-3d')?.dataset.state), st: await page.evaluate(() => window.__procedureSim && window.__procedureSim.getState().state) })); throw e; }
  await page.locator('.ssim').scrollIntoViewIfNeeded();
  return page;
}
const shot = (page, name) => page.locator('.ssim').screenshot({ path: join(out, `${name}.jpg`), type: 'jpeg', quality: 80 });

const page = await session({ lang: 'en', width: 1366, height: 900 });
const variants = await page.evaluate(() => [...document.querySelectorAll('[data-variant]')].map((b) => b.dataset.variant));
for (const v of variants.length ? variants : [null]) {
  if (v) await page.evaluate((id) => window.__procedureSim.setVariant(id), v);
  const n = await page.evaluate(() => window.__procedureSim.getState().stageCount);
  for (let i = 0; i < n; i++) {
    if (flag === '--quick' && i % 2) continue;
    await page.evaluate((k) => window.__procedureSim.setStage(k), i);
    await page.waitForTimeout(1300);
    await shot(page, `${v ? v + '-' : ''}${String(i + 1).padStart(2, '0')}-${await page.evaluate(() => window.__procedureSim.getState().stageId)}-en`);
  }
}
await page.close();
const ar = await session({ lang: 'ar', width: 1366, height: 900, theme: 'dark' });
await ar.evaluate(() => window.__procedureSim.setStage(1));
await ar.waitForTimeout(1300);
await shot(ar, 'ar-dark-stage-2');
await ar.close();
const phone = await session({ lang: 'en', width: 390, height: 844 });
await phone.evaluate(() => window.__procedureSim.setStage(2));
await phone.waitForTimeout(1300);
await phone.screenshot({ path: join(out, 'phone-390-stage-3.jpg'), type: 'jpeg', quality: 80 });
await phone.close();
await browser.close();
console.log(JSON.stringify({ slug, errors }));
