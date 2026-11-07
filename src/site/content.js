// ============================================================
// SITE CONTENT (Phase 1) — bilingual copy for the homepage and the section pages.
// Doctor FACTS never live here: they are read from doctor-data.js. This file holds patient-education
// wording and page copy only. Everything is general education, pending review by Dr. Maan
// (see docs/phase-1/CONTENT_PRESERVATION_MATRIX.md and INFORMATION_ARCHITECTURE.md for provenance).
//
// Restored from earlier revisions, reworded where the matrix requires it:
//   GUIDES        R0 `ARTICLES` (93465a6) — without the incision size, "no stitches", "zero pain", the exact
//                 duration, the device brand name, and the "medically supervised" byline (matrix §3 #5, #6, #15, #19).
//   QUESTIONNAIRE R0 answer-driven result (93465a6 `QUESTIONNAIRE.results` + `renderQuestionnaireResult`),
//                 rewritten in neutral wording (no lens is "preferred"; tests/phase0-content.spec.js PREFERENCE).
//   VISIT         R5 `steps` (a255d39) "Your visit" pathway; generic assessments without device brands.
//   AREAS         R5 `areas` (a255d39) specialty descriptions, used on /about/.
//   BIO           R5 `.bio-lede` / `.bio-body` (a255d39) — facts only from doctor-data.js.
//   DISCLAIMER    R0 `footer.disclaimerText` (93465a6) emergency sentence, merged into the footer.
// ============================================================

