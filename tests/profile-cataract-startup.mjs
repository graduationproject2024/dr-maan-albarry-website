// Cataract 3D viewer startup profile (final stabilization, section 7). Run against a running preview:
//   PW_PORT=4174 node tests/profile-cataract-startup.mjs <label> [runs]
// Measures, from the tap on "Start the 3D experience": when each JavaScript/CSS file finished (and its transfer and
// decoded sizes), when the loading text reached each step (5/25/55/75/100 %: UI built, renderer created, materials,
// geometry, shaders compiled), when the first frame was drawn and the viewer was ready, long tasks, the JS heap,
// and how many canvases exist. Conditions: unthrottled; Fast 3G + 4x CPU (same profile as tests/journeys/harness.js).
// Reports the median and range per phase. Laboratory numbers on this machine, not field data.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const port = Number(process.env.PW_PORT || 4174);
const label = process.argv[2] || 'run';
const RUNS = Number(process.argv[3] || 5);
const base = `http://127.0.0.1:${port}/`;
const NET = { 'fast-3g': { offline: false, latency: 562.5, downloadThroughput: (1.6 * 1024 * 1024 * 0.9) / 8, uploadThroughput: (750 * 1024 * 0.9) / 8 } };
const browser = await chromium.launch({ args: process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : [] });
const median = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
const out = { measuredAt: new Date().toISOString(), environment: 'Chromium (Playwright) on Windows, ANGLE/D3D11 on the local GPU, phone emulated (390x844, DPR 2); vite preview on localhost', conditions: [] };

for (const cond of [{ name: 'unthrottled', net: null, cpu: 1 }, { name: 'Fast 3G + CPU 4x', net: 'fast-3g', cpu: 4 }, { name: 'Fast 3G + CPU 4x, 3D files already in the HTTP cache (second visit)', net: 'fast-3g', cpu: 4, warm: true }]) {
  const runs = [];
  for (let i = 0; i < RUNS; i++) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await page.goto(`${base}en/procedures/cataract-surgery/`);
    await page.waitForLoadState('networkidle');
    if (cond.warm) { // load the 3D files once, close the viewer, then measure the second start
      await page.locator('#cataract-3d-start').scrollIntoViewIfNeeded();
      await page.locator('#cataract-3d-start').click();
      await page.waitForFunction(() => document.querySelector('#cataract-3d-stage .csim')?.dataset.state === 'ready', null, { timeout: 120000 });
      await page.evaluate(() => window.closeCataract3D());
      await page.waitForTimeout(300);
    }
    await page.locator('#cataract-3d-start').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    if (cond.net) { await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', NET[cond.net]); }
    if (cond.cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: cond.cpu });
    await page.evaluate(() => {
      window.__p = { t0: 0, steps: {}, long: [], ready: 0, canvas: 0, loadingShown: 0 };
      try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__p.long.push({ start: Math.round(e.startTime), dur: Math.round(e.duration) }); }).observe({ type: 'longtask' }); } catch { /* not supported */ }
      new MutationObserver(() => {
        const now = performance.now(), p = window.__p;
        const sim = document.querySelector('#cataract-3d-stage .csim');
        if (!sim) return;
        if (!p.loadingShown) p.loadingShown = now;
        const m = (sim.textContent.match(/(\d+)%/) || [])[1];
        if (m && !p.steps[m]) p.steps[m] = now;
        if (!p.canvas && sim.querySelector('canvas')) p.canvas = now;
        if (!p.ready && sim.dataset.state === 'ready') p.ready = now;
      }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true });
      const btn = document.getElementById('cataract-3d-start');
      btn.addEventListener('click', () => { window.__p.t0 = performance.now(); }, { capture: true, once: true });
    });
    await page.locator('#cataract-3d-start').click();
    await page.waitForFunction(() => window.__p.ready > 0, null, { timeout: 300000 });
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const r = await page.evaluate(() => {
      const p = window.__p, rel = (t) => (t ? Math.round(t - p.t0) : null);
      const files = performance.getEntriesByType('resource').filter((e) => e.startTime >= p.t0 - 5 && /\/assets\//.test(e.name)).map((e) => ({ file: e.name.split('/').pop().replace(/-[A-Za-z0-9_]{8}\./, '.'), start: rel(e.startTime), end: rel(e.responseEnd), transferKB: Math.round(e.transferSize / 102.4) / 10, decodedKB: Math.round(e.decodedBodySize / 102.4) / 10 }));
      return {
        loadingShown: rel(p.loadingShown), files, filesDone: files.length ? Math.max(...files.map((f) => f.end)) : 0,
        step5: rel(p.steps['5']), step25: rel(p.steps['25']), step55: rel(p.steps['55']), step75: rel(p.steps['75']), step100: rel(p.steps['100']), ready: rel(p.ready),
        longTasks: p.long.filter((l) => l.start >= p.t0).map((l) => l.dur), heapMB: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : null,
        canvases: document.querySelectorAll('canvas').length,
      };
    });
    r.download = r.filesDone; r.init = r.ready - r.filesDone;
    r.createRenderer = r.step25 - r.step5; r.materials = r.step55 - r.step25; r.geometry = r.step75 - r.step55; r.shaders = r.step100 - r.step75;
    r.longTaskTotal = r.longTasks.reduce((a, b) => a + b, 0); r.longestTask = Math.max(0, ...r.longTasks);
    runs.push(r);
    await ctx.close();
  }
  const keys = ['loadingShown', 'download', 'init', 'createRenderer', 'materials', 'geometry', 'shaders', 'ready', 'longTaskTotal', 'longestTask', 'heapMB'];
  const summary = Object.fromEntries(keys.map((k) => [k, { median: median(runs.map((r) => r[k])), min: Math.min(...runs.map((r) => r[k])), max: Math.max(...runs.map((r) => r[k])) }]));
  out.conditions.push({ condition: cond.name, runs: RUNS, summary, files: runs[0].files, canvases: runs.map((r) => r.canvases), raw: runs.map(({ files, ...rest }) => rest) });
  console.log(`\n${cond.name} (${RUNS} runs) — ms from the tap, median [min–max]`);
  for (const k of keys) console.log(`  ${k.padEnd(15)} ${summary[k].median}  [${summary[k].min}–${summary[k].max}]`);
  console.log('  files:', runs[0].files.map((f) => `${f.file} ${f.transferKB}KB→${f.decodedKB}KB @${f.start}–${f.end}`).join(' | '));
}
await browser.close();
fs.mkdirSync('docs/implementation/final-stabilization-phase-2-3-readiness/evidence/cataract', { recursive: true });
fs.writeFileSync(`docs/implementation/final-stabilization-phase-2-3-readiness/evidence/cataract/startup-${label}.json`, JSON.stringify(out, null, 1));
