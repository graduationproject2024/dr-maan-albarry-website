import './style.css';

// ============================================================
// DR. MAAN AL BARRY — OFFICIAL MEDICAL PORTAL
// Clinical Prestige & Academic Ophthalmology
// ============================================================

// --- DATA LAYER (Verified Primary Source Facts) ---
export const DOCTOR = {
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
      'عضو الجمعية السعودية لطب وجراحة العيون (SOS)'
    ],
    en: [
      'Chief Medical Officer – Magrabi Health Eye & ENT, Madinah',
      'Chairman, Department of Ophthalmology – Taibah University',
      'Saudi Ophthalmological Society Representative – Madinah',
      'Scientific Council Member – Red Sea Ophthalmology Conference',
      'Former Secretary General – Saudi Ophthalmological Society',
      'Fellow of the Royal College of Surgeons – UK (FRCS)',
      'Member – American Academy of Ophthalmology (AAO)',
      'Member – Saudi Ophthalmological Society (SOS)'
    ]
  }
};

// --- CLINICALLY VERIFIED VISION SIMULATOR CONFIGURATION ---
// Based on BMC Ophthalmology 2019 Meta-Analysis & ESCRS 2024 Clinical Proceedings
const DEFOCUS_STEPS = [0, -0.5, -1, -1.5, -2, -2.5, -3, -3.5];