/** Four headed guides (education library). `slug` = the procedure page with the full detail. */
export const GUIDES = [
  {
    id: 'cataract-guide', slug: 'cataract-surgery', minutes: 3,
    title: { ar: 'ما هي المياه البيضاء (الساد)، ومتى تصبح الجراحة مناسبة؟', en: 'What is a cataract, and when is surgery considered?' },
    summary: {
      ar: 'إعتام تدريجي يصيب عدسة العين الطبيعية مع التقدم في العمر، لا يُعالج بالأدوية، وتُناقش الجراحة عندما يبدأ ضعف الرؤية بالتأثير في حياتك اليومية.',
      en: 'A gradual, usually age-related clouding of the eye’s natural lens. Medicines do not clear it; surgery is discussed once blurred vision starts to affect daily life.'
    },
    sections: {
      ar: [
        ['ما هو إعتام عدسة العين؟', 'المياه البيضاء ليست غشاءً ينمو فوق سطح العين، بل عتامة تدريجية في العدسة الطبيعية الشفافة الموجودة داخل العين خلف البؤبؤ. تؤدي هذه العتامة إلى تشتت الضوء الداخل إلى الشبكية، فتظهر ضبابية الرؤية وبهتان الألوان وصعوبة القيادة ليلاً بسبب الوهج.'],
        ['متى تُناقش العملية؟', 'لا تتطلب المياه البيضاء الجراحة فور اكتشافها في أغلب الحالات. المعيار الأساسي هو مدى تأثير ضعف النظر على أنشطتك اليومية مثل القراءة وقيادة السيارة والتعرف على وجوه الأشخاص، ويحدد الطبيب التوقيت بعد الفحص.'],
        ['كيف تُجرى الجراحة الحديثة؟', 'تُجرى عملية الفاكو (Phacoemulsification) عبر فتحة صغيرة، حيث تُفتَّت العدسة المعتمة بالموجات فوق الصوتية وتُشفط، ثم تُزرع مكانها عدسة صناعية قابلة للطي، غالباً تحت تخدير موضعي. تختلف التفاصيل بحسب حالة كل عين.']
      ],
      en: [
        ['Understanding cataracts', 'A cataract is not a film over the eye, but a gradual clouding of the clear natural lens inside the eye, behind the pupil. The clouding scatters the light reaching the retina, which causes blurred vision, washed-out colours and glare around lights at night.'],
        ['When is surgery considered?', 'Cataract surgery is rarely urgent. The main guide is whether reduced vision interferes with your daily activities, such as reading, driving or recognising faces; your doctor advises on timing after an examination.'],
        ['How modern surgery is done', 'Phacoemulsification is performed through a small incision: ultrasound breaks up the clouded lens, which is removed, and a foldable artificial lens is placed in its position, usually under local anaesthesia. The details depend on each eye.']
      ]
    }
  },
  {
    id: 'keratoconus-guide', slug: 'keratoconus-cxl', minutes: 3,
    title: { ar: 'القرنية المخروطية: الأعراض والتشخيص وتثبيت القرنية (CXL)', en: 'Keratoconus: symptoms, diagnosis and corneal cross-linking (CXL)' },
    summary: {
      ar: 'حالة يرقّ فيها نسيج القرنية ويتحدّب تدريجياً، وغالباً ما تبدأ في سن الشباب. يساعد التشخيص المبكر على مناقشة خيارات إبطاء تطورها.',
      en: 'A condition in which the cornea thins and bulges over time, often starting in young people. Early diagnosis opens the discussion about slowing it down.'
    },
    sections: {
      ar: [
        ['ما هي القرنية المخروطية؟', 'القرنية هي النافذة الشفافة الأمامية للعين. في القرنية المخروطية يضعف نسيجها وتبرز تدريجياً لتأخذ شكلاً مخروطياً، مما يسبب استجماتيزماً غير منتظم وتغيراً متكرراً في قياسات النظارة، خاصة لدى الشباب والمراهقين.'],
        ['أهمية التشخيص المبكر', 'يساعد التصوير الطبقي للقرنية على اكتشاف الحالة قبل ظهور علامات واضحة بالفحص العادي. يُنصح كل من يلاحظ تغيراً متكرراً في مقاس النظارة أو يفرك عينيه باستمرار بمراجعة طبيب العيون لإجراء هذا الفحص.'],
        ['تثبيت القرنية (CXL)', 'إجراء يهدف إلى تقوية الروابط بين ألياف القرنية باستخدام قطرات فيتامين ب2 (الريبوفلافين) مع الأشعة فوق البنفسجية، بهدف إبطاء تطور الحالة أو إيقافه. لا يعيد القرنية إلى شكلها الطبيعي، وتحدد الملاءمة بعد الفحص.']
      ],
      en: [
        ['What is keratoconus?', 'The cornea is the clear front window of the eye. In keratoconus it weakens and gradually bulges into a cone shape, causing irregular astigmatism and frequent changes in glasses prescription, often in teenagers and young adults.'],
        ['Why early diagnosis matters', 'Corneal tomography can detect keratoconus before clear signs appear on a routine examination. Anyone whose prescription keeps changing, or who rubs their eyes habitually, should ask an eye doctor about this scan.'],
        ['Corneal cross-linking (CXL)', 'CXL uses riboflavin (vitamin B2) drops activated by ultraviolet light to strengthen the bonds between corneal fibres, aiming to slow or stop progression. It does not restore the normal corneal shape; suitability is decided after an examination.']
      ]
    }
  },
  {
    id: 'lasik-candidacy', slug: 'laser-vision-correction', minutes: 3,
    title: { ar: 'هل يناسبني تصحيح الإبصار بالليزر؟ (الليزك والفيمتو ليزك والليزر السطحي)', en: 'Is laser vision correction right for me? (LASIK, Femto-LASIK, PRK)' },
    summary: {
      ar: 'معايير الأمان الشائعة التي يراجعها الطبيب قبل تصحيح قصر النظر أو طوله أو الاستجماتيزم بالليزر.',
      en: 'The common safety criteria a doctor reviews before correcting short-sight, long-sight or astigmatism with a laser.'
    },
    sections: {
      ar: [
        ['المعايير الأساسية للأمان', null, [
          ['العمر', 'ألا يقل عن 18 عاماً.'],
          ['استقرار النظر', 'ثبات قياسات النظارة لمدة عام تقريباً.'],
          ['سماكة القرنية وشكلها', 'خلو القرنية من علامات القرنية المخروطية أو الترقق غير الطبيعي.'],
          ['صحة سطح العين', 'علاج أي جفاف شديد قبل اتخاذ القرار.']
        ]],
        ['ما الفرق بين الفيمتو ليزك والليزر السطحي (PRK)؟', 'في الفيمتو ليزك تُرفع طبقة رقيقة من القرنية بليزر الفيمتوثانية ثم يُصحَّح النظر، ويكون التعافي أسرع عادةً. أما الليزر السطحي فيُجرى دون رفع طبقة، وقد يُطرح خياراً لأصحاب القرنيات الأرق أو لمن يمارسون رياضات احتكاك. يحدد الفحص الخيار المناسب لعينك.']
      ],
      en: [
        ['Essential safety criteria', null, [
          ['Age', 'At least 18 years old.'],
          ['Stable prescription', 'Glasses prescription stable for about a year.'],
          ['Corneal thickness and shape', 'No signs of keratoconus or abnormal thinning.'],
          ['Healthy eye surface', 'Any severe dry eye treated before a decision.']
        ]],
        ['Femto-LASIK or surface laser (PRK)?', 'Femto-LASIK uses a femtosecond laser to create a thin flap before reshaping the cornea, and recovery is usually quicker. PRK reshapes the surface without a flap and may be suggested for thinner corneas or contact sports. The examination decides which option suits your eye.']
      ]
    }
  },
  {
    id: 'surgery-journey', slug: 'cataract-surgery', minutes: 2,
    title: { ar: 'رحلة المريض: ماذا تتوقع قبل جراحة المياه البيضاء وفي يومها وبعدها؟', en: 'The patient journey: before, on the day and after cataract surgery' },
    summary: {
      ar: 'التحضير والقياسات، وما يحدث يوم الجراحة، وإرشادات العناية والقطرات بعدها.',
      en: 'Preparation and measurements, what happens on the day, and eye care and drops afterwards.'
    },
    sections: {
      ar: [
        ['قبل العملية: التحضير والقياسات', 'تُجرى قياسات بصرية دقيقة للعين (Optical Biometry) لحساب قوة العدسة المناسبة، مع مناقشة أنواع العدسات واحتياجاتك اليومية.'],
        ['يوم العملية', 'إجراء يومي في الغالب لا يستدعي المبيت، ومدته قصيرة عادةً، ويُجرى غالباً تحت تخدير موضعي بالقطرات. قد تشعر بضغط خفيف أو ترى أضواء أثناء الإجراء.'],
        ['بعد العملية', 'تغادر بعد وقت قصير مع واقٍ للعين. من الضروري الالتزام بجدول القطرات الموصوفة، وتجنب فرك العين أو وصول الماء المباشر إليها خلال الأيام الأولى، وحضور مواعيد المتابعة.']
      ],
      en: [
        ['Before surgery: preparation and measurements', 'Precise optical biometry measures the eye to calculate the lens power, alongside a discussion of lens types and your everyday visual needs.'],
        ['On the day', 'Usually a day procedure with no overnight stay. It is typically short and is usually done under anaesthetic eye drops; you may feel light pressure or see lights during it.'],
        ['After surgery', 'You go home after a short while with an eye shield. Follow the prescribed drop schedule, avoid rubbing the eye or getting tap water in it during the first days, and attend your follow-up visits.']
      ]
    }
  }
];

