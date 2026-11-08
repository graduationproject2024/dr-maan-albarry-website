// Procedure library: 7 procedures × AR/EN real pages, prerendered SEO, gallery → page → back,
// and no horizontal overflow at phone, tablet and desktop widths.
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import { DOCTOR, PROCEDURES } from '../doctor-data.js';
import { CONTENT } from '../src/procedures/content.js';

const MANIFEST = JSON.parse(fs.readFileSync('public/images/procedures/manifest.json', 'utf8'));

const LANGS = [['ar', 'rtl'], ['en', 'ltr']];
const path = (lang, slug) => `/${lang === 'en' ? 'en/' : ''}procedures/${slug}/`;
const REVIEW = { ar: 'مسودة بانتظار مراجعة د. معن', en: 'draft pending review by Dr. Maan' };
const SECTIONS = ['anatomy', 'purpose', 'candidates', 'steps', 'benefits', 'risks', 'recovery', 'faq'];

test.describe('Procedure pages render in both languages', () => {
  for (const [lang, dir] of LANGS) {
    test(`all 7 procedure pages — ${lang}`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      page.on('response', r => { if (r.status() >= 400 && r.url().startsWith('http://localhost')) errors.push(`HTTP ${r.status()} ${r.url()}`); });
      for (const p of PROCEDURES) {
        await page.goto(path(lang, p.slug));
        await expect(page.locator('html')).toHaveAttribute('lang', lang);
        await expect(page.locator('html')).toHaveAttribute('dir', dir);
        await expect(page.locator('main h1')).toHaveText(p.name[lang]);
        const c = CONTENT[p.slug][lang];
        await expect(page.locator('.proc-lede')).toHaveText(c.intro);
        // visible draft review status, at the top and at the foot
        await expect(page.locator('.review-status').first()).toBeVisible();
        await expect(page.locator('.review-status').first()).toContainText(REVIEW[lang]);
        await expect(page.locator('.review-status')).toHaveCount(2);
        for (const id of SECTIONS) await expect(page.locator(`#p-${id} h2`), `${p.slug} #p-${id}`).toBeVisible();
        if (c.types) await expect(page.locator('#p-types .type')).toHaveCount(c.types.length);
        await expect(page.locator('#p-faq .faq-question')).toHaveCount(c.faq.length);
        await expect(page.locator('.proc-related .proc-card')).toHaveCount(p.related.length);
        // booking CTA + illustration with the procedure's own alt text
        const book = page.locator('main [data-cta="book"]');
        expect(await book.count()).toBeGreaterThanOrEqual(2);
        for (const h of await book.evaluateAll(a => a.map(x => x.href))) expect(h).toBe(DOCTOR.contact.bookingUrl);
        const label = await page.locator('.proc-figure .illus').evaluate(el => {
          const img = el.querySelector('img');
          return img ? img.alt : el.querySelector('.anat-plate').getAttribute('aria-label');
        });
        // the hero is the atlas L2 plate, whose alt text is recorded per asset in the image library's manifest
        const l2 = MANIFEST.assets.find(a => a.procedure === p.slug && a.level === 'L2');
        expect(label).toBe(l2.alt[lang]);
        expect(label.length).toBeGreaterThan(20);
        // the pins on the plate match its anchors, and the key names every one of them in this language
        await expect(page.locator('.proc-figure .pin')).toHaveCount(l2.labelAnchors.length);
        await expect(page.locator('.proc-figure .pin-key li')).toHaveCount(l2.labelAnchors.length);
        await expect(page.locator('.proc-figure .fig-pending')).toBeVisible();
        // only the cataract page hosts the 3D simulator (lazy, poster first)
        await expect(page.locator('#cataract-3d')).toHaveCount(p.simulator ? 1 : 0);
        await expect(page.locator('canvas')).toHaveCount(0);
        // no outcome promises or success figures
        const text = await page.locator('main').innerText();
        expect(text).not.toMatch(/success rate|نسبة نجاح|\d+\s?%|guarantee(d)? (?!cannot)|نضمن/i);
      }
      expect(errors).toEqual([]);
    });
  }

  test('FAQ accordion on a procedure page keeps aria-expanded in sync', async ({ page }) => {
    await page.goto(path('en', 'icl'));
    const q = page.locator('#pfaq-0 .faq-question');
    await expect(q).toHaveAttribute('aria-expanded', 'false');
    await q.click();
    await expect(q).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#pfaq-answer-0')).toBeVisible();
  });

  test('the cataract page launches the 3D simulator on demand', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(path('en', 'cataract-surgery'));
    expect(await page.evaluate(() => performance.getEntriesByType('resource').filter(r => /cataract-sim/.test(r.name)).length)).toBe(0);
    await page.locator('#cataract-3d-start').click();
    await expect(page.locator('#cataract-3d')).toHaveAttribute('data-state', 'active', { timeout: 20_000 });
    await expect(page.locator('#cataract-3d-stage canvas')).toHaveCount(1);
    // going to a page without the 3D section tears the scene down…
    await page.locator('.proc-related a.proc-card-link').first().click();
    await expect(page.locator('main h1')).toHaveText(PROCEDURES.find(p => p.slug === 'lens-implants').name.en);
    await expect(page.locator('canvas')).toHaveCount(0);
    // …the homepage shows only the poster preview (Phase 1), and the 3D page starts idle again, nothing mounted
    await page.locator('.crumbs a').first().click();
    await expect(page.locator('h1.hero-title')).toBeVisible();
    await expect(page.locator('#surgery-3d .c3d-poster')).toBeVisible();
    await expect(page.locator('canvas')).toHaveCount(0);
    await page.locator('#surgery-3d a[href="en/surgical-education/"]').click();
    await expect(page.locator('#cataract-3d')).toHaveAttribute('data-state', 'idle');
    await expect(page.locator('#cataract-3d-stage canvas')).toHaveCount(0);
  });
});

