// Shared, REAL content for the three design-direction prototypes.
// Every string comes from doctor-data.js, src/site/content.js, src/procedures/content.js,
// site-routes.js or verbatim UI strings in main.js. Nothing is invented here.
const ROOT = 'file:///C:/Users/sam20/dr-maan-albarry-website/';
const { DOCTOR, PROCEDURES, PROCEDURE_GROUPS, yearsOfExperience } = await import(ROOT + 'doctor-data.js');
const { CONTENT } = await import(ROOT + 'src/procedures/content.js');
const { SURGERY_STAGES, VISIT, LENS_SUMMARY, LIGHT_PATH } = await import(ROOT + 'src/site/content.js');
const { SECTION_PAGES } = await import(ROOT + 'site-routes.js');

export const IMG = '../../../../../public/images/';
export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Label anchors on the 1600x1000 illustrations, in % of the image box (x from the LEFT edge, never mirrored).
// Text always comes from the procedure's own anatomy.parts / types / LENS_SUMMARY entries.
const ANCHORS = {
  'cataract-surgery': [ { part: 1, x: 37, y: 33 }, { part: 2, x: 61, y: 27 }, { part: 0, x: 39, y: 81 } ],
  'lens-implants': [ { lens: 0, x: 16, y: 44 }, { lens: 3, x: 39, y: 44 } ],
  'laser-vision-correction': [ { part: 1, x: 44, y: 53 }, { part: 2, x: 16, y: 66 } ],
  'icl': [ { part: 1, x: 38, y: 58 }, { part: 2, x: 67, y: 58 } ],
  'keratoconus-cxl': [ { part: 1, x: 37, y: 44 }, { part: 2, x: 80, y: 33 } ],
  'corneal-transplant': [ { type: 0, x: 81, y: 26 }, { type: 1, x: 81, y: 52 }, { type: 2, x: 81, y: 79 } ],
  'intravitreal-injections': [ { part: 0, x: 45, y: 40 }, { part: 1, x: 64, y: 56 } ]
};