/** The three guides the homepage features ("Selected medical education"). */
export const FEATURED_GUIDES = ['cataract-guide', 'keratoconus-guide', 'lasik-candidacy'];

/** Questionnaire steps (current wording, R2 onward) — answers stay in the browser; nothing is stored or sent. */
export const QUESTIONNAIRE = {
  ar: [
    { question: 'ما هي فئتك العمرية التقريبية؟', desc: 'تساعد لمعرفة درجة التكيف العصبي الطبيعي وجفاف العين الفسيولوجي.', options: ['أقل من 45 سنة', '45 إلى 58 سنة', '59 إلى 70 سنة', 'أكثر من 70 سنة', 'لست متأكداً'] },
    { question: 'هل تم تشخيصك سابقاً بأي من حالات العين التالية؟', desc: 'بعض حالات الشبكية وارتفاع ضغط العين تؤثر في ملاءمة بعض تصاميم العدسات.', options: ['لا توجد حالات سابقة معتمدة (سليمة)', 'ارتفاع ضغط العين أو ماء أزرق (Glaucoma)', 'اعتلال بمركز الإبصار أو السكري بالشبكية', 'قرنية مخروطية أو جفاف عين مزمن', 'لست متأكداً تماماً (أرغب بفحص شامل)'] },
    { question: 'ما هي الأولوية البصرية الأهم في نمط حياتك اليومي؟', desc: 'تساعد على تحديد النطاق البصري الأكثر استخداماً خلال يومك.', options: ['القيادة الليلية ووضوح الرؤية البعيدة مع أقل قدر من الهالات', 'العمل المكتبي، شاشات الحاسوب، ولوحة قيادة السيارة (مسافة ممتدة)', 'قراءة المصحف الشريف والهاتف الذكي دون نظارة', 'أقل اعتماد ممكن على النظارات'] },
    { question: 'هل سبق لك إجراء عملية ليزك أو تصحيح نظر سابق؟', desc: 'العيون التي خضعت لعمليات سابقة تحتاج معادلات حسابية خاصة لحساب قوة العدسة.', options: ['لم أجرِ أي عملية سابقة (قرنية طبيعية)', 'نعم، أجريت فيمتو ليزك أو ليزر سطحي PRK', 'نعم، خضعت لتثبيت قرنية مخروطية CXL', 'لست متأكداً من التاريخ الجراحي الدقيق'] }
  ],
  en: [
    { question: 'What is your approximate age group?', desc: 'Guides expectations regarding neuroadaptation and ocular surface status.', options: ['Under 45 years', '45 to 58 years', '59 to 70 years', 'Over 70 years', 'Not certain'] },
    { question: 'Do you have any previously diagnosed eye conditions?', desc: 'Conditions such as glaucoma or maculopathy influence which lens designs are suitable.', options: ['No diagnosed conditions (healthy eyes)', 'Glaucoma or elevated eye pressure', 'Diabetic retinopathy or macular condition', 'Keratoconus or severe chronic dry eye', 'Not certain (I would like a complete exam)'] },
    { question: 'What is your main visual priority day to day?', desc: 'Defines the viewing distance you rely on most.', options: ['Night driving and sharp distance vision with as few halos as possible', 'Computer work, laptops and the dashboard (intermediate range)', 'Smartphone use and book reading without reading glasses', 'As little dependence on glasses as possible'] },
    { question: 'Have you had previous laser vision correction (LASIK / PRK)?', desc: 'Eyes with previous refractive surgery need specialised lens-power calculations.', options: ['No previous surgery', 'Yes, prior Femto-LASIK or PRK', 'Yes, prior corneal cross-linking (CXL)', 'Not certain of my surgical history'] }
  ]
};

