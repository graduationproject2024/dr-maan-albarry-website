// Premium experience journeys A–G + touch checks (design: docs/implementation/premium-experience-reconstruction).
// Everything here is BROWSER EMULATION: Chromium on Windows with Playwright device metrics, touch and CDP throttling.
// No physical phone is involved. External links are intercepted by the harness: tel:, WhatsApp, booking portal and
// Maps hrefs are read from the tap and never contacted; no booking or message is ever sent.
//
// Logs and screenshots: docs/implementation/premium-experience-reconstruction/evidence/journeys/<id>/ and .../logs/<id>.json.
// Each step logs action, expected, observed, status, screenshot, console errors, page errors and failed requests;
// meta adds device profile, viewport, language and theme.
import { test } from '@playwright/test';
import { startJourney, prepare, viewportProfile, rect, swipe, intercepted, clearIntercepted, hOverflow, glLive, throttle, settleScroll, revealInFreeArea, smallTargets, smallText, scrollBy } from './harness.js';
import { openUrl, docState, csim, waitCsim, BOOKING, MAP, C, NAME, SLUGS } from './site.js';

const EVIDENCE = 'docs/implementation/premium-experience-reconstruction/evidence/journeys';
const WA = /^https:\/\/(wa\.me|api\.whatsapp\.com)\//;

const PROFILES = {
  'ar-light-390': { w: 390, h: 844, lang: 'ar', theme: 'light' },
  'en-dark-390': { w: 390, h: 844, lang: 'en', theme: 'dark' },
  'ar-dark-320': { w: 320, h: 640, lang: 'ar', theme: 'dark' },
  'en-light-360': { w: 360, h: 740, lang: 'en', theme: 'light' },
  'ar-dark-375': { w: 375, h: 812, lang: 'ar', theme: 'dark' },
  'en-light-430': { w: 430, h: 932, lang: 'en', theme: 'light' },
  'ar-light-768': { w: 768, h: 1024, lang: 'ar', theme: 'light', touch: true },
  'en-dark-768': { w: 768, h: 1024, lang: 'en', theme: 'dark', touch: true },
};
const home = (lang) => (lang === 'en' ? '/en/' : '/');
const path = (lang, p) => `${lang === 'en' ? '/en' : ''}/${p}`;
const useProfile = (p, extra = {}) => test.use({ ...viewportProfile(p.w, p.h, { touch: p.touch ?? p.w < 768 }), colorScheme: p.theme, ...extra });
const metaFor = (p, id, persona, objective, startUrl, extra = {}) => ({
  id, persona, objective, startUrl, evidenceRoot: EVIDENCE,
  device: `Emulated touch ${p.w < 768 ? 'phone' : 'tablet'} ${p.w}×${p.h}, DPR 2, Chromium on Windows`,
  viewport: `${p.w}×${p.h}`, language: p.lang, theme: p.theme, ...extra,
});
const tr = (p, ar, en) => (p.lang === 'ar' ? ar : en);

/** Open the menu sheet, returning its state. */
async function openMenu(page) {
  await page.mouse.wheel(0, -60); // the header returns on the first scroll up (a user reaches for the menu after that)
  await page.waitForTimeout(450);
  await page.locator('.mobile-menu-btn').tap();
  await page.locator('#mobile-nav.open').waitFor({ timeout: 4000 });
  await page.waitForTimeout(350);
}
const tapMenuLink = async (page, section, urlRe) => {
  await openMenu(page);
  await page.locator(`#mobile-nav .drawer-links a[data-section="${section}"]`).tap();
  await page.waitForURL(urlRe, { timeout: 15000 });
  await page.waitForTimeout(400); await settleScroll(page);
};
/** Text or buttons cut off by their own box (scrollWidth > clientWidth with overflow hidden/clip). */
const clipped = (page, scope = 'body') => page.locator(scope).evaluate((root) => [...root.querySelectorAll('a, button, h1, h2, h3, p, span, li, summary')].filter((el) => {
  const r = el.getBoundingClientRect(); if (!r.width || !r.height) return false;
  if (el.closest('svg, canvas, [hidden], .sr-only, .skip-link')) return false;
  const cs = getComputedStyle(el);
  if (!/(hidden|clip)/.test(cs.overflowX + cs.overflowY)) return false;
  return el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1;
}).slice(0, 8).map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}`));
const barTop = (page) => page.evaluate(() => { const b = document.getElementById('booking-bar'); if (!b) return innerHeight; const r = b.getBoundingClientRect(); return r.height && getComputedStyle(b).display !== 'none' ? r.top : innerHeight; });
async function openProcedureViaPlate(page, slug) {
  const card = page.locator(`#procedures .plate-card[data-slug="${slug}"]`);
  const link = card.locator('.proc-card-link');
  await revealInFreeArea(page, link); await settleScroll(page);
  const fromY = await page.evaluate(() => Math.round(scrollY));
  await link.tap();
  await page.waitForURL(new RegExp(`procedures/${slug}/$`), { timeout: 15000 });
  await page.locator('#p-anatomy').waitFor({ timeout: 15000 });
  return { ...(await docState(page)), fromY };
}

