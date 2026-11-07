// ============================================================
// SINGLE SOURCE OF TRUTH — doctor, clinic, contact & trust data
// ------------------------------------------------------------
// Every public surface reads from this module:
//   • the rendered page (main.js)
//   • JSON-LD structured data (injected into index.html at build — vite.config.js)
//   • /llms.txt (generated at build — vite.config.js)
//
// Each fact carries a `source` key (see SOURCES). Source categories are distinct:
//   doctor  = personally confirmed by Dr. Maan (relayed by the site owner)
//   magrabi / taibah = officially published by the institution
//   owner   = supplied by the site owner, not separately confirmed
// Items with `status: 'pending'` are NOT rendered. Items that must never ship
// (e.g. the undefined "100%" statistic) live only in content/internal-registry.json,
// which the app never imports. Governance: docs/implementation/recovery/DOCTOR_CONTENT_RECOVERY.md
// ============================================================

export const SOURCES = {
  magrabi: {
    label: 'Magrabi Health — official doctor profile',
    url: 'https://www.magrabihealth.com/ar/sa/eye/our-doctors/dr-maan-abdullah-barry',
    accessed: '2026-10-31'
  },
  taibah: {
    label: 'Taibah University — faculty profile',
    url: 'https://www.taibahu.edu.sa/the-university/about-taibah-university/faculty-members/1431',
    accessed: '2026-10-31'
  },
  owner: {
    label: 'Supplied by the site owner (commit 2fbf261, 2026-10-25)',
    url: null,
    accessed: null
  },
  doctor: {
    label: 'Personally confirmed by Dr. Maan Al Barry, relayed by the site owner on 2026-11-01',
    url: null,
    accessed: '2026-11-01'
  }
};

// Public site address. NOTE: drmaanalbarry.com did not resolve on 2026-10-31 (see BLOCKERS.md, B-6).
export const SITE = {
  url: 'https://drmaanalbarry.com',
  image: 'https://drmaanalbarry.com/images/doctor-portrait.jpg'
};

