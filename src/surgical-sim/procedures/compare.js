// Before / After for each procedure simulator (owner brief 2026-11-23, §13). "Before" is the start of the first stage
// and "After" the end of the last stage of the SAME model, viewed from the SAME camera, so the only difference on
// screen is what the treatment changes anatomically. The texts say what changes in the eye — never a promised visual
// result, never an instant cure. `variants` limits the comparison to the technique tabs where it is a treatment. Pending Dr. Maan's review (BEFORE_AFTER_VALIDATION.md).
export const COMPARE = {
  'lens-implants': {
    before: { ar: 'قبل: العدسة الطبيعية المعتمة (الماء الأبيض) داخل محفظتها خلف القزحية.', en: 'Before: the clouded natural lens (cataract) in its capsule behind the iris.' },
    after: { ar: 'بعد: عدسة صناعية شفافة في المحفظة نفسها. نوع العدسة يحدد مدى الرؤية، وقد تبقى الحاجة إلى النظارة لبعض المسافات.', en: 'After: a clear artificial lens in the same capsule. The lens type decides the range of vision; glasses may still be needed for some distances.' }
  },
  icl: {
    before: { ar: 'قبل: العين بعدستها الطبيعية الشفافة، دون عدسة إضافية.', en: 'Before: the eye with its clear natural lens and no added lens.' },
    after: { ar: 'بعد: عدسة ICL رقيقة خلف القزحية وأمام العدسة الطبيعية التي تبقى في مكانها. تصحح درجة النظر، وتلزم متابعة دورية.', en: 'After: a thin ICL behind the iris, in front of the natural lens, which stays in place. It corrects the prescription; regular follow-up is needed.' }
  },
  'laser-vision-correction': {
    before: { ar: 'قبل: القرنية بانحنائها الأصلي الذي يسبب خطأ الانكسار.', en: 'Before: the cornea with its original curve, which causes the refractive error.' },
    after: { ar: 'بعد: القرنية بعد إعادة تشكيل طبقتها الوسطى بالليزر. تستقر الرؤية خلال أيام إلى أسابيع بحسب التقنية، والنتيجة تختلف من شخص لآخر.', en: 'After: the cornea once its middle layer has been reshaped by the laser. Vision settles over days to weeks depending on the technique, and results vary between people.' }
  },
  'keratoconus-cxl': {
    // only the treatment tab: the "understanding keratoconus" tab shows the disease progressing, which is not a before/after
    variants: ['cxl'],
    before: { ar: 'قبل: قرنية رقيقة متحدبة بشكل مخروطي.', en: 'Before: a thin cornea bulging into a cone.' },
    after: { ar: 'بعد: ألياف القرنية أكثر ترابطاً. الهدف إبطاء تطور الحالة أو إيقافه؛ ولا يعيد التثبيت القرنية إلى شكلها الطبيعي فوراً، وقد تبقى الحاجة إلى نظارة أو عدسات.', en: 'After: the corneal fibres are more cross-linked. The aim is to slow or halt progression; cross-linking does not restore a normal corneal shape instantly, and glasses or lenses may still be needed.' }
  },
  'corneal-transplant': {
    before: { ar: 'قبل: الطبقة المتضررة من القرنية.', en: 'Before: the damaged layer of the cornea.' },
    after: { ar: 'بعد: نسيج من متبرع مكان الجزء المتضرر. التعافي البصري تدريجي وقد يستمر شهوراً، مع متابعة وقطرات لمنع الرفض.', en: 'After: donor tissue in place of the damaged part. Visual recovery is gradual and can take months, with follow-up and drops to prevent rejection.' }
  },
  'intravitreal-injections': {
    before: { ar: 'قبل: الجسم الزجاجي والشبكية قبل الحقن.', en: 'Before: the vitreous and retina before the injection.' },
    after: { ar: 'بعد: وصل الدواء إلى الجسم الزجاجي قرب الشبكية. يعمل تدريجياً، وغالباً ما يحتاج العلاج إلى سلسلة من الحقن بحسب الحالة؛ وليس علاجاً فورياً.', en: 'After: the medicine is in the vitreous near the retina. It works gradually, and treatment often needs a series of injections depending on the condition; it is not an instant cure.' }
  }
};
