// Site load metrics on the production build (local preview, no network throttling).
// Usage: node tests/perf-site.mjs   → prints JSON per viewport
import { chromium } from '@playwright/test';
import { preview } from 'vite';
const server = await preview({ preview: { port: 4179, strictPort: true }, logLevel: 'silent' });
const browser = await chromium.launch({ args: process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : [] });
const out = {};
for (const [name, w, h] of [['390x844', 390, 844], ['1440x900', 1440, 900]]) {
  const runs = [];
  for (let i = 0; i < 3; i++) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.addInitScript(() => {
      window.__lcp = 0; window.__cls = 0;
      new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto('http://localhost:4179/', { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    runs.push(await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const res = performance.getEntriesByType('resource');
      return {
        lcp: Math.round(window.__lcp), cls: +window.__cls.toFixed(3),
        dcl: Math.round(nav.domContentLoadedEventEnd), load: Math.round(nav.loadEventEnd),
        requests: res.length, threeLoaded: res.some(r => /cataract-sim/.test(r.name))
      };
    }));
    await page.close();
  }
  const med = k => runs.map(r => r[k]).sort((a, b) => a - b)[1];
  out[name] = { lcpMs: med('lcp'), cls: med('cls'), dclMs: med('dcl'), loadMs: med('load'), requests: med('requests'), threeChunkOnLoad: runs.some(r => r.threeLoaded) };
}
await browser.close();
await new Promise(r => server.httpServer.close(r));
console.log(JSON.stringify(out, null, 2));
