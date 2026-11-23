// Lens Lab — distance experience (final stabilization).
// Near / Intermediate / Far bring a CLOSER VIEW of the object at that distance. It is framing only: the optics model
// draws every distance at once and a fixed lens implant cannot refocus, so the model values must not change when the
// distance is chosen. These tests hold both halves: the picture visibly moves, and the optics stay exactly the same.
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { STRINGS } from '../src/vision-sim/i18n.js';
import { CONTENT } from '../src/lens-lab/content.js';

const HARNESS = 'vision-sim-preview.html';
const H = '#simulator-host';
const EVIDENCE = 'docs/implementation/final-stabilization-phase-2-3-readiness/evidence/lens-lab';
const phone = (width, height) => ({ viewport: { width, height }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });

function watchConsole(page) {
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_FAILED|Failed to load resource/.test(m.text())) errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  return errors;
}
let errors;
test.beforeEach(({ page }) => { errors = watchConsole(page); });
test.afterEach(() => { expect(errors, 'console errors').toEqual([]); });

// ---------- harness: model and pixels ----------
async function openHarness(page, query = 'lang=en') {
  await page.goto(`${HARNESS}?${query}`);
  await page.waitForFunction(() => window.__vsim && window.__vsim.getState().state === 'ready', null, { timeout: 30_000 });
}
const S = (page) => page.evaluate(() => window.__vsim.getState());
const preset = (page, name) => page.getByRole('group', { name: 'Viewing distance' }).getByText(name, { exact: true }).click();
/** The frame around the object being looked at, as fractions of the viewer (origin top-left). */
const targetBox = (page) => page.evaluate(() => {
  const t = document.querySelector('.vsim-target');
  const f = (k) => parseFloat(t.style[k]) / 100;
  return { left: f('left'), top: f('top'), width: f('width'), height: f('height') };
});
/** Pixel statistics inside the frame (10 % inset), in drawing-buffer fractions (origin bottom-left). */
const sampleTarget = async (page) => {
  const b = await targetBox(page);
  const inset = 0.15;
  const r = { x: b.left + b.width * inset, y: 1 - (b.top + b.height * (1 - inset)), w: b.width * (1 - 2 * inset), h: b.height * (1 - 2 * inset) };
  return page.evaluate((reg) => window.__visionSim.sample(reg), r);
};

