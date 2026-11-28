// Vision simulator — UI strings (Arabic first; English mirror). Clinical wording pending review by Dr. Maan.
export const STRINGS = {
  ar: {
    region: 'محاكي الرؤية التعليمي',
    disclaimer: 'رسم توضيحي تثقيفي — ليس توقعاً لرؤيتك؛ سيقدّم لك جرّاحك المشورة.',
    lens: 'العدسة',
    compare: 'قارن بين عدستين',
    compareWith: 'قارن مع',
    distance: 'مسافة النظر',
    lighting: 'الإضاءة',
    eye: 'إعدادات العين (اختياري)',
    scenario: 'موقف يومي',
    more: 'إعدادات إضافية',
    reset: 'إعادة الضبط',
    wholeScene: 'المشهد كاملاً',
    // 2026-11-28 — pending physician review (N-09): the lens wording describes ~40 cm; beyond it no level is claimed
    neutralLevel: (lens, dist) => `${lens}: تُظهر الصورة الوضوح المحسوب لهذه العدسة على ${dist}؛ اسأل جرّاحك عمّا تتوقعه.`,
    closeNote: (obj) => `عرض أقرب: الصورة اقتربت من ${obj} فقط. نموذج العدسة ودرجة الوضوح لم يتغيّرا.`,
    closeAnnounce: (obj) => `عرض أقرب: ${obj}`,
    groupCompare: 'المقارنة بين العدسات',
    groupWhere: 'الموقف والمسافة',
    changed: 'مُعدّلة',
    otherLenses: 'أنواع أخرى من العدسات',
    edofPlain: 'ممتدة المدى',
    toricSwitch: 'لابؤرية (Toric): تصحيح الانحراف اللابؤري',
    toricNote: 'العدسة اللابؤرية تصحح الانحراف اللابؤري (الاستجماتيزم) في القرنية، وتتوفر بالتصاميم الأحادية والممتدة والثلاثية. تفترض الصورة انحرافاً لابؤرياً متوسطاً (١٫٥ ديوبتر) لإظهار ما تصححه؛ ولا تُحسّن الرؤية في عين بلا انحراف.',
    loading: 'جارٍ تحميل الصورة التوضيحية…',
    retry: 'إعادة المحاولة',
    exam: 'يُختار نوع العدسة بعد الفحص والقياسات ومناقشة أولوياتك مع الطبيب.',
    exactDistance: 'مسافة دقيقة',
    seeing: 'ماذا ترى في الصورة؟',
    clarity: 'ما مدى الوضوح على كل مسافة؟',
    clarityNote: 'الأشرطة نسبية من النموذج للمقارنة بين العدسات فقط، وليست قياساً لحدة الإبصار.',
    limitsTitle: 'ما لا تستطيع الصورة إظهاره',
    questionsTitle: 'أسئلة لطبيبك',
    enlarge: 'تكبير الصورة',
    shrink: 'إغلاق العرض المكبّر',
    rotateHint: 'أدر هاتفك أفقياً لصورة أكبر.',
    customView: 'إعداد مخصص (اختر موقفاً للعودة)',
    catSeeing: 'الساد يعرض للمقارنة فقط: تشتت الضوء في العدسة الطبيعية المعتمة يسبب ضبابية ووهجاً واصفراراً للألوان.',
    astig: 'استجماتيزم القرنية',
    axis: 'محور الاستجماتيزم',
    sphere: 'قصر أو طول نظر متبقٍّ',
    none: 'لا يوجد',
    lenses: {
      monofocal: { name: 'العدسة الأحادية', short: 'أحادية' },
      enhanced: { name: 'العدسة الأحادية المطورة', short: 'أحادية مطورة' },
      edof: { name: 'العدسة ممتدة المدى (EDOF)', short: 'ممتدة' },
      multifocal: { name: 'متعددة البؤر (ثنائية البؤرة)', short: 'متعددة البؤر' },
      trifocal: { name: 'العدسة الثلاثية', short: 'ثلاثية' },
      toric: { name: 'الأحادية اللابؤرية (Toric)', short: 'أحادية لابؤرية' },
      cataract: { name: 'الساد قبل العملية', short: 'ساد' },
    },
    // 'screen' (50 cm) added 2026-11-26 — label pending physician review (14_CLINICAL_REVIEW_PACKAGE.md, N-09)
    presets: { near: 'قريب', screen: 'شاشة', intermediate: 'متوسط', distance: 'بعيد' },
    presetShort: {},
    presetDist: { near: '٤٠ سم', screen: '٥٠ سم', intermediate: '٦٥ سم', distance: '٦ م+' },
    objects: { near: 'الهاتف', intermediate: 'الحاسوب', distance: 'اللوحة المرورية' },
    lights: { day: 'نهار', dusk: 'خافتة', night: 'ليل' },
    sharpness: 'مؤشر الوضوح',
    sharpnessNote: 'مؤشر نسبي من النموذج (١ = عدسة أحادية في بؤرتها)، وليس قياساً لحدة الإبصار.',
    model: 'قيم النموذج (تقريبية)',
    pupil: 'قطر البؤبؤ المفترض',
    defocus: 'عدم التركيز عند الهدف',
    blur: 'زاوية التشويش',
    halo: 'مؤشر الهالات (نسبي)',
    contrast: 'مؤشر التباين (نسبي)',
    intended: 'المدى المصمَّم له',
    tradeoffs: 'الموازنات',
    how: 'كيف تعمل هذه المحاكاة؟',
    divider: 'خط المقارنة بين العدستين',
    viewerLabel: (a, b) => (b ? `مقارنة بين ${a} و${b}` : `محاكاة الرؤية بعدسة ${a}`),
    announce: (lens, dist, band, light, b) => `${lens}${b ? ` مقابل ${b}` : ''}. ${dist}، ${band}. ${light}.`,
    restoring: 'توقّف العرض مؤقتاً بسبب إعادة ضبط الرسوميات. جارٍ الاستعادة…',
    restored: 'استؤنف العرض.',
    fallbackTitle: 'العرض ثلاثي الأبعاد غير متاح على هذا الجهاز',
    fallbackIntro: 'بدلاً منه: مقارنة ثابتة مبنية على النموذج نفسه. المنحنى يوضح شكل «منحنى عدم التركيز» لكل عدسة: كلما ارتفع الخط كانت الصورة أوضح عند تلك المسافة.',
    chartTitle: 'شكل منحنى عدم التركيز (توضيحي)',
    chartX: 'المسافة',
    chartY: 'الوضوح النسبي',
    qual: { sharp: 'واضح غالباً', soft: 'أقل وضوحاً', blur: 'مشوّش غالباً' },
    cm: 'سم', m: 'م', D: 'ديوبتر', mm: 'مم', arcmin: 'دقيقة قوسية',
    howBody: [
      'تُرسم المشاهد بثلاث طبقات عمق: الهاتف (قريب)، الحاسوب (متوسط)، والشارع (بعيد). تُحسب لكل طبقة درجة عدم التركيز بالديوبتر = (١ ÷ المسافة بالمتر) − بؤرة العدسة.',
      'زاوية التشويش ≈ قطر البؤبؤ × عدم التركيز. البؤبؤ أوسع في الإضاءة المنخفضة، لذلك يزداد التشويش والهالات ليلاً.',
      'العدسات متعددة البؤر تقسم الضوء بين عدة بؤر، فتُرى صورة واضحة وأخرى مشوّشة في الوقت نفسه؛ لذلك يقل التباين وتظهر هالات حول الأضواء.',
      'القيم مستوحاة من أشكال منحنيات منشورة في الأبحاث، وليست نتائج منتج بعينه، ولم يتم التحقق منها سريرياً.',
      'لا تعكس المحاكاة التكيّف العصبي، ولا قياسات عينك، ولا صحة الشبكية أو سطح العين.',
    ],
  },
  en: {
    region: 'Educational vision simulator',
    disclaimer: 'Educational illustration — not a prediction of your vision; your surgeon will advise.',
    lens: 'Lens',
    compare: 'Compare two lenses',
    compareWith: 'Compare with',
    distance: 'Viewing distance',
    lighting: 'Lighting',
    eye: 'Eye settings (optional)',
    scenario: 'Everyday situation',
    more: 'More settings',
    reset: 'Reset',
    wholeScene: 'Whole scene',
    // 2026-11-28 — pending physician review (N-09): the lens wording describes ~40 cm; beyond it no level is claimed
    neutralLevel: (lens, dist) => `${lens}: the picture shows this lens's modelled sharpness at ${dist}; ask your surgeon what to expect.`,
    closeNote: (obj) => `Closer view: the picture only moved nearer to the ${obj}. The lens model and its sharpness did not change.`,
    closeAnnounce: (obj) => `Closer view: ${obj}`,
    groupCompare: 'Compare lenses',
    groupWhere: 'Situation and distance',
    changed: 'changed',
    otherLenses: 'Other lens types',
    edofPlain: 'Extended range',
    toricSwitch: 'Toric: astigmatism correction',
    toricNote: 'A toric lens corrects corneal astigmatism and comes in monofocal, extended-range and trifocal designs. The picture assumes moderate astigmatism (1.5 D) to show what it corrects; in an eye without astigmatism it adds nothing.',
    loading: 'Loading the picture…',
    retry: 'Try again',
    exam: 'The lens type is chosen after examination, measurements and a conversation about your priorities.',
    exactDistance: 'Exact distance',
    seeing: 'What are you seeing?',
    clarity: 'How clear is each distance?',
    clarityNote: 'The bars are relative model values for comparing lenses only, not a measure of visual acuity.',
    limitsTitle: 'What the picture cannot show',
    questionsTitle: 'Questions for your doctor',
    enlarge: 'Enlarge view',
    shrink: 'Close large view',
    rotateHint: 'Turn your phone sideways for a larger picture.',
    customView: 'Custom settings (choose a situation to go back)',
    catSeeing: 'Cataract is shown for comparison only: light scatter in the cloudy natural lens causes haze, glare and faded colours.',
    astig: 'Corneal astigmatism',
    axis: 'Astigmatism axis',
    sphere: 'Leftover short- or long-sightedness',
    none: 'None',
    lenses: {
      monofocal: { name: 'Standard monofocal', short: 'Monofocal' },
      enhanced: { name: 'Enhanced monofocal', short: 'Enhanced' },
      edof: { name: 'Extended depth of focus (EDOF)', short: 'EDOF' },
      multifocal: { name: 'Multifocal (two-focus)', short: 'Multifocal' },
      trifocal: { name: 'Trifocal', short: 'Trifocal' },
      toric: { name: 'Monofocal toric', short: 'Mono toric' },
      cataract: { name: 'Cataract (before surgery)', short: 'Cataract' },
    },
    // 'screen' (50 cm) added 2026-11-26 — label pending physician review (14_CLINICAL_REVIEW_PACKAGE.md, N-09)
    presets: { near: 'Near', screen: 'Screen', intermediate: 'Intermediate', distance: 'Far' },
    presetShort: { intermediate: 'Mid' }, // shown only when the four-button row is narrow
    presetDist: { near: '40 cm', screen: '50 cm', intermediate: '65 cm', distance: '6 m+' },
    objects: { near: 'phone', intermediate: 'laptop', distance: 'road sign' },
    lights: { day: 'Day', dusk: 'Dim', night: 'Night' },
    sharpness: 'Sharpness index',
    sharpnessNote: 'A relative model index (1 = a monofocal lens in focus), not a measure of visual acuity.',
    model: 'Model values (approximate)',
    pupil: 'Assumed pupil',
    defocus: 'Defocus at target',
    blur: 'Blur angle',
    halo: 'Halo index (relative)',
    contrast: 'Contrast index (relative)',
    intended: 'Designed for',
    tradeoffs: 'Trade-offs',
    how: 'How does this simulation work?',
    divider: 'Comparison divider between the two lenses',
    viewerLabel: (a, b) => (b ? `Comparison of ${a} and ${b}` : `Simulated view with a ${a} lens`),
    announce: (lens, dist, band, light, b) => `${lens}${b ? ` versus ${b}` : ''}. ${dist}, ${band}. ${light}.`,
    restoring: 'The display paused because the graphics were reset. Restoring…',
    restored: 'Display restored.',
    fallbackTitle: '3D view is not available on this device',
    fallbackIntro: 'Instead: a static comparison from the same model. The chart shows the shape of each lens’s “defocus curve”: the higher the line, the clearer the image at that distance.',
    chartTitle: 'Defocus-curve shape (illustrative)',
    chartX: 'Distance',
    chartY: 'Relative sharpness',
    qual: { sharp: 'Usually clear', soft: 'Softer', blur: 'Usually blurred' },
    cm: 'cm', m: 'm', D: 'D', mm: 'mm', arcmin: 'arcmin',
    howBody: [
      'The view is drawn as three depth layers: the phone (near), the laptop (intermediate) and the street (distance). For each layer the defocus in dioptres = (1 ÷ distance in metres) − the lens focus.',
      'Blur angle ≈ pupil diameter × defocus. Pupils are larger in low light, so blur and halos grow at night.',
      'Multifocal lenses split light between several foci, so a sharp and a blurred image are seen at the same time — contrast is lower and halos appear around lights.',
      'Values follow the shapes of defocus curves published in research. They are not any product’s results and have not been clinically validated.',
      'The simulation does not include neural adaptation, your own eye measurements, or the health of your retina and eye surface.',
    ],
  },
};

