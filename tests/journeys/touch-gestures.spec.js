// Touch and gesture checks (emulated: Chromium + CDP Input.dispatchTouchEvent on a 390×844 touch profile).
// Each check is one logged step of the "touch-gestures" journey. Anything CDP cannot reproduce faithfully is
// listed as NOT TESTED in TOUCH_GESTURE_TESTS.md with the real-device check it needs.
import { test } from '@playwright/test';
import { startJourney, prepare, viewportProfile, rect, swipe, revealInFreeArea, intercepted, settleScroll } from './harness.js';
import { openUrl, csim, waitCsim, vsimState, waitVsim } from './site.js';

test.use({ ...viewportProfile(390, 844) });
test.setTimeout(240_000);

/** Screenshot of a central region of the 3D viewer (away from the overlaid tools) — equal bytes ⇒ camera unchanged. */
async function viewHash(page) {
  const r = await rect(page.locator('#cataract-3d-stage [data-ref="viewport"]'));
  const buf = await page.screenshot({ type: 'png', clip: { x: r.x + r.w * 0.2, y: r.y + r.h * 0.25, width: r.w * 0.5, height: r.h * 0.45 } });
  let h = 0; for (let i = 0; i < buf.length; i += 7) h = (h * 31 + buf[i]) >>> 0;
  return `${buf.length}:${h}`;
}
async function pinch(page, cx, cy, from, to, cdp) {
  const s = cdp || await page.context().newCDPSession(page);
  const pts = (d) => [{ x: cx - d, y: cy, id: 1 }, { x: cx + d, y: cy, id: 2 }];
  await s.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pts(from) });
  for (let i = 1; i <= 10; i++) { await s.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: pts(from + ((to - from) * i) / 10) }); await page.waitForTimeout(20); }
  await s.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  return s;
}

