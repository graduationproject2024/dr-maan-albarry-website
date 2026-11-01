// Closure sprint — full viewport/language/theme smoke matrix plus fixes for
// ARIA state, Escape, language persistence, WebGL context loss and SEO metadata.
import { test, expect } from '@playwright/test';
import { DOCTOR } from '../doctor-data.js';

const C = DOCTOR.contact;
const VIEWPORTS = [[360, 800], [390, 844], [768, 1024], [1366, 768], [1440, 900]];

async function open(page, { lang = 'ar', theme = 'light' } = {}) {
  await page.addInitScript(t => { try { localStorage.setItem('theme', t); } catch (e) { /* ignore */ } }, theme);
  await page.goto('/');
  if (lang === 'en') await page.evaluate(() => window.toggleLang());
  await expect(page.locator('html')).toHaveAttribute('lang', lang);
}

for (const [w, h] of VIEWPORTS) {
  for (const lang of ['ar', 'en']) {
    for (const theme of ['light', 'dark']) {
      test(`smoke ${w}x${h} ${lang} ${theme}: loads, scrolls, links, no overflow/errors`, async ({ page }) => {
        await page.setViewportSize({ width: w, height: h });
        const errors = [];
        page.on('pageerror', e => errors.push(String(e)));
        page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
        await open(page, { lang, theme });
        await expect(page.locator('h1.hero-title')).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(w);
        // scroll works end to end
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
        // every booking / call / WhatsApp / maps link points at approved data
        for (const href of await page.$$eval('[data-cta="book"]', a => a.map(x => x.href))) expect(href).toBe(C.bookingUrl);
        for (const href of await page.$$eval('a[href^="tel:"]', a => a.map(x => x.getAttribute('href')))) expect([`tel:${C.callCenter.tel}`, `tel:${C.callCenterShort.tel}`]).toContain(href);
        for (const href of await page.$$eval('a[href*="wa.me"]', a => a.map(x => x.href))) expect(href).toContain(`wa.me/${C.whatsapp.number}?text=`);
        const maps = await page.$$eval(`a[href="${DOCTOR.clinic.mapUrl}"]`, a => a.length);
        expect(maps).toBeGreaterThanOrEqual(3);
        await expect(page.locator('.btn-header-book').first()).toHaveAttribute('href', C.bookingUrl);
        // no fixed/sticky overlay other than header + booking bar covers the viewport centre
        const blocker = await page.evaluate(() => {
          const el = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
          return el ? getComputedStyle(el).position === 'fixed' && !el.closest('#site-header, #booking-bar') : false;
        });
        expect(blocker).toBe(false);
        expect(errors).toEqual([]);
      });
    }
  }
}

test.describe('Interaction & accessibility fixes', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('language choice persists across reload', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await page.evaluate(() => window.toggleLang());
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  });

  test('mobile drawer: aria-expanded in sync, Escape closes and restores focus', async ({ page }) => {
    await open(page);
    const btn = page.locator('.mobile-menu-btn');
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
    await btn.click();
    await expect(page.locator('#mobile-nav')).toHaveClass(/open/);
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-nav')).not.toHaveClass(/open/);
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
    await expect(btn).toBeFocused();
  });

  test('FAQ and article accordions keep aria-expanded in sync', async ({ page }) => {
    await open(page);
    const q = page.locator('#faq-0 .faq-question');
    await q.click();
    await expect(q).toHaveAttribute('aria-expanded', 'true');
    await q.click();
    await expect(q).toHaveAttribute('aria-expanded', 'false');
    const t = page.locator('.article-trigger').first();
    await expect(t).toHaveAttribute('aria-expanded', 'false');
    await t.click();
    await expect(t).toHaveAttribute('aria-expanded', 'true');
  });

  test('simulator shows a fallback message when the WebGL context is lost', async ({ page }) => {
    await open(page);
    await page.locator('#vs-view').scrollIntoViewIfNeeded();
    const lost = await page.evaluate(() => {
      const gl = document.querySelector('#vs-gl').getContext('webgl2');
      const ext = gl && gl.getExtension('WEBGL_lose_context');
      if (!ext) return false;
      ext.loseContext();
      return true;
    });
    expect(lost).toBe(true);
    await expect(page.locator('#vs-view .vs-fallback')).toBeVisible();
  });

  test('swipe rows on phones keep all cards in the DOM and are keyboard-focusable', async ({ page }) => {
    await open(page);
    for (const sel of ['.qualifications-grid', '.tech-grid']) {
      const row = page.locator(sel);
      await expect(row).toHaveAttribute('tabindex', '0');
      await expect(row.locator(':scope > *')).toHaveCount(4);
      const { sw, cw } = await row.evaluate(e => ({ sw: e.scrollWidth, cw: e.clientWidth }));
      expect(sw).toBeGreaterThan(cw); // content scrolls inside the row, not the page
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });
});

test.describe('SEO metadata', () => {
  test('title, description, canonical, hreflang, robots and sitemap are served', async ({ page, request }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/معن/);
    expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toMatch(/^https:\/\//);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(3);
    for (const path of ['robots.txt', 'sitemap.xml', 'llms.txt']) expect((await request.get(path)).ok(), path).toBe(true);
  });
});
