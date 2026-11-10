// The section registry drives routes, breadcrumbs, the sitemap, the prerender list and the menus. These tests prove it, and
// prove feature isolation with a temporary unpublished entry that exists only inside this file: once through the pure
// registry functions, and once in a real client build with the entry injected at build time.
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { build, preview } from 'vite';
import {
  SECTIONS, PUBLISHED, UNPUBLISHED, FEATURES, FEATURE_HOST_SELECTOR, publishedSections, headerNav, drawerNav, footerNav, publishedFeatures, sectionHasFeature, llmsPageLines, validateSections
} from '../section-registry.js';
import { createRouting, PAGES, SECTION_PAGES, ROUTE_PATTERN, pageMeta, pathFor } from '../site-routes.js';
import { PROCEDURES } from '../doctor-data.js';

const draft = (over = {}) => ({
  id: 'future-section', type: 'education', title: { ar: 'قسم قادم', en: 'Future section' }, content: 'future-section', route: 'future-section',
  visibility: UNPUBLISHED, order: 3.5, nav: { label: { ar: 'قادم', en: 'Future' }, header: 3.5, drawer: 3.5, footer: true }, features: ['lens-lab'],
  seo: { title: { ar: 'عنوان', en: 'Title' }, description: { ar: 'وصف', en: 'Description' }, schema: 'MedicalWebPage', ogType: 'article', llms: 'a future section' },
  ...over
});
const withDraft = (over) => [...SECTIONS, draft(over)];
const ids = (list) => list.map((s) => s.id);

test.describe('The registry generates the public site', () => {
  test('the registry is valid and matches the existing 30 pages', () => {
    expect(validateSections()).toEqual([]);
    expect(PAGES).toHaveLength(30);
    expect(SECTION_PAGES.map((s) => s.key)).toEqual(['about', 'procedures', 'lens-lab', 'surgical-education', 'education', 'how-vision-works', 'clinic']);
    expect(new Set(PAGES.map((p) => p.path)).size).toBe(30);
  });

  test('every entry has the required fields', () => {
    for (const s of SECTIONS) {
      for (const k of ['id', 'type', 'title', 'content', 'route', 'visibility', 'order', 'nav', 'features', 'seo']) expect(s, `${s.id}.${k}`).toHaveProperty(k);
      for (const f of s.features) expect(Object.keys(FEATURES)).toContain(f);
    }
  });

  test('the shipped menus keep their order and labels', () => {
    expect(ids(headerNav())).toEqual(['about', 'procedures', 'lens-lab', 'surgical-education', 'education', 'clinic']);
    expect(ids(drawerNav())).toEqual(['home', 'about', 'procedures', 'lens-lab', 'surgical-education', 'how-vision-works', 'education', 'clinic']);
    expect(ids(footerNav())).toEqual(SECTION_PAGES.map((s) => s.key));
  });

  test('the header, drawer and footer rendered on a page are the registry\'s lists', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('#site-header .nav-links a')).toHaveText(headerNav().map((s) => new RegExp(s.nav.label.en.replace(/[&]/g, '\\&'))));
    expect(await page.locator('#mobile-nav .drawer-links a').evaluateAll((a) => a.map((x) => x.dataset.section))).toEqual(ids(drawerNav()));
    expect(await page.locator('.site-footer nav.footer-col a').first().getAttribute('href')).toBeTruthy();
    const footerText = await page.locator('.site-footer nav.footer-col').first().locator('a').allInnerTexts();
    expect(footerText.slice(1).map((t) => t.trim())).toEqual(footerNav().map((s) => s.title.en));
  });

  test('a published entry reaches every generated list, with any number of links (control for the isolation tests)', () => {
    const list = withDraft({ visibility: PUBLISHED });
    const r = createRouting(list);
    expect(validateSections(list)).toEqual([]);
    expect(r.PAGES).toHaveLength(32);
    expect(r.PAGES.map((p) => p.path)).toEqual(expect.arrayContaining(['future-section/', 'en/future-section/']));
    expect(ids(headerNav(list))).toContain('future-section');
    expect(ids(drawerNav(list))).toContain('future-section');
    expect(ids(footerNav(list))).toContain('future-section');
    expect(r.ROUTE_PATTERN).toContain('future\\-section');
    expect(r.parseRoute('en/future-section/')).toEqual({ lang: 'en', slug: null, page: 'future-section', known: true });
    expect(r.splitPath('/sub/future-section/')).toEqual({ root: '/sub/', rel: 'future-section/' });
    expect(r.breadcrumbFor('ar', null, 'future-section').map((c) => c.name)).toEqual(['الرئيسية', 'قسم قادم']);
    expect(r.pageMeta('en', null, 'future-section').title).toBe('Title');
    expect(llmsPageLines(list)).toContain('- /future-section/ — a future section');
    expect(sectionHasFeature('future-section', 'lens-lab', list)).toBe(true);
  });

  test('route may differ from id, and the order of the header follows the registry', () => {
    const list = withDraft({ visibility: PUBLISHED, id: 'guides', route: 'patient-guides', nav: { label: { ar: 'أدلة', en: 'Guides' }, header: 0.5 } });
    const r = createRouting(list);
    expect(r.pathFor('en', null, 'guides')).toBe('en/patient-guides/');
    expect(r.parseRoute('patient-guides/').page).toBe('guides');
    expect(ids(headerNav(list))[0]).toBe('guides');
  });

  test('malformed entries are reported', () => {
    const bad = (over) => validateSections(withDraft(over));
    expect(bad({ id: 'about' }).join()).toContain('duplicate id');
    expect(bad({ route: 'about' }).join()).toContain('duplicate route');
    expect(bad({ route: 'Bad Route' }).join()).toContain('invalid route');
    expect(bad({ route: 'en' }).join()).toContain('reserved');
    expect(bad({ route: 'procedures/x' }).join()).toContain('reserved');
    expect(bad({ visibility: 'draft' }).join()).toContain('visibility');
    expect(bad({ title: { ar: 'x' } }).join()).toContain('title');
    expect(bad({ features: ['nope'] }).join()).toContain('unknown feature');
    expect(bad({ visibility: PUBLISHED, seo: {} }).join()).toContain('seo.title');
    expect(bad({ seo: {} })).toEqual([]); // a draft may still be missing its SEO text
  });

  test('every module host in the markup is covered by the registry selector', () => {
    expect(FEATURE_HOST_SELECTOR.split(', ').sort()).toEqual(['[data-lens-lab-host]', '[data-light-journey-host]', '[data-vision-host]']);
  });
});

