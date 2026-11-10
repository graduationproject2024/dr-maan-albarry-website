// Phase 1 — dedicated pages, homepage budget, responsive overflow, internal links, restored content and the
// optional-feature loaders. Runs against the production build (see playwright.config.js).
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import { DOCTOR, PROCEDURES } from '../doctor-data.js';
import { SECTION_PAGES, PAGES, pageMeta, pathFor, ROUTE_PATTERN, breadcrumbFor } from '../site-routes.js';
import { GUIDES, VISIT, DISCLAIMER, questionnaireResult, QUESTIONNAIRE } from '../src/site/content.js';

const PREFERENCE = /\bprefer(red|s)?\b(?![-\w])|favou?r(ed|s|ite)?\b|clinically (preferred|favou?red)|المفضل|يفضل|يفضّل|الخيار المفضل|المفضل سريري/i;
const LANGS = [['ar', 'rtl'], ['en', 'ltr']];
const url = (lang, key) => `/${pathFor(lang, null, key)}`;

test.describe('Section pages — with JavaScript', () => {
  for (const [lang, dir] of LANGS) {
    for (const s of SECTION_PAGES) {
      test(`${url(lang, s.key)} renders its page (${lang})`, async ({ page }) => {
        const errors = [];
        page.on('pageerror', e => errors.push(String(e)));
        await page.goto(url(lang, s.key));
        await expect(page.locator('html')).toHaveAttribute('lang', lang);
        await expect(page.locator('html')).toHaveAttribute('dir', dir);
        await expect(page.locator('main')).toHaveAttribute('data-page', s.key);
        await expect(page.locator('main h1')).toHaveCount(1);
        await expect(page.locator('main h1')).toBeVisible();
        expect(await page.title()).toBe(pageMeta(lang, null, s.key).title);
        // visible breadcrumb mirrors the BreadcrumbList trail
        const crumbs = await page.locator('main .crumbs li').allInnerTexts();
        expect(crumbs.map(t => t.trim())).toEqual(breadcrumbFor(lang, null, s.key).map(c => c.name));
        // the header marks the current page
        if (s.key !== 'how-vision-works') await expect(page.locator(`#site-header .nav-links a[data-section="${s.key}"]`)).toHaveAttribute('aria-current', 'page');
        // heading order: no level is skipped below the h1
        const levels = await page.$$eval('main h1, main h2, main h3, main h4', hs => hs.filter(h => h.getClientRects().length).map(h => +h.tagName[1]));
        for (let i = 1; i < levels.length; i++) expect(levels[i] - levels[i - 1], `heading jump on ${s.key}: ${levels.join(',')}`).toBeLessThanOrEqual(1);
        expect(errors).toEqual([]);
      });
    }
  }
});