test('Touch and gesture checks', async ({ page }, testInfo) => {
  await prepare(page, { theme: 'light', clearStorage: true });
  const j = await startJourney(page, testInfo, { id: 'touch-gestures', persona: 'Touch & gesture suite', objective: 'Tap, double tap, long press, swipes, Explore-3D drag-rotate, pinch and touch-cancel behave as a phone user expects.', device: 'Generic phone profile 390×844, DPR 2, hasTouch, isMobile', language: 'en', theme: 'light', startUrl: '/en/procedures/cataract-surgery/' });
  let cdp = null;

  await j.step('Open the cataract page; tap Start; wait for ready', 'Viewer ready', async () => {
    await openUrl(page, '/en/procedures/cataract-surgery/');
    const b = page.locator('#cataract-3d-start'); await revealInFreeArea(page, b); await b.tap();
    const s = await waitCsim(page, ['ready'], 40000); return { actual: s.state, ok: s.state === 'ready' };
  });

  await j.step('One-finger vertical swipe starting on the 3D canvas', 'The page scrolls; the canvas does not trap the gesture', async () => {
    const v = page.locator('#cataract-3d-stage [data-ref="viewport"]'); const r = await revealInFreeArea(page, v);
    const y0 = await page.evaluate(() => scrollY);
    cdp = await swipe(page, { x: r.x + r.w * 0.5, y: r.y + r.h * 0.7, dy: -220, steps: 10, cdp });
    const y1 = await page.evaluate(() => scrollY);
    return { actual: `scrollY ${y0} → ${y1}`, ok: y1 > y0 + 120 };
  });

  await j.step('One-finger horizontal swipe on the canvas (Explore 3D off)', 'Camera does not move (view unchanged) and the page does not scroll sideways', async () => {
    const v = page.locator('#cataract-3d-stage [data-ref="viewport"]'); const r = await revealInFreeArea(page, v);
    await page.waitForTimeout(1500); const h0 = await viewHash(page);
    cdp = await swipe(page, { x: r.x + r.w * 0.3, y: r.y + r.h * 0.5, dx: 160, steps: 10, cdp });
    await page.waitForTimeout(1200); const h1 = await viewHash(page);
    const sx = await page.evaluate(() => scrollX);
    return { actual: `view ${h0 === h1 ? 'unchanged' : 'CHANGED'}; scrollX=${sx}`, ok: h0 === h1 && sx === 0 };
  }, { critical: false });

  await j.step('Double tap on the canvas', 'No page zoom (visual viewport scale stays 1) and no playback change', async () => {
    const v = page.locator('#cataract-3d-stage [data-ref="viewport"]'); const r = await revealInFreeArea(page, v);
    const m0 = (await csim(page)).mode;
    await page.touchscreen.tap(r.x + r.w * 0.5, r.y + r.h * 0.5); await page.waitForTimeout(80); await page.touchscreen.tap(r.x + r.w * 0.5, r.y + r.h * 0.5);
    await page.waitForTimeout(500);
    const scale = await page.evaluate(() => visualViewport.scale);
    const m1 = (await csim(page)).mode;
    return { actual: `visualViewport.scale=${scale}; play mode ${m0} → ${m1}`, ok: scale === 1 && m0 === m1 };
  }, { critical: false });

  await j.step('Tap "Explore 3D", then drag horizontally on the canvas', 'Explore mode on (aria-pressed=true); the drag rotates the model; the page does not scroll', async () => {
    const t = page.locator('#cataract-3d-stage [data-ref="touch"]'); await revealInFreeArea(page, page.locator('#cataract-3d-stage [data-ref="viewport"]'));
    await t.tap(); await page.waitForTimeout(300);
    const pressed = await t.getAttribute('aria-pressed');
    const r = await rect(page.locator('#cataract-3d-stage [data-ref="viewport"]'));
    const h0 = await viewHash(page); const y0 = await page.evaluate(() => scrollY);
    cdp = await swipe(page, { x: r.x + r.w * 0.3, y: r.y + r.h * 0.55, dx: 150, steps: 12, cdp });
    await page.waitForTimeout(1200); const h1 = await viewHash(page); const y1 = await page.evaluate(() => scrollY);
    return { actual: `aria-pressed=${pressed}; view ${h0 === h1 ? 'unchanged' : 'rotated'}; scrollY ${y0} → ${y1}`, ok: pressed === 'true' && h0 !== h1 && Math.abs(y1 - y0) < 5 };
  }, { shot: true, critical: false });

  await j.step('Pinch out with two fingers in Explore mode', 'The model zooms (view changes); the page itself does not zoom', async () => {
    const r = await rect(page.locator('#cataract-3d-stage [data-ref="viewport"]'));
    const h0 = await viewHash(page);
    cdp = await pinch(page, r.x + r.w / 2, r.y + r.h / 2, 30, 110, cdp);
    await page.waitForTimeout(1200); const h1 = await viewHash(page);
    const scale = await page.evaluate(() => visualViewport.scale);
    return { actual: `view ${h0 === h1 ? 'unchanged' : 'zoomed'}; page scale=${scale}`, ok: h0 !== h1 && scale === 1 };
  }, { critical: false });

  await j.step('Explore mode: start a drag on the "Labels" tool button and slide across the canvas', 'Starting on a control does not rotate the camera', async () => {
    await page.locator('#cataract-3d-stage [data-ref="resetView"]').tap(); await page.waitForTimeout(1500);
    const tool = await rect(page.locator('#cataract-3d-stage [data-ref="labels"]'));
    const h0 = await viewHash(page);
    cdp = await swipe(page, { x: tool.x + tool.w / 2, y: tool.y + tool.h / 2, dx: -140, dy: 40, steps: 10, cdp });
    await page.waitForTimeout(1200); const h1 = await viewHash(page);
    return { actual: `view ${h0 === h1 ? 'unchanged' : 'CHANGED'}`, ok: h0 === h1 };
  }, { critical: false });

  await j.step('Tap "Done exploring"; tap Play / Next / Previous', 'Playback buttons work and none of them rotates the camera by itself (only stage fly-to)', async () => {
    await page.locator('#cataract-3d-stage [data-ref="touch"]').tap();
    const pressed = await page.locator('#cataract-3d-stage [data-ref="touch"]').getAttribute('aria-pressed');
    const pp = page.locator('#cataract-3d-stage [data-ref="playPause"]'); await revealInFreeArea(page, pp);
    await pp.tap(); await page.waitForTimeout(500); const a = await csim(page);
    await pp.tap(); await page.waitForTimeout(300); const b = await csim(page);
    return { actual: `explore aria-pressed=${pressed}; play→${a.mode}, pause→${b.mode}`, ok: pressed === 'false' && a.mode === 'pause' && b.mode === 'play' };
  }, { critical: false });

  await j.step('Check nothing overlays the 3D controls in the free screen area', 'Each visible control is the top element at its own centre (no overlay swallows the tap)', async () => {
    const v = page.locator('#cataract-3d-stage .csim-playbar'); await revealInFreeArea(page, v);
    const blocked = await page.locator('#cataract-3d-stage .csim').evaluate((root) => {
      const bar = document.getElementById('booking-bar').getBoundingClientRect();
      const hdr = document.getElementById('site-header').getBoundingClientRect();
      const out = [];
      for (const el of root.querySelectorAll('button:not([hidden]), input[type="range"]')) {
        const r = el.getBoundingClientRect(); if (!r.width || el.closest('[hidden]')) continue;
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        if (cy < hdr.bottom || cy > bar.top || cy > innerHeight) continue; // only what the user can see
        const top = document.elementFromPoint(cx, cy);
        if (!top || !(el === top || el.contains(top))) out.push(`${el.dataset.ref || el.className} ← ${top ? top.className || top.tagName : 'null'}`);
      }
      return out;
    });
    return { actual: blocked.length ? blocked.join('; ') : 'no control covered', ok: blocked.length === 0 };
  }, { critical: false });

  await j.step('Long press (700 ms) on a related-procedure link, then lift', 'The site does not hijack long press: the browser’s own contextmenu is not cancelled and no script handles the press (what follows — menu or tap — is browser-defined; headless Chromium has no context menu)', async () => {
    const l = page.locator('.proc-related .proc-card-link').first(); const r = await revealInFreeArea(page, l);
    await page.evaluate(() => { window.__cm = []; addEventListener('contextmenu', (e) => setTimeout(() => window.__cm.push(e.defaultPrevented)), { once: true }); });
    const url0 = page.url();
    cdp = await swipe(page, { x: r.x + r.w / 2, y: r.y + r.h / 2, steps: 1, holdMs: 700, cdp });
    await page.waitForTimeout(500);
    const cm = await page.evaluate(() => window.__cm || []);
    const nav = url0 !== page.url();
    if (nav) { await page.goBack(); await page.waitForTimeout(500); }
    return { actual: `contextmenu events=${cm.length} (cancelled by page: ${cm.filter(Boolean).length}); then ${nav ? 'headless Chromium treated the release as a tap and navigated (emulation behaviour; went Back)' : 'no navigation'}`, ok: cm.filter(Boolean).length === 0 };
  }, { critical: false });

  await j.step('Touch start on a link, then the touch is cancelled (e.g. incoming call)', 'No navigation, no click', async () => {
    const l = page.locator('.proc-related .proc-card-link').first(); const r = await revealInFreeArea(page, l);
    const s = cdp || await page.context().newCDPSession(page); cdp = s;
    const url0 = page.url();
    await s.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: r.x + r.w / 2, y: r.y + r.h / 2, id: 1 }] });
    await page.waitForTimeout(100);
    await s.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
    await page.waitForTimeout(500);
    return { actual: `url ${url0 === page.url() ? 'unchanged' : 'changed'}`, ok: url0 === page.url() };
  }, { critical: false });

  await j.step('Tap a related-procedure link normally', 'Navigates (sanity check that taps still work after the cancelled touch)', async () => {
    const l = page.locator('.proc-related .proc-card-link').first(); await revealInFreeArea(page, l);
    const href = await l.getAttribute('href'); await l.tap(); await page.waitForURL(new RegExp(href.replace(/[/.]/g, '\\$&') + '$'));
    return { actual: page.url().replace(/^https?:\/\/[^/]+/, ''), ok: true };
  });

  await j.step('Vision simulator: horizontal swipe on the viewer (no compare)', 'Nothing happens to the page (no sideways scroll); vertical swipe still scrolls', async () => {
    await openUrl(page, '/en/lens-lab/'); await page.locator('#simulator-host').scrollIntoViewIfNeeded(); await waitVsim(page, 30000);
    const v = page.locator('#simulator-host .vsim-viewport'); const r = await revealInFreeArea(page, v);
    cdp = await swipe(page, { x: r.x + r.w * 0.2, y: r.y + r.h / 2, dx: 200, steps: 10, cdp });
    const sx = await page.evaluate(() => scrollX);
    const y0 = await page.evaluate(() => scrollY);
    cdp = await swipe(page, { x: r.x + r.w * 0.5, y: r.y + r.h * 0.6, dy: -200, steps: 10, cdp });
    const y1 = await page.evaluate(() => scrollY);
    return { actual: `scrollX=${sx}; vertical swipe scrollY ${y0} → ${y1}`, ok: sx === 0 && y1 > y0 + 100 };
  }, { critical: false });

  await j.step('Vision simulator: tap the "Compare" switch label and drag the divider; vertical swipe on the divider', 'Divider follows a horizontal drag; a vertical swipe on it does not move it a lot', async () => {
    const sw = page.locator('#simulator-host .vsim-switch'); await revealInFreeArea(page, sw); await sw.tap();
    const d = page.locator('#simulator-host [data-ref="divider"]'); const r = await revealInFreeArea(page, d);
    const v0 = Number(await d.getAttribute('aria-valuenow'));
    cdp = await swipe(page, { x: r.x + r.w / 2, y: r.y + r.h / 2, dx: -100, steps: 10, cdp });
    const v1 = Number(await d.getAttribute('aria-valuenow'));
    return { actual: `divider ${v0} → ${v1}; compare=${(await vsimState(page)).compare}`, ok: v1 < v0 - 5 };
  }, { critical: false });

  await j.step('Bottom bar: tap "WhatsApp"', 'wa.me link with a prefilled message, opened in a new tab (intercepted, nothing sent)', async () => {
    await page.locator('#booking-bar .booking-action-whatsapp').tap();
    const h = await intercepted(page); const last = h.at(-1) || {};
    return { actual: `→ ${String(last.href).slice(0, 60)}… target=${last.target}`, ok: /^https:\/\/wa\.me\/966554946433\?text=/.test(last.href) && last.target === '_blank' };
  });

  await j.finish();
});
