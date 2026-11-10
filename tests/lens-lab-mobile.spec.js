// Lens Lab mobile workbench: real taps on the public /lens-lab/ page. The picture and the essential controls must stay
// on screen together, between the site header and the booking bar, and a tap must never move the page.
import { test, expect } from '@playwright/test';
import { CONTENT } from '../src/lens-lab/content.js';
import { STRINGS, LENS_INFO } from '../src/vision-sim/i18n.js';
import { DISTANCES } from '../src/vision-sim/optics/params.js';

const STORE = 'lens-lab-choice';
const H = '#simulator-host';
const phone = (width, height) => ({ viewport: { width, height }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
const url = (lang, q = '') => `${lang === 'en' ? '/en' : ''}/lens-lab/${q}`;
const lbl = (page, group, value) => page.locator(`${H} label[for$="-${group}-${value}"]`);
const radio = (page, group, value) => page.locator(`${H} input[data-group="${group}"][value="${value}"]`);
const more = (page) => page.locator(`${H} .vsim-more`);
const reset = (page) => page.locator(`${H} .vsim-reset`);
const settle = (page) => page.waitForTimeout(280); // two frames of the render loop, plus a margin

function watchConsole(page) {
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_FAILED|Failed to load resource|Failed to fetch dynamically/.test(m.text())) errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  return errors;
}
/** One scroll, as a visitor makes it: the workbench under the header. */
async function toBench(page) {
  await page.evaluate((host) => {
    const b = document.querySelector(`${host} .vsim-bench`);
    const h = document.getElementById('site-header').offsetHeight;
    window.scrollTo(0, b.getBoundingClientRect().top + window.scrollY - h);
  }, H);
  await page.waitForTimeout(120);
}
async function open(page, lang = 'ar', q = '') {
  await page.goto(url(lang, q));
  await page.locator('main h1').waitFor();
  await page.locator(H).scrollIntoViewIfNeeded();
  await page.waitForFunction((host) => document.querySelector(`${host} canvas`) && !document.querySelector(`${host} .vsim-loading:not([hidden])`), H, { timeout: 45_000 });
  // the section's fade-in moves it by 16 px for a moment; measure the resting layout
  await page.waitForFunction(() => { const l = document.querySelector('.vsim-launch'); return l.classList.contains('visible') && !l.getAnimations().length; }, null, { timeout: 10_000 });
  await toBench(page);
  await page.waitForTimeout(350);
}
/** The picture itself: overlay labels are hidden for the grab so only rendered pixels are compared. */
async function picture(page) {
  await settle(page);
  const tag = await page.addStyleTag({ content: '.vsim-tag,.vsim-caption,.vsim-expand{visibility:hidden!important}' });
  const png = await page.locator(`${H} canvas`).screenshot({ type: 'png' });
  await tag.evaluate((n) => n.remove());
  return png;
}
const samePicture = (a, b) => Buffer.compare(a, b) === 0;
/** Where everything is relative to the fixed bars. headerH counts the header as if it were showing. */
const zone = (page) => page.evaluate((host) => {
  const box = (e) => { const b = e.getBoundingClientRect(); return { top: b.top, bottom: b.bottom, left: b.left, right: b.right, w: b.width, h: b.height }; };
  const q = (s) => document.querySelector(`${host} ${s}`);
  const headerEl = document.getElementById('site-header');
  const barEl = document.querySelector('.booking-bar');
  const bar = barEl && getComputedStyle(barEl).display !== 'none' ? barEl.getBoundingClientRect().top : window.innerHeight;
  return {
    y: window.scrollY, headerH: headerEl.offsetHeight, barTop: bar, vh: window.innerHeight, vw: window.innerWidth,
    canvas: box(q('canvas')), viewport: box(q('.vsim-viewport')), stage: box(q('.vsim-stage')), bench: box(q('.vsim-bench')),
    presets: box(q('.vsim-field-presets')), controls: box(q('.vsim-bench-controls')), actions: box(q('.vsim-bench-actions')),
    disclaimer: box(q('.vsim-disclaimer')), sticky: q('.vsim-bench').hasAttribute('data-sticky'), stagePos: getComputedStyle(q('.vsim-stage')).position,
    sw: document.documentElement.scrollWidth,
  };
}, H);
const expectInZone = (z, msg) => {
  expect(z.canvas.top, `${msg}: canvas top below the header`).toBeGreaterThanOrEqual(z.headerH - 1);
  expect(z.canvas.bottom, `${msg}: canvas bottom above the booking bar`).toBeLessThanOrEqual(z.barTop + 1);
};
const small = (page, sel) => page.evaluate((s) => [...document.querySelectorAll(s)]
  .filter((e) => e.getClientRects().length)
  .map((e) => { const r = e.getBoundingClientRect(); return { c: e.className || e.tagName, w: Math.round(r.width), h: Math.round(r.height) }; })
  .filter((r) => r.w < 44 || r.h < 44), sel);
const frameBox = (page) => page.locator(`${H} .vsim-target`).boundingBox();
const TARGETS = `${H} .vsim-bench .vsim-seg-btn, ${H} .vsim-action, ${H} .vsim-expand, ${H} .vsim-switch, ${H} .vsim-range, ${H} .vsim-help summary`;
const GL_PROBE = `(() => { const o = HTMLCanvasElement.prototype.getContext; const live = new Set(); window.__gl = live;
  HTMLCanvasElement.prototype.getContext = function (t, ...r) { const c = o.call(this, t, ...r); if (c && /webgl/i.test(t)) { live.add(c); this.addEventListener('webglcontextlost', () => live.delete(c)); } return c; }; })();`;

let errors;
test.beforeEach(({ page }) => { errors = watchConsole(page); });
test.afterEach(() => { expect(errors, 'console errors').toEqual([]); });

test.describe('acceptance at 390x844', () => {
  test.use(phone(390, 844));
  for (const lang of ['ar', 'en']) {
    test(`ten steps with real taps (${lang})`, async ({ page }) => {
      const s = STRINGS[lang];
      let yAfterScroll, first;
      const ys = [];
      await test.step('1. open Lens Lab and bring the workbench on screen with one scroll', async () => {
        await open(page, lang);
        yAfterScroll = (await zone(page)).y;
      });
      await test.step('2. the notice and the caption say what the picture is', async () => {
        await expect(page.locator(`${H} .vsim-disclaimer`)).toBeVisible();
        await expect(page.locator(`${H} .vsim-disclaimer`)).toContainText(s.disclaimer);
        await expect(page.locator(`${H} .vsim-caption`)).toBeVisible();
        await expect(page.locator(`${H} .vsim-caption`)).toContainText(s.lights.day);
        await expect(page.locator(`${H} .vsim-tag-a`)).toContainText(s.lenses.monofocal.short);
        expectInZone(await zone(page), 'start');
        first = await picture(page);
      });
      // the far road sign barely changes between two distance-corrected lenses, so the lens step is made at Near.
      // The model draws every distance at once: the distance step changes what the frame points at, not the image.
      let before = first;
      await test.step('3. change the distance: picture changes, picture and control stay on screen', async () => {
        const frameFar = await frameBox(page);
        await lbl(page, 'preset', 'near').tap();
        await expect(radio(page, 'preset', 'near')).toBeChecked();
        const p = await picture(page);
        expect(samePicture(p, before), 'distance changes the picture').toBe(false);
        const frameNear = await frameBox(page);
        expect(Math.abs(frameNear.y - frameFar.y), 'the frame moves to the phone').toBeGreaterThan(40);
        before = p;
        const z = await zone(page); expectInZone(z, 'distance'); ys.push(z.y);
      });
      await test.step('4. select another lens: picture changes, picture and control stay on screen', async () => {
        await lbl(page, 'lensA', 'trifocal').tap();
        await expect(radio(page, 'lensA', 'trifocal')).toBeChecked();
        const p = await picture(page);
        expect(samePicture(p, before), 'lens changes the picture').toBe(false);
        before = p;
        const z = await zone(page); expectInZone(z, 'lens'); ys.push(z.y);
      });
      await test.step('5. change the lighting: picture changes, picture and control stay on screen', async () => {
        await lbl(page, 'lighting', 'night').tap();
        await expect(radio(page, 'lighting', 'night')).toBeChecked();
        const p = await picture(page);
        expect(samePicture(p, before), 'lighting changes the picture').toBe(false);
        const z = await zone(page); expectInZone(z, 'lighting'); ys.push(z.y);
      });
      await test.step('6. the page never moved between taps', () => {
        for (const y of ys) expect(Math.abs(y - yAfterScroll), 'scrollY between taps').toBeLessThanOrEqual(1);
      });
      await test.step('7. every essential control is above the booking bar at this moment', async () => {
        const z = await zone(page);
        expect(z.actions.bottom).toBeLessThanOrEqual(z.barTop + 1);
        expect(z.disclaimer.top).toBeGreaterThanOrEqual(z.headerH - 1);
      });
      await test.step('8. Reset returns the original picture without moving the page', async () => {
        await reset(page).tap();
        await expect(radio(page, 'lensA', 'monofocal')).toBeChecked();
        await expect(radio(page, 'preset', 'distance')).toBeChecked();
        await expect(radio(page, 'lighting', 'day')).toBeChecked();
        const p = await picture(page);
        expect(samePicture(p, first), 'Reset restores the first picture').toBe(true);
        expect(Math.abs((await zone(page)).y - yAfterScroll)).toBeLessThanOrEqual(1);
      });
      await test.step('9. read the explanation of the chosen lens', async () => {
        const ex = page.locator(`${H} .vsim-explain`);
        await ex.scrollIntoViewIfNeeded();
        await expect(ex.locator('.vsim-card')).toContainText(LENS_INFO[lang].monofocal.intended);
        await expect(ex.locator('.vsim-card')).toContainText(LENS_INFO[lang].monofocal.tradeoffs);
        await expect(ex.locator('.vsim-exam')).toHaveText(s.exam);
      });
      await test.step('10. evidence and limits are one tap away, the notice is still there', async () => {
        const limits = page.locator(`${H} .vsim-limits > summary`);
        await limits.scrollIntoViewIfNeeded();
        await limits.tap();
        await expect(page.locator(`${H} .vsim-limits li`).first()).toBeVisible();
        await expect(page.locator(`${H} .vsim-disclaimer`)).toContainText(s.disclaimer);
      });
    });
  }
});

test.describe('every option', () => {
  test.use(phone(390, 844));

  test('lens, distance and lighting options all work and show in the picture (en)', async ({ page }) => {
    await open(page, 'en');
    const y0 = (await zone(page)).y;
    await lbl(page, 'preset', 'near').tap();
    const seen = [];
    for (const v of ['monofocal', 'edof', 'trifocal']) {
      await lbl(page, 'lensA', v).tap();
      await expect(radio(page, 'lensA', v)).toBeChecked();
      seen.push(await picture(page));
    }
    expect(samePicture(seen[0], seen[1])).toBe(false);
    expect(samePicture(seen[1], seen[2])).toBe(false);
    expect(samePicture(seen[0], seen[2])).toBe(false);
    const dist = [];
    for (const v of ['near', 'intermediate', 'distance']) {
      await lbl(page, 'preset', v).tap();
      await expect(radio(page, 'preset', v)).toBeChecked();
      dist.push(await picture(page));
    }
    expect(samePicture(dist[0], dist[1])).toBe(false);
    expect(samePicture(dist[1], dist[2])).toBe(false);
    const light = [];
    for (const v of ['day', 'dusk', 'night']) {
      await lbl(page, 'lighting', v).tap();
      await expect(radio(page, 'lighting', v)).toBeChecked();
      light.push(await picture(page));
    }
    expect(samePicture(light[0], light[1])).toBe(false);
    expect(samePicture(light[1], light[2])).toBe(false);
    expect(Math.abs((await zone(page)).y - y0)).toBeLessThanOrEqual(1);
    // labels the owner asked for, and EDOF explained where it first appears
    await expect(lbl(page, 'preset', 'distance')).toContainText('Far');
    await expect(lbl(page, 'lighting', 'dusk')).toContainText('Dim');
    await expect(lbl(page, 'lensA', 'edof')).toContainText('Extended range');
    await expect(lbl(page, 'lensA', 'edof')).toContainText('EDOF');
  });

  test('the other lens types live in More settings, in the same radio group', async ({ page }) => {
    await open(page, 'en', '?dist=near');
    await lbl(page, 'lensA', 'trifocal').tap();
    const names = await page.locator(`${H} input[data-group="lensA"]`).evaluateAll((els) => [...new Set(els.map((e) => e.name))]);
    expect(names).toHaveLength(1);
    await expect(lbl(page, 'lensA', 'cataract')).toBeHidden();
    await more(page).tap();
    await expect(more(page)).toHaveAttribute('aria-expanded', 'true');
    const tri = await picture(page);
    for (const v of ['multifocal', 'toric', 'cataract']) {
      await lbl(page, 'lensA', v).tap();
      await expect(radio(page, 'lensA', v)).toBeChecked();
      await expect(radio(page, 'lensA', 'trifocal')).not.toBeChecked();
      await expect(page.locator(`${H} .vsim-tag-a`)).toContainText(STRINGS.en.lenses[v].short);
    }
    expect(samePicture(await picture(page), tri)).toBe(false);
    await more(page).tap();
    await expect(page.locator(`${H} .vsim-more-now`)).toHaveText(STRINGS.en.lenses.cataract.short); // what is chosen stays visible when the panel closes
  });

  test('keyboard arrows move inside the lens group', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await open(page, 'en');
    await radio(page, 'lensA', 'monofocal').focus();
    await page.keyboard.press('ArrowRight');
    await expect(radio(page, 'lensA', 'edof')).toBeChecked();
    await expect(page.locator(`${H} [data-ref="live"]`)).toContainText('EDOF');
    await ctx.close();
  });
});

