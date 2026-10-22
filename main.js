import './style.css';

// ============================================================
// DR. MAAN AL BARRY — OFFICIAL MEDICAL WEBSITE
// Bilingual Ophthalmology Website with Vision Simulator & IOL Guide
// ============================================================

// --- DATA LAYER (Verified Primary Source Facts) ---
const DOCTOR = {
  nameAr: 'د. معن عبدالله عمر البري',
  nameEn: 'Dr. Maan Abdullah Omar Al Barry',
  shortNameAr: 'د. معن البري',
  shortNameEn: 'Dr. Maan Al Barry',
  titleAr: 'استشاري المياه البيضاء وعمليات تصحيح الإبصار والقرنية',
  titleEn: 'Consultant Ophthalmologist — Cataract, Cornea & Refractive Surgery',
  degreesAr: 'زميل كلية الجراحين الملكية (بريطانيا) FRCS',
  degreesEn: 'Fellow of the Royal College of Surgeons (UK) FRCS',
  clinicAr: 'مغربي الصحية للعيون والأذن – المدينة المنورة',
  clinicEn: 'Magrabi Health Eye & ENT – Madinah',
  addressAr: 'طريق المطار، المدينة المنورة، المملكة العربية السعودية',
  addressEn: 'Airport Road, Madinah, Saudi Arabia',
  whatsapp: '966508533309',
  bookingUrl: 'https://ob.magrabi.com.sa/OnlineBooking/',
  callCenter: '19505',
  landline: '920018000',
  magrabiProfile: 'https://www.magrabihealth.com/ar/sa/eye/our-doctors/dr-maan-abdullah-barry',
  taibahProfile: 'https://www.taibahu.edu.sa/the-university/about-taibah-university/faculty-members/1431',
  email: 'mbarry@taibahu.edu.sa',
  mapsUrl: 'https://maps.google.com/?q=Magrabi+Hospital+Madinah+Airport+Road',
  roles: {
    ar: [
      'المدير الطبي التنفيذي – مغربي المدينة المنورة',
      'رئيس قسم طب وجراحة العيون – جامعة طيبة',
      'ممثل الجمعية السعودية لطب وجراحة العيون – المدينة المنورة',
      'عضو المجلس العلمي لمؤتمر البحر الأحمر لطب وجراحة العيون',
      'أمين سر الجمعية السعودية لطب العيون سابقاً',
      'زميل كلية الجراحين الملكية – بريطانيا (FRCS)',
      'عضو الجمعية الأمريكية لطب وجراحة العيون (AAO)',
      'عضو الجمعية السعودية لطب وجراحة العيون (SOS)',
    ],
    en: [
      'Chief Medical Officer – Magrabi Madinah',
      'Chairman, Department of Ophthalmology – Taibah University',
      'Saudi Ophthalmological Society Representative – Madinah',
      'Scientific Council Member – Red Sea Ophthalmology Conference',
      'Former Secretary General – Saudi Ophthalmological Society',
      'Fellow of the Royal College of Surgeons – UK (FRCS)',
      'Member – American Academy of Ophthalmology (AAO)',
      'Member – Saudi Ophthalmological Society (SOS)',
    ]
  }
};

// --- BILINGUAL CONTENT (ARABIC & ENGLISH) ---
const i18n = {
  ar: {
    lang: 'ar',
    dir: 'rtl',
    nav: {
      home: 'الرئيسية',
      profile: 'السيرة المهنية',
      specialties: 'التخصصات',
      cataracts: 'المياه البيضاء والعدسات',
      simulator: 'محاكي الرؤية',
      questionnaire: 'استبيان العدسات',
      education: 'التثقيف الصحي',
      clinic: 'العيادة والحجز',
      faq: 'أسئلة شائعة'
    },
    hero: {
      badge: 'استشاري طب وجراحة العيون — المدينة المنورة',
      h1: `رعاية متخصصة لصحة العين<br><span class="gold-text">وجراحة المياه البيضاء وتصحيح الإبصار</span>`,
      subtitle: 'تقييم شامل لحالات المياه البيضاء، القرنية المخروطية، وتصحيح النظر بالليزر، مع شرح علمي وافٍ للخيارات الطبية المناسبة لكل مريض بناءً على الفحص الدقيق والقياسات السريرية.',
      cta1: 'احجز موعدك في مغربي',
      cta2: 'استفسر عبر واتساب',
      cred1: 'المدير الطبي لمغربي المدينة',
      cred2: 'رئيس قسم العيون بجامعة طيبة',
      cred3: 'زميل كلية الجراحين الملكية (FRCS)',
      stat1: '+200 تقييم موثق',
      stat2: 'مستشفى معتمد JCI وCBAHI',
      stat3: '+70 عاماً خبرة مغربي',
    },
    profile: {
      label: 'السيرة المهنية والخبرات',
      title: 'د. معن عبدالله عمر البري',
      subtitle: 'استشاري المياه البيضاء وعمليات تصحيح الإبصار والقرنية',
      bio1: 'د. معن عبدالله البري استشاري طب وجراحة العيون في مغربي الصحية للعيون والأذن بالمدينة المنورة. يعمل ضمن وحدة المياه البيضاء ووحدة جراحة القرنية وتصحيح النظر، ويساعد المرضى في تقييم الحالات التي تتطلب دقة متناهية في فحص العدسة، فحص تضاريس القرنية، وملاءمة الإجراءات العلاجية والجراحية.',
      bio2: 'تتكامل خبرته السريرية مع أدوار قيادية وأكاديمية بارزة؛ حيث يشغل منصب المدير الطبي التنفيذي لمغربي المدينة المنورة، ورئيس قسم طب وجراحة العيون في جامعة طيبة، وممثل الجمعية السعودية لطب وجراحة العيون في منطقة المدينة المنورة، إلى جانب عضويته في المجلس العلمي لمؤتمر البحر الأحمر لطب وجراحة العيون.',
      qualificationsTitle: 'المؤهلات والعضويات الرسمية',
      timelineTitle: 'المسيرة القيادية والأكاديمية',
      galleryTitle: 'المشاركات العلمية والمؤتمرات',
      reviewsTitle: 'تجارب المرضى في مغربي المدينة المنورة',
      reviewsSubtitle: 'آراء وتقييمات من مرضى زاروا عيادة د. معن البري'
    },
    specialties: {
      label: 'التخصصات السريرية',
      title: 'مجالات الرعاية الطبية والجراحية',
      desc: 'خدمات تشخيصية وعلاجية مبنية على أحدث البروتوكولات والقياسات الطبية الدقيقة.',
      items: [
        {
          icon: '👁',
          title: 'جراحة المياه البيضاء وزراعة العدسات',
          desc: 'إزالة إعتام عدسة العين بالموجات فوق الصوتية (الفاكو) عبر فتحة ميكروسكوبية، وزراعة أحدث العدسات داخل العين (أحادية البؤرة، ممتدة العمق EDOF، أو متعددة/ثلاثية البؤرة).'
        },
        {
          icon: '🔬',
          title: 'تصحيح الإبصار بالليزر والليزك',
          desc: 'تقييم شامل لملائمة تصحيح النظر بالليزك والفيمتو ليزك والسطحي (PRK)، بناءً على فحص تضاريس القرنية وسماكتها واستقرار قياسات النظر.'
        },
        {
          icon: '🫧',
          title: 'أمراض القرنية والقرنية المخروطية',
          desc: 'تشخيص مبكر للقرنية المخروطية وإجراء تثبيت القرنية الضوئي (CXL) لمنع تطور الحالة، وتقديم خطط علاجية ومتابعة دورية لحفظ النظر.'
        },
        {
          icon: '📐',
          title: 'الفحوصات الشاملة وقياسات ما قبل الجراحة',
          desc: 'قياس أبعاد العين بدقة ضوئية متطورة (Biometry)، وفحص قاع العين وسطح القرنية لضمان أفضل اختيار وتخطيط علاجي آمن.'
        }
      ]
    },
    iolSection: {
      label: 'دليل المرضى للعدسات',
      title: 'خيارات العدسات داخل العين (IOL)',
      desc: 'عند إجراء عملية المياه البيضاء، يتم استبدال عدسة العين المعتمة بعدسة صناعية دائمة. لا توجد عدسة واحدة مثالية للجميع، بل يحدد الطبيب الخيار الأنسب لحالتك وأسلوب حياتك بعد فحص شامل.',
    },
    simulator: {
      label: 'أداة تعليمية تفاعلية',
      title: 'محاكي الرؤية التوضيحي',
      desc: 'استكشف كيف قد تبدو الرؤية في ظروف مختلفة وقارن بين الحالات عبر شريط المقارنة التفاعلي. هذه محاكاة تعليمية توضيحية وليست تنبؤًا بنتيجة جراحية.',
      compareLabel: 'حرّك الشريط للمقارنة بين الرؤية الطبيعية وتأثير العدسة المختارة:',
      normalView: 'رؤية سليمة',
      simulatedView: 'المحاكاة التعليمية',
    },
    questionnaire: {
      label: 'استبيان تثقيفي',
      title: 'نقاط النقاش حول خيارات العدسات',
      desc: 'أجب عن 4 أسئلة موجزة لمساعدتك في فهم المحاور الهامة التي يجدر بك مناقشتها مع طبيب العيون في عيادتك القادمة.',
    },
    education: {
      label: 'المكتبة الطبية الموثوقة',
      title: 'التثقيف الطبي لصحة عينيك',
      desc: 'مقالات وإرشادات طبية مبسطة ومبنية على الدليل العلمي أعدت لمساعدتك وعائلتك على فهم الحالات والخيارات العلاجية.',
    },
    clinic: {
      label: 'العيادة والموقع',
      title: 'موقع العيادة وحجز المواعيد',
      name: DOCTOR.clinicAr,
      address: DOCTOR.addressAr,
      directions: 'الاتجاهات عبر خرائط جوجل',
      hours: 'أوقات العمل',
      hoursValue: 'السبت إلى الخميس: 9:00 صباحاً – 9:00 مساءً (يرجى التأكد من مواعيد العيادة قبل الحضور)',
      phone: 'مركز الاتصال الموحد',
      landline: 'الهاتف المباشر',
      book: 'احجز عبر البوابة الرسمية لمغربي',
      whatsapp: 'استفسر عن المواعيد عبر واتساب',
    },
    faq: {
      label: 'الأسئلة الشائعة',
      title: 'إجابات على أكثر الأسئلة تكراراً',
    },
    footer: {
      disclaimer: 'إخلاء مسؤولية طبية',
      disclaimerText: 'المحتوى المنشور في هذا الموقع ذو طبيعة تثقيفية وتوعوية عامة، ولا يُغني بأي حال عن الاستشارة الطبية والفحص السريري من قبل طبيب العيون المختص. لا يجوز استخدام هذه المعلومات لتشخيص أو علاج أي مرض. في حالات الطوارئ العينية، يرجى مراجعة أقرب مركز طوارئ فوراً.',
      rights: 'جميع الحقوق محفوظة ©',
      madeWith: 'الموقع التعريفي الشخصي للدكتور معن عبدالله البري',
    },
    cta: {
      title: 'هل تحتاج إلى استشارة متخصصة لصحة عينيك؟',
      desc: 'احجز موعدك الآن مع د. معن البري في مغربي المدينة المنورة لإجراء فحص شامل ومناقشة الخطة الأنسب لحالتك.',
    },
    langSwitch: 'English',
    bookNow: 'احجز موعدك',
    learnMore: 'اقرأ المزيد',
    whatsappMsg: 'مرحباً، أرغب بالاستفسار عن حجز موعد استشارة مع د. معن عبدالله البري في مغربي المدينة المنورة.',
    simDisclaimer: 'تنبيه: هذه محاكاة تعليمية توضيحية وليست محاكاة سريرية معتمدة أو تنبؤًا بنتيجة العملية. تختلف النتائج الفعلية حسب حالة العين، القياسات الطبية، ونوع العدسة المزروعة. لا تغني هذه الأداة عن الفحص السريري المتخصص.',
    qDisclaimer: 'تنبيه سريري: هذا الاستبيان أداة تعليمية وتثقيفية فقط، ولا يقدم تشخيصاً طبياً أو توصية ملزمة بعدسة معينة. يعتمد اختيار العدسة وإجراءات تصحيح النظر كلياً على الفحص الشامل والقياسات الطبية في العيادة.',
  },
  en: {
    lang: 'en',
    dir: 'ltr',
    nav: {
      home: 'Home',
      profile: 'Biography',
      specialties: 'Specialties',
      cataracts: 'Cataracts & IOLs',
      simulator: 'Vision Simulator',
      questionnaire: 'Lens Guide',
      education: 'Patient Education',
      clinic: 'Clinic & Booking',
      faq: 'FAQ'
    },
    hero: {
      badge: 'Consultant Ophthalmologist — Madinah, Saudi Arabia',
      h1: `Specialized Eye Care,<br><span class="gold-text">Cataract Surgery & Vision Correction</span>`,
      subtitle: 'Comprehensive evaluation for cataracts, keratoconus, and laser vision correction — with evidence-based guidance on the most suitable clinical options after precise ophthalmic examination.',
      cta1: 'Book at Magrabi',
      cta2: 'Inquire via WhatsApp',
      cred1: 'Chief Medical Officer – Magrabi Madinah',
      cred2: 'Chair of Ophthalmology – Taibah University',
      cred3: 'Fellow of Royal College of Surgeons (FRCS)',
      stat1: '200+ Verified Reviews',
      stat2: 'JCI & CBAHI Accredited',
      stat3: '70+ Years of Magrabi Care',
    },
    profile: {
      label: 'Professional Profile',
      title: 'Dr. Maan Abdullah Omar Al Barry',
      subtitle: 'Consultant Ophthalmologist — Cataract, Cornea & Refractive Surgery',
      bio1: 'Dr. Maan Abdullah Al Barry is a consultant ophthalmic surgeon practicing at Magrabi Health Eye & ENT in Madinah, Saudi Arabia. He serves within the Cataract Unit and Cornea & Refractive Surgery Unit, providing meticulous evaluation for patients requiring cataract removal, intraocular lens selection, corneal pathology care, and refractive surgery.',
      bio2: 'His clinical practice is reinforced by significant leadership and academic appointments: he is Executive Medical Director / Chief Medical Officer of Magrabi Madinah, Chairman of the Department of Ophthalmology at Taibah University, Madinah Representative of the Saudi Ophthalmological Society, and Scientific Council Member of the Red Sea Ophthalmology Conference.',
      qualificationsTitle: 'Verified Qualifications & Credentials',
      timelineTitle: 'Academic & Executive Appointments',
      galleryTitle: 'Scientific Leadership & Conferences',
      reviewsTitle: 'Verified Patient Experiences',
      reviewsSubtitle: 'Reviews from patients treated at Magrabi Health Madinah'
    },
    specialties: {
      label: 'Clinical Specialties',
      title: 'Areas of Medical & Surgical Care',
      desc: 'Evidence-based diagnostic and surgical services tailored to each patient after detailed measurements.',
      items: [
        {
          icon: '👁',
          title: 'Cataract Surgery & IOL Implantation',
          desc: 'Micro-incision phacoemulsification for cataract removal with implantation of premium intraocular lenses (Monofocal, EDOF, or Trifocal/Multifocal).'
        },
        {
          icon: '🔬',
          title: 'Laser Vision Correction (LASIK / PRK)',
          desc: 'Comprehensive suitability assessment for LASIK, Femto-LASIK, and surface ablation (PRK) based on corneal topography, pachymetry, and refractive stability.'
        },
        {
          icon: '🫧',
          title: 'Cornea Care & Keratoconus (CXL)',
          desc: 'Early diagnosis of keratoconus, corneal collagen cross-linking (CXL) to arrest disease progression, and personalized long-term management.'
        },
        {
          icon: '📐',
          title: 'Pre-operative Biometry & Diagnostics',
          desc: 'High-precision optical biometry and anterior segment imaging ensuring optimal calculation and personalized surgical planning.'
        }
      ]
    },
    iolSection: {
      label: 'Patient Education',
      title: 'Understanding Intraocular Lens (IOL) Options',
      desc: 'During cataract surgery, the clouded natural lens is replaced with a permanent artificial intraocular lens. No single lens is universally ideal; your surgeon determines the optimal choice based on your eye measurements, visual priorities, and lifestyle.',
    },
    simulator: {
      label: 'Interactive Educational Tool',
      title: 'Vision Simulator & Interactive Comparison',
      desc: 'Explore how vision may appear across different everyday scenarios and compare views using the interactive split slider. This is an illustrative simulation, not a clinical prediction.',
      compareLabel: 'Drag slider to compare normal vision with simulated lens state:',
      normalView: 'Normal Vision',
      simulatedView: 'Simulated State',
    },
    questionnaire: {
      label: 'Educational Questionnaire',
      title: 'Discussion Points for Your Consultation',
      desc: 'Answer 4 brief questions to identify key topics and expectations to discuss with your ophthalmologist during your clinical evaluation.',
    },
    education: {
      label: 'Evidence-Based Library',
      title: 'Patient Medical Education',
      desc: 'Clear, doctor-reviewed educational guides to help you understand your eye health, surgical options, and recovery journey.',
    },
    clinic: {
      label: 'Clinic & Location',
      title: 'Location & Appointment Booking',
      name: DOCTOR.clinicEn,
      address: DOCTOR.addressEn,
      directions: 'Get Directions on Google Maps',
      hours: 'Clinic Hours',
      hoursValue: 'Saturday to Thursday: 9:00 AM – 9:00 PM (Please confirm specific clinic schedule before visit)',
      phone: 'Call Center',
      landline: 'Direct Line',
      book: 'Book via Magrabi Official Portal',
      whatsapp: 'Inquire via WhatsApp',
    },
    faq: {
      label: 'FAQ',
      title: 'Frequently Asked Questions',
    },
    footer: {
      disclaimer: 'Medical Disclaimer',
      disclaimerText: 'The content provided on this website is for informational and educational purposes only. It is not intended as a substitute for professional ophthalmic examination, diagnosis, or treatment. Never disregard professional medical advice or delay seeking care because of something you have read here. For eye emergencies, contact an emergency room immediately.',
      rights: 'All Rights Reserved ©',
      madeWith: 'Official Physician Website of Dr. Maan Al Barry',
    },
    cta: {
      title: 'Ready for a Specialized Eye Evaluation?',
      desc: 'Book your appointment with Dr. Maan Al Barry at Magrabi Madinah for a comprehensive eye exam and personalized discussion of your treatment options.',
    },
    langSwitch: 'عربي',
    bookNow: 'Book Appointment',
    learnMore: 'Learn More',
    whatsappMsg: 'Hello, I would like to inquire about booking a consultation with Dr. Maan Al Barry at Magrabi Madinah.',
    simDisclaimer: 'Clinical Note: This is an illustrative educational simulation, not a clinically validated prediction of surgical outcomes. Actual results vary based on corneal anatomy, eye health, lens calculations, and individual healing. It does not replace an in-person eye exam.',
    qDisclaimer: 'Clinical Safety: This questionnaire is strictly educational and non-diagnostic. Lens selection and refractive surgery candidacy require comprehensive clinical examination and optical biometry performed by an ophthalmologist.',
  }
};

