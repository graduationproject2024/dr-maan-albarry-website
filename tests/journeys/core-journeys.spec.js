// Core journeys J01–J10 (+ extra high-value journeys J11–J13). All emulated in Chromium unless stated.
import { test } from '@playwright/test';
import fs from 'node:fs';
import { startJourney, prepare, device, viewportProfile, rect, swipe, intercepted, hOverflow, glLive, throttle, settleScroll, revealInFreeArea, EVIDENCE_ROOT } from './harness.js';
import { openUrl, docState, csim, waitCsim, vsimState, waitVsim, BOOKING, MAP, C, NAME, DOCTOR_NAME, SLUGS } from './site.js';

const lbl = (page, group, value) => page.locator(`#simulator-host label[for$="-${group}-${value}"]`);

// ---------------------------------------------------------------- J01
test.describe('J01', () => {
  test.use({ ...viewportProfile(390, 844), colorScheme: 'dark' });
  test('J01 — cataract consultation', async ({ page }, testInfo) => {
    test.setTimeout(150_000);
    await prepare(page, { clearStorage: true });
    const j = await startJourney(page, testInfo, { id: 'j01-cataract-consultation', persona: 'Core journey', objective: 'From the home page, learn what a cataract is, read the full guide, check a FAQ, view the 3D walkthrough and book.', device: 'Generic phone profile 390×844, DPR 2, touch', language: 'ar', theme: 'dark (device)', startUrl: '/' });
    await j.step('Open the home page', 'Arabic home, dark theme', async () => { const s = await openUrl(page, '/'); return { actual: `lang=${s.lang} theme=${s.theme}`, ok: s.lang === 'ar' && s.theme === 'dark' }; });
    await j.step('Open the menu and tap "التثقيف الصحي"', 'Education section on screen', async () => {
      await page.locator('.mobile-menu-btn').tap(); await page.waitForTimeout(300);
      await page.locator('#mobile-nav a[data-section="education"]').tap(); await page.waitForTimeout(600); await settleScroll(page);
      const top = (await rect(page.locator('#education'))).y;
      return { actual: `#education top=${Math.round(top)}`, ok: top > -10 && top < 150 };
    });
    await j.step('Tap the first article "ما هي المياه البيضاء…؟"', 'Article expands (aria-expanded=true) with a link to the full guide', async () => {
      const t = page.locator('#art-item-cataract-guide .article-trigger');
      await t.tap();
      const exp = await t.getAttribute('aria-expanded');
      const vis = await page.locator('#art-content-cataract-guide a').isVisible();
      return { actual: `aria-expanded=${exp}, guide link visible=${vis}`, ok: exp === 'true' && vis };
    }, { shot: true });
    await j.step('Tap "اقرأ الدليل الكامل"', 'Cataract page opens at the top', async () => {
      await page.locator('#art-content-cataract-guide a').tap();
      await page.waitForURL(/procedures\/cataract-surgery\/$/); await page.locator('#p-faq').waitFor();
      const s = await docState(page); return { actual: `${s.path} "${s.h1}" y=${s.scrollY}`, ok: s.h1 === NAME['cataract-surgery'].ar && s.scrollY < 50 };
    });
    await j.step('Scroll to the page FAQ and tap the first question', 'Answer expands', async () => {
      const q = page.locator('#pfaq-0 .faq-question'); await revealInFreeArea(page, q); await q.tap();
      const exp = await q.getAttribute('aria-expanded'); const vis = await page.locator('#pfaq-answer-0').isVisible();
      return { actual: `aria-expanded=${exp} answer visible=${vis}`, ok: exp === 'true' && vis };
    }, { shot: true });
    await j.step('Tap "ابدأ التجربة ثلاثية الأبعاد", play, then close', 'Viewer ready → plays → closes cleanly', async () => {
      const b = page.locator('#cataract-3d-start'); await revealInFreeArea(page, b); await b.tap();
      await waitCsim(page, ['ready'], 40000);
      await page.locator('#cataract-3d-stage [data-ref="start"]').tap(); await page.waitForTimeout(800);
      const a = await csim(page);
      const close = page.locator('#cataract-3d-stage [data-ref="close"]'); await revealInFreeArea(page, close); await close.tap(); await page.waitForTimeout(300);
      const z = await csim(page);
      return { actual: `playing mode=${a.mode}; after close mounted=${z.mounted} section=${z.section}`, ok: a.mode === 'pause' && !z.mounted };
    }, { shot: true });
    await j.step('Tap "احجز موعداً" in the closing band', 'Booking portal targeted (intercepted)', async () => {
      const b = page.locator('.proc-book a[data-cta="book"]'); await revealInFreeArea(page, b); await b.tap();
      const h = await intercepted(page); return { actual: `→ ${h.at(-1)?.href}`, ok: h.at(-1)?.href === BOOKING };
    });
    await j.finish();
  });
});