/**
 * Answer-driven result blocks (restored structure of R0, neutral wording). Selection: see questionnaireResult().
 * No block names a lens as the better or usual choice; each one lists what to ASK about.
 */
const RESULT_BLOCKS = {
  nightDriving: {
    ar: ['أولويتك: القيادة الليلية ووضوح التباين', 'اسأل عن الفروق بين أنواع العدسات في احتمال ظهور الهالات والوهج حول الأضواء ليلاً، وفي مدى الحاجة إلى نظارة للقراءة القريبة. لكل تصميم حدوده، ويوازن الطبيب بينها بحسب قياسات عينك.'],
    en: ['Your priority: night driving and contrast', 'Ask how lens types differ in the chance of halos and glare around lights at night, and in how much you may still need reading glasses. Each design has trade-offs, which the surgeon weighs against your eye’s measurements.']
  },
  intermediate: {
    ar: ['أولويتك: الشاشات والمسافة المتوسطة', 'المسافة المتوسطة (شاشة الحاسوب ولوحة السيارة) تختلف تغطيتها من عدسة لأخرى. اسأل عن مدى الرؤية الذي يوفره كل نوع، وما يرافقه من هالات ليلية محتملة، وهل ستحتاج نظارة للقراءة.'],
    en: ['Your priority: screens and intermediate range', 'Lenses differ in how well they cover the intermediate range (computer screen, dashboard). Ask about the range each type gives, the possible night-time halos that come with it, and whether you will still need reading glasses.']
  },
  nearVision: {
    ar: ['أولويتك: القراءة واستخدام الهاتف دون نظارة', 'إذا كانت القراءة القريبة في مقدمة أهدافك، فناقش مع الطبيب العدسات التي تمتد إلى المسافة القريبة وما يرافقها من هالات أو انخفاض في التباين، مع التأكد من سلامة سطح القرنية والشبكية قبل أي قرار.'],
    en: ['Your priority: reading and phone use without glasses', 'If near vision matters most, discuss the lens designs that extend to near range and their trade-offs in halos and contrast, and make sure the corneal surface and retina are checked before any decision.']
  },
  broadRange: {
    ar: ['أولويتك: أقل اعتماد ممكن على النظارات', 'تقلل بعض العدسات الاعتماد على النظارة في كثير من الأنشطة، لكن لا يمكن ضمان الاستغناء التام عنها لكل مريض. اسأل عن توقعات واقعية لعينك تحديداً، وعن الهالات الليلية المحتملة، وعن فترة التكيف.'],
    en: ['Your priority: as little dependence on glasses as possible', 'Some lenses reduce dependence on glasses for many tasks, but complete independence cannot be promised for every patient. Ask for realistic expectations for your own eye, possible night-time halos and the adaptation period.']
  },
  previousLaser: {
    ar: ['أخبر الطبيب عن جراحة الليزر السابقة', 'تغيّر عمليات تصحيح النظر السابقة انحناء القرنية، فتحتاج قوة العدسة إلى معادلات حسابية خاصة. أحضر معك أي تقارير أو قياسات قديمة إن وُجدت.'],
    en: ['Tell your surgeon about previous laser surgery', 'Previous refractive surgery changes the corneal curvature, so the lens power needs special calculation formulas. Bring any old reports or measurements you have.']
  },
  previousCxl: {
    ar: ['تاريخ تثبيت القرنية مهم', 'القرنية التي خضعت لتثبيت (CXL) أو بها قرنية مخروطية قد تؤثر في قياسات العين وفي ملاءمة بعض تصاميم العدسات. ناقش ذلك مع الطبيب وأحضر تقارير التصوير السابقة.'],
    en: ['Your cross-linking history matters', 'A cornea treated with cross-linking (CXL), or affected by keratoconus, can affect the eye measurements and the suitability of some lens designs. Discuss it with your surgeon and bring previous scan reports.']
  },
  historyUnknown: {
    ar: ['غير متأكد من تاريخك الجراحي؟', 'لا بأس؛ يكشف الفحص الشامل وتصوير القرنية علامات الجراحات السابقة. إن أمكن، أحضر أي تقارير طبية قديمة معك.'],
    en: ['Not sure about your surgical history?', 'That is fine: a full examination and corneal imaging show signs of previous surgery. If you can, bring any old medical reports.']
  },
  eyeCondition: {
    ar: ['حالات العين المصاحبة', 'قد يجعل ارتفاع ضغط العين أو أمراض الشبكية أو القرنية بعض تصاميم العدسات أقل ملاءمة. ناقش حالتك مع الجرّاح ليختار معك ما يناسب عينك.'],
    en: ['Existing eye conditions', 'Glaucoma, retinal disease or corneal conditions can make some lens designs less suitable. Discuss your condition with the surgeon so the choice fits your eye.']
  },
  conditionUnknown: {
    ar: ['غير متأكد من حالات عينك؟', 'سيبدأ الطبيب بفحص شامل يشمل ضغط العين وقاعها وسطح القرنية، قبل أي حديث عن نوع العدسة.'],
    en: ['Not sure about your eye conditions?', 'Your doctor starts with a full examination of eye pressure, the retina and the corneal surface before any discussion of lens type.']
  },
  nextStep: {
    ar: ['الخطوة التالية', 'هذه نقاط تثقيفية لترتيب أولوياتك. يُتخذ القرار العلاجي داخل العيادة بعد الفحص وتصوير القرنية والقياسات الحيوية للعين مع د. معن البري.'],
    en: ['The next step', 'These are educational talking points to organise your priorities. Treatment decisions are made in clinic after examination, corneal imaging and eye measurements with Dr. Maan Al Barry.']
  }
};

