// Closure sprint — full viewport/language/theme smoke matrix plus fixes for
// ARIA state, Escape, language persistence, WebGL context loss and SEO metadata.
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { DOCTOR } from '../doctor-data.js';

const C = DOCTOR.contact;
const VIEWPORTS = [[360, 800], [390, 844], [430, 932], [768, 1024], [1366, 768], [1440, 900], [1920, 1080]];

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
        // header and a booking entry point are on the first screen (header button on desktop, sticky bar on phones/tablets)
        await expect(page.locator('#site-header')).toBeVisible();
        const bookVisible = await page.evaluate(() => [...document.querySelectorAll('.btn-header-book, #booking-bar .booking-action-book')]
          .some(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height >= 44 && r.top >= 0 && r.bottom <= innerHeight && getComputedStyle(el).visibility !== 'hidden'; }));
        expect(bookVisible).toBe(true);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(w);
        // scroll works end to end and reaches the footer
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
        await expect.poll(() => page.evaluate(() => document.querySelector('.footer-bottom').getBoundingClientRect().bottom <= innerHeight + 1)).toBe(true);
        // every booking / call / WhatsApp / maps link points at approved data
        for (const href of await page.$$eval('[data-cta="book"]', a => a.map(x => x.href))) expect(href).toBe(C.bookingUrl);
        for (const href of await page.$$eval('a[href^="tel:"]', a => a.map(x => x.getAttribute('href')))) expect([`tel:${C.callCenter.tel}`, `tel:${C.callCenterShort.tel}`, `tel:${C.clinicDirect.tel}`]).toContain(href);
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
    await page.locator('#simulator-host').scrollIntoViewIfNeeded();
    await expect(page.locator('#simulator-host .vsim canvas')).toBeVisible({ timeout: 20_000 });
    const lost = await page.evaluate(() => {
      const gl = document.querySelector('#simulator-host .vsim canvas').getContext('webgl2');
      const ext = gl && gl.getExtension('WEBGL_lose_context');
      if (!ext) return false;
      ext.loseContext();
      return true;
    });
    expect(lost).toBe(true);
    await expect(page.locator('#simulator-host .vsim-note')).toBeVisible();
  });

  // Phase 2/3 replaced the phone swipe rows with stacked editorial lists. Same guarantee as before:
  // every item stays in the DOM and readable, nothing scrolls the page sideways.
  test('credential ledger and technology list keep every item in the DOM without horizontal overflow on phones', async ({ page }) => {
    await open(page);
    const P = DOCTOR.professional;
    for (const [sel, groups] of [['.qualifications-grid', 4], ['.tech-grid', 4]]) {
      const list = page.locator(sel);
      await expect(list.locator(':scope > *')).toHaveCount(groups);
      const { sw, cw } = await list.evaluate(e => ({ sw: e.scrollWidth, cw: e.clientWidth }));
      expect(sw).toBeLessThanOrEqual(cw + 1); // nothing hidden in a sideways scroller
      const boxes = await list.locator(':scope > *').evaluateAll(els => els.map(e => { const r = e.getBoundingClientRect(); return { x: r.x, right: r.right, h: r.height }; }));
      for (const b of boxes) { expect(b.x).toBeGreaterThanOrEqual(0); expect(b.right).toBeLessThanOrEqual(390); expect(b.h).toBeGreaterThan(0); }
    }
    // every qualification, the academic rank, the two leadership roles and every membership are listed
    await expect(page.locator('.qualifications-grid .ledger-row')).toHaveCount(P.qualifications.length + 2 + 2 + P.memberships.length);
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

test.describe('Phase 2/3 — theme default, 3D section and navigation', () => {
  for (const scheme of ['dark', 'light']) {
    test(`with nothing saved, the theme follows prefers-color-scheme: ${scheme}`, async ({ browser }) => {
      const ctx = await browser.newContext({ colorScheme: scheme, viewport: { width: 390, height: 844 } });
      const page = await ctx.newPage();
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', scheme);
      expect(await page.evaluate(() => localStorage.getItem('theme'))).toBeNull(); // nothing persisted until the visitor chooses
      const lum = await page.evaluate(() => { const [r, g, b] = getComputedStyle(document.body).backgroundColor.match(/\d+/g).map(Number); return (r + g + b) / 3; });
      expect(scheme === 'dark' ? lum < 60 : lum > 200).toBe(true);
      // an explicit choice is saved and wins over the device preference after reload
      await page.locator('[onclick="toggleTheme()"]').first().click();
      const flipped = scheme === 'dark' ? 'light' : 'dark';
      await expect(page.locator('html')).toHaveAttribute('data-theme', flipped);
      expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(flipped);
      await page.reload();
      await expect(page.locator('html')).toHaveAttribute('data-theme', flipped);
      await ctx.close();
    });
  }

  for (const lang of ['ar', 'en']) {
    test(`3D cataract section exists with a start button and a header link — ${lang}`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await open(page, { lang });
      const section = page.locator('section#cataract-3d');
      await expect(section).toHaveCount(1);
      await expect(section.locator('h2')).not.toBeEmpty();
      const start = page.locator('#cataract-3d-start');
      await expect(start).toBeVisible();
      await expect(start).toHaveText(lang === 'ar' ? /ابدأ التجربة ثلاثية الأبعاد/ : /Start the 3D experience/);
      await expect(section).toContainText(lang === 'ar' ? 'قيد المراجعة الطبية' : 'pending physician review');
      // poster first: nothing heavy is mounted until the visitor asks for it
      await expect(section.locator('.c3d-poster')).toBeVisible();
      await expect(page.locator('#cataract-3d-stage')).toBeHidden();
      // Path routing: section links carry the language's home path (AR "#id", EN "en/#id") so they
      // also work from procedure pages; the link must still be exactly one, visible, pointing at the section.
      const href = lang === 'ar' ? '#cataract-3d' : 'en/#cataract-3d';
      await expect(page.locator(`#site-header .nav-links a[href="${href}"]`)).toBeVisible();
      await expect(page.locator(`#mobile-nav a[href="${href}"]`)).toHaveCount(1);
    });
  }

  test('3D section link is in the phone drawer and scrolls to the section', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await open(page);
    await page.locator('.mobile-menu-btn').click();
    await page.locator('#mobile-nav a[href="#cataract-3d"]').click();
    await expect(page.locator('#mobile-nav')).not.toHaveClass(/open/);
    await expect.poll(() => page.locator('#cataract-3d').evaluate(e => e.getBoundingClientRect().top), { timeout: 4000 }).toBeLessThan(200);
  });

  test('3D module is code-split: three.js stays out of the main bundle', () => {
    const assets = path.resolve('dist/assets');
    const main = fs.readdirSync(assets).filter(f => /^index-.*\.js$/.test(f));
    expect(main).toHaveLength(1);
    const body = fs.readFileSync(path.join(assets, main[0]), 'utf8');
    expect(body).toMatch(/cataract-sim-[\w-]+\.js/); // lazy reference to the split chunk
    expect(body).not.toMatch(/OrbitControls|WebGLRenderer\.prototype|WEBGL_multi_draw/); // library internals live in the lazy chunk
  });
});