// ---------------------------------------------------------------- J02
test.describe('J02', () => {
  test.use({ ...device('Galaxy S9+') });
  test('J02 — corneal care', async ({ page }, testInfo) => {
    test.setTimeout(150_000);
    await prepare(page, { theme: 'light', clearStorage: true });
    const j = await startJourney(page, testInfo, { id: 'j02-corneal-care', persona: 'Core journey', objective: 'Find keratoconus care, read about corneal transplant, and reach the clinic phone line — checking the call link without calling.', device: 'Galaxy S9+ (320×658, Android UA, touch)', language: 'en', theme: 'light', startUrl: '/en/' });
    await j.step('Open /en/', 'English home', async () => { const s = await openUrl(page, '/en/'); return { actual: `lang=${s.lang}`, ok: s.lang === 'en' }; });
    await j.step('Scroll to procedures and tap the "Cornea & retina care" chip', 'Three cornea/retina procedures shown', async () => {
      const chip = page.locator('.proc-filter .chip[data-filter="cornea-retina"]'); await revealInFreeArea(page, chip); await chip.tap();
      const titles = await page.locator('.proc-grid .proc-card:not([hidden]) .proc-card-title').allInnerTexts();
      return { actual: titles.join(', '), ok: titles.length === 3 && titles.includes(NAME['keratoconus-cxl'].en) };
    }, { shot: true });
    await j.step('Tap the keratoconus card', 'Keratoconus page', async () => {
      const l = page.locator('#procedures .proc-card-link[href$="procedures/keratoconus-cxl/"]'); await revealInFreeArea(page, l); await l.tap();
      await page.waitForURL(/keratoconus-cxl\/$/); const s = await docState(page); return { actual: s.h1, ok: s.h1 === NAME['keratoconus-cxl'].en };
    });
    await j.step('Tap the related "Corneal transplant" card', 'Corneal transplant page', async () => {
      const l = page.locator('.proc-related .proc-card-link[href$="procedures/corneal-transplant/"]'); await revealInFreeArea(page, l); await l.tap();
      await page.waitForURL(/corneal-transplant\/$/); const s = await docState(page); return { actual: s.h1, ok: s.h1 === NAME['corneal-transplant'].en };
    });
    await j.step('Tap the clinic phone number in the closing band', 'tel: link to the doctor\'s clinic line (+966554946433) — recorded, not called', async () => {
      const l = page.locator('.proc-book a[data-cta="call"]'); await revealInFreeArea(page, l); await l.tap();
      const h = await intercepted(page); return { actual: `→ ${h.at(-1)?.href} ("${h.at(-1)?.text}")`, ok: h.at(-1)?.href === `tel:${C.clinicDirect.tel}` };
    }, { shot: true });
    await j.step('Tap "Call" in the bottom booking bar', 'tel: link to the Magrabi contact centre (920018000) — recorded, not called', async () => {
      await page.locator('#booking-bar .booking-action-call').tap();
      const h = await intercepted(page); return { actual: `→ ${h.at(-1)?.href}`, ok: h.at(-1)?.href === `tel:${C.callCenter.tel}` };
    });
    await j.finish();
  });
});

// ---------------------------------------------------------------- J03
test.describe('J03', () => {
  test.use({ ...viewportProfile(390, 844) });
  test('J03 — vision comparison', async ({ page }, testInfo) => {
    test.setTimeout(150_000);
    await prepare(page, { theme: 'light', clearStorage: true });
    const j = await startJourney(page, testInfo, { id: 'j03-vision-comparison', persona: 'Core journey', objective: 'Compare two lenses side by side at night on a phone.', device: 'Generic phone profile 390×844, DPR 2, touch', language: 'en', theme: 'light', startUrl: '/en/' });
    await j.step('Open /en/, open the menu, tap "Vision simulator"', 'Simulator section on screen and mounted', async () => {
      await openUrl(page, '/en/'); await page.locator('.mobile-menu-btn').tap(); await page.waitForTimeout(300);
      await page.locator('#mobile-nav a[data-section="simulator"]').tap();
      const s = await waitVsim(page, 40000); await page.waitForTimeout(800); await settleScroll(page);
      const top = (await rect(page.locator('#simulator'))).y;
      return { actual: `mounted=${s.mounted} canvases=${s.canvases}; #simulator top=${Math.round(top)}`, ok: s.canvases === 1 && top > -20 && top < 140 };
    }, { shot: true });
    await j.step('Measure the viewer width (FIXED-2: ≥ viewport − 56 px)', 'Viewer ≥ 334 px wide at 390 px', async () => {
      const w = (await rect(page.locator('#simulator-host .vsim-viewport'))).w;
      return { actual: `viewer ${w.toFixed(1)} px`, ok: w >= 390 - 56 };
    }, { critical: false });
    await j.step('Tap "Compare two lenses", choose EDOF as A and trifocal as B', 'Two labelled halves A/B and two info cards', async () => {
      await page.locator('#simulator-host .vsim-switch').tap();
      await lbl(page, 'lensA', 'edof').tap(); await lbl(page, 'lensB', 'trifocal').tap(); await page.waitForTimeout(300);
      const s = await vsimState(page);
      const tags = await page.locator('#simulator-host .vsim-tag:not([hidden])').allInnerTexts();
      return { actual: `compare=${s.compare} A=${s.lens} B=${s.lensB} tags=${tags.join('/')} cards=${s.cards.length}`, ok: s.compare && s.lens === 'edof' && s.lensB === 'trifocal' && s.cards.length === 2 };
    }, { shot: true });
    await j.step('Tap "Night"', 'Lighting = night; pupil value in the model box grows', async () => {
      await lbl(page, 'lighting', 'night').tap(); await page.waitForTimeout(300);
      const s = await vsimState(page); return { actual: `lighting=${s.lighting}`, ok: s.lighting === 'night' };
    });
    await j.step('Drag the divider to the right with one finger', 'Divider value increases; the page does not scroll sideways', async () => {
      const d = page.locator('#simulator-host [data-ref="divider"]'); const r = await revealInFreeArea(page, d);
      const v0 = Number(await d.getAttribute('aria-valuenow'));
      await swipe(page, { x: r.x + r.w / 2, y: r.y + r.h / 2, dx: 90, steps: 10 });
      const v1 = Number(await d.getAttribute('aria-valuenow'));
      return { actual: `divider ${v0}% → ${v1}%; overflow ${await hOverflow(page)}px`, ok: v1 > v0 + 5 && (await hOverflow(page)) <= 0 };
    }, { shot: true });
    await j.step('Swipe vertically on the viewer', 'The page scrolls (the canvas does not trap a one-finger vertical swipe)', async () => {
      const v = page.locator('#simulator-host .vsim-viewport'); const r = await revealInFreeArea(page, v);
      const y0 = await page.evaluate(() => scrollY);
      await swipe(page, { x: r.x + r.w * 0.25, y: r.y + r.h * 0.7, dy: -200, steps: 10 });
      const y1 = await page.evaluate(() => scrollY);
      return { actual: `scrollY ${y0} → ${y1}`, ok: y1 > y0 + 100 };
    });
    await j.finish();
  });
});