export const DOCTOR = {
  identity: {
    name: { ar: 'د. معن بن عبدالله البري', en: 'Dr. Maan bin Abdullah Al Barry' },
    shortName: { ar: 'د. معن البري', en: 'Dr. Maan Al Barry' },
    alternateNames: ['Dr. Maan bin Abdullah Al Barry', 'Dr. Maan Al Barry', 'د. معن البري', 'د. معن عبدالله البري'],
    title: {
      ar: 'استشاري طب وجراحة العيون (تخصص جراحات القرنية والماء الأبيض وتصحيح الإبصار)',
      en: 'Consultant Ophthalmologist (Cornea, Cataract & Refractive Surgery)'
    },
    // Wording used by Magrabi Health ("استشاري المياه البيضاء وعمليات تصحيح الابصار والقرنية").
    specialty: { ar: 'المياه البيضاء، تصحيح الإبصار، والقرنية', en: 'Cataract, refractive surgery & cornea' },
    source: 'magrabi'
  },

  professional: {
    experienceSince: 1998, // source: owner
    qualifications: [
      { id: 'frcs', ar: 'زميل كلية الجراحين الملكية – بريطانيا (FRCS)', en: 'Fellow of the Royal College of Surgeons, UK (FRCS)', short: 'FRCS (UK)', source: 'magrabi' },
      { id: 'saudi-board', ar: 'البورد السعودي في طب وجراحة العيون', en: 'Saudi Board in Ophthalmology', short: 'Saudi Board', source: 'doctor' }
    ],
    // Ordered as displayed. `current` drives present/past tense everywhere (UI, JSON-LD, llms.txt).
    roles: [
      { id: 'magrabi-chief', current: true, source: 'doctor',
        ar: 'كبير موظفي مركز مغربي المدينة المنورة (المشرف العام على الشؤون الطبية والإدارية والتشغيلية بالفرع)',
        en: 'Chief of Staff – Magrabi Health Madinah (General Supervisor of Medical, Administrative & Operational Affairs)',
        shortAr: 'كبير موظفي مركز مغربي المدينة المنورة', shortEn: 'Chief of Staff – Magrabi Health Madinah' },
      { id: 'sscc-president', current: false, source: 'owner',
        ar: 'أول رئيس للرابطة السعودية لجراحي القرنية والماء الأبيض وتصحيح الإبصار',
        en: 'First President of the Saudi Association of Cornea, Cataract & Refractive Surgeons',
        shortAr: 'أول رئيس للرابطة السعودية لجراحي القرنية والماء الأبيض وتصحيح الإبصار', shortEn: '1st President – Saudi Cornea, Cataract & Refractive Surgeons' },
      { id: 'taibah-chair', current: false, source: 'owner',
        ar: 'رئيس قسم طب وجراحة العيون بجامعة طيبة سابقاً لمدة 10 سنوات',
        en: 'Former Chairman, Department of Ophthalmology – Taibah University (10 years)',
        shortAr: 'رئيس قسم طب وجراحة العيون بجامعة طيبة سابقاً (10 سنوات)', shortEn: 'Former Chair of Ophthalmology – Taibah Univ. (10 yrs)' },
      { id: 'sos-rep', current: false, source: 'owner',
        ar: 'ممثل الجمعية السعودية لطب العيون بالمدينة المنورة سابقاً',
        en: 'Former Representative of the Saudi Ophthalmological Society in Madinah' },
      { id: 'redsea', current: false, source: 'owner',
        ar: 'أحد مؤسسي مؤتمر البحر الأحمر الدولي للطب وجراحة العيون',
        en: 'Co-Founder of the Red Sea International Ophthalmology Conference' }
    ],
    memberships: [
      { ar: 'الجمعية السعودية لطب وجراحة العيون', en: 'Saudi Ophthalmological Society', source: 'magrabi' },
      { ar: 'الجمعية الأمريكية لطب وجراحة العيون', en: 'American Academy of Ophthalmology', source: 'magrabi' }
    ],
    // Published on the Taibah faculty profile and confirmed by Dr. Maan (2026-11-01).
    academicRank: { ar: 'أستاذ مشارك – جامعة طيبة', en: 'Associate Professor – Taibah University', source: 'doctor' },
    // The Saudi Board (above) is a confirmed qualification. A practising-licence number / SCFHS
    // classification has not been supplied, so no licence statement is published.
    licence: null
  },

  contact: {
    // Magrabi Health central call center — tel link used on the official Magrabi profile page.
    callCenter: { display: '920018000', tel: '920018000', source: 'magrabi', status: 'verified' },
    // Magrabi Health unified short number — "اتصل بمركز الاتصال 19505" on the official profile page.
    callCenterShort: { display: '19505', tel: '19505', source: 'magrabi', status: 'verified' },
    // Dr. Maan's direct clinic line. Approved by Dr. Maan for public use for BOTH calls and WhatsApp
    // (owner, 2026-11-01). It replaces the Magrabi WhatsApp line (966508533309) previously shown.
    clinicDirect: { display: '055 494 6433', tel: '+966554946433', source: 'doctor', status: 'confirmed', roles: ['call', 'whatsapp'] },
    whatsapp: { number: '966554946433', source: 'doctor', status: 'confirmed' },
    bookingUrl: 'https://ob.magrabi.com.sa/OnlineBooking/', // linked from the official Magrabi profile page
    email: null
  },

  clinic: {
    name: { ar: 'مغربي الصحية للعيون والأذن – المدينة المنورة', en: 'Magrabi Health Eye & ENT Hospital – Madinah' },
    address: {
      ar: 'طريق المطار، المدينة المنورة، المملكة العربية السعودية',
      en: 'Airport Road, Madinah, Saudi Arabia',
      street: 'طريق المطار', locality: 'المدينة المنورة', region: 'منطقة المدينة المنورة', country: 'SA'
    },
    hospitalUrl: 'https://www.magrabihealth.com/ar/sa/eye/branches/magrabi-health-eye--ear--al-madina-al-monawara',
    accreditations: ['JCI', 'CBAHI'], // stated on the official Magrabi profile page
    mapUrl: 'https://maps.app.goo.gl/Hx6M1eKNEnGbe7AbA',
    mapEmbedQuery: 'Magrabi+Eye+Hospital+Madinah',
    // Dr. Maan's clinic hours, confirmed by Dr. Maan (2026-11-01). Patients should still confirm a
    // specific appointment through booking, as the schedule can change.
    workingHours: {
      ar: 'السبت إلى الخميس: ٩:٠٠ ص – ١:٠٠ م · ٥:٠٠ م – ٩:٣٠ م',
      en: 'Saturday to Thursday: 9:00 AM – 1:00 PM · 5:00 PM – 9:30 PM',
      days: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      sessions: [['09:00', '13:00'], ['17:00', '21:30']],
      source: 'doctor'
    },
    source: 'magrabi'
  },

  social: {
    instagram: 'https://www.instagram.com/dr_maan_albarry',
    twitter: 'https://x.com/maanalbarry',
    youtube: 'https://www.youtube.com/@drmaanalbarry3195',
    magrabiProfile: SOURCES.magrabi.url,
    taibahProfile: SOURCES.taibah.url
  },

  credibility: {
    // A statistic is published only with a confirmed value AND a defined meaning.
    // "+15,000" was confirmed by Dr. Maan as a combined total of eye examinations and surgical
    // procedures (owner, 2026-11-01). "100%" has no measurable definition: internal registry only.
    statistics: [
      { id: 'cases-15000', value: '15,000+', source: 'doctor', status: 'confirmed',
        scope: 'career total; eye examinations and surgical procedures combined, not surgeries alone and not a patient count',
        label: { ar: 'فحص وإجراء جراحي في طب العيون', en: 'eye examinations & surgical procedures' } }
    ],
    // A testimonial renders only when isPublishableTestimonial() passes. The three reviews previously shown
    // exist on the Magrabi profile page, but reuse permission is undocumented and the site's text was
    // reworded from the originals, so none are published. BLOCKERS.md, B-2.
    testimonials: []
  },

  // Intentionally empty: there is no approved, documented lens preference to publish.
  // Lens content on the site is educational and neutral.
  medicalPreferences: {}
};

