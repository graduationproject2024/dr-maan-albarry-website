import './style.css';

// ============================================================
// DR. MAAN AL BARRY — OFFICIAL MEDICAL PORTAL
// Clinical Prestige & Academic Ophthalmology
// ============================================================

// --- DATA LAYER (Verified Primary Source Facts) ---
const DOCTOR = {
  nameAr: 'د. معن بن عبدالله بن عمر البري',
  nameEn: 'Dr. Maan Abdullah Omar Al Barry',
  shortNameAr: 'د. معن البري',
  shortNameEn: 'Dr. Maan Al Barry',
  titleAr: 'استشاري طب وجراحة العيون والقرنية والماء الأبيض وتصحيح الإبصار',
  titleEn: 'Consultant Ophthalmologist — Cataract, Cornea & Refractive Surgery',
  degreesAr: 'زميل كلية الجراحين الملكية (بريطانيا) FRCS',
  degreesEn: 'Fellow of the Royal College of Surgeons (UK) FRCS',
  clinicAr: 'مستشفيات ومراكز مغربي للعيون والأذن – المدينة المنورة',
  clinicEn: 'Magrabi Health Eye & ENT Hospital – Madinah',
  addressAr: 'طريق المطار، المدينة المنورة، المملكة العربية السعودية',
  addressEn: 'Airport Road, Madinah, Saudi Arabia',
  whatsapp: '966508533309',
  bookingUrl: 'https://ob.magrabi.com.sa/OnlineBooking/',
  callCenter: '19505',
  landline: '920018000',
  magrabiProfile: 'https://www.magrabihealth.com/ar/sa/eye/our-doctors/dr-maan-abdullah-barry',
  taibahProfile: 'https://www.taibahu.edu.sa/the-university/about-taibah-university/faculty-members/1431',
  email: 'mbarry@taibahu.edu.sa',
  // Official supplied Google Maps Destination Link
  mapsUrl: 'https://maps.app.goo.gl/Hx6M1eKNEnGbe7AbA',
  roles: {
    ar: [
      'المدير الطبي التنفيذي – مستشفيات ومراكز مغربي بالمدينة المنورة',
      'رئيس قسم طب وجراحة العيون – جامعة طيبة',
      'ممثل الجمعية السعودية لطب وجراحة العيون – المدينة المنورة',
      'عضو المجلس العلمي لمؤتمر البحر الأحمر لطب وجراحة العيون',
      'أمين سر الجمعية السعودية لطب العيون سابقاً',
      'زميل كلية الجراحين الملكية – بريطانيا (FRCS)',
      'عضو الجمعية الأمريكية لطب وجراحة العيون (AAO)',
      'عضو الجمعية السعودية لطب وجراحة العيون (SOS)',
    ],
    en: [
      'Chief Medical Officer – Magrabi Health Eye & ENT, Madinah',
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

// --- SIMULATOR CONFIGURATIONS ---
const SCENES = {
  night: {
    id: 'night',
    titleAr: 'القيادة الليلية (المدينة المنورة)',
    titleEn: 'Night Driving (Madinah)',
    locationAr: 'شارع سلطانة / الدائري الثاني، المدينة المنورة',
    locationEn: 'Airport Road / King Abdullah Ring Road, Madinah',
    icon: '🚗',
    baseImg: '/images/sim-driving-cataract.jpg',
    simImg: '/images/sim-driving-clear.jpg',
    baseTagAr: 'الأساس: ماء أبيض غير معالج (ضبابية وتشتت ضوئي)',
    baseTagEn: 'Baseline: Untreated Cataract (Blur & Halos)',
  },
  phone: {
    id: 'phone',
    titleAr: 'الهاتف والمسافات القريبة (40 سم)',
    titleEn: 'Smartphone Reading (40 cm)',
    locationAr: 'تصفح الرسائل وتطبيقات الجوال ومحادثات العيادة',
    locationEn: 'Reading Clinic Messages & Smartphone Text',
    icon: '📱',
    baseImg: '', // rendered via high precision SVG
    simImg: '',
    baseTagAr: 'الأساس: صعوبة قراءة الرسائل وإجهاد العين',
    baseTagEn: 'Baseline: Blurry Screen Text & Strain',
  },
  quran: {
    id: 'quran',
    titleAr: 'المصحف الشريف والقراءة المكتبية',
    titleEn: 'Quran & Book Reading',
    locationAr: 'قراءة المصحف والكتب الورقية في إضاءة معتدلة',
    locationEn: 'Reading Quran & Printed Books in Ambient Light',
    icon: '📖',
    baseImg: '', // rendered via high precision SVG
    simImg: '',
    baseTagAr: 'الأساس: بهتان الحروف وضبابية التشكيل',
    baseTagEn: 'Baseline: Faded Ink & Hazy Diacritics',
  }
};

const LENSES = {
  trifocal: {
    id: 'trifocal',
    nameAr: 'ثلاثية البؤرة الذكية (Trifocal)',
    nameEn: 'Smart Trifocal IOL',
    tagAr: 'المحاكاة: عدسة ثلاثية البؤرة الذكية',
    tagEn: 'Simulated: Smart Trifocal IOL',
    focusAr: 'تغطية ممتازة للمسافة البعيدة (القيادة)، المتوسطة (الشاشات)، والقريبة (قراءة الهاتف).',
    focusEn: 'Continuous coverage for distance (driving), intermediate (screens), and near (phone).',
    distance: 98,
    intermediate: 92,
    near: 88,
    spectaclesAr: 'استقلالية عالية جداً لمعظم المهام اليومية (90-95%) دون نظارة',
    spectaclesEn: 'High spectacle independence (90–95%) for daily tasks',
    halosAr: 'طفيف إلى معتدل حول المصابيح القوية أثناء القيادة ليلاً ويتلاشى تدريجياً بالتكيف العصبي',
    halosEn: 'Mild-to-moderate halos around bright headlights, diminishing with neuroadaptation',
    insightTitleAr: 'رأي الاستشاري: كيف يرى الدماغ الصور عبر العدسة ثلاثية البؤرة؟',
    insightTitleEn: 'Clinical Insight: How Neuroadaptation Works with Trifocal IOLs',
    insightTextAr: 'تقوم العدسات ثلاثية البؤرة (Trifocal) بتوزيع الضوء على ثلاث نقاط تركيز رئيسية. يستغرق الدماغ البشري فترة وجيزة تتراوح بين عدة أسابيع إلى بضعة أشهر لتعلم اختيار الصورة الأصفى تلقائياً دون أي مجهود إرادي، وهي العملية المعروفة طبياً بـ (Neuroadaptation).',
    insightTextEn: 'Trifocal lenses split incoming light into distinct focal points. The visual cortex adapts over several weeks to automatically prioritize the in-focus image, a physiological process known as neuroadaptation.'
  },
  edof: {
    id: 'edof',
    nameAr: 'ممتدة المدى البصري (EDOF)',
    nameEn: 'Extended Depth of Focus (EDOF)',
    tagAr: 'المحاكاة: عدسة ممتدة المدى البصري (EDOF)',
    tagEn: 'Simulated: EDOF Intraocular Lens',
    focusAr: 'تواصل بصري انسيابي ممتاز للمسافات البعيدة والمتوسطة مع حد أدنى شبه معدوم من الهالات الليلية.',
    focusEn: 'Seamless visual continuum across distance and intermediate with minimal night halos.',
    distance: 99,
    intermediate: 94,
    near: 65,
    spectaclesAr: 'استقلالية ممتازة نهاراً، قد تلزم نظارة خفيفة لقراءة الخطوط الدقيقة جداً بالهاتف',
    spectaclesEn: 'Great daytime independence; light reading glasses for very small print',
    halosAr: 'أدنى درجات التوهج الليلي، خيار مثالي لمن يقودون سياراتهم كثيراً ليلاً',
    halosEn: 'Negligible halo profile, optimal for frequent nighttime drivers',
    insightTitleAr: 'رأي الاستشاري: مفهوم المدى الممتد (EDOF)',
    insightTitleEn: 'Clinical Insight: Continuous Depth of Focus Mechanism',
    insightTextAr: 'تعتمد عدسات EDOF على تمديد البؤرة الضوئية بدلاً من تجزئتها لنقاط منفصلة، مما يمنح المريض تبايناً بصرياً سلساً وثابتاً من الأفق البعيد وحتى شاشة الحاسوب ولوحة القيادة، مع الحفاظ على نقاء الرؤية الليلية وخلوها من الهالات.',
    insightTextEn: 'EDOF optics elongate the focal zone rather than creating isolated focal points, preserving pristine night driving contrast and continuous intermediate clarity.'
  },
  monofocal: {
    id: 'monofocal',
    nameAr: 'أحادية البؤرة القياسية (Monofocal)',
    nameEn: 'Standard Monofocal IOL',
    tagAr: 'المحاكاة: عدسة أحادية البؤرة (مضبوطة للمسافة البعيدة)',
    tagEn: 'Simulated: Monofocal (Set for Distance)',
    focusAr: 'صفاء نقي وتباين فائق للمسافة البعيدة فقط، مع ضرورة استخدام نظارة طبية للقراءة والكمبيوتر.',
    focusEn: 'Pristine distance contrast; dedicated glasses required for screens and reading.',
    distance: 100,
    intermediate: 50,
    near: 25,
    spectaclesAr: 'الحاجة لنظارة قراءة قريبة ونظارة كمبيوتر هي حاجة يومية دائمة',
    spectaclesEn: 'Reading and computer glasses are required on a daily basis',
    halosAr: 'منعدم تماماً، تباين عالي الجودة مطابق للعين الطبيعية الشابة',
    halosEn: 'Zero optical dysphotopsia; pristine optical purity',
    insightTitleAr: 'رأي الاستشاري: نقاء النقطة الواحدة',
    insightTitleEn: 'Clinical Insight: High-Contrast Monofocal Clarity',
    insightTextAr: 'تعد العدسة أحادية البؤرة الخيار الكلاسيكي المعتمد. يتم ضبط قوة العدسة لتمنح المريض رؤية بعيدة صافية تماماً (مثل القيادة)، بينما يعتمد المريض على نظارات القراءة للمسافات القريبة والمتوسطة.',
    insightTextEn: 'Monofocal IOLs remain the gold standard for pure optical contrast. They optimize distance vision while leaving intermediate and near tasks to reading glasses.'
  },
  cataract: {
    id: 'cataract',
    nameAr: 'الماء الأبيض غير المعالج (Cataract)',
    nameEn: 'Untreated Cataract Baseline',
    tagAr: 'المحاكاة: عتامة العدسة المتقدمة',
    tagEn: 'Simulated: Advanced Cataract Clouding',
    focusAr: 'تشوش متقدم، اصفرار الألوان، فقدان حدة التباين، وهالات ضوئية مزعجة تعيق القيادة والقراءة.',
    focusEn: 'Severe optical blur, contrast loss, faded color perception, and disabling glare.',
    distance: 35,
    intermediate: 30,
    near: 20,
    spectaclesAr: 'النظارات الطبية لا تستطيع تصحيح العتامة الداخلية لعدسة العين',
    spectaclesEn: 'Eyeglasses cannot correct internal crystalline lens opacification',
    halosAr: 'توهج وتشتت ضوئي حاد (Glare) وانبهار شديد بمصابيح السيارات المعاكسة',
    halosEn: 'Severe light scattering and disabling glare from oncoming headlights',
    insightTitleAr: 'رأي الاستشاري: أثر الساد على نوعية الحياة',
    insightTitleEn: 'Clinical Insight: Progressive Quality of Life Impact',
    insightTextAr: 'الماء الأبيض ليس غشاءً خارجياً على العين، بل هو تصلب وتعتّم تدريجي في البروتينات المكونة لعدسة العين الطبيعية داخل الحدقة، ويعد التدخل الجراحي بالفاكو وزراعة العدسة هو الحل الحاسم والنهائي.',
    insightTextEn: 'Cataract is the progressive clouding of the natural crystalline lens inside the pupil. Micro-incision phacoemulsification and IOL implantation is the definitive curative treatment.'
  }
};

// --- APP STATE ---
let currentLang = 'ar';
let themeMode = localStorage.getItem('theme') || 'system'; // 'system' | 'light' | 'dark'
let simMode = 'scenes'; // 'scenes' | 'anatomy' | 'defocus' | 'chart'
let simScene = 'night'; // 'night' | 'intermediate' | 'near'
let simLens = 'trifocal'; // 'trifocal' | 'edof' | 'monofocal' | 'cataract'
let simSliderPos = 50; // percentage
let simGlassesOn = false; // reading glasses toggle in chart mode
let defocusDiopter = -2.5; // diopters for defocus curve scrubber
let qStep = 0;
let qAnswers = [];
let qDone = false;
let activeArticle = null;

// Apply initial theme
function applyTheme(mode) {
  themeMode = mode;
  localStorage.setItem('theme', mode);

  if (mode === 'system') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', mode);
  }

  // Update button icon if present
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    btn.innerHTML = mode === 'system' ? '💻' : (isDark ? '🌙' : '☀️');
    btn.setAttribute('title', mode === 'system' ? 'الوضع التلقائي (حسب النظام)' : (mode === 'dark' ? 'الوضع الليلي' : 'الوضع النهاري'));
  }
}

// Watch system theme change
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (themeMode === 'system') {
    applyTheme('system');
  }
});

// Cycle theme button handler
window.cycleTheme = function() {
  if (themeMode === 'system') applyTheme('light');
  else if (themeMode === 'light') applyTheme('dark');
  else applyTheme('system');
};

function whatsappUrl(prefill) {
  const msg = encodeURIComponent(prefill || (currentLang === 'ar'
    ? 'مرحباً، أود الاستفسار عن حجز موعد استشارة مع د. معن عبدالله البري في مستشفى مغربي المدينة المنورة.'
    : 'Hello, I would like to inquire about booking a consultation with Dr. Maan Al Barry at Magrabi Madinah.'));
  return `https://wa.me/${DOCTOR.whatsapp}?text=${msg}`;
}

