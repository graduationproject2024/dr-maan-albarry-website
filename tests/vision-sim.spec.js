// Vision simulator (src/vision-sim) — runs against the isolated harness /vision-sim-preview.html, which
// mounts the lazy module with { debug: true } (exposes window.__visionSim and window.__visionSimCounters).
import { test, expect } from '@playwright/test';

const PAGE = 'vision-sim-preview.html';
const DISCLAIMER_EN = 'Educational illustration — not a prediction of your vision; your surgeon will advise.';

function watchConsole(page) {
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  return errors;
}
async function open(page, query = 'lang=en') {
  await page.goto(`${PAGE}?${query}`);
  await page.waitForFunction(() => window.__vsim && ['ready', 'fallback'].includes(window.__vsim.getState().state), null, { timeout: 30_000 });
}
const S = (page) => page.evaluate(() => window.__vsim.getState());
const C = (page) => page.evaluate(() => ({ ...window.__visionSimCounters }));
// readPixels region in drawing-buffer fractions (origin bottom-left)
const sample = (page, region) => page.evaluate((r) => window.__visionSim.sample(r), region);
const PHONE = { x: 0.66, y: 0.05, w: 0.18, h: 0.38 };
const SIGN = { x: 0.56, y: 0.84, w: 0.26, h: 0.14 };
const lensGroup = (page, name = 'Lens') => page.getByRole('group', { name, exact: true });
const pick = (group, text) => group.getByText(text, { exact: true }).click();

let errors;
test.beforeEach(({ page }) => { errors = watchConsole(page); });
test.afterEach(() => { expect(errors, 'console errors').toEqual([]); });