// ------------------------------------------------------------
// PROCEDURE SCOPE — the procedures this site describes as part of Dr. Maan's practice.
// Single source of truth for the homepage gallery, the /procedures/<slug>/ pages, the
// sitemap/prerender route list and the procedure JSON-LD.
//   source 'magrabi' = listed on the official Magrabi Health doctor profile (SOURCES.magrabi)
//   source 'owner'   = confirmed by the site owner on 2026-11-01 as procedures Dr. Maan
//                      personally performs (status 'confirmed'; not a Magrabi publication)
// History lives in content/internal-registry.json (ids `procedure-<slug>`).
// The long patient-education text for each page lives in src/procedures/content.js and is
// general education from AAO / NEI / NHS sources — it is NOT physician-reviewed yet.
// ------------------------------------------------------------
export const PROCEDURE_GROUPS = [
  { id: 'lens', ar: 'الماء الأبيض والعدسات', en: 'Cataract & lens surgery' },
  { id: 'refractive', ar: 'تصحيح الإبصار', en: 'Vision correction' },
  { id: 'cornea-retina', ar: 'القرنية والشبكية', en: 'Cornea & retina care' }
];

export const PROCEDURES = [
  {
    slug: 'cataract-surgery', group: 'lens', source: 'magrabi', status: 'published', kind: 'SurgicalProcedure', simulator: true,
    name: { ar: 'جراحة الماء الأبيض (الساد)', en: 'Cataract surgery' },
    summary: {
      ar: 'إزالة عدسة العين المعتمة واستبدالها بعدسة صناعية شفافة، عندما يبدأ ضعف الرؤية بالتأثير في حياتك اليومية.',
      en: 'The clouded natural lens is removed and replaced with a clear artificial lens once blurred vision starts to affect daily life.'
    },
    alt: { ar: 'رسم تشريحي لمقطع العين يُبرز العدسة الطبيعية خلف القزحية', en: 'Anatomical cross-section of the eye highlighting the natural lens behind the iris' },
    related: ['lens-implants', 'laser-vision-correction', 'icl']
  },
  {
    slug: 'lens-implants', group: 'lens', source: 'magrabi', status: 'published', kind: 'SurgicalProcedure',
    name: { ar: 'العدسات المزروعة داخل العين', en: 'Lens implants (IOLs)' },
    summary: {
      ar: 'أنواع العدسات التي تُزرع بعد إزالة الساد: أحادية البؤرة، ممتدة المدى، متعددة أو ثلاثية البؤرة، والتوريكية للاستجماتيزم.',
      en: 'The lenses placed during cataract surgery: monofocal, extended depth of focus, multifocal or trifocal, and toric for astigmatism.'
    },
    alt: { ar: 'رسم تشريحي لعدسة صناعية مزروعة داخل محفظة العدسة في العين', en: 'Anatomical illustration of an artificial lens implant sitting inside the eye’s lens capsule' },
    related: ['cataract-surgery', 'icl', 'laser-vision-correction']
  },
  {
    slug: 'laser-vision-correction', group: 'refractive', source: 'magrabi', status: 'published', kind: 'SurgicalProcedure',
    name: { ar: 'تصحيح الإبصار بالليزر', en: 'Laser vision correction' },
    summary: {
      ar: 'إعادة تشكيل القرنية بالليزر (ليزك، الليزر السطحي PRK، سمايل) لتقليل الاعتماد على النظارة أو العدسات اللاصقة.',
      en: 'Reshaping the cornea with a laser (LASIK, surface PRK, SMILE) to reduce dependence on glasses or contact lenses.'
    },
    alt: { ar: 'رسم تشريحي لمقطع القرنية يوضح منطقة إعادة التشكيل بالليزر', en: 'Anatomical illustration of the cornea in section showing the area reshaped by laser' },
    related: ['icl', 'keratoconus-cxl', 'lens-implants']
  },
  {
    slug: 'icl', group: 'refractive', source: 'owner', status: 'confirmed', confirmedOn: '2026-11-01', kind: 'SurgicalProcedure',
    name: { ar: 'زراعة العدسة اللاصقة الداخلية (ICL)', en: 'Implantable contact lens (ICL)' },
    summary: {
      ar: 'عدسة رقيقة تُزرع داخل العين مع الإبقاء على العدسة الطبيعية، خياراً لتصحيح النظر عندما لا يناسب الليزر.',
      en: 'A thin lens placed inside the eye while keeping the natural lens — an option for vision correction when laser is not suitable.'
    },
    alt: { ar: 'رسم تشريحي لعدسة ICL مزروعة بين القزحية والعدسة الطبيعية', en: 'Anatomical illustration of an ICL positioned between the iris and the natural lens' },
    related: ['laser-vision-correction', 'lens-implants', 'keratoconus-cxl']
  },
  {
    slug: 'keratoconus-cxl', group: 'cornea-retina', source: 'magrabi', status: 'published', kind: 'TherapeuticProcedure',
    name: { ar: 'القرنية المخروطية وتثبيت القرنية (CXL)', en: 'Keratoconus & corneal cross-linking (CXL)' },
    summary: {
      ar: 'تشخيص ترقق القرنية وتحدّبها، وتثبيتها بقطرات الريبوفلافين والأشعة فوق البنفسجية بهدف إبطاء تطور الحالة.',
      en: 'Diagnosing a thinning, bulging cornea, and cross-linking it with riboflavin drops and UV light to help slow progression.'
    },
    alt: { ar: 'رسم تشريحي لقرنية مخروطية الشكل مقارنة بالقرنية الطبيعية', en: 'Anatomical illustration of a cone-shaped cornea compared with a normal cornea' },
    related: ['corneal-transplant', 'laser-vision-correction', 'icl']
  },
  {
    slug: 'corneal-transplant', group: 'cornea-retina', source: 'owner', status: 'confirmed', confirmedOn: '2026-11-01', kind: 'SurgicalProcedure',
    name: { ar: 'زراعة القرنية', en: 'Corneal transplant (keratoplasty)' },
    summary: {
      ar: 'استبدال القرنية المتضررة كلياً أو جزئياً بنسيج قرنية من متبرع، حين لا تكفي العلاجات الأخرى.',
      en: 'Replacing all or part of a damaged cornea with donor corneal tissue when other treatments are not enough.'
    },
    alt: { ar: 'رسم تشريحي لطبقات القرنية يوضح الجزء المستبدل في زراعة القرنية', en: 'Anatomical illustration of the corneal layers showing the part replaced in a transplant' },
    related: ['keratoconus-cxl', 'cataract-surgery', 'intravitreal-injections']
  },
  {
    slug: 'intravitreal-injections', group: 'cornea-retina', source: 'owner', status: 'confirmed', confirmedOn: '2026-11-01', kind: 'TherapeuticProcedure',
    name: { ar: 'حقن العين (داخل الجسم الزجاجي)', en: 'Intravitreal injections' },
    summary: {
      ar: 'إيصال الدواء مباشرة إلى داخل العين لعلاج حالات في الشبكية، مثل التنكس البقعي الرطب ووذمة البقعة السكرية.',
      en: 'Medicine delivered directly inside the eye to treat retinal conditions such as wet macular degeneration and diabetic macular oedema.'
    },
    alt: { ar: 'رسم تشريحي لمقطع العين يوضح الجسم الزجاجي والشبكية والبقعة', en: 'Anatomical cross-section of the eye showing the vitreous, retina and macula' },
    related: ['cataract-surgery', 'corneal-transplant', 'lens-implants']
  }
];

