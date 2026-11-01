// ============================================================
// SINGLE SOURCE OF TRUTH — doctor, clinic, contact & trust data
// ------------------------------------------------------------
// Every public surface reads from this module:
//   • the rendered page (main.js)
//   • JSON-LD structured data (injected into index.html at build — vite.config.js)
//   • /llms.txt (generated at build — vite.config.js)
//
// Each fact carries a `source` key (see SOURCES) and, where it is not yet
// confirmed by the clinic, `status: 'pending'`. Pending items are NOT rendered.
// The open decisions are listed in docs/implementation/phase-0-phase-1/DOCTOR_DATA_DECISIONS.md
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
    label: 'Supplied by the site owner (commit 2fbf261, 2026-10-25) — awaiting written clinic confirmation',
    url: null,
    accessed: null
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
      { id: 'frcs', ar: 'زميل كلية الجراحين الملكية – بريطانيا (FRCS)', en: 'Fellow of the Royal College of Surgeons, UK (FRCS)', short: 'FRCS (UK)', source: 'magrabi' }
    ],
    // Ordered as displayed. `current` drives present/past tense everywhere (UI, JSON-LD, llms.txt).
    roles: [
      { id: 'magrabi-chief', current: true, source: 'owner',
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
    academicRank: { ar: 'أستاذ مشارك – جامعة طيبة', en: 'Associate Professor – Taibah University', source: 'taibah' },
    // No licence / board-certification statement has been verified against an official record.
    // Keep null until the SCFHS record is supplied (BLOCKERS.md, B-3).
    licence: null
  },

  contact: {
    // Magrabi Health central call center — tel link used on the official Magrabi profile page.
    callCenter: { display: '920018000', tel: '920018000', source: 'magrabi', status: 'verified' },
    // Magrabi Health unified short number — "اتصل بمركز الاتصال 19505" on the official profile page.
    callCenterShort: { display: '19505', tel: '19505', source: 'magrabi', status: 'verified' },
    // WhatsApp appointment line that Magrabi publishes for Dr. Maan on his official profile page.
    whatsapp: { number: '966508533309', source: 'magrabi', status: 'verified' },
    // A direct clinic mobile number was added to the site on 2026-10-25 without a source. It is kept out
    // of public code until the clinic confirms who answers it and for which role (call, WhatsApp, or both).
    // Record and decision: DOCTOR_DATA_DECISIONS.md, D-1 / BLOCKERS.md, B-1.
    clinicDirect: null,
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
    // Dr. Maan's clinic hours have not been confirmed (site, JSON-LD and owner notes disagreed).
    // Nothing is rendered or published until approved. BLOCKERS.md, B-4.
    workingHours: null,
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
    // A statistic is shown only with a documented source and clinic approval. None currently qualify:
    // "+15,000 procedures" and "100% protocol adherence" had no source and were removed.
    statistics: [],
    // A testimonial renders only when isPublishableTestimonial() passes. The three reviews previously shown
    // exist on the Magrabi profile page, but reuse permission is undocumented and the site's text was
    // reworded from the originals, so none are published. BLOCKERS.md, B-2.
    testimonials: []
  },

  // Intentionally empty: there is no approved, documented lens preference to publish.
  // Lens content on the site is educational and neutral.
  medicalPreferences: {}
};

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
      ar: `عبر بوابة الحجز الإلكتروني الرسمية لمغربي (ob.magrabi.com.sa)، أو الاتصال بمركز اتصال مغربي على ${c.callCenter.display} أو ${c.callCenterShort.display}، أو الاستفسار عن أقرب موعد عبر واتساب مغربي المخصص لمواعيد د. معن.`,
      en: `Through the official Magrabi online booking portal (ob.magrabi.com.sa), by calling the Magrabi contact center on ${c.callCenter.display} or ${c.callCenterShort.display}, or by asking about the nearest appointment through Magrabi's WhatsApp line for Dr. Maan.`
    }
  },
  {
    q: { ar: 'هل يضمن محاكي الرؤية النتيجة الفعلية للعملية الجراحية؟', en: 'Does the Vision Simulator guarantee the actual result of surgery?' },
    a: {
      ar: 'كلا، محاكي الرؤية أداة تعليمية وتوضيحية عامة لشرح الفروقات المفاهيمية بين العدسات. النتيجة الفعلية تعتمد على فحص تضاريس القرنية، صحة الشبكية، وقياسات العين الدقيقة التي يجريها الاستشاري.',
      en: 'No. The simulator is strictly an educational tool illustrating optical principles. Real-world postoperative vision depends on clinical biometry, corneal shape, retinal health, and individual healing.'
    }
  },
  {
    q: { ar: 'هل يمكن الاستغناء التام عن النظارات بعد عملية المياه البيضاء؟', en: 'Can I stop wearing glasses completely after cataract surgery?' },
    a: {
      ar: 'قد تقلل بعض العدسات الحديثة مثل ثلاثية البؤرة (Trifocal) وممتدة المدى (EDOF) الاعتماد على النظارات في كثير من الأنشطة، لكن لا يمكن ضمان الاستغناء التام عن النظارة لكل مريض، ويختلف ذلك بحسب حالة العين ونوع العدسة والإضاءة.',
      en: 'Some modern lenses, such as trifocal and extended depth of focus (EDOF) designs, can reduce dependence on glasses for many tasks, but complete spectacle independence cannot be guaranteed for every patient; it varies with the eye, the lens type and lighting.'
    }
  },
  {
    q: { ar: 'ما هي معايير ترشيح المريض لعمليات تصحيح النظر بالليزك؟', en: 'What are the main criteria for laser vision correction (LASIK)?' },
    a: {
      ar: 'من المعايير الشائعة: ألا يقل العمر عن 18 عاماً، وثبات درجة النظر لمدة عام تقريباً، وسماكة قرنية كافية، وخلو القرنية من علامات القرنية المخروطية أو الجفاف الشديد غير المعالج. ويُحسم القرار بعد تصوير القرنية الطبقي والفحص الشامل.',
      en: 'Common criteria include being at least 18 years old, a stable prescription for about a year, adequate corneal thickness, and no signs of keratoconus or untreated severe dry eye. The decision is made after corneal tomography and a full examination.'
    }
  }
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
        knowsAbout: ['Cataract Surgery', 'Intraocular Lens Implantation', 'Refractive Surgery', 'Corneal Cross-Linking (CXL)', 'Keratoconus'],
        hasCredential: d.professional.qualifications.map(q => ({
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'Fellowship',
          name: q.en,
          recognizedBy: { '@type': 'Organization', name: 'Royal College of Surgeons, United Kingdom' }
        })),
        memberOf: d.professional.memberships.map(m => ({ '@type': 'Organization', name: m.en })),
        worksFor: [hospital],
        sameAs: [d.social.magrabiProfile, d.social.taibahProfile]
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

## Qualifications
${quals}

## Appointments & roles (as stated by the site owner)
${roles}

## Clinic & patient access
- Practice location: ${d.clinic.name.en} (${d.clinic.name.ar})
- Address: ${d.clinic.address.en}
- Hospital accreditations (per Magrabi Health): ${d.clinic.accreditations.join(', ')}
- Magrabi contact center: ${d.contact.callCenter.display} / ${d.contact.callCenterShort.display}
- Magrabi WhatsApp line for Dr. Maan's appointments: +${d.contact.whatsapp.number}
- Official online booking portal: ${d.contact.bookingUrl}
- Google Maps: ${d.clinic.mapUrl}
- Clinic hours: please confirm with the Magrabi contact center or booking portal.

## Lens & simulator information
- Intraocular lens content on this website is educational. Monofocal, extended depth of focus (EDOF) and trifocal lenses each have trade-offs; no single lens suits every patient, and the choice is made individually after examination.
- Vision simulator: an educational illustration of relative differences across viewing distances. Individual results depend on a full clinical evaluation.

## Sources
- ${SOURCES.magrabi.label}: ${SOURCES.magrabi.url}
- ${SOURCES.taibah.label}: ${SOURCES.taibah.url}
`;
}