test.describe('An unpublished section is isolated', () => {
  const list = withDraft();
  const real = createRouting();
  const r = createRouting(list);

  test('it is valid, but absent from every generated list', () => {
    expect(validateSections(list)).toEqual([]);
    expect(ids(publishedSections(list))).toEqual(ids(publishedSections()));
    expect(ids(headerNav(list))).toEqual(ids(headerNav()));
    expect(ids(drawerNav(list))).toEqual(ids(drawerNav()));
    expect(ids(footerNav(list))).toEqual(ids(footerNav()));
    expect(r.PAGES).toEqual(real.PAGES); // sitemap + prerender list
    expect(r.SECTION_PAGES).toEqual(real.SECTION_PAGES);
    expect(llmsPageLines(list)).toEqual(llmsPageLines());
    expect(r.ROUTE_PATTERN).toBe(real.ROUTE_PATTERN);
    expect(r.ROUTE_PATTERN).not.toContain('future');
  });

  test('its URL is treated like any unknown URL, with no metadata', () => {
    expect(r.parseRoute('future-section/')).toEqual({ lang: 'ar', slug: null, page: 'home', known: false });
    expect(r.parseRoute('en/future-section/')).toEqual({ lang: 'en', slug: null, page: 'home', known: false });
    expect(r.splitPath('/future-section/')).toEqual(real.splitPath('/future-section/'));
    expect(r.breadcrumbFor('en', null, 'future-section')).toEqual([]);
    expect(r.pageMeta('en', null, 'future-section')).toEqual(pageMeta('en'));
  });

  test('a link written to it cannot be a dead link', () => {
    expect(r.pathFor('ar', null, 'future-section')).toBe('');
    expect(r.pathFor('en', null, 'future-section')).toBe('en/');
  });

  test('it contributes no module', () => {
    const only = withDraft({ features: ['cataract-3d'], nav: {} }).map((s) => (s.id === 'future-section' ? s : { ...s, features: s.features.filter((f) => f !== 'cataract-3d') }));
    expect(publishedFeatures(only)).not.toContain('cataract-3d');
    expect(sectionHasFeature('future-section', 'lens-lab', list)).toBe(false);
  });

  test.describe('in a real build with the entry injected', () => {
    test.describe.configure({ mode: 'serial', timeout: 120_000 });
    let server, base, outDir;

    test.beforeAll(async ({}, testInfo) => {
      outDir = testInfo.outputPath('registry-fixture');
      const inject = {
        name: 'inject-unpublished-section', enforce: 'pre',
        transform(code, id) {
          if (!id.replace(/\\/g, '/').endsWith('/section-registry.js')) return null;
          return code.replace('export const SECTIONS = [', `export const SECTIONS = [${JSON.stringify(draft())},`);
        }
      };
      const root = path.resolve('.');
      await build({ root, logLevel: 'silent', plugins: [inject], build: { outDir, emptyOutDir: true } });
      server = await preview({ root, logLevel: 'silent', build: { outDir }, preview: { port: 0, host: '127.0.0.1' } });
      base = server.resolvedUrls.local[0];
    });
    test.afterAll(async () => {
      if (server) await new Promise((r) => server.httpServer.close(r));
      if (outDir) fs.rmSync(outDir, { recursive: true, force: true });
    });

    test('the bundle really contains the entry, and the sitemap does not', async () => {
      const assets = fs.readdirSync(path.join(outDir, 'assets')).filter((f) => f.endsWith('.js'));
      expect(assets.some((f) => fs.readFileSync(path.join(outDir, 'assets', f), 'utf8').includes('future-section'))).toBe(true);
      expect(fs.readFileSync(path.join(outDir, 'sitemap.xml'), 'utf8')).not.toContain('future-section');
      expect(fs.readFileSync(path.join(outDir, 'llms.txt'), 'utf8')).not.toContain('future-section');
      expect(fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')).not.toContain('future\\-section');
    });

    test('menus, footer and links stay the same, and nothing extra is requested', async ({ page }) => {
      const requests = [];
      page.on('request', (r) => { if (r.url().startsWith(base)) requests.push(r.url()); });
      const errors = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      await page.goto(`${base}en/`);
      await expect(page.locator('#site-header .nav-links a')).toHaveCount(headerNav().length);
      await expect(page.locator('#mobile-nav .drawer-links a')).toHaveCount(drawerNav().length);
      expect(await page.locator('.site-footer nav.footer-col').first().locator('a').count()).toBe(footerNav().length + 1);
      expect(await page.locator('a[href*="future-section"], [data-section="future-section"]').count()).toBe(0);
      await expect(page.locator('body')).not.toContainText(/Future section/);
      expect(requests.filter((u) => /lens-lab|pipeline|three|cataract-sim|future-section/.test(u))).toEqual([]);
      expect(errors).toEqual([]);
    });

    test('its URL behaves like any unknown URL', async ({ page }) => {
      const errors = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      const visit = async (rel) => {
        await page.goto(`${base}${rel}`);
        return { title: await page.title(), main: await page.locator('main').count(), body: await page.locator('body').innerText() };
      };
      const draftUrl = await visit('en/future-section/');
      const unknownUrl = await visit('en/some-other-unknown/');
      expect(draftUrl).toEqual(unknownUrl);
      expect(draftUrl.body).not.toContain('Future section');
      expect(errors).toEqual([]);
    });
  });
});

test.describe('Generated artefacts agree with the registry', () => {
  test('llms.txt lists the published pages, from the registry', async ({ request }) => {
    const llms = await (await request.get('/llms.txt')).text();
    for (const line of llmsPageLines()) expect(llms).toContain(line);
  });

  test('prerendered pages carry the type and social card the registry names', async ({ request }) => {
    for (const s of SECTION_PAGES) {
      const html = await (await request.get(`/en/${s.route}/`)).text();
      expect(html, s.key).toContain(`<meta property="og:type" content="${s.ogType}">`);
      expect(html, s.key).toContain(`"@type": "${s.schema}"`);
    }
    const proc = await (await request.get(`/procedures/${PROCEDURES[0].slug}/`)).text();
    expect(proc).toContain('<meta property="og:type" content="article">');
  });

  test('pathFor builds the documented shapes', () => {
    expect(pathFor('ar')).toBe('');
    expect(pathFor('en')).toBe('en/');
    expect(pathFor('ar', null, 'about')).toBe('about/');
    expect(pathFor('en', 'icl')).toBe('en/procedures/icl/');
  });

  test('no route was added: the expected pattern, in the built page', () => {
    expect(ROUTE_PATTERN).toBe('(?:en\\/)?(?:(?:procedures\\/[a-z0-9-]+|about|procedures|lens\\-lab|surgical\\-education|education|how\\-vision\\-works|clinic)\\/?)?(?:index\\.html)?');
  });
});