export const procedureBySlug = slug => PROCEDURES.find(p => p.slug === slug) || null;

/** Returns true only for testimonials that meet every publication requirement. */
export function isPublishableTestimonial(t) {
  return Boolean(
    t &&
    t.source && /^https:\/\//.test(t.source.url || '') &&
    t.permission && t.permission.documented === true && t.permission.reference &&
    t.attribution && t.attribution.trim() &&
    t.approvedText && (t.approvedText.ar || t.approvedText.en)
  );
}

export const publishableTestimonials = () => DOCTOR.credibility.testimonials.filter(isPublishableTestimonial);

/** Contacts that may appear publicly (pending entries are excluded). */
export const PUBLIC_CONTACT = Object.fromEntries(
  Object.entries(DOCTOR.contact).filter(([, v]) => !(v && typeof v === 'object' && v.status === 'pending'))
);

export const whatsappUrl = (msg) =>
  `https://wa.me/${DOCTOR.contact.whatsapp.number}?text=${encodeURIComponent(msg || 'مرحباً، أرغب بالاستفسار عن موعد مع د. معن البري في مغربي المدينة المنورة.')}`;

export const yearsOfExperience = (now = new Date()) => now.getFullYear() - DOCTOR.professional.experienceSince;

// ------------------------------------------------------------
// FAQ — rendered on the page AND published as FAQPage JSON-LD.
// ------------------------------------------------------------
const c = DOCTOR.contact;
export const FAQ = [
  {
    q: { ar: 'ما هو التخصص الدقيق للدكتور معن بن عبدالله البري؟', en: "What are Dr. Maan Al Barry's areas of specialty?" },
    a: {
      ar: 'استشاري طب وجراحة العيون، يعمل ضمن وحدة المياه البيضاء ووحدة جراحة القرنية وتصحيح النظر، ويقيّم حالات المياه البيضاء (الساد) وزراعة العدسات، وتصحيح الإبصار بالليزر، وأمراض القرنية والقرنية المخروطية وتثبيت القرنية (CXL).',
      en: 'He is a Consultant Ophthalmologist working within the cataract unit and the cornea & refractive surgery unit. He evaluates cataract and lens implantation, laser vision correction, and corneal conditions including keratoconus and corneal cross-linking (CXL).'
    }
  },
  {
    q: { ar: 'أين تقع عيادة الدكتور معن بن عبدالله البري وكيف يمكن الوصول إليها؟', en: "Where is Dr. Maan Al Barry's clinic located?" },
    a: {
      ar: `يستقبل د. معن البري مراجعيه في ${DOCTOR.clinic.name.ar}، الواقع على طريق المطار. يمكنك فتح موقع المستشفى على خرائط جوجل من قسم العيادة في هذا الموقع.`,
      en: `At ${DOCTOR.clinic.name.en}, located on Airport Road. You can open the hospital location in Google Maps from the clinic section of this website.`
    }
  },
  {
    q: { ar: 'كيف يمكنني حجز موعد مع الطبيب؟', en: 'How can I book an appointment?' },
    a: {
      ar: `عبر بوابة الحجز الإلكتروني الرسمية لمغربي (ob.magrabi.com.sa)، أو الاتصال بمركز اتصال مغربي على ${c.callCenter.display} أو ${c.callCenterShort.display}، أو التواصل مباشرة مع عيادة د. معن اتصالاً أو واتساب على ${c.clinicDirect.display}.`,
      en: `Through the official Magrabi online booking portal (ob.magrabi.com.sa), by calling the Magrabi contact center on ${c.callCenter.display} or ${c.callCenterShort.display}, or by contacting Dr. Maan's clinic directly by phone or WhatsApp on ${c.clinicDirect.display}.`
    }
  },
  {
    q: { ar: 'هل يضمن محاكي الرؤية النتيجة الفعلية للعملية الجراحية؟', en: 'Does the Vision Simulator guarantee the actual result of surgery?' },
    a: {
      ar: 'كلا، محاكي الرؤية أداة تعليمية وتوضيحية عامة لشرح الفروقات المفاهيمية بين العدسات. النتيجة الفعلية تعتمد على فحص تضاريس القرنية، صحة الشبكية، وقياسات العين الدقيقة التي يجريها الاستشاري.',
      en: 'No. The simulator is strictly an educational tool illustrating optical principles. Real-world postoperative vision depends on clinical biometry, corneal shape, retinal health, and individual healing.'
    }
  }
  // Procedure-specific questions live on their procedure pages (and in those pages' FAQPage JSON-LD):
  // "glasses after cataract surgery" → /procedures/cataract-surgery/, "LASIK criteria" → /procedures/laser-vision-correction/.
];

