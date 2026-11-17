// Android Emulator journeys (OS SIMULATOR evidence class): real Chrome for Android inside an official Android Virtual
// Device, driven through adb (OS-level touch, hardware Back, rotation, Home) and read through Chrome's DevTools socket.
// Not a physical phone. Usage (see docs/implementation/phase-2-advanced-clinical-visualization/ANDROID_EMULATOR_SETUP.md):
//   adb -s <serial> reverse tcp:4174 tcp:4174 ; adb -s <serial> forward tcp:9222 localabstract:chrome_devtools_remote
//   node tests/devices/android-emulator-journeys.mjs <serial> <label>
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';

const serial = process.argv[2] || 'emulator-5556';
const label = process.argv[3] || serial;
const BASE = 'http://localhost:4174';
const ADB = path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk', 'platform-tools', 'adb.exe');
const OUT = path.resolve('docs/implementation/phase-2-advanced-clinical-visualization/evidence/android-emulator', label);
fs.mkdirSync(OUT, { recursive: true });

const adb = (...a) => execFileSync(ADB, ['-s', serial, ...a], { encoding: 'utf8', maxBuffer: 64 << 20 });
const wvBounds = (xml) => { const i = xml.indexOf('class="android.webkit.WebView"'); if (i < 0) return null; const m = xml.slice(i).match(/bounds="\[(\d+),(\d+)\]/); return m ? { left: Number(m[1]), top: Number(m[2]) } : null; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let shotN = 0;
const shot = (name) => { const f = path.join(OUT, `${String(++shotN).padStart(2, '0')}-${name}.png`); fs.writeFileSync(f, execFileSync(ADB, ['-s', serial, 'exec-out', 'screencap', '-p'], { maxBuffer: 64 << 20 })); return path.basename(f); };
function webviewTop() {
  adb('shell', 'uiautomator', 'dump', '/sdcard/ui.xml');
  const xml = adb('shell', 'cat', '/sdcard/ui.xml');
  const b = wvBounds(xml);
  if (!b) throw new Error('no WebView on screen');
  return b;
}

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const ctx = browser.contexts()[0];
let page = ctx.pages().find((p) => p.url().startsWith(BASE)) || ctx.pages()[0];
const errors = [];
const hook = (p) => { p.on('pageerror', (e) => errors.push(String(e).slice(0, 200))); p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); }); };
hook(page);

/** OS-level tap (adb input) on the centre of an element, mapped from CSS px to screen px. */
async function osTap(selector) {
  const loc = page.locator(selector).first();
  // centre it: an element scrolled to the very top sits under the sticky header, and a real finger would not tap there
  await loc.evaluate((e) => { const b = e.getBoundingClientRect(); if (b.top < 80 || b.bottom > innerHeight - 80) e.scrollIntoView({ block: 'center' }); });
  await sleep(500);
  const r = await loc.evaluate((e) => { const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2, dpr: devicePixelRatio, scrollY: Math.round(scrollY) }; });
  const { left, top } = webviewTop();
  const sx = Math.round(left + r.x * r.dpr), sy = Math.round(top + r.y * r.dpr);
  adb('shell', 'input', 'tap', String(sx), String(sy));
  await sleep(500);
  return { sx, sy, yBefore: r.scrollY }; // the page position just before the finger went down
}
const doc = () => page.evaluate(() => ({ url: location.pathname + location.search, y: Math.round(scrollY), w: innerWidth, h: innerHeight, dpr: devicePixelRatio, lang: document.documentElement.lang, overflow: document.documentElement.scrollWidth - innerWidth }));
const vsim = () => page.evaluate(() => { const r = document.querySelector('#simulator-host .vsim'); const c = document.querySelectorAll('#simulator-host canvas').length; const s = r && r.__vsim ? r.__vsim.getState() : null; return { canvases: c, zoom: r?.dataset.zoom || null, caption: document.querySelector('#simulator-host [data-ref="caption"]')?.innerText.replace(/\s+/g, ' ').trim() || null, checked: [...document.querySelectorAll('#simulator-host .vsim-bench input:checked')].map((i) => `${i.dataset.group}=${i.value}`).join(' ') }; });
const c3d = () => page.evaluate(() => ({ state: document.getElementById('cataract-3d')?.dataset.state || null, canvases: document.querySelectorAll('#cataract-3d-stage canvas').length, mode: document.querySelector('#cataract-3d-stage .csim-btn--play')?.dataset.mode || null, stage: document.querySelector('#cataract-3d-stage [data-ref="stageNum"]')?.textContent || null, scrub: document.querySelector('#cataract-3d-stage .csim-scrubber')?.value || null }));

