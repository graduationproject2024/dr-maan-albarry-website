// Page-load measurements (final stabilization, section 10). Run against one or two running previews:
//   node tests/perf-final.mjs <label> <baseUrl> [runs]
// For each page: N cold loads on an emulated phone (390x844, DPR 2) under Fast 3G + 4x CPU (the profile used by
// tests/journeys/harness.js). Reports the median and range of TTFB, FCP, LCP (with the LCP element), CLS, total
// blocking time (long tasks over 50 ms before LCP + 5 s), transferred bytes, and when each critical file finished.
// Laboratory measurements on this machine; not field data.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const [label, baseArg, runsArg] = process.argv.slice(2);
const base = (baseArg || 'http://127.0.0.1:4174/').replace(/\/?$/, '/');
const RUNS = Number(runsArg || 5);
const NET = { offline: false, latency: 562.5, downloadThroughput: (1.6 * 1024 * 1024 * 0.9) / 8, uploadThroughput: (750 * 1024 * 0.9) / 8 };
const PAGES = [['home AR', ''], ['home EN', 'en/'], ['cataract AR', 'procedures/cataract-surgery/'], ['lens-lab EN', 'en/lens-lab/'], ['procedures AR', 'procedures/']];
const browser = await chromium.launch({ args: process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : [] });
const med = (a) => { const s = a.filter((x) => x != null).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
const out = { label, base, measuredAt: new Date().toISOString(), profile: 'Chromium, phone 390x844 DPR 2, Fast 3G (1.44 Mbps down, 562 ms latency) + CPU 4x, cold cache', runs: RUNS, pages: [] };
for (const [name, url] of PAGES) {
  const runs = [];
  for (let i = 0; i < RUNS; i++) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', NET);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.addInitScript(() => {
      window.__m = { lcp: 0, lcpEl: '', cls: 0, long: [] };
      new PerformanceObserver((l) => { for (const e of l.getEntries()) { window.__m.lcp = e.startTime; window.__m.lcpEl = e.element ? `${e.element.tagName.toLowerCase()}${e.element.id ? '#' + e.element.id : ''}.${String(e.element.className).split(' ')[0]}` : ''; } }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.long.push([e.startTime, e.duration]); }).observe({ type: 'longtask', buffered: true }); } catch { /* */ }
    });
    await page.goto(base + url, { waitUntil: 'load', timeout: 120000 });
    await page.waitForTimeout(5000);
    const m = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const fcp = performance.getEntriesByName('first-contentful-paint')[0];
      const res = performance.getEntriesByType('resource');
      const pick = (re) => { const e = res.find((r) => re.test(r.name)); return e ? Math.round(e.responseEnd) : null; };
      const m = window.__m;
      return {
        ttfb: Math.round(nav.responseStart), htmlDone: Math.round(nav.responseEnd), htmlKB: Math.round(nav.transferSize / 102.4) / 10,
        fcp: fcp ? Math.round(fcp.startTime) : null, lcp: Math.round(m.lcp), lcpEl: m.lcpEl, cls: Math.round(m.cls * 10000) / 10000,
        tbt: Math.round(m.long.filter(([s]) => s < m.lcp + 5000).reduce((a, [, d]) => a + Math.max(0, d - 50), 0)),
        cssDone: pick(/assets\/index-[^/]+\.css/), jsDone: pick(/assets\/index-[^/]+\.js/), fontDone: Math.max(0, ...res.filter((r) => /\.woff2/.test(r.name)).map((r) => Math.round(r.responseEnd))), heroImgDone: pick(/dr-maan-portrait-hero|atlas\/[^/]+\.webp/),
        transferKB: Math.round((nav.transferSize + res.reduce((a, r) => a + r.transferSize, 0)) / 1024), requests: res.length + 1,
      };
    });
    runs.push(m);
    await ctx.close();
  }
  const keys = ['ttfb', 'htmlDone', 'fcp', 'lcp', 'cls', 'tbt', 'cssDone', 'jsDone', 'fontDone', 'heroImgDone', 'transferKB', 'requests', 'htmlKB'];
  const s = Object.fromEntries(keys.map((k) => [k, { median: med(runs.map((r) => r[k])), min: Math.min(...runs.map((r) => r[k] ?? Infinity)), max: Math.max(...runs.map((r) => r[k] ?? -Infinity)) }]));
  out.pages.push({ page: name, url, lcpElement: runs.map((r) => r.lcpEl), summary: s, raw: runs });
  console.log(`${name.padEnd(14)} LCP ${s.lcp.median} [${s.lcp.min}–${s.lcp.max}] ${runs[0].lcpEl} | FCP ${s.fcp.median} | TTFB ${s.ttfb.median} | html ${s.htmlKB.median}KB done ${s.htmlDone.median} | css ${s.cssDone.median} | font ${s.fontDone.median} | img ${s.heroImgDone.median} | js ${s.jsDone.median} | CLS ${s.cls.median} [max ${s.cls.max}] | TBT ${s.tbt.median} | ${s.transferKB.median}KB/${s.requests.median} req`);
}
await browser.close();
fs.mkdirSync('docs/implementation/final-stabilization-phase-2-3-readiness/evidence/performance', { recursive: true });
fs.writeFileSync(`docs/implementation/final-stabilization-phase-2-3-readiness/evidence/performance/pages-${label}.json`, JSON.stringify(out, null, 1));