test.describe('Simple and Advanced', () => {
  test.use(phone(390, 844));

  test('Simple by default; More settings reveals the rest and the picture holds its size', async ({ page }) => {
    await open(page, 'en');
    await expect(page.locator(`${H} .vsim`)).toHaveAttribute('data-mode', 'simple');
    await expect(page.locator(`${H} .vsim-adv`)).toBeHidden();
    await expect(page.getByRole('group', { name: 'Everyday situation' })).toBeHidden();
    const a = await zone(page);
    await more(page).tap();
    await expect(page.locator(`${H} .vsim`)).toHaveAttribute('data-mode', 'advanced');
    for (const name of ['Everyday situation', 'Other lens types', 'Corneal astigmatism', 'Astigmatism axis', 'Leftover short- or long-sightedness']) await expect(page.getByRole('group', { name, exact: true })).toBeVisible();
    await expect(page.locator(`${H} .vsim-switch`)).toBeVisible();
    await expect(page.locator(`${H} .vsim-range`)).toBeVisible();
    await expect(page.locator(`${H} .vsim-model`).first()).toContainText('Assumed pupil');
    const b = await zone(page);
    expect(Math.abs(b.y - a.y), 'opening does not move the page').toBeLessThanOrEqual(1);
    await lbl(page, 'preset', 'near').tap(); // a control right under the stuck picture must not make the page jump either
    await lbl(page, 'lensA', 'trifocal').tap();
    expect(Math.abs((await zone(page)).y - a.y), 'tapping with More settings open').toBeLessThanOrEqual(1);
    expect(Math.abs(b.viewport.h - a.viewport.h), 'opening does not resize the picture').toBeLessThanOrEqual(1);
    expect(b.sticky).toBe(true);
    await more(page).tap();
    await expect(page.locator(`${H} .vsim-adv`)).toBeHidden();
    await expect(more(page)).toBeFocused();
  });

  test('advanced controls stay next to the picture: the viewer sticks while they scroll, inside the workbench only', async ({ page }) => {
    await open(page, 'en');
    await more(page).tap();
    await expect.poll(async () => (await zone(page)).stagePos).toBe('sticky');
    // scroll into the advanced panel
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(700);
    let z = await zone(page);
    expect(z.stage.top, 'picture stays pinned').toBeGreaterThanOrEqual(0);
    expect(z.stage.top).toBeLessThanOrEqual(z.headerH + 1);
    expect(z.stage.h / z.vh, 'capped, never most of the screen').toBeLessThanOrEqual(0.56);
    await expect(page.locator(`${H} .vsim-disclaimer`)).toBeInViewport();
    // the scenario control scrolled under the picture is not hit: taps land on controls below it
    const scn = lbl(page, 'scenario', 'phone');
    await scn.scrollIntoViewIfNeeded();
    await page.evaluate(({ h }) => { const b = document.querySelector(`${h} .vsim-field-scenario`).getBoundingClientRect(); const s = document.querySelector(`${h} .vsim-stage`).getBoundingClientRect(); if (b.top < s.bottom) window.scrollBy(0, b.top - s.bottom - 8); }, { h: H });
    await page.waitForTimeout(250);
    await scn.tap();
    await expect(radio(page, 'scenario', 'phone')).toBeChecked();
    // scrolled past the workbench the picture lets go and covers nothing below it
    await page.evaluate((host) => { const b = document.querySelector(`${host} .vsim-explain`); window.scrollTo(0, b.getBoundingClientRect().top + window.scrollY - 200); }, H);
    await page.waitForTimeout(700);
    z = await zone(page);
    expect(z.stage.bottom, 'the sticky stage ends with its workbench').toBeLessThanOrEqual(z.bench.bottom + 1);
    const hit = await page.evaluate((host) => { const r = document.querySelector(`${host} .vsim-explain h3`).getBoundingClientRect(); const e = document.elementFromPoint(r.left + 10, r.top + 5); return !!(e && e.closest('.vsim-explain')); }, H);
    expect(hit, 'the result text is not covered').toBe(true);
  });

  test('scrolling back up: the returning header never covers the picture', async ({ page }) => {
    await open(page, 'en');
    await more(page).tap();
    await page.evaluate(() => window.scrollBy(0, 420));
    await page.waitForTimeout(700);
    await page.evaluate(() => window.scrollBy(0, -60));
    await page.waitForTimeout(800);
    const r = await page.evaluate((host) => {
      const h = document.getElementById('site-header');
      const hb = h.getBoundingClientRect(); const s = document.querySelector(`${host} .vsim-stage`).getBoundingClientRect();
      return { hidden: h.classList.contains('is-hidden'), headerBottom: hb.bottom, stageTop: s.top };
    }, H);
    expect(r.hidden).toBe(false);
    expect(r.stageTop).toBeGreaterThanOrEqual(r.headerBottom - 1);
  });

  test('Reset clears lens, compare, eye settings, storage and URL', async ({ page }) => {
    await open(page, 'en', '?lens=edof&dist=near&light=night');
    await more(page).tap();
    await page.locator(`${H} .vsim-switch`).tap();
    await lbl(page, 'cyl', '2').tap();
    await expect(radio(page, 'cyl', '2')).toBeChecked();
    await reset(page).tap();
    await expect(radio(page, 'lensA', 'monofocal')).toBeChecked();
    await expect(radio(page, 'preset', 'distance')).toBeChecked();
    await expect(radio(page, 'lighting', 'day')).toBeChecked();
    await expect(radio(page, 'cyl', '0')).toBeChecked();
    await expect(page.locator(`${H} [data-ref="compare"]`)).not.toBeChecked();
    expect(await page.evaluate((k) => localStorage.getItem(k), STORE)).toBe(null);
    expect(new URL(page.url()).search).toBe('');
    await expect(reset(page)).toBeFocused();
  });

  test('rapid repeated changes end in a consistent state', async ({ page }) => {
    await open(page, 'en');
    const y0 = (await zone(page)).y;
    const seq = [['lensA', 'edof'], ['preset', 'near'], ['lighting', 'night'], ['lensA', 'trifocal'], ['preset', 'intermediate'], ['lighting', 'dusk'], ['lensA', 'monofocal']];
    for (let i = 0; i < 4; i++) for (const [g, v] of seq) await lbl(page, g, v).tap({ delay: 0 });
    await lbl(page, 'lensA', 'trifocal').tap({ delay: 0 });
    await expect(radio(page, 'lensA', 'trifocal')).toBeChecked();
    await expect(radio(page, 'preset', 'intermediate')).toBeChecked();
    await expect(radio(page, 'lighting', 'dusk')).toBeChecked();
    await expect(page.locator(`${H} .vsim-tag-a`)).toContainText('Trifocal');
    await expect(page.locator(`${H} canvas`)).toHaveCount(1);
    expect(new URL(page.url()).search).toBe('?lens=trifocal&dist=intermediate&light=dim');
    expect(Math.abs((await zone(page)).y - y0)).toBeLessThanOrEqual(1);
    // the same state rendered fresh is the same picture
    const after = await picture(page);
    await page.reload();
    await page.waitForFunction((host) => document.querySelector(`${host} canvas`) && !document.querySelector(`${host} .vsim-loading:not([hidden])`), H);
    await toBench(page);
    await page.waitForTimeout(350);
    expect(samePicture(await picture(page), after)).toBe(true);
  });
});