const log = { label, serial, startedAt: new Date().toISOString(), device: {}, steps: [], errors };
const step = async (journey, name, expected, fn, { pic = true } = {}) => {
  const t0 = Date.now();
  let actual, ok;
  try { ({ actual, ok } = await fn()); } catch (e) { actual = `ERROR ${String(e).slice(0, 300)}`; ok = false; }
  const s = { journey, name, expected, actual, ok, ms: Date.now() - t0, shot: pic ? shot(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)) : null };
  log.steps.push(s);
  console.log(`${ok ? 'PASS' : 'FAIL'} [${journey}] ${name} — ${actual}`);
  return s;
};

log.device = {
  android: adb('shell', 'getprop', 'ro.build.version.release').trim(),
  fingerprint: adb('shell', 'getprop', 'ro.build.fingerprint').trim(),
  avd: adb('shell', 'getprop', 'ro.boot.qemu.avd_name').trim(),
  size: adb('shell', 'wm', 'size').trim(), density: adb('shell', 'wm', 'density').trim(),
  chrome: (adb('shell', 'dumpsys', 'package', 'com.android.chrome').match(/versionName=(\S+)/) || [])[1],
  ram: adb('shell', 'cat', '/proc/meminfo').split('\n')[0].trim()
};
adb('shell', 'settings', 'put', 'system', 'accelerometer_rotation', '0');
adb('shell', 'settings', 'put', 'system', 'user_rotation', '0');

