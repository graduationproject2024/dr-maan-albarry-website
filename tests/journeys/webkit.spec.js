// WebKit run (Playwright's WebKit build on Windows — NOT Safari on iOS; emulated iPhone 13 descriptor).
// CDP is unavailable in WebKit, so touch swipes/throttling are not used here: taps (locator.tap) and wheel only.
import { test, devices } from '@playwright/test';
import { startJourney, prepare, revealInFreeArea, intercepted, hOverflow, scrollBy } from './harness.js';
import { openUrl, docState, csim, waitCsim, vsimState, waitVsim, BOOKING, NAME } from './site.js';

const { defaultBrowserType, ...iphone } = devices['iPhone 13'];
test.use({ ...iphone, browserName: 'webkit', launchOptions: { args: [] } });
test.setTimeout(180_000);

test('WebKit — English iPhone journey with both simulators', async ({ page }, testInfo) => {
  await prepare(page, { theme: 'light', clearStorage: true, glProbe: true });
  const j = await startJourney(page, testInfo, { id: 'webkit-iphone', persona: 'C (subset) on WebKit', objective: 'Same core path as persona C, rendered by WebKit: language switch, procedure page, 3D viewer, vision simulator, theme, booking.', device: 'iPhone 13 descriptor (390×664, DPR 3, touch) in Playwright WebKit 27.2 on Windows', browser: 'webkit (Playwright build v2370, Windows) — not iOS Safari', language: 'ar → en', theme: 'light → dark', startUrl: '/' });
  const lbl = (g, v) => page.locator(`#simulator-host label[for$="-${g}-${v}"]`);

  await j.step('Open / and tap "EN"', 'English home', async () => { await openUrl(page, '/'); await page.locator('.site-header .lang-switch').tap(); await page.waitForURL(/\/en\/$/); const s = await docState(page); return { actual: `${s.path} ${s.lang}/${s.dir}`, ok: s.lang === 'en' && s.dir === 'ltr' }; }, { shot: true });
  await j.step('Tap the cataract card', 'Cataract page', async () => { const l = page.locator('#procedures .proc-card-link[href$="procedures/cataract-surgery/"]'); await revealInFreeArea(page, l); await l.tap(); await page.waitForURL(/cataract-surgery\/$/); await page.locator('#p-anatomy').waitFor(); const s = await docState(page); return { actual: s.h1, ok: s.h1 === NAME['cataract-surgery'].en }; });
  await j.step('Tap Start the 3D experience', 'Viewer ready with one canvas', async () => { const b = page.locator('#cataract-3d-start'); await revealInFreeArea(page, b); await b.tap(); const s = await waitCsim(page, ['ready', 'fallback'], 60000); return { actual: `state=${s.state} canvases=${s.canvases} fallback=${s.fallback}`, ok: s.state === 'ready' && s.canvases === 1 }; }, { shot: true });
  await j.step('Tap play, Next, pause', 'Playback toggles; stage advances', async () => {
    await page.locator('#cataract-3d-stage [data-ref="start"]').tap(); await page.waitForTimeout(800); const a = await csim(page);
    const n = page.locator('#cataract-3d-stage [data-ref="next"]'); await revealInFreeArea(page, n); await n.tap(); await page.waitForTimeout(300);
    const pp = page.locator('#cataract-3d-stage [data-ref="playPause"]'); await pp.tap(); await page.waitForTimeout(300); const b = await csim(page);
    return { actual: `after play mode=${a.mode}; after next+pause ${b.stageNum} mode=${b.mode}`, ok: a.mode === 'pause' && b.mode === 'play' };
  });
  await j.step('Tap "Back to site" (close)', 'Viewer closed', async () => { const c = page.locator('#cataract-3d-stage [data-ref="close"]'); await revealInFreeArea(page, c); await c.tap(); await page.waitForTimeout(300); const s = await csim(page); return { actual: `mounted=${s.mounted}`, ok: !s.mounted }; });
  await j.step('Go to the home simulator, choose trifocal and compare', 'Vision simulator renders in WebKit; controls work', async () => {
    await page.goto('/en/#simulator'); await page.locator('main h1').waitFor(); await page.locator('#simulator-host').scrollIntoViewIfNeeded();
    const s0 = await waitVsim(page, 60000);
    await revealInFreeArea(page, lbl('lensA', 'trifocal')); await lbl('lensA', 'trifocal').tap();
    const sw = page.locator('#simulator-host .vsim-switch'); await revealInFreeArea(page, sw); await sw.tap(); await page.waitForTimeout(300);
    const s = await vsimState(page);
    return { actual: `canvases=${s0.canvases} fallback=${s0.fallback}; lens=${s.lens} compare=${s.compare}`, ok: s.lens === 'trifocal' && s.compare };
  }, { shot: true });
  await j.step('Tap the theme switch', 'Dark everywhere', async () => { await scrollBy(page, -100000); await page.waitForTimeout(300); await page.locator('#theme-toggle-btn').tap(); const s = await docState(page); const v = await vsimState(page); return { actual: `site=${s.theme} vsim=${v.theme}`, ok: s.theme === 'dark' && v.theme === 'dark' }; });
  await j.step('Tap Book in the bottom bar', 'Booking portal (intercepted)', async () => { await page.locator('#booking-bar .booking-action-book').tap(); const h = await intercepted(page); return { actual: `→ ${h.at(-1)?.href}; overflow ${await hOverflow(page)}px`, ok: h.at(-1)?.href === BOOKING }; }, { shot: true });
  await j.finish();
});
