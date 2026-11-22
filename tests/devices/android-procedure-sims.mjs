// Procedure simulators on the Android Emulator (Chrome on Android 14), driven like a person: OS-level taps and swipes
// through adb, device rotation and hardware Back; page state read over Chrome's DevTools socket.
//   adb -s <serial> reverse tcp:4174 tcp:4174
//   adb -s <serial> forward tcp:9222 localabstract:chrome_devtools_remote
//   node tests/devices/android-procedure-sims.mjs <serial> <label>
// Serves: `npx vite preview --port 4174 --strictPort` (production build). Never closes Chrome (browser.close() over CDP
// would quit it on the device).
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const serial = process.argv[2] || 'emulator-5556';
const label = process.argv[3] || serial;
const BASE = 'http://localhost:4174';
const ADB = path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk', 'platform-tools', 'adb.exe');
const OUT = path.resolve('docs/implementation/phase-2-all-procedure-simulators/evidence/android', label);
fs.mkdirSync(OUT, { recursive: true });
const adb = (...a) => execFileSync(ADB, ['-s', serial, ...a], { encoding: 'utf8', maxBuffer: 64 << 20 });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let shotN = 0;
const shot = (name) => { const f = path.join(OUT, `${String(++shotN).padStart(2, '0')}-${name}.png`); fs.writeFileSync(f, execFileSync(ADB, ['-s', serial, 'exec-out', 'screencap', '-p'], { maxBuffer: 64 << 20 })); return path.basename(f); };
function webviewTop() {
  for (let i = 0; i < 4; i++) {
    adb('shell', 'uiautomator', 'dump', '/sdcard/ui.xml');
    const xml = adb('shell', 'cat', '/sdcard/ui.xml');
    const k = xml.indexOf('class="android.webkit.WebView"');
    const m = k >= 0 ? xml.slice(k).match(/bounds="\[(\d+),(\d+)\]/) : null;
    if (m) return { left: Number(m[1]), top: Number(m[2]) };
    execFileSync('powershell', ['-NoProfile', '-Command', 'Start-Sleep -Milliseconds 700']);
  }
  throw new Error('no WebView on screen');
}

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const ctx = browser.contexts()[0];
let page = ctx.pages()[0];
for (const p of ctx.pages()) { try { if (await p.evaluate(() => document.visibilityState) === 'visible') { page = p; break; } } catch { /* closed */ } }
const errors = [];
page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });

/** OS tap on an element's centre (CSS px → screen px). */
async function osTap(selector) {
  const loc = page.locator(selector).first();
  await loc.evaluate((e) => e.scrollIntoView({ block: 'nearest' }));
  await sleep(500);
  const r = await loc.evaluate((e) => { const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2, dpr: devicePixelRatio }; });
  const { left, top } = webviewTop();
  adb('shell', 'input', 'tap', String(Math.round(left + r.x * r.dpr)), String(Math.round(top + r.y * r.dpr)));
  await sleep(600);
}
/** OS swipe across an element (dx, dy in CSS px). */
async function osSwipe(selector, dx, dy, ms = 450) {
  const r = await page.locator(selector).first().evaluate((e) => { const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2, dpr: devicePixelRatio }; });
  const { left, top } = webviewTop();
  const sx = Math.round(left + r.x * r.dpr), sy = Math.round(top + r.y * r.dpr);
  adb('shell', 'input', 'swipe', String(sx), String(sy), String(Math.round(sx + dx * r.dpr)), String(Math.round(sy + dy * r.dpr)), String(ms));
  await sleep(700);
}
const S = () => page.evaluate(() => (window.__procedureSim ? window.__procedureSim.getState() : null));
const rotate = async (landscape) => { adb('shell', 'settings', 'put', 'system', 'accelerometer_rotation', '0'); adb('shell', 'settings', 'put', 'system', 'user_rotation', landscape ? '1' : '0'); await sleep(2500); };

