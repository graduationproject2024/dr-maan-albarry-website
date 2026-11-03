// Bilingual content for "How Vision Works: Interactive Light Journey".
// Plain-language patient education. Medical review: pending Dr. Maan.
// Sources are general patient-education pages from the US National Eye Institute (NEI) and the American Academy
// of Ophthalmology (AAO).

const NEI_HOW = { label: 'NEI: How the eyes work', url: 'https://www.nei.nih.gov/learn-about-eye-health/healthy-vision/how-eyes-work' };
const AAO_PARTS = { label: 'AAO: Parts of the eye', url: 'https://www.aao.org/eye-health/anatomy/parts-of-eye' };
const NEI_KC = { label: 'NEI: Keratoconus', url: 'https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/keratoconus' };
const NEI_REFR = { label: 'NEI: Refractive errors', url: 'https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/refractive-errors' };
const NEI_CAT = { label: 'NEI: Cataracts', url: 'https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/cataracts' };
const NEI_AMD = { label: 'NEI: Age-related macular degeneration', url: 'https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/age-related-macular-degeneration' };

export const UI = {
  en: {
    kicker: 'How vision works',
    title: 'The journey of light',
    lede: 'Follow light from the world to your brain, one part of the eye at a time. Use the steps, the arrow keys, or tap a part of the eye.',
    prev: 'Previous', next: 'Next',
    step: 'Step', of: 'of',
    steps: 'Steps of the journey',
    light: 'Light level', dim: 'Dim', bright: 'Bright',
    focus: 'Looking at', far: 'Far', near: 'Near',
    illustrative: 'Illustrative',
    illustrativeNote: 'Light rays are illustrative and not to scale.',
    role: 'Its role',
    wrong: 'When something goes wrong',
    sources: 'Sources',
    readAll: 'Read the whole journey as text',
    disclaimer: 'An educational illustration. It does not replace an eye examination.',
    diagram: 'Diagram of light travelling through the eye',
    announce: (n, t, s) => `Step ${n} of ${t}: ${s.name}. ${s.role}`
  },
  ar: {
    kicker: 'كيف نرى',
    title: 'رحلة الضوء',
    lede: 'تتبّع الضوء من العالم حتى دماغك، جزءًا بعد جزء من العين. استخدم الخطوات أو مفاتيح الأسهم، أو المس جزءًا من العين.',
    prev: 'السابق', next: 'التالي',
    step: 'الخطوة', of: 'من',
    steps: 'خطوات الرحلة',
    light: 'مستوى الإضاءة', dim: 'خافت', bright: 'ساطع',
    focus: 'النظر إلى', far: 'بعيد', near: 'قريب',
    illustrative: 'توضيحي',
    illustrativeNote: 'أشعة الضوء توضيحية وليست بمقياس حقيقي.',
    role: 'دوره',
    wrong: 'عندما يحدث خلل',
    sources: 'المصادر',
    readAll: 'اقرأ الرحلة كاملة نصًّا',
    disclaimer: 'رسم تعليمي لا يغني عن فحص العين.',
    diagram: 'رسم يوضّح مسار الضوء داخل العين',
    announce: (n, t, s) => `الخطوة ${n} من ${t}: ${s.name}. ${s.role}`
  }
};