const LENSES = {
  monofocal: {
    id: 'monofocal',
    ar: 'أحادية البؤرة',
    en: 'Monofocal',
    va: [0, 0.1, 0.18, 0.32, 0.42, 0.5, 0.58, 0.66],
    halo: 0.1,
    noteAr: 'أوضح رؤية للبعيد؛ القريب والمتوسط يحتاجان نظارة غالباً. أقل معدل للهالات بين الأنواع.',
    noteEn: 'Sharpest at distance; intermediate/near usually need glasses. Lowest halo rate of the three.'
  },
  edof: {
    id: 'edof',
    ar: 'ممتدة المدى (EDOF)',
    en: 'Extended depth of focus',
    va: [0, 0.03, 0.08, 0.13, 0.19, 0.24, 0.38, 0.52],
    halo: 0.35,
    noteAr: 'انتقال سلس من البعيد إلى المتوسط، والقريب أقل من الثلاثية. الهالات أكثر من الأحادية.',
    noteEn: 'Smooth distance-to-intermediate range; near is weaker than trifocal. More halos than monofocal.'
  },
  trifocal: {
    id: 'trifocal',
    ar: 'ثلاثية البؤرة',
    en: 'Trifocal',
    va: [0, 0.08, 0.12, 0.1, 0.08, 0.1, 0.17, 0.32],
    halo: 0.8,
    noteAr: 'رؤية جيدة للبعيد والمتوسط والقريب؛ الهالات الليلية أكثر شيوعاً وتخف غالباً مع التكيف العصبي.',
    noteEn: 'Good distance, intermediate and near; night halos are more common and often fade with neuroadaptation.'
  },
  cataract: {
    id: 'cataract',
    ar: 'ساد (مثال متوسط)',
    en: 'Cataract (moderate example)',
    va: [0.5, 0.5, 0.52, 0.52, 0.55, 0.55, 0.58, 0.6],
    halo: 0,
    noteAr: 'مثال لساد متوسط (≈20/60). تختلف الشدة من مريض لآخر، والنظارة لا تعالج العتامة.',
    noteEn: 'A moderate example (~20/60). Severity varies, and glasses cannot fix lens opacity.'
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
  lens: 'trifocal',
  scene: 'night',
  D: 0,
  pos: 50,
  tab: 'sim',
  lang: 'ar'
};

const tText = (ar, en) => (simState.lang === 'ar' ? ar : en);

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

const BLUR_SCALE = 2.6;
const getBlurRadius = (logmar) => Math.max(0, 0.5 * BLUR_SCALE * (10 ** logmar - 1));

function drawRadialGlow(ctx, x, y, r, alpha, rgbColor) {
  const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
  grad.addColorStop(0, `rgba(${rgbColor},${alpha})`);
  grad.addColorStop(1, `rgba(${rgbColor},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
}

function drawHaloRing(ctx, x, y, r, spread, alpha, rgbColor) {
  const grad = ctx.createRadialGradient(x, y, Math.max(0, r - spread), x, y, r + spread);
  grad.addColorStop(0, `rgba(${rgbColor},0)`);
  grad.addColorStop(0.5, `rgba(${rgbColor},${alpha})`);
  grad.addColorStop(1, `rgba(${rgbColor},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(x - r - spread, y - r - spread, 2 * (r + spread), 2 * (r + spread));
}

function drawNightRoad(ctx, w, h) {
  const horizon = h * 0.47;
  const cx = w * 0.5;
  const lights = [];

  // Sky gradient
  let grad = ctx.createLinearGradient(0, 0, 0, horizon);
  grad.addColorStop(0, '#1b2a45');
  grad.addColorStop(1, '#4b5772');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Distant mountain/city silhouette
  ctx.fillStyle = '#2b3550';
  [[0, 0.34, 0.09], [0.09, 0.39, 0.07], [0.16, 0.33, 0.06], [0.7, 0.37, 0.08], [0.78, 0.32, 0.07], [0.86, 0.36, 0.14]].forEach(([x, y, sw]) => {
    ctx.fillRect(w * x, h * y, w * sw, horizon - h * y);
  });

  // Building window lights
  ctx.fillStyle = 'rgba(235,208,150,.5)';
  for (let i = 0; i < 60; i++) {
    const rx = [0.01, 0.1, 0.71, 0.88][i % 4];
    ctx.fillRect(w * (rx + (i % 8) * 0.007), h * (0.37 + 0.014 * ((i * 5) % 7)), 4, 5);
  }

  // Highway tarmac perspective
  grad = ctx.createLinearGradient(0, horizon, 0, h);
  grad.addColorStop(0, '#3a414d');
  grad.addColorStop(1, '#242932');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(cx - 14, horizon);
  ctx.lineTo(cx + 14, horizon);
  ctx.lineTo(w * 1.02, h);
  ctx.lineTo(-w * 0.02, h);
  ctx.fill();

  // Highway dashed lanes
  ctx.fillStyle = '#98a0a8';
  for (let i = 0; i < 7; i++) {
    const a1 = (i / 7) ** 2.2;
    const a2 = ((i + 0.55) / 7) ** 2.2;
    const y1 = horizon + (h - horizon) * a1;
    const y2 = horizon + (h - horizon) * a2;
    ctx.beginPath();
    ctx.moveTo(cx - 1 - a1 * 7, y1);
    ctx.lineTo(cx + 1 + a1 * 7, y1);
    ctx.lineTo(cx + 1 + a2 * 7, y2);
    ctx.lineTo(cx - 1 - a2 * 7, y2);
    ctx.fill();
  }

  // Overhead gantry sign for Madinah
  ctx.fillStyle = '#2f3947';
  ctx.fillRect(w * 0.5 - 2, h * 0.26, 4, horizon - h * 0.26);
  ctx.fillStyle = '#17724b';
  ctx.fillRect(w * 0.4, h * 0.12, w * 0.2, h * 0.14);
  ctx.strokeStyle = '#e8efe9';
  ctx.lineWidth = 2;
  ctx.strokeRect(w * 0.4 + 3, h * 0.12 + 3, w * 0.2 - 6, h * 0.14 - 6);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.direction = 'rtl';
  ctx.font = '600 20px "IBM Plex Sans Arabic", sans-serif';
  ctx.fillText('المدينة المنورة', w * 0.5, h * 0.19);
  ctx.direction = 'ltr';
  ctx.font = '600 14px Inter, sans-serif';
  ctx.fillText('Madinah  ·  12 km', w * 0.5, h * 0.235);

  const addLight = (lx, ly, lr, rgb, scale) => {
    lights.push({ x: lx, y: ly, r: lr, col: rgb, s: scale });
    drawRadialGlow(ctx, lx, ly, lr * 1.8, 0.4 * scale, rgb);
    ctx.fillStyle = `rgb(${rgb})`;
    ctx.beginPath();
    ctx.arc(lx, ly, lr * 0.5, 0, Math.PI * 2);
    ctx.fill();
  };

  // Streetlights
  for (let i = 0; i < 5; i++) {
    const scale = 1 - (i / 5) * 0.75;
    const ly = horizon - (horizon - h * 0.2) * scale;
    const lx1 = cx - (cx - w * 0.1) * scale;
    const lx2 = cx + (w * 0.9 - cx) * scale;
    const poleH = (h - horizon) * 0.5 * scale;
    ctx.fillStyle = '#2c3542';
    [lx1, lx2].forEach(px => ctx.fillRect(px - 1.5 * scale, ly, 3 * scale, poleH));
    addLight(lx1, ly, 3.6 * scale + 1.2, '255,222,170', 0.8);
    addLight(lx2, ly, 3.6 * scale + 1.2, '255,222,170', 0.8);
  }

  // Oncoming car headlights and taillights
  const addCar = (cx1, cy1, cw) => {
    ctx.fillStyle = '#1a202b';
    ctx.fillRect(cx1 - cw / 2, cy1 - cw * 0.32, cw, cw * 0.4);
    ctx.fillStyle = '#2a3240';
    ctx.fillRect(cx1 - cw * 0.38, cy1 - cw * 0.52, cw * 0.76, cw * 0.22);
    addLight(cx1 - cw * 0.36, cy1 - cw * 0.1, cw * 0.065, '255,70,60', 0.9);
    addLight(cx1 + cw * 0.36, cy1 - cw * 0.1, cw * 0.065, '255,70,60', 0.9);
  };

  addCar(w * 0.47, h * 0.56, 60);
  addCar(w * 0.58, h * 0.58, 86);
  addCar(w * 0.37, h * 0.66, 128);

  [[0.2, 0.6, 6], [0.3, 0.56, 4.2]].forEach(([px, py, pr]) => {
    px *= w;
    py *= h;
    addLight(px, py, pr, '255,246,225', 0.9);
    addLight(px + pr * 5, py, pr, '255,246,225', 0.9);
  });

  return lights;
}

function drawHalosAndGlare(ctx, lights, lensKey) {
  ctx.globalCompositeOperation = 'lighter';
  for (let lgt of lights) {
    const lr = lgt.r;
    const ls = lgt.s;
    if (lensKey === 'cataract') {
      drawRadialGlow(ctx, lgt.x, lgt.y, lr * 12, 0.5 * ls, lgt.col);
      ctx.lineWidth = 1.2;
      for (let k = 0; k < 8; k++) {
        const rad = k * 0.785;
        const x2 = lgt.x + Math.cos(rad) * lr * 16;
        const y2 = lgt.y + Math.sin(rad) * lr * 16;
        const rayGrad = ctx.createLinearGradient(lgt.x, lgt.y, x2, y2);
        rayGrad.addColorStop(0, `rgba(${lgt.col},.45)`);
        rayGrad.addColorStop(1, `rgba(${lgt.col},0)`);
        ctx.strokeStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(lgt.x, lgt.y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    } else {
      const hScale = LENSES[lensKey].halo;
      drawRadialGlow(ctx, lgt.x, lgt.y, lr * 3, 0.18 + 0.2 * hScale, lgt.col);
      if (hScale > 0.3) {
        drawHaloRing(ctx, lgt.x, lgt.y, lr * 5, lr * 1.8, 0.26 * hScale * ls, lgt.col);
      }
      if (hScale > 0.6) {
        drawHaloRing(ctx, lgt.x, lgt.y, lr * 8.5, lr * 2.4, 0.14 * hScale * ls, lgt.col);
      }
    }
  }
  ctx.globalCompositeOperation = 'source-over';
}

function drawPrescription(ctx, w, h, diopter) {
  ctx.fillStyle = '#e9e6df';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#fbfaf6';
  ctx.fillRect(w * 0.12, h * 0.08, w * 0.76, h * 0.84);
  ctx.fillStyle = '#1d2630';
  ctx.textAlign = 'center';
  ctx.direction = 'rtl';

  const lines = [
    [0.5, 'قطرة مرطبة بدون مواد حافظة'],
    [0.4, 'قطرة واحدة في كل عين'],
    [0.4, 'أربع مرات يومياً بعد الأكل'],
    [0.3, 'تجنب فرك العين أو إدخال الماء'],
    [0.2, 'المراجعة بعد أسبوع من تاريخ العملية'],
    [0.1, 'يرجى إحضار هذه الورقة وقطرات العين معك'],
    [0, 'مستشفى مغربي للعيون · المدينة المنورة']
  ];

  let curY = h * 0.13;
  lines.forEach(([logmarVal, text]) => {
    const fontSize = 5 * (10 ** logmarVal) * BLUR_SCALE;
    ctx.font = `500 ${fontSize / 0.68}px "IBM Plex Sans Arabic", Alexandria, sans-serif`;
    ctx.fillText(text, w * 0.5, curY + fontSize);
    ctx.direction = 'ltr';
    ctx.font = '500 11px Inter, sans-serif';
    ctx.fillStyle = '#7a838c';
    ctx.textAlign = 'start';
    ctx.fillText('20/' + Math.round(20 * (10 ** logmarVal)), w * 0.14, curY + fontSize);
    ctx.textAlign = 'center';
    ctx.direction = 'rtl';
    ctx.fillStyle = '#1d2630';
    curY += fontSize * 1.45 + 6;
  });
}

function renderCanvas(canvas, lensKey) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const diopter = (simState.scene === 'night' ? 0 : simState.D);
  const blurVal = getBlurRadius(getAcuity(lensKey, diopter));
  const isCataract = (lensKey === 'cataract');

  if (simState.scene === 'night') {
    const lights = drawNightRoad(ctx, w, h);
    drawHalosAndGlare(ctx, lights, lensKey);
    if (isCataract) {
      ctx.fillStyle = 'rgba(205,190,150,.12)';
      ctx.fillRect(0, 0, w, h);
    }
  } else {
    drawPrescription(ctx, w, h, diopter);
    if (isCataract) {
      ctx.fillStyle = 'rgba(205,190,150,.18)';
      ctx.fillRect(0, 0, w, h);
    }
  }

  canvas.style.filter = `blur(${blurVal.toFixed(2)}px)` + (isCataract ? ' contrast(.78) sepia(.35) brightness(.95)' : '');
}

function renderDefocusCurveSvg() {
  const mapX = d => 70 + (-d / 3.5) * 600;
  const mapY = logmar => 26 + (logmar / 0.8) * 230;

  let svg = `<svg viewBox="0 0 720 300" class="vs-svg" role="img" aria-label="defocus curve">`;
  svg += `<rect x="70" y="${mapY(0)}" width="600" height="${mapY(0.2) - mapY(0)}" fill="var(--vs-band)"/>`;

  [[0, '20/20'], [0.1, '20/25'], [0.2, '20/32'], [0.3, '20/40'], [0.5, '20/63'], [0.7, '20/100']].forEach(([lm, sn]) => {
    svg += `<line x1="70" x2="670" y1="${mapY(lm)}" y2="${mapY(lm)}" stroke="var(--vs-grid)"/>`;
    svg += `<text x="62" y="${mapY(lm) + 4}" text-anchor="end" class="vs-t">${sn}</text>`;
  });

  DISTANCE_STEPS.forEach(([d, ar, en]) => {
    svg += `<line x1="${mapX(d)}" x2="${mapX(d)}" y1="26" y2="256" stroke="var(--vs-grid)" stroke-dasharray="3 4"/>`;
    svg += `<text x="${mapX(d)}" y="274" text-anchor="middle" class="vs-t">\u200E${d.toFixed(1).replace('-', '−')} D</text>`;
    svg += `<text x="${mapX(d)}" y="290" text-anchor="middle" class="vs-t2">${tText(ar, en)}</text>`;
  });

  const colors = { monofocal: '#5b7f95', edof: '#3f8f87', trifocal: '#8a6a3d', cataract: '#a35a52' };
  Object.keys(LENSES).forEach(k => {
    const isActive = (k === simState.lens);
    const pts = DEFOCUS_STEPS.map((step, idx) => `${mapX(step)},${mapY(LENSES[k].va[idx])}`).join(' ');
    svg += `<polyline points="${pts}" fill="none" stroke="${colors[k]}" stroke-width="${isActive ? 3.2 : 1.4}" opacity="${isActive ? 1 : 0.35}" ${k === 'cataract' ? 'stroke-dasharray="5 4"' : ''}/>`;
  });

  const curX = mapX(simState.D);
  const curY = mapY(getAcuity(simState.lens, simState.D));
  svg += `<line x1="${curX}" x2="${curX}" y1="26" y2="256" stroke="var(--vs-ink)" opacity=".5"/>`;
  svg += `<circle cx="${curX}" cy="${curY}" r="6" fill="var(--vs-surface)" stroke="var(--vs-ink)" stroke-width="2.5"/>`;
  svg += `</svg>`;

  return svg;
}

function renderSimulator(lang) {
  simState.lang = lang;
  return `
  <section class="section vs-section" id="simulator">
    <div class="container">
      <div class="section-header">
        <div class="section-label">${tText('أداة تثقيفية', 'Educational tool')}</div>
        <h2>${tText('كيف قد تبدو رؤيتك بعد زراعة العدسة؟', 'How might your vision look after lens implantation?')}</h2>
        <p>${tText('محاكاة مبنية على متوسطات دراسات منشورة لمنحنيات حدة الإبصار، وليست تنبؤاً بنتيجتك الشخصية.', 'A simulation based on averages from published defocus-curve studies, not a prediction of your personal result.')}</p>
      </div>

      <div class="vs-card" id="vs-root">
        <div class="vs-bar">
          <div class="vs-seg" id="vs-tabs">
            <button data-tab="sim">${tText('المحاكاة', 'Simulation')}</button>
            <button data-tab="curve">${tText('منحنى حدة الإبصار', 'Acuity curve')}</button>
          </div>
          <div class="vs-seg" id="vs-scenes">
            <button data-scene="night">${tText('قيادة ليلاً', 'Night driving')}</button>
            <button data-scene="read">${tText('القراءة', 'Reading')}</button>
          </div>
        </div>

        <div class="vs-bar vs-lens" id="vs-lens">
          ${Object.keys(LENSES).map(k => `<button data-lens="${k}">${tText(LENSES[k].ar, LENSES[k].en)}</button>`).join('')}
        </div>

        <div id="vs-sim">
          <div class="vs-view" dir="ltr">
            <canvas id="vs-b" width="960" height="480"></canvas>
            <canvas id="vs-a" width="960" height="480"></canvas>
            <input type="range" id="vs-slider" min="0" max="100" value="50" aria-label="${tText('مقارنة قبل وبعد', 'Before / after')}">
            <div class="vs-line" id="vs-line"><span></span></div>
            <em class="vs-tag l" id="vs-tl"></em>
            <em class="vs-tag r">${tText('ساد غير معالج', 'Untreated cataract')}</em>
          </div>
          <p class="vs-hint">${tText('اسحب الخط للمقارنة بين الساد والعدسة المختارة', 'Drag the line to compare cataract with the selected lens')}</p>
        </div>

        <div id="vs-curve" hidden></div>

        <div class="vs-dist" id="vs-dist" role="group" aria-label="${tText('المسافة', 'Distance')}">
          ${DISTANCE_STEPS.map(([d, ar, en]) => `<button data-d="${d}">${tText(ar, en)}</button>`).join('')}
        </div>

        <div class="vs-metrics" id="vs-metrics"></div>

        <p class="vs-note">${tText('تفترض المحاكاة عينين بقوة بصرية مستهدفة قريبة من الصفر، وإضاءة جيدة للقراءة. حدة الإبصار بالمتوسط ≤ 0.2 logMAR تُعد رؤية وظيفية. النتيجة الفعلية تعتمد على قياسات عينك وفحص الطبيب. المصادر: مراجعة منهجية BMC Ophthalmology 2019، وملخصات مؤتمر ESCRS 2024.', 'Assumes near-plano targets and good reading light. Mean acuity ≤ 0.2 logMAR is treated as functional. Your actual result depends on your own eye measurements and your surgeon’s exam. Sources: BMC Ophthalmology 2019 meta-analysis; ESCRS 2024 abstracts.')}</p>
      </div>
    </div>
  </section>`;
}

function updateSimulatorDom() {
  const root = document.getElementById('vs-root');
  if (!root) return;

  root.querySelectorAll('[data-tab]').forEach(btn => btn.classList.toggle('on', btn.dataset.tab === simState.tab));
  root.querySelectorAll('[data-scene]').forEach(btn => btn.classList.toggle('on', btn.dataset.scene === simState.scene));
  root.querySelectorAll('[data-lens]').forEach(btn => btn.classList.toggle('on', btn.dataset.lens === simState.lens));
  root.querySelectorAll('[data-d]').forEach(btn => {
    btn.classList.toggle('on', +btn.dataset.d === simState.D);
    btn.disabled = false;
  });

  const scenesEl = root.querySelector('#vs-scenes');
  if (scenesEl) scenesEl.hidden = (simState.tab !== 'sim');

  const simEl = root.querySelector('#vs-sim');
  if (simEl) simEl.hidden = (simState.tab !== 'sim');

  const distEl = root.querySelector('#vs-dist');
  if (distEl) distEl.hidden = (simState.tab !== 'curve' && simState.scene !== 'read');

  const curveEl = root.querySelector('#vs-curve');
  if (curveEl) {
    curveEl.hidden = (simState.tab !== 'curve');
    if (simState.tab === 'curve') {
      curveEl.innerHTML = renderDefocusCurveSvg();
    }
  }

  if (simState.tab === 'sim') {
    const canvasA = root.querySelector('#vs-a');
    const canvasB = root.querySelector('#vs-b');
    renderCanvas(canvasA, simState.lens);
    renderCanvas(canvasB, 'cataract');
    if (canvasA) canvasA.style.clipPath = `inset(0 ${100 - simState.pos}% 0 0)`;
    const lineEl = root.querySelector('#vs-line');
    if (lineEl) lineEl.style.left = `${simState.pos}%`;
    const tagL = root.querySelector('#vs-tl');
    if (tagL) tagL.textContent = tText(LENSES[simState.lens].ar, LENSES[simState.lens].en);
  }

  const curD = (simState.scene === 'night' && simState.tab === 'sim' ? 0 : simState.D);
  const curAcuity = getAcuity(simState.lens, curD);
  const nearestFunc = getNearestFunctional(simState.lens);
  const isFunc = (curAcuity <= 0.2);

  const metricsEl = root.querySelector('#vs-metrics');
  if (metricsEl) {
    metricsEl.innerHTML = `
      <div>
        <small>${tText('حدة الإبصار المتوقعة', 'Expected acuity')}</small>
        <strong>${toSnellen(curAcuity)}</strong>
        <span>${curAcuity.toFixed(2)} logMAR</span>
      </div>
      <div>
        <small>${tText('عند هذه المسافة', 'At this distance')}</small>
        <strong class="${isFunc ? 'ok' : 'warn'}">
          ${isFunc ? tText('رؤية وظيفية غالباً بدون نظارة', 'Usually functional without glasses') : tText('غالباً تلزم نظارة', 'Glasses usually needed')}
        </strong>
      </div>
      <div>
        <small>${tText('أقرب مسافة وظيفية', 'Nearest functional distance')}</small>
        <strong>
          ${simState.lens === 'cataract' ? tText('لا يوجد', 'None') : (nearestFunc < 0.1 ? tText('البعيد فقط', 'Far only') : `${Math.round(100 / nearestFunc)} ${tText('سم', 'cm')}`)}
        </strong>
      </div>
      <p>${tText(LENSES[simState.lens].noteAr, LENSES[simState.lens].noteEn)}</p>
    `;
  }
}

function initSimulatorEvents(lang) {
  simState.lang = lang;
  const root = document.getElementById('vs-root');
  if (!root) return;

  root.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn || btn.disabled) return;

    if (btn.dataset.tab) simState.tab = btn.dataset.tab;
    if (btn.dataset.scene) simState.scene = btn.dataset.scene;
    if (btn.dataset.lens) simState.lens = btn.dataset.lens;
    if (btn.dataset.d !== undefined) simState.D = +btn.dataset.d;

    if (btn.dataset.scene && simState.scene === 'read' && simState.D === 0) {
      simState.D = -2.5;
    }

    updateSimulatorDom();
  });

  const slider = root.querySelector('#vs-slider');
  if (slider) {
    slider.addEventListener('input', (e) => {
      simState.pos = +e.target.value;
      updateSimulatorDom();
    });
  }

  updateSimulatorDom();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateSimulatorDom);
  }
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

  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    const isDark = (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches));
    btn.innerHTML = (theme === 'system' ? '◐' : isDark ? 'ليلي' : 'نهاري');
    btn.setAttribute('title', theme === 'system' ? 'الوضع التلقائي (حسب النظام)' : isDark ? 'الوضع الليلي' : 'الوضع النهاري');
  }
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (currentTheme === 'system') applyTheme('system');
});

