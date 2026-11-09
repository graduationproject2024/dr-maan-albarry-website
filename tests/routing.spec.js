// Path-based routing under a relative base: deep links, history, language/theme persistence,
// section links across pages, and serving from a GitHub Pages-style subpath.
import { test, expect } from '@playwright/test';
import { DOCTOR, PROCEDURES } from '../doctor-data.js';

const name = slug => PROCEDURES.find(p => p.slug === slug).name;

test.describe('Deep links', () => {
  for (const [url, lang, slug] of [['/en/procedures/icl/', 'en', 'icl'], ['/procedures/corneal-transplant/', 'ar', 'corneal-transplant'], ['/en/', 'en', null], ['/', 'ar', null]]) {
    test(`direct load ${url}`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      page.on('response', r => { if (r.status() >= 400 && r.url().startsWith('http://localhost')) errors.push(`HTTP ${r.status()} ${r.url()}`); });
      await page.goto(url);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('main h1')).toHaveText(slug ? name(slug)[lang] : DOCTOR.identity.name[lang]);
      // <base> is pinned to the absolute site root, so relative URLs keep working after navigation
      expect(await page.evaluate(() => document.baseURI)).toBe(new URL('/', page.url()).href);
      expect(await page.evaluate(() => getComputedStyle(document.body).fontFamily)).toBeTruthy();
      expect(errors).toEqual([]);
    });
  }
});

test.describe('History and navigation', () => {
  test('home → procedure → related procedure → back → back → forward', async ({ page }) => {
    await page.goto('/en/');
    await page.locator('#procedures a[href="en/procedures/lens-implants/"]').click(); // featured card or the "Also" index
    await expect(page).toHaveURL(/\/en\/procedures\/lens-implants\/$/);
    await page.locator('.proc-related a.proc-card-link').first().click();
    const firstRelated = PROCEDURES.find(p => p.slug === 'lens-implants').related[0];
    await expect(page).toHaveURL(new RegExp(`/en/procedures/${firstRelated}/$`));
    await expect(page.locator('main h1')).toHaveText(name(firstRelated).en);
    await page.goBack();
    await expect(page.locator('main h1')).toHaveText(name('lens-implants').en);
    await page.goBack();
    await expect(page.locator('h1.hero-title')).toHaveText(DOCTOR.identity.name.en);
    await page.goForward();
    await expect(page.locator('main h1')).toHaveText(name('lens-implants').en);
  });

  test('header links work from a procedure page (land on the dedicated page, at the top)', async ({ page }) => {
    // Phase 1: header items are pages (/clinic/, /about/, …) instead of homepage anchors
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/procedures/icl/');
    await page.locator('#site-header .nav-links a[data-section="clinic"]').click();
    await expect(page).toHaveURL(/\/clinic\/$/);
    await expect(page.locator('main')).toHaveAttribute('data-page', 'clinic');
    await expect.poll(() => page.locator('main h1').evaluate(e => e.getBoundingClientRect().top), { timeout: 4000 }).toBeLessThan(200);
    await expect(page.locator('#site-header .nav-links a[data-section="clinic"]')).toHaveAttribute('aria-current', 'page');
    // homepage anchors still work across pages
    await page.goto('/#clinic');
    await expect.poll(() => page.locator('#clinic').evaluate(e => e.getBoundingClientRect().top), { timeout: 4000 }).toBeLessThan(200);
  });

  test('table of contents and breadcrumbs stay on the right page', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/en/procedures/keratoconus-cxl/');
    await page.locator('.proc-toc a[href$="#p-risks"]').click();
    await expect(page).toHaveURL(/\/en\/procedures\/keratoconus-cxl\/#p-risks$/);
    await expect.poll(() => page.locator('#p-risks').evaluate(e => e.getBoundingClientRect().top), { timeout: 4000 }).toBeLessThan(200);
    await page.locator('.crumbs a').nth(1).click();
    // Phase 1: the "Procedures" crumb opens the procedure library page
    await expect(page).toHaveURL(/\/en\/procedures\/$/);
    await expect(page.locator('main')).toHaveAttribute('data-page', 'procedures');
    await expect(page.locator('#procedures .proc-card')).toHaveCount(PROCEDURES.length);
    await expect.poll(() => page.locator('main h1').evaluate(e => e.getBoundingClientRect().top), { timeout: 4000 }).toBeLessThan(200);
  });

  test('skip link targets main on the current page', async ({ page }) => {
    await page.goto('/en/procedures/icl/');
    await expect(page.locator('.skip-link')).toHaveAttribute('href', 'en/procedures/icl/#main');
  });
});

