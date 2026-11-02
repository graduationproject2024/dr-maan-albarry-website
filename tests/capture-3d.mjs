// Evidence capture for the 3D cataract simulator.
//
// Usage (after `CSIM_HARNESS=1 npm run build`, so dist/ contains the harness page):
//   node tests/capture-3d.mjs <outDir>                 per-stage frames from the harness (default mode)
//   node tests/capture-3d.mjs <outDir> --mode=page     the simulator inside the real page (poster -> active)
//   node tests/capture-3d.mjs <outDir> --mode=review   the clinical review mode panel
//
// The preview server port is configurable so parallel worktrees never clash:
//   CAPTURE_PORT=4378 (default 4378)
// Frames are written as JPEG (quality 82). GPU: on Windows WebGL is routed to the real GPU through ANGLE/D3D11.
import { chromium } from '@playwright/test';
import { preview } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const outDir = process.argv[2];
if (!outDir) { console.error('usage: node tests/capture-3d.mjs <outDir> [--mode=stages|page|review]'); process.exit(2); }
const mode = (process.argv.find((a) => a.startsWith('--mode=')) || '--mode=stages').slice(7);
const PORT = Number(process.env.CAPTURE_PORT || 4378);
fs.mkdirSync(outDir, { recursive: true });

const DUR = [9, 8, 8, 10, 12, 12, 9];
const TOTAL = DUR.reduce((a, b) => a + b, 0);
const START = DUR.map((_, i) => DUR.slice(0, i).reduce((a, b) => a + b, 0));
const SHOT = { type: 'jpeg', quality: 82 };

const server = await preview({ preview: { port: PORT, strictPort: true }, logLevel: 'silent' });
const browser = await chromium.launch({ args: process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : [] });
const base = `http://localhost:${PORT}/`;
const written = [];

async function openHarness(page, query) {
  await page.goto(`${base}cataract-sim-preview.html?${query}`);
  await page.waitForFunction(() => window.__csim && ['ready', 'fallback'].includes(window.__csim.getState().state), null, { timeout: 30_000 });
}
async function seekStage(page, i, p) {
  await page.evaluate(([i, g]) => { window.__csim.goToStage(i); window.__csim.seek(g); }, [i, (START[i] + DUR[i] * p) / TOTAL]);
  await page.waitForTimeout(450);
}

try {
  if (mode === 'stages') {
    const sets = [
      { w: 1280, h: 800, mobile: false, ps: [0.2, 0.5, 0.8], tag: 'desktop' },
      { w: 390, h: 844, mobile: true, ps: [0.55], tag: 'mobile' }
    ];
    for (const s of sets) {
      const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, ...(s.mobile ? { hasTouch: true, isMobile: true, deviceScaleFactor: 2 } : {}) });
      const page = await ctx.newPage();
      await openHarness(page, 'lang=en&theme=light&reduced=1');
      for (let i = 0; i < DUR.length; i++) {
        for (const p of s.ps) {
          await seekStage(page, i, p);
          const f = path.join(outDir, `${s.tag}-stage${i + 1}-p${String(Math.round(p * 100)).padStart(2, '0')}.jpg`);
          await page.locator('.csim-viewport').screenshot({ path: f, ...SHOT });
          written.push(f);
        }
      }
      if (!s.mobile) {
        // close-up cross-sections (cut-away forced on) so cut faces and layer order can be inspected
        for (const [i, p] of [[0, 0.6], [3, 0.5], [4, 0.55], [5, 1], [6, 0.8]]) {
          await seekStage(page, i, p);
          const pressed = await page.locator('[data-ref="cutaway"]').getAttribute('aria-pressed');
          if (pressed !== 'true') await page.locator('[data-ref="cutaway"]').click();
          await page.evaluate(() => {
            const d = window.__cataractSim, az = 0.95, polar = 1.4, dist = 19, t = [0, 0, -0.8];
            d.controls.target.set(...t);
            d.camera.position.set(t[0] + dist * Math.sin(polar) * Math.sin(az), t[1] + dist * Math.cos(polar), t[2] + dist * Math.sin(polar) * Math.cos(az));
            d.controls.update();
          });
          await page.waitForTimeout(350);
          const f = path.join(outDir, `section-stage${i + 1}-p${String(Math.round(p * 100)).padStart(2, '0')}.jpg`);
          await page.locator('.csim-viewport').screenshot({ path: f, ...SHOT });
          written.push(f);
        }
      }
      await ctx.close();
    }
  } else if (mode === 'review') {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await ctx.newPage();
    await openHarness(page, 'lang=en&theme=light&reduced=1&review=1');
    await seekStage(page, 3, 0.5);
    const f = path.join(outDir, 'review-mode.jpg');
    await page.locator('.csim').screenshot({ path: f, ...SHOT });
    written.push(f);
    await ctx.close();
  } else {
    for (const [w, h] of [[390, 844], [1440, 900]]) {
      for (const [lang, theme] of [['en', 'light'], ['ar', 'dark']]) {
        const page = await browser.newPage({ viewport: { width: w, height: h } });
        await page.addInitScript(([l, t]) => { localStorage.setItem('lang', l); localStorage.setItem('theme', t); }, [lang, theme]);
        await page.goto(base);
        await page.locator('#cataract-3d-start').click();
        await page.locator('#cataract-3d[data-state="active"]').waitFor({ timeout: 20_000 });
        await page.waitForTimeout(800);
        const f = path.join(outDir, `c3d-${w}-${lang}-${theme}.jpg`);
        await page.locator('#cataract-3d').screenshot({ path: f, ...SHOT });
        written.push(f);
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
  await new Promise((r) => server.httpServer.close(r));
}
console.log(`captured ${written.length} frames into ${outDir}`);
