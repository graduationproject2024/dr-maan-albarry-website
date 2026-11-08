// Regression tests for the defects found by the premium journeys (docs/.../premium-experience-reconstruction/BUG_REGISTER.md).
// Each test names its bug ID. Emulated Chromium on Windows; no physical device.
import { test, expect } from '@playwright/test';

const phone = (width = 390, height = 844) => ({ viewport: { width, height }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });

/** Text zoom: root font size set before the app renders (the document element may not exist yet). */
const textZoom = (zoom) => (page) => page.addInitScript((z) => {
  const apply = () => { if (!document.documentElement) return false; document.documentElement.style.fontSize = `${z}%`; return true; };
  if (!apply()) new MutationObserver((_, o) => { if (apply()) o.disconnect(); }).observe(document, { childList: true });
}, zoom);

test.describe('premium regressions — phone 390', () => {
  test.use(phone());

  test('BUG-19 the header still hides on scroll after the menu has been used', async ({ page }) => {
    await page.goto('/'); await page.locator('main h1').waitFor();
    await page.locator('.mobile-menu-btn').tap(); await page.locator('#mobile-nav.open').waitFor(); await page.waitForTimeout(300);
    await page.locator('.mobile-menu-btn').tap(); await page.waitForTimeout(300);
    for (let i = 0; i < 4; i++) { await page.mouse.wheel(0, 400); await page.waitForTimeout(120); }
    await page.waitForTimeout(400);
    await expect.poll(() => page.locator('#site-header').evaluate((h) => h.classList.contains('is-hidden'))).toBe(true);
  });

  test('BUG-20 / BUG-21 the contents list marks the section just reached, visibly', async ({ page }) => {
    await page.goto('/procedures/lens-implants/'); await page.locator('#p-risks').waitFor();
    await page.locator('#p-risks').evaluate((e) => window.scrollTo(0, e.getBoundingClientRect().top + scrollY - innerHeight * 0.24));
    await page.waitForTimeout(600);
    const marked = page.locator('details.toc-m a.is-current');
    await expect(marked).toHaveCount(1);
    await expect(marked).toHaveAttribute('data-spy', 'p-risks');
    expect(await marked.evaluate((a) => Number(getComputedStyle(a).fontWeight))).toBeGreaterThanOrEqual(600);
  });

  test('BUG-25 anatomy pins on procedure pages do not hide each other', async ({ page }) => {
    for (const slug of ['cataract-surgery', 'icl', 'keratoconus-cxl', 'intravitreal-injections']) {
      await page.goto(`/procedures/${slug}/`); await page.locator('#p-anatomy').waitFor(); await page.waitForTimeout(200);
      const bad = await page.evaluate(() => {
        const out = [];
        document.querySelectorAll('.pins').forEach((layer) => {
          const r = [...layer.children].map((p) => p.getBoundingClientRect()).filter((x) => x.width);
          for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++) {
            // pins are circles: they collide when their centres are closer than one diameter
            const d = Math.hypot(r[i].left + r[i].width / 2 - r[j].left - r[j].width / 2, r[i].top + r[i].height / 2 - r[j].top - r[j].height / 2);
            if (d < r[i].width - 1) out.push(`${i + 1}×${j + 1}: centres ${d.toFixed(1)} px apart, pin ${Math.round(r[i].width)} px`);
          }
        });
        return out;
      });
      expect(bad, slug).toEqual([]);
    }
  });

  test('BUG-26 the Lens Lab situation heading is at least 16 px', async ({ page }) => {
    await page.goto('/en/lens-lab/'); await page.locator('#lens-lab-host .llab-chip').first().waitFor({ timeout: 30000 });
    const size = await page.locator('#lens-lab-host .llab-subhead').first().evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
    expect(size).toBeGreaterThanOrEqual(16);
  });

  test('BUG-27 the open menu has one close control', async ({ page }) => {
    await page.goto('/en/'); await page.locator('main h1').waitFor();
    await page.locator('.mobile-menu-btn').tap(); await page.locator('#mobile-nav.open').waitFor(); await page.waitForTimeout(300);
    await expect(page.locator('.drawer-close')).toHaveCount(0);
    await expect(page.locator('.mobile-menu-btn')).toHaveAttribute('aria-expanded', 'true');
  });

  test('BUG-28 the running 3D viewer does not repeat the section heading on phones', async ({ page }) => {
    await page.goto('/en/procedures/cataract-surgery/'); await page.locator('#p-anatomy').waitFor();
    await page.locator('#cataract-3d-start').tap();
    await page.waitForFunction(() => document.querySelector('#cataract-3d-stage .csim')?.dataset.state === 'ready', null, { timeout: 45000 });
    const box = await page.locator('#cataract-3d h2').first().evaluate((e) => { const r = e.getBoundingClientRect(); return { w: r.width, h: r.height }; });
    expect(box.w).toBeLessThanOrEqual(2);
    expect(await page.locator('#cataract-3d h2').first().textContent()).toContain('Cataract surgery'); // still in the document for screen readers
    await page.locator('#cataract-3d-stage [data-ref="close"]').tap();
  });
});

test.describe('premium regressions — 320 px with 150% text', () => {
  test.use(phone(320, 640));
  test.beforeEach(async ({ page }) => { await textZoom(150)(page); });

  for (const url of ['/', '/procedures/cataract-surgery/']) {
    test(`BUG-22 no sideways scroll at 320 px / 150% text ${url}`, async ({ page }) => {
      await page.goto(url); await page.locator('main h1').waitFor(); await page.waitForTimeout(300);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    });
  }

  test('BUG-23 booking bar labels stay inside their pills', async ({ page }) => {
    await page.goto('/'); await page.locator('main h1').waitFor();
    const fit = await page.locator('.booking-action').evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); const s = e.querySelector('span').getBoundingClientRect(); return s.left >= r.left + 1 && s.right <= r.right - 1; }));
    expect(fit).toEqual([true, true, true]);
  });
});

test.describe('premium regressions — dark plates', () => {
  test.use({ ...phone(), colorScheme: 'dark' });

  test('BUG-24 hero plate image edge fades on the dark ground', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
    await page.goto('/en/procedures/cataract-surgery/'); await page.locator('.proc-figure img').first().waitFor();
    const mask = await page.locator('.proc-figure img').first().evaluate((i) => getComputedStyle(i).maskImage);
    expect(mask).toContain('linear-gradient');
  });
});