// ------------------------------------------------------------------------- A: discover a procedure
for (const [key, slug] of [['ar-light-390', 'icl'], ['en-dark-390', 'keratoconus-cxl'], ['ar-dark-320', 'corneal-transplant'], ['en-light-430', 'laser-vision-correction'], ['ar-light-768', 'lens-implants']]) {
  const p = PROFILES[key];
  test.describe(`A ${key}`, () => {
    useProfile(p); test.setTimeout(120_000);
    test(`A — discover a procedure (${key})`, async ({ page }, testInfo) => {
      await prepare(page, { theme: p.theme, clearStorage: true });
      const j = await startJourney(page, testInfo, metaFor(p, `premium-a-${key}`, 'A — discover a procedure', 'Home → procedure gallery → pick a procedure → read the details → return.', home(p.lang)));
      await j.step('Open the home page', `${p.lang} / ${p.theme}; a booking action (hero button or bottom bar) is on the first screen`, async () => {
        const s = await openUrl(page, home(p.lang));
        const b = await rect(page.locator('#hero-primary-cta')); const top = await barTop(page);
        const vh = page.viewportSize().height;
        const heroOn = b.bottom <= top; const barOn = top < vh && await page.locator('#booking-bar .booking-action-book').isVisible();
        return { actual: `lang=${s.lang} dir=${s.dir} theme=${s.theme}; hero book button bottom ${Math.round(b.bottom)} of ${vh}; bottom bar on screen ${barOn}`, ok: s.lang === p.lang && s.theme === p.theme && (heroOn || barOn) };
      }, { shot: true });
      let galleryY = 0;
      await j.step('Scroll to the procedure gallery', 'All seven plates are present, each with an image and a visible summary', async () => {
        await revealInFreeArea(page, page.locator('#procedures h2').first());
        const plates = await page.locator('#procedures .plate-card').evaluateAll((cs) => cs.map((c) => ({ slug: c.dataset.slug, img: !!c.querySelector('img'), sum: (c.querySelector('.pc-sum')?.textContent || '').trim().length, h: Math.round(c.querySelector('.pc-sum')?.getBoundingClientRect().height || 0) })));
        const bad = plates.filter((x) => !x.img || x.sum < 20 || x.h < 10);
        return { actual: `${plates.length} plates; without image/summary: ${bad.map((x) => x.slug).join(',') || 'none'}`, ok: plates.length === 7 && !bad.length };
      }, { shot: true });
      await j.step(`Tap the "${NAME[slug][p.lang]}" plate`, 'The procedure page opens at its title', async () => {
        const s = await openProcedureViaPlate(page, slug);
        galleryY = s.fromY;
        return { actual: `${s.path} h1="${s.h1}" y=${s.scrollY} (tapped from y=${s.fromY})`, ok: s.h1 === NAME[slug][p.lang] && s.scrollY < 60 };
      }, { shot: true });
      await j.step('Read the page', 'The hero plate has its image; reading text is ≥16 px; no sideways scroll; review status shown', async () => {
        await page.waitForLoadState('load');
        const hero = await page.locator('.proc-hero img').first().evaluate(async (i) => { await i.decode().catch(() => {}); return { w: i.naturalWidth, alt: i.alt.length, shown: Math.round(i.getBoundingClientRect().width) }; });
        const small = await smallText(page, '.proc-sec p, .proc-sec li, .proc-sec dd', 16);
        const ov = await hOverflow(page);
        const review = await page.locator('.review-status-hero').isVisible();
        return { actual: `hero image natural ${hero.w}px shown ${hero.shown}px alt ${hero.alt} chars; small text: ${small.length}${small.length ? ' ' + small.slice(0, 3).join(', ') : ''}; overflow ${ov}px; review status ${review}`, ok: hero.w > 0 && hero.alt > 0 && !small.length && ov <= 0 && review };
      }, { shot: true });
      await j.step('Open "On this page" and tap the risks section', 'The risks section lands below the header, not behind it', async () => {
        const toc = page.locator('details.toc-m');
        await revealInFreeArea(page, toc.locator('summary')); await toc.locator('summary').tap(); await page.waitForTimeout(200);
        const link = toc.locator('a[data-spy="p-risks"]'); await revealInFreeArea(page, link); await link.tap();
        await page.waitForTimeout(900); await settleScroll(page);
        const top = (await rect(page.locator('#p-risks'))).y;
        const hdr = await page.locator('#site-header').evaluate((h) => h.getBoundingClientRect().bottom);
        return { actual: `#p-risks top ${Math.round(top)} px; header bottom ${Math.round(hdr)} px; hash ${(await docState(page)).path}`, ok: top >= hdr - 2 && top < hdr + 80 };
      }, { shot: true });
      await j.step('Tap the first frequently asked question', 'Answer expands and reports aria-expanded', async () => {
        const q = page.locator('#pfaq-0 .faq-question'); await revealInFreeArea(page, q); await q.tap(); await page.waitForTimeout(350);
        const exp = await q.getAttribute('aria-expanded'); const h = (await rect(page.locator('#pfaq-answer-0'))).h;
        return { actual: `aria-expanded=${exp}; answer height ${Math.round(h)} px`, ok: exp === 'true' && h > 30 };
      });
      await j.step('Press Back', 'Home page, gallery position restored (a contents-list jump does not add a history entry)', async () => {
        await page.goBack(); await page.waitForURL(new RegExp(`${p.lang === 'en' ? '/en/' : ':\\d+/'}$`), { timeout: 15000 });
        await page.waitForTimeout(600); await settleScroll(page);
        const s = await docState(page);
        return { actual: `${s.path} y=${s.scrollY} (left at ${galleryY}); plates ${await page.locator('#procedures .plate-card').count()}`, ok: Math.abs(s.scrollY - galleryY) < 200 && (await page.locator('#procedures .plate-card').count()) === 7 };
      }, { shot: true });
      await j.finish();
    });
  });
}