/**
 * Pick the result blocks from the four answers (indices into the option lists above).
 * Same structure as R0: one priority block, then history and condition blocks when relevant, then the next step.
 */
export function questionnaireResult(answers, lang) {
  const keys = [];
  keys.push(['nightDriving', 'intermediate', 'nearVision', 'broadRange'][answers[2]] || 'intermediate');
  if (answers[3] === 1) keys.push('previousLaser');
  else if (answers[3] === 2) keys.push('previousCxl');
  else if (answers[3] === 3) keys.push('historyUnknown');
  if ([1, 2, 3].includes(answers[1])) keys.push('eyeCondition');
  else if (answers[1] === 4) keys.push('conditionUnknown');
  keys.push('nextStep');
  return keys.map(k => ({ id: k, title: RESULT_BLOCKS[k][lang][0], text: RESULT_BLOCKS[k][lang][1] }));
}

/** "Your visit" — the four-step pathway (R5). */
export const VISIT = [
  { ar: ['الفحص والتصوير', 'قياس النظر وضغط العين، وتصوير القرنية وقياس العين، لبناء خطة على معطيات واضحة.'], en: ['Examination & imaging', 'Vision and eye-pressure checks, corneal imaging and eye measurements build a plan on clear data.'] },
  { ar: ['الاستشارة', 'شرح النتائج ومناقشة الخيارات والتوقعات الواقعية مع د. معن، والإجابة عن أسئلتك.'], en: ['Consultation', 'Results, options and realistic expectations, discussed with Dr. Maan, with time for your questions.'] },
  { ar: ['الإجراء', 'في غرف عمليات مستشفى مغربي إن تقرر إجراء، وغالباً تحت تخدير موضعي.'], en: ['Procedure', 'In Magrabi’s operating theatres if a procedure is decided, usually under local anaesthetic.'] },
  { ar: ['المتابعة', 'زيارات مجدولة لمتابعة التعافي واستقرار الرؤية، مع تعليمات واضحة للقطرات والعناية.'], en: ['Follow-up', 'Scheduled visits to follow healing and visual stability, with clear instructions for drops and care.'] }
];

