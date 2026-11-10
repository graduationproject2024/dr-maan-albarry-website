// ============================================================
// SECTION REGISTRY — the single list of the site's sections.
//
// Routes, breadcrumbs, the sitemap, the prerender list, llms.txt, page metadata, the header, the mobile menu and the
// footer are all generated from this list (site-routes.js, vite.config.js, scripts/prerender.mjs, main.js).
// How to add a section: docs/implementation/premium-ux-refinement/FUTURE_SECTIONS_ARCHITECTURE.md
//
// An entry:
//   id          stable key; also main[data-page], nav data-section and the JSON-LD/closing keys
//   type        'home' | 'profile' | 'collection' | 'tool' | 'education' | 'contact'
//   title       { ar, en } the page's name: breadcrumb and footer label
//   content     name of the page renderer in PAGE_CONTENT (main.js)
//   route       URL segment(s) below the site root ('' for home); lowercase letters, digits, hyphens, '/'
//   visibility  'published' | 'unpublished'. An unpublished entry is absent from everything public (see the selectors)
//   order       display order: sitemap, footer, llms.txt
//   nav         { label: { ar, en }, header: n, drawer: n, footer: true }. header/drawer are the position in that menu;
//               leave one out to keep the section out of that menu
//   features    interactive modules this section may start (keys of FEATURES). Remove a key to switch that module off
//   seo         { title: { ar, en }, description: { ar, en }, schema, ogType, llms }
// ============================================================
import { DOCTOR } from './doctor-data.js';

export const PUBLISHED = 'published';
export const UNPUBLISHED = 'unpublished';
export const SECTION_TYPES = ['home', 'profile', 'collection', 'tool', 'education', 'contact'];
export const SCHEMA_TYPES = ['WebSite', 'ProfilePage', 'CollectionPage', 'ContactPage', 'MedicalWebPage'];

/** Lazily loaded interactive modules. `hostAttr` marks the element a module mounts into (null: started by a button). */
export const FEATURES = {
  'lens-lab': { hostAttr: 'data-lens-lab-host' },
  'light-journey': { hostAttr: 'data-light-journey-host' },
  'vision-sim': { hostAttr: 'data-vision-host' },
  'cataract-3d': { hostAttr: null }
};

/** Every element a module mounts into. The prerenderer empties these; adopting the page reserves their height again. */
export const FEATURE_HOST_SELECTOR = Object.values(FEATURES).filter(f => f.hostAttr).map(f => `[${f.hostAttr}]`).join(', ');

const SHORT = DOCTOR.identity.shortName;

