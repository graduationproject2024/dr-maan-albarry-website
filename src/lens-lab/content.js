// ============================================================
// VISION & LENS LAB — bilingual lens-comparison content (Arabic first, English mirror).
// ------------------------------------------------------------
// Single source of truth for the lens comparison. Also read by src/vision-sim (questions for your doctor).
// Integrity rules (docs/phase-1/IOL_COMPARISON_REVIEW.md):
//   - no lens is declared better overall; every type is shown with advantages AND limitations;
//   - no outcome promises, no percentages, no success rates, no brand names;
//   - qualitative levels only (no acuity numbers); every level always has words next to it;
//   - patient considerations are framed as questions to discuss with the surgeon.
// Medical review status: DRAFT — pending review by Dr. Maan Albarry. Not physician-approved.
// Wording partly restored from git history (402bc49 / 0d167b7 renderIolGuide, VisionSim lens notes).
// ============================================================

export const REVIEW = Object.freeze({ status: 'draft', reviewer: null, reviewedOn: null });

/** Display order of the five lens categories. */
export const LENS_ORDER = Object.freeze(['monofocal', 'toric', 'edof', 'multifocal', 'trifocal']);

/** Lens-lab category → vision-simulator lens id (src/vision-sim/optics/params.js LENS_IDS). */
export const SIM_LENS = Object.freeze({ monofocal: 'monofocal', toric: 'toric', edof: 'edof', multifocal: 'multifocal', trifocal: 'trifocal' });

/** Comparison rows. Level 1–3 is how FAVOURABLE the row is for the patient (3 = most favourable). */
export const DIMENSIONS = Object.freeze(['distance', 'intermediate', 'near', 'glasses', 'halos', 'contrast']);

/**
 * Qualitative levels (no numbers are ever shown to patients; the level drives a 3-step indicator that always has
 * words next to it). Toric is rated as a MONOFOCAL toric in an eye with regular corneal astigmatism; toric versions
 * of the other designs follow those columns.
 */
export const LEVELS = Object.freeze({
  monofocal: Object.freeze({ distance: 3, intermediate: 1, near: 1, glasses: 1, halos: 3, contrast: 3 }),
  toric: Object.freeze({ distance: 3, intermediate: 1, near: 1, glasses: 1, halos: 3, contrast: 3 }),
  edof: Object.freeze({ distance: 3, intermediate: 3, near: 2, glasses: 2, halos: 2, contrast: 2 }),
  multifocal: Object.freeze({ distance: 3, intermediate: 2, near: 3, glasses: 2, halos: 1, contrast: 1 }),
  trifocal: Object.freeze({ distance: 3, intermediate: 3, near: 3, glasses: 3, halos: 1, contrast: 1 }),
});

/** Everyday situations; each maps to the comparison rows it depends on and to a vision-simulator scenario id. */
export const SCENARIO_ORDER = Object.freeze(['night-driving', 'phone', 'laptop', 'book', 'signs']);
export const SCENARIO_ROWS = Object.freeze({
  'night-driving': Object.freeze(['distance', 'halos', 'contrast']),
  phone: Object.freeze(['near']),
  laptop: Object.freeze(['intermediate']),
  book: Object.freeze(['near']),
  signs: Object.freeze(['distance']),
});

