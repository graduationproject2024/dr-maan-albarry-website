// ============================================================
// DR. MAAN AL BARRY — OFFICIAL MEDICAL PORTAL
// Clinical Prestige & Academic Ophthalmology
// ============================================================

// --- DATA LAYER (Verified Primary Source Facts) ---
export const DOCTOR = {
  nameAr: 'د. معن بن عبدالله البري',
  nameEn: 'Dr. Maan bin Abdullah Al Barry',
  shortNameAr: 'د. معن بن عبدالله البري',
  shortNameEn: 'Dr. Maan Al Barry',
  titleAr: 'استشاري طب وجراحة العيون (تخصص جراحات القرنية والماء الأبيض وتصحيح الإبصار)',
  titleEn: 'Consultant Ophthalmologist (Specializing in Cornea, Cataract & Refractive Surgery)',
  degreesAr: 'زميل الكلية البريطانية الملكية FRCS',
  degreesEn: 'Fellow of the Royal College of Surgeons (UK) FRCS',
  experienceSince: 1998,
  clinicAr: 'مستشفيات ومراكز مغربي للعيون والأذن – المدينة المنورة',
  clinicEn: 'Magrabi Health Eye & ENT Hospital – Madinah',
  addressAr: 'طريق المطار، المدينة المنورة، المملكة العربية السعودية',
  addressEn: 'Airport Road, Madinah, Saudi Arabia',
  whatsapp: '966554946433',
  bookingUrl: 'https://ob.magrabi.com.sa/OnlineBooking/',
  callCenter: '19505',
  landline: '920018000',
  clinicDirectPhone: '0554946433',
  clinicDirectPhoneTel: '+966554946433',
  instagram: 'https://www.instagram.com/dr_maan_albarry?xtok=MTZqcGVsZG4wNGhheg==',
  twitter: 'https://x.com/maanalbarry?s=11&t=gevckOqd4vSgDb_51Inwbg',
  youtube: 'https://m.youtube.com/@drmaanalbarry3195/featured?ra=m',
  magrabiProfile: 'https://www.magrabihealth.com/ar/sa/eye/our-doctors/dr-maan-abdullah-barry',
  taibahProfile: 'https://www.taibahu.edu.sa/the-university/about-taibah-university/faculty-members/1431',
  email: 'mbarry@taibahu.edu.sa',
  mapsUrl: 'https://maps.app.goo.gl/Hx6M1eKNEnGbe7AbA',
  roles: {
    ar: [
      'كبير موظفي مركز مغربي المدينة المنورة (المشرف العام على الشؤون الطبية والإدارية والتشغيلية بالفرع)',
      'أول رئيس للرابطة السعودية لجراحي القرنية والماء الأبيض وتصحيح الإبصار',
      'زميل الكلية البريطانية الملكية FRCS',
      'رئيس قسم طب وجراحة العيون بجامعة طيبة سابقاً لمدة 10 سنوات',
      'ممثل الجمعية السعودية لطب العيون بالمدينة المنورة سابقاً',
      'أحد مؤسسي مؤتمر البحر الأحمر الدولي للطب وجراحة العيون',
      'خبرة سريرية وأكاديمية وجراحية ممتدة منذ عام 1998'
    ],
    en: [
      'Chief Medical Officer – Magrabi Health Madinah (General Supervisor of Medical, Administrative & Operational Affairs)',
      'First President of the Saudi Association of Cornea, Cataract & Refractive Surgeons',
      'Fellow of the Royal College of Surgeons (UK) FRCS',
      'Former Chairman, Department of Ophthalmology – Taibah University (10 Years)',
      'Former Representative of the Saudi Ophthalmological Society in Madinah',
      'Co-Founder of the Red Sea International Ophthalmology Conference',
      'Extensive Clinical, Surgical & Academic Experience Since 1998'
    ]
  }
};

// --- CLINICALLY VERIFIED VISION SIMULATOR CONFIGURATION ---
// Based on BMC Ophthalmology 2019 Meta-Analysis & ESCRS 2024 Clinical Proceedings
const DEFOCUS_STEPS = [0, -0.5, -1, -1.5, -2, -2.5, -3, -3.5];

const LENSES = {
  edof: {
    id: 'edof',
    ar: 'ممتدة المدى (EDOF) — الخيار المفضل حالياً سريرياً',
    en: 'Extended Depth of Focus (EDOF) — Clinically Favored',
    va: [0, 0.03, 0.08, 0.13, 0.18, 0.23, 0.36, 0.50],
    halo: 0.16,
    noteAr: 'الخيار المفضل حالياً لدى الدكتور معن لأغلب الحالات: جودة رؤية عالية وحساسية تباين ممتازة مع هالات ليلية منخفضة جداً وراحة فائقة أثناء القيادة والعمل على الشاشات. قد تلزم نظارة خفيفة للقراءة الدقيقة جداً.',
    noteEn: 'Currently favored by Dr. Maan for most cases: optimal visual contrast, high clarity, and minimal night halos for driving and screens. Light reading glasses may only be needed for fine print.'
  },
  trifocal: {
    id: 'trifocal',
    ar: 'ثلاثية البؤرة (Trifocal)',
    en: 'Trifocal',
    va: [0, 0.08, 0.12, 0.1, 0.08, 0.1, 0.17, 0.32],
    halo: 0.78,
    noteAr: 'استقلالية أكبر عن نظارة القراءة للمسافات القريبة، ولكن نظراً لانقسام الضوء بين 3 بؤر فقد تنخفض حساسية التباين وتزداد الهالات الحلقية والوهج ليلاً مقارنة بعدسات EDOF، وتتطلب وقتاً للتكيف العصبي.',
    noteEn: 'Provides high near spectacle independence; however, light division can reduce contrast and generate concentric night halos/glare compared to EDOF, requiring neuroadaptation.'
  },
  monofocal: {
    id: 'monofocal',
    ar: 'أحادية البؤرة (Monofocal)',
    en: 'Monofocal',
    va: [0, 0.1, 0.18, 0.32, 0.42, 0.5, 0.58, 0.66],
    halo: 0.08,
    noteAr: 'أعلى نقاء وتباين للمسافات البعيدة وأقل هالات ليلية؛ تتطلب دائماً نظارة للمسافات المتوسطة (الكمبيوتر) والقريبة (القراءة).',
    noteEn: 'Purest distance acuity and lowest halos; definitely requires glasses for intermediate (computer) and near (reading).'
  },
  cataract: {
    id: 'cataract',
    ar: 'ساد غير معالج (عتامة العدسة)',
    en: 'Untreated Cataract',
    va: [0.5, 0.5, 0.52, 0.52, 0.55, 0.55, 0.58, 0.6],
    halo: 0,
    noteAr: 'عتامة متوسطة تشوش الرؤية وتسبب تشتت الضوء والوهج وانخفاض التباين، ولا يمكن تصحيحها بالنظارات.',
    noteEn: 'Moderate lens opacity causing blur, severe glare scatter, and loss of contrast, not correctable by glasses.'
  }
};

const DISTANCE_STEPS = [
  [0, 'بعيد (٦م+)', 'Distance (6m+)'],
  [-1, '١ متر', '1 m'],
  [-1.5, 'كمبيوتر ٦٦سم', 'Computer 66cm'],
  [-2.5, 'جوال ٤٠سم', 'Phone 40cm'],
  [-3, 'كتاب ٣٣سم', 'Book 33cm']
];

// Simulator State
let simState = {
  lens: 'edof',
  scene: 'night',
  D: 0,
  pos: 50,
  tab: 'sim',
  lang: 'ar'
};

const tText = (ar, en) => (currentLang === 'ar' ? ar : en);

const SNELLEN_DENOMS = [20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200];
const toSnellen = (logmar) => {
  const target = 20 * (10 ** logmar);
  return '20/' + SNELLEN_DENOMS.reduce((prev, curr) => Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev);
};

function getAcuity(lensKey, diopter) {
  const va = LENSES[lensKey].va;
  const idx = Math.min(3.5, Math.max(0, -diopter)) / 0.5;
  const base = Math.min(6, Math.floor(idx));
  return va[base] + (va[base + 1] - va[base]) * (idx - base);
}

function getNearestFunctional(lensKey) {
  let nearest = 0;
  for (let n = 0; n <= 3.5; n += 0.05) {
    if (getAcuity(lensKey, -n) <= 0.2) nearest = n;
  }
  return nearest;
}

