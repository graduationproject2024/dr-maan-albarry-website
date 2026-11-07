// Phase 0 — doctor data & medical content integrity.
// Runs against the production build (see playwright.config.js).
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { DOCTOR, FAQ, isPublishableTestimonial } from '../doctor-data.js';

const C = DOCTOR.contact;
const APPROVED_TEL = new Set([C.callCenter.tel, C.callCenterShort.tel, C.clinicDirect.tel]);
// `prefers-*` CSS media features (prefers-color-scheme, prefers-reduced-motion) are code, not claims.
const PREFERENCE = /\bprefer(red|s)?\b(?![-\w])|favou?r(ed|s|ite)?\b|clinically (preferred|favou?red)|المفضل|يفضل|يفضّل|الخيار المفضل|المفضل سريري/i;
// 15,000+ is now a doctor-confirmed statistic (content/internal-registry.json); 100% stays internal-only.
const UNSUPPORTED_STATS = /100\s?%\s*(التزام|adherence)|التزام طبي وفق بروتوكولات|Adherence to Diagnostic Protocols/i;
// Saudi Board is a confirmed qualification; a licence/SCFHS classification statement is still unsupplied.
const LICENCE = /الهيئة السعودية للتخصصات الصحية|Saudi Commission for Health Specialties|Board[- ]Certified|الترخيص الاستشاري/i;
const TESTIMONIAL_PLACEHOLDER = /pending final administrative confirmation|تخضع للمراجعة والتأكيد النهائي|Illustrative feedback|★★★★★/;
const INCISION = /2[.,]2\s?(mm|ملم|مم)/i;

async function open(page, lang) {
  await page.goto('/');
  if (lang === 'en') await page.evaluate(() => window.toggleLang());
  await expect(page.locator('html')).toHaveAttribute('lang', lang);
}

/** Visible page text plus text that only appears after interaction (every simulator lens, questionnaire result).
 *  Since Phase 1 the simulator lives on /lens-lab/ and the questionnaire on /education/: both are visited, so the
 *  same claims are checked on the same content as before, plus every new page. */
async function fullText(page, lang) {
  const chunks = [await page.locator('body').innerText()];
  const pre = lang === 'en' ? '/en/' : '/';
  for (const key of ['about/', 'procedures/', 'surgical-education/', 'how-vision-works/', 'clinic/']) {
    await page.goto(pre + key);
    await page.locator('main h1').waitFor();
    chunks.push(await page.locator('body').innerText());
  }
  await page.goto(pre + 'lens-lab/');
  await page.locator('#lens-lab-host').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('.feature-lens-lab.is-mounted'), null, { timeout: 20_000 });
  chunks.push(await page.locator('main').innerText());
  await page.locator('#simulator-host').scrollIntoViewIfNeeded();
  await page.locator('#simulator-host .vsim').waitFor({ timeout: 20_000 });
  for (const lens of ['edof', 'trifocal', 'monofocal', 'toric', 'cataract']) {
    await page.locator(`#simulator-host input[data-group="lensA"][value="${lens}"] + label`).click();
    await expect(page.locator(`#simulator-host input[data-group="lensA"][value="${lens}"]`)).toBeChecked();
    chunks.push(await page.locator('#simulator-host .vsim').innerText());
  }
  await page.goto(pre + 'education/');
  await page.locator('#questionnaire').waitFor();
  chunks.push(await page.locator('main').innerText());
  // every summary variant (the result is answer-driven again since Phase 1)
  for (const answers of [[0, 0, 0, 0], [1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 4, 1, 3]]) {
    await page.evaluate(a => { window.restartQ(); for (const i of a) { window.selectQOption(i); window.nextQStep(); } }, answers);
    chunks.push(await page.locator('#questionnaire').innerText());
  }
  return chunks.join('\n');
}