test.describe('returning visitors', () => {
  test.use(phone(390, 844));

  test('the last simple choice survives a reload; the key holds three plain values only', async ({ page }) => {
    await open(page, 'en');
    await lbl(page, 'lensA', 'edof').tap();
    await lbl(page, 'preset', 'near').tap();
    await lbl(page, 'lighting', 'night').tap();
    const raw = JSON.parse(await page.evaluate((k) => localStorage.getItem(k), STORE));
    expect(raw).toEqual({ lens: 'edof', dist: 'near', light: 'night' });
    await page.goto(url('en')); // no query: storage alone restores it
    await page.locator(H).scrollIntoViewIfNeeded();
    await page.waitForFunction((host) => document.querySelector(`${host} canvas`), H);
    await expect(radio(page, 'lensA', 'edof')).toBeChecked();
    await expect(radio(page, 'preset', 'near')).toBeChecked();
    await expect(radio(page, 'lighting', 'night')).toBeChecked();
  });

  test('URL presets: valid values apply, invalid ones are ignored, the URL beats storage', async ({ page }) => {
    await page.addInitScript((k) => localStorage.setItem(k, JSON.stringify({ lens: 'trifocal', dist: 'intermediate', light: 'dim' })), STORE);
    await open(page, 'en', '?lens=edof&dist=near&light=night');
    await expect(radio(page, 'lensA', 'edof')).toBeChecked();
    await expect(radio(page, 'preset', 'near')).toBeChecked();
    await expect(radio(page, 'lighting', 'night')).toBeChecked();
    await open(page, 'en', '?lens=<script>&dist=moon&light=');
    await expect(radio(page, 'lensA', 'trifocal')).toBeChecked(); // storage, because the URL values were invalid
    await expect(radio(page, 'preset', 'intermediate')).toBeChecked();
    await expect(radio(page, 'lighting', 'dusk')).toBeChecked();
    expect(STRINGS.en.presetDist.near).toBe('40 cm');
    expect(DISTANCES).toMatchObject({ near: 0.4, intermediate: 0.66, distance: 6 });
  });

  test('stored junk is ignored', async ({ page }) => {
    await page.addInitScript((k) => localStorage.setItem(k, '{"lens":"cure","dist":9,"light":{"x":1}}'), STORE);
    await open(page, 'en');
    await expect(radio(page, 'lensA', 'monofocal')).toBeChecked();
    await expect(radio(page, 'preset', 'distance')).toBeChecked();
    await page.evaluate((k) => localStorage.setItem(k, 'not json'), STORE);
    await page.reload();
    await page.waitForFunction((host) => document.querySelector(`${host} canvas`), H);
    await expect(radio(page, 'lensA', 'monofocal')).toBeChecked();
  });

  test('a control never adds a history entry; the URL is shareable', async ({ page }) => {
    await open(page, 'en');
    const n0 = await page.evaluate(() => history.length);
    await lbl(page, 'lensA', 'edof').tap();
    await lbl(page, 'preset', 'near').tap();
    await lbl(page, 'lighting', 'night').tap();
    expect(await page.evaluate(() => history.length)).toBe(n0);
    expect(new URL(page.url()).search).toBe('?lens=edof&dist=near&light=night');
    await expect(page).toHaveTitle(/.+/); // the document is still the page
  });

  test('language switch and back/forward keep the view', async ({ page }) => {
    await open(page, 'en', '?lens=edof&dist=near&light=night');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    await page.locator('#site-header .lang-switch:visible').first().tap();
    await page.waitForURL(/\/lens-lab\/\?lens=edof/);
    expect(new URL(page.url()).pathname).toMatch(/^\/lens-lab\/$/);
    await expect(radio(page, 'lensA', 'edof')).toBeChecked();
    await expect(page.locator(`${H} .vsim`)).toHaveAttribute('dir', 'rtl');
    await page.goBack();
    await page.waitForURL(/\/en\/lens-lab\/\?lens=edof/);
    await expect(radio(page, 'lensA', 'edof')).toBeChecked();
    await expect(page.locator(`${H} .vsim`)).toHaveAttribute('dir', 'ltr');
    await page.goForward();
    await expect(page.locator(`${H} .vsim`)).toHaveAttribute('dir', 'rtl');
    await expect(radio(page, 'preset', 'near')).toBeChecked();
  });

  test('leaving and coming back: one WebGL context, the view restored from the address', async ({ page }) => {
    await page.addInitScript(GL_PROBE);
    await open(page, 'en', '?lens=trifocal&dist=near&light=dim');
    expect(await page.evaluate(() => window.__gl.size)).toBe(1);
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => { window.scrollTo(0, 0); document.querySelector('a[data-nav][href$="en/"], a[data-nav][href="en/"]').click(); });
      await page.waitForURL(/\/en\/$/);
      await expect(page.locator(`${H}`)).toHaveCount(0);
      await page.goBack();
      await page.waitForURL(/lens-lab\/\?lens=trifocal/);
      await page.locator(H).scrollIntoViewIfNeeded();
      await page.waitForFunction((host) => document.querySelector(`${host} canvas`), H, { timeout: 30_000 });
      await expect(radio(page, 'lensA', 'trifocal')).toBeChecked();
      await expect.poll(() => page.evaluate(() => window.__gl.size)).toBe(1);
    }
    await expect(page.locator('#lens-lab-host canvas')).toHaveCount(0);
  });

  test('the prerendered page adopts cleanly with a query string', async ({ page }) => {
    await page.goto(url('ar', '?lens=edof'));
    await page.locator('main h1').waitFor();
    await page.locator(H).scrollIntoViewIfNeeded();
    await page.waitForFunction((host) => document.querySelector(`${host} canvas`), H);
    await expect(radio(page, 'lensA', 'edof')).toBeChecked();
    await expect(page.locator(H)).not.toHaveAttribute('data-reserve', /.*/);
  });
});