test.describe('Prerendered procedure HTML (no JavaScript)', () => {
  for (const [lang, dir] of LANGS) {
    test(`content, canonical, hreflang, og and JSON-LD — ${lang}`, async ({ browser, request }) => {
      const home = await (await request.get('/')).text();
      const canonAr = home.match(/<link rel="canonical" href="([^"]+)">/)[1];
      const abs = (l, slug) => new URL(`${l === 'en' ? 'en/' : ''}procedures/${slug}/`, canonAr).href;
      const ctx = await browser.newContext({ javaScriptEnabled: false });
      const page = await ctx.newPage();
      for (const p of PROCEDURES) {
        const res = await page.goto(path(lang, p.slug));
        expect(res.status()).toBe(200);
        await expect(page.locator('html')).toHaveAttribute('lang', lang);
        await expect(page.locator('html')).toHaveAttribute('dir', dir);
        await expect(page.locator('main h1')).toHaveText(p.name[lang]);
        const c = CONTENT[p.slug][lang];
        const body = await page.locator('body').innerText();
        for (const s of [c.intro, c.purpose, c.steps[0], c.risks[0], c.recovery[0], REVIEW[lang], ...c.faq.map(f => f.q)]) expect(body, `${p.slug}: ${s}`).toContain(s);
        // head
        const raw = await (await request.get(path(lang, p.slug))).text();
        expect(raw).toContain(lang === 'en' ? '<base href="../../../">' : '<base href="../../">');
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', abs(lang, p.slug));
        await expect(page.locator('link[rel="alternate"][hreflang="ar"]')).toHaveAttribute('href', abs('ar', p.slug));
        await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', abs('en', p.slug));
        await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', abs('ar', p.slug));
        await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', abs(lang, p.slug));
        await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', lang === 'ar' ? 'ar_SA' : 'en_US');
        const title = await page.title();
        expect(title).toContain(p.name[lang]);
        expect((await page.locator('meta[name="description"]').getAttribute('content'))).toContain(p.summary[lang]);
        // structured data: MedicalWebPage + procedure + FAQ, mirroring the visible page; no ratings/reviews
        const blocks = await page.$$eval('script[type="application/ld+json"]', s => s.map(x => x.textContent));
        expect(blocks).toHaveLength(1);
        expect(blocks[0]).not.toMatch(/AggregateRating|"Review"|ratingValue|reviewedBy|lastReviewed/);
        const graph = JSON.parse(blocks[0])['@graph'];
        const webpage = graph.find(n => n['@type'] === 'MedicalWebPage');
        expect(webpage.url).toBe(abs(lang, p.slug));
        expect(webpage.inLanguage).toBe(lang);
        const proc = graph.find(n => ['SurgicalProcedure', 'TherapeuticProcedure'].includes(n['@type']));
        expect(proc.name).toBe(p.name[lang]);
        const faq = graph.find(n => n['@type'] === 'FAQPage');
        expect(faq.mainEntity.map(q => q.name)).toEqual(c.faq.map(f => f.q));
        expect(faq.mainEntity.map(q => q.acceptedAnswer.text)).toEqual(c.faq.map(f => f.a));
      }
      await ctx.close();
    });
  }

  test('the procedure library is in the prerendered HTML with working links (no JS)', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    for (const [lang] of LANGS) {
      // the homepage links every procedure (three featured cards + the index) without JavaScript
      await page.goto(lang === 'en' ? '/en/' : '/');
      for (const p of PROCEDURES) await expect(page.locator(`#procedures a[href="${lang === 'en' ? 'en/' : ''}procedures/${p.slug}/"]`).first()).toContainText(p.name[lang]);
      // the full gallery lives on the library page (Phase 1)
      await page.goto(lang === 'en' ? '/en/procedures/' : '/procedures/');
      const cards = page.locator('#procedures .proc-card');
      await expect(cards).toHaveCount(7);
      for (const p of PROCEDURES) {
        const link = page.locator(`#procedures .proc-card a.proc-card-link[href="${lang === 'en' ? 'en/' : ''}procedures/${p.slug}/"]`);
        await expect(link).toHaveCount(1);
        await expect(link).toContainText(p.name[lang]); // accessible name carries the procedure
      }
      // a no-JS click lands on the real prerendered page
      await page.locator(`#procedures a.proc-card-link`).nth(4).click();
      await expect(page).toHaveURL(new RegExp(`${lang === 'en' ? '/en' : ''}/procedures/${PROCEDURES[4].slug}/$`));
      await expect(page.locator('main h1')).toHaveText(PROCEDURES[4].name[lang]);
    }
    await ctx.close();
  });
});