/** Core assessments (generic — no device brands until the clinic confirms its equipment in writing). */
export const ASSESSMENTS = [
  { ar: ['تصوير القرنية الطبقي', 'خريطة لشكل القرنية وسماكتها، أساسية قبل الليزر ولتشخيص القرنية المخروطية.'], en: ['Corneal tomography', 'Maps corneal shape and thickness — essential before laser and for diagnosing keratoconus.'] },
  { ar: ['القياسات البصرية الحيوية', 'قياس طول العين وانحناء القرنية لحساب قوة العدسة المزروعة.'], en: ['Optical biometry', 'Measures the eye’s length and corneal curve to calculate an implant’s power.'] },
  { ar: ['التصوير المقطعي للشبكية (OCT)', 'صور مقطعية للبقعة والشبكية لتشخيص الحالات ومتابعة العلاج بالحقن.'], en: ['Retinal imaging (OCT)', 'Cross-sectional images of the macula and retina for diagnosis and to guide injections.'] },
  { ar: ['فحص شامل للعين', 'قياس النظر وضغط العين وفحص المصباح الشقي وقاع العين قبل أي قرار.'], en: ['Full eye examination', 'Vision, eye pressure, slit-lamp and retina checks before any decision.'] }
];

/** Areas of expertise (R5 `areas`, verified scope only). `slug` = procedure page, `more` = extra links. */
export const AREAS = [
  {
    slug: 'cataract-surgery', more: ['lens-implants'],
    title: { ar: 'جراحة الماء الأبيض (الساد) وزراعة العدسات', en: 'Cataract surgery & lens implantation' },
    text: {
      ar: 'استبدال العدسة المعتمة بتقنية الفاكو وزراعة عدسة داخل العين — أحادية البؤرة أو ممتدة المدى (EDOF) أو ثلاثية البؤرة أو توريكية — بحسب الفحص والقياسات واحتياجات المريض.',
      en: 'Phacoemulsification to replace the clouded lens with an intraocular lens — monofocal, extended depth of focus (EDOF), trifocal or toric — chosen from the examination, measurements and the patient’s needs.'
    }
  },
  {
    slug: 'keratoconus-cxl', more: ['corneal-transplant'],
    title: { ar: 'أمراض القرنية والقرنية المخروطية', en: 'Cornea & keratoconus' },
    text: {
      ar: 'التشخيص المبكر للقرنية المخروطية بالتصوير الطبقي، وتثبيت القرنية بالريبوفلافين والأشعة فوق البنفسجية (CXL) بهدف إبطاء تطور المرض، وزراعة القرنية حين لا تكفي العلاجات الأخرى.',
      en: 'Early keratoconus detection with corneal tomography, corneal cross-linking (CXL) with riboflavin and UV light aimed at slowing progression, and corneal transplant when other treatments are not enough.'
    }
  },
  {
    slug: 'laser-vision-correction', more: ['icl'],
    title: { ar: 'تصحيح الإبصار', en: 'Vision correction' },
    text: {
      ar: 'تقييم شامل لملاءمة الفيمتو ليزك والليزر السطحي (PRK)، أو زراعة العدسة اللاصقة الداخلية (ICL) حين لا يناسب الليزر: سماكة القرنية وشكلها وثبات النظر وصحة سطح العين، قبل أي قرار.',
      en: 'A full suitability assessment for Femto-LASIK and surface laser (PRK), or an implantable contact lens (ICL) when laser is not suitable: corneal thickness and shape, prescription stability and eye-surface health, before any decision.'
    }
  }
];

