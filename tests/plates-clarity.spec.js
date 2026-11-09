// Anatomical plates: the three levels of labelling (L1 card, L2 hero, L3 close-up), the "Show all labels" and "More detail"
// disclosures, plain wording, the enlarge dialog, phone layout (320-430), both languages, both themes.
// Browser emulation only (Chromium); nothing here replaces physician review or a real device.
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import { PROCEDURES } from '../doctor-data.js';

const MANIFEST = JSON.parse(fs.readFileSync('public/images/procedures/manifest.json', 'utf8'));
const l2Of = (slug) => MANIFEST.assets.find(a => a.procedure === slug && a.level === 'L2');
const path = (lang, slug) => `/${lang === 'en' ? 'en/' : ''}procedures/${slug}/`;
const phone = (width = 390, height = 844) => ({ viewport: { width, height }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });

/** Sorted essential-first order of the labels, as the pins number them. */
const ordered = (a) => [...a.labelAnchors.filter(l => l.essential), ...a.labelAnchors.filter(l => !l.essential)];
const termOf = (l, lang) => (l.plain && l.plain[lang]) || l[lang];

async function open(page, lang, slug) {
  await page.goto(path(lang, slug));
  await page.locator('.proc-figure .pins').first().waitFor({ state: 'attached' });
  await page.waitForTimeout(150); // finishFirstLoad runs after the first paint (declustering)
}
/** Pin boxes that are actually rendered, with the number each shows. */
const visiblePins = (scope) => scope.evaluateAll((els) => els.map(p => { const r = p.getBoundingClientRect(); return r.width ? { n: Number(p.textContent), x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width } : null; }).filter(Boolean));
const overlaps = (pins) => { const bad = []; for (let i = 0; i < pins.length; i++) for (let j = i + 1; j < pins.length; j++) { const d = Math.hypot(pins[i].x - pins[j].x, pins[i].y - pins[j].y); if (d < pins[i].w - 1) bad.push(`${pins[i].n}×${pins[j].n} ${d.toFixed(1)}`); } return bad; };
const keyNumbers = (loc) => loc.evaluateAll(els => els.filter(e => e.checkVisibility()).map(e => Number(e.querySelector('.pk-n').textContent)));
const luminance = (rgb) => { const [r, g, b] = rgb.map(v => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

test.describe('the manifest records the label levels and the review state', () => {
  test('every image has essential labels, never approved; re-rendered assets carry notes and need re-approval', () => {
    expect(MANIFEST.assets).toHaveLength(27);
    for (const a of MANIFEST.assets) {
      expect(a.reviewStatus, a.assetId).toBe('pending');
      expect(a.approval, a.assetId).toBe('not approved');
      expect(a.reviewer, a.assetId).toBeNull();
      expect(a.essentialLabelsReview, a.assetId).toBe('pending physician review');
      const essential = a.labelAnchors.filter(l => l.essential);
      expect(essential.length, `${a.assetId} essential labels`).toBeGreaterThan(0);
      if (a.level === 'L2') expect(essential.length, a.assetId).toBeLessThanOrEqual(4);
      if (a.level === 'L1') expect(essential.length, a.assetId).toBeLessThanOrEqual(2);
      for (const lang of ['en', 'ar']) expect([...a.alt[lang]].length, `${a.assetId} alt.${lang}`).toBeLessThanOrEqual(160);
      expect(a.references.length, a.assetId).toBeGreaterThan(0);
      expect(a.knownSimplifications.length, a.assetId).toBeGreaterThan(0);
      if (a.version.endsWith('r2')) {
        expect(a.changeNote, a.assetId).toBeTruthy();
        expect(a.reApprovalNeeded, a.assetId).toBe(true);
      } else {
        expect(a.version, a.assetId).toBe('atlas-2026.11-r1');
        expect(a.reApprovalNeeded, a.assetId).toBe(false);
      }
    }
    // the assets judged confusing are the re-rendered ones (13 of 27)
    expect(MANIFEST.assets.filter(a => a.version.endsWith('r2')).map(a => a.assetId).sort()).toEqual([
      'cataract-surgery-l2-hero', 'cataract-surgery-l3-iol-in-bag', 'corneal-transplant-l1-card', 'corneal-transplant-l2-hero', 'icl-l2-hero',
      'intravitreal-injections-l1-card', 'intravitreal-injections-l2-hero', 'keratoconus-cxl-l1-card', 'keratoconus-cxl-l2-hero', 'keratoconus-cxl-l3-cone-section',
      'lens-implants-l1-card', 'lens-implants-l2-hero', 'lens-implants-l3-iol-in-bag'
    ].sort());
  });
});

for (const [lang, dir] of [['ar', 'rtl'], ['en', 'ltr']]) {
  test.describe(`L2 hero: essential labels by default, the rest on request (${lang})`, () => {
    test.use(phone());
    for (const p of PROCEDURES) {
      test(`${p.slug}: pins and key match, in the essential and in the full state`, async ({ page }) => {
        await open(page, lang, p.slug);
        await expect(page.locator('html')).toHaveAttribute('dir', dir);
        const a = l2Of(p.slug), labels = ordered(a), essential = a.labelAnchors.filter(l => l.essential).length;
        const fig = page.locator('.proc-figure');
        const pinLoc = fig.locator('.pin');
        await expect(pinLoc).toHaveCount(labels.length);
        const before = await visiblePins(pinLoc);
        expect(before.length, 'pins by default').toBeLessThanOrEqual(4);
        expect(before.length).toBe(essential);
        expect(before.map(x => x.n)).toEqual(labels.slice(0, essential).map((_, i) => i + 1));
        // the visible key names exactly those pins, in plain words
        const key = fig.locator('.pin-key li');
        expect(await keyNumbers(key)).toEqual(before.map(x => x.n));
        const visibleTerms = await key.evaluateAll(els => els.filter(e => e.checkVisibility()).map(e => e.querySelector('bdi').textContent));
        expect(visibleTerms).toEqual(labels.slice(0, essential).map(l => termOf(l, lang)));
        await expect(fig.locator('.fig-pending')).toBeVisible();
        // the reveal control: real, keyboard-reachable, 44 px
        const toggle = fig.locator('.labels-toggle');
        await expect(toggle).toBeVisible();
        const box = await toggle.boundingBox();
        expect(box.height).toBeGreaterThanOrEqual(44);
        await toggle.focus();
        await page.keyboard.press('Enter');
        await expect(fig.locator('.labels-more')).toHaveAttribute('open', '');
        await expect.poll(async () => (await visiblePins(pinLoc)).length).toBe(labels.length);
        const after = await visiblePins(pinLoc);
        expect(after.map(x => x.n).sort((m, n) => m - n)).toEqual(labels.map((_, i) => i + 1));
        expect((await keyNumbers(key)).sort((m, n) => m - n)).toEqual(labels.map((_, i) => i + 1));
        // the medical terms are not lost: every label is named once in the open key
        const allTerms = await key.evaluateAll(els => els.map(e => e.querySelector('bdi').textContent));
        expect(allTerms.sort()).toEqual(labels.map(l => termOf(l, lang)).sort());
        await page.keyboard.press('Enter');
        await expect(fig.locator('.labels-more')).not.toHaveAttribute('open', '');
        await expect.poll(async () => (await visiblePins(pinLoc)).length).toBe(essential);
      });
    }
  });
}

for (const width of [320, 390, 430]) {
  test.describe(`phone ${width}: no pin hides another, caption readable`, () => {
    test.use(phone(width, 800));
    for (const p of PROCEDURES) {
      test(`${p.slug}`, async ({ page }) => {
        await open(page, 'en', p.slug);
        const fig = page.locator('.proc-figure');
        const pinLoc = fig.locator('.pin');
        const box = await fig.locator('.atlas-illus').boundingBox();
        expect(box.width).toBeGreaterThanOrEqual(width - 40);
        const check = async (state) => {
          await expect.poll(async () => overlaps(await visiblePins(pinLoc)), { message: `${p.slug} ${state}` }).toEqual([]); // separation runs after the first frame and after a toggle
          const pins = await visiblePins(pinLoc);
          for (const q of pins) { expect(q.x, `${p.slug} ${state} pin ${q.n} inside`).toBeGreaterThanOrEqual(box.x - 1); expect(q.x).toBeLessThanOrEqual(box.x + box.width + 1); }
          // the enlarge control does not sit on a pin
          const z = await fig.locator('.plate-zoom').boundingBox();
          for (const q of pins) expect(q.x >= z.x - q.w / 2 && q.x <= z.x + z.width + q.w / 2 && q.y >= z.y - q.w / 2 && q.y <= z.y + z.height + q.w / 2, `pin ${q.n} under the enlarge control`).toBe(false);
        };
        await check('essential');
        const caption = await fig.locator('.fig-text').evaluate(el => ({ size: parseFloat(getComputedStyle(el).fontSize), lines: Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight)) }));
        expect(caption.size).toBeGreaterThanOrEqual(12);
        expect(caption.lines, 'caption lines').toBeLessThanOrEqual(5);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
        await fig.locator('.labels-toggle').tap();
        await expect.poll(async () => (await visiblePins(pinLoc)).length).toBe(l2Of(p.slug).labelAnchors.length);
        await check('all labels');
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      });
    }
  });
}

