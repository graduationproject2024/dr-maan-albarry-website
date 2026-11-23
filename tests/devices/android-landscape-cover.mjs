// Probe (Android Emulator, landscape): is each Lens Lab control the element actually under its own centre?
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
const serial = process.argv[2] || 'emulator-5556';
const ADB = path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk', 'platform-tools', 'adb.exe');
const adb = (...a) => execFileSync(ADB, ['-s', serial, ...a], { encoding: 'utf8', maxBuffer: 64 << 20 });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0].pages().find((p) => p.url().startsWith('http://localhost:4174')) || browser.contexts()[0].pages()[0];
adb('shell', 'settings', 'put', 'system', 'accelerometer_rotation', '0'); adb('shell', 'settings', 'put', 'system', 'user_rotation', '1');
await page.goto('http://localhost:4174/en/lens-lab/', { waitUntil: 'load' });
await page.waitForFunction(() => innerWidth > innerHeight, null, { timeout: 15000 });
await page.locator('#simulator-host').scrollIntoViewIfNeeded();
await page.waitForFunction(() => document.querySelectorAll('#simulator-host canvas').length === 1, null, { timeout: 60000 });
await sleep(1500);
for (const how of ['after scrollIntoView of the host', 'after the site jump to #simulator']) {
  if (how.includes('jump')) { await page.evaluate(() => window.scrollToSection('simulator')); await sleep(1500); }
  const r = await page.evaluate(() => {
    const hdr = document.getElementById('site-header').getBoundingClientRect();
    const out = { y: Math.round(scrollY), vw: innerWidth, vh: innerHeight, header: [Math.round(hdr.top), Math.round(hdr.bottom)], bench: document.querySelector('#simulator-host .vsim-bench')?.dataset.stack + '/' + document.querySelector('#simulator-host .vsim-bench')?.dataset.flow, items: [] };
    for (const sel of ['input[data-group="preset"][value="near"] + label', 'input[data-group="lensA"][value="trifocal"] + label', 'input[data-group="lighting"][value="night"] + label', '.vsim-more', '.vsim-reset', '[data-ref="stage"]']) {
      const e = document.querySelector(`#simulator-host ${sel}`); if (!e) continue;
      const b = e.getBoundingClientRect(); const x = b.left + b.width / 2, y = b.top + b.height / 2;
      const hit = document.elementFromPoint(x, y);
      out.items.push({ sel: sel.slice(0, 40), rect: [Math.round(b.top), Math.round(b.bottom)], hitIsSelf: !!hit && (hit === e || e.contains(hit)), hit: hit ? (hit.id || hit.className || hit.tagName).toString().slice(0, 40) : null });
    }
    return out;
  });
  console.log(how, JSON.stringify(r));
  fs_shot(how);
}
function fs_shot(name) { const f = path.resolve('docs/implementation/phase-2-advanced-clinical-visualization/evidence/android-emulator', `landscape-cover-${name.includes('jump') ? 'jump' : 'scroll'}.png`); fs.writeFileSync(f, execFileSync(ADB, ['-s', serial, 'exec-out', 'screencap', '-p'], { maxBuffer: 64 << 20 })); }
adb('shell', 'settings', 'put', 'system', 'user_rotation', '0');
process.exit(0); // never browser.close(): over CDP it quits Chrome on the device
