// ============================================================
// ROUTE TABLE — shared by the app (main.js), the build (vite.config.js) and the
// prerenderer (scripts/prerender.mjs), so URLs, titles and descriptions never drift.
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

export const LANGS = ['ar', 'en'];

/**
 * Dedicated section pages (Phase 1). Order = sitemap and footer order.
 * `crumb` is the breadcrumb / navigation label; `title`/`description` feed <title>, meta and Open Graph.
 */
export const SECTION_PAGES = [
  {
    key: 'about',
    crumb: { ar: 'عن د. معن', en: 'About Dr. Maan' },
    title: {
      ar: `عن ${DOCTOR.identity.name.ar} | المؤهلات والمسيرة المهنية – استشاري طب وجراحة العيون، المدينة المنورة`,
      en: `About ${DOCTOR.identity.name.en} | Qualifications and career – Consultant Ophthalmologist, Madinah`
    },
    description: {
      ar: `السيرة المهنية للدكتور معن بن عبدالله البري: زمالة كلية الجراحين الملكية (FRCS) والبورد السعودي، أستاذ مشارك بجامعة طيبة، كبير موظفي مركز مغربي المدينة المنورة، وأول رئيس للرابطة السعودية لجراحي القرنية والماء الأبيض وتصحيح الإبصار. خبرة منذ ${DOCTOR.professional.experienceSince}.`,
      en: `Professional profile of Dr. Maan bin Abdullah Al Barry: FRCS (UK) and Saudi Board, Associate Professor at Taibah University, Chief of Staff at Magrabi Health Madinah and first President of the Saudi cornea, cataract and refractive surgeons' association. Experience since ${DOCTOR.professional.experienceSince}.`
    }
  },
  {
    key: 'procedures',
    crumb: { ar: 'الإجراءات', en: 'Procedures' },
    title: {
      ar: `مكتبة الإجراءات | ${DOCTOR.identity.shortName.ar} – الماء الأبيض والعدسات وتصحيح الإبصار والقرنية`,
      en: `Procedure library | ${DOCTOR.identity.shortName.en} – cataract, lenses, vision correction and cornea`
    },
    description: {
      ar: 'سبعة إجراءات في طب وجراحة العيون: جراحة الماء الأبيض، العدسات المزروعة، تصحيح الإبصار بالليزر، زراعة العدسة ICL، القرنية المخروطية وتثبيت القرنية، زراعة القرنية، وحقن العين. لكل إجراء دليل مبسّط للتشريح والخطوات والتعافي والمخاطر.',
      en: 'Seven eye procedures: cataract surgery, lens implants, laser vision correction, ICL, keratoconus and cross-linking, corneal transplant and intravitreal injections. Each has a plain-language guide to anatomy, steps, recovery and risks.'
    }
  },
  {
    key: 'lens-lab',
    crumb: { ar: 'مختبر الرؤية والعدسات', en: 'Vision & Lens Lab' },
    title: {
      ar: `مختبر الرؤية والعدسات | قارن أنواع العدسات المزروعة – ${DOCTOR.identity.shortName.ar}`,
      en: `Vision & Lens Lab | Compare intraocular lens types – ${DOCTOR.identity.shortName.en}`
    },
    description: {
      ar: 'أداة تثقيفية لمقارنة العدسات أحادية البؤرة وممتدة المدى وثلاثية البؤرة والتوريكية على مسافات النظر وفي الإضاءة الليلية، مع محاكي رؤية تقريبي. لا تتنبأ بنتيجة عينك.',
      en: 'An educational tool comparing monofocal, extended-depth-of-focus, trifocal and toric lenses across viewing distances and at night, with an approximate vision simulator. It does not predict your own result.'
    }
  },
  {
    key: 'surgical-education',
    crumb: { ar: 'جراحة الماء الأبيض ثلاثية الأبعاد', en: '3D cataract surgery' },
    title: {
      ar: `جراحة الماء الأبيض خطوة بخطوة – تجربة تعليمية ثلاثية الأبعاد | ${DOCTOR.identity.shortName.ar}`,
      en: `Cataract surgery step by step – an interactive 3D walkthrough | ${DOCTOR.identity.shortName.en}`
    },
    description: {
      ar: 'نموذج ثلاثي الأبعاد للعين يشرح المراحل الرئيسية لعملية إزالة الماء الأبيض وزراعة العدسة، بلغة واضحة قبل موعدك. محتوى تعليمي توضيحي لا يغني عن الاستشارة.',
      en: 'A 3D model of the eye that walks through the main stages of cataract removal and lens implantation, in plain language before your visit. Illustrative education that does not replace a consultation.'
    }
  },
  {
    key: 'education',
    crumb: { ar: 'مكتبة التثقيف الصحي', en: 'Patient education' },
    title: {
      ar: `مكتبة التثقيف الصحي للعيون | أدلة واستبيان قبل الزيارة – ${DOCTOR.identity.shortName.ar}`,
      en: `Eye health education library | Guides and a pre-visit questionnaire – ${DOCTOR.identity.shortName.en}`
    },
    description: {
      ar: 'أدلة مبسّطة عن الماء الأبيض والقرنية المخروطية وملاءمة الليزر وما يحدث قبل الجراحة وبعدها، واستبيان نمط الحياة البصري، وعلامات تستوجب رعاية عاجلة. محتوى توعوي عام.',
      en: 'Plain-language guides on cataract, keratoconus, laser suitability and what happens before and after surgery, a visual lifestyle questionnaire, and warning signs that need urgent care. General education.'
    }
  },
  {
    key: 'how-vision-works',
    crumb: { ar: 'رحلة الضوء في العين', en: 'How vision works' },
    title: {
      ar: `رحلة الضوء: كيف ترى العين؟ | ${DOCTOR.identity.shortName.ar}`,
      en: `The light journey: how does the eye see? | ${DOCTOR.identity.shortName.en}`
    },
    description: {
      ar: 'تتبّع مسار الضوء من القرنية إلى العدسة ثم الشبكية والعصب البصري، واعرف أين يحدث كل إجراء من إجراءات العيون. شرح تفاعلي تثقيفي.',
      en: 'Follow light from the cornea through the lens to the retina and optic nerve, and see where each eye procedure takes place. An interactive educational explainer.'
    }
  },
  {
    key: 'clinic',
    crumb: { ar: 'العيادة والحجز', en: 'Clinic & booking' },
    title: {
      ar: `العيادة والحجز | ${DOCTOR.identity.shortName.ar} – مغربي الصحية، طريق المطار، المدينة المنورة`,
      en: `Clinic & booking | ${DOCTOR.identity.shortName.en} – Magrabi Health, Airport Road, Madinah`
    },
    description: {
      ar: `احجز موعداً مع ${DOCTOR.identity.shortName.ar} في ${DOCTOR.clinic.name.ar}: الحجز الإلكتروني، عيادة الدكتور اتصالاً أو واتساب ${DOCTOR.contact.clinicDirect.display}، مركز اتصال مغربي ${DOCTOR.contact.callCenter.display}، ومواعيد العيادة وخطوات الزيارة.`,
      en: `Book with ${DOCTOR.identity.shortName.en} at ${DOCTOR.clinic.name.en}: online booking, the clinic line by phone or WhatsApp ${DOCTOR.contact.clinicDirect.display}, the Magrabi contact center ${DOCTOR.contact.callCenter.display}, clinic hours and what happens at your visit.`
    }
  }
];
export const SECTION_KEYS = SECTION_PAGES.map(p => p.key);
export const sectionPage = key => SECTION_PAGES.find(p => p.key === key) || null;

