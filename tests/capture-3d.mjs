// Evidence: the 3D cataract simulator running inside the real page.
// Usage: node tests/capture-3d.mjs <outDir>   (serves dist/ itself on :4178)
import { chromium } from '@playwright/test';
import { preview } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const outDir = process.argv[2];
fs.mkdirSync(outDir, { recursive: true });
const server = await preview({ preview: { port: 4178, strictPort: true }, logLevel: 'silent' });
const browser = await chromium.launch({ args: process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : [] });
for (const [w, h] of [[390, 844], [1440, 900]]) {
  for (const [lang, theme] of [['en', 'light'], ['ar', 'dark']]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.addInitScript(([l, t]) => { localStorage.setItem('lang', l); localStorage.setItem('theme', t); }, [lang, theme]);
    await page.goto('http://localhost:4178/');
    await page.locator('#cataract-3d-start').click();
    await page.locator('#cataract-3d[data-state="active"]').waitFor({ timeout: 20_000 });
    await page.waitForTimeout(800);
    await page.locator('#cataract-3d').screenshot({ path: path.join(outDir, `c3d-${w}-${lang}-${theme}.png`) });
    await page.close();
  }
}
await browser.close();
await new Promise(r => server.httpServer.close(r));
console.log('captured', fs.readdirSync(outDir).filter(f => f.startsWith('c3d-')).join(', '));