// ------------------------------------------------------------
// Structured data (JSON-LD) — built from the data above only.
// No Review / AggregateRating, no opening hours or geo until approved.
// ------------------------------------------------------------
export function buildJsonLd() {
  const d = DOCTOR;
  const currentRoles = d.professional.roles.filter(r => r.current).map(r => r.shortAr || r.ar);
  const hospital = {
    '@type': 'Hospital',
    name: d.clinic.name.ar,
    alternateName: d.clinic.name.en,
    url: d.clinic.hospitalUrl,
    telephone: d.contact.callCenter.tel,
    address: {
      '@type': 'PostalAddress',
      streetAddress: d.clinic.address.street,
      addressLocality: d.clinic.address.locality,
      addressRegion: d.clinic.address.region,
      addressCountry: d.clinic.address.country
    }
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Physician',
        '@id': `${SITE.url}/#physician`,
        name: d.identity.name.ar,
        alternateName: d.identity.alternateNames,
        jobTitle: d.identity.title.ar,
        description: `${d.identity.title.ar}. ${currentRoles.join('، ')}. ${d.clinic.name.ar}.`,
        image: SITE.image,
        url: SITE.url,
        telephone: d.contact.callCenter.tel,
        medicalSpecialty: ['Ophthalmologic'],
        knowsAbout: PROCEDURES.map(p => p.name.en),
        hasCredential: d.professional.qualifications.map(q => ({
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: q.id === 'frcs' ? 'Fellowship' : 'Board certification',
          name: q.en,
          recognizedBy: { '@type': 'Organization', name: q.id === 'frcs' ? 'Royal College of Surgeons, United Kingdom' : 'Saudi Commission for Health Specialties' }
        })),
        openingHoursSpecification: d.clinic.workingHours.sessions.map(([opens, closes]) => ({
          '@type': 'OpeningHoursSpecification', dayOfWeek: d.clinic.workingHours.days, opens, closes
        })),
        memberOf: d.professional.memberships.map(m => ({ '@type': 'Organization', name: m.en })),
        worksFor: [hospital],
        sameAs: [d.social.magrabiProfile, d.social.taibahProfile],
        contactPoint: { '@type': 'ContactPoint', telephone: d.contact.clinicDirect.tel, contactType: 'appointments', availableLanguage: ['ar', 'en'] }
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE.url}/#faq`,
        mainEntity: FAQ.map(f => ({
          '@type': 'Question',
          name: f.q.ar,
          acceptedAnswer: { '@type': 'Answer', text: f.a.ar }
        }))
      }
    ]
  };
}

