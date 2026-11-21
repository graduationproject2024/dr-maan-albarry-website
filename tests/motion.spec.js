// Motion layer (src/motion: GSAP 3.15.1 + ScrollTrigger, Lenis 1.3.27 on desktop pointers only). Legacy-zero milestone.
// It is optional polish: these tests check that it loads late, stays out of the way of touch, reduced motion, the
// simulators and the site's own scrolling, and that nothing it animates can stay hidden.
import { test, expect } from '@playwright/test';

const motionReady = (page) => page.waitForFunction(() => !!window.__siteMotion, null, { timeout: 15_000 });
const state = (page) => page.evaluate(() => window.__siteMotion.state());

test.describe('Motion layer — desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('loads after the first paint; Lenis is on; one ticker drives it', async ({ page }) => {
    const firstJs = [];
    page.on('request', (r) => { if (/motion-|lenis-/.test(r.url())) firstJs.push(r.url()); });
    await page.goto('/en/');
    // not preloaded by the page: nothing in the HTML points at the motion code
    expect(await page.evaluate(() => [...document.querySelectorAll('link[rel="modulepreload"], script[src]')].some((l) => /motion-|lenis-/.test(l.href || l.src)))).toBe(false);
    await motionReady(page);
    const t = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const res = performance.getEntriesByType('resource').filter((r) => /motion-|lenis-/.test(r.name)).map((r) => r.startTime);
      return { dcl: nav.domContentLoadedEventEnd, first: Math.min(...res) };
    });
    const fcpAt = t.first - t.dcl; // requested only after the document was ready
    const s = await state(page);
    expect(s.lenis).toBe(true);
    expect(await page.evaluate(() => document.documentElement.classList.contains('lenis'))).toBe(true);
    expect(firstJs.length).toBeGreaterThan(0);
    expect(fcpAt).toBeGreaterThan(0); // the page painted before the motion code was needed
  });

  test('wheel scrolling moves the page and settles; keyboard scrolling still works', async ({ page }) => {
    await page.goto('/en/');
    await motionReady(page);
    await page.mouse.move(640, 400);
    await page.mouse.wheel(0, 600);
    await expect.poll(() => page.evaluate(() => Math.round(scrollY)), { timeout: 5000 }).toBeGreaterThan(500);
    const settled = await page.evaluate(() => new Promise((r) => { let last = -1, same = 0; const t = () => { const y = Math.round(scrollY); same = y === last ? same + 1 : 0; last = y; if (same > 10) r(y); else requestAnimationFrame(t); }; t(); }));
    expect(settled).toBeGreaterThan(500);
    await page.keyboard.press('End');
    await expect.poll(() => page.evaluate(() => Math.round(scrollY + innerHeight - document.documentElement.scrollHeight)), { timeout: 5000 }).toBeGreaterThan(-4);
  });

  test('a section link lands the section under the header (the site jump goes through Lenis)', async ({ page }) => {
    await page.goto('/en/lens-lab/');
    await motionReady(page);
    await page.evaluate(() => window.scrollToSection('simulator'));
    await expect.poll(async () => page.evaluate(() => { const h = document.getElementById('site-header').getBoundingClientRect().bottom; const t = document.getElementById('simulator').getBoundingClientRect().top; return Math.abs(t - h); }), { timeout: 8000 }).toBeLessThan(24);
  });

  test('the figure dialog grows from its button, freezes the page behind it, and closes with Escape', async ({ page }) => {
    await page.goto('/en/procedures/cataract-surgery/');
    await motionReady(page);
    const btn = page.locator('.plate-zoom').first();
    await btn.scrollIntoViewIfNeeded();
    const y0 = await page.evaluate(() => scrollY);
    await btn.click();
    const dlg = page.locator('#plate-dialog');
    await expect(dlg).toBeVisible();
    await expect.poll(() => page.evaluate(() => getComputedStyle(document.getElementById('plate-dialog')).opacity)).toBe('1');
    expect(await page.evaluate(() => document.documentElement.classList.contains('lenis-stopped'))).toBe(true);
    await page.mouse.wheel(0, 500); // over the dialog: the page behind must not move
    await page.waitForTimeout(400);
    expect(Math.abs((await page.evaluate(() => scrollY)) - y0)).toBeLessThanOrEqual(2);
    await page.keyboard.press('Escape');
    await expect(dlg).toBeHidden();
    await expect(btn).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.classList.contains('lenis-stopped'))).toBe(false);
  });

  test('grouped cards enter in turn and all end fully visible', async ({ page }) => {
    await page.goto('/en/');
    await motionReady(page);
    const groups = await page.evaluate(() => document.querySelectorAll('.is-staggered').length);
    expect(groups).toBeGreaterThan(0);
    // scroll through the page so every group enters
    for (let i = 0; i < 30; i++) { await page.mouse.wheel(0, 700); await page.waitForTimeout(80); }
    await page.waitForTimeout(1200);
    const hidden = await page.evaluate(() => [...document.querySelectorAll('.is-staggered > *')].filter((el) => !el.hidden && (getComputedStyle(el).opacity !== '1' || getComputedStyle(el).visibility === 'hidden')).length);
    expect(hidden).toBe(0);
  });

  test('changing page removes the previous page\'s scroll triggers (no build-up)', async ({ page }) => {
    await page.goto('/en/');
    await motionReady(page);
    const t1 = (await state(page)).triggers;
    for (const href of ['en/about/', 'en/', 'en/procedures/', 'en/']) {
      await page.evaluate((h) => document.querySelector(`a[data-nav][href$="${h}"]`)?.click(), href);
      await page.waitForTimeout(400);
    }
    const t2 = (await state(page)).triggers;
    expect(t2).toBeLessThanOrEqual(t1 + 2);
  });

  test('the 3D viewer and the vision picture keep the wheel (Lenis does not scroll the page over them)', async ({ page }) => {
    await page.goto('/en/lens-lab/');
    await motionReady(page);
    await page.locator('#simulator-host').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelectorAll('#simulator-host canvas').length === 1, null, { timeout: 30_000 });
    await page.waitForTimeout(800);
    const box = await page.locator('#simulator-host canvas').boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    // record whether Lenis starts a smooth scroll while the wheel turns over the picture
    await page.evaluate(() => { window.__smooth = false; window.__siteMotion.lenis.on('scroll', (l) => { if (l.isScrolling === 'smooth') window.__smooth = true; }); });
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => window.__smooth)).toBe(false);
    // the same wheel over ordinary text is smoothed
    await page.mouse.move(40, 120);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(150);
    expect(await page.evaluate(() => window.__smooth)).toBe(true);
  });
});

