// Light Journey evidence screenshots (phase-2 final closure, 2026-11-24).
// Usage: npm run build, then `npx vite preview --port 4681 --strictPort`, then
//   node scripts/light-journey-shots.mjs <before|after>
// Saves JPEGs (quality 70) to docs/implementation/phase-2-final-closure/evidence/light-journey/<phase>/.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const phase = process.argv[2] || 'after';
const BASE = process.env.SHOT_BASE || 'http://localhost:4681';
const out = path.join('docs/implementation/phase-2-final-closure/evidence/light-journey', phase);
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] });
const shots = [];
for (const width of [1440, 390]) {
  for (const lang of ['ar', 'en']) {
    for (const theme of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width, height: width > 800 ? 900 : 844 }, deviceScaleFactor: width > 800 ? 1 : 2, colorScheme: theme });
      await ctx.addInitScript(([l, t]) => { try { localStorage.setItem('lang', l); localStorage.setItem('theme', t); } catch (e) { /* ignore */ } }, [lang, theme]);
      const page = await ctx.newPage();
      const tag = `${width}-${lang}-${theme}`;
      // the module page
      await page.goto(`${BASE}/${lang === 'en' ? 'en/' : ''}how-vision-works/`, { waitUntil: 'load' });
      const lj = page.locator('.lj');
      await page.locator('#light-journey-host').scrollIntoViewIfNeeded();
      await lj.waitFor({ timeout: 20000 });
      await page.waitForTimeout(400);
      for (const [step, name] of [[2, 'cornea'], [5, 'lens'], [7, 'retina'], [8, 'brain']]) {
        await page.locator(`.lj-stop[data-step="${step}"]`).click(); // pauses and selects the step
        await page.waitForTimeout(1400);
        const file = path.join(out, `${tag}-figure-${step + 1}-${name}.jpg`);
        await page.locator('.lj-figure').screenshot({ path: file, type: 'jpeg', quality: 70 });
        shots.push(file);
      }
      await page.locator('.lj-stop[data-step="2"]').click();
      await page.waitForTimeout(1200);
      const mod = path.join(out, `${tag}-module.jpg`);
      await lj.screenshot({ path: mod, type: 'jpeg', quality: 70 });
      shots.push(mod);
      // homepage promotional preview
      await page.goto(`${BASE}/${lang === 'en' ? 'en/' : ''}`, { waitUntil: 'load' });
      const card = page.locator('.disc-light');
      await card.scrollIntoViewIfNeeded();
      await page.waitForTimeout(900);
      const home = path.join(out, `${tag}-home-preview.jpg`);
      await card.screenshot({ path: home, type: 'jpeg', quality: 70 });
      shots.push(home);
      await ctx.close();
    }
  }
}
await browser.close();
console.log(`${shots.length} screenshots in ${out}`);