test.describe('Section pages — prerendered, no JavaScript', () => {
  for (const [lang, dir] of LANGS) {
    test(`all section pages serve real content and metadata (${lang})`, async ({ browser, request }) => {
      const home = await (await request.get('/')).text();
      const canonAr = home.match(/<link rel="canonical" href="([^"]+)">/)[1];
      const abs = (l, key) => new URL(pathFor(l, null, key), canonAr).href;
      const ctx = await browser.newContext({ javaScriptEnabled: false });
      const page = await ctx.newPage();
      for (const s of SECTION_PAGES) {
        const res = await page.goto(url(lang, s.key));
        expect(res.status(), s.key).toBe(200);
        await expect(page.locator('html')).toHaveAttribute('lang', lang);
        await expect(page.locator('html')).toHaveAttribute('dir', dir);
        await expect(page.locator('main h1')).toHaveCount(1);
        expect((await page.locator('main h1').innerText()).trim().length).toBeGreaterThan(3);
        expect(await page.title()).toBe(pageMeta(lang, null, s.key).title);
        await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', pageMeta(lang, null, s.key).description);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', abs(lang, s.key));
        await expect(page.locator('link[rel="alternate"][hreflang="ar"]')).toHaveAttribute('href', abs('ar', s.key));
        await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', abs('en', s.key));
        await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', abs('ar', s.key));
        const blocks = await page.$$eval('script[type="application/ld+json"]', x => x.map(n => n.textContent));
        expect(blocks).toHaveLength(1);
        expect(blocks[0]).not.toMatch(/AggregateRating|"Review"|ratingValue|priceRange|"geo"/);
        const graph = JSON.parse(blocks[0])['@graph'];
        const bc = graph.find(n => n['@type'] === 'BreadcrumbList');
        expect(bc.itemListElement.map(i => i.name)).toEqual(breadcrumbFor(lang, null, s.key).map(c => c.name));
        expect(bc.itemListElement.at(-1).item).toBe(abs(lang, s.key));
        const type = { about: 'ProfilePage', procedures: 'CollectionPage', clinic: 'ContactPage' }[s.key] || 'MedicalWebPage';
        expect(graph.some(n => n['@type'] === type), `${s.key} ${type}`).toBe(true);
        if (s.key === 'clinic') {
          const clinic = graph.find(n => n['@type'] === 'MedicalClinic');
          expect(clinic.telephone).toBe(DOCTOR.contact.clinicDirect.tel);
          expect(clinic.openingHoursSpecification.map(o => o.opens)).toEqual(['09:00', '17:00']);
        }
        // no blank reserved gaps without JavaScript (BUG-10): interactive hosts are empty and unreserved
        expect(await page.locator('[data-reserve]').count(), s.key).toBe(0);
        // every image carries alternative text
        expect(await page.$$eval('main img', imgs => imgs.filter(i => !i.getAttribute('alt')).length), s.key).toBe(0);
      }
      await ctx.close();
    });
  }

  test('sitemap lists every page once, with hreflang pairs; robots and llms.txt agree', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text();
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    expect(locs).toHaveLength(PAGES.length);
    expect(new Set(locs).size).toBe(PAGES.length);
    for (const s of SECTION_PAGES) for (const l of ['ar', 'en']) expect(locs.some(u => u.endsWith(`/${pathFor(l, null, s.key)}`)), `${l} ${s.key}`).toBe(true);
    const llms = await (await request.get('/llms.txt')).text();
    for (const s of SECTION_PAGES) expect(llms).toContain(`/${s.key}/`);
  });

  test('the inline <base> script and site-routes.js use the same route pattern', () => {
    // The pattern is generated into the page at build time (vite.config.js), so the built pages are what is checked.
    expect(fs.readFileSync('index.html', 'utf8')).toContain('(__ROUTE_PATTERN__)$/');
    for (const p of PAGES) expect(fs.readFileSync(`dist/${p.path}index.html`, 'utf8'), p.path).toContain(`(${ROUTE_PATTERN})$/`);
  });
});

test.describe('Internal links', () => {
  test('every internal link on every prerendered page returns 200', async ({ request }) => {
    test.setTimeout(180_000);
    const seen = new Set();
    for (const p of PAGES) {
      const html = await (await request.get(`/${p.path}`)).text();
      const base = new URL(`http://x/${p.path}`);
      const baseHref = html.match(/<base href="([^"]*)">/)[1];
      const root = new URL(baseHref, base);
      for (const [, href] of html.matchAll(/<a [^>]*href="([^"]+)"/g)) {
        if (/^(https?:|tel:|mailto:|#)/.test(href)) continue;
        const u = new URL(href, root);
        seen.add(u.pathname);
      }
    }
    expect(seen.size).toBeGreaterThan(20);
    for (const path of seen) expect((await request.get(path)).status(), path).toBe(200);
  });
});

test.describe('Homepage height budget (owner complaint 1)', () => {
  // Baseline before Phase 1 (docs/phase-1/evidence/baseline): about 10,700 px at 1440 and 15,000 px at 390.
  // 390 px budget: owner decision on 2026-11-08 ("Trim, new limit"). The phone page shows all seven procedures with their summaries, both
  // vision previews, the 3D poster and full credentials, so the old 8,350 px limit no longer fits. The page was first trimmed without hiding
  // anything (from 9,846 AR / 10,614 EN to 9,153 AR / 9,943 EN); the limits below are those measured heights plus about 100 px.
  // The 1440 px budget (5,750) is unchanged; English gained room by trimming the spacing, not by raising it.
  const budgets = { 1440: { ar: 5750, en: 5750 }, 390: { ar: 9250, en: 10040 } };
  for (const w of [1440, 390]) {
    for (const lang of ['ar', 'en']) {
      const max = budgets[w][lang];
      test(`home is at most ${max}px tall at ${w}px (${lang})`, async ({ page }) => {
        await page.setViewportSize({ width: w, height: 900 });
        await page.goto(lang === 'en' ? '/en/' : '/');
        await page.locator('main h1').waitFor();
        await page.evaluate(() => document.fonts.ready);
        const h = await page.evaluate(() => document.documentElement.scrollHeight);
        expect(h).toBeLessThanOrEqual(max);
        if (w > 800) expect(h).toBeLessThan(10700 * 0.55);
      });
    }
  }
});

