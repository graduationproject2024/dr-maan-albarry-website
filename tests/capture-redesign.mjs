// Visual QA capture for the clinical visual reconstruction.
// Serves the current dist/ and writes JPEG screenshots (quality 82).
//   node tests/capture-redesign.mjs <outDir> [mode]
//   mode = "baseline" (home only, language switched in-page) | "redesign" (home + procedure pages by URL)
//   CAPTURE_PORT overrides the preview port (default 4277).
import { chromium } from '@playwright/test';
import { preview } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const outDir = process.argv[2];
const mode = process.argv[3] || 'redesign';
const PORT = Number(process.env.CAPTURE_PORT || 4277);
const server = await preview({ preview: { port: PORT, strictPort: true }, logLevel: 'silent' });
const base = `http://localhost:${PORT}/`;
fs.mkdirSync(outDir, { recursive: true });

const viewports = [['390', 390, 844], ['1440', 1440, 900]];
const combos = [['ar', 'light'], ['ar', 'dark'], ['en', 'light'], ['en', 'dark']];
const PROC_SHOTS = (process.env.CAPTURE_PROCS || 'cataract-surgery,keratoconus-cxl').split(',').filter(Boolean);

const browser = await chromium.launch({ args: process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : [] });
const written = [];

async function settle(page) {
  await page.addStyleTag({ content: '*{transition:none!important;animation-duration:0s!important}.fade-in,.reveal{opacity:1!important;transform:none!important}' });
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 25)); }
    window.scrollTo(0, 0);
  });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(400);
}

async function shoot(page, name, full) {
  const file = path.join(outDir, `${name}.jpg`);
  await page.screenshot({ path: file, type: 'jpeg', quality: 82, fullPage: full });
  written.push(file);
}

for (const [vp, w, h] of viewports) {
  for (const [lang, theme] of combos) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: theme, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.addInitScript(([t]) => { try { localStorage.setItem('theme', t); localStorage.removeItem('lang'); } catch (e) { /* ignore */ } }, [theme]);
    const home = mode === 'baseline' ? base : (lang === 'en' ? `${base}en/` : base);
    await page.goto(home, { waitUntil: 'load' });
    if (mode === 'baseline' && lang === 'en') await page.evaluate(() => window.toggleLang());
    await settle(page);
    await shoot(page, `home-${vp}-${lang}-${theme}-top`, false);
    if (mode === 'baseline' ? theme === 'light' : true) await shoot(page, `home-${vp}-${lang}-${theme}-full`, true);
    if (mode === 'redesign') {
      for (const slug of PROC_SHOTS) {
        await page.goto(`${base}${lang === 'en' ? 'en/' : ''}procedures/${slug}/`, { waitUntil: 'load' });
        await settle(page);
        await shoot(page, `proc-${slug}-${vp}-${lang}-${theme}-top`, false);
        if (theme === 'light' || vp === '390') await shoot(page, `proc-${slug}-${vp}-${lang}-${theme}-full`, true);
      }
    }
    await ctx.close();
  }
}
await browser.close();
await new Promise(r => server.httpServer.close(r));
const total = written.reduce((s, f) => s + fs.statSync(f).size, 0);
console.log(`${written.length} screenshots, ${(total / 1048576).toFixed(1)} MB → ${outDir}`);
