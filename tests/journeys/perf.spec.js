// Performance measurements (numbers for PERFORMANCE_RESULTS.md). Hardware: the Windows test machine's GPU via
// Chromium/ANGLE (D3D11); phones are EMULATED (viewport/touch/UA + CDP throttling) — not real-device numbers.
// Results: test-results/journeys/perf.json (+ evidence mirror). Sanity assertions only; the numbers are the output.
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import { LOG_DIR, LOG_MIRROR, throttle, viewportProfile, revealInFreeArea } from './harness.js';

test.use({ ...viewportProfile(390, 844) });
test.describe.configure({ mode: 'serial' });
// Timing numbers are only meaningful on an otherwise idle machine, so this file runs only on request:
//   JOURNEY_PERF=1 PW_PORT=4673 PRERENDER_PORT=4676 npx playwright test tests/journeys/perf.spec.js --workers=1
test.skip(!process.env.JOURNEY_PERF, 'performance measurements run only with JOURNEY_PERF=1 (serial, idle machine)');
const out = { measuredAt: new Date().toISOString(), loads: [], threeD: [], frames: [], cleanup: null, gpu: null };

const VITALS = () => {
  window.__v = { lcp: 0, cls: 0 };
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__v.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__v.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
};
const vitals = (page) => page.evaluate(() => {
  const nav = performance.getEntriesByType('navigation')[0];
  const res = performance.getEntriesByType('resource');
  const sum = (f) => res.filter(f).reduce((a, r) => a + (r.transferSize || 0), 0);
  return { lcpMs: Math.round(window.__v.lcp), cls: +window.__v.cls.toFixed(3), domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd), loadMs: Math.round(nav.loadEventEnd),
    transferKiB: Math.round((nav.transferSize + sum(() => true)) / 1024), jsKiB: Math.round(sum((r) => /\.js(\?|$)/.test(r.name)) / 1024), imgKiB: Math.round(sum((r) => r.initiatorType === 'img') / 1024), fontKiB: Math.round(sum((r) => /gstatic|\.woff2/.test(r.name)) / 1024), requests: res.length + 1 };
});
const frameStats = (ts) => {
  const d = ts.slice(1).map((t, i) => t - ts[i]).sort((a, b) => a - b);
  const q = (p) => +d[Math.min(d.length - 1, Math.floor(p * d.length))].toFixed(1);
  return { frames: d.length, fps: +(1000 / (d.reduce((a, b) => a + b, 0) / d.length)).toFixed(1), p50: q(0.5), p95: q(0.95), p99: q(0.99), max: +d.at(-1).toFixed(1), over33ms: d.filter((x) => x > 33.4).length };
};
const recordFrames = (page, ms) => page.evaluate((ms) => new Promise((res) => { const ts = []; const t0 = performance.now(); const f = (t) => { ts.push(t); if (t - t0 < ms) requestAnimationFrame(f); else res(ts); }; requestAnimationFrame(f); }), ms);

for (const [label, url, net] of [['home ar', '/', null], ['home en', '/en/', null], ['cataract page ar', '/procedures/cataract-surgery/', null], ['home ar', '/', 'fast-3g'], ['cataract page ar', '/procedures/cataract-surgery/', 'fast-3g']]) {
  test(`load: ${label} ${net || 'localhost'}`, async ({ page }) => {
    test.setTimeout(180_000);
    await page.addInitScript(VITALS);
    if (net) await throttle(page, net, 4);
    await page.goto(url, { waitUntil: 'load', timeout: 150000 });
    await page.waitForTimeout(2500);
    const v = await vitals(page);
    out.loads.push({ page: label, url, network: net ? `${net} + CPU×4` : 'localhost (no throttling)', ...v });
    expect(v.lcpMs).toBeGreaterThan(0);
  });
}

for (const net of [null, 'fast-3g']) {
  test(`3D load time ${net || 'localhost'}`, async ({ page }) => {
    test.setTimeout(180_000);
    await page.goto('/procedures/cataract-surgery/'); await page.locator('#p-faq').waitFor();
    if (net) await throttle(page, net, 4);
    const b = page.locator('#cataract-3d-start'); await revealInFreeArea(page, b);
    const t0 = Date.now(); await b.tap();
    await page.waitForFunction(() => document.querySelector('#cataract-3d-stage .csim')?.dataset.state === 'ready', null, { timeout: 150000 });
    const ms = Date.now() - t0;
    const kib = await page.evaluate(() => Math.round(performance.getEntriesByType('resource').filter((r) => /cataract-sim|three\.module/.test(r.name)).reduce((a, r) => a + r.transferSize, 0) / 1024));
    out.threeD.push({ sim: 'cataract 3D', network: net ? `${net} + CPU×4` : 'localhost', tapToReadyMs: ms, chunkKiB: kib });
    if (!out.gpu) out.gpu = await page.evaluate(() => { const gl = document.createElement('canvas').getContext('webgl2'); const e = gl.getExtension('WEBGL_debug_renderer_info'); const r = e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER); gl.getExtension('WEBGL_lose_context')?.loseContext(); return r; });
  });
}

