// Phase 1 — booking & mobile UX, plus regression of existing features.
// All geometry assertions measure real bounding boxes in the production build.
import { test, expect } from '@playwright/test';
import { DOCTOR } from '../doctor-data.js';

const C = DOCTOR.contact;
const MOBILE = [[360, 800], [390, 844]];
const LANGS = ['ar', 'en'];
const THEMES = ['light', 'dark'];

async function open(page, { lang = 'ar', theme = 'light' } = {}) {
  await page.addInitScript(t => { try { localStorage.setItem('theme', t); } catch (e) { /* ignore */ } }, theme);
  await page.goto('/');
  if (lang === 'en') await page.evaluate(() => window.toggleLang());
  await expect(page.locator('html')).toHaveAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
}

const box = (page, sel) => page.locator(sel).first().evaluate(el => {
  const r = el.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height, right: r.right, bottom: r.bottom, sw: el.scrollWidth, cw: el.clientWidth };
});
const inside = (a, b, tol = 1) => a.x >= b.x - tol && a.right <= b.right + tol && a.y >= b.y - tol && a.bottom <= b.bottom + tol;
const overlap = (a, b) => a.x < b.right && b.x < a.right && a.y < b.bottom && b.y < a.bottom;

for (const [w, h] of MOBILE) {
  for (const lang of LANGS) {
    for (const theme of THEMES) {
      test.describe(`${w}px ${lang} ${theme}`, () => {
        test.use({ viewport: { width: w, height: h } });

        test('sticky booking bar: 3 actions fully visible, no overlap, correct destinations', async ({ page }) => {
          await open(page, { lang, theme });
          const bar = page.locator('#booking-bar');
          await expect(bar).toBeVisible();
          const actions = bar.locator('.booking-action');
          await expect(actions).toHaveCount(3);
          const boxes = await actions.evaluateAll(els => els.map(el => {
            const r = el.getBoundingClientRect();
            const label = el.querySelector('span');
            return { x: r.x, right: r.right, y: r.y, bottom: r.bottom, h: r.height,
              labelClipped: label.scrollWidth > label.clientWidth + 1 || label.getBoundingClientRect().right > r.right + 1 || label.getBoundingClientRect().x < r.x - 1,
              labelLines: Math.round(label.getBoundingClientRect().height / parseFloat(getComputedStyle(label).lineHeight || '16')) };
          }));
          for (const b of boxes) {
            expect(b.x).toBeGreaterThanOrEqual(0);
            expect(b.right).toBeLessThanOrEqual(w);
            expect(b.bottom).toBeLessThanOrEqual(h);
            expect(b.h).toBeGreaterThanOrEqual(44);
            expect(b.labelClipped).toBe(false);
            expect(b.labelLines).toBeLessThanOrEqual(1);
          }
          for (let i = 1; i < boxes.length; i++) expect(overlap(boxes[i - 1], boxes[i])).toBe(false);
          await expect(actions.nth(0)).toHaveAttribute('href', C.bookingUrl);
          await expect(actions.nth(1)).toHaveAttribute('href', `tel:${C.callCenter.tel}`);
          expect(await actions.nth(2).getAttribute('href')).toContain(`https://wa.me/${C.whatsapp.number}?text=`);
          for (let i = 0; i < 3; i++) expect((await actions.nth(i).getAttribute('aria-label')) || (await actions.nth(i).innerText())).toBeTruthy();
        });

        test('no horizontal overflow; bar never hides the end of the page', async ({ page }) => {
          await open(page, { lang, theme });
          const sw = await page.evaluate(() => document.documentElement.scrollWidth);
          expect(sw).toBeLessThanOrEqual(w);
          await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
          await page.waitForTimeout(300);
          const barTop = (await box(page, '#booking-bar')).y;
          const lastLine = await box(page, '.footer-bottom');
          expect(lastLine.bottom).toBeLessThanOrEqual(barTop + 1);
        });

        test('hero CTA: label fits, adequate target, above the fold', async ({ page }) => {
          await open(page, { lang, theme });
          const btn = await box(page, '#hero-primary-cta');
          const label = await box(page, '#hero-primary-cta .btn-label');
          expect(inside(label, btn)).toBe(true);
          expect(label.sw).toBeLessThanOrEqual(label.cw + 1);
          expect(btn.x).toBeGreaterThanOrEqual(0);
          expect(btn.right).toBeLessThanOrEqual(w);
          expect(btn.h).toBeGreaterThanOrEqual(44);
          const barTop = (await box(page, '#booking-bar')).y;
          expect(btn.bottom).toBeLessThanOrEqual(barTop); // visible on first screen, not under the bar
          await expect(page.locator('#hero-primary-cta')).toHaveAttribute('href', C.bookingUrl);
        });

        test('clinic booking CTA: label fits, real portal destination', async ({ page }) => {
          await open(page, { lang, theme });
          const cta = page.locator('#clinic-booking-cta');
          await cta.scrollIntoViewIfNeeded();
          const btn = await box(page, '#clinic-booking-cta');
          const label = await box(page, '#clinic-booking-cta .btn-label');
          expect(inside(label, btn)).toBe(true);
          expect(label.sw).toBeLessThanOrEqual(label.cw + 1);
          expect(btn.right).toBeLessThanOrEqual(w);
          expect(btn.h).toBeGreaterThanOrEqual(44);
          await expect(cta).toHaveAttribute('href', C.bookingUrl);
          await expect(cta).toHaveAttribute('target', '_blank');
        });

        test('simulator: lens tag stays in frame, controls fit and still work', async ({ page }) => {
          await open(page, { lang, theme });
          await page.locator('#simulator-host').scrollIntoViewIfNeeded();
          await expect(page.locator('#simulator-host .vsim-viewport')).toBeVisible({ timeout: 20_000 });
          for (const lens of ['edof', 'trifocal', 'monofocal', 'toric', 'cataract']) {
            await page.locator(`#simulator-host input[data-group="lensA"][value="${lens}"] + label`).click();
            await expect(page.locator(`#simulator-host input[data-group="lensA"][value="${lens}"]`)).toBeChecked();
            // one synchronous snapshot: view and tag measured in the same frame
            const { view, tag } = await page.evaluate(() => {
              const r = el => { const b = el.getBoundingClientRect(); return { x: b.x, right: b.right, y: b.y, bottom: b.bottom, w: b.width, h: b.height }; };
              return { view: r(document.querySelector('#simulator-host .vsim-viewport')), tag: r(document.querySelector('#simulator-host .vsim-tag-a')) };
            });
            expect(inside(tag, view)).toBe(true);
          }
          const view = await box(page, '#simulator-host .vsim-viewport');
          expect(view.w).toBeGreaterThanOrEqual(w - 56); // baseline was 290px at 360px
          expect(view.right).toBeLessThanOrEqual(w);
          // every segmented control is a comfortable touch target and none is clipped
          const bad = await page.evaluate(() => [...document.querySelectorAll('#simulator-host .vsim-seg-btn')]
            .filter(l => !l.closest('[hidden], details:not([open])'))
            .filter(l => { const b = l.getBoundingClientRect(); return b.height < 44 || b.right > innerWidth + 1 || b.x < -1; }).length);
          expect(bad).toBe(0);
          // distance slider via keyboard (it lives in the simulator's "Advanced" disclosure since the 2026-11 simplification)
          await page.locator('#simulator-host .vsim-adv > summary').click();
          const range = page.locator('#simulator-host .vsim-range');
          await range.focus();
          await page.keyboard.press('Home');
          await expect(range).toHaveValue('0');
          await page.keyboard.press('End');
          await expect(range).toHaveValue('1000');
          // lighting switch + persistent disclaimer
          await page.locator('#simulator-host input[data-group="lighting"][value="night"] + label').click();
          await expect(page.locator('#simulator-host input[data-group="lighting"][value="night"]')).toBeChecked();
          await expect(page.locator('#simulator-host .vsim-disclaimer')).toBeVisible();
        });
      });
    }
  }
}

