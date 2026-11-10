// Returning visitors: saved preferences and how to reset them, bookmarks, Back / Forward / reload, and no surprises.
// Waits are on real state (scroll position, attributes, element counts), never on elapsed time.
import { test, expect } from '@playwright/test';
import { PROCEDURES } from '../doctor-data.js';

const scrollYOf = (page) => page.evaluate(() => Math.round(window.scrollY));
/** Scrolls until `selector` sits below the fixed header, and waits until the position has been recorded. */
async function readTo(page, selector) {
  await expect(page.locator('html')).not.toHaveClass(/first-load/); // heights are real only once the first-load containment is lifted
  await page.locator(selector).first().evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 200));
  await page.waitForFunction(() => history.state && Math.abs(history.state.y - window.scrollY) < 2);
  return scrollYOf(page);
}
const near = (page, y) => expect.poll(() => scrollYOf(page)).toBeGreaterThan(y - 40).then(() => expect.poll(() => scrollYOf(page)).toBeLessThan(y + 40));

test.describe('Saved preferences', () => {
  test('nothing is offered until the visitor has made a choice', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('#prefs-reset')).toHaveCount(0);
  });

  test('the reset control forgets both choices, follows the device again and stays on the page', async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto('/');
    await page.locator('[onclick="toggleLang()"]').first().click();
    await expect(page).toHaveURL(/\/en\/$/);
    await page.locator('[onclick="toggleTheme()"]').first().click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(await page.evaluate(() => [localStorage.getItem('lang'), localStorage.getItem('theme')])).toEqual(['en', 'dark']);

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    const reset = page.locator('#prefs-reset');
    await expect(reset).toHaveCount(1); // also present on an adopted (prerendered) page
    await reset.click();

    await expect(reset).toHaveCount(0);
    expect(await page.evaluate(() => [localStorage.getItem('lang'), localStorage.getItem('theme')])).toEqual([null, null]);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page).toHaveURL(/\/en\/$/); // the URL still decides the language of this page
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark'); // live again
    await page.goto('/');
    await expect(page).not.toHaveURL(/\/en\//); // a bare root visit is Arabic again
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await ctx.close();
  });

  test('the reset control is a real, readable target in both languages', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const [url, text] of [['/', 'إعادة ضبط'], ['/en/', 'Reset']]) {
      await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
      await page.goto(url);
      const reset = page.locator('#prefs-reset');
      await expect(reset).toContainText(text);
      expect((await reset.boundingBox()).height).toBeGreaterThanOrEqual(44);
    }
  });

  test('a language toggle keeps questionnaire answers in memory, and only the two preferences are ever stored', async ({ page }) => {
    await page.goto('/en/education/');
    await page.locator('.q-option').first().click();
    await page.locator('.q-nav .btn-primary').click();
    await expect(page.locator('.q-step-label')).toContainText('Step 2');
    await page.evaluate(() => window.toggleLang()); // the header has slid away while reading down
    await expect(page).toHaveURL(/\/education\/$/);
    await expect(page.locator('.q-step-label')).toContainText('2');
    await page.locator('.q-nav .btn-quiet').click(); // back to the first question: the earlier answer is still marked
    await expect(page.locator('.q-option.selected')).toHaveCount(1);
    await page.evaluate(() => window.toggleTheme());

    const stored = await page.evaluate(() => ({ local: Object.keys(localStorage).sort(), session: Object.keys(sessionStorage), cookie: document.cookie }));
    expect(stored).toEqual({ local: ['lang', 'theme'], session: [], cookie: '' });
  });

  test('storage that throws does not break the page or the switches', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('denied', 'SecurityError'); } });
    });
    await page.goto('/en/');
    await page.locator('[onclick="toggleTheme()"]').first().click();
    await expect(page.locator('#prefs-reset')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
});

test.describe('Back, Forward and reload return to where the visitor was', () => {
  test('home gallery → procedure → Back returns to the same card', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/en/');
    const y = await readTo(page, '#procedures .plate-card:nth-child(4) a.proc-card-link'); // already on screen, so the click does not scroll
    expect(y).toBeGreaterThan(600);
    const card = page.locator('#procedures .plate-card').nth(3);
    const slug = await card.getAttribute('data-slug');
    await card.locator('a.proc-card-link').click();
    await expect(page).toHaveURL(new RegExp(`/en/procedures/${slug}/$`));
    await expect(page.locator('main h1')).toHaveText(PROCEDURES.find((p) => p.slug === slug).name.en);
    await page.goBack();
    await expect(page.locator('main')).toHaveAttribute('data-page', 'home');
    await near(page, y);
    await expect(page.locator(`#procedures .plate-card[data-slug="${slug}"]`)).toBeInViewport();
  });

  test('library with a filter → procedure → Back keeps the filter and the position', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en/procedures/');
    await page.locator('.proc-filter .chip[data-filter="refractive"]').click();
    const y = await readTo(page, '#procedures .proc-card:not([hidden])');
    await page.locator('#procedures .proc-card:not([hidden]) a.proc-card-link').first().click();
    await expect(page.locator('main')).toHaveAttribute('data-page', 'procedure');
    await page.goBack();
    await expect(page.locator('main')).toHaveAttribute('data-page', 'procedures');
    await expect(page.locator('.proc-filter .chip[data-filter="refractive"]')).toHaveAttribute('aria-pressed', 'true');
    await near(page, y);
  });

  test('Forward returns to the position the visitor left', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/en/about/');
    await page.locator('#site-header .nav-links a[data-section="clinic"]').click();
    await expect(page.locator('main')).toHaveAttribute('data-page', 'clinic');
    const y = await readTo(page, '#visit');
    expect(y).toBeGreaterThan(300);
    await page.goBack();
    await expect(page.locator('main')).toHaveAttribute('data-page', 'about');
    await page.goForward();
    await expect(page.locator('main')).toHaveAttribute('data-page', 'clinic');
    await near(page, y);
  });

  test('a reload keeps the reading position, on a prerendered page and on a deep link', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/en/procedures/icl/#p-risks');
    await expect(page.locator('html')).not.toHaveClass(/first-load/);
    const y = await readTo(page, '#p-recovery');
    await page.reload();
    await expect(page.locator('html')).not.toHaveClass(/first-load/);
    await near(page, y); // the place the visitor had read to, not the #p-risks anchor
  });

  test('a fresh visit starts at the top, even if the entry remembers a position', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/en/about/');
    await readTo(page, '#record');
    await page.goto('/en/clinic/');
    await expect(page.locator('html')).not.toHaveClass(/first-load/);
    expect(await scrollYOf(page)).toBe(0);
  });
});

