// Vision & Lens Lab (src/lens-lab) — runs against the isolated harness /lens-lab-preview.html, which mounts the
// lazy module with { debug: true } (exposes window.__llab, window.__lensLabCounters and, once the embedded
// simulator has loaded, window.__visionSimCounters).
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { CONTENT, LENS_ORDER, DIMENSIONS, LEVELS, SIM_LENS, SCENARIO_ORDER, SOURCES } from '../src/lens-lab/content.js';
import { SCENARIOS } from '../src/vision-sim/optics/params.js';

const PAGE = 'lens-lab-preview.html';
const LABEL = { en: CONTENT.en.label, ar: CONTENT.ar.label };
// integrity: no lens preference, no percentages / success rates, no promises
const PREFERENCE = /\bprefer(red|s)?\b(?![-\w])|favou?r(ed|s|ite)?\b|recommended lens|best (lens|choice|option)|superior|المفضل|يفضل|يفضّل|الأفضل لك|ننصح ب/i;
const NUMBERS_OF_SUCCESS = /\d\s?%|٪|success rate|نسبة نجاح|guarantee(d)? (result|outcome)|نضمن/i;

function watchConsole(page) {
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  return errors;
}
async function open(page, query = 'lang=en') {
  await page.goto(`${PAGE}?${query}`);
  await page.waitForFunction(() => document.body.dataset.ready === '1' && window.__llab, null, { timeout: 30_000 });
}
async function simReady(page) {
  await page.locator('[data-lens-lab-sim]').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => ['ready', 'failed'].includes(window.__llab.getState().sim.status), null, { timeout: 30_000 });
  return page.evaluate(() => window.__llab.getState());
}
const S = (page) => page.evaluate(() => window.__llab.getState());

let errors;
test.beforeEach(({ page }) => { errors = watchConsole(page); });
test.afterEach(() => { expect(errors, 'console errors').toEqual([]); });