// ---------- Journey B: Lens Lab (English) ----------
await page.goto('about:blank');
await page.goto(`${BASE}/en/lens-lab/`, { waitUntil: 'load' });
log.device.gl = await page.evaluate(() => { const c = document.createElement('canvas'); const g = c.getContext('webgl2') || c.getContext('webgl'); if (!g) return 'no WebGL'; const d = g.getExtension('WEBGL_debug_renderer_info'); return `${g instanceof WebGL2RenderingContext ? 'WebGL2' : 'WebGL1'} ${d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : g.getParameter(g.RENDERER)}`; });
log.device.viewport = await doc();
await step('B', 'Open Lens Lab', 'Page loads, simulator mounts with one canvas', async () => {
  await page.locator('#simulator-host').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelectorAll('#simulator-host canvas').length === 1, null, { timeout: 60000 });
  const v = await vsim(); const d = await doc();
  return { actual: `canvases=${v.canvases} caption="${v.caption}" overflow=${d.overflow}`, ok: v.canvases === 1 && d.overflow <= 0 };
});
for (const [name, sel, expect] of [
  ['Tap Trifocal', '#simulator-host input[data-group="lensA"][value="trifocal"] + label', 'lensA=trifocal'],
  ['Tap Near', '#simulator-host input[data-group="preset"][value="near"] + label', 'preset=near'],
  ['Tap Intermediate', '#simulator-host input[data-group="preset"][value="intermediate"] + label', 'preset=intermediate'],
  ['Tap Far', '#simulator-host input[data-group="preset"][value="distance"] + label', 'preset=distance'],
  ['Tap Night', '#simulator-host input[data-group="lighting"][value="night"] + label', 'lighting=night']
]) {
  await step('B', name, `${expect} checked; closer view; page does not jump`, async () => {
    const at = await osTap(sel); const before = at.yBefore; await sleep(900);
    const after = (await doc()).y; const v = await vsim();
    return { actual: `os tap ${at.sx},${at.sy}; ${v.checked}; zoom=${v.zoom}; caption="${v.caption}"; page moved ${after - before}px`, ok: v.checked.includes(expect) && Math.abs(after - before) <= 2 };
  });
}
await step('B', 'Open More settings', 'Panel opens; no overflow', async () => {
  await osTap('#simulator-host .vsim-more'); await sleep(600);
  const open = await page.locator('#simulator-host .vsim-adv').isVisible(); const d = await doc();
  return { actual: `open=${open} overflow=${d.overflow}`, ok: open && d.overflow <= 0 };
});
await step('B', 'Close More settings', 'Panel closes', async () => {
  await osTap('#simulator-host .vsim-more'); await sleep(600);
  const open = await page.locator('#simulator-host .vsim-adv').isVisible();
  return { actual: `open=${open}`, ok: !open };
});
await step('B', 'Tap Reset', 'Back to the default lens, distance and lighting', async () => {
  await osTap('#simulator-host .vsim-reset'); await sleep(700);
  const v = await vsim(); const d = await doc();
  return { actual: `${v.checked}; url=${d.url}`, ok: !/lighting=night/.test(v.checked) && !/\?/.test(d.url) };
});
await step('B', 'Rotate to landscape', 'Layout fits; one canvas; no sideways scroll', async () => {
  adb('shell', 'settings', 'put', 'system', 'user_rotation', '1');
  await page.waitForFunction(() => innerWidth > innerHeight, null, { timeout: 15000 }); await sleep(1500);
  const d = await doc(); const v = await vsim();
  return { actual: `${d.w}x${d.h} overflow=${d.overflow} canvases=${v.canvases}`, ok: d.w > d.h && d.overflow <= 0 && v.canvases === 1 };
});
await step('B', 'Tap Near in landscape', 'Works sideways; page does not jump', async () => {
  const at = await osTap('#simulator-host input[data-group="preset"][value="near"] + label'); const before = at.yBefore; await sleep(900);
  const after = (await doc()).y; const v = await vsim();
  return { actual: `${v.checked}; page moved ${after - before}px`, ok: v.checked.includes('preset=near') && Math.abs(after - before) <= 2 };
});
await step('B', 'Rotate back to portrait', 'State kept; layout fits', async () => {
  adb('shell', 'settings', 'put', 'system', 'user_rotation', '0');
  await page.waitForFunction(() => innerWidth < innerHeight, null, { timeout: 15000 }); await sleep(1500);
  const d = await doc(); const v = await vsim();
  return { actual: `${d.w}x${d.h} ${v.checked} overflow=${d.overflow}`, ok: d.w < d.h && v.checked.includes('preset=near') && d.overflow <= 0 };
});