test.describe('No horizontal overflow', () => {
  const paths = ['', ...SECTION_PAGES.map(s => `${s.key}/`), 'procedures/cataract-surgery/'];
  for (const w of [320, 390, 768, 1024, 1366, 1440]) {
    test(`pages fit ${w}px (AR + EN)`, async ({ page }) => {
      test.setTimeout(150_000);
      await page.setViewportSize({ width: w, height: 900 });
      for (const lang of ['', 'en/']) {
        for (const p of paths) {
          await page.goto(`/${lang}${p}`);
          await page.locator('main h1').waitFor();
          const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
          expect(over, `/${lang}${p} at ${w}px`).toBeLessThanOrEqual(0);
        }
      }
    });
  }
});

test.describe('Restored content is on its destination page (content preservation matrix)', () => {
  test('the questionnaire summary is chosen by the answers, in neutral wording', async ({ page }) => {
    for (const lang of ['ar', 'en']) {
      await page.goto(url(lang, 'education'));
      const run = async answers => {
        await page.evaluate(a => { window.restartQ(); for (const i of a) { window.selectQOption(i); window.nextQStep(); } }, answers);
        return page.locator('#questionnaire .q-result-item').evaluateAll(els => els.map(e => e.dataset.block));
      };
      const night = await run([0, 0, 0, 0]);
      const reading = await run([2, 1, 2, 1]);
      expect(night).toEqual(['nightDriving', 'nextStep']);
      expect(reading).toEqual(['nearVision', 'previousLaser', 'eyeCondition', 'nextStep']);
      expect(await run([4, 4, 1, 3])).toEqual(['intermediate', 'historyUnknown', 'conditionUnknown', 'nextStep']);
      const text = await page.locator('#questionnaire').innerText();
      expect(text).not.toMatch(PREFERENCE);
      expect(text).toContain(questionnaireResult([4, 4, 1, 3], lang)[0].title);
    }
    // every block in both languages stays neutral
    for (const lang of ['ar', 'en']) for (let a = 0; a < 4; a++) for (let b = 0; b < 5; b++) for (let d = 0; d < 4; d++) {
      for (const blk of questionnaireResult([0, b, a, d], lang)) expect(`${blk.title} ${blk.text}`).not.toMatch(PREFERENCE);
    }
    expect(QUESTIONNAIRE.ar).toHaveLength(4);
  });

  test('the four guides are on the education page with their headed sections', async ({ page }) => {
    for (const lang of ['ar', 'en']) {
      await page.goto(url(lang, 'education'));
      for (const g of GUIDES) {
        const art = page.locator(`article.guide#${g.id}`);
        await expect(art.locator('h3')).toHaveText(g.title[lang]);
        await expect(art.locator('h4')).toHaveCount(g.sections[lang].length);
        await expect(art.locator(`a[href$="procedures/${g.slug}/"]`)).toHaveCount(1);
      }
      const text = await page.locator('main').innerText();
      expect(text).not.toMatch(/2[.,]2\s?(mm|ملم|مم)|zero pain|دون ألم حقيقي|15\s?(to|–|-|إلى)\s?20|Pentacam|بنتاكام/i);
      await expect(page.locator('#red-flags li')).toHaveCount(4);
    }
  });

  test('"Your visit" pathway and the core assessments are on the clinic page', async ({ page }) => {
    for (const lang of ['ar', 'en']) {
      await page.goto(url(lang, 'clinic'));
      await expect(page.locator('.pathway .path-step h3')).toHaveText(VISIT.map(v => v[lang][0]));
      await expect(page.locator('.tech-grid .tech-item')).toHaveCount(4);
      const clinic = await page.locator('main').innerText();
      expect(clinic).toContain(DOCTOR.clinic.workingHours[lang]);
      expect(clinic).toContain(DOCTOR.contact.clinicDirect.display);
      await expect(page.locator('#clinic-booking-cta')).toHaveAttribute('href', DOCTOR.contact.bookingUrl);
      await expect(page.locator('.clinic-map iframe')).toHaveCount(1);
    }
  });

  test('footer carries the emergency sentence on every page type', async ({ page }) => {
    for (const p of ['/', '/en/about/', '/procedures/icl/', '/en/lens-lab/']) {
      await page.goto(p);
      const lang = p.startsWith('/en/') ? 'en' : 'ar';
      await expect(page.locator('.footer-disclaimer').first()).toContainText(DISCLAIMER[lang].split('. ').at(-1).replace(/\.$/, ''));
    }
  });

  test('cataract page shows the post-operative photograph; lens pages link to the Lens Lab', async ({ page }) => {
    await page.goto('/procedures/cataract-surgery/');
    const img = page.locator('#p-recovery .proc-photo img');
    await expect(img).toHaveAttribute('src', 'images/surgery-phaco.jpg');
    expect((await img.getAttribute('alt')).length).toBeGreaterThan(20);
    await page.goto('/en/procedures/lens-implants/');
    await expect(page.locator('#p-types a[href="en/lens-lab/"]')).toHaveCount(1);
    expect(fs.readFileSync('src/procedures/content.js', 'utf8')).not.toContain('قصو البصر');
  });

  test('/about/ shows the biography, why each credential matters, and no pending facts', async ({ page }) => {
    const registry = JSON.parse(fs.readFileSync('content/internal-registry.json', 'utf8'));
    const pending = registry.facts.filter(f => f.display === 'pending');
    expect(pending.map(f => f.id)).toEqual(expect.arrayContaining(['role-redsea-scientific-council', 'role-sos-former-secretary']));
    for (const lang of ['ar', 'en']) {
      await page.goto(url(lang, 'about'));
      await expect(page.locator('main h1')).toHaveText(DOCTOR.identity.name[lang]);
      await expect(page.locator('.bio-lede')).toBeVisible();
      const text = await page.locator('main').innerText();
      for (const r of DOCTOR.professional.roles) expect(text).toContain(r[lang]);
      for (const q of DOCTOR.professional.qualifications) expect(text).toContain(q[lang]);
      expect(await page.locator('#profile .why').count()).toBeGreaterThanOrEqual(7);
      for (const f of pending) expect(text).not.toContain(f[lang]);
      await expect(page.locator('.about-portrait img')).toHaveAttribute('alt', /.{20,}/);
      expect(text).not.toMatch(/dr-maan-faculty|“|”/); // no conference group photo, no invented quotes
      expect(await page.locator('img[src*="dr-maan-faculty"]').count()).toBe(0);
    }
  });

  test('every public procedure is reachable from the library with its 7 cards and filter', async ({ page }) => {
    await page.goto('/en/procedures/');
    await expect(page.locator('#procedures .proc-card')).toHaveCount(PROCEDURES.length);
    await page.locator('.proc-filter .chip[data-filter="refractive"]').click();
    await expect(page.locator('#procedures .proc-card:visible')).toHaveCount(PROCEDURES.filter(p => p.group === 'refractive').length);
  });
});

