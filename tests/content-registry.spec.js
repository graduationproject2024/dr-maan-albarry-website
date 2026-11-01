// Protected doctor content: every fact the registry marks `public` must stay in
// doctor-data.js and on the rendered page (AR + EN); every `internal` fact must
// never reach the built output. Guards against silent deletion or rewording.
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { DOCTOR } from '../doctor-data.js';

const registry = JSON.parse(fs.readFileSync(path.resolve('content/internal-registry.json'), 'utf8'));
const byId = id => registry.facts.find(f => f.id === id);
const stat = DOCTOR.credibility.statistics.find(s => s.id === 'cases-15000');
const role = id => DOCTOR.professional.roles.find(r => r.id === id);
const qual = id => DOCTOR.professional.qualifications.find(q => q.id === id);

/** What each public registry fact must look like, in both languages, on the page. */
const RENDERED = {
  'experience-since-1998': { ar: ['1998'], en: ['1998'] },
  'cases-15000': { ar: [stat.value, stat.label.ar], en: [stat.value, stat.label.en] },
  'role-chief-of-staff': { ar: [role('magrabi-chief').shortAr], en: [role('magrabi-chief').shortEn] },
  'role-sscc-first-president': { ar: [role('sscc-president').shortAr], en: [role('sscc-president').shortEn] },
  'role-taibah-chair': { ar: ['جامعة طيبة'], en: ['Taibah'] },
  'role-sos-rep': { ar: [role('sos-rep').ar], en: [role('sos-rep').en] },
  'role-redsea-cofounder': { ar: [role('redsea').ar], en: [role('redsea').en] },
  'qual-frcs': { ar: ['FRCS'], en: ['FRCS'] },
  'qual-saudi-board': { ar: [qual('saudi-board').ar], en: [qual('saudi-board').en] },
  'rank-associate-professor': { ar: [DOCTOR.professional.academicRank.ar], en: [DOCTOR.professional.academicRank.en] },
  'contact-clinic-direct': { ar: [DOCTOR.contact.clinicDirect.display], en: [DOCTOR.contact.clinicDirect.display] },
  'contact-magrabi-callcenter': { ar: [DOCTOR.contact.callCenter.display], en: [DOCTOR.contact.callCenter.display] },
  'clinic-hours': { ar: [DOCTOR.clinic.workingHours.ar], en: [DOCTOR.clinic.workingHours.en] }
};

test.describe('Protected doctor content registry', () => {
  test('every public registry fact has a rendering contract and correct data', () => {
    const pub = registry.facts.filter(f => f.display === 'public').map(f => f.id).sort();
    expect(pub).toEqual(Object.keys(RENDERED).sort());
    expect(DOCTOR.professional.experienceSince).toBe(byId('experience-since-1998').expect);
    expect(stat.value).toBe(byId('cases-15000').expect);
    expect(DOCTOR.contact.clinicDirect.tel).toBe(byId('contact-clinic-direct').expect);
    for (const f of registry.facts.filter(f => f.source === 'doctor')) expect(f.status, f.id).toBe('confirmed');
  });

  test('15,000+ keeps its confirmed combined meaning in both languages', () => {
    expect(stat.source).toBe('doctor');
    expect(stat.label.ar).toMatch(/فحص/);
    expect(stat.label.ar).toMatch(/جراح/);
    expect(stat.label.en).toMatch(/examinations/i);
    expect(stat.label.en).toMatch(/surgical procedures/i);
    expect(`${stat.label.ar} ${stat.label.en}`).not.toMatch(/success|نجاح|patients|مريض|عملية ناجحة/i);
  });

  for (const lang of ['ar', 'en']) {
    test(`all public facts are rendered on the page — ${lang}`, async ({ page }) => {
      await page.addInitScript(l => { try { localStorage.setItem('lang', l); } catch (e) { /* ignore */ } }, lang);
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      const text = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
      for (const [id, want] of Object.entries(RENDERED)) {
        for (const s of want[lang]) expect(text, `${id} (${lang}) missing: ${s}`).toContain(s.replace(/\s+/g, ' '));
      }
      // direct line offered for calls and WhatsApp
      await expect(page.locator(`a[href="tel:${DOCTOR.contact.clinicDirect.tel}"]`).first()).toBeAttached();
      await expect(page.locator(`a[href*="wa.me/${DOCTOR.contact.whatsapp.number}"]`).first()).toBeAttached();
    });
  }

  test('internal-only facts never reach the built output', () => {
    const internal = registry.facts.filter(f => f.display === 'internal' && f.forbiddenPattern);
    expect(internal.length).toBeGreaterThan(0);
    const files = [];
    (function walk(d) {
      for (const f of fs.readdirSync(d)) {
        const p = path.join(d, f);
        if (fs.statSync(p).isDirectory()) walk(p);
        else if (/\.(html|js|txt|xml|css|json)$/.test(f)) files.push(p);
      }
    })(path.resolve('dist'));
    for (const fact of internal) {
      const re = new RegExp(fact.forbiddenPattern, 'i');
      for (const f of files) expect(fs.readFileSync(f, 'utf8'), `${fact.id} in ${f}`).not.toMatch(re);
    }
    for (const f of files) expect(fs.readFileSync(f, 'utf8'), f).not.toContain('internal-registry');
  });
});