test.describe('Gallery → procedure page → back', () => {
  for (const [lang] of LANGS) {
    test(`card click opens the page and Back returns to the gallery — ${lang}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(lang === 'en' ? '/en/procedures/' : '/procedures/'); // the gallery is the library page (Phase 1)
      const p = PROCEDURES.find(x => x.slug === 'keratoconus-cxl');
      const card = page.locator(`#procedures .proc-card:has(a[href$="procedures/${p.slug}/"])`);
      await card.scrollIntoViewIfNeeded();
      const yBefore = await page.evaluate(() => window.scrollY);
      expect(yBefore).toBeGreaterThan(300);
      await card.locator('a.proc-card-link').click();
      await expect(page).toHaveURL(new RegExp(`/procedures/${p.slug}/$`));
      await expect(page.locator('main h1')).toHaveText(p.name[lang]);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      expect(await page.evaluate(() => window.scrollY)).toBeLessThan(50);
      expect(await page.title()).toContain(p.name[lang]);
      await page.goBack();
      await expect(page.locator('main')).toHaveAttribute('data-page', 'procedures');
      await expect(page).toHaveURL(lang === 'en' ? /\/en\/procedures\/$/ : /\/procedures\/$/);
      // the reading position is restored: the same card is back on screen
      await expect.poll(() => card.evaluate(el => { const r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; })).toBe(true);
      await page.goForward();
      await expect(page.locator('main h1')).toHaveText(p.name[lang]);
    });
  }

  test('the gallery filter shows one group at a time and keeps every card in the DOM', async ({ page }) => {
    await page.goto('/en/procedures/');
    await page.locator('.proc-filter [data-filter="cornea-retina"]').click();
    await expect(page.locator('.proc-filter [data-filter="cornea-retina"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#procedures .proc-card:visible')).toHaveCount(3);
    await expect(page.locator('#procedures .proc-card')).toHaveCount(7);
    await page.locator('.proc-filter [data-filter="all"]').click();
    await expect(page.locator('#procedures .proc-card:visible')).toHaveCount(7);
  });
});

test.describe('No horizontal overflow', () => {
  for (const w of [320, 360, 390, 768, 1440]) {
    for (const [lang] of LANGS) {
      test(`${w}px ${lang}: home and every procedure page`, async ({ page }) => {
        await page.setViewportSize({ width: w, height: 900 });
        for (const url of [lang === 'en' ? '/en/' : '/', ...PROCEDURES.map(p => path(lang, p.slug))]) {
          await page.goto(url);
          await expect(page.locator('main h1')).toBeVisible();
          const sw = await page.evaluate(() => document.documentElement.scrollWidth);
          expect(sw, url).toBeLessThanOrEqual(w);
          // the booking path is always one tap away
          const bookVisible = await page.evaluate(() => [...document.querySelectorAll('.btn-header-book, #booking-bar .booking-action-book')]
            .some(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height >= 44 && r.top >= 0 && r.bottom <= innerHeight && getComputedStyle(el).visibility !== 'hidden'; }));
          expect(bookVisible, url).toBe(true);
        }
      });
    }
  }
});