/** Why each credential matters to a patient (explanatory wording; pending Dr. Maan's approval). Keyed by fact id. */
export const WHY_IT_MATTERS = {
  frcs: { ar: 'زمالة مهنية تمنحها كلية الجراحين الملكية في بريطانيا بعد اجتياز اختباراتها؛ تعني أن تأهيله الجراحي قيس بمعايير معترف بها دولياً.', en: 'A professional fellowship awarded by the Royal College of Surgeons after its examinations — surgical training measured against internationally recognised standards.' },
  'saudi-board': { ar: 'شهادة الاختصاص الوطنية في طب وجراحة العيون بعد برنامج تدريب تخصصي؛ المرجع السعودي للتأهل في التخصص.', en: 'The national specialty certificate in ophthalmology after a structured training programme — Saudi Arabia’s reference qualification in the specialty.' },
  rank: { ar: 'مشاركة في تعليم طلاب الطب والأطباء المتدربين، ومواكبة مستمرة للمستجدات العلمية في طب العيون.', en: 'Teaching medical students and doctors in training, and keeping up with the evidence in ophthalmology.' },
  'magrabi-chief': { ar: 'يشرف على الشؤون الطبية والإدارية والتشغيلية بالفرع، أي على معايير الرعاية التي يتلقاها المرضى فيه.', en: 'Oversees the branch’s medical, administrative and operational affairs — the standards of care patients receive there.' },
  'sscc-president': { ar: 'دور قيادي في رابطة مهنية متخصصة في جراحات القرنية والماء الأبيض وتصحيح الإبصار، وهي التخصصات نفسها التي يعالجها.', en: 'A leadership role in a professional association for cornea, cataract and refractive surgery — the same fields he treats.' },
  'taibah-chair': { ar: 'قيادة قسم أكاديمي لطب وجراحة العيون لعشر سنوات، تشمل التعليم والتدريب الطبي.', en: 'Ten years leading an academic ophthalmology department, including medical teaching and training.' },
  'sos-rep': { ar: 'تمثيل الجمعية العلمية الوطنية لطب العيون في المدينة المنورة.', en: 'Representing the national ophthalmology society in Madinah.' },
  redsea: { ar: 'إسهام في تأسيس مؤتمر علمي دولي للتعليم الطبي المستمر لأطباء العيون.', en: 'Helping found an international scientific meeting for the continuing education of eye surgeons.' }
};

/** Footer disclaimer, with the R0 emergency sentence merged in (matrix H7). */
export const DISCLAIMER = {
  ar: 'المحتوى المنشور على هذا الموقع مخصص للتوعية الطبية العامة، ولا يُعد بديلاً عن الفحص السريري المباشر والتشخيص لدى طبيب العيون. لا يجوز استخدام هذه المعلومات لتشخيص أو علاج أي مرض. في حالات الطوارئ العينية، يرجى مراجعة أقرب مركز طوارئ فوراً.',
  en: 'Content on this website is for general education only and does not replace an in-person clinical examination and diagnosis by an ophthalmologist. Never disregard professional medical advice or delay seeking care because of something you have read here. For eye emergencies, go to the nearest emergency department immediately.'
};

/** Eye-emergency warning signs (education library and procedure pages). */
export const RED_FLAGS = {
  title: { ar: 'علامات تستوجب رعاية عاجلة', en: 'Seek urgent care for' },
  items: {
    ar: ['فقدان مفاجئ أو تدهور سريع في الرؤية بأي من العينين.', 'ألم شديد مفاجئ في العين مع احمرار أو صداع وغثيان.', 'ومضات ضوئية مفاجئة أو هطول كثيف لنقاط سوداء عائمة.', 'ظل أو ستارة داكنة تغطي جزءاً من مجال الرؤية.'],
    en: ['Sudden loss or rapid worsening of vision in either eye.', 'Severe, sudden eye pain with redness, headache or nausea.', 'Sudden flashes of light or a shower of floating dark spots.', 'A dark shadow or curtain across part of your vision.']
  },
  action: { ar: 'توجّه فوراً إلى أقرب طوارئ عيون متخصصة.', en: 'Go to the nearest eye emergency department immediately.' }
};