test.describe('distance presets: the picture moves, the optics do not', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('opens on the whole scene; a distance brings a closer view; Whole scene and Reset go back', async ({ page }) => {
    await openHarness(page);
    let s = await S(page);
    expect(s.closeUp).toBe(false);
    expect(s.frame).toEqual({ zoom: 1, x: 0, y: 0 });
    await expect(page.locator('.vsim-whole')).toBeHidden();

    await preset(page, 'Near');
    s = await S(page);
    expect(s.closeUp).toBe(true);
    expect(s.frame.zoom).toBeGreaterThan(1.15);
    await expect(page.locator('.vsim-whole')).toBeVisible();
    await expect(page.locator('.vsim-whole')).toHaveText('Whole scene');
    await expect(page.locator('.vsim-close-note')).toContainText('The lens model and its sharpness did not change');

    await page.locator('.vsim-whole').click();
    s = await S(page);
    expect(s.closeUp).toBe(false);
    expect(s.frame).toEqual({ zoom: 1, x: 0, y: 0 });
    expect(s.distanceM, 'the chosen distance is kept').toBeCloseTo(0.4, 6);
    await expect(page.locator('.vsim-whole')).toBeHidden();
    await expect(page.locator('.vsim-close-note')).toBeHidden();

    // tapping the distance that is already chosen brings the closer view again
    await preset(page, 'Near');
    expect((await S(page)).closeUp).toBe(true);
    await page.locator('.vsim-reset').click();
    s = await S(page);
    expect(s.closeUp).toBe(false);
    expect(s.frame.zoom).toBe(1);
  });

  test('choosing a distance changes no model value for any lens or lighting', async ({ page }) => {
    await openHarness(page);
    const optics = async () => {
      const s = await S(page);
      const layers = Object.fromEntries(Object.entries(s.optics.A.layers).map(([k, l]) => [k, { defocusD: l.defocusD, blurArcmin: l.blurArcmin, sharpness: l.sharpness }]));
      return JSON.stringify({ layers, halo: s.optics.A.haloIndex, contrast: s.optics.A.contrastIndex, pupil: s.pupilMm });
    };
    for (const lens of ['monofocal', 'edof', 'trifocal']) {
      for (const light of ['day', 'night']) {
        await page.evaluate(([l, li]) => { window.__vsim.reset(); window.__vsim.setLens(l); window.__vsim.setLighting(li); }, [lens, light]);
        const whole = await optics();
        for (const name of ['Near', 'Intermediate', 'Far']) {
          await preset(page, name);
          const s = await S(page);
          expect(s.closeUp).toBe(true);
          expect(await optics(), `${lens} ${light} ${name}: same model values as the whole scene`).toBe(whole);
        }
      }
    }
  });

  test('each closer view frames its own object, larger than in the whole scene and inside the viewer', async ({ page }) => {
    await openHarness(page);
    const whole = {};
    for (const [name, m] of [['Near', 0.4], ['Intermediate', 0.66], ['Far', 6]]) {
      await page.evaluate((d) => { window.__vsim.reset(); window.__vsim.setDistance(d); }, m); // API call: no closer view
      expect((await S(page)).closeUp).toBe(false);
      whole[name] = await targetBox(page);
    }
    const frames = [];
    for (const name of ['Near', 'Intermediate', 'Far']) {
      await preset(page, name);
      const s = await S(page);
      const b = await targetBox(page);
      frames.push(JSON.stringify(s.frame));
      expect(b.width * b.height, `${name}: the object is larger`).toBeGreaterThan(whole[name].width * whole[name].height * 1.2);
      expect(b.left).toBeGreaterThanOrEqual(0);
      expect(b.top).toBeGreaterThanOrEqual(0);
      expect(b.left + b.width).toBeLessThanOrEqual(1.0001);
      expect(b.top + b.height).toBeLessThanOrEqual(1.0001);
      expect(Math.max(b.width, b.height), `${name}: the object fills most of the viewer`).toBeGreaterThan(0.5);
    }
    expect(new Set(frames).size, 'three different views').toBe(3);
  });

  test('the closer view is the same picture seen closer: blur scales with the zoom, brightness does not change', async ({ page }) => {
    await openHarness(page);
    // monofocal at 40 cm: the phone is strongly blurred (2.5 D of defocus). If the blur were not scaled with the
    // zoom, the closer view would look sharper than the whole scene — exactly the false impression to avoid.
    for (const [lens, name, m] of [['monofocal', 'Near', 0.4], ['trifocal', 'Near', 0.4], ['monofocal', 'Far', 6]]) {
      await page.evaluate(([l, d]) => { window.__vsim.reset(); window.__vsim.setLens(l); window.__vsim.setDistance(d); }, [lens, m]);
      const whole = await sampleTarget(page);
      await preset(page, name);
      const zoom = (await S(page)).frame.zoom;
      const close = await sampleTarget(page);
      expect(Math.abs(close.mean - whole.mean), `${lens} ${name}: same brightness (of 255)`).toBeLessThan(8);
      // the two frames are padded in their own units, so the sampled areas differ by a few percent at the edges
      expect(close.std / whole.std, `${lens} ${name}: same contrast`).toBeGreaterThan(0.7);
      expect(close.std / whole.std, `${lens} ${name}: same contrast`).toBeLessThan(1.4);
      // per-pixel edge energy falls with the magnification when the same picture is drawn larger
      const ratio = (close.edgeEnergy * zoom) / whole.edgeEnergy;
      expect(ratio, `${lens} ${name}: edges scale with zoom ${zoom} (got ${ratio.toFixed(2)})`).toBeGreaterThan(0.6);
      expect(ratio, `${lens} ${name}: edges scale with zoom ${zoom} (got ${ratio.toFixed(2)})`).toBeLessThan(1.6);
    }
    // and the lens difference survives the closer view: the trifocal phone stays sharper than the monofocal phone
    await page.evaluate(() => { window.__vsim.reset(); });
    await preset(page, 'Near');
    const mono = await sampleTarget(page);
    await page.evaluate(() => window.__vsim.setLens('trifocal'));
    const tri = await sampleTarget(page);
    expect(tri.edgeEnergy).toBeGreaterThan(mono.edgeEnergy * 1.3);
  });

  test('the caption says what is being looked at and how the chosen lens is described there', async ({ page }) => {
    await openHarness(page);
    const L = CONTENT.en.lenses;
    await expect(page.locator('.vsim-caption-main')).toHaveText('6 m+ · road sign · Day');
    await expect(page.locator('.vsim-caption-sub')).toHaveText(`Monofocal: ${L.monofocal.levels.distance}`);
    await preset(page, 'Near');
    await expect(page.locator('.vsim-caption-main')).toHaveText('40 cm · phone · Day');
    await expect(page.locator('.vsim-caption-sub')).toHaveText(`Monofocal: ${L.monofocal.levels.near}`);
    await page.evaluate(() => window.__vsim.setLens('trifocal'));
    await expect(page.locator('.vsim-caption-sub')).toHaveText(`Trifocal: ${L.trifocal.levels.near}`);
    await page.evaluate(() => window.__vsim.setCompare(true, 'edof'));
    await expect(page.locator('.vsim-caption-sub'), 'no single-lens line during a comparison').toHaveCount(0);
    await page.evaluate(() => { window.__vsim.setCompare(false); window.__vsim.setLens('cataract'); });
    await expect(page.locator('.vsim-caption-sub'), 'no lens rating for the cataract view').toHaveCount(0);
  });

  test('the comparison divider still splits the picture where it is drawn in a closer view', async ({ page }) => {
    await openHarness(page);
    await page.evaluate(() => { window.__vsim.setCompare(true, 'trifocal'); });
    await preset(page, 'Near');
    // the phone itself, with the divider at either end: all lens A (monofocal), then all lens B (trifocal)
    const all = async (split) => { await page.evaluate((x) => window.__vsim.setSplit(x), split); return sampleTarget(page); };
    const lensA = await all(1), lensB = await all(0);
    expect(lensB.edgeEnergy, 'B (trifocal) is sharper at near than A (monofocal)').toBeGreaterThan(lensA.edgeEnergy * 1.15);
    await expect(page.locator('.vsim-whole')).toBeVisible();
    await expect(page.locator('.vsim-tag-b')).toBeVisible();
    const tag = await page.locator('.vsim-tag-b').boundingBox(), btn = await page.locator('.vsim-whole').boundingBox();
    expect(btn.y, 'the button sits clear of the B tag').toBeGreaterThanOrEqual(tag.y + tag.height);
  });

  test('the review harness never uses the closer view', async ({ page }) => {
    await page.goto(`${HARNESS}?lang=en&review=1`);
    await page.waitForFunction(() => window.__vsim && window.__vsim.getState().state === 'ready', null, { timeout: 30_000 });
    await preset(page, 'Near');
    const s = await S(page);
    expect(s.frame, 'review pictures are always the whole scene').toEqual({ zoom: 1, x: 0, y: 0 });
  });

  test('reduced motion: the closer view arrives without animation', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await openHarness(page);
    await preset(page, 'Near');
    const anim = await page.evaluate(() => getComputedStyle(document.querySelector('.vsim-canvas-host')).animationName);
    expect(anim).toBe('none');
    expect((await S(page)).closeUp).toBe(true);
    await ctx.close();
  });
});