// ------------------------------------------------------------------------- B: trust & credentials
for (const key of ['ar-light-390', 'en-dark-390', 'en-light-360', 'ar-dark-375', 'en-dark-768']) {
  const p = PROFILES[key];
  test.describe(`B ${key}`, () => {
    useProfile(p); test.setTimeout(120_000);
    test(`B — trust and credentials (${key})`, async ({ page }, testInfo) => {
      await prepare(page, { theme: p.theme, clearStorage: true });
      const j = await startJourney(page, testInfo, metaFor(p, `premium-b-${key}`, 'B — trust & credentials', 'Home → profile → qualifications → clinic information → booking.', home(p.lang)));
      await j.step('Open home; check the career scope line', 'The doctor name, FRCS and the 15,000+ scope line are in the hero', async () => {
        const s = await openUrl(page, home(p.lang));
        const t = await page.locator('.hero-facts').innerText();
        return { actual: `h1="${s.h1}"; facts: ${t.replace(/\s+/g, ' ').slice(0, 120)}`, ok: /FRCS/.test(t) && /15[,،٬]?000/.test(t) };
      }, { shot: true });
      await j.step('Tap "Discover his expertise" in the hero', 'The profile page opens at the top', async () => {
        const l = page.locator('#hero-about-cta'); await revealInFreeArea(page, l); await l.tap();
        await page.waitForURL(/\/about\/$/); await page.waitForTimeout(400); await settleScroll(page);
        const top = (await rect(page.locator('main .page-hero'))).y;
        return { actual: `url ${(await docState(page)).path}; page header top ${Math.round(top)}`, ok: top > -10 && top < 160 };
      }, { shot: true });
      await j.step('Scroll to the qualifications', 'FRCS and the Saudi Board are listed; rows do not overflow', async () => {
        const q = page.locator('#qualifications'); await revealInFreeArea(page, q.locator('.ledger-row').first());
        const text = await q.innerText(); const rows = await q.locator('.ledger-row').count(); const ov = await hOverflow(page);
        return { actual: `${rows} rows; FRCS=${/FRCS/.test(text)}; overflow ${ov}px`, ok: rows >= 3 && /FRCS/.test(text) && ov <= 0 };
      }, { shot: true });
      await j.step('Open the menu and tap "Clinic & booking"', 'The clinic page shows hours, the hospital and its address', async () => {
        await tapMenuLink(page, 'clinic', /\/clinic\/$/);
        const t = await page.locator('#clinic .visit').innerText();
        return { actual: t.replace(/\s+/g, ' ').slice(0, 140), ok: t.length > 40 && (await page.locator('#clinic .visit-hours-text').isVisible()) };
      }, { shot: true });
      await j.step('Tap "Directions in Google Maps"', 'Targets the hospital map (intercepted, not opened)', async () => {
        const l = page.locator('#clinic .visit a.link-quiet'); await revealInFreeArea(page, l); await l.tap();
        const h = await intercepted(page); return { actual: `→ ${h.at(-1)?.href}`, ok: h.at(-1)?.href === MAP };
      });
      await j.step('Tap the booking portal button', 'Targets the Magrabi portal in a new tab with rel=noopener (intercepted; no booking made)', async () => {
        const b = page.locator('#clinic-booking-cta'); await revealInFreeArea(page, b); await b.tap();
        const h = await intercepted(page);
        return { actual: `→ ${h.at(-1)?.href} target=${h.at(-1)?.target} rel=${h.at(-1)?.rel}`, ok: h.at(-1)?.href === BOOKING && h.at(-1)?.target === '_blank' && /noopener/.test(h.at(-1)?.rel) };
      }, { shot: true });
      if (p.w < 1024) {
        await j.step('Tap Call and WhatsApp in the bottom bar', 'tel: and WhatsApp hrefs are correct (intercepted; no call or message)', async () => {
          await clearIntercepted(page);
          await page.locator('#booking-bar .booking-action-call').tap();
          await page.locator('#booking-bar .booking-action-whatsapp').tap();
          const h = await intercepted(page);
          return { actual: h.map((x) => x.href.slice(0, 60)).join(' | '), ok: h[0]?.href === `tel:${C.callCenter.tel}` && WA.test(h[1]?.href || '') };
        });
      }
      await j.finish();
    });
  });
}

// ------------------------------------------------------------------------- C: cataract education
for (const key of ['ar-light-390', 'en-dark-390', 'ar-dark-320', 'en-light-430', 'ar-light-768']) {
  const p = PROFILES[key];
  test.describe(`C ${key}`, () => {
    useProfile(p); test.setTimeout(150_000);
    test(`C — cataract education (${key})`, async ({ page }, testInfo) => {
      await prepare(page, { theme: p.theme, clearStorage: true });
      const j = await startJourney(page, testInfo, metaFor(p, `premium-c-${key}`, 'C — cataract education', 'Home → cataract page → 3D simulator → Start → Pause → Next → Close.', home(p.lang)));
      await j.step('Open home and tap the cataract plate', 'The cataract page opens', async () => {
        await openUrl(page, home(p.lang));
        const s = await openProcedureViaPlate(page, 'cataract-surgery');
        return { actual: `${s.path} h1="${s.h1}"`, ok: s.h1 === NAME['cataract-surgery'][p.lang] };
      }, { shot: true });
      await j.step('Tap the "3D walkthrough" link under the hero', 'The 3D section comes on screen; the poster and Start button are visible', async () => {
        const l = page.locator('.proc-3d-jump a'); await revealInFreeArea(page, l); await l.tap();
        await page.waitForTimeout(1000); await settleScroll(page);
        const b = page.locator('#cataract-3d-start');
        const r = await rect(b);
        return { actual: `start button y ${Math.round(r.y)}, section state ${(await csim(page)).section}`, ok: await b.isVisible() };
      }, { shot: true });
      await j.step('Tap Start', 'The viewer reaches "ready" with one canvas', async () => {
        const b = page.locator('#cataract-3d-start'); await revealInFreeArea(page, b); await b.tap();
        const s = await waitCsim(page, ['ready'], 60000);
        return { actual: `state=${s.state} canvases=${s.canvases} instances=${s.instances}; stage: ${s.stageNum}`, ok: s.state === 'ready' && s.canvases === 1 && s.instances === 1 };
      }, { shot: true });
      await j.step('Tap the start overlay to play', 'The animation runs (pause icon shown)', async () => {
        const st = page.locator('#cataract-3d-stage [data-ref="start"]'); await revealInFreeArea(page, st); await st.tap();
        await page.waitForTimeout(1200);
        const s = await csim(page);
        return { actual: `mode=${s.mode}, scrubber ${s.scrubber}`, ok: s.mode === 'pause' };
      }, { shot: true });
      await j.step('Tap Pause', 'Playback stops and the scrubber holds still', async () => {
        const pp = page.locator('#cataract-3d-stage [data-ref="playPause"]'); await revealInFreeArea(page, pp); await pp.tap();
        await page.waitForTimeout(350);
        const a = await csim(page); await page.waitForTimeout(600); const b = await csim(page);
        return { actual: `mode=${a.mode}; scrubber ${a.scrubber} → ${b.scrubber}`, ok: a.mode === 'play' && Math.abs(a.scrubber - b.scrubber) <= 2 };
      });
      await j.step('Tap Next', 'The stage advances and its description updates', async () => {
        const before = await csim(page);
        const n = page.locator('#cataract-3d-stage [data-ref="next"]'); await revealInFreeArea(page, n); await n.tap();
        await page.waitForTimeout(600);
        const s = await csim(page);
        return { actual: `${before.stageNum} → ${s.stageNum}; "${s.stageTitle}"`, ok: s.stageNum !== before.stageNum && s.stageTitle.length > 3 };
      }, { shot: true });
      await j.step('Tap Close', 'The viewer closes, WebGL is released, focus returns to Start', async () => {
        const c = page.locator('#cataract-3d-stage [data-ref="close"]'); await revealInFreeArea(page, c); await c.tap();
        await page.waitForTimeout(450);
        const s = await csim(page); const gl = await glLive(page);
        const f = await page.evaluate(() => document.activeElement?.id);
        return { actual: `mounted=${s.mounted}; section=${s.section}; live contexts ${gl.live}, canvases ${gl.canvases}; focus #${f}`, ok: !s.mounted && s.section === 'idle' && gl.live === 0 && gl.canvases === 0 && f === 'cataract-3d-start' };
      }, { shot: true });
      await j.finish();
    });
  });
}