test.describe('content (pure data)', () => {
  test('every lens has every row, advantages, limitations and questions in both languages', () => {
    for (const lang of ['ar', 'en']) {
      const c = CONTENT[lang];
      for (const l of LENS_ORDER) {
        const x = c.lenses[l];
        expect(x.name && x.short && x.what, `${lang}/${l}`).toBeTruthy();
        for (const d of DIMENSIONS) {
          expect(typeof x.levels[d], `${lang}/${l}/${d}`).toBe('string');
          expect(x.levels[d].length).toBeGreaterThan(3);
          expect([1, 2, 3]).toContain(LEVELS[l][d]);
        }
        expect(x.pros.length).toBeGreaterThanOrEqual(2);
        expect(x.cons.length).toBeGreaterThanOrEqual(2);
        expect(x.ask.length).toBeGreaterThanOrEqual(3);
        for (const q of x.ask) expect(q.trim().endsWith(lang === 'ar' ? '؟' : '?'), q).toBe(true);
      }
      for (const k of SCENARIO_ORDER) expect(c.scenarios[k].label && c.scenarios[k].detail).toBeTruthy();
      expect(c.limits.length).toBeGreaterThanOrEqual(4);
      const all = JSON.stringify(c);
      expect(all).not.toMatch(PREFERENCE);
      expect(all).not.toMatch(NUMBERS_OF_SUCCESS);
    }
    // Arabic and English carry the same structure
    expect(Object.keys(CONTENT.ar).sort()).toEqual(Object.keys(CONTENT.en).sort());
    expect(SOURCES.length).toBeGreaterThanOrEqual(6);
    for (const s of SOURCES) expect(s.url).toMatch(/^https:\/\//);
  });

  test('no lens is better or equal on every row (each one has a trade-off)', () => {
    for (const a of LENS_ORDER) {
      const dominatesAll = LENS_ORDER.filter((b) => b !== a).every((b) => DIMENSIONS.every((d) => LEVELS[a][d] >= LEVELS[b][d]));
      expect(dominatesAll, `${a} must not dominate every other lens`).toBe(false);
      expect(DIMENSIONS.some((d) => LEVELS[a][d] < 3), `${a} has at least one limited row`).toBe(true);
    }
  });

  test('scenarios map to real simulator scenarios and every lens to a simulator lens', () => {
    for (const k of SCENARIO_ORDER) expect(SCENARIOS[k]).toBeTruthy();
    for (const l of LENS_ORDER) expect(['monofocal', 'edof', 'multifocal', 'trifocal', 'toric']).toContain(SIM_LENS[l]);
  });
});

for (const lang of ['en', 'ar']) {
  test.describe(`comparison table — ${lang}`, () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test('table shows all five lenses, every row and the persistent label', async ({ page }) => {
      await open(page, `lang=${lang}&sim=off`);
      const c = CONTENT[lang];
      const root = page.locator('.llab');
      await expect(root).toHaveAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      await expect(root).toHaveAttribute('lang', lang);
      const table = page.getByRole('table', { name: c.tableCaption });
      await expect(table).toBeVisible();
      const heads = await table.locator('thead th[data-lens] .llab-th-name').allInnerTexts();
      expect(heads).toEqual(LENS_ORDER.map((l) => c.lenses[l].name));
      for (const d of DIMENSIONS) {
        const row = table.locator(`tr[data-row="${d}"]`);
        await expect(row.locator('th')).toContainText(c.dims[d].label);
        for (const l of LENS_ORDER) {
          const cell = row.locator(`td[data-lens="${l}"]`);
          await expect(cell).toContainText(c.lenses[l].levels[d]);
          await expect(cell.locator('.llab-lvl')).toHaveAttribute('data-level', String(LEVELS[l][d]));
        }
      }
      for (const key of ['pros', 'cons', 'ask']) {
        for (const l of LENS_ORDER) {
          for (const item of c.lenses[l][key]) await expect(table.locator(`tr[data-row="${key}"] td[data-lens="${l}"]`)).toContainText(item);
        }
      }
      await expect(page.locator('.llab-toric')).toContainText(c.toricNote);
      await expect(page.locator('.llab-head .llab-label')).toContainText(LABEL[lang]);
      await expect(page.locator('.llab-label-sim')).toContainText(LABEL[lang]);
      // the label links to the model limitations
      await page.locator('.llab-head .llab-link').click();
      await expect(page.locator('.llab-limits')).toBeFocused();
      await expect(page.locator('.llab-limits')).toContainText(c.limits[0]);
      const text = await root.innerText();
      expect(text).not.toMatch(PREFERENCE);
      expect(text).not.toMatch(NUMBERS_OF_SUCCESS);
    });
  });
}