// ---------- More settings: grouped ----------
test.describe('More settings is grouped', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('two open groups, two folded ones; the axis appears only with astigmatism', async ({ page }) => {
    await openHarness(page);
    await page.locator('.vsim-more').click();
    await expect(page.getByRole('heading', { name: 'Compare lenses' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Situation and distance' })).toBeVisible();
    const eye = page.locator('details[data-ref="eyeBox"]'), model = page.locator('details[data-ref="modelBox"]');
    await expect(eye).not.toHaveAttribute('open', '');
    await expect(model).not.toHaveAttribute('open', '');
    await expect(page.getByRole('group', { name: 'Corneal astigmatism' })).toBeHidden();
    await eye.locator('summary').click();
    await expect(page.getByRole('group', { name: 'Corneal astigmatism' })).toBeVisible();
    await expect(page.getByRole('group', { name: 'Astigmatism axis' }), 'no axis without astigmatism').toBeHidden();
    await page.getByRole('group', { name: 'Corneal astigmatism' }).locator('label').nth(1).click();
    await expect(page.getByRole('group', { name: 'Astigmatism axis' })).toBeVisible();
    await expect(eye.locator('.vsim-group-now')).toHaveText('changed');
    expect((await S(page)).refraction.cylD).toBe(-1);
    await model.locator('summary').click();
    await expect(page.locator('.vsim-model')).toContainText('Assumed pupil');
    // Reset clears the eye settings and the marker
    await page.locator('.vsim-reset').click();
    await expect(eye.locator('.vsim-group-now')).toBeHidden();
    expect(Math.abs((await S(page)).refraction.cylD)).toBe(0);
  });

  test('Arabic: group names and the Whole scene button are translated', async ({ page }) => {
    await openHarness(page, 'lang=ar');
    await page.locator('.vsim-more').click();
    await expect(page.getByRole('heading', { name: STRINGS.ar.groupCompare })).toBeVisible();
    await expect(page.getByRole('heading', { name: STRINGS.ar.groupWhere })).toBeVisible();
    await page.getByRole('group', { name: STRINGS.ar.distance }).getByText(STRINGS.ar.presets.near, { exact: true }).click();
    await expect(page.locator('.vsim-whole')).toHaveText(STRINGS.ar.wholeScene);
  });
});

// ---------- public page, phones ----------
async function openPublic(page, lang = 'en') {
  await page.goto(`${lang === 'en' ? '/en' : ''}/lens-lab/`);
  await page.locator('main h1').waitFor();
  await page.locator(H).scrollIntoViewIfNeeded();
  await page.waitForFunction((host) => document.querySelector(`${host} canvas`) && !document.querySelector(`${host} .vsim-loading:not([hidden])`), H, { timeout: 45_000 });
  await page.waitForFunction(() => { const l = document.querySelector('.vsim-launch'); return l.classList.contains('visible') && !l.getAnimations().length; }, null, { timeout: 10_000 });
  await page.evaluate((host) => {
    const b = document.querySelector(`${host} .vsim-bench`);
    window.scrollTo(0, b.getBoundingClientRect().top + window.scrollY - document.getElementById('site-header').offsetHeight);
  }, H);
  await page.waitForTimeout(450);
}
/** A real touch at the centre of a control: no scrolling into view, so a page movement is the page's own doing. */
async function touch(page, selector) {
  const el = page.locator(selector);
  const b = await el.boundingBox();
  expect(b, `${selector} is on the page`).not.toBeNull();
  const x = b.x + b.width / 2, y = b.y + b.height / 2;
  const vp = page.viewportSize();
  const top = await page.evaluate(([px, py]) => { const e = document.elementFromPoint(px, py); return e ? (e.closest('label,button,summary,a') || e).outerHTML.slice(0, 90) : null; }, [x, y]);
  const inView = y > 0 && y < vp.height && x > 0 && x < vp.width;
  if (inView) await page.touchscreen.tap(x, y); else await el.tap();
  return { selector, x: Math.round(x), y: Math.round(y), inView, receivedBy: top };
}
const viewState = (page) => page.evaluate((host) => {
  const q = (s) => document.querySelector(`${host} ${s}`);
  const r = (e) => { const b = e.getBoundingClientRect(); return { top: Math.round(b.top), bottom: Math.round(b.bottom), left: Math.round(b.left), right: Math.round(b.right) }; };
  const bar = document.querySelector('.booking-bar');
  const barTop = bar && getComputedStyle(bar).display !== 'none' ? bar.getBoundingClientRect().top : innerHeight;
  const header = document.getElementById('site-header').getBoundingClientRect().bottom;
  const vis = (e) => { const b = e.getBoundingClientRect(); return b.height > 0 && b.top >= header - 1 && b.bottom <= barTop + 1; };
  return {
    y: Math.round(scrollY), zoom: Number(q('.vsim').dataset.zoom || 1), closeUp: q('.vsim').dataset.closeUp === 'true',
    caption: q('.vsim-caption-main').textContent, level: (q('.vsim-caption-sub') || {}).textContent || '',
    canvases: document.querySelectorAll('canvas').length,
    viewerVisible: vis(q('.vsim-viewport')), presetsVisible: vis(q('.vsim-field-presets')), lensVisible: vis(q('.vsim-field-lens')), lightVisible: vis(q('.vsim-field-light')), actionsVisible: vis(q('.vsim-bench-actions')),
    whole: q('.vsim-whole').hidden ? null : r(q('.vsim-whole')), target: q('.vsim-target').hidden ? null : r(q('.vsim-target')), expand: r(q('.vsim-expand')), captionBox: r(q('.vsim-caption')), viewport: r(q('.vsim-viewport')),
    sw: document.documentElement.scrollWidth - innerWidth,
  };
}, H);
const overlap = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));