for (const lang of ['ar', 'en']) {
  test.describe(`Phase 0 content — ${lang}`, () => {
    test('contact links come only from approved central data', async ({ page }) => {
      await open(page, lang);
      const hrefs = await page.$$eval('a[href^="tel:"], a[href*="wa.me"]', as => as.map(a => a.getAttribute('href')));
      expect(hrefs.length).toBeGreaterThan(3);
      for (const h of hrefs) {
        if (h.startsWith('tel:')) expect(APPROVED_TEL.has(h.slice(4)), h).toBe(true);
        else expect(h, h).toContain(`wa.me/${C.whatsapp.number}?`);
      }
      const text = await page.locator('body').innerText();
      // the doctor-approved direct line is offered for both calls and WhatsApp
      expect(C.clinicDirect.roles).toEqual(['call', 'whatsapp']);
      expect(hrefs).toContain(`tel:${C.clinicDirect.tel}`);
      expect(C.whatsapp.number).toBe(C.clinicDirect.tel.replace('+', ''));
      expect(await page.content()).not.toContain('508533309'); // replaced Magrabi WhatsApp line
      const bookingHrefs = await page.$$eval('[data-cta="book"]', as => as.map(a => a.href));
      expect(bookingHrefs.length).toBeGreaterThanOrEqual(3);
      for (const h of bookingHrefs) expect(h).toBe(C.bookingUrl);
    });

    test('no unsupported claims: stats, licence, testimonials, lens preference, incision size', async ({ page }) => {
      await open(page, lang);
      const text = await fullText(page, lang);
      expect(text).not.toMatch(UNSUPPORTED_STATS);
      expect(text).not.toMatch(LICENCE);
      expect(text).not.toMatch(TESTIMONIAL_PLACEHOLDER);
      expect(text).not.toMatch(PREFERENCE);
      expect(text).not.toMatch(INCISION);
      await expect(page.locator('.review-card, .review-stars, .iol-favored-badge, .iol-card-favored')).toHaveCount(0);
    });

    test('professional roles render exactly as the central data states', async ({ page }) => {
      // full role wording on the physician profile (Phase 1); the homepage ledger uses the registry's short forms
      await page.goto(lang === 'en' ? '/en/about/' : '/about/');
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      const timeline = await page.$$eval('#profile .timeline-item h4', els => els.map(e => e.textContent.trim()));
      expect(timeline).toEqual(DOCTOR.professional.roles.map(r => r[lang]));
      const text = await page.locator('body').innerText();
      expect(text).not.toMatch(/Chief Medical Officer|Senior Consultant|المدير الطبي التنفيذي/);
      await open(page, lang);
      const homeTimeline = await page.$$eval('#profile .timeline-item h4', els => els.map(e => e.textContent.trim()));
      expect(homeTimeline).toEqual(DOCTOR.professional.roles.map(r => (lang === 'ar' ? (r.shortAr || r.ar) : (r.shortEn || r.en))));
      expect(await page.locator('body').innerText()).not.toMatch(/Chief Medical Officer|Senior Consultant|المدير الطبي التنفيذي/);
      await expect(page.locator('.hero-specialty-subtitle')).toHaveText(DOCTOR.identity.title[lang]);
    });

    test('doctor-confirmed clinic hours are shown in the clinic section', async ({ page }) => {
      await open(page, lang);
      const clinic = await page.locator('#clinic').innerText();
      expect(DOCTOR.clinic.workingHours.source).toBe('doctor');
      expect(clinic).toContain(DOCTOR.clinic.workingHours[lang]);
    });
  });
}

test.describe('Phase 0 structured data & llms.txt', () => {
  test('JSON-LD parses and mirrors the visible page', async ({ page }) => {
    await open(page, 'ar');
    const blocks = await page.$$eval('script[type="application/ld+json"]', s => s.map(x => x.textContent));
    expect(blocks).toHaveLength(1);
    const ld = JSON.parse(blocks[0]);
    const types = [];
    (function walk(o) {
      if (Array.isArray(o)) return o.forEach(walk);
      if (o && typeof o === 'object') { if (o['@type']) types.push(o['@type']); Object.values(o).forEach(walk); }
    })(ld);
    expect(types).not.toContain('Review');
    expect(types).not.toContain('AggregateRating');
    expect(types).not.toContain('BreadcrumbList');
    const raw = blocks[0];
    expect(raw).not.toMatch(/aggregateRating|priceRange|508533309|المدير الطبي التنفيذي|Adherence/);
    expect(raw).toContain(C.clinicDirect.tel);
    expect(raw).toContain('Saudi Board in Ophthalmology');
    expect(raw).toMatch(/"opens":\s*"17:00"/);

    const physician = ld['@graph'].find(n => n['@type'] === 'Physician');
    expect(physician.telephone).toBe(C.callCenter.tel);
    await expect(page.locator(`a[href="tel:${physician.telephone}"]`).first()).toBeAttached();
    expect(physician.jobTitle).toBe((await page.locator('.hero-specialty-subtitle').innerText()).trim());

    const faq = ld['@graph'].find(n => n['@type'] === 'FAQPage');
    const visibleQ = await page.$$eval('#faq .faq-question > span:first-child', s => s.map(x => x.textContent.trim()));
    expect(faq.mainEntity.map(q => q.name)).toEqual(visibleQ);
    // Each answer text is present in the visible FAQ
    const visibleA = await page.$$eval('#faq .faq-answer p', s => s.map(x => x.textContent.trim()));
    expect(faq.mainEntity.map(q => q.acceptedAnswer.text)).toEqual(visibleA);
    expect(visibleQ).toEqual(FAQ.map(f => f.q.ar));
  });

  test('llms.txt is generated from central data and free of removed claims', async ({ request }) => {
    const res = await request.get('/llms.txt');
    expect(res.ok()).toBe(true);
    const txt = await res.text();
    for (const r of DOCTOR.professional.roles) expect(txt).toContain(r.en);
    expect(txt).toContain(C.callCenter.display);
    expect(txt).toContain(C.whatsapp.number);
    expect(txt).toContain(C.bookingUrl);
    expect(txt).not.toMatch(PREFERENCE);
    expect(txt).not.toMatch(/508533309|Chief Medical Officer|26\+ years|Adherence|100%/);
    expect(txt).toContain(C.clinicDirect.tel);
    expect(txt).toContain('15,000+ eye examinations & surgical procedures');
    expect(txt).toContain(DOCTOR.clinic.workingHours.en);
  });

  test('generated build output contains no obsolete claims', () => {
    const dist = path.resolve('dist');
    const files = [];
    (function walk(d) {
      for (const f of fs.readdirSync(d)) {
        const p = path.join(d, f);
        if (fs.statSync(p).isDirectory()) walk(p);
        else if (/\.(html|js|txt|webmanifest|xml|css)$/.test(f)) files.push(p);
      }
    })(dist);
    expect(files.length).toBeGreaterThan(4);
    for (const f of files) {
      const body = fs.readFileSync(f, 'utf8');
      expect(body, f).not.toMatch(PREFERENCE);
      expect(body, f).not.toMatch(/الهيئة السعودية للتخصصات الصحية|Board-Certified|508533309|Adherence to Diagnostic|التزام طبي وفق|2\.2 ?(mm|ملم)|Rakan|راكان|Maya Ahmed|مايا أحمد|الشراحيلي/);
    }
  });
});