test.describe('vision simulator — desktop', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('mounts lazily, renders a non-blank image and shows the persistent disclaimer', async ({ page }) => {
    await open(page);
    await expect(page.locator('.vsim canvas')).toHaveCount(1);
    await expect(page.locator('.vsim-disclaimer')).toHaveText(DISCLAIMER_EN);
    await expect(page.locator('.vsim-disclaimer')).toBeVisible();
    const s = await S(page);
    expect(s).toMatchObject({ state: 'ready', webgl: true, lang: 'en', lens: 'monofocal', lighting: 'day', subject: 'distance' });
    const px = await sample(page);
    expect(px.uniqueColors).toBeGreaterThan(150);
    expect(px.std).toBeGreaterThan(20);
    expect(await C(page)).toMatchObject({ live: 1, rafLoops: 1, renderers: 1 });
    expect((await C(page)).renderTargets).toBeGreaterThanOrEqual(7);
  });

  test('mount/destroy ×8 leaves no listeners, observers, loops, renderers or render targets', async ({ page }) => {
    await open(page);
    const r = await page.evaluate(async () => {
      const peaks = [];
      for (let i = 0; i < 8; i++) {
        const c = await window.__vsimMount({ compare: i % 2 === 1, lighting: ['day', 'dusk', 'night'][i % 3] });
        peaks.push({ ...window.__visionSimCounters });
        c.destroy();
        c.destroy(); // idempotent
      }
      return { peaks, after: { ...window.__visionSimCounters }, children: window.__vsimHost.children.length, canvases: document.querySelectorAll('canvas').length, handle: 'controller' in (window.__visionSim || {}) };
    });
    for (const p of r.peaks) expect(p).toMatchObject({ live: 1, rafLoops: 1, renderers: 1 });
    expect(r.peaks[0].listeners).toBeGreaterThan(5);
    expect(r.after).toMatchObject({ live: 0, listeners: 0, observers: 0, rafLoops: 0, renderers: 0, renderTargets: 0 });
    expect(r.after.mounts - r.after.destroys).toBe(0);
    expect(r.children).toBe(0);
    expect(r.canvases).toBe(0);
    expect(r.handle).toBe(false);
  });

  test('mount is idempotent per host (sequential and concurrent)', async ({ page }) => {
    await open(page);
    await page.evaluate(async () => { const [, b] = await Promise.all([window.__vsimMount(), window.__vsimMount()]); window.__vsim = b; });
    await page.waitForFunction(() => window.__vsim.getState().state === 'ready');
    const r = await page.evaluate(() => ({ roots: window.__vsimHost.querySelectorAll('.vsim').length, canvases: window.__vsimHost.querySelectorAll('canvas').length, c: { ...window.__visionSimCounters } }));
    expect(r.roots).toBe(1);
    expect(r.canvases).toBe(1);
    expect(r.c).toMatchObject({ live: 1, rafLoops: 1, renderers: 1 });
  });

  test('lens, distance and lighting controls drive the model and the image', async ({ page }) => {
    await open(page);
    // near preset, monofocal: the phone (40 cm) is blurred
    await page.getByRole('group', { name: 'Viewing distance' }).getByText('Near', { exact: true }).click();
    let s = await S(page);
    expect(s.distanceM).toBeCloseTo(0.4, 6);
    expect(s.subject).toBe('near');
    expect(s.optics.A.layers.near.defocusD).toBeCloseTo(2.5, 6);
    await expect(page.locator('.vsim-range-out')).toHaveText('40 cm · phone');
    const monoPhone = await sample(page, PHONE);
    // trifocal has a near focus: the phone is sharper
    await pick(lensGroup(page), 'Trifocal');
    s = await S(page);
    expect(s.lens).toBe('trifocal');
    await expect(lensGroup(page).getByRole('radio', { name: 'Trifocal' })).toBeChecked();
    const triPhone = await sample(page, PHONE);
    expect(triPhone.edgeEnergy).toBeGreaterThan(monoPhone.edgeEnergy * 1.3);
    expect(s.optics.A.layers.near.sharpness).toBeGreaterThan(0.2);
    // distance preset: the road sign; cataract scatter makes it less sharp than monofocal
    await page.getByRole('group', { name: 'Viewing distance' }).getByText('Distance', { exact: true }).click();
    await pick(lensGroup(page), 'Monofocal');
    const monoSign = await sample(page, SIGN);
    await pick(lensGroup(page), 'Cataract');
    const catSign = await sample(page, SIGN);
    expect(catSign.edgeEnergy).toBeLessThan(monoSign.edgeEnergy);
    expect((await S(page)).subject).toBe('distance');
    // lighting changes the assumed pupil
    const light = page.getByRole('group', { name: 'Lighting' });
    const pupils = [];
    for (const l of ['Day', 'Dusk', 'Night']) { await light.getByText(l, { exact: true }).click(); pupils.push((await S(page)).pupilMm); }
    expect(pupils[0]).toBeLessThan(pupils[1]);
    expect(pupils[1]).toBeLessThan(pupils[2]);
    expect((await S(page)).lighting).toBe('night');
    // the programmatic API mirrors the UI
    await page.evaluate(() => { const c = window.__vsim; c.setLens('edof'); c.setDistance(0.66); c.setLighting('dusk'); c.setLens('bogus'); c.setDistance(999); });
    s = await S(page);
    expect(s).toMatchObject({ lens: 'edof', lighting: 'dusk', distanceM: 6, subject: 'distance' });
    await expect(lensGroup(page).getByRole('radio', { name: 'EDOF' })).toBeChecked();
  });

  test('comparison: split divider is keyboard operable and both lenses render', async ({ page }) => {
    await open(page, 'lang=en&d=0.4&lens=monofocal&lensB=trifocal');
    await page.getByText('Compare two lenses').click();
    await expect(lensGroup(page, 'Compare with')).toBeVisible();
    const divider = page.getByRole('slider', { name: /Comparison divider/ });
    await expect(divider).toBeVisible();
    await divider.focus();
    await page.keyboard.press('Home');
    await expect(divider).toHaveAttribute('aria-valuenow', '0');
    const allB = await sample(page, PHONE); // split at 0: whole image is lens B (trifocal)
    await page.keyboard.press('End');
    await expect(divider).toHaveAttribute('aria-valuenow', '100');
    const allA = await sample(page, PHONE);
    expect(allB.edgeEnergy).toBeGreaterThan(allA.edgeEnergy * 1.3);
    await page.keyboard.press('ArrowLeft');
    await expect(divider).toHaveAttribute('aria-valuenow', '95');
    await expect(page.locator('.vsim-tag-a')).toHaveText('Monofocal');
    await expect(page.locator('.vsim-tag-b')).toHaveText('Trifocal');
    expect(await S(page)).toMatchObject({ compare: true, lensB: 'trifocal', split: 0.95 });
  });

  test('rapid lens switching ends in a consistent state without leaks', async ({ page }) => {
    await open(page);
    const g = lensGroup(page);
    const before = await C(page);
    const order = ['EDOF', 'Trifocal', 'Toric', 'Cataract', 'Monofocal'];
    for (let i = 0; i < 25; i++) await g.getByText(order[i % 5], { exact: true }).click({ delay: 0 });
    await page.evaluate(() => { for (const l of ['edof', 'trifocal', 'toric', 'cataract', 'monofocal', 'trifocal']) window.__vsim.setLens(l); });
    const s = await S(page);
    expect(s.lens).toBe('trifocal');
    await expect(g.getByRole('radio', { name: 'Trifocal' })).toBeChecked();
    const after = await C(page);
    expect(after).toMatchObject({ live: 1, rafLoops: 1, renderers: 1, listeners: before.listeners, renderTargets: before.renderTargets });
    expect((await sample(page)).uniqueColors).toBeGreaterThan(150);
  });

  test('language and theme APIs switch direction, text and self-contained tokens', async ({ page }) => {
    await open(page, 'lang=ar');
    const root = page.locator('.vsim');
    await expect(root).toHaveAttribute('dir', 'rtl');
    await expect(root).toHaveAttribute('lang', 'ar');
    await expect(page.locator('.vsim-disclaimer')).toContainText('ليس توقعاً لرؤيتك');
    await page.evaluate(() => window.__vsim.setLang('en'));
    await expect(root).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('.vsim-disclaimer')).toHaveText(DISCLAIMER_EN);
    await expect(lensGroup(page)).toBeVisible();
    const bgLight = await root.evaluate((el) => getComputedStyle(el).backgroundColor);
    // host colours must not leak in
    await page.evaluate(() => { document.body.style.color = 'rgb(255, 0, 0)'; document.body.style.setProperty('--vsim-bg', 'red'); });
    expect(await root.evaluate((el) => getComputedStyle(el).color)).not.toBe('rgb(255, 0, 0)');
    await page.evaluate(() => window.__vsim.setTheme('dark'));
    await expect(root).toHaveAttribute('data-theme', 'dark');
    const bgDark = await root.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bgDark).not.toBe(bgLight);
    const ev = await page.evaluate(() => window.__vsimEvents.map((e) => e.ev));
    expect(ev).toEqual(expect.arrayContaining(['langchange', 'themechange']));
    expect(await S(page)).toMatchObject({ lang: 'en', theme: 'dark', state: 'ready' });
    expect((await sample(page)).uniqueColors).toBeGreaterThan(150); // scene rebuilt with localised text
  });

  test('WebGL context loss shows a note and restore resumes rendering', async ({ page }) => {
    await open(page);
    await page.evaluate(() => { window.__lose = window.__visionSim.renderer.getContext().getExtension('WEBGL_lose_context'); window.__lose.loseContext(); });
    await expect.poll(async () => (await S(page)).state).toBe('error');
    await expect(page.locator('.vsim-note')).toBeVisible();
    expect(await C(page)).toMatchObject({ rafLoops: 0 });
    await page.evaluate(() => window.__lose.restoreContext());
    await expect.poll(async () => (await S(page)).state).toBe('ready');
    await expect(page.locator('.vsim-note')).toBeHidden();
    expect(await C(page)).toMatchObject({ rafLoops: 1, live: 1 });
    await page.evaluate(() => window.__vsim.setLens('trifocal'));
    const px = await sample(page);
    expect(px.uniqueColors).toBeGreaterThan(150);
    expect(px.std).toBeGreaterThan(20);
  });

  test('rendering is deterministic for the same state', async ({ page }) => {
    await open(page, 'lang=en&lens=trifocal&lighting=night&d=0.66');
    const a = await sample(page);
    await page.evaluate(() => { window.__vsim.setLens('monofocal'); });
    await sample(page);
    await page.evaluate(() => { window.__vsim.setLens('trifocal'); });
    const b = await sample(page);
    expect(b).toEqual(a);
  });

  test('without WebGL a static explanatory comparison is shown', async ({ page }) => {
    await open(page, 'lang=en&nowebgl=1');
    expect(await S(page)).toMatchObject({ state: 'fallback', webgl: false, fallbackReason: 'no-webgl' });
    await expect(page.locator('.vsim-fallback svg[role="img"]')).toBeVisible();
    await expect(page.locator('.vsim-fallback')).toContainText('Trifocal');
    await expect(page.locator('.vsim-disclaimer')).toHaveText(DISCLAIMER_EN);
    expect(await C(page)).toMatchObject({ renderers: 0, rafLoops: 0 });
  });

  test('everyday situations are the primary control and drive distance + lighting', async ({ page }) => {
    await open(page);
    const scn = page.getByRole('group', { name: 'Everyday situation' });
    await expect(scn).toBeVisible();
    // situation → picture → lens → explore → compare → explanation → limitations → questions → advanced
    const order = await page.evaluate(() => ['.vsim-field-scenario', '.vsim-stage', '.vsim-field-lens', '.vsim-field-explore', '.vsim-field-compare', '.vsim-explain', '.vsim-limits', '.vsim-questions', '.vsim-adv']
      .map((sel) => document.querySelector(sel).getBoundingClientRect().top));
    for (let i = 1; i < order.length; i++) expect(order[i]).toBeGreaterThanOrEqual(order[i - 1]);
    expect((await S(page)).scenario).toBe('signs');
    const expectations = { 'Laptop work': [0.66, 'day', 'laptop'], 'Reading a phone': [0.35, 'day', 'phone'], 'Reading a book': [0.4, 'day', 'book'], 'Night driving': [6, 'night', 'night-driving'], 'Distance signs': [6, 'day', 'signs'] };
    for (const [label, [d, light, id]] of Object.entries(expectations)) {
      await scn.getByText(label, { exact: true }).click();
      const s = await S(page);
      expect(s.distanceM).toBeCloseTo(d, 6);
      expect(s).toMatchObject({ lighting: light, scenario: id });
      await expect(scn.getByRole('radio', { name: new RegExp(label) })).toBeChecked();
    }
    // a fine adjustment leaves the presets: no situation is checked and a note says so
    await page.getByRole('group', { name: 'Lighting' }).getByText('Dusk', { exact: true }).click();
    expect((await S(page)).scenario).toBe(null);
    await expect(page.locator('.vsim-custom')).toBeVisible();
    await expect(scn.getByRole('radio', { checked: true })).toHaveCount(0);
    await page.evaluate(() => window.__vsim.setScenario('phone'));
    expect(await S(page)).toMatchObject({ scenario: 'phone', lighting: 'day', subject: 'near' });
    // the explanation is visible; limitations and questions for the doctor are one tap away, clearly labelled
    await expect(page.locator('.vsim-seeing')).toContainText('Reading a phone screen');
    await expect(page.locator('.vsim-limits > summary')).toBeVisible();
    await expect(page.locator('.vsim-questions > summary')).toBeVisible();
    await page.locator('.vsim-limits > summary').click();
    await expect(page.locator('.vsim-limits li')).toHaveCount(5);
    await page.locator('.vsim-questions > summary').click();
    await expect(page.locator('.vsim-questions li').first()).toBeVisible();
    // technical controls are not shown until "Advanced" is opened
    await expect(page.getByRole('group', { name: 'Corneal astigmatism' })).toBeHidden();
    await expect(page.locator('.vsim-range')).toBeHidden();
    await page.locator('.vsim-adv > summary').click();
    await expect(page.getByRole('group', { name: 'Corneal astigmatism' })).toBeVisible();
    await expect(page.locator('.vsim-range')).toBeVisible();
    await expect(page.locator('.vsim-model')).toContainText('Assumed pupil');
  });

  test('multifocal (two-focus) lens is available and differs from trifocal at the laptop', async ({ page }) => {
    await open(page, 'lang=en&d=0.66');
    await pick(lensGroup(page), 'Multifocal');
    const s = await S(page);
    expect(s.lens).toBe('multifocal');
    const tri = await page.evaluate(() => { window.__vsim.setLens('trifocal'); return window.__vsim.getState().optics.A.layers.intermediate.sharpness; });
    expect(s.optics.A.layers.intermediate.sharpness).toBeLessThan(tri);
  });

  test('enlarge view: opens over the page, Escape closes it and focus returns to the button', async ({ page }) => {
    await open(page);
    await page.getByRole('button', { name: 'Enlarge view' }).click();
    expect((await S(page)).expanded).toBe(true);
    await expect(page.locator('.vsim')).toHaveClass(/vsim--expanded/);
    const vp = await page.locator('.vsim-viewport').boundingBox();
    expect(vp.width).toBeGreaterThan(1100);
    await page.keyboard.press('Escape');
    await expect.poll(async () => (await S(page)).expanded).toBe(false);
    await expect(page.getByRole('button', { name: 'Enlarge view' })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');
    expect((await sample(page)).uniqueColors).toBeGreaterThan(150);
  });

  test('viewer-only mode renders the picture without the controls', async ({ page }) => {
    await open(page);
    await page.evaluate(async () => { window.__vsim = await window.__vsimMount({ ui: 'viewer', compare: true, lens: 'edof', lensB: 'trifocal', scenario: 'night-driving' }); });
    await page.waitForFunction(() => window.__vsim.getState().state === 'ready');
    expect(await S(page)).toMatchObject({ ui: 'viewer', compare: true, lens: 'edof', lensB: 'trifocal', scenario: 'night-driving', lighting: 'night' });
    await expect(page.locator('.vsim--viewer canvas')).toHaveCount(1);
    await expect(page.locator('.vsim--viewer .vsim-seg-btn')).toHaveCount(0);
    await expect(page.getByRole('slider', { name: /Comparison divider/ })).toBeVisible();
    await expect(page.locator('.vsim-disclaimer')).toHaveText(DISCLAIMER_EN);
    expect((await sample(page)).uniqueColors).toBeGreaterThan(150);
  });

  test('reduced motion is honoured', async ({ page }) => {
    await open(page, 'lang=en&reduced=1');
    expect((await S(page)).reducedMotion).toBe(true);
    await expect(page.locator('.vsim')).toHaveAttribute('data-reduced-motion', 'true');
    const dur = await page.locator('.vsim-seg-btn').first().evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(dur.split(',').every((d) => parseFloat(d) === 0)).toBe(true);
  });
});

