// Evidence capture: screenshots + bounding-box measurements of key booking/mobile components.
// Usage: node tests/measure.mjs <outDir> [baseUrl]
// Without baseUrl it serves the current dist/ itself (vite preview on :4174) and shuts it down afterwards.
import { chromium } from '@playwright/test';
import { preview } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const outDir = process.argv[2];
const server = process.argv[3] ? null : await preview({ preview: { port: 4174, strictPort: true }, logLevel: 'silent' });
const base = process.argv[3] || 'http://localhost:4174/';
fs.mkdirSync(outDir, { recursive: true });

const viewports = [
  ['360', 360, 800], ['390', 390, 844], ['768', 768, 1024], ['1366', 1366, 768], ['1440', 1440, 900]
];
const sels = {
  bookingBar: '#booking-bar .booking-bar-inner > *',
  heroCta: '#hero-primary-cta',
  heroCtaLabel: '#hero-primary-cta .btn-label',
  clinicCta: '.clinic-cta-actions a.btn-arrow-fill',
  clinicCtaLabel: '.clinic-cta-actions a.btn-arrow-fill .btn-label',
  vsTags: '.vs-tag'
};

const browser = await chromium.launch({ args: process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : [] });
const report = {};
for (const [name, w, h] of viewports) {
  for (const lang of ['ar', 'en']) {
    for (const theme of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: theme });
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      page.on('requestfailed', r => errors.push('REQFAIL ' + r.url()));
      await page.addInitScript(t => { try { localStorage.setItem('theme', t); } catch (e) {} }, theme);
      await page.goto(base, { waitUntil: 'load' });
      if (lang === 'en') await page.evaluate(() => window.toggleLang());
      await page.waitForTimeout(400);
      const m = await page.evaluate((sels) => {
        const r = el => { const b = el.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), right: Math.round(b.right), scrollW: el.scrollWidth, clientW: el.clientWidth, text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 60) }; };
        const out = { vw: innerWidth, docScrollW: document.documentElement.scrollWidth, pageH: document.documentElement.scrollHeight };
        for (const [k, s] of Object.entries(sels)) out[k] = [...document.querySelectorAll(s)].map(r);
        return out;
      }, sels);
      m.errors = errors;
      report[`${name}-${lang}-${theme}`] = m;
      if (theme === 'light' || w <= 390) {
        const dir = path.join(outDir, `${name}`);
        fs.mkdirSync(dir, { recursive: true });
        await page.screenshot({ path: path.join(dir, `${lang}-${theme}-top.png`) });
        if (w <= 768) {
          for (const [id, sel] of [['clinic', '.clinic-cta-actions'], ['simulator', '#vs-view']]) {
            const el = await page.$(sel);
            if (el) { await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(800); await page.screenshot({ path: path.join(dir, `${lang}-${theme}-${id}.png`) }); }
          }
        }
      }
      await ctx.close();
    }
  }
}
await browser.close();
if (server) await new Promise(r => server.httpServer.close(r));
fs.writeFileSync(path.join(outDir, 'measurements.json'), JSON.stringify(report, null, 2));
// Compact summary
for (const [k, m] of Object.entries(report)) {
  const off = m.bookingBar.filter(b => b.x < 0 || b.right > m.vw).length;
  const clipped = [...m.bookingBar, ...m.heroCta, ...m.clinicCta].filter(b => b.scrollW > b.clientW + 1).length;
  const lbl = (a, b) => a[0] && b[0] ? `${a[0].w}/${b[0].w}` : '-';
  console.log(`${k.padEnd(16)} overflowX=${m.docScrollW > m.vw} barOffscreen=${off}/${m.bookingBar.length} clipped=${clipped} heroLbl/btn=${lbl(m.heroCtaLabel, m.heroCta)} clinicLbl/btn=${lbl(m.clinicCtaLabel, m.clinicCta)} pageH=${m.pageH} errs=${m.errors.length}`);
}