/**
 * Site-root-relative path of a page.
 *   pathFor(lang)                    home
 *   pathFor(lang, slug)              procedure page
 *   pathFor(lang, null, pageKey)     section page
 */
export const pathFor = (lang, slug = null, page = null) =>
  `${lang === 'en' ? 'en/' : ''}${slug ? `procedures/${slug}/` : page && page !== 'home' ? `${page}/` : ''}`;

/** Every real page, in sitemap order: AR home, AR section pages, AR procedures, then the same in English. */
export const PAGES = LANGS.flatMap(lang => [
  { lang, slug: null, page: 'home', path: pathFor(lang) },
  ...SECTION_PAGES.map(s => ({ lang, slug: null, page: s.key, path: pathFor(lang, null, s.key) })),
  ...PROCEDURES.map(p => ({ lang, slug: p.slug, page: 'procedure', path: pathFor(lang, p.slug) }))
]);

// One pattern for the route part of a URL. Kept in step with the inline <base> script in index.html.
const SECTION_RE = SECTION_KEYS.map(k => k.replace(/-/g, '\\-')).join('|');
export const ROUTE_PATTERN = `(?:en\\/)?(?:(?:procedures\\/[a-z0-9-]+|${SECTION_RE})\\/?)?(?:index\\.html)?`;