test.describe('Language and theme persistence', () => {
  test('switching language on a procedure page opens its counterpart URL and survives reload', async ({ page }) => {
    await page.goto('/procedures/keratoconus-cxl/');
    await page.locator('button[onclick="toggleLang()"]').first().click();
    await expect(page).toHaveURL(/\/en\/procedures\/keratoconus-cxl\/$/);
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('main h1')).toHaveText(name('keratoconus-cxl').en);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/en\/procedures\/keratoconus-cxl\/$/);
    await page.reload();
    await expect(page.locator('main h1')).toHaveText(name('keratoconus-cxl').en);
    await page.locator('button[onclick="toggleLang()"]').first().click();
    await expect(page).toHaveURL(/\/procedures\/keratoconus-cxl\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  });

  test('a saved English choice moves the bare root to /en/', async ({ page }) => {
    await page.addInitScript(() => { try { localStorage.setItem('lang', 'en'); } catch (e) { /* ignore */ } });
    await page.goto('/');
    await expect(page).toHaveURL(/\/en\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('theme choice persists across client navigation and reload', async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto('/en/');
    await page.locator('[onclick="toggleTheme()"]').first().click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('#procedures a.proc-card-link').first().click();
    await expect(page.locator('main h1')).toHaveText(PROCEDURES[0].name.en);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await ctx.close();
  });
});

test.describe('Served from a subpath (GitHub Pages)', () => {
  test('/dr-maan-albarry-website/… resolves assets and keeps navigation under the subpath', async ({ page, baseURL }) => {
    const origin = new URL(baseURL).origin;
    const sub = '/dr-maan-albarry-website';
    // emulate Pages: every request under the subpath is answered by the same file at the root
    await page.route(`${origin}${sub}/**`, async route => {
      const url = route.request().url().replace(`${origin}${sub}/`, `${origin}/`);
      const res = await route.fetch({ url });
      await route.fulfill({ response: res });
    });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    page.on('response', r => { if (r.status() >= 400 && r.url().startsWith(origin)) errors.push(`HTTP ${r.status()} ${r.url()}`); });
    await page.goto(`${sub}/en/procedures/icl/`);
    await expect(page.locator('main h1')).toHaveText(name('icl').en);
    expect(await page.evaluate(() => document.baseURI)).toBe(`${origin}${sub}/`);
    expect(await page.evaluate(() => [...document.styleSheets].length)).toBeGreaterThan(0);
    await page.locator('.proc-related a.proc-card-link').first().click();
    await expect(page).toHaveURL(new RegExp(`^${origin}${sub}/en/procedures/[a-z-]+/$`));
    await page.locator('.crumbs a').first().click();
    await expect(page).toHaveURL(`${origin}${sub}/en/`);
    await expect(page.locator('h1.hero-title')).toHaveText(DOCTOR.identity.name.en);
    await page.locator('button[onclick="toggleLang()"]').first().click();
    await expect(page).toHaveURL(`${origin}${sub}/`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    expect(errors).toEqual([]);
    // Late lazy-image requests may still be in the handler above: let them finish, so none is cut off when the context closes.
    await page.unrouteAll({ behavior: 'wait' });
  });
});
