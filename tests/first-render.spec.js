// First load keeps the prerendered page instead of replacing it (the throttled LCP fix, Trello card 24).
// The document is tagged in flight, so a tag that survives boot proves the server's <main> was kept.
import { test, expect } from '@playwright/test';

const TAG = 'data-from-server';
async function tagServerHtml(page) {
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() !== 'document') return route.continue();
    const res = await route.fetch();
    const body = (await res.text()).replace('<main id="main"', `<main ${TAG} id="main"`);
    await route.fulfill({ response: res, body });
  });
}
const booted = (page, lang) => page.waitForFunction((l) => document.body.classList.contains(`lang-${l}`), lang);

// What a visitor gets from a page: text, links, images and the slots the simulators mount into.
const snapshot = (page) => page.evaluate(() => {
  const app = document.querySelector('#app').cloneNode(true);
  app.querySelectorAll('.feature-slot, .vsim-host').forEach((n) => { n.innerHTML = ''; });
  return {
    text: app.textContent.replace(/\s+/g, ' ').trim(),
    links: [...app.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
    images: [...app.querySelectorAll('img')].map((i) => `${i.getAttribute('src')}|${i.getAttribute('srcset') || ''}`),
    sources: [...app.querySelectorAll('source')].map((s) => s.getAttribute('srcset')),
    ids: [...app.querySelectorAll('[id]')].map((e) => e.id),
  };
});

test.describe('first load keeps the prerendered page', () => {
  for (const [url, lang] of [['/', 'ar'], ['/en/', 'en'], ['/procedures/cataract-surgery/', 'ar'], ['/en/about/', 'en'], ['/lens-lab/', 'ar']]) {
    test(`${url} is adopted, not replaced`, async ({ page }) => {
      await tagServerHtml(page);
      await page.goto(url);
      await booted(page, lang);
      await expect(page.locator(`#app > main[${TAG}]`)).toHaveCount(1);
    });
  }

  test('a saved English choice at the Arabic root still renders English', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('lang', 'en'));
    await tagServerHtml(page);
    await page.goto('/');
    await booted(page, 'en');
    await expect(page.locator(`#app > main[${TAG}]`)).toHaveCount(0);
    await expect(page.locator('main h1')).toContainText('Maan');
    await expect(page).toHaveURL(/\/en\/$/);
  });

  test('sections below the first screen still fade in, the first screen does not', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await booted(page, 'ar');
    const r = await page.evaluate(() => ({
      waiting: [...document.querySelectorAll('.fade-in:not(.visible)')].filter((e) => e.getBoundingClientRect().top >= innerHeight).length,
      hiddenOnScreen: [...document.querySelectorAll('.fade-in:not(.visible)')].filter((e) => e.getBoundingClientRect().top < innerHeight - 40).length,
    }));
    expect(r.waiting).toBeGreaterThan(0);
    expect(r.hiddenOnScreen).toBe(0);
  });

  test('the first-load containment is gone right after the first frame', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await tagServerHtml(page);
    await page.goto('/');
    await booted(page, 'ar');
    await expect(page.locator('html')).not.toHaveClass(/first-load/);
    const cv = await page.evaluate(() => getComputedStyle(document.querySelector('.site-footer')).contentVisibility);
    expect(cv).toBe('visible');
  });

  test('a deep link lands on its section after the containment is lifted', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en/procedures/icl/#p-risks');
    await booted(page, 'en');
    await expect(page.locator('html')).not.toHaveClass(/first-load/);
    await expect.poll(async () => page.evaluate(() => Math.round(document.getElementById('p-risks').getBoundingClientRect().top))).toBeLessThan(120);
    const top = await page.evaluate(() => document.getElementById('p-risks').getBoundingClientRect().top);
    expect(top).toBeGreaterThanOrEqual(0);
  });

  test('simulator slots reserve their height again after adoption', async ({ page }) => {
    await page.goto('/lens-lab/');
    await booted(page, 'ar');
    await expect(page.locator('#simulator-host')).toHaveAttribute('data-reserve', '');
  });

  test('a procedure page answers taps before its content chunk arrives', async ({ page }) => {
    let release;
    const held = new Promise((r) => { release = r; });
    await page.route(/assets\/content-.*\.js/, async (route) => { await held; await route.continue(); });
    await page.goto('/procedures/cataract-surgery/');
    await booted(page, 'ar');
    const q = page.locator('.faq-question').first();
    await q.click();
    await expect(q).toHaveAttribute('aria-expanded', 'true');
    release();
  });
});

test.describe('the adopted page matches a client render', () => {
  for (const scheme of ['light', 'dark']) {
    for (const [url, lang, key, ready] of [
      ['/', 'ar', 'home', '#hero-primary-cta'],
      ['/en/', 'en', 'home', '#hero-primary-cta'],
      ['/en/procedures/keratoconus-cxl/', 'en', 'procedure', '#p-faq'],
      ['/procedures/lens-implants/', 'ar', 'procedure', '#p-faq'],
      ['/lens-lab/', 'ar', 'lens-lab', '#simulator-host'],
      ['/en/clinic/', 'en', 'clinic', 'main h1'],
      ['/about/', 'ar', 'about', 'main h1'],
    ]) {
      test(`${url} (${scheme})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: scheme });
        await page.goto(url);
        await booted(page, lang);
        const adopted = await snapshot(page);

        await page.evaluate(() => document.querySelector('a[data-nav][data-section]:not([aria-current]):not([data-section="home"])').click());
        await page.waitForFunction((k) => document.querySelector('#app > main')?.dataset.page !== k, key);
        await page.goBack();
        await page.locator(`#app > main[data-page="${key}"]`).waitFor();
        await page.locator(ready).first().waitFor({ state: 'attached' });
        const rendered = await snapshot(page);

        expect(adopted.text).toBe(rendered.text);
        expect(adopted.links).toEqual(rendered.links);
        expect(adopted.images).toEqual(rendered.images);
        expect(adopted.sources).toEqual(rendered.sources);
        expect(adopted.ids).toEqual(rendered.ids);
      });
    }
  }
});