test.describe('compare two', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('picking lenses updates the differences, side-by-side cards and the simulator', async ({ page }) => {
    await open(page, 'lang=en&sim=eager');
    let st = await simReady(page);
    expect(st).toMatchObject({ lensA: 'monofocal', lensB: 'trifocal', scenario: 'night-driving' });
    expect(st.sim).toMatchObject({ status: 'ready', state: 'ready', ui: 'viewer', compare: true, lens: 'monofocal', lensB: 'trifocal', scenario: 'night-driving', lighting: 'night', distanceM: 6 });
    const diff = page.locator('.llab-diff');
    await expect(diff.locator('li[data-row="near"]')).toContainText('Reading glasses usually needed');
    await expect(diff.locator('li[data-row="near"]')).toContainText('Often possible without glasses');
    await expect(diff.locator('li[data-row="distance"]')).toHaveCount(0); // same level → not a difference

    const pickA = page.getByRole('group', { name: 'First lens' });
    const pickB = page.getByRole('group', { name: 'Second lens' });
    await pickA.getByText('EDOF', { exact: true }).click();
    await pickB.getByText('Multifocal', { exact: true }).click();
    await expect.poll(async () => (await S(page)).sim.lens).toBe('edof');
    st = await S(page);
    expect(st).toMatchObject({ lensA: 'edof', lensB: 'multifocal' });
    expect(st.sim).toMatchObject({ lens: 'edof', lensB: 'multifocal', compare: true });
    await expect(page.locator('.llab-side .llab-card[data-lens="edof"] .llab-card-title')).toContainText('Extended depth of focus');
    await expect(page.locator('.llab-side .llab-card[data-lens="multifocal"] .llab-dim.is-diff[data-row="intermediate"]')).toHaveCount(1);
    await expect(page.locator('.llab-side .llab-card[data-lens="edof"] .llab-dim[data-row="distance"]:not(.is-diff)')).toHaveCount(1);
    await expect(diff.locator('li[data-row="intermediate"]')).toContainText('EDOF:');

    // choosing the same type twice swaps instead of comparing a lens with itself
    await pickB.getByText('EDOF', { exact: true }).click();
    st = await S(page);
    expect(st).toMatchObject({ lensA: 'multifocal', lensB: 'edof' });
    await expect(page.locator('.llab-swap')).toHaveText(CONTENT.en.sameLens);

    // a toric lens turns on the illustrated astigmatism, explained in words
    await pickA.getByText('Toric', { exact: true }).click();
    st = await S(page);
    expect(st.toricAssumption).toBe(true);
    expect(st.sim.refraction.cylD).toBeCloseTo(-1.5, 6);
    await expect(page.locator('.llab-assume')).toBeVisible();
    await pickA.getByText('Monofocal', { exact: true }).click();
    expect(Math.abs((await S(page)).sim.refraction.cylD)).toBe(0);
    await expect(page.locator('.llab-assume')).toBeHidden();
    const events = await page.evaluate(() => window.__llabEvents.map((e) => e.ev));
    expect(events).toEqual(expect.arrayContaining(['simready', 'change']));
  });

  test('every scenario drives the simulator distance, lighting and pupil', async ({ page }) => {
    await open(page, 'lang=en&sim=eager');
    await simReady(page);
    const group = page.getByRole('group', { name: CONTENT.en.scenarioTitle });
    for (const k of SCENARIO_ORDER) {
      await group.getByText(CONTENT.en.scenarios[k].label, { exact: true }).click();
      const st = await S(page);
      expect(st.scenario).toBe(k);
      expect(st.sim.scenario).toBe(k);
      expect(st.sim.distanceM).toBeCloseTo(SCENARIOS[k].distanceM, 6);
      expect(st.sim.lighting).toBe(SCENARIOS[k].lighting);
      await expect(page.locator('.llab-situation')).toContainText(CONTENT.en.scenarios[k].detail);
    }
    const night = await page.evaluate(() => { window.__llab.setScenario('night-driving'); return window.__llab.getState().sim.pupilMm; });
    const day = await page.evaluate(() => { window.__llab.setScenario('signs'); return window.__llab.getState().sim.pupilMm; });
    expect(night).toBeGreaterThan(day);
    // advanced details are on demand and show the model inputs
    const adv = page.locator('.llab-adv');
    await expect(adv.locator('table')).toBeHidden();
    await adv.locator('summary').click();
    await expect(adv.locator('table')).toBeVisible();
    await expect(adv).toContainText(CONTENT.en.advPupil);
    // invalid input is ignored
    await page.evaluate(() => { window.__llab.setScenario('bogus'); window.__llab.setLenses('toric', 'toric'); });
    expect(await S(page)).toMatchObject({ scenario: 'signs', lensA: 'monofocal', lensB: 'trifocal' });
  });

  test('Arabic draws lens A on the right of the picture, matching the right-to-left pickers', async ({ page }) => {
    await open(page, 'lang=ar&sim=eager');
    const st = await simReady(page);
    expect(st.picture).toEqual({ left: 'trifocal', right: 'monofocal' });
    expect(st.sim).toMatchObject({ lens: 'trifocal', lensB: 'monofocal' });
    await page.evaluate(() => window.__llab.setLang('en'));
    expect((await S(page)).sim).toMatchObject({ lens: 'monofocal', lensB: 'trifocal' });
  });

  test('without WebGL the written comparison stays and the picture explains itself', async ({ page }) => {
    await open(page, 'lang=en&sim=eager&nowebgl=1');
    const st = await simReady(page);
    expect(st.sim.status).toBe('failed');
    await expect(page.locator('.llab-sim-status')).toHaveText(CONTENT.en.simFailed);
    await expect(page.locator('.llab-diff')).toBeVisible();
  });
});