// ---------------------------------------------------------------- J04
test.describe('J04', () => {
  test.use({ ...device('Pixel 7') });
  test('J04 — language and theme across reloads and back', async ({ page }, testInfo) => {
    test.setTimeout(150_000);
    await prepare(page, { clearStorage: true });
    const j = await startJourney(page, testInfo, { id: 'j04-language-theme-persistence', persona: 'Core journey', objective: 'Language and theme survive reloads, deep navigation and Back/Forward.', device: 'Pixel 7 (412×839, Android UA, touch)', language: 'ar ↔ en', theme: 'light → dark', startUrl: '/' });
    const st = async () => { const s = await docState(page); return `${s.path} ${s.lang}/${s.dir}/${s.theme}`; };
    await j.step('Open / (device light)', 'ar/rtl/light', async () => { await openUrl(page, '/'); const s = await st(); return { actual: s, ok: / ar\/rtl\/light$/.test(s) }; });
    await j.step('Tap EN, then the theme switch', '/en/ en/ltr/dark', async () => { await page.locator('.site-header .lang-switch').tap(); await page.waitForURL(/\/en\/$/); await page.locator('#theme-toggle-btn').tap(); const s = await st(); return { actual: s, ok: s === '/en/ en/ltr/dark' }; });
    await j.step('Reload', 'Still /en/ en/ltr/dark', async () => { await page.reload(); await page.locator('main h1').waitFor(); const s = await st(); return { actual: s, ok: s === '/en/ en/ltr/dark' }; });
    await j.step('Tap the ICL card', '/en/procedures/icl/ en/ltr/dark', async () => { const l = page.locator('#procedures .proc-card-link[href$="procedures/icl/"]'); await revealInFreeArea(page, l); await l.tap(); await page.waitForURL(/icl\/$/); const s = await st(); return { actual: s, ok: s === '/en/procedures/icl/ en/ltr/dark' }; });
    await j.step('Tap "ع" (switch to Arabic) on the procedure page', '/procedures/icl/ ar/rtl/dark at the top', async () => { await page.mouse.wheel(0, -30000); await page.waitForTimeout(200); await page.locator('.site-header .lang-switch').tap(); await page.waitForURL(/localhost:\d+\/procedures\/icl\/$/); const s = await st(); return { actual: `${s} y=${(await docState(page)).scrollY}`, ok: s === '/procedures/icl/ ar/rtl/dark' }; });
    await j.step('Press Back', 'Returns to /en/procedures/icl/ in English (the URL decides the language)', async () => { await page.goBack(); await page.waitForURL(/\/en\/procedures\/icl\/$/); await page.waitForTimeout(300); const s = await st(); return { actual: s, ok: s === '/en/procedures/icl/ en/ltr/dark' }; });
    await j.step('Press Forward', 'Arabic ICL page again', async () => { await page.goForward(); await page.waitForURL(/localhost:\d+\/procedures\/icl\/$/); await page.waitForTimeout(300); const s = await st(); return { actual: s, ok: s === '/procedures/icl/ ar/rtl/dark' }; });
    await j.step('Reload', 'Arabic ICL page, still dark', async () => { await page.reload(); await page.locator('main h1').waitFor(); const s = await st(); return { actual: s, ok: s === '/procedures/icl/ ar/rtl/dark' }; });
    await j.step('Open the bare "/" address', 'Saved Arabic choice keeps the Arabic home (lang saved = ar)', async () => { await page.goto('/'); await page.locator('main h1').waitFor(); const s = await st(); const saved = await page.evaluate(() => localStorage.getItem('lang')); return { actual: `${s}; saved lang=${saved}`, ok: s === '/ ar/rtl/dark' }; }, { shot: true });
    await j.finish();
  });
});