// ------------------------------------------------------------------------- D: vision & lens comparison
for (const key of ['ar-light-390', 'en-dark-390', 'en-light-360', 'ar-dark-375', 'en-dark-768']) {
  const p = PROFILES[key];
  test.describe(`D ${key}`, () => {
    useProfile(p); test.setTimeout(150_000);
    test(`D — vision and lens comparison (${key})`, async ({ page }, testInfo) => {
      await prepare(page, { theme: p.theme, clearStorage: true });
      const j = await startJourney(page, testInfo, metaFor(p, `premium-d-${key}`, 'D — vision & lens comparison', 'Home → Lens Lab → change lens → change distance → read the explanation → return.', home(p.lang)));
      await j.step('Open home, open the menu and tap Lens Lab', 'The Lens Lab page opens and the comparison module mounts', async () => {
        await openUrl(page, home(p.lang));
        await tapMenuLink(page, 'lens-lab', /\/lens-lab\/$/);
        await page.locator('#lens-lab-host .llab-chip').first().waitFor({ timeout: 30000 });
        const ov = await hOverflow(page);
        return { actual: `${(await docState(page)).path}; chips ${await page.locator('#lens-lab-host .llab-chip').count()}; overflow ${ov}px`, ok: ov <= 0 };
      }, { shot: true });
      let sit0 = '';
      await j.step('Tap a different lens for slot A', 'The radio selects it and the explanation text updates', async () => {
        const sit = page.locator('#lens-lab-host [data-ref="situation"]');
        sit0 = await sit.innerText();
        const label = page.locator('#lens-lab-host .llab-pick[data-slot="A"] label').nth(4);
        await revealInFreeArea(page, label); await label.tap(); await page.waitForTimeout(400);
        const v = await page.locator('#lens-lab-host .llab-pick[data-slot="A"] input:checked').inputValue();
        const sit1 = await sit.innerText();
        return { actual: `A=${v}; explanation changed=${sit1 !== sit0}`, ok: !!v && sit1 !== sit0 };
      }, { shot: true });
      await j.step('Tap a different distance / situation', 'The situation changes and the explanation is rewritten', async () => {
        const sit = page.locator('#lens-lab-host [data-ref="situation"]');
        const before = await sit.innerText();
        const labels = page.locator('#lens-lab-host .llab-chip-scn');
        const idx = (await page.locator('#lens-lab-host input[data-scn]').evaluateAll((x) => x.findIndex((i) => i.checked)));
        const l = labels.nth((idx + 2) % (await labels.count())); await revealInFreeArea(page, l); await l.tap(); await page.waitForTimeout(400);
        const after = await sit.innerText();
        return { actual: `changed=${after !== before}; "${after.replace(/\s+/g, ' ').slice(0, 90)}"`, ok: after !== before && after.length > 30 };
      }, { shot: true });
      await j.step('Read the explanation', 'Text ≥ 16 px, no sideways scroll, "educational, not a prediction" note visible', async () => {
        const sit = page.locator('#lens-lab-host [data-ref="situation"]'); await revealInFreeArea(page, sit.locator('p, li').first());
        const small = await smallText(page, '#lens-lab-host [data-ref="situation"] p, #lens-lab-host [data-ref="situation"] li', 16);
        const label = await page.locator('#lens-lab-host .llab-label').first().isVisible();
        const ov = await hOverflow(page);
        return { actual: `small text ${small.length} ${small.slice(0, 3).join(', ')}; label ${label}; overflow ${ov}px`, ok: !small.length && label && ov <= 0 };
      }, { shot: true, critical: false });
      await j.step('Press Back', 'Home page again, with no stray simulator left running', async () => {
        await page.goBack(); await page.waitForURL(new RegExp(`${p.lang === 'en' ? '/en/' : ':\\d+/'}$`), { timeout: 15000 }); await page.waitForTimeout(500);
        const gl = await glLive(page);
        return { actual: `${(await docState(page)).path}; live WebGL ${gl.live}; canvases ${gl.canvases}`, ok: gl.canvases === 0 };
      }, { shot: true });
      await j.finish();
    });
  });
}