test.describe('Tablet and desktop', () => {
  test('768px: bar visible and fits', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await open(page);
    await expect(page.locator('#booking-bar')).toBeVisible();
    const boxes = await page.locator('.booking-action').evaluateAll(els => els.map(e => { const r = e.getBoundingClientRect(); return { x: r.x, right: r.right, w: r.width }; }));
    expect(boxes).toHaveLength(3);
    for (const b of boxes) { expect(b.x).toBeGreaterThanOrEqual(0); expect(b.w).toBeGreaterThan(44); expect(b.right).toBeLessThanOrEqual(768); }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(768);
  });
  for (const [w, h] of [[1366, 768], [1440, 900]]) {
    for (const lang of LANGS) {
      test(`${w}px ${lang}: bar hidden, hero CTA intact, no overflow`, async ({ page }) => {
        await page.setViewportSize({ width: w, height: h });
        await open(page, { lang });
        await expect(page.locator('#booking-bar')).toBeHidden();
        const btn = await box(page, '#hero-primary-cta');
        const label = await box(page, '#hero-primary-cta .btn-label');
        expect(inside(label, btn)).toBe(true);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(w);
        await expect(page.locator('.hero-facts .hero-fact')).toHaveCount(3);
        expect(btn.bottom).toBeLessThanOrEqual(h); // booking CTA on the first screen
      });
    }
  }
});

