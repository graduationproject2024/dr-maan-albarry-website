// Phase 0 — doctor data & medical content integrity.
// Runs against the production build (see playwright.config.js).
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { DOCTOR, FAQ, isPublishableTestimonial } from '../doctor-data.js';

const C = DOCTOR.contact;
const APPROVED_TEL = new Set([C.callCenter.tel, C.callCenterShort.tel]);
// `prefers-*` CSS media features (prefers-color-scheme, prefers-reduced-motion) are code, not claims.
const PREFERENCE = /\bprefer(red|s)?\b(?![-\w])|favou?r(ed|s|ite)?\b|clinically (preferred|favou?red)|المفضل|يفضل|يفضّل|الخيار المفضل|المفضل سريري/i;
const UNSUPPORTED_STATS = /15[,.]?000|\+\s?15|100\s?%\s*(التزام|adherence)|التزام طبي وفق بروتوكولات|Adherence to Diagnostic Protocols/i;
const LICENCE = /الهيئة السعودية للتخصصات الصحية|Saudi Commission for Health Specialties|Board[- ]Certified|Saudi Board|الترخيص الاستشاري|البورد/i;
const TESTIMONIAL_PLACEHOLDER = /pending final administrative confirmation|تخضع للمراجعة والتأكيد النهائي|Illustrative feedback|★★★★★/;
const INCISION = /2[.,]2\s?(mm|ملم|مم)/i;

async function open(page, lang) {
  await page.goto('/');
  if (lang === 'en') await page.evaluate(() => window.toggleLang());
  await expect(page.locator('html')).toHaveAttribute('lang', lang);
}

/** Visible page text plus text that only appears after interaction (every simulator lens, questionnaire result). */
async function fullText(page) {
  const chunks = [await page.locator('body').innerText()];
  for (const lens of ['edof', 'trifocal', 'monofocal', 'cataract']) {
    await page.locator(`[data-lens="${lens}"]`).click();
    chunks.push(await page.locator('#vs-root').innerText());
  }
  await page.evaluate(() => {
    for (let i = 0; i < 4; i++) { window.selectQOption(0); window.nextQStep(); }
  });
  chunks.push(await page.locator('#questionnaire').innerText());
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
      expect(C.clinicDirect).toBeNull(); // unconfirmed number stays out of public code
      expect(await page.content()).not.toContain('554946433');
      const bookingHrefs = await page.$$eval('[data-cta="book"]', as => as.map(a => a.href));
      expect(bookingHrefs.length).toBeGreaterThanOrEqual(3);
      for (const h of bookingHrefs) expect(h).toBe(C.bookingUrl);
    });

    test('no unsupported claims: stats, licence, testimonials, lens preference, incision size', async ({ page }) => {
      await open(page, lang);
      const text = await fullText(page);
      expect(text).not.toMatch(UNSUPPORTED_STATS);
      expect(text).not.toMatch(LICENCE);
      expect(text).not.toMatch(TESTIMONIAL_PLACEHOLDER);
      expect(text).not.toMatch(PREFERENCE);
      expect(text).not.toMatch(INCISION);
      await expect(page.locator('.review-card, .review-stars, .iol-favored-badge, .iol-card-favored')).toHaveCount(0);
    });

    test('professional roles render exactly as the central data states', async ({ page }) => {
      await open(page, lang);
      const timeline = await page.$$eval('#profile .timeline-item h4', els => els.map(e => e.textContent.trim()));
      expect(timeline).toEqual(DOCTOR.professional.roles.map(r => r[lang]));
      const text = await page.locator('body').innerText();
      expect(text).not.toMatch(/Chief Medical Officer|Senior Consultant|المدير الطبي التنفيذي/);
      await expect(page.locator('.hero-specialty-subtitle')).toHaveText(DOCTOR.identity.title[lang]);
    });

    test('clinic hours are not stated until approved', async ({ page }) => {
      await open(page, lang);
      const clinic = await page.locator('#clinic').innerText();
      expect(DOCTOR.clinic.workingHours).toBeNull();
      expect(clinic).not.toMatch(/9:00|9:30|1:00|5:00|٩|21:00/);
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
    expect(raw).not.toMatch(/openingHours|aggregateRating|priceRange|554946433|المدير الطبي التنفيذي|Saudi Board/);

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
    expect(txt).not.toMatch(/554946433|15,000|Chief Medical Officer|26\+ years|9:00|21:00/);
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
      expect(body, f).not.toMatch(/الهيئة السعودية للتخصصات الصحية|Board-Certified|554946433|2\.2 ?(mm|ملم)|Rakan|راكان|Maya Ahmed|مايا أحمد|الشراحيلي/);
    }
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
    expect(DOCTOR.credibility.statistics).toEqual([]);
  });
});