test.describe('Feature loaders (src/feature-loaders.js)', () => {
  test('the Lens Lab mounts lazily on /lens-lab/ and follows language and theme', async ({ page }) => {
    await page.goto('/en/lens-lab/');
    const slot = page.locator('#lens-lab-host');
    await slot.scrollIntoViewIfNeeded();
    await expect(page.locator('.feature-lens-lab')).toHaveClass(/is-mounted/, { timeout: 30_000 });
    await expect(slot).not.toHaveAttribute('data-reserve', /.*/);
    await expect(page.locator('.feature-lens-lab .feature-static')).toBeHidden();
    await page.evaluate(() => window.toggleLang());
    await expect(page).toHaveURL(/\/lens-lab\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('.feature-lens-lab')).toHaveClass(/is-mounted/);
    // leaving the page destroys the module
    await page.locator('#site-header a.wordmark').click();
    await expect(page.locator('main')).toHaveAttribute('data-page', 'home');
    await expect(page.locator('#lens-lab-host')).toHaveCount(0);
  });

  test('a missing module shows a written summary with a "coming soon" note, not a blank gap', async ({ page }) => {
    const hasLightJourney = fs.existsSync('src/light-journey/index.js');
    for (const lang of ['ar', 'en']) {
      await page.goto(url(lang, 'how-vision-works'));
      const feature = page.locator('.feature-light-journey');
      await expect(feature.locator('.light-path li')).toHaveCount(4);
      if (hasLightJourney) {
        await page.locator('#light-journey-host').scrollIntoViewIfNeeded();
        await expect(feature).toHaveClass(/is-mounted/, { timeout: 30_000 });
      } else {
        await expect(feature.locator('.feature-soon')).toBeVisible();
        await expect(feature.locator('.light-path')).toBeVisible();
        await expect(page.locator('#light-journey-host')).not.toHaveAttribute('data-reserve', /.*/);
        expect((await page.locator('#light-journey-host').boundingBox())?.height || 0).toBeLessThan(2);
      }
    }
  });

  test('a module that fails to load releases its reservation and offers a retry', async ({ page }) => {
    await page.route(/\/assets\/lens-lab-[^/]+\.js$/, r => r.abort()); // only the Lens Lab chunk fails
    await page.goto('/lens-lab/');
    await page.locator('#lens-lab-host').scrollIntoViewIfNeeded();
    await expect(page.locator('#lens-lab-host .feature-status')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('#lens-lab-host')).not.toHaveAttribute('data-reserve', /.*/);
    await expect(page.locator('.feature-lens-lab .feature-static')).toBeVisible();
    await expect(page.locator('#lens-lab-host [data-feature-retry]')).toBeVisible();
  });
});
