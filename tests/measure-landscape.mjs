// Short landscape screens (final stabilization, section 8.2). Run against a running preview:
//   PW_PORT=4174 node tests/measure-landscape.mjs <label>
// For each viewport and text size: does the picture plus the essential controls fit between the header and the
// booking bar; if not, is the fallback usable (the picture stays, every control can be scrolled to and tapped)?
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const port = Number(process.env.PW_PORT || 4174);
const label = process.argv[2] || 'run';
const H = '#simulator-host';
const browser = await chromium.launch({ args: process.platform === 'win32' ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] : [] });
const out = [];
for (const [w, h, note] of [[568, 320, 'iPhone SE sideways'], [640, 360, 'small Android sideways'], [667, 331, 'iPhone 8 sideways, Safari bars showing'], [667, 375, 'iPhone 8 sideways'], [740, 360, 'Android sideways'], [844, 340, 'iPhone 14 sideways, Safari bars showing'], [844, 390, 'iPhone 14 sideways'], [932, 430, 'iPhone 14 Pro Max sideways']]) {
  for (const text of [100, 125, 150]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.addInitScript((t) => {
      if (t === 100) return;
      const apply = () => { if (!document.documentElement) return false; document.documentElement.style.fontSize = `${t}%`; return true; };
      if (!apply()) new MutationObserver((_, o) => { if (apply()) o.disconnect(); }).observe(document, { childList: true });
    }, text);
    await page.goto(`http://127.0.0.1:${port}/en/lens-lab/`);
    await page.locator(H).scrollIntoViewIfNeeded();
    await page.waitForFunction((s) => document.querySelector(`${s} canvas`), H, { timeout: 45000 });
    await page.waitForTimeout(700);
    await page.evaluate((s) => { const b = document.querySelector(`${s} .vsim-bench`); scrollTo(0, b.getBoundingClientRect().top + scrollY - document.getElementById('site-header').offsetHeight); }, H);
    await page.waitForTimeout(500);
    const m = await page.evaluate(async (s) => {
      const q = (x) => document.querySelector(`${s} ${x}`);
      const r = (e) => e.getBoundingClientRect();
      const header = r(document.getElementById('site-header')).bottom;
      const barEl = document.querySelector('.booking-bar');
      const bar = barEl && getComputedStyle(barEl).display !== 'none' ? r(barEl).top : innerHeight;
      const inZone = (e) => { const b = r(e); return b.top >= header - 1 && b.bottom <= bar + 1; };
      const parts = { viewer: q('.vsim-viewport'), presets: q('.vsim-field-presets'), lens: q('.vsim-field-lens'), light: q('.vsim-field-light'), actions: q('.vsim-bench-actions') };
      const fitsNow = Object.fromEntries(Object.entries(parts).map(([k, e]) => [k, inZone(e)]));
      // fallback: can each control be brought between the bars, with the picture still on screen?
      const reach = {};
      for (const k of ['presets', 'lens', 'light', 'actions']) {
        const b = r(parts[k]);
        if (!inZone(parts[k])) { scrollBy(0, b.bottom - bar + 4); await new Promise((res) => setTimeout(res, 250)); }
        const v = r(parts.viewer);
        const el = parts[k].querySelector('label, button');
        const eb = r(el);
        const hit = document.elementFromPoint(eb.left + eb.width / 2, eb.top + eb.height / 2);
        reach[k] = { inZone: inZone(parts[k]), tapReaches: !!hit && (el === hit || el.contains(hit) || hit.contains(el)), pictureVisiblePx: Math.round(Math.max(0, Math.min(v.bottom, bar) - Math.max(v.top, header))) };
      }
      return {
        zonePx: Math.round(bar - header), viewerPx: Math.round(r(parts.viewer).height), fitsNow, allFit: Object.values(fitsNow).every(Boolean), reach,
        sticky: q('.vsim-bench').hasAttribute('data-sticky'), sw: document.documentElement.scrollWidth - innerWidth, canvases: document.querySelectorAll('canvas').length,
      };
    }, H);
    out.push({ size: `${w}x${h}`, note, text: `${text}%`, ...m });
    if (text !== 100 || h <= 340) await page.screenshot({ path: `docs/implementation/final-stabilization-phase-2-3-readiness/evidence/mobile/landscape-${label}-${w}x${h}-${text}.jpg`, type: 'jpeg', quality: 78 });
    await ctx.close();
  }
}
await browser.close();
fs.writeFileSync(`docs/implementation/final-stabilization-phase-2-3-readiness/evidence/mobile/landscape-${label}.json`, JSON.stringify(out, null, 1));
for (const r of out) console.log(r.size, r.text, 'zone', r.zonePx, 'viewer', r.viewerPx, 'allFit', r.allFit, 'sticky', r.sticky, 'sw', r.sw, 'reach', Object.entries(r.reach).map(([k, v]) => `${k}:${v.inZone ? 'ok' : 'NO'}/${v.tapReaches ? 'tap' : 'BLOCKED'}/${v.pictureVisiblePx}`).join(' '));
