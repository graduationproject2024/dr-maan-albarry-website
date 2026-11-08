// Performance measurements for the premium design (numbers for premium-experience-reconstruction/PERFORMANCE_RESULTS.md).
// Measured on this Windows machine with Chromium via Playwright: phones are emulated (viewport/touch + CDP network and CPU throttling), not real devices.
//   JOURNEY_PERF=1 PW_REUSE=1 PW_PORT=4671 PRERENDER_PORT=4676 npx playwright test tests/journeys/premium-perf.spec.js --workers=1
// Results: docs/implementation/premium-experience-reconstruction/evidence/journeys/logs/premium-perf.json
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { throttle, revealInFreeArea, settleScroll } from './harness.js';

test.skip(!process.env.JOURNEY_PERF, 'performance measurements run only with JOURNEY_PERF=1 (serial, idle machine)');
test.describe.configure({ mode: 'serial' });
const OUT = 'docs/implementation/premium-experience-reconstruction/evidence/journeys/logs';
const results = { measuredAt: new Date().toISOString(), environment: 'Chromium (Playwright) on Windows, ANGLE/D3D11 on the local GPU; phones emulated; vite preview on localhost', pageLoads: [], chunks: null, assets: null, simulators: [], interactions: [] };

// Observers installed before any app code: LCP, CLS, and the worst event duration per interaction (INP approximation).
const VITALS = () => {
  window.__v = { lcp: 0, cls: 0, inter: {} };
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__v.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__v.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.interactionId) window.__v.inter[e.interactionId] = Math.max(window.__v.inter[e.interactionId] || 0, e.duration); }).observe({ type: 'event', durationThreshold: 16, buffered: true });
};
const collect = (page) => page.evaluate(() => {
  const nav = performance.getEntriesByType('navigation')[0];
  const res = performance.getEntriesByType('resource');
  const sum = (f) => res.filter(f).reduce((a, r) => a + (r.transferSize || r.decodedBodySize || 0), 0);
  const durs = Object.values(window.__v.inter).sort((a, b) => b - a);
  return {
    lcpMs: Math.round(window.__v.lcp), cls: +window.__v.cls.toFixed(4), inpMs: durs.length ? Math.round(durs[0]) : null, interactions: durs.length,
    domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd), loadMs: Math.round(nav.loadEventEnd),
    requests: res.length + 1, jsKiB: Math.round(sum((r) => /\.js(\?|$)/.test(r.name)) / 1024), cssKiB: Math.round(sum((r) => /\.css(\?|$)/.test(r.name)) / 1024),
    imgKiB: Math.round(sum((r) => r.initiatorType === 'img' || /\.(webp|jpe?g|png|svg)(\?|$)/.test(r.name)) / 1024), fontKiB: Math.round(sum((r) => /\.woff2?(\?|$)/.test(r.name)) / 1024),
    transferKiB: Math.round((nav.transferSize + sum(() => true)) / 1024),
    jsFiles: res.filter((r) => /\.js(\?|$)/.test(r.name)).map((r) => r.name.split('/').pop()),
  };
});
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };

const SCENARIOS = [
  { label: 'home AR 390 Fast 3G + CPU 4x', url: '/', w: 390, h: 844, net: 'fast-3g', cpu: 4, touch: true },
  { label: 'procedure AR 390 Fast 3G + CPU 4x', url: '/procedures/cataract-surgery/', w: 390, h: 844, net: 'fast-3g', cpu: 4, touch: true },
  { label: 'home EN 390 Fast 3G + CPU 4x', url: '/en/', w: 390, h: 844, net: 'fast-3g', cpu: 4, touch: true },
  { label: 'home AR 1440 unthrottled', url: '/', w: 1440, h: 900, net: null, cpu: 1, touch: false },
  { label: 'procedure EN 1440 unthrottled', url: '/en/procedures/cataract-surgery/', w: 1440, h: 900, net: null, cpu: 1, touch: false },
];