test.describe('Phase 0 testimonial rendering (records injected into the built bundle)', () => {
  const inject = async (page, records) => {
    await page.route(/\/assets\/index-[^/]+\.js$/, async route => {
      const res = await route.fetch();
      const body = await res.text();
      const marker = 'testimonials:[]';
      expect(body).toContain(marker);
      await route.fulfill({ response: res, body: body.replace(marker, `testimonials:${JSON.stringify(records)}`) });
    });
  };
  const valid = { source: { url: 'https://example.org/review/1' }, permission: { documented: true, reference: 'consent-test' }, attribution: 'Test Patient', approvedText: { ar: 'نص معتمد للاختبار', en: 'Approved test text' } };

  test('a fully documented testimonial renders with its source link', async ({ page }) => {
    await inject(page, [valid]);
    await open(page, 'en');
    const card = page.locator('#testimonials .review-card');
    await expect(card).toHaveCount(1);
    await expect(card).toContainText('Approved test text');
    await expect(card.locator('a')).toHaveAttribute('href', valid.source.url);
    await expect(page.locator('.review-stars')).toHaveCount(0);
  });

  test('records missing permission or source never render', async ({ page }) => {
    await inject(page, [
      { ...valid, permission: { documented: false, reference: 'x' } },
      { ...valid, source: { url: '' } }
    ]);
    await open(page, 'ar');
    await expect(page.locator('#testimonials, .review-card')).toHaveCount(0);
  });
});

test.describe('Phase 0 testimonial publication gate', () => {
  test('rejects records without source, permission, attribution or approved text', () => {
    const ok = { source: { url: 'https://example.org/r/1' }, permission: { documented: true, reference: 'consent-2026-001' }, attribution: 'Patient', approvedText: { ar: 'نص' } };
    expect(isPublishableTestimonial(ok)).toBe(true);
    expect(isPublishableTestimonial({ ...ok, source: { url: '' } })).toBe(false);
    expect(isPublishableTestimonial({ ...ok, permission: { documented: false, reference: 'x' } })).toBe(false);
    expect(isPublishableTestimonial({ ...ok, permission: { documented: true } })).toBe(false);
    expect(isPublishableTestimonial({ ...ok, attribution: ' ' })).toBe(false);
    expect(isPublishableTestimonial({ ...ok, approvedText: {} })).toBe(false);
    expect(DOCTOR.credibility.testimonials.every(isPublishableTestimonial)).toBe(true);
    // Statistics are published only when confirmed, sourced and carrying a defined meaning in both languages
    // (15,000+ was confirmed by Dr. Maan on 2026-11-01 — see content/internal-registry.json).
    for (const s of DOCTOR.credibility.statistics) {
      expect(s.status, s.id).toBe('confirmed');
      expect(s.source, s.id).toBe('doctor');
      expect(s.scope, s.id).toBeTruthy();
      expect(s.label.ar && s.label.en, s.id).toBeTruthy();
    }
  });
});