test.describe('page structure on phones', () => {
  test.use(phone(390, 844));

  test('order, length and a single picture', async ({ page }) => {
    await page.addInitScript(GL_PROBE);
    await open(page, 'ar');
    await page.locator('#lens-lab-host').scrollIntoViewIfNeeded();
    await page.locator('#lens-lab-host .llab').waitFor({ timeout: 30_000 });
    await page.waitForTimeout(500);
    const r = await page.evaluate(() => ({
      hero: document.querySelector('.page-hero').getBoundingClientRect().top,
      sim: document.querySelector('#simulator').getBoundingClientRect().top,
      lab: document.querySelector('#lab').getBoundingClientRect().top,
      h: document.documentElement.scrollHeight,
      gl: window.__gl.size, canvases: document.querySelectorAll('canvas').length,
    }));
    expect(r.hero).toBeLessThan(r.sim);
    expect(r.sim).toBeLessThan(r.lab);
    expect(r.h, 'page height at 390 px: was 13,062 in Arabic before the rebuild').toBeLessThan(6600);
    expect(r.gl).toBe(1);
    expect(r.canvases).toBe(1);
    await expect(page.locator('#lens-lab-host .llab')).toHaveAttribute('data-sim', 'none');
    await expect(page.locator('#lens-lab-host [data-lens-lab-sim]')).toHaveCount(0);
    // the long compare block folds; opening it gives the whole comparison
    const fold = page.locator('#lens-lab-host details[data-fold="compare"]');
    await expect(fold).not.toHaveAttribute('open', '');
    await fold.locator('> summary').tap();
    await expect(page.locator('#lens-lab-host .llab-diff')).toBeVisible();
    await expect(page.locator('#lens-lab-host .llab-side .llab-card').first()).toBeVisible();
    const c = CONTENT.ar;
    await page.getByRole('group', { name: c.pickA }).getByText(c.lenses.edof.short, { exact: true }).tap();
    await expect(page.locator('#lens-lab-host .llab-side .llab-card[data-lens="edof"]')).toBeVisible();
  });

  test('the limits link in the Lens Lab opens its folded section', async ({ page }) => {
    await open(page, 'en');
    await page.locator('#lens-lab-host').scrollIntoViewIfNeeded();
    await page.locator('#lens-lab-host .llab').waitFor({ timeout: 30_000 });
    await page.locator('#lens-lab-host .llab-head .llab-link').scrollIntoViewIfNeeded();
    await page.locator('#lens-lab-host .llab-head .llab-link').tap();
    await expect(page.locator('#lens-lab-host .llab-limits')).toBeFocused();
    await expect(page.locator('#lens-lab-host .llab-limits li').first()).toBeVisible();
  });
});