test.describe('Accessibility — booking actions contrast (WCAG AA 4.5:1)', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  for (const theme of THEMES) {
    test(`text contrast of booking/WhatsApp/call actions — ${theme}`, async ({ page }) => {
      await open(page, { theme });
      const ratios = await page.$$eval('.booking-action, .btn-whatsapp, #hero-primary-cta, #clinic-booking-cta', els => {
        const rgb = c => c.match(/[\d.]+/g).slice(0, 4).map(Number);
        const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
        const bgOf = el => { for (let e = el; e; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (c.length < 4 || c[3] > 0.9) return c; } return [255, 255, 255]; };
        return els.map(el => {
          const label = el.querySelector('span') || el;
          const fg = rgb(getComputedStyle(label).color), bg = bgOf(el);
          const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
          return { cls: el.className, ratio: +((a + 0.05) / (b + 0.05)).toFixed(2) };
        });
      });
      for (const r of ratios) expect(r.ratio, r.cls).toBeGreaterThanOrEqual(4.5);
    });
  }
});

test.describe('Regression — existing features', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('no console errors or failed same-origin requests; language & theme switching', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('requestfailed', r => { if (new URL(r.url()).origin === new URL(page.url() || 'http://localhost:4173').origin) errors.push('REQFAIL ' + r.url()); });
    page.on('response', r => { if (r.status() >= 400 && r.url().startsWith('http://localhost')) errors.push(`HTTP ${r.status()} ${r.url()}`); });
    await open(page, { lang: 'ar', theme: 'light' });
    const broken = await page.$$eval('img', imgs => imgs.filter(i => i.complete && i.loading !== 'lazy' && i.naturalWidth === 0).map(i => i.src));
    expect(broken).toEqual([]);
    await page.locator('button[onclick="toggleLang()"]').first().click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await page.locator('button[onclick="toggleLang()"]').first().click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await page.locator('[onclick="toggleTheme()"]').first().click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('[onclick="toggleTheme()"]').first().click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    expect(errors).toEqual([]);
  });

  test('images load (lazy images after scrolling)', async ({ page }) => {
    await open(page);
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
    });
    await page.waitForFunction(() => [...document.images].every(i => i.complete), null, { timeout: 15000 });
    const broken = await page.$$eval('img', imgs => imgs.filter(i => i.naturalWidth === 0).map(i => i.getAttribute('src')));
    expect(broken).toEqual([]);
  });

  test('mobile drawer, navigation and scroll-spy', async ({ page }) => {
    await open(page);
    await page.locator('.mobile-menu-btn').click();
    await expect(page.locator('#mobile-nav')).toHaveClass(/open/);
    await page.locator('#mobile-nav a[href="#clinic"]').first().click();
    await expect(page.locator('#mobile-nav')).not.toHaveClass(/open/);
    await expect.poll(async () => (await box(page, '#clinic')).y, { timeout: 4000 }).toBeLessThan(200);
    await expect.poll(() => page.locator('#mobile-nav a[href="#clinic"]').first().getAttribute('class'), { timeout: 4000 }).toContain('active');
  });

  test('FAQ, education accordion and questionnaire still work', async ({ page }) => {
    await open(page);
    await page.locator('#faq-0 .faq-question').click();
    await expect(page.locator('#faq-0')).toHaveClass(/open/);
    const art = page.locator('.article-item').first();
    await art.locator('[onclick^="toggleArticle"]').first().click();
    await expect(art).toHaveClass(/open/);
    for (let i = 0; i < 4; i++) {
      await page.locator('.q-option').first().click();
      await page.locator('.q-nav .btn-primary').click();
    }
    await expect(page.locator('.q-result')).toBeVisible();
    await page.locator('.q-result button[onclick="restartQ()"]').click();
    await expect(page.locator('.q-option').first()).toBeVisible();
  });

  test('active window scroll listeners do not accumulate across re-renders', async ({ page }) => {
    await page.addInitScript(() => {
      const add = window.addEventListener, rem = window.removeEventListener;
      window.__scrollActive = new Set();
      window.addEventListener = function (type, fn, ...rest) { if (type === 'scroll') window.__scrollActive.add(fn); return add.call(this, type, fn, ...rest); };
      window.removeEventListener = function (type, fn, ...rest) { if (type === 'scroll') window.__scrollActive.delete(fn); return rem.call(this, type, fn, ...rest); };
    });
    await page.goto('/');
    const before = await page.evaluate(() => window.__scrollActive.size);
    await page.evaluate(() => { for (let i = 0; i < 4; i++) window.toggleLang(); });
    expect(await page.evaluate(() => window.__scrollActive.size)).toBe(before);
  });
});