export const SECTIONS = [
  {
    id: 'home',
    type: 'home',
    title: { ar: 'الرئيسية', en: 'Home' },
    content: 'home',
    route: '',
    visibility: PUBLISHED,
    order: 0,
    nav: { label: { ar: 'الرئيسية', en: 'Home' }, drawer: 0 },
    features: [],
    seo: {
      title: {
        ar: 'د. معن بن عبدالله البري | استشاري طب وجراحة العيون (تخصص جراحات القرنية والماء الأبيض وتصحيح الإبصار) | المدينة المنورة',
        en: 'Dr. Maan bin Abdullah Al Barry | Consultant Ophthalmologist (Cornea, Cataract & Refractive Surgery) | Madinah'
      },
      description: {
        ar: 'الموقع الرسمي للدكتور معن بن عبدالله البري، استشاري طب وجراحة العيون (تخصص جراحات القرنية والماء الأبيض وتصحيح الإبصار). كبير موظفي مركز مغربي المدينة المنورة وأول رئيس للرابطة السعودية لجراحي القرنية والماء الأبيض وتصحيح الإبصار. خبرة ممتدة منذ 1998. احجز موعدك الآن.',
        en: 'Official website of Dr. Maan bin Abdullah Al Barry, Consultant Ophthalmologist (cornea, cataract and refractive surgery), Chief of Staff at Magrabi Health Madinah. Experience since 1998. Book an appointment.'
      },
      schema: 'WebSite',
      ogType: 'profile',
      llms: 'home: the physician, expertise, core specialties, booking'
    }
  },
  {
    id: 'about',
    type: 'profile',
    title: { ar: 'عن د. معن', en: 'About Dr. Maan' },
    content: 'about',
    route: 'about',
    visibility: PUBLISHED,
    order: 1,
    nav: { label: { ar: 'عن الدكتور', en: 'About' }, header: 1, drawer: 1, footer: true },
    features: [],
    seo: {
      title: {
        ar: `عن ${DOCTOR.identity.name.ar} | المؤهلات والمسيرة المهنية – استشاري طب وجراحة العيون، المدينة المنورة`,
        en: `About ${DOCTOR.identity.name.en} | Qualifications and career – Consultant Ophthalmologist, Madinah`
      },
      description: {
        ar: `السيرة المهنية للدكتور معن بن عبدالله البري: زمالة كلية الجراحين الملكية (FRCS) والبورد السعودي، أستاذ مشارك بجامعة طيبة، كبير موظفي مركز مغربي المدينة المنورة، وأول رئيس للرابطة السعودية لجراحي القرنية والماء الأبيض وتصحيح الإبصار. خبرة منذ ${DOCTOR.professional.experienceSince}.`,
        en: `Professional profile of Dr. Maan bin Abdullah Al Barry: FRCS (UK) and Saudi Board, Associate Professor at Taibah University, Chief of Staff at Magrabi Health Madinah and first President of the Saudi cornea, cataract and refractive surgeons' association. Experience since ${DOCTOR.professional.experienceSince}.`
      },
      schema: 'ProfilePage',
      ogType: 'profile',
      llms: 'professional profile: qualifications, appointments, dated record'
    }
  },
  {
    id: 'procedures',
    type: 'collection',
    title: { ar: 'الإجراءات', en: 'Procedures' },
    content: 'procedures',
    route: 'procedures',
    visibility: PUBLISHED,
    order: 2,
    nav: { label: { ar: 'الإجراءات', en: 'Procedures' }, header: 2, drawer: 2, footer: true },
    features: [],
    seo: {
      title: {
        ar: `مكتبة الإجراءات | ${SHORT.ar} – الماء الأبيض والعدسات وتصحيح الإبصار والقرنية`,
        en: `Procedure library | ${SHORT.en} – cataract, lenses, vision correction and cornea`
      },
      description: {
        ar: 'سبعة إجراءات في طب وجراحة العيون: جراحة الماء الأبيض، العدسات المزروعة، تصحيح الإبصار بالليزر، زراعة العدسة ICL، القرنية المخروطية وتثبيت القرنية، زراعة القرنية، وحقن العين. لكل إجراء دليل مبسّط للتشريح والخطوات والتعافي والمخاطر.',
        en: 'Seven eye procedures: cataract surgery, lens implants, laser vision correction, ICL, keratoconus and cross-linking, corneal transplant and intravitreal injections. Each has a plain-language guide to anatomy, steps, recovery and risks.'
      },
      schema: 'CollectionPage',
      ogType: 'article',
      llms: 'procedure library; /procedures/<slug>/ — one guide per procedure'
    }
  },
  {
    id: 'lens-lab',
    type: 'tool',
    title: { ar: 'مختبر الرؤية والعدسات', en: 'Vision & Lens Lab' },
    content: 'lens-lab',
    route: 'lens-lab',
    visibility: PUBLISHED,
    order: 3,
    nav: { label: { ar: 'مختبر العدسات', en: 'Lens Lab' }, header: 3, drawer: 3, footer: true },
    features: ['lens-lab', 'vision-sim'],
    seo: {
      title: {
        ar: `مختبر الرؤية والعدسات | قارن أنواع العدسات المزروعة – ${SHORT.ar}`,
        en: `Vision & Lens Lab | Compare intraocular lens types – ${SHORT.en}`
      },
      description: {
        ar: 'أداة تثقيفية لمقارنة العدسات أحادية البؤرة وممتدة المدى وثلاثية البؤرة والتوريكية على مسافات النظر وفي الإضاءة الليلية، مع محاكي رؤية تقريبي. لا تتنبأ بنتيجة عينك.',
        en: 'An educational tool comparing monofocal, extended-depth-of-focus, trifocal and toric lenses across viewing distances and at night, with an approximate vision simulator. It does not predict your own result.'
      },
      schema: 'MedicalWebPage',
      ogType: 'article',
      llms: 'Vision & Lens Lab (educational lens comparison and vision simulator)'
    }
  },
  {
    id: 'surgical-education',
    type: 'tool',
    title: { ar: 'جراحة الماء الأبيض ثلاثية الأبعاد', en: '3D cataract surgery' },
    content: 'surgical-education',
    route: 'surgical-education',
    visibility: PUBLISHED,
    order: 4,
    nav: { label: { ar: 'الجراحة ثلاثية الأبعاد', en: '3D surgery' }, header: 4, drawer: 4, footer: true },
    features: ['cataract-3d'],
    seo: {
      title: {
        ar: `جراحة الماء الأبيض خطوة بخطوة – تجربة تعليمية ثلاثية الأبعاد | ${SHORT.ar}`,
        en: `Cataract surgery step by step – an interactive 3D walkthrough | ${SHORT.en}`
      },
      description: {
        ar: 'نموذج ثلاثي الأبعاد للعين يشرح المراحل الرئيسية لعملية إزالة الماء الأبيض وزراعة العدسة، بلغة واضحة قبل موعدك. محتوى تعليمي توضيحي لا يغني عن الاستشارة.',
        en: 'A 3D model of the eye that walks through the main stages of cataract removal and lens implantation, in plain language before your visit. Illustrative education that does not replace a consultation.'
      },
      schema: 'MedicalWebPage',
      ogType: 'article',
      llms: '3D cataract surgery walkthrough'
    }
  },
  {
    id: 'education',
    type: 'education',
    title: { ar: 'مكتبة التثقيف الصحي', en: 'Patient education' },
    content: 'education',
    route: 'education',
    visibility: PUBLISHED,
    order: 5,
    nav: { label: { ar: 'التثقيف الصحي', en: 'Education' }, header: 5, drawer: 6, footer: true },
    features: [],
    seo: {
      title: {
        ar: `مكتبة التثقيف الصحي للعيون | أدلة واستبيان قبل الزيارة – ${SHORT.ar}`,
        en: `Eye health education library | Guides and a pre-visit questionnaire – ${SHORT.en}`
      },
      description: {
        ar: 'أدلة مبسّطة عن الماء الأبيض والقرنية المخروطية وملاءمة الليزر وما يحدث قبل الجراحة وبعدها، واستبيان نمط الحياة البصري، وعلامات تستوجب رعاية عاجلة. محتوى توعوي عام.',
        en: 'Plain-language guides on cataract, keratoconus, laser suitability and what happens before and after surgery, a visual lifestyle questionnaire, and warning signs that need urgent care. General education.'
      },
      schema: 'MedicalWebPage',
      ogType: 'article',
      llms: 'patient education guides, visual lifestyle questionnaire, warning signs'
    }
  },
  {
    id: 'how-vision-works',
    type: 'tool',
    title: { ar: 'رحلة الضوء في العين', en: 'How vision works' },
    content: 'how-vision-works',
    route: 'how-vision-works',
    visibility: PUBLISHED,
    order: 6,
    nav: { label: { ar: 'رحلة الضوء في العين', en: 'How vision works' }, drawer: 5, footer: true },
    features: ['light-journey'],
    seo: {
      title: {
        ar: `رحلة الضوء: كيف ترى العين؟ | ${SHORT.ar}`,
        en: `The light journey: how does the eye see? | ${SHORT.en}`
      },
      description: {
        ar: 'تتبّع مسار الضوء من القرنية إلى العدسة ثم الشبكية والعصب البصري، واعرف أين يحدث كل إجراء من إجراءات العيون. شرح تفاعلي تثقيفي.',
        en: 'Follow light from the cornea through the lens to the retina and optic nerve, and see where each eye procedure takes place. An interactive educational explainer.'
      },
      schema: 'MedicalWebPage',
      ogType: 'article',
      llms: 'the light journey through the eye'
    }
  },
  {
    id: 'clinic',
    type: 'contact',
    title: { ar: 'العيادة والحجز', en: 'Clinic & booking' },
    content: 'clinic',
    route: 'clinic',
    visibility: PUBLISHED,
    order: 7,
    nav: { label: { ar: 'العيادة والحجز', en: 'Clinic & booking' }, header: 6, drawer: 7, footer: true },
    features: [],
    seo: {
      title: {
        ar: `العيادة والحجز | ${SHORT.ar} – مغربي الصحية، طريق المطار، المدينة المنورة`,
        en: `Clinic & booking | ${SHORT.en} – Magrabi Health, Airport Road, Madinah`
      },
      description: {
        ar: `احجز موعداً مع ${SHORT.ar} في ${DOCTOR.clinic.name.ar}: الحجز الإلكتروني، عيادة الدكتور اتصالاً أو واتساب ${DOCTOR.contact.clinicDirect.display}، مركز اتصال مغربي ${DOCTOR.contact.callCenter.display}، ومواعيد العيادة وخطوات الزيارة.`,
        en: `Book with ${SHORT.en} at ${DOCTOR.clinic.name.en}: online booking, the clinic line by phone or WhatsApp ${DOCTOR.contact.clinicDirect.display}, the Magrabi contact center ${DOCTOR.contact.callCenter.display}, clinic hours and what happens at your visit.`
      },
      schema: 'ContactPage',
      ogType: 'article',
      llms: 'booking routes, clinic hours, visit pathway, map'
    }
  }
];