// ---------- Journey A/C: 3D viewer (Arabic) ----------
await page.goto('about:blank');
await page.goto(`${BASE}/surgical-education/`, { waitUntil: 'load' });
let tapAt = 0;
await step('A', 'Tap Start the 3D experience', 'Viewer becomes active with one canvas; revealed', async () => {
  tapAt = Date.now(); await osTap('#cataract-3d-start');
  await page.waitForFunction(() => document.getElementById('cataract-3d')?.dataset.state === 'active', null, { timeout: 90000 });
  const ms = Date.now() - tapAt; await sleep(1200);
  const s = await c3d(); const rect = await page.evaluate(() => { const b = document.querySelector('#cataract-3d-stage .csim-playbar').getBoundingClientRect(); return Math.round(b.bottom); }); const d = await doc();
  return { actual: `active after ${ms} ms (tap→active, incl. adb latency); canvases=${s.canvases}; controls bottom ${rect}/${d.h}`, ok: s.state === 'active' && s.canvases === 1 && rect <= d.h };
});
await step('A', 'Tap Start the walkthrough', 'Playback starts (button shows Pause)', async () => {
  await osTap('#cataract-3d-stage [data-ref="start"]'); await sleep(1500); const s = await c3d();
  return { actual: `mode=${s.mode} ${s.stage}`, ok: s.mode === 'pause' };
});
await step('A', 'Tap Pause', 'Playback pauses', async () => {
  await osTap('#cataract-3d-stage [data-ref="playPause"]'); await sleep(600); const s = await c3d();
  return { actual: `mode=${s.mode}`, ok: s.mode === 'play' };
});
await step('A', 'Tap stage 5', 'Stage 5 of 7', async () => {
  await osTap('#cataract-3d-stage .csim-seg[data-seg="4"]'); await sleep(900); const s = await c3d();
  return { actual: `${s.stage} scrub=${s.scrub}`, ok: /5/.test(s.stage || '') };
});
await step('A', 'Drag the scrubber (OS swipe)', 'Scrubber value changes', async () => {
  const before = (await c3d()).scrub;
  const r = await page.locator('#cataract-3d-stage .csim-scrubber').evaluate((e) => { const b = e.getBoundingClientRect(); return { l: b.left + 20, rr: b.right - 20, y: b.top + b.height / 2, dpr: devicePixelRatio }; });
  const { left, top } = webviewTop();
  adb('shell', 'input', 'swipe', String(Math.round(left + r.rr * r.dpr)), String(Math.round(top + r.y * r.dpr)), String(Math.round(left + (r.l + (r.rr - r.l) * 0.35) * r.dpr)), String(Math.round(top + r.y * r.dpr)), '600');
  await sleep(900); const s = await c3d();
  return { actual: `scrub ${before} → ${s.scrub}; ${s.stage}`, ok: s.scrub !== before };
});
await step('A', 'One-finger swipe over the 3D picture', 'The page scrolls (the picture does not trap the finger)', async () => {
  const y0 = (await doc()).y;
  const r = await page.locator('#cataract-3d-stage .csim-viewport').evaluate((e) => { const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height * 0.6, dpr: devicePixelRatio }; });
  const { left, top } = webviewTop();
  adb('shell', 'input', 'swipe', String(Math.round(left + r.x * r.dpr)), String(Math.round(top + r.y * r.dpr)), String(Math.round(left + r.x * r.dpr)), String(Math.round(top + (r.y - 120) * r.dpr)), '400');
  await sleep(900); const y1 = (await doc()).y;
  return { actual: `page ${y0} → ${y1}`, ok: Math.abs(y1 - y0) > 40 };
});
await step('A', 'Explore 3D, then drag to rotate', 'Explore mode on; drag rotates the eye, page stays', async () => {
  await osTap('#cataract-3d-stage [data-ref="touch"]'); await sleep(500);
  const pressed = await page.locator('#cataract-3d-stage [data-ref="touch"]').getAttribute('aria-pressed');
  const y0 = (await doc()).y;
  const screenHash = () => crypto.createHash('sha1').update(execFileSync(ADB, ['-s', serial, 'exec-out', 'screencap', '-p'], { maxBuffer: 64 << 20 })).digest('hex').slice(0, 10);
  await sleep(800); const hash0 = screenHash();
  const r = await page.locator('#cataract-3d-stage .csim-viewport').evaluate((e) => { const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2, dpr: devicePixelRatio }; });
  const { left, top } = webviewTop();
  adb('shell', 'input', 'swipe', String(Math.round(left + (r.x - 80) * r.dpr)), String(Math.round(top + r.y * r.dpr)), String(Math.round(left + (r.x + 80) * r.dpr)), String(Math.round(top + r.y * r.dpr)), '700');
  await sleep(1200); const y1 = (await doc()).y;
  const hash1 = screenHash();
  return { actual: `explore=${pressed}; page ${y0}→${y1}; screen ${hash0}→${hash1}`, ok: pressed === 'true' && Math.abs(y1 - y0) <= 2 && hash0 !== hash1 };
});
await step('A', 'Home, then back to Chrome', 'Viewer still active with one canvas after backgrounding', async () => {
  adb('shell', 'input', 'keyevent', 'KEYCODE_HOME'); await sleep(3000);
  adb('shell', 'monkey', '-p', 'com.android.chrome', '-c', 'android.intent.category.LAUNCHER', '1'); await sleep(3000);
  const s = await c3d(); const lost = await page.evaluate(() => { const c = document.querySelector('#cataract-3d-stage canvas'); const g = c && (c.getContext('webgl2') || c.getContext('webgl')); return g ? g.isContextLost() : null; });
  return { actual: `state=${s.state} canvases=${s.canvases} contextLost=${lost}`, ok: s.state === 'active' && s.canvases === 1 && lost === false };
});
await step('A', 'Rotate to landscape with the viewer open', 'Still one canvas; no sideways scroll', async () => {
  adb('shell', 'settings', 'put', 'system', 'accelerometer_rotation', '0'); adb('shell', 'settings', 'put', 'system', 'user_rotation', '0'); await sleep(800);
  adb('shell', 'settings', 'put', 'system', 'user_rotation', '1');
  await page.waitForFunction(() => innerWidth > innerHeight, null, { timeout: 20000 }); await sleep(1500);
  const s = await c3d(); const d = await doc(); shot('3d-landscape');
  adb('shell', 'settings', 'put', 'system', 'user_rotation', '0');
  await page.waitForFunction(() => innerWidth < innerHeight, null, { timeout: 15000 }); await sleep(1000);
  return { actual: `${d.w}x${d.h} canvases=${s.canvases} overflow=${d.overflow} state=${s.state}`, ok: d.w > d.h && s.canvases === 1 && d.overflow <= 0 && s.state === 'active' };
});

