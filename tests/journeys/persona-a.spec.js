// Persona A — older Arabic-speaking patient on an Android phone (emulated Galaxy S8, Chromium, touch).
// home → identify the doctor → find cataract → procedure page → read → start 3D → pause → read stage → close → booking
import { test } from '@playwright/test';
import { startJourney, prepare, device, rect, swipe, smallText, smallTargets, intercepted, hOverflow } from './harness.js';
import { openUrl, docState, csim, waitCsim, BOOKING, NAME, DOCTOR_NAME } from './site.js';

test.use({ ...device('Galaxy S8') });
test.setTimeout(150_000);

test('Persona A — older Arabic-speaking patient', async ({ page }, testInfo) => {
  await prepare(page, { theme: 'light', clearStorage: true });
  const j = await startJourney(page, testInfo, {
    id: 'persona-a', persona: 'A — older Arabic-speaking patient', objective: 'Understand cataract surgery, watch the 3D explanation at his own pace, then find how to book.',
    device: 'Galaxy S8 (Playwright descriptor: 360×740, DPR 3, Android UA, touch)', language: 'ar', theme: 'light', startUrl: '/',
  });

  await j.step('Open the Arabic home page', 'Arabic RTL page with the doctor\'s name as the main heading', async () => {
    const s = await openUrl(page, '/');
    return { actual: `lang=${s.lang} dir=${s.dir} h1="${s.h1}"`, ok: s.lang === 'ar' && s.dir === 'rtl' && s.h1 === DOCTOR_NAME.ar };
  }, { shot: true });

  await j.step('Look at the first screen to identify the doctor', 'Portrait loaded, specialty and current role visible above the fold; body text ≥16px', async () => {
    const img = page.locator('.hero-portrait img');
    const loaded = await img.evaluate((el) => el.complete && el.naturalWidth > 0);
    const role = await page.locator('.hero-role-text').innerText();
    const sub = await page.locator('.hero-specialty-subtitle').evaluate((el) => ({ fs: parseFloat(getComputedStyle(el).fontSize), bottom: el.getBoundingClientRect().bottom }));
    const vh = page.viewportSize().height;
    return { actual: `portrait loaded=${loaded}; role="${role.trim()}"; subtitle ${sub.fs}px, bottom at ${Math.round(sub.bottom)}px of ${vh}px`, ok: loaded && role.trim().length > 0 && sub.fs >= 16 && sub.bottom <= vh };
  });

  await j.step('Swipe up with one finger until the cataract procedure card is on screen', 'The page scrolls under the finger; the cataract card becomes visible', async () => {
    const card = page.locator('#procedures :is(.proc-card, .spec-card)').filter({ hasText: NAME['cataract-surgery'].ar }).first();
    const y0 = await page.evaluate(() => scrollY);
    let cdp = null;
    for (let i = 0; i < 20; i++) {
      const r = await rect(card);
      // Phase 1: the cataract card is the large lead specialty card (~500 px at 360 px), so "on screen" means its
      // top and its details link are in view; the finger swipes back if it overshoots
      const l = await rect(card.locator('.proc-card-link'));
      if (r.y > 60 && r.y < 500 && l.bottom < 740) break;
      cdp = await swipe(page, { x: 180, y: 600, dy: r.y > 60 ? -380 : 300, cdp });
      await page.waitForTimeout(250);
    }
    const r = await rect(card);
    const y1 = await page.evaluate(() => scrollY);
    return { actual: `scrollY ${y0} → ${y1}; card top ${Math.round(r.y)}px, height ${Math.round(r.h)}px`, ok: y1 > y0 && r.y >= 0 && r.y < 740 };
  }, { shot: true });

  await j.step('Tap "تفاصيل الإجراء" on the cataract card', 'The cataract surgery page opens at the top with its title', async () => {
    const card = page.locator('#procedures :is(.proc-card, .spec-card)').filter({ hasText: NAME['cataract-surgery'].ar }).first();
    await card.locator('.proc-card-link').tap();
    await page.waitForURL(/\/procedures\/cataract-surgery\/$/);
    await page.locator('#p-anatomy').waitFor();
    const s = await docState(page);
    return { actual: `path=${s.path} h1="${s.h1}" scrollY=${s.scrollY}`, ok: s.h1 === NAME['cataract-surgery'].ar && s.scrollY < 50 };
  }, { shot: true });

  await j.step('Read the explanation text', 'Body paragraphs ≥16px with line-height ≥1.5; no horizontal scrolling', async () => {
    const small = await smallText(page, '.proc-sec p:not(.type-code), .proc-sec li, .proc-sec dd, .proc-lede');
    const lh = await page.locator('.proc-body p').first().evaluate((el) => parseFloat(getComputedStyle(el).lineHeight) / parseFloat(getComputedStyle(el).fontSize));
    const fs = await page.locator('.proc-body p').first().evaluate((el) => getComputedStyle(el).fontSize);
    const ov = await hOverflow(page);
    return { actual: `first paragraph ${fs}, line-height ×${lh.toFixed(2)}; ${small.length} text elements <16px${small.length ? ': ' + small.slice(0, 4).join(', ') : ''}; overflow ${ov}px`, ok: small.length === 0 && lh >= 1.5 && ov <= 0 };
  }, { critical: false });

  await j.step('Scroll down to the 3D section and tap "ابدأ التجربة ثلاثية الأبعاد"', 'The 3D viewer loads and offers its start control', async () => {
    const btn = page.locator('#cataract-3d-start');
    await btn.scrollIntoViewIfNeeded();
    await btn.tap();
    const s = await waitCsim(page, ['ready', 'paused', 'playing', 'transitioning', 'fallback'], 40000);
    return { actual: `section=${s.section} state=${s.state} canvases=${s.canvases} startOverlay=${s.startOverlay}`, ok: s.section === 'active' && s.state === 'ready' && s.canvases === 1 };
  }, { shot: true });

  await j.step('Tap the play button inside the viewer', 'Animation plays (button turns into pause)', async () => {
    const st = page.locator('#cataract-3d-stage [data-ref="start"]');
    if (await st.isVisible()) await st.tap(); else await page.locator('#cataract-3d-stage [data-ref="playPause"]').tap();
    await page.waitForTimeout(1500);
    const s = await csim(page);
    return { actual: `state=${s.state} button mode=${s.mode} scrubber=${s.scrubber}`, ok: s.mode === 'pause' && s.scrubber > 0 };
  });

  await j.step('Tap pause', 'Animation stops: the scrubber no longer advances', async () => {
    await page.locator('#cataract-3d-stage [data-ref="playPause"]').tap();
    await page.waitForTimeout(400);
    const a = await csim(page);
    await page.waitForTimeout(1200);
    const b = await csim(page);
    return { actual: `state=${b.state} mode=${b.mode}; scrubber ${a.scrubber} → ${b.scrubber}`, ok: b.mode === 'play' && a.scrubber === b.scrubber };
  }, { shot: true });

  await j.step('Read the current stage panel', 'Stage number, title and text are present and readable (≥16px body text)', async () => {
    const s = await csim(page);
    const fs = await page.locator('#cataract-3d-stage [data-ref="stageText"]').evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    return { actual: `${s.stageNum} — "${s.stageTitle}" (${fs}px): ${s.stageText.slice(0, 60)}…`, ok: !!s.stageTitle && s.stageText.length > 20 && fs >= 16 };
  }, { critical: false });

  await j.step('Check the player buttons are large enough to tap', 'All playback/close controls ≥44×44px', async () => {
    const small = await smallTargets(page, '#cataract-3d-stage .csim');
    return { actual: small.length ? `${small.length} small: ${small.slice(0, 5).join('; ')}` : 'all targets ≥44px', ok: small.length === 0 };
  }, { critical: false });

  await j.step('Tap "إغلاق" (close)', 'The viewer closes, the start button is back, WebGL released', async () => {
    await page.locator('#cataract-3d-stage [data-ref="close"]').tap();
    await page.waitForTimeout(300);
    const s = await csim(page);
    const gl = await page.evaluate(() => window.__glLive());
    const btnVisible = await page.locator('#cataract-3d-start').isVisible();
    return { actual: `mounted=${s.mounted} section=${s.section} start visible=${btnVisible}; live WebGL contexts=${gl.live}`, ok: !s.mounted && s.section === 'idle' && btnVisible && gl.live === 0 };
  }, { shot: true });

  await j.step('Find how to book: tap "احجز موعداً" in the bottom bar', 'Bottom bar visible; tapping it targets the Magrabi booking portal in a new tab', async () => {
    const bar = page.locator('#booking-bar .booking-action-book');
    const r = await rect(bar);
    await bar.tap();
    const hits = await intercepted(page);
    const last = hits[hits.length - 1] || {};
    return { actual: `bar ${Math.round(r.w)}×${Math.round(r.h)} at y=${Math.round(r.y)}; tapped → ${last.href} target=${last.target} rel=${last.rel}`, ok: last.href === BOOKING && last.target === '_blank' && /noopener/.test(last.rel) && r.h >= 44 };
  }, { shot: true });

  await j.step('Check every control on the page is large enough for a finger', 'No interactive element (except inline text links) smaller than 44px', async () => {
    const small = await smallTargets(page, 'body');
    return { actual: small.length ? `${small.length} small: ${small.slice(0, 6).join('; ')}` : 'all ≥44px', ok: small.length === 0 };
  }, { critical: false });

  await j.finish();
});
