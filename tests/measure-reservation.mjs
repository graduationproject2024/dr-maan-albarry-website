// Loading reservation check (final stabilization, section 8.1). Run against a running preview:
//   PW_PORT=4174 node tests/measure-reservation.mjs <label>
// For each lazy module it holds the module's JavaScript for 1.5 s, scrolls like a reader, and records: the height
// reserved, the height once mounted, every layout shift without recent input (CLS), and whether what the reader was
// looking at moved. Chromium and WebKit: WebKit has no scroll anchoring, so it is the harder case.
import { chromium, webkit } from '@playwright/test';
import fs from 'node:fs';
const port = Number(process.env.PW_PORT || 4174);
const label = process.argv[2] || 'run';
const base = `http://127.0.0.1:${port}/`;
const CASES = [
  { name: 'lens-lab page: simulator', url: 'en/lens-lab/', host: '#simulator-host', chunk: /vision-sim-/ },
  { name: 'lens-lab page: reference', url: 'en/lens-lab/', host: '#lens-lab-host', chunk: /lens-lab-/ },
  { name: 'how-vision-works: light journey', url: 'en/how-vision-works/', host: '#light-journey-host', chunk: /light-journey-/ },
];
const out = [];
for (const [bname, type] of [['chromium', chromium], ['webkit', webkit]]) {
  let browser;
  try { browser = await type.launch(bname === 'chromium' && process.platform === 'win32' ? { args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] } : {}); }
  catch (e) { out.push({ browser: bname, skipped: String(e.message).split('\n')[0] }); continue; }
  for (const [w, h] of [[390, 844], [1440, 900]]) {
    for (const c of CASES) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: bname === 'chromium' && w < 500, hasTouch: w < 500 });
      const page = await ctx.newPage();
      await page.route(c.chunk, async (route) => { await new Promise((r) => setTimeout(r, 1500)); route.continue(); });
      await page.addInitScript(() => {
        window.__cls = [];
        try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls.push({ v: e.value, t: Math.round(e.startTime), n: (e.sources || []).map((s) => s.node && (s.node.id || s.node.className || s.node.nodeName)).slice(0, 3) }); }).observe({ type: 'layout-shift', buffered: true }); } catch { window.__cls = null; }
      });
      await page.goto(base + c.url);
      await page.waitForLoadState('load');
      const hostSel = c.host;
      if (!(await page.locator(hostSel).count())) { out.push({ browser: bname, size: `${w}x${h}`, case: c.name, skipped: 'no host on page' }); await ctx.close(); continue; }
      const reserved = await page.evaluate((s) => Math.round(document.querySelector(s).getBoundingClientRect().height), hostSel);
      // scroll like a reader until the slot's top is at the top of the viewport, then keep reading at its middle
      await page.evaluate(async (s) => {
        const el = document.querySelector(s);
        const target = el.getBoundingClientRect().top + scrollY - 80;
        for (let y = scrollY; y < target; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
        scrollTo(0, target);
      }, hostSel);
      // what the reader looks at: the first element after the slot that is on screen, else the slot itself
      const before = await page.evaluate((s) => ({ y: Math.round(scrollY), hostTop: Math.round(document.querySelector(s).getBoundingClientRect().top), docH: document.documentElement.scrollHeight }), hostSel);
      await page.waitForFunction((s) => !document.querySelector(s).hasAttribute('data-reserve'), hostSel, { timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(1200);
      const after = await page.evaluate((s) => ({ y: Math.round(scrollY), hostTop: Math.round(document.querySelector(s).getBoundingClientRect().top), docH: document.documentElement.scrollHeight, mounted: Math.round(document.querySelector(s).getBoundingClientRect().height), cls: window.__cls }), hostSel);
      const cls = after.cls ? after.cls.reduce((a, e) => a + e.v, 0) : null;
      out.push({ browser: bname, size: `${w}x${h}`, case: c.name, reservedPx: reserved, mountedPx: after.mounted, pageGrewPx: after.docH - before.docH, slotTopMovedPx: after.hostTop - before.hostTop, scrollYMovedPx: after.y - before.y, cls: cls === null ? 'not supported' : Number(cls.toFixed(4)), shifts: after.cls ? after.cls.filter((e) => e.v > 0.005) : null });
      await ctx.close();
    }
  }
  await browser.close();
}
fs.writeFileSync(`docs/implementation/final-stabilization-phase-2-3-readiness/evidence/bugs/reservation-${label}.json`, JSON.stringify(out, null, 1));
for (const r of out) console.log(JSON.stringify(r));