const log = { label, serial, startedAt: new Date().toISOString(), device: {}, steps: [], errors };
log.device = { android: adb('shell', 'getprop', 'ro.build.version.release').trim(), model: adb('shell', 'getprop', 'ro.product.model').trim() };
log.device.chrome = await page.evaluate(() => navigator.userAgent);
const step = async (slug, name, expected, fn) => {
  let actual, ok;
  try { ({ actual, ok } = await fn()); } catch (e) { actual = `ERROR ${String(e).slice(0, 240)}`; ok = false; }
  const s = { slug, name, expected, actual, ok, shot: shot(`${slug}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 48)) };
  log.steps.push(s);
  console.log(`${ok ? 'PASS' : 'FAIL'} [${slug}] ${name} — ${actual}`);
};

const SLUGS = (process.argv[4] || 'lens-implants,icl,laser-vision-correction,keratoconus-cxl,corneal-transplant,intravitreal-injections').split(',');
await rotate(false);
for (const slug of SLUGS) {
  await page.goto(`${BASE}/en/procedures/${slug}/`);
  await sleep(1500);
  await step(slug, 'open and tap Start', 'viewer ready, one canvas', async () => {
    await osTap('#procedure-3d-start');
    for (let i = 0; i < 40 && (await S())?.state !== 'ready'; i++) await sleep(500);
    const st = await S(); const c = await page.locator('#procedure-3d-stage canvas').count();
    return { actual: `state=${st?.state} canvases=${c} dpr=${st?.dpr}`, ok: st?.state === 'ready' && c === 1 };
  });
  await step(slug, 'tap Play, then Pause', 'time advances, then freezes', async () => {
    await osTap('.ssim-play'); await sleep(1800);
    await osTap('.ssim-play'); const a = (await S()).elapsed; await sleep(900); const b = (await S()).elapsed;
    return { actual: `elapsed ${a.toFixed(2)} → ${b.toFixed(2)}`, ok: a > 0.5 && a === b };
  });
  await step(slug, 'swipe sideways on the model', 'the model turns; the page does not scroll away', async () => {
    const t0 = (await S()).camera.theta; const y0 = await page.evaluate(() => scrollY);
    await osSwipe('.ssim-canvas-host canvas', 140, 0);
    const t1 = (await S()).camera.theta; const y1 = await page.evaluate(() => scrollY);
    return { actual: `theta ${t0.toFixed(2)} → ${t1.toFixed(2)}, scrollY ${y0} → ${y1}`, ok: Math.abs(t1 - t0) > 0.1 && Math.abs(y1 - y0) < 40 };
  });
  await step(slug, 'tap Next', 'stage 2', async () => {
    await osTap('[data-act="next"]'); const st = await S();
    return { actual: `stage ${st.stageIndex + 1}/${st.stageCount}`, ok: st.stageIndex >= 1 };
  });
  await step(slug, 'rotate to landscape', 'same stage, model and Play visible together, no overflow', async () => {
    const before = (await S()).stageIndex;
    await rotate(true);
    const st = await S();
    const g = await page.evaluate(() => { const v = document.querySelector('.ssim-viewport').getBoundingClientRect(); return { w: innerWidth, h: innerHeight, vh: Math.round(v.height), over: document.documentElement.scrollWidth - innerWidth }; });
    return { actual: `stage ${st.stageIndex + 1} (was ${before + 1}), ${g.w}x${g.h}, viewport ${g.vh}px, overflow ${g.over}`, ok: st.stageIndex === before && g.over <= 0 && g.vh > 150 };
  });
  await rotate(false);
  await step(slug, 'full screen, then close', 'full screen fills the screen; close leaves no canvas', async () => {
    await osTap('[data-act="expand"]');
    const full = await page.evaluate(() => { const r = document.querySelector('.ssim').getBoundingClientRect(); return Math.round(r.width) === innerWidth && Math.round(r.top) === 0; });
    await osTap('[data-act="expand"]');
    await osTap('.ssim-close');
    const c = await page.locator('canvas').count();
    return { actual: `full=${full}, canvases after close=${c}`, ok: full && c === 0 };
  });
}
await step('site', 'hardware Back', 'goes to the previous procedure page', async () => {
  const u0 = await page.evaluate(() => location.pathname);
  adb('shell', 'input', 'keyevent', '4'); await sleep(2500);
  const u1 = await page.evaluate(() => location.pathname);
  return { actual: `${u0} → ${u1}`, ok: u1 !== u0 };
});
log.finishedAt = new Date().toISOString();
log.summary = { pass: log.steps.filter((s) => s.ok).length, fail: log.steps.filter((s) => !s.ok).length, errors: errors.length };
fs.writeFileSync(path.join(OUT, 'log.json'), JSON.stringify(log, null, 2));
console.log(JSON.stringify(log.summary));
process.exit(0);
