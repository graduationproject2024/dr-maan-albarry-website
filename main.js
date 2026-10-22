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
let simScene = 'night';
let simLens = 'trifocal';
let simSliderPos = 50; // percentage
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

// --- VISION SIMULATOR (OVERHAULED CONSOLE) ---
function renderSimulator() {
  const currentScene = SCENES[simScene];
  const currentLens = LENSES[simLens];

  return `
  <section class="simulator-section" id="simulator">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${currentLang === 'ar' ? 'أداة بصرية استرشادية تعليمية معتمدة' : 'Accredited Educational Tool'}</div>
        <h2>${currentLang === 'ar' ? 'محاكي الرؤية التفاعلي: عِش التجربة البصرية وقارن بين خيارات العدسات' : 'Interactive Vision Simulator & Comparative Lens Optics'}</h2>
        <p>${currentLang === 'ar' ? 'أداة رقمية توضيحية لتوضيح الفارق المتوقع في جودة الرؤية، وتشتت الأضواء الليلية، ومدى الاستقلالية عن النظارات الطبية بعد زراعة العدسات الذكية الحديثة (IOL).' : 'Explore how vision behaves across real daily tasks and inspect the optical characteristics of modern intraocular lenses.'}</p>
      </div>

      <div class="sim-chassis fade-in">
        <!-- Top Toolbar: Scene Selector -->
        <div class="sim-top-bar">
          <div class="sim-scene-tabs">
            <button class="sim-scene-tab ${simScene === 'night' ? 'active' : ''}" onclick="setSimScene('night')">
              <span>🚗</span>
              <span>${currentLang === 'ar' ? 'القيادة الليلية (المدينة المنورة)' : 'Night Driving (Madinah)'}</span>
            </button>
            <button class="sim-scene-tab ${simScene === 'phone' ? 'active' : ''}" onclick="setSimScene('phone')">
              <span>📱</span>
              <span>${currentLang === 'ar' ? 'الهاتف والمسافات القريبة (40 سم)' : 'Smartphone (40 cm)'}</span>
            </button>
            <button class="sim-scene-tab ${simScene === 'quran' ? 'active' : ''}" onclick="setSimScene('quran')">
              <span>📖</span>
              <span>${currentLang === 'ar' ? 'المصحف الشريف والقراءة المكتبية' : 'Quran & Book Reading'}</span>
            </button>
          </div>

          <div style="display:flex;align-items:center;gap:var(--space-2);">
            <button onclick="resetSimSlider()" class="btn btn-sm" style="background:#162236;color:#E2E8F0;border:1px solid #243550;">
              ${currentLang === 'ar' ? 'إعادة ضبط المنصف' : 'Center Slider'}
            </button>
          </div>
        </div>

        <!-- Interactive Split-View Viewport Canvas -->
        <div class="sim-viewport-frame" id="sim-viewport">
          <!-- Layer 1: Baseline View (Underneath / Cataract condition) -->
          <div class="sim-layer-base">
            ${renderSimSceneContent(simScene, 'cataract')}
          </div>

          <!-- Layer 2: Simulated Lens View (Clipped by slider handle) -->
          <div class="sim-layer-active-wrap" id="sim-active-wrap" style="width: ${simSliderPos}%;">
            <div style="position:absolute;inset:0;width:100%;height:100%;">
              ${renderSimSceneContent(simScene, simLens)}
            </div>
          </div>

          <!-- Slider Range Input for smooth mouse / touch interaction -->
          <input type="range" min="0" max="100" value="${simSliderPos}" class="sim-slider-input" oninput="updateSimSlider(this.value)" aria-label="Compare baseline vs simulated lens">

          <!-- Draggable Divider Line & Badge -->
          <div class="sim-slider-line" id="sim-divider-line" style="left: ${simSliderPos}%;">
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
        </div>

        <!-- Lens Selection Pills Bar -->
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
            ? 'هذا المحاكي مخصص للأغراض التثقيفية والاسترشادية العامة فقط، ولا يُعد بأي حال من الأحوال وسيلة تشخيصية أو تنبؤاً قطعياً بالنتيجة الجراحية الفردية. تعتمد النتيجة الفعلية لكل مريض على عوامل بيولوجية وفسيولوجية متعددة تشمل الفحص الطبوغرافي الشامل للقرنية (Pentacam)، وقياسات طول العين بالموجات الضوئية (Optical Biometry - IOL Master)، وسلامة الشبكية والعصب البصري.'
            : 'This simulator is strictly an educational tool illustrating optical principles. It does not replace a clinical consultation or predict exact postoperative visual acuity, which is determined by individual optical biometry, corneal tomography, macular health, and neuroadaptation.'}
        </div>
      </div>
    </div>
  </section>`;
}

