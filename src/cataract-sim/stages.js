// Stage data for the cataract surgery explainer.
// PROVISIONAL patient-education concepts — NOT an approved surgical protocol. Every text is a draft pending
// review by Dr. Maan Albarry (see docs/implementation/master-redesign-phase-2-3/CLINICAL_REVIEW.md).
// No instrument settings, energies, sizes, durations or outcome promises are stated anywhere.
// Stage `duration` values are animation playback seconds only, not surgical timings.

import { EYE, FULCRUM, ENTRY_OUT, lerp, smooth, along } from './anatomy.js';
import {
  TAU, forcepsGrasp, phacoTip, nucleusPieces, particlesAt, PHACO, iolState, nozzleTip, IOL_SCHEDULE, pathKeys
} from './surgery.js';

export const SOURCES = [
  { name: 'American Academy of Ophthalmology (EyeSmart) — What Is Cataract Surgery?', url: 'https://www.aao.org/eye-health/diseases/what-is-cataract-surgery' },
  { name: 'American Academy of Ophthalmology (EyeSmart) — What Are Cataracts?', url: 'https://www.aao.org/eye-health/diseases/what-are-cataracts' },
  { name: 'NHS (UK) — Cataract surgery', url: 'https://www.nhs.uk/conditions/cataract-surgery/' },
  { name: 'National Eye Institute (NIH) — Cataracts', url: 'https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/cataracts' }
];

const review = (sourceIdx) => ({
  status: 'draft-pending-clinical-review',
  sources: sourceIdx.map((i) => SOURCES[i]),
  reviewedBy: null,
  reviewedAt: null
});

// Camera preset from OrbitControls-style spherical coordinates around a target.
function preset(target, az, polar, dist) {
  return {
    target,
    position: [
      target[0] + dist * Math.sin(polar) * Math.sin(az),
      target[1] + dist * Math.cos(polar),
      target[2] + dist * Math.sin(polar) * Math.cos(az)
    ]
  };
}

const FAR = 26; // instrument parking distance outside the eye (mm along the tunnel axis)
// Instruments only ever enter and leave along the tunnel axis through the incision (fulcrum).
export const outside = (s) => along(FULCRUM, ENTRY_OUT, s);
export const inside = (s) => along(FULCRUM, ENTRY_OUT, -s);