test.describe('L3 close-ups are the optional level', () => {
  for (const [lang] of [['ar'], ['en']]) {
    test.describe(`phone 390 ${lang}`, () => {
      test.use(phone());
      test(`closed by default, keyboard opens it, its pins and key match (${lang})`, async ({ page }) => {
        for (const p of PROCEDURES) {
          await open(page, lang, p.slug);
          const detail = page.locator('.anat-detail');
          await expect(detail).toHaveCount(1);
          await expect(detail.locator('figure.loupe').first()).toBeHidden();
          await expect(page.locator('.anat-text .anat-parts')).toBeVisible(); // the page is understood without opening L3
          const sum = detail.locator('.anat-detail-sum');
          const box = await sum.boundingBox();
          expect(box.height).toBeGreaterThanOrEqual(44);
          await sum.focus();
          await page.keyboard.press('Enter');
          await expect(detail).toHaveAttribute('open', '');
          await expect(detail.locator('figure.loupe').first()).toBeVisible();
          for (const fig of await detail.locator('figure.loupe').all()) {
            await expect.poll(async () => (await visiblePins(fig.locator('.pin'))).length).toBeGreaterThan(0);
            const pins = await visiblePins(fig.locator('.pin'));
            expect(await keyNumbers(fig.locator('.pin-key li'))).toEqual(pins.map(x => x.n));
            await expect(fig.locator('.fig-pending')).toBeVisible();
          }
        }
      });
    });
  }
});