const AR = {
  kicker: 'مختبر الرؤية والعدسات',
  title: 'مقارنة أنواع العدسات المزروعة',
  lede: 'لا توجد عدسة واحدة هي الأفضل للجميع. لكل نوع مزايا وحدود، ويُختار النوع بعد الفحص والقياسات ومناقشة أولوياتك اليومية مع جرّاحك.',
  label: 'رسم توضيحي تثقيفي — ليس توقعاً لنتيجتك؛ سيقدّم لك جرّاحك المشورة.',
  limitsLink: 'حدود هذا النموذج',
  reviewStatus: 'حالة المراجعة الطبية: مسودة بانتظار مراجعة د. معن',
  // section titles
  tableTitle: 'المقارنة في لمحة',
  tableIntro: 'الأشرطة تقرأ بالطريقة نفسها في كل صف: كلما امتلأ الشريط كان الأمر أفضل لك (رؤية أوضح، هالات أقل، تباين أفضل، حاجة أقل للنظارة). الكلمات بجانب كل شريط هي الأهم.',
  tableCaption: 'مقارنة تثقيفية مبسطة بين خمسة أنواع من العدسات المزروعة',
  rowHead: 'الجانب',
  showLens: 'اختر نوعاً لعرض تفاصيله',
  toricNote: 'التوريك ليس تصميماً مستقلاً للتركيز: هو تصحيح للاستجماتيزم (عدم انتظام انحناء القرنية) يمكن إضافته إلى العدسة أحادية البؤرة أو ممتدة المدى أو متعددة البؤر أو ثلاثية البؤرة. القيم في عمود التوريك هنا لعدسة توريك أحادية البؤرة.',
  legend: { 3: 'ملائم غالباً', 2: 'متوسط أو يختلف', 1: 'محدود غالباً' },
  dims: {
    distance: { label: 'الرؤية البعيدة', hint: 'القيادة، اللوحات، التلفاز' },
    intermediate: { label: 'الرؤية المتوسطة', hint: 'الحاسوب، لوحة القيادة' },
    near: { label: 'الرؤية القريبة', hint: 'الهاتف، القراءة' },
    glasses: { label: 'الحاجة للنظارة بعد العملية', hint: '' },
    halos: { label: 'الهالات والوهج حول الأضواء ليلاً', hint: '' },
    contrast: { label: 'التباين', hint: 'وضوح التفاصيل الباهتة وفي الإضاءة الخافتة' },
  },
  rows: { what: 'ما هي؟', pros: 'المزايا', cons: 'الحدود', ask: 'أسئلة تناقشها مع جرّاحك' },
  // compare-two
  compareTitle: 'قارن بين عدستين',
  compareIntro: 'اختر عدستين ثم موقفاً يومياً. ستظهر صورة توضيحية للعدستين جنباً إلى جنب، ثم الفروق الأساسية بينهما.',
  pickA: 'العدسة الأولى',
  pickB: 'العدسة الثانية',
  differences: 'الفروق الأساسية',
  noDifference: 'لا يختلف النوعان في هذه المقارنة المبسطة. الفرق الحقيقي يحدده فحص عينك.',
  same: 'متشابهة',
  differs: 'مختلفة',
  scenarioTitle: 'اختر موقفاً يومياً',
  inThisSituation: 'في هذا الموقف',
  simTitle: 'كيف قد تبدو الصورة؟',
  simHelp: 'الجهة اليمنى من الصورة تمثل العدسة الأولى (أ)، واليسرى العدسة الثانية (ب). اسحب الخط الفاصل أو استخدم الأسهم لتحريكه.',
  simLoading: 'جارٍ تحميل الصورة التوضيحية…',
  simLater: 'ستظهر الصورة التوضيحية عند الوصول إلى هذا الجزء.',
  simFailed: 'تعذّر عرض الصورة التوضيحية على هذا الجهاز. المقارنة المكتوبة أعلاه تبقى صحيحة.',
  toricAssumption: 'لإظهار عمل عدسة التوريك، تفترض الصورة أن في القرنية استجماتيزماً متوسطاً. العدسة غير التوريكية في المقارنة لا تصححه.',
  sameLens: 'اخترت النوع نفسه مرتين؛ تم تبديل العدسة الأخرى.',
  // advanced
  advanced: 'تفاصيل متقدمة: افتراضات النموذج',
  advIntro: 'هذه القيم من نموذج بصري مبسط وليست قياسات لعينك.',
  advPupil: 'قطر البؤبؤ المفترض في هذا الموقف',
  advDistance: 'مسافة النظر في هذا الموقف',
  advDefocus: 'عدم التركيز عند هذه المسافة',
  advDefocusNote: 'عدم التركيز = (١ ÷ المسافة بالمتر) − بؤرة العدسة الأقرب. كلما زاد، زاد التشويش؛ والبؤبؤ الأوسع يزيده أكثر.',
  advAssumptions: [
    'عين بلا قدرة على التكيّف (بعد إزالة العدسة الطبيعية)، ومركزية تماماً، دون أمراض أخرى.',
    'التشويش محسوب هندسياً: زاوية التشويش ≈ قطر البؤبؤ × عدم التركيز. هذا يبالغ قليلاً في التشويش عند الفروق الصغيرة.',
    'البؤبؤ لشخص في الستينات أو السبعينات: نحو ٣ مم نهاراً و٤ مم عند الغروب و٥ مم ليلاً.',
    'العدسات متعددة البؤر تُمثَّل بعدة صور في الوقت نفسه، لكل منها نصيب من الضوء. هذه أشكال عامة وليست منتجات بعينها.',
    'ممتدة المدى تُمثَّل بسلسلة بؤر متقاربة حتى نحو ١٫٥ ديوبتر، وثلاثية البؤرة ببؤر عند نحو ٦٦ سم و٤٠ سم.',
  ],
  // limitations
  limitsTitle: 'ما لا تستطيع هذه المقارنة إخبارك به',
  limits: [
    'لا تتنبأ بنتيجة عينك. النتيجة تعتمد على قياسات عينك وصحة الشبكية والقرنية وسطح العين.',
    'لا تُظهر تكيّف الدماغ مع الوقت، وهو يخفف الهالات لدى كثير من الناس.',
    'التصاميم داخل النوع الواحد تختلف كثيراً؛ المقارنة هنا عامة ومبسطة.',
    'الصورة على شاشتك أصغر من الواقع، لذا فالمهم هو الفرق النسبي بين العدستين لا درجة الوضوح نفسها.',
    'لم يتم التحقق من النموذج سريرياً، وهو بانتظار مراجعة د. معن.',
  ],
  generalQuestionsTitle: 'أسئلة عامة مفيدة لأي عدسة',
  generalQuestions: [
    'ما الأنشطة الأهم لي يومياً: القيادة، القراءة، الشاشات، العمل في إضاءة خافتة؟',
    'هل في عيني ما يجعل نوعاً معيناً أقل ملاءمة لي (الشبكية، القرنية، جفاف العين، الجلوكوما)؟',
    'لأي المهام سأحتاج النظارة غالباً بعد العملية؟',
    'هل لدي استجماتيزم يستفيد من عدسة توريك؟',
  ],
  sourcesTitle: 'المصادر',
  sourcesNote: 'كُتب النص بلغة مبسطة من هذه المصادر ولم يُنقل منها حرفياً. الإصدارات التي تحمل علامة «دراسة» ملخصات أبحاث وليست توصيات.',
  lenses: {
    monofocal: {
      name: 'أحادية البؤرة', short: 'أحادية', code: 'Monofocal',
      what: 'تركيز واضح على مسافة واحدة، غالباً البعيدة.',
      levels: {
        distance: 'واضحة غالباً (عند ضبطها للبعيد)',
        intermediate: 'تحتاج نظارة غالباً',
        near: 'تحتاج نظارة قراءة غالباً',
        glasses: 'للقراءة غالباً، وأحياناً للحاسوب',
        halos: 'الأقل احتمالاً بين هذه الأنواع (وقد تحدث)',
        contrast: 'الأفضل حفظاً غالباً بين هذه الأنواع',
      },
      pros: ['أعلى تباين وأقل هالات ليلية بين هذه الأنواع غالباً.', 'تصميم بسيط ومجرَّب منذ زمن طويل.', 'يمكن ضبطها للبعيد، أو للقريب، أو بأسلوب الرؤية الأحادية (عين للبعيد وأخرى للقريب).'],
      cons: ['تلزم النظارة غالباً للقراءة وكثيراً للحاسوب.', 'لا تصحح الاستجماتيزم إلا إذا كانت بنسخة توريك.'],
      ask: ['على أي مسافة ستُضبط العدسة؟ وهل تناسبني الرؤية الأحادية؟', 'ما النظارات التي سأحتاجها غالباً بعد العملية؟', 'هل لدي استجماتيزم يحتاج نسخة توريك؟'],
    },
    toric: {
      name: 'توريك (لتصحيح الاستجماتيزم)', short: 'توريك', code: 'Toric',
      what: 'تصحح الاستجماتيزم الناتج عن عدم انتظام انحناء القرنية، ويمكن دمجها مع أي تصميم آخر.',
      levels: {
        distance: 'واضحة غالباً عند تصحيح الاستجماتيزم',
        intermediate: 'تحتاج نظارة غالباً (في النسخة أحادية البؤرة)',
        near: 'تحتاج نظارة قراءة غالباً (في النسخة أحادية البؤرة)',
        glasses: 'كالعدسة أحادية البؤرة، مع حاجة أقل لتصحيح الاستجماتيزم بالنظارة',
        halos: 'كالتصميم المدمجة معه (هنا: الأقل)',
        contrast: 'كالتصميم المدمجة معه (هنا: الأفضل حفظاً غالباً)',
      },
      pros: ['تقلل التشويش الناتج عن الاستجماتيزم المنتظم.', 'متوفرة بتصاميم أحادية وممتدة المدى ومتعددة البؤر.', 'قد تقلل الحاجة لنظارة تصحيح الاستجماتيزم.'],
      cons: ['تعتمد الفائدة على دقة محور العدسة وثباته؛ دوران العدسة يقلل التصحيح وقد يحتاج تعديلاً.', 'لا تناسب الاستجماتيزم غير المنتظم (مثل القرنية المخروطية أو الندبات) عادةً.', 'تحتاج قياسات دقيقة للقرنية قبل العملية.'],
      ask: ['كم درجة الاستجماتيزم لدي، وهل هو منتظم؟', 'ماذا يحدث لو دارت العدسة بعد العملية؟', 'مع أي تصميم ستكون عدسة التوريك: أحادية أم ممتدة المدى أم متعددة البؤر؟'],
    },
    edof: {
      name: 'ممتدة المدى (EDOF)', short: 'ممتدة المدى', code: 'EDOF',
      what: 'نطاق رؤية ممتد من البعيد إلى المتوسط بدل بؤرة واحدة.',
      levels: {
        distance: 'واضحة غالباً',
        intermediate: 'جيدة غالباً؛ صُممت لهذا المدى',
        near: 'تلزم نظارة للخط الصغير غالباً',
        glasses: 'غالباً للقراءة الدقيقة فقط',
        halos: 'ممكنة؛ وتوصف غالباً بأنها أخف من متعددة البؤر، مع اختلاف الدراسات',
        contrast: 'أقل قليلاً من أحادية البؤرة في بعض التصاميم',
      },
      pros: ['رؤية متوسطة جيدة للشاشات ولوحة القيادة مع رؤية بعيدة واضحة غالباً.', 'تقسيم الضوء فيها أقل من العدسات متعددة البؤر.', 'قد تقل الحاجة للنظارة في الأنشطة اليومية.'],
      cons: ['قد تلزم نظارة للقراءة الدقيقة.', 'تباين أقل قليلاً وهالات خفيفة لدى بعض التصاميم.', 'التصاميم تختلف كثيراً تحت هذا الاسم.'],
      ask: ['هل سأحتاج نظارة للخط الصغير أو للهاتف؟', 'كيف قد تؤثر في القيادة ليلاً بالنسبة لي؟', 'أي تصميم من هذا النوع يناسب عيني؟'],
    },
    multifocal: {
      name: 'متعددة البؤر (ثنائية البؤرة)', short: 'متعددة البؤر', code: 'Multifocal',
      what: 'تقسم الضوء بين بؤرتين: للبعيد وللقريب.',
      levels: {
        distance: 'واضحة غالباً؛ وقد تبدو أقل حدة في الإضاءة الخافتة',
        intermediate: 'أضعف غالباً من القريب والبعيد؛ وتختلف بحسب التصميم',
        near: 'ممكنة دون نظارة غالباً، مع إضاءة جيدة',
        glasses: 'أقل غالباً، وقد تلزم لبعض المهام',
        halos: 'أكثر احتمالاً، خاصة ليلاً',
        contrast: 'أقل، خاصة في الإضاءة الخافتة',
      },
      pros: ['قد تقلل الحاجة لنظارة القراءة.', 'رؤية للبعيد وللقريب بعدسة واحدة.'],
      cons: ['انقسام الضوء يقلل التباين وقد يسبب هالات ووهجاً ليلاً.', 'الرؤية المتوسطة (الحاسوب) قد تكون أضعف.', 'يحتاج الدماغ وقتاً للتكيّف، ولا يتكيف الجميع بالقدر نفسه.'],
      ask: ['كيف قد تؤثر الهالات في قيادتي ليلاً؟', 'هل صحة عيني (الشبكية، القرنية، جفاف العين) مناسبة لعدسة تقسم الضوء؟', 'هل سأحتاج نظارة لمسافة الحاسوب؟'],
    },
    trifocal: {
      name: 'ثلاثية البؤرة', short: 'ثلاثية', code: 'Trifocal',
      what: 'نوع من متعددة البؤر يقسم الضوء بين ثلاث بؤر: البعيد والمتوسط والقريب.',
      levels: {
        distance: 'واضحة غالباً؛ وقد تبدو أقل حدة في الإضاءة الخافتة',
        intermediate: 'جيدة غالباً؛ فيها بؤرة لهذا المدى',
        near: 'ممكنة دون نظارة غالباً',
        glasses: 'أقل غالباً لمعظم المسافات، دون ضمان',
        halos: 'أكثر احتمالاً، خاصة ليلاً',
        contrast: 'أقل، خاصة في الإضاءة الخافتة',
      },
      pros: ['قد تقلل الحاجة للنظارة على مسافات متعددة.', 'بؤرة مخصصة للمسافة المتوسطة إضافة إلى البعيد والقريب.'],
      cons: ['انقسام الضوء بين ثلاث بؤر يقلل التباين وقد يسبب هالات ووهجاً ليلاً.', 'يحتاج الدماغ وقتاً للتكيّف، ولا يتكيف الجميع بالقدر نفسه.', 'قد تكون أقل ملاءمة مع بعض أمراض العين.'],
      ask: ['كم أقود ليلاً أو أعمل في إضاءة خافتة، وكيف يؤثر ذلك في الاختيار؟', 'كم يستغرق التكيّف عادةً، وماذا لو لم أتكيف؟', 'هل لدي حالة في العين تجعل هذا النوع أقل ملاءمة لي؟'],
    },
  },
  scenarios: {
    'night-driving': { label: 'القيادة ليلاً', sub: 'لوحة على ٦ م، إضاءة ليلية', detail: 'النظر إلى لوحة مرورية على بعد ٦ أمتار ليلاً. البؤبؤ أوسع في الظلام، لذلك تظهر الهالات حول الأضواء ونقص التباين بوضوح أكبر.' },
    phone: { label: 'قراءة الهاتف', sub: 'نحو ٣٥ سم', detail: 'قراءة شاشة هاتف على بعد نحو ٣٥ سم، وهي المسافة المعتادة لحمل الهاتف.' },
    laptop: { label: 'العمل على الحاسوب', sub: 'نحو ٦٦ سم', detail: 'النظر إلى شاشة حاسوب محمول على بعد نحو ٦٦ سم، وهي قريبة من مسافة لوحة القيادة في السيارة.' },
    book: { label: 'قراءة كتاب', sub: 'نحو ٤٠ سم', detail: 'القراءة على بعد نحو ٤٠ سم. في الصورة يمثّل الهاتفُ الصفحةَ المطبوعة.' },
    signs: { label: 'اللوحات البعيدة', sub: '٦ م، نهاراً', detail: 'قراءة لوحة مرورية على بعد ٦ أمتار في ضوء النهار.' },
  },
};