/**
 * Parse a site-root-relative path into { lang, slug, page }. Unknown paths fall back to the home
 * page of the detected language and are flagged `known: false`.
 */
export function parseRoute(rel) {
  const clean = String(rel || '').replace(/^\/+/, '').replace(/index\.html$/, '');
  const m = clean.match(new RegExp(`^(en\\/)?(?:procedures\\/([a-z0-9-]+)\\/?|(${SECTION_RE})\\/?)?$`));
  if (!m) return { lang: clean.startsWith('en/') ? 'en' : 'ar', slug: null, page: 'home', known: false };
  const lang = m[1] ? 'en' : 'ar';
  if (m[2]) {
    const slug = procedureBySlug(m[2]) ? m[2] : null;
    return { lang, slug, page: slug ? 'procedure' : 'home', known: Boolean(slug) };
  }
  return { lang, slug: null, page: m[3] || 'home', known: true };
}

/**
 * Split an absolute pathname into the site root and the route part, e.g.
 *   /dr-maan-albarry-website/en/procedures/icl/ → root '/dr-maan-albarry-website/', rel 'en/procedures/icl/'
 *   /dr-maan-albarry-website/about/             → root '/dr-maan-albarry-website/', rel 'about/'
 */
export function splitPath(pathname) {
  const m = String(pathname).match(new RegExp(`^(.*?\\/)(${ROUTE_PATTERN})$`));
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
export function pageMeta(lang, slug = null, page = null) {
  if (slug) {
    const p = procedureBySlug(slug);
    return lang === 'ar'
      ? { title: `${p.name.ar} | ${DOCTOR.identity.shortName.ar} – استشاري طب وجراحة العيون، المدينة المنورة`, description: `${p.summary.ar} معلومات توعوية عامة عن الإجراء والتعافي والمخاطر، وحجز موعد مع ${DOCTOR.identity.shortName.ar} في مغربي المدينة المنورة.` }
      : { title: `${p.name.en} | ${DOCTOR.identity.shortName.en}, Consultant Ophthalmologist, Madinah`, description: `${p.summary.en} General patient information on the procedure, recovery and risks, and booking with ${DOCTOR.identity.shortName.en} at Magrabi Madinah.` };
  }
  const s = page && page !== 'home' ? sectionPage(page) : null;
  if (s) return { title: s.title[lang], description: s.description[lang] };
  return HOME_META[lang];
}

/**
 * Breadcrumb trail of a page as [{ name, path }] (site-root-relative paths), home first.
 * The home page has no trail. Used for the visible breadcrumb and for BreadcrumbList JSON-LD.
 */
export function breadcrumbFor(lang, slug = null, page = null) {
  const home = { name: lang === 'ar' ? 'الرئيسية' : 'Home', path: pathFor(lang) };
  if (slug) {
    const p = procedureBySlug(slug);
    return [home, { name: sectionPage('procedures').crumb[lang], path: pathFor(lang, null, 'procedures') }, { name: p.name[lang], path: pathFor(lang, slug) }];
  }
  const s = page && page !== 'home' ? sectionPage(page) : null;
  return s ? [home, { name: s.crumb[lang], path: pathFor(lang, null, s.key) }] : [];
}