export const VisionSim = (() => {
  'use strict';
  /* ================= 1) DATA — منسوخة من main.js بدون تغيير ================= */
  const DEFOCUS_STEPS = [0, -.5, -1, -1.5, -2, -2.5, -3, -3.5];
  const LENSES = {
    edof: {
      ar: 'ممتدة المدى (EDOF) — الخيار المفضل حالياً سريرياً',
      en: 'Extended Depth of Focus (EDOF) — Clinically Favored',
      va: [0, .03, .08, .13, .18, .23, .36, .5],
      halo: .16,
      noteAr: 'الخيار المفضل حالياً لدى الدكتور معن لأغلب الحالات: جودة رؤية عالية وحساسية تباين ممتازة مع هالات ليلية منخفضة جداً وراحة فائقة أثناء القيادة والعمل على الشاشات. قد تلزم نظارة خفيفة للقراءة الدقيقة جداً.',
      noteEn: 'Currently favored by Dr. Maan for most cases: optimal visual contrast, high clarity, and minimal night halos for driving and screens. Light reading glasses may only be needed for fine print.'
    },
    trifocal: {
      ar: 'ثلاثية البؤرة (Trifocal)',
      en: 'Trifocal',
      va: [0, .08, .12, .1, .08, .1, .17, .32],
      halo: .78,
      noteAr: 'استقلالية أكبر عن نظارة القراءة للمسافات القريبة، ولكن نظراً لانقسام الضوء بين 3 بؤر فقد تنخفض حساسية التباين وتزداد الهالات الحلقية والوهج ليلاً مقارنة بعدسات EDOF، وتتطلب وقتاً للتكيف العصبي.',
      noteEn: 'Provides high near spectacle independence; however, light division can reduce contrast and generate concentric night halos/glare compared to EDOF, requiring neuroadaptation.'
    },
    monofocal: {
      ar: 'أحادية البؤرة (Monofocal)',
      en: 'Monofocal',
      va: [0, .1, .18, .32, .42, .5, .58, .66],
      halo: .08,
      noteAr: 'أعلى نقاء وتباين للمسافات البعيدة وأقل هالات ليلية؛ تتطلب دائماً نظارة للمسافات المتوسطة (الكمبيوتر) والقريبة (القراءة).',
      noteEn: 'Purest distance acuity and lowest halos; definitely requires glasses for intermediate (computer) and near (reading).'
    },
    cataract: {
      ar: 'ساد غير معالج (عتامة العدسة)',
      en: 'Untreated Cataract',
      va: [.5, .5, .52, .52, .55, .55, .58, .6],
      halo: 0,
      noteAr: 'عتامة متوسطة تشوش الرؤية وتسبب تشتت الضوء والوهج وانخفاض التباين، ولا يمكن تصحيحها بالنظارات.',
      noteEn: 'Moderate lens opacity causing blur, severe glare scatter, and loss of contrast, not correctable by glasses.'
    }
  };
  const DISTANCE_STEPS = [
    [0, 'بعيد (٦م+)', 'Distance (6m+)'],
    [-1, '١ متر', '1 m'],
    [-1.5, 'كمبيوتر ٦٦سم', 'Computer 66cm'],
    [-2.5, 'جوال ٤٠سم', 'Phone 40cm'],
    [-3, 'كتاب ٣٣سم', 'Book 33cm']
  ];
  const SN = [20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200];
  const toSnellen = lm => {
    const t = 20 * 10 ** lm;
    return '20/' + SN.reduce((a, c) => Math.abs(c - t) < Math.abs(a - t) ? c : a);
  };
  const acuity = (k, d) => {
    const v = LENSES[k].va, i = Math.min(3.5, Math.max(0, -d)) / .5, b = Math.min(6, Math.floor(i));
    return v[b] + (v[b + 1] - v[b]) * (i - b);
  };
  const nearest = k => {
    let n = 0;
    for (let x = 0; x <= 3.5; x += .05) if (acuity(k, -x) <= .2) n = x;
    return n;
  };

  /* ================= 2) CONFIG — عدّل هنا ================= */
  // fov: زاوية الرؤية الرأسية (°) | angScale: تكبير الزاوية لأن الشاشة أصغر من المجال البصري الحقيقي (1 = حرفي، تعليمي ≈ 9)
  // pupil: قطر البؤبؤ (مم) | veil*: معامل التشتت الأمامي النسبي (الساد = أعلى عدة مرات) — كلها افتراضات لازم الدكتور يراجعها
  const CFG = {
    tex: [1280, 720],
    out: [960, 540],
    fov: 38,
    angScale: 9,
    pupil: { night: 5.5, read: 3 },
    veilNormal: .35,
    veilCat: 2.4,
    speed: 1,
    fps: 45,
    ease: .14,
    textPx: 35
  };

  const S = {
    lens: 'edof',
    scene: 'night',
    D: 0,
    pos: 50,
    tab: 'sim',
    lang: 'ar',
    motion: !matchMedia('(prefers-reduced-motion:reduce)').matches
  };
  const T = (a, e) => S.lang === 'ar' ? a : e;

  /* ================= 3) 3D (three.js) + البصريات الطبية ================= */
  const W = CFG.tex[0], H = CFG.tex[1];
  const PXR = H / (CFG.fov * Math.PI / 180), PXA = H / (CFG.fov * 60);
  const ADDP = { edof: [.9, 0], trifocal: [1.3, 2.6], monofocal: [.9, 0], cataract: [0, 0] };
  const rnd = (s => () => (s = s * 16807 % 2147483647) / 2147483647)(7);
  const LAR = [
    [.5, 'رؤية أوضح'],
    [.4, 'عينك أمانة'],
    [.3, 'الفحص الدوري يحفظ بصرك'],
    [.2, 'عدسة تناسب نمط حياتك اليومي'],
    [.1, 'القراءة المريحة تحتاج إضاءة جيدة'],
    [0, 'مستشفيات مغربي للعيون والأذن · المدينة المنورة']
  ];
  const LEN = [
    [.5, 'Clear sight'],
    [.4, 'Your eyes matter'],
    [.3, 'Regular exams protect vision'],
    [.2, 'A lens that fits your daily life'],
    [.1, 'Good light makes reading easy'],
    [0, 'Magrabi Health Eye & ENT · Madinah']
  ];
  let rdr, RT, pm, postS, postC, world, cam, GT, fog, nightG, readG, lamps, cars, road, dust, dust0, bulb;
  const ptr = { x: 0, y: 0 };
  const cvs = (w, h, f) => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    f(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 4;
    return t;
  };
  const mat = (c, o) => {
    const m = new THREE.MeshBasicMaterial(o);
    Array.isArray(c) ? m.color.setRGB(c[0], c[1], c[2]) : m.color.set(c);
    return m;
  };
  const ADV = () => ({ blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false });
  const box = (w, h, d, c, x, y, z, p) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c));
    m.position.set(x, y, z);
    p.add(m);
    return m;
  };
  const glow = (c, s, x, y, z, p) => {
    const m = new THREE.Sprite(new THREE.SpriteMaterial(Object.assign({ map: GT, color: new THREE.Color(c[0], c[1], c[2]) }, ADV())));
    m.scale.set(s, s, 1);
    m.position.set(x, y, z);
    p.add(m);
    return m;
  };
  const pool = (c, w, h, x, z, p) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial(Object.assign({ map: GT, color: new THREE.Color(c[0], c[1], c[2]) }, ADV())));
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, .03, z);
    p.add(m);
    return m;
  };

  function buildNight() {
    const n = new THREE.Group();
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(900, 420), new THREE.MeshBasicMaterial({
      fog: false,
      depthWrite: false,
      map: cvs(1024, 512, (x, w, h) => {
        let q = x.createLinearGradient(0, 0, 0, h);
        q.addColorStop(0, '#04081a');
        q.addColorStop(.45, '#13213f');
        q.addColorStop(.78, '#46435c');
        q.addColorStop(.783, '#0c0f15');
        q.addColorStop(1, '#0c0f15');
        x.fillStyle = q;
        x.fillRect(0, 0, w, h);
        q = x.createLinearGradient(0, h * .55, 0, h * .78);
        q.addColorStop(0, 'rgba(255,150,80,0)');
        q.addColorStop(1, 'rgba(255,160,90,.35)');
        x.fillStyle = q;
        x.fillRect(0, h * .55, w, h * .23);
        for (let i = 0; i < 110; i++) {
          x.fillStyle = `rgba(255,255,255,${.25 + .5 * rnd()})`;
          x.fillRect(rnd() * w, rnd() * h * .5, 1.6, 1.6);
        }
        const mx = w * .7, my = h * .626;
        x.save();
        x.beginPath();
        x.arc(mx, my, 14, 0, 7);
        x.clip();
        x.fillStyle = '#f7f1de';
        x.beginPath();
        x.rect(0, 0, w, h);
        x.moveTo(mx + 19, my - 3);
        x.arc(mx + 6, my - 3, 12, 0, 7);
        x.fill('evenodd');
        x.restore();
      })
    }));
    sky.position.set(0, 120, -420);
    n.add(sky);
    glow([3, 2.8, 2.4], 70, 180, 67, -415, n);
    const sk = new THREE.Mesh(new THREE.PlaneGeometry(760, 70), new THREE.MeshBasicMaterial({
      transparent: true,
      fog: false,
      depthWrite: false,
      map: cvs(1024, 96, (x, w, h) => {
        for (let b = 0; b < w;) {
          const bw = 14 + rnd() * 34, bh = 10 + rnd() * (Math.abs(b - w / 2) > w * .2 ? 80 : 36);
          x.fillStyle = '#0b111e';
          x.fillRect(b, h - bh, bw, bh);
          for (let wy = h - bh + 5; wy < h - 3; wy += 7)
            for (let wx = b + 3; wx < b + bw - 4; wx += 6)
              if (rnd() < .34) {
                x.fillStyle = `rgba(255,210,140,${.4 + .5 * rnd()})`;
                x.fillRect(wx, wy, 2.4, 3);
              }
          b += bw + 2;
        }
      })
    }));
    sk.position.set(0, 34, -300);
    n.add(sk);
    const gr = new THREE.Mesh(new THREE.PlaneGeometry(1400, 900), mat('#0c0f15'));
    gr.rotation.x = -Math.PI / 2;
    gr.position.set(0, -.02, -300);
    n.add(gr);
    const rt = cvs(512, 1024, (x, w, h) => {
      x.fillStyle = '#2b2f3a';
      x.fillRect(0, 0, w, h);
      for (let i = 0; i < 9000; i++) {
        const v = 40 + rnd() * 40 | 0;
        x.fillStyle = `rgb(${v},${v + 3},${v + 10})`;
        x.fillRect(rnd() * w, rnd() * h, 1.5, 1.5);
      }
      const X = m => (m + 10.6) / 16.4 * w;
      x.fillStyle = '#c9ced4';
      [-10.2, 5.4].forEach(m => x.fillRect(X(m) - 3.5, 0, 7, h));
      x.fillStyle = '#d9b44c';
      x.fillRect(X(-1.8) - 3, 0, 6, h);
      x.fillStyle = 'rgba(228,232,238,.85)';
      for (let k = 0; k < 4; k++)
        [1.8, -6.6].forEach(m => x.fillRect(X(m) - 2.5, k * 256, 5, 102));
    });
    rt.wrapT = THREE.RepeatWrapping;
    rt.repeat.set(1, 400 / 36);
    road = new THREE.Mesh(new THREE.PlaneGeometry(16.4, 400), mat('#fff', { map: rt }));
    road.rotation.x = -Math.PI / 2;
    road.position.set(-2.4, 0, -200);
    n.add(road);
    box(.6, .85, 400, '#3a404c', -2.7, .425, -200, n);
    pool([.45, .45, .42], 14, 36, 0, -18, n);
    lamps = [];
    for (let k = 0; k < 12; k++) {
      const m = new THREE.Group();
      box(.18, 9.2, .18, '#1a202b', -2.7, 4.6, 0, m);
      box(3.6, .12, .12, '#1a202b', -2.7, 9.1, 0, m);
      for (const dx of [-4.3, -1.1]) {
        box(.7, .14, .34, [7, 4.8, 2.4], dx, 9, 0, m);
        glow([2.4, 1.5, .7], 4.5, dx, 9, 0, m);
        pool([.85, .5, .22], 16, 16, dx, 0, m);
      }
      const r = new THREE.Group();
      box(.18, 9, .18, '#1a202b', 6.9, 4.5, 0, r);
      box(2, .12, .12, '#1a202b', 5.9, 8.9, 0, r);
      box(.7, .14, .34, [7, 4.8, 2.4], 5, 8.8, 0, r);
      glow([2.4, 1.5, .7], 4.5, 5, 8.8, 0, r);
      pool([.85, .5, .22], 16, 16, 5, 0, r);
      n.add(m, r);
      lamps.push([m, r]);
    }
    const car = tail => {
      const c = new THREE.Group();
      box(1.8, .7, 4.2, '#0d1118', 0, .6, 0, c);
      box(1.5, .55, 2.2, '#171e2b', 0, 1.2, .1, c);
      c.userData.sp = [];
      for (const dx of [-.68, .68]) {
        if (tail) {
          box(.4, .14, .06, [5, .35, .28], dx, .85, 2.1, c);
          c.userData.sp.push(glow([2.2, .2, .15], 2.2, dx, .85, 2.15, c));
        } else {
          box(.4, .2, .06, [9, 8.4, 7], dx, .72, 2.1, c);
          glow([2.6, 2.4, 2], 3.4, dx, .72, 2.2, c);
        }
      }
      if (!tail) pool([.7, .68, .6], 8, 18, 0, 10, c);
      n.add(c);
      return c;
    };
    cars = { on: [car(0), car(0), car(0)], ah: [car(1), car(1)] };
    const st = cvs(1024, 388, (x, w, h) => {
      const q = x.createLinearGradient(0, 0, w, h);
      q.addColorStop(0, '#14875e');
      q.addColorStop(1, '#0a5a3d');
      x.fillStyle = q;
      x.fillRect(0, 0, w, h);
      x.strokeStyle = '#eef4ee';
      x.lineWidth = 12;
      x.strokeRect(22, 22, w - 44, h - 44);
      x.fillStyle = '#fff';
      x.textAlign = 'center';
      x.direction = 'rtl';
      x.font = '600 120px "IBM Plex Sans Arabic",Alexandria,sans-serif';
      x.fillText('المدينة المنورة', w * .6, h * .52);
      x.direction = 'ltr';
      x.font = '500 66px Inter,sans-serif';
      x.fillText('Madinah  ·  12 km', w * .6, h * .82);
      const ax = w * .14, ay = h * .5, u = h * .2;
      x.beginPath();
      x.moveTo(ax, ay - u * 1.3);
      x.lineTo(ax + u, ay);
      x.lineTo(ax + u * .35, ay);
      x.lineTo(ax + u * .35, ay + u * 1.3);
      x.lineTo(ax - u * .35, ay + u * 1.3);
      x.lineTo(ax - u * .35, ay);
      x.lineTo(ax - u, ay);
      x.closePath();
      x.fill();
    });
    const ga = new THREE.Group();
    ga.position.z = -16;
    [-10.7, 6.2].forEach(px => box(.3, 7.5, .3, '#1c222d', px, 3.75, 0, ga));
    box(17.1, .55, .3, '#262e3b', -2.25, 6.97, 0, ga);
    const sg = new THREE.Mesh(new THREE.PlaneGeometry(6.6, 2.5), mat([1.15, 1.15, 1.15], { map: st }));
    sg.position.set(2, 5.75, .2);
    ga.add(sg);
    n.add(ga);
    return n;
  }

  function buildRead() {
    const r = new THREE.Group(), ar = S.lang === 'ar', Lm = (c, o) => new THREE.MeshLambertMaterial(Object.assign({ color: c }, o));
    const desk = new THREE.Mesh(new THREE.PlaneGeometry(4, 3), Lm('#fff', {
      map: cvs(1024, 768, (x, w, h) => {
        const q = x.createLinearGradient(0, 0, w, h);
        q.addColorStop(0, '#7a5535');
        q.addColorStop(1, '#3b2819');
        x.fillStyle = q;
        x.fillRect(0, 0, w, h);
        x.strokeStyle = 'rgba(0,0,0,.09)';
        x.lineWidth = 2;
        for (let y = -10; y < h; y += 9) {
          x.beginPath();
          x.moveTo(0, y);
          x.bezierCurveTo(w * .3, y + 8, w * .65, y - 8, w, y + 4);
          x.stroke();
        }
      })
    }));
    desk.rotation.x = -Math.PI / 2;
    r.add(desk);
    const pt = cvs(1024, 704, (x, w, h) => {
      const q = x.createLinearGradient(0, 0, w, h);
      q.addColorStop(0, '#fffdf6');
      q.addColorStop(1, '#ece5d3');
      x.fillStyle = q;
      x.fillRect(0, 0, w, h);
      let y = h * .08;
      (ar ? LAR : LEN).forEach(([lm, tx]) => {
        const fs = CFG.textPx * 10 ** lm;
        y += fs * 1.1;
        x.textAlign = 'center';
        x.direction = ar ? 'rtl' : 'ltr';
        x.fillStyle = '#1d2630';
        x.font = `500 ${fs}px ${ar ? '"IBM Plex Sans Arabic",Alexandria,' : 'Inter,'}sans-serif`;
        x.fillText(tx, w / 2, y);
        x.textAlign = 'left';
        x.direction = 'ltr';
        x.font = '500 16px Inter,sans-serif';
        x.fillStyle = '#8a9096';
        x.fillText('20/' + Math.round(20 * 10 ** lm), 22, y);
        y += fs * .42;
      });
    });
    const paper = new THREE.Mesh(new THREE.PlaneGeometry(.52, .36), Lm('#fff', { map: pt }));
    paper.rotation.x = -Math.PI / 2;
    paper.rotation.z = .03;
    paper.position.y = .004;
    r.add(paper);
    box(.14, .02, .14, '#20262f', -.42, .01, -.2, r);
    box(.012, .5, .012, '#20262f', -.42, .26, -.2, r);
    const shade = new THREE.Mesh(new THREE.CylinderGeometry(.05, .13, .12, 24, 1, true), new THREE.MeshBasicMaterial({ color: '#1f5f6b', side: THREE.DoubleSide }));
    shade.position.set(-.38, .52, -.2);
    shade.rotation.z = .25;
    r.add(shade);
    glow([5, 3.6, 2], .55, -.36, .49, -.2, r);
    pool([.6, .42, .2], 1.7, 1.7, -.3, -.12, r);
    bulb = new THREE.PointLight(0xffd29a, 1.15, 3);
    bulb.position.set(-.36, .48, -.2);
    r.add(bulb);
    r.add(new THREE.AmbientLight(0x4a3a40, .7));
    const ph = new THREE.Group();
    ph.position.set(.4, .005, -.02);
    ph.rotation.y = .35;
    r.add(ph);
    box(.078, .009, .158, '#101318', 0, .0045, 0, ph);
    const pl = ar ? [['أخبار الصحة', 40], ['العين أمانة', 30], ['فحص دوري كل سنة', 24]] : [['Health news', 40], ['Eyes matter', 30], ['Yearly check-up', 24]];
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(.07, .15), mat([1.7, 1.7, 1.7], {
      map: cvs(256, 512, (x, w, h) => {
        x.fillStyle = '#f2f6f8';
        x.fillRect(0, 0, w, h);
        let y = 70;
        x.textAlign = 'center';
        x.fillStyle = '#17242c';
        x.direction = ar ? 'rtl' : 'ltr';
        pl.forEach(([t, s]) => {
          x.font = `600 ${s}px ${ar ? '"IBM Plex Sans Arabic",' : 'Inter,'}sans-serif`;
          x.fillText(t, w / 2, y);
          y += s * 1.8;
        });
      })
    }));
    scr.rotation.x = -Math.PI / 2;
    scr.position.y = .0095;
    ph.add(scr);
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(.04, .032, .08, 24), Lm('#e8e4dc'));
    cup.position.set(.3, .04, -.2);
    r.add(cup);
    const cf = new THREE.Mesh(new THREE.CircleGeometry(.036, 24), mat('#2b1a10'));
    cf.rotation.x = -Math.PI / 2;
    cf.position.set(.3, .0805, -.2);
    r.add(cf);
    const pen = new THREE.Mesh(new THREE.CylinderGeometry(.005, .005, .15, 10), Lm('#1d3557'));
    pen.rotation.set(0, .5, Math.PI / 2);
    pen.position.set(-.28, .006, .15);
    r.add(pen);
    const N = 70, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = rnd() - .5;
      pos[i * 3 + 1] = .05 + rnd() * .55;
      pos[i * 3 + 2] = rnd() * .7 - .4;
    }
    dust0 = pos.slice();
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    dust = new THREE.Points(g, new THREE.PointsMaterial(Object.assign({ map: GT, size: .03, sizeAttenuation: true, color: new THREE.Color(2.6, 2.2, 1.6) }, ADV())));
    r.add(dust);
    return r;
  }

  function buildAll() {
    while (world.children.length) world.remove(world.children[0]);
    nightG = buildNight();
    readG = buildRead();
    world.add(nightG, readG);
  }

  const VS = 'varying vec2 v;void main(){v=uv;gl_Position=vec4(position,1.);}';
  const FS = `uniform sampler2D A;uniform vec2 R;uniform float sp,tm,fd,mes;uniform vec4 PL,PR,QL,QR;
varying vec2 v;
float L(vec3 c){return dot(c,vec3(.2126,.7152,.0722));}
float H(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float N(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(H(i),H(i+vec2(1,0)),f.x),mix(H(i+vec2(0,1)),H(i+vec2(1,1)),f.x),f.y);}
vec3 sA(vec2 p,float l){return textureLod(A,p,l).rgb;}
vec3 br(vec2 p,float l){return max(sA(p,l)-.15,0.);}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
vec3 side(vec2 u,vec4 P,vec4 Q){
 vec2 px=1./R;float b=P.x;float lod=max(.6,log2(max(b,1.))-2.4);
 vec3 a=vec3(0);float ws=0.;
 for(int i=0;i<28;i++){float f=float(i)+.5;float r=sqrt(f/28.)*b;float an=f*2.39996;
  vec3 s=sA(u+vec2(cos(an),sin(an))*r*px,lod);float w=1.+5.*pow(min(L(s),4.),3.);a+=s*w;ws+=w;}
 vec3 c=a/ws;
 if(P.y>.003||P.z>.003){vec3 r1=vec3(0),r2=vec3(0);
  for(int i=0;i<18;i++){float an=float(i)*.349066;vec2 d=vec2(cos(an),sin(an))*px;r1+=br(u+d*Q.x,3.);r2+=br(u+d*Q.y,3.5);}
  c+=(r1*P.y+r2*P.z)/18.*1.6;}
 vec3 vl=vec3(0);
 for(int j=0;j<6;j++){float r=6.*exp2(float(j));for(int i=0;i<8;i++){float an=float(i)*.785398+float(j)*.4;vl+=br(u+vec2(cos(an),sin(an))*r*px,log2(r)-.8);}}
 c+=vl/8.*Q.z*.5;
 if(P.w>.005){vec3 st=vec3(0);
  for(int k=0;k<8;k++){float an=float(k)*.785398+.2;vec2 d=vec2(cos(an),sin(an))*px;
   for(int j=1;j<=8;j++){float fj=float(j);st+=br(u+d*fj*fj*1.6,1.+fj*.3)/(1.+fj*.45);}}
  c+=st*P.w*.5;c*=mix(vec3(1.),vec3(.93,.78,.52),P.w);}
 return c;}
void main(){
 vec2 u=v;bool lf=u.x<sp;vec4 P=lf?PL:PR,Q=lf?QL:QR;
 vec3 c=aces(side(u,P,Q));
 c=mix(vec3(L(c)),c,1.-mes*.3);
 c=(c-.5)*(1.-.12*clamp(P.z*1.4,0.,1.))+.5;
 if(P.w>.005){float cx=length((u-.5)*vec2(1.78,1.));float an2=atan(u.y-.5,u.x-.5);
  float sp2=smoothstep(.5,.95,sin(an2*7.+N(u*3.+tm*.02)*4.)*.5+.5)*smoothstep(.08,.5,cx);
  c=mix(vec3(L(c)),c,1.-.22*P.w);c=mix(c,vec3(.55,.5,.4),(.2+.12*N(u*2.))*P.w);c=(c-.5)*(1.-.24*P.w)+.5;c*=1.-.22*sp2*P.w;}
 c*=1.-.45*pow(length((u-.5)*vec2(1.3,1.)),2.4);
 c+=(H(u*R+tm)-.5)*.022;
 gl_FragColor=vec4(clamp(c*fd,0.,1.),1.);}`;

  let root, view, cv, raf, io, cur, fade = 1, dirty = true, anim = 3, last = 0, vis = false, intro = null, drag = false;

  function initGL() {
    try {
      if (!window.THREE) return false;
      rdr = new THREE.WebGLRenderer({ canvas: cv, antialias: false, alpha: false, powerPreference: 'high-performance' });
      if (!rdr.capabilities.isWebGL2) return false;
      rdr.setPixelRatio(1);
      rdr.setSize(CFG.out[0], CFG.out[1], false);
      const hdr = rdr.extensions.has('EXT_color_buffer_float') || rdr.extensions.has('EXT_color_buffer_half_float');
      RT = new THREE.WebGLRenderTarget(W, H, {
        type: hdr ? THREE.HalfFloatType : THREE.UnsignedByteType,
        minFilter: THREE.LinearMipmapLinearFilter,
        magFilter: THREE.LinearFilter,
        generateMipmaps: true
      });
      GT = cvs(128, 128, (x, w) => {
        const q = x.createRadialGradient(64, 64, 0, 64, 64, 64);
        q.addColorStop(0, 'rgba(255,255,255,1)');
        q.addColorStop(.25, 'rgba(255,255,255,.35)');
        q.addColorStop(1, 'rgba(255,255,255,0)');
        x.fillStyle = q;
        x.fillRect(0, 0, w, w);
      });
      world = new THREE.Scene();
      fog = new THREE.FogExp2(0x1a2038, .0042);
      cam = new THREE.PerspectiveCamera(CFG.fov, W / H, .05, 700);
      const u = () => ({ value: new THREE.Vector4() });
      pm = new THREE.ShaderMaterial({
        uniforms: {
          A: { value: RT.texture },
          R: { value: new THREE.Vector2(W, H) },
          sp: { value: .5 },
          tm: { value: 0 },
          fd: { value: 1 },
          mes: { value: 0 },
          PL: u(),
          PR: u(),
          QL: u(),
          QR: u()
        },
        vertexShader: VS,
        fragmentShader: FS,
        depthTest: false,
        depthWrite: false
      });
      postS = new THREE.Scene();
      postS.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), pm));
      postC = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      buildAll();
      return true;
    } catch (e) {
      console.error('3D init failed:', e);
      return false;
    }
  }

  function targets() {
    const night = S.scene === 'night', d = night ? 0 : S.D, p = night ? CFG.pupil.night : CFG.pupil.read;
    const f = k => {
      const lm = acuity(k, d), a = ADDP[k], h = LENSES[k].halo, rr = m => .5 * p * m * 1e-3 * PXR * CFG.angScale;
      return [
        (10 ** lm - 1) * PXA * CFG.angScale,
        k === 'cataract' ? 0 : h,
        k === 'trifocal' ? h * .8 : 0,
        k === 'cataract' ? 1 : 0,
        rr(a[0]),
        rr(a[1]),
        k === 'cataract' ? CFG.veilCat : CFG.veilNormal,
        0
      ];
    };
    return [f(S.lens), f('cataract')];
  }

  function draw(t) {
    if (!rdr) return;
    const nt = S.scene === 'night';
    nightG.visible = nt;
    readG.visible = !nt;
    world.fog = nt ? fog : null;
    world.background = new THREE.Color(nt ? 0x050a18 : 0x120c08);
    const sx = Math.sin(t * .25) * .5 + ptr.x, sy = Math.sin(t * .4) * .5;
    if (nt) {
      const tr = t * CFG.speed * 16;
      cam.position.set(sx * .15, 1.25 + sy * .03, 0);
      cam.rotation.set(-.047, -ptr.x * .02, 0);
      lamps.forEach(([m, r], k) => {
        const z = k * 30 - tr % 30 + 9;
        m.position.z = r.position.z = -z;
        m.visible = r.visible = z >= 2.5;
        r.position.z = -(k * 30 - tr % 30 + 24);
        r.visible = (k * 30 - tr % 30 + 24) >= 2.5;
      });
      [[-4.8, 0], [-8.4, 43], [-4.8, 81]].forEach(([x, o], i) => cars.on[i].position.set(x, 0, -(132 - ((tr * 1.5 + o) % 124))));
      cars.ah[0].position.set(0, 0, -(36 + 3 * Math.sin(t * .4)));
      cars.ah[1].position.set(3.6, 0, -(60 + 4 * Math.sin(t * .3 + 1)));
      const br = (t % 9) > 6.4;
      cars.ah[0].userData.sp.forEach(s => s.scale.set(br ? 4.2 : 2.2, br ? 4.2 : 2.2, 1));
      road.material.map.offset.y = (tr / 36) % 1;
    } else {
      cam.position.set(sx * .05, .62 + sy * .01, .42);
      cam.lookAt(ptr.x * .03, 0, -.03);
      bulb.intensity = 1.15 * (1 + .02 * Math.sin(t * 2.3));
      const a = dust.geometry.attributes.position.array;
      for (let i = 0; i < 70; i++) {
        a[i * 3] = dust0[i * 3] + Math.sin(t * .3 + i) * .03;
        a[i * 3 + 1] = .05 + ((dust0[i * 3 + 1] - .05 + t * .012 * (1 + i % 3)) % .55);
      }
      dust.geometry.attributes.position.needsUpdate = true;
    }
    rdr.setRenderTarget(RT);
    rdr.render(world, cam);
    rdr.setRenderTarget(null);
    const U = pm.uniforms;
    U.PL.value.fromArray(cur[0], 0);
    U.QL.value.fromArray(cur[0], 4);
    U.PR.value.fromArray(cur[1], 0);
    U.QR.value.fromArray(cur[1], 4);
    U.sp.value = S.pos / 100;
    U.tm.value = t % 10;
    U.fd.value = fade;
    U.mes.value = nt ? 1 : 0;
    rdr.render(postS, postC);
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!vis || S.tab !== 'sim' || now - last < 1000 / CFG.fps) return;
    const dt = Math.min(.1, (now - last) / 1000);
    last = now;
    if (S.motion) anim += dt;
    if (intro) {
      intro.t += dt;
      const k = intro.t / 2.6;
      if (k >= 1) {
        intro = null;
        setPos(50);
      } else setPos(50 + 24 * Math.sin(k * 6.283) * (1 - k * .4));
    }
    let moving = false;
    const tg = targets(), e = 1 - Math.pow(1 - CFG.ease, dt * 60);
    for (let s = 0; s < 2; s++)
      for (let i = 0; i < 8; i++) {
        const d = tg[s][i] - cur[s][i];
        if (Math.abs(d) > .002) {
          cur[s][i] += d * e;
          moving = true;
        } else cur[s][i] = tg[s][i];
      }
    if (fade < 1) {
      fade = Math.min(1, fade + dt * 3);
      moving = true;
    }
    if (!S.motion && !moving && !dirty) return;
    dirty = false;
    draw(anim);
  }

  function setPos(p) {
    S.pos = Math.max(0, Math.min(100, p));
    const l = root && root.querySelector('#vs-line');
    if (l) {
      l.style.left = S.pos + '%';
      view.setAttribute('aria-valuenow', Math.round(S.pos));
    }
    dirty = true;
  }

  /* ================= 5) UI ================= */
  function html() {
    return `
<div class="vs-card" id="vs-root">
 <div class="vs-bar">
  <div class="vs-seg" id="vs-tabs"><button data-tab="sim">${T('المحاكاة', 'Simulation')}</button><button data-tab="curve">${T('منحنى حدة الإبصار', 'Acuity curve')}</button></div>
  <div class="vs-seg" id="vs-scenes"><button data-scene="night">${T('قيادة ليلاً', 'Night driving')}</button><button data-scene="read">${T('القراءة', 'Reading')}</button></div>
  <div class="vs-seg"><button data-act="motion" id="vs-motion" aria-pressed="true">${T('حركة', 'Motion')}</button><button data-act="reset">${T('إعادة ضبط ↺', 'Reset ↺')}</button></div>
 </div>
 <div class="vs-lens" id="vs-lens" style="margin-bottom:14px">${Object.keys(LENSES).map(k => `<button data-lens="${k}">${T(LENSES[k].ar, LENSES[k].en)}</button>`).join('')}</div>
 <div id="vs-sim">
  <div class="vs-view" id="vs-view" dir="ltr" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-label="${T('مقارنة قبل وبعد', 'Before / after')}">
   <canvas id="vs-gl" width="${CFG.out[0]}" height="${CFG.out[1]}"></canvas>
   <div class="vs-line" id="vs-line"><i></i></div>
   <em class="vs-tag l" id="vs-tl"></em><em class="vs-tag r">${T('ساد غير معالج', 'Untreated cataract')}</em>
  </div>
  <p class="vs-hint">${T('اسحب الخط للمقارنة بين العدسة المختارة والساد', 'Drag the line to compare the selected lens with cataract')}</p>
 </div>
 <div id="vs-curve" hidden></div>
 <div class="vs-dist" id="vs-dist" role="group" aria-label="${T('المسافة', 'Distance')}">${DISTANCE_STEPS.map(([d, a, e]) => `<button data-d="${d}">${T(a, e)}</button>`).join('')}</div>
 <div class="vs-metrics" id="vs-metrics"></div>
 <p class="vs-note">${T('تفترض المحاكاة عينين بقوة بصرية مستهدفة قريبة من الصفر، وإضاءة جيدة للقراءة. حدة الإبصار بالمتوسط ≤ 0.2 logMAR تُعد رؤية وظيفية. النتيجة الفعلية تعتمد على قياسات عينك وفحص الطبيب. المصادر: مراجعة منهجية BMC Ophthalmology 2019، وملخصات مؤتمر ESCRS 2024.', 'Assumes near-plano targets and good reading light. Mean acuity ≤ 0.2 logMAR is treated as functional. Your actual result depends on your own eye measurements and your surgeon’s exam. Sources: BMC Ophthalmology 2019 meta-analysis; ESCRS 2024 abstracts.')}</p>
<details class="vs-sci"><summary>${T('الأسس العلمية للمحاكاة', 'Scientific basis of the simulation')}</summary><ul>
<li>${T('التشويش مأخوذ من منحنى حدة الإبصار المنشور لكل عدسة؛ قطر التشويش ≈ (أقل زاوية تمييز − 1 دقيقة قوس)، فـ 20/20 بلا تشويش.', 'Blur comes from each lens’s published defocus curve; blur diameter ≈ (MAR − 1 arcmin), so 20/20 is unblurred.')}</li>
<li>${T('الهالات في العدسات متعددة البؤر: قطر دائرة التشويش للبؤرة الثانوية = قطر البؤبؤ × قوة الإضافة (β = P × ΔD). البؤبؤ ليلاً أوسع، فالهالات أكبر.', 'Multifocal halos: secondary-focus blur circle = pupil × add power (β = P × ΔD). Night pupils are wider, so halos are larger.')}</li>
<li>${T('الوهج: التشتت الأمامي للضوء يتناقص تقريباً مع 1/θ² (معادلة Stiles–Holladay)، ويكون أعلى في الساد.', 'Glare: forward light scatter falls roughly as 1/θ² (Stiles–Holladay), and is higher in cataract.')}</li>
<li>${T('الساد: اصفرار العدسة، ضباب يقلل التباين، وأشعة نجمية. الأضواء بإضاءة HDR فتبقى أقوى من الأسطح كما في الواقع.', 'Cataract: lens yellowing, contrast-lowering haze, starbursts. Lights are rendered in HDR, far brighter than surfaces, as in reality.')}</li>
<li>${T('قوة الإضافة وقطر البؤبؤ ومعامل التشتت أرقام تقريبية قابلة للتعديل وتحتاج مراجعة الدكتور قبل النشر.', 'Add powers, pupil sizes and scatter factors are editable approximations and need the surgeon’s review before publishing.')}</li></ul></details>
 <div class="vs-disclaimer-note"><svg class="vs-note-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>${T('تنويه طبي: هذه المحاكاة قد لا تنطبق 100% على الواقع، لكنها أقرب صورة توضيحية لتوصيل الفكرة والمعلومة. يفضل الدكتور معن بن عبدالله البري حالياً العدسات ممتدة المدى (EDOF) لجودة النظر العالية وانخفاض الهالات مقارنة بالثلاثية، لكن يبقى لكل مريض حالته الخاصة وقياساته الفريدة التي يُبنى عليها الاختيار الطبي النهائي بعد الفحص السريري الدقيق.', 'Clinical Note: This simulation may not apply 100% to individual reality, but serves as the closest illustrative representation to convey the concept. Dr. Maan bin Abdullah Al Barry currently favors Extended Depth of Focus (EDOF) lenses for superior optical quality and reduced halos, but every patient has unique ocular parameters; the final choice is tailored during your clinical examination.')}</span></div>
</div>`;
  }

  function curveSVG() {
    const mx = d => 70 + (-d / 3.5) * 600, my = l => 26 + (l / .8) * 230, col = { monofocal: '#5b7f95', edof: '#3f8f87', trifocal: '#8a6a3d', cataract: '#a35a52' };
    const sm = pts => pts.map((p, i) => {
      if (!i) return `M${p[0]},${p[1]}`;
      const m = (pts[i - 1][0] + p[0]) / 2;
      return `C${m},${pts[i - 1][1]} ${m},${p[1]} ${p[0]},${p[1]}`;
    }).join(' ');
    let s = `<svg viewBox="0 0 720 300" class="vs-svg" role="img" aria-label="defocus curve"><rect x="70" y="${my(0)}" width="600" height="${my(.2) - my(0)}" fill="var(--vs-band)"/>`;
    [[0, '20/20'], [.1, '20/25'], [.2, '20/32'], [.3, '20/40'], [.5, '20/63'], [.7, '20/100']].forEach(([l, n]) => {
      s += `<line x1="70" x2="670" y1="${my(l)}" y2="${my(l)}" stroke="var(--vs-grid)"/><text x="62" y="${my(l) + 4}" text-anchor="end" class="vs-t">${n}</text>`;
    });
    DISTANCE_STEPS.forEach(([d, a, e]) => {
      s += `<line x1="${mx(d)}" x2="${mx(d)}" y1="26" y2="256" stroke="var(--vs-grid)" stroke-dasharray="3 4"/><text x="${mx(d)}" y="274" text-anchor="middle" class="vs-t">\u200E${d.toFixed(1).replace('-', '−')} D</text><text x="${mx(d)}" y="290" text-anchor="middle" class="vs-t2">${T(a, e)}</text>`;
    });
    Object.keys(LENSES).forEach(k => {
      const on = k === S.lens, pts = DEFOCUS_STEPS.map((d, i) => [mx(d), my(LENSES[k].va[i])]);
      s += `<path d="${sm(pts)}" pathLength="1" ${on ? 'class="vs-draw"' : ''} fill="none" stroke="${col[k]}" stroke-width="${on ? 3.4 : 1.4}" stroke-linecap="round" opacity="${on ? 1 : .35}" ${k === 'cataract' ? 'stroke-dasharray="5 4"' : ''}/>`;
    });
    const x = mx(S.D), y = my(acuity(S.lens, S.D));
    return s + `<line x1="${x}" x2="${x}" y1="26" y2="256" stroke="var(--vs-ink)" opacity=".5"/><circle cx="${x}" cy="${y}" r="6.5" fill="var(--vs-surface)" stroke="var(--vs-ink)" stroke-width="2.5"/></svg>`;
  }

  function update() {
    const $ = s => root.querySelector(s), on = (sel, key, val) => root.querySelectorAll(sel).forEach(b => b.classList.toggle('on', b.dataset[key] == val));
    on('[data-tab]', 'tab', S.tab);
    on('[data-scene]', 'scene', S.scene);
    on('[data-lens]', 'lens', S.lens);
    on('[data-d]', 'd', S.D);
    $('#vs-motion').classList.toggle('on', S.motion);
    $('#vs-motion').setAttribute('aria-pressed', S.motion);
    $('#vs-scenes').hidden = $('#vs-sim').hidden = S.tab !== 'sim';
    $('#vs-dist').hidden = S.tab !== 'curve' && S.scene !== 'read';
    $('#vs-curve').hidden = S.tab !== 'curve';
    if (S.tab === 'curve') $('#vs-curve').innerHTML = curveSVG();
    $('#vs-tl').textContent = T(LENSES[S.lens].ar, LENSES[S.lens].en);
    const d = S.scene === 'night' && S.tab === 'sim' ? 0 : S.D, a = acuity(S.lens, d), nf = nearest(S.lens), fn = a <= .2;
    $('#vs-metrics').innerHTML = `<div><small>${T('حدة الإبصار المتوقعة', 'Expected acuity')}</small><strong>${toSnellen(a)}</strong><span>${a.toFixed(2)} logMAR</span></div>
 <div><small>${T('عند هذه المسافة', 'At this distance')}</small><strong class="${fn ? 'ok' : 'warn'}">${fn ? T('رؤية وظيفية غالباً بدون نظارة', 'Usually functional without glasses') : T('غالباً تلزم نظارة', 'Glasses usually needed')}</strong></div>
 <div><small>${T('أقرب مسافة وظيفية', 'Nearest functional distance')}</small><strong>${S.lens === 'cataract' ? T('لا يوجد', 'None') : nf < .1 ? T('البعيد فقط', 'Far only') : Math.round(100 / nf) + ' ' + T('سم', 'cm')}</strong></div>
 <p>${T(LENSES[S.lens].noteAr, LENSES[S.lens].noteEn)}</p>`;
    dirty = true;
  }

  function destroy() {
    cancelAnimationFrame(raf);
    io && io.disconnect();
    if (rdr) {
      rdr.dispose();
      rdr.forceContextLoss();
    }
    rdr = null;
    root = null;
  }

  function mount(host, opt = {}) {
    destroy();
    if (opt.lang) S.lang = opt.lang;
    host.innerHTML = html();
    root = host.querySelector('#vs-root');
    view = root.querySelector('#vs-view');
    cv = root.querySelector('#vs-gl');
    if (!initGL()) view.insertAdjacentHTML('beforeend', '<p style="position:absolute;inset:0;display:grid;place-items:center;color:#fff;text-align:center;padding:20px">' + T('المتصفح لا يدعم WebGL2 أو تعذر تحميل three.js', 'WebGL2 / three.js unavailable') + '</p>');
    cur = targets().map(a => a.slice());
    fade = 1;
    root.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      const d = b.dataset;
      if (d.act === 'reset') {
        Object.assign(S, { lens: 'edof', scene: 'night', D: 0, tab: 'sim' });
        fade = 0;
        setPos(50);
      }
      if (d.act === 'motion') S.motion = !S.motion;
      if (d.tab) S.tab = d.tab;
      if (d.scene && d.scene !== S.scene) {
        S.scene = d.scene;
        fade = 0;
        if (S.scene === 'read' && S.D === 0) S.D = -2.5;
      }
      if (d.lens) S.lens = d.lens;
      if (d.d !== undefined) S.D = +d.d;
      update();
    });
    const mv = e => {
      const r = view.getBoundingClientRect();
      setPos((e.clientX - r.left) / r.width * 100);
    };
    view.addEventListener('pointerdown', e => {
      drag = true;
      intro = null;
      view.setPointerCapture(e.pointerId);
      mv(e);
    });
    view.addEventListener('pointermove', e => {
      const r = view.getBoundingClientRect();
      ptr.x = (e.clientX - r.left) / r.width * 2 - 1;
      ptr.y = (e.clientY - r.top) / r.height * 2 - 1;
      dirty = true;
      if (drag) mv(e);
    });
    ['pointerup', 'pointercancel'].forEach(n => view.addEventListener(n, () => drag = false));
    view.addEventListener('keydown', e => {
      const d = { ArrowLeft: -4, ArrowRight: 4, Home: -100, End: 100 }[e.key];
      if (d) {
        e.preventDefault();
        intro = null;
        setPos(S.pos + d);
      }
    });
    let first = true;
    io = new IntersectionObserver(([en]) => {
      vis = en.isIntersecting;
      if (vis && first && S.motion) {
        first = false;
        intro = { t: 0 };
      }
      dirty = true;
    }, { threshold: .35 });
    io.observe(view);
    setPos(S.pos);
    update();
    if (document.fonts) document.fonts.ready.then(() => {
      if (rdr && world) buildAll();
      dirty = true;
    });
    last = 0;
    raf = requestAnimationFrame(frame);
  }

  return { mount, destroy, state: S, config: CFG };
})();