const EN = {
  kicker: 'Vision & Lens Lab',
  title: 'Comparing lens implant types',
  lede: 'No single lens is best for everyone. Each type has advantages and limitations, and the choice is made after your examination, measurements and a conversation with your surgeon about your daily priorities.',
  label: 'Educational illustration — not a prediction of your result; your surgeon will advise.',
  limitsLink: 'Model limitations',
  reviewStatus: 'Medical review status: draft pending review by Dr. Maan',
  tableTitle: 'At a glance',
  tableIntro: 'The bars read the same way in every row: a fuller bar is more favourable for you (clearer vision, fewer halos, better contrast, less need for glasses). The words next to each bar matter most.',
  tableCaption: 'A simplified educational comparison of five types of lens implant',
  rowHead: 'Aspect',
  showLens: 'Choose a type to see its details',
  toricNote: 'Toric is not a separate focusing design: it is a correction for astigmatism (an uneven curve of the cornea) that can be added to a monofocal, EDOF, multifocal or trifocal lens. The toric column here describes a monofocal toric lens.',
  legend: { 3: 'Usually favourable', 2: 'Moderate or varies', 1: 'Usually limited' },
  dims: {
    distance: { label: 'Distance vision', hint: 'driving, signs, TV' },
    intermediate: { label: 'Intermediate vision', hint: 'computer, dashboard' },
    near: { label: 'Near vision', hint: 'phone, reading' },
    glasses: { label: 'Glasses after surgery', hint: '' },
    halos: { label: 'Halos and glare around lights at night', hint: '' },
    contrast: { label: 'Contrast', hint: 'faint detail and dim light' },
  },
  rows: { what: 'What it is', pros: 'Advantages', cons: 'Limitations', ask: 'Questions to discuss with your surgeon' },
  compareTitle: 'Compare two lenses',
  compareIntro: 'Choose two lenses, then an everyday situation. An illustration shows the two lenses side by side, followed by the key differences.',
  pickA: 'First lens',
  pickB: 'Second lens',
  differences: 'Key differences',
  noDifference: 'These two types do not differ in this simplified comparison. The real difference depends on your eye examination.',
  same: 'Similar',
  differs: 'Different',
  scenarioTitle: 'Choose an everyday situation',
  inThisSituation: 'In this situation',
  simTitle: 'How might it look?',
  simHelp: 'The left side of the picture shows the first lens (A) and the right side the second lens (B). Drag the dividing line, or use the arrow keys, to move it.',
  simLoading: 'Loading the illustration…',
  simLater: 'The illustration appears when you reach this part.',
  simFailed: 'The illustration cannot be shown on this device. The written comparison above still applies.',
  toricAssumption: 'To show what a toric lens does, the picture assumes a moderate amount of corneal astigmatism. The non-toric lens in the comparison does not correct it.',
  sameLens: 'You chose the same type twice, so the other lens was swapped.',
  advanced: 'Advanced details: model assumptions',
  advIntro: 'These values come from a simplified optical model. They are not measurements of your eye.',
  advPupil: 'Assumed pupil in this situation',
  advDistance: 'Viewing distance in this situation',
  advDefocus: 'Defocus at this distance',
  advDefocusNote: 'Defocus = (1 ÷ distance in metres) − the nearest focus of the lens. The larger it is, the more blur; a wider pupil adds more.',
  advAssumptions: [
    'An eye with no focusing ability of its own (the natural lens has been removed), perfectly centred, with no other disease.',
    'Blur is computed geometrically: blur angle ≈ pupil diameter × defocus. This slightly overstates blur for small amounts of defocus.',
    'Pupil sizes are for someone in their sixties or seventies: about 3 mm by day, 4 mm at dusk and 5 mm at night.',
    'Lenses that split light are shown as several images at once, each with a share of the light. These are generic shapes, not specific products.',
    'EDOF is modelled as a series of close foci up to about 1.5 dioptres; the trifocal has foci at about 66 cm and 40 cm.',
  ],
  limitsTitle: 'What this comparison cannot tell you',
  limits: [
    'It does not predict your own result. That depends on your eye measurements and the health of your retina, cornea and eye surface.',
    'It does not show how the brain adapts over time, which reduces halos for many people.',
    'Designs within one type differ a lot; this comparison is general and simplified.',
    'The picture on your screen is smaller than real life, so what matters is the difference between the two lenses, not how sharp each looks.',
    'The model has not been clinically validated and is pending review by Dr. Maan.',
  ],
  generalQuestionsTitle: 'Useful questions for any lens',
  generalQuestions: [
    'Which activities matter most to me day to day: driving, reading, screens, work in dim light?',
    'Is there anything about my eyes that makes one type less suitable (retina, cornea, dry eye, glaucoma)?',
    'For which tasks am I likely to still need glasses after surgery?',
    'Do I have astigmatism that a toric lens could correct?',
  ],
  sourcesTitle: 'Sources',
  sourcesNote: 'The text was written in plain language from these sources, not copied from them. Items marked “study” summarise research and are not recommendations.',
  lenses: {
    monofocal: {
      name: 'Monofocal', short: 'Monofocal', code: 'Monofocal',
      what: 'Clear focus at one distance, usually far.',
      levels: {
        distance: 'Usually clear (when set for distance)',
        intermediate: 'Glasses usually needed',
        near: 'Reading glasses usually needed',
        glasses: 'Usually for reading, often for the computer',
        halos: 'Least likely of these types (can still occur)',
        contrast: 'Usually the best preserved of these types',
      },
      pros: ['Usually the highest contrast and fewest night halos of these types.', 'A simple design with a long track record.', 'Can be set for distance, for near, or as monovision (one eye for distance, the other for near).'],
      cons: ['Glasses are usually needed for reading and often for the computer.', 'Does not correct astigmatism unless it is a toric version.'],
      ask: ['Which distance will my lens be set for? Could monovision suit me?', 'Which glasses am I likely to need afterwards?', 'Do I have astigmatism that needs a toric version?'],
    },
    toric: {
      name: 'Toric (astigmatism correction)', short: 'Toric', code: 'Toric',
      what: 'Corrects astigmatism caused by an uneven curve of the cornea, and can be combined with any other design.',
      levels: {
        distance: 'Usually clear once astigmatism is corrected',
        intermediate: 'Glasses usually needed (monofocal version)',
        near: 'Reading glasses usually needed (monofocal version)',
        glasses: 'As for monofocal, with less need for astigmatism-correcting glasses',
        halos: 'As for the design it is combined with (here: least likely)',
        contrast: 'As for the design it is combined with (here: usually best preserved)',
      },
      pros: ['Reduces the blur caused by regular astigmatism.', 'Available in monofocal, EDOF and multifocal designs.', 'May reduce the need for glasses that correct astigmatism.'],
      cons: ['The benefit depends on accurate, stable alignment; if the lens rotates, the correction falls and it may need repositioning.', 'Usually not suitable for irregular astigmatism (for example keratoconus or corneal scars).', 'Needs precise corneal measurements before surgery.'],
      ask: ['How much astigmatism do I have, and is it regular?', 'What happens if the lens rotates after surgery?', 'Which design will the toric lens have: monofocal, EDOF or multifocal?'],
    },
    edof: {
      name: 'Extended depth of focus (EDOF)', short: 'EDOF', code: 'EDOF',
      what: 'An extended range of focus from distance to intermediate, rather than a single point.',
      levels: {
        distance: 'Usually clear',
        intermediate: 'Usually good; designed for this range',
        near: 'Glasses often needed for small print',
        glasses: 'Often only for fine print',
        halos: 'Possible; often described as milder than multifocal designs, though studies differ',
        contrast: 'Slightly lower than monofocal with some designs',
      },
      pros: ['Good intermediate vision for screens and the dashboard, usually with clear distance vision.', 'Splits light less than multifocal lenses.', 'May reduce the need for glasses in daily activities.'],
      cons: ['Reading glasses may be needed for fine print.', 'Slightly lower contrast and mild halos with some designs.', 'Designs sold under this name differ a lot.'],
      ask: ['Will I need glasses for small print or my phone?', 'How might it affect my night driving?', 'Which design of this type suits my eye?'],
    },
    multifocal: {
      name: 'Multifocal (two-focus)', short: 'Multifocal', code: 'Multifocal',
      what: 'Splits light between two foci: one for distance and one for near.',
      levels: {
        distance: 'Usually clear; may look less crisp in dim light',
        intermediate: 'Often weaker than near or distance; varies by design',
        near: 'Often possible without glasses, in good light',
        glasses: 'Often less needed; some tasks may still need them',
        halos: 'More likely, especially at night',
        contrast: 'Lower, especially in dim light',
      },
      pros: ['May reduce the need for reading glasses.', 'Distance and near focus in one lens.'],
      cons: ['Splitting light lowers contrast and can cause halos and glare at night.', 'Intermediate vision (computer) may be weaker.', 'The brain needs time to adapt, and not everyone adapts to the same degree.'],
      ask: ['How might halos affect my night driving?', 'Is my eye health (retina, cornea, dry eye) suited to a lens that splits light?', 'Will I need glasses for computer distance?'],
    },
    trifocal: {
      name: 'Trifocal', short: 'Trifocal', code: 'Trifocal',
      what: 'A type of multifocal that splits light between three foci: distance, intermediate and near.',
      levels: {
        distance: 'Usually clear; may look less crisp in dim light',
        intermediate: 'Usually good; has a focus for this range',
        near: 'Often possible without glasses',
        glasses: 'Often less needed at most distances; not guaranteed',
        halos: 'More likely, especially at night',
        contrast: 'Lower, especially in dim light',
      },
      pros: ['May reduce the need for glasses at several distances.', 'A dedicated intermediate focus as well as distance and near.'],
      cons: ['Splitting light three ways lowers contrast and can cause halos and glare at night.', 'The brain needs time to adapt, and not everyone adapts to the same degree.', 'May be less suitable with some eye conditions.'],
      ask: ['How much do I drive at night or work in dim light, and how does that affect the choice?', 'How long does adaptation usually take, and what if I do not adapt?', 'Do I have an eye condition that makes this type less suitable for me?'],
    },
  },
  scenarios: {
    'night-driving': { label: 'Night driving', sub: 'sign at 6 m, at night', detail: 'Looking at a road sign 6 metres away at night. The pupil is wider in the dark, so halos around lights and lower contrast show more.' },
    phone: { label: 'Reading a phone', sub: 'about 35 cm', detail: 'Reading a phone screen about 35 cm away, the distance at which most people hold a phone.' },
    laptop: { label: 'Laptop work', sub: 'about 66 cm', detail: 'Looking at a laptop screen about 66 cm away, close to the distance of a car dashboard.' },
    book: { label: 'Reading a book', sub: 'about 40 cm', detail: 'Reading at about 40 cm. In the picture, the phone stands in for the printed page.' },
    signs: { label: 'Distance signs', sub: '6 m, daylight', detail: 'Reading a road sign 6 metres away in daylight.' },
  },
};