// ------------------------------------------------------------------------- E: older Arabic-speaking patient
for (const [w, h, zoom] of [[320, 640, 125], [320, 640, 150], [360, 740, 125], [360, 740, 150]]) {
  const p = { w, h, lang: 'ar', theme: 'light' };
  test.describe(`E ${w} ${zoom}`, () => {
    useProfile(p); test.setTimeout(120_000);
    test(`E — older Arabic-speaking patient (${w}px, ${zoom}% text)`, async ({ page }, testInfo) => {
      // text-zoom emulation: root font size set before the app renders (document.documentElement may not exist yet)
      await page.addInitScript((z) => {
        const apply = () => { if (!document.documentElement) return false; document.documentElement.style.fontSize = `${z}%`; return true; };
        if (!apply()) new MutationObserver((_, o) => { if (apply()) o.disconnect(); }).observe(document, { childList: true });
      }, zoom);
      await prepare(page, { theme: 'light', clearStorage: true });
      const j = await startJourney(page, testInfo, metaFor(p, `premium-e-${w}-${zoom}`, 'E — older Arabic-speaking patient', 'Read at enlarged text, find cataract treatment, locate booking.', '/', { accessibilityMode: `Root font ${zoom}% (text zoom emulation)` }));
      await j.step('Open home at enlarged text', 'No sideways scroll; hero name and booking action visible without clipping', async () => {
        await openUrl(page, '/');
        const ov = await hOverflow(page);
        const c = await clipped(page, '.site-header');
        const hdr = await page.evaluate(() => { const w = document.querySelector('.wordmark').getBoundingClientRect(); const a = document.querySelector('.header-actions').getBoundingClientRect(); return { overlap: w.left < a.right && a.left < w.right, ww: Math.round(w.width), wa: Math.round(a.width) }; });
        return { actual: `overflow ${ov}px; clipped in header: ${c.join(',') || 'none'}; wordmark ${hdr.ww}px, actions ${hdr.wa}px, overlap=${hdr.overlap}`, ok: ov <= 0 && !c.length && !hdr.overlap };
      }, { shot: true });
      await j.step('Read the hero paragraph', 'Reading text is at least 16 px × zoom in effect and fully inside the page', async () => {
        const fs = await page.locator('.hero-intro').evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
        const c = await clipped(page, '.hero');
        return { actual: `hero text ${fs.toFixed(1)} px; clipped: ${c.join(',') || 'none'}`, ok: fs >= 16 * (zoom / 100) - 2 && !c.length };
      }, { shot: true, critical: false });
      await j.step('Open the menu', 'The sheet opens and all seven procedures are reachable', async () => {
        await openMenu(page);
        const n = await page.locator('#mobile-nav .drawer-procs a').count();
        const c = await clipped(page, '#mobile-nav');
        const small = await smallTargets(page, '#mobile-nav', 44);
        return { actual: `${n} procedure links; clipped: ${c.join(',') || 'none'}; small targets: ${small.length} ${small.slice(0, 2).join('; ')}`, ok: n === 7 && !c.length && !small.length };
      }, { shot: true, critical: false });
      await j.step('Tap the cataract treatment', 'The cataract page opens at its title', async () => {
        const l = page.locator(`#mobile-nav .drawer-procs a[href$="procedures/cataract-surgery/"]`);
        await l.scrollIntoViewIfNeeded(); await l.tap();
        await page.waitForURL(/procedures\/cataract-surgery\/$/); await page.locator('#p-anatomy').waitFor();
        await page.waitForTimeout(300);
        const s = await docState(page);
        return { actual: `h1="${s.h1}" y=${s.scrollY}`, ok: s.h1 === NAME['cataract-surgery'].ar && s.scrollY < 60 };
      }, { shot: true });
      await j.step('Read the procedure text', 'No sideways scroll; text not clipped', async () => {
        await page.mouse.wheel(0, 900); await page.waitForTimeout(400);
        const ov = await hOverflow(page); const c = await clipped(page, 'main');
        return { actual: `overflow ${ov}px; clipped: ${c.join(',') || 'none'}`, ok: ov <= 0 && !c.length };
      }, { shot: true, critical: false });
      await j.step('Locate booking', 'The bottom bar is visible with all three labels inside the viewport; the hero book button works', async () => {
        const bar = await page.locator('.booking-action').evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); const lab = e.querySelector('span'); return { h: Math.round(r.height), inView: r.left >= 0 && r.right <= innerWidth, fit: lab.getBoundingClientRect().left >= r.left + 1 && lab.getBoundingClientRect().right <= r.right - 1 }; }));
        const b = page.locator('.booking-action-book'); await b.tap();
        const hit = await intercepted(page);
        return { actual: `${JSON.stringify(bar)} → ${hit.at(-1)?.href}`, ok: bar.length === 3 && bar.every((x) => x.h >= 44 && x.inView && x.fit) && hit.at(-1)?.href === BOOKING };
      }, { shot: true });
      await j.finish();
    });
  });
}

