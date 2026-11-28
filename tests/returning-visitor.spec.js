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
    await page.locator('[data-act="lang"]').first().click();
    await expect(page).toHaveURL(/\/en\/$/);
    await page.locator('[data-act="theme"]').first().click();
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
    await page.locator('[data-act="theme"]').first().click();
    await expect(page.locator('#prefs-reset')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
});

test.describe('Back, Forward and reload return to where the visitor was', () => {
  test('home gallery → procedure → Back returns to the same card', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/en/');
    const y = await readTo(page, '#procedures .pgal-item:nth-child(4) a.pgal-link'); // already on screen, so the click does not scroll
    expect(y).toBeGreaterThan(600);
    const card = page.locator('#procedures .pgal-item').nth(3);
    const slug = await card.getAttribute('data-slug');
    // "Where the visitor was" is the position at the moment of the click: if late content above the card (a font, an image)
    // changed the layout after `y` was read, the browser's scroll anchoring has already moved the page with it.
    await page.evaluate(() => addEventListener('click', () => { window.__yAtClick = Math.round(window.scrollY); }, { capture: true, once: true }));
    await card.locator('a.pgal-link').click();
    await expect(page).toHaveURL(new RegExp(`/en/procedures/${slug}/$`));
    await expect(page.locator('main h1')).toHaveText(PROCEDURES.find((p) => p.slug === slug).name.en);
    const yAtClick = await page.evaluate(() => window.__yAtClick);
    expect(yAtClick).toBeGreaterThan(600);
    await page.goBack();
    await expect(page.locator('main')).toHaveAttribute('data-page', 'home');
    await near(page, yAtClick);
    await expect(page.locator(`#procedures .pgal-item[data-slug="${slug}"]`)).toBeInViewport();
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

  // BUG-P2-01, found on a real iPhone 15 (iOS 26.6, Safari): Back to a page left by a FULL navigation (typed address,
  // external link, another tab's history) landed at the top. WebKit has already moved to the destination entry when the
  // page being left receives pagehide, so the old pagehide save overwrote the destination's position. Runs in both
  // engines; the WebKit run is Playwright's WebKit on Windows, not Safari on iOS.
  for (const engine of ['chromium', 'webkit']) {
    test(`${engine}: a full navigation away and Back returns to the reading position`, async ({ playwright }) => {
      const browser = await playwright[engine].launch(engine === 'chromium' ? {} : { args: [] });
      const ctx = await browser.newContext({ viewport: { width: 390, height: 700 }, baseURL: test.info().project.use.baseURL });
      const page = await ctx.newPage();
      try {
        await page.goto('/en/about/');
        const y = await readTo(page, '#record');
        expect(y).toBeGreaterThan(300);
        await page.goto('/en/clinic/'); // a document load, not the site's own link handling
        await expect(page.locator('main h1')).toBeVisible();
        await page.mouse.wheel(0, 400); // the page being left has its own, different position
        await page.waitForFunction(() => history.state && history.state.y > 0);
        await page.goBack({ waitUntil: 'load' });
        await expect(page).toHaveURL(/\/en\/about\/$/);
        await near(page, y);
      } finally { await browser.close(); }
    });
  }

  test('a fresh visit starts at the top, even if the entry remembers a position', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/en/about/');
    await readTo(page, '#record');
    await page.goto('/en/clinic/');
    await expect(page.locator('html')).not.toHaveClass(/first-load/);
    expect(await scrollYOf(page)).toBe(0);
  });
});

// BUG-FS-01: on a desktop the Lens Lab reference is ~5,000 px taller than the height reserved for it. A visitor who
// read past it, left and came Back was put ~5,000 px above where they had been: the first scroll was clamped to the
// bottom of the still-short page and was never repeated once the module had mounted.
test.describe('Back below a module that mounts late', () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  for (const delay of [0, 1500]) {
    test(`lens-lab page, closing section → home → Back returns to the closing section (module held ${delay} ms)`, async ({ page }) => {
      test.setTimeout(90_000);
      await page.goto('/en/lens-lab/');
      await expect(page.locator('html')).not.toHaveClass(/first-load/);
      // read down the page until both modules have mounted and the page has its full height
      await page.locator('#simulator-host').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector('#simulator-host canvas'), null, { timeout: 45_000 });
      await page.locator('#lens-lab-host').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector('.feature-lens-lab.is-mounted'), null, { timeout: 45_000 });
      const y = await readTo(page, '.closing');
      const fullHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      const closingTop = await page.locator('.closing').evaluate((el) => Math.round(el.getBoundingClientRect().top));
      expect(y, 'the closing section is far below the reserved heights').toBeGreaterThan(5000);
      if (delay) await page.route(/lens-lab-[^/]*\.js$/, async (route) => { await new Promise((r) => setTimeout(r, delay)); route.continue(); });
      await page.locator('footer a[href="en/"], footer a[href$="/en/"]').first().click();
      await expect(page).toHaveURL(/\/en\/$/);
      await page.goBack();
      await expect(page).toHaveURL(/\/en\/lens-lab\/$/);
      await page.waitForFunction((h) => document.documentElement.scrollHeight > h - 200, fullHeight, { timeout: 45_000 });
      await near(page, y);
      await expect.poll(() => page.locator('.closing').evaluate((el) => Math.round(el.getBoundingClientRect().top)), { message: 'the closing section is where the visitor left it' }).toBeGreaterThan(closingTop - 40);
      expect(await page.locator('.closing').evaluate((el) => Math.round(el.getBoundingClientRect().top))).toBeLessThan(closingTop + 40);
      // and the restored position is the one that stays on the history entry
      await page.waitForTimeout(400);
      expect(Math.abs((await page.evaluate(() => history.state.y)) - y)).toBeLessThan(40);
    });
  }
});

test.describe('Bookmarks and deep links', () => {
  for (const [url, id] of [['/en/education/#red-flags', 'red-flags'], ['/procedures/cataract-surgery/#p-faq', 'p-faq'], ['/en/lens-lab/#simulator', 'simulator-host'], ['/en/clinic/#visit', 'visit']]) {
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