test.describe('Bookmarks and deep links', () => {
  for (const [url, id] of [['/en/education/#red-flags', 'red-flags'], ['/procedures/cataract-surgery/#p-faq', 'p-faq'], ['/en/lens-lab/#simulator', 'simulator'], ['/en/clinic/#visit', 'visit']]) {
    test(`${url} lands on its section and stays there`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(url);
      await expect(page.locator('html')).not.toHaveClass(/first-load/);
      const inPlace = () => page.evaluate((i) => { const t = document.getElementById(i).getBoundingClientRect().top; return t >= -4 && t < 160; }, id);
      await expect.poll(inPlace).toBe(true);
      // the modules on the page mount as they come into range; their real height must not push the section away
      await page.waitForFunction(() => !document.querySelector('.feature.is-loading') && (!document.getElementById('simulator-host') || document.querySelector('#simulator-host .vsim canvas, #simulator-host .vsim--fallback')), null, { timeout: 40_000 });
      await expect.poll(inPlace).toBe(true);
    });
  }

  test('no modal or overlay opens by itself on load', async ({ page }) => {
    for (const url of ['/', '/en/lens-lab/', '/surgical-education/', '/en/procedures/cataract-surgery/']) {
      await page.goto(url);
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('dialog[open], [role="dialog"], [aria-modal="true"]')).toHaveCount(0);
      await expect(page.locator('#mobile-nav.open')).toHaveCount(0);
      await expect(page.locator('.csim')).toHaveCount(0); // the 3D viewer starts only from its button
    }
  });

  test('changing the theme while reading does not move the page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/en/about/');
    const y = await readTo(page, '#record');
    await page.evaluate(() => window.toggleTheme());
    await expect(page.locator('html')).toHaveAttribute('data-theme', /dark|light/);
    expect(await scrollYOf(page)).toBe(y);
  });
});

test.describe('Simulators when the visitor leaves during loading', () => {
  test('3D viewer: leaving and coming back during the download leaves exactly one working viewer', async ({ page }) => {
    let release;
    const held = new Promise((r) => { release = r; });
    let held1 = false;
    await page.route(/assets\/cataract-sim-[^/]+\.js$/, async (route) => { if (!held1) { held1 = true; await held; } await route.continue(); });
    await page.goto('/en/surgical-education/');
    await page.locator('#cataract-3d-start').click();
    await expect(page.locator('#cataract-3d')).toHaveAttribute('data-state', 'loading');
    await page.locator('#site-header .nav-links a[data-section="about"]').click();
    await expect(page.locator('main')).toHaveAttribute('data-page', 'about');
    await page.goBack();
    await expect(page.locator('main')).toHaveAttribute('data-page', 'surgical-education');
    await page.locator('#cataract-3d-start').click();
    release();
    await expect(page.locator('#cataract-3d-stage .csim')).toHaveAttribute('data-state', 'ready', { timeout: 40_000 });
    await expect(page.locator('.csim')).toHaveCount(1);
    await expect(page.locator('#cataract-3d')).toHaveAttribute('data-state', 'active');
    await page.locator('#cataract-3d-stage [data-ref="start"]').click();
    await expect(page.locator('#cataract-3d-stage [data-ref="playPause"]')).toHaveAttribute('data-mode', 'pause');
  });

  test('vision simulator: leaving during its mount and coming back shows a working simulator', async ({ page }) => {
    let release;
    const held = new Promise((r) => { release = r; });
    await page.route(/assets\/pipeline-[^/]+\.js$/, async (route) => { await held; await route.continue(); });
    await page.goto('/en/lens-lab/');
    await page.locator('#simulator-host').scrollIntoViewIfNeeded();
    await page.locator('#simulator-host .vsim').waitFor({ timeout: 40_000 }); // UI built; the pipeline chunk is held
    await page.evaluate(() => document.querySelector('#site-header .nav-links a[data-section="about"]').click()); // the header has slid away while reading down
    await expect(page.locator('main')).toHaveAttribute('data-page', 'about');
    await page.goBack();
    await expect(page.locator('main')).toHaveAttribute('data-page', 'lens-lab');
    release();
    await page.locator('#simulator-host').scrollIntoViewIfNeeded();
    await expect(page.locator('#simulator-host .vsim canvas, #simulator-host .vsim--fallback').first()).toBeAttached({ timeout: 40_000 });
    await expect(page.locator('.vsim')).toHaveCount(1);
  });
});