export const CONTENT = Object.freeze({ ar: AR, en: EN });

/**
 * Sources (checked 2026-11-02). `kind`: patient = patient information; reference = professional reference;
 * study = peer-reviewed research summary (shown as evidence, not as a recommendation).
 */
export const SOURCES = Object.freeze([
  { id: 'aao-iol', kind: 'patient', label: 'American Academy of Ophthalmology (EyeSmart) — Intraocular lenses (IOL) for cataract surgery', url: 'https://www.aao.org/eye-health/diseases/cataracts-iol-implants', usedFor: 'Definitions of monofocal, multifocal, EDOF and toric lenses.' },
  { id: 'eyewiki-pciol', kind: 'reference', label: 'EyeWiki (AAO) — Presbyopia-correcting IOLs', url: 'https://eyewiki.org/Presbyopia-Correcting_IOLs', usedFor: 'Bifocal vs trifocal designs, intermediate vision, halos and glare, contrast.' },
  { id: 'eyewiki-edof', kind: 'reference', label: 'EyeWiki (AAO) — Extended depth of focus IOLs', url: 'https://eyewiki.org/Extended_Depth_of_Focus_IOLs', usedFor: 'How EDOF differs from multifocal; design variety; photic phenomena possible with both.' },
  { id: 'eyewiki-toric', kind: 'reference', label: 'EyeWiki (AAO) — Toric IOLs', url: 'https://eyewiki.org/Toric_IOLs', usedFor: 'Regular vs irregular astigmatism, toric versions of other designs, rotation reducing the effect.' },
  { id: 'cochrane-2016', kind: 'study', label: 'de Silva SR et al. Multifocal versus monofocal intraocular lenses after cataract extraction. Cochrane Database Syst Rev 2016 (CD003169)', url: 'https://www.cochrane.org/CD003169/EYES_multifocal-versus-monofocal-intraocular-lenses-after-cataract-extraction', usedFor: 'Similar distance vision; better near vision and less spectacle use with multifocals; more halos and glare (low-certainty evidence).' },
  { id: 'liu-2019', kind: 'study', label: 'Liu J, Dong Y, Wang Y. Efficacy and safety of extended depth of focus IOLs in cataract surgery: a systematic review and meta-analysis. BMC Ophthalmol 2019;19:198', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6719364/', usedFor: 'EDOF: intermediate better than monofocal; near between monofocal and trifocal; contrast and halos vs monofocal and trifocal.' },
  { id: 'karam-2023', kind: 'study', label: 'Karam M et al. Extended depth of focus versus trifocal for intraocular lens implantation: an updated systematic review and meta-analysis. Am J Ophthalmol 2023;251:52–70', url: 'https://doi.org/10.1016/j.ajo.2023.01.024', usedFor: 'Trifocal better at near, EDOF better at intermediate on the defocus curve; no significant difference in halos and glare.' },
  { id: 'nhs-cataract', kind: 'patient', label: 'NHS — Cataract surgery', url: 'https://www.nhs.uk/conditions/cataract-surgery/', usedFor: 'Glasses may still be needed for reading or distance after surgery.' },
]);

/** Convenience: localised content for a language (Arabic fallback). */
export const contentFor = (lang) => CONTENT[lang === 'en' ? 'en' : 'ar'];