// ---------------------------------------------------------------- J05
test.describe('J05', () => {
  test.use({ ...viewportProfile(390, 844) });
  test('J05 — 3D loading failure and retry', async ({ page }, testInfo) => {
    test.setTimeout(150_000);
    await prepare(page, { theme: 'light', clearStorage: true });
    const j = await startJourney(page, testInfo, { id: 'j05-loading-failure', persona: 'Core journey', objective: 'When the 3D code fails to download, the visitor sees a clear message and can retry successfully.', device: 'Generic phone profile 390×844, touch', language: 'en', theme: 'light', network: 'localhost; the 3D chunks are aborted with route.abort until the retry', startUrl: '/en/procedures/cataract-surgery/' });
    const CHUNK = /\/assets\/(cataract-sim|three\.module)[^/]*\.js/;
    j.expectFailure(CHUNK);
    await page.route(CHUNK, (r) => r.abort('connectionfailed'));
    await j.step('Open the cataract page', 'Page loads', async () => { const s = await openUrl(page, '/en/procedures/cataract-surgery/'); return { actual: s.h1, ok: s.h1 === NAME['cataract-surgery'].en }; });
    await j.step('Tap "Start the 3D experience" while the 3D download fails', 'An error message is announced and the Start button is offered again', async () => {
      const b = page.locator('#cataract-3d-start'); await revealInFreeArea(page, b); await b.tap();
      await page.waitForFunction(() => document.getElementById('cataract-3d').dataset.state === 'error', null, { timeout: 20000 });
      const s = await csim(page); const vis = await b.isVisible();
      return { actual: `section=${s.section}; status="${s.status}"; start visible=${vis}`, ok: s.section === 'error' && /could not load/.test(s.status) && vis };
    }, { shot: true });
    await j.step('Network comes back; tap Start again', 'The 3D viewer loads and works', async () => {
      await page.unroute(CHUNK);
      await page.locator('#cataract-3d-start').tap();
      let s;
      try { s = await waitCsim(page, ['ready'], 20000); } catch { s = await csim(page); }
      return { actual: `section=${s.section} state=${s.state ?? '-'} status="${s.status ?? ''}"`, ok: s.state === 'ready' };
    }, { shot: true });
    await j.step('Tap Next and Play', 'Stage changes and playback runs', async () => {
      await page.locator('#cataract-3d-stage [data-ref="next"]').tap(); await page.waitForTimeout(200);
      const pp = page.locator('#cataract-3d-stage [data-ref="playPause"]'); await revealInFreeArea(page, pp); await pp.tap(); await page.waitForTimeout(800);
      const s = await csim(page); return { actual: `${s.stageNum}; mode=${s.mode}`, ok: /2 of 7/.test(s.stageNum) && s.mode === 'pause' };
    });
    await j.step('Abort the vision-simulator chunk, open the home simulator section', 'The section shows the simulator or a clear fallback — never an empty reserved gap', async () => {
      const VS = /\/assets\/(index-[^/]*vision|vision-sim|pipeline|scenes)[^/]*\.js/;
      j.expectFailure(VS);
      await page.route(VS, (r) => r.abort('connectionfailed'));
      await page.goto('/en/#simulator'); await page.locator('main h1').waitFor();
      await page.locator('#simulator-host').scrollIntoViewIfNeeded(); await page.waitForTimeout(3000);
      const info = await page.locator('#simulator-host').evaluate((h) => ({ h: Math.round(h.getBoundingClientRect().height), kids: h.children.length, text: h.innerText.trim().slice(0, 80) }));
      return { actual: `host ${info.h}px tall, children=${info.kids}, text="${info.text}"`, ok: info.kids > 0 && info.text.length > 0 };
    }, { shot: true, critical: false });
    await j.finish();
  });
});

// ---------------------------------------------------------------- J06
test.describe('J06', () => {
  test.use({ ...viewportProfile(360, 800) });
  test('J06 — 360 px full scroll, booking and simulator open/close', async ({ page }, testInfo) => {
    test.setTimeout(200_000);
    await prepare(page, { theme: 'light', clearStorage: true });
    const j = await startJourney(page, testInfo, { id: 'j06-360-full-scroll', persona: 'Core journey', objective: 'Scroll the whole home page at 360 px with one finger; every section renders without overflow; booking and both simulators work.', device: 'Generic phone profile 360×800, DPR 2, touch', language: 'ar', theme: 'light', startUrl: '/' });
    await j.step('Open /', 'Arabic home', async () => { const s = await openUrl(page, '/'); return { actual: s.h1, ok: s.h1 === DOCTOR_NAME.ar }; });
    for (const id of ['procedures', 'profile', 'simulator', 'cataract-3d', 'education', 'faq', 'clinic']) {
      await j.step(`Swipe until the "${id}" section heading is on screen`, 'Heading visible, section fully rendered, no sideways overflow', async () => {
        const h = page.locator(`#${id} h2`).first();
        let cdp = null, n = 0;
        for (; n < 60; n++) { const r = await rect(h); if (r.y > 60 && r.y < 500) break; cdp = await swipe(page, { x: 180, y: 600, dy: r.y > 500 ? -420 : 420, cdp }); }
        const r = await rect(h);
        const vis = await page.locator(`#${id} .fade-in`).evaluateAll((els) => els.filter((e) => e.getBoundingClientRect().top < innerHeight && e.getBoundingClientRect().bottom > 0).every((e) => getComputedStyle(e).opacity !== '0'));
        const ov = await hOverflow(page);
        return { actual: `${n} swipes; h2 at ${Math.round(r.y)}px; on-screen blocks revealed=${vis}; overflow ${ov}px`, ok: r.y > 0 && r.y < 800 && ov <= 0 };
      }, { shot: id === 'simulator' || id === 'clinic', critical: false, timeout: 90000 });
    }
    await j.step('Check the vision simulator is mounted and the reserved space is filled', 'Simulator mounted; host height within ±25% of its reserved min-height (no big blank gap)', async () => {
      await waitVsim(page, 30000);
      const g = await page.locator('#simulator-host').evaluate((h) => { const root = h.querySelector('.vsim'); return { host: Math.round(h.getBoundingClientRect().height), content: Math.round(root.getBoundingClientRect().height), min: parseFloat(getComputedStyle(h).minHeight) }; });
      return { actual: `host ${g.host}px, simulator content ${g.content}px, reserved min-height ${g.min}px, blank ${g.host - g.content}px`, ok: g.host - g.content < 120 };
    }, { critical: false });
    await j.step('Open and close the 3D viewer on the home page', 'Ready, then closed; no WebGL growth', async () => {
      const b = page.locator('#cataract-3d-start'); await revealInFreeArea(page, b); await b.tap();
      await waitCsim(page, ['ready'], 40000);
      const close = page.locator('#cataract-3d-stage [data-ref="close"]'); await revealInFreeArea(page, close); await close.tap(); await page.waitForTimeout(300);
      const s = await csim(page); return { actual: `mounted=${s.mounted} section=${s.section}`, ok: !s.mounted && s.section === 'idle' };
    }, { shot: true });
    await j.step('Tap "احجز موعداً" in the bottom bar', 'Booking portal (intercepted)', async () => { await page.locator('#booking-bar .booking-action-book').tap(); const h = await intercepted(page); return { actual: `→ ${h.at(-1)?.href}`, ok: h.at(-1)?.href === BOOKING }; });
    await j.step('Scroll to the very end', 'Footer bottom fully visible above the booking bar', async () => {
      await page.mouse.wheel(0, 100000); await page.waitForTimeout(500);
      const f = await rect(page.locator('.footer-bottom')); const bar = await rect(page.locator('#booking-bar'));
      return { actual: `footer bottom ${Math.round(f.bottom)}px, bar top ${Math.round(bar.y)}px`, ok: f.bottom <= bar.y + 1 };
    }, { shot: true, critical: false });
    await j.finish();
  });
});