// --- IOL COMPARISON DATA ---
const IOL_DATA = {
  ar: [
    {
      type: 'أحادية البؤرة (Monofocal)',
      distance: 'ممتازة وحادة للرؤية البعيدة',
      intermediate: 'قد تحتاج نظارة خفيفة لشاشات الكمبيوتر',
      near: 'تتطلب استخدام نظارة للقراءة القريبة',
      glare: 'أقل احتمالية للهالات والوهج ليلاً',
      bestFor: 'المرضى الذين يفضلون أعلى جودة تباين للقيادة ليلاً ولا يمانعون ارتداء نظارة قراءة.'
    },
    {
      type: 'ممتدة العمق (EDOF)',
      distance: 'ممتازة للرؤية البعيدة',
      intermediate: 'واضحة جداً للمسافات المتوسطة (لوحة القيادة والكمبيوتر)',
      near: 'جيدة للقراءة المتوسطة، قد تلزم نظارة للنصوص الدقيقة',
      glare: 'احتمالية منخفضة إلى معتدلة للهالات',
      bestFor: 'المرضى الراغبين في نطاق رؤية مستمر من البعيد إلى شاشات الكمبيوتر مع تقليل الاعتماد على النظارة.'
    },
    {
      type: 'متعددة/ثلاثية البؤرة (Trifocal)',
      distance: 'جيدة جداً للمسافات البعيدة',
      intermediate: 'جيدة للمسافة المتوسطة (أجهزة التابلت والكمبيوتر)',
      near: 'جيدة للقراءة القريبة والهاتف دون نظارة في معظم الأوقات',
      glare: 'احتمالية أعلى للهالات حول الأضواء ليلاً (تتكيف معها العين عادةً)',
      bestFor: 'المرضى الباحثين عن أقصى درجات الاستغناء عن النظارة في معظم المهام اليومية، مع سلامة القرنية والشبكية.'
    },
    {
      type: 'عدسات توريك (Toric) لتصحيح الاستجماتيزم',
      distance: 'تصحح اللابؤرية الناتجة عن شكل القرنية البيضاوي',
      intermediate: 'تتوفر بتصاميم أحادية أو ممتدة أو ثلاثية',
      near: 'حسب التصميم البؤري المختار',
      glare: 'يعتمد على التصميم البؤري المصاحب',
      bestFor: 'المرضى الذين يعانون من درجات ملحوظة من الاستجماتيزم (اللابؤرية) قبل العملية.'
    }
  ],
  en: [
    {
      type: 'Monofocal IOL',
      distance: 'Sharp, high-contrast distance vision',
      intermediate: 'May need light glasses for computer screens',
      near: 'Requires reading glasses for close tasks',
      glare: 'Lowest incidence of halos and glare at night',
      bestFor: 'Patients prioritizing maximum contrast for night driving who are comfortable using reading glasses.'
    },
    {
      type: 'Extended Depth of Focus (EDOF)',
      distance: 'Excellent distance vision',
      intermediate: 'Very clear intermediate vision (dashboard & screens)',
      near: 'Functional for casual reading; small print may need glasses',
      glare: 'Low to moderate halo profile',
      bestFor: 'Patients seeking continuous vision across distance and intermediate with reduced reliance on glasses.'
    },
    {
      type: 'Trifocal / Multifocal IOL',
      distance: 'Good distance vision',
      intermediate: 'Clear intermediate vision for tablets & laptops',
      near: 'Good near vision for books & smartphones without glasses',
      glare: 'Higher chance of starbursts/halos at night (typically diminishes with neuroadaptation)',
      bestFor: 'Patients desiring maximum spectacle independence for daily tasks, provided ocular surface and retina are healthy.'
    },
    {
      type: 'Toric IOL (Astigmatism Correction)',
      distance: 'Neutralizes pre-existing corneal astigmatism',
      intermediate: 'Available in monofocal, EDOF, or trifocal optics',
      near: 'Depends on optical platform selected',
      glare: 'Depends on accompanying optic design',
      bestFor: 'Patients with significant pre-existing corneal astigmatism seeking sharper uncorrected vision.'
    }
  ]
};

