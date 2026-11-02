// ============================================================
// ROUTE TABLE — shared by the app (main.js), the build (vite.config.js) and the
// prerenderer (scripts/prerender.mjs), so URLs, titles and descriptions never drift.
//
// Paths are RELATIVE TO THE SITE ROOT (no leading slash), because the site is served
// both from a domain root and from a GitHub Pages subpath (/dr-maan-albarry-website/):
//   ''                           Arabic home
//   'en/'                        English home
//   'procedures/<slug>/'         Arabic procedure page
//   'en/procedures/<slug>/'      English procedure page
// ============================================================
import { DOCTOR, PROCEDURES, procedureBySlug } from './doctor-data.js';

export const LANGS = ['ar', 'en'];

/** Site-root-relative path of a page. */
export const pathFor = (lang, slug = null) => `${lang === 'en' ? 'en/' : ''}${slug ? `procedures/${slug}/` : ''}`;

/** Every real page, in sitemap order: AR home, AR procedures, EN home, EN procedures. */
export const PAGES = LANGS.flatMap(lang => [
  { lang, slug: null, path: pathFor(lang) },
  ...PROCEDURES.map(p => ({ lang, slug: p.slug, path: pathFor(lang, p.slug) }))
]);

/**
 * Parse a site-root-relative path into { lang, slug }. Unknown paths fall back to the home
 * page of the detected language (slug null) and are flagged `known: false`.
 */
export function parseRoute(rel) {
  const clean = String(rel || '').replace(/^\/+/, '').replace(/index\.html$/, '');
  const m = clean.match(/^(en\/)?(?:procedures\/([a-z0-9-]+)\/?)?$/);
  if (!m) return { lang: clean.startsWith('en/') ? 'en' : 'ar', slug: null, known: false };
  const lang = m[1] ? 'en' : 'ar';
  const slug = m[2] && procedureBySlug(m[2]) ? m[2] : null;
  return { lang, slug, known: !m[2] || Boolean(slug) };
}

/**
 * Split an absolute pathname into the site root and the route part, e.g.
 *   /dr-maan-albarry-website/en/procedures/icl/ → root '/dr-maan-albarry-website/', rel 'en/procedures/icl/'
 */
export function splitPath(pathname) {
  const m = String(pathname).match(/^(.*?\/)((?:en\/)?(?:procedures\/[a-z0-9-]+\/?)?(?:index\.html)?)$/);
  return m ? { root: m[1], rel: m[2] } : { root: '/', rel: '' };
}

const HOME_META = {
  ar: {
    title: 'د. معن بن عبدالله البري | استشاري طب وجراحة العيون (تخصص جراحات القرنية والماء الأبيض وتصحيح الإبصار) | المدينة المنورة',
    description: 'الموقع الرسمي للدكتور معن بن عبدالله البري، استشاري طب وجراحة العيون (تخصص جراحات القرنية والماء الأبيض وتصحيح الإبصار). كبير موظفي مركز مغربي المدينة المنورة وأول رئيس للرابطة السعودية لجراحي القرنية والماء الأبيض وتصحيح الإبصار. خبرة ممتدة منذ 1998. احجز موعدك الآن.'
  },
  en: {
    title: 'Dr. Maan bin Abdullah Al Barry | Consultant Ophthalmologist (Cornea, Cataract & Refractive Surgery) | Madinah',
    description: 'Official website of Dr. Maan bin Abdullah Al Barry, Consultant Ophthalmologist (cornea, cataract and refractive surgery), Chief of Staff at Magrabi Health Madinah. Experience since 1998. Book an appointment.'
  }
};

/** Title + description for a page (used by the prerenderer and on client-side navigation). */
export function pageMeta(lang, slug = null) {
  if (!slug) return HOME_META[lang];
  const p = procedureBySlug(slug);
  return lang === 'ar'
    ? { title: `${p.name.ar} | ${DOCTOR.identity.shortName.ar} – استشاري طب وجراحة العيون، المدينة المنورة`, description: `${p.summary.ar} معلومات توعوية عامة عن الإجراء والتعافي والمخاطر، وحجز موعد مع ${DOCTOR.identity.shortName.ar} في مغربي المدينة المنورة.` }
    : { title: `${p.name.en} | ${DOCTOR.identity.shortName.en}, Consultant Ophthalmologist, Madinah`, description: `${p.summary.en} General patient information on the procedure, recovery and risks, and booking with ${DOCTOR.identity.shortName.en} at Magrabi Madinah.` };
}