for (const cpu of [1, 4]) {
  test(`frames: 3D cataract playing, CPU ×${cpu}`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto('/procedures/cataract-surgery/'); await page.locator('#p-faq').waitFor();
    const b = page.locator('#cataract-3d-start'); await revealInFreeArea(page, b); await b.tap();
    await page.waitForFunction(() => document.querySelector('#cataract-3d-stage .csim')?.dataset.state === 'ready');
    await revealInFreeArea(page, page.locator('#cataract-3d-stage [data-ref="viewport"]'));
    await page.locator('#cataract-3d-stage [data-ref="start"]').tap();
    if (cpu > 1) await throttle(page, null, cpu);
    await page.waitForTimeout(800);
    const st = frameStats(await recordFrames(page, 5000));
    out.frames.push({ sim: 'cataract 3D (playing)', cpu: `×${cpu}`, ...st });
    expect(st.frames).toBeGreaterThan(10);
  });
  test(`frames: vision simulator while dragging distance, CPU ×${cpu}`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto('/en/'); await page.locator('#simulator-host').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('#simulator-host canvas'));
    const range = page.locator('#simulator-host [data-ref="range"]'); await revealInFreeArea(page, page.locator('#simulator-host .vsim-viewport'));
    if (cpu > 1) await throttle(page, null, cpu);
    await range.focus();
    const rec = recordFrames(page, 5000);
    for (let i = 0; i < 60; i++) { await page.keyboard.press(i % 30 < 15 ? 'ArrowRight' : 'ArrowLeft'); await page.waitForTimeout(60); }
    const st = frameStats(await rec);
    out.frames.push({ sim: 'vision simulator (distance changing every ~80 ms)', cpu: `×${cpu}`, ...st });
    expect(st.frames).toBeGreaterThan(10);
  });
}

test('memory and GPU cleanup over 8 open/close cycles of the 3D viewer', async ({ page }) => {
  test.setTimeout(180_000);
  await page.addInitScript(() => { const o = HTMLCanvasElement.prototype.getContext; window.__gl = new Set(); HTMLCanvasElement.prototype.getContext = function (t, ...r) { const c = o.call(this, t, ...r); if (c && /webgl/.test(t)) window.__gl.add(c); return c; }; });
  await page.goto('/procedures/cataract-surgery/'); await page.locator('#p-faq').waitFor();
  const cdp = await page.context().newCDPSession(page);
  const heap = async () => { await cdp.send('HeapProfiler.collectGarbage'); return Math.round((await page.evaluate(() => performance.memory.usedJSHeapSize)) / 1024 / 1024 * 10) / 10; };
  const live = () => page.evaluate(() => [...window.__gl].filter((c) => !c.isContextLost()).length);
  const h0 = await heap(); const rows = [];
  for (let i = 1; i <= 8; i++) {
    const b = page.locator('#cataract-3d-start'); await revealInFreeArea(page, b); await b.tap();
    await page.waitForFunction(() => document.querySelector('#cataract-3d-stage .csim')?.dataset.state === 'ready');
    const open = await live();
    const c = page.locator('#cataract-3d-stage [data-ref="close"]'); await revealInFreeArea(page, c); await c.tap(); await page.waitForTimeout(300);
    rows.push({ cycle: i, liveWhileOpen: open, liveAfterClose: await live(), heapMiB: await heap(), canvases: await page.evaluate(() => document.querySelectorAll('canvas').length) });
  }
  out.cleanup = { heapBeforeMiB: h0, cycles: rows };
  expect(rows.at(-1).liveAfterClose).toBe(0);
});

test.afterAll(() => {
  if (!out.loads.length && !out.frames.length) return; // skipped run: keep the last measured file
  for (const dir of [LOG_DIR, LOG_MIRROR]) { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(`${dir}/perf.json`, JSON.stringify(out, null, 2)); }
});