const PORTRAIT = [[320, 640], [360, 800], [375, 812], [390, 844], [430, 932]];
const LANDSCAPE = [[844, 390], [667, 375]];
for (const [w, h] of [...PORTRAIT, ...LANDSCAPE]) {
  for (const lang of ['ar', 'en']) {
    for (const theme of ['light', 'dark']) {
      test.describe(`${w}x${h} ${lang} ${theme}`, () => {
        test.use(phone(w, h));
        test('picture and essential controls fit between the header and the booking bar', async ({ page }) => {
          await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
          await open(page, lang);
          await expect(page.locator(`${H} .vsim`)).toHaveAttribute('data-theme', theme);
          const z = await zone(page);
          expect(z.sw, 'no sideways scroll').toBeLessThanOrEqual(w);
          expectInZone(z, 'rest');
          expect(z.disclaimer.top, 'notice under the header').toBeGreaterThanOrEqual(z.headerH - 1);
          expect(z.controls.bottom, 'controls above the booking bar').toBeLessThanOrEqual(z.barTop + 1);
          expect(z.presets.bottom, 'presets above the booking bar').toBeLessThanOrEqual(z.barTop + 1);
          expect(z.sticky, 'nothing to stick for when everything fits').toBe(w > h ? z.sticky : false);
          expect(z.viewport.h, 'a picture worth looking at').toBeGreaterThanOrEqual(150);
          if (w > h) expect(z.controls.left >= z.viewport.right - 1 || z.controls.right <= z.viewport.left + 1, 'side by side').toBe(true);
          else expect(Math.abs(z.presets.top - z.viewport.bottom), 'presets attached under the picture').toBeLessThanOrEqual(1);
          expect(await small(page, TARGETS), '44 px targets').toEqual([]);
          const before = await picture(page);
          await lbl(page, 'preset', 'near').tap();
          await lbl(page, 'lighting', 'night').tap();
          const after = await picture(page);
          expect(samePicture(before, after)).toBe(false);
          expect(Math.abs((await zone(page)).y - z.y), 'no page jump').toBeLessThanOrEqual(1);
        });
      });
    }
  }
}