// ------------------------------------------------------------
// /llms.txt — generated from the same data at build time.
// ------------------------------------------------------------
export function buildLlmsTxt() {
  const d = DOCTOR;
  const roles = d.professional.roles.map((r, i) => `${i + 1}. ${r.ar} — ${r.en}`).join('\n');
  const quals = d.professional.qualifications.map(q => `- ${q.ar} — ${q.en}`).join('\n');
  return `# ${d.identity.name.en} (${d.identity.name.ar})
> ${d.identity.title.ar}
> ${d.identity.title.en}

## Identity
- Name (Arabic): ${d.identity.name.ar}
- Name (English): ${d.identity.name.en}
- Title: ${d.identity.title.en}
- Clinical, academic and surgical experience since ${d.professional.experienceSince}
- Academic rank: ${d.professional.academicRank.en}
${d.credibility.statistics.map(s => `- ${s.value} ${s.label.en} (${s.scope})`).join('\n')}

## Qualifications
${quals}

## Appointments & roles
${roles}

## Clinic & patient access
- Practice location: ${d.clinic.name.en} (${d.clinic.name.ar})
- Address: ${d.clinic.address.en}
- Hospital accreditations (per Magrabi Health): ${d.clinic.accreditations.join(', ')}
- Magrabi contact center: ${d.contact.callCenter.display} / ${d.contact.callCenterShort.display}
- Dr. Maan's clinic direct line (calls & WhatsApp): ${d.contact.clinicDirect.display} (${d.contact.clinicDirect.tel})
- Official online booking portal: ${d.contact.bookingUrl}
- Google Maps: ${d.clinic.mapUrl}
- Clinic hours: ${d.clinic.workingHours.en}

## Procedures described on this website
${PROCEDURES.map(p => `- ${p.name.en} (${p.name.ar}) — ${p.source === 'magrabi' ? 'listed on the Magrabi Health profile' : 'confirmed by the site owner as performed by Dr. Maan'}`).join('\n')}
- Procedure pages are general patient education (AAO, NEI, NHS sources) and are marked as drafts pending Dr. Maan's medical review.

## Lens & simulator information
- Intraocular lens content on this website is educational. Monofocal, extended depth of focus (EDOF) and trifocal lenses each have trade-offs; no single lens suits every patient, and the choice is made individually after examination.
- Vision simulator: an educational illustration of relative differences across viewing distances. Individual results depend on a full clinical evaluation.

## Pages (Arabic at the site root, English under /en/)
- / — home: the physician, expertise, core specialties, booking
- /about/ — professional profile: qualifications, appointments, dated record
- /procedures/ — procedure library; /procedures/<slug>/ — one guide per procedure
- /lens-lab/ — Vision & Lens Lab (educational lens comparison and vision simulator)
- /surgical-education/ — 3D cataract surgery walkthrough
- /education/ — patient education guides, visual lifestyle questionnaire, warning signs
- /how-vision-works/ — the light journey through the eye
- /clinic/ — booking routes, clinic hours, visit pathway, map

## Sources
- ${SOURCES.magrabi.label}: ${SOURCES.magrabi.url}
- ${SOURCES.taibah.label}: ${SOURCES.taibah.url}
`;
}