const SIZES = [[320, 640], [360, 800], [375, 812], [390, 844], [430, 932], [667, 375], [844, 390]];
for (const [w, h] of SIZES) {
  test.describe(`patient flow at ${w}×${h}`, () => {
    test.use(phone(w, h));

    test('the 15-step lens comparison needs no scrolling between the picture and the controls', async ({ page }) => {
      test.setTimeout(120_000);
      await openPublic(page, 'en');
      const log = [];
      const landscape = w > h;
      const y0 = (await viewState(page)).y;
      const step = async (n, what, selector, check) => {
        const t = selector ? await touch(page, selector) : null;
        await page.waitForTimeout(320);
        const v = await viewState(page);
        log.push({ step: n, action: what, touch: t, scrollY: v.y, moved: v.y - y0, zoom: v.zoom, closeUp: v.closeUp, caption: v.caption, lensLine: v.level, viewerVisible: v.viewerVisible, canvases: v.canvases });
        expect(Math.abs(v.y - y0), `step ${n} (${what}): the page did not move`).toBeLessThanOrEqual(1);
        expect(v.viewerVisible, `step ${n}: the picture is on screen`).toBe(true);
        expect(v.presetsVisible && v.lensVisible && v.lightVisible, `step ${n}: distance, lens and lighting are on screen`).toBe(true);
        expect(v.canvases, `step ${n}: one WebGL canvas`).toBe(1);
        expect(v.sw, `step ${n}: no sideways scroll`).toBeLessThanOrEqual(0);
        if (t) expect(t.inView, `step ${n}: the control was already on screen`).toBe(true);
        // an object that fills the viewer leaves no free corner: the button may take a corner of it, never more than 8 %
        if (v.whole && v.target) expect(overlap(v.whole, v.target) / ((v.target.right - v.target.left) * (v.target.bottom - v.target.top)), `step ${n}: Whole scene does not cover the object`).toBeLessThan(0.08);
        if (v.whole) expect(overlap(v.whole, v.captionBox), `step ${n}: Whole scene clear of the caption`).toBe(0);
        if (v.whole) expect(overlap(v.whole, v.expand), `step ${n}: Whole scene clear of Enlarge`).toBe(0);
        if (check) await check(v);
        return v;
      };
      const lbl = (g, v) => `${H} label[for$="-${g}-${v}"]`;
      await step(1, 'open Lens Lab', null, (v) => { expect(v.closeUp).toBe(false); expect(v.caption).toContain('road sign'); });
      await step(2, 'select Monofocal', lbl('lensA', 'monofocal'), (v) => expect(v.level).toContain('Monofocal'));
      const whole = await step(3, 'view the current scene', null);
      const near = await step(4, 'select Near', lbl('preset', 'near'), (v) => { expect(v.closeUp).toBe(true); expect(v.caption).toBe('40 cm · phone · Day'); expect(v.level).toBe(`Monofocal: ${CONTENT.en.lenses.monofocal.levels.near}`); });
      expect(near.zoom, 'near: closer than the whole scene').toBeGreaterThan(whole.zoom);
      await step(5, 'understand what changed (Near)', null, (v) => expect(v.whole, 'a way back is shown').not.toBeNull());
      await step(6, 'select Intermediate', lbl('preset', 'intermediate'), (v) => { expect(v.caption).toBe('66 cm · laptop · Day'); expect(v.level).toBe(`Monofocal: ${CONTENT.en.lenses.monofocal.levels.intermediate}`); });
      await step(7, 'understand what changed (Intermediate)', null, (v) => expect(v.closeUp).toBe(true));
      await step(8, 'select Far', lbl('preset', 'distance'), (v) => { expect(v.caption).toBe('6 m+ · road sign · Day'); expect(v.level).toBe(`Monofocal: ${CONTENT.en.lenses.monofocal.levels.distance}`); });
      await step(9, 'understand what changed (Far)', null, (v) => expect(v.closeUp).toBe(true));
      await step(10, 'select EDOF', lbl('lensA', 'edof'), (v) => expect(v.level).toBe(`EDOF: ${CONTENT.en.lenses.edof.levels.distance}`));
      await step(11, 'compare the displayed effect (Near with EDOF)', lbl('preset', 'near'), (v) => expect(v.level).toBe(`EDOF: ${CONTENT.en.lenses.edof.levels.near}`));
      await step(12, 'select Trifocal', lbl('lensA', 'trifocal'), (v) => expect(v.level).toBe(`Trifocal: ${CONTENT.en.lenses.trifocal.levels.near}`));
      await step(13, 'switch to night', lbl('lighting', 'night'), (v) => expect(v.caption).toBe('40 cm · phone · Night'));
      await step(13.5, 'switch back to day', lbl('lighting', 'day'), (v) => expect(v.caption).toBe('40 cm · phone · Day'));
      await step(14, 'Reset', `${H} .vsim-reset`, (v) => { expect(v.closeUp).toBe(false); expect(v.zoom).toBe(1); expect(v.caption).toBe('6 m+ · road sign · Day'); expect(v.level).toContain('Monofocal'); });
      // 15. return to the website: the header link works and the simulator lets go of its WebGL context
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.locator('#site-header a').first().click();
      await expect(page).toHaveURL(/\/en\/$/);
      await expect(page.locator('canvas')).toHaveCount(0);
      log.push({ step: 15, action: 'return to the website (home)', url: page.url(), canvases: 0 });
      if ((w === 390 && h === 844) || (w === 320 && h === 640) || landscape) {
        fs.mkdirSync(EVIDENCE, { recursive: true });
        fs.writeFileSync(path.join(EVIDENCE, `action-log-${w}x${h}.json`), JSON.stringify({ viewport: `${w}x${h}`, browser: 'Chromium (Playwright emulation, touch)', lang: 'en', steps: log }, null, 1));
      }
    });
  });
}