// --- RENDER APPLICATION ---
function render() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.body.className = currentLang === 'en' ? 'lang-en' : '';

  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    ${renderHeader()}
    <main>
      ${renderHero()}
      ${renderProfile()}
      ${renderSpecialties()}
      ${renderSimulator()}
      ${renderIOLGuide()}
      ${renderQuestionnaire()}
      ${renderEducation()}
      ${renderClinic()}
      ${renderFAQ()}
      ${renderCTA()}
    </main>
    ${renderFooter()}
    ${renderBookingBar()}
  `;

  applyTheme(themeMode);
  initScrollAnimations();
  initHeaderScroll();
}

// --- HEADER COMPONENT ---
function renderHeader() {
  const isDark = themeMode === 'dark' || (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const themeIcon = themeMode === 'system' ? '💻' : (isDark ? '🌙' : '☀️');

  return `
  <header class="site-header" id="site-header">
    <div class="container header-inner">
      <a href="#home" class="header-logo" onclick="scrollToSection('home');return false;">
        <div class="logo-icon">م</div>
        <div class="logo-text">
          <strong>${currentLang === 'ar' ? DOCTOR.shortNameAr : DOCTOR.shortNameEn}</strong>
          <small>${currentLang === 'ar' ? 'استشاري طب وجراحة العيون' : 'Consultant Ophthalmologist'}</small>
        </div>
      </a>

      <nav class="header-nav">
        <div class="nav-links">
          <a href="#home" onclick="scrollToSection('home');return false;">${currentLang === 'ar' ? 'الرئيسية' : 'Home'}</a>
          <a href="#profile" onclick="scrollToSection('profile');return false;">${currentLang === 'ar' ? 'عن الدكتور' : 'Biography'}</a>
          <a href="#specialties" onclick="scrollToSection('specialties');return false;">${currentLang === 'ar' ? 'التخصصات' : 'Specialties'}</a>
          <a href="#simulator" onclick="scrollToSection('simulator');return false;">${currentLang === 'ar' ? 'محاكي الرؤية' : 'Simulator'}</a>
          <a href="#cataracts" onclick="scrollToSection('cataracts');return false;">${currentLang === 'ar' ? 'دليل العدسات' : 'IOL Guide'}</a>
          <a href="#education" onclick="scrollToSection('education');return false;">${currentLang === 'ar' ? 'المكتبة الطبية' : 'Education'}</a>
          <a href="#clinic" onclick="scrollToSection('clinic');return false;">${currentLang === 'ar' ? 'العيادة والحجز' : 'Clinic'}</a>
        </div>

        <div class="header-actions">
          <!-- Adaptive Theme Switcher -->
          <button id="theme-toggle-btn" class="theme-switch-btn" onclick="cycleTheme()" aria-label="Toggle Theme">${themeIcon}</button>
          
          <!-- Bilingual Switcher -->
          <button class="lang-switch" onclick="toggleLang()" aria-label="Switch Language">${currentLang === 'ar' ? 'English' : 'عربي'}</button>
          
          <!-- Primary Booking CTA -->
          <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            ${currentLang === 'ar' ? 'احجز موعداً' : 'Book Appointment'}
          </a>
        </div>

        <button class="mobile-menu-btn" onclick="toggleMobileMenu()" aria-label="Open Navigation">☰</button>
      </nav>
    </div>

    <!-- Mobile Drawer -->
    <nav class="mobile-nav" id="mobile-nav">
      <a href="#home" onclick="scrollToSection('home');closeMobileMenu();return false;">${currentLang === 'ar' ? 'الرئيسية' : 'Home'}</a>
      <a href="#profile" onclick="scrollToSection('profile');closeMobileMenu();return false;">${currentLang === 'ar' ? 'عن الدكتور والمسيرة' : 'Biography'}</a>
      <a href="#specialties" onclick="scrollToSection('specialties');closeMobileMenu();return false;">${currentLang === 'ar' ? 'التخصصات والخدمات' : 'Specialties'}</a>
      <a href="#simulator" onclick="scrollToSection('simulator');closeMobileMenu();return false;">${currentLang === 'ar' ? 'محاكي الرؤية التفاعلي' : 'Vision Simulator'}</a>
      <a href="#cataracts" onclick="scrollToSection('cataracts');closeMobileMenu();return false;">${currentLang === 'ar' ? 'دليل العدسات (IOLs)' : 'IOL Guide'}</a>
      <a href="#questionnaire" onclick="scrollToSection('questionnaire');closeMobileMenu();return false;">${currentLang === 'ar' ? 'استبيان نمط الحياة البصري' : 'Questionnaire'}</a>
      <a href="#education" onclick="scrollToSection('education');closeMobileMenu();return false;">${currentLang === 'ar' ? 'المكتبة الطبية والتثقيف' : 'Medical Library'}</a>
      <a href="#clinic" onclick="scrollToSection('clinic');closeMobileMenu();return false;">${currentLang === 'ar' ? 'العيادة والحجز والموقع' : 'Clinic & Booking'}</a>
      <a href="${DOCTOR.mapsUrl}" target="_blank" rel="noopener noreferrer">📍 ${currentLang === 'ar' ? 'موقع المستشفى (خرائط جوجل)' : 'Hospital Google Maps'}</a>
    </nav>
  </header>`;
}

// --- HERO SECTION ---
function renderHero() {
  return `
  <section class="hero" id="home">
    <div class="container">
      <div class="hero-grid">
        <div class="hero-content fade-in">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            ${currentLang === 'ar' ? 'استشاري معتمد | خبرة سريرية وأكاديمية متقدمة | المدينة المنورة' : 'Consultant Ophthalmologist | Madinah, Saudi Arabia'}
          </div>

          <h1>
            ${currentLang === 'ar'
              ? 'رعاية متخصصة لصحة العين<br><span class="gold-text">ورؤية أوضح وأكثر دقة</span>'
              : 'Specialized Eye Care &amp;<br><span class="gold-text">Precision Cataract Surgery</span>'}
          </h1>

          <p class="hero-subtitle">
            ${currentLang === 'ar'
              ? 'استشاري طب وجراحة العيون، جراحة الساد (الماء الأبيض)، وزراعة العدسات الذكية، وتصحيح العيوب الانكسارية بالمدينة المنورة. خبرة أكاديمية وسريرية موثقة ترتكز على أحدث التقنيات وأعلى معايير الأمان الجراحي.'
              : 'Senior consultant specializing in micro-incision cataract surgery, premium IOL implantation, laser refractive correction, and corneal preservation at Magrabi Health Madinah.'}
          </p>

          <div class="hero-cta">
            <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-lg">
              ${currentLang === 'ar' ? 'احجز موعد كشف أو استشارة' : 'Book Clinic Appointment'}
            </a>
            <a href="#simulator" onclick="scrollToSection('simulator');return false;" class="btn btn-outline btn-lg">
              ${currentLang === 'ar' ? 'جرب محاكي الرؤية التفاعلي' : 'Try Vision Simulator'}
            </a>
            <a href="${DOCTOR.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm" style="color:var(--text-secondary);display:inline-flex;align-items:center;gap:4px;">
              📍 <span>${currentLang === 'ar' ? 'مستشفيات مغربي – المدينة المنورة' : 'Magrabi Hospital – Madinah'}</span>
            </a>
          </div>

          <div class="hero-credentials">
            <div class="credential-item">
              <span class="icon">🏥</span>
              <span>${currentLang === 'ar' ? 'المدير الطبي لمغربي المدينة' : 'CMO Magrabi Madinah'}</span>
            </div>
            <div class="credential-item">
              <span class="icon">🎓</span>
              <span>${currentLang === 'ar' ? 'رئيس قسم العيون بجامعة طيبة' : 'Chair of Ophthalmology, Taibah Univ.'}</span>
            </div>
            <div class="credential-item">
              <span class="icon">🇬🇧</span>
              <span>${currentLang === 'ar' ? 'زميل كلية الجراحين الملكية (FRCS)' : 'Fellow of Royal College of Surgeons (FRCS)'}</span>
            </div>
            <div class="credential-item">
              <span class="icon">🇸🇦</span>
              <span>${currentLang === 'ar' ? 'ممثل الجمعية السعودية لطب العيون' : 'SOS Madinah Representative'}</span>
            </div>
          </div>
        </div>

        <div class="hero-image fade-in">
          <img src="/images/dr-maan-portrait.png" alt="${currentLang === 'ar' ? DOCTOR.nameAr : DOCTOR.nameEn}" class="doctor-photo" loading="eager" onerror="this.src='/images/doctor-portrait.jpg'">
          <div class="image-accent">
            <div class="accent-title">${currentLang === 'ar' ? 'العيادة التخصصية' : 'Clinical Practice'}</div>
            <div class="accent-value">${currentLang === 'ar' ? 'مغربي — طريق المطار' : 'Magrabi — Airport Road'}</div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

