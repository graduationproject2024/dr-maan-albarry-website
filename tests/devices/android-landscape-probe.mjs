// Probe (Android Emulator): what moves the page when a distance is tapped in short landscape.
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
const serial = process.argv[2] || 'emulator-5556';
const ADB = path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk', 'platform-tools', 'adb.exe');
const adb = (...a) => execFileSync(ADB, ['-s', serial, ...a], { encoding: 'utf8' });
const wvBounds = (xml) => { const i = xml.indexOf('class="android.webkit.WebView"'); if (i < 0) return null; const m = xml.slice(i).match(/bounds="\[(\d+),(\d+)\]/); return m ? { left: Number(m[1]), top: Number(m[2]) } : null; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const webviewTop = () => { adb('shell', 'uiautomator', 'dump', '/sdcard/ui.xml'); const b = wvBounds(adb('shell', 'cat', '/sdcard/ui.xml')); if (!b) throw new Error('no WebView on screen'); return b; };
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0].pages().find((p) => p.url().startsWith('http://localhost:4174')) || browser.contexts()[0].pages()[0];
adb('shell', 'settings', 'put', 'system', 'accelerometer_rotation', '0'); adb('shell', 'settings', 'put', 'system', 'user_rotation', '0'); await sleep(1000); adb('shell', 'settings', 'put', 'system', 'user_rotation', '1');
await page.goto('about:blank'); await page.goto('http://localhost:4174/en/lens-lab/', { waitUntil: 'load' });
await page.waitForFunction(() => innerWidth > innerHeight, null, { timeout: 15000 });
await page.locator('#simulator-host').evaluate((e) => e.scrollIntoView());
await page.waitForFunction(() => document.querySelectorAll('#simulator-host canvas').length === 1, null, { timeout: 60000 });
await sleep(1500);
await page.locator('#simulator-host input[data-group="preset"][value="near"] + label').evaluate((e) => e.scrollIntoView({ block: 'center' }));
await sleep(1000);
for (const v of ['distance', 'near', 'intermediate', 'distance', 'near']) {
  await page.evaluate(() => {
    window.__log = [];
    const wrap = (o, k) => { const f = o[k]; o[k] = function (...a) { window.__log.push(`${k}(${JSON.stringify(a).slice(0, 80)}) ${new Error().stack.split('\n').slice(2, 4).map((s) => s.trim()).join(' < ')}`); return f.apply(this, a); }; };
    if (!window.__wrapped) { wrap(window, 'scrollTo'); wrap(window, 'scrollBy'); wrap(Element.prototype, 'scrollIntoView'); wrap(HTMLElement.prototype, 'focus'); window.__wrapped = true; }
    window.__ys = []; window.__vv = [];
    addEventListener('scroll', () => window.__ys.push(Math.round(scrollY)), { passive: true });
    visualViewport.addEventListener('resize', () => window.__vv.push(`${Math.round(visualViewport.height)}/${innerHeight}`));
  });
  const before = await page.evaluate(() => ({ y: Math.round(scrollY), h: innerHeight }));
  const r = await page.locator(`#simulator-host input[data-group="preset"][value="${v}"] + label`).evaluate((e) => { const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2, dpr: devicePixelRatio }; });
  const { left, top } = webviewTop();
  adb('shell', 'input', 'tap', String(Math.round(left + r.x * r.dpr)), String(Math.round(top + r.y * r.dpr)));
  await sleep(1500);
  const after = await page.evaluate(() => ({ y: Math.round(scrollY), h: innerHeight, log: window.__log, ys: window.__ys.slice(0, 12), vv: window.__vv, active: document.activeElement?.outerHTML.slice(0, 80) }));
  console.log(v, `y ${before.y}→${after.y} innerHeight ${before.h}→${after.h} webviewTop ${top}`, JSON.stringify({ ys: after.ys, vv: after.vv, log: after.log, active: after.active }));
}
adb('shell', 'settings', 'put', 'system', 'user_rotation', '0');
process.exit(0); // never browser.close(): over CDP it quits Chrome on the device