// ------------------------------------------------------------------------- F: impatient user
for (const key of ['ar-light-390', 'en-dark-390', 'ar-dark-320']) {
  const p = PROFILES[key];
  test.describe(`F ${key}`, () => {
    useProfile(p); test.setTimeout(240_000);
    test(`F — impatient user (${key})`, async ({ page }, testInfo) => {
      await prepare(page, { theme: p.theme, clearStorage: true });
      const j = await startJourney(page, testInfo, metaFor(p, `premium-f-${key}`, 'F — impatient user', 'Rapid taps, navigation, simulator open/close cycles and toggles during transitions.', home(p.lang)));
      await j.step('Open home and tap the menu button 7 times rapidly', 'The drawer ends in a consistent state; scroll lock matches', async () => {
        await openUrl(page, home(p.lang));
        for (let i = 0; i < 7; i++) await page.locator('.mobile-menu-btn').tap({ force: true });
        await page.waitForTimeout(500);
        const s = await page.evaluate(() => ({ open: document.getElementById('mobile-nav').classList.contains('open'), lock: document.documentElement.classList.contains('drawer-open'), exp: document.querySelector('.mobile-menu-btn').getAttribute('aria-expanded') }));
        return { actual: JSON.stringify(s), ok: s.open === s.lock && String(s.open) === s.exp };
      }, { critical: false });
      await j.step('Close any open sheet and tap two nav links in quick succession', 'One final route; drawer closed; no lock left', async () => {
        if (await page.locator('#mobile-nav.open').count()) { await page.locator('.mobile-menu-btn').tap(); await page.waitForTimeout(400); }
        await openMenu(page);
        const links = page.locator('#mobile-nav .drawer-links a');
        await links.nth(1).tap({ force: true }); // "about" etc.
        await page.waitForTimeout(40);
        await links.nth(2).tap({ force: true, timeout: 1500 }).catch(() => {});
        await page.waitForTimeout(800); await settleScroll(page);
        const s = await docState(page);
        const lock = await page.evaluate(() => document.documentElement.classList.contains('drawer-open') || document.getElementById('mobile-nav').classList.contains('open'));
        return { actual: `${s.path} h1="${s.h1}" locked=${lock}`, ok: !lock && !!s.h1 };
      }, { shot: true });
      await j.step('Five quick language / theme toggles while routes change', 'Language, direction and theme stay consistent; no errors', async () => {
        await page.goto(path(p.lang, 'procedures/cataract-surgery/'));
        await page.locator('#p-anatomy').waitFor();
        const themeBtn = page.locator('.site-header #theme-toggle-btn');
        const canTheme = await themeBtn.isVisible(); // below 381 px the theme switch lives in the menu sheet
        for (let i = 0; i < 5; i++) {
          await page.locator('.site-header .lang-switch').tap({ force: true, timeout: 3000 });
          await page.waitForTimeout(20);
          if (canTheme) await themeBtn.tap({ force: true, timeout: 3000 });
        }
        await page.waitForTimeout(800);
        const s = await docState(page);
        const dirOk = (s.lang === 'ar') === (s.dir === 'rtl');
        const heading = await page.locator('main h1').count();
        return { actual: `${s.path} ${s.lang}/${s.dir}/${s.theme}; h1 count ${heading}`, ok: dirOk && heading === 1 };
      }, { shot: true });
      await j.step('Open and close the 3D viewer 5 times, tapping Close immediately after ready', 'After each cycle no canvas remains; never two instances', async () => {
        await page.goto(path(p.lang, 'procedures/cataract-surgery/'));
        await page.locator('#p-anatomy').waitFor();
        const rows = [];
        for (let i = 0; i < 5; i++) {
          const b = page.locator('#cataract-3d-start'); await revealInFreeArea(page, b); await b.tap();
          const s = await waitCsim(page, ['ready'], 60000);
          const c = page.locator('#cataract-3d-stage [data-ref="close"]'); await revealInFreeArea(page, c); await c.tap();
          await page.waitForTimeout(200);
          const gl = await glLive(page); rows.push(`${s.instances}/${gl.live}/${gl.canvases}`);
        }
        return { actual: `instances/liveGL/canvases after each cycle: ${rows.join(', ')}`, ok: rows.every((r) => r === '1/0/0') };
      }, { shot: true });
      await j.step('Tap Start and toggle theme and language during the load', 'The viewer ends up ready (or idle), in the final language, with exactly one instance', async () => {
        const b = page.locator('#cataract-3d-start'); await revealInFreeArea(page, b);
        await b.tap();
        await page.waitForTimeout(30);
        if (await page.locator('.site-header #theme-toggle-btn').isVisible()) await page.locator('.site-header #theme-toggle-btn').tap({ force: true });
        // the header slides back in when the viewer starts; a person taps it once it is on screen
        await page.waitForFunction(() => document.getElementById('site-header').getBoundingClientRect().top >= -1, null, { timeout: 3000 });
        await page.locator('.site-header .lang-switch').tap({ force: true });
        await page.waitForFunction(() => document.querySelector('#cataract-3d-stage .csim')?.dataset.state === 'ready', null, { timeout: 60000 });
        const s = await csim(page); const st = await docState(page);
        const lang = await page.locator('#cataract-3d-stage .csim').getAttribute('lang');
        return { actual: `state=${s.state} instances=${s.instances} page lang ${st.lang}, viewer lang ${lang}`, ok: s.instances === 1 && lang === st.lang };
      }, { shot: true });
      await j.step('Leave the page while the viewer is open', 'The viewer is torn down; no WebGL left', async () => {
        await page.mouse.wheel(0, -40000); await page.waitForTimeout(300);
        await page.locator('.wordmark').tap(); await page.waitForTimeout(700);
        const gl = await glLive(page);
        return { actual: `${(await docState(page)).path}; live ${gl.live}; canvases ${gl.canvases}`, ok: gl.live === 0 && gl.canvases === 0 };
      });
      await j.step('Double-tap a plate link', 'The page opens once: one history entry', async () => {
        await page.goto(path(p.lang, ''));
        await page.locator('#procedures .plate-card').first().waitFor();
        const link = page.locator('#procedures .plate-card[data-slug="icl"] .proc-card-link');
        await revealInFreeArea(page, link);
        const before = await page.evaluate(() => history.length);
        await link.tap({ force: true }); await link.tap({ force: true, timeout: 800 }).catch(() => {});
        await page.waitForTimeout(800);
        const after = await page.evaluate(() => history.length);
        return { actual: `history +${after - before}; ${(await docState(page)).path}`, ok: after - before <= 1 && /icl/.test(page.url()) };
      });
      await j.finish();
    });
  });
}

// ------------------------------------------------------------------------- G: slow network and failed simulator load
for (const [net, key] of [['slow-3g', 'ar-light-390'], ['fast-3g', 'en-dark-390'], ['fast-3g', 'ar-dark-320']]) {
  const p = PROFILES[key];
  test.describe(`G ${net} ${key}`, () => {
    useProfile(p); test.setTimeout(300_000);
    test(`G — slow network (${net}, ${key})`, async ({ page }, testInfo) => {
      await prepare(page, { theme: p.theme, clearStorage: true });
      const j = await startJourney(page, testInfo, metaFor(p, `premium-g-${net}-${key}`, 'G — slow network', 'Load on a throttled connection, scroll while images load, open a procedure.', home(p.lang), { network: `${net} (CDP throttling)` }));
      await throttle(page, net, net === 'slow-3g' ? 4 : 1);
      let t0 = 0;
      await j.step(`Load home on ${net}`, 'A heading is on screen; nothing is blocking; no failed requests', async () => {
        t0 = Date.now();
        await page.goto(home(p.lang), { waitUntil: 'commit', timeout: 120000 });
        await page.locator('main h1').first().waitFor({ timeout: 90000 });
        const ms = Date.now() - t0;
        return { actual: `h1 after ${ms} ms`, ok: ms < 90000 };
      }, { shot: true, timeout: 120000 });
      await j.step('Scroll while images are still loading', 'No sideways scroll; text is visible; no failed requests', async () => {
        for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 600); await page.waitForTimeout(120); }
        await settleScroll(page);
        const ov = await hOverflow(page);
        const missing = await page.evaluate(() => [...document.querySelectorAll('main img')].filter((i) => i.getBoundingClientRect().height === 0 && i.loading === 'eager').length);
        return { actual: `y=${await page.evaluate(() => Math.round(scrollY))}; overflow ${ov}px; eager images with no height: ${missing}`, ok: ov <= 0 };
      }, { shot: true, timeout: 120000 });
      await j.step('Open a procedure plate', 'The procedure page opens with readable text, even before images arrive', async () => {
        const link = page.locator('#procedures .plate-card[data-slug="corneal-transplant"] .proc-card-link');
        await revealInFreeArea(page, link); await link.tap();
        await page.waitForURL(/corneal-transplant\/$/, { timeout: 60000 }); await page.locator('#p-anatomy').waitFor({ timeout: 90000 });
        const s = await docState(page);
        return { actual: `h1="${s.h1}" y=${s.scrollY}`, ok: s.h1 === NAME['corneal-transplant'][p.lang] };
      }, { shot: true, timeout: 180000 });
      await j.step('Check the bottom bar and overflow on the slow page', 'Bar visible, no overflow', async () => {
        const ov = await hOverflow(page);
        return { actual: `overflow ${ov}px; bar visible ${await page.locator('#booking-bar').isVisible()}`, ok: ov <= 0 && await page.locator('#booking-bar').isVisible() };
      });
      await j.finish();
    });
  });
}