// --- PHYSICIAN PROFILE SECTION ---
function renderProfile() {
  const roles = DOCTOR.roles[currentLang];

  return `
  <section class="section section-alt" id="profile">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${currentLang === 'ar' ? 'السيرة المهنية والأكاديمية' : 'Professional Profile'}</div>
        <h2>${currentLang === 'ar' ? DOCTOR.nameAr : DOCTOR.nameEn}</h2>
        <p style="font-weight:600;color:var(--secondary-burgundy);">${currentLang === 'ar' ? DOCTOR.titleAr : DOCTOR.titleEn}</p>
      </div>

      <div class="profile-grid fade-in">
        <div class="profile-media">
          <img src="/images/doctor-portrait.jpg" alt="${DOCTOR.nameAr}" class="profile-media-img" loading="lazy">
          <div class="credentials-chips">
            <span class="chip chip-gold">🎖️ ${currentLang === 'ar' ? 'زميل كلية الجراحين الملكية – بريطانيا (FRCS)' : 'Fellow of Royal College of Surgeons (FRCS UK)'}</span>
            <span class="chip">🏛️ ${currentLang === 'ar' ? 'رئيس قسم طب وجراحة العيون – جامعة طيبة' : 'Chair of Ophthalmology – Taibah University'}</span>
            <span class="chip">🏥 ${currentLang === 'ar' ? 'المدير الطبي التنفيذي – مغربي المدينة' : 'Executive Medical Director – Magrabi Madinah'}</span>
            <span class="chip">🇸🇦 ${currentLang === 'ar' ? 'ممثل الجمعية السعودية لطب وجراحة العيون' : 'Saudi Ophthalmology Society Rep.'}</span>
          </div>
        </div>

        <div class="profile-text">
          <p style="font-size:1.05rem;line-height:1.9;color:var(--text-primary);margin-bottom:var(--space-4);">
            ${currentLang === 'ar'
              ? 'د. معن بن عبدالله البري استشاري طب وجراحة العيون في مستشفيات ومراكز مغربي للعيون والأذن بالمدينة المنورة. يعمل ضمن وحدة جراحة الماء الأبيض ووحدة جراحة القرنية وتصحيح النظر، ويساعد المرضى في تقييم الحالات التي تتطلب دقة متناهية في فحص عدسة العين، تشخيص القرنية المخروطية، وتحديد خيارات تصحيح الإبصار بالليزر أو زراعة العدسات.'
              : 'Dr. Maan Al Barry is a Consultant Ophthalmologist and Anterior Segment Surgeon practicing at Magrabi Health Eye & ENT Hospital in Madinah. He provides specialized clinical care in cataract micro-surgery, corneal disease management, and customized laser refractive procedures.'}
          </p>

          <p style="font-size:1.05rem;line-height:1.9;color:var(--text-secondary);margin-bottom:var(--space-6);">
            ${currentLang === 'ar'
              ? 'تتكامل ممارسته السريرية مع أدوار قيادية وأكاديمية بارزة؛ حيث يشغل منصب المدير الطبي التنفيذي لمغربي المدينة المنورة، ورئيس قسم طب وجراحة العيون في جامعة طيبة، وممثل الجمعية السعودية لطب وجراحة العيون في منطقة المدينة المنورة، وعضو المجلس العلمي لمؤتمر البحر الأحمر لطب العيون.'
              : 'His clinical mastery is backed by distinguished academic appointments as Chairman of the Ophthalmology Department at Taibah University, Chief Medical Officer at Magrabi Madinah, and active member of the American Academy of Ophthalmology.'}
          </p>

          <h3 style="margin-bottom:var(--space-4);font-size:1.15rem;color:var(--secondary-burgundy);">
            ${currentLang === 'ar' ? 'المسيرة القيادية والمهنية' : 'Leadership & Scientific Appointments'}
          </h3>
          <div class="timeline">
            ${roles.map(r => `
              <div class="timeline-item">
                <h4>${r}</h4>
                <p>${currentLang === 'ar' ? 'عضوية قيادية وأكاديمية رسمية مثبتة في السجلات الطبية' : 'Official medical appointment and peer-recognized leadership'}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Conference & Scientific Leadership Gallery -->
      <div style="margin-top:var(--space-16);" class="fade-in">
        <div class="section-header" style="margin-bottom:var(--space-6);">
          <div class="section-label">${currentLang === 'ar' ? 'المشاركات العلمية والمؤتمرات الدولية' : 'Scientific Conferences & Leadership'}</div>
          <h3 style="font-size:1.35rem;">${currentLang === 'ar' ? 'التمثيل العلمي لطب العيون' : 'Ophthalmic Academic Representation'}</h3>
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
              <strong>${currentLang === 'ar' ? 'المجلس العلمي والجلسات الأكاديمية الدولية' : 'International Scientific Faculty & Clinical Sessions'}</strong>
              <p>${currentLang === 'ar' ? 'مع نخبة من قيادات وجراحي العيون الدوليين' : 'With international ophthalmic leaders and surgical faculty'}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Verified Patient Reviews -->
      <div style="margin-top:var(--space-16);" class="fade-in">
        <div class="section-header" style="margin-bottom:var(--space-6);">
          <div class="section-label">${currentLang === 'ar' ? 'آراء وتجارب المرضى' : 'Patient Testimonials'}</div>
          <h3 style="font-size:1.35rem;">${currentLang === 'ar' ? 'تجارب المراجعين في مغربي المدينة المنورة' : 'Reviews from Magrabi Health Madinah'}</h3>
        </div>
        <div class="reviews-grid">
          <div class="review-card">
            <div>
              <div class="review-stars">★★★★★</div>
              <p class="review-text">"${currentLang === 'ar' ? 'كانت تجربة ممتازة بكل المقاييس. استغرق موعدي قرابة ساعة، أجريت خلالها الفحوصات الدقيقة ثم قابلت الدكتور معن البري، الذي شرح لي تفاصيل الإجراء وأي مضاعفات محتملة بكل أمانة ووضوح ومهنية عالية.' : 'An outstanding experience by all measures. I completed thorough diagnostics before meeting Dr. Maan Al Barry, who explained the procedure and potential nuances with utmost clarity and professional integrity.'}"</p>
            </div>
            <div class="review-author">
              <div class="review-avatar">ر</div>
              <div class="review-meta">
                <strong>${currentLang === 'ar' ? 'راكان العبري' : 'Rakan Al-Abri'}</strong>
                <span>${currentLang === 'ar' ? 'مريض تم علاجه بمغربي المدينة المنورة' : 'Patient at Magrabi Madinah'}</span>
              </div>
            </div>
          </div>

          <div class="review-card">
            <div>
              <div class="review-stars">★★★★★</div>
              <p class="review-text">"${currentLang === 'ar' ? 'أود أن أشكر فريق د. معن البري على حسن الاستقبال والتعامل الراقي والمعاملة المريحة، والاهتمام الفائق بتنظيم المواعيد والإجابة عن كافة التساؤلات بابتسامة وترحاب.' : 'I would like to extend heartfelt thanks to Dr. Maan Al Barry and his clinical team for their wonderful hospitality, comfortable care, and seamless appointment coordination.'}"</p>
            </div>
            <div class="review-author">
              <div class="review-avatar">م</div>
              <div class="review-meta">
                <strong>${currentLang === 'ar' ? 'مايا أحمد' : 'Maya Ahmed'}</strong>
                <span>${currentLang === 'ar' ? 'مراجعة عيادة العيون والقرنية' : 'Cornea & Vision Correction Patient'}</span>
              </div>
            </div>
          </div>

          <div class="review-card">
            <div>
              <div class="review-stars">★★★★★</div>
              <p class="review-text">"${currentLang === 'ar' ? 'أعرب عن خالص امتناني للدكتور معن البري على مهنيته الاستثنائية، وخبرته الواسعة، وتوجيهه اللطيف والمهدئ طوال مراحل العملية، والاهتمام الدقيق بالمتابعة بعد الإجراء.' : 'My deepest gratitude to Dr. Maan for his exceptional surgical precision, vast expertise, and gentle guidance throughout the entire procedure and post-op follow-up.'}"</p>
            </div>
            <div class="review-author">
              <div class="review-avatar">ب</div>
              <div class="review-meta">
                <strong>${currentLang === 'ar' ? 'بشرى الشراحيلي' : 'Bushra Al-Sharahili'}</strong>
                <span>${currentLang === 'ar' ? 'مريضة جراحة عيون' : 'Ophthalmic Surgery Patient'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

// --- SPECIALTIES & PRECISION UNITS ---
function renderSpecialties() {
  const units = [
    {
      code: 'SURG-01',
      titleAr: 'جراحة الماء الأبيض (الساد) وزراعة العدسات الذكية',
      titleEn: 'Cataract Surgery & Premium IOL Implantation',
      descAr: 'استبدال العدسة المعتمة بالموجات فوق الصوتية (الفاكو) وزراعة أحدث العدسات الذكية: أحادية البؤرة، ممتدة المدى البصري (EDOF)، والعدسات ثلاثية البؤرة لاستعادة صفاء الرؤية.',
      descEn: 'Micro-incision phacoemulsification for lens replacement with advanced monofocal, EDOF, and trifocal intraocular lenses.',
      img: '/images/surgery-phaco.jpg',
      tagsAr: ['إزالة الساد بالفاكو', 'تصحيح الاستجماتيزم', 'العدسات التوريكية', 'عدسات ثلاثية EDOF'],
      tagsEn: ['Phacoemulsification', 'Astigmatism Correction', 'Toric IOLs', 'Trifocal / EDOF Optics']
    },
    {
      code: 'SURG-02',
      titleAr: 'جراحة وأمراض القرنية والقرنية المخروطية المتقدمة',
      titleEn: 'Cornea Care & Advanced Keratoconus Treatment',
      descAr: 'التشخيص المبكر والدقيق للقرنية المخروطية وتثبيت القرنية بالأشعة فوق البنفسجية والريبوفلافين (Corneal Cross-Linking - CXL)، مع خطط متابعة مستمرة لحفظ النظر.',
      descEn: 'Early keratoconus detection, corneal collagen cross-linking (CXL) to arrest progression, and specialized anterior segment management.',
      img: '/images/cornea-cxl.jpg',
      tagsAr: ['تثبيت القرنية CXL', 'سماكة القرنية الطبقية', 'علاج سحابات القرنية', 'جفاف العين المزمن'],
      tagsEn: ['Corneal Cross-Linking (CXL)', 'Pachymetry Tomography', 'Corneal Opacities', 'Ocular Surface Disease']
    },
    {
      code: 'SURG-03',
      titleAr: 'عمليات تصحيح النظر بالليزر والفيمتو ليزك',
      titleEn: 'Laser Refractive Surgery (Femto-LASIK & PRK)',
      descAr: 'معاينة وفحص دقيق لقصر وطول النظر والاستجماتيزم باستخدام تقنيات الفيمتوليزك، والليزر السطحي (PRK)، وبصمة العين المخصصة (Custom Wavefront) لتحقيق أقصى حدة بصرية.',
      descEn: 'Comprehensive suitability evaluation for Femto-LASIK and surface ablation (PRK) driven by customized wavefront topography.',
      img: '/images/clinic-exam-room.jpg',
      tagsAr: ['فحص سماكة القرنية', 'الليزر السطحي PRK', 'الفيمتو ليزك', 'بصمة العين Wavefront'],
      tagsEn: ['Pachymetry Check', 'Surface PRK', 'Femto-LASIK', 'Wavefront Custom']
    },
    {
      code: 'DIAG-04',
      titleAr: 'الفحوصات التشخيصية المتقدمة وقياسات ما قبل الجراحة',
      titleEn: 'Advanced Diagnostics & Optical Biometry',
      descAr: 'التصوير المقطعي للقرنية (Pentacam)، فحص خلايا البطانة القرنية (Specular Microscopy)، وقياس قوة العدسة الدقيق ضوئياً (Optical Biometry) بأحدث أجهزة التصوير ثلاثية الأبعاد.',
      descEn: 'High-precision Scheimpflug corneal tomography (Pentacam), specular endothelial microscopy, and optical biometry for exact surgical planning.',
      img: '/images/diagnostics-pentacam.jpg',
      tagsAr: ['طبوغرافيا البنتاكام', 'قياس ضغط العين', 'مسح العصب البصري', 'حساب العدسات بالبيومتري'],
      tagsEn: ['Pentacam Tomography', 'Intraocular Pressure', 'OCT Macula & Nerve', 'Optical Biometry IOL Master']
    }
  ];

  return `
  <section class="section" id="specialties">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${currentLang === 'ar' ? 'التخصصات الطبية والخدمات الجراحية الدقيقة' : 'Precision Clinical Specialties'}</div>
        <h2>${currentLang === 'ar' ? 'حلول جراحية وعلاجية بأحدث ما توصل إليه علم العيون' : 'Advanced Ophthalmic Medical & Surgical Solutions'}</h2>
        <p>${currentLang === 'ar' ? 'إجراءات جراحية وتشخيصية متقدمة تُجرى وفق بروتوكولات عالمية معتمدة لضمان أمان ودقة النتائج.' : 'State-of-the-art diagnostics and surgeries performed according to international clinical quality benchmarks.'}</p>
      </div>

      <div class="specialties-grid fade-in">
        ${units.map(u => `
          <div class="specialty-unit-card">
            <div class="specialty-img-wrap">
              <img src="${u.img}" alt="${currentLang === 'ar' ? u.titleAr : u.titleEn}" loading="lazy">
            </div>
            <div class="specialty-body">
              <div class="specialty-tag">${u.code}</div>
              <h3>${currentLang === 'ar' ? u.titleAr : u.titleEn}</h3>
              <p>${currentLang === 'ar' ? u.descAr : u.descEn}</p>
              <div class="specialty-features">
                ${(currentLang === 'ar' ? u.tagsAr : u.tagsEn).map(t => `<span class="specialty-pill">${t}</span>`).join('')}
              </div>
              <div style="margin-top:auto;padding-top:var(--space-3);">
                <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
                  ${currentLang === 'ar' ? 'طلب تقرير تشخيصي أو حجز موعد ←' : 'Book Specialty Evaluation →'}
                </a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

// --- VISION SIMULATOR (CLINICAL OPHTHALMOLOGY CONSOLE) ---
function renderSimulator() {
  const currentScene = SCENES[simScene] || SCENES.night;
  const currentLens = LENSES[simLens] || LENSES.trifocal;

  return `
  <section class="simulator-section" id="simulator">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${currentLang === 'ar' ? 'أداة بصرية استرشادية سريرية معتمدة' : 'Accredited Clinical Ophthalmology Tool'}</div>
        <h2>${currentLang === 'ar' ? 'محاكي البصريات السريري: عِش التجربة وقارن بين مسارات الضوء والعدسات' : 'Clinical Ophthalmology Simulator & Ray-Tracing Console'}</h2>
        <p>${currentLang === 'ar' ? 'منصة تثقيفية متقدمة مطورة بإشراف د. معن البري لتوضيح مسار الأشعة داخل العين، ومقارنة منحنيات اللابؤرية السريرية (Defocus Curves)، وفحص حدة النظر واختبارات القراءة، والنتائج الواقعية للعدسات الذكية.' : 'Advanced clinical platform illustrating intraocular ray tracing, international defocus curves, Snellen visual acuity, and real-world optical dysphotopsia.'}</p>
      </div>

      <div class="sim-chassis fade-in">
        <!-- Master Mode Switcher Bar -->
        <div class="sim-mode-bar">
          <div class="sim-mode-tabs">
            <button class="sim-mode-tab ${simMode === 'scenes' ? 'active' : ''}" onclick="setSimMode('scenes')">
              <span>🚗</span>
              <span>${currentLang === 'ar' ? 'الأنشطة الحياتية الواقعية' : 'Real-World Tasks'}</span>
            </button>
            <button class="sim-mode-tab ${simMode === 'anatomy' ? 'active' : ''}" onclick="setSimMode('anatomy')">
              <span>🔬</span>
              <span>${currentLang === 'ar' ? 'المسار التشريحي للأشعة (Ray Tracing)' : 'Anatomical Ray Tracing'}</span>
            </button>
            <button class="sim-mode-tab ${simMode === 'defocus' ? 'active' : ''}" onclick="setSimMode('defocus')">
              <span>📈</span>
              <span>${currentLang === 'ar' ? 'منحنى اللابؤرية السريري (Defocus Curve)' : 'Clinical Defocus Curve'}</span>
            </button>
            <button class="sim-mode-tab ${simMode === 'chart' ? 'active' : ''}" onclick="setSimMode('chart')">
              <span>👁️</span>
              <span>${currentLang === 'ar' ? 'لوحة فحص النظر (Snellen & Jaeger)' : 'Snellen & Jaeger Acuity Card'}</span>
            </button>
          </div>

          <div style="font-size:0.75rem;color:var(--gold-light);font-weight:600;">
            ${simMode === 'scenes' ? (currentLang === 'ar' ? 'محاكاة الأنشطة اليومية' : 'Daily Life Simulation') : ''}
            ${simMode === 'anatomy' ? (currentLang === 'ar' ? 'فيزياء انكسار الضوء في العين' : 'Ocular Refractive Physics') : ''}
            ${simMode === 'defocus' ? (currentLang === 'ar' ? 'معايير الجمعية الأوروبية ESCRS' : 'ESCRS Clinical Benchmark') : ''}
            ${simMode === 'chart' ? (currentLang === 'ar' ? 'اختبار قياس النظر السريري' : 'Standard Clinical Acuity') : ''}
          </div>
        </div>

        <!-- Sub-toolbar if in Scenes mode -->
        ${simMode === 'scenes' ? `
        <div class="sim-sub-bar">
          <div class="sim-scene-tabs">
            <button class="sim-scene-tab ${simScene === 'night' ? 'active' : ''}" onclick="setSimScene('night')">
              <span>🚗</span>
              <span>${currentLang === 'ar' ? 'القيادة الليلية (المدينة المنورة)' : 'Night Driving (Madinah)'}</span>
            </button>
            <button class="sim-scene-tab ${simScene === 'phone' ? 'active' : ''}" onclick="setSimScene('phone')">
              <span>📱</span>
              <span>${currentLang === 'ar' ? 'لوحة السيارة والشاشات (60 سم)' : 'Dashboard & Screens (60 cm)'}</span>
            </button>
            <button class="sim-scene-tab ${simScene === 'quran' ? 'active' : ''}" onclick="setSimScene('quran')">
              <span>📖</span>
              <span>${currentLang === 'ar' ? 'روشتة الدواء والمصحف (40 سم)' : 'Prescription & Reading (40 cm)'}</span>
            </button>
          </div>

          <div style="display:flex;align-items:center;gap:var(--space-2);">
            <button onclick="resetSimSlider()" class="btn btn-sm" style="background:#162236;color:#E2E8F0;border:1px solid #243550;font-size:0.75rem;">
              ${currentLang === 'ar' ? 'إعادة ضبط المنصف' : 'Center Slider'}
            </button>
          </div>
        </div>` : ''}

        <!-- Interactive Viewport Canvas Area -->
        <div class="sim-viewport-frame" id="sim-viewport">
          ${renderActiveSimViewport(simMode, simScene, simLens, simSliderPos, simGlassesOn, defocusDiopter)}
        </div>

        <!-- Lens Selection Pills Bar (Active in ALL modes) -->
        <div class="sim-lens-bar">
          <span class="sim-lens-label">${currentLang === 'ar' ? 'العدسة المقارنة:' : 'Selected Lens Optic:'}</span>
          ${Object.values(LENSES).map(l => `
            <button class="sim-lens-pill ${simLens === l.id ? 'active' : ''}" onclick="setSimLens('${l.id}')">
              ${currentLang === 'ar' ? l.nameAr : l.nameEn}
            </button>
          `).join('')}
        </div>

        <!-- Clinical Insights & Quantitative Metrics Grid -->
        <div class="sim-insights-grid">
          <!-- Column 1: Doctor's Clinical Neuroadaptation Explanation -->
          <div class="sim-insight-card">
            <div class="sim-insight-header">
              <span>👨‍⚕️</span>
              <span>${currentLang === 'ar' ? currentLens.insightTitleAr : currentLens.insightTitleEn}</span>
            </div>
            <p class="sim-clinical-text">
              ${currentLang === 'ar' ? currentLens.insightTextAr : currentLens.insightTextEn}
            </p>
            <div style="margin-top:var(--space-4);padding-top:var(--space-3);border-top:1px solid #1E2D44;display:flex;align-items:center;justify-content:space-between;font-size:0.75rem;color:#94A3B8;">
              <span>د. معن عبدالله البري — استشاري طب وجراحة العيون</span>
              <span style="color:var(--gold);">المدينة المنورة</span>
            </div>
          </div>

          <!-- Column 2: Objective Visual Indicators and Acuity Meters -->
          <div class="sim-insight-card">
            <div class="sim-insight-header">
              <span>📊</span>
              <span>${currentLang === 'ar' ? 'مؤشرات الأداء البصري للعدسة المختارة' : 'Optical Acuity & Independence Benchmark'}</span>
            </div>

            <!-- Distance Acuity -->
            <div class="sim-metric-row">
              <div class="sim-metric-label">
                <span>${currentLang === 'ar' ? 'الرؤية البعيدة (القيادة ولوحات الطرق)' : 'Distance Vision (Driving & Roads)'}</span>
                <strong style="color:var(--gold-light);">${currentLens.distance}%</strong>
              </div>
              <div class="sim-meter-track">
                <div class="sim-meter-fill" style="width: ${currentLens.distance}%;"></div>
              </div>
            </div>

            <!-- Intermediate Acuity -->
            <div class="sim-metric-row">
              <div class="sim-metric-label">
                <span>${currentLang === 'ar' ? 'الرؤية المتوسطة (شاشات الكمبيوتر ولوحة السيارة)' : 'Intermediate Vision (Laptops & Dashboards)'}</span>
                <strong style="color:var(--gold-light);">${currentLens.intermediate}%</strong>
              </div>
              <div class="sim-meter-track">
                <div class="sim-meter-fill" style="width: ${currentLens.intermediate}%;"></div>
              </div>
            </div>

            <!-- Near Acuity -->
            <div class="sim-metric-row">
              <div class="sim-metric-label">
                <span>${currentLang === 'ar' ? 'الرؤية القريبة (قراءة الهاتف والمصحف)' : 'Near Vision (Smartphone & Books)'}</span>
                <strong style="color:var(--gold-light);">${currentLens.near}%</strong>
              </div>
              <div class="sim-meter-track">
                <div class="sim-meter-fill" style="width: ${currentLens.near}%;"></div>
              </div>
            </div>

            <!-- Dysphotopsia & Spectacles Notes -->
            <div style="margin-top:var(--space-3);padding-top:var(--space-3);border-top:1px solid #1E2D44;font-size:0.78rem;color:#CBD5E1;line-height:1.7;">
              <div><strong>🕶️ ${currentLang === 'ar' ? 'الاستقلالية عن النظارة:' : 'Spectacle Independence:'}</strong> ${currentLang === 'ar' ? currentLens.spectaclesAr : currentLens.spectaclesEn}</div>
              <div style="margin-top:4px;"><strong>✨ ${currentLang === 'ar' ? 'الهالات والوهج الليلي:' : 'Night Halos / Glare:'}</strong> ${currentLang === 'ar' ? currentLens.halosAr : currentLens.halosEn}</div>
            </div>
          </div>
        </div>

        <!-- Statutory Medical Disclaimer -->
        <div class="sim-disclaimer-box">
          <strong>⚠️ ${currentLang === 'ar' ? 'تنويه طبي وإخلاء مسؤولية سريرية:' : 'Clinical Disclaimer:'}</strong>
          ${currentLang === 'ar'
            ? 'هذا المحاكي مخصص للأغراض التثقيفية والاسترشادية السريرية فقط، ولا يُعد بأي حال من الأحوال وسيلة تشخيصية أو تنبؤاً قطعياً بالنتيجة الجراحية الفردية. تعتمد النتيجة الفعلية لكل مريض على قياسات دقيقة تشمل فحص تضاريس القرنية بالبنتاكام (Pentacam)، وحساب مقاسات العدسة بأجهزة البيومتري الضوئي (IOL Master)، وسلامة اللطخة الصفراء والشبكية (OCT Macula).'
            : 'This simulator illustrates established optical principles and clinical consensus. Actual surgical outcomes depend on individual corneal tomography, optical biometry, macular integrity, and patient neuroadaptation.'}
        </div>
      </div>
    </div>
  </section>`;
}

// Router for Viewport Content based on selected Mode
function renderActiveSimViewport(mode, sceneId, lensId, sliderPos, glassesOn, diopter) {
  if (mode === 'anatomy') {
    return renderAnatomyRayTracing(lensId);
  }
  if (mode === 'defocus') {
    return renderDefocusCurve(lensId, diopter);
  }
  if (mode === 'chart') {
    return renderClinicalChart(lensId, glassesOn);
  }

  // Default: Real-World Scenes with Interactive Split Slider
  const currentScene = SCENES[sceneId] || SCENES.night;
  const currentLens = LENSES[lensId] || LENSES.trifocal;

  return `
    <!-- Layer 1: Baseline View (Underneath / Cataract condition) -->
    <div class="sim-layer-base">
      ${renderSimSceneContent(sceneId, 'cataract')}
    </div>

    <!-- Layer 2: Simulated Lens View (Clipped by slider handle) -->
    <div class="sim-layer-active-wrap" id="sim-active-wrap" style="width: ${sliderPos}%;">
      <div style="position:absolute;inset:0;width:100%;height:100%;">
        ${renderSimSceneContent(sceneId, lensId)}
      </div>
    </div>

    <!-- Slider Range Input for smooth mouse / touch interaction -->
    <input type="range" min="0" max="100" value="${sliderPos}" class="sim-slider-input" oninput="updateSimSlider(this.value)" aria-label="Compare baseline vs simulated lens">

    <!-- Draggable Divider Line & Badge -->
    <div class="sim-slider-line" id="sim-divider-line" style="left: ${sliderPos}%;">
      <div class="sim-slider-handle">⟺</div>
    </div>

    <!-- Status Tags inside Viewport -->
    <div class="sim-tag-pill sim-tag-base">
      ${currentLang === 'ar' ? currentScene.baseTagAr : currentScene.baseTagEn}
    </div>
    <div class="sim-tag-pill sim-tag-simulated">
      ${currentLang === 'ar' ? currentLens.tagAr : currentLens.tagEn}
    </div>

    <!-- Location Indicator -->
    <div class="sim-location-pill">
      📍 ${currentLang === 'ar' ? currentScene.locationAr : currentScene.locationEn}
    </div>
  `;
}

// --- MODE 2: ANATOMICAL OPTICAL RAY TRACING (SVG) ---
function renderAnatomyRayTracing(lensId) {
  const isCataract = lensId === 'cataract';
  const isMonofocal = lensId === 'monofocal';
  const isEdof = lensId === 'edof';
  const isTrifocal = lensId === 'trifocal';

  return `
  <div class="anatomy-viewport">
    <div style="text-align:center;margin-bottom:var(--space-2);z-index:2;">
      <h4 style="font-size:0.95rem;color:var(--gold-light);font-weight:700;">
        ${currentLang === 'ar' ? 'المسار البصري للأشعة الضوئية داخل مقطع العين الأفقي' : 'Horizontal Eye Cross-Section & Intraocular Optical Ray Tracing'}
      </h4>
      <p style="font-size:0.75rem;color:#94A3B8;">
        ${isCataract ? (currentLang === 'ar' ? 'تشتت الضوء (Light Scattering) داخل العدسة المعتمة وفقدان تركيز الصورة على اللطخة الصفراء' : 'Severe light scattering inside opaque cataract lens with loss of macular focal point') : ''}
        ${isMonofocal ? (currentLang === 'ar' ? 'تركيز فائق الحدة في نقطة بؤرية واحدة على اللطخة الصفراء (أشعة القراءة القريبة تسقط خلف الشبكية)' : 'Pristine single focal convergence on the fovea; near rays focus behind the retina (Presbyopia)') : ''}
        ${isEdof ? (currentLang === 'ar' ? 'تمديد المدى البؤري في قناة ضوئية متصلة توفر رؤية سلسة من البعيد إلى المتوسط' : 'Elongated optical focal cylinder providing continuous depth of focus from distance to intermediate') : ''}
        ${isTrifocal ? (currentLang === 'ar' ? 'تقسيم الضوء عبر درجات حيود دقيقة لتكوين 3 بؤر مركزة على الشبكية (بعيد 6م، متوسط 66سم، قريب 35سم)' : 'Diffractive micro-step light division forming 3 sharp focal peaks: Distance, Intermediate & Near') : ''}
      </p>
    </div>

    <svg class="anatomy-svg" viewBox="0 0 740 380" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Gradients -->
        <radialGradient id="cataractHaze" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.95"/>
          <stop offset="70%" stop-color="#D97706" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#78350F" stop-opacity="0.6"/>
        </radialGradient>
        <radialGradient id="iolClear" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#0284C7" stop-opacity="0.2"/>
        </radialGradient>
        <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- Eye Anatomy Outer Wall: Sclera & Cornea -->
      <!-- Sclera (White/Cream Outer Envelope) -->
      <path d="M 230 70 C 440 70, 580 120, 580 190 C 580 260, 440 310, 230 310" stroke="#334155" stroke-width="8" fill="#0C1424" stroke-linecap="round"/>
      <!-- Choroid / Pigment Layer -->
      <path d="M 240 78 C 430 78, 570 125, 570 190 C 570 255, 430 302, 240 302" stroke="#641B2D" stroke-width="3" fill="none"/>
      <!-- Retina Layer (Gold/Amber) -->
      <path d="M 250 86 C 420 86, 560 130, 560 190 C 560 250, 420 294, 250 294" stroke="#C5A46D" stroke-width="3" fill="none"/>

      <!-- Macula Fovea Centralis (Golden Target on posterior pole) -->
      <circle cx="560" cy="190" r="7" fill="#F59E0B" stroke="#C5A46D" stroke-width="2"/>
      <text x="580" y="194" fill="#F59E0B" font-size="11" font-weight="700">${currentLang === 'ar' ? 'اللطخة الصفراء (Fovea)' : 'Fovea Centralis'}</text>

      <!-- Optic Nerve Exit -->
      <path d="M 545 235 L 610 250 L 610 270 L 535 250 Z" fill="#1E293B" stroke="#475569" stroke-width="1.5"/>
      <text x="618" y="265" fill="#94A3B8" font-size="10">${currentLang === 'ar' ? 'العصب البصري' : 'Optic Nerve'}</text>

      <!-- Cornea (Clear anterior curved dome) -->
      <path d="M 230 70 C 140 100, 140 280, 230 310" stroke="#38BDF8" stroke-width="5" fill="rgba(56, 189, 248, 0.08)"/>
      <text x="135" y="80" fill="#38BDF8" font-size="11" font-weight="700">${currentLang === 'ar' ? 'القرنية (Cornea)' : 'Cornea'}</text>

      <!-- Iris & Pupil (Aperture) -->
      <path d="M 230 70 L 255 145" stroke="#64748B" stroke-width="6" stroke-linecap="round"/>
      <path d="M 230 310 L 255 235" stroke="#64748B" stroke-width="6" stroke-linecap="round"/>
      <text x="260" y="130" fill="#94A3B8" font-size="10">${currentLang === 'ar' ? 'القزحية والحدقة' : 'Iris & Pupil'}</text>

      <!-- Crystalline Lens Capsule / Implant Location -->
      <g transform="translate(265, 140)">
        ${isCataract ? `
          <!-- Cataract Opaque Cloudy Lens -->
          <ellipse cx="20" cy="50" rx="20" ry="46" fill="url(#cataractHaze)" stroke="#D97706" stroke-width="2"/>
          <!-- Inner protein opacities -->
          <circle cx="16" cy="45" r="9" fill="#B45309" opacity="0.7"/>
          <circle cx="24" cy="58" r="7" fill="#78350F" opacity="0.6"/>
          <circle cx="12" cy="62" r="5" fill="#92400E" opacity="0.8"/>
          <text x="50" y="55" fill="#F59E0B" font-size="11" font-weight="700">${currentLang === 'ar' ? 'الساد (عدسة معتمة)' : 'Cataract Lens'}</text>
        ` : `
          <!-- Clear IOL with Flexible Haptics in Capsular Bag -->
          <!-- Haptics -->
          <path d="M 20 4 C 35 -15, 60 -10, 65 0" stroke="#38BDF8" stroke-width="2" fill="none"/>
          <path d="M 20 96 C 35 115, 60 110, 65 100" stroke="#38BDF8" stroke-width="2" fill="none"/>
          <!-- Optic Body -->
          <ellipse cx="20" cy="50" rx="14" ry="44" fill="url(#iolClear)" stroke="#38BDF8" stroke-width="2.5"/>
          ${isTrifocal ? `
            <!-- Concentric Diffractive Steps for Trifocal -->
            <ellipse cx="20" cy="50" rx="9" ry="30" stroke="#F59E0B" stroke-width="1.2" stroke-dasharray="3,2" fill="none"/>
            <ellipse cx="20" cy="50" rx="5" ry="16" stroke="#F59E0B" stroke-width="1.2" stroke-dasharray="2,2" fill="none"/>
            <text x="45" y="55" fill="#C5A46D" font-size="11" font-weight="700">${currentLang === 'ar' ? 'عدسة ثلاثية البؤرة (حلقات حيود)' : 'Trifocal Diffractive IOL'}</text>
          ` : (isEdof ? `
            <ellipse cx="20" cy="50" rx="7" ry="24" stroke="#38BDF8" stroke-width="1.5" fill="none"/>
            <text x="45" y="55" fill="#38BDF8" font-size="11" font-weight="700">${currentLang === 'ar' ? 'عدسة ممتدة المدى (EDOF)' : 'EDOF Optical Zone'}</text>
          ` : `
            <text x="45" y="55" fill="#10B981" font-size="11" font-weight="700">${currentLang === 'ar' ? 'عدسة أحادية البؤرة (Monofocal)' : 'Monofocal IOL'}</text>
          `)}
        `}
      </g>

      <!-- Light Rays Ray-Tracing Paths -->
      ${isCataract ? `
        <!-- Cataract: Incoming parallel rays hit cloudy lens and scatter wildly -->
        <g stroke="#38BDF8" stroke-width="2.5" opacity="0.9" filter="url(#laserGlow)">
          <line x1="50" y1="160" x2="165" y2="160"/>
          <line x1="50" y1="175" x2="155" y2="175"/>
          <line x1="50" y1="190" x2="150" y2="190"/>
          <line x1="50" y1="205" x2="155" y2="205"/>
          <line x1="50" y1="220" x2="165" y2="220"/>

          <!-- Through Cornea to Lens -->
          <line x1="165" y1="160" x2="275" y2="170"/>
          <line x1="155" y1="175" x2="275" y2="180"/>
          <line x1="150" y1="190" x2="275" y2="190"/>
          <line x1="155" y1="205" x2="275" y2="200"/>
          <line x1="165" y1="220" x2="275" y2="210"/>
        </g>
        <!-- Scattered Dispersed Rays inside Vitreous -->
        <g stroke="#F59E0B" stroke-width="1.8" stroke-dasharray="4,3" opacity="0.6">
          <line x1="285" y1="170" x2="480" y2="110"/>
          <line x1="285" y1="175" x2="520" y2="140"/>
          <line x1="285" y1="180" x2="550" y2="170"/>
          <line x1="285" y1="190" x2="560" y2="190"/>
          <line x1="285" y1="195" x2="555" y2="215"/>
          <line x1="285" y1="200" x2="510" y2="245"/>
          <line x1="285" y1="210" x2="460" y2="280"/>
          <line x1="285" y1="190" x2="390" y2="260"/>
          <line x1="285" y1="190" x2="380" y2="120"/>
        </g>
        <circle cx="560" cy="190" r="30" fill="rgba(245, 158, 11, 0.25)" filter="url(#laserGlow)"/>
        <text x="420" y="325" fill="#EF4444" font-size="11" font-weight="700">❌ ${currentLang === 'ar' ? 'تشتت وانكسار غير منتظم (توهج وضبابية)' : 'Unfocused Scatter & Contrast Loss'}</text>
      ` : (isMonofocal ? `
        <!-- Monofocal: Distant rays converge into a razor-sharp focal dot on the fovea -->
        <g stroke="#38BDF8" stroke-width="2.5" opacity="0.95" filter="url(#laserGlow)">
          <!-- Entrance -->
          <line x1="50" y1="160" x2="165" y2="160"/>
          <line x1="50" y1="175" x2="155" y2="175"/>
          <line x1="50" y1="190" x2="150" y2="190"/>
          <line x1="50" y1="205" x2="155" y2="205"/>
          <line x1="50" y1="220" x2="165" y2="220"/>
          <!-- Cornea to Lens -->
          <line x1="165" y1="160" x2="275" y2="170"/>
          <line x1="155" y1="175" x2="275" y2="180"/>
          <line x1="150" y1="190" x2="275" y2="190"/>
          <line x1="155" y1="205" x2="275" y2="200"/>
          <line x1="165" y1="220" x2="275" y2="210"/>
          <!-- Lens to Fovea Focal Point -->
          <line x1="290" y1="170" x2="560" y2="190" stroke="#10B981" stroke-width="2.5"/>
          <line x1="290" y1="180" x2="560" y2="190" stroke="#10B981" stroke-width="2.5"/>
          <line x1="290" y1="190" x2="560" y2="190" stroke="#10B981" stroke-width="3"/>
          <line x1="290" y1="200" x2="560" y2="190" stroke="#10B981" stroke-width="2.5"/>
          <line x1="290" y1="210" x2="560" y2="190" stroke="#10B981" stroke-width="2.5"/>
        </g>
        <circle cx="560" cy="190" r="5" fill="#10B981" filter="url(#laserGlow)"/>
        <!-- Dotted Near Ray showing presbyopia focus behind retina -->
        <g stroke="#F43F5E" stroke-width="1.8" stroke-dasharray="3,3" opacity="0.8">
          <line x1="290" y1="165" x2="620" y2="190"/>
          <line x1="290" y1="215" x2="620" y2="190"/>
          <circle cx="620" cy="190" r="4" fill="#F43F5E"/>
        </g>
        <text x="360" y="325" fill="#10B981" font-size="11" font-weight="700">✓ ${currentLang === 'ar' ? 'بؤرة بعيدة فائقة النقاء على اللطخة الصفراء (نظارة للقريب)' : 'Pristine Distance Foveal Focus (Near requires glasses)'}</text>
      ` : (isEdof ? `
        <!-- EDOF: Continuous focal cylinder along visual axis -->
        <g stroke="#38BDF8" stroke-width="2.5" opacity="0.95" filter="url(#laserGlow)">
          <!-- Entrance -->
          <line x1="50" y1="160" x2="165" y2="160"/>
          <line x1="50" y1="175" x2="155" y2="175"/>
          <line x1="50" y1="190" x2="150" y2="190"/>
          <line x1="50" y1="205" x2="155" y2="205"/>
          <line x1="50" y1="220" x2="165" y2="220"/>
          <!-- To Lens -->
          <line x1="165" y1="160" x2="275" y2="170"/>
          <line x1="155" y1="175" x2="275" y2="180"/>
          <line x1="150" y1="190" x2="275" y2="190"/>
          <line x1="155" y1="205" x2="275" y2="200"/>
          <line x1="165" y1="220" x2="275" y2="210"/>
          <!-- Extended Depth Focus Zone -->
          <line x1="290" y1="170" x2="520" y2="186" stroke="#38BDF8" stroke-width="2.5"/>
          <line x1="290" y1="210" x2="520" y2="194" stroke="#38BDF8" stroke-width="2.5"/>
          <line x1="290" y1="190" x2="560" y2="190" stroke="#0284C7" stroke-width="3"/>
          <rect x="520" y="184" width="45" height="12" rx="4" fill="rgba(56, 189, 248, 0.4)" stroke="#38BDF8" stroke-width="1.5" filter="url(#laserGlow)"/>
        </g>
        <text x="360" y="325" fill="#38BDF8" font-size="11" font-weight="700">✓ ${currentLang === 'ar' ? 'قناة بؤرية ممتدة (Extended Focus Channel) بعيد + متوسط' : 'Extended Continuous Depth of Focus Channel'}</text>
      ` : `
        <!-- Trifocal: Three distinct diffractive focal bundles -->
        <g stroke="#38BDF8" stroke-width="2.5" opacity="0.95" filter="url(#laserGlow)">
          <!-- Entrance -->
          <line x1="50" y1="160" x2="165" y2="160"/>
          <line x1="50" y1="175" x2="155" y2="175"/>
          <line x1="50" y1="190" x2="150" y2="190"/>
          <line x1="50" y1="205" x2="155" y2="205"/>
          <line x1="50" y1="220" x2="165" y2="220"/>
          <!-- To Lens -->
          <line x1="165" y1="160" x2="275" y2="170"/>
          <line x1="155" y1="175" x2="275" y2="180"/>
          <line x1="150" y1="190" x2="275" y2="190"/>
          <line x1="155" y1="205" x2="275" y2="200"/>
          <line x1="165" y1="220" x2="275" y2="210"/>
          <!-- Bundle 1: Distance Focus (Gold) -->
          <line x1="290" y1="170" x2="560" y2="190" stroke="#C5A46D" stroke-width="2.5"/>
          <line x1="290" y1="210" x2="560" y2="190" stroke="#C5A46D" stroke-width="2.5"/>
          <!-- Bundle 2: Intermediate Focus (Cyan) -->
          <line x1="290" y1="175" x2="560" y2="190" stroke="#38BDF8" stroke-width="2" stroke-dasharray="6,2"/>
          <line x1="290" y1="205" x2="560" y2="190" stroke="#38BDF8" stroke-width="2" stroke-dasharray="6,2"/>
          <!-- Bundle 3: Near Focus (Burgundy) -->
          <line x1="290" y1="180" x2="560" y2="190" stroke="#F43F5E" stroke-width="2" stroke-dasharray="3,2"/>
          <line x1="290" y1="200" x2="560" y2="190" stroke="#F43F5E" stroke-width="2" stroke-dasharray="3,2"/>
        </g>
        <!-- Triple Focal Ring at Fovea -->
        <circle cx="560" cy="190" r="7" fill="#C5A46D" filter="url(#laserGlow)"/>
        <circle cx="560" cy="190" r="14" stroke="#38BDF8" stroke-width="1.5" fill="none"/>
        <circle cx="560" cy="190" r="21" stroke="#F43F5E" stroke-width="1.5" fill="none"/>
        <text x="320" y="325" fill="#C5A46D" font-size="11" font-weight="700">✓ ${currentLang === 'ar' ? 'تطابق بؤري ثلاثي متكامل على الشبكية (استقلالية كاملة عن النظارة)' : 'Triple Optical Convergence on Retina (Full Independence)'}</text>
      `))}
    </svg>

    <div class="anatomy-legend">
      <div class="anatomy-legend-item">
        <span class="legend-dot" style="background:#38BDF8;"></span>
        <span>${currentLang === 'ar' ? 'حزم الضوء الواردة' : 'Incoming Light'}</span>
      </div>
      <div class="anatomy-legend-item">
        <span class="legend-dot" style="background:#C5A46D;"></span>
        <span>${currentLang === 'ar' ? 'اللطخة الصفراء Fovea' : 'Macula Fovea'}</span>
      </div>
      <div class="anatomy-legend-item">
        <span class="legend-dot" style="background:#10B981;"></span>
        <span>${currentLang === 'ar' ? 'البؤرة الصافية المستقرة' : 'Sharp Focal Plane'}</span>
      </div>
    </div>
  </div>`;
}

// --- MODE 3: CLINICAL DEFOCUS CURVE (SVG GRAPH) ---
function renderDefocusCurve(lensId, diopter) {
  // Vergence map: diopter from 0.0 to -3.0
  // Acuity calculator
  let visualAcuityText = '20/20 (1.0)';
  let acuityPercent = 100;

  if (lensId === 'trifocal') {
    if (diopter >= -0.5) { visualAcuityText = '20/20 (1.0)'; acuityPercent = 98; }
    else if (diopter >= -1.75) { visualAcuityText = '20/25 (0.85)'; acuityPercent = 92; }
    else if (diopter >= -2.75) { visualAcuityText = '20/25 (0.88)'; acuityPercent = 90; }
    else { visualAcuityText = '20/30 (0.75)'; acuityPercent = 82; }
  } else if (lensId === 'edof') {
    if (diopter >= -0.75) { visualAcuityText = '20/20 (1.0)'; acuityPercent = 100; }
    else if (diopter >= -1.75) { visualAcuityText = '20/25 (0.90)'; acuityPercent = 94; }
    else if (diopter >= -2.5) { visualAcuityText = '20/32 (0.65)'; acuityPercent = 68; }
    else { visualAcuityText = '20/50 (0.40)'; acuityPercent = 45; }
  } else if (lensId === 'monofocal') {
    if (diopter >= -0.5) { visualAcuityText = '20/20 (1.0)'; acuityPercent = 100; }
    else if (diopter >= -1.25) { visualAcuityText = '20/32 (0.60)'; acuityPercent = 60; }
    else if (diopter >= -2.0) { visualAcuityText = '20/50 (0.35)'; acuityPercent = 35; }
    else { visualAcuityText = '20/80 (0.25) [يلزم نظارة]'; acuityPercent = 25; }
  } else {
    visualAcuityText = '20/70 (0.30) [ضبابية ساد]';
    acuityPercent = 30;
  }

  // Calculate position on curve X: 0.0D at X=120, -3.5D at X=680
  // diopter ranges from +0.5 to -3.5 (span = 4.0D)
  const currentD = parseFloat(diopter);
  const clampedD = Math.max(-3.5, Math.min(0.5, currentD));
  const markerX = 120 + ((0.5 - clampedD) / 4.0) * 560;
  
  // Marker Y based on acuityPercent (100% at Y=60, 0% at Y=230)
  const markerY = 230 - (acuityPercent / 100) * 170;

  return `
  <div class="defocus-viewport">
    <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #1E2D44;padding-bottom:var(--space-2);margin-bottom:var(--space-2);">
      <div>
        <h4 style="font-size:0.95rem;color:var(--gold-light);font-weight:700;">
          ${currentLang === 'ar' ? 'منحنى اللابؤرية السريري المعتمد دولياً (Defocus Curve - ESCRS)' : 'Clinical Defocus Curve Benchmark (ESCRS Standard)'}
        </h4>
        <p style="font-size:0.75rem;color:#94A3B8;">
          ${currentLang === 'ar' ? 'المقياس العلمي المعتمد في أبحاث جراحة العيون لمقارنة حدة الإبصار (Snellen / LogMAR) عبر جميع مسافات الرؤية اليومية.' : 'International gold standard plotting visual acuity (Snellen/LogMAR) across full diopter vergences.'}
        </p>
      </div>
      <div style="background:#141F33;padding:4px 12px;border-radius:var(--radius-md);border:1px solid #1E2D44;font-size:0.75rem;color:#E2E8F0;">
        ${currentLang === 'ar' ? 'المسافة المختارة:' : 'Target Distance:'} <strong style="color:var(--gold);">${Math.abs(clampedD).toFixed(1)} D (${getDistanceLabel(clampedD)})</strong>
      </div>
    </div>

    <!-- Defocus SVG Chart -->
    <div class="defocus-chart-wrap">
      <svg class="defocus-svg" viewBox="0 0 760 260" xmlns="http://www.w3.org/2000/svg">
        <!-- Background functional threshold band (>= 20/25 functional vision) -->
        <rect x="100" y="55" width="580" height="60" fill="rgba(16, 185, 129, 0.08)" rx="4"/>
        <text x="690" y="85" fill="#10B981" font-size="9.5" font-weight="600">${currentLang === 'ar' ? 'نطاق الرؤية الممتازة دون نظارة' : 'Spectacle Independence Zone (≥20/25)'}</text>

        <!-- Grid Lines & Y Axis -->
        <line x1="100" y1="55" x2="680" y2="55" stroke="#1E2D44" stroke-width="1" stroke-dasharray="2,2"/>
        <text x="85" y="60" fill="#94A3B8" font-size="9" text-anchor="end">20/20 (0.0)</text>

        <line x1="100" y1="85" x2="680" y2="85" stroke="#1E2D44" stroke-width="1" stroke-dasharray="2,2"/>
        <text x="85" y="90" fill="#94A3B8" font-size="9" text-anchor="end">20/25 (0.1)</text>

        <line x1="100" y1="125" x2="680" y2="125" stroke="#1E2D44" stroke-width="1" stroke-dasharray="2,2"/>
        <text x="85" y="130" fill="#94A3B8" font-size="9" text-anchor="end">20/40 (0.3)</text>

        <line x1="100" y1="175" x2="680" y2="175" stroke="#1E2D44" stroke-width="1" stroke-dasharray="2,2"/>
        <text x="85" y="180" fill="#94A3B8" font-size="9" text-anchor="end">20/70 (0.5)</text>

        <line x1="100" y1="225" x2="680" y2="225" stroke="#334155" stroke-width="1.5"/>
        <text x="85" y="228" fill="#64748B" font-size="9" text-anchor="end">20/125</text>

        <!-- Vertical X-Axis Markers for Distances -->
        <!-- 0.0D (Infinity / Distance) -->
        <line x1="190" y1="50" x2="190" y2="225" stroke="#334155" stroke-width="1"/>
        <text x="190" y="240" fill="#E2E8F0" font-size="10" font-weight="700" text-anchor="middle">0.0 D</text>
        <text x="190" y="252" fill="#94A3B8" font-size="8.5" text-anchor="middle">${currentLang === 'ar' ? 'البعيد (القيادة)' : 'Distance (>6m)'}</text>

        <!-- -1.0D (1m) -->
        <line x1="330" y1="50" x2="330" y2="225" stroke="#1E2D44" stroke-width="1" stroke-dasharray="2,2"/>
        <text x="330" y="240" fill="#94A3B8" font-size="10" text-anchor="middle">-1.0 D</text>
        <text x="330" y="252" fill="#64748B" font-size="8.5" text-anchor="middle">${currentLang === 'ar' ? '1 متر' : '1 Meter'}</text>

        <!-- -1.5D (66cm / Intermediate) -->
        <line x1="400" y1="50" x2="400" y2="225" stroke="#334155" stroke-width="1"/>
        <text x="400" y="240" fill="#E2E8F0" font-size="10" font-weight="700" text-anchor="middle">-1.5 D</text>
        <text x="400" y="252" fill="#94A3B8" font-size="8.5" text-anchor="middle">${currentLang === 'ar' ? 'كمبيوتر (66 سم)' : 'PC (66cm)'}</text>

        <!-- -2.5D (40cm / Near) -->
        <line x1="540" y1="50" x2="540" y2="225" stroke="#334155" stroke-width="1"/>
        <text x="540" y="240" fill="#E2E8F0" font-size="10" font-weight="700" text-anchor="middle">-2.5 D</text>
        <text x="540" y="252" fill="#94A3B8" font-size="8.5" text-anchor="middle">${currentLang === 'ar' ? 'جوال (40 سم)' : 'Phone (40cm)'}</text>

        <!-- -3.0D (33cm / Fine Reading) -->
        <line x1="610" y1="50" x2="610" y2="225" stroke="#1E2D44" stroke-width="1" stroke-dasharray="2,2"/>
        <text x="610" y="240" fill="#94A3B8" font-size="10" text-anchor="middle">-3.0 D</text>
        <text x="610" y="252" fill="#64748B" font-size="8.5" text-anchor="middle">${currentLang === 'ar' ? 'مصحف (33 سم)' : 'Book (33cm)'}</text>

        <!-- CURVE 1: Monofocal (Emerald line) -->
        <path d="M 120 180 Q 155 120, 190 58 Q 230 65, 270 95 Q 330 145, 400 180 Q 480 210, 680 220" 
              fill="none" 
              stroke="${lensId === 'monofocal' ? '#10B981' : '#334155'}" 
              stroke-width="${lensId === 'monofocal' ? '4' : '1.8'}" 
              opacity="${lensId === 'monofocal' ? '1' : '0.4'}"/>

        <!-- CURVE 2: EDOF (Cyan line) -->
        <path d="M 120 160 Q 155 100, 190 58 Q 250 62, 330 75 Q 400 88, 470 120 Q 540 170, 680 210" 
              fill="none" 
              stroke="${lensId === 'edof' ? '#38BDF8' : '#334155'}" 
              stroke-width="${lensId === 'edof' ? '4' : '1.8'}" 
              opacity="${lensId === 'edof' ? '1' : '0.4'}"/>

        <!-- CURVE 3: Trifocal (Gold line) -->
        <path d="M 120 160 Q 155 95, 190 60 Q 250 68, 330 85 Q 400 90, 470 82 Q 540 76, 610 105 Q 650 145, 680 185" 
              fill="none" 
              stroke="${lensId === 'trifocal' ? '#C5A46D' : '#334155'}" 
              stroke-width="${lensId === 'trifocal' ? '4.5' : '1.8'}" 
              opacity="${lensId === 'trifocal' ? '1' : '0.4'}"/>

        <!-- CURVE 4: Cataract (Dashed Red line) -->
        <path d="M 120 195 Q 250 185, 400 188 Q 550 192, 680 198" 
              fill="none" 
              stroke="${lensId === 'cataract' ? '#EF4444' : '#334155'}" 
              stroke-width="${lensId === 'cataract' ? '3.5' : '1.5'}" 
              stroke-dasharray="${lensId === 'cataract' ? 'none' : '4,3'}"
              opacity="${lensId === 'cataract' ? '1' : '0.35'}"/>

        <!-- Interactive Marker Dot on active curve -->
        <circle cx="${markerX}" cy="${markerY}" r="7" fill="#FFFFFF" stroke="var(--gold)" stroke-width="3" filter="url(#laserGlow)"/>
        <line x1="${markerX}" y1="50" x2="${markerX}" y2="225" stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.8"/>
      </svg>
    </div>

    <!-- Defocus Diopter Scrubber Card -->
    <div class="defocus-controls-card">
      <div style="display:flex;align-items:center;gap:var(--space-2);font-size:0.8rem;color:#E2E8F0;">
        <span>🔍 ${currentLang === 'ar' ? 'فحص مسافة محددة:' : 'Inspect Distance:'}</span>
        <strong style="color:var(--gold);">${clampedD.toFixed(1)} D</strong>
      </div>

      <input type="range" min="-3.5" max="0.5" step="0.25" value="${clampedD}" class="defocus-slider" oninput="setDefocusDiopter(this.value)">

      <div style="background:#0A1220;border:1px solid #1E2D44;border-radius:var(--radius-md);padding:4px 14px;font-size:0.82rem;">
        <span style="color:#94A3B8;">${currentLang === 'ar' ? 'حدة الإبصار المقدرة:' : 'Predicted Visual Acuity:'}</span>
        <strong style="color:#10B981;margin-inline-start:6px;">${visualAcuityText}</strong>
      </div>
    </div>
  </div>`;
}

function getDistanceLabel(diopter) {
  const d = Math.abs(diopter);
  if (d <= 0.25) return currentLang === 'ar' ? 'اللانهاية / القيادة' : 'Infinity / Driving';
  if (d <= 1.0) return currentLang === 'ar' ? '1 متر' : '1 Meter';
  if (d <= 1.75) return currentLang === 'ar' ? '66 سم (الكمبيوتر)' : '66 cm (PC)';
  if (d <= 2.5) return currentLang === 'ar' ? '40 سم (الجوال)' : '40 cm (Phone)';
  return currentLang === 'ar' ? '33 سم (القراءة الدقيقة)' : '33 cm (Fine Print)';
}

// --- MODE 4: SNELLEN & JAEGER CLINICAL ACUITY CARDS ---
function renderClinicalChart(lensId, glassesOn) {
  const isCataract = lensId === 'cataract';
  const isMonofocal = lensId === 'monofocal';
  const isEdof = lensId === 'edof';
  const isTrifocal = lensId === 'trifocal';

  // Distance filter
  let snellenFilter = 'none';
  if (isCataract) snellenFilter = 'blur(2.8px) contrast(0.65) sepia(0.3)';

  // Near Jaeger filter
  let jaegerFilter = 'none';
  if (isCataract) {
    jaegerFilter = 'blur(3.5px) contrast(0.6) sepia(0.3)';
  } else if (isMonofocal) {
    jaegerFilter = glassesOn ? 'none' : 'blur(2.6px) contrast(0.85)';
  } else if (isEdof) {
    jaegerFilter = 'blur(0.8px)';
  } else if (isTrifocal) {
    jaegerFilter = 'none';
  }

  return `
  <div class="chart-viewport">
    <div class="clinical-chart-board">
      <!-- Left Column: Snellen Distance Eye Chart (6m / 20ft) -->
      <div class="snellen-col" style="filter: ${snellenFilter};">
        <div class="snellen-title">
          🏥 ${currentLang === 'ar' ? 'لوحة سنيلين لفحص الرؤية البعيدة (6 أمتار)' : 'Snellen Distance Chart (6 Meters / 20 ft)'}
        </div>

        <div class="snellen-row" style="padding:10px 0;">
          <span class="snellen-letters" style="font-size:42px;">E</span>
          <span class="snellen-grade">20/200</span>
        </div>
        <div class="snellen-row" style="padding:8px 0;">
          <span class="snellen-letters" style="font-size:28px;">F P</span>
          <span class="snellen-grade">20/100</span>
        </div>
        <div class="snellen-row" style="padding:6px 0;">
          <span class="snellen-letters" style="font-size:22px;">T O Z</span>
          <span class="snellen-grade">20/70</span>
        </div>
        <div class="snellen-row" style="padding:5px 0;">
          <span class="snellen-letters" style="font-size:17px;">L P E D</span>
          <span class="snellen-grade">20/50</span>
        </div>
        <div class="snellen-row" style="padding:4px 0;">
          <span class="snellen-letters" style="font-size:14px;">P E C F D</span>
          <span class="snellen-grade">20/40</span>
        </div>
        <div class="snellen-row" style="padding:3px 0;background:rgba(197, 164, 109, 0.1);">
          <span class="snellen-letters" style="font-size:11.5px;color:#641B2D;">E D F C Z P</span>
          <span class="snellen-grade" style="color:#641B2D;font-weight:bold;">20/25</span>
        </div>
        <div class="snellen-row" style="padding:3px 0;border-bottom:none;">
          <span class="snellen-letters" style="font-size:9.5px;letter-spacing:6px;">F E L O P Z D</span>
          <span class="snellen-grade">20/20 (6/6)</span>
        </div>
      </div>

      <!-- Right Column: Jaeger Near Reading Card (35-40 cm) -->
      <div class="jaeger-col">
        <div>
          <div class="jaeger-title">
            <span>📖 ${currentLang === 'ar' ? 'بطاقة جيجر لفحص القراءة القريبة (40 سم)' : 'Jaeger Near Reading Card (40 cm)'}</span>
            ${isMonofocal ? `
              <button class="glasses-toggle-btn ${glassesOn ? 'active' : ''}" onclick="toggleSimGlasses()">
                <span>👓</span>
                <span>${glassesOn ? (currentLang === 'ar' ? 'خلع نظارة القراءة' : 'Remove Glasses') : (currentLang === 'ar' ? 'ارتداء نظارة قراءة +2.50D' : 'Wear +2.50D Glasses')}</span>
              </button>
            ` : ''}
          </div>

          <div style="filter: ${jaegerFilter}; transition: filter 0.3s ease;">
            <!-- J7 / J5 (Headline & Clinic Details) -->
            <div class="jaeger-block">
              <div class="jaeger-grade-tag">J7 (14 pt) — ${currentLang === 'ar' ? 'الخط الكبير' : 'Large Print'}</div>
              <p style="font-size:15px;line-height:1.6;font-weight:700;color:#0F172A;">
                ${currentLang === 'ar' ? 'مستشفيات ومراكز مغربي للعيون — المدينة المنورة' : 'Magrabi Health Eye & ENT Hospital — Madinah'}
              </p>
            </div>

            <!-- J5 / J3 (Prescription dosage) -->
            <div class="jaeger-block">
              <div class="jaeger-grade-tag">J3 (9 pt) — ${currentLang === 'ar' ? 'روشتة الدواء وتعليمات القطرات' : 'Medication & Eye Drops Instructions'}</div>
              <p style="font-size:11px;line-height:1.8;color:#334155;">
                ${currentLang === 'ar'
                  ? 'قطرة مرطبة خالية من المواد الحافظة: قطرة واحدة في كل عين 4 مرات يومياً، مع الالتزام التام بفترات الراحة البصرية.'
                  : 'Preservative-free artificial tears: 1 drop in each eye 4 times daily as prescribed by Dr. Maan Al Barry.'}
              </p>
            </div>

            <!-- J1 (Fine Print / 20/25 Near Equivalence) -->
            <div class="jaeger-block" style="border-inline-start:3px solid var(--secondary-burgundy);">
              <div class="jaeger-grade-tag">J1 (7 pt / 20/25) — ${currentLang === 'ar' ? 'الخط الدقيق جداً للهاتف والكتب' : 'Fine Print & Mobile Text'}</div>
              <p style="font-size:8.5px;line-height:1.9;color:#1E293B;">
                ${currentLang === 'ar'
                  ? 'تمكن العدسات ثلاثية البؤرة المريض من قراءة هذا السطر الدقيق بصفاء تام دون الحاجة لنظارة قراءة مساعدة. بينما تتطلب العدسة أحادية البؤرة ارتداء نظارة قراءة مخصصة للمسافات القريبة (+2.50 ديوبتر) لفك تشويش هذا السطر.'
                  : 'Trifocal IOLs allow comfortable reading of this fine text without reading glasses. Standard Monofocal IOLs require +2.50D reading glasses to resolve this line.'}
              </p>
            </div>
          </div>
        </div>

        <div style="font-size:0.75rem;padding:6px 10px;background:#F1F5F9;border-radius:6px;color:#475569;margin-top:var(--space-2);">
          ${isMonofocal
            ? (glassesOn ? (currentLang === 'ar' ? '✅ تم تصحيح القريبة بنظارة قراءة (+2.50 ديوبتر)' : '✅ Corrected with +2.50D Reading Glasses') : (currentLang === 'ar' ? '⚠️ أحادية البؤرة: سطر J1 مشوش ويحتاج نظارة قراءة' : '⚠️ Monofocal: J1 is blurred without reading glasses'))
            : (isTrifocal
                ? (currentLang === 'ar' ? '✨ ثلاثية البؤرة: وضوح تام لجميع السطور J1 إلى J7 بدون نظارة' : '✨ Trifocal: J1 to J7 perfectly readable without glasses')
                : (isEdof
                    ? (currentLang === 'ar' ? '🔹 ممتدة المدى: J3 ممتاز، قد يلزم تكبير خفيف لـ J1' : '🔹 EDOF: J3 is clear; fine J1 print is slightly soft')
                    : (currentLang === 'ar' ? '❌ عتامة الماء الأبيض: انخفاض تباين لجميع السطور والنظارة لا تعالج الساد' : '❌ Cataract: Contrast loss across all lines; glasses cannot cure lens opacity')))}
        </div>
      </div>
    </div>
  </div>`;
}

// Scene content renderer for Mode 1
function renderSimSceneContent(sceneId, lensId) {
  if (sceneId === 'night') {
    const isCataract = lensId === 'cataract';
    const isTrifocal = lensId === 'trifocal';
    const isEdof = lensId === 'edof';
    const imgUrl = isCataract ? '/images/sim-driving-cataract.jpg' : '/images/sim-driving-clear.jpg';

    return `
      <div style="position:relative;width:100%;height:100%;background-image:url('${imgUrl}');background-size:cover;background-position:center;">
        <!-- Diffractive Halo Rings for Trifocal Night Driving -->
        ${isTrifocal ? `
          <div class="halo-overlay">
            <!-- Center oncoming car headlight halos -->
            <div style="position:absolute;top:54%;left:54%;">
              <div class="halo-ring inner"></div>
              <div class="halo-ring middle"></div>
              <div class="halo-ring outer"></div>
            </div>
            <!-- Streetlight Halos -->
            <div style="position:absolute;top:38%;left:53%;">
              <div class="halo-ring inner"></div>
              <div class="halo-ring middle"></div>
            </div>
          </div>
        ` : ''}

        <!-- Glare Starburst for Cataract -->
        ${isCataract ? `<div class="cataract-glare-overlay"></div>` : ''}
      </div>
    `;
  }

  // Intermediate Scene: Car Cockpit & Highway View (60-80 cm)
  if (sceneId === 'phone') {
    const isCataract = lensId === 'cataract';
    const isMonofocal = lensId === 'monofocal';
    const isEdof = lensId === 'edof';

    // In Monofocal, the dashboard gauges and navigation screen are blurred (+1.50D deficit), while the windshield view of the road is clear!
    const dashBlur = isCataract ? 'blur(4px) contrast(0.6)' : (isMonofocal ? 'blur(3px) contrast(0.85)' : (isEdof ? 'none' : 'none'));

    return `
    <div style="width:100%;height:100%;background:#0A0F1A;display:flex;flex-direction:column;position:relative;overflow:hidden;">
      <!-- Top Windshield View: Highway to Airport Road Madinah -->
      <div style="height:50%;background-image:url('/images/sim-driving-clear.jpg');background-size:cover;background-position:center 40%;position:relative;border-bottom:3px solid #1E293B;filter:${isCataract ? 'blur(3px) contrast(0.6)' : 'none'};">
        <div style="position:absolute;bottom:8px;right:16px;background:rgba(0,0,0,0.7);padding:2px 8px;border-radius:4px;font-size:10px;color:#F1F5F9;">
          ${currentLang === 'ar' ? 'الرؤية البعيدة عبر الزجاج الأمامي' : 'Windshield Distance View'}
        </div>
      </div>

      <!-- Bottom Car Dashboard Cockpit (Intermediate Focus 66-80 cm) -->
      <div style="height:50%;background:#0F172A;padding:12px 24px;display:flex;align-items:center;justify-content:space-around;gap:16px;filter:${dashBlur};transition:filter 0.3s ease;">
        <!-- Digital Speedometer -->
        <div style="width:140px;height:120px;background:#1E293B;border-radius:12px;border:2px solid #334155;padding:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:inset 0 2px 8px rgba(0,0,0,0.5);">
          <span style="font-size:10px;color:#94A3B8;text-transform:uppercase;">SPEED</span>
          <span style="font-size:36px;font-weight:900;color:#38BDF8;font-family:monospace;line-height:1;">80</span>
          <span style="font-size:9px;color:#64748B;">KM / H</span>
        </div>

        <!-- Center GPS Navigation Screen (Madinah Airport Road) -->
        <div style="flex:1;max-width:320px;height:120px;background:#131D31;border-radius:12px;border:2px solid #2563EB;padding:10px;display:flex;flex-direction:column;justify-content:space-between;">
          <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #1E293B;padding-bottom:4px;">
            <span style="font-size:11px;font-weight:700;color:#FFFFFF;">📍 ${currentLang === 'ar' ? 'مستشفيات مغربي — طريق المطار' : 'Magrabi Hospital — Airport Rd'}</span>
            <span style="font-size:9.5px;color:#38BDF8;">600 m</span>
          </div>
          <div style="font-size:10px;color:#CBD5E1;line-height:1.5;">
            ${currentLang === 'ar' ? 'انعطف يميناً بعد 600 متر باتجاه العيادات الاستشارية.' : 'Turn right in 600m towards Specialty Clinics.'}
          </div>
          <div style="display:flex;justify-content:space-between;font-size:9px;color:#94A3B8;">
            <span>ETA: 4 min</span>
            <span style="color:#10B981;">Intermediate Acuity Target</span>
          </div>
        </div>

        <!-- Fuel & RPM Gauges -->
        <div style="width:140px;height:120px;background:#1E293B;border-radius:12px;border:2px solid #334155;padding:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;">
          <span style="font-size:10px;color:#94A3B8;">ENGINE</span>
          <span style="font-size:24px;font-weight:700;color:#F59E0B;font-family:monospace;">2,200</span>
          <span style="font-size:9px;color:#64748B;">RPM</span>
        </div>
      </div>
    </div>`;
  }

  // Near Scene: Prescription Pad & Arabic Reading (35-40 cm)
  const isCataract = lensId === 'cataract';
  const isMonofocal = lensId === 'monofocal';
  const isEdof = lensId === 'edof';
  const nearBlur = isCataract ? 'blur(4.5px) contrast(0.55) sepia(0.3)' : (isMonofocal ? 'blur(2.8px)' : (isEdof ? 'blur(1.1px)' : 'none'));

  return `
  <div style="width:100%;height:100%;background:#111A29;display:flex;align-items:center;justify-content:center;padding:16px;">
    <div style="width:620px;height:380px;background:#FCFBF7;border:2px solid #CBD5E1;border-radius:12px;padding:24px;box-shadow:0 16px 36px rgba(0,0,0,0.4);display:flex;flex-direction:column;justify-content:space-between;filter:${nearBlur};transition:filter 0.3s ease;color:#0F172A;">
      <!-- Header of Medical Prescription Pad -->
      <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #641B2D;padding-bottom:12px;">
        <div>
          <h3 style="font-size:17px;font-weight:800;color:#641B2D;margin-bottom:2px;">
            ${currentLang === 'ar' ? 'د. معن بن عبدالله بن عمر البري' : 'Dr. Maan Abdullah Al Barry'}
          </h3>
          <p style="font-size:10.5px;color:#475569;">
            ${currentLang === 'ar' ? 'استشاري طب وجراحة العيون والقرنية والماء الأبيض — زميل كلية الجراحين الملكية (بريطانيا)' : 'Consultant Ophthalmologist — Cataract & Refractive Surgery (FRCS UK)'}
          </p>
        </div>
        <div style="text-align:end;font-size:10px;color:#64748B;">
          <span>${currentLang === 'ar' ? 'مستشفيات مغربي — المدينة المنورة' : 'Magrabi Hospital — Madinah'}</span><br>
          <span style="color:#C5A46D;font-weight:700;">Rx Medical Clinic</span>
        </div>
      </div>

      <!-- Body: Authentic Medical Instructions & Reading Lines -->
      <div style="padding:12px 0;display:flex;flex-direction:column;gap:10px;font-family:serif;">
        <p style="font-size:15px;line-height:1.8;color:#1E293B;font-weight:600;">
          ${currentLang === 'ar'
            ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ — خطة العلاج والتأهيل البصري بعد جراحة الساد وزراعة العدسات'
            : 'Post-Operative Visual Rehabilitation & Intraocular Lens Protocol'}
        </p>

        <p style="font-size:12px;line-height:2.0;color:#334155;">
          ${currentLang === 'ar'
            ? 'السطر الدقيق (N5): استخدام القطرات بانتظام، مع مراعاة راحة العين أثناء القراءة اليومية للمصحف وتصفح شاشات الهواتف الذكية. تتيح العدسات ثلاثية البؤرة قراءة هذا النص الصغير بنقاء تام دون الحاجة لنظارة.'
            : 'Fine print verification (N5): Regular instillation of post-operative drops. Trifocal IOLs permit pristine resolution of this fine text without reading glasses.'}
        </p>

        <div style="background:#F1F5F9;border:1px dashed #CBD5E1;padding:8px 12px;border-radius:6px;font-size:10.5px;color:#475569;">
          <strong>${currentLang === 'ar' ? 'معيار الفحص السريري:' : 'Clinical Target:'}</strong> ${currentLang === 'ar' ? 'اختبار المسافة القريبة عند 40 سم بدقة 20/25 (Jaeger J1)' : '40 cm Near Reading Target at 20/25 (Jaeger J1)'}
        </div>
      </div>

      <!-- Footer Signature -->
      <div style="display:flex;align-items:center;justify-content:space-between;border-top:1px solid #E2E8F0;padding-top:8px;font-size:10px;color:#64748B;">
        <span>${currentLang === 'ar' ? 'طريق المطار، المدينة المنورة' : 'Airport Road, Madinah'}</span>
        <span style="font-family:cursive;font-size:14px;color:#641B2D;font-weight:bold;">Dr. Maan Al Barry</span>
      </div>
    </div>
  </div>`;
}

// --- IOL COMPARISON MATRIX SECTION ---
function renderIOLGuide() {
  const iolMatrix = [
    {
      typeAr: 'ثلاثية البؤرة الذكية (Trifocal)',
      typeEn: 'Smart Trifocal IOL',
      distAr: 'ممتازة (1.0)',
      distEn: 'Excellent (1.0)',
      interAr: 'ممتازة جداً (كمبيوتر)',
      interEn: 'Very Good (Screens)',
      nearAr: 'ممتازة دون نظارة',
      nearEn: 'Excellent (No glasses)',
      halosAr: 'هالات طفيفة معتادة تخف تدريجياً',
      halosEn: 'Mild halos fading with adaptation',
      spectaclesAr: 'نادرة جداً (1-5% فقط)',
      spectaclesEn: 'Extremely rare (1–5%)',
      bestAr: 'للمرضى الراغبين في أقصى استقلالية عن النظارة في جميع المسافات.',
      bestEn: 'For patients prioritizing complete spectacle independence across all distances.'
    },
    {
      typeAr: 'ممتدة المدى البصري (EDOF)',
      typeEn: 'Extended Depth of Focus (EDOF)',
      distAr: 'ممتازة وواضحة جداً',
      distEn: 'Excellent & Clear',
      interAr: 'ممتازة وطبيعية',
      interEn: 'Excellent & Natural',
      nearAr: 'جيدة (قد تلزم نظارة للنصوص الدقيقة)',
      nearEn: 'Good (light glasses for fine print)',
      halosAr: 'أدنى درجات الهالات الليلية',
      halosEn: 'Minimal night glare profile',
      spectaclesAr: 'للقراءة الدقيقة جداً فقط',
      spectaclesEn: 'Fine small print only',
      bestAr: 'لمحبي القيادة الليلية واستخدام الحاسوب المستمر دون هالات مزعجة.',
      bestEn: 'Ideal for continuous night drivers and computer professionals.'
    },
    {
      typeAr: 'أحادية البؤرة القياسية (Monofocal)',
      typeEn: 'Standard Monofocal IOL',
      distAr: 'ممتازة وأعلى تباين',
      distEn: 'Sharp, Maximum Contrast',
      interAr: 'متوسطة',
      interEn: 'Moderate',
      nearAr: 'غير واضحة بدون نظارة',
      nearEn: 'Requires Reading Glasses',
      halosAr: 'طبيعية تماماً وخالية من الهالات',
      halosEn: 'Zero halos, pure contrast',
      spectaclesAr: 'دائمة للقراءة والكمبيوتر',
      spectaclesEn: 'Permanent for reading & laptop',
      bestAr: 'لمن يفضلون أعلى جودة تباين نقي للمسافة البعيدة ولا يمانعون ارتداء نظارة قراءة.',
      bestEn: 'For patients desiring pure distance acuity who are comfortable wearing reading glasses.'
    },
    {
      typeAr: 'عتامة الماء الأبيض (Cataract)',
      typeEn: 'Cataract Opacity (Pre-op)',
      distAr: 'ضبابية ومشوشة',
      distEn: 'Hazy & Blurred',
      interAr: 'فقدان للتباين اللوني',
      interEn: 'Reduced Color Contrast',
      nearAr: 'إجهاد وصعوبة بالغة',
      nearEn: 'Eye Strain & Difficulty',
      halosAr: 'تشتت ضوئي وهالات تعيق القيادة',
      halosEn: 'Severe glare & headlight flares',
      spectaclesAr: 'لا تفيد النظارة في حل المشكلة',
      spectaclesEn: 'Glasses cannot correct opacity',
      bestAr: 'حالة عتامة تستوجب فحص استشاري العيون لتحديد خطة الجراحة.',
      bestEn: 'Clinical pathology requiring consultation and phacoemulsification planning.'
    }
  ];

  return `
  <section class="section section-alt" id="cataracts">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${currentLang === 'ar' ? 'الدليل الإكلينيكي الشامل لاختيار العدسات' : 'Clinical Lens Selection Guide'}</div>
        <h2>${currentLang === 'ar' ? 'مقارنة فئات العدسات داخل العين (IOL Spectrum)' : 'Comprehensive Intraocular Lens (IOL) Comparison Matrix'}</h2>
        <p>${currentLang === 'ar' ? 'ملخص الفروقات الهندسية والوظيفية لمساعدتك في اتخاذ قرار طبي مستنير بالتشاور مع د. معن البري.' : 'Compare focal ranges, night driving characteristics, and spectacle independence expectations based on ESCRS guidelines.'}</p>
      </div>

      <div class="iol-table-wrap fade-in">
        <table class="iol-table">
          <thead>
            <tr>
              <th>${currentLang === 'ar' ? 'فئة العدسة' : 'Lens Category'}</th>
              <th>${currentLang === 'ar' ? 'الرؤية البعيدة (القيادة)' : 'Distance Acuity'}</th>
              <th>${currentLang === 'ar' ? 'الرؤية المتوسطة (الحاسوب)' : 'Intermediate (Screens)'}</th>
              <th>${currentLang === 'ar' ? 'الرؤية القريبة (القراءة)' : 'Near Vision (Reading)'}</th>
              <th>${currentLang === 'ar' ? 'التأقلم مع أضواء الليل' : 'Night Glare / Halos'}</th>
              <th>${currentLang === 'ar' ? 'الحاجة لنظارة مساعدة' : 'Spectacle Need'}</th>
              <th>${currentLang === 'ar' ? 'الفئة الأنسب للمناقشة' : 'Clinical Recommendation'}</th>
            </tr>
          </thead>
          <tbody>
            ${iolMatrix.map(m => `
              <tr>
                <td><strong style="color:var(--secondary-burgundy);">${currentLang === 'ar' ? m.typeAr : m.typeEn}</strong></td>
                <td>${currentLang === 'ar' ? m.distAr : m.distEn}</td>
                <td>${currentLang === 'ar' ? m.interAr : m.interEn}</td>
                <td>${currentLang === 'ar' ? m.nearAr : m.nearEn}</td>
                <td>${currentLang === 'ar' ? m.halosAr : m.halosEn}</td>
                <td><span style="font-weight:600;color:var(--text-primary);">${currentLang === 'ar' ? m.spectaclesAr : m.spectaclesEn}</span></td>
                <td style="font-size:0.8rem;">${currentLang === 'ar' ? m.bestAr : m.bestEn}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="medical-disclaimer fade-in">
        <strong>⚠️ ${currentLang === 'ar' ? 'تنبيه إكلينيكي هام:' : 'Clinical Notice:'}</strong>
        ${currentLang === 'ar'
          ? 'لا توجد عدسة واحدة تعتبر الأفضل مطلقاً لكل إنسان. يعتمد اختيار العدسة داخل العيادة على تصوير تضاريس القرنية (Pentacam)، سلامة المقولة وشبكية العين، وحساب قوة العدسة الضوئي، مع مراعاة متطلبات مهنتك ونمط حياتك.'
          : 'No single lens type is universally ideal. Your surgeon tailors the lens choice to your corneal topography, macular integrity, and optical biometry measurements.'}
      </div>
    </div>
  </section>`;
}

// --- LIFESTYLE QUESTIONNAIRE SECTION ---
function renderQuestionnaire() {
  const Q = {
    ar: {
      steps: [
        {
          question: 'ما هي فئتك العمرية التقريبية؟',
          desc: 'تساعد لمعرفة درجة التكيف العصبي الطبيعي وجفاف العين الفسيولوجي.',
          options: ['أقل من 45 سنة', '45 إلى 58 سنة', '59 إلى 70 سنة', 'أكثر من 70 سنة', 'لست متأكداً']
        },
        {
          question: 'هل تم تشخيصك سابقاً بأي من حالات العين التالية؟',
          desc: 'بعض حالات الشبكية وارتفاع ضغط العين تتطلب اختيار عدسات تحافظ على أعلى حساسية للتباين.',
          options: [
            'لا توجد حالات سابقة معتمدة (سليمة)',
            'ارتفاع ضغط العين أو ماء أزرق (Glaucoma)',
            'اعتلال بمركز الإبصار أو السكري بالشبكية',
            'قرنية مخروطية أو جفاف عين مزمن',
            'لست متأكداً تماماً (أرغب بفحص شامل)'
          ]
        },
        {
          question: 'ما هي الأولوية البصرية الأهم في نمط حياتك اليومي؟',
          desc: 'تساعد على تحديد النطاق البصري الأكثر استخداماً خلال يومك.',
          options: [
            'القيادة الليلية ورؤية المسافات البعيدة بوضوح ودون هالات',
            'العمل المكتبي، شاشات الحاسوب، ولوحة قيادة السيارة (مسافة ممتدة)',
            'قراءة المصحف الشريف والهاتف الذكي دون نظارة',
            'الاستقلالية التامة بنسبة 95%+ عن النظارات في كافة الظروف'
          ]
        },
        {
          question: 'هل سبق لك إجراء عملية ليزك أو تصحيح نظر سابق؟',
          desc: 'العيون التي خضعت لعمليات سابقة تحتاج معادلات حسابية خاصة (Barrett True-K).',
          options: [
            'لم أجرِ أي عملية سابقة (قرنية طبيعية)',
            'نعم، أجريت فيمتو ليزك أو ليزر سطحي PRK',
            'نعم، خضعت لتثبيت قرنية مخروطية CXL',
            'لست متأكداً من التاريخ الجراحي الدقيق'
          ]
        }
      ]
    },
    en: {
      steps: [
        {
          question: 'What is your approximate age group?',
          desc: 'Guides expectations regarding neuroadaptation and ocular surface status.',
          options: ['Under 45 years', '45 to 58 years', '59 to 70 years', 'Over 70 years', 'Not certain']
        },
        {
          question: 'Do you have any previously diagnosed ocular conditions?',
          desc: 'Conditions such as glaucoma or maculopathy influence lens optical platform selection.',
          options: [
            'No diagnosed conditions (Healthy Eyes)',
            'Glaucoma or elevated eye pressure',
            'Diabetic retinopathy or macular condition',
            'Keratoconus or severe chronic dry eye',
            'Not certain (Require complete exam)'
          ]
        },
        {
          question: 'What is your primary visual priority in daily routine?',
          desc: 'Defines your most critical working visual focal distance.',
          options: [
            'Night driving and high contrast distance clarity with zero halos',
            'Computer work, laptops, and dashboard view (Intermediate continuous)',
            'Smartphone use and book reading without reading glasses',
            'Maximum spectacle independence (95%+) in all everyday scenarios'
          ]
        },
        {
          question: 'Have you undergone previous laser refractive surgery (LASIK / PRK)?',
          desc: 'Post-refractive eyes require specialized biometric calculations (e.g., Barrett True-K).',
          options: [
            'No previous surgery (Virgin Cornea)',
            'Yes, prior Femto-LASIK or PRK',
            'Yes, prior corneal cross-linking (CXL)',
            'Not certain of surgical history'
          ]
        }
      ]
    }
  };

  const currentQ = Q[currentLang];

  if (qDone) {
    return `
    <section class="section" id="questionnaire">
      <div class="container">
        <div class="section-header fade-in">
          <div class="section-label">${currentLang === 'ar' ? 'تقرير نمط الحياة البصري الاسترشادي' : 'Visual Lifestyle Report'}</div>
          <h2>${currentLang === 'ar' ? 'النقاط المقترحة لمناقشتها مع الدكتور معن البري' : 'Discussion Points for Your Ophthalmic Consultation'}</h2>
        </div>
        <div class="questionnaire fade-in">
          <div class="q-result">
            <div style="font-size:2.5rem;margin-bottom:var(--space-2);">📋</div>
            <h3 style="color:var(--secondary-burgundy);margin-bottom:var(--space-3);">
              ${currentLang === 'ar' ? 'تم تجهيز ملخص أولوياتك البصرية' : 'Your Discussion Summary is Ready'}
            </h3>
            <p style="color:var(--text-secondary);font-size:0.95rem;margin-bottom:var(--space-6);">
              ${currentLang === 'ar'
                ? 'بناءً على إجاباتك الأربع، هذه المحاور العلمية التي يوصى بطرحها ومناقشتها خلال جلستك في عيادة مغربي بالمدينة المنورة:'
                : 'Based on your selected priorities, here are key clinical topics to explore during your consultation at Magrabi:'}
            </p>

            <div class="q-result-item">
              <h4>🎯 ${currentLang === 'ar' ? 'الأولوية الوظيفية المستهدفة' : 'Target Visual Focus'}</h4>
              <p>${currentLang === 'ar' ? 'مناقشة موازنة الرؤية بين عدسات EDOF (للقيادة والشاشات مع انعدام الهالات) أو عدسات Trifocal (للقراءة بدون نظارات مع فترة تكيف عصبي).' : 'Evaluate EDOF for pure night contrast vs Trifocals for complete spectacle independence with neuroadaptation.'}</p>
            </div>

            <div class="q-result-item">
              <h4>🔬 ${currentLang === 'ar' ? 'الفحوصات الطبوغرافية الموصى بها' : 'Required Diagnostic Profiling'}</h4>
              <p>${currentLang === 'ar' ? 'إجراء فحص البنتاكام (Pentacam) لاستبعاد الاستجماتيزم غير المنتظم والتأكد من ملاءمة العدسات متعددة البؤرة لسطح قرنيتك.' : 'Perform Pentacam Scheimpflug tomography to evaluate regular vs irregular astigmatism before premium IOL selection.'}</p>
            </div>

            <div class="q-result-item">
              <h4>⚖️ ${currentLang === 'ar' ? 'تحديد الخيار الجراحي النهائي' : 'Final Surgical Confirmation'}</h4>
              <p>${currentLang === 'ar' ? 'يتم اتخاذ القرار النهائي بناءً على قياسات طول العين بالموجات الضوئية (IOL Master) وفحص قاع العين المباشر مع الدكتور.' : 'Target lens power is calculated using optical biometry paired with thorough clinical examination by Dr. Maan.'}</p>
            </div>

            <div style="display:flex;gap:var(--space-3);justify-content:center;flex-wrap:wrap;margin-top:var(--space-8);">
              <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                ${currentLang === 'ar' ? 'حجز موعد فحص القرنية والعدسات' : 'Book Exam Appointment'}
              </a>
              <a href="${whatsappUrl('مرحباً، أجريت استبيان نمط الحياة البصري على الموقع وأرغب بالاستفسار عن حجز موعد مع د. معن البري.')}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
                ${currentLang === 'ar' ? 'تنسيق الموعد عبر واتساب' : 'Inquire via WhatsApp'}
              </a>
              <button class="btn btn-outline" onclick="restartQ()">
                ${currentLang === 'ar' ? 'إعادة الاستبيان' : 'Restart'}
              </button>
            </div>

            <div class="medical-disclaimer" style="margin-top:var(--space-6);text-align:start;">
              <strong>${currentLang === 'ar' ? 'تنبيه سريري:' : 'Clinical Safety Notice:'}</strong>
              ${currentLang === 'ar'
                ? 'هذا التقرير استرشادي وتثقيفي فقط ولا يمثل تشخيصاً طبياً أو وصفة ملزمة لنوع عدسة. القرار الطبي يتخذه الاستشاري حصراً بعد الفحص المجهري المباشر.'
                : 'This summary is for educational discussion only and does not constitute a prescription. Clinical diagnosis and treatment decisions are made exclusively following in-person examination.'}
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }

  const step = currentQ.steps[qStep];

  return `
  <section class="section" id="questionnaire">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${currentLang === 'ar' ? 'استبيان نمط الحياة البصري' : 'Visual Lifestyle Questionnaire'}</div>
        <h2>${currentLang === 'ar' ? '4 خطوات لاكتشاف خيارات العدسة الأنسب لك' : '4 Guided Steps to Identify Your Visual Needs'}</h2>
        <p>${currentLang === 'ar' ? 'أداة تثقيفية لمساعدتك في تحديد أولوياتك اليومية قبل جلسة الفحص والاستشارة في العيادة.' : 'A guided tool to map your daily priorities before your comprehensive clinical consultation.'}</p>
      </div>

      <div class="questionnaire fade-in">
        <div class="q-progress">
          ${currentQ.steps.map((_, i) => `
            <div class="step ${i < qStep ? 'done' : ''} ${i === qStep ? 'current' : ''}"></div>
          `).join('')}
        </div>

        <div style="margin-bottom:var(--space-4);">
          <span style="font-size:0.78rem;font-weight:700;color:var(--gold);text-transform:uppercase;">
            ${currentLang === 'ar' ? `الخطوة ${qStep + 1} من 4` : `Step ${qStep + 1} of 4`}
          </span>
          <h3 style="font-size:1.25rem;color:var(--text-primary);margin-top:4px;">${step.question}</h3>
          <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:2px;">${step.desc}</p>
        </div>

        <div class="q-options">
          ${step.options.map((opt, i) => `
            <button class="q-option ${qAnswers[qStep] === i ? 'selected' : ''}" onclick="selectQOption(${i})">
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>

        <div class="q-nav">
          ${qStep > 0 ? `<button class="btn btn-outline btn-sm" onclick="prevQStep()">${currentLang === 'ar' ? 'السابق' : 'Previous'}</button>` : '<div></div>'}
          <button class="btn btn-primary btn-sm" onclick="nextQStep()" ${qAnswers[qStep] === undefined ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
            ${qStep < currentQ.steps.length - 1 ? (currentLang === 'ar' ? 'التالي ←' : 'Next →') : (currentLang === 'ar' ? 'عرض التقرير الاسترشادي' : 'View Lifestyle Summary')}
          </button>
        </div>
      </div>
    </div>
  </section>`;
}

// --- MEDICAL EDUCATION LIBRARY SECTION ---
function renderEducation() {
  const articles = [
    {
      id: 'cataract-guide',
      titleAr: 'ما هي المياه البيضاء (الساد) ومتى تصبح الجراحة ضرورية؟',
      titleEn: 'What is a Cataract and When is Surgery Indicated?',
      contentAr: `
        <h4>ما هو إعتام عدسة العين؟</h4>
        <p>المياه البيضاء ليست غشاءً ينمو فوق سطح العين، بل هي عتامة تدريجية في العدسة الطبيعية الشفافة الموجودة داخل العين خلف بؤبؤ العين. تؤدي هذه العتامة إلى تشتت الضوء الداخل إلى الشبكية، مما يسبب ضبابية الرؤية، بهتان الألوان، وصعوبة القيادة ليلاً بسبب الوهج.</p>
        <h4>متى ينبغي إجراء العملية؟</h4>
        <p>لا تتطلب المياه البيضاء الجراحة فور اكتشافها إلا إذا كانت تسبب مضاعفات نادرة كارتفاع ضغط العين. المعيار الأساسي هو مدى تأثير ضعف النظر على أنشطتك اليومية مثل القراءة، قيادة السيارة، أو التعرف على وجوه الأشخاص.</p>
        <h4>كيف تُجرى الجراحة الحديثة؟</h4>
        <p>تُجرى عملية الفاكو (Phacoemulsification) عبر فتحة ميكروسكوبية لا تتجاوز 2.2 ملم، حيث يتم تفتيت العدسة المعتمة بالموجات فوق الصوتية وشفطها، ثم زراعة عدسة صناعية قابلة للطي مكانها تحت تخدير موضعي بقطرات ودون الحاجة لغرز جراحية في الغالبية العظمى من الحالات.</p>
      `,
      contentEn: `
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
      titleAr: 'القرنية المخروطية: الأعراض، التشخيص، وخيارات التثبيت (CXL)',
      titleEn: 'Keratoconus: Diagnosis, Progression, and Corneal Cross-Linking (CXL)',
      contentAr: `
        <h4>ما هي القرنية المخروطية؟</h4>
        <p>القرنية هي النافذة الشفافة الأمامية للعين. في القرنية المخروطية، يضعف النسيج الضام وتبرز القرنية تدريجياً لتأخذ شكلاً مخروطياً، مما يؤدي إلى استجماتيزم غير منتظم وتدهور سريع في قياسات النظارة خاصة لدى فئة الشباب والمراهقين.</p>
        <h4>أهمية التشخيص المبكر وتصوير تضاريس القرنية (Pentacam)</h4>
        <p>يساعد التصوير الطبقي للقرنية في اكتشاف المرض قبل ظهور أي علامات واضحة بالفحص العادي. يُنصح كل من يلاحظ تغيراً متكرراً في مقاس النظارة أو فركاً مزمناً في العين بإجراء هذا الفحص.</p>
        <h4>عملية تثبيت القرنية بالكولاجين (CXL)</h4>
        <p>إجراء علاجي يهدف إلى تقوية الروابط بين ألياف القرنية باستخدام قطرات فيتامين ب2 (الريبوفلافين) مع الأشعة فوق البنفسجية UVA. الهدف الأساسي هو إيقاف تقدم المرض وحماية النظر من التدهور المستقبلي.</p>
      `,
      contentEn: `
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
      titleAr: 'من هو المرشح المناسب لعمليات تصحيح الإبصار بالليزر (الليزك والفيمتو ليزك)؟',
      titleEn: 'Who is an Ideal Candidate for Laser Vision Correction (LASIK / PRK)?',
      contentAr: `
        <h4>المعايير الأساسية للأمان:</h4>
        <ul>
          <li><strong>العمر:</strong> ألا يقل عن 18 عاماً لضمان استقرار نمو العين.</li>
          <li><strong>استقرار النظر:</strong> ثبات قياسات النظارة لمدة عام على الأقل.</li>
          <li><strong>سماكة القرنية وشكلها:</strong> خلو القرنية تماماً من أي علامات للقرنية المخروطية أو الترقق غير الطبيعي.</li>
          <li><strong>صحة سطح العين:</strong> علاج أي جفاف حاد قبل اتخاذ قرار الليزك.</li>
        </ul>
        <h4>ما الفرق بين الفيمتو ليزك والليزر السطحي (PRK)؟</h4>
        <p>في الفيمتو ليزك يتم رفع قشرة رقيقة من القرنية بواسطة ليزر الفيمتوثانية ثم تصحيح النظر، مما يوفر تعافياً سريعاً جداً. أما الليزر السطحي فيتم دون رفع أي قشرة، ويعد الخيار الأنسب لأصحاب القرنيات الرقيقة أو من يمارسون رياضات عنيفة.</p>
      `,
      contentEn: `
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
      titleAr: 'رحلة المريض: ماذا تتوقع قبل وأثناء وبعد جراحة المياه البيضاء؟',
      titleEn: 'The Patient Journey: What to Expect Before, During, and After Cataract Surgery',
      contentAr: `
        <h4>قبل العملية (التحضير والقياسات):</h4>
        <p>يخضع المريض لقياسات بصرية فائقة الدقة (Optical Biometry) لحساب قوة العدسة المناسبة، مع مناقشة نوع العدسة الأنسب لاحتياجاته.</p>
        <h4>يوم العملية:</h4>
        <p>إجراء يومي لا يستدعي المبيت. تستغرق الجراحة نحو 15 إلى 20 دقيقة تحت تخدير موضعي بالقطرات، مع شعور المريض بضغط خفيف أو أضواء دون ألم حقيقي.</p>
        <h4>بعد العملية:</h4>
        <p>يغادر المريض بعد وقت وجيز مرتدياً غطاءً واقياً. من الضروري الالتزام بجدول القطرات المضادة للالتهاب والمضادات الحيوية، وتجنب فرك العين أو وصول الماء المباشر إليها خلال الأيام الأولى.</p>
      `,
      contentEn: `
        <h4>Pre-Operative Preparation:</h4>
        <p>Precise optical biometry is performed to calculate target IOL power, paired with a detailed lifestyle discussion regarding distance, intermediate, and near visual needs.</p>
        <h4>Day of Surgery:</h4>
        <p>Performed as an outpatient day procedure under topical anesthetic eye drops. The surgical procedure typically lasts 15–20 minutes with zero pain and immediate discharge.</p>
        <h4>Post-Operative Care:</h4>
        <p>Patients follow a structured regimen of anti-inflammatory and antibiotic eye drops, avoiding eye rubbing or direct tap water exposure during the initial healing window.</p>
      `
    }
  ];

  return `
  <section class="section section-alt" id="education">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${currentLang === 'ar' ? 'المكتبة الطبية والتثقيف السريري' : 'Medical Library & Patient Education'}</div>
        <h2>${currentLang === 'ar' ? 'إرشادات طبية موثقة لصحة عينيك' : 'Evidence-Based Eye Health Guidance'}</h2>
        <p>${currentLang === 'ar' ? 'مقالات وأدلة سريرية محكمة أعدت بإشراف الدكتور معن البري لتزويدك بالحقائق الطبية الدقيقة.' : 'Peer-reviewed guides developed under Dr. Maan Al Barry’s clinical oversight.'}</p>
      </div>

      <div class="article-accordion fade-in">
        ${articles.map(art => `
          <div class="article-item ${activeArticle === art.id ? 'open' : ''}" id="art-item-${art.id}">
            <button class="article-trigger" onclick="toggleArticle('${art.id}')">
              <span>${currentLang === 'ar' ? art.titleAr : art.titleEn}</span>
              <span class="trigger-icon">▼</span>
            </button>
            <div class="article-content">
              ${currentLang === 'ar' ? art.contentAr : art.contentEn}
              <div style="margin-top:var(--space-4);padding-top:var(--space-3);border-top:1px solid var(--border-subtle);font-size:0.8rem;color:var(--text-muted);">
                👨‍⚕️ ${currentLang === 'ar' ? 'إشراف ومراجعة سريرية: د. معن بن عبدالله البري — استشاري طب وجراحة العيون' : 'Medically supervised by Dr. Maan Al Barry — Consultant Ophthalmologist'}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Emergency Red Flags Card -->
      <div class="emergency-card fade-in">
        <div class="emergency-header">
          <span>⚠️</span>
          <span>${currentLang === 'ar' ? 'علامات التحذير الطارئة (تستوجب الرعاية العاجلة فوراً)' : 'Emergency Red Flags (Require Immediate Ophthalmic Care)'}</span>
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

// --- CLINIC, BOOKING & EXACT GOOGLE MAPS SECTION ---
function renderClinic() {
  return `
  <section class="section" id="clinic">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${currentLang === 'ar' ? 'العيادة والموقع الجغرافي' : 'Hospital Practice & Location'}</div>
        <h2>${currentLang === 'ar' ? 'العيادة والاستشارات وحجز المواعيد' : 'Clinic Location & Direct Appointment Booking'}</h2>
        <p>${currentLang === 'ar' ? 'نرحب بكم في مستشفيات ومراكز مغربي للعيون والأذن بالمدينة المنورة، المزودة بأحدث التجهيزات الجراحية والتشخيصية.' : 'We welcome you at Magrabi Health Eye & ENT Hospital in Madinah, fully equipped with state-of-the-art diagnostic and surgical technology.'}</p>
      </div>

      <div class="clinic-card fade-in">
        <!-- Exact Google Maps Direction Integration -->
        <div class="clinic-map-pane">
          <div style="font-size:3rem;margin-bottom:var(--space-2);">📍</div>
          <h4 style="font-size:1.15rem;color:var(--text-primary);margin-bottom:var(--space-1);">
            ${currentLang === 'ar' ? DOCTOR.clinicAr : DOCTOR.clinicEn}
          </h4>
          <p style="font-size:0.88rem;color:var(--text-secondary);max-width:320px;margin-bottom:var(--space-4);">
            ${currentLang === 'ar' ? DOCTOR.addressAr : DOCTOR.addressEn}
          </p>
          <a href="${DOCTOR.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            🗺️ ${currentLang === 'ar' ? 'فتح الاتجاهات عبر خرائط جوجل (Google Maps)' : 'Open in Google Maps'}
          </a>
          <span style="font-size:0.75rem;color:var(--text-muted);margin-top:8px;">
            ${currentLang === 'ar' ? 'رابط الوصول المباشر المعتمد للمستشفى' : 'Official Verified Hospital Destination Link'}
          </span>
        </div>

        <div class="clinic-info">
          <h3>${currentLang === 'ar' ? 'بيانات التواصل وأوقات الزيارة' : 'Clinic Contact & Practice Schedule'}</h3>

          <div class="clinic-detail-item">
            <div class="detail-icon">🏢</div>
            <div class="detail-text">
              <strong>${currentLang === 'ar' ? 'الموقع والصرح الطبي' : 'Medical Hospital'}</strong>
              <span>${currentLang === 'ar' ? DOCTOR.clinicAr : DOCTOR.clinicEn}</span>
            </div>
          </div>

          <div class="clinic-detail-item">
            <div class="detail-icon">📞</div>
            <div class="detail-text">
              <strong>${currentLang === 'ar' ? 'مركز الاتصال والحجز الموحد' : 'Central Call Center'}</strong>
              <a href="tel:${DOCTOR.callCenter}" style="direction:ltr;display:inline-block;font-weight:700;color:var(--secondary-burgundy);">
                ${DOCTOR.callCenter} / ${DOCTOR.landline}
              </a>
            </div>
          </div>

          <div class="clinic-detail-item">
            <div class="detail-icon">🕐</div>
            <div class="detail-text">
              <strong>${currentLang === 'ar' ? 'مواعيد عمل العيادات' : 'Clinic Hours'}</strong>
              <span>${currentLang === 'ar' ? 'السبت إلى الخميس: 9:00 ص – 1:00 م | 5:00 م – 9:30 م' : 'Saturday to Thursday: 9:00 AM – 1:00 PM | 5:00 PM – 9:30 PM'}</span>
            </div>
          </div>

          <div style="display:flex;flex-direction:column;gap:var(--space-3);margin-top:var(--space-6);">
            <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              ${currentLang === 'ar' ? 'حجز موعد عبر البوابة الرسمية لمغربي' : 'Book via Magrabi Official Portal'}
            </a>
            <a href="${whatsappUrl()}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
              💬 ${currentLang === 'ar' ? 'تنسيق واستفسار عبر واتساب' : 'Inquire via WhatsApp'}
            </a>
            <a href="${DOCTOR.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
              🚗 ${currentLang === 'ar' ? 'الاتجاهات الجغرافية (Google Maps)' : 'Hospital Directions (Google Maps)'}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

// --- FAQ SECTION ---
function renderFAQ() {
  const faqs = [
    {
      qAr: 'ما هو التخصص الدقيق للدكتور معن بن عبدالله البري؟',
      qEn: 'What are Dr. Maan Al Barry\'s medical subspecialties?',
      aAr: 'استشاري طب وجراحة العيون، متخصص في جراحة المياه البيضاء (الساد) وزراعة العدسات الذكية، عمليات تصحيح الإبصار بالليزر (الليزك والفيمتو ليزك والسطحي)، وأمراض القرنية والقرنية المخروطية وتثبيت القرنية CXL.',
      aEn: 'He is a Consultant Ophthalmologist specializing in cataract surgery, advanced IOL implantation, laser refractive surgery (LASIK, Femto-LASIK, PRK), and corneal diseases including keratoconus and corneal cross-linking (CXL).'
    },
    {
      qAr: 'أين تقع عيادة الدكتور معن البري وكيف يمكن الوصول إليها؟',
      qEn: 'Where is Dr. Maan Al Barry\'s clinic located?',
      aAr: 'يستقبل د. معن البري مراجعيه في مستشفيات ومراكز مغربي للعيون والأذن بالمدينة المنورة، الواقع على طريق المطار. يمكنك فتح رابط خرائط جوجل المعتمد مباشرة عبر الموقع.',
      aEn: 'At Magrabi Health Eye & ENT Hospital in Madinah, located on Airport Road. You can access the verified Google Maps destination link directly from this website.'
    },
    {
      qAr: 'كيف يمكنني حجز موعد مؤكد مع الطبيب؟',
      qEn: 'How can I book a confirmed appointment?',
      aAr: 'يمكنك الحجز مباشرة عبر بوابة الحجز الإلكتروني الرسمية لمغربي (ob.magrabi.com.sa)، أو عبر الاتصال بالرقم الموحد 19505، أو الاستفسار السريع وتنسيق الموعد عبر رابط واتساب المتوفر في الموقع.',
      aEn: 'You can book through the official Magrabi Online Booking portal (ob.magrabi.com.sa), via the contact center at 19505, or via direct WhatsApp coordination.'
    },
    {
      qAr: 'هل يضمن محاكي الرؤية النتيجة الفعلية للعملية الجراحية؟',
      qEn: 'Does the Vision Simulator predict actual surgical vision?',
      aAr: 'كلا، محاكي الرؤية هو أداة تعليمية وتوضيحية عامة لشرح الفروقات المفاهيمية بين العدسات. النتيجة الفعلية تعتمد على فحص تضاريس القرنية، صحة الشبكية، وقياسات العين الدقيقة التي يجريها الاستشاري.',
      aEn: 'No. The simulator is strictly an educational tool illustrating optical principles. Real-world postoperative visual acuity is determined by clinical biometry, corneal morphology, and individualized healing.'
    },
    {
      qAr: 'هل يمكن الاستغناء التام عن النظارات بعد عملية المياه البيضاء؟',
      qEn: 'Can cataract surgery guarantee complete spectacle independence?',
      aAr: 'توفر العدسات الحديثة مثل العدسات ثلاثية البؤرة (Trifocal) والعدسات ممتدة العمق (EDOF) استقلالية عالية عن النظارات لمعظم الأنشطة كالقراءة وقيادة السيارة، ولكن لا يمكن تقديم ضمان طبي بنسبة 100% لعدم الحاجة لنظارة في بعض الظروف الخاصة.',
      aEn: 'While modern premium IOLs (Trifocals & EDOFs) significantly decrease dependence on glasses for distance, intermediate, and near tasks, complete 100% independence cannot be guaranteed for every clinical case.'
    },
    {
      qAr: 'ما هي معايير ترشيح المريض لعمليات تصحيح النظر بالليزك؟',
      qEn: 'What are the main criteria for laser vision correction (LASIK)?',
      aAr: 'يشترط ألا يقل العمر عن 18 عاماً، وثبات النظر لمدة عام، وسماكة قرنية كافية، وخلو العين التام من القرنية المخروطية أو الجفاف الشديد غير المعالج، ويتم حسم القرار بعد تصوير القرنية الطبقي (Pentacam).',
      aEn: 'Candidates must be at least 18 years old, possess stable refraction for 12 months, have adequate corneal thickness, and demonstrate normal corneal topography with no evidence of keratoconus.'
    }
  ];

  return `
  <section class="section section-alt" id="faq">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${currentLang === 'ar' ? 'الأسئلة الشائعة والاستفسارات' : 'Frequently Asked Questions'}</div>
        <h2>${currentLang === 'ar' ? 'دليل إجابات صحة العين وجراحة الساد والقرنية' : 'Ophthalmic Health & Surgical Answers'}</h2>
      </div>

      <div class="faq-list fade-in">
        ${faqs.map((f, i) => `
          <div class="faq-item" id="faq-${i}">
            <button class="faq-question" onclick="toggleFaq(${i})" aria-expanded="false" aria-controls="faq-answer-${i}">
              <span>${currentLang === 'ar' ? f.qAr : f.qEn}</span>
              <span class="faq-icon">+</span>
            </button>
            <div class="faq-answer" id="faq-answer-${i}" role="region">
              <p>${currentLang === 'ar' ? f.aAr : f.aEn}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

// --- CALL TO ACTION BANNER ---
function renderCTA() {
  return `
  <section class="section">
    <div class="container">
      <div class="cta-banner fade-in">
        <h2>${currentLang === 'ar' ? 'هل ترغب في معرفة أي عدسة تناسب نمط حياتك؟' : 'Ready for a Specialized Eye Evaluation?'}</h2>
        <p>${currentLang === 'ar' ? 'احجز موعدك الآن مع د. معن بن عبدالله البري في مغربي المدينة المنورة لإجراء تقييم شامل ومناقشة الخيارات الأنسب لحالتك.' : 'Schedule your comprehensive examination with Dr. Maan Al Barry at Magrabi Health Madinah today.'}</p>
        <div style="display:flex;gap:var(--space-3);justify-content:center;flex-wrap:wrap;">
          <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-gold btn-lg">
            ${currentLang === 'ar' ? 'تأكيد حجز موعد كشف واستشارة' : 'Book Clinic Appointment'}
          </a>
          <a href="${whatsappUrl()}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-lg">
            💬 ${currentLang === 'ar' ? 'تنسيق عبر واتساب' : 'Inquire via WhatsApp'}
          </a>
          <a href="${DOCTOR.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-lg" style="color:#FFFFFF;border-color:rgba(255,255,255,0.4);">
            📍 ${currentLang === 'ar' ? 'موقع المستشفى بالمدينة' : 'Hospital Location'}
          </a>
        </div>
      </div>
    </div>
  </section>`;
}

// --- FOOTER COMPONENT ---
function renderFooter() {
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3);">
            <div class="logo-icon" style="width:38px;height:38px;font-size:1.1rem;">م</div>
            <div>
              <strong style="color:var(--footer-title);font-size:1.05rem;display:block;">${currentLang === 'ar' ? DOCTOR.nameAr : DOCTOR.nameEn}</strong>
              <small style="color:var(--gold);font-size:0.75rem;">${currentLang === 'ar' ? DOCTOR.titleAr : DOCTOR.titleEn}</small>
            </div>
          </div>
          <p style="font-size:0.85rem;line-height:1.7;">
            ${currentLang === 'ar'
              ? 'الموقع الرسمي للتعريف بالخبرات الأكاديمية والسريرية للدكتور معن البري، ونشر التثقيف الطبي الموثوق حول جراحات المياه البيضاء، القرنية، وتصحيح النظر.'
              : 'Official medical portal presenting Dr. Maan Al Barry\'s academic appointments and evidence-based patient education.'}
          </p>
        </div>

        <div class="footer-col">
          <h4>${currentLang === 'ar' ? 'روابط الوصول السريع' : 'Quick Navigation'}</h4>
          <a href="#home" onclick="scrollToSection('home');return false;">${currentLang === 'ar' ? 'الرئيسية' : 'Home'}</a>
          <a href="#profile" onclick="scrollToSection('profile');return false;">${currentLang === 'ar' ? 'السيرة المهنية' : 'Biography'}</a>
          <a href="#specialties" onclick="scrollToSection('specialties');return false;">${currentLang === 'ar' ? 'التخصصات الجراحية' : 'Specialties'}</a>
          <a href="#simulator" onclick="scrollToSection('simulator');return false;">${currentLang === 'ar' ? 'محاكي الرؤية' : 'Simulator'}</a>
          <a href="#cataracts" onclick="scrollToSection('cataracts');return false;">${currentLang === 'ar' ? 'دليل العدسات IOL' : 'IOL Guide'}</a>
        </div>

        <div class="footer-col">
          <h4>${currentLang === 'ar' ? 'التخصصات الدقيقة' : 'Clinical Focus'}</h4>
          <a href="#specialties" onclick="scrollToSection('specialties');return false;">${currentLang === 'ar' ? 'جراحة الساد والماء الأبيض' : 'Cataract Surgery'}</a>
          <a href="#specialties" onclick="scrollToSection('specialties');return false;">${currentLang === 'ar' ? 'زراعة العدسات ثلاثية البؤرة' : 'Trifocal / EDOF IOLs'}</a>
          <a href="#specialties" onclick="scrollToSection('specialties');return false;">${currentLang === 'ar' ? 'القرنية المخروطية وتثبيت CXL' : 'Keratoconus (CXL)'}</a>
          <a href="#specialties" onclick="scrollToSection('specialties');return false;">${currentLang === 'ar' ? 'الفيمتو ليزك وتصحيح النظر' : 'Femto-LASIK & PRK'}</a>
        </div>

        <div class="footer-col">
          <h4>${currentLang === 'ar' ? 'العيادة والتواصل' : 'Hospital & Contact'}</h4>
          <a href="${DOCTOR.mapsUrl}" target="_blank" rel="noopener noreferrer">📍 ${currentLang === 'ar' ? 'مغربي طريق المطار (Google Maps)' : 'Airport Road, Madinah (Maps)'}</a>
          <a href="tel:${DOCTOR.callCenter}">📞 ${currentLang === 'ar' ? 'الرقم الموحد: ' : 'Call Center: '}${DOCTOR.callCenter}</a>
          <a href="${whatsappUrl()}" target="_blank" rel="noopener noreferrer">💬 WhatsApp (${DOCTOR.whatsapp})</a>
          <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener noreferrer">🌐 ${currentLang === 'ar' ? 'بوابة الحجز الإلكتروني' : 'Online Booking'}</a>
        </div>
      </div>

      <div class="medical-disclaimer" style="background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.1);color:#94A3B8;margin-bottom:var(--space-6);">
        <strong style="color:var(--gold);">⚖️ ${currentLang === 'ar' ? 'إخلاء مسؤولية طبي معتمد:' : 'Medical Disclaimer:'}</strong>
        ${currentLang === 'ar'
          ? 'المحتوى العلمي والمواد التثقيفية المنشورة على هذا الموقع مخصصة حصرياً للتوعية الطبية العامة، ولا تُعد بأي حال من الأحوال بديلاً عن الكشف الإكلينيكي المباشر والتشخيص العيني الدقيق لدى الطبيب الاستشاري.'
          : 'Content published on this website is for educational and awareness purposes only and does not substitute for personalized clinical examination and medical diagnosis by an ophthalmologist.'}
      </div>

      <div class="footer-bottom">
        <p>© ${new Date().getFullYear()} ${currentLang === 'ar' ? DOCTOR.nameAr : DOCTOR.nameEn} — ${currentLang === 'ar' ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'}</p>
        <div>
          <a href="${DOCTOR.magrabiProfile}" target="_blank" rel="noopener noreferrer">${currentLang === 'ar' ? 'الملف الطبي في مغربي' : 'Magrabi Profile'}</a> ·
          <a href="${DOCTOR.taibahProfile}" target="_blank" rel="noopener noreferrer">${currentLang === 'ar' ? 'ملف جامعة طيبة' : 'Taibah University Profile'}</a> ·
          <a href="${DOCTOR.mapsUrl}" target="_blank" rel="noopener noreferrer">Google Maps</a>
        </div>
      </div>
    </div>
  </footer>`;
}

// --- FIXED MOBILE BOOKING BAR ---
function renderBookingBar() {
  return `
  <div class="booking-bar" id="booking-bar">
    <div class="booking-bar-inner">
      <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
        ${currentLang === 'ar' ? 'احجز موعداً' : 'Book Exam'}
      </a>
      <a href="${whatsappUrl()}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
        💬 WhatsApp
      </a>
      <a href="${DOCTOR.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
        📍 Maps
      </a>
    </div>
  </div>`;
}

// --- INTERACTIVE ACTIONS & HANDLERS ---

window.toggleLang = function() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  qStep = 0; qAnswers = []; qDone = false; activeArticle = null;
  render();
  window.scrollTo(0, 0);
};

window.scrollToSection = function(id) {
  const el = document.getElementById(id);
  if (el) {
    const headerH = document.getElementById('site-header')?.offsetHeight || 74;
    const y = el.getBoundingClientRect().top + window.scrollY - headerH - 12;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};

window.toggleMobileMenu = function() {
  document.getElementById('mobile-nav')?.classList.toggle('open');
};

window.closeMobileMenu = function() {
  document.getElementById('mobile-nav')?.classList.remove('open');
};

window.setSimMode = function(mode) {
  simMode = mode;
  render();
  scrollToSection('simulator');
};

window.setDefocusDiopter = function(val) {
  defocusDiopter = parseFloat(val);
  const container = document.getElementById('sim-viewport');
  if (container && simMode === 'defocus') {
    container.innerHTML = renderDefocusCurve(simLens, defocusDiopter);
  } else {
    render();
  }
};

window.toggleSimGlasses = function() {
  simGlassesOn = !simGlassesOn;
  render();
  scrollToSection('simulator');
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
  const wrap = document.getElementById('sim-active-wrap');
  const line = document.getElementById('sim-divider-line');
  if (wrap) wrap.style.width = val + '%';
  if (line) line.style.left = val + '%';
};

window.resetSimSlider = function() {
  window.updateSimSlider(50);
  const input = document.querySelector('.sim-slider-input');
  if (input) input.value = 50;
};

window.selectQOption = function(idx) {
  qAnswers[qStep] = idx;
  render();
  scrollToSection('questionnaire');
};

window.nextQStep = function() {
  if (qAnswers[qStep] === undefined) return;
  if (qStep < 3) {
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
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
      } else {
        header.style.boxShadow = 'none';
      }
    }
  }, { passive: true });
}

// Initial Mount
render();