// --- MEDICAL EDUCATION LIBRARY ARTICLES ---
const ARTICLES = {
  ar: [
    {
      id: 'cataract-guide',
      title: 'ما هي المياه البيضاء (الساد) ومتى تصبح الجراحة ضرورية؟',
      summary: 'إعتام طبيعي يصيب عدسة العين مع التقدم في العمر، ولا تعالج بالأدوية بل بالجراحة الدقيقة عند تأثيرها على الحياة اليومية.',
      content: `
        <h4>ما هو إعتام عدسة العين؟</h4>
        <p>المياه البيضاء ليست غشاءً ينمو فوق سطح العين، بل هي عتامة تدريجية في العدسة الطبيعية الشفافة الموجودة داخل العين خلف بؤبؤ العين. تؤدي هذه العتامة إلى تشتت الضوء الداخل إلى الشبكية، مما يسبب ضبابية الرؤية، بهتان الألوان، وصعوبة القيادة ليلاً بسبب الوهج.</p>
        <h4>متى ينبغي إجراء العملية؟</h4>
        <p>لا تتطلب المياه البيضاء الجراحة فور اكتشافها إلا إذا كانت تسبب مضاعفات نادرة كارتفاع ضغط العين. المعيار الأساسي هو مدى تأثير ضعف النظر على أنشطتك اليومية مثل القراءة، قيادة السيارة، أو التعرف على وجوه الأشخاص.</p>
        <h4>كيف تُجرى الجراحة الحديثة؟</h4>
        <p>تُجرى عملية الفاكو (Phacoemulsification) عبر فتحة ميكروسكوبية لا تتجاوز 2.2 ملم، حيث يتم تفتيت العدسة المعتمة بالموجات فوق الصوتية وشفطها، ثم زراعة عدسة صناعية قابلة للطي مكانها تحت تخدير موضعي بقطرات ودون الحاجة لغرز جراحية في الغالبية العظمى من الحالات.</p>
      `
    },
    {
      id: 'keratoconus-guide',
      title: 'القرنية المخروطية: الأعراض، التشخيص، وخيارات التثبيت (CXL)',
      summary: 'حالة يرق فيها نسيج القرنية وتتحول إلى شكل مخروطي، ويعد التثبيت الضوئي للقرنية حجر الأساس لوقف تدهورها.',
      content: `
        <h4>ما هي القرنية المخروطية؟</h4>
        <p>القرنية هي النافذة الشفافة الأمامية للعين. في القرنية المخروطية، يضعف النسيج الضام وتبرز القرنية تدريجياً لتأخذ شكلاً مخروطياً، مما يؤدي إلى استجماتيزم غير منتظم وتدهور سريع في قياسات النظارة خاصة لدى فئة الشباب والمراهقين.</p>
        <h4>أهمية التشخيص المبكر وتصوير تضاريس القرنية (Pentacam)</h4>
        <p>يساعد التصوير الطبقي للقرنية في اكتشاف المرض قبل ظهور أي علامات واضحة بالفحص العادي. يُنصح كل من يلاحظ تغيراً متكرراً في مقاس النظارة أو فركاً مزمناً في العين بإجراء هذا الفحص.</p>
        <h4>عملية تثبيت القرنية بالكولاجين (CXL)</h4>
        <p>إجراء علاجي يهدف إلى تقوية الروابط بين ألياف القرنية باستخدام قطرات فيتامين ب2 (الريبوفلافين) مع الأشعة فوق البنفسجية UVA. الهدف الأساسي هو إيقاف تقدم المرض وحماية النظر من التدهور المستقبلي.</p>
      `
    },
    {
      id: 'lasik-candidacy',
      title: 'من هو المرشح المناسب لعمليات تصحيح الإبصار بالليزر (الليزك والفيمتو ليزك)؟',
      summary: 'شروط الأمان والمعايير الطبية الدقيقة التي تحدد الإجراء الأمثل لتصحيح قصر أو طول النظر والاستجماتيزم.',
      content: `
        <h4>المعايير الأساسية للأمان:</h4>
        <ul>
          <li><strong>العمر:</strong> ألا يقل عن 18 عاماً لضمان استقرار نمو العين.</li>
          <li><strong>استقرار النظر:</strong> ثبات قياسات النظارة لمدة عام على الأقل.</li>
          <li><strong>سماكة القرنية وشكلها:</strong> خلو القرنية تماماً من أي علامات للقرنية المخروطية أو الترقق غير الطبيعي.</li>
          <li><strong>صحة سطح العين:</strong> علاج أي جفاف حاد قبل اتخاذ قرار الليزك.</li>
        </ul>
        <h4>ما الفرق بين الفيمتو ليزك والليزر السطحي (PRK)؟</h4>
        <p>في الفيمتو ليزك يتم رفع قشرة رقيقة من القرنية بواسطة ليزر الفيمتوثانية ثم تصحيح النظر، مما يوفر تعافياً سريعاً جداً. أما الليزر السطحي فيتم دون رفع أي قشرة، ويعد الخيار الأنسب لأصحاب القرنيات الرقيقة أو من يمارسون رياضات عنيفة.</p>
      `
    },
    {
      id: 'surgery-journey',
      title: 'رحلة المريض: ماذا تتوقع قبل وأثناء وبعد جراحة المياه البيضاء؟',
      summary: 'دليل تفصيلي لمراحل التحضير، تجربة يوم العملية، وإرشادات التعافي القطرات بعد الجراحة.',
      content: `
        <h4>قبل العملية (التحضير والقياسات):</h4>
        <p>يخضع المريض لقياسات بصرية فائقة الدقة (Optical Biometry) لحساب قوة العدسة المناسبة، مع مناقشة نوع العدسة الأنسب لاحتياجاته.</p>
        <h4>يوم العملية:</h4>
        <p>إجراء يومي لا يستدعي المبيت. تستغرق الجراحة نحو 15 إلى 20 دقيقة تحت تخدير موضعي بالقطرات، مع شعور المريض بضغط خفيف أو أضواء دون ألم حقيقي.</p>
        <h4>بعد العملية:</h4>
        <p>يغادر المريض بعد وقت وجيز مرتدياً غطاءً واقياً. من الضروري الالتزام بجدول القطرات المضادة للالتهاب والمضادات الحيوية، وتجنب فرك العين أو وصول الماء المباشر إليها خلال الأيام الأولى.</p>
      `
    }
  ],
  en: [
    {
      id: 'cataract-guide',
      title: 'What is a Cataract and When is Surgery Indicated?',
      summary: 'A natural age-related clouding of the ocular lens, treatable safely and effectively via modern micro-incision surgery.',
      content: `
        <h4>Understanding Cataracts</h4>
        <p>A cataract is not a film over the eye, but rather a gradual clouding of the natural crystalline lens inside the eye. This clouding scatters light entering the retina, producing blurred vision, washed-out colors, and glare around light sources at night.</p>
        <h4>When Should Surgery Be Performed?</h4>
        <p>Cataract surgery is rarely urgent. The guiding criterion is whether reduced visual acuity interferes with your regular daily activities, such as driving, reading, working on screens, or personal safety.</p>
        <h4>Modern Phacoemulsification</h4>
        <p>Surgery is performed through a micro-incision (~2.2 mm). Ultrasound gently breaks up the clouded lens, which is aspirated, and an artificial intraocular lens (IOL) is implanted under topical drop anesthesia with no stitches required in most cases.</p>
      `
    },
    {
      id: 'keratoconus-guide',
      title: 'Keratoconus: Diagnosis, Progression, and Corneal Cross-Linking (CXL)',
      summary: 'A condition causing corneal thinning and steepening, managed effectively with collagen cross-linking.',
      content: `
        <h4>What is Keratoconus?</h4>
        <p>Keratoconus is a progressive condition where the cornea thins and bulges into an irregular conical shape. This produces progressive irregular astigmatism, frequently requiring frequent eyeglass prescription changes in adolescents and young adults.</p>
        <h4>Early Diagnosis with Corneal Tomography</h4>
        <p>High-resolution Scheimpflug tomography (Pentacam) detects subclinical keratoconus before overt signs appear on basic slit-lamp examination. Anyone with rapidly changing astigmatism or habitual eye rubbing should be screened.</p>
        <h4>Corneal Collagen Cross-Linking (CXL)</h4>
        <p>CXL strengthens corneal stromal collagen bonds using riboflavin (vitamin B2) drops activated by precise UVA light, arresting disease progression and preserving visual acuity.</p>
      `
    },
    {
      id: 'lasik-candidacy',
      title: 'Who is an Ideal Candidate for Laser Vision Correction (LASIK / PRK)?',
      summary: 'Safety criteria, stability requirements, and anatomical guidelines governing refractive procedures.',
      content: `
        <h4>Essential Safety Criteria:</h4>
        <ul>
          <li><strong>Age:</strong> At least 18 years to ensure ocular maturity.</li>
          <li><strong>Refractive Stability:</strong> Stable eyeglass prescription for at least 12 months.</li>
          <li><strong>Corneal Thickness & Shape:</strong> Adequate corneal pachymetry with no topographic evidence of ectasia or forme fruste keratoconus.</li>
          <li><strong>Ocular Surface:</strong> Absence of severe untreated dry eye disease.</li>
        </ul>
        <h4>Femto-LASIK vs. Surface Ablation (PRK)</h4>
        <p>Femto-LASIK utilizes a femtosecond laser to create a precise flap for swift visual recovery. PRK reshapes the corneal surface without flap creation, making it preferable for patients with thinner corneas or active contact sports involvement.</p>
      `
    },
    {
      id: 'surgery-journey',
      title: 'The Patient Journey: What to Expect Before, During, and After Cataract Surgery',
      summary: 'A step-by-step roadmap from pre-op optical biometry to post-op drops and visual recovery.',
      content: `
        <h4>Pre-Operative Preparation:</h4>
        <p>Precise optical biometry is performed to calculate target IOL power, paired with a detailed lifestyle discussion regarding distance, intermediate, and near visual needs.</p>
        <h4>Day of Surgery:</h4>
        <p>Performed as an outpatient day procedure under topical anesthetic eye drops. The surgical procedure typically lasts 15–20 minutes with zero pain and immediate discharge.</p>
        <h4>Post-Operative Care:</h4>
        <p>Patients follow a structured regimen of anti-inflammatory and antibiotic eye drops, avoiding eye rubbing or direct tap water exposure during the initial healing window.</p>
      `
    }
  ]
};