// ---- selectors: every public list goes through publishedSections(), so an unpublished entry cannot reach any of them ----
const byOrder = (a, b) => a.order - b.order;
const navByPosition = (where) => (a, b) => a.nav[where] - b.nav[where];

export const isPublished = (s) => s.visibility === PUBLISHED;
export const publishedSections = (list = SECTIONS) => list.filter(isPublished).sort(byOrder);
/** Published sections that have their own page below the home page. */
export const sectionPages = (list = SECTIONS) => publishedSections(list).filter(s => s.type !== 'home');
export const homeSection = (list = SECTIONS) => publishedSections(list).find(s => s.type === 'home');

const inMenu = (list, where) => publishedSections(list).filter(s => s.nav && Number.isFinite(s.nav[where])).sort(navByPosition(where));
export const headerNav = (list = SECTIONS) => inMenu(list, 'header');
export const drawerNav = (list = SECTIONS) => inMenu(list, 'drawer');
export const footerNav = (list = SECTIONS) => publishedSections(list).filter(s => s.nav && s.nav.footer);

/** Keys of the lazily loaded modules the public site can start; an unpublished section contributes nothing. */
export const publishedFeatures = (list = SECTIONS) => [...new Set(publishedSections(list).flatMap(s => s.features || []))];
/** May this published section start this module? */
export const sectionHasFeature = (id, feature, list = SECTIONS) => {
  const s = publishedSections(list).find(x => x.id === id);
  return Boolean(s && (s.features || []).includes(feature));
};