// Attach to window for global access
window.VisionSim = VisionSim;

function renderSimulator(lang) {
  const isAr = (lang === 'ar');
  return `
  <section class="section vs-section" id="simulator">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${isAr ? 'أداة تثقيفية تفاعلية ثلاثية الأبعاد' : 'Interactive 3D Educational Tool'}</div>
        <h2>${isAr ? 'كيف قد تبدو رؤيتك بعد زراعة العدسة؟' : 'How Might Your Vision Look After Lens Implantation?'}</h2>
        <p>${isAr ? 'اسحب الخط للمقارنة المباشرة بين العدسة المختارة والساد غير المعالج عبر محاكاة بصرية ثلاثية الأبعاد مبنية على متوسطات الدراسات المنشورة.' : 'Drag the line to compare your chosen lens against an untreated cataract using a real-time 3D optical simulation.'}</p>
      </div>
      <div id="simulator-host"></div>
    </div>
  </section>`;
}

// --- APP STATE & LOCAL STORAGE ---
let currentLang = 'ar';
let currentTheme = (() => {
  try {
    return localStorage.getItem('theme');
  } catch (e) {
    return null;
  }
})() || 'system';

let currentQStep = 0;
let qAnswers = [];
let qCompleted = false;
let openArticleId = null;

function renderThemeToggle(id = 'theme-toggle-btn') {
  const isDark = (currentTheme === 'dark' || (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches));
  const label = currentLang === 'ar'
    ? (isDark ? 'الوضع الليلي مفعّل، انقر للتحويل للوضع النهاري' : 'الوضع النهاري مفعّل، انقر للتحويل للوضع الليلي')
    : (isDark ? 'Dark mode enabled. Click to switch to light mode' : 'Light mode enabled. Click to switch to dark mode');
  const title = currentLang === 'ar' ? 'تبديل المظهر (ليلي / نهاري)' : 'Toggle Theme (Dark / Light)';

  return `
  <button id="${id}" class="theme-clean-toggle ${isDark ? 'is-dark' : ''}" onclick="toggleTheme()" role="switch" aria-checked="${isDark ? 'true' : 'false'}" aria-label="${label}" title="${title}">
    <span class="tct-track" aria-hidden="true">
      <span class="tct-slot tct-slot-sun ${isDark ? 'is-dimmed' : 'is-active'}">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4.5" fill="currentColor"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
      </span>
      <span class="tct-slot tct-slot-moon ${isDark ? 'is-active' : 'is-dimmed'}">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </span>
      <span class="tct-thumb"></span>
    </span>
  </button>`;
}

