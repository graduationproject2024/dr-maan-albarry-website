// ============================================================
// PROCEDURE LIBRARY — long-form patient education for /procedures/<slug>/
// ------------------------------------------------------------
// General patient education written from AAO EyeSmart, NEI, NHS and FDA patient pages
// (per-section URLs: docs/implementation/clinical-visual-reconstruction/CLINICAL_SOURCES.md).
// Rules: no outcome promises, no success-rate figures, no surgical parameters, no device or
// platform claims, no statements about Dr. Maan's personal technique or results.
// Medical review status: DRAFT — pending review by Dr. Maan. Nothing here is physician-approved.
// Scope (which procedures exist, names, summaries, provenance) lives in doctor-data.js.
// This module is lazy-loaded by main.js only on procedure pages.
// ============================================================

export const REVIEW = { status: 'draft', reviewer: null, reviewedOn: null };

// Patient-information sources shown at the foot of each page (all checked to resolve on 2026-11-01).
const AAO = (path, label) => [`AAO EyeSmart — ${label}`, `https://www.aao.org/eye-health/${path}`];
const ANATOMY = AAO('anatomy/parts-of-eye', 'Parts of the eye');
export const SOURCES = {
  'cataract-surgery': [AAO('diseases/what-are-cataracts', 'What are cataracts?'), AAO('diseases/what-is-cataract-surgery', 'Cataract surgery'), ['NEI — Cataracts', 'https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/cataracts'], ['NHS — Cataract surgery', 'https://www.nhs.uk/conditions/cataract-surgery/'], ANATOMY],
  'lens-implants': [AAO('diseases/cataracts-iol-implants', 'Intraocular lenses (IOL)'), ['NHS — Cataract surgery', 'https://www.nhs.uk/conditions/cataract-surgery/'], ANATOMY],
  'laser-vision-correction': [AAO('treatments/lasik', 'LASIK'), AAO('treatments/photorefractive-keratectomy-prk', 'PRK'), AAO('treatments/refractive-surgery', 'Refractive surgery'), ['NHS — Laser eye surgery and lens surgery', 'https://www.nhs.uk/conditions/laser-eye-surgery-and-lens-surgery/'], ['FDA — LASIK', 'https://www.fda.gov/medical-devices/surgery-devices/lasik']],
  icl: [AAO('treatments/phakic-iol', 'Phakic IOL'), ['NHS — Laser eye surgery and lens surgery', 'https://www.nhs.uk/conditions/laser-eye-surgery-and-lens-surgery/'], ANATOMY],
  'keratoconus-cxl': [AAO('diseases/what-is-keratoconus', 'What is keratoconus?'), AAO('treatments/corneal-cross-linking', 'Corneal cross-linking'), ANATOMY],
  'corneal-transplant': [AAO('treatments/corneal-transplant', 'About corneal transplantation'), ['NHS — Cornea transplant', 'https://www.nhs.uk/conditions/cornea-transplant/'], ANATOMY],
  'intravitreal-injections': [AAO('treatments/intravitreal-injections', 'Intravitreal injections'), AAO('treatments/eye-injections', 'Eye injections'), ['NEI — Age-related macular degeneration', 'https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/age-related-macular-degeneration'], ['NEI — Diabetic retinopathy', 'https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/diabetic-retinopathy'], ['NHS — AMD treatment', 'https://www.nhs.uk/conditions/age-related-macular-degeneration-amd/treatment/']]
};