test.describe('lifecycle', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('mount/destroy ×6 leaves no listeners, observers, simulators, renderers or canvases', async ({ page }) => {
    await open(page, 'lang=en&sim=eager');
    await simReady(page);
    const r = await page.evaluate(async () => {
      const peaks = [];
      for (let i = 0; i < 6; i++) {
        const c = await window.__llabMount({ simulator: i % 2 ? 'lazy' : 'eager', lang: i % 3 ? 'en' : 'ar' });
        await new Promise((res) => { const t0 = performance.now(); const tick = () => { const s = c.getState().sim.status; if (s === 'ready' || s === 'failed' || s === 'idle' || performance.now() - t0 > 15000) res(); else requestAnimationFrame(tick); }; tick(); });
        peaks.push({ lab: { ...window.__lensLabCounters }, canvases: document.querySelectorAll('canvas').length });
        c.destroy();
        c.destroy(); // idempotent
      }
      return {
        peaks,
        lab: { ...window.__lensLabCounters },
        vsim: window.__visionSimCounters ? { ...window.__visionSimCounters } : null,
        children: window.__llabHost.children.length,
        canvases: document.querySelectorAll('canvas').length,
        overflow: document.documentElement.style.overflow,
      };
    });
    for (const p of r.peaks) expect(p.lab).toMatchObject({ live: 1 });
    expect(r.peaks[0].lab.listeners).toBeGreaterThan(1);
    expect(r.peaks[0].canvases).toBe(1);
    expect(r.lab).toMatchObject({ live: 0, listeners: 0, observers: 0, sims: 0 });
    expect(r.lab.mounts - r.lab.destroys).toBe(0);
    expect(r.vsim).toMatchObject({ live: 0, listeners: 0, observers: 0, rafLoops: 0, renderers: 0, renderTargets: 0 });
    expect(r.children).toBe(0);
    expect(r.canvases).toBe(0);
    expect(r.overflow).toBe('');
  });

  test('the simulator loads lazily, only when its section approaches the viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 600 });
    await open(page, 'lang=en');
    expect((await S(page)).sim.status).toBe('idle');
    expect(await page.locator('canvas').count()).toBe(0);
    const st = await simReady(page);
    expect(st.sim.status).toBe('ready');
    await expect(page.locator('.llab canvas')).toHaveCount(1);
  });

  test('language and theme switch in place with self-contained tokens', async ({ page }) => {
    await open(page, 'lang=ar&sim=eager');
    await simReady(page);
    const root = page.locator('.llab');
    await expect(root.locator('.llab-title')).toHaveText(CONTENT.ar.title);
    const bgLight = await root.evaluate((el) => getComputedStyle(el).backgroundColor);
    await page.evaluate(() => { document.body.style.color = 'rgb(255, 0, 0)'; document.body.style.setProperty('--llab-bg', 'red'); });
    expect(await root.evaluate((el) => getComputedStyle(el).color)).not.toBe('rgb(255, 0, 0)');
    await page.evaluate(() => { window.__llab.setLang('en'); window.__llab.setTheme('dark'); });
    await expect(root).toHaveAttribute('dir', 'ltr');
    await expect(root.locator('.llab-title')).toHaveText(CONTENT.en.title);
    await expect(root).toHaveAttribute('data-theme', 'dark');
    expect(await root.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe(bgLight);
    const st = await S(page);
    expect(st).toMatchObject({ lang: 'en', theme: 'dark' });
    await expect(page.locator('.llab .vsim')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('.llab .vsim')).toHaveAttribute('lang', 'en');
  });
});

