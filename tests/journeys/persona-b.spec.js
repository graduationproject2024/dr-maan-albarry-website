// Persona B — first-time visitor (emulated Pixel 7, Chromium, touch, device in dark mode, no saved choices).
// services → several procedures → qualifications → hospital location (Maps) → booking portal
import { test } from '@playwright/test';
import { startJourney, prepare, device, rect, swipe, intercepted, hOverflow, settleScroll } from './harness.js';
import { openUrl, docState, BOOKING, MAP, NAME } from './site.js';

test.use({ ...device('Pixel 7'), colorScheme: 'dark' });
test.setTimeout(150_000);

test('Persona B — first-time visitor', async ({ page }, testInfo) => {
  await prepare(page, { clearStorage: true });
  const j = await startJourney(page, testInfo, {
    id: 'persona-b', persona: 'B — first-time visitor', objective: 'Work out what the doctor treats, compare a few procedures, check his qualifications, find the hospital and the booking portal.',
    device: 'Pixel 7 (Playwright descriptor: 412×839, DPR 2.625, Android UA, touch)', language: 'ar', theme: 'dark (follows the device: prefers-color-scheme: dark, nothing saved)', startUrl: '/',
  });

  await j.step('Open the site for the first time (device in dark mode)', 'Arabic page in the dark theme, following the device', async () => {
    const s = await openUrl(page, '/');
    return { actual: `lang=${s.lang} theme=${s.theme}`, ok: s.lang === 'ar' && s.theme === 'dark' };
  }, { shot: true });

  await j.step('Tap the menu button', 'The site menu opens and the button reports expanded', async () => {
    await page.locator('.mobile-menu-btn').tap();
    await page.waitForTimeout(400);
    const open = await page.locator('#mobile-nav').evaluate((n) => n.classList.contains('open'));
    const exp = await page.locator('.mobile-menu-btn').getAttribute('aria-expanded');
    return { actual: `drawer open=${open}, aria-expanded=${exp}`, ok: open && exp === 'true' };
  }, { shot: true });

  await j.step('Tap "الإجراءات" (services) in the menu', 'Menu closes; the procedure library page opens just under the header (Phase 1: its own page)', async () => {
    await page.locator('#mobile-nav .drawer-links a[data-section="procedures"]').tap();
    await page.waitForURL(/\/procedures\/$/);
    await page.waitForTimeout(300); await settleScroll(page);
    const open = await page.locator('#mobile-nav').evaluate((n) => n.classList.contains('open'));
    const top = (await rect(page.locator('main .page-hero'))).y;
    const hdr = (await rect(page.locator('#site-header'))).bottom;
    return { actual: `drawer open=${open}; library header top=${Math.round(top)}px, header bottom=${Math.round(hdr)}px; url=${(await docState(page)).path}`, ok: !open && top >= hdr - 20 && top < hdr + 60 };
  }, { shot: true });

  await j.step('Tap the group filter chips one by one, then "جميع الإجراءات"', 'Each chip shows only its group and reports pressed; "all" restores 7 cards', async () => {
    const chips = page.locator('.proc-filter .chip');
    const n = await chips.count();
    const seen = [];
    for (let i = 1; i < n; i++) {
      await chips.nth(i).tap();
      const vis = await page.locator('.proc-grid .proc-card:not([hidden])').count();
      seen.push(`${(await chips.nth(i).innerText()).trim()}:${vis}:${await chips.nth(i).getAttribute('aria-pressed')}`);
    }
    await chips.nth(0).tap();
    const all = await page.locator('.proc-grid .proc-card:not([hidden])').count();
    return { actual: `${seen.join(' | ')} → all: ${all}`, ok: all === 7 && seen.every((s) => /:true$/.test(s) && !/:0:/.test(s)) };
  });

  await j.step('Tap "تفاصيل الإجراء" on the lens implants card', 'The lens implants page opens at its title', async () => {
    const link = page.locator('#procedures .proc-card').filter({ hasText: NAME['lens-implants'].ar }).locator('.proc-card-link');
    await link.scrollIntoViewIfNeeded(); await link.tap();
    await page.waitForURL(/procedures\/lens-implants\/$/); await page.locator('#p-anatomy').waitFor();
    const s = await docState(page);
    return { actual: `${s.path} h1="${s.h1}" y=${s.scrollY}`, ok: s.h1 === NAME['lens-implants'].ar && s.scrollY < 50 };
  }, { shot: true });

  let relatedSlug = '';
  await j.step('Scroll to "إجراءات ذات صلة" and tap the first related procedure', 'Another procedure page opens', async () => {
    const card = page.locator('.proc-related .proc-card').first();
    const link = card.locator('.proc-card-link');
    await link.scrollIntoViewIfNeeded();
    const href = await link.getAttribute('href');
    relatedSlug = href.match(/procedures\/([^/]+)\//)[1];
    await link.tap();
    await page.waitForURL(new RegExp(`procedures/${relatedSlug}/$`));
    const s = await docState(page);
    return { actual: `${s.path} h1="${s.h1}"`, ok: s.h1 === NAME[relatedSlug].ar };
  });

  await j.step('Press the browser back button', 'Returns to the lens implants page', async () => {
    await page.goBack();
    await page.waitForURL(/procedures\/lens-implants\/$/);
    await page.waitForTimeout(300);
    const s = await docState(page);
    return { actual: `${s.path} h1="${s.h1}" y=${s.scrollY}`, ok: s.h1 === NAME['lens-implants'].ar };
  });

  await j.step('Open the menu and tap "عن الدكتور" (qualifications)', 'The physician profile opens at the top; FRCS and the current role are listed in the qualifications ledger', async () => {
    await page.locator('.mobile-menu-btn').tap();
    await page.waitForTimeout(300);
    await page.locator('#mobile-nav .drawer-links a[data-section="about"]').tap();
    await page.waitForURL(/\/about\/$/);
    await page.waitForTimeout(500); await settleScroll(page);
    const top = (await rect(page.locator('main .page-hero'))).y;
    const text = await page.locator('#qualifications').innerText();
    return { actual: `page header top=${Math.round(top)}px; FRCS listed=${/FRCS/.test(text)}; current role listed=${/كبير موظفي/.test(text)}; ledger rows=${await page.locator('#qualifications .ledger-row').count()}`, ok: top < 150 && top > -10 && /FRCS/.test(text) && /كبير موظفي/.test(text) };
  }, { shot: true });

  await j.step('Open the menu, tap "العيادة والحجز", swipe to the directions and tap "الاتجاهات عبر خرائط جوجل"', 'Google Maps link with the hospital location opens in a new tab (intercepted)', async () => {
    await page.locator('.mobile-menu-btn').tap(); await page.waitForTimeout(300);
    await page.locator('#mobile-nav .drawer-links a[data-section="clinic"]').tap();
    await page.waitForURL(/\/clinic\/$/); await page.waitForTimeout(400);
    const link = page.locator('#clinic .visit a.link-quiet');
    let cdp = null;
    for (let i = 0; i < 40; i++) {
      const r = await rect(link);
      if (r.y > 80 && r.bottom < 760) break;
      cdp = await swipe(page, { x: 200, y: 650, dy: r.y > 0 ? -450 : 450, cdp });
    }
    await link.tap();
    const hits = await intercepted(page);
    const last = hits[hits.length - 1] || {};
    const address = await page.locator('#clinic .visit-row').nth(1).innerText();
    return { actual: `tapped → ${last.href} (${last.target}); address shown: "${address.replace(/\s+/g, ' ').slice(0, 80)}"`, ok: last.href === MAP && last.target === '_blank' };
  }, { shot: true });

  await j.step('Check the embedded map has an accessible title', 'Map iframe has a descriptive title', async () => {
    const title = await page.locator('#clinic iframe').getAttribute('title');
    return { actual: `iframe title="${title}"`, ok: !!title && title.length > 10 };
  }, { critical: false });

  await j.step('Tap "الحجز عبر بوابة مغربي"', 'Targets the Magrabi booking portal in a new tab with rel=noopener', async () => {
    await page.locator('#clinic-booking-cta').scrollIntoViewIfNeeded();
    await page.locator('#clinic-booking-cta').tap();
    const hits = await intercepted(page);
    const last = hits[hits.length - 1] || {};
    return { actual: `→ ${last.href} target=${last.target} rel=${last.rel}`, ok: last.href === BOOKING && last.target === '_blank' && /noopener/.test(last.rel) };
  }, { shot: true });

  await j.step('Check the page does not scroll sideways', 'No horizontal overflow', async () => {
    const ov = await hOverflow(page);
    return { actual: `horizontal overflow ${ov}px`, ok: ov <= 0 };
  }, { critical: false });

  await j.finish();
});
