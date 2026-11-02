// Design-review crops: one JPEG per <section>/<header>/<footer> of a page, for close inspection.
//   node tests/capture-sections-review.mjs <outDir> <path> <width> <lang-theme...>
// e.g. node tests/capture-sections-review.mjs out "" 1440 light dark
import { chromium } from '@playwright/test';
import { preview } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const [outDir, route = '', width = '1440', ...themes] = process.argv.slice(2);
const PORT = Number(process.env.CAPTURE_PORT || 4278);
const server = await preview({ preview: { port: PORT, strictPort: true }, logLevel: 'silent' });
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ args: process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : [] });
for (const theme of themes.length ? themes : ['light']) {
  const ctx = await browser.newContext({ viewport: { width: Number(width), height: 900 }, colorScheme: theme, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.addInitScript(t => { try { localStorage.setItem('theme', t); localStorage.removeItem('lang'); } catch (e) { /* ignore */ } }, theme);
  await page.goto(`http://localhost:${PORT}/${route}`, { waitUntil: 'load' });
  await page.addStyleTag({ content: '*{transition:none!important}.fade-in{opacity:1!important;transform:none!important}#site-header{position:relative!important}#booking-bar{visibility:hidden!important}' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  const n = await page.locator('#app > header, main section, main > article > header, main .proc-layout, #app > footer').count();
  for (let i = 0; i < n; i++) {
    const loc = page.locator('#app > header, main section, main > article > header, main .proc-layout, #app > footer').nth(i);
    const id = (await loc.getAttribute('id')) || (await loc.evaluate(e => e.className.split(' ')[0] || e.tagName.toLowerCase()));
    if ((await loc.boundingBox())?.height > 0) await loc.screenshot({ path: path.join(outDir, `${theme}-${width}-${String(i).padStart(2, '0')}-${id}.jpg`), type: 'jpeg', quality: 70 });
  }
  await ctx.close();
}
await browser.close();
await new Promise(r => server.httpServer.close(r));
console.log('done', outDir);