test.describe('150% text', () => {
  for (const [w, h] of [[320, 640], [390, 844], [844, 390]]) {
    test.describe(`${w}x${h}`, () => {
      test.use(phone(w, h));
      test('still usable: nothing overflows, targets hold, the picture stays with the controls', async ({ page }) => {
        await page.addInitScript(() => { document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = 'html{font-size:150%}'; document.head.appendChild(s); }); });
        await open(page, 'en');
        const z = await zone(page);
        expect(z.sw).toBeLessThanOrEqual(w);
        expect(z.viewport.h).toBeGreaterThanOrEqual(120);
        expect(z.stage.h / z.vh, 'the picture never takes most of the screen').toBeLessThanOrEqual(w > h ? 0.75 : 0.6);
        expect(await small(page, TARGETS)).toEqual([]);
        // every essential control can be brought on screen and used without losing the picture
        for (const [g, v] of [['preset', 'near'], ['lensA', 'edof'], ['lighting', 'night']]) {
          const l = lbl(page, g, v);
          await l.scrollIntoViewIfNeeded();
          await l.tap();
          await expect(radio(page, g, v)).toBeChecked();
          const s = await zone(page);
          expect(s.barTop, 'canvas not hidden behind the booking bar').toBeGreaterThanOrEqual(s.canvas.top + 40);
          expect(s.canvas.bottom, 'canvas still on screen').toBeGreaterThan(40);
        }
      });
    });
  }
});