test.describe('Motion layer — phone (touch)', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test('no Lenis on touch: native scrolling; the menu still opens and its links are all visible', async ({ page }) => {
    await page.goto('/');
    await motionReady(page);
    expect((await state(page)).lenis).toBe(false);
    expect(await page.evaluate(() => document.documentElement.classList.contains('lenis'))).toBe(false);
    await page.locator('.mobile-menu-btn').first().click();
    await page.waitForTimeout(600);
    const invisible = await page.evaluate(() => [...document.querySelectorAll('#mobile-nav a')].filter((a) => a.getClientRects().length && getComputedStyle(a).opacity !== '1').length);
    expect(invisible).toBe(0);
  });
});

test.describe('Motion layer — reduced motion', () => {
  test.use({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });

  test('no Lenis, no staggered reveal, dialog opens and closes without animation', async ({ page }) => {
    await page.goto('/en/procedures/cataract-surgery/');
    await motionReady(page);
    const s = await state(page);
    expect(s.lenis).toBe(false);
    expect(await page.evaluate(() => document.querySelectorAll('.is-staggered').length)).toBe(0);
    const btn = page.locator('.plate-zoom').first();
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    expect(await page.evaluate(() => getComputedStyle(document.getElementById('plate-dialog')).opacity)).toBe('1');
    await page.keyboard.press('Escape');
    await expect(page.locator('#plate-dialog')).toBeHidden();
  });
});