window.cycleTheme = function () {
  const next = (currentTheme === 'system' ? 'light' : currentTheme === 'light' ? 'dark' : 'system');
  applyTheme(next);
};

function getWhatsAppUrl(msg) {
  const text = encodeURIComponent(msg || (currentLang === 'ar'
    ? 'مرحباً، أود الاستفسار عن حجز موعد استشارة مع د. معن عبدالله البري في مستشفى مغربي المدينة المنورة.'
    : 'Hello, I would like to inquire about booking a consultation with Dr. Maan Al Barry at Magrabi Madinah.'));
  return `https://wa.me/${DOCTOR.whatsapp}?text=${text}`;
}

// --- HEADER ---
function renderHeader() {
  const isDark = (currentTheme === 'dark' || (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches));
  const themeLabel = (currentTheme === 'system' ? '◐' : isDark ? 'ليلي' : 'نهاري');

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
          <button id="theme-toggle-btn" class="theme-switch-btn" onclick="cycleTheme()" aria-label="Toggle Theme">${themeLabel}</button>
          <button class="lang-switch" onclick="toggleLang()" aria-label="Switch Language">${currentLang === 'ar' ? 'English' : 'عربي'}</button>
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
      <a href="${DOCTOR.mapsUrl}" target="_blank" rel="noopener noreferrer">${currentLang === 'ar' ? 'موقع المستشفى (خرائط جوجل)' : 'Hospital Google Maps'}</a>
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
              <span>${currentLang === 'ar' ? 'مستشفيات مغربي – المدينة المنورة' : 'Magrabi Hospital – Madinah'}</span>
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
          <img src="./images/dr-maan-portrait.png" alt="${currentLang === 'ar' ? DOCTOR.nameAr : DOCTOR.nameEn}" class="doctor-photo" loading="eager" onerror="this.src='./images/doctor-portrait.jpg'">
          <div class="image-accent">
            <div class="accent-title">${currentLang === 'ar' ? 'العيادة التخصصية' : 'Clinical Practice'}</div>
            <div class="accent-value">${currentLang === 'ar' ? 'مغربي — طريق المطار' : 'Magrabi — Airport Road'}</div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

// --- PROFILE & SCIENTIFIC PARTICIPATION ---
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
          <img src="./images/doctor-portrait.jpg" alt="${DOCTOR.nameAr}" class="profile-media-img" loading="lazy">
          <div class="credentials-chips">
            <span class="chip chip-gold">${currentLang === 'ar' ? 'زميل كلية الجراحين الملكية – بريطانيا (FRCS)' : 'Fellow of Royal College of Surgeons (FRCS UK)'}</span>
            <span class="chip">${currentLang === 'ar' ? 'رئيس قسم طب وجراحة العيون – جامعة طيبة' : 'Chair of Ophthalmology – Taibah University'}</span>
            <span class="chip">${currentLang === 'ar' ? 'المدير الطبي التنفيذي – مغربي المدينة' : 'Executive Medical Director – Magrabi Madinah'}</span>
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
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Scientific participation & Conferences -->
      <div class="sci-head fade-in">
        <h3>${currentLang === 'ar' ? 'المشاركات العلمية والمؤتمرات الدولية' : 'Scientific Participation & Conferences'}</h3>
        <p>${currentLang === 'ar' ? 'حضور وتمثيل علمي في مؤتمرات طب العيون' : 'Representing ophthalmology at national and international meetings'}</p>
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

// --- IOL COMPARISON GUIDE ---
function renderIolGuide() {
  const isAr = (currentLang === 'ar');
  const iolCards = [
    {
      n: isAr ? 'ثلاثية البؤرة' : 'Trifocal',
      sub: isAr ? 'للاستغناء عن النظارة قدر الإمكان' : 'For maximum spectacle independence',
      d: [4, isAr ? 'ممتازة' : 'Excellent'],
      m: [4, isAr ? 'جيدة جداً' : 'Very good'],
      nr: [4, isAr ? 'جيدة غالباً بدون نظارة' : 'Good, often without glasses'],
      h: [3, isAr ? 'أكثر شيوعاً، وتخف غالباً مع التكيف العصبي' : 'More common; often fade with neuroadaptation'],
      g: isAr ? 'قليلة لدى أغلب المرضى، وتختلف من حالة لأخرى' : 'Uncommon for most patients; varies'
    },
    {
      n: isAr ? 'ممتدة المدى (EDOF)' : 'Extended depth of focus (EDOF)',
      sub: isAr ? 'للقيادة الليلية والعمل على الشاشات' : 'For night driving and screen work',
      d: [4, isAr ? 'ممتازة' : 'Excellent'],
      m: [4, isAr ? 'جيدة جداً' : 'Very good'],
      nr: [2, isAr ? 'محدودة للخط الدقيق' : 'Limited for fine print'],
      h: [2, isAr ? 'أقل من الثلاثية، وأكثر من الأحادية' : 'Fewer than trifocal, more than monofocal'],
      g: isAr ? 'غالباً للقراءة الدقيقة فقط' : 'Mostly for fine reading only'
    },
    {
      n: isAr ? 'أحادية البؤرة' : 'Monofocal',
      sub: isAr ? 'لأعلى نقاء للبعيد مع نظارة للقريب' : 'Sharpest distance, glasses for near',
      d: [4, isAr ? 'ممتازة' : 'Excellent'],
      m: [2, isAr ? 'تحتاج نظارة غالباً' : 'Glasses usually needed'],
      nr: [1, isAr ? 'تحتاج نظارة قراءة' : 'Reading glasses needed'],
      h: [1, isAr ? 'الأقل بين الأنواع' : 'Lowest of the three'],
      g: isAr ? 'دائمة للقراءة والكمبيوتر' : 'Permanent for reading and computer'
    }
  ];

  const renderPips = (score, cls) => `
    <span class="pips ${cls}" role="img" aria-label="${score}/4">
      ${[1, 2, 3, 4].map(k => `<i class="${k <= score ? 'on' : ''}"></i>`).join('')}
    </span>
  `;

  const renderRow = (label, tuple, cls) => `
    <div class="iol-row">
      <b>${label}</b>
      ${renderPips(tuple[0], cls)}
      <small>${tuple[1]}</small>
    </div>
  `;

  return `
  <section class="section section-alt" id="cataracts">
    <div class="container">
      <div class="section-header fade-in">
        <div class="section-label">${isAr ? 'دليل اختيار العدسة' : 'Lens selection guide'}</div>
        <h2>${isAr ? 'مقارنة العدسات الشائعة داخل العين' : 'Comparing common intraocular lenses'}</h2>
        <p>${isAr ? 'ملخص مبسّط للفروق بين الأنواع الثلاثة لمساعدتك على الحوار مع طبيبك.' : 'A simple summary of the three main types, to support your conversation with your surgeon.'}</p>
      </div>

      <div class="iol-grid fade-in">
        ${iolCards.map(c => `
          <article class="iol-card">
            <header>
              <h3>${c.n}</h3>
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
        <span>${isAr ? 'الأخضر: كلما زادت الدرجات كان الأداء أفضل' : 'Green: more bars means better performance'}</span>
        <span>${isAr ? 'البرتقالي: كلما زادت الدرجات زاد تكرار الهالات' : 'Amber: more bars means more frequent halos'}</span>
      </p>

      <div class="medical-disclaimer fade-in">
        <strong>${isAr ? 'تنبيه سريري:' : 'Clinical Note:'}</strong>
        ${isAr
          ? 'لا توجد عدسة هي الأفضل للجميع. يعتمد الاختيار على فحص القرنية والشبكية وقياسات العين ونمط حياتك، ويحدده الطبيب بعد الفحص.'
          : 'No single lens is best for everyone. The choice depends on your corneal and retinal exam, eye measurements and lifestyle, and is made with your surgeon after examination.'}
      </div>
    </div>
  </section>`;
}

// --- QUESTIONNAIRE SECTION ---
function renderQuestionnaire() {
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
    <section class="section" id="questionnaire">
      <div class="container">
        <div class="section-header fade-in">
          <div class="section-label">${currentLang === 'ar' ? 'تقرير نمط الحياة البصري الاسترشادي' : 'Visual Lifestyle Report'}</div>
          <h2>${currentLang === 'ar' ? 'النقاط المقترحة لمناقشتها مع الدكتور معن البري' : 'Discussion Points for Your Ophthalmic Consultation'}</h2>
        </div>
        <div class="questionnaire fade-in">
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
      </div>
    </section>`;
  }

  const cur = content.steps[currentQStep];
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
        <p>${currentLang === 'ar' ? 'مقالات وأدلة سريرية محكمة أعدت بإشراف الدكتور معن البري لتزويدك بالحقائق الطبية الدقيقة.' : 'Peer-reviewed guides developed under Dr. Maan Al Barry’s clinical oversight.'}</p>
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
          <h4 style="font-size:1.15rem;color:var(--text-primary);margin-bottom:var(--space-1);">
            ${currentLang === 'ar' ? DOCTOR.clinicAr : DOCTOR.clinicEn}
          </h4>
          <p style="font-size:0.88rem;color:var(--text-secondary);max-width:320px;margin-bottom:var(--space-4);">
            ${currentLang === 'ar' ? DOCTOR.addressAr : DOCTOR.addressEn}
          </p>
          <a href="${DOCTOR.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            ${currentLang === 'ar' ? 'فتح الاتجاهات عبر خرائط جوجل (Google Maps)' : 'Open in Google Maps'}
          </a>
          <span style="font-size:0.75rem;color:var(--text-muted);margin-top:8px;">
            ${currentLang === 'ar' ? 'رابط الوصول المباشر المعتمد للمستشفى' : 'Official Verified Hospital Destination Link'}
          </span>
        </div>

        <div class="clinic-info">
          <h3>${currentLang === 'ar' ? 'بيانات التواصل وأوقات الزيارة' : 'Clinic Contact & Practice Schedule'}</h3>

          <div class="clinic-detail-item">
            <div class="detail-text">
              <strong>${currentLang === 'ar' ? 'الموقع والصرح الطبي' : 'Medical Hospital'}</strong>
              <span>${currentLang === 'ar' ? DOCTOR.clinicAr : DOCTOR.clinicEn}</span>
            </div>
          </div>

          <div class="clinic-detail-item">
            <div class="detail-text">
              <strong>${currentLang === 'ar' ? 'مركز الاتصال والحجز الموحد' : 'Central Call Center'}</strong>
              <a href="tel:${DOCTOR.callCenter}" style="direction:ltr;display:inline-block;font-weight:700;color:var(--secondary-burgundy);">
                ${DOCTOR.callCenter} / ${DOCTOR.landline}
              </a>
            </div>
          </div>

          <div class="clinic-detail-item">
            <div class="detail-text">
              <strong>${currentLang === 'ar' ? 'مواعيد عمل العيادات' : 'Clinic Hours'}</strong>
              <span>${currentLang === 'ar' ? 'السبت إلى الخميس: 9:00 ص – 1:00 م | 5:00 م – 9:30 م' : 'Saturday to Thursday: 9:00 AM – 1:00 PM | 5:00 PM – 9:30 PM'}</span>
            </div>
          </div>

          <div style="display:flex;flex-direction:column;gap:var(--space-3);margin-top:var(--space-6);">
            <a href="${DOCTOR.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              ${currentLang === 'ar' ? 'حجز موعد عبر البوابة الرسمية لمغربي' : 'Book via Magrabi Official Portal'}
            </a>
            <a href="${getWhatsAppUrl()}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
              ${currentLang === 'ar' ? 'تنسيق واستفسار عبر واتساب' : 'Inquire via WhatsApp'}
            </a>
            <a href="${DOCTOR.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
              ${currentLang === 'ar' ? 'الاتجاهات الجغرافية (Google Maps)' : 'Hospital Directions (Google Maps)'}
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
      qAr: 'أين تقع عيادة الدكتور معن البري وكيف يمكن الوصول إليها؟',
      qEn: 'Where is Dr. Maan Al Barry clinic located?',
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
          <a href="${getWhatsAppUrl()}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-lg">
            ${currentLang === 'ar' ? 'تنسيق عبر واتساب' : 'Inquire via WhatsApp'}
          </a>
          <a href="${DOCTOR.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-lg" style="color:#FFFFFF;border-color:rgba(255,255,255,0.4);">
            ${currentLang === 'ar' ? 'موقع المستشفى بالمدينة' : 'Hospital Location'}
          </a>
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
              <strong style="color:var(--footer-title);font-size:1.05rem;display:block;">${currentLang === 'ar' ? DOCTOR.nameAr : DOCTOR.nameEn}</strong>
              <small style="color:var(--gold);font-size:0.75rem;">${currentLang === 'ar' ? DOCTOR.titleAr : DOCTOR.titleEn}</small>
            </div>
          </div>
          <p style="font-size:0.85rem;line-height:1.7;">
            ${currentLang === 'ar'
              ? 'الموقع الرسمي للتعريف بالخبرات الأكاديمية والسريرية للدكتور معن البري، ونشر التثقيف الطبي الموثوق حول جراحات المياه البيضاء، القرنية، وتصحيح النظر.'
              : 'Official medical portal presenting Dr. Maan Al Barry academic appointments and evidence-based patient education.'}
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
          <a href="${DOCTOR.mapsUrl}" target="_blank" rel="noopener noreferrer">${currentLang === 'ar' ? 'مغربي طريق المطار (Google Maps)' : 'Airport Road, Madinah (Maps)'}</a>
          <a href="tel:${DOCTOR.callCenter}">${currentLang === 'ar' ? 'الرقم الموحد: ' : 'Call Center: '}${DOCTOR.callCenter}</a>
          <a href="${getWhatsAppUrl()}" target="_blank" rel="noopener noreferrer">WhatsApp (${DOCTOR.whatsapp})</a>
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

window.scrollToSection = function (id) {
  const el = document.getElementById(id);
  if (el) {
    const headerOffset = document.getElementById('site-header')?.offsetHeight || 74;
    const elementPosition = el.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset - 12;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

window.toggleMobileMenu = function () {
  const nav = document.getElementById('mobile-nav');
  if (nav) nav.classList.toggle('open');
};

window.closeMobileMenu = function () {
  const nav = document.getElementById('mobile-nav');
  if (nav) nav.classList.remove('open');
};

window.selectQOption = function (optIdx) {
  qAnswers[currentQStep] = optIdx;
  renderApp();
  scrollToSection('questionnaire');
};

window.nextQStep = function () {
  if (qAnswers[currentQStep] !== undefined) {
    if (currentQStep < 3) {
      currentQStep++;
    } else {
      qCompleted = true;
    }
    renderApp();
    scrollToSection('questionnaire');
  }
};

window.prevQStep = function () {
  if (currentQStep > 0) {
    currentQStep--;
    renderApp();
    scrollToSection('questionnaire');
  }
};

window.restartQ = function () {
  currentQStep = 0;
  qAnswers = [];
  qCompleted = false;
  renderApp();
  scrollToSection('questionnaire');
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

  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    ${renderHeader()}
    <main>
      ${renderHero()}
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
  initSimulatorEvents(currentLang);
}

// Initialize on page load
renderApp();