test.describe('vision simulator — keyboard', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('radio groups, the distance slider and the live region work from the keyboard', async ({ page }) => {
    await open(page);
    const mono = lensGroup(page).getByRole('radio', { name: 'Monofocal' });
    await mono.focus();
    await page.keyboard.press('ArrowRight');
    await expect(lensGroup(page).getByRole('radio', { name: 'EDOF' })).toBeChecked();
    expect((await S(page)).lens).toBe('edof');
    await expect(page.locator('.vsim-sr')).toContainText('Extended depth of focus (EDOF)');
    // the raw distance slider lives in the "Advanced" disclosure (patient-first simplification, 2026-11)
    await page.locator('.vsim-adv > summary').click();
    const range = page.getByRole('slider', { name: 'Viewing distance' });
    await range.focus();
    await page.keyboard.press('Home');
    await expect.poll(async () => (await S(page)).distanceM).toBeCloseTo(0.33, 3);
    await expect(range).toHaveAttribute('aria-valuetext', '33 cm — phone');
    await page.keyboard.press('End');
    await expect.poll(async () => (await S(page)).distanceM).toBeCloseTo(6, 3);
    await page.keyboard.press('PageDown');
    const d = (await S(page)).distanceM;
    expect(d).toBeLessThan(6);
    await expect(page.locator('.vsim-sr')).toContainText(/EDOF/, { timeout: 3000 });
    const tabbable = await page.evaluate(() => [...document.querySelectorAll('.vsim input, .vsim summary, .vsim [tabindex="0"]')].filter((e) => !e.closest('[hidden]')).length);
    expect(tabbable).toBeGreaterThan(10);
  });
});