test.describe('closer view on a phone, Arabic', () => {
  test.use(phone(390, 844));
  test('Arabic: Near then Whole scene, the page stays still and the picture comes back', async ({ page }) => {
    await openPublic(page, 'ar');
    const y0 = (await viewState(page)).y;
    await touch(page, `${H} label[for$="-preset-near"]`);
    await page.waitForTimeout(320);
    let v = await viewState(page);
    expect(v.closeUp).toBe(true);
    expect(v.level).toContain(CONTENT.ar.lenses.monofocal.levels.near);
    await expect(page.locator(`${H} .vsim-whole`)).toHaveText(STRINGS.ar.wholeScene);
    const b = await page.locator(`${H} .vsim-whole`).boundingBox();
    expect(b.height, 'touch target').toBeGreaterThanOrEqual(44);
    await touch(page, `${H} .vsim-whole`);
    await page.waitForTimeout(320);
    v = await viewState(page);
    expect(v.closeUp).toBe(false);
    expect(v.zoom).toBe(1);
    expect(Math.abs(v.y - y0)).toBeLessThanOrEqual(1);
  });
});

// ---------- very short landscape screens (section 8.2) ----------
const textScale = (page, pct) => page.addInitScript((t) => {
  const apply = () => { if (!document.documentElement) return false; document.documentElement.style.fontSize = `${t}%`; return true; };
  if (!apply()) new MutationObserver((_, o) => { if (apply()) o.disconnect(); }).observe(document, { childList: true });
}, pct);
/** Brings every essential option (each distance, lens, lighting button, More settings, Reset) between the bars,
 *  scrolling only if needed, and hit-tests its centre. At 150 % text on a 320 px-high screen a whole group can be
 *  taller than the space between the bars, so the unit that must fit is the single button, not the group. */
