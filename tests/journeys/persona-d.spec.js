// Persona D — slow network / low-power phone. Emulated Galaxy S9+ (320 px wide), Chromium, touch,
// CDP network throttling (Fast 3G profile) + CDP CPU throttling ×4.
// throttled load → scroll the images → procedure page → load 3D → interrupt loading → retry → navigate stages
import { test } from '@playwright/test';
import { startJourney, prepare, device, rect, swipe, throttle, hOverflow } from './harness.js';
import { docState, csim, waitCsim, NAME } from './site.js';

test.use({ ...device('Galaxy S9+') });
test.setTimeout(300_000);

test('Persona D — slow network, low-power phone', async ({ page }, testInfo) => {
  await prepare(page, { theme: 'light', clearStorage: true });
  const cdp = await throttle(page, 'fast-3g', 4);
  const j = await startJourney(page, testInfo, {
    id: 'persona-d', persona: 'D — slow network / low-power phone', objective: 'Use the site on a slow connection and a slow CPU, including giving up on a slow 3D load and retrying.',
    device: 'Galaxy S9+ (Playwright descriptor: 320×658, DPR 4.5, Android UA, touch)', language: 'ar', theme: 'light',
    network: 'Fast 3G (CDP: 562.5 ms RTT, 1.44 Mbit/s down) + CPU ×4 slowdown (CDP Emulation.setCPUThrottlingRate)', startUrl: '/',
  });

  await j.step('Open the home page on the throttled connection', 'Main heading readable within 10 s; LCP and CLS recorded', async () => {
    await page.addInitScript(() => {
      window.__lcp = 0; window.__cls = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    const t0 = Date.now();
    await page.goto('/', { waitUntil: 'commit' });
    await page.locator('#app main h1').waitFor({ timeout: 60000 });
    const tH1 = Date.now() - t0;
    await page.waitForLoadState('load', { timeout: 120000 });
    const tLoad = Date.now() - t0;
    await page.waitForTimeout(1000);
    const m = await page.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: window.__cls, bytes: performance.getEntriesByType('resource').reduce((a, r) => a + (r.transferSize || 0), 0) + (performance.getEntriesByType('navigation')[0]?.transferSize || 0) }));
    j.metrics = { tH1, tLoad, ...m };
    return { actual: `h1 after ${tH1} ms, load event ${tLoad} ms, LCP ${m.lcp} ms, transferred ${(m.bytes / 1024).toFixed(0)} KiB`, ok: tH1 < 10000 };
  }, { shot: true, timeout: 150000 });

  await j.step('Watch the first screen while the slow page finishes loading', 'Layout stays put: cumulative layout shift < 0.1', async () => {
    const cls = await page.evaluate(() => window.__cls);
    j.metrics.cls = cls;
    return { actual: `CLS ${cls.toFixed(3)}`, ok: cls < 0.1 };
  }, { critical: false });

  await j.step('Swipe down through the procedure cards (images)', 'Each card shows an image or its line-drawing fallback; no broken images; page keeps up', async () => {
    let s = null;
    const cards = page.locator('#procedures .proc-card');
    for (let i = 0; i < 25; i++) {
      s = await swipe(page, { x: 160, y: 520, dy: -380, cdp: s });
      const last = await rect(cards.last());
      if (last.bottom < 600) break;
    }
    await page.waitForTimeout(3000);
    const st = await cards.evaluateAll((els) => els.map((c) => { const img = c.querySelector('img'); return img ? (img.complete ? (img.naturalWidth > 0 ? 'img' : 'broken') : 'pending') : (c.querySelector('.illus.is-plate') ? 'plate' : 'none'); }));
    return { actual: `cards: ${st.join(', ')}`, ok: st.every((x) => x === 'img' || x === 'plate') };
  }, { shot: true, timeout: 90000 });

  await j.step('Tap the cataract card\'s details link', 'Cataract page opens (content chunk loads over the slow link)', async () => {
    const link = page.locator('#procedures .proc-card-link[href$="procedures/cataract-surgery/"]');
    await link.scrollIntoViewIfNeeded();
    const t0 = Date.now();
    await link.tap();
    await page.waitForURL(/procedures\/cataract-surgery\/$/, { timeout: 30000 });
    await page.locator('#p-anatomy').waitFor({ timeout: 30000 });
    const s = await docState(page);
    return { actual: `${s.path} h1="${s.h1}" after ${Date.now() - t0} ms`, ok: s.h1 === NAME['cataract-surgery'].ar };
  }, { timeout: 60000 });

  await j.step('Scroll to the 3D section and tap Start', 'Button immediately shows a busy "جارٍ التحميل…" state', async () => {
    const btn = page.locator('#cataract-3d-start');
    await btn.scrollIntoViewIfNeeded();
    await btn.tap();
    await page.waitForTimeout(150);
    const busy = await btn.getAttribute('aria-busy');
    const label = await btn.locator('.btn-label').innerText();
    const s = await csim(page);
    return { actual: `aria-busy=${busy}, label="${label}", section=${s.section}`, ok: busy === 'true' && /التحميل/.test(label) && s.section === 'loading' };
  }, { shot: true });

  await j.step('Give up while it is still loading: tap the "الرئيسية" breadcrumb', 'Home page opens; the half-loaded 3D never appears; no errors', async () => {
    await page.mouse.wheel(0, -50000); await page.waitForTimeout(300);
    await page.locator('.crumbs a').first().tap();
    await page.waitForURL(/\/$/, { timeout: 30000 });
    await page.waitForTimeout(8000); // let the abandoned module finish downloading
    const s = await csim(page);
    const gl = await page.evaluate(() => window.__glLive());
    return { actual: `path=${(await docState(page)).path}; 3D mounted=${s.mounted}; section=${s.section}; WebGL created=${gl.created} live=${gl.live}`, ok: !s.mounted && s.section === 'idle' };
  }, { timeout: 60000 });

  await j.step('Press back to return to the cataract page', 'Cataract page; 3D section idle with the Start button', async () => {
    await page.goBack();
    await page.waitForURL(/procedures\/cataract-surgery\/$/);
    await page.waitForTimeout(500);
    const s = await csim(page);
    return { actual: `section=${s.section}, mounted=${s.mounted}`, ok: s.section === 'idle' && !s.mounted };
  });

  await j.step('Tap Start again (retry)', 'The 3D viewer becomes ready', async () => {
    const btn = page.locator('#cataract-3d-start');
    await btn.scrollIntoViewIfNeeded();
    const t0 = Date.now();
    await btn.tap();
    const s = await waitCsim(page, ['ready', 'fallback'], 120000);
    j.metrics.retry3D = Date.now() - t0;
    return { actual: `state=${s.state} after ${Date.now() - t0} ms; canvases=${s.canvases}`, ok: s.state === 'ready' };
  }, { shot: true, timeout: 130000 });

  await j.step('Tap Next three times', 'Stage 4 of 7 shown; buttons respond on the slow CPU', async () => {
    const next = page.locator('#cataract-3d-stage [data-ref="next"]');
    const t0 = Date.now();
    for (let i = 0; i < 3; i++) { await next.tap(); await page.waitForTimeout(300); }
    const s = await csim(page);
    return { actual: `${s.stageNum} "${s.stageTitle}" (${Date.now() - t0} ms for 3 taps)`, ok: /4/.test(s.stageNum.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))) };
  }, { shot: true });

  await j.step('Check layout at 320 px', 'No horizontal overflow', async () => {
    const ov = await hOverflow(page);
    return { actual: `overflow ${ov}px`, ok: ov <= 0 };
  }, { critical: false });

  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await j.finish({ extra: { metrics: j.metrics } });
});