test.describe('vision simulator — mobile', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });

  test('touch: lens / distance / lighting / compare work and touch targets are ≥ 44 px', async ({ page }) => {
    await open(page, 'lang=ar');
    await lensGroup(page, 'العدسة').getByText('ثلاثية', { exact: true }).tap();
    expect((await S(page)).lens).toBe('trifocal');
    await page.getByRole('group', { name: 'مسافة النظر' }).getByText('قريب', { exact: true }).tap();
    expect((await S(page)).subject).toBe('near');
    await page.getByRole('group', { name: 'موقف يومي' }).getByText('قراءة الهاتف', { exact: true }).tap();
    expect((await S(page))).toMatchObject({ subject: 'near', scenario: 'phone' });
    await page.getByRole('group', { name: 'الإضاءة' }).getByText('ليل', { exact: true }).tap();
    expect((await S(page)).lighting).toBe('night');
    await page.getByText('قارن بين عدستين').tap();
    expect((await S(page)).compare).toBe(true);
    await lensGroup(page, 'قارن مع').getByText('أحادية', { exact: true }).tap();
    expect((await S(page)).lensB).toBe('monofocal');
    const small = await page.evaluate(() => [...document.querySelectorAll('.vsim .vsim-seg-btn, .vsim .vsim-switch, .vsim summary, .vsim-range, .vsim-divider')]
      .filter((e) => e.offsetParent !== null)
      .map((e) => { const r = e.getBoundingClientRect(); return { c: e.className, w: r.width, h: r.height }; })
      .filter((r) => r.h < 44 || r.w < 44));
    expect(small).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    const st = await S(page);
    expect(st.quality.internal.width).toBeGreaterThanOrEqual(300);
    // phones: the viewer runs edge to edge in the card at 7:6 (was 4:3 with an 8 px bleed)
    const vp = await page.locator('.vsim-viewport').boundingBox();
    expect(vp.height / vp.width).toBeCloseTo(6 / 7, 2);
    expect(vp.width).toBeGreaterThanOrEqual(390 - 40);
    expect((await sample(page)).uniqueColors).toBeGreaterThan(100);
  });
});

