// SEO: prerendered localized HTML, routes that really exist, and metadata that agrees
// across canonical / hreflang / sitemap / robots.
import { test, expect } from '@playwright/test';
import { DOCTOR, PROCEDURES } from '../doctor-data.js';
import { PAGES, SECTION_PAGES } from '../site-routes.js';

test.describe('SEO — prerendered routes', () => {
  for (const [route, lang, dir] of [['/', 'ar', 'rtl'], ['/en/', 'en', 'ltr']]) {
    test(`${route} serves real content without JavaScript (${lang})`, async ({ browser }) => {
      const ctx = await browser.newContext({ javaScriptEnabled: false });
      const page = await ctx.newPage();
      const res = await page.goto(route);
      expect(res.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('html')).toHaveAttribute('dir', dir);
      await expect(page.locator('h1')).toHaveText(DOCTOR.identity.name[lang]);
      const text = await page.locator('body').innerText();
      for (const s of [DOCTOR.credibility.statistics[0].label[lang], DOCTOR.clinic.workingHours[lang], DOCTOR.contact.clinicDirect.display]) expect(text).toContain(s);
      expect(await page.locator('#faq .faq-question').count()).toBeGreaterThanOrEqual(6);
      await ctx.close();
    });
  }

  test('/en/ boots in English with working assets and no errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    page.on('requestfailed', r => errors.push('REQFAIL ' + r.url()));
    await page.goto('/en/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('h1.hero-title')).toHaveText(DOCTOR.identity.name.en);
    expect(await page.$$eval('img', imgs => imgs.filter(i => i.complete && i.naturalWidth === 0 && i.loading !== 'lazy').length)).toBe(0);
    expect(errors).toEqual([]);
  });

  test('canonical, hreflang, sitemap and robots agree and only list existing routes', async ({ page, request }) => {
    await page.goto('/');
    const canonAr = await page.locator('link[rel="canonical"]').getAttribute('href');
    const alts = Object.fromEntries(await page.$$eval('link[rel="alternate"][hreflang]', ls => ls.map(l => [l.hreflang, l.href])));
    expect(alts.ar).toBe(canonAr);
    expect(alts['x-default']).toBe(canonAr);
    expect(alts.en).toBe(new URL('en/', canonAr).href);
    const enHtml = await (await request.get('/en/')).text();
    expect(enHtml).toContain(`<link rel="canonical" href="${alts.en}">`);
    const sitemap = await (await request.get('/sitemap.xml')).text();
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    // 30 real pages: per language the home, the 7 Phase 1 section pages and the 7 procedure pages
    // (site-routes.js PAGES); every one must exist, see the loop below.
    expect(locs).toEqual(expect.arrayContaining([alts.ar, alts.en]));
    expect(locs[0]).toBe(alts.ar);
    expect(locs).toHaveLength(PAGES.length);
    expect(PAGES.length).toBe(30);
    expect(new Set(locs).size).toBe(30);
    for (const s of SECTION_PAGES) {
      expect(locs).toContain(new URL(`${s.key}/`, alts.ar).href);
      expect(locs).toContain(new URL(`en/${s.key}/`, alts.ar).href);
    }
    for (const slug of PROCEDURES.map(p => p.slug)) {
      expect(locs).toContain(new URL(`procedures/${slug}/`, alts.ar).href);
      expect(locs).toContain(new URL(`en/procedures/${slug}/`, alts.ar).href);
    }
    expect(sitemap).not.toContain('#');
    for (const loc of locs) {
      const path = new URL(loc).pathname; // must exist on this server
      expect((await request.get(path === '/' ? '/' : path)).status(), loc).toBe(200);
    }
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toContain(`Sitemap: ${new URL('sitemap.xml', canonAr).href}`);
  });
});