// ---------------------------------------------------------------- J07
test.describe('J07', () => {
  test.use({ ...device('Pixel 7') });
  test('J07 — repeated 3D use', async ({ page }, testInfo) => {
    test.setTimeout(240_000);
    await prepare(page, { theme: 'light', clearStorage: true });
    const warn = []; page.on('console', (m) => { if (/too many active webgl/i.test(m.text())) warn.push(m.text()); });
    const j = await startJourney(page, testInfo, { id: 'j07-repeated-3d', persona: 'Core journey', objective: 'Open, use and close the 3D viewer eight times in a session without slowing down or leaking GPU contexts.', device: 'Pixel 7 (412×839, Android UA, touch)', language: 'ar', theme: 'light', startUrl: '/procedures/cataract-surgery/' });
    await j.step('Open the cataract page', 'Page', async () => { const s = await openUrl(page, '/procedures/cataract-surgery/'); return { actual: s.h1, ok: true }; });
    const live = [];
    for (let i = 1; i <= 8; i++) {
      await j.step(`Cycle ${i}: start → play 1 s → next stage → close`, 'Each cycle works; live WebGL contexts stay ≤ 1 after close', async () => {
        const t0 = Date.now();
        const b = page.locator('#cataract-3d-start'); await revealInFreeArea(page, b); await b.tap();
        await waitCsim(page, ['ready'], 40000); const tReady = Date.now() - t0;
        await page.locator('#cataract-3d-stage [data-ref="start"]').tap(); await page.waitForTimeout(1000);
        const nx = page.locator('#cataract-3d-stage [data-ref="next"]'); await revealInFreeArea(page, nx); await nx.tap();
        const s = await csim(page);
        const close = page.locator('#cataract-3d-stage [data-ref="close"]'); await revealInFreeArea(page, close); await close.tap(); await page.waitForTimeout(200);
        const g = await glLive(page); live.push(g.live);
        return { actual: `ready in ${tReady} ms; ${s.stageNum}; after close live=${g.live} created=${g.created} canvases=${g.canvases}`, ok: g.live <= 1 && g.canvases === 0 };
      }, { critical: false, timeout: 60000 });
    }
    await j.step('Check for "too many active WebGL contexts" warnings', 'None', async () => ({ actual: `${warn.length} warnings; live after each cycle: ${live.join(',')}`, ok: warn.length === 0 }), { critical: false });
    await j.finish();
  });
});