test.describe('L1 cards: one concept, no more than their essential labels', () => {
  test.use(phone());
  for (const [lang, url] of [['ar', '/'], ['en', '/en/']]) {
    test(`home page cards (${lang})`, async ({ page }) => {
      await page.goto(url);
      await page.locator('#procedures .plate-card').first().waitFor();
      for (const card of await page.locator('#procedures .plate-card').all()) {
        const n = await visiblePins(card.locator('.pin'));
        expect(n.length).toBeLessThanOrEqual(2);
        const key = await card.locator('.pin-key li').count();
        expect(key).toBe(n.length);
      }
    });
  }
});

for (const [lang, dir] of [['ar', 'rtl'], ['en', 'ltr']]) {
  test.describe(`enlarge dialog (${lang})`, () => {
    test.use(phone());
    test(`keyboard, focus and Escape; the pending note travels with it (${lang})`, async ({ page }) => {
      await open(page, lang, 'keratoconus-cxl');
      const btn = page.locator('.proc-figure .plate-zoom');
      const box = await btn.boundingBox();
      expect(box.width).toBeGreaterThanOrEqual(44); expect(box.height).toBeGreaterThanOrEqual(44);
      await btn.focus();
      await page.keyboard.press('Enter');
      const dlg = page.locator('#plate-dialog');
      await expect(dlg).toBeVisible();
      await expect(dlg).toHaveJSProperty('open', true);
      expect(await page.evaluate(() => document.activeElement.classList.contains('pd-close'))).toBe(true);
      await expect(dlg.locator('.fig-pending')).toBeVisible();
      await expect(dlg.locator('.pd-scroll img')).toBeVisible();
      expect(await dlg.evaluate(d => getComputedStyle(d).direction)).toBe(dir);
      // close button 44 px, and it closes the dialog with the keyboard too
      const close = await dlg.locator('.pd-close').boundingBox();
      expect(close.width).toBeGreaterThanOrEqual(44); expect(close.height).toBeGreaterThanOrEqual(44);
      await page.keyboard.press('Escape');
      await expect(dlg).not.toBeVisible();
      expect(await page.evaluate(() => document.activeElement.classList.contains('plate-zoom'))).toBe(true);
      expect(await page.evaluate(() => document.documentElement.classList.contains('dialog-open'))).toBe(false);
      // reopen with the mouse/touch path and close with the button; the image is enlarged on the phone (1.7x width)
      await btn.tap();
      await expect(dlg).toHaveJSProperty('open', true);
      const sizes = await dlg.locator('.pd-scroll').evaluate(s => ({ inner: s.querySelector('.illus').getBoundingClientRect().width, outer: s.clientWidth }));
      expect(sizes.inner).toBeGreaterThan(sizes.outer * 1.3);
      await dlg.locator('.pd-close').tap();
      await expect(dlg).not.toBeVisible();
      // no copy of the figure remains in the page afterwards
      expect(await dlg.evaluate(d => d.children.length)).toBe(0);
    });
  });
}