/** Static summary of the Lens Lab (shown without JavaScript, while it loads, or until the module lands). */
export const LENS_SUMMARY = [
  { code: 'Monofocal', ar: ['أحادية البؤرة', 'تركيز واضح على مسافة واحدة، غالباً البعيدة، مع الحاجة عادةً إلى نظارة للقراءة.'], en: ['Monofocal', 'Clear focus at one distance, usually far, and reading glasses are usually still needed.'] },
  { code: 'EDOF', ar: ['ممتدة المدى', 'تمدّ مجال الرؤية من البعيد إلى المتوسط، وقد تبقى الحاجة إلى نظارة للقراءة الدقيقة.'], en: ['Extended depth of focus', 'Stretches the range from distance to intermediate; fine print may still need glasses.'] },
  { code: 'Trifocal', ar: ['ثلاثية البؤرة', 'تغطي البعيد والمتوسط والقريب، مع احتمال أكبر لظهور هالات حول الأضواء ليلاً.'], en: ['Trifocal', 'Covers far, intermediate and near, with a higher chance of halos around lights at night.'] },
  { code: 'Toric', ar: ['التوريكية', 'تصحح الاستجماتيزم في القرنية، وتتوفر بتصاميم مختلفة من حيث مدى الرؤية.'], en: ['Toric', 'Corrects corneal astigmatism, and comes in designs with different ranges.'] }
];

/** Static outline of the Light Journey (cornea → retina), with the procedure that concerns each structure. */
export const LIGHT_PATH = [
  { slug: 'laser-vision-correction', ar: ['القرنية', 'النافذة الشفافة الأمامية؛ تنكسر عندها معظم أشعة الضوء. يعيد الليزر تشكيلها، وتُعالج أمراضها بالتثبيت أو الزراعة.'], en: ['Cornea', 'The clear front window, where most of the light is bent. Laser reshapes it; its diseases are treated with cross-linking or a transplant.'] },
  { slug: 'icl', ar: ['القزحية والبؤبؤ', 'تتحكم القزحية في كمية الضوء الداخل. خلفها مباشرة تُزرع عدسة ICL لتصحيح النظر.'], en: ['Iris and pupil', 'The iris controls how much light enters. An ICL sits just behind it to correct vision.'] },
  { slug: 'cataract-surgery', ar: ['العدسة', 'تضبط التركيز على المسافات المختلفة. عتامتها هي الماء الأبيض، وتُستبدل بعدسة صناعية.'], en: ['Lens', 'Fine-tunes focus for different distances. Its clouding is a cataract, replaced with an artificial lens.'] },
  { slug: 'intravitreal-injections', ar: ['الجسم الزجاجي والشبكية', 'يعبر الضوء الجل الشفاف ليصل إلى الشبكية حيث يتحول إلى إشارات عصبية. تُعالج بعض أمراض البقعة بالحقن.'], en: ['Vitreous and retina', 'Light crosses the clear gel to reach the retina, where it becomes nerve signals. Some macular diseases are treated with injections.'] }
];

/** Main stages shown in the 3D cataract walkthrough (static outline for the /surgical-education/ page). */
export const SURGERY_STAGES = {
  ar: [
    ['فتحة صغيرة', 'يدخل الجرّاح عبر فتحة صغيرة على حافة القرنية.'],
    ['فتح المحفظة', 'تُفتح نافذة دائرية في المحفظة الرقيقة التي تحيط بالعدسة.'],
    ['تفتيت العدسة وشفطها', 'تُفتّت العدسة المعتمة بالموجات فوق الصوتية وتُشفط.'],
    ['زراعة العدسة', 'تُزرع عدسة صناعية قابلة للطي داخل المحفظة نفسها.']
  ],
  en: [
    ['A small incision', 'The surgeon enters through a small opening at the edge of the cornea.'],
    ['Opening the capsule', 'A round window is opened in the thin capsule around the lens.'],
    ['Breaking up the lens', 'Ultrasound breaks up the clouded lens, which is removed.'],
    ['Placing the new lens', 'A foldable artificial lens is placed inside the same capsule.']
  ]
};
