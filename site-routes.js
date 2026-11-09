// ============================================================
// ROUTE TABLE — shared by the app (main.js), the build (vite.config.js) and the
// prerenderer (scripts/prerender.mjs), so URLs, titles and descriptions never drift.
// The sections themselves are listed in section-registry.js; everything here is generated from that list.
//
// Paths are RELATIVE TO THE SITE ROOT (no leading slash), because the site is served
// both from a domain root and from a GitHub Pages subpath (/dr-maan-albarry-website/):
//   ''                           Arabic home
//   'en/'                        English home
//   '<page>/'                    Arabic section page (about, procedures, lens-lab, …)
//   'en/<page>/'                 English section page
//   'procedures/<slug>/'         Arabic procedure page
//   'en/procedures/<slug>/'      English procedure page
// ============================================================
import { DOCTOR, PROCEDURES, procedureBySlug } from './doctor-data.js';
import { SECTIONS, sectionPages, homeSection } from './section-registry.js';

export const LANGS = ['ar', 'en'];

const escapeRoute = r => r.replace(/-/g, '\\-').replace(/\//g, '\\/');

/**
 * Everything derived from a section list. The site uses the real list (below); tests pass a list with a temporary
 * entry to prove what a future section would and would not change, without shipping one.
 */
export function createRouting(sections = SECTIONS) {
  /** Published section pages. Order = sitemap and footer order. `crumb` is the page's name; `title`/`description` feed <title>, meta and Open Graph. */
  const SECTION_PAGES = sectionPages(sections).map(s => ({
    key: s.id, route: s.route, crumb: s.title, title: s.seo.title, description: s.seo.description, schema: s.seo.schema, ogType: s.seo.ogType
  }));
  const SECTION_KEYS = SECTION_PAGES.map(p => p.key);
  const sectionPage = key => SECTION_PAGES.find(p => p.key === key) || null;
  const home = homeSection(sections);

  /**
   * Site-root-relative path of a page.
   *   pathFor(lang)                    home
   *   pathFor(lang, slug)              procedure page
   *   pathFor(lang, null, pageKey)     section page (a key that is not published resolves to home, so it can never become a dead link)
   */
  const pathFor = (lang, slug = null, page = null) => {
    const s = page && page !== 'home' ? sectionPage(page) : null;
    return `${lang === 'en' ? 'en/' : ''}${slug ? `procedures/${slug}/` : s ? `${s.route}/` : ''}`;
  };

  /** Every real page, in sitemap order: AR home, AR section pages, AR procedures, then the same in English. */
  const PAGES = LANGS.flatMap(lang => [
    { lang, slug: null, page: 'home', path: pathFor(lang) },
    ...SECTION_PAGES.map(s => ({ lang, slug: null, page: s.key, path: pathFor(lang, null, s.key) })),
    ...PROCEDURES.map(p => ({ lang, slug: p.slug, page: 'procedure', path: pathFor(lang, p.slug) }))
  ]);

  // One pattern for the route part of a URL. vite.config.js writes it into the inline <base> script of index.html.
  const SECTION_RE = SECTION_PAGES.map(s => escapeRoute(s.route)).join('|');
  const ROUTE_PATTERN = `(?:en\\/)?(?:(?:procedures\\/[a-z0-9-]+|${SECTION_RE})\\/?)?(?:index\\.html)?`;

  /**
   * Parse a site-root-relative path into { lang, slug, page }. Unknown paths fall back to the home
   * page of the detected language and are flagged `known: false`.
   */
  function parseRoute(rel) {
    const clean = String(rel || '').replace(/^\/+/, '').replace(/index\.html$/, '');
    const m = clean.match(new RegExp(`^(en\\/)?(?:procedures\\/([a-z0-9-]+)\\/?|(${SECTION_RE})\\/?)?$`));
    if (!m) return { lang: clean.startsWith('en/') ? 'en' : 'ar', slug: null, page: 'home', known: false };
    const lang = m[1] ? 'en' : 'ar';
    if (m[2]) {
      const slug = procedureBySlug(m[2]) ? m[2] : null;
      return { lang, slug, page: slug ? 'procedure' : 'home', known: Boolean(slug) };
    }
    return { lang, slug: null, page: m[3] ? SECTION_PAGES.find(s => s.route === m[3]).key : 'home', known: true };
  }

  /**
   * Split an absolute pathname into the site root and the route part, e.g.
   *   /dr-maan-albarry-website/en/procedures/icl/ → root '/dr-maan-albarry-website/', rel 'en/procedures/icl/'
   *   /dr-maan-albarry-website/about/             → root '/dr-maan-albarry-website/', rel 'about/'
   */
  function splitPath(pathname) {
    const m = String(pathname).match(new RegExp(`^(.*?\\/)(${ROUTE_PATTERN})$`));
    return m ? { root: m[1], rel: m[2] } : { root: '/', rel: '' };
  }

  /** Title + description for a page (used by the prerenderer and on client-side navigation). */
  function pageMeta(lang, slug = null, page = null) {
    if (slug) {
      const p = procedureBySlug(slug);
      return lang === 'ar'
        ? { title: `${p.name.ar} | ${DOCTOR.identity.shortName.ar} – استشاري طب وجراحة العيون، المدينة المنورة`, description: `${p.summary.ar} معلومات توعوية عامة عن الإجراء والتعافي والمخاطر، وحجز موعد مع ${DOCTOR.identity.shortName.ar} في مغربي المدينة المنورة.` }
        : { title: `${p.name.en} | ${DOCTOR.identity.shortName.en}, Consultant Ophthalmologist, Madinah`, description: `${p.summary.en} General patient information on the procedure, recovery and risks, and booking with ${DOCTOR.identity.shortName.en} at Magrabi Madinah.` };
    }
    const s = page && page !== 'home' ? sectionPage(page) : null;
    if (s) return { title: s.title[lang], description: s.description[lang] };
    return { title: home.seo.title[lang], description: home.seo.description[lang] };
  }

  /**
   * Breadcrumb trail of a page as [{ name, path }] (site-root-relative paths), home first.
   * The home page has no trail. Used for the visible breadcrumb and for BreadcrumbList JSON-LD.
   */
  function breadcrumbFor(lang, slug = null, page = null) {
    const first = { name: home.title[lang], path: pathFor(lang) };
    if (slug) {
      const p = procedureBySlug(slug);
      return [first, { name: sectionPage('procedures').crumb[lang], path: pathFor(lang, null, 'procedures') }, { name: p.name[lang], path: pathFor(lang, slug) }];
    }
    const s = page && page !== 'home' ? sectionPage(page) : null;
    return s ? [first, { name: s.crumb[lang], path: pathFor(lang, null, s.key) }] : [];
  }

  return { SECTION_PAGES, SECTION_KEYS, sectionPage, pathFor, PAGES, ROUTE_PATTERN, parseRoute, splitPath, pageMeta, breadcrumbFor };
}

export const { SECTION_PAGES, SECTION_KEYS, sectionPage, pathFor, PAGES, ROUTE_PATTERN, parseRoute, splitPath, pageMeta, breadcrumbFor } = createRouting();
