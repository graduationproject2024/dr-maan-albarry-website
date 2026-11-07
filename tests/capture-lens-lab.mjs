// usage: node shot.mjs <outDir> <url-path> <width> <name> [fullPage=1] [action]
import { chromium } from '@playwright/test';
const [outDir, path, width, name, full = '1', action = ''] = process.argv.slice(2);
const gpu = process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : [];
const browser = await chromium.launch({ args: gpu });
const w = Number(width);
const page = await browser.newPage({ viewport: { width: w, height: w < 600 ? 844 : 900 }, deviceScaleFactor: 1 });
const errs = [];
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
page.on('pageerror', (e) => errs.push(e.message));
await page.goto(`http://localhost:4780/${path}`);
await page.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 30000 });
if (path.includes('lens-lab')) {
  await page.locator('[data-lens-lab-sim]').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => { const s = window.__llab.getState().sim; return s.status === 'ready' || s.status === 'failed'; }, null, { timeout: 30000 });
} else {
  await page.waitForFunction(() => ['ready', 'fallback'].includes(window.__vsim.getState().state), null, { timeout: 30000 });
}
if (action) await page.evaluate(action);
await page.waitForTimeout(600);
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: `${outDir}/${name}.jpg`, type: 'jpeg', quality: 75, fullPage: full === '1' });
const sw = await page.evaluate(() => document.documentElement.scrollWidth);
console.log(name, 'scrollWidth', sw, 'errors', JSON.stringify(errs));
await browser.close();