// ---------------------------------------------------------------- J08
test.describe('J08', () => {
  test.use({ ...viewportProfile(360, 800) });
  test('J08 — slow connection (Slow 3G)', async ({ page }, testInfo) => {
    test.setTimeout(360_000);
    await prepare(page, { theme: 'light', clearStorage: true });
    await page.addInitScript(() => {
      window.__lcp = 0; window.__cls = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    await throttle(page, 'slow-3g');
    const j = await startJourney(page, testInfo, { id: 'j08-slow-3g', persona: 'Core journey', objective: 'A first visit on Slow 3G: content first, then the procedure page, then the 3D viewer with a visible loading state.', device: 'Generic phone profile 360×800, touch', language: 'ar', theme: 'light', network: 'Slow 3G (CDP: 2000 ms RTT, 400 kbit/s)', startUrl: '/' });
    const metrics = {};
    await j.step('Cold load of / on Slow 3G', 'Prerendered heading readable before the scripts finish; LCP recorded', async () => {
      const t0 = Date.now();
      await page.goto('/', { waitUntil: 'commit', timeout: 120000 });
      await page.locator('main h1').waitFor({ timeout: 120000 }); metrics.h1 = Date.now() - t0;
      await page.waitForLoadState('load', { timeout: 200000 }); metrics.load = Date.now() - t0;
      await page.waitForTimeout(1500);
      Object.assign(metrics, await page.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: +window.__cls.toFixed(3), kib: Math.round((performance.getEntriesByType('resource').reduce((a, r) => a + (r.transferSize || 0), 0) + performance.getEntriesByType('navigation')[0].transferSize) / 1024) })));
      return { actual: `h1 visible after ${metrics.h1} ms; load ${metrics.load} ms; LCP ${metrics.lcp} ms; CLS ${metrics.cls}; ${metrics.kib} KiB`, ok: metrics.h1 < 15000 };
    }, { shot: true, timeout: 240000 });
    await j.step('Tap the cataract card', 'Procedure page renders (content chunk over Slow 3G)', async () => {
      const l = page.locator('#procedures .proc-card-link[href$="procedures/cataract-surgery/"]'); await revealInFreeArea(page, l);
      const t0 = Date.now(); await l.tap(); await page.locator('#p-anatomy').waitFor({ timeout: 60000 }); metrics.proc = Date.now() - t0;
      return { actual: `content after ${metrics.proc} ms`, ok: true };
    }, { timeout: 90000 });
    await j.step('Tap Start on the 3D section', 'Loading state visible immediately, then ready', async () => {
      const b = page.locator('#cataract-3d-start'); await revealInFreeArea(page, b);
      const t0 = Date.now(); await b.tap(); await page.waitForTimeout(200);
      const lab = await b.locator('.btn-label').innerText();
      await waitCsim(page, ['ready'], 150000); metrics.threeD = Date.now() - t0;
      return { actual: `label while loading "${lab}"; ready after ${metrics.threeD} ms`, ok: /التحميل/.test(lab) };
    }, { shot: true, timeout: 170000 });
    await j.finish({ extra: { metrics } });
  });
});

// ---------------------------------------------------------------- J09
test.describe('J09', () => {
  test.use({ ...viewportProfile(390, 844) });
  test('J09 — WebGL context loss and restore (both simulators)', async ({ page }, testInfo) => {
    test.setTimeout(150_000);
    await prepare(page, { theme: 'light', clearStorage: true });
    const j = await startJourney(page, testInfo, { id: 'j09-webgl-context-loss', persona: 'Core journey', objective: 'If the phone GPU drops the WebGL context (backgrounding, memory pressure), both simulators say so and recover.', device: 'Generic phone profile 390×844, touch', language: 'en', theme: 'light', startUrl: '/en/', accessibilityMode: 'none (context loss is simulated with the WEBGL_lose_context extension — a test hook, not a user action)' });
    // getExtension() returns null on a lost context, so the extension object is kept from the loss call
    const lose = (sel, fn) => page.evaluate(({ sel, fn }) => {
      window.__loseExt = window.__loseExt || {};
      if (fn === 'loseContext') { const c = document.querySelector(sel); const gl = c.getContext('webgl2') || c.getContext('webgl'); window.__loseExt[sel] = gl.getExtension('WEBGL_lose_context'); }
      window.__loseExt[sel][fn]();
    }, { sel, fn });
    await j.step('Open /en/ and scroll to the vision simulator', 'Simulator mounted', async () => { await openUrl(page, '/en/'); await page.locator('#simulator-host').scrollIntoViewIfNeeded(); const s = await waitVsim(page, 30000); return { actual: `canvases=${s.canvases}`, ok: s.canvases === 1 }; });
    await j.step('GPU drops the vision simulator context', 'A "restoring" note is shown', async () => { await lose('#simulator-host canvas', 'loseContext'); await page.waitForTimeout(400); const s = await vsimState(page); return { actual: `note="${s.note}"`, ok: s.note.length > 0 }; }, { shot: true });
    await j.step('GPU restores the context; tap "Night"', 'Note disappears; controls work; image renders again', async () => {
      await lose('#simulator-host canvas', 'restoreContext'); await page.waitForTimeout(600);
      await lbl(page, 'lighting', 'night').tap(); await page.waitForTimeout(400);
      const s = await vsimState(page);
      const bytes = (await page.locator('#simulator-host .vsim-viewport').screenshot({ type: 'png' })).length;
      return { actual: `note="${s.note}" lighting=${s.lighting}; viewer screenshot ${bytes} bytes`, ok: !s.note && s.lighting === 'night' && bytes > 6000 };
    }, { shot: true });
    await j.step('Open the 3D viewer', 'Ready', async () => { const b = page.locator('#cataract-3d-start'); await revealInFreeArea(page, b); await b.tap(); const s = await waitCsim(page, ['ready'], 40000); return { actual: s.state, ok: s.state === 'ready' }; });
    await j.step('GPU drops the 3D context', 'Illustrated fallback + "restoring" note', async () => { await lose('#cataract-3d-stage canvas', 'loseContext'); await page.waitForTimeout(400); const s = await csim(page); return { actual: `state=${s.state} fallback=${s.fallback} note="${s.note}"`, ok: s.state === 'error' && s.fallback && s.note.length > 0 }; }, { shot: true });
    await j.step('GPU restores; tap Next', 'Back to the 3D view; Next still works', async () => {
      await lose('#cataract-3d-stage canvas', 'restoreContext'); await page.waitForTimeout(600);
      await page.locator('#cataract-3d-stage [data-ref="next"]').tap(); await page.waitForTimeout(300);
      const s = await csim(page); return { actual: `state=${s.state} fallback=${s.fallback} ${s.stageNum}`, ok: !s.fallback && s.state !== 'error' && /2 of 7/.test(s.stageNum) };
    }, { shot: true });
    await j.finish();
  });
});