function renderSimSceneContent(sceneId, lensId) {
  if (sceneId === 'night') {
    // Uses real photographic references downloaded locally
    const imgUrl = (lensId === 'cataract') ? '/images/sim-driving-cataract.jpg' : '/images/sim-driving-clear.jpg';
    let filterStyle = 'none';
    if (lensId === 'monofocal') filterStyle = 'contrast(1.05)';
    else if (lensId === 'edof') filterStyle = 'contrast(1.0)';
    else if (lensId === 'trifocal') filterStyle = 'none';

    return `
      <div style="width:100%;height:100%;background-image:url('${imgUrl}');background-size:cover;background-position:center;filter:${filterStyle};"></div>
    `;
  }

  // Realistic Smartphone Reading Scene with Near Blur Simulation
  if (sceneId === 'phone') {
    const isCataract = lensId === 'cataract';
    const isMonofocal = lensId === 'monofocal';
    const isEdof = lensId === 'edof';
    const blurAmount = isCataract ? 'blur(4px) contrast(0.6)' : (isMonofocal ? 'blur(2.8px) contrast(0.85)' : (isEdof ? 'blur(0.8px)' : 'none'));

    return `
    <div style="width:100%;height:100%;background:#1E2430;display:flex;align-items:center;justify-content:center;filter:${blurAmount};">
      <div style="width:310px;height:420px;background:#0F172A;border-radius:32px;border:3px solid #334155;padding:12px;box-shadow:0 16px 32px rgba(0,0,0,0.5);display:flex;flex-direction:column;">
        <div style="height:32px;background:#641B2D;border-radius:18px 18px 4px 4px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700;">
          ${currentLang === 'ar' ? 'عيادة د. معن البري — مغربي' : 'Dr. Maan Al Barry Clinic — Magrabi'}
        </div>
        <div style="flex:1;background:#F8FAFC;border-radius:6px;padding:14px;color:#1E293B;font-family:sans-serif;margin-top:8px;display:flex;flex-direction:column;gap:10px;">
          <div style="background:#E2E8F0;padding:10px;border-radius:10px;font-size:12px;line-height:1.6;">
            <strong>${currentLang === 'ar' ? 'موعد فحص العيون والقرنية:' : 'Eye & Cornea Evaluation:'}</strong><br>
            ${currentLang === 'ar' ? 'طريق المطار، المدينة المنورة' : 'Airport Road, Madinah'}
          </div>
          <div style="background:#FFFFFF;border:1px solid #CBD5E1;padding:12px;border-radius:10px;font-size:13px;line-height:1.7;">
            <p style="font-weight:700;color:#641B2D;margin-bottom:4px;">${currentLang === 'ar' ? 'اختبار قراءة الخطوط الدقيقة' : 'Fine Print Acuity Test'}</p>
            <p style="font-size:11.5px;color:#334155;">
              ${currentLang === 'ar' ? 'القدرة على تصفح الرسائل وقراءة الخط الصغير براحة تامة دون إجهاد العين.' : 'Testing clear reading of smartphone text and messaging comfortably without eye strain.'}
            </p>
            <p style="font-size:9.5px;color:#94A3B8;margin-top:6px;">Line N6 / 20/30 Near Acuity Target</p>
          </div>
        </div>
      </div>
    </div>`;
  }

  // Realistic Quran & Printed Book Scene with Near Acuity Simulation
  const isCataract = lensId === 'cataract';
  const isMonofocal = lensId === 'monofocal';
  const isEdof = lensId === 'edof';
  const blurAmount = isCataract ? 'blur(4.5px) contrast(0.55) sepia(0.3)' : (isMonofocal ? 'blur(2.6px)' : (isEdof ? 'blur(1.2px)' : 'none'));

  return `
  <div style="width:100%;height:100%;background:#DCD3BE;display:flex;align-items:center;justify-content:center;filter:${blurAmount};">
    <div style="width:640px;height:380px;background:#FCF9F0;border:2px solid #B8A88E;border-radius:8px;padding:24px;display:flex;gap:24px;box-shadow:0 12px 28px rgba(0,0,0,0.25);">
      <!-- Right Page -->
      <div style="flex:1;border-inline-end:1px solid #D5C7B0;padding-inline-end:16px;text-align:center;">
        <h4 style="font-size:16px;color:#641B2D;margin-bottom:8px;font-family:serif;">
          ${currentLang === 'ar' ? 'المصحف الشريف والقراءة اليومية' : 'Reading & Classical Typography'}
        </h4>
        <p style="font-size:13px;color:#1E293B;line-height:2.1;font-family:serif;">
          ${currentLang === 'ar'
            ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ — الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ الرَّحْمَٰنِ الرَّحِيمِ مَالِكِ يَوْمِ الدِّينِ'
            : 'In the name of God, the Most Gracious, the Most Merciful. Praise be to God, Lord of the worlds.'}
        </p>
        <p style="font-size:11px;color:#64748B;margin-top:12px;line-height:1.7;">
          ${currentLang === 'ar' ? 'وضوح علامات التشكيل وحركات الإعراب بدقة دون إجهاد أو ضبابية.' : 'High contrast resolution for Arabic calligraphy, fine diacritics, and printed script.'}
        </p>
      </div>
      <!-- Left Page -->
      <div style="flex:1;padding-inline-start:16px;text-align:center;">
        <h4 style="font-size:15px;color:#C5A46D;margin-bottom:8px;font-family:serif;">
          ${currentLang === 'ar' ? 'د. معن بن عبدالله البري' : 'Dr. Maan Al Barry'}
        </h4>
        <p style="font-size:12px;color:#334155;line-height:1.9;">
          ${currentLang === 'ar' ? 'استشاري جراحة الماء الأبيض وتصحيح الإبصار والقرنية — مستشفيات ومراكز مغربي للعيون بالمدينة المنورة.' : 'Consultant Ophthalmologist — Cataract & Refractive Surgery, Magrabi Health Madinah.'}
        </p>
        <div style="margin-top:24px;display:flex;flex-direction:column;gap:8px;">
          ${[1, 2, 3, 4].map(() => `<div style="height:8px;background:#E2D7C3;border-radius:2px;width:100%;"></div>`).join('')}
        </div>
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