test.describe('focus and targets', () => {
  test('keyboard order follows the screen and focus is visible', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await open(page, 'en');
    await page.locator(`${H} .vsim-expand`).focus();
    const seen = [];
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      seen.push(await page.evaluate(() => { const a = document.activeElement; return a.dataset.group || a.className; }));
      const shown = await page.evaluate(() => { const a = document.activeElement; const el = a.matches('.vsim-radio') ? a.nextElementSibling : a; const c = getComputedStyle(el); return c.outlineStyle !== 'none' && parseFloat(c.outlineWidth) >= 2; });
      expect(shown, `focus visible at step ${i}`).toBe(true);
    }
    expect(seen.slice(0, 3)).toEqual(['preset', 'lensA', 'lighting']);
    expect(seen[3]).toContain('vsim-more');
    expect(seen[4]).toContain('vsim-reset');
    await ctx.close();
  });

  test.describe('targets with More settings open', () => {
    test.use(phone(320, 640));
    test('every control is at least 44 px', async ({ page }) => {
      await open(page, 'ar');
      await more(page).tap();
      expect(await small(page, TARGETS)).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    });
  });

  test.describe('reduced motion', () => {
    test.use({ ...phone(390, 844), reducedMotion: 'reduce' });
    test('no transitions in the workbench', async ({ page }) => {
      await open(page, 'en');
      await more(page).tap();
      const d = await page.locator(`${H} .vsim-stage`).evaluate((e) => getComputedStyle(e).transitionDuration);
      expect(d.split(',').every((x) => parseFloat(x) === 0)).toBe(true);
    });
  });
});