/** Lines of the "Pages" list in /llms.txt. Procedure pages are described by the procedures entry. */
export const llmsPageLines = (list = SECTIONS) => publishedSections(list).map(s => `- /${s.route ? `${s.route}/` : ''} — ${s.seo.llms}`);

// ---- build-time check (vite.config.js and tests): a malformed entry stops the build instead of shipping ----
const RESERVED_ROUTES = ['en', 'assets', 'fonts', 'images'];
const ROUTE_RE = /^[a-z0-9-]+(\/[a-z0-9-]+)*$/;
const bilingual = (v) => Boolean(v && typeof v.ar === 'string' && v.ar.trim() && typeof v.en === 'string' && v.en.trim());

/** Returns a list of problems; empty when the registry is valid. */
export function validateSections(list = SECTIONS) {
  const errors = [];
  const fail = (s, msg) => errors.push(`section "${s.id}": ${msg}`);
  const seen = (key) => { const set = new Set(); return (s) => { if (set.has(s[key])) fail(s, `duplicate ${key}`); set.add(s[key]); }; };
  const uniqueId = seen('id'), uniqueRoute = seen('route');
  for (const s of list) {
    uniqueId(s); uniqueRoute(s);
    if (![PUBLISHED, UNPUBLISHED].includes(s.visibility)) fail(s, `visibility must be "${PUBLISHED}" or "${UNPUBLISHED}"`);
    if (!SECTION_TYPES.includes(s.type)) fail(s, `unknown type "${s.type}"`);
    if (!Number.isFinite(s.order)) fail(s, 'order must be a number');
    if (!s.content) fail(s, 'content (the renderer name) is required');
    if (!bilingual(s.title)) fail(s, 'title needs Arabic and English');
    if (s.type !== 'home') {
      if (typeof s.route !== 'string' || !ROUTE_RE.test(s.route)) fail(s, `invalid route "${s.route}"`);
      else if (RESERVED_ROUTES.includes(s.route.split('/')[0]) || s.route.startsWith('procedures/')) fail(s, `route "${s.route}" is reserved`);
    }
    for (const f of s.features || []) if (!FEATURES[f]) fail(s, `unknown feature "${f}"`);
    if (s.nav && (s.nav.header !== undefined || s.nav.drawer !== undefined || s.nav.footer) && !bilingual(s.nav.label)) fail(s, 'nav.label needs Arabic and English');
    if (!isPublished(s)) continue; // a draft may still be incomplete below this line
    if (!bilingual(s.seo?.title)) fail(s, 'seo.title needs Arabic and English');
    if (!bilingual(s.seo?.description)) fail(s, 'seo.description needs Arabic and English');
    if (!SCHEMA_TYPES.includes(s.seo?.schema)) fail(s, `unknown seo.schema "${s.seo?.schema}"`);
    if (!s.seo?.ogType) fail(s, 'seo.ogType is required');
    if (!s.seo?.llms) fail(s, 'seo.llms is required');
  }
  if (list.filter(s => s.type === 'home' && isPublished(s)).length !== 1) errors.push('exactly one published home section is required');
  return errors;
}