// ------------------------------------------------------------
// BreadcrumbList for every page below the home page. `trail` = [{ name, path }] from
// site-routes.js breadcrumbFor(); paths are site-root-relative.
// ------------------------------------------------------------
export function buildBreadcrumbJsonLd(trail, siteUrl, pageUrl) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: trail.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: `${siteUrl}/${c.path}` }))
  };
}

// The hospital as published by Magrabi Health (shared by the home graph and the clinic page).
function hospitalNode() {
  const d = DOCTOR;
  return {
    '@type': 'Hospital',
    name: d.clinic.name.ar,
    alternateName: d.clinic.name.en,
    url: d.clinic.hospitalUrl,
    telephone: d.contact.callCenter.tel,
    address: {
      '@type': 'PostalAddress',
      streetAddress: d.clinic.address.street,
      addressLocality: d.clinic.address.locality,
      addressRegion: d.clinic.address.region,
      addressCountry: d.clinic.address.country
    }
  };
}

/**
 * Structured data for the Phase 1 section pages (/about/, /procedures/, /lens-lab/, /surgical-education/,
 * /education/, /how-vision-works/, /clinic/). Built only from facts in this module; no ratings, no outcomes.
 *   page      section key (site-routes.js SECTION_PAGES)
 *   meta      { title, description } of the page
 *   trail     breadcrumb trail (site-routes.js breadcrumbFor)
 *   extra     { procedureUrls: [{ name, url }] } for the procedure library
 */