function applyTheme(theme) {
  currentTheme = theme;
  try {
    localStorage.setItem('theme', theme);
  } catch (e) {}

  if (theme === 'system') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }

  const isDark = (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches));

  document.querySelectorAll('.theme-clean-toggle').forEach(btn => {
    btn.classList.toggle('is-dark', isDark);
    btn.setAttribute('aria-checked', isDark ? 'true' : 'false');
    const sunSlot = btn.querySelector('.tct-slot-sun');
    const moonSlot = btn.querySelector('.tct-slot-moon');
    if (sunSlot) {
      sunSlot.classList.toggle('is-active', !isDark);
      sunSlot.classList.toggle('is-dimmed', isDark);
    }
    if (moonSlot) {
      moonSlot.classList.toggle('is-active', isDark);
      moonSlot.classList.toggle('is-dimmed', !isDark);
    }
    const label = currentLang === 'ar'
      ? (isDark ? 'الوضع الليلي مفعّل، انقر للتحويل للوضع النهاري' : 'الوضع النهاري مفعّل، انقر للتحويل للوضع الليلي')
      : (isDark ? 'Dark mode enabled. Click to switch to light mode' : 'Light mode enabled. Click to switch to dark mode');
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  });
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (currentTheme === 'system') applyTheme('system');
});

window.toggleTheme = function () {
  const isDark = (currentTheme === 'dark' || (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches));
  applyTheme(isDark ? 'light' : 'dark');
};

window.cycleTheme = window.toggleTheme;

function getWhatsAppUrl(msg) {
  const text = encodeURIComponent(msg || (currentLang === 'ar'
    ? 'مرحباً، أود الاستفسار عن حجز موعد استشارة مع د. معن بن عبدالله البري في مستشفى مغربي المدينة المنورة.'
    : 'Hello, I would like to inquire about booking a consultation with Dr. Maan bin Abdullah Al Barry at Magrabi Madinah.'));
  return `https://wa.me/${DOCTOR.whatsapp}?text=${text}`;
}

// --- HEADER ---
function renderHeader() {
  return `
  <header class="site-header" id="site-header">
    <div class="header-inner">
      <a href="#home" class="header-logo" onclick="scrollToSection('home');return false;">
        <div class="logo-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7z"></path>
            <circle cx="12" cy="12" r="3.2" fill="currentColor" fill-opacity="0.25"></circle>
          </svg>
        </div>
        <div class="logo-text">
          <strong class="${currentLang === 'ar' ? 'font-doctor-highlight' : ''}">${currentLang === 'ar' ? 'د. معن البري' : 'Dr. Maan Albarry'}</strong>
          <small>${currentLang === 'ar' ? 'استشاري جراحة القرنية والماء الأبيض' : 'Consultant Cornea & Cataract Surgeon'}</small>
        </div>
      </a>

      <nav class="header-nav">
        <div class="nav-links">
          <a href="#home" onclick="scrollToSection('home');return false;" class="${currentActiveNavId === 'home' ? 'active' : ''}">${currentLang === 'ar' ? 'الرئيسية' : 'Home'}</a>
          <a href="#profile" onclick="scrollToSection('profile');return false;" class="${currentActiveNavId === 'profile' ? 'active' : ''}">${currentLang === 'ar' ? 'عن الدكتور' : 'Biography'}</a>
          <a href="#conferences" onclick="scrollToSection('conferences');return false;" class="${currentActiveNavId === 'conferences' ? 'active' : ''}">
            <span class="nav-text-full">${currentLang === 'ar' ? 'المشاركات العلمية والمؤتمرات الدولية' : 'Scientific Conferences'}</span>
            <span class="nav-text-short">${currentLang === 'ar' ? 'المشاركات العلمية' : 'Conferences'}</span>
          </a>
          <a href="#specialties" onclick="scrollToSection('specialties');return false;" class="${currentActiveNavId === 'specialties' ? 'active' : ''}">${currentLang === 'ar' ? 'التخصصات' : 'Specialties'}</a>
          <a href="#simulator" onclick="scrollToSection('simulator');return false;" class="${currentActiveNavId === 'simulator' ? 'active' : ''}">
            <span class="nav-text-full">${currentLang === 'ar' ? 'محاكي الرؤية' : 'Simulator'}</span>
            <span class="nav-text-short">${currentLang === 'ar' ? 'المحاكي' : 'Sim'}</span>
          </a>
          <a href="#cataracts" onclick="scrollToSection('cataracts');return false;" class="${currentActiveNavId === 'cataracts' ? 'active' : ''}">${currentLang === 'ar' ? 'دليل العدسات' : 'IOL Guide'}</a>
          <a href="#education" onclick="scrollToSection('education');return false;" class="${currentActiveNavId === 'education' ? 'active' : ''}">
            <span class="nav-text-full">${currentLang === 'ar' ? 'المكتبة الطبية' : 'Education'}</span>
            <span class="nav-text-short">${currentLang === 'ar' ? 'المكتبة' : 'Library'}</span>
          </a>
          <a href="#clinic" onclick="scrollToSection('clinic');return false;" class="${currentActiveNavId === 'clinic' ? 'active' : ''}">
            <span class="nav-text-full">${currentLang === 'ar' ? 'العيادة والحجز' : 'Clinic'}</span>
            <span class="nav-text-short">${currentLang === 'ar' ? 'العيادة' : 'Clinic'}</span>
          </a>
        </div>
      </nav>

      <div class="header-actions">
        ${renderThemeToggle('theme-toggle-btn')}
        <button class="lang-switch" onclick="toggleLang()" aria-label="Switch Language" title="${currentLang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}">
          ${currentLang === 'ar' ? 'English' : 'عربي'}
        </button>
        <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm btn-header-book">
          ${currentLang === 'ar' ? 'احجز موعداً' : 'Book Appointment'}
        </a>
        <button class="mobile-menu-btn" onclick="toggleMobileMenu()" aria-label="Open Navigation">☰</button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <nav class="mobile-nav" id="mobile-nav">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px 14px;border-bottom:1px solid var(--border-subtle);margin-bottom:6px;">
        <span style="font-size:0.95rem;font-weight:700;color:var(--text-primary);">${currentLang === 'ar' ? 'مظهر الموقع' : 'Appearance'}</span>
        ${renderThemeToggle('theme-toggle-btn-mobile')}
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border-bottom:1px solid var(--border-subtle);margin-bottom:10px;">
        <span style="font-size:0.95rem;font-weight:700;color:var(--text-primary);">${currentLang === 'ar' ? 'منصات الدكتور:' : 'Channels:'}</span>
        <div style="display:flex;align-items:center;gap:10px;">
          <a href="${DOCTOR.instagram}" target="_blank" rel="noopener noreferrer" class="header-social-link instagram" aria-label="Instagram" title="Instagram">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="${DOCTOR.twitter}" target="_blank" rel="noopener noreferrer" class="header-social-link twitter" aria-label="X (Twitter)" title="X (Twitter)">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="${DOCTOR.youtube}" target="_blank" rel="noopener noreferrer" class="header-social-link youtube" aria-label="YouTube" title="YouTube">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
        </div>
      </div>
      <a href="#home" onclick="scrollToSection('home');closeMobileMenu();return false;" class="${currentActiveNavId === 'home' ? 'active' : ''}">${currentLang === 'ar' ? 'الرئيسية' : 'Home'}</a>
      <a href="#profile" onclick="scrollToSection('profile');closeMobileMenu();return false;" class="${currentActiveNavId === 'profile' ? 'active' : ''}">${currentLang === 'ar' ? 'عن الدكتور والمسيرة' : 'Biography'}</a>
      <a href="#conferences" onclick="scrollToSection('conferences');closeMobileMenu();return false;" class="${currentActiveNavId === 'conferences' ? 'active' : ''}">${currentLang === 'ar' ? 'المشاركات العلمية والمؤتمرات الدولية' : 'Scientific Conferences'}</a>
      <a href="#specialties" onclick="scrollToSection('specialties');closeMobileMenu();return false;" class="${currentActiveNavId === 'specialties' ? 'active' : ''}">${currentLang === 'ar' ? 'التخصصات والخدمات' : 'Specialties'}</a>
      <a href="#simulator" onclick="scrollToSection('simulator');closeMobileMenu();return false;" class="${currentActiveNavId === 'simulator' ? 'active' : ''}">${currentLang === 'ar' ? 'محاكي الرؤية التفاعلي' : 'Vision Simulator'}</a>
      <a href="#cataracts" onclick="scrollToSection('cataracts');closeMobileMenu();return false;" class="${currentActiveNavId === 'cataracts' ? 'active' : ''}">${currentLang === 'ar' ? 'دليل العدسات (IOLs)' : 'IOL Guide'}</a>
      <a href="#questionnaire" onclick="scrollToSection('questionnaire');closeMobileMenu();return false;" class="${currentActiveNavId === 'questionnaire' ? 'active' : ''}">${currentLang === 'ar' ? 'استبيان نمط الحياة البصري' : 'Questionnaire'}</a>
      <a href="#education" onclick="scrollToSection('education');closeMobileMenu();return false;" class="${currentActiveNavId === 'education' ? 'active' : ''}">${currentLang === 'ar' ? 'المكتبة الطبية والتثقيف' : 'Medical Library'}</a>
      <a href="#clinic" onclick="scrollToSection('clinic');closeMobileMenu();return false;" class="${currentActiveNavId === 'clinic' ? 'active' : ''}">${currentLang === 'ar' ? 'العيادة والحجز والموقع' : 'Clinic & Booking'}</a>
      <a href="${DOCTOR.mapsUrl}" target="_blank" rel="noopener noreferrer">${currentLang === 'ar' ? 'موقع المستشفى (خرائط جوجل)' : 'Hospital Google Maps'}</a>
    </nav>
  </header>`;
}