/** Neutral, non-promotional lens descriptions: intended range and trade-offs. */
export const LENS_INFO = {
  ar: {
    monofocal: { intended: 'رؤية واضحة لمسافة واحدة، غالباً البعيد.', tradeoffs: 'أقل هالات ليلية وأعلى تباين، لكن غالباً تلزم نظارة للقراءة والشاشات.' },
    enhanced: { intended: 'رؤية بعيدة مع رؤية متوسطة أفضل من الأحادية العادية؛ وتلزم نظارة للقريب (نحو ٤٠ سم) غالباً.', tradeoffs: 'لا تقسم الضوء بين بؤر منفصلة، فالهالات والتباين قريبة من الأحادية العادية؛ والمكسب في المسافة المتوسطة محدود.' },
    edof: { intended: 'مدى ممتد من البعيد إلى المسافات المتوسطة (الشاشات ولوحة القيادة).', tradeoffs: 'قد تلزم نظارة للقراءة الدقيقة؛ تباين أقل قليلاً وهالات خفيفة لدى بعض التصاميم.' },
    multifocal: { intended: 'بؤرتان: للبعيد وللقريب، لتقليل الحاجة لنظارة القراءة.', tradeoffs: 'انقسام الضوء يقلل التباين وقد يسبب هالات ووهجاً ليلاً، والمسافة المتوسطة قد تكون أضعف.' },
    trifocal: { intended: 'ثلاث بؤر: بعيد ومتوسط وقريب، لتقليل الحاجة إلى النظارة.', tradeoffs: 'انقسام الضوء يقلل التباين وقد يسبب هالات ووهجاً ليلاً، ويحتاج تكيّفاً.' },
    toric: { intended: 'تصحيح الانحراف اللابؤري (الاستجماتيزم) في القرنية مع العدسة الأحادية.', tradeoffs: 'تعتمد الفائدة على دقة محور العدسة وثباته؛ الدوران يقلل التصحيح.' },
    cataract: { intended: 'للمقارنة فقط: عدسة طبيعية معتمة قبل الجراحة.', tradeoffs: 'تشتت الضوء يسبب ضبابية ووهجاً واصفراراً للألوان، ولا تصححه النظارات بالكامل.' },
  },
  en: {
    monofocal: { intended: 'Clear vision at one distance, usually far.', tradeoffs: 'Fewest night halos and highest contrast; glasses are usually needed for reading and screens.' },
    enhanced: { intended: 'Distance vision with somewhat better intermediate vision than a standard monofocal; glasses are usually needed for near (about 40 cm).', tradeoffs: 'Light is not split into separate foci, so halos and contrast stay close to a standard monofocal; the intermediate gain is modest.' },
    edof: { intended: 'An extended range from distance to intermediate (screens, dashboard).', tradeoffs: 'Reading glasses may be needed for fine print; slightly lower contrast and mild halos with some designs.' },
    multifocal: { intended: 'Two foci — distance and near — to reduce reliance on reading glasses.', tradeoffs: 'Splitting light lowers contrast and can cause halos and glare at night; intermediate distance may be weaker.' },
    trifocal: { intended: 'Three foci — distance, intermediate and near — to reduce reliance on glasses.', tradeoffs: 'Splitting light lowers contrast and can cause halos and glare at night; adaptation takes time.' },
    toric: { intended: 'Corrects corneal astigmatism with the chosen focus (shown here: monofocal).', tradeoffs: 'The benefit depends on accurate, stable lens alignment; rotation reduces the correction.' },
    cataract: { intended: 'For comparison only: a cloudy natural lens before surgery.', tradeoffs: 'Light scatter causes haze, glare and faded colours; glasses cannot fully correct it.' },
  },
};