export function buildSectionJsonLd(page, lang, pageUrl, siteUrl, meta, trail, extra = {}) {
  const d = DOCTOR;
  const physicianRef = { '@id': `${SITE.url}/#physician` };
  const site = { '@type': 'WebSite', url: `${siteUrl}/`, name: d.identity.name[lang] };
  const base = { '@id': `${pageUrl}#webpage`, url: pageUrl, name: meta.title, description: meta.description, inLanguage: lang, isPartOf: site, breadcrumb: { '@id': `${pageUrl}#breadcrumb` } };
  const graph = [];
  if (page === 'about') {
    const physician = buildJsonLd()['@graph'].find(n => n['@type'] === 'Physician');
    graph.push({ '@type': 'ProfilePage', ...base, mainEntity: physician });
  } else if (page === 'procedures') {
    graph.push({ '@type': 'CollectionPage', ...base, about: physicianRef,
      mainEntity: { '@type': 'ItemList', itemListElement: (extra.procedureUrls || []).map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: p.url })) } });
  } else if (page === 'clinic') {
    graph.push({ '@type': 'ContactPage', ...base, about: { '@id': `${pageUrl}#clinic` } });
    graph.push({
      '@type': 'MedicalClinic',
      '@id': `${pageUrl}#clinic`,
      name: lang === 'ar' ? `عيادة ${d.identity.shortName.ar} – ${d.clinic.name.ar}` : `${d.identity.shortName.en}'s clinic – ${d.clinic.name.en}`,
      url: pageUrl,
      telephone: d.contact.clinicDirect.tel,
      medicalSpecialty: 'Ophthalmologic',
      address: hospitalNode().address,
      openingHoursSpecification: d.clinic.workingHours.sessions.map(([opens, closes]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: d.clinic.workingHours.days, opens, closes })),
      parentOrganization: hospitalNode(),
      employee: physicianRef
    });
  } else {
    graph.push({ '@type': 'MedicalWebPage', ...base, audience: { '@type': 'PeopleAudience', audienceType: 'Patient' } });
  }
  graph.push(buildBreadcrumbJsonLd(trail, siteUrl, pageUrl));
  return { '@context': 'https://schema.org', '@graph': graph };
}

// ------------------------------------------------------------
// Procedure page structured data: a MedicalWebPage about a MedicalProcedure.
// No ratings, reviews, outcomes, prices, `reviewedBy` or `lastReviewed`: the pages
// have not been medically reviewed yet.
//   pageUrl  absolute canonical URL of the page
//   siteUrl  absolute site root (no trailing slash)
//   faq      [{ q, a }] in the page language, exactly as rendered
// ------------------------------------------------------------
export function buildProcedureJsonLd(slug, lang, pageUrl, siteUrl, faq = [], trail = null) {
  const p = procedureBySlug(slug);
  if (!p) throw new Error(`unknown procedure ${slug}`);
  const graph = [
    {
      '@type': 'MedicalWebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: p.name[lang],
      description: p.summary[lang],
      inLanguage: lang,
      about: { '@id': `${pageUrl}#procedure` },
      mainEntity: { '@id': `${pageUrl}#procedure` },
      audience: { '@type': 'PeopleAudience', audienceType: 'Patient' },
      isPartOf: { '@type': 'WebSite', url: `${siteUrl}/`, name: DOCTOR.identity.name[lang] }
    },
    {
      '@type': p.kind === 'TherapeuticProcedure' ? 'TherapeuticProcedure' : 'SurgicalProcedure',
      '@id': `${pageUrl}#procedure`,
      name: p.name[lang],
      alternateName: p.name[lang === 'ar' ? 'en' : 'ar'],
      description: p.summary[lang],
      bodyLocation: lang === 'ar' ? 'العين' : 'Eye'
    }
  ];
  if (faq.length) graph.push({
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  });
  if (trail && trail.length) graph.push(buildBreadcrumbJsonLd(trail, siteUrl, pageUrl));
  return { '@context': 'https://schema.org', '@graph': graph };
}