export const STAGES = [
  {
    id: 'cloudy-lens',
    duration: 9,
    title: { en: 'The cloudy natural lens', ar: 'العدسة الطبيعية المعتمة' },
    text: {
      en: 'Behind the coloured iris sits the eye’s natural lens, which focuses light onto the retina. With a cataract this lens gradually becomes cloudy and often yellowish, so light is scattered instead of being focused sharply. This is why vision can look blurred, dim or glary.',
      ar: 'خلف القزحية الملوّنة توجد عدسة العين الطبيعية التي تُركّز الضوء على الشبكية. وفي حالة الساد (الماء الأبيض) تفقد هذه العدسة شفافيتها تدريجيًا وقد تميل إلى الاصفرار، فيتشتّت الضوء بدلًا من أن يتركّز بوضوح؛ ولهذا قد تبدو الرؤية ضبابية أو باهتة أو مصحوبة بوهج.'
    },
    focus: { en: 'Lens nucleus and cortex; the path of light through the eye', ar: 'نواة العدسة وقشرتها، ومسار الضوء داخل العين' },
    camera: preset([0, 0, -4.5], 1.0, 1.32, 50),
    highlight: ['lens'],
    review: review([1, 3]),
    animate(p, P) {
      P.cutaway = true;
      P.scatterRays = smooth(0.08, 0.35, p);
      if (p > 0.3) P.highlight = ['lens'];
    }
  },
  {
    id: 'preparation',
    duration: 8,
    title: { en: 'Preparing and viewing the front of the eye', ar: 'التحضير والنظر إلى مقدّمة العين' },
    text: {
      en: 'Before surgery the pupil is widened with eye drops so the surgeon can see the whole lens. The eye is usually numbed, and the surgeon then looks at it from above through an operating microscope.',
      ar: 'قبل العملية تُوسَّع حدقة العين بقطرات خاصة ليتمكّن الجرّاح من رؤية العدسة كاملة. وعادةً ما يُخدَّر سطح العين، ثم ينظر الجرّاح إليها من الأعلى عبر مجهر جراحي.'
    },
    focus: { en: 'Pupil and iris', ar: 'الحدقة والقزحية' },
    camera: preset([0, 0, 0.4], 0, Math.PI / 2, 34),
    highlight: ['pupil'],
    review: review([0, 2]),
    animate(p, P) {
      P.pupilR = lerp(EYE.pupilNormal, EYE.pupilDilated, smooth(0.15, 0.8, p));
      if (p > 0.1 && p < 0.95) P.highlight = ['pupil'];
    }
  },
  {
    id: 'incision',
    duration: 8,
    title: { en: 'A small opening at the edge of the cornea', ar: 'فتحة صغيرة عند حافة القرنية' },
    text: {
      en: 'A very small incision is made where the clear cornea meets the white of the eye. This tiny entry lets fine instruments reach the lens, and it is often self-sealing.',
      ar: 'يُجرى شقّ صغير جدًا عند حافة القرنية حيث تلتقي القرنية الشفافة ببياض العين. يسمح هذا المدخل الدقيق بوصول الأدوات الجراحية الدقيقة إلى العدسة، وغالبًا ما يلتئم من تلقاء نفسه.'
    },
    focus: { en: 'Cornea and limbus (where the cornea meets the white of the eye)', ar: 'القرنية والحوف (منطقة التقاء القرنية ببياض العين)' },
    camera: preset([3.4, 0, 0.9], 0.5, 1.2, 22),
    highlight: ['cornea'],
    review: review([0, 2]),
    animate(p, P) {
      // keratome: approaches along the tunnel axis, cuts through the clear cornea into the anterior chamber
      // (tip ~1.6 mm past the fulcrum, above the iris) and withdraws along the same axis
      if (p < 0.995) {
        const tip = pathKeys([
          { t: 0, p: outside(FAR) }, { t: 0.32, p: outside(0.7) },
          { t: 0.58, p: inside(1.6) }, { t: 0.66, p: inside(1.6) }, { t: 0.95, p: outside(FAR) }
        ], p);
        P.instrument = { kind: 'keratome', tip };
      }
      P.incision = smooth(0.4, 0.58, p);
      if (p < 0.4) P.highlight = ['cornea'];
    }
  },
  {
    id: 'capsulorhexis',
    duration: 10,
    title: { en: 'Opening the front of the lens capsule', ar: 'فتح الجزء الأمامي من محفظة العدسة' },
    text: {
      en: 'The lens sits inside a thin, clear membrane called the capsule. The surgeon makes a smooth, round opening in the front of this capsule and leaves the rest in place, so it can hold the new lens later.',
      ar: 'توجد العدسة داخل غشاء رقيق شفاف يُسمّى المحفظة. يصنع الجرّاح فتحة دائرية منتظمة في الجزء الأمامي من هذه المحفظة، ويُبقي باقيها في مكانه ليحتضن العدسة الجديدة لاحقًا.'
    },
    focus: { en: 'Front (anterior) lens capsule', ar: 'المحفظة الأمامية للعدسة' },
    camera: preset([0, 0, 0.2], 0.12, 1.36, 25),
    highlight: ['capsule'],
    review: review([0, 2]),
    animate(p, P) {
      // continuous curvilinear tear: the tear front runs once around a circle; the torn flap is folded over and
      // held by the forceps just behind the front; the free flap is then gathered and removed through the incision
      const A = 0.16, B = 0.8, C = 0.86;
      const arcFrac = smooth(A, B, p);
      const arc = arcFrac * TAU;
      P.rhexisArc = arcFrac;
      P.rhexisOpen = p >= A;
      const anchor = forcepsGrasp(TAU);
      let tip;
      if (p < A) tip = pathKeys([{ t: 0, p: outside(FAR) }, { t: 0.07, p: outside(0.4) }, { t: 0.11, p: inside(1.4) }, { t: A, p: forcepsGrasp(0) }], p);
      else if (p < B) tip = forcepsGrasp(arc);
      else if (p < C) tip = anchor;
      else tip = pathKeys([{ t: C, p: anchor }, { t: 0.92, p: inside(1.4) }, { t: 0.95, p: outside(0.4) }, { t: 1, p: outside(FAR) }], p);
      if (p < 0.995) P.instrument = { kind: 'forceps', tip };
      if (p >= A && p < 0.95) P.flap = { arc, bunch: smooth(B, C, p), tip, anchor };
      P.highlight = p > 0.1 && p < 0.85 ? ['capsule'] : [];
    }
  },
  {
    id: 'phaco',
    duration: 12,
    title: { en: 'Removing the cloudy lens', ar: 'إزالة العدسة المعتمة' },
    text: {
      en: 'A fine ultrasound probe gently breaks the cloudy lens into small pieces and removes them with gentle suction; this technique is called phacoemulsification. The clear capsule is left behind as a natural pocket.',
      ar: 'يُستخدم مسبار دقيق يعمل بالموجات فوق الصوتية لتفتيت العدسة المعتمة إلى أجزاء صغيرة وشفطها بلطف، وتُعرف هذه التقنية باسم استحلاب العدسة (الفاكو). وتبقى المحفظة الشفافة في مكانها كجيبٍ طبيعي.'
    },
    focus: { en: 'Lens nucleus and the capsular bag', ar: 'نواة العدسة والكيس المحفظي' },
    camera: preset([0, 0, -1.0], 0.38, 1.12, 24),
    highlight: ['lens'],
    review: review([0, 2, 3]),
    animate(p, P) {
      // fragmentation and emulsification INSIDE the capsular bag: central sculpting, cracking into four
      // quadrants, each quadrant drawn to the probe tip and aspirated there; then the cortex clears
      const tip = phacoTip(p, outside, inside);
      if (p < 0.995) P.instrument = { kind: 'phaco', tip };
      P.nucleusP = p;
      const pieces = nucleusPieces(p);
      P.particles = particlesAt(p, tip, pieces);
      const removed = pieces.reduce((a, q) => a + (1 - (q.visible ? q.scale : 0)), 0) / 4;
      P.cataract = 1 - removed;
      P.cortexOpacity = 1 - smooth(PHACO.cortex[0], PHACO.cortex[1], p);
      P.highlight = p > 0.12 && p < 0.4 ? ['lens'] : [];
    }
  },
  {
    id: 'iol',
    duration: 12,
    title: { en: 'Placing the artificial lens', ar: 'وضع العدسة الصناعية' },
    text: {
      en: 'A clear artificial lens (intraocular lens) is folded so it can pass through the small opening. Inside the eye it gently unfolds, and its flexible side arms hold it centred within the capsule.',
      ar: 'تُطوى عدسة صناعية شفافة (عدسة داخل العين) لتمرّ عبر الفتحة الصغيرة. وداخل العين تنفرد بلطف، وتعمل ذراعاها المرنتان على تثبيتها في منتصف المحفظة.'
    },
    focus: { en: 'Intraocular lens inside the capsular bag', ar: 'العدسة الصناعية داخل الكيس المحفظي' },
    camera: preset([0, 0, -1.0], -0.3, 1.15, 25),
    highlight: ['iol'],
    review: review([0, 2]),
    animate(p, P) {
      // folded IOL leaves the cartridge nozzle (held in the incision), unfolds inside the capsular bag, the
      // haptics open into the bag equator and the optic is centred behind the iris; then the empty bag settles
      const S = IOL_SCHEDULE;
      if (p < S.out[1]) {
        const tip = pathKeys([{ t: 0, p: outside(FAR) }, { t: 0.1, p: outside(0.4) }, { t: 0.16, p: nozzleTip() }, { t: S.out[0], p: nozzleTip() }, { t: 0.55, p: outside(0.4) }, { t: S.out[1], p: outside(FAR) }], p);
        P.instrument = { kind: 'injector', tip };
      }
      P.iol = iolState(p);
      P.bagCollapse = smooth(S.collapse[0], S.collapse[1], p);
      P.highlight = p > 0.62 ? ['iol'] : [];
    }
  },
  {
    id: 'completion',
    duration: 9,
    title: { en: 'Completion: a clear path for light', ar: 'الانتهاء: مسار واضح للضوء' },
    text: {
      en: 'The instruments are removed and the pupil gradually returns towards its usual size. With the clear artificial lens in place, light can again pass through and be focused on the retina. Recovery and results differ from person to person, so your doctor will guide your follow-up.',
      ar: 'تُسحب الأدوات وتعود الحدقة تدريجيًا نحو حجمها المعتاد. ومع وجود العدسة الصناعية الشفافة يمكن للضوء أن يعبر مجددًا ويتركّز على الشبكية. وتختلف فترة التعافي والنتائج من شخص لآخر، لذا سيرشدك طبيبك خلال مواعيد المتابعة.'
    },
    focus: { en: 'Light path through the new lens to the retina', ar: 'مسار الضوء عبر العدسة الجديدة نحو الشبكية' },
    camera: preset([0, 0, -7], 1.0, 1.36, 58),
    highlight: [],
    review: review([0, 2, 3]),
    animate(p, P) {
      P.pupilR = lerp(EYE.pupilDilated, EYE.pupilAfter, smooth(0.05, 0.5, p));
      P.incision = lerp(1, 0.3, smooth(0, 0.6, p));
      P.cutaway = true;
      P.focusRays = smooth(0.3, 0.65, p);
    }
  }
];