for (const key of ['ar-light-390', 'en-dark-390']) {
  const p = PROFILES[key];
  test.describe(`G failure ${key}`, () => {
    useProfile(p); test.setTimeout(150_000);
    test(`G — simulator failure and retry (${key})`, async ({ page }, testInfo) => {
      await prepare(page, { theme: p.theme, clearStorage: true });
      const j = await startJourney(page, testInfo, metaFor(p, `premium-g-failure-${key}`, 'G — failed simulator load', 'The 3D and vision downloads fail; the patient sees a clear message and retry works.', path(p.lang, 'procedures/cataract-surgery/'), { network: 'three.js / cataract-sim / vision-sim chunks aborted by route (deliberate)' }));
      j.expectFailure(/three\.module|cataract-sim|vision-sim|lens-lab|scenes-|pipeline-/);
      const CHUNK = /assets\/(three\.module|cataract-sim|vision-sim)-/;
      let abort = true;
      await page.route(CHUNK, (r) => (abort ? r.abort() : r.continue()));
      await j.step('Open the cataract page and tap Start with the 3D download failing', 'Error status appears, the Start button stays, no reserved blank stage', async () => {
        await openUrl(page, path(p.lang, 'procedures/cataract-surgery/'));
        const b = page.locator('#cataract-3d-start'); await revealInFreeArea(page, b); await b.tap();
        await page.waitForFunction(() => document.getElementById('cataract-3d')?.dataset.state === 'error', null, { timeout: 30000 });
        const status = await page.locator('.c3d-status').innerText();
        const stage = await page.locator('#cataract-3d-stage').isVisible();
        return { actual: `status "${status.trim().slice(0, 80)}"; stage visible ${stage}; Start visible ${await b.isVisible()}`, ok: status.length > 10 && !stage && await b.isVisible() };
      }, { shot: true });
      await j.step('Retry with the network restored', 'The viewer reaches ready with one canvas', async () => {
        abort = false;
        const b = page.locator('#cataract-3d-start'); await revealInFreeArea(page, b); await b.tap();
        const s = await waitCsim(page, ['ready'], 60000);
        return { actual: `state=${s.state}, canvases ${s.canvases}`, ok: s.state === 'ready' && s.canvases === 1 };
      }, { shot: true });
      await j.step('Close the viewer', 'WebGL released', async () => {
        const c = page.locator('#cataract-3d-stage [data-ref="close"]'); await revealInFreeArea(page, c); await c.tap(); await page.waitForTimeout(300);
        const gl = await glLive(page); return { actual: `live ${gl.live}, canvases ${gl.canvases}`, ok: gl.live === 0 && gl.canvases === 0 };
      });
      abort = true;
      await j.step('Open Lens Lab with the vision-simulator download failing', 'A message and Try again appear; no blank box', async () => {
        await page.goto(path(p.lang, 'lens-lab/')); await page.locator('#simulator-host').waitFor();
        await revealInFreeArea(page, page.locator('#simulator h2'));
        for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 400); await page.waitForTimeout(120); }
        const err = page.locator('#simulator-host .vsim-load-error');
        await err.waitFor({ timeout: 30000 });
        const h = (await rect(page.locator('#simulator-host'))).h;
        return { actual: `error message shown; host height ${Math.round(h)} px`, ok: h < 400 };
      }, { shot: true });
      await j.step('Tap Try again with the network restored', 'The simulator mounts with a canvas', async () => {
        abort = false;
        const b = page.locator('#simulator-host [data-vsim-retry]'); await revealInFreeArea(page, b); await b.tap();
        await page.waitForFunction(() => { const r = document.querySelector('#simulator-host .vsim'); return r && (r.querySelector('canvas') || r.classList.contains('vsim--fallback')); }, null, { timeout: 60000 });
        return { actual: `canvases ${await page.locator('#simulator-host canvas').count()}`, ok: (await page.locator('#simulator-host canvas').count()) >= 1 };
      }, { shot: true });
      await j.finish();
    });
  });
}