// part = the diagram structure highlighted by the step (also the click target that selects it).
export const STEPS = [
  {
    id: 'light', part: 'scene',
    en: {
      name: 'Light',
      title: 'Light enters from the world',
      body: 'Everything you see begins as light. Light from the sun or a lamp bounces off the objects around you, and some of it travels towards your eyes.',
      role: 'Vision starts with light reflected from objects.'
    },
    ar: {
      name: 'الضوء',
      title: 'الضوء يأتي من العالم من حولك',
      body: 'كل ما تراه يبدأ بالضوء. ينعكس ضوء الشمس أو المصباح عن الأشياء من حولك، ويتّجه جزء منه نحو عينيك.',
      role: 'تبدأ الرؤية بالضوء المنعكس عن الأشياء.'
    },
    wrong: [], sources: [NEI_HOW]
  },
  {
    id: 'tear', part: 'tear',
    en: {
      name: 'Tear film',
      title: 'A smooth, clear tear film',
      body: 'The first surface light meets is not the cornea but a very thin layer of tears. Each blink spreads it evenly, keeping the front of the eye smooth, moist and clear so the image stays sharp.',
      role: 'Keeps the first optical surface smooth and clear.'
    },
    ar: {
      name: 'الغشاء الدمعي',
      title: 'غشاء دمعي أملس وصافٍ',
      body: 'أول سطح يلتقي به الضوء ليس القرنية، بل طبقة رقيقة جدًا من الدموع. تنشرها كل رمشة بالتساوي، فتُبقي مقدمة العين ملساء ورطبة وصافية لتبقى الصورة واضحة.',
      role: 'يحافظ على نعومة السطح البصري الأول وصفائه.'
    },
    wrong: [], sources: [AAO_PARTS]
  },
  {
    id: 'cornea', part: 'cornea',
    en: {
      name: 'Cornea',
      title: 'The cornea does most of the focusing',
      body: 'The cornea is the clear, dome-shaped window at the front of the eye. Because of its curve, it bends incoming light more than any other part of the eye: about two-thirds of the eye’s total focusing power.',
      role: 'The main refraction: it bends light the most.'
    },
    ar: {
      name: 'القرنية',
      title: 'القرنية تقوم بمعظم التركيز',
      body: 'القرنية هي النافذة الشفافة المقبّبة في مقدمة العين. وبفضل انحنائها تكسر الضوء الداخل أكثر من أي جزء آخر في العين، إذ تؤدي نحو ثلثي قدرة العين الكلية على التركيز.',
      role: 'الانكسار الرئيسي: تكسر الضوء أكثر من غيرها.'
    },
    wrong: [
      { slug: 'keratoconus-cxl', en: 'If the cornea thins and bulges into a cone: keratoconus and cross-linking', ar: 'إذا ترقّقت القرنية وبرزت على شكل مخروط: القرنية المخروطية وتثبيتها' },
      { slug: 'laser-vision-correction', en: 'If its curve focuses light in the wrong place: laser vision correction', ar: 'إذا كان انحناؤها يركّز الضوء في غير مكانه: تصحيح النظر بالليزر' }
    ],
    sources: [AAO_PARTS, NEI_KC, NEI_REFR]
  },
  {
    id: 'aqueous', part: 'aqueous',
    en: {
      name: 'Aqueous humour',
      title: 'A clear fluid fills the front chamber',
      body: 'Behind the cornea, light crosses the aqueous humour, a clear, watery fluid that is constantly made and drained. It nourishes the cornea and lens and keeps the eye’s shape and pressure steady.',
      role: 'A clear path that also nourishes and holds the eye’s pressure.'
    },
    ar: {
      name: 'الخلط المائي',
      title: 'سائل صافٍ يملأ الحجرة الأمامية',
      body: 'خلف القرنية يعبر الضوء الخلط المائي، وهو سائل صافٍ يُفرَز ويُصرَّف باستمرار. يغذّي القرنية والعدسة ويحافظ على شكل العين وثبات ضغطها.',
      role: 'مسار صافٍ يغذّي العين ويحفظ ضغطها.'
    },
    wrong: [], sources: [AAO_PARTS]
  },
  {
    id: 'iris', part: 'iris',
    en: {
      name: 'Iris and pupil',
      title: 'The iris sets how much light gets in',
      body: 'The iris is the coloured ring of muscle around the pupil, the dark opening in the middle. In bright light it makes the pupil smaller; in dim light it opens it wider, much like a camera’s aperture. Try the light-level switch.',
      role: 'An adjustable aperture that controls the amount of light.'
    },
    ar: {
      name: 'القزحية والبؤبؤ',
      title: 'القزحية تحدّد كمية الضوء الداخل',
      body: 'القزحية هي الحلقة العضلية الملوّنة حول البؤبؤ، وهو الفتحة الداكنة في الوسط. في الضوء الساطع تُصغّر البؤبؤ، وفي الضوء الخافت توسّعه، تمامًا مثل فتحة عدسة الكاميرا. جرّب مفتاح مستوى الإضاءة.',
      role: 'فتحة متغيّرة تتحكم في كمية الضوء.'
    },
    wrong: [], sources: [NEI_HOW, AAO_PARTS]
  },
  {
    id: 'lens', part: 'lens',
    en: {
      name: 'Lens',
      title: 'The lens fine-tunes the focus',
      body: 'Behind the pupil, the clear lens adds the final focusing. To look at something close, tiny muscles let it become rounder (this is called accommodation); for distance it flattens again. Switch between far and near to see it change.',
      role: 'Accommodation: it adjusts the focus for near and far.'
    },
    ar: {
      name: 'العدسة',
      title: 'العدسة تضبط التركيز بدقة',
      body: 'خلف البؤبؤ تضيف العدسة الشفافة التركيز النهائي. عند النظر إلى شيء قريب، تسمح عضلات دقيقة لها بأن تصبح أكثر تحدّبًا (وهذا يُسمّى التكيّف)، وعند النظر إلى البعيد تعود أقل تحدّبًا. بدّل بين البعيد والقريب لترى التغيّر.',
      role: 'التكيّف: تضبط التركيز للقريب والبعيد.'
    },
    wrong: [
      { slug: 'cataract-surgery', en: 'If the lens becomes cloudy: cataract surgery', ar: 'إذا أصبحت العدسة معتمة: جراحة الماء الأبيض (الساد)' }
    ],
    sources: [NEI_HOW, NEI_CAT]
  },
  {
    id: 'vitreous', part: 'vitreous',
    en: {
      name: 'Vitreous',
      title: 'A clear gel keeps the path open',
      body: 'Light then crosses the vitreous, a clear jelly that fills most of the inside of the eye and helps hold its round shape. Small clumps in it can cast shadows that you may notice as floaters.',
      role: 'A clear path to the retina that holds the eye’s shape.'
    },
    ar: {
      name: 'الجسم الزجاجي',
      title: 'هلام صافٍ يُبقي الطريق مفتوحًا',
      body: 'ثم يعبر الضوء الجسم الزجاجي، وهو هلام صافٍ يملأ معظم داخل العين ويساعد على حفظ شكلها الكروي. وقد تُلقي تجمّعات صغيرة فيه ظلالًا تلاحظها على شكل عوائم.',
      role: 'مسار صافٍ إلى الشبكية يحفظ شكل العين.'
    },
    wrong: [], sources: [AAO_PARTS]
  },
  {
    id: 'retina', part: 'retina',
    en: {
      name: 'Retina and macula',
      title: 'The retina turns light into signals',
      body: 'The focused image lands, upside down, on the retina, the thin light-sensitive layer lining the back of the eye. Its photoreceptors turn light into electrical signals: rods work in dim light, and cones see colour and fine detail. The macula, at the centre, gives the sharp central vision you use to read and recognise faces.',
      role: 'Photoreceptors turn light into nerve signals.'
    },
    ar: {
      name: 'الشبكية والبقعة',
      title: 'الشبكية تحوّل الضوء إلى إشارات',
      body: 'تسقط الصورة المركّزة مقلوبة على الشبكية، وهي الطبقة الرقيقة الحسّاسة للضوء التي تبطّن مؤخرة العين. تحوّل مستقبلاتها الضوئية الضوء إلى إشارات كهربائية: تعمل العصي في الضوء الخافت، وترى المخاريط الألوان والتفاصيل الدقيقة. أما البقعة في المركز فتمنحك الرؤية المركزية الحادة التي تقرأ بها وتتعرّف على الوجوه.',
      role: 'المستقبلات الضوئية تحوّل الضوء إلى إشارات عصبية.'
    },
    wrong: [
      { slug: 'intravitreal-injections', en: 'If the macula is damaged by leaking blood vessels: intravitreal injections', ar: 'إذا تضرّرت البقعة بسبب أوعية دموية مسرّبة: الحقن داخل العين' }
    ],
    sources: [NEI_HOW, NEI_AMD]
  },
  {
    id: 'nerve', part: 'nerve',
    en: {
      name: 'Optic nerve and brain',
      title: 'The brain builds the picture',
      body: 'About a million nerve fibres gather into the optic nerve and carry the signals to the visual areas at the back of the brain. There the images from both eyes are combined, turned the right way up and recognised. This is the moment you “see”.',
      role: 'It carries the signals; the brain interprets them.'
    },
    ar: {
      name: 'العصب البصري والدماغ',
      title: 'الدماغ يكوّن الصورة',
      body: 'تتجمّع نحو مليون ليفة عصبية في العصب البصري وتنقل الإشارات إلى مناطق الإبصار في مؤخرة الدماغ. هناك تُدمج صورتا العينين وتُعدَّل لتصبح معتدلة ويُتعرَّف عليها. في هذه اللحظة أنت «ترى».',
      role: 'ينقل الإشارات، والدماغ يفسّرها.'
    },
    wrong: [], sources: [NEI_HOW]
  }
];