// Anatomy inspection targets: label anchor (world mm), camera preset and short bilingual description.
export const STRUCTURES = [
  { id: 'cornea', name: { en: 'Cornea', ar: 'القرنية' },
    desc: { en: 'The clear front window of the eye. It bends incoming light and protects the inside of the eye.', ar: 'النافذة الأمامية الشفافة للعين؛ تكسر الضوء الداخل إليها وتحمي الأجزاء الداخلية.' },
    camera: preset([0, 0, 2], 0.75, 1.25, 26) },
  { id: 'iris', name: { en: 'Iris', ar: 'القزحية' },
    desc: { en: 'The coloured ring of muscle that controls how much light enters through the pupil.', ar: 'الحلقة العضلية الملوّنة التي تتحكّم في كمية الضوء الداخلة عبر الحدقة.' },
    camera: preset([0, -1.5, 0.4], 0.1, 1.4, 24) },
  { id: 'pupil', name: { en: 'Pupil', ar: 'الحدقة' },
    desc: { en: 'The opening in the centre of the iris. It is widened with drops before cataract surgery.', ar: 'الفتحة في وسط القزحية، وتُوسَّع بالقطرات قبل عملية الساد.' },
    camera: preset([0, 0, 0.3], 0, Math.PI / 2, 20) },
  { id: 'lens', name: { en: 'Lens & nucleus', ar: 'العدسة ونواتها' },
    desc: { en: 'The natural lens focuses light. In a cataract its central part (the nucleus) becomes cloudy and often yellow-brown.', ar: 'تُركّز العدسة الطبيعية الضوء، وفي حالة الساد يصبح جزؤها المركزي (النواة) معتمًا ويميل غالبًا إلى البني المصفرّ.' },
    camera: preset([0, 0, -1.4], 1.05, 1.35, 30) },
  { id: 'capsule', name: { en: 'Lens capsule', ar: 'محفظة العدسة' },
    desc: { en: 'A thin, clear membrane wrapped around the lens. Most of it is kept to support the artificial lens.', ar: 'غشاء رقيق شفاف يُغلّف العدسة، ويُحتفظ بمعظمه ليحمل العدسة الصناعية.' },
    camera: preset([0, 0, -1.2], 0.9, 1.15, 28) },
  { id: 'zonules', name: { en: 'Zonules', ar: 'الأربطة المعلّقة' },
    desc: { en: 'Very fine fibres that hold the lens capsule in place, like tiny suspension threads.', ar: 'ألياف دقيقة جدًا تُثبّت محفظة العدسة في مكانها، وتشبه خيوط تعليق صغيرة.' },
    camera: preset([0, 0, -1.3], 1.2, 1.3, 30) },
  { id: 'iol', name: { en: 'Artificial lens (IOL)', ar: 'العدسة الصناعية' },
    desc: { en: 'A clear optic with two flexible arms (haptics) that keep it centred. It is placed in stage 6.', ar: 'جزء بصري شفاف مع ذراعين مرنتين تُبقيانها في المنتصف، وتُوضع في المرحلة السادسة.' },
    camera: preset([0, 0, -1.2], 0.55, 1.2, 26) }
];

// Anatomical state shared by all stages.
export function defaultParams() {
  return {
    pupilR: EYE.pupilNormal, cataract: 1, nucleusP: 0, cortexOpacity: 1,
    rhexisArc: 0, rhexisOpen: false, flap: null, incision: 0, bagCollapse: 0,
    instrument: null, particles: [], iol: null,
    scatterRays: 0, focusRays: 0, cutaway: false, highlight: []
  };
}

// Deterministic scene state for (stage, local progress): the end state of every earlier stage, then the
// current stage at p. Presentation-only fields are reset so they never leak between stages.
export function paramsAt(index, p) {
  index = Math.max(0, Math.min(STAGES.length - 1, Math.round(Number(index) || 0)));
  p = Math.min(1, Math.max(0, Number(p) || 0));
  const P = defaultParams();
  for (let k = 0; k < index; k++) STAGES[k].animate(1, P);
  Object.assign(P, { instrument: null, flap: null, particles: [], scatterRays: 0, focusRays: 0, cutaway: false, highlight: [] });
  STAGES[index].animate(p, P);
  return P;
}