export function data(lang) {
  const L = o => o[lang];
  const tr = (ar, en) => (lang === 'ar' ? ar : en);
  const D = DOCTOR;
  const chief = D.professional.roles.find(r => r.id === 'magrabi-chief');
  const stat = D.credibility.statistics[0];
  const groups = Object.fromEntries(PROCEDURE_GROUPS.map(g => [g.id, L(g)]));
  const procs = PROCEDURES.map((p, i) => {
    const c = CONTENT[p.slug][lang];
    const labels = (ANCHORS[p.slug] || []).map(a => {
      if (a.part != null) return { k: a.part + 1, x: a.x, y: a.y, t: c.anatomy.parts[a.part][0], d: c.anatomy.parts[a.part][1] };
      if (a.type != null) return { k: a.type + 1, x: a.x, y: a.y, t: c.types[a.type][1], d: c.types[a.type][0] };
      const ls = LENS_SUMMARY[a.lens];
      return { k: a.lens + 1, x: a.x, y: a.y, t: lang === 'ar' ? ls.ar[0] : ls.en[0], d: lang === 'ar' ? ls.ar[1] : ls.en[1] };
    });
    return { n: String(i + 1).padStart(2, '0'), slug: p.slug, group: p.group, groupName: groups[p.group], name: L(p.name), summary: L(p.summary), alt: L(p.alt), intro: c.intro, parts: c.anatomy.parts, steps: c.steps, labels, simulator: !!p.simulator };
  });
  const page = k => SECTION_PAGES.find(s => s.key === k);
  return {
    lang, dir: lang === 'ar' ? 'rtl' : 'ltr', tr,
    name: L(D.identity.name), shortName: L(D.identity.shortName), title: L(D.identity.title), specialty: L(D.identity.specialty),
    kicker: tr('استشاري طب وجراحة العيون', 'Consultant ophthalmologist'), city: tr('المدينة المنورة', 'Madinah'),
    chief: lang === 'ar' ? chief.shortAr : chief.shortEn,
    rank: L(D.professional.academicRank),
    since: D.professional.experienceSince, years: yearsOfExperience(new Date('2026-11-07')),
    intro: tr(
      `${chief.shortAr}، و${D.professional.academicRank.ar}، يمارس طب وجراحة العيون منذ <bdi>${D.professional.experienceSince}</bdi> ويستقبل مراجعيه في ${D.clinic.name.ar}.`,
      `${chief.shortEn} and ${D.professional.academicRank.en}. In ophthalmic practice since <bdi>${D.professional.experienceSince}</bdi>, he sees patients at ${D.clinic.name.en}.`),
    quals: D.professional.qualifications.map(q => ({ short: q.short, full: L(q) })),
    roles: D.professional.roles.map(r => ({ id: r.id, current: r.current, text: lang === 'ar' ? (r.shortAr || r.ar) : (r.shortEn || r.en) })),
    stat: { value: stat.value, label: L(stat.label), scope: tr('إجمالي المسيرة: فحوص وإجراءات معاً', 'Career total: examinations and procedures combined') },
    facts: {
      sinceLabel: tr('بداية الممارسة السريرية والجراحية', 'In clinical & surgical practice since'),
      yearsSub: tr(`<bdi>${yearsOfExperience(new Date('2026-11-07'))}</bdi> عاماً من الخبرة`, `<bdi>${yearsOfExperience(new Date('2026-11-07'))}</bdi> years of experience`),
      frcsLabel: tr('زميل كلية الجراحين الملكية – بريطانيا', 'Royal College of Surgeons, UK'),
      frcsSub: tr('والبورد السعودي في طب وجراحة العيون', 'and the Saudi Board in Ophthalmology')
    },
    clinic: L(D.clinic.name), address: L(D.clinic.address), hours: L(D.clinic.workingHours),
    hoursNote: tr('يُرجى تأكيد الموعد عبر الحجز، فقد يتغير الجدول.', 'Please confirm through booking, as the schedule can change.'),
    clinicLine: D.contact.clinicDirect.display, callCenter: D.contact.callCenter.display, callShort: D.contact.callCenterShort.display,
    ui: {
      book: tr('احجز موعد كشف أو استشارة', 'Book a consultation'),
      bookShort: tr('احجز موعداً', 'Book appointment'),
      bookProc: tr('احجز استشارة مع د. معن', 'Book a consultation with Dr. Maan'),
      bookExam: tr('احجز موعد فحص', 'Book an examination'),
      about: tr('تعرّف على خبرته', 'Discover his expertise'),
      whatsapp: tr('واتساب', 'WhatsApp'), askWhatsapp: tr('اسأل عبر واتساب', 'Ask on WhatsApp'),
      clinicLineLabel: tr('عيادة الدكتور', 'Clinic line'), alsoOn: tr('متاح أيضاً على', 'also on'),
      readGuide: tr('اقرأ الدليل', 'Read the guide'), library: tr('مكتبة الإجراءات الكاملة', 'The full procedure library'),
      procsKicker: tr('الإجراءات والعلاجات', 'Procedures & treatments'), procsTitle: tr('ما الذي يعالجه د. معن؟', 'What Dr. Maan treats'),
      sevenTitle: tr('سبعة إجراءات، بلغة واضحة', 'Seven procedures, in plain language'),
      sevenLede: tr('لكل إجراء صفحة تشرح التشريح وخطوات الإجراء والتعافي والمخاطر. معلومات توعوية عامة بانتظار مراجعة د. معن، ولا تغني عن الفحص.', 'Each procedure has a page explaining the anatomy, the steps, recovery and risks. General education pending review by Dr. Maan; it does not replace an examination.'),
      allProcs: tr('جميع الإجراءات', 'All procedures'),
      startNeed: tr('ابدأ من حاجتك', 'Start from what you need'),
      notSure: tr('غير متأكد؟', 'Not sure?'), startExam: tr('ابدأ بفحص شامل', 'Start with an examination'),
      notSureText: tr('لا تحتاج إلى معرفة اسم الإجراء مسبقاً. يحدد الفحص سبب المشكلة والخيارات المناسبة لعينك.', 'You do not need to know the procedure name. An examination finds the cause and the options that suit your eye.'),
      onThisPage: tr('في هذه الصفحة', 'On this page'),
      review: tr('<strong>حالة المراجعة الطبية:</strong> مسودة بانتظار مراجعة د. معن', '<strong>Medical review status:</strong> draft pending review by Dr. Maan'),
      watch3d: tr('شاهد شرح العملية ثلاثي الأبعاد', 'Watch the 3D walkthrough'),
      home: tr('الرئيسية', 'Home'), menu: tr('القائمة', 'Menu'), closeMenu: tr('إغلاق القائمة', 'Close menu'),
      contents: tr('المحتويات', 'Contents'), procedures: tr('الإجراءات', 'Procedures'),
      maps: tr('موقع المستشفى على خرائط جوجل', 'Hospital on Google Maps'),
      appearance: tr('المظهر', 'Appearance'),
      langOther: tr('English', 'العربية'),
      eyeInSection: tr('رسم توضيحي للعين: الضوء يمر عبر القرنية والعدسة إلى الشبكية.', 'The eye in section: light passes through the cornea and lens to the retina.'),
      mainStages: tr('المراحل الرئيسية', 'The main stages'),
      onlineBooking: tr('الحجز الإلكتروني', 'Book online'),
      callCenterLabel: tr('مركز اتصال مغربي', 'Magrabi contact center'),
      hoursLabel: tr('مواعيد العيادة', 'Clinic hours')
    },
    nav: [
      ['about', 'عن الدكتور', 'About'], ['procedures', 'الإجراءات', 'Procedures'], ['lens-lab', 'مختبر العدسات', 'Lens Lab'],
      ['surgical-education', 'الجراحة ثلاثية الأبعاد', '3D surgery'], ['education', 'التثقيف الصحي', 'Education'], ['clinic', 'العيادة والحجز', 'Clinic & booking']
    ].map(([k, ar, en]) => ({ key: k, label: tr(ar, en), desc: page(k) ? L(page(k).description) : '' })),
    lightJourney: tr('رحلة الضوء في العين', 'How vision works'),
    sections: [
      ['anatomy', 'التشريح: أين يحدث الإجراء؟', 'Anatomy: where it happens'], ['purpose', 'الهدف من الإجراء', 'What it is for'],
      ['candidates', 'لمن قد يكون مناسباً؟', 'Who may be considered'], ['steps', 'ماذا يحدث؟ شرح مبسّط', 'What happens, in plain words'],
      ['benefits', 'الفوائد والحدود', 'Benefits and limitations'], ['risks', 'المخاطر والمضاعفات المحتملة', 'Risks and possible complications'],
      ['recovery', 'التعافي', 'Recovery'], ['faq', 'أسئلة شائعة', 'Questions']
    ].map(([k, ar, en]) => ({ key: k, label: tr(ar, en) })),
    groups: PROCEDURE_GROUPS.map(g => ({ id: g.id, name: L(g) })),
    procs,
    stages: SURGERY_STAGES[lang],
    visit: VISIT.map(v => v[lang]),
    lensSummary: LENS_SUMMARY.map(l => ({ code: l.code, name: l[lang][0], text: l[lang][1] })),
    lightPath: LIGHT_PATH.map(l => ({ slug: l.slug, name: l[lang][0], text: l[lang][1] }))
  };
}