const reachAll = (page) => page.evaluate(async (host) => {
  const r = (e) => e.getBoundingClientRect();
  const header = () => r(document.getElementById('site-header')).bottom;
  const barEl = document.querySelector('.booking-bar');
  const bar = () => (barEl && getComputedStyle(barEl).display !== 'none' ? r(barEl).top : innerHeight);
  const out = [];
  const targets = [...document.querySelectorAll(`${host} .vsim-field-presets label, ${host} .vsim-bench-controls label, ${host} .vsim-bench-actions button`)];
  for (const t of targets) {
    if (r(t).bottom > bar() + 1) { scrollBy(0, r(t).bottom - bar() + 4); await new Promise((res) => setTimeout(res, 200)); }
    if (r(t).top < header() - 1) { scrollBy(0, r(t).top - header() - 4); await new Promise((res) => setTimeout(res, 200)); }
    const tb = r(t);
    const hit = document.elementFromPoint(tb.left + tb.width / 2, tb.top + tb.height / 2);
    out.push({ name: t.textContent.trim().slice(0, 24), between: tb.top >= header() - 1 && tb.bottom <= bar() + 1, hit: !!hit && (t === hit || t.contains(hit)), receivedBy: hit ? (hit.className || hit.tagName).toString().slice(0, 40) : null });
  }
  return out;
}, H);