test.describe('failure and recovery', () => {
  test.use(phone(390, 844));

  test('the simulator chunk fails: message and retry', async ({ page }) => {
    const VS = /\/assets\/vision-sim[^/]*\.js/;
    await page.route(VS, (r) => r.abort('connectionfailed'));
    await page.goto(url('en'));
    await page.locator(H).scrollIntoViewIfNeeded();
    const err = page.locator(`${H} .vsim-load-error`);
    await expect(err).toBeVisible({ timeout: 30_000 });
    await page.unroute(VS);
    await err.locator('button').tap();
    await page.waitForFunction((host) => document.querySelector(`${host} canvas`), H, { timeout: 30_000 });
    await expect(err).toHaveCount(0);
  });

  test('the picture code fails: the static comparison offers a retry, and the retry works', async ({ page }) => {
    const P = /\/assets\/(pipeline|scenes)[^/]*\.js/;
    await page.route(P, (r) => r.abort('connectionfailed'));
    await page.goto(url('en'));
    await page.locator(H).scrollIntoViewIfNeeded();
    const again = page.locator(`${H} [data-vsim-reload]`);
    await expect(again).toBeVisible({ timeout: 30_000 });
    await expect(page.locator(`${H} .vsim-disclaimer`)).toBeVisible();
    await page.unroute(P);
    await again.tap();
    await page.waitForFunction((host) => document.querySelector(`${host} canvas`), H, { timeout: 30_000 });
    await expect(page.locator(`${H} .vsim-loading`)).toBeHidden();
    await expect(page.locator(`${H} .vsim`)).not.toHaveClass(/vsim--fallback/);
  });

  test('slow picture code shows a clear loading state', async ({ page }) => {
    let release; const gate = new Promise((r) => { release = r; });
    const P = /\/assets\/(pipeline|scenes)[^/]*\.js/;
    await page.route(P, async (r) => { await gate; await r.continue(); });
    await page.goto(url('en'));
    await page.locator(H).scrollIntoViewIfNeeded();
    await expect(page.locator(`${H} .vsim-loading`)).toBeVisible({ timeout: 30_000 });
    await expect(page.locator(`${H} .vsim-loading`)).toHaveText(STRINGS.en.loading);
    await lbl(page, 'lensA', 'edof').tap(); // controls already answer
    await expect(radio(page, 'lensA', 'edof')).toBeChecked();
    release();
    await expect(page.locator(`${H} .vsim-loading`)).toBeHidden({ timeout: 30_000 });
    await expect(radio(page, 'lensA', 'edof')).toBeChecked();
  });
});

test.describe('desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  test('two columns, same markup, the picture stays beside the controls', async ({ page }) => {
    await open(page, 'en');
    const z = await zone(page);
    expect(z.controls.left).toBeGreaterThanOrEqual(z.viewport.right - 1);
    expect(z.controls.top).toBeLessThan(z.viewport.bottom);
    expect(z.viewport.bottom).toBeLessThanOrEqual(z.vh + 1);
    const pos = await page.locator(`${H} .vsim-bench-view`).evaluate((e) => getComputedStyle(e).position);
    expect(pos).toBe('sticky');
    await expect(page.locator(`${H} .vsim-adv`)).toBeHidden();
    // desktop keeps the embedded comparison picture in the Lens Lab
    await page.locator('#lens-lab-host [data-lens-lab-sim]').scrollIntoViewIfNeeded();
    await expect(page.locator('#lens-lab-host .llab canvas')).toHaveCount(1, { timeout: 30_000 });
  });
});