// Tiny helpers shared by the three generators.
export const illus = (slug, { dark = false, small = false } = {}) => `${IMG}procedures/${slug}${dark ? '-dark' : ''}${small ? '-800' : ''}.webp`;
export const pic = (slug, alt, cls = '', { small = true, loading = 'eager' } = {}) =>
  `<picture class="${cls}"><source media="(prefers-color-scheme: dark)" srcset="${illus(slug, { dark: true, small })}"><img src="${illus(slug, { small })}" data-dark="${illus(slug, { dark: true, small })}" data-light="${illus(slug, { small })}" alt="${esc(alt)}" width="1600" height="1000" loading="${loading}" decoding="async"></picture>`;

// Theme / state switches via query string (?theme=dark, ?menu=open, ?nav=open) for the screenshots.
export const bootScript = `<script>(function(){var q=new URLSearchParams(location.search),r=document.documentElement;var t=q.get('theme');if(t)r.setAttribute('data-theme',t);if(q.get('menu')==='open')r.classList.add('menu-open');if(q.get('nav')==='open')r.classList.add('nav-open');
document.addEventListener('DOMContentLoaded',function(){var dark=r.getAttribute('data-theme')==='dark'||(!r.getAttribute('data-theme')&&matchMedia('(prefers-color-scheme: dark)').matches);document.querySelectorAll('img[data-dark]').forEach(function(i){var p=i.parentElement;if(p.tagName==='PICTURE'){p.querySelectorAll('source').forEach(function(s){s.remove()})}var n=dark?i.dataset.dark:i.dataset.light;if(i.getAttribute('src')!==n)i.src=n;});});})();</script>`;