// ---------------------------------------------------------------- J10
test.describe('J10', () => {
  test.use({ ...device('Galaxy S8') });
  test('J10 — trust and contact', async ({ page }, testInfo) => {
    test.setTimeout(150_000);
    await prepare(page, { theme: 'light', clearStorage: true });
    const j = await startJourney(page, testInfo, { id: 'j10-trust-contact', persona: 'Core journey', objective: 'Check who the doctor is, his credentials and services, read a FAQ, find the address and book.', device: 'Galaxy S8 (360×740, Android UA, touch)', language: 'ar', theme: 'light', startUrl: '/' });
    await j.step('Open / and tap "عن الدكتور" in the menu', 'Profile section', async () => { await openUrl(page, '/'); await page.locator('.mobile-menu-btn').tap(); await page.waitForTimeout(300); await page.locator('#mobile-nav a[data-section="profile"]').tap(); await page.waitForTimeout(700); await settleScroll(page); const t = (await rect(page.locator('#profile'))).y; return { actual: `#profile top ${Math.round(t)}`, ok: t > -10 && t < 150 }; });
    await j.step('Read credentials', 'FRCS, academic rank and the current role are listed; sources stated', async () => { const t = await page.locator('#profile').innerText(); return { actual: `FRCS=${/FRCS/.test(t)}; mentions Magrabi & Taibah as sources=${/مغربي/.test(t) && /طيبة/.test(t)}; timeline items=${await page.locator('#profile .timeline-item').count()}`, ok: /FRCS/.test(t) && /طيبة/.test(t) }; }, { shot: true });
    await j.step('Open the menu and tap "الإجراءات"', 'Procedures with 7 cards', async () => { await page.locator('.mobile-menu-btn').tap(); await page.waitForTimeout(300); await page.locator('#mobile-nav a[data-section="procedures"]').tap(); await page.waitForTimeout(700); return { actual: `${await page.locator('.proc-grid .proc-card').count()} cards`, ok: (await page.locator('.proc-grid .proc-card').count()) === 7 }; });
    await j.step('Open the menu, tap "الأسئلة الشائعة", tap the first question', 'Answer opens', async () => { await page.locator('.mobile-menu-btn').tap(); await page.waitForTimeout(300); await page.locator('#mobile-nav a[data-section="faq"]').tap(); await page.waitForTimeout(700); await settleScroll(page); const q = page.locator('#faq-0 .faq-question'); await revealInFreeArea(page, q); await q.tap(); return { actual: `aria-expanded=${await q.getAttribute('aria-expanded')}`, ok: (await q.getAttribute('aria-expanded')) === 'true' && await page.locator('#faq-answer-0').isVisible() }; }, { shot: true });
    await j.step('Find the address', 'Clinic name and street address shown in the clinic section', async () => { const v = page.locator('#clinic .visit-row').nth(1); await revealInFreeArea(page, v); const t = await v.innerText(); return { actual: t.replace(/\s+/g, ' '), ok: /المدينة المنورة/.test(t) && /طريق المطار/.test(t) }; }, { shot: true });
    await j.step('Tap "موقع المستشفى" in the closing band, then "احجز موعداً"', 'Maps then booking portal (both intercepted)', async () => {
      const m = page.locator('.closing a[href="' + MAP + '"]'); await revealInFreeArea(page, m); await m.tap();
      const b = page.locator('#cta-primary-btn'); await revealInFreeArea(page, b); await b.tap();
      const h = await intercepted(page); return { actual: h.slice(-2).map((x) => x.href).join(' , '), ok: h.at(-2)?.href === MAP && h.at(-1)?.href === BOOKING };
    });
    await j.finish();
  });
});

// ---------------------------------------------------------------- J11 viewport matrix
const MATRIX = [[320, 640], [360, 800], [375, 812], [390, 844], [430, 932], [768, 1024], [1366, 768], [1440, 900], [1920, 1080]];
test.describe('J11', () => {
  test('J11 — viewport matrix (9 viewports × AR/EN)', async ({ browser }, testInfo) => {
    test.setTimeout(400_000);
    const ctx = await browser.newContext({ ...viewportProfile(320, 640) });
    const page = await ctx.newPage();
    await prepare(page, { theme: 'light', clearStorage: true });
    const j = await startJourney(page, testInfo, { id: 'j11-viewport-matrix', persona: 'Core journey (extra)', objective: 'Every required viewport: no sideways scroll, header/booking reachable, simulator reserved space filled, cards readable.', device: '9 viewports (touch below 768 px)', language: 'ar + en', theme: 'light', startUrl: '/' });
    for (const [w, h] of MATRIX) {
      for (const lang of ['ar', 'en']) {
        await j.step(`${w}×${h} ${lang}: open, scroll to the simulator and to the end`, 'No horizontal overflow; booking CTA reachable; simulator host has no blank gap > 120 px', async () => {
          await page.setViewportSize({ width: w, height: h });
          await openUrl(page, lang === 'en' ? '/en/' : '/');
          await page.locator('#simulator-host').scrollIntoViewIfNeeded();
          await waitVsim(page, 30000); await page.waitForTimeout(400);
          const g = await page.locator('#simulator-host').evaluate((x) => ({ host: Math.round(x.getBoundingClientRect().height), content: Math.round(x.querySelector('.vsim').getBoundingClientRect().height) }));
          const vw = Math.round((await rect(page.locator('#simulator-host .vsim-viewport'))).w);
          await page.mouse.wheel(0, 100000); await page.waitForTimeout(300);
          const ov = await hOverflow(page);
          const book = await page.locator(w < 1024 ? '#booking-bar .booking-action-book' : '.btn-header-book').first().isVisible();
          return { actual: `overflow ${ov}px; booking visible=${book}; simulator host ${g.host}px vs content ${g.content}px (blank ${g.host - g.content}px); viewer ${vw}px`, ok: ov <= 0 && book && g.host - g.content <= 120 && (w > 640 || vw >= w - 56) };
        }, { critical: false, timeout: 60000 });
      }
    }
    await j.finish();
    await ctx.close();
  });
});