// --- VERIFIED PATIENT REVIEWS ---
const REVIEWS = {
  ar: [
    {
      author: 'راكان العبري',
      date: 'مريض تم علاجه بمغربي المدينة المنورة',
      text: 'كانت تجربة ممتازة بكل المقاييس. استغرق موعدي قرابة ساعة، أجريت خلالها الفحوصات الدقيقة ثم قابلت الدكتور معن البري، الذي شرح لي تفاصيل الإجراء وأي مضاعفات محتملة بكل أمانة ووضوح ومهنية عالية.',
      stars: 5,
    },
    {
      author: 'مايا أحمد',
      date: 'مراجعة عيادة العيون والقرنية',
      text: 'أود أن أشكر فريق د. معن البري على حسن الاستقبال والتعامل الراقي والمعاملة المريحة، والاهتمام الفائق بتنظيم المواعيد والإجابة عن كافة التساؤلات بابتسامة وترحاب.',
      stars: 5,
    },
    {
      author: 'بشرى الشراحيلي',
      date: 'مريضة جراحة عيون',
      text: 'أعرب عن خالص امتناني للدكتور معن البري على مهنيته الاستثنائية، وخبرته الواسعة، وتوجيهه اللطيف والمهدئ طوال مراحل العملية، والاهتمام الدقيق بالمتابعة بعد الإجراء.',
      stars: 5,
    }
  ],
  en: [
    {
      author: 'Rakan Al-Abri',
      date: 'Patient at Magrabi Madinah',
      text: 'An outstanding experience by all measures. I completed thorough diagnostics before meeting Dr. Maan Al Barry, who explained the procedure and potential nuances with utmost clarity, honesty, and professional integrity.',
      stars: 5,
    },
    {
      author: 'Maya Ahmed',
      date: 'Cornea & Vision Correction Patient',
      text: 'I would like to extend heartfelt thanks to Dr. Maan Al Barry and his dedicated clinical team for their wonderful hospitality, comfortable care, and seamless appointment coordination.',
      stars: 5,
    },
    {
      author: 'Bushra Al-Sharahili',
      date: 'Ophthalmic Surgery Patient',
      text: 'My deepest gratitude to Dr. Maan for his exceptional surgical precision, vast expertise, and gentle guidance throughout the entire procedure and post-op follow-up.',
      stars: 5,
    }
  ]
};

// --- FAQ DATA ---
const FAQ_DATA = {
  ar: [
    {
      q: 'ما هو التخصص الدقيق للدكتور معن عبدالله البري؟',
      a: 'استشاري طب وجراحة العيون، متخصص في جراحة المياه البيضاء (الساد) وزراعة العدسات بمختلف أنواعها، عمليات تصحيح الإبصار بالليزر (الليزك والفيمتو ليزك والسطحي)، وأمراض القرنية والقرنية المخروطية وتثبيت القرنية.'
    },
    {
      q: 'أين تقع عيادة الدكتور معن البري وكيف يمكن الوصول إليها؟',
      a: 'يستقبل د. معن البري مراجعيه في مستشفى مغربي الصحية للعيون والأذن بالمدينة المنورة، الواقع على طريق المطار. الفرع معتمد من اللجنة الدولية المشتركة JCI والمؤسسة الأمريكية SRC كمركز تميز لطب العيون.'
    },
    {
      q: 'كيف يمكنني حجز موعد مؤكد مع الطبيب؟',
      a: 'يمكنك الحجز مباشرة عبر بوابة الحجز الإلكتروني الرسمية لمغربي (ob.magrabi.com.sa)، أو عبر الاتصال بالرقم الموحد 19505، أو الاستفسار السريع وتنسيق الموعد عبر رابط واتساب المتوفر في الموقع.'
    },
    {
      q: 'هل يضمن محاكي الرؤية النتيجة الفعلية للعملية الجراحية؟',
      a: 'كلا، محاكي الرؤية هو أداة تعليمية وتوضيحية عامة لشرح الفروقات المفاهيمية بين العدسات. النتيجة الفعلية تعتمد على فحص تضاريس القرنية، صحة الشبكية، وقياسات العين الدقيقة التي يجريها الاستشاري.'
    },
    {
      q: 'هل يمكن الاستغناء التام عن النظارات بعد عملية المياه البيضاء؟',
      a: 'توفر العدسات الحديثة مثل العدسات ثلاثية البؤرة (Trifocal) والعدسات ممتدة العمق (EDOF) استقلالية عالية عن النظارات لمعظم الأنشطة كالقراءة وقيادة السيارة، ولكن لا يمكن تقديم ضمان طبي بنسبة 100% لعدم الحاجة لنظارة في بعض الظروف الخاصة.'
    },
    {
      q: 'ما هي معايير ترشيح المريض لعمليات تصحيح النظر بالليزك؟',
      a: 'يشترط ألا يقل العمر عن 18 عاماً، وثبات النظر لمدة عام، وسماكة قرنية كافية، وخلو العين التام من القرنية المخروطية أو الجفاف الشديد غير المعالج، ويتم حسم القرار بعد تصوير القرنية الطبقي.'
    }
  ],
  en: [
    {
      q: 'What are Dr. Maan Al Barry\'s medical subspecialties?',
      a: 'He is a Consultant Ophthalmologist specializing in cataract surgery and advanced IOL implantation, laser refractive surgery (LASIK, Femto-LASIK, PRK), and corneal diseases including keratoconus and corneal cross-linking (CXL).'
    },
    {
      q: 'Where does Dr. Maan see patients in Madinah?',
      a: 'At Magrabi Health Eye & ENT – Madinah, located on Airport Road. The hospital holds JCI accreditation and SRC Center of Excellence designation in Ophthalmology.'
    },
    {
      q: 'How can I book an appointment?',
      a: 'You can book through the official Magrabi Online Booking portal (ob.magrabi.com.sa), via call center at 19505, or through the direct WhatsApp consultation inquiry button on this website.'
    },
    {
      q: 'Does the Vision Simulator predict actual surgical vision?',
      a: 'No. The simulator is strictly an educational tool demonstrating optic principles. Real-world postoperative visual acuity is determined by clinical biometry, corneal morphology, and individualized healing.'
    },
    {
      q: 'Can cataract surgery guarantee complete spectacle independence?',
      a: 'While modern premium IOLs (Trifocals & EDOFs) significantly decrease dependence on glasses for distance, intermediate, and near tasks, complete 100% independence cannot be guaranteed for every clinical case.'
    },
    {
      q: 'What are the main criteria for laser vision correction (LASIK)?',
      a: 'Candidates must be at least 18 years old, possess stable refraction for 12 months, have adequate corneal thickness, and demonstrate normal corneal topography with no evidence of keratoconus.'
    }
  ]
};

// --- QUESTIONNAIRE DATA ---
const QUESTIONNAIRE = {
  ar: {
    steps: [
      {
        question: 'ما هي الفئة العمرية التقريبية للمريض؟',
        options: ['أقل من 45 سنة', '45 إلى 55 سنة', '56 إلى 68 سنة', 'أكثر من 68 سنة', 'لست متأكداً']
      },
      {
        question: 'هل تم تشخيصك سابقاً بأي من الحالات العينية التالية؟',
        options: [
          'لا توجد حالات مشخصة معروفة',
          'جلوكوما (ارتفاع ضغط العين)',
          'اعتلال الشبكية السكري أو أمراض قاع العين',
          'قرنية مخروطية أو جفاف شديد مزمن',
          'لست متأكداً تماماً'
        ]
      },
      {
        question: 'ما هي أولويتك البصرية الأساسية التي ترغب بمناقشتها مع الطبيب؟',
        options: [
          'القيادة الليلية وأعلى جودة تباين للمسافات البعيدة',
          'القراءة المريحة واستخدام الهاتف الذكي دون نظارة',
          'رؤية متوازنة عبر مختلف المسافات (الكمبيوتر والأنشطة اليومية)',
          'لست متأكداً بعد'
        ]
      },
      {
        question: 'هل خضعت في السابق لأي جراحة تصحيح نظر بالليزر (ليزك، ليزر سطحي)؟',
        options: ['نعم، أجريت عملية تصحيح نظر سابقة', 'لا، لم أجرِ أي عملية سابقة', 'لست متأكداً']
      }
    ],
    results: {
      nightDriving: {
        title: 'أولوية القيادة الليلية وجودة التباين',
        text: 'تعد جودة الرؤية الليلية وانخفاض احتمالية الهالات حول مصابيح السيارات من أهم النقاط التي تناقشها مع الطبيب. العدسات أحادية البؤرة أو بعض عدسات EDOF توفر نقاءً عالياً للتباين ليلاً، مع الحاجة لنظارة للقراءة القريبة.'
      },
      nearVision: {
        title: 'أولوية القراءة واستخدام الهاتف الذكي',
        text: 'إذا كان تقليل الاعتماد على نظارة القراءة في مقدمة أهدافك، فناقش مع الطبيب ملاءمة عينك لعدسات الترايفوكل (Trifocal) التي تتيح تركيزاً قريباً، مع التأكد من سلامة سطح القرنية والشبكية.'
      },
      balanced: {
        title: 'رؤية ممتدة ومتوازنة لنمط الحياة العصري',
        text: 'قد تكون العدسات ممتدة عمق التركيز (EDOF) خياراً متوازناً لتغطية المسافة البعيدة والمتوسطة (شاشات الكمبيوتر ولوحة السيارة) مع احتمالية أقل لظواهر الوهج الليلي مقارنة بالعدسات المتعددة التقليدية.'
      },
      previousLasik: {
        title: 'أهمية الإفصاح عن جراحات الليزك السابقة',
        text: 'تؤثر عمليات الليزك السابقة على انحناء القرنية السطحي، وتتطلب معادلات حسابية خاصة (Post-refractive IOL formulas) لحساب قوة العدسة بدقة لتفادي أي انحراف بعد العملية.'
      },
      eyeCondition: {
        title: 'التأثير المتبادل للحالات العينية المصاحبة',
        text: 'في حال وجود جلوكوما أو اعتلال بالشبكية، يُفضل استشاري العيون عادةً العدسات أحادية البؤرة فائقة التباين لحماية حساسية الضوء وعدم إجهاد العصب البصري.'
      },
      generalAdvice: {
        title: 'الخطوة التالية الموصى بها',
        text: 'هذه الإرشادات تثقيفية تهدف لترتيب أولوياتك. القرار العلاجي الحاسم يُتخذ داخل العيادة بعد الفحص المجهري وتصوير تضاريس القرنية وقياسات بيومترية متطورة مع د. معن البري.'
      }
    }
  },
  en: {
    steps: [
      {
        question: 'What is your approximate age group?',
        options: ['Under 45 years', '45 to 55 years', '56 to 68 years', 'Over 68 years', 'Not certain']
      },
      {
        question: 'Do you have any previously diagnosed eye conditions?',
        options: [
          'No known diagnosed eye conditions',
          'Glaucoma (elevated eye pressure)',
          'Diabetic retinopathy or macular condition',
          'Keratoconus or severe chronic dry eye',
          'Not completely certain'
        ]
      },
      {
        question: 'What is your primary visual priority to discuss with the surgeon?',
        options: [
          'Night driving clarity & high contrast for distance',
          'Smartphone use & reading without reading glasses',
          'Balanced continuous vision (computer screens & daily tasks)',
          'Not certain yet'
        ]
      },
      {
        question: 'Have you had prior laser vision correction (LASIK, PRK)?',
        options: ['Yes, prior refractive surgery', 'No prior eye surgery', 'Not certain']
      }
    ],
    results: {
      nightDriving: {
        title: 'Priority: Night Driving & Contrast Sensitivity',
        text: 'Preserving high contrast sensitivity and minimizing dysphotopsias (halos/starbursts) is paramount. Monofocal or specific EDOF optics generally offer superior nighttime optical purity with reading glasses retained for fine print.'
      },
      nearVision: {
        title: 'Priority: Near Vision & Spectacle Independence',
        text: 'If near tasks without glasses are your goal, discuss trifocal IOL designs with your surgeon, provided your macula and corneal optical surface demonstrate excellent baseline health.'
      },
      balanced: {
        title: 'Priority: Extended Intermediate & Modern Lifestyle',
        text: 'Extended Depth of Focus (EDOF) lenses provide a balanced optical continuum across distance and intermediate (dashboard, laptops) with an easier neuroadaptation profile than classic multifocals.'
      },
      previousLasik: {
        title: 'Clinical Value of Prior LASIK Disclosure',
        text: 'Previous corneal refractive surgery alters standard keratometry. Specialized post-refractive biometric formulas must be utilized to calculate target intraocular lens power accurately.'
      },
      eyeCondition: {
        title: 'Ocular Co-morbidities & Lens Selection',
        text: 'In the presence of optic nerve compromise (glaucoma) or macular pathology, monofocal platforms are often clinically preferred to safeguard contrast sensitivity.'
      },
      generalAdvice: {
        title: 'Next Clinical Step',
        text: 'These guidelines serve as educational discussion points. Final surgical candidacy and lens selection are determined during comprehensive clinical evaluation and advanced biometry with Dr. Maan Al Barry.'
      }
    }
  }
};