// Toric versions of each focusing design ('edof-toric' …): the design's name and texts + the astigmatism correction.
for (const lg of ['ar', 'en']) {
  const L = STRINGS[lg].lenses, I = LENS_INFO[lg];
  for (const b of ['enhanced', 'edof', 'trifocal']) {
    L[`${b}-toric`] = lg === 'ar' ? { name: `${L[b].name} اللابؤرية (Toric)`, short: `${L[b].short} لابؤرية` } : { name: `${L[b].name} – toric`, short: `${L[b].short} toric` };
    I[`${b}-toric`] = { intended: `${I[b].intended} ${lg === 'ar' ? 'مع تصحيح الانحراف اللابؤري في القرنية.' : 'Plus correction of corneal astigmatism.'}`, tradeoffs: `${I[b].tradeoffs} ${I.toric.tradeoffs}` };
  }
  L['monofocal-toric'] = L.toric; I['monofocal-toric'] = I.toric;
}

export function fmt(lang, n, digits = 0) {
  try {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
  } catch {
    return n.toFixed(digits);
  }
}

export function formatDistance(lang, m) {
  const s = STRINGS[lang];
  if (m >= 5.95) return lang === 'ar' ? `${fmt(lang, 6)} ${s.m}+` : `6 ${s.m}+`;
  if (m >= 1) return `${fmt(lang, m, 1)} ${s.m}`;
  return `${fmt(lang, Math.round(m * 100))} ${s.cm}`;
}