// ---------- Journey G: hardware Back ----------
await page.goto('about:blank'); // a fresh document every time (a goto to the address already shown may not reload it)
await page.goto(`${BASE}/en/about/`, { waitUntil: 'load' });
await sleep(1500);
// an in-site link well down the page, centred the way a reader would have it on screen before tapping
const linkTo = await page.evaluate(() => {
  const a = [...document.querySelectorAll('main a[data-nav]')].find((x) => x.getBoundingClientRect().top + scrollY > 1000 && x.offsetParent);
  if (!a) return null; a.setAttribute('data-probe', ''); a.scrollIntoView({ block: 'center' }); return a.getAttribute('href');
});
await sleep(1000);
const yAbout = (await doc()).y;
await step('G', 'Tap an in-site link further down the page', 'Another page (in-site navigation)', async () => {
  await osTap('[data-probe]'); await sleep(1500); const d = await doc();
  return { actual: `${linkTo} → ${d.url} (left at y=${yAbout})`, ok: !/\/en\/about\/$/.test(d.url) && yAbout > 500 };
});
await step('G', 'Android Back button', 'About page at the same reading position', async () => {
  adb('shell', 'input', 'keyevent', 'KEYCODE_BACK'); await sleep(2000); const d = await doc();
  return { actual: `${d.url} y=${d.y} (was ${yAbout})`, ok: /\/en\/about\/$/.test(d.url) && Math.abs(d.y - yAbout) < 40 };
});
await step('G', 'Full navigation away, then Android Back (BUG-P2-01 path)', 'Returns to the reading position', async () => {
  await page.goto(`${BASE}/en/clinic/`, { waitUntil: 'load' }); await sleep(1200);
  adb('shell', 'input', 'keyevent', 'KEYCODE_BACK'); await sleep(2500); const d = await doc();
  return { actual: `${d.url} y=${d.y} (was ${yAbout})`, ok: /\/en\/about\/$/.test(d.url) && Math.abs(d.y - yAbout) < 40 };
});

// ---------- Load metrics on this device (OS SIMULATOR numbers, not hardware performance) ----------
for (const url of ['/', '/en/lens-lab/']) {
  await page.goto(`${BASE}${url}`, { waitUntil: 'load' }); await sleep(2500);
  const m = await page.evaluate(() => new Promise((res) => { let lcp = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true }); let cls = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); setTimeout(() => { const n = performance.getEntriesByType('navigation')[0]; res({ lcp: Math.round(lcp), cls: Number(cls.toFixed(4)), dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd) }); }, 300); }));
  log.steps.push({ journey: 'perf', name: `load ${url}`, expected: 'measured', actual: JSON.stringify(m), ok: true, ms: 0, shot: null });
  console.log(`PERF ${url} ${JSON.stringify(m)}`);
}

log.finishedAt = new Date().toISOString();
log.summary = { pass: log.steps.filter((s) => s.ok).length, fail: log.steps.filter((s) => !s.ok).length, consoleErrors: errors.length };
fs.writeFileSync(path.join(OUT, 'journey-log.json'), JSON.stringify(log, null, 2));
console.log(JSON.stringify(log.device), JSON.stringify(log.summary));
process.exit(0); // never browser.close(): over CDP it quits Chrome on the device
