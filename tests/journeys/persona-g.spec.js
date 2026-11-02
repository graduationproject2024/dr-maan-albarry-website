// Persona G — returning patient (emulated iPhone 15 Pro Max, Chromium, touch).
// reopen → persisted language and theme → deep link to an internal page → booking → back
import { test } from '@playwright/test';
import { startJourney, prepare, device, intercepted, rect } from './harness.js';
import { openUrl, docState, BOOKING, NAME } from './site.js';

test.use({ ...device('iPhone 15 Pro Max') });
test.setTimeout(150_000);

test('Persona G — returning patient', async ({ page, context }, testInfo) => {
  await prepare(page, { clearStorage: true });
  const j = await startJourney(page, testInfo, {
    id: 'persona-g', persona: 'G — returning patient', objective: 'Come back to the site later: English and dark mode should be remembered; a shared deep link should open the right place; booking and Back should work.',
    device: 'iPhone 15 Pro Max (Playwright descriptor: 430×739, DPR 3, iOS UA) — rendered by Chromium', language: 'en (chosen on the first visit)', theme: 'dark (chosen on the first visit)', startUrl: '/',
  });

  await j.step('First visit: open the site, tap "EN", then tap the theme switch', 'English, dark; both saved', async () => {
    await openUrl(page, '/');
    await page.locator('.site-header .lang-switch').tap();
    await page.waitForURL(/\/en\/$/);
    await page.locator('#theme-toggle-btn').tap();
    const st = await page.evaluate(() => ({ lang: localStorage.getItem('lang'), theme: localStorage.getItem('theme'), dt: document.documentElement.dataset.theme }));
    return { actual: `saved lang=${st.lang} theme=${st.theme}; page theme=${st.dt}`, ok: st.lang === 'en' && st.theme === 'dark' && st.dt === 'dark' };
  }, { shot: true });

  let page2;
  await j.step('Close the tab; later open the bare address "/" in a new tab', 'Lands on the English home (/en/) in dark mode with no flash of light theme', async () => {
    await page.close();
    page2 = await context.newPage();
    await prepare(page2);
    j.attach(page2);
    await page2.addInitScript(() => { document.addEventListener('DOMContentLoaded', () => { window.__themeAtDCL = document.documentElement.getAttribute('data-theme'); }); });
    const s = await openUrl(page2, '/');
    const dcl = await page2.evaluate(() => window.__themeAtDCL);
    return { actual: `url=${(await docState(page2)).path} lang=${s.lang} theme=${s.theme} (at DOMContentLoaded: ${dcl})`, ok: s.lang === 'en' && s.theme === 'dark' && dcl === 'dark' && (await docState(page2)).path === '/en/' };
  }, { shot: true });

  await j.step('Open a shared deep link: /en/procedures/keratoconus-cxl/#p-risks', 'Keratoconus page in English, dark, with the risks section on screen', async () => {
    await page2.goto('/en/procedures/keratoconus-cxl/#p-risks');
    await page2.locator('#p-risks').waitFor();
    await page2.waitForTimeout(1200);
    const top = (await rect(page2.locator('#p-risks'))).y;
    const s = await docState(page2);
    return { actual: `h1="${s.h1}" theme=${s.theme}; #p-risks top=${Math.round(top)}px (viewport ${page2.viewportSize().height}px)`, ok: s.h1 === NAME['keratoconus-cxl'].en && s.theme === 'dark' && top >= -5 && top < page2.viewportSize().height * 0.5 };
  }, { shot: true });

  await j.step('Tap "Book a consultation with Dr. Maan" (scroll up first)', 'Targets the booking portal (intercepted)', async () => {
    const b = page2.locator('.proc-cta a[data-cta="book"]');
    await b.scrollIntoViewIfNeeded(); await b.tap();
    const hits = await intercepted(page2);
    return { actual: `→ ${hits.length ? hits[hits.length - 1].href : 'nothing'}`, ok: hits.length > 0 && hits[hits.length - 1].href === BOOKING };
  });

  let yBefore = 0;
  await j.step('Scroll to the related procedures and tap the corneal transplant card', 'Corneal transplant page opens at the top', async () => {
    const link = page2.locator('.proc-related .proc-card-link[href$="procedures/corneal-transplant/"]');
    await link.scrollIntoViewIfNeeded();
    yBefore = await page2.evaluate(() => Math.round(scrollY));
    await link.tap();
    await page2.waitForURL(/corneal-transplant\/$/);
    const s = await docState(page2);
    return { actual: `h1="${s.h1}" y=${s.scrollY}`, ok: s.h1 === NAME['corneal-transplant'].en && s.scrollY < 50 };
  });

  await j.step('Press Back', 'Returns to the keratoconus page near where the reader left it', async () => {
    await page2.goBack();
    await page2.waitForURL(/keratoconus-cxl\//);
    await page2.waitForTimeout(500);
    const s = await docState(page2);
    return { actual: `h1="${s.h1}" y=${s.scrollY} (left at ${yBefore})`, ok: s.h1 === NAME['keratoconus-cxl'].en && Math.abs(s.scrollY - yBefore) < 200 };
  });

  await j.step('Reload the page', 'Same page, still English and dark', async () => {
    await page2.reload();
    await page2.locator('#app main h1').waitFor();
    const s = await docState(page2);
    return { actual: `${s.path} lang=${s.lang} theme=${s.theme}`, ok: s.lang === 'en' && s.theme === 'dark' && /keratoconus-cxl/.test(s.path) };
  }, { shot: true });

  await j.finish();
});