for (const s of SCENARIOS) {
  test(`load: ${s.label}`, async ({ browser }) => {
    test.setTimeout(420_000);
    const runs = [];
    for (let run = 0; run < 3; run++) {
      const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, hasTouch: s.touch, isMobile: s.touch, deviceScaleFactor: s.touch ? 2 : 1 });
      const page = await ctx.newPage();
      await page.addInitScript(VITALS);
      if (s.net) await throttle(page, s.net, s.cpu);
      await page.goto(s.url, { waitUntil: 'load', timeout: 180000 });
      await page.locator('main h1').first().waitFor({ timeout: 90000 });
      await page.waitForTimeout(2000);
      // two real interactions: open the FAQ accordion, then scroll a little (scroll does not count towards INP)
      const tap = async (loc) => { if (s.touch) await loc.tap(); else await loc.click(); };
      const q = page.locator('.faq-question').first();
      await q.waitFor({ timeout: 90000 });
      await revealInFreeArea(page, q); await settleScroll(page);
      await tap(q); await page.waitForTimeout(600);
      await tap(q); await page.waitForTimeout(600);
      await page.waitForTimeout(400);
      const v = await collect(page);
      runs.push(v);
      await ctx.close();
    }
    const summary = { label: s.label, url: s.url, viewport: `${s.w}x${s.h}`, throttling: s.net ? `${s.net}, CPU ${s.cpu}x` : 'none', runs: runs.length, lcpMsMedian: median(runs.map((r) => r.lcpMs)), clsMedian: median(runs.map((r) => r.cls)), inpMsMedian: median(runs.map((r) => r.inpMs ?? 0)), ...runs[0], lcpRuns: runs.map((r) => r.lcpMs), clsRuns: runs.map((r) => r.cls), inpRuns: runs.map((r) => r.inpMs) };
    results.pageLoads.push(summary);
    expect(summary.lcpMsMedian).toBeGreaterThan(0);
    if (s.url === '/' || s.url === '/en/') expect(summary.jsFiles.some((f) => /three\.module|cataract-sim|vision-sim-|pipeline-/.test(f)), `three.js chunks on home: ${summary.jsFiles.join(',')}`).toBe(false);
  });
}

test('network log: home stays free of three.js even after a full scroll', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const urls = [];
  page.on('request', (r) => urls.push(r.url()));
  await page.goto('/', { waitUntil: 'load' });
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } });
  await page.waitForTimeout(1500);
  const js = urls.filter((u) => /\.js(\?|$)/.test(u)).map((u) => u.split('/').pop());
  results.homeJsAfterScroll = js;
  results.threeLoadedOnHome = js.some((f) => /three\.module/.test(f));
  expect(results.threeLoadedOnHome).toBe(false);
  await ctx.close();
});

test('bundle sizes by chunk (built dist/)', async () => {
  const dir = 'dist/assets';
  const files = fs.readdirSync(dir).filter((f) => /\.(js|css)$/.test(f));
  const row = (f) => { const buf = fs.readFileSync(path.join(dir, f)); return { file: f, kib: +(buf.length / 1024).toFixed(1), gzipKib: +(zlib.gzipSync(buf).length / 1024).toFixed(1) }; };
  results.chunks = files.map(row).sort((a, b) => b.kib - a.kib);
  const allFiles = (d, re) => fs.readdirSync(d, { recursive: true }).filter((f) => re.test(String(f))).map((f) => path.join(d, String(f)));
  const bytes = (fs_) => fs_.reduce((a, f) => a + fs.statSync(f).size, 0);
  const fonts = allFiles('dist/fonts', /\.woff2$/);
  const images = allFiles('dist/images', /\.(webp|jpe?g|png)$/);
  results.assets = { fontFiles: fonts.length, fontKiB: Math.round(bytes(fonts) / 1024), imageFiles: images.length, imageKiB: Math.round(bytes(images) / 1024) };
  expect(results.chunks.length).toBeGreaterThan(5);
});

test('simulator init: 3D cataract and vision simulator, localhost and Fast 3G + CPU 4x', async ({ browser }) => {
  test.setTimeout(420_000);
  for (const net of [null, 'fast-3g']) {
    for (const [name, url, start] of [['cataract 3D', '/procedures/cataract-surgery/', '#cataract-3d-start']]) {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      await page.goto(url); await page.locator('#p-faq').waitFor();
      if (net) await throttle(page, net, 4);
      const b = page.locator(start); await revealInFreeArea(page, b);
      const t0 = Date.now(); await b.tap();
      await page.waitForFunction(() => document.querySelector('#cataract-3d-stage .csim')?.dataset.state === 'ready', null, { timeout: 300000 });
      results.simulators.push({ sim: name, network: net ? `${net} + CPU 4x` : 'localhost', tapToReadyMs: Date.now() - t0 });
      await ctx.close();
    }
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto('/lens-lab/'); await page.locator('#simulator-host').waitFor();
    if (net) await throttle(page, net, 4);
    const t0 = Date.now();
    await page.locator('#simulator-host').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => { const r = document.querySelector('#simulator-host .vsim'); return r && (r.querySelector('canvas') || r.classList.contains('vsim--fallback')); }, null, { timeout: 300000 });
    results.simulators.push({ sim: 'vision simulator', network: net ? `${net} + CPU 4x` : 'localhost', scrollToReadyMs: Date.now() - t0, note: 'the lens-lab page already loaded the chunk preload group' });
    await ctx.close();
  }
});

test.afterAll(() => {
  if (!results.pageLoads.length) return;
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(`${OUT}/premium-perf.json`, JSON.stringify(results, null, 2));
});