test.describe('enlarge dialog keeps the "all labels" state', () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  test('all labels open on the figure are open in the dialog', async ({ page }) => {
    await open(page, 'en', 'icl');
    const fig = page.locator('.proc-figure');
    await fig.locator('.labels-toggle').click();
    await expect(fig.locator('.labels-more')).toHaveAttribute('open', '');
    await fig.locator('.plate-zoom').click();
    const dlg = page.locator('#plate-dialog');
    await expect(dlg).toHaveJSProperty('open', true);
    await expect.poll(async () => (await visiblePins(dlg.locator('.pin'))).length).toBe(l2Of('icl').labelAnchors.length);
    await page.keyboard.press('Escape');
    await expect(dlg).not.toBeVisible();
  });
});

for (const theme of ['light', 'dark']) {
  test.describe(`theme ${theme}`, () => {
    test.use(phone());
    test.beforeEach(async ({ page }) => { await page.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch (e) { /* ignore */ } }, theme); });
    test(`pins and the key stay readable (${theme})`, async ({ page }) => {
      await open(page, 'en', 'corneal-transplant');
      const fig = page.locator('.proc-figure');
      const colors = await fig.evaluate(f => {
        const num = (c) => c.match(/[\d.]+/g).slice(0, 3).map(Number);
        const pin = getComputedStyle(f.querySelector('.pin'));
        const key = getComputedStyle(f.querySelector('.pin-key li bdi'));
        const sum = getComputedStyle(f.querySelector('.labels-toggle'));
        let bg = getComputedStyle(document.body).backgroundColor;
        for (let e = f; e && e !== document.documentElement; e = e.parentElement) { const c = getComputedStyle(e).backgroundColor; if (!/rgba\(0, 0, 0, 0\)|transparent/.test(c)) { bg = c; break; } }
        return { pinFg: num(pin.color), pinBg: num(pin.backgroundColor), key: num(key.color), sum: num(sum.color), bg: num(bg) };
      });
      expect(contrast(colors.pinFg, colors.pinBg), 'pin number').toBeGreaterThanOrEqual(4.5);
      expect(contrast(colors.key, colors.bg), 'key text').toBeGreaterThanOrEqual(4.5);
      expect(contrast(colors.sum, colors.bg), 'control text').toBeGreaterThanOrEqual(4.5);
      await expect(fig.locator('.fig-pending')).toBeVisible();
    });
  });
}

test.describe('no-script fallback in the prerendered page', () => {
  test('the disclosures are native <details>, so they work before the script runs', async ({ page }) => {
    const html = fs.readFileSync('dist/en/procedures/icl/index.html', 'utf8');
    expect(html).toMatch(/<details class="labels-more"/);
    expect(html).toMatch(/<details class="anat-detail"/);
    await page.goto('/en/procedures/icl/');
    await page.locator('.proc-figure .labels-toggle').waitFor();
  });
});