// Text equivalent of the current diagram state (used as the SVG's accessible description).
export function describe(state, lang) {
  const s = STEPS[state.step][lang];
  if (lang === 'ar') {
    const light = state.light === 'bright' ? 'ضوء ساطع، والبؤبؤ صغير' : 'ضوء خافت، والبؤبؤ متّسع';
    const focus = state.focus === 'near' ? 'النظر إلى شيء قريب، والعدسة أكثر تحدّبًا' : 'النظر إلى البعيد، والعدسة مسترخية';
    return `رسم توضيحي لأشعة ضوء تمرّ من شجرة عبر القرنية والبؤبؤ والعدسة لتتركّز على الشبكية، ثم تنتقل الإشارة عبر العصب البصري إلى الدماغ. الجزء المميَّز: ${s.name}. ${light}. ${focus}.`;
  }
  const light = state.light === 'bright' ? 'bright light, small pupil' : 'dim light, wide pupil';
  const focus = state.focus === 'near' ? 'looking at something near, lens rounder' : 'looking far away, lens relaxed';
  return `Illustration of light rays travelling from a tree through the cornea, pupil and lens to a focus on the retina, with the signal then carried by the optic nerve to the brain. Highlighted: ${s.name}. ${light[0].toUpperCase() + light.slice(1)}; ${focus}.`;
}