// --- HERO SECTION ---
function renderHero() {
  const isAr = (currentLang === 'ar');
  return `
  <section class="hero" id="home">
    <!-- Subtle Background Shapes & Optical Accents -->
    <div class="bg-shape-decor hero-bg-decor" aria-hidden="true">
      <div class="glow-orb glow-orb-gold" style="width:520px;height:520px;top:-120px;right:-100px;"></div>
      <div class="glow-orb glow-orb-burgundy" style="width:440px;height:440px;bottom:-60px;left:-80px;"></div>
      <div class="optical-ring" style="width:680px;height:680px;top:-200px;right:-140px;"></div>
      <div class="optical-ring optical-ring-dashed" style="width:500px;height:500px;top:-110px;right:-50px;"></div>
      <div class="optical-ring" style="width:340px;height:340px;top:-30px;right:30px;border-color:rgba(197,164,109,0.12);"></div>
      <span class="optical-plus" style="top:18%;right:14%;">+</span>
      <span class="optical-plus" style="top:62%;right:8%;">+</span>
      <span class="optical-plus" style="top:28%;left:12%;">+</span>
      <span class="optical-plus" style="bottom:16%;left:20%;">+</span>
    </div>

    <div class="container">
      <div class="hero-grid">
        <div class="hero-content fade-in">
          <div class="hero-badge">
            <span class="badge-seal" aria-hidden="true">★</span>
            <span>${isAr ? 'خبرة سريرية وأكاديمية وجراحية ممتدة منذ عام 1998 · المدينة المنورة' : 'Clinical & Surgical Excellence Since 1998 · Madinah, Saudi Arabia'}</span>
          </div>

          <h1 class="hero-title ${isAr ? 'font-doctor-highlight' : ''}">
            ${isAr ? DOCTOR.nameAr : DOCTOR.nameEn}
          </h1>

          <div class="hero-specialty-subtitle">
            ${isAr ? DOCTOR.titleAr : DOCTOR.titleEn}
          </div>

          <div class="hero-latin-subtitle">
            ${isAr ? 'Consultant Cornea, Cataract & Refractive Surgery — FRCS (UK)' : 'Senior Consultant at Magrabi Health Eye Hospital — Madinah'}
          </div>

          <!-- Prominent Doctor Showcase for Mobile & Tablet (immediately visible at the beginning!) -->
          <div class="hero-image-mobile">
            <div class="hero-image-wrap">
              <img src="./images/uploaded_1.png" alt="${isAr ? DOCTOR.nameAr : DOCTOR.nameEn}" class="doctor-photo" loading="eager" onerror="this.src='./images/dr-maan-portrait.png'">
              <div class="image-floating-badge">
                <div class="badge-icon-box">✓</div>
                <div class="badge-text-box">
                  <small>${isAr ? 'الترخيص الاستشاري المعتمد' : 'Board-Certified Consultant'}</small>
                  <strong>${isAr ? 'الهيئة السعودية للتخصصات الصحية' : 'Saudi Commission for Health Specialties'}</strong>
                </div>
              </div>
            </div>
          </div>

          <div class="hero-quote-card">
            <div class="quote-mark">“</div>
            <p class="quote-text">
              ${isAr
                ? 'طب العيون أمانة علمية وإنسانية دقيقة؛ هدفنا الأول هو الحفاظ على نعمة الإبصار وتقديم العلاج الأنسب لكل عين وفق أعلى المعايير الطبية العالمية دون إفراط أو تسويق غير مبرر.'
                : 'Ophthalmology is a sacred clinical trust. Our core objective is preserving sight and delivering personalized, evidence-based care adhering to the highest international medical standards.'}
            </p>
          </div>

          <div class="hero-stats-strip">
            <div class="stat-box">
              <strong class="stat-number">+26</strong>
              <span class="stat-label">${isAr ? 'عاماً خبرة سريرية وأكاديمية (منذ 1998)' : 'Years of Clinical Excellence (Since 1998)'}</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-box">
              <strong class="stat-number">100%</strong>
              <span class="stat-label">${isAr ? 'التزام طبي وفق بروتوكولات الفحص الدقيق' : 'Adherence to Diagnostic Protocols'}</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-box">
              <strong class="stat-number">+15,000</strong>
              <span class="stat-label">${isAr ? 'فحص وإجراء جراحي دقيق في طب العيون' : 'Specialized Ophthalmic Procedures'}</span>
            </div>
          </div>

          <div class="hero-cta">
            <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-lg btn-arrow-fill" id="hero-primary-cta">
              <span class="btn-fill-effect" aria-hidden="true"></span>
              <span class="btn-label">${isAr ? 'احجز موعد كشف أو استشارة' : 'Book Clinic Appointment'}</span>
              <span class="btn-arrow-wrap" aria-hidden="true">
                <svg class="btn-arrow-svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </span>
            </a>
            <a href="#simulator" onclick="scrollToSection('simulator');return false;" class="btn btn-outline btn-lg btn-gradient-shimmer" id="hero-secondary-cta">
              <span class="btn-shimmer-border" aria-hidden="true"></span>
              <span class="btn-shimmer-body">
                <span class="btn-label">${isAr ? 'جرب محاكي الرؤية التفاعلي' : 'Try Vision Simulator'}</span>
                <span class="btn-sparkle" aria-hidden="true">✦</span>
              </span>
            </a>
            <a href="${getWhatsAppUrl()}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
              <span>${isAr ? 'تنسيق عبر واتساب' : 'WhatsApp'}</span>
            </a>
          </div>

          <div class="hero-social-row">
            <span class="hero-social-title">${isAr ? 'قنوات التواصل والتثقيف الطبي للدكتور معن:' : 'Official Medical & Social Channels:'}</span>
            <div class="hero-social-list">
              <a href="${DOCTOR.instagram}" target="_blank" rel="noopener noreferrer" class="social-chip instagram" title="Instagram - Dr. Maan Albarry">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <span>Instagram</span>
              </a>
              <a href="${DOCTOR.twitter}" target="_blank" rel="noopener noreferrer" class="social-chip twitter" title="X (Twitter) - Dr. Maan Albarry">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                <span>X (Twitter)</span>
              </a>
              <a href="${DOCTOR.youtube}" target="_blank" rel="noopener noreferrer" class="social-chip youtube" title="YouTube - Dr. Maan Albarry">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                <span>YouTube</span>
              </a>
              <a href="${getWhatsAppUrl()}" target="_blank" rel="noopener noreferrer" class="social-chip whatsapp" title="WhatsApp - Dr. Maan">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        <div class="hero-image hero-desktop-doctor-showcase fade-in">
          <div class="hero-image-wrap">
            <img src="./images/uploaded_1.png" alt="${isAr ? DOCTOR.nameAr : DOCTOR.nameEn}" class="doctor-photo" loading="eager" onerror="this.src='./images/dr-maan-portrait.png'">
            <div class="image-floating-badge">
              <div class="badge-icon-box">✓</div>
              <div class="badge-text-box">
                <small>${isAr ? 'الترخيص الاستشاري المعتمد' : 'Board-Certified Consultant'}</small>
                <strong>${isAr ? 'الهيئة السعودية للتخصصات الصحية' : 'Saudi Commission for Health Specialties'}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

// --- ACADEMIC QUALIFICATIONS & FELLOWSHIPS ---
function renderQualifications() {
  const isAr = (currentLang === 'ar');
  const cards = [
    {
      icon: '🏛️',
      titleAr: 'الزمالة والبورد الملكي البريطاني',
      titleEn: 'Royal College Fellowship & Saudi Board',
      descAr: 'زميل الكلية البريطانية الملكية للجراحين (FRCS) وبورد طب وجراحة العيون، مع الالتزام الصارم بأعلى المعايير السريرية العالمية.',
      descEn: 'Fellow of the Royal College of Surgeons (FRCS) & Board Certified in Ophthalmology adhering to rigorous surgical benchmarks.',
      tag: 'FRCS (UK) & Saudi Board'
    },
    {
      icon: '🔬',
      titleAr: 'تخصص دقيق في جراحة وأمراض القرنية',
      titleEn: 'Cornea & Anterior Segment Subspecialty',
      descAr: 'برنامج الزمالة التخصصية في أمراض وزراعة وتثبيت القرنية وعلاج القرنية المخروطية بتقنية CXL وحالات العين الأمامية المعقدة.',
      descEn: 'Subspecialty fellowship in corneal disease, keratoconus cross-linking (CXL), and anterior segment reconstruction.',
      tag: 'Cornea Fellowship'
    },
    {
      icon: '👁️',
      titleAr: 'جراحة الماء الأبيض والعدسات المتقدمة',
      titleEn: 'Micro-Incision Cataract & Premium IOLs',
      descAr: 'إجراء عمليات إزالة الساد عبر تقنية الفاكو الميكروسكوبية، وزراعة أحدث العدسات الذكية: أحادية البؤرة، EDOF، وثلاثية البؤرة.',
      descEn: 'Phacoemulsification micro-incision cataract surgery and customized implantation of monofocal, EDOF, and trifocal IOLs.',
      tag: 'Cataract & Premium IOLs'
    },
    {
      icon: '⚕️',
      titleAr: 'المناصب القيادية والأكاديمية',
      titleEn: 'Leadership & Academic Appointments',
      descAr: 'كبير موظفي مركز مغربي المدينة، وأول رئيس للرابطة السعودية للقرنية والماء الأبيض وتصحيح الإبصار، ورئيس قسم العيون بجامعة طيبة سابقاً (10 سنوات).',
      descEn: 'Chief Medical Officer at Magrabi Madinah, 1st President of Saudi Cornea & Cataract Association, Taibah Univ Chair (10 yrs).',
      tag: 'Clinical Leadership'
    }
  ];

  return `
  <section class="section" id="qualifications" style="padding-top:var(--space-12);padding-bottom:var(--space-12);">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${isAr ? 'الاعتمادات والتأهيل الأكاديمي' : 'Credentials & Academic Accreditation'}</div>
        <h2>${isAr ? 'ركائز الكفاءة الجراحية والاعتماد العلمي الدولي' : 'Pillars of Clinical Excellence & Surgical Mastery'}</h2>
        <p>${isAr ? 'مؤهلات عليا وزمالات دولية تضمن للمريض أعلى مستويات الأمان والدقة والشفافية الطبية.' : 'Distinguished international fellowships ensuring patients receive the highest standards of safety and precision.'}</p>
      </div>

      <div class="qualifications-grid fade-in">
        ${cards.map(c => `
          <div class="qual-card">
            <div class="qual-icon-box" aria-hidden="true">${c.icon}</div>
            <h3>${isAr ? c.titleAr : c.titleEn}</h3>
            <p>${isAr ? c.descAr : c.descEn}</p>
            <div>
              <span class="qual-tag">${c.tag}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

// --- PROFILE & SCIENTIFIC PARTICIPATION ---
function renderProfile() {
  const roles = DOCTOR.roles[currentLang];
  const isAr = (currentLang === 'ar');

  return `
  <section class="section section-alt" id="profile">
    <!-- Subtle Background Shapes & Optical Accents -->
    <div class="bg-shape-decor profile-bg-decor" aria-hidden="true">
      <div class="glow-orb glow-orb-gold" style="width:480px;height:480px;top:15%;left:-120px;"></div>
      <div class="glow-orb glow-orb-burgundy" style="width:400px;height:400px;bottom:10%;right:-90px;"></div>
      <div class="optical-curve-arc" style="width:560px;height:560px;bottom:-140px;right:-120px;"></div>
      <div class="optical-ring optical-ring-dashed" style="width:380px;height:380px;top:8%;left:4%;"></div>
      <span class="optical-plus" style="top:22%;left:16%;">+</span>
      <span class="optical-plus" style="bottom:22%;right:14%;">+</span>
    </div>

    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label-wrap">
          <span class="section-label">${isAr ? 'السيرة المهنية والأكاديمية' : 'Professional Profile'}</span>
        </div>
        <h2 class="${isAr ? 'font-doctor-highlight' : ''}">${isAr ? DOCTOR.nameAr : DOCTOR.nameEn}</h2>
        <p style="font-weight:600;color:var(--secondary-burgundy);">${isAr ? DOCTOR.titleAr : DOCTOR.titleEn}</p>
      </div>

      <div class="profile-grid fade-in">
        <div class="profile-media">
          <div class="profile-media-wrap">
            <img src="./images/uploaded_2.jpg" alt="${isAr ? DOCTOR.nameAr : DOCTOR.nameEn}" class="profile-media-img" loading="lazy" onerror="this.src='./images/dr-maan-redsea.jpg'">
            <div class="profile-media-caption">
              <span>${isAr ? 'مؤتمر البحر الأحمر الدولي لطب وجراحة العيون — الجمعية السعودية لطب العيون' : 'Red Sea International Ophthalmology Conference — SOS'}</span>
            </div>
          </div>
          <div class="credentials-chips">
            <span class="chip chip-gold">${isAr ? 'زميل الكلية البريطانية الملكية FRCS' : 'Fellow Royal College of Surgeons (FRCS)'}</span>
            <span class="chip">${isAr ? 'كبير موظفي مركز مغربي المدينة المنورة' : 'Chief Medical Officer – Magrabi Madinah'}</span>
            <span class="chip">${isAr ? 'أول رئيس للرابطة السعودية لجراحي القرنية والماء الأبيض وتصحيح الإبصار' : '1st President – Saudi Cornea, Cataract & Refractive'}</span>
            <span class="chip">${isAr ? 'رئيس قسم طب وجراحة العيون بجامعة طيبة سابقاً (10 سنوات)' : 'Former Chair of Ophthalmology – Taibah Univ. (10 Yrs)'}</span>
            <span class="chip">⭐ ${isAr ? 'خبرة ممتدة منذ 1998' : 'Experience Since 1998'}</span>
          </div>
        </div>

        <div class="profile-text">
          <p style="font-size:1.05rem;line-height:1.9;color:var(--text-primary);margin-bottom:var(--space-4);">
            ${isAr
              ? 'د. معن بن عبدالله البري استشاري طب وجراحة العيون في مستشفيات ومراكز مغربي للعيون والأذن بالمدينة المنورة، بخبرة سريرية وأكاديمية وجراحية ممتدة منذ عام 1998. يعمل ضمن وحدة جراحة الماء الأبيض ووحدة جراحة القرنية وتصحيح النظر، ويساعد المرضى في تقييم الحالات التي تتطلب دقة متناهية في فحص عدسة العين، تشخيص القرنية المخروطية، وتحديد خيارات تصحيح الإبصار بالليزر أو زراعة العدسات.'
              : 'Dr. Maan bin Abdullah Al Barry is a Senior Consultant Ophthalmologist practicing at Magrabi Health Eye & ENT Hospital in Madinah, with extensive clinical and surgical experience since 1998. He specializes in micro-incision cataract surgery, anterior segment corneal disease, and precision refractive surgery.'}
          </p>

          <p style="font-size:1.05rem;line-height:1.9;color:var(--text-secondary);margin-bottom:var(--space-6);">
            ${isAr
              ? 'تتكامل ممارسته السريرية مع أدوار قيادية وأكاديمية بارزة؛ حيث يشغل منصب كبير موظفي مركز مغربي المدينة المنورة (المشرف العام على الشؤون الطبية والإدارية والتشغيلية بالفرع)، وهو أول رئيس للرابطة السعودية لجراحي القرنية والماء الأبيض وتصحيح الإبصار، ورئيس قسم طب وجراحة العيون بجامعة طيبة سابقاً لمدة 10 سنوات، وممثل الجمعية السعودية لطب العيون بالمدينة المنورة سابقاً، وأحد مؤسسي مؤتمر البحر الأحمر الدولي للطب وجراحة العيون.'
              : 'His clinical practice is anchored by distinguished leadership appointments: Chief Medical Officer at Magrabi Health Madinah, First President of the Saudi Association of Cornea, Cataract & Refractive Surgeons, former Chairman of Ophthalmology at Taibah University for 10 years, and Co-Founder of the Red Sea International Ophthalmology Conference.'}
          </p>

          <h3 style="margin-bottom:var(--space-4);font-size:1.15rem;color:var(--secondary-burgundy);">
            ${isAr ? 'المسيرة القيادية والمهنية' : 'Leadership & Scientific Appointments'}
          </h3>
          <div class="timeline">
            ${roles.map(r => `
              <div class="timeline-item">
                <h4>${r}</h4>
              </div>
            `).join('')}
          </div>

          <div class="profile-social-card">
            <span class="profile-social-title">${isAr ? 'قنوات التواصل والمحتوى العلمي الموثوق للدكتور معن:' : 'Official Scientific & Media Channels:'}</span>
            <div class="profile-social-list">
              <a href="${DOCTOR.instagram}" target="_blank" rel="noopener noreferrer" class="social-chip instagram" title="Instagram - Dr. Maan Albarry">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <span>Instagram</span>
              </a>
              <a href="${DOCTOR.twitter}" target="_blank" rel="noopener noreferrer" class="social-chip twitter" title="X (Twitter) - Dr. Maan Albarry">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                <span>X (Twitter)</span>
              </a>
              <a href="${DOCTOR.youtube}" target="_blank" rel="noopener noreferrer" class="social-chip youtube" title="YouTube - Dr. Maan Albarry">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                <span>YouTube</span>
              </a>
              <a href="${getWhatsAppUrl()}" target="_blank" rel="noopener noreferrer" class="social-chip whatsapp" title="WhatsApp - Dr. Maan">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Authentic Approved Clinical Technologies & Platforms -->
      <div class="activity-strip-card fade-in">
        <div class="activity-strip-header">
          <div>
            <strong style="font-size:1.12rem;display:block;color:var(--text-primary);">${isAr ? 'التقنيات والتجهيزات الجراحية والتشخيصية المعتمدة' : 'Clinical & Surgical Diagnostic Technologies'}</strong>
            <small style="color:var(--text-muted);">${isAr ? 'تجهيزات عالمية متقدمة في مستشفى مغربي المدينة المنورة تحت إشراف د. معن البري' : 'Advanced platforms at Magrabi Health Madinah under Dr. Maan Al Barry’s clinical oversight'}</small>
          </div>
        </div>
        <div class="tech-grid">
          <div class="tech-card">
            <div class="tech-icon-box">🔬</div>
            <div>
              <h4 style="font-size:0.98rem;margin-bottom:4px;color:var(--text-primary);">${isAr ? 'تصوير القرنية الطبقي (Pentacam HR)' : 'Pentacam HR Corneal Tomography'}</h4>
              <p style="font-size:0.84rem;color:var(--text-secondary);line-height:1.6;margin:0;">${isAr ? 'قياس تضاريس وسماكة القرنية بدقة ميكرونية لتشخيص القرنية المخروطية المبكرة وتحديد ملاءمة عمليات تصحيح النظر.' : 'High-resolution Scheimpflug tomography for early keratoconus detection and customized refractive surgery candidacy.'}</p>
            </div>
          </div>
          <div class="tech-card">
            <div class="tech-icon-box">👁️</div>
            <div>
              <h4 style="font-size:0.98rem;margin-bottom:4px;color:var(--text-primary);">${isAr ? 'جراحة الفاكو الدقيقة (Phacoemulsification)' : 'Micro-Incision Phacoemulsification'}</h4>
              <p style="font-size:0.84rem;color:var(--text-secondary);line-height:1.6;margin:0;">${isAr ? 'تفتيت الساد بالموجات فوق الصوتية وزراعة العدسات المطوية عبر شق مجهري لا يتجاوز 2.2 ملم تحت تخدير موضعي بالقطرات.' : 'Micro-incision cataract removal and foldable intraocular lens implantation through a 2.2mm incision with no stitches.'}</p>
            </div>
          </div>
          <div class="tech-card">
            <div class="tech-icon-box">📐</div>
            <div>
              <h4 style="font-size:0.98rem;margin-bottom:4px;color:var(--text-primary);">${isAr ? 'القياسات البصرية الحيوية (Optical Biometry)' : 'Swept-Source Optical Biometry'}</h4>
              <p style="font-size:0.84rem;color:var(--text-secondary);line-height:1.6;margin:0;">${isAr ? 'حساب قوة العدسة المزروعة بدقة متناهية بالليزر وفق أحدث معادلات الذكاء الاصطناعي لضمان أفضل دقة انكسارية.' : 'Laser-based optical biometry utilizing state-of-the-art AI formulas for supreme refractive accuracy.'}</p>
            </div>
          </div>
          <div class="tech-card">
            <div class="tech-icon-box">🛡️</div>
            <div>
              <h4 style="font-size:0.98rem;margin-bottom:4px;color:var(--text-primary);">${isAr ? 'تثبيت القرنية الضوئي (Corneal Cross-Linking)' : 'Corneal Cross-Linking (CXL)'}</h4>
              <p style="font-size:0.84rem;color:var(--text-secondary);line-height:1.6;margin:0;">${isAr ? 'تقنية كيميائية ضوئية بالريبوفلافين والأشعة فوق البنفسجية لوقف تطور القرنية المخروطية وحماية النظر.' : 'Photochemical stabilization utilizing riboflavin and UVA to halt keratoconus progression and preserve vision.'}</p>
            </div>
          </div>
        </div>
      </div>


      <!-- Scientific participation & Conferences -->
      <div class="conferences-section" id="conferences" style="scroll-margin-top: 88px; margin-top: var(--space-16);">
        <div class="sci-head fade-in">
          <div class="section-label" style="display:inline-block;margin-bottom:8px;">${currentLang === 'ar' ? 'المؤتمرات والأكاديميا' : 'Academic & Scientific Conferences'}</div>
          <h3 style="font-size:1.65rem;color:var(--text-primary);margin-bottom:6px;">${currentLang === 'ar' ? 'المشاركات العلمية والمؤتمرات الدولية' : 'Scientific Participation & Conferences'}</h3>
          <p style="color:var(--text-secondary);font-size:0.95rem;">${currentLang === 'ar' ? 'حضور وتمثيل علمي مستمر في مؤتمرات طب وجراحة العيون الإقليمية والدولية' : 'Representing ophthalmology at national and international meetings'}</p>
        </div>
        <div class="sci-grid fade-in">
          <figure class="sci-fig">
            <img src="./images/dr-maan-redsea.jpg" alt="${currentLang === 'ar' ? 'د. معن البري في مؤتمر البحر الأحمر لطب العيون 2024' : 'Dr. Maan Al Barry at Saudi Ophthalmology 2024, The Red Sea'}" style="object-position:50% 22%" loading="lazy">
            <figcaption><strong>${currentLang === 'ar' ? 'مؤتمر البحر الأحمر لطب وجراحة العيون 2024' : 'Saudi Ophthalmology 2024 — The Red Sea'}</strong><span>${currentLang === 'ar' ? 'عضو المجلس العلمي للمؤتمر' : 'Scientific Council Member'}</span></figcaption>
          </figure>
          <figure class="sci-fig">
            <img src="./images/dr-maan-faculty.jpg" alt="${currentLang === 'ar' ? 'مع نخبة من أطباء العيون في الجلسات العلمية' : 'With fellow faculty at the scientific sessions'}" style="object-position:50% 100%" loading="lazy">
            <figcaption><strong>${currentLang === 'ar' ? 'الجلسات العلمية الدولية' : 'International scientific sessions'}</strong><span>${currentLang === 'ar' ? 'مع نخبة من أطباء وجراحي العيون' : 'With ophthalmic surgeons and faculty'}</span></figcaption>
          </figure>
        </div>
      </div>

      <!-- Verified Patient Reviews -->
      <div style="margin-top:var(--space-16);" class="fade-in">
        <div class="section-header" style="margin-bottom:var(--space-6);">
          <div class="section-label">${currentLang === 'ar' ? 'آراء وتجارب المرضى' : 'Patient Testimonials'}</div>
          <h3 style="font-size:1.35rem;">${currentLang === 'ar' ? 'تجارب المراجعين في مغربي المدينة المنورة' : 'Reviews from Magrabi Health Madinah'}</h3>
          <p style="font-size:0.82rem;color:var(--text-muted);margin-top:6px;max-width:620px;margin-inline:auto;">
            ${currentLang === 'ar'
              ? 'ملاحظة سريرية: تجارب وشهادات استرشادية منقولة من مراجعي منصات التقييم العامة لمستشفيات مغربي، وتخضع للمراجعة والتأكيد النهائي من الطبيب.'
              : 'Clinical note: Illustrative feedback compiled from public review platforms for Magrabi Health, pending final administrative confirmation by the clinic owner.'}
          </p>
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
      img: './images/surgery-phaco.jpg',
      tagsAr: ['إزالة الساد بالفاكو', 'تصحيح الاستجماتيزم', 'العدسات التوريكية', 'عدسات ثلاثية EDOF'],
      tagsEn: ['Phacoemulsification', 'Astigmatism Correction', 'Toric IOLs', 'Trifocal / EDOF Optics']
    },
    {
      code: 'SURG-02',
      titleAr: 'جراحة وأمراض القرنية والقرنية المخروطية المتقدمة',
      titleEn: 'Cornea Care & Advanced Keratoconus Treatment',
      descAr: 'التشخيص المبكر والدقيق للقرنية المخروطية وتثبيت القرنية بالأشعة فوق البنفسجية والريبوفلافين (Corneal Cross-Linking - CXL)، مع خطط متابعة مستمرة لحفظ النظر.',
      descEn: 'Early keratoconus detection, corneal collagen cross-linking (CXL) to arrest progression, and specialized anterior segment management.',
      img: './images/cornea-cxl.jpg',
      tagsAr: ['تثبيت القرنية CXL', 'سماكة القرنية الطبقية', 'علاج سحابات القرنية', 'جفاف العين المزمن'],
      tagsEn: ['Corneal Cross-Linking (CXL)', 'Pachymetry Tomography', 'Corneal Opacities', 'Ocular Surface Disease']
    },
    {
      code: 'SURG-03',
      titleAr: 'عمليات تصحيح النظر بالليزر والفيمتو ليزك',
      titleEn: 'Laser Refractive Surgery (Femto-LASIK & PRK)',
      descAr: 'معاينة وفحص دقيق لقصر وطول النظر والاستجماتيزم باستخدام تقنيات الفيمتوليزك، والليزر السطحي (PRK)، وبصمة العين المخصصة (Custom Wavefront) لتحقيق أقصى حدة بصرية.',
      descEn: 'Comprehensive suitability evaluation for Femto-LASIK and surface ablation (PRK) driven by customized wavefront topography.',
      img: './images/clinic-exam-room.jpg',
      tagsAr: ['فحص سماكة القرنية', 'الليزر السطحي PRK', 'الفيمتو ليزك', 'بصمة العين Wavefront'],
      tagsEn: ['Pachymetry Check', 'Surface PRK', 'Femto-LASIK', 'Wavefront Custom']
    },
    {
      code: 'DIAG-04',
      titleAr: 'الفحوصات التشخيصية المتقدمة وقياسات ما قبل الجراحة',
      titleEn: 'Advanced Diagnostics & Optical Biometry',
      descAr: 'التصوير المقطعي للقرنية (Pentacam)، فحص خلايا البطانة القرنية (Specular Microscopy)، وقياس قوة العدسة الدقيق ضوئياً (Optical Biometry) بأحدث أجهزة التصوير ثلاثية الأبعاد.',
      descEn: 'High-precision Scheimpflug corneal tomography (Pentacam), specular endothelial microscopy, and optical biometry for exact surgical planning.',
      img: './images/diagnostics-pentacam.jpg',
      tagsAr: ['طبوغرافيا البنتاكام', 'قياس ضغط العين', 'مسح العصب البصري', 'حساب العدسات بالبيومتري'],
      tagsEn: ['Pentacam Tomography', 'Intraocular Pressure', 'OCT Macula & Nerve', 'Optical Biometry IOL Master']
    }
  ];

  const isAr = (currentLang === 'ar');

  const journeySteps = [
    {
      num: '01',
      titleAr: 'الفحص التشخيصي المقطعي المتقدم',
      titleEn: 'Comprehensive Diagnostic Profiling',
      descAr: 'تصوير تضاريس القرنية (Pentacam) وقياس القوة الانكسارية بدقة ضوئية لتحديد الخطة الجراحية بدقة متناهية.',
      descEn: 'High-resolution Scheimpflug tomography and optical biometry to establish an objective surgical roadmap.'
    },
    {
      num: '02',
      titleAr: 'الاستشارة ومناقشة الخيارات بأمانة',
      titleEn: 'Personalized Clinical Consultation',
      descAr: 'جلسة حوارية مفصلة مع د. معن لشرح النتائج واختيار نوع العدسة أو تقنية الليزك الأنسب لنمط حياتك وعملك.',
      descEn: 'Transparent discussion regarding realistic outcomes, custom lens options, and lifestyle visual goals.'
    },
    {
      num: '03',
      titleAr: 'الإجراء الجراحي الميكروسكوبي الدقيق',
      titleEn: 'Precision Micro-Incision Surgery',
      descAr: 'إجراء العملية داخل غرف عمليات مجهزة بأحدث أجهزة الفاكو والليزر تحت تخدير موضعي مريح دون ألم يذكر.',
      descEn: 'Procedure executed in state-of-the-art operating theaters under comfortable topical drop anesthesia.'
    },
    {
      num: '04',
      titleAr: 'بروتوكول المتابعة والاطمئنان بعد العملية',
      titleEn: 'Structured Postoperative Care Protocol',
      descAr: 'جدول زيارات فحص مجدولة لمراقبة تعافي القرنية والتأكد من استقرار حدة الإبصار وسلامة العين على المدى البعيد.',
      descEn: 'Rigorous schedule of follow-up reviews to monitor corneal healing and confirm long-term visual stability.'
    }
  ];

  return `
  <section class="section" id="specialties">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${isAr ? 'التخصصات الطبية والخدمات الجراحية الدقيقة' : 'Precision Clinical Specialties'}</div>
        <h2>${isAr ? 'حلول جراحية وعلاجية بأحدث ما توصل إليه علم العيون' : 'Advanced Ophthalmic Medical & Surgical Solutions'}</h2>
        <p>${isAr ? 'إجراءات جراحية وتشخيصية متقدمة تُجرى وفق بروتوكولات عالمية معتمدة لضمان أمان ودقة النتائج.' : 'State-of-the-art diagnostics and surgeries performed according to international clinical quality benchmarks.'}</p>
      </div>

      <div class="specialties-grid fade-in">
        ${units.map(u => `
          <div class="specialty-unit-card">
            <div class="specialty-img-wrap">
              <img src="${u.img}" alt="${isAr ? u.titleAr : u.titleEn}" loading="lazy">
            </div>
            <div class="specialty-body">
              <div class="specialty-tag">${u.code}</div>
              <h3>${isAr ? u.titleAr : u.titleEn}</h3>
              <p>${isAr ? u.descAr : u.descEn}</p>
              <div class="specialty-features">
                ${(isAr ? u.tagsAr : u.tagsEn).map(t => `<span class="specialty-pill">${t}</span>`).join('')}
              </div>
              <div style="margin-top:auto;padding-top:var(--space-3);">
                <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
                  ${isAr ? 'طلب تقرير تشخيصي أو حجز موعد ←' : 'Book Specialty Evaluation →'}
                </a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- 4-Step Systematic Clinical Journey -->
      <div class="journey-head fade-in">
        <div class="section-label">${isAr ? 'منهجية الرعاية السريرية' : 'Clinical Care Pathway'}</div>
        <h3>${isAr ? 'رحلة المريض السريرية: من التشخيص الدقيق إلى وضوح الرؤية' : 'The Systematic Patient Journey: From Diagnosis to Visual Clarity'}</h3>
        <p>${isAr ? 'مسار رعاية منظم يضمن للمريض الفهم الكامل والراحة التامة في كل خطوة.' : 'A structured pathway ensuring thorough understanding, safety, and personalized outcomes.'}</p>
      </div>

      <div class="journey-grid fade-in">
        ${journeySteps.map(step => `
          <div class="journey-step-card">
            <span class="journey-step-number">${step.num}</span>
            <h4>${isAr ? step.titleAr : step.titleEn}</h4>
            <p>${isAr ? step.descAr : step.descEn}</p>
          </div>
        `).join('')}
      </div>

      <!-- Hospital Accreditation Strip -->
      <div class="jci-strip fade-in">
        <span class="jci-icon">🛡️</span>
        <span>
          ${isAr
            ? 'تُجرى كافة الفحوصات والعمليات الجراحية في مستشفى ومراكز مغربي للعيون بالمدينة المنورة — معتمد من الهيئة المشتركة الدولية (JCI) والمركز السعودي لاعتماد المنشآت الصحية (CBAHI).'
            : 'All surgical procedures performed at Magrabi Health Eye & ENT Hospital in Madinah — accredited by the Joint Commission International (JCI) and CBAHI.'}
        </span>
      </div>
    </div>
  </section>`;
}

// --- IOL COMPARISON GUIDE ---
function renderIolGuide() {
  const isAr = (currentLang === 'ar');
  const iolCards = [
    {
      n: isAr ? 'ممتدة المدى (EDOF)' : 'Extended Depth of Focus (EDOF)',
      favored: true,
      badge: isAr ? 'الخيار المفضل حالياً لدى د. معن' : 'Favored by Dr. Maan',
      sub: isAr ? 'أعلى جودة بصرية وأقل هالات ليلية للقيادة والشاشات' : 'Optimal optical quality & minimal halos for driving and screens',
      d: [4, isAr ? 'ممتازة وواضحة جداً' : 'Excellent & crisp'],
      m: [4, isAr ? 'ممتازة (شاشات ولوحة القيادة)' : 'Excellent (screens & dashboard)'],
      nr: [2, isAr ? 'جيدة للأنشطة اليومية، ونظارة خفيفة للخط الدقيق' : 'Functional for daily tasks, light glasses for fine print'],
      h: [1, isAr ? 'منخفضة جداً (راحة فائقة بالقيادة ليلاً)' : 'Very low (great night driving comfort)'],
      g: isAr ? 'نظارة خفيفة للقراءة الدقيقة جداً فقط' : 'Light glasses for very fine print only'
    },
    {
      n: isAr ? 'ثلاثية البؤرة (Trifocal)' : 'Trifocal',
      favored: false,
      badge: null,
      sub: isAr ? 'للاستغناء عن النظارة مع احتمالية هالات ليلية' : 'Maximum spectacle independence with potential night halos',
      d: [4, isAr ? 'ممتازة' : 'Excellent'],
      m: [4, isAr ? 'جيدة جداً' : 'Very good'],
      nr: [4, isAr ? 'ممتازة للقراءة بدون نظارة غالباً' : 'Great, rarely need glasses'],
      h: [4, isAr ? 'أكثر شيوعاً (هالات حلقية ووهج حول الأضواء)' : 'More frequent (concentric halos around lights)'],
      g: isAr ? 'استغناء شبه كامل، وتختلف بحسب الإضاءة والتكيف' : 'High independence, depends on lighting & neuroadaptation'
    },
    {
      n: isAr ? 'أحادية البؤرة (Monofocal)' : 'Monofocal',
      favored: false,
      badge: null,
      sub: isAr ? 'لأعلى نقاء للبعيد مع نظارة للقريب والمتوسط' : 'Sharpest distance, permanent glasses for near & intermediate',
      d: [4, isAr ? 'ممتازة ونقية' : 'Excellent & pure'],
      m: [2, isAr ? 'تحتاج نظارة غالباً' : 'Glasses usually needed'],
      nr: [1, isAr ? 'تحتاج نظارة قراءة دائماً' : 'Reading glasses needed'],
      h: [1, isAr ? 'الأقل إطلاقاً بين العدسات' : 'Lowest of all lenses'],
      g: isAr ? 'دائمة للقراءة والكمبيوتر' : 'Permanent for reading and computer'
    }
  ];

  const renderEyePips = (score, cls) => `
    <span class="eye-pips ${cls}" role="img" aria-label="${score}/4">
      ${[1, 2, 3, 4].map(k => `
        <span class="eye-icon ${k <= score ? 'eye-open' : 'eye-closed'} ${k <= score ? cls : ''}">
          ${k <= score 
            ? `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3.2" fill="currentColor"/></svg>`
            : `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10c3.5 4.5 6.5 6 9 6s5.5-1.5 9-6"/><path d="M6 13l-1.8 2.5M10 15.5l-0.8 3M14 15.5l0.8 3M18 13l1.8 2.5"/></svg>`
          }
        </span>
      `).join('')}
    </span>
  `;

  const renderRow = (label, tuple, cls) => `
    <div class="iol-row">
      <b>${label}</b>
      ${renderEyePips(tuple[0], cls)}
      <small>${tuple[1]}</small>
    </div>
  `;

  return `
  <section class="section section-alt" id="cataracts">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${isAr ? 'دليل اختيار العدسة' : 'Lens selection guide'}</div>
        <h2>${isAr ? 'مقارنة العدسات الشائعة داخل العين' : 'Comparing common intraocular lenses'}</h2>
        <p>${isAr ? 'ملخص سريري مبسط للفروق بين الأنواع الثلاثة لمساعدتك على الحوار مع الدكتور معن.' : 'A simplified clinical summary of the three main types, to support your conversation with Dr. Maan.'}</p>
      </div>

      <div class="iol-grid fade-in">
        ${iolCards.map(c => `
          <article class="iol-card ${c.favored ? 'iol-card-favored' : ''}">
            <header>
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:4px;">
                <h3 style="margin:0;">${c.n}</h3>
                ${c.badge ? `<span class="iol-favored-badge">${c.badge}</span>` : ''}
              </div>
              <p>${c.sub}</p>
            </header>
            ${renderRow(isAr ? 'الرؤية البعيدة' : 'Distance', c.d, 'good')}
            ${renderRow(isAr ? 'المتوسطة (الكمبيوتر)' : 'Intermediate (computer)', c.m, 'good')}
            ${renderRow(isAr ? 'القريبة (القراءة)' : 'Near (reading)', c.nr, 'good')}
            ${renderRow(isAr ? 'الهالات الليلية' : 'Night halos', c.h, 'more')}
            <div class="iol-foot">
              <b>${isAr ? 'الحاجة للنظارة:' : 'Glasses:'}</b> ${c.g}
            </div>
          </article>
        `).join('')}
      </div>

      <p class="iol-legend fade-in">
        <span style="display:inline-flex;align-items:center;gap:6px;">
          <svg viewBox="0 0 24 24" width="18" height="13" fill="none" stroke="var(--secondary-burgundy)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3.2" fill="var(--secondary-burgundy)"/></svg>
          ${isAr ? 'عيون مفتوحة: تشير إلى درجة الوضوح والأداء المرتفع (أو تكرار الهالات في معيار الهالات)' : 'Open eyes: Indicate high clarity and performance (or frequency in halos metric)'}
        </span>
        <span style="display:inline-flex;align-items:center;gap:6px;">
          <svg viewBox="0 0 24 24" width="18" height="13" fill="none" stroke="var(--border-strong)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10c3.5 5 8 7 10 7s6.5-2 10-7"/><path d="M6 13.5l-2 3M10 16.5l-1 3M14 16.5l1 3M18 13.5l2 3"/></svg>
          ${isAr ? 'عيون مغمضة: تشير إلى نطاق محدود أو الحاجة لنظارة مساعدة' : 'Closed eyes: Indicate limited visual range or glasses needed'}
        </span>
      </p>

      <div class="medical-disclaimer fade-in">
        <strong>${isAr ? 'توجيه سريري من <span class="font-doctor-highlight">د. معن بن عبدالله البري</span>:' : 'Clinical Guidance by Dr. Maan:'}</strong>
        ${isAr
          ? 'يفضل الدكتور معن في الفترة الحالية العدسات ممتدة المدى (EDOF) لمعظم المرضى نظراً لتفوق جودة التباين والنقاء وانخفاض الهالات الليلية بشكل ملحوظ مقارنة بالثلاثية. ومع ذلك، لا توجد عدسة واحدة تناسب الجميع بشكل مطلق؛ بل يبقى لكل مريض وضعه الخاص (فحص تضاريس القرنية، فحص الشبكية والماكولا، ونمط الأنشطة اليومية) ليساعدك الدكتور معن في اختيار العدسة المثالية لحالتك.'
          : 'Dr. Maan currently favors Extended Depth of Focus (EDOF) lenses for many patients due to their superior contrast quality and significantly lower night halos compared to trifocals. Nevertheless, no single lens suits everyone; each eye is unique (corneal topography, macular health, and visual habits), and Dr. Maan customizes the optimal selection during your clinical consultation.'}
      </div>
    </div>
  </section>`;
}

// --- QUESTIONNAIRE SECTION ---
function renderQuestionnaireCard() {
  const content = {
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
  }[currentLang];

  if (qCompleted) {
    return `
      <div class="questionnaire">
        <div class="q-result">
          <h3 style="color:var(--secondary-burgundy);margin-bottom:var(--space-3);">
            ${currentLang === 'ar' ? 'تم تجهيز ملخص أولوياتك البصرية' : 'Your Discussion Summary is Ready'}
          </h3>
          <p style="color:var(--text-secondary);font-size:0.95rem;margin-bottom:var(--space-6);">
            ${currentLang === 'ar' ? 'بناءً على إجاباتك الأربع، هذه المحاور العلمية التي يوصى بطرحها ومناقشتها خلال جلستك في عيادة مغربي بالمدينة المنورة:' : 'Based on your selected priorities, here are key clinical topics to explore during your consultation at Magrabi:'}
          </p>

          <div class="q-result-item">
            <h4>${currentLang === 'ar' ? 'الأولوية الوظيفية المستهدفة' : 'Target Visual Focus'}</h4>
            <p>${currentLang === 'ar' ? 'مناقشة موازنة الرؤية بين عدسات EDOF (للقيادة والشاشات مع انعدام الهالات) أو عدسات Trifocal (للقراءة بدون نظارات مع فترة تكيف عصبي).' : 'Evaluate EDOF for pure night contrast vs Trifocals for complete spectacle independence with neuroadaptation.'}</p>
          </div>

          <div class="q-result-item">
            <h4>${currentLang === 'ar' ? 'الفحوصات الطبوغرافية الموصى بها' : 'Required Diagnostic Profiling'}</h4>
            <p>${currentLang === 'ar' ? 'إجراء فحص البنتاكام (Pentacam) لاستبعاد الاستجماتيزم غير المنتظم والتأكد من ملاءمة العدسات متعددة البؤرة لسطح قرنيتك.' : 'Perform Pentacam Scheimpflug tomography to evaluate regular vs irregular astigmatism before premium IOL selection.'}</p>
          </div>

          <div class="q-result-item">
            <h4>${currentLang === 'ar' ? 'تحديد الخيار الجراحي النهائي' : 'Final Surgical Confirmation'}</h4>
            <p>${currentLang === 'ar' ? 'يتم اتخاذ القرار النهائي بناءً على قياسات طول العين بالموجات الضوئية (IOL Master) وفحص قاع العين المباشر مع الدكتور.' : 'Target lens power is calculated using optical biometry paired with thorough clinical examination by Dr. Maan.'}</p>
          </div>

          <div style="display:flex;gap:var(--space-3);justify-content:center;flex-wrap:wrap;margin-top:var(--space-8);">
            <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              ${currentLang === 'ar' ? 'حجز موعد فحص القرنية والعدسات' : 'Book Exam Appointment'}
            </a>
            <a href="${getWhatsAppUrl('مرحباً، أجريت استبيان نمط الحياة البصري على الموقع وأرغب بالاستفسار عن حجز موعد مع د. معن البري.')}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
              ${currentLang === 'ar' ? 'تنسيق الموعد عبر واتساب' : 'Inquire via WhatsApp'}
            </a>
            <button class="btn btn-outline" onclick="restartQ()">
              ${currentLang === 'ar' ? 'إعادة الاستبيان' : 'Restart'}
            </button>
          </div>

          <div class="medical-disclaimer" style="margin-top:var(--space-6);text-align:start;">
            <strong>${currentLang === 'ar' ? 'تنبيه سريري:' : 'Clinical Safety Notice:'}</strong>
            ${currentLang === 'ar' ? 'هذا التقرير استرشادي وتثقيفي فقط ولا يمثل تشخيصاً طبياً أو وصفة ملزمة لنوع عدسة. القرار الطبي يتخذه الاستشاري حصراً بعد الفحص المجهري المباشر.' : 'This summary is for educational discussion only and does not constitute a prescription. Clinical diagnosis and treatment decisions are made exclusively following in-person examination.'}
          </div>
        </div>
      </div>
    `;
  }

  const cur = content.steps[currentQStep];
  return `
    <div class="questionnaire">
      <div class="q-progress">
        ${content.steps.map((_, idx) => `
          <div class="step ${idx < currentQStep ? 'done' : ''} ${idx === currentQStep ? 'current' : ''}"></div>
        `).join('')}
      </div>

      <div style="margin-bottom:var(--space-4);">
        <span style="font-size:0.78rem;font-weight:700;color:var(--gold);text-transform:uppercase;">
          ${currentLang === 'ar' ? `الخطوة ${currentQStep + 1} من 4` : `Step ${currentQStep + 1} of 4`}
        </span>
        <h3 style="font-size:1.25rem;color:var(--text-primary);margin-top:4px;">${cur.question}</h3>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:2px;">${cur.desc}</p>
      </div>

      <div class="q-options">
        ${cur.options.map((opt, optIdx) => `
          <button class="q-option ${qAnswers[currentQStep] === optIdx ? 'selected' : ''}" onclick="selectQOption(${optIdx})">
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>

      <div class="q-nav">
        ${currentQStep > 0 ? `<button class="btn btn-outline btn-sm" onclick="prevQStep()">${currentLang === 'ar' ? 'السابق' : 'Previous'}</button>` : '<div></div>'}
        <button class="btn btn-primary btn-sm" onclick="nextQStep()" ${qAnswers[currentQStep] === undefined ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
          ${currentQStep < content.steps.length - 1 ? (currentLang === 'ar' ? 'التالي ←' : 'Next →') : (currentLang === 'ar' ? 'عرض التقرير الاسترشادي' : 'View Lifestyle Summary')}
        </button>
      </div>
    </div>
  `;
}

function renderQuestionnaire() {
  return `
  <section class="section" id="questionnaire">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${currentLang === 'ar' ? 'استبيان نمط الحياة البصري' : 'Visual Lifestyle Questionnaire'}</div>
        <h2>${currentLang === 'ar' ? '4 خطوات لاكتشاف خيارات العدسة الأنسب لك' : '4 Guided Steps to Identify Your Visual Needs'}</h2>
        <p>${currentLang === 'ar' ? 'أداة تثقيفية لمساعدتك في تحديد أولوياتك اليومية قبل جلسة الفحص والاستشارة في العيادة.' : 'A guided tool to map your daily priorities before your comprehensive clinical consultation.'}</p>
      </div>

      <div id="questionnaire-card-container">
        ${renderQuestionnaireCard()}
      </div>
    </div>
  </section>`;
}

// --- EDUCATION & ARTICLES ---
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
        <p>${currentLang === 'ar' ? 'مقالات وأدلة سريرية محكمة أعدت بإشراف الدكتور معن بن عبدالله البري لتزويدك بالحقائق الطبية الدقيقة.' : 'Peer-reviewed guides developed under Dr. Maan Al Barry’s clinical oversight.'}</p>
      </div>

      <div class="article-accordion fade-in">
        ${articles.map(a => `
          <div class="article-item ${openArticleId === a.id ? 'open' : ''}" id="art-item-${a.id}">
            <button class="article-trigger" onclick="toggleArticle('${a.id}')">
              <span>${currentLang === 'ar' ? a.titleAr : a.titleEn}</span>
              <span class="trigger-icon">▼</span>
            </button>
            <div class="article-content">
              ${currentLang === 'ar' ? a.contentAr : a.contentEn}
              <div style="margin-top:var(--space-4);padding-top:var(--space-3);border-top:1px solid var(--border-subtle);font-size:0.8rem;color:var(--text-muted);">
                ${currentLang === 'ar' ? 'إشراف ومراجعة سريرية: د. معن بن عبدالله البري — استشاري طب وجراحة العيون' : 'Medically supervised by Dr. Maan Al Barry — Consultant Ophthalmologist'}
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Emergency Red Flags Card -->
      <div class="emergency-card fade-in">
        <div class="emergency-header">
          <span>${currentLang === 'ar' ? 'علامات التحذير الطارئة (تستوجب الرعاية العاجلة فوراً)' : 'Emergency Red Flags (Require Immediate Ophthalmic Care)'}</span>
        </div>
        <p style="font-size:0.9rem;">
          ${currentLang === 'ar' ? 'إذا كنت تعاني من أي من الأعراض التالية، يرجى التوجه فوراً لأقرب طوارئ عيون متخصصة:' : 'If you experience any of the following symptoms, seek urgent emergency ophthalmic care immediately:'}
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

// --- CLINIC LOCATION & DIRECT BOOKING ---
function renderClinic() {
  const isAr = (currentLang === 'ar');
  return `
  <section class="section" id="clinic">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${isAr ? 'العيادة والموقع الجغرافي' : 'Hospital Practice & Location'}</div>
        <h2>${isAr ? 'العيادة والاستشارات وحجز المواعيد' : 'Clinic Location & Direct Appointment Booking'}</h2>
        <p>${isAr ? 'نرحب بكم في مستشفيات ومراكز مغربي للعيون والأذن بالمدينة المنورة، المزودة بأحدث التجهيزات الجراحية والتشخيصية.' : 'We welcome you at Magrabi Health Eye & ENT Hospital in Madinah, fully equipped with state-of-the-art diagnostic and surgical technology.'}</p>
      </div>

      <div class="clinic-card fade-in">
        <!-- Modern Expansive Map Section -->
        <div class="clinic-map-pane">
          <iframe 
            src="https://maps.google.com/maps?q=Magrabi+Eye+Hospital+Madinah&t=&z=15&ie=UTF8&iwloc=&output=embed"
            title="${isAr ? 'خريطة موقع مستشفى مغربي المدينة المنورة' : 'Magrabi Eye Hospital Madinah Map'}"
            loading="lazy"
            allowfullscreen>
          </iframe>
          <div class="clinic-map-meta">
            <div class="map-meta-info">
              <span class="map-marker-icon" aria-hidden="true">📍</span>
              <div>
                <strong>${isAr ? DOCTOR.clinicAr : DOCTOR.clinicEn}</strong>
                <small>${isAr ? DOCTOR.addressAr : DOCTOR.addressEn}</small>
              </div>
            </div>
            <a href="${DOCTOR.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm btn-map-action">
              <span>${isAr ? 'الاتجاهات عبر Google Maps' : 'Open in Google Maps'}</span>
              <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        <div class="clinic-info">
          <div class="clinic-header-badge">
            <span class="badge-dot-pulse"></span>
            <span>${isAr ? 'الفرع المعتمد | إشراف د. معن البري' : 'Official Hospital Practice | Madinah'}</span>
          </div>

          <h3>${isAr ? 'بيانات التواصل وأوقات الزيارة' : 'Clinic Contact & Practice Schedule'}</h3>

          <div class="clinic-detail-list">
            <div class="clinic-detail-item">
              <div class="detail-icon-box" aria-hidden="true">🏥</div>
              <div class="detail-text">
                <strong>${isAr ? 'الموقع والصرح الطبي' : 'Medical Hospital'}</strong>
                <span>${isAr ? DOCTOR.clinicAr : DOCTOR.clinicEn}</span>
                <small style="color:var(--text-muted);display:block;margin-top:2px;">${isAr ? DOCTOR.addressAr : DOCTOR.addressEn}</small>
              </div>
            </div>

            <div class="clinic-detail-item">
              <div class="detail-icon-box" aria-hidden="true">📱</div>
              <div class="detail-text">
                <strong>${isAr ? 'الرقم المباشر لعيادة <span class="font-doctor-highlight">د. معن</span> بمغربي' : 'Direct Clinic Phone – Dr. Maan (Magrabi)'}</strong>
                <a href="tel:${DOCTOR.clinicDirectPhone}" style="direction:ltr;display:inline-block;font-weight:700;color:var(--secondary-burgundy);font-size:1.05rem;margin-top:2px;">
                  ${DOCTOR.clinicDirectPhone}
                </a>
              </div>
            </div>

            <div class="clinic-detail-item">
              <div class="detail-icon-box" aria-hidden="true">📞</div>
              <div class="detail-text">
                <strong>${isAr ? 'مركز الاتصال والحجز الموحد لمغربي' : 'Magrabi Central Call Center'}</strong>
                <a href="tel:${DOCTOR.callCenter}" style="direction:ltr;display:inline-block;font-weight:700;color:var(--secondary-burgundy);font-size:1.05rem;margin-top:2px;">
                  ${DOCTOR.callCenter} / ${DOCTOR.landline}
                </a>
              </div>
            </div>

            <div class="clinic-detail-item">
              <div class="detail-icon-box" aria-hidden="true">🕒</div>
              <div class="detail-text">
                <strong>${isAr ? 'مواعيد عمل العيادات' : 'Clinic Hours'}</strong>
                <span>${isAr ? 'السبت إلى الخميس: 9:00 ص – 1:00 م | 5:00 م – 9:30 م' : 'Saturday to Thursday: 9:00 AM – 1:00 PM | 5:00 PM – 9:30 PM'}</span>
              </div>
            </div>
          </div>

          <div class="clinic-cta-actions">
            <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-arrow-fill">
              <span class="btn-fill-effect" aria-hidden="true"></span>
              <span class="btn-label">${isAr ? 'حجز موعد عبر البوابة الرسمية لمغربي' : 'Book via Magrabi Official Portal'}</span>
              <span class="btn-arrow-wrap" aria-hidden="true">
                <svg class="btn-arrow-svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </span>
            </a>
            <a href="${getWhatsAppUrl()}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
              <span>${isAr ? 'تنسيق واستفسار عبر واتساب' : 'Inquire via WhatsApp'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

// --- FAQ SECTION ---
function renderFaq() {
  const faqs = [
    {
      qAr: 'ما هو التخصص الدقيق للدكتور معن بن عبدالله البري؟',
      qEn: "What are Dr. Maan Al Barry's medical subspecialties?",
      aAr: 'استشاري طب وجراحة العيون، متخصص في جراحة المياه البيضاء (الساد) وزراعة العدسات الذكية، عمليات تصحيح الإبصار بالليزر (الليزك والفيمتو ليزك والسطحي)، وأمراض القرنية والقرنية المخروطية وتثبيت القرنية CXL.',
      aEn: 'He is a Consultant Ophthalmologist specializing in cataract surgery, advanced IOL implantation, laser refractive surgery (LASIK, Femto-LASIK, PRK), and corneal diseases including keratoconus and corneal cross-linking (CXL).'
    },
    {
      qAr: 'أين تقع عيادة الدكتور معن بن عبدالله البري وكيف يمكن الوصول إليها؟',
      qEn: 'Where is Dr. Maan Al Barry clinic located?',
      aAr: 'يستقبل د. معن بن عبدالله البري مراجعيه في مستشفيات ومراكز مغربي للعيون والأذن بالمدينة المنورة، الواقع على طريق المطار. يمكنك فتح رابط خرائط جوجل المعتمد مباشرة عبر الموقع.',
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
        ${faqs.map((f, idx) => `
          <div class="faq-item" id="faq-${idx}">
            <button class="faq-question" onclick="toggleFaq(${idx})" aria-expanded="false" aria-controls="faq-answer-${idx}">
              <span>${currentLang === 'ar' ? f.qAr : f.qEn}</span>
              <span class="faq-icon">+</span>
            </button>
            <div class="faq-answer" id="faq-answer-${idx}" role="region">
              <p>${currentLang === 'ar' ? f.aAr : f.aEn}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}

// --- CTA BANNER ---
function renderCtaBanner() {
  const isAr = (currentLang === 'ar');
  return `
  <section class="section" style="padding-top: var(--space-4); padding-bottom: var(--space-14);">
    <div class="container">
      <div class="cta-banner fade-in">
        <div class="cta-banner-decor" aria-hidden="true"></div>
        <div class="cta-banner-content">
          <div class="cta-badge">
            <span class="badge-seal" aria-hidden="true">★</span>
            <span>${isAr ? 'حجز مباشر | رعاية استشارية متخصصة منذ 1998' : 'Direct Booking | Board-Certified Care Since 1998'}</span>
          </div>
          <h2>${isAr ? 'جاهز لحجز موعد كشف أو استشارة مع <span class="font-doctor-highlight">د. معن البري</span>؟' : 'Ready to Book an Examination or Consultation with Dr. Maan?'}</h2>
          <p>${isAr ? 'نرحب بك في مستشفيات ومراكز مغربي للعيون والأذن بالمدينة المنورة لإجراء تقييم شامل لقرنية وعينك واختيار الحل الجراحي أو نوع العدسة الأنسب لنمط حياتك بكل دقة وشفافية.' : 'We welcome you at Magrabi Health Eye & ENT Hospital in Madinah for a comprehensive anterior segment exam and individualized surgical guidance.'}</p>
          
          <div class="cta-buttons-group">
            <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-lg btn-arrow-fill" id="cta-primary-btn">
              <span class="btn-fill-effect" aria-hidden="true"></span>
              <span class="btn-label">${isAr ? 'احجز موعد كشف أو استشارة' : 'Book Clinic Appointment'}</span>
              <span class="btn-arrow-wrap" aria-hidden="true">
                <svg class="btn-arrow-svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </span>
            </a>
            <a href="${getWhatsAppUrl()}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-lg">
              <span>${isAr ? 'تنسيق واستفسار عبر واتساب' : 'Inquire via WhatsApp'}</span>
            </a>
            <a href="${DOCTOR.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-lg">
              <span>${isAr ? 'الاتجاهات وموقع المستشفى' : 'Hospital Location'}</span>
            </a>
          </div>

          <div class="cta-trust-row">
            <div class="cta-trust-item">
              <span class="trust-check">✓</span>
              <span>${isAr ? 'فحص تشخيصي مخصص' : 'Custom Diagnostic Profiling'}</span>
            </div>
            <div class="cta-trust-item">
              <span class="trust-check">✓</span>
              <span>${isAr ? 'استشارة استشارية مباشرة' : 'Direct Consultant Exam'}</span>
            </div>
            <div class="cta-trust-item">
              <span class="trust-check">✓</span>
              <span>${isAr ? 'مستشفى مغربي – طريق المطار' : 'Magrabi Hospital – Airport Rd'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

// --- FOOTER ---
function renderFooter() {
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3);">
            <div class="logo-icon" style="width:38px;height:38px;font-size:1.1rem;">م</div>
            <div>
              <strong class="${currentLang === 'ar' ? 'font-doctor-highlight' : ''}" style="color:var(--footer-title);font-size:1.15rem;display:block;">${currentLang === 'ar' ? DOCTOR.nameAr : DOCTOR.nameEn}</strong>
              <small style="color:var(--gold);font-size:0.75rem;">${currentLang === 'ar' ? DOCTOR.titleAr : DOCTOR.titleEn}</small>
            </div>
          </div>
          <p style="font-size:0.85rem;line-height:1.7;">
            ${currentLang === 'ar'
              ? 'الموقع الرسمي للتعريف بالخبرات الأكاديمية والسريرية للدكتور معن بن عبدالله البري، ونشر التثقيف الطبي الموثوق حول جراحات القرنية والماء الأبيض وتصحيح النظر.'
              : 'Official medical portal presenting Dr. Maan Al Barry academic appointments and evidence-based patient education.'}
          </p>
          <div class="footer-social-links">
            <a href="${DOCTOR.instagram}" target="_blank" rel="noopener noreferrer" class="social-link-btn instagram" aria-label="Instagram" title="Instagram - Dr. Maan Albarry">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="${DOCTOR.twitter}" target="_blank" rel="noopener noreferrer" class="social-link-btn twitter" aria-label="X (Twitter)" title="X (Twitter) - Dr. Maan Albarry">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="${DOCTOR.youtube}" target="_blank" rel="noopener noreferrer" class="social-link-btn youtube" aria-label="YouTube" title="YouTube - Dr. Maan Albarry">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="${getWhatsAppUrl()}" target="_blank" rel="noopener noreferrer" class="social-link-btn whatsapp" aria-label="WhatsApp" title="WhatsApp">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </a>
          </div>
        </div>

        <div class="footer-col">
          <h4>${currentLang === 'ar' ? 'روابط الوصول السريع' : 'Quick Navigation'}</h4>
          <a href="#home" onclick="scrollToSection('home');return false;">${currentLang === 'ar' ? 'الرئيسية' : 'Home'}</a>
          <a href="#profile" onclick="scrollToSection('profile');return false;">${currentLang === 'ar' ? 'السيرة المهنية' : 'Biography'}</a>
          <a href="#conferences" onclick="scrollToSection('conferences');return false;">${currentLang === 'ar' ? 'المشاركات العلمية والمؤتمرات الدولية' : 'Scientific Conferences'}</a>
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
          <a href="${DOCTOR.mapsUrl}" target="_blank" rel="noopener noreferrer">${currentLang === 'ar' ? 'مغربي طريق المطار (Google Maps)' : 'Airport Road, Madinah (Maps)'}</a>
          <a href="tel:${DOCTOR.clinicDirectPhone}" style="color:var(--gold-light);font-weight:700;">
            ${currentLang === 'ar' ? 'الرقم المباشر لعيادة د. معن: ' : 'Direct Clinic Phone: '}
            <span style="direction:ltr;display:inline-block;color:#fff;">${DOCTOR.clinicDirectPhone}</span>
          </a>
          <a href="tel:${DOCTOR.callCenter}">${currentLang === 'ar' ? 'الرقم الموحد: ' : 'Call Center: '}${DOCTOR.callCenter}</a>
          <a href="${getWhatsAppUrl()}" target="_blank" rel="noopener noreferrer">WhatsApp (${DOCTOR.clinicDirectPhone})</a>
          <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener noreferrer">${currentLang === 'ar' ? 'بوابة الحجز الإلكتروني' : 'Online Booking'}</a>
        </div>
      </div>

      <div class="medical-disclaimer" style="background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.1);color:#94A3B8;margin-bottom:var(--space-6);">
        <strong style="color:var(--gold);">${currentLang === 'ar' ? 'إخلاء مسؤولية طبي معتمد:' : 'Medical Disclaimer:'}</strong>
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
      <a href="tel:${DOCTOR.clinicDirectPhone}" class="btn btn-outline btn-sm" style="font-weight:600;">
        📞 ${DOCTOR.clinicDirectPhone}
      </a>
      <a href="${getWhatsAppUrl()}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
        WhatsApp
      </a>
      <a href="${DOCTOR.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
        Maps
      </a>
    </div>
  </div>`;
}

// --- GLOBAL ATTACHMENTS & INTERACTION DISPATCHERS ---
window.toggleLang = function () {
  currentLang = (currentLang === 'ar' ? 'en' : 'ar');
  currentQStep = 0;
  qAnswers = [];
  qCompleted = false;
  openArticleId = null;
  renderApp();
  window.scrollTo(0, 0);
};

// --- ACTIVE SECTION TRACKER & SCROLLSPY ---
const NAV_SECTION_IDS = [
  'home',
  'profile',
  'conferences',
  'specialties',
  'simulator',
  'cataracts',
  'education',
  'clinic'
];

let currentActiveNavId = 'home';
let isClickScrolling = false;
let clickScrollTimer = null;

window.setActiveNav = function (id) {
  if (!id) return;
  currentActiveNavId = id;

  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === `#${id}`) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });

  document.querySelectorAll('.mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === `#${id}`) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
};

window.scrollToSection = function (id) {
  const el = document.getElementById(id);
  if (el) {
    window.setActiveNav(id);
    isClickScrolling = true;
    clearTimeout(clickScrollTimer);
    clickScrollTimer = setTimeout(() => {
      isClickScrolling = false;
    }, 850);

    const headerOffset = document.getElementById('site-header')?.offsetHeight || 74;
    const elementPosition = el.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset - 12;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

function initScrollSpy() {
  function checkScroll() {
    if (isClickScrolling) return;

    const scrollY = window.scrollY;
    const headerHeight = document.getElementById('site-header')?.offsetHeight || 74;
    const scrollPos = scrollY + headerHeight + 120;

    // Check if bottom of the page is reached
    if ((window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 70)) {
      window.setActiveNav('clinic');
      return;
    }

    if (scrollY < 180) {
      window.setActiveNav('home');
      return;
    }

    let activeId = 'home';
    for (let i = 0; i < NAV_SECTION_IDS.length; i++) {
      const sectionId = NAV_SECTION_IDS[i];
      const el = document.getElementById(sectionId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= scrollPos) {
          activeId = sectionId;
        }
      }
    }

    window.setActiveNav(activeId);
  }

  if (window.__scrollSpyHandler) {
    window.removeEventListener('scroll', window.__scrollSpyHandler);
  }
  window.__scrollSpyHandler = () => {
    window.requestAnimationFrame(checkScroll);
  };
  window.addEventListener('scroll', window.__scrollSpyHandler, { passive: true });

  // Initial check
  checkScroll();
}

window.toggleMobileMenu = function () {
  const nav = document.getElementById('mobile-nav');
  if (nav) nav.classList.toggle('open');
};

window.closeMobileMenu = function () {
  const nav = document.getElementById('mobile-nav');
  if (nav) nav.classList.remove('open');
};

window.updateQuestionnaireUI = function () {
  const container = document.getElementById('questionnaire-card-container');
  if (container) {
    container.innerHTML = renderQuestionnaireCard();
  }
};

window.selectQOption = function (optIdx) {
  qAnswers[currentQStep] = optIdx;
  window.updateQuestionnaireUI();
  // Absolutely no scrolling or whole page re-rendering!
};

window.nextQStep = function () {
  if (qAnswers[currentQStep] !== undefined) {
    if (currentQStep < 3) {
      currentQStep++;
    } else {
      qCompleted = true;
    }
    window.updateQuestionnaireUI();
  }
};

window.prevQStep = function () {
  if (currentQStep > 0) {
    currentQStep--;
    window.updateQuestionnaireUI();
  }
};

window.restartQ = function () {
  currentQStep = 0;
  qAnswers = [];
  qCompleted = false;
  window.updateQuestionnaireUI();
};

window.toggleArticle = function (id) {
  openArticleId = (openArticleId === id ? null : id);
  const el = document.getElementById(`art-item-${id}`);
  if (el) el.classList.toggle('open');
};

window.toggleFaq = function (idx) {
  const item = document.getElementById(`faq-${idx}`);
  if (item) item.classList.toggle('open');
};

function observeIntersection() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function headerScrollShadow() {
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

// --- MASTER APPLICATION RENDERER ---
function renderApp() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = (currentLang === 'ar' ? 'rtl' : 'ltr');
  document.body.className = (currentLang === 'en' ? 'lang-en' : '');

  document.title = (currentLang === 'ar')
    ? 'د. معن بن عبدالله البري | استشاري طب وجراحة العيون (تخصص جراحات القرنية والماء الأبيض وتصحيح الإبصار) | المدينة المنورة'
    : 'Dr. Maan Al Barry | Consultant Ophthalmologist (Cornea, Cataract & Refractive Surgery) | Madinah';

  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    ${renderHeader()}
    <main>
      ${renderHero()}
      ${renderQualifications()}
      ${renderProfile()}
      ${renderSpecialties()}
      ${renderSimulator(currentLang)}
      ${renderIolGuide()}
      ${renderQuestionnaire()}
      ${renderEducation()}
      ${renderClinic()}
      ${renderFaq()}
      ${renderCtaBanner()}
    </main>
    ${renderFooter()}
    ${renderBookingBar()}
  `;

  applyTheme(currentTheme);
  observeIntersection();
  headerScrollShadow();
  initScrollSpy();
  window.setActiveNav(currentActiveNavId);

  const simHost = document.getElementById('simulator-host');
  if (simHost && window.VisionSim) {
    VisionSim.mount(simHost, { lang: currentLang });
  }
}

// Initialize on page load
renderApp();