test.describe('keyboard', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('pickers, situations, the comparison divider and the disclosures work from the keyboard', async ({ page }) => {
    await open(page, 'lang=en&sim=eager');
    await simReady(page);
    const pickA = page.getByRole('group', { name: 'First lens' });
    await pickA.getByRole('radio', { name: 'Monofocal' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(pickA.getByRole('radio', { name: 'Toric' })).toBeChecked();
    expect((await S(page)).lensA).toBe('toric');
    await expect(page.locator('.llab [aria-live="polite"]').last()).toContainText('Toric');
    const scn = page.getByRole('group', { name: CONTENT.en.scenarioTitle });
    await scn.getByRole('radio', { name: /Night driving/ }).focus();
    await page.keyboard.press('ArrowRight');
    expect((await S(page)).scenario).toBe('phone');
    // Tab moves on to the comparison divider of the picture
    const divider = page.getByRole('slider', { name: /Comparison divider/ });
    await divider.focus();
    await page.keyboard.press('Home');
    await expect(divider).toHaveAttribute('aria-valuenow', '0');
    await page.keyboard.press('End');
    await expect(divider).toHaveAttribute('aria-valuenow', '100');
    // disclosures toggle with Enter
    await page.locator('.llab-adv summary').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.llab-adv')).toHaveAttribute('open', '');
    // every interactive element is reachable (no positive tabindex, no focus traps)
    const bad = await page.evaluate(() => [...document.querySelectorAll('.llab [tabindex]')].filter((e) => Number(e.getAttribute('tabindex')) > 0).length);
    expect(bad).toBe(0);
  });
});

for (const w of [320, 390, 768, 1440]) {
  test.describe(`layout ${w}px`, () => {
    test.use({ viewport: { width: w, height: 900 } });
    for (const lang of ['ar', 'en']) {
      test(`no horizontal overflow (${lang}); narrow screens use one card at a time`, async ({ page }) => {
        await open(page, `lang=${lang}&sim=eager`);
        await simReady(page);
        const r = await page.evaluate(() => {
          const root = document.querySelector('.llab');
          const outside = [...root.querySelectorAll('*')].filter((e) => {
            if (!e.getClientRects().length || e.closest('.llab-table-wrap, details:not([open]) > :not(summary)')) return false; // the wide table scrolls inside its own region; closed disclosures are not shown
            const b = e.getBoundingClientRect();
            return b.right > innerWidth + 0.5 || b.left < -0.5;
          }).map((e) => e.className);
          const vis = (sel) => { const el = root.querySelector(sel); return !!el && el.getClientRects().length > 0; };
          return { sw: document.documentElement.scrollWidth, outside, table: vis('.llab-table-wrap'), cards: vis('.llab-cards'), shown: [...root.querySelectorAll('.llab-cards > .llab-card')].filter((c) => c.getClientRects().length).length };
        });
        expect(r.sw).toBeLessThanOrEqual(w);
        expect(r.outside).toEqual([]);
        if (w <= 768) { expect(r.cards).toBe(true); expect(r.table).toBe(false); expect(r.shown).toBe(1); } else { expect(r.table).toBe(true); expect(r.cards).toBe(false); }
        if (w <= 768) {
          const c = CONTENT[lang];
          await page.getByRole('group', { name: c.showLens }).getByText(c.lenses.trifocal.short, { exact: true }).click();
          await expect(page.locator('.llab-cards > .llab-card.is-shown')).toHaveAttribute('data-lens', 'trifocal');
          await expect(page.locator('.llab-cards > .llab-card.is-shown')).toContainText(c.lenses.trifocal.cons[0]);
          // touch targets of the choice chips
          const small = await page.evaluate(() => [...document.querySelectorAll('.llab .llab-chip, .llab summary')].filter((e) => e.getClientRects().length).map((e) => e.getBoundingClientRect()).filter((b) => b.height < 44).length);
          expect(small).toBe(0);
        }
      });
    }
  });
}

test.describe('accessibility (axe)', () => {
  for (const [lang, theme, w] of [['en', 'light', 1440], ['ar', 'dark', 390], ['ar', 'light', 1440], ['en', 'dark', 390]]) {
    test(`no axe violations — ${lang} ${theme} ${w}px`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 900 });
      await open(page, `lang=${lang}&theme=${theme}&sim=eager`);
      await simReady(page);
      await page.locator('.llab-adv summary').click();
      const res = await new AxeBuilder({ page }).include('.llab').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      expect(res.violations.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
    });
  }
});