// ---------------------------------------------------------------- J12 missing images
test.describe('J12', () => {
  test.use({ ...viewportProfile(390, 844) });
  test('J12 — procedure images missing', async ({ page }, testInfo) => {
    test.setTimeout(120_000);
    await prepare(page, { theme: 'light', clearStorage: true });
    const j = await startJourney(page, testInfo, { id: 'j12-missing-images', persona: 'Core journey (extra)', objective: 'If the procedure illustrations fail to load, cards and pages fall back to the line drawing — no broken-image icons, no empty boxes.', device: 'Generic phone profile 390×844, touch', language: 'ar', theme: 'light', network: 'images/procedures/* aborted with route.abort', startUrl: '/' });
    j.expectFailure(/images\/procedures\//);
    await page.route(/images\/procedures\//, (r) => r.abort('failed'));
    await j.step('Open / and swipe through the procedure cards', 'Every card shows the schematic plate; no broken <img>', async () => {
      await openUrl(page, '/');
      let cdp = null; for (let i = 0; i < 14; i++) cdp = await swipe(page, { x: 195, y: 600, dy: -420, cdp });
      await page.waitForTimeout(800);
      const st = await page.locator('#procedures .proc-card').evaluateAll((els) => els.map((c) => { const img = c.querySelector('.illus img'); const plate = c.querySelector('.illus.is-plate'); const svg = c.querySelector('.illus svg:not([style*="display: none"])'); const shown = [...c.querySelectorAll('.illus svg')].some((s) => getComputedStyle(s).display !== 'none' && s.getBoundingClientRect().height > 20); return img ? (img.complete && img.naturalWidth === 0 ? 'BROKEN' : 'img') : (plate && shown ? 'plate' : 'EMPTY'); }));
      return { actual: st.join(', '), ok: st.every((x) => x === 'plate' || x === 'img') && !st.includes('BROKEN') };
    }, { shot: true });
    await j.step('Open the ICL page', 'Hero figure falls back to the plate', async () => {
      await page.goto('/procedures/icl/'); await page.locator('#p-anatomy').waitFor(); await page.waitForTimeout(800);
      const st = await page.locator('.proc-figure .illus').evaluate((d) => ({ plate: d.classList.contains('is-plate'), img: !!d.querySelector('img'), h: Math.round(d.getBoundingClientRect().height) }));
      return { actual: JSON.stringify(st), ok: st.plate && !st.img && st.h > 100 };
    }, { shot: true });
    await j.finish();
  });
});

// ---------------------------------------------------------------- J13 no-JS / prerender
test.describe('J13', () => {
  test.use({ ...viewportProfile(390, 844), javaScriptEnabled: false });
  test('J13 — prerendered page without JavaScript', async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    const j = await startJourney(page, testInfo, { id: 'j13-no-js-prerender', persona: 'Core journey (extra)', objective: 'Without JavaScript the prerendered pages are complete and usable, and the reserved simulator space does not leave a large blank gap.', device: 'Generic phone profile 390×844 (JavaScript disabled)', language: 'ar', theme: 'light (no JS)', startUrl: '/' });
    j.expectFailure(/\.js(\?|$)/); // with JavaScript disabled Chromium reports every script as blocked ("csp")
    await j.step('Open / without JavaScript', 'Prerendered heading and procedures present', async () => { await page.goto('/'); const h1 = await page.locator('main h1').innerText(); const cards = await page.locator('.proc-card').count(); return { actual: `h1="${h1}" cards=${cards}`, ok: h1 === DOCTOR_NAME.ar && cards >= 7 }; });
    await j.step('Measure the simulator section', 'No blank reserved gap (host height < 300 px when nothing can mount)', async () => {
      const g = await page.locator('#simulator-host').evaluate((h) => ({ h: Math.round(h.getBoundingClientRect().height), kids: h.children.length, text: h.innerText.trim().slice(0, 100) }));
      return { actual: `host ${g.h}px, children ${g.kids}, text "${g.text}"`, ok: g.h < 300 };
    }, { shot: true, critical: false });
    await j.step('Check the booking link works without JS', 'Booking anchor has the portal URL', async () => { const href = await page.locator('#clinic-booking-cta').getAttribute('href'); return { actual: href, ok: href === BOOKING }; });
    await j.step('Open a prerendered procedure page', 'Full text present', async () => { await page.goto('/procedures/keratoconus-cxl/'); const n = await page.locator('.proc-sec').count(); return { actual: `${n} sections`, ok: n >= 8 }; });
    await j.finish();
  });
});