// --- APP STATE ---
let currentLang = 'ar';
let simScene = 'driving';
let simLens = 'cataract';
let simSliderPos = 50; // percentage
let qStep = 0;
let qAnswers = [];
let qDone = false;
let activeArticle = null;

function t() { return i18n[currentLang]; }

function whatsappUrl(prefill) {
  const msg = encodeURIComponent(prefill || t().whatsappMsg);
  return `https://wa.me/${DOCTOR.whatsapp}?text=${msg}`;
}

// --- RENDER APPLICATION ---
function render() {
  const T = t();
  document.documentElement.lang = T.lang;
  document.documentElement.dir = T.dir;
  document.body.className = currentLang === 'en' ? 'lang-en' : '';

  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    ${renderHeader(T)}
    <main>
      ${renderHero(T)}
      ${renderProfile(T)}
      ${renderSpecialties(T)}
      ${renderIOLSection(T)}
      ${renderSimulator(T)}
      ${renderQuestionnaire(T)}
      ${renderEducation(T)}
      ${renderClinic(T)}
      ${renderFAQ(T)}
      ${renderCTA(T)}
    </main>
    ${renderFooter(T)}
    ${renderBookingBar(T)}
  `;

  initScrollAnimations();
  initHeaderScroll();
}

// --- COMPONENTS ---

function renderHeader(T) {
  return `
  <header class="site-header" id="site-header">
    <div class="container header-inner">
      <a href="#" class="header-logo" onclick="scrollToSection('home');return false;">
        <div class="logo-icon">م</div>
        <div class="logo-text">
          ${currentLang === 'ar' ? DOCTOR.shortNameAr : DOCTOR.shortNameEn}
          <small>${currentLang === 'ar' ? 'استشاري طب وجراحة العيون' : 'Consultant Ophthalmologist'}</small>
        </div>
      </a>
      <nav class="header-nav">
        <div class="nav-links" id="nav-links">
          <a href="#home" onclick="scrollToSection('home');return false;">${T.nav.home}</a>
          <a href="#profile" onclick="scrollToSection('profile');return false;">${T.nav.profile}</a>
          <a href="#specialties" onclick="scrollToSection('specialties');return false;">${T.nav.specialties}</a>
          <a href="#cataracts" onclick="scrollToSection('cataracts');return false;">${T.nav.cataracts}</a>
          <a href="#simulator" onclick="scrollToSection('simulator');return false;">${T.nav.simulator}</a>
          <a href="#education" onclick="scrollToSection('education');return false;">${T.nav.education}</a>
          <a href="#clinic" onclick="scrollToSection('clinic');return false;">${T.nav.clinic}</a>
          <a href="#faq" onclick="scrollToSection('faq');return false;">${T.nav.faq}</a>
        </div>
        <div class="header-actions">
          <button class="lang-switch" onclick="toggleLang()" aria-label="Toggle Language">${T.langSwitch}</button>
          <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">${T.bookNow}</a>
        </div>
        <button class="mobile-menu-btn" onclick="toggleMobileMenu()" aria-label="Open Navigation Menu">
          <span></span>
        </button>
      </nav>
    </div>
    <nav class="mobile-nav" id="mobile-nav">
      <a href="#home" onclick="scrollToSection('home');closeMobileMenu();return false;">${T.nav.home}</a>
      <a href="#profile" onclick="scrollToSection('profile');closeMobileMenu();return false;">${T.nav.profile}</a>
      <a href="#specialties" onclick="scrollToSection('specialties');closeMobileMenu();return false;">${T.nav.specialties}</a>
      <a href="#cataracts" onclick="scrollToSection('cataracts');closeMobileMenu();return false;">${T.nav.cataracts}</a>
      <a href="#simulator" onclick="scrollToSection('simulator');closeMobileMenu();return false;">${T.nav.simulator}</a>
      <a href="#questionnaire" onclick="scrollToSection('questionnaire');closeMobileMenu();return false;">${T.nav.questionnaire}</a>
      <a href="#education" onclick="scrollToSection('education');closeMobileMenu();return false;">${T.nav.education}</a>
      <a href="#clinic" onclick="scrollToSection('clinic');closeMobileMenu();return false;">${T.nav.clinic}</a>
      <a href="#faq" onclick="scrollToSection('faq');closeMobileMenu();return false;">${T.nav.faq}</a>
    </nav>
  </header>`;
}

function renderHero(T) {
  return `
  <section class="hero" id="home">
    <div class="container">
      <div class="hero-grid">
        <div class="hero-content fade-in">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            ${T.hero.badge}
          </div>
          <h1>${T.hero.h1}</h1>
          <p class="hero-subtitle">${T.hero.subtitle}</p>
          <div class="hero-cta">
            <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-lg">${T.hero.cta1}</a>
            <a href="${whatsappUrl()}" target="_blank" rel="noopener" class="btn btn-whatsapp">${T.hero.cta2}</a>
          </div>
          <div class="hero-credentials">
            <div class="credential-item">
              <div class="icon">🏥</div>
              <span>${T.hero.cred1}</span>
            </div>
            <div class="credential-item">
              <div class="icon">🎓</div>
              <span>${T.hero.cred2}</span>
            </div>
            <div class="credential-item">
              <div class="icon">🇬🇧</div>
              <span>${T.hero.cred3}</span>
            </div>
          </div>
        </div>
        <div class="hero-image fade-in">
          <img src="/images/dr-maan-portrait.png" alt="${currentLang === 'ar' ? DOCTOR.nameAr : DOCTOR.nameEn}" class="doctor-photo" loading="eager" onerror="this.src='/images/doctor-portrait.jpg'">
          <div class="image-accent">
            <div class="accent-title">${currentLang === 'ar' ? 'الموقع السريري' : 'Practice'}</div>
            <div class="accent-value">${currentLang === 'ar' ? 'مغربي — المدينة المنورة' : 'Magrabi — Madinah'}</div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function renderProfile(T) {
  const p = T.profile;
  const roles = DOCTOR.roles[currentLang];
  const reviews = REVIEWS[currentLang];

  return `
  <section class="section section-alt" id="profile">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${p.label}</div>
        <h2>${p.title}</h2>
        <p style="font-weight:600;color:var(--burgundy);">${p.subtitle}</p>
      </div>

      <div class="profile-grid fade-in">
        <div class="profile-media">
          <img src="/images/doctor-portrait.jpg" alt="${DOCTOR.nameAr}" class="profile-media-img" loading="lazy">
          <div class="credentials-chips">
            <span class="chip chip-gold">🎖️ ${currentLang === 'ar' ? 'زميل كلية الجراحين الملكية (FRCS بريطانيا)' : 'Fellow of Royal College of Surgeons (FRCS UK)'}</span>
            <span class="chip">🏛️ ${currentLang === 'ar' ? 'رئيس قسم العيون بجامعة طيبة' : 'Chair of Ophthalmology, Taibah Univ.'}</span>
            <span class="chip">🏥 ${currentLang === 'ar' ? 'المدير الطبي التنفيذي لمغربي المدينة' : 'CMO Magrabi Madinah'}</span>
            <span class="chip">🇸🇦 ${currentLang === 'ar' ? 'ممثل الجمعية السعودية لطب العيون' : 'Saudi Ophthalmology Society Rep.'}</span>
          </div>
        </div>
        <div class="profile-text">
          <p style="font-size:1.05rem;line-height:1.9;color:var(--charcoal);margin-bottom:var(--space-4);">${p.bio1}</p>
          <p style="font-size:1.05rem;line-height:1.9;color:var(--charcoal);margin-bottom:var(--space-6);">${p.bio2}</p>

          <h3 style="margin-bottom:var(--space-4);font-size:1.15rem;color:var(--burgundy);">${p.timelineTitle}</h3>
          <div class="timeline">
            ${roles.map(r => `
              <div class="timeline-item">
                <h4>${r}</h4>
                <p>${currentLang === 'ar' ? 'عضوية قيادية وأكاديمية رسمية مثبتة في السجلات الطبية' : 'Officially verified leadership and academic appointment'}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Scientific Leadership Gallery -->
      <div style="margin-top:var(--space-16);" class="fade-in">
        <div class="section-header" style="margin-bottom:var(--space-6);">
          <div class="section-label">${p.galleryTitle}</div>
          <h3 style="font-size:1.35rem;">${currentLang === 'ar' ? 'المشاركات العلمية ومؤتمرات طب العيون' : 'Academic Conferences & Leadership'}</h3>
        </div>
        <div class="gallery-grid">
          <div class="gallery-card">
            <img src="/images/dr-maan-redsea.jpg" alt="Saudi Ophthalmology Society Red Sea" loading="lazy">
            <div class="gallery-caption">
              <strong>${currentLang === 'ar' ? 'مؤتمر البحر الأحمر لطب وجراحة العيون 2024' : 'Red Sea Ophthalmology Conference 2024'}</strong>
              <p>${currentLang === 'ar' ? 'عضو المجلس العلمي وممثل الجمعية السعودية لطب العيون' : 'Scientific Council Member & SOS Representative'}</p>
            </div>
          </div>
          <div class="gallery-card">
            <img src="/images/dr-maan-faculty.jpg" alt="Faculty Saudi Ophthalmology" loading="lazy">
            <div class="gallery-caption">
              <strong>${currentLang === 'ar' ? 'المجلس العلمي والجلسات الأكاديمية الدولية' : 'International Scientific Faculty & Sessions'}</strong>
              <p>${currentLang === 'ar' ? 'مع نخبة من قيادات وجراحي العيون الدوليين' : 'With international ophthalmic leaders and surgical faculty'}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Verified Patient Reviews -->
      <div style="margin-top:var(--space-16);" class="fade-in">
        <div class="section-header" style="margin-bottom:var(--space-6);">
          <div class="section-label">${p.reviewsTitle}</div>
          <h3 style="font-size:1.35rem;">${p.reviewsSubtitle}</h3>
        </div>
        <div class="reviews-grid">
          ${reviews.map(r => `
            <div class="review-card">
              <div>
                <div class="review-stars">★★★★★</div>
                <p class="review-text">"${r.text}"</p>
              </div>
              <div class="review-author">
                <div class="review-avatar">${r.author.charAt(0)}</div>
                <div class="review-meta">
                  <strong>${r.author}</strong>
                  <span>${r.date}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </section>`;
}

function renderSpecialties(T) {
  const cards = T.specialties.items.map(item => `
    <div class="card fade-in">
      <div class="card-icon">${item.icon}</div>
      <h3>${item.title}</h3>
      <p style="line-height:1.7;">${item.desc}</p>
    </div>
  `).join('');

  return `
  <section class="section" id="specialties">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${T.specialties.label}</div>
        <h2>${T.specialties.title}</h2>
        <p>${T.specialties.desc}</p>
      </div>
      <div class="cards-grid">${cards}</div>
    </div>
  </section>`;
}

function renderIOLSection(T) {
  const iolData = IOL_DATA[currentLang];
  const rows = iolData.map(l => `
    <tr>
      <td><strong style="color:var(--burgundy);">${l.type}</strong></td>
      <td>${l.distance}</td>
      <td>${l.intermediate}</td>
      <td>${l.near}</td>
      <td>${l.glare}</td>
      <td style="font-size:0.8rem;color:var(--charcoal);">${l.bestFor}</td>
    </tr>
  `).join('');

  const thLabels = currentLang === 'ar'
    ? ['نوع العدسة', 'الرؤية البعيدة', 'الرؤية المتوسطة (كمبيوتر)', 'الرؤية القريبة (قراءة)', 'الهالات والوهج الليلي', 'الفئة الأنسب للمناقشة']
    : ['Lens Type', 'Distance Vision', 'Intermediate (Screens)', 'Near Vision (Reading)', 'Night Halos / Glare', 'Clinical Profile'];

  return `
  <section class="section section-alt" id="cataracts">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${T.iolSection.label}</div>
        <h2>${T.iolSection.title}</h2>
        <p>${T.iolSection.desc}</p>
      </div>
      <div class="fade-in" style="overflow-x:auto;">
        <table class="iol-table">
          <thead>
            <tr>${thLabels.map(l => `<th>${l}</th>`).join('')}</tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="medical-disclaimer">
        <strong>${currentLang === 'ar' ? 'تنبيه سريري هام:' : 'Important Clinical Notice:'}</strong>
        ${currentLang === 'ar'
          ? 'هذا الجدول تعليمي وتثقيفي ولا يُغني عن استشارة طبيب العيون. لا توجد عدسة واحدة مثالية لكل مريض؛ فاختيار العدسة يعتمد على تضاريس القرنية، صحة الشبكية والعصب البصري، ونتائج القياسات الضوئية الدقيقة (Biometry).'
          : 'This table is educational and does not replace in-person ophthalmic consultation. No lens is universally superior; lens suitability depends on optical biometry, corneal astigmatism, retinal integrity, and lifestyle.'}
      </div>
    </div>
  </section>`;
}

function renderSimulator(T) {
  const scenes = [
    { id: 'driving', label: currentLang === 'ar' ? 'القيادة الليلية' : 'Night Driving' },
    { id: 'phone', label: currentLang === 'ar' ? 'شاشة الهاتف' : 'Smartphone Reading' },
    { id: 'reading', label: currentLang === 'ar' ? 'قراءة كتاب' : 'Book Reading' },
  ];
  const lenses = [
    { id: 'cataract', label: currentLang === 'ar' ? 'إعتام المياه البيضاء' : 'Cataract Opacity' },
    { id: 'monofocal', label: currentLang === 'ar' ? 'أحادية البؤرة (Monofocal)' : 'Monofocal IOL' },
    { id: 'edof', label: currentLang === 'ar' ? 'ممتدة العمق (EDOF)' : 'EDOF IOL' },
    { id: 'trifocal', label: currentLang === 'ar' ? 'ثلاثية البؤرة (Trifocal)' : 'Trifocal IOL' },
  ];

  const lensInfo = {
    cataract: {
      ar: 'محاكاة تأثير المياه البيضاء: ضبابية في الرؤية، انخفاض شديد في التباين، وتشتت الضوء حول المصابيح ليلاً.',
      en: 'Cataract Simulation: progressive blurriness, reduced contrast sensitivity, and scattering of light around headlights.'
    },
    monofocal: {
      ar: 'عدسة أحادية البؤرة: رؤية بعيدة نقية وحادة جداً مع تباين ممتاز، بينما قد تبدو شاشات الهاتف والكتب غير واضحة بدون نظارة قراءة.',
      en: 'Monofocal IOL: crisp high-contrast distance clarity, with near and smartphone tasks requiring reading glasses.'
    },
    edof: {
      ar: 'عدسة ممتدة العمق: امتداد في وضوح الرؤية من المسافة البعيدة وحتى المسافات المتوسطة (لوحة القيادة والشاشات) مع احتمالية منخفضة للهالات.',
      en: 'EDOF IOL: extended range from distance to intermediate tasks (screens, dashboard) with minimal dysphotopsia.'
    },
    trifocal: {
      ar: 'عدسة ثلاثية البؤرة: توفير رؤية وظيفية متزامنة للبعيد والمتوسط والقريب مع تقليل الحاجة للنظارة، مصحوبة بهالات دائرية خفيفة حول الأضواء تتكيف معها العين عادة.',
      en: 'Trifocal IOL: simultaneous functional vision across near, intermediate, and far tasks, accompanied by subtle night halos that adapt over time.'
    },
  };

  return `
  <section class="simulator-section" id="simulator">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label" style="color:var(--gold);">${T.simulator.label}</div>
        <h2 style="color:var(--white);">${T.simulator.title}</h2>
        <p style="color:var(--gray-400);">${T.simulator.desc}</p>
      </div>

      <div class="simulator-wrapper fade-in">
        <!-- Scene Selection Tabs -->
        <div class="simulator-controls">
          <div class="simulator-tabs">
            ${scenes.map(s => `<button class="sim-tab ${simScene === s.id ? 'active' : ''}" onclick="setSimScene('${s.id}')">${s.label}</button>`).join('')}
          </div>
        </div>

        <!-- Interactive Split View Comparison Viewport -->
        <div class="slider-interactive-wrap" id="sim-slider-container">
          <!-- Layer 1: Normal Reference Vision -->
          <div class="slider-layer-before">
            <div class="slider-layer-content">
              ${renderSceneSVG(simScene, 'normal')}
            </div>
          </div>

          <!-- Layer 2: Simulated Lens Effect (clipped by slider) -->
          <div class="slider-layer-after" id="sim-after-layer" style="width: ${simSliderPos}%;">
            <div class="slider-layer-content">
              ${renderSceneSVG(simScene, simLens)}
            </div>
          </div>

          <!-- Slider Range Control -->
          <input type="range" min="0" max="100" value="${simSliderPos}" class="slider-range-input" id="sim-range-input" oninput="updateSimSlider(this.value)" aria-label="Compare vision slider">

          <!-- Visual Divider Line and Handle -->
          <div class="slider-divider-line" id="sim-divider-line" style="left: ${simSliderPos}%;">
            <div class="slider-divider-badge">⟺</div>
          </div>

          <!-- Tags -->
          <div class="slider-labels-tag tag-before">${T.simulator.normalView}</div>
          <div class="slider-labels-tag tag-after">${T.simulator.simulatedView} (${lenses.find(l=>l.id===simLens).label})</div>
        </div>

        <!-- Lens Selection Buttons -->
        <div class="simulator-lens-buttons">
          ${lenses.map(l => `<button class="lens-btn ${simLens === l.id ? 'active' : ''}" onclick="setSimLens('${l.id}')">${l.label}</button>`).join('')}
        </div>

        <!-- Overlay Text Description -->
        <div class="sim-overlay-text" style="position:relative;background:var(--gray-900);">
          <h4>${lensInfo[simLens][currentLang]}</h4>
          <p style="font-size:0.8rem;color:var(--gold);margin-top:4px;">${T.simulator.compareLabel}</p>
        </div>

        <!-- Prominent Disclaimer -->
        <div class="sim-disclaimer">
          <strong>${currentLang === 'ar' ? 'إخلاء مسؤولية محاكي الرؤية:' : 'Simulator Disclaimer:'}</strong> ${T.simDisclaimer}
        </div>
      </div>
    </div>
  </section>`;
}

function renderSceneSVG(scene, lensMode) {
  // Filters matching visual symptoms
  let filterCss = 'none';
  if (lensMode === 'cataract') {
    filterCss = scene === 'driving'
      ? 'blur(3.5px) contrast(0.65) brightness(0.85) saturate(0.6)'
      : 'blur(4px) contrast(0.6) saturate(0.5)';
  } else if (lensMode === 'monofocal') {
    filterCss = scene === 'driving'
      ? 'contrast(1.05) brightness(1.0)' // sharp distance
      : 'blur(3px) contrast(0.85)'; // blur near
  } else if (lensMode === 'edof') {
    filterCss = scene === 'driving'
      ? 'contrast(1.0) brightness(1.0)'
      : (scene === 'phone' ? 'blur(0.8px) contrast(0.95)' : 'blur(1.6px) contrast(0.9)');
  } else if (lensMode === 'trifocal') {
    filterCss = scene === 'driving'
      ? 'contrast(0.92) brightness(1.02)'
      : 'blur(0px) contrast(0.98)';
  }

  const haloEffect = (lensMode === 'trifocal' && scene === 'driving')
    ? `<circle cx="300" cy="350" r="45" fill="none" stroke="#FFD700" stroke-width="2" opacity="0.6"/>
       <circle cx="500" cy="350" r="45" fill="none" stroke="#FFD700" stroke-width="2" opacity="0.6"/>
       <circle cx="300" cy="350" r="70" fill="none" stroke="#FFA500" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.4"/>
       <circle cx="500" cy="350" r="70" fill="none" stroke="#FFA500" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.4"/>`
    : '';

  if (scene === 'driving') {
    return `
    <svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;filter:${filterCss};">
      <rect width="800" height="450" fill="#070c14"/>
      <!-- Road and Horizon -->
      <polygon points="360,220 440,220 800,450 0,450" fill="#15181e"/>
      <line x1="400" y1="220" x2="400" y2="450" stroke="#f1c40f" stroke-width="3" stroke-dasharray="35,25"/>
      <line x1="360" y1="220" x2="0" y2="450" stroke="#555" stroke-width="2"/>
      <line x1="440" y1="220" x2="800" y2="450" stroke="#555" stroke-width="2"/>

      <!-- Madinah Highway Signs -->
      <rect x="520" y="90" width="180" height="75" rx="6" fill="#0d47a1" stroke="#fff" stroke-width="2"/>
      <text x="610" y="125" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold" font-family="'Alexandria', sans-serif">طريق المطار ✈</text>
      <text x="610" y="148" text-anchor="middle" fill="#90caf9" font-size="12" font-family="'Inter', sans-serif">Airport Road — Madinah</text>

      <!-- Street Light Poles -->
      ${[120, 240, 680].map(x => `
        <line x1="${x}" y1="140" x2="${x}" y2="300" stroke="#444" stroke-width="2.5"/>
        <circle cx="${x}" cy="140" r="10" fill="#ffecb3" opacity="0.8"/>
        <circle cx="${x}" cy="140" r="28" fill="#ffd54f" opacity="0.2"/>
      `).join('')}

      <!-- Oncoming Car Headlights -->
      <ellipse cx="300" cy="350" rx="30" ry="14" fill="#ffffff" opacity="0.95"/>
      <ellipse cx="500" cy="350" rx="30" ry="14" fill="#ffffff" opacity="0.95"/>
      <ellipse cx="300" cy="350" rx="55" ry="24" fill="#fff59d" opacity="0.3"/>
      <ellipse cx="500" cy="350" rx="55" ry="24" fill="#fff59d" opacity="0.3"/>
      ${haloEffect}
    </svg>`;
  }

  if (scene === 'phone') {
    return `
    <svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;filter:${filterCss};">
      <rect width="800" height="450" fill="#1e2430"/>
      <!-- Smartphone Mockup -->
      <rect x="250" y="20" width="300" height="410" rx="28" fill="#0b0f17" stroke="#333f52" stroke-width="3"/>
      <rect x="265" y="45" width="270" height="360" rx="14" fill="#f8fafc"/>

      <!-- Phone App Header -->
      <rect x="265" y="45" width="270" height="50" fill="#641B2D"/>
      <text x="400" y="75" text-anchor="middle" fill="#fff" font-size="13" font-weight="bold" font-family="'Alexandria', sans-serif">
        ${currentLang === 'ar' ? 'رسالة العيادة — مغربي' : 'Clinic Message — Magrabi'}
      </text>

      <!-- Messages Content -->
      <rect x="280" y="115" width="240" height="65" rx="8" fill="#e2e8f0"/>
      <text x="300" y="140" fill="#1e293b" font-size="12" font-weight="600" font-family="'Alexandria', sans-serif">
        ${currentLang === 'ar' ? 'موعد فحص العيون والقرنية:' : 'Eye & Cornea Exam Appointment:'}
      </text>
      <text x="300" y="162" fill="#475569" font-size="11" font-family="'Inter', sans-serif">
        ${currentLang === 'ar' ? 'د. معن البري — طريق المطار' : 'Dr. Maan Al Barry — Airport Rd'}
      </text>

      <!-- Arabic & English Text Samples for Near Acuity Testing -->
      <rect x="280" y="195" width="240" height="180" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
      <text x="400" y="225" text-anchor="middle" fill="#641B2D" font-size="14" font-weight="bold" font-family="'Alexandria', sans-serif">
        ${currentLang === 'ar' ? 'فحص حدة الإبصار القريبة' : 'Near Visual Acuity Sample'}
      </text>
      <text x="400" y="255" text-anchor="middle" fill="#1e293b" font-size="12" font-family="'Alexandria', sans-serif">
        ${currentLang === 'ar' ? 'قراءة الرسائل بوضوح وراحة' : 'Clear and comfortable text reading'}
      </text>
      <text x="400" y="280" text-anchor="middle" fill="#475569" font-size="10.5" font-family="'Inter', sans-serif">
        ${currentLang === 'ar' ? 'اختبار القدرة على قراءة الخط الصغير دون إجهاد' : 'Testing fine print legibility without eye strain'}
      </text>
      <text x="400" y="305" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="'Inter', sans-serif">
        N6 / 20/30 Near Vision Acuity Benchmark Line
      </text>
    </svg>`;
  }

  // Book Reading Scene
  return `
  <svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;filter:${filterCss};">
    <rect width="800" height="450" fill="#e8dec8"/>
    <!-- Open Book Mockup -->
    <rect x="100" y="30" width="600" height="390" rx="8" fill="#fcf9f2" stroke="#c4b59d" stroke-width="2"/>
    <line x1="400" y1="30" x2="400" y2="420" stroke="#d5c8b0" stroke-width="3"/>

    <!-- Left Page -->
    <text x="250" y="80" text-anchor="middle" fill="#641B2D" font-size="16" font-weight="bold" font-family="'Alexandria', serif">
      ${currentLang === 'ar' ? 'طب وجراحة العيون' : 'Ophthalmology Practice'}
    </text>
    <text x="250" y="120" text-anchor="middle" fill="#242B30" font-size="12" font-family="'Alexandria', serif">
      ${currentLang === 'ar' ? 'علاج المياه البيضاء والقرنية المخروطية' : 'Cataract & Keratoconus Care'}
    </text>
    ${[160, 190, 220, 250, 280, 310, 340].map(y => `
      <rect x="140" y="${y}" width="220" height="8" rx="2" fill="#64748b" opacity="0.65"/>
    `).join('')}

    <!-- Right Page -->
    <text x="550" y="80" text-anchor="middle" fill="#C5A46D" font-size="16" font-weight="bold" font-family="'Alexandria', serif">
      ${currentLang === 'ar' ? 'د. معن عبدالله البري' : 'Dr. Maan Al Barry'}
    </text>
    <text x="550" y="120" text-anchor="middle" fill="#242B30" font-size="12" font-family="'Alexandria', serif">
      ${currentLang === 'ar' ? 'المدينة المنورة — مستشفى مغربي' : 'Madinah — Magrabi Hospital'}
    </text>
    ${[160, 190, 220, 250, 280, 310, 340].map(y => `
      <rect x="440" y="${y}" width="220" height="8" rx="2" fill="#64748b" opacity="0.65"/>
    `).join('')}
  </svg>`;
}

function renderQuestionnaire(T) {
  const Q = QUESTIONNAIRE[currentLang];

  if (qDone) {
    return `
    <section class="section section-alt" id="questionnaire">
      <div class="container">
        <div class="section-header fade-in">
          <div class="section-label">${T.questionnaire.label}</div>
          <h2>${T.questionnaire.title}</h2>
        </div>
        <div class="questionnaire fade-in">
          ${renderQuestionnaireResult(T)}
        </div>
      </div>
    </section>`;
  }

  const step = Q.steps[qStep];
  return `
  <section class="section section-alt" id="questionnaire">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${T.questionnaire.label}</div>
        <h2>${T.questionnaire.title}</h2>
        <p>${T.questionnaire.desc}</p>
      </div>
      <div class="questionnaire fade-in">
        <div class="q-progress">
          ${Q.steps.map((_, i) => `<div class="step ${i < qStep ? 'done' : ''} ${i === qStep ? 'current' : ''}"></div>`).join('')}
        </div>
        <div class="q-question">
          <h3>${currentLang === 'ar' ? `السؤال ${qStep + 1} من ${Q.steps.length}` : `Question ${qStep + 1} of ${Q.steps.length}`}</h3>
          <p style="font-size:1.1rem;color:var(--charcoal);margin-top:var(--space-2);font-weight:600;">${step.question}</p>
        </div>
        <div class="q-options">
          ${step.options.map((opt, i) => `
            <button class="q-option ${qAnswers[qStep] === i ? 'selected' : ''}" onclick="selectQOption(${i})">${opt}</button>
          `).join('')}
        </div>
        <div class="q-nav">
          ${qStep > 0 ? `<button class="btn btn-outline btn-sm" onclick="prevQStep()">${currentLang === 'ar' ? 'السابق' : 'Previous'}</button>` : '<div></div>'}
          <button class="btn btn-primary btn-sm" onclick="nextQStep()" ${qAnswers[qStep] === undefined ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
            ${qStep < Q.steps.length - 1 ? (currentLang === 'ar' ? 'التالي' : 'Next') : (currentLang === 'ar' ? 'عرض ملخص النقاش' : 'View Discussion Points')}
          </button>
        </div>
        <div class="medical-disclaimer" style="margin-top:var(--space-6);">
          ${T.qDisclaimer}
        </div>
      </div>
    </div>
  </section>`;
}

function renderQuestionnaireResult(T) {
  const R = QUESTIONNAIRE[currentLang].results;
  const items = [];

  const priorityAnswer = qAnswers[2];
  if (priorityAnswer === 0) items.push(R.nightDriving);
  else if (priorityAnswer === 1) items.push(R.nearVision);
  else items.push(R.balanced);

  if (qAnswers[3] === 0) items.push(R.previousLasik);
  if (qAnswers[1] !== 0 && qAnswers[1] !== 4 && qAnswers[1] !== undefined) items.push(R.eyeCondition);
  items.push(R.generalAdvice);

  return `
  <div class="q-result">
    <h3>${currentLang === 'ar' ? 'ملخص النقاط التثقيفية المقترحة لمناقشتها مع الطبيب' : 'Suggested Discussion Points for Your Doctor Visit'}</h3>
    <p style="color:var(--gray-600);font-size:0.95rem;margin-bottom:var(--space-6);">${currentLang === 'ar' ? 'بناءً على أولوياتك، هذه بعض النقاط العلمية التي يُنصح بطرحها أثناء الفحص الإكلينيكي في مغربي:' : 'Based on your selected priorities, here are key clinical topics to explore during your consultation at Magrabi:'}</p>
    <div class="q-result-items">
      ${items.map(item => `
        <div class="q-result-item">
          <h4>${item.title}</h4>
          <p>${item.text}</p>
        </div>
      `).join('')}
    </div>
    <div style="display:flex;gap:var(--space-3);justify-content:center;flex-wrap:wrap;margin-top:var(--space-8);">
      <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener" class="btn btn-primary">${T.bookNow}</a>
      <a href="${whatsappUrl('مرحباً، أود الاستفسار عن استشارة حول عمليات المياه البيضاء وخيارات العدسات مع د. معن البري.')}" target="_blank" rel="noopener" class="btn btn-whatsapp">${currentLang === 'ar' ? 'استفسر عبر واتساب' : 'Inquire via WhatsApp'}</a>
      <button class="btn btn-outline" onclick="restartQ()">${currentLang === 'ar' ? 'إعادة الإجابة' : 'Restart Questionnaire'}</button>
    </div>
    <div class="medical-disclaimer" style="margin-top:var(--space-6);text-align:start;">${T.qDisclaimer}</div>
  </div>`;
}

function renderEducation(T) {
  const articles = ARTICLES[currentLang];

  return `
  <section class="section" id="education">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${T.education.label}</div>
        <h2>${T.education.title}</h2>
        <p>${T.education.desc}</p>
      </div>

      <div class="article-accordion fade-in">
        ${articles.map((art, idx) => `
          <div class="article-item ${activeArticle === art.id ? 'open' : ''}" id="art-item-${art.id}">
            <button class="article-trigger" onclick="toggleArticle('${art.id}')">
              <span>${art.title}</span>
              <span class="trigger-icon">▼</span>
            </button>
            <div class="article-content">
              ${art.content}
              <div style="margin-top:var(--space-4);padding-top:var(--space-3);border-top:1px solid var(--gray-200);font-size:0.8rem;color:var(--gray-500);">
                👨‍⚕️ ${currentLang === 'ar' ? 'إشراف ومراجعة طبية: د. معن عبدالله البري — استشاري طب وجراحة العيون' : 'Medically reviewed by Dr. Maan Al Barry — Consultant Ophthalmologist'}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Emergency Red Flags Box -->
      <div class="emergency-card fade-in">
        <div class="emergency-header">
          <span>⚠️</span>
          <span>${currentLang === 'ar' ? 'علامات التحذير الطارئة (تستوجب الرعاية العاجلة فوراً)' : 'Emergency Red Flags (Require Immediate Ophthalmic Attention)'}</span>
        </div>
        <p style="font-size:0.9rem;">
          ${currentLang === 'ar'
            ? 'إذا كنت تعاني من أي من الأعراض التالية، يرجى التوجه فوراً لأقرب طوارئ عيون متخصصة:'
            : 'If you experience any of the following symptoms, seek urgent emergency ophthalmic care immediately:'}
        </p>
        <ul>
          <li>${currentLang === 'ar' ? 'فقدان مفاجئ أو تدهور حاد وسريع في الرؤية بأي من العينين.' : 'Sudden vision loss or rapid deterioration of sight in either eye.'}</li>
          <li>${currentLang === 'ar' ? 'ألم شديد ومفاجئ في العين مصحوب باحمرار أو صداع وغثيان.' : 'Severe, sudden eye pain accompanied by redness, headache, or nausea.'}</li>
          <li>${currentLang === 'ar' ? 'ظهور ومضات ضوئية مفاجئة أو هطول كثيف من النقاط السوداء العائمة (ذباب طائر).' : 'Sudden onset of light flashes or a heavy shower of floating black spots.'}</li>
          <li>${currentLang === 'ar' ? 'ظهور ما يشبه الستارة السوداء أو الظل الذي يغطي جزءاً من مجال الرؤية.' : 'A dark shadow or curtain falling across any portion of your visual field.'}</li>
        </ul>
      </div>
    </div>
  </section>`;
}

function renderClinic(T) {
  return `
  <section class="section section-alt" id="clinic">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${T.clinic.label}</div>
        <h2>${T.clinic.title}</h2>
      </div>
      <div class="clinic-card fade-in">
        <div class="clinic-map">
          <a href="${DOCTOR.mapsUrl}" target="_blank" rel="noopener" style="display:flex;flex-direction:column;align-items:center;gap:var(--space-3);color:var(--burgundy);text-decoration:none;padding:var(--space-8);text-align:center;">
            <span style="font-size:3rem;">📍</span>
            <strong style="font-size:1.1rem;">${T.clinic.name}</strong>
            <span style="font-size:0.85rem;color:var(--gray-500);">${T.clinic.address}</span>
            <span class="btn btn-outline btn-sm" style="margin-top:var(--space-3);">${T.clinic.directions}</span>
          </a>
        </div>
        <div class="clinic-info">
          <h3>${T.clinic.name}</h3>
          <div class="clinic-detail">
            <div class="detail-icon">📍</div>
            <div class="detail-text">
              <strong>${currentLang === 'ar' ? 'العنوان' : 'Address'}</strong>
              ${T.clinic.address}
            </div>
          </div>
          <div class="clinic-detail">
            <div class="detail-icon">📞</div>
            <div class="detail-text">
              <strong>${T.clinic.phone}</strong>
              <a href="tel:${DOCTOR.callCenter}" style="direction:ltr;display:inline-block;color:var(--burgundy);font-weight:600;">${DOCTOR.callCenter} / ${DOCTOR.landline}</a>
            </div>
          </div>
          <div class="clinic-detail">
            <div class="detail-icon">🕐</div>
            <div class="detail-text">
              <strong>${T.clinic.hours}</strong>
              ${T.clinic.hoursValue}
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:var(--space-3);margin-top:var(--space-6);">
            <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener" class="btn btn-primary">${T.clinic.book}</a>
            <a href="${whatsappUrl()}" target="_blank" rel="noopener" class="btn btn-whatsapp">${T.clinic.whatsapp}</a>
            <a href="${DOCTOR.mapsUrl}" target="_blank" rel="noopener" class="btn btn-outline">${T.clinic.directions}</a>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function renderFAQ(T) {
  const faqs = FAQ_DATA[currentLang];
  return `
  <section class="section" id="faq">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${T.faq.label}</div>
        <h2>${T.faq.title}</h2>
      </div>
      <div class="faq-list fade-in">
        ${faqs.map((f, i) => `
          <div class="faq-item" id="faq-${i}">
            <button class="faq-question" onclick="toggleFaq(${i})" aria-expanded="false" aria-controls="faq-answer-${i}">
              <span>${f.q}</span>
              <span class="faq-icon">+</span>
            </button>
            <div class="faq-answer" id="faq-answer-${i}" role="region">
              <p>${f.a}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

function renderCTA(T) {
  return `
  <section class="section">
    <div class="container">
      <div class="cta-banner fade-in">
        <h2>${T.cta.title}</h2>
        <p>${T.cta.desc}</p>
        <div style="display:flex;gap:var(--space-3);justify-content:center;flex-wrap:wrap;">
          <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener" class="btn btn-gold btn-lg">${T.bookNow}</a>
          <a href="${whatsappUrl()}" target="_blank" rel="noopener" class="btn btn-whatsapp">${currentLang === 'ar' ? 'تنسيق الموعد عبر واتساب' : 'Inquire via WhatsApp'}</a>
        </div>
      </div>
    </div>
  </section>`;
}

function renderFooter(T) {
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3);">
            <div class="logo-icon" style="width:40px;height:40px;font-size:1.1rem;">م</div>
            <div>
              <strong style="color:var(--white);font-size:1rem;display:block;">${currentLang === 'ar' ? DOCTOR.nameAr : DOCTOR.nameEn}</strong>
              <small style="color:var(--gold);font-size:0.75rem;">${currentLang === 'ar' ? DOCTOR.titleAr : DOCTOR.titleEn}</small>
            </div>
          </div>
          <p>${T.footer.madeWith}</p>
        </div>
        <div class="footer-col">
          <h4>${currentLang === 'ar' ? 'روابط سريعة' : 'Quick Navigation'}</h4>
          <a href="#home" onclick="scrollToSection('home');return false;">${T.nav.home}</a>
          <a href="#profile" onclick="scrollToSection('profile');return false;">${T.nav.profile}</a>
          <a href="#specialties" onclick="scrollToSection('specialties');return false;">${T.nav.specialties}</a>
          <a href="#cataracts" onclick="scrollToSection('cataracts');return false;">${T.nav.cataracts}</a>
          <a href="#simulator" onclick="scrollToSection('simulator');return false;">${T.nav.simulator}</a>
          <a href="#education" onclick="scrollToSection('education');return false;">${T.nav.education}</a>
        </div>
        <div class="footer-col">
          <h4>${currentLang === 'ar' ? 'التخصصات الطبية' : 'Specialties'}</h4>
          <a href="#cataracts" onclick="scrollToSection('cataracts');return false;">${currentLang === 'ar' ? 'جراحة المياه البيضاء' : 'Cataract Surgery'}</a>
          <a href="#specialties" onclick="scrollToSection('specialties');return false;">${currentLang === 'ar' ? 'تصحيح الإبصار (الليزك)' : 'Refractive Surgery'}</a>
          <a href="#specialties" onclick="scrollToSection('specialties');return false;">${currentLang === 'ar' ? 'القرنية المخروطية (CXL)' : 'Keratoconus (CXL)'}</a>
          <a href="#cataracts" onclick="scrollToSection('cataracts');return false;">${currentLang === 'ar' ? 'زراعة العدسات التوريك والمتقدمة' : 'Premium & Toric IOLs'}</a>
        </div>
        <div class="footer-col">
          <h4>${currentLang === 'ar' ? 'العيادة والتواصل' : 'Practice & Contact'}</h4>
          <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener">${T.bookNow}</a>
          <a href="${whatsappUrl()}" target="_blank" rel="noopener">WhatsApp (${DOCTOR.whatsapp})</a>
          <a href="tel:${DOCTOR.callCenter}">${T.clinic.phone}: ${DOCTOR.callCenter}</a>
          <a href="${DOCTOR.mapsUrl}" target="_blank" rel="noopener">${T.clinic.directions}</a>
        </div>
      </div>
      <div class="medical-disclaimer" style="background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.1);color:var(--gray-300);margin-bottom:var(--space-6);">
        <strong style="color:var(--gold);">${T.footer.disclaimer}:</strong> ${T.footer.disclaimerText}
      </div>
      <div class="footer-bottom">
        <p>${T.footer.rights} ${new Date().getFullYear()} — ${DOCTOR.nameAr}</p>
        <div>
          <a href="${DOCTOR.magrabiProfile}" target="_blank" rel="noopener">${currentLang === 'ar' ? 'الملف الطبي في مغربي' : 'Magrabi Profile'}</a> ·
          <a href="${DOCTOR.taibahProfile}" target="_blank" rel="noopener">${currentLang === 'ar' ? 'ملف أعضاء هيئة التدريس بجامعة طيبة' : 'Taibah University Profile'}</a>
        </div>
      </div>
    </div>
  </footer>`;
}

function renderBookingBar(T) {
  return `
  <div class="booking-bar" id="booking-bar">
    <div class="booking-bar-inner">
      <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">${T.bookNow}</a>
      <a href="${whatsappUrl()}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm">WhatsApp</a>
    </div>
  </div>`;
}

// --- INTERACTIVE ACTIONS ---

window.toggleLang = function() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  qStep = 0; qAnswers = []; qDone = false; activeArticle = null;
  render();
  window.scrollTo(0, 0);
};

window.scrollToSection = function(id) {
  const el = document.getElementById(id);
  if (el) {
    const headerH = document.getElementById('site-header')?.offsetHeight || 72;
    const y = el.getBoundingClientRect().top + window.scrollY - headerH - 16;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};

window.toggleMobileMenu = function() {
  document.getElementById('mobile-nav')?.classList.toggle('open');
};

window.closeMobileMenu = function() {
  document.getElementById('mobile-nav')?.classList.remove('open');
};

window.setSimScene = function(scene) {
  simScene = scene;
  render();
  scrollToSection('simulator');
};

window.setSimLens = function(lens) {
  simLens = lens;
  render();
  scrollToSection('simulator');
};

window.updateSimSlider = function(val) {
  simSliderPos = val;
  const afterLayer = document.getElementById('sim-after-layer');
  const dividerLine = document.getElementById('sim-divider-line');
  if (afterLayer) afterLayer.style.width = val + '%';
  if (dividerLine) dividerLine.style.left = val + '%';
};

window.selectQOption = function(idx) {
  qAnswers[qStep] = idx;
  render();
  scrollToSection('questionnaire');
};

window.nextQStep = function() {
  if (qAnswers[qStep] === undefined) return;
  const Q = QUESTIONNAIRE[currentLang];
  if (qStep < Q.steps.length - 1) {
    qStep++;
  } else {
    qDone = true;
  }
  render();
  scrollToSection('questionnaire');
};

window.prevQStep = function() {
  if (qStep > 0) {
    qStep--;
    render();
    scrollToSection('questionnaire');
  }
};

window.restartQ = function() {
  qStep = 0;
  qAnswers = [];
  qDone = false;
  render();
  scrollToSection('questionnaire');
};

window.toggleArticle = function(id) {
  activeArticle = (activeArticle === id) ? null : id;
  const item = document.getElementById(`art-item-${id}`);
  if (item) item.classList.toggle('open');
};

window.toggleFaq = function(idx) {
  const item = document.getElementById(`faq-${idx}`);
  if (item) item.classList.toggle('open');
};

// --- SCROLL ANIMATIONS ---
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function initHeaderScroll() {
  window.addEventListener('scroll', () => {
    const header = document.getElementById('site-header');
    if (header) {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }, { passive: true });
}

// Initial Render
render();