export const CONTENT = {
  'cataract-surgery': {
    ar: {
      intro: 'الماء الأبيض (الساد) عتامة تدريجية في عدسة العين الطبيعية، وهو من أكثر أسباب ضعف الرؤية شيوعاً مع التقدم في العمر. لا يُعالج بالنظارة أو القطرات، والعلاج الفعّال حين يؤثر في حياتك هو جراحة تُزال فيها العدسة المعتمة وتُزرع مكانها عدسة صناعية شفافة.',
      anatomy: {
        text: 'تقع العدسة الطبيعية خلف القزحية (الجزء الملوّن) والبؤبؤ، وتعمل مع القرنية على تجميع الضوء على الشبكية. تحيط بالعدسة محفظة رقيقة شفافة تبقى في مكانها أثناء الجراحة لتحتضن العدسة الجديدة.',
        parts: [['القرنية', 'النافذة الشفافة في مقدمة العين'], ['العدسة الطبيعية', 'تُعتم تدريجياً في الماء الأبيض'], ['محفظة العدسة', 'غشاء رقيق تُثبَّت فيه العدسة المزروعة'], ['الشبكية', 'تستقبل الصورة وترسلها إلى الدماغ']]
      },
      purpose: 'استعادة وضوح الرؤية حين تصبح العدسة المعتمة عائقاً أمام القراءة أو القيادة أو العمل أو التعرف على الوجوه. وقت الجراحة يحدده تأثير الحالة على يومك، لا وجود الساد وحده.',
      candidates: ['ضبابية أو بهتان في الألوان لا يتحسن بتغيير النظارة.', 'وهج وهالات حول الأضواء تُصعّب القيادة ليلاً.', 'أنشطة يومية تأثرت بضعف الرؤية.', 'فحص يؤكد أن الساد هو السبب الرئيسي لضعف الرؤية، ويقيّم صحة الشبكية والقرنية قبل القرار.'],
      steps: ['قياسات للعين قبل الجراحة لحساب قوة العدسة الصناعية ومناقشة نوعها.', 'تخدير موضعي بالقطرات غالباً، وتبقى مستيقظاً دون أن ترى تفاصيل ما يجري.', 'فتحة صغيرة في طرف القرنية، ثم تفتيت العدسة المعتمة وإزالتها مع إبقاء محفظتها.', 'زراعة عدسة صناعية قابلة للطي داخل المحفظة.', 'عودة إلى المنزل في اليوم نفسه مع غطاء واقٍ وقطرات وتعليمات متابعة.'],
      benefits: ['رؤية أوضح وألوان أكثر إشراقاً عندما يكون الساد هو السبب.', 'إمكانية تصحيح جزء من قصر أو طول النظر أو الاستجماتيزم باختيار العدسة المناسبة.', 'إجراء شائع جداً يُجرى عادةً دون مبيت.'],
      limitations: ['لا يعالج أمراض الشبكية أو العصب البصري إن وُجدت.', 'قد تظل الحاجة إلى نظارة لبعض المسافات بحسب نوع العدسة.', 'لا يمكن ضمان نتيجة بعينها، فهي تختلف من عين لأخرى.'],
      risks: ['التهاب أو احمرار مؤقت، وهو شائع في الأيام الأولى.', 'عتامة في المحفظة الخلفية بعد أشهر أو سنوات، وتُعالج عادةً بالليزر في العيادة.', 'ارتفاع ضغط العين أو تورم في الشبكية (وذمة البقعة).', 'مضاعفات نادرة لكنها خطيرة مثل العدوى داخل العين أو انفصال الشبكية؛ لذلك يجب التواصل فوراً عند ألم متزايد أو تراجع مفاجئ في الرؤية.'],
      recovery: ['استخدام القطرات الموصوفة حسب الجدول المحدد.', 'تجنب فرك العين، ووضع الواقي ليلاً خلال الفترة التي يحددها الطبيب.', 'تحسّن الرؤية خلال أيام عادةً، واستقرارها خلال أسابيع.', 'وصفة نظارة جديدة، إن لزمت، بعد استقرار العين.'],
      faq: [
        { q: 'هل يجب أن "ينضج" الماء الأبيض قبل الجراحة؟', a: 'لا. مع الجراحة الحديثة لا حاجة للانتظار حتى ينضج الساد. يُتخذ القرار حين يبدأ ضعف الرؤية بالتأثير في أنشطتك اليومية.' },
        { q: 'هل يمكن أن يعود الماء الأبيض بعد الجراحة؟', a: 'العدسة الصناعية لا تُعتم، لكن قد تُعتم المحفظة التي تحملها بعد مدة فتعود الضبابية. يُعالج ذلك عادةً بإجراء ليزر سريع في العيادة.' },
        { q: 'هل تُجرى الجراحة للعينين في اليوم نفسه؟', a: 'تُجرى عادةً لعين واحدة ثم للعين الأخرى بعد فترة يحددها الطبيب، حتى تتعافى الأولى وتُراجَع النتيجة.' },
        // Moved from the homepage FAQ (premium reconstruction: the homepage keeps general questions only).
        { q: 'هل يمكن الاستغناء التام عن النظارات بعد عملية المياه البيضاء؟', a: 'قد تقلل بعض العدسات الحديثة مثل ثلاثية البؤرة (Trifocal) وممتدة المدى (EDOF) الاعتماد على النظارات في كثير من الأنشطة، لكن لا يمكن ضمان الاستغناء التام عن النظارة لكل مريض، ويختلف ذلك بحسب حالة العين ونوع العدسة والإضاءة.' }
      ]
    },
    en: {
      intro: 'A cataract is a gradual clouding of the eye’s natural lens and one of the most common causes of blurred vision with age. Glasses and drops cannot clear it; when it affects your life, the effective treatment is surgery to remove the cloudy lens and replace it with a clear artificial one.',
      anatomy: {
        text: 'The natural lens sits behind the iris (the coloured part) and the pupil. Together with the cornea it focuses light onto the retina. A thin, clear capsule surrounds the lens; it is kept in place during surgery to hold the new lens.',
        parts: [['Cornea', 'the clear window at the front of the eye'], ['Natural lens', 'becomes cloudy in a cataract'], ['Lens capsule', 'the thin bag that holds the implant'], ['Retina', 'receives the image and sends it to the brain']]
      },
      purpose: 'To restore clearer vision when a clouded lens gets in the way of reading, driving, work or recognising faces. The timing is guided by how the cataract affects your day, not by its presence alone.',
      candidates: ['Blurred or faded vision that new glasses no longer fix.', 'Glare and halos around lights that make night driving harder.', 'Daily activities limited by reduced vision.', 'An examination confirming the cataract is the main cause, and checking the retina and cornea before deciding.'],
      steps: ['Eye measurements before surgery to calculate the implant power and discuss the lens type.', 'Usually numbing eye drops; you stay awake but do not see the details of the operation.', 'A small opening at the edge of the cornea; the cloudy lens is broken up and removed, leaving its capsule.', 'A foldable artificial lens is placed inside the capsule.', 'Home the same day with a protective shield, eye drops and follow-up instructions.'],
      benefits: ['Clearer vision and brighter colours when the cataract is the cause.', 'Part of a short- or long-sight prescription, or astigmatism, can be corrected through the lens choice.', 'A very common operation, usually done as a day case.'],
      limitations: ['It does not treat retina or optic nerve conditions, if present.', 'Glasses may still be needed for some distances, depending on the lens.', 'No specific result can be guaranteed; outcomes differ from eye to eye.'],
      risks: ['Temporary inflammation or redness, common in the first days.', 'Clouding of the capsule behind the implant months or years later, usually treated with a quick laser in clinic.', 'Raised eye pressure or swelling of the retina (macular oedema).', 'Rare but serious complications such as infection inside the eye or retinal detachment — contact the clinic at once if pain increases or vision suddenly drops.'],
      recovery: ['Use the prescribed drops exactly as scheduled.', 'Avoid rubbing the eye and wear the shield at night for as long as advised.', 'Vision usually improves within days and settles over a few weeks.', 'A new glasses prescription, if needed, once the eye has settled.'],
      faq: [
        { q: 'Does a cataract need to be “ripe” before surgery?', a: 'No. With modern surgery there is no need to wait. The decision is made when reduced vision starts to affect your daily activities.' },
        { q: 'Can a cataract come back?', a: 'The artificial lens does not cloud, but the capsule holding it can become hazy over time. This is usually treated with a quick laser procedure in clinic.' },
        { q: 'Are both eyes operated on the same day?', a: 'Usually one eye is treated first and the second after an interval set by your surgeon, so the first can heal and be reviewed.' },
        // Moved from the homepage FAQ (premium reconstruction: the homepage keeps general questions only).
        { q: 'Can I stop wearing glasses completely after cataract surgery?', a: 'Some modern lenses, such as trifocal and extended depth of focus (EDOF) designs, can reduce dependence on glasses for many tasks, but complete spectacle independence cannot be guaranteed for every patient; it varies with the eye, the lens type and lighting.' }
      ]
    }
  },

  'lens-implants': {
    ar: {
      intro: 'عند إزالة الماء الأبيض تُزرع عدسة صناعية دائمة (IOL) مكان العدسة الطبيعية. تختلف العدسات في طريقة توزيعها للتركيز بين المسافات، ولكل نوع مزايا وحدود. لا توجد عدسة واحدة تناسب الجميع.',
      anatomy: {
        text: 'تُثبَّت العدسة المزروعة داخل محفظة العدسة الطبيعية خلف القزحية، وتعمل مع القرنية على تركيز الضوء على الشبكية. شكل القرنية وصحة الشبكية يؤثران في اختيار النوع المناسب.',
        parts: [['القرنية', 'انحناؤها غير المنتظم يسبب الاستجماتيزم'], ['محفظة العدسة', 'موضع العدسة المزروعة'], ['البقعة', 'مركز الرؤية الدقيقة في الشبكية']]
      },
      types: [
        ['أحادية البؤرة', 'Monofocal', 'تركيز واضح على مسافة واحدة، غالباً البعيدة، مع الحاجة إلى نظارة للقراءة والمسافات القريبة.'],
        ['ممتدة المدى', 'EDOF', 'توسّع نطاق الرؤية من البعيد إلى المتوسط (الشاشات ولوحة القيادة)، وقد تلزم نظارة للخط الدقيق.'],
        ['متعددة أو ثلاثية البؤرة', 'Multifocal / Trifocal', 'تقسم الضوء بين عدة مسافات لتقليل الحاجة للنظارة، مع احتمال أكبر للهالات والوهج ليلاً وانخفاض في التباين.'],
        ['التوريكية', 'Toric', 'تصحح الاستجماتيزم الناتج عن انحناء القرنية، وتتوفر بتصاميم أحادية أو متعددة البؤرة.']
      ],
      purpose: 'اختيار العدسة التي توازن بين نطاق الرؤية الذي تحتاجه، واحتمال الهالات الليلية، والحاجة المتوقعة للنظارة، بحسب قياسات عينك وطبيعة يومك.',
      candidates: ['مرضى جراحة الماء الأبيض جميعاً يحتاجون عدسة، ويختلف النوع المناسب.', 'وجود استجماتيزم ملحوظ قد يجعل العدسة التوريكية خياراً.', 'أمراض الشبكية أو الجلوكوما أو جفاف العين الشديد قد تجعل العدسات متعددة البؤرة أقل ملاءمة.', 'من يقود كثيراً ليلاً أو يعمل في إضاءة خافتة يناقش احتمال الهالات بعناية.'],
      steps: ['قياسات بصرية حيوية لطول العين وانحناء القرنية.', 'تصوير القرنية عند الحاجة لتقييم الاستجماتيزم وانتظام السطح.', 'حديث عن أولوياتك: القراءة، الشاشات، القيادة الليلية، الرياضة.', 'اختيار نوع العدسة وقوتها، ثم زراعتها أثناء جراحة الماء الأبيض.'],
      benefits: ['إمكانية تقليل الاعتماد على النظارة لبعض المسافات.', 'تصحيح الاستجماتيزم بالعدسات التوريكية.', 'عدسة دائمة لا تحتاج إلى عناية يومية.'],
      limitations: ['كل تصميم يتضمن مفاضلة؛ زيادة نطاق الرؤية قد تأتي مع هالات أو تباين أقل.', 'الاستغناء التام عن النظارة لا يمكن ضمانه.', 'تحتاج بعض التصاميم إلى فترة تكيّف.'],
      risks: ['مخاطر جراحة الماء الأبيض نفسها.', 'هالات ووهج حول الأضواء، أكثر شيوعاً مع العدسات متعددة البؤرة.', 'دوران العدسة التوريكية عن محورها، وقد يتطلب تعديلاً.', 'خطأ متبقٍ في النظر قد يحتاج نظارة أو إجراءً إضافياً.'],
      recovery: ['التعافي هو تعافي جراحة الماء الأبيض نفسها.', 'تتحسن جودة الرؤية تدريجياً مع تكيّف الدماغ، خاصة مع العدسات متعددة البؤرة.', 'مراجعات متابعة لقياس النتيجة والتأكد من ثبات العدسة.'],
      faq: [
        { q: 'هل يمكن تغيير العدسة لاحقاً؟', a: 'العدسة مصممة لتبقى مدى الحياة. الاستبدال ممكن في حالات خاصة لكنه جراحة إضافية لها مخاطرها، لذا يُتخذ قرار النوع بعناية من البداية.' },
        { q: 'هل العدسات الأغلى أفضل دائماً؟', a: 'لا. الأنسب هو ما يلائم عينك وأولوياتك. قد تكون العدسة أحادية البؤرة الخيار الأنسب لعين معينة.' },
        { q: 'هل يمكن تجربة شكل الرؤية قبل الجراحة؟', a: 'محاكي الرؤية في هذا الموقع يوضح الفروق العامة بين الأنواع، لكنه أداة تعليمية ولا يتنبأ بنتيجتك الفعلية.' }
      ]
    },
    en: {
      intro: 'When a cataract is removed, a permanent artificial lens — an intraocular lens (IOL) — takes the place of the natural one. Lenses differ in how they share focus between distances, and each type has trade-offs. No single lens suits everyone.',
      anatomy: {
        text: 'The implant sits inside the capsule of the natural lens, behind the iris, and works with the cornea to focus light on the retina. The shape of the cornea and the health of the retina both influence which type suits you.',
        parts: [['Cornea', 'an uneven curve causes astigmatism'], ['Lens capsule', 'where the implant is placed'], ['Macula', 'the centre of sharp vision in the retina']]
      },
      types: [
        ['Monofocal', 'Monofocal', 'Clear focus at one distance, usually far, with glasses for reading and close work.'],
        ['Extended depth of focus', 'EDOF', 'Extends the range from distance to intermediate (screens, dashboard); glasses may be needed for fine print.'],
        ['Multifocal or trifocal', 'Multifocal / Trifocal', 'Splits light between several distances to reduce the need for glasses, with a higher chance of night halos, glare and reduced contrast.'],
        ['Toric', 'Toric', 'Corrects astigmatism caused by the shape of the cornea; available in monofocal and multifocal designs.']
      ],
      purpose: 'To choose a lens that balances the range of vision you need, the chance of night halos and the expected need for glasses — based on your eye measurements and your day.',
      candidates: ['Everyone having cataract surgery needs a lens; the right type differs.', 'Significant astigmatism can make a toric lens an option.', 'Retinal disease, glaucoma or severe dry eye can make multifocal designs less suitable.', 'People who drive a lot at night or work in dim light should discuss halos carefully.'],
      steps: ['Optical biometry measures the eye’s length and corneal curve.', 'Corneal imaging when needed, to assess astigmatism and surface regularity.', 'A conversation about your priorities: reading, screens, night driving, sport.', 'The lens type and power are chosen, then implanted during cataract surgery.'],
      benefits: ['Possible reduced dependence on glasses for some distances.', 'Astigmatism correction with toric lenses.', 'A permanent lens that needs no daily care.'],
      limitations: ['Every design is a trade-off: a wider range may come with halos or lower contrast.', 'Complete independence from glasses cannot be guaranteed.', 'Some designs need a period of adaptation.'],
      risks: ['The risks of cataract surgery itself.', 'Halos and glare around lights, more common with multifocal lenses.', 'A toric lens can rotate off its axis and may need repositioning.', 'A residual prescription that may need glasses or a further procedure.'],
      recovery: ['Recovery is that of cataract surgery.', 'Visual quality improves gradually as the brain adapts, especially with multifocal lenses.', 'Follow-up visits check the result and the lens position.'],
      faq: [
        { q: 'Can the lens be changed later?', a: 'Implants are designed to last a lifetime. Exchange is possible in special cases but is another operation with its own risks, so the type is chosen carefully from the start.' },
        { q: 'Are more expensive lenses always better?', a: 'No. The right lens is the one that fits your eye and priorities. A monofocal lens can be the most suitable choice for a particular eye.' },
        { q: 'Can I preview how I will see?', a: 'The vision simulator on this site illustrates general differences between lens types. It is an educational tool and does not predict your own result.' }
      ]
    }
  },

  'laser-vision-correction': {
    ar: {
      intro: 'تصحيح الإبصار بالليزر يعيد تشكيل القرنية حتى يتركّز الضوء على الشبكية بصورة أدق، فيقلل قصر النظر أو طوله أو الاستجماتيزم. هناك عدة طرق، وتُختار بحسب سماكة القرنية وشكلها وطبيعة حياتك.',
      anatomy: {
        text: 'القرنية هي السطح الأمامي الشفاف للعين، وتقوم بالجزء الأكبر من تركيز الضوء. يُغيّر الليزر انحناءها بدقة عبر إزالة طبقة رقيقة جداً من نسيجها.',
        parts: [['الظهارة', 'الطبقة السطحية للقرنية'], ['اللحمة (السدى)', 'الطبقة الوسطى التي يعيد الليزر تشكيلها'], ['سماكة القرنية', 'عامل أساسي في تحديد الطريقة المناسبة']]
      },
      types: [
        ['الليزك', 'LASIK', 'تُرفع شريحة رقيقة من القرنية، ثم يُعاد تشكيل الطبقة تحتها وتُعاد الشريحة إلى مكانها. التعافي البصري سريع عادةً.'],
        ['الليزر السطحي', 'PRK', 'يُعاد تشكيل سطح القرنية بعد إزالة الطبقة الخارجية دون شريحة. التعافي أبطأ وأكثر انزعاجاً في الأيام الأولى، وقد يناسب القرنيات الأرق.'],
        ['سمايل', 'SMILE', 'يُصنع بالليزر جزء رقيق داخل القرنية ويُستخرج عبر فتحة صغيرة دون شريحة. مناسب لبعض حالات قصر النظر والاستجماتيزم.']
      ],
      purpose: 'تقليل الاعتماد على النظارة أو العدسات اللاصقة في الأنشطة اليومية، لمن يناسبهم الإجراء بعد فحص شامل.',
      candidates: ['عمر 18 عاماً فأكثر، مع ثبات درجة النظر لمدة عام تقريباً.', 'قرنية بسماكة وشكل مناسبين، دون علامات قرنية مخروطية.', 'سطح عين صحي، أو علاج الجفاف قبل الإجراء.', 'لا يُنصح به عادةً أثناء الحمل والرضاعة أو مع بعض أمراض المناعة غير المستقرة.'],
      steps: ['فحص شامل وتصوير طبقي للقرنية وقياس سماكتها.', 'إيقاف العدسات اللاصقة قبل الفحص بفترة يحددها الطبيب.', 'قطرات مخدرة؛ الإجراء نفسه قصير ولكل عين.', 'راحة في المنزل وقطرات ومتابعة في اليوم التالي أو بحسب الطريقة.'],
      benefits: ['رؤية جيدة دون نظارة في كثير من الأنشطة لمن يناسبهم الإجراء.', 'إجراء خارجي دون مبيت.', 'خيارات متعددة تناسب أنواعاً مختلفة من القرنيات.'],
      limitations: ['لا يعالج قصر البصر الشيخوخي (الحاجة لنظارة القراءة بعد الأربعين) في معظم الحالات.', 'قد تلزم نظارة لبعض المهام أو إجراء تكميلي.', 'لا يناسب الجميع؛ القرنية الرقيقة أو غير المنتظمة قد تستبعد الليزر.'],
      risks: ['جفاف العين، وهو شائع ويتحسن غالباً مع الوقت والعلاج.', 'هالات ووهج حول الأضواء ليلاً.', 'تصحيح أقل أو أكثر من المطلوب.', 'مشكلات في الشريحة بعد الليزك، أو عتامة خفيفة بعد الليزر السطحي.', 'مضاعفات نادرة مثل العدوى أو ترقق القرنية وتحدّبها (توسّع القرنية).'],
      recovery: ['تجنب فرك العين والسباحة والمكياج حول العين للفترة التي يحددها الطبيب.', 'التعافي بعد الليزك وسمايل أسرع عادةً منه بعد الليزر السطحي.', 'استقرار الرؤية تدريجياً خلال أسابيع، مع تذبذب بسيط في البداية.', 'قطرات مرطبة ومضادة للالتهاب حسب الوصفة.'],
      faq: [
        { q: 'أيها أنسب لي: الليزك أم الليزر السطحي أم سمايل؟', a: 'يعتمد ذلك على سماكة قرنيتك وشكلها ودرجة النظر وطبيعة عملك ورياضتك. يُتخذ القرار بعد الفحص والتصوير، لا قبله.' },
        { q: 'هل نتيجة الليزر دائمة؟', a: 'التغيير في شكل القرنية دائم، لكن العين قد تتغير مع العمر، مثل الحاجة لنظارة القراءة بعد الأربعين أو ظهور الماء الأبيض لاحقاً.' },
        { q: 'ماذا لو لم يكن الليزر مناسباً لي؟', a: 'قد تكون العدسة اللاصقة الداخلية (ICL) أو استبدال العدسة خياراً آخر بحسب العمر وحالة العين.' },
        // Moved from the homepage FAQ (premium reconstruction: the homepage keeps general questions only).
        { q: 'ما هي معايير ترشيح المريض لعمليات تصحيح النظر بالليزك؟', a: 'من المعايير الشائعة: ألا يقل العمر عن 18 عاماً، وثبات درجة النظر لمدة عام تقريباً، وسماكة قرنية كافية، وخلو القرنية من علامات القرنية المخروطية أو الجفاف الشديد غير المعالج. ويُحسم القرار بعد تصوير القرنية الطبقي والفحص الشامل.' }
      ]
    },
    en: {
      intro: 'Laser vision correction reshapes the cornea so that light focuses more precisely on the retina, reducing short-sight, long-sight or astigmatism. There are several methods; the choice depends on the thickness and shape of your cornea and on your lifestyle.',
      anatomy: {
        text: 'The cornea is the clear front surface of the eye and does most of its focusing. The laser changes its curve by precisely removing a very thin layer of tissue.',
        parts: [['Epithelium', 'the outer surface layer of the cornea'], ['Stroma', 'the middle layer the laser reshapes'], ['Corneal thickness', 'a key factor in choosing the method']]
      },
      types: [
        ['LASIK', 'LASIK', 'A thin flap is lifted, the layer beneath is reshaped and the flap is laid back. Visual recovery is usually quick.'],
        ['Surface laser', 'PRK', 'The surface is reshaped after the outer layer is removed, with no flap. Recovery is slower and more uncomfortable at first; it may suit thinner corneas.'],
        ['SMILE', 'SMILE', 'A laser shapes a thin piece of tissue inside the cornea, removed through a small opening with no flap. It suits some short-sight and astigmatism prescriptions.']
      ],
      purpose: 'To reduce dependence on glasses or contact lenses for everyday activities, in people found suitable after a thorough examination.',
      candidates: ['Age 18 or over, with a prescription stable for about a year.', 'A cornea of suitable thickness and shape, without signs of keratoconus.', 'A healthy eye surface, or dry eye treated first.', 'Usually not advised in pregnancy or breastfeeding, or with some unstable autoimmune conditions.'],
      steps: ['A full examination with corneal tomography and thickness measurement.', 'Contact lenses are paused before the assessment, for a period your surgeon advises.', 'Numbing drops; the treatment itself is short for each eye.', 'Rest at home, eye drops and a follow-up visit, timed according to the method.'],
      benefits: ['Good vision without glasses for many activities in suitable candidates.', 'An outpatient procedure with no hospital stay.', 'Several methods to suit different corneas.'],
      limitations: ['In most cases it does not treat presbyopia (needing reading glasses after about 40).', 'Glasses for some tasks, or an enhancement, may still be needed.', 'Not everyone is suitable; a thin or irregular cornea can rule laser out.'],
      risks: ['Dry eye, which is common and usually improves with time and treatment.', 'Halos and glare around lights at night.', 'Under- or over-correction.', 'Flap problems after LASIK, or mild haze after surface laser.', 'Rare complications such as infection or progressive thinning and bulging of the cornea (ectasia).'],
      recovery: ['Avoid rubbing your eyes, swimming and eye make-up for as long as advised.', 'Recovery after LASIK and SMILE is usually faster than after surface laser.', 'Vision settles gradually over weeks, with some early fluctuation.', 'Lubricating and anti-inflammatory drops as prescribed.'],
      faq: [
        { q: 'Which suits me: LASIK, surface laser or SMILE?', a: 'It depends on your corneal thickness and shape, your prescription, your work and your sport. The decision is made after the examination and imaging, not before.' },
        { q: 'Is the result permanent?', a: 'The change in corneal shape is permanent, but eyes still change with age — for example needing reading glasses after 40, or a cataract later in life.' },
        { q: 'What if laser is not suitable for me?', a: 'An implantable contact lens (ICL) or lens replacement may be an alternative, depending on your age and eye health.' },
        // Moved from the homepage FAQ (premium reconstruction: the homepage keeps general questions only).
        { q: 'What are the main criteria for laser vision correction (LASIK)?', a: 'Common criteria include being at least 18 years old, a stable prescription for about a year, adequate corneal thickness, and no signs of keratoconus or untreated severe dry eye. The decision is made after corneal tomography and a full examination.' }
      ]
    }
  },

  icl: {
    ar: {
      intro: 'العدسة اللاصقة الداخلية (ICL) عدسة رقيقة مرنة تُزرع داخل العين لتصحيح قصر النظر أو طوله أو الاستجماتيزم، مع الإبقاء على العدسة الطبيعية. تُعرف أيضاً بالعدسات الداخلية الإضافية (Phakic IOL).',
      anatomy: {
        text: 'تُوضع العدسة عادةً خلف القزحية وأمام العدسة الطبيعية مباشرة، في المسافة الضيقة بينهما. لذلك يُقاس عمق الحجرة الأمامية وعدد خلايا بطانة القرنية بدقة قبل الإجراء.',
        parts: [['الحجرة الأمامية', 'المسافة بين القرنية والقزحية'], ['القزحية', 'الجزء الملوّن الذي تستقر العدسة خلفه'], ['العدسة الطبيعية', 'تبقى في مكانها']]
      },
      purpose: 'تصحيح النظر لدى من لا يناسبهم الليزر، مثل أصحاب الدرجات العالية أو القرنيات الرقيقة، مع إمكانية إزالة العدسة لاحقاً عند الحاجة.',
      candidates: ['بالغون بدرجة نظر مستقرة.', 'درجات عالية من قصر النظر أو قرنيات لا تناسب الليزر.', 'عمق كافٍ للحجرة الأمامية وبطانة قرنية سليمة.', 'لا يناسب عادةً من لديهم ماء أبيض أو جلوكوما غير مستقرة أو التهابات متكررة داخل العين.'],
      steps: ['فحص شامل يشمل قياس الحجرة الأمامية وبطانة القرنية واختيار مقاس العدسة وقوتها.', 'تخدير موضعي.', 'فتحة صغيرة تُدخل منها العدسة مطويةً ثم تنفتح وتُثبّت خلف القزحية.', 'متابعة لقياس ضغط العين في الساعات والأيام التالية، ثم العين الأخرى في موعد لاحق عادةً.'],
      benefits: ['تصحيح للدرجات العالية دون إزالة نسيج من القرنية.', 'العدسة قابلة للإزالة أو الاستبدال.', 'المحافظة على العدسة الطبيعية وقدرتها على التركيز.'],
      limitations: ['جراحة داخل العين، بمخاطر تختلف عن الليزر.', 'لا تمنع الحاجة لنظارة القراءة مع التقدم في العمر.', 'قد تحتاج إلى إزالة العدسة لاحقاً إذا ظهر الماء الأبيض.'],
      risks: ['ارتفاع ضغط العين.', 'تسارع ظهور الماء الأبيض.', 'هالات أو وهج ليلاً.', 'فقدان تدريجي لخلايا بطانة القرنية، ولذلك تلزم متابعة دورية.', 'مضاعفات نادرة مثل العدوى داخل العين أو انفصال الشبكية.'],
      recovery: ['تحسن الرؤية خلال أيام غالباً.', 'قطرات حسب الوصفة، وتجنب فرك العين.', 'مراجعات منتظمة طويلة الأمد لفحص الضغط والبطانة ووضع العدسة.'],
      faq: [
        { q: 'هل أشعر بالعدسة داخل العين؟', a: 'لا يشعر المريض بها عادةً، فهي داخل العين وليست على سطحها.' },
        { q: 'ما الفرق بينها وبين الليزر؟', a: 'الليزر يغيّر شكل القرنية، أما ICL فتضيف عدسة داخل العين دون إزالة نسيج من القرنية. لكل منهما فئة مناسبة، ويحدد الفحص الأنسب.' },
        { q: 'هل يمكن إزالتها؟', a: 'نعم، يمكن إزالتها أو استبدالها في جراحة لاحقة عند الحاجة.' }
      ]
    },
    en: {
      intro: 'An implantable contact lens (ICL) is a thin, flexible lens placed inside the eye to correct short-sight, long-sight or astigmatism while keeping the natural lens. It belongs to the family of phakic intraocular lenses.',
      anatomy: {
        text: 'The lens usually sits just behind the iris and in front of the natural lens, in the narrow space between them. This is why the depth of the front chamber and the cell count of the corneal lining (endothelium) are measured carefully first.',
        parts: [['Anterior chamber', 'the space between the cornea and the iris'], ['Iris', 'the coloured part the lens rests behind'], ['Natural lens', 'stays in place']]
      },
      purpose: 'To correct vision in people for whom laser is not suitable — such as high prescriptions or thin corneas — with the option of removing the lens later if needed.',
      candidates: ['Adults with a stable prescription.', 'High short-sight, or corneas unsuitable for laser.', 'Enough depth in the front chamber and a healthy corneal lining.', 'Usually not suitable with cataract, unstable glaucoma or recurrent inflammation inside the eye.'],
      steps: ['A full assessment, including front-chamber depth and the corneal lining, to choose the lens size and power.', 'Local anaesthetic.', 'Through a small opening the folded lens is inserted, unfolds and is positioned behind the iris.', 'Eye-pressure checks in the following hours and days; the second eye is usually treated on another day.'],
      benefits: ['Corrects high prescriptions without removing corneal tissue.', 'The lens can be removed or exchanged.', 'The natural lens and its focusing are preserved.'],
      limitations: ['It is surgery inside the eye, with risks different from laser.', 'It does not prevent the need for reading glasses with age.', 'The lens may need removing later if a cataract develops.'],
      risks: ['Raised eye pressure.', 'Earlier development of cataract.', 'Halos or glare at night.', 'Gradual loss of cells in the corneal lining, which is why regular check-ups are needed.', 'Rare complications such as infection inside the eye or retinal detachment.'],
      recovery: ['Vision usually improves within days.', 'Drops as prescribed; avoid rubbing the eye.', 'Regular long-term check-ups of pressure, the corneal lining and the lens position.'],
      faq: [
        { q: 'Will I feel the lens?', a: 'Usually not — it sits inside the eye, not on its surface.' },
        { q: 'How is it different from laser?', a: 'Laser changes the shape of the cornea; an ICL adds a lens inside the eye without removing corneal tissue. Each suits different people, and the examination decides.' },
        { q: 'Can it be removed?', a: 'Yes, it can be removed or exchanged in a later operation if needed.' }
      ]
    }
  },

  'keratoconus-cxl': {
    ar: {
      intro: 'القرنية المخروطية حالة تضعف فيها القرنية وتترقق فتبرز تدريجياً بشكل يشبه المخروط، فتسبب استجماتيزماً غير منتظم وتشوشاً في الرؤية. تظهر غالباً في سن المراهقة والشباب، والتشخيص المبكر يفتح خيارات أكثر.',
      anatomy: {
        text: 'تتكون القرنية من طبقات، أهمها اللحمة (السدى) المصنوعة من ألياف الكولاجين. في القرنية المخروطية تضعف هذه الألياف. أما تثبيت القرنية (CXL) فيقوّي الروابط بينها.',
        parts: [['القرنية الطبيعية', 'قبة منتظمة الانحناء'], ['القرنية المخروطية', 'أرق وأكثر بروزاً في جزء منها'], ['ألياف الكولاجين', 'يستهدفها التثبيت لتقويتها']]
      },
      purpose: 'هدف التثبيت هو إبطاء تطور القرنية المخروطية أو إيقافه للمحافظة على الرؤية الحالية، وليس إعادة القرنية إلى شكلها الطبيعي. يُدمج غالباً مع وسائل لتحسين الرؤية مثل النظارة أو العدسات اللاصقة الخاصة.',
      candidates: ['قرنية مخروطية يثبت التصوير أنها تتطور.', 'سماكة قرنية كافية للإجراء.', 'التشخيص المبكر لدى الشباب، خاصة مع تغيّر النظارة المتكرر أو فرك العين المزمن.', 'قد لا يناسب الحالات المتقدمة جداً أو القرنيات المتندبة.'],
      steps: ['تصوير طبقي للقرنية لقياس شكلها وسماكتها ومتابعة التغير عبر الوقت.', 'قطرات مخدرة.', 'قطرات الريبوفلافين (فيتامين ب2) على القرنية.', 'تعريض القرنية لأشعة فوق بنفسجية مضبوطة تتفاعل مع الريبوفلافين لتقوية الروابط.', 'عدسة لاصقة ضمادية وقطرات في الأيام الأولى عادةً.'],
      benefits: ['يهدف لإبطاء تطور المرض أو إيقافه.', 'قد يقلل الحاجة لزراعة القرنية مستقبلاً لدى بعض المرضى.', 'إجراء خارجي.'],
      limitations: ['لا يعيد الرؤية إلى ما كانت عليه، والنظارة أو العدسات الخاصة غالباً تبقى لازمة.', 'تختلف الاستجابة من مريض لآخر، وقد يلزم تكراره أحياناً.', 'المتابعة بالتصوير ضرورية لسنوات.'],
      risks: ['ألم وانزعاج في الأيام الأولى، خاصة عند إزالة الطبقة السطحية.', 'تأخر التئام السطح أو عتامة خفيفة.', 'العدوى، وهي نادرة.', 'استمرار التطور لدى بعض المرضى رغم الإجراء.'],
      recovery: ['حساسية للضوء وانزعاج لبضعة أيام.', 'تشوش في الرؤية قد يستمر أسابيع قبل الاستقرار.', 'تجنب فرك العين تماماً، فهو عامل معروف في تفاقم الحالة.', 'مراجعات تصوير منتظمة للتأكد من الاستقرار.'],
      faq: [
        { q: 'هل يسبب فرك العين القرنية المخروطية؟', a: 'فرك العين المزمن من العوامل المرتبطة بتطور الحالة، ولذلك يُنصح بتجنبه وعلاج الحساسية المسببة للحكة.' },
        { q: 'هل يمكن إجراء الليزك مع القرنية المخروطية؟', a: 'الليزك التقليدي لا يناسب عادةً القرنيات المخروطية لأنه يزيد ترققها. توجد خيارات أخرى يحددها الفحص.' },
        { q: 'متى تكون زراعة القرنية ضرورية؟', a: 'في الحالات المتقدمة التي لا تتحسن فيها الرؤية بالعدسات أو عند وجود تندب. صفحة زراعة القرنية تشرح ذلك.' }
      ]
    },
    en: {
      intro: 'Keratoconus is a condition in which the cornea weakens, thins and gradually bulges into a cone-like shape, causing irregular astigmatism and distorted vision. It often appears in the teens and twenties, and early diagnosis opens up more options.',
      anatomy: {
        text: 'The cornea is built in layers; the main one, the stroma, is made of collagen fibres. In keratoconus these fibres weaken. Corneal cross-linking (CXL) strengthens the bonds between them.',
        parts: [['Normal cornea', 'an evenly curved dome'], ['Keratoconic cornea', 'thinner and steeper in one area'], ['Collagen fibres', 'what cross-linking aims to strengthen']]
      },
      purpose: 'Cross-linking aims to slow or stop keratoconus from progressing, to protect the vision you have — it does not return the cornea to a normal shape. It is often combined with ways to improve vision such as glasses or specialty contact lenses.',
      candidates: ['Keratoconus that imaging shows is progressing.', 'A cornea thick enough for the treatment.', 'Early diagnosis in young people, especially with frequently changing glasses or chronic eye rubbing.', 'It may not suit very advanced or scarred corneas.'],
      steps: ['Corneal tomography to measure shape and thickness and to track change over time.', 'Numbing drops.', 'Riboflavin (vitamin B2) drops are applied to the cornea.', 'Controlled ultraviolet light activates the riboflavin to strengthen the bonds.', 'Usually a bandage contact lens and drops for the first days.'],
      benefits: ['Aims to slow or halt progression.', 'May reduce the need for a corneal transplant later in some patients.', 'An outpatient procedure.'],
      limitations: ['It does not restore previous vision; glasses or specialty lenses are usually still needed.', 'Response varies between patients, and treatment is sometimes repeated.', 'Imaging follow-up is needed for years.'],
      risks: ['Pain and discomfort in the first days, especially when the surface layer is removed.', 'Delayed surface healing or mild haze.', 'Infection, which is rare.', 'Continued progression in some patients despite treatment.'],
      recovery: ['Light sensitivity and discomfort for a few days.', 'Blurred vision that can last weeks before settling.', 'No eye rubbing at all — it is a recognised factor in progression.', 'Regular imaging to confirm stability.'],
      faq: [
        { q: 'Does eye rubbing cause keratoconus?', a: 'Chronic eye rubbing is associated with progression, so avoiding it — and treating the allergy that causes itching — is advised.' },
        { q: 'Can I have LASIK with keratoconus?', a: 'Standard LASIK is generally not suitable for keratoconic corneas because it thins them further. Other options exist; the examination decides.' },
        { q: 'When is a corneal transplant needed?', a: 'In advanced cases where lenses no longer give useful vision, or where there is scarring. The corneal transplant page explains more.' }
      ]
    }
  },

  'corneal-transplant': {
    ar: {
      intro: 'زراعة القرنية (رأب القرنية) جراحة يُستبدل فيها جزء من القرنية المتضررة أو كاملها بنسيج قرنية سليم من متبرع. تُلجأ إليها حين تفقد القرنية شفافيتها أو شكلها ولا تكفي العلاجات الأخرى.',
      anatomy: {
        text: 'للقرنية طبقات: الظهارة في السطح، ثم اللحمة (السدى) في الوسط، ثم البطانة في الداخل وهي التي تحافظ على شفافية القرنية بضخ السوائل. تحديد الطبقة المتضررة يحدد نوع الزراعة.',
        parts: [['الظهارة', 'الطبقة السطحية'], ['اللحمة', 'الطبقة الوسطى السميكة'], ['البطانة', 'الطبقة الداخلية التي تحفظ الشفافية']]
      },
      types: [
        ['الزراعة الكاملة', 'PK', 'استبدال كامل سماكة الجزء المركزي من القرنية، عندما تتضرر كل الطبقات.'],
        ['الزراعة الأمامية العميقة', 'DALK', 'استبدال الطبقات الأمامية مع الإبقاء على بطانة المريض، كما في بعض حالات القرنية المخروطية المتقدمة أو التندب.'],
        ['زراعة البطانة', 'DSAEK / DMEK', 'استبدال الطبقة الداخلية فقط عندما يكون الخلل في البطانة، كما في ضمور فوكس أو تورم القرنية.']
      ],
      purpose: 'استعادة شفافية القرنية أو شكلها لتحسين الرؤية، أو تخفيف الألم، أو المحافظة على سلامة العين في بعض الحالات.',
      candidates: ['قرنية مخروطية متقدمة لا تتحسن الرؤية فيها بالعدسات.', 'تندب القرنية بعد عدوى أو إصابة.', 'تورم القرنية بسبب خلل البطانة، مثل ضمور فوكس.', 'فشل زراعة سابقة.'],
      steps: ['فحص يحدد الطبقة المتضررة ونوع الزراعة المناسب.', 'تخدير موضعي أو عام بحسب الحالة.', 'إزالة الجزء المتضرر ووضع نسيج المتبرع وتثبيته بغرز أو بفقاعة هواء في زراعة البطانة.', 'متابعة مكثفة في الأسابيع الأولى.'],
      benefits: ['تحسين الرؤية حين تكون القرنية هي السبب.', 'الزراعات الجزئية تحافظ على أجزاء سليمة من قرنية المريض.', 'تخفيف الألم في بعض الحالات.'],
      limitations: ['التعافي البصري طويل، وقد يستمر شهوراً، خاصة في الزراعة الكاملة.', 'غالباً ما تلزم نظارة أو عدسات لاصقة بعد الزراعة.', 'تحتاج متابعة طويلة الأمد.'],
      risks: ['رفض الجسم للنسيج المزروع، ويمكن علاجه غالباً إن اكتُشف مبكراً.', 'العدوى.', 'ارتفاع ضغط العين.', 'استجماتيزم عالٍ أو مشكلات في الغرز.', 'انفصال نسيج البطانة المزروع وقد يحتاج إعادة حقن هواء.'],
      recovery: ['قطرات لمنع الرفض لفترة طويلة يحددها الطبيب.', 'حماية العين من الصدمات وتجنب فركها.', 'إزالة الغرز تدريجياً على مراحل في الزراعة الكاملة.', 'تعرّف على علامات الرفض: احمرار، حساسية للضوء، تراجع الرؤية، ألم. وتواصل فوراً إن ظهرت.'],
      faq: [
        { q: 'من أين يأتي نسيج القرنية؟', a: 'من بنوك العيون التي تفحص أنسجة المتبرعين وفق معايير طبية صارمة.' },
        { q: 'هل الرفض يعني فشل الزراعة؟', a: 'ليس بالضرورة. كثير من حالات الرفض تُعالج بالقطرات إذا بدأ العلاج مبكراً، ولذلك يجب التواصل فوراً عند ظهور العلامات.' },
        { q: 'كم يستغرق التعافي؟', a: 'يختلف بحسب نوع الزراعة؛ زراعة البطانة أسرع عادةً، والزراعة الكاملة قد تستغرق شهوراً حتى تستقر الرؤية.' }
      ]
    },
    en: {
      intro: 'A corneal transplant (keratoplasty) replaces part or all of a damaged cornea with healthy donor tissue. It is considered when the cornea has lost its clarity or shape and other treatments are not enough.',
      anatomy: {
        text: 'The cornea has layers: the epithelium on the surface, the stroma in the middle, and the endothelium on the inside, which keeps the cornea clear by pumping out fluid. Which layer is damaged decides the type of transplant.',
        parts: [['Epithelium', 'the surface layer'], ['Stroma', 'the thick middle layer'], ['Endothelium', 'the inner layer that keeps the cornea clear']]
      },
      types: [
        ['Full-thickness transplant', 'PK', 'Replaces the full thickness of the central cornea when all layers are affected.'],
        ['Deep anterior transplant', 'DALK', 'Replaces the front layers while keeping the patient’s own endothelium — for example in some advanced keratoconus or scarring.'],
        ['Endothelial transplant', 'DSAEK / DMEK', 'Replaces only the inner layer when the endothelium has failed, as in Fuchs’ dystrophy or corneal swelling.']
      ],
      purpose: 'To restore the clarity or shape of the cornea to improve vision, relieve pain, or in some cases protect the eye.',
      candidates: ['Advanced keratoconus where lenses no longer give useful vision.', 'Corneal scarring after infection or injury.', 'Corneal swelling from endothelial failure, such as Fuchs’ dystrophy.', 'A previous transplant that has failed.'],
      steps: ['An examination identifies the damaged layer and the right type of transplant.', 'Local or general anaesthetic, depending on the case.', 'The damaged tissue is removed and the donor tissue is secured with stitches — or with an air bubble in endothelial transplants.', 'Close follow-up in the first weeks.'],
      benefits: ['Better vision when the cornea is the cause.', 'Partial transplants keep healthy parts of your own cornea.', 'Pain relief in some conditions.'],
      limitations: ['Visual recovery is slow and can take months, especially after a full-thickness transplant.', 'Glasses or contact lenses are often needed afterwards.', 'Long-term follow-up is required.'],
      risks: ['Rejection of the donor tissue, which can often be treated if caught early.', 'Infection.', 'Raised eye pressure.', 'High astigmatism or stitch-related problems.', 'Detachment of an endothelial graft, which may need another air injection.'],
      recovery: ['Anti-rejection drops for a long period set by your surgeon.', 'Protect the eye from knocks and do not rub it.', 'After a full-thickness transplant, stitches are removed in stages.', 'Know the warning signs — redness, light sensitivity, reduced vision, pain — and contact the clinic at once if they appear.'],
      faq: [
        { q: 'Where does the donor cornea come from?', a: 'From eye banks, which screen donor tissue to strict medical standards.' },
        { q: 'Does rejection mean the transplant has failed?', a: 'Not necessarily. Many rejection episodes respond to drops if treatment starts early — which is why you should call at once if signs appear.' },
        { q: 'How long is recovery?', a: 'It depends on the type: endothelial transplants usually recover faster, while full-thickness transplants can take months for vision to settle.' }
      ]
    }
  },

  'intravitreal-injections': {
    ar: {
      intro: 'حقن العين داخل الجسم الزجاجي طريقة لإيصال الدواء مباشرة إلى الجزء الخلفي من العين، قرب الشبكية. تُستخدم لعلاج حالات قد تهدد الرؤية، وغالباً ما تُعطى على دفعات متكررة.',
      anatomy: {
        text: 'الجسم الزجاجي مادة هلامية شفافة تملأ تجويف العين خلف العدسة. تبطّن الشبكية الجدار الخلفي، وفي مركزها البقعة المسؤولة عن الرؤية الدقيقة كالقراءة والتعرف على الوجوه.',
        parts: [['الجسم الزجاجي', 'هلام شفاف يُحقن فيه الدواء'], ['الشبكية', 'الطبقة الحساسة للضوء'], ['البقعة', 'مركز الرؤية الدقيقة']]
      },
      types: [
        ['التنكس البقعي الرطب', 'Wet AMD', 'نمو أوعية دموية غير طبيعية تحت البقعة؛ تساعد أدوية مضادات عامل النمو الوعائي (Anti-VEGF) على التحكم بها.'],
        ['وذمة البقعة السكرية', 'DMO', 'تسرب سوائل في البقعة بسبب السكري، يُعالج غالباً بالحقن إلى جانب ضبط السكر.'],
        ['انسداد أوردة الشبكية', 'RVO', 'تورم البقعة بعد انسداد وريد في الشبكية.']
      ],
      purpose: 'التحكم بالحالة والمحافظة على الرؤية، وتحسينها لدى بعض المرضى. الحقن علاج مستمر في الغالب وليس جرعة واحدة.',
      candidates: ['تشخيص مؤكد بالفحص والتصوير المقطعي للشبكية (OCT).', 'حالات مثل التنكس البقعي الرطب، ووذمة البقعة السكرية، وانسداد أوردة الشبكية.', 'لا يُحقن عادةً مع وجود عدوى نشطة في العين أو حولها.'],
      steps: ['فحص وتصوير للشبكية لتحديد الحاجة وجدول الحقن.', 'قطرات مخدرة وتعقيم دقيق لسطح العين والجفون.', 'حقنة سريعة في بياض العين بإبرة دقيقة جداً.', 'فحص بسيط بعد الحقن، ثم العودة إلى المنزل في اليوم نفسه.'],
      benefits: ['يصل الدواء مباشرة إلى مكان المرض.', 'يساعد على إبطاء فقدان الرؤية في حالات عديدة.', 'إجراء قصير في العيادة.'],
      limitations: ['يحتاج غالباً إلى حقن متكررة ومتابعة منتظمة على مدى طويل.', 'لا يعيد الرؤية المفقودة في كل الحالات.', 'تأخير الجرعات قد يسمح للحالة بالنشاط مجدداً.'],
      risks: ['احمرار أو نقطة نزف على بياض العين، وهي شائعة وتزول خلال أيام.', 'انزعاج أو إحساس بجسم غريب مؤقت.', 'ارتفاع مؤقت في ضغط العين.', 'مضاعفات نادرة لكنها خطيرة: العدوى داخل العين (التهاب باطن العين)، أو تمزق أو انفصال الشبكية. تواصل فوراً عند ألم متزايد أو تراجع الرؤية أو زيادة الاحمرار.'],
      recovery: ['عودة للأنشطة المعتادة عادةً في اليوم التالي.', 'تجنب فرك العين، واتباع تعليمات النظافة.', 'نقاط عائمة صغيرة مؤقتة قد تُرى بعد الحقن.', 'الالتزام بمواعيد الحقن والمتابعة.'],
      faq: [
        { q: 'هل الحقن مؤلمة؟', a: 'تُستخدم قطرات مخدرة، ويصف كثير من المرضى إحساساً بالضغط أكثر من الألم. قد تشعر بانزعاج خفيف لساعات.' },
        { q: 'كم مرة أحتاج إلى الحقن؟', a: 'يختلف ذلك بحسب الحالة والدواء والاستجابة. يحدد الطبيب الجدول بناءً على الفحص والتصوير المتكرر.' },
        { q: 'هل يمكنني القيادة بعد الحقن؟', a: 'يُنصح عادةً بعدم القيادة في يوم الحقن بسبب تأثير القطرات وتشوش الرؤية المؤقت. رتب لمرافق.' }
      ]
    },
    en: {
      intro: 'An intravitreal injection delivers medicine directly into the back of the eye, close to the retina. It is used to treat conditions that can threaten sight and is often given as a course of repeated injections.',
      anatomy: {
        text: 'The vitreous is a clear gel that fills the eye behind the lens. The retina lines the back wall, and at its centre is the macula, responsible for detailed vision such as reading and recognising faces.',
        parts: [['Vitreous', 'the clear gel the medicine is placed in'], ['Retina', 'the light-sensitive layer'], ['Macula', 'the centre of detailed vision']]
      },
      types: [
        ['Wet macular degeneration', 'Wet AMD', 'Abnormal blood vessels grow under the macula; anti-VEGF medicines help control them.'],
        ['Diabetic macular oedema', 'DMO', 'Fluid leaks into the macula because of diabetes; often treated with injections alongside blood-sugar control.'],
        ['Retinal vein occlusion', 'RVO', 'Swelling of the macula after a vein in the retina becomes blocked.']
      ],
      purpose: 'To control the condition and protect vision — and in some patients improve it. Injections are usually an ongoing treatment rather than a single dose.',
      candidates: ['A diagnosis confirmed by examination and retinal imaging (OCT).', 'Conditions such as wet macular degeneration, diabetic macular oedema and retinal vein occlusion.', 'Not usually given while there is an active infection in or around the eye.'],
      steps: ['Examination and retinal imaging decide the need and the schedule.', 'Numbing drops and careful cleaning of the eye surface and lids.', 'A quick injection into the white of the eye with a very fine needle.', 'A short check afterwards, then home the same day.'],
      benefits: ['The medicine reaches the site of the disease directly.', 'Helps slow vision loss in many conditions.', 'A short procedure in clinic.'],
      limitations: ['Usually needs repeated injections and regular long-term follow-up.', 'It does not restore lost vision in every case.', 'Delaying doses can let the condition become active again.'],
      risks: ['Redness or a small bleed on the white of the eye — common and clears within days.', 'Temporary discomfort or a gritty feeling.', 'A short-lived rise in eye pressure.', 'Rare but serious complications: infection inside the eye (endophthalmitis), or a retinal tear or detachment. Call at once if pain, redness or blurred vision get worse.'],
      recovery: ['Usual activities can normally resume the next day.', 'Avoid rubbing the eye and follow the hygiene advice.', 'Small temporary floaters may be visible after the injection.', 'Keep every injection and review appointment.'],
      faq: [
        { q: 'Do the injections hurt?', a: 'Numbing drops are used, and many patients describe pressure rather than pain. Mild discomfort for a few hours is possible.' },
        { q: 'How often will I need them?', a: 'It depends on the condition, the medicine and your response. Your doctor sets the schedule from repeated examination and imaging.' },
        { q: 'Can I drive after an injection?', a: 'Driving on the day is usually not advised because of the drops and temporary blur. Arrange for someone to accompany you.' }
      ]
    }
  }
};
