// The 3D cataract simulator as mounted inside the real page (not the harness):
// lazy load, readable on the page's dark band in both themes, no toolbar overlap on
// phones, survives language toggles without a second canvas, and closes cleanly.
import { test, expect } from '@playwright/test';

function contrast(fg, bg) {
  const lum = c => {
    const [r, g, b] = c.match(/[\d.]+/g).slice(0, 3).map(Number).map(v => v / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

async function start(page, { lang, theme, width, height }) {
  await page.setViewportSize({ width, height });
  await page.addInitScript(([l, t]) => { try { localStorage.setItem('lang', l); localStorage.setItem('theme', t); } catch (e) { /* ignore */ } }, [lang, theme]);
  await page.goto('/');
  const before = await page.evaluate(() => performance.getEntriesByType('resource').filter(r => /cataract-sim/.test(r.name)).length);
  expect(before).toBe(0); // nothing 3D is downloaded until the visitor asks for it
  await page.locator('#cataract-3d-start').click();
  await expect(page.locator('#cataract-3d-stage .csim canvas')).toHaveCount(1, { timeout: 20_000 });
}

test('language switched while the 3D module is still loading is applied once it is ready', async ({ page }) => {
  await page.goto('/');
  await page.locator('#cataract-3d-start').click();
  await page.evaluate(() => window.toggleLang()); // immediately, before mount resolves
  await expect(page.locator('#cataract-3d')).toHaveAttribute('data-state', 'active', { timeout: 20_000 });
  await expect(page.locator('#cataract-3d-stage .csim')).toHaveAttribute('lang', 'en');
});

for (const [width, height] of [[390, 844], [1440, 900]]) {
  for (const [lang, theme] of [['en', 'light'], ['ar', 'dark']]) {
    test(`in-page 3D ${width} ${lang} ${theme}: readable, no overlap, survives language toggle, closes`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      await start(page, { lang, theme, width, height });
      await expect(page.locator('#cataract-3d')).toHaveAttribute('data-state', 'active', { timeout: 20_000 });
      // stage title + body readable against the simulator card
      const ratios = await page.evaluate(() => {
        const card = getComputedStyle(document.querySelector('#cataract-3d-stage .csim')).backgroundColor;
        return ['.csim-stage-title', '.csim-title', '.csim-panel p'].map(sel => {
          const el = document.querySelector(`#cataract-3d-stage ${sel}`);
          return el ? { sel, fg: getComputedStyle(el).color, bg: card } : null;
        }).filter(Boolean);
      });
      expect(ratios.length).toBeGreaterThanOrEqual(2);
      for (const r of ratios) expect(contrast(r.fg, r.bg), r.sel).toBeGreaterThanOrEqual(4.5);
      // start button / caption never sit under the camera toolbar
      const hit = await page.evaluate(() => {
        const box = el => el && el.getBoundingClientRect();
        const tools = box(document.querySelector('#cataract-3d-stage .csim-viewtools'));
        return [...document.querySelectorAll('#cataract-3d-stage .csim-start, #cataract-3d-stage .csim-start-hint')]
          .filter(e => e.offsetParent).map(e => box(e))
          .some(b => tools && b.left < tools.right && tools.left < b.right && b.top < tools.bottom && tools.top < b.bottom);
      });
      expect(hit).toBe(false);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      // language toggle keeps the same single canvas and flips the module's language
      const other = lang === 'ar' ? 'en' : 'ar';
      await page.evaluate(() => window.toggleLang());
      await expect(page.locator('html')).toHaveAttribute('lang', other);
      await expect(page.locator('.csim canvas')).toHaveCount(1);
      await expect(page.locator('#cataract-3d-stage .csim')).toHaveAttribute('lang', other);
      // close returns to the poster and removes the canvas
      await page.locator('#cataract-3d-stage .csim-close').click();
      await expect(page.locator('.csim canvas')).toHaveCount(0);
      await expect(page.locator('#cataract-3d-start')).toBeVisible();
      expect(errors).toEqual([]);
    });
  }
}
