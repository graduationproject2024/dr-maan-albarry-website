// Before/after evidence: one screenshot per page section (plus header/footer)
// at fixed viewports, both languages, both themes.
// Usage: node tests/capture-sections.mjs <outDir> [baseUrl]
// Without baseUrl it serves the current dist/ itself (vite preview on :4175).
import { chromium } from '@playwright/test';
import { preview } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const outDir = process.argv[2];
const server = process.argv[3] ? null : await preview({ preview: { port: 4175, strictPort: true }, logLevel: 'silent' });
const base = process.argv[3] || 'http://localhost:4175/';
fs.mkdirSync(outDir, { recursive: true });

const viewports = [['390', 390, 844], ['1440', 1440, 900]];
const combos = [['ar', 'light'], ['en', 'dark'], ['ar', 'dark'], ['en', 'light']];

const browser = await chromium.launch({ args: process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : [] });
const summary = [];
for (const [name, w, h] of viewports) {
  for (const [lang, theme] of combos) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: theme, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.addInitScript(([t, l]) => { try { localStorage.setItem('theme', t); localStorage.setItem('lang', l); } catch (e) {} }, [theme, lang]);
    await page.goto(base, { waitUntil: 'load' });
    if ((await page.locator('html').getAttribute('lang')) !== lang) await page.evaluate(() => window.toggleLang());
    // reveal every fade-in element so screenshots show final layout
    await page.addStyleTag({ content: '*{transition:none!important;animation-duration:0s!important}.fade-in,.reveal{opacity:1!important;transform:none!important}' });
    // section shots: keep the sticky header and fixed booking bar from overlapping other sections
    const pin = await page.addStyleTag({ content: '#site-header{position:relative!important}#booking-bar{visibility:hidden!important}' });
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);
    const dir = path.join(outDir, `${name}-${lang}-${theme}`);
    fs.mkdirSync(dir, { recursive: true });
    const targets = await page.evaluate(() => {
      const els = [document.querySelector('header'), ...document.querySelectorAll('main section[id], #app section[id]'), document.querySelector('footer')];
      const seen = new Set();
      return els.filter(e => e && !seen.has(e) && seen.add(e)).map((e, i) => ({ i, key: e.id || e.tagName.toLowerCase(), sel: e.id ? `#${e.id}` : e.tagName.toLowerCase() }));
    });
    let i = 0;
    for (const t of targets) {
      const loc = page.locator(t.sel).first();
      const file = path.join(dir, `${String(i++).padStart(2, '0')}-${t.key}.png`);
      try { await loc.screenshot({ path: file, animations: 'disabled' }); } catch (e) { summary.push(`FAIL ${name}-${lang}-${theme} ${t.key}: ${e.message.split('\n')[0]}`); }
    }
    await pin.evaluate(n => n.remove());
    await page.screenshot({ path: path.join(dir, 'full.png'), fullPage: true });
    summary.push(`${name}-${lang}-${theme}: ${targets.map(t => t.key).join(', ')} | pageH=${await page.evaluate(() => document.documentElement.scrollHeight)}`);
    await ctx.close();
  }
}
await browser.close();
if (server) await new Promise(r => server.httpServer.close(r));
fs.writeFileSync(path.join(outDir, 'sections.txt'), summary.join('\n') + '\n');
console.log(summary.join('\n'));