for (const [w, h, name] of [[568, 320, 'iPhone SE sideways'], [667, 331, 'iPhone 8 sideways with browser bars'], [844, 340, 'iPhone 14 sideways with browser bars']]) {
  test.describe(`short landscape ${w}×${h} (${name})`, () => {
    test.use(phone(w, h));

    test('normal text: picture and controls fit together, no word is broken, overlays leave the picture visible', async ({ page }) => {
      await openPublic(page, 'en');
      const m = await page.evaluate((host) => {
        const q = (s) => document.querySelector(`${host} ${s}`);
        const r = (e) => e.getBoundingClientRect();
        const header = r(document.getElementById('site-header')).bottom, bar = r(document.querySelector('.booking-bar')).top;
        const parts = ['.vsim-viewport', '.vsim-field-presets', '.vsim-field-lens', '.vsim-field-light', '.vsim-bench-actions'].map(q);
        // a label broken inside a word is taller than its words need: compare with the same text set not to break words
        const broken = [...document.querySelectorAll(`${host} .vsim-bench .vsim-seg-main`)].filter((e) => e.getClientRects().length).filter((e) => {
          const lines = Math.round(r(e).height / parseFloat(getComputedStyle(e).lineHeight));
          return lines > e.textContent.trim().split(/\s+/).length;
        }).map((e) => e.textContent);
        const v = r(q('.vsim-viewport')), cap = r(q('.vsim-caption'));
        return { fit: parts.every((e) => r(e).top >= header - 1 && r(e).bottom <= bar + 1), broken, viewerH: v.height, captionShare: (cap.width * cap.height) / (v.width * v.height), sw: document.documentElement.scrollWidth - innerWidth };
      }, H);
      expect(m.fit, 'picture, distance, lens, lighting and actions between the bars').toBe(true);
      expect(m.broken, 'no option label is broken inside a word').toEqual([]);
      expect(m.captionShare, 'the caption covers a small part of the picture').toBeLessThan(0.2);
      expect(m.sw).toBeLessThanOrEqual(0);
      const small = await page.evaluate((host) => [...document.querySelectorAll(`${host} .vsim-bench .vsim-seg-btn, ${host} .vsim-action, ${host} .vsim-expand`)].filter((e) => e.getClientRects().length).map((e) => e.getBoundingClientRect()).filter((b) => b.width < 44 || b.height < 44).length, H);
      expect(small, '44 px touch targets').toBe(0);
    });

    for (const pct of [125, 150]) {
      test(`${pct}% text: every essential control can be brought between the bars and tapped`, async ({ page }) => {
        await textScale(page, pct);
        await openPublic(page, 'en');
        const reach = await reachAll(page);
        expect(reach.length, 'three distances, three lenses, three lighting levels, More settings, Reset').toBe(11);
        for (const v of reach) {
          expect(v.between, `"${v.name}" can be brought between the header and the booking bar`).toBe(true);
          expect(v.hit, `"${v.name}": the touch reaches the control, not ${v.receivedBy}`).toBe(true);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
        await expect(page.locator(`${H} canvas`)).toHaveCount(1);
      });
    }
  });
}

// 360 x 800 Android phones held sideways in Chrome have 256 px of height (Phase 2, Android Emulator): with the 65 px header
// and the 69 px booking bar only 122 px remain, so the picture and every control cannot fit together (a limit of the
// approved layout, recorded in LANDSCAPE_TEST_RESULTS.md). What must hold: every control can be reached and tapped, and
// the first tap on a distance does not move the page (BUG-P2-08: it moved 11 px).
test.describe('short landscape 732×256 (360 × 800 Android phone sideways in Chrome)', () => {
  test.use(phone(732, 256));
  for (const pct of [100, 125, 150]) {
    test(`${pct}% text: every essential control can be brought between the bars and tapped`, async ({ page }) => {
      if (pct !== 100) await textScale(page, pct);
      await openPublic(page, 'en');
      const reach = await reachAll(page);
      expect(reach.length).toBe(11);
      for (const v of reach) {
        expect(v.between, `"${v.name}" can be brought between the header and the booking bar`).toBe(true);
        expect(v.hit, `"${v.name}": the touch reaches the control, not ${v.receivedBy}`).toBe(true);
      }
    });
  }
  test('brought into view by the browser itself (as keyboard focus does), no distance is left under the picture', async ({ page }) => {
    // BUG-P2-10: the picture stuck at the top covered the distance row here, leaving 24 of its 44 px. The radio is what
    // the browser scrolls into view (with its scroll margins). Known limit at this size (LANDSCAPE_TEST_RESULTS.md):
    // with 122 px between the bars, keyboard focus may leave the row partly behind the booking bar; a finger reaches it
    // (see the reach test above) and a tap does not move the page (below).
    await openPublic(page, 'en');
    expect(await page.locator(`${H} .vsim-bench`).getAttribute('data-sticky'), 'the picture does not stick at 122 px').toBeNull();
    for (const d of ['near', 'intermediate', 'distance']) {
      const underPicture = await page.locator(`${H} input[data-group="preset"][value="${d}"] + label`).evaluate((e, host) => {
        e.previousElementSibling.scrollIntoView({ block: 'nearest' });
        const b = e.getBoundingClientRect(), h = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
        return !!h && !!h.closest(`${host} .vsim-stage`);
      }, H);
      expect(underPicture, `${d}`).toBe(false);
    }
  });
  test('a tap on each distance does not move the page', async ({ page }) => {
    await openPublic(page, 'en');
    for (const d of ['near', 'intermediate', 'distance', 'near']) {
      const l = page.locator(`${H} input[data-group="preset"][value="${d}"] + label`);
      await l.evaluate((e) => e.scrollIntoView({ block: 'center' }));
      await page.waitForTimeout(300);
      const y0 = await page.evaluate(() => scrollY);
      await l.tap();
      await page.waitForTimeout(500);
      expect(Math.abs((await page.evaluate(() => scrollY)) - y0), `tap on ${d}`).toBeLessThanOrEqual(1);
    }
  });
});

// BUG-P2-07, found on the Android Emulator (Chrome 113, 863 × 304 landscape): in the closer view the icon-only "Whole scene"
// button was placed over the enlarge button (both in the lower right corner of a short picture), so two targets
// overlapped. Its corner is now chosen against the measured enlarge button, caption and picture edges.
test.describe('Closer view: "Whole scene" never overlaps another control', () => {
  for (const [w, h] of [[863, 304], [568, 320], [844, 340], [667, 331], [390, 844], [320, 568]]) {
    test(`${w}×${h}: no overlap with the enlarge button or the caption, inside the picture, at every distance`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      await page.goto('/en/lens-lab/#simulator');
      await page.waitForFunction(() => document.querySelectorAll('#simulator-host canvas').length === 1, null, { timeout: 30_000 });
      for (const d of ['near', 'intermediate', 'distance']) {
        await page.locator(`#simulator-host input[data-group="preset"][value="${d}"] + label`).click();
        await expect(page.locator('#simulator-host .vsim-whole')).toBeVisible();
        await expect.poll(() => page.evaluate(() => {
          const box = (s) => { const e = document.querySelector(`#simulator-host ${s}`); if (!e || e.hidden || !e.offsetParent) return null; const b = e.getBoundingClientRect(); return b.width ? b : null; };
          const a = box('.vsim-whole'), x = box('[data-ref="expand"]'), c = box('[data-ref="caption"]'), v = box('[data-ref="viewport"]');
          const ov = (p, q) => (p && q ? Math.max(0, Math.min(p.right, q.right) - Math.max(p.left, q.left)) * Math.max(0, Math.min(p.bottom, q.bottom) - Math.max(p.top, q.top)) : 0);
          const inside = a.left >= v.left - 1 && a.right <= v.right + 1 && a.top >= v.top - 1 && a.bottom <= v.bottom + 1;
          return `expand ${Math.round(ov(a, x))} caption ${Math.round(ov(a, c))} inside ${inside}`;
        }), { message: `${d}` }).toBe('expand 0 caption 0 inside true');
      }
      await ctx.close();
    });
  }
});