// ------------------------------------------------------------------------- touch interaction checks
for (const key of ['ar-light-390', 'en-dark-390', 'ar-dark-320', 'en-light-360', 'en-light-430', 'ar-light-768']) {
  const p = PROFILES[key];
  test.describe(`T ${key}`, () => {
    useProfile(p); test.setTimeout(150_000);
    test(`Touch interactions (${key})`, async ({ page }, testInfo) => {
      await prepare(page, { theme: p.theme, clearStorage: true });
      const j = await startJourney(page, testInfo, metaFor(p, `premium-touch-${key}`, 'Touch interactions', 'Tap targets, menu sheet, header hide/show, sticky bar, plates, FAQ, scrollspy.', home(p.lang)));
      let cdp = null;
      await j.step('Measure tap targets on home', 'Every link and button is at least 44 × 44 px (inline text links excepted)', async () => {
        await openUrl(page, home(p.lang));
        const small = await smallTargets(page, '#app', 44);
        return { actual: `${small.length} small: ${small.slice(0, 5).join('; ')}`, ok: !small.length };
      }, { critical: false, shot: true });
      await j.step('Measure tap targets on the cataract page', 'Every link and button is at least 44 × 44 px', async () => {
        await page.goto(path(p.lang, 'procedures/cataract-surgery/')); await page.locator('#p-anatomy').waitFor();
        const small = await smallTargets(page, '#app', 44);
        return { actual: `${small.length} small: ${small.slice(0, 5).join('; ')}`, ok: !small.length };
      }, { critical: false });
      await page.goto(home(p.lang)); await page.locator('main h1').first().waitFor();
      await j.step('Swipe down the home page, then up', 'The header slides away while reading down and returns on the first swipe up', async () => {
        cdp = await swipe(page, { x: 180, y: 600, dy: -420, cdp, steps: 10 });
        cdp = await swipe(page, { x: 180, y: 600, dy: -420, cdp, steps: 10 });
        await page.waitForTimeout(600);
        const down = await page.locator('#site-header').evaluate((h) => h.classList.contains('is-hidden'));
        cdp = await swipe(page, { x: 180, y: 300, dy: 160, cdp, steps: 8 });
        await page.waitForTimeout(600);
        const up = await page.locator('#site-header').evaluate((h) => h.classList.contains('is-hidden'));
        return { actual: `after swipe down hidden=${down}; after swipe up hidden=${up}`, ok: down && !up };
      }, { shot: true, critical: false });
      await j.step('Open and close the menu sheet', 'Full-height sheet opens, page behind does not scroll, close returns focus to Menu', async () => {
        await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(300);
        await page.locator('.mobile-menu-btn').tap(); await page.locator('#mobile-nav.open').waitFor(); await page.waitForTimeout(500);
        const r = await rect(page.locator('#mobile-nav'));
        const vh = page.viewportSize().height;
        const y0 = await page.evaluate(() => scrollY);
        await swipe(page, { x: 200, y: 500, dy: -200 });
        const y1 = await page.evaluate(() => scrollY);
        await page.locator('.mobile-menu-btn').tap(); await page.waitForTimeout(400);
        const f = await page.evaluate(() => document.activeElement?.className || '');
        const open = await page.locator('#mobile-nav').evaluate((n) => n.classList.contains('open'));
        return { actual: `sheet ${Math.round(r.y)}+${Math.round(r.h)} of ${vh}; page scroll ${y0} → ${y1}; open after close ${open}; focus "${String(f).split(' ').slice(0, 3).join(' ')}"`, ok: r.h >= vh * 0.8 && y1 === y0 && !open && /mobile-menu-btn/.test(f) };
      }, { shot: true, critical: false });
      await j.step('After using the menu, swipe down again', 'The header still slides away (a tap on the sheet must not pin it)', async () => {
        cdp = await swipe(page, { x: 180, y: 600, dy: -420, cdp, steps: 10 });
        cdp = await swipe(page, { x: 180, y: 600, dy: -420, cdp, steps: 10 });
        await page.waitForTimeout(600);
        const hidden = await page.locator('#site-header').evaluate((h) => h.classList.contains('is-hidden'));
        return { actual: `hidden=${hidden}, y=${await page.evaluate(() => Math.round(scrollY))}`, ok: hidden };
      }, { critical: false });
      await j.step('Scroll to the very bottom of the page', 'The bottom bar does not cover the last content', async () => {
        await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await page.waitForTimeout(500);
        await page.mouse.wheel(0, 2000); await page.waitForTimeout(500);
        const g = await page.evaluate(() => { const last = [...document.querySelectorAll('.site-footer .footer-bottom *')].filter((e) => e.getClientRects().length).pop().getBoundingClientRect(); const bar = document.getElementById('booking-bar').getBoundingClientRect(); const shown = getComputedStyle(document.getElementById('booking-bar')).display !== 'none' && bar.height; return { lastBottom: Math.round(last.bottom), barTop: Math.round(shown ? bar.top : innerHeight) }; });
        return { actual: `last footer text bottom ${g.lastBottom}, bar top ${g.barTop}`, ok: g.lastBottom <= g.barTop };
      }, { shot: true, critical: false });
      await j.step('Tap a gallery plate on its image', 'The whole plate is one tap target', async () => {
        await page.goto(home(p.lang)); await page.locator('#procedures .plate-card').first().waitFor();
        const fig = page.locator('#procedures .plate-card[data-slug="lens-implants"] .pc-fig');
        const r = await revealInFreeArea(page, fig);
        await page.touchscreen.tap(r.x + r.w / 2, r.y + r.h / 2);
        await page.waitForTimeout(600);
        return { actual: (await docState(page)).path, ok: /lens-implants/.test(page.url()) };
      }, { shot: true, critical: false });
      await j.step('Open and close a homepage FAQ', 'The accordion opens and closes on tap', async () => {
        await page.goto(home(p.lang)); await page.locator('#faq .faq-question').first().waitFor();
        const q = page.locator('#faq .faq-question').first(); await revealInFreeArea(page, q); await q.tap(); await page.waitForTimeout(350);
        const a = await q.getAttribute('aria-expanded');
        await q.tap(); await page.waitForTimeout(350);
        const b = await q.getAttribute('aria-expanded');
        return { actual: `${a} → ${b}`, ok: a === 'true' && b === 'false' };
      }, { critical: false });
      await j.step('Scroll a procedure page and open "On this page"', 'The current section is marked in the list', async () => {
        await page.goto(path(p.lang, 'procedures/lens-implants/')); await page.locator('#p-risks').waitFor();
        await page.locator('#p-risks').evaluate((e) => { const y = e.getBoundingClientRect().top + scrollY - 200; scrollTo(0, y); });
        await page.waitForTimeout(700);
        const cur = await page.evaluate(() => [...document.querySelectorAll('details.toc-m a.is-current, details.toc-m a[aria-current]')].map((a) => a.dataset.spy));
        return { actual: `marked: ${cur.join(',') || 'none'}`, ok: cur.includes('p-risks') };
      }, { critical: false, shot: true });
      await j.step('Booking bar does not cover content while reading', 'A section heading scrolled to the band under the header is above the bar', async () => {
        const h = page.locator('#p-recovery h2'); const r = await revealInFreeArea(page, h); const top = await barTop(page);
        return { actual: `heading bottom ${Math.round(r.bottom)}, bar top ${Math.round(top)}`, ok: r.bottom <= top };
      }, { critical: false });
      await j.finish();
    });
  });
}