for (const lang of ['ar', 'en']) {
  test.describe(`vision simulator — 320 px (${lang})`, () => {
    test.use({ viewport: { width: 320, height: 700 } });

    test('no horizontal overflow and no overlapping controls', async ({ page }) => {
      await open(page, `lang=${lang}&compare=1`);
      await page.locator('.vsim-adv > summary').click();
      const r = await page.evaluate(() => {
        const box = (e) => { const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, r: b.right, b: b.bottom }; };
        const overlap = (a, b) => a.x < b.r - 0.5 && b.x < a.r - 0.5 && a.y < b.b - 0.5 && b.y < a.b - 0.5;
        const vis = (sel) => [...document.querySelectorAll(sel)].filter((e) => e.offsetParent !== null && getComputedStyle(e).visibility !== 'hidden');
        const controls = vis('.vsim .vsim-seg-btn, .vsim .vsim-switch, .vsim .vsim-range, .vsim .vsim-range-out, .vsim summary').map(box);
        const clashes = [];
        for (let i = 0; i < controls.length; i++) for (let j = i + 1; j < controls.length; j++) if (overlap(controls[i], controls[j])) clashes.push([i, j]);
        const tags = vis('.vsim-tag').map(box);
        const outside = vis('.vsim *').map(box).filter((b) => b.r > 320.5 || b.x < -0.5);
        return { sw: document.documentElement.scrollWidth, clashes, tagsOverlap: tags.length === 2 && overlap(tags[0], tags[1]), outside: outside.length };
      });
      expect(r.sw).toBeLessThanOrEqual(320);
      expect(r.clashes).toEqual([]);
      expect(r.tagsOverlap).toBe(false);
      expect(r.outside).toBe(0);
      await expect(page.locator('.vsim-disclaimer')).toBeVisible();
    });
  });
}
