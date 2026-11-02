// ============================================================
// DR. MAAN AL BARRY — OFFICIAL MEDICAL PORTAL
// Clinical Prestige & Academic Ophthalmology
// ============================================================

// --- DATA LAYER: single source of truth (see doctor-data.js) ---
import { DOCTOR, FAQ, PROCEDURES, PROCEDURE_GROUPS, procedureBySlug, whatsappUrl, publishableTestimonials, yearsOfExperience, buildJsonLd, buildProcedureJsonLd } from './doctor-data.js';
// --- ROUTES: one table for the app, the build and the prerenderer (see site-routes.js) ---
import { parseRoute, splitPath, pathFor, pageMeta } from './site-routes.js';

// Pick the current-language value from an { ar, en } pair.
const L = (pair) => pair[currentLang];

export const VisionSim = (() => {
  'use strict';
  /* ================= 1) DATA — منسوخة من main.js بدون تغيير ================= */
  const DEFOCUS_STEPS = [0, -.5, -1, -1.5, -2, -2.5, -3, -3.5];
  const LENSES = {
    edof: {
      ar: 'ممتدة المدى (EDOF)',
      en: 'Extended Depth of Focus (EDOF)',
      va: [0, .03, .08, .13, .18, .23, .36, .5],
      halo: .16,
      noteAr: 'مصممة لتمديد نطاق الرؤية من البعيد إلى المسافات المتوسطة (الشاشات ولوحة القيادة)، وتكون الهالات الليلية فيها عادةً أقل من العدسات متعددة البؤر. غالباً ما تلزم نظارة للقراءة الدقيقة. يحدد الطبيب مدى ملاءمتها بعد الفحص.',
      noteEn: 'Designed to extend the range of vision from distance to intermediate (screens, dashboard), usually with fewer night halos than multifocal designs. Reading glasses are often needed for fine print. Suitability is decided after examination.'
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
      noteAr: 'أعلى نقاء وتباين للمسافات البعيدة وأقل هالات ليلية؛ تتطلب غالباً نظارة للمسافات المتوسطة (الكمبيوتر) والقريبة (القراءة).',
      noteEn: 'Purest distance acuity and lowest halos; usually requires glasses for intermediate (computer) and near (reading).'
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
<li>${T('قوة الإضافة وقطر البؤبؤ ومعامل التشتت قيم تقريبية لأغراض التوضيح.', 'Add powers, pupil sizes and scatter factors are approximate values for illustration.')}</li></ul></details>
 <div class="vs-disclaimer-note"><svg class="vs-note-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>${T('تنويه طبي: هذه المحاكاة قد لا تنطبق 100% على الواقع، لكنها أقرب صورة توضيحية لتوصيل الفكرة والمعلومة. لا توجد عدسة واحدة تناسب الجميع؛ لكل مريض حالته وقياساته الخاصة التي يُبنى عليها الاختيار الطبي النهائي بعد الفحص السريري.', 'Clinical Note: This simulation may not apply 100% to individual reality, but serves as the closest illustrative representation to convey the concept. No single lens suits everyone; every patient has unique eye measurements, and the final choice is made after a clinical examination.')}</span></div>
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
    // Full lens name, plus a short form shown on narrow phones so the two comparison tags stay compact
    const SHORT = { edof: ['EDOF', 'EDOF'], trifocal: ['ثلاثية البؤرة', 'Trifocal'], monofocal: ['أحادية البؤرة', 'Monofocal'], cataract: ['ساد غير معالج', 'Cataract'] }[S.lens];
    $('#vs-tl').innerHTML = `<span class="vs-tag-full">${T(LENSES[S.lens].ar, LENSES[S.lens].en)}</span><span class="vs-tag-short">${T(SHORT[0], SHORT[1])}</span>`;
    const d = S.scene === 'night' && S.tab === 'sim' ? 0 : S.D, a = acuity(S.lens, d), nf = nearest(S.lens), fn = a <= .2;
    $('#vs-metrics').innerHTML = `<div><small>${T('حدة الإبصار المتوقعة', 'Expected acuity')}</small><strong>${toSnellen(a)}</strong><span>${a.toFixed(2)} logMAR</span></div>
 <div><small>${T('عند هذه المسافة', 'At this distance')}</small><strong class="${fn ? 'ok' : 'warn'}">${fn ? T('رؤية وظيفية غالباً بدون نظارة', 'Usually functional without glasses') : T('غالباً تلزم نظارة', 'Glasses usually needed')}</strong></div>
 <div><small>${T('أقرب مسافة وظيفية', 'Nearest functional distance')}</small><strong>${S.lens === 'cataract' ? T('لا يوجد', 'None') : nf < .1 ? T('البعيد فقط', 'Far only') : Math.round(100 / nf) + ' ' + T('سم', 'cm')}</strong></div>
 <p>${T(LENSES[S.lens].noteAr, LENSES[S.lens].noteEn)}</p>`;
    dirty = true;
  }

  // Release every geometry, material and texture a scene holds (renderer.dispose() alone does not).
  function disposeScene(scene) {
    if (!scene) return;
    scene.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
      mats.forEach(m => {
        Object.values(m).forEach(v => { if (v && v.isTexture) v.dispose(); });
        if (m.uniforms) Object.values(m.uniforms).forEach(u => { if (u && u.value && u.value.isTexture) u.value.dispose(); });
        m.dispose();
      });
    });
  }

  function destroy() {
    cancelAnimationFrame(raf);
    io && io.disconnect();
    if (rdr) {
      disposeScene(world);
      disposeScene(postS);
      if (RT) RT.dispose();
      if (GT) GT.dispose();
      rdr.dispose();
      rdr.forceContextLoss();
    }
    rdr = null;
    world = postS = RT = GT = null;
    root = null;
  }

  function showFallback(msg) {
    if (!view || view.querySelector('.vs-fallback')) return;
    view.insertAdjacentHTML('beforeend', '<p class="vs-fallback" role="status">' + msg + '</p>');
  }

  function mount(host, opt = {}) {
    destroy();
    if (opt.lang) S.lang = opt.lang;
    host.innerHTML = html();
    root = host.querySelector('#vs-root');
    view = root.querySelector('#vs-view');
    cv = root.querySelector('#vs-gl');
    if (!initGL()) showFallback(T('المتصفح لا يدعم WebGL2 أو تعذر تحميل three.js. باقي معلومات المقارنة أدناه متاحة.', 'WebGL2 / three.js is unavailable in this browser. The comparison details below still apply.'));
    // GPU reset / tab backgrounding on mobile can drop the context: stop drawing and explain instead of freezing.
    cv.addEventListener('webglcontextlost', e => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      showFallback(T('توقف عرض المحاكاة مؤقتاً. أعد تحميل الصفحة لاستئنافها.', 'The simulation display paused. Reload the page to resume.'));
    });
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

// ============================================================
// APP SHELL — clinical visual reconstruction ("the clinical atlas")
// Design system: docs/implementation/clinical-visual-reconstruction/DESIGN_SYSTEM.md
// Information architecture: docs/implementation/clinical-visual-reconstruction/INFORMATION_ARCHITECTURE.md
// Every doctor fact below is read from doctor-data.js; every procedure from PROCEDURES.
// ============================================================

// --- ROUTING -------------------------------------------------
// The site lives at a domain root or under a GitHub Pages subpath. index.html pins <base> to the
// site root before anything loads, so every relative URL in this file is relative to the root.
const SITE_URL = (typeof __SITE_URL__ !== 'undefined' ? __SITE_URL__ : 'https://drmaanalbarry.com').replace(/\/+$/, '');
const PROC_IMAGES = typeof __PROC_IMAGES__ !== 'undefined' ? __PROC_IMAGES__ : {};
const SITE_ROOT = (() => {
  const b = document.querySelector('base');
  return new URL(b ? b.href : splitPath(location.pathname).root, location.href);
})();
/** Site-root-relative path of an absolute URL, or null when it is outside this site. */
const relOf = href => {
  const u = new URL(href, SITE_ROOT);
  if (u.origin !== SITE_ROOT.origin || !u.pathname.startsWith(SITE_ROOT.pathname)) return null;
  return u.pathname.slice(SITE_ROOT.pathname.length);
};

let route = parseRoute(relOf(location.href) || '');

// --- APP STATE & LOCAL STORAGE ---
// Language comes from the URL. The bare Arabic root still honours a saved English choice
// (and moves to /en/), so a returning English reader lands on English.
let currentLang = route.lang;
(() => {
  let saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) { /* storage unavailable */ }
  if (!route.slug && route.lang === 'ar' && relOf(location.href) === '' && saved === 'en') {
    route = { ...route, lang: 'en' };
    currentLang = 'en';
    history.replaceState(history.state, '', new URL(pathFor('en') + location.hash, SITE_ROOT));
  }
})();
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

// Theme: an explicit visitor choice ('light' | 'dark') is stored under localStorage 'theme'.
// With no saved choice the site follows the device (prefers-color-scheme), live.
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
let savedTheme = (() => {
  try { const t = localStorage.getItem('theme'); return t === 'dark' || t === 'light' ? t : null; } catch (e) { return null; }
})();
const resolvedTheme = () => savedTheme || (darkQuery.matches ? 'dark' : 'light');

let currentQStep = 0;
let qAnswers = [];
let qCompleted = false;
let openArticleId = null;
let procFilter = 'all';

// Long-form procedure text is a separate lazy chunk: the homepage never downloads it.
let PROC = null;
const loadProcedureContent = () => PROC ? Promise.resolve(PROC) : import('./src/procedures/content.js').then(m => (PROC = m));

const tr = (ar, en) => (currentLang === 'ar' ? ar : en);
const isHome = () => !route.slug;

/** href of a page (relative to the site root). The Arabic home is './'. */
const pageHref = (lang = currentLang, slug = null) => pathFor(lang, slug) || './';
/** href of a homepage section, valid from any page. */
const secHref = id => `${currentLang === 'en' ? 'en/' : ''}#${id}`;
/** href of an anchor on the current page. */
const hereHref = id => `${pathFor(currentLang, route.slug)}#${id}`;

// --- ICONS: one inline SVG set (24px grid, 1.6 stroke, round joins). No emoji anywhere. ---
const IC = {
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
  phone: '<path d="M20.5 16.3v2.8a1.9 1.9 0 0 1-2.1 1.9A18.6 18.6 0 0 1 3 5.6 1.9 1.9 0 0 1 4.9 3.5h2.8a1.9 1.9 0 0 1 1.9 1.6c.1.9.4 1.8.7 2.6a1.9 1.9 0 0 1-.4 2l-1.2 1.2a15 15 0 0 0 5.4 5.4l1.2-1.2a1.9 1.9 0 0 1 2-.4c.8.3 1.7.6 2.6.7a1.9 1.9 0 0 1 1.6 1.9z"/>',
  pin: '<path d="M12 21s-7-6.1-7-11.4a7 7 0 0 1 14 0C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.6" r="2.4"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  arrow: '<path d="M4.5 12h15M13.5 6l6 6-6 6"/>',
  external: '<path d="M14 4.5h5.5V10M19.5 4.5 11 13M17.5 14v5.5h-13v-13H10"/>',
  menu: '<path d="M4 7.5h16M4 12h16M4 16.5h10"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="M10 8.6v6.8l5.6-3.4z" fill="currentColor" stroke="none"/>',
  shield: '<path d="M12 3 4.5 6v5.5c0 4.6 3.1 8 7.5 9.5 4.4-1.5 7.5-4.9 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
  alert: '<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.2v.1"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.3 3.5 8.5s-1.1 6.1-3.5 8.5c-2.4-2.4-3.5-5.3-3.5-8.5s1.1-6.1 3.5-8.5z"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 7.8v.1"/>',
  draft: '<path d="M14.5 3.5H6.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8.5z"/><path d="M14.5 3.5v5h5M8.5 13h7M8.5 16.5h4.5"/>',
  layers: '<path d="m12 3.5 8.5 4.5-8.5 4.5L3.5 8z"/><path d="m3.5 12 8.5 4.5 8.5-4.5M3.5 16l8.5 4.5 8.5-4.5"/>',
  cube: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
  book: '<path d="M4.5 5.5A2 2 0 0 1 6.5 3.5h13v15h-13a2 2 0 0 0-2 2z"/><path d="M4.5 20.5a2 2 0 0 1 2-2h13v2z"/>'
};
const icon = (name, size = 20) =>
  `<svg class="ic ic-${name}" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${IC[name]}</svg>`;

// Brand glyphs (filled) — Instagram, X, YouTube, WhatsApp.
const GLYPH = {
  instagram: '<path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/>',
  x: '<path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24H16.17l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25H8.08l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z"/>',
  youtube: '<path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.87.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/>',
  whatsapp: '<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3z"/>'
};
const glyph = (name, size = 18) =>
  `<svg class="ic ic-${name}" viewBox="0 0 24 24" width="${size}" height="${size}" fill="currentColor" aria-hidden="true" focusable="false">${GLYPH[name]}</svg>`;

const EXT = 'target="_blank" rel="noopener noreferrer"';
const D = DOCTOR;
const C = DOCTOR.contact;
const role = id => D.professional.roles.find(r => r.id === id);
const short = r => (currentLang === 'ar' ? (r.shortAr || r.ar) : (r.shortEn || r.en));
const STAT = D.credibility.statistics.find(s => s.id === 'cases-15000');
const groupOf = id => PROCEDURE_GROUPS.find(g => g.id === id);

function getWhatsAppUrl(msg) {
  return whatsappUrl(msg || tr(
    'مرحباً، أود الاستفسار عن حجز موعد استشارة مع د. معن بن عبدالله البري في مستشفى مغربي المدينة المنورة.',
    'Hello, I would like to inquire about booking a consultation with Dr. Maan bin Abdullah Al Barry at Magrabi Madinah.'));
}

// Shared section head: small kicker + title + optional lede.
const sectionHead = (kicker, title, lede = '', cls = '') => `
      <header class="section-head ${cls} fade-in">
        <p class="kicker">${kicker}</p>
        <h2>${title}</h2>
        ${lede ? `<p class="lede">${lede}</p>` : ''}
      </header>`;

// --- ANATOMICAL ILLUSTRATIONS ---
// The 3D renders (public/images/procedures/<slug>.webp, 1600×1000, plus <slug>-dark.webp) are
// referenced only when they exist at build time (__PROC_IMAGES__). Otherwise — or if one fails
// to load — a schematic line drawing of the eye in section stands in, with the structure each
// procedure concerns highlighted. Same plate, same light, same angle for every procedure.
const EYE_BASE = `
  <circle class="ap-globe" cx="150" cy="100" r="78"/>
  <path class="ap-retina" d="M118 30a74 74 0 0 0 0 140"/>
  <path class="ap-nerve" d="M73 92h-34M73 108h-34"/>
  <path class="ap-cornea" d="M214 56c26 22 26 66 0 88"/>
  <path class="ap-iris" d="M212 60v26M212 114v26"/>
  <path class="ap-zonule" d="M196 72l14-8M196 128l14 8"/>`;
const EYE_FOCUS = {
  'cataract-surgery': '<ellipse class="ap-focus ap-cloud" cx="196" cy="100" rx="12" ry="28"/><ellipse class="ap-focus-line" cx="196" cy="100" rx="6" ry="17"/>',
  'lens-implants': '<ellipse class="ap-focus" cx="196" cy="100" rx="8" ry="20"/><path class="ap-focus-line" d="M196 80c-8-6-10-12-6-18M196 120c-8 6-10 12-6 18"/>',
  'laser-vision-correction': '<path class="ap-focus-stroke" d="M214 56c26 22 26 66 0 88"/><path class="ap-beam" d="M300 70l-58 20M300 100h-56M300 130l-58-20"/>',
  icl: '<ellipse class="ap-lens-ghost" cx="196" cy="100" rx="12" ry="28"/><path class="ap-focus-stroke" d="M206 74c4 8 4 44 0 52"/>',
  'keratoconus-cxl': '<path class="ap-focus-stroke" d="M214 56c18 12 34 34 38 46-6 14-20 32-38 42"/><path class="ap-beam" d="M300 84l-40 10M300 116l-40-10"/>',
  'corneal-transplant': '<path class="ap-focus-stroke" d="M226 70c12 18 12 42 0 60"/><path class="ap-graft" d="M226 70l-6-4M226 130l-6 4"/>',
  'intravitreal-injections': '<circle class="ap-vitreous" cx="150" cy="100" r="62"/><circle class="ap-focus" cx="78" cy="100" r="6"/><path class="ap-needle" d="M190 30l-18 34"/>'
};
// Two crops of the same drawing: the full plate, and a close-up of the front of the eye
// (where every highlighted structure sits) for the small thumbnails of the phone card rows.
function anatomyPlate(slug, label) {
  const g = `<g class="ap-base">${EYE_BASE}</g><g class="ap-hl">${EYE_FOCUS[slug] || ''}</g>`;
  return `<svg class="anat-plate" viewBox="0 0 320 200" role="img" aria-label="${label}" focusable="false" preserveAspectRatio="xMidYMid meet">${g}</svg>`
    + `<svg class="anat-thumb" viewBox="${slug === 'intravitreal-injections' ? '60 14 180 172' : '128 22 156 156'}" role="img" aria-label="${label}" focusable="false" preserveAspectRatio="xMidYMid meet">${g}</svg>`;
}
/** Procedure illustration: the 3D render when it exists, otherwise the schematic plate. */
function illustration(p, { eager = false, cls = '' } = {}) {
  const img = PROC_IMAGES[p.slug] || {};
  const alt = L(p.alt);
  const plate = anatomyPlate(p.slug, alt);
  if (!img.light) return `<div class="illus is-plate ${cls}">${plate}</div>`;
  const dark = img.dark ? `images/procedures/${p.slug}-dark.webp` : '';
  const src = dark && resolvedTheme() === 'dark' ? dark : `images/procedures/${p.slug}.webp`;
  return `<div class="illus ${cls}">
      <img src="${src}" data-light="images/procedures/${p.slug}.webp" ${dark ? `data-dark="${dark}"` : ''} width="1600" height="1000" alt="${alt}" ${eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async" onerror="this.parentNode.classList.add('is-plate');this.remove()">
      ${plate}
    </div>`;
}

// --- NAVIGATION MODEL ---
const NAV = [
  ['profile', 'عن الدكتور', 'About'],
  ['procedures', 'الإجراءات', 'Procedures'],
  ['simulator', 'محاكي الرؤية', 'Vision simulator'],
  ['cataract-3d', 'الجراحة ثلاثية الأبعاد', '3D surgery'],
  ['education', 'التثقيف الصحي', 'Patient education'],
  ['clinic', 'العيادة والحجز', 'Clinic & booking']
];
const DRAWER_NAV = [
  ['home', 'الرئيسية', 'Home'],
  ...NAV.slice(0, 5),
  ['questionnaire', 'استبيان نمط الحياة البصري', 'Lifestyle questionnaire'],
  ['faq', 'الأسئلة الشائعة', 'Questions'],
  NAV[5]
];
const NAV_SECTION_IDS = ['home', ...NAV.map(n => n[0])];

let currentActiveNavId = 'home';
let isClickScrolling = false;
let clickScrollTimer = null;

function renderThemeToggle(id) {
  const isDark = resolvedTheme() === 'dark';
  const label = isDark ? tr('الوضع الليلي مفعّل، انقر للتحويل للوضع النهاري', 'Dark mode on. Switch to light mode')
    : tr('الوضع النهاري مفعّل، انقر للتحويل للوضع الليلي', 'Light mode on. Switch to dark mode');
  return `<button id="${id}" type="button" class="icon-btn theme-toggle" onclick="toggleTheme()" role="switch" aria-checked="${isDark}" aria-label="${label}" title="${label}">${icon('sun', 20)}${icon('moon', 20)}</button>`;
}

function renderLangToggle(extra = '') {
  return `<button type="button" class="icon-btn lang-switch ${extra}" onclick="toggleLang()" aria-label="${tr('Switch to English', 'التحويل إلى العربية')}" title="${tr('Switch to English', 'التحويل إلى العربية')}">
          <span lang="${tr('en', 'ar')}">${tr('EN', 'ع')}</span>
        </button>`;
}

// --- HEADER ---
function renderHeader() {
  const link = ([id, ar, en], i, drawer) => `<a href="${id === 'home' ? pageHref() : secHref(id)}" data-nav data-section="${id}" class="${isHome() && currentActiveNavId === id ? 'active' : ''}">${drawer ? `<span class="drawer-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>` : ''}<span>${tr(ar, en)}</span></a>`;
  return `
  <header class="site-header" id="site-header">
    <div class="header-inner">
      <a href="${pageHref()}" data-nav data-section="home" class="wordmark" aria-label="${L(D.identity.shortName)} — ${tr('الصفحة الرئيسية', 'home')}">
        <span class="wordmark-mark" aria-hidden="true"><svg viewBox="0 0 32 32" width="30" height="30"><circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M5 16s4.6-6.5 11-6.5S27 16 27 16s-4.6 6.5-11 6.5S5 16 5 16z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="16" cy="16" r="3.4" fill="currentColor"/></svg></span>
        <span class="wordmark-text"><span class="wordmark-name">${L(D.identity.shortName)}</span>
        <span class="wordmark-sub">${tr('استشاري طب وجراحة العيون', 'Consultant Ophthalmologist')}</span></span>
      </a>

      <nav class="header-nav" aria-label="${tr('التنقل الرئيسي', 'Main navigation')}">
        <div class="nav-links">${NAV.map((n, i) => link(n, i, false)).join('')}</div>
      </nav>

      <div class="header-actions">
        ${renderLangToggle()}
        ${renderThemeToggle('theme-toggle-btn')}
        <a href="${C.bookingUrl}" ${EXT} class="btn btn-primary btn-sm btn-header-book" data-cta="book">
          <span class="btn-label">${tr('احجز موعداً', 'Book appointment')}</span>
        </a>
        <button type="button" class="icon-btn mobile-menu-btn" onclick="toggleMobileMenu()" aria-label="${tr('القائمة', 'Menu')}" aria-expanded="false" aria-controls="mobile-nav">${icon('menu', 22)}</button>
      </div>
    </div>

    <nav class="mobile-nav" id="mobile-nav" aria-label="${tr('قائمة الموقع', 'Site menu')}">
      <div class="drawer-head">
        <span class="drawer-title">${tr('المحتويات', 'Contents')}</span>
        <button type="button" class="icon-btn" onclick="closeMobileMenu();document.querySelector('.mobile-menu-btn').focus();" aria-label="${tr('إغلاق القائمة', 'Close menu')}">${icon('close', 22)}</button>
      </div>
      <div class="drawer-links">${DRAWER_NAV.map((n, i) => link(n, i, true)).join('')}</div>
      <div class="drawer-procs">
        <p class="drawer-label">${tr('الإجراءات', 'Procedures')}</p>
        <ul>${PROCEDURES.map(p => `<li><a href="${pageHref(currentLang, p.slug)}" data-nav ${route.slug === p.slug ? 'aria-current="page"' : ''}>${L(p.name)}</a></li>`).join('')}</ul>
      </div>
      <div class="drawer-foot">
        <a href="${D.clinic.mapUrl}" ${EXT} class="drawer-map">${icon('pin', 18)}<span>${tr('موقع المستشفى على خرائط جوجل', 'Hospital on Google Maps')}</span></a>
        <div class="drawer-row">
          <span>${tr('المظهر', 'Appearance')}</span>
          ${renderThemeToggle('theme-toggle-btn-mobile')}
        </div>
        <div class="drawer-row">
          <span>${tr('قنوات الدكتور', 'Channels')}</span>
          <span class="social-row">
            <a href="${D.social.instagram}" ${EXT} class="icon-btn" aria-label="Instagram">${glyph('instagram')}</a>
            <a href="${D.social.twitter}" ${EXT} class="icon-btn" aria-label="X (Twitter)">${glyph('x', 16)}</a>
            <a href="${D.social.youtube}" ${EXT} class="icon-btn" aria-label="YouTube">${glyph('youtube')}</a>
          </span>
        </div>
      </div>
    </nav>
  </header>`;
}

// ============================================================
// HOMEPAGE — a patient journey, not an encyclopedia:
// doctor → procedures → credentials → simulator → 3D surgery → education → FAQ → clinic → book
// ============================================================

// 1. Doctor introduction
function renderHero() {
  const chief = role('magrabi-chief');
  const years = yearsOfExperience();
  return `
  <section class="hero" id="home">
    <div class="container hero-grid">
      <div class="hero-text">
        <p class="kicker hero-kicker"><span>${tr('استشاري طب وجراحة العيون', 'Consultant ophthalmologist')}</span><span class="dot" aria-hidden="true"></span><span>${tr('المدينة المنورة', 'Madinah')}</span></p>
        <h1 class="hero-title">${L(D.identity.name)}</h1>
        <p class="hero-specialty-subtitle">${L(D.identity.title)}</p>
        <div class="hero-cta">
          <a href="${C.bookingUrl}" ${EXT} class="btn btn-primary btn-lg" id="hero-primary-cta" data-cta="book">
            ${icon('calendar', 20)}<span class="btn-label">${tr('احجز موعد كشف أو استشارة', 'Book a consultation')}</span>
          </a>
          <a href="tel:${C.clinicDirect.tel}" class="btn btn-quiet btn-lg" id="hero-call-cta" data-cta="call">
            ${icon('phone', 18)}<span class="btn-label">${tr('عيادة الدكتور', 'Clinic line')} <bdi dir="ltr">${C.clinicDirect.display}</bdi></span>
          </a>
        </div>
        <p class="hero-aside">${glyph('whatsapp', 16)}<span>${tr('الرقم نفسه متاح على', 'The same number is on')} <a href="${getWhatsAppUrl()}" ${EXT} class="text-link" data-cta="whatsapp">${tr('واتساب', 'WhatsApp')}</a></span></p>
      </div>

      <aside class="hero-card" aria-label="${tr('بطاقة الطبيب', 'Doctor card')}">
        <figure class="hero-portrait">
          <img src="images/dr-maan-portrait.png" width="295" height="225" alt="${tr('صورة د. معن بن عبدالله البري', 'Portrait of Dr. Maan bin Abdullah Al Barry')}" loading="eager" fetchpriority="high" decoding="async">
        </figure>
        <dl class="hero-card-rows">
          <div><dt>${tr('المنصب الحالي', 'Current role')}</dt><dd class="hero-role-text">${short(chief)}</dd></div>
          <div><dt>${tr('الصفة الأكاديمية', 'Academic')}</dt><dd>${L(D.professional.academicRank)}</dd></div>
          <div><dt>${tr('مكان العيادة', 'Clinic')}</dt><dd>${L(D.clinic.name)}</dd></div>
        </dl>
      </aside>
    </div>

    <div class="container">
      <ul class="hero-facts" aria-label="${tr('حقائق مهنية', 'Professional facts')}">
        <li class="hero-fact">
          <strong class="hero-fact-value"><bdi>${D.professional.experienceSince}</bdi></strong>
          <span class="hero-fact-label">${tr('بداية الممارسة السريرية والجراحية', 'In clinical & surgical practice since')}<span class="hero-fact-sub">${tr(`<bdi>${years}</bdi> عاماً من الخبرة`, `<bdi>${years}</bdi> years of experience`)}</span></span>
        </li>
        ${STAT ? `<li class="hero-fact">
          <strong class="hero-fact-value"><bdi dir="ltr">${STAT.value}</bdi></strong>
          <span class="hero-fact-label">${L(STAT.label)}</span>
        </li>` : ''}
        <li class="hero-fact">
          <strong class="hero-fact-value"><bdi dir="ltr">FRCS</bdi></strong>
          <span class="hero-fact-label">${tr('زميل كلية الجراحين الملكية – بريطانيا', 'Royal College of Surgeons, UK')}</span>
        </li>
      </ul>
    </div>
  </section>`;
}

// 2. Procedures gallery — the main discovery surface
function procCard(p, { featured = false, compact = false } = {}) {
  const g = groupOf(p.group);
  return `
        <article class="proc-card${featured ? ' is-featured' : ''}${compact ? ' is-compact' : ''}" data-group="${p.group}">
          ${illustration(p, { cls: 'proc-card-illus' })}
          <div class="proc-card-body">
            <p class="proc-card-group">${L(g)}</p>
            <h3 class="proc-card-title">${L(p.name)}</h3>
            <p class="proc-card-text">${L(p.summary)}</p>
            ${p.simulator ? `<p class="proc-card-badge">${icon('cube', 16)}<span>${tr('مع تجربة ثلاثية الأبعاد', 'With a 3D walkthrough')}</span></p>` : ''}
            <a class="proc-card-link" href="${pageHref(currentLang, p.slug)}" data-nav>${tr('تفاصيل الإجراء', 'Procedure details')}<span class="sr-only">: ${L(p.name)}</span>${icon('arrow', 18)}</a>
          </div>
        </article>`;
}

function renderProcedures() {
  const chips = [['all', tr('جميع الإجراءات', 'All procedures')], ...PROCEDURE_GROUPS.map(g => [g.id, L(g)])];
  return `
  <section class="section" id="procedures">
    <div class="container">
      ${sectionHead(tr('الإجراءات والعلاجات', 'Procedures & treatments'), tr('ما الذي يعالجه د. معن؟', 'What Dr. Maan treats'),
        tr('سبعة إجراءات في طب وجراحة العيون. لكل إجراء صفحة تشرح التشريح وخطوات الإجراء والتعافي والمخاطر بلغة واضحة.', 'Seven eye procedures. Each has its own page explaining the anatomy, the steps, recovery and risks in plain language.'), 'section-head-split')}
      <div class="proc-filter fade-in" role="group" aria-label="${tr('تصفية حسب المجموعة', 'Filter by group')}">
        ${chips.map(([id, label]) => `<button type="button" class="chip" data-filter="${id}" aria-pressed="${procFilter === id}" onclick="filterProcedures('${id}')">${label}</button>`).join('')}
      </div>
      <div class="proc-grid fade-in" data-filter="${procFilter}">
        ${PROCEDURES.map((p, i) => procCard(p, { featured: i === 0 })).join('')}
        <aside class="proc-help">
          <p class="proc-card-group">${tr('غير متأكد؟', 'Not sure?')}</p>
          <h3>${tr('ابدأ بفحص شامل', 'Start with an examination')}</h3>
          <p>${tr('لا تحتاج إلى معرفة اسم الإجراء مسبقاً. يحدد الفحص سبب المشكلة والخيارات المناسبة لعينك.', 'You do not need to know the procedure name. An examination finds the cause and the options that suit your eye.')}</p>
          <a href="${C.bookingUrl}" ${EXT} class="btn btn-primary" data-cta="book"><span class="btn-label">${tr('احجز موعد فحص', 'Book an examination')}</span></a>
        </aside>
      </div>
    </div>
  </section>`;
}

// 3. Qualifications & experience (concise)
function renderProfile() {
  const groups = [
    { title: tr('المؤهلات', 'Qualifications'), rows: D.professional.qualifications.map(q => [q.short, L(q)]) },
    { title: tr('الصفة الأكاديمية', 'Academic'), rows: [[tr('حالياً', 'Rank'), L(D.professional.academicRank)], [tr('سابقاً', 'Former'), short(role('taibah-chair'))]] },
    { title: tr('القيادة', 'Leadership'), rows: [[tr('حالياً', 'Current'), short(role('magrabi-chief')), true], [tr('سابقاً', 'Former'), short(role('sscc-president'))]] },
    { title: tr('العضويات', 'Memberships'), rows: D.professional.memberships.map(m => [tr('عضو', 'Member'), L(m)]) }
  ];
  return `
  <section class="section section-band" id="profile">
    <div class="container">
      ${sectionHead(tr('المؤهلات والخبرة', 'Qualifications & experience'), tr('خبرة سريرية وأكاديمية منذ', 'Clinical and academic experience since') + ` <bdi>${D.professional.experienceSince}</bdi>`,
        tr(`يعمل د. معن البري ضمن وحدة الماء الأبيض ووحدة القرنية وتصحيح النظر في ${D.clinic.name.ar}. مؤهلات ومناصب منشورة لدى مغربي الصحية وجامعة طيبة، أو أكدها د. معن شخصياً.`,
          `Dr. Maan Al Barry works within the cataract unit and the cornea & refractive unit at ${D.clinic.name.en}. Qualifications and roles as published by Magrabi Health and Taibah University, or confirmed by Dr. Maan himself.`), 'section-head-split')}
      <div class="profile-grid" id="qualifications">
        <div class="ledger qualifications-grid fade-in">
          ${groups.map(g => `
          <div class="ledger-group">
            <h3 class="ledger-title">${g.title}</h3>
            <ul class="ledger-list">
              ${g.rows.map(([k, v, em]) => `<li class="ledger-row${em ? ' is-emphasis' : ''}"><span class="ledger-key">${k}</span><span class="ledger-val">${v}</span></li>`).join('')}
            </ul>
          </div>`).join('')}
        </div>
        <div class="appointments fade-in">
          <h3 class="ledger-title">${tr('المناصب والمسيرة', 'Appointments')}</h3>
          <ol class="timeline">
            ${D.professional.roles.map(r => `
            <li class="timeline-item${r.current ? ' is-current' : ''}">
              <span class="timeline-when">${r.current ? tr('حالياً', 'Current') : tr('سابقاً', 'Previously')}</span>
              <h4>${r[currentLang]}</h4>
            </li>`).join('')}
          </ol>
          <div class="social-row profile-social">
            <span>${tr('قنوات الدكتور', 'Dr. Maan’s channels')}</span>
            <a href="${D.social.instagram}" ${EXT} class="icon-btn" aria-label="Instagram">${glyph('instagram')}</a>
            <a href="${D.social.twitter}" ${EXT} class="icon-btn" aria-label="X (Twitter)">${glyph('x', 16)}</a>
            <a href="${D.social.youtube}" ${EXT} class="icon-btn" aria-label="YouTube">${glyph('youtube')}</a>
          </div>
        </div>
      </div>
      ${renderTestimonials()}
    </div>
  </section>`;
}

// PATIENT TESTIMONIALS (publication-gated) — renders nothing unless a testimonial has a source
// URL, documented reuse permission, attribution and approved text (isPublishableTestimonial).
function renderTestimonials() {
  const items = publishableTestimonials();
  if (!items.length) return '';
  return `
      <div class="testimonials fade-in" id="testimonials">
        <p class="kicker">${tr('آراء المرضى', 'Patient testimonials')}</p>
        <div class="reviews-grid">
          ${items.map(t => `
          <figure class="review-card">
            <blockquote class="review-text">${t.approvedText[currentLang] || t.approvedText.ar || t.approvedText.en}</blockquote>
            <figcaption class="review-author">
              <strong>${t.attribution}</strong>
              <a href="${t.source.url}" ${EXT}>${tr('المصدر', 'Source')}</a>
            </figcaption>
          </figure>`).join('')}
        </div>
      </div>`;
}

// 4. Vision Simulator entry. The section shell is final; the legacy simulator (VisionSim, above)
// mounts into the host for now. The replacement module (src/vision-sim, another workstream)
// mounts into the same [data-vision-host] element: mount(host, { lang, theme, reducedMotion }).
function renderSimulator() {
  return `
  <section class="section section-stage vs-section" id="simulator">
    <div class="container">
      ${sectionHead(tr('أداة تثقيفية تفاعلية', 'Interactive education'), tr('محاكي الرؤية: كيف قد تبدو الرؤية بعد زراعة العدسة؟', 'Vision simulator: how might vision look after a lens implant?'),
        tr('قارن بين أنواع العدسات والساد غير المعالج في القيادة ليلاً والقراءة. محاكاة توضيحية مبنية على متوسطات منشورة.', 'Compare lens types with an untreated cataract while night driving or reading. An illustrative simulation based on published averages.'), 'section-head-split')}
      <div class="vsim-launch fade-in">
        <div class="vsim-host" id="simulator-host" data-vision-host></div>
      </div>
      <ul class="disclaimers fade-in">
        <li>${icon('info', 18)}<span>${tr('أداة تعليمية توضح الفروق العامة بين العدسات، ولا تتنبأ بنتيجة عينك.', 'An educational tool showing general differences between lenses. It does not predict your own result.')}</span></li>
        <li>${icon('eye', 18)}<span>${tr('يُختار نوع العدسة بعد الفحص والقياسات ومناقشة أولوياتك مع الطبيب.', 'The lens type is chosen after examination, measurements and a conversation about your priorities.')}</span></li>
        <li>${icon('arrow', 18)}<span><a href="${pageHref(currentLang, 'lens-implants')}" data-nav class="text-link">${tr('اقرأ عن أنواع العدسات المزروعة', 'Read about lens implant types')}</a></span></li>
      </ul>
    </div>
  </section>`;
}

// 5. Featured 3D cataract surgery (lazy-loaded module, mounted on demand).
// The module lives in src/cataract-sim/ (owned by another engineer). The host node is created once and
// kept outside the re-rendered markup so a re-render never destroys the running scene.
const c3d = { host: null, controller: null, state: 'idle' }; // idle | loading | active | error

function renderCataract3D(onProcedurePage = false) {
  const st = c3d.state;
  return `
  <section class="section section-stage section-stage-deep" id="cataract-3d" data-state="${st}">
    <div class="container c3d-grid">
      <div class="c3d-text fade-in">
        <p class="kicker">${tr('تجربة تعليمية ثلاثية الأبعاد', 'Interactive 3D education')}</p>
        <h2>${tr('عملية الماء الأبيض، خطوة بخطوة', 'Cataract surgery, step by step')}</h2>
        <p class="lede">${tr('نموذج ثلاثي الأبعاد للعين يوضح المراحل الرئيسية لعملية إزالة الساد الحديثة وزراعة العدسة، لتفهم ما يحدث قبل أن تسأل عنه في العيادة.', 'A 3D model of the eye that walks through the main stages of modern cataract removal and lens implantation — so you understand what happens before you ask about it in clinic.')}</p>
        <ul class="c3d-notes">
          <li>${icon('info', 18)}<span>${tr('محتوى تعليمي توضيحي قيد المراجعة الطبية من الطبيب.', 'Illustrative education, pending physician review.')}</span></li>
          <li>${icon('alert', 18)}<span>${tr('لا يغني عن الاستشارة والفحص؛ تختلف تفاصيل كل عملية بحسب حالة العين.', 'Not a substitute for a consultation; every operation is tailored to the individual eye.')}</span></li>
        </ul>
        <div class="c3d-actions">
          <button type="button" class="btn btn-light btn-lg" id="cataract-3d-start" onclick="startCataract3D()" ${st === 'loading' ? 'aria-busy="true"' : ''}>
            ${icon('play', 20)}<span class="btn-label">${st === 'loading' ? tr('جارٍ التحميل…', 'Loading…') : tr('ابدأ التجربة ثلاثية الأبعاد', 'Start the 3D experience')}</span>
          </button>
          ${onProcedurePage ? '' : `<a href="${pageHref(currentLang, 'cataract-surgery')}" data-nav class="text-link text-link-light">${tr('دليل جراحة الماء الأبيض', 'Cataract surgery guide')}${icon('arrow', 16)}</a>`}
          <p class="c3d-status" role="status">${st === 'error' ? tr('تعذر تحميل التجربة ثلاثية الأبعاد على هذا الجهاز. يمكنك المحاولة مرة أخرى.', 'The 3D experience could not load on this device. You can try again.') : ''}</p>
        </div>
      </div>

      <figure class="c3d-poster fade-in" aria-hidden="true">
        <svg viewBox="0 0 400 300" class="c3d-svg" focusable="false">
          <g fill="none" stroke="currentColor" stroke-linecap="round">
            <path d="M300 150c0 66-52 118-118 118S64 216 64 150 116 32 182 32s118 52 118 118z" stroke-width="1.2" opacity=".5"/>
            <path d="M292 96c22 30 22 78 0 108" stroke-width="1.6"/>
            <path d="M262 100c-6 16-6 84 0 100M262 100l-14 4M262 200l-14-4" stroke-width="1.2" opacity=".7"/>
            <ellipse class="c3d-lens" cx="238" cy="150" rx="17" ry="40" stroke-width="1.6"/>
            <ellipse cx="238" cy="150" rx="9" ry="26" stroke-width=".8" opacity=".55"/>
            <path d="M238 110c-20-10-34-14-46-14M238 190c-20 10-34 14-46 14" stroke-width=".8" opacity=".5"/>
            <path d="M108 70c-36 40-36 120 0 160" stroke-width="2.4" opacity=".55"/>
            <path d="M74 150h-34" stroke-width="3" opacity=".45"/>
            <path class="c3d-ray" d="M392 120 240 128 104 150M392 180 240 172 104 150" stroke-width=".9" stroke-dasharray="3 5"/>
          </g>
          <g class="c3d-labels" font-size="15">
            <text x="302" y="86">${tr('القرنية', 'Cornea')}</text>
            <text x="222" y="236">${tr('العدسة', 'Lens')}</text>
            <text x="84" y="60">${tr('الشبكية', 'Retina')}</text>
          </g>
        </svg>
        <figcaption>${tr('رسم توضيحي للعين: الضوء يمر عبر القرنية والعدسة إلى الشبكية.', 'The eye in section: light passes through the cornea and lens to the retina.')}</figcaption>
      </figure>

      <div class="c3d-stage" id="cataract-3d-stage" ${st === 'active' || st === 'loading' ? '' : 'hidden'} aria-label="${tr('التجربة ثلاثية الأبعاد', '3D experience')}" role="region"></div>
    </div>
  </section>`;
}

function c3dSync() {
  const sec = document.getElementById('cataract-3d');
  if (!sec) return;
  sec.dataset.state = c3d.state;
  const stage = document.getElementById('cataract-3d-stage');
  const btn = document.getElementById('cataract-3d-start');
  const status = sec.querySelector('.c3d-status');
  if (stage) {
    stage.hidden = !(c3d.state === 'active' || c3d.state === 'loading');
    if (c3d.host && c3d.host.parentNode !== stage) stage.appendChild(c3d.host);
  }
  if (btn) {
    btn.toggleAttribute('aria-busy', c3d.state === 'loading');
    const label = btn.querySelector('.btn-label');
    if (label) label.textContent = c3d.state === 'loading' ? tr('جارٍ التحميل…', 'Loading…') : tr('ابدأ التجربة ثلاثية الأبعاد', 'Start the 3D experience');
  }
  if (status) status.textContent = c3d.state === 'error' ? tr('تعذر تحميل التجربة ثلاثية الأبعاد على هذا الجهاز. يمكنك المحاولة مرة أخرى.', 'The 3D experience could not load on this device. You can try again.') : '';
}

function closeCataract3D(refocus = true) {
  const ctrl = c3d.controller;
  c3d.controller = null;
  try { if (ctrl) ctrl.destroy(); } catch (e) { /* already torn down */ }
  if (c3d.host) c3d.host.remove();
  c3d.host = null;
  c3d.state = 'idle';
  c3dSync();
  const btn = document.getElementById('cataract-3d-start');
  if (btn && refocus !== false) btn.focus({ preventScroll: true });
}

window.startCataract3D = async function () {
  if (c3d.state === 'loading' || c3d.state === 'active') return;
  c3d.state = 'loading';
  c3d.host = document.createElement('div');
  c3d.host.className = 'c3d-host';
  c3dSync();
  try {
    // Static specifier so Vite code-splits the module (and three.js) out of the main chunk.
    const mod = await import('./src/cataract-sim/index.js');
    const ctrl = await mod.mount(c3d.host, {
      lang: currentLang,
      theme: resolvedTheme(),
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
    if (c3d.state !== 'loading') { ctrl && ctrl.destroy && ctrl.destroy(); return; }
    c3d.controller = ctrl;
    c3d.state = 'active';
    // the visitor may have switched language or theme while the module was loading
    ctrl.setLang(currentLang);
    ctrl.setTheme(resolvedTheme());
    if (ctrl && typeof ctrl.on === 'function') ctrl.on('close', closeCataract3D);
    c3dSync();
    document.getElementById('cataract-3d-stage')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  } catch (e) {
    console.warn('3D cataract module unavailable:', e);
    if (c3d.host) c3d.host.remove();
    c3d.host = null;
    c3d.controller = null;
    c3d.state = 'error';
    c3dSync();
  }
};
window.closeCataract3D = closeCataract3D;

// 6. Patient education — short, practical, and linked to the procedure pages for depth.
function renderQuestionnaireCard() {
  const content = {
    ar: {
      steps: [
        { question: 'ما هي فئتك العمرية التقريبية؟', desc: 'تساعد لمعرفة درجة التكيف العصبي الطبيعي وجفاف العين الفسيولوجي.', options: ['أقل من 45 سنة', '45 إلى 58 سنة', '59 إلى 70 سنة', 'أكثر من 70 سنة', 'لست متأكداً'] },
        { question: 'هل تم تشخيصك سابقاً بأي من حالات العين التالية؟', desc: 'بعض حالات الشبكية وارتفاع ضغط العين تتطلب اختيار عدسات تحافظ على أعلى حساسية للتباين.', options: ['لا توجد حالات سابقة معتمدة (سليمة)', 'ارتفاع ضغط العين أو ماء أزرق (Glaucoma)', 'اعتلال بمركز الإبصار أو السكري بالشبكية', 'قرنية مخروطية أو جفاف عين مزمن', 'لست متأكداً تماماً (أرغب بفحص شامل)'] },
        { question: 'ما هي الأولوية البصرية الأهم في نمط حياتك اليومي؟', desc: 'تساعد على تحديد النطاق البصري الأكثر استخداماً خلال يومك.', options: ['القيادة الليلية ووضوح الرؤية البعيدة مع أقل قدر من الهالات', 'العمل المكتبي، شاشات الحاسوب، ولوحة قيادة السيارة (مسافة ممتدة)', 'قراءة المصحف الشريف والهاتف الذكي دون نظارة', 'أقل اعتماد ممكن على النظارات'] },
        { question: 'هل سبق لك إجراء عملية ليزك أو تصحيح نظر سابق؟', desc: 'العيون التي خضعت لعمليات سابقة تحتاج معادلات حسابية خاصة (Barrett True-K).', options: ['لم أجرِ أي عملية سابقة (قرنية طبيعية)', 'نعم، أجريت فيمتو ليزك أو ليزر سطحي PRK', 'نعم، خضعت لتثبيت قرنية مخروطية CXL', 'لست متأكداً من التاريخ الجراحي الدقيق'] }
      ]
    },
    en: {
      steps: [
        { question: 'What is your approximate age group?', desc: 'Guides expectations regarding neuroadaptation and ocular surface status.', options: ['Under 45 years', '45 to 58 years', '59 to 70 years', 'Over 70 years', 'Not certain'] },
        { question: 'Do you have any previously diagnosed eye conditions?', desc: 'Conditions such as glaucoma or maculopathy influence which lens designs are suitable.', options: ['No diagnosed conditions (healthy eyes)', 'Glaucoma or elevated eye pressure', 'Diabetic retinopathy or macular condition', 'Keratoconus or severe chronic dry eye', 'Not certain (I would like a complete exam)'] },
        { question: 'What is your main visual priority day to day?', desc: 'Defines the viewing distance you rely on most.', options: ['Night driving and sharp distance vision with as few halos as possible', 'Computer work, laptops and the dashboard (intermediate range)', 'Smartphone use and book reading without reading glasses', 'As little dependence on glasses as possible'] },
        { question: 'Have you had previous laser vision correction (LASIK / PRK)?', desc: 'Eyes with previous refractive surgery need specialised lens calculations (e.g., Barrett True-K).', options: ['No previous surgery', 'Yes, prior Femto-LASIK or PRK', 'Yes, prior corneal cross-linking (CXL)', 'Not certain of my surgical history'] }
      ]
    }
  }[currentLang];

  if (qCompleted) {
    return `
      <div class="questionnaire">
        <div class="q-result" role="status">
          <p class="q-step-label">${tr('الملخص', 'Summary')}</p>
          <h3>${tr('ملخص أولوياتك البصرية جاهز', 'Your discussion summary is ready')}</h3>
          <p class="q-desc">${tr('بناءً على إجاباتك، هذه محاور يُستحسن مناقشتها خلال الاستشارة:', 'Based on your answers, these are topics worth raising in your consultation:')}</p>
          <ol class="q-result-list">
            <li class="q-result-item"><h4>${tr('الأولوية الوظيفية المستهدفة', 'Your visual focus')}</h4><p>${tr('الموازنة بين أنواع العدسات بحسب أولوياتك: نطاق الرؤية المطلوب، واحتمال الهالات الليلية، والحاجة المتوقعة للنظارة.', 'The trade-offs between lens types for your priorities: the range you need, the chance of night halos, and expected need for glasses.')}</p></li>
            <li class="q-result-item"><h4>${tr('فحص القرنية', 'Corneal imaging')}</h4><p>${tr('فحص البنتاكام (Pentacam) لاستبعاد الاستجماتيزم غير المنتظم والتأكد من ملاءمة العدسات متعددة البؤرة لسطح قرنيتك.', 'Pentacam tomography to check for irregular astigmatism before considering multifocal lens designs.')}</p></li>
            <li class="q-result-item"><h4>${tr('القرار النهائي', 'The final decision')}</h4><p>${tr('يُتخذ القرار بناءً على قياسات العين الحيوية وفحص قاع العين مع الطبيب.', 'Lens power is calculated from optical biometry together with a full clinical examination.')}</p></li>
          </ol>
          <div class="q-actions">
            <a href="${C.bookingUrl}" ${EXT} class="btn btn-primary" data-cta="book"><span class="btn-label">${tr('احجز موعد الفحص', 'Book an examination')}</span></a>
            <a href="${getWhatsAppUrl('مرحباً، أجريت استبيان نمط الحياة البصري على الموقع وأرغب بالاستفسار عن حجز موعد مع د. معن البري.')}" ${EXT} class="btn btn-whatsapp" data-cta="whatsapp">${glyph('whatsapp')}<span>${tr('واتساب', 'WhatsApp')}</span></a>
            <button type="button" class="btn btn-quiet" onclick="restartQ()">${tr('إعادة الاستبيان', 'Restart')}</button>
          </div>
          <p class="q-safety"><strong>${tr('تنبيه:', 'Note:')}</strong> ${tr('هذا الملخص تثقيفي فقط ولا يمثل تشخيصاً أو وصفة لنوع عدسة. القرار الطبي يتخذه الاستشاري بعد الفحص المباشر.', 'This summary is educational only and is not a diagnosis or a lens prescription. Treatment decisions follow an in-person examination.')}</p>
        </div>
      </div>`;
  }

  const cur = content.steps[currentQStep];
  return `
    <div class="questionnaire">
      <div class="q-progress" aria-hidden="true">${content.steps.map((_, i) => `<span class="step ${i < currentQStep ? 'done' : ''} ${i === currentQStep ? 'current' : ''}"></span>`).join('')}</div>
      <p class="q-step-label">${tr(`الخطوة ${currentQStep + 1} من 4`, `Step ${currentQStep + 1} of 4`)}</p>
      <h3 class="q-question">${cur.question}</h3>
      <p class="q-desc">${cur.desc}</p>
      <div class="q-options" role="group" aria-label="${cur.question}">
        ${cur.options.map((opt, i) => `<button type="button" class="q-option ${qAnswers[currentQStep] === i ? 'selected' : ''}" aria-pressed="${qAnswers[currentQStep] === i}" onclick="selectQOption(${i})"><span class="q-radio" aria-hidden="true"></span><span>${opt}</span></button>`).join('')}
      </div>
      <div class="q-nav">
        ${currentQStep > 0 ? `<button type="button" class="btn btn-quiet btn-sm" onclick="prevQStep()">${tr('السابق', 'Previous')}</button>` : '<span></span>'}
        <button type="button" class="btn btn-primary btn-sm" onclick="nextQStep()" ${qAnswers[currentQStep] === undefined ? 'disabled' : ''}>
          ${currentQStep < content.steps.length - 1 ? tr('التالي', 'Next') : tr('عرض الملخص', 'View summary')}
        </button>
      </div>
    </div>`;
}

function renderEducation() {
  const articles = [
    {
      id: 'cataract-guide', slug: 'cataract-surgery',
      t: tr('ما هي المياه البيضاء، ومتى تصبح الجراحة مناسبة؟', 'What is a cataract, and when is surgery considered?'),
      c: tr('المياه البيضاء ليست غشاءً فوق العين، بل عتامة تدريجية في العدسة الطبيعية خلف البؤبؤ تسبب الضبابية وبهتان الألوان والوهج ليلاً. لا تحتاج الجراحة فور اكتشافها؛ المعيار هو تأثير ضعف الرؤية على أنشطتك اليومية.',
        'A cataract is not a film over the eye but a gradual clouding of the natural lens behind the pupil, causing blur, faded colours and glare at night. Surgery is rarely urgent; the guide is how much reduced vision affects your daily activities.')
    },
    {
      id: 'keratoconus-guide', slug: 'keratoconus-cxl',
      t: tr('تغيّر مقاس النظارة باستمرار؟ اعرف عن القرنية المخروطية', 'Glasses keep changing? Learn about keratoconus'),
      c: tr('في القرنية المخروطية تترقق القرنية وتتحدب تدريجياً، وتظهر غالباً لدى الشباب. يساعد التصوير الطبقي للقرنية على اكتشافها مبكراً، ويُنصح بتجنب فرك العين.',
        'In keratoconus the cornea thins and bulges gradually, often in young people. Corneal tomography helps detect it early, and avoiding eye rubbing is advised.')
    },
    {
      id: 'lasik-candidacy', slug: 'laser-vision-correction',
      t: tr('هل يناسبني تصحيح الإبصار بالليزر؟', 'Is laser vision correction right for me?'),
      c: tr('من المعايير الشائعة: عمر 18 عاماً فأكثر، وثبات درجة النظر، وسماكة قرنية كافية، وسطح عين صحي. يُحسم القرار بعد تصوير القرنية والفحص الشامل.',
        'Common criteria include age 18 or over, a stable prescription, enough corneal thickness and a healthy eye surface. The decision follows corneal imaging and a full examination.')
    },
    {
      id: 'surgery-journey', slug: 'cataract-surgery',
      t: tr('ماذا تتوقع قبل الجراحة وفي يومها وبعدها؟', 'What to expect before, on the day and after surgery'),
      c: tr('قبل الجراحة: قياسات للعين ومناقشة الخيارات. يوم الجراحة: إجراء خارجي غالباً تحت تخدير موضعي. بعدها: قطرات حسب الجدول، وتجنب فرك العين، ومواعيد متابعة.',
        'Before: eye measurements and a discussion of options. On the day: usually an outpatient procedure under local anaesthetic. After: drops on schedule, no eye rubbing, and follow-up visits.')
    }
  ];
  const assess = [
    [tr('تصوير القرنية الطبقي', 'Corneal tomography'), tr('خريطة لشكل القرنية وسماكتها، أساسية قبل الليزر ولتشخيص القرنية المخروطية.', 'Maps corneal shape and thickness — essential before laser and for diagnosing keratoconus.')],
    [tr('القياسات البصرية الحيوية', 'Optical biometry'), tr('قياس طول العين وانحناء القرنية لحساب قوة العدسة المزروعة.', 'Measures the eye’s length and corneal curve to calculate an implant’s power.')],
    [tr('التصوير المقطعي للشبكية (OCT)', 'Retinal imaging (OCT)'), tr('صور مقطعية للبقعة والشبكية لتشخيص الحالات ومتابعة العلاج بالحقن.', 'Cross-sectional images of the macula and retina for diagnosis and to guide injections.')],
    [tr('فحص شامل للعين', 'Full eye examination'), tr('قياس النظر وضغط العين وفحص المصباح الشقي وقاع العين قبل أي قرار.', 'Vision, eye pressure, slit-lamp and retina checks before any decision.')]
  ];
  return `
  <section class="section" id="education">
    <div class="container">
      ${sectionHead(tr('التثقيف الصحي', 'Patient education'), tr('ما يفيد معرفته قبل موعدك', 'Worth knowing before your visit'),
        tr('إجابات قصيرة عن أكثر الأسئلة شيوعاً، مع روابط إلى صفحات الإجراءات للتفاصيل. محتوى توعوي عام لا يغني عن الفحص.', 'Short answers to common questions, with links to the procedure pages for detail. General education that does not replace an examination.'), 'section-head-split')}
      <div class="edu-grid">
        <div class="article-accordion fade-in">
          ${articles.map((a, i) => `
          <div class="article-item ${openArticleId === a.id ? 'open' : ''}" id="art-item-${a.id}">
            <h3 class="article-heading">
              <button type="button" class="article-trigger" onclick="toggleArticle('${a.id}')" aria-expanded="${openArticleId === a.id ? 'true' : 'false'}" aria-controls="art-content-${a.id}">
                <span class="article-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
                <span class="article-title">${a.t}</span>
                <span class="trigger-icon" aria-hidden="true">${icon('chevron', 20)}</span>
              </button>
            </h3>
            <div class="article-content" id="art-content-${a.id}" role="region">
              <p>${a.c}</p>
              <a href="${pageHref(currentLang, a.slug)}" data-nav class="text-link">${tr('اقرأ الدليل الكامل', 'Read the full guide')}: ${L(procedureBySlug(a.slug).name)}${icon('arrow', 16)}</a>
            </div>
          </div>`).join('')}
        </div>
        <aside class="red-flags fade-in" aria-labelledby="red-flags-title">
          <h3 id="red-flags-title">${icon('alert', 20)}<span>${tr('علامات تستوجب رعاية عاجلة', 'Seek urgent care for')}</span></h3>
          <ul>
            <li>${tr('فقدان مفاجئ أو تدهور سريع في الرؤية بأي من العينين.', 'Sudden loss or rapid worsening of vision in either eye.')}</li>
            <li>${tr('ألم شديد مفاجئ في العين مع احمرار أو صداع وغثيان.', 'Severe, sudden eye pain with redness, headache or nausea.')}</li>
            <li>${tr('ومضات ضوئية مفاجئة أو هطول كثيف لنقاط سوداء عائمة.', 'Sudden flashes of light or a shower of floating dark spots.')}</li>
            <li>${tr('ظل أو ستارة داكنة تغطي جزءاً من مجال الرؤية.', 'A dark shadow or curtain across part of your vision.')}</li>
          </ul>
          <p>${tr('توجّه فوراً إلى أقرب طوارئ عيون متخصصة.', 'Go to the nearest eye emergency department immediately.')}</p>
        </aside>
      </div>

      <div class="assess fade-in">
        <h3 class="sub-title">${tr('قبل أي إجراء: الفحوصات الأساسية', 'Before any procedure: the core assessments')}</h3>
        <ul class="tech-grid" aria-label="${tr('الفحوصات', 'Assessments')}">
          ${assess.map(([t, d], i) => `<li class="tech-item"><span class="tech-num" aria-hidden="true">${i + 1}</span><h4>${t}</h4><p>${d}</p></li>`).join('')}
        </ul>
      </div>

      <div class="q-layout" id="questionnaire">
        <div class="q-intro fade-in">
          <p class="kicker">${tr('استبيان نمط الحياة البصري', 'Visual lifestyle questionnaire')}</p>
          <h3>${tr('أربعة أسئلة قبل موعدك', 'Four questions before your visit')}</h3>
          <p>${tr('أداة تثقيفية تساعدك على ترتيب أولوياتك اليومية قبل جلسة الفحص والاستشارة. لا تُحفظ إجاباتك ولا تُرسل.', 'An educational tool to organise your daily priorities before your consultation. Your answers are not stored or sent.')}</p>
        </div>
        <div id="questionnaire-card-container" class="fade-in">${renderQuestionnaireCard()}</div>
      </div>
    </div>
  </section>`;
}

// 7. FAQ
function renderFaq() {
  return `
  <section class="section section-band" id="faq">
    <div class="container faq-grid">
      ${sectionHead(tr('الأسئلة الشائعة', 'Questions'), tr('أسئلة يطرحها المرضى كثيراً', 'Questions patients often ask'))}
      <div class="faq-list fade-in">
        ${FAQ.map((f, idx) => `
        <div class="faq-item" id="faq-${idx}">
          <h3 class="faq-heading">
            <button type="button" class="faq-question" onclick="toggleFaq(${idx})" aria-expanded="false" aria-controls="faq-answer-${idx}"><span>${L(f.q)}</span><span class="faq-icon" aria-hidden="true">${icon('plus', 20)}</span></button>
          </h3>
          <div class="faq-answer" id="faq-answer-${idx}" role="region"><p>${L(f.a)}</p></div>
        </div>`).join('')}
      </div>
    </div>
  </section>`;
}

// 8. Clinic location & contact
function renderClinic() {
  return `
  <section class="section" id="clinic">
    <div class="container">
      ${sectionHead(tr('العيادة والحجز', 'Clinic & booking'), tr('ثلاث طرق للوصول إلى موعدك', 'Three ways to your appointment'),
        tr(`يستقبل د. معن مراجعيه في ${D.clinic.name.ar}.`, `Dr. Maan sees patients at ${D.clinic.name.en}.`), 'section-head-split')}

      <div class="clinic-grid">
        <ol class="booking-ways fade-in">
          <li class="way way-featured">
            <span class="way-num" aria-hidden="true">1</span>
            <div class="way-body">
              <h3>${tr('الحجز الإلكتروني', 'Book online')}</h3>
              <p>${tr('عبر البوابة الرسمية لمستشفيات مغربي — اختر د. معن البري وموعداً مناسباً.', 'Through Magrabi’s official booking portal — choose Dr. Maan Al Barry and a suitable time.')}</p>
              <div class="clinic-cta-actions">
                <a href="${C.bookingUrl}" ${EXT} class="btn btn-primary" id="clinic-booking-cta" data-cta="book">
                  <span class="btn-label">${tr('الحجز عبر بوابة مغربي', 'Book on the Magrabi portal')}</span>${icon('external', 18)}
                </a>
              </div>
            </div>
          </li>
          <li class="way">
            <span class="way-num" aria-hidden="true">2</span>
            <div class="way-body">
              <h3>${tr('عيادة د. معن مباشرة — اتصال أو واتساب', 'Dr. Maan’s clinic — call or WhatsApp')}</h3>
              <p class="way-number"><bdi dir="ltr">${C.clinicDirect.display}</bdi></p>
              <div class="way-actions">
                <a href="tel:${C.clinicDirect.tel}" class="btn btn-quiet" data-cta="call">${icon('phone', 18)}<span>${tr('اتصال', 'Call')}</span></a>
                <a href="${getWhatsAppUrl()}" ${EXT} class="btn btn-whatsapp" data-cta="whatsapp">${glyph('whatsapp')}<span>${tr('واتساب', 'WhatsApp')}</span></a>
              </div>
            </div>
          </li>
          <li class="way">
            <span class="way-num" aria-hidden="true">3</span>
            <div class="way-body">
              <h3>${tr('مركز اتصال مغربي الصحية', 'Magrabi Health contact center')}</h3>
              <p class="contact-numbers">
                <a href="tel:${C.callCenter.tel}" class="contact-number" data-cta="call">${icon('phone', 16)}<bdi dir="ltr">${C.callCenter.display}</bdi></a>
                <a href="tel:${C.callCenterShort.tel}" class="contact-number" data-cta="call">${icon('phone', 16)}<bdi dir="ltr">${C.callCenterShort.display}</bdi></a>
              </p>
            </div>
          </li>
        </ol>

        <div class="visit fade-in">
          <div class="visit-row">
            <p class="visit-label">${icon('clock', 18)}<span>${tr('مواعيد العيادة', 'Clinic hours')}</span></p>
            <p class="visit-hours-text">${L(D.clinic.workingHours)}</p>
            <p class="visit-small">${tr('يُرجى تأكيد الموعد عبر الحجز، فقد يتغير الجدول.', 'Please confirm through booking, as the schedule can change.')}</p>
          </div>
          <div class="visit-row">
            <p class="visit-label">${icon('pin', 18)}<span>${tr('العنوان', 'Address')}</span></p>
            <p class="visit-strong">${L(D.clinic.name)}</p>
            <p class="visit-small">${L(D.clinic.address)}</p>
          </div>
          <div class="clinic-map">
            <iframe src="https://maps.google.com/maps?q=${D.clinic.mapEmbedQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed" title="${tr('خريطة موقع مستشفى مغربي المدينة المنورة', 'Map of Magrabi Eye Hospital, Madinah')}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
          <a href="${D.clinic.mapUrl}" ${EXT} class="text-link">${tr('الاتجاهات عبر خرائط جوجل', 'Directions in Google Maps')}${icon('external', 16)}</a>
          <p class="accreditation">${icon('shield', 20)}<span>${tr(
            `${D.clinic.name.ar} معتمد من الهيئة المشتركة الدولية (JCI) والمركز السعودي لاعتماد المنشآت الصحية (CBAHI).`,
            `${D.clinic.name.en} is accredited by Joint Commission International (JCI) and CBAHI.`)}</span></p>
        </div>
      </div>
    </div>
  </section>`;
}

// 9. Booking CTA
function renderCtaBanner() {
  return `
  <section class="closing" aria-labelledby="closing-title">
    <div class="container closing-inner fade-in">
      <div>
        <p class="kicker">${tr('مغربي المدينة المنورة · طريق المطار', 'Magrabi Madinah · Airport Road')}</p>
        <h2 id="closing-title">${tr('موعدك مع د. معن البري يبدأ بخطوة', 'Your appointment with Dr. Maan starts here')}</h2>
      </div>
      <div class="closing-actions">
        <a href="${C.bookingUrl}" ${EXT} class="btn btn-light btn-lg" id="cta-primary-btn" data-cta="book"><span class="btn-label">${tr('احجز موعداً', 'Book appointment')}</span>${icon('arrow', 18)}</a>
        <a href="${getWhatsAppUrl()}" ${EXT} class="btn btn-whatsapp btn-lg" data-cta="whatsapp">${glyph('whatsapp')}<span>${tr('واتساب العيادة', 'Clinic WhatsApp')}</span></a>
        <a href="${D.clinic.mapUrl}" ${EXT} class="btn btn-ghost-light btn-lg">${icon('pin', 18)}<span>${tr('موقع المستشفى', 'Hospital location')}</span></a>
      </div>
    </div>
  </section>`;
}

function renderHome() {
  return `
      ${renderHero()}
      ${renderProcedures()}
      ${renderProfile()}
      ${renderSimulator()}
      ${renderCataract3D()}
      ${renderEducation()}
      ${renderFaq()}
      ${renderClinic()}
      ${renderCtaBanner()}`;
}

// ============================================================
// PROCEDURE PAGE — /procedures/<slug>/ and /en/procedures/<slug>/
// ============================================================
const PROC_SECTIONS = [
  ['anatomy', 'التشريح: أين يحدث الإجراء؟', 'Anatomy: where it happens'],
  ['purpose', 'الهدف من الإجراء', 'What it is for'],
  ['types', 'الأنواع والخيارات', 'Types and options'],
  ['candidates', 'لمن قد يكون مناسباً؟', 'Who may be considered'],
  ['steps', 'ماذا يحدث؟ شرح مبسّط', 'What happens, in plain words'],
  ['benefits', 'الفوائد والحدود', 'Benefits and limitations'],
  ['risks', 'المخاطر والمضاعفات المحتملة', 'Risks and possible complications'],
  ['recovery', 'التعافي', 'Recovery'],
  ['faq', 'أسئلة شائعة', 'Questions']
];

function reviewStatus(cls = '') {
  return `<p class="review-status ${cls}" role="note">${icon('draft', 18)}<span><strong>${tr('حالة المراجعة الطبية:', 'Medical review status:')}</strong> ${tr('مسودة بانتظار مراجعة د. معن', 'draft pending review by Dr. Maan')}</span></p>`;
}

function renderProcedurePage(p) {
  const c = PROC && PROC.CONTENT[p.slug] ? PROC.CONTENT[p.slug][currentLang] : null;
  const g = groupOf(p.group);
  const sections = c ? PROC_SECTIONS.filter(([id]) => id !== 'types' || c.types) : [];
  const list = (items, cls = '') => `<ul class="bullets ${cls}">${items.map(t => `<li>${t}</li>`).join('')}</ul>`;
  const sec = (id, inner) => {
    const s = PROC_SECTIONS.find(x => x[0] === id);
    return `<section class="proc-sec" id="p-${id}" aria-labelledby="p-${id}-h"><h2 id="p-${id}-h">${tr(s[1], s[2])}</h2>${inner}</section>`;
  };
  const body = !c ? `<p class="proc-loading" role="status">${tr('جارٍ تحميل المحتوى…', 'Loading content…')}</p>` : `
        ${sec('anatomy', `<div class="anat"><p>${c.anatomy.text}</p><dl class="anat-parts">${c.anatomy.parts.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl></div>`)}
        ${sec('purpose', `<p class="proc-p-lg">${c.purpose}</p>`)}
        ${c.types ? sec('types', `<ul class="types">${c.types.map(([n, code, d]) => `<li class="type"><p class="type-code"><bdi dir="ltr">${code}</bdi></p><h3>${n}</h3><p>${d}</p></li>`).join('')}</ul>`) : ''}
        ${sec('candidates', `${list(c.candidates, 'bullets-check')}<p class="proc-note">${icon('info', 18)}<span>${tr('اعتبارات عامة فقط؛ يحدد الطبيب الملاءمة بعد فحص عينك.', 'General considerations only; suitability is decided by your doctor after examining your eye.')}</span></p>`)}
        ${sec('steps', `<ol class="steps">${c.steps.map((t, i) => `<li><span class="step-num" aria-hidden="true">${i + 1}</span><p>${t}</p></li>`).join('')}</ol>`)}
        ${sec('benefits', `<div class="two-col"><div class="pane pane-pos"><h3>${icon('check', 18)}${tr('الفوائد المحتملة', 'Possible benefits')}</h3>${list(c.benefits)}</div><div class="pane"><h3>${icon('minus', 18)}${tr('الحدود', 'Limitations')}</h3>${list(c.limitations)}</div></div>`)}
        ${sec('risks', `${list(c.risks)}<p class="proc-note proc-note-alert">${icon('alert', 18)}<span>${tr('تواصل مع العيادة فوراً عند ألم متزايد، أو احمرار شديد، أو تراجع مفاجئ في الرؤية.', 'Contact the clinic at once for increasing pain, marked redness or a sudden drop in vision.')}</span></p>`)}
        ${sec('recovery', list(c.recovery))}
        ${sec('faq', `<div class="faq-list">${c.faq.map((f, i) => `
          <div class="faq-item" id="pfaq-${i}">
            <h3 class="faq-heading"><button type="button" class="faq-question" onclick="toggleFaq(${i},'pfaq')" aria-expanded="false" aria-controls="pfaq-answer-${i}"><span>${f.q}</span><span class="faq-icon" aria-hidden="true">${icon('plus', 20)}</span></button></h3>
            <div class="faq-answer" id="pfaq-answer-${i}" role="region"><p>${f.a}</p></div>
          </div>`).join('')}</div>`)}
        <aside class="proc-sources">
          <h2 class="sub-title">${tr('المصادر والمراجعة', 'Sources and review')}</h2>
          <p>${tr('معلومات توعوية عامة أُعدت من مصادر طبية للمرضى، ولا تغني عن الفحص والاستشارة:', 'General patient education prepared from these patient-information sources; it does not replace an examination:')}</p>
          <ul>${(PROC.SOURCES[p.slug] || []).map(([label, url]) => `<li><a href="${url}" ${EXT} class="text-link">${label}${icon('external', 14)}</a></li>`).join('')}</ul>
          ${reviewStatus()}
        </aside>`;
  const related = p.related.map(procedureBySlug).filter(Boolean);
  return `
  <article class="proc-page" data-slug="${p.slug}">
    <header class="proc-hero">
      <div class="container">
        <nav class="crumbs" aria-label="${tr('مسار التنقل', 'Breadcrumb')}">
          <ol>
            <li><a href="${pageHref()}" data-nav>${tr('الرئيسية', 'Home')}</a></li>
            <li><a href="${secHref('procedures')}" data-nav>${tr('الإجراءات', 'Procedures')}</a></li>
            <li aria-current="page">${L(p.name)}</li>
          </ol>
        </nav>
        <div class="proc-hero-grid">
          <div class="proc-hero-text">
            <p class="kicker">${L(g)}</p>
            <h1 class="proc-title">${L(p.name)}</h1>
            <p class="proc-lede">${c ? c.intro : L(p.summary)}</p>
            ${reviewStatus('review-status-hero')}
            <div class="proc-cta">
              <a href="${C.bookingUrl}" ${EXT} class="btn btn-primary btn-lg" data-cta="book">${icon('calendar', 20)}<span class="btn-label">${tr('احجز استشارة مع د. معن', 'Book a consultation with Dr. Maan')}</span></a>
              <a href="${getWhatsAppUrl()}" ${EXT} class="btn btn-quiet btn-lg" data-cta="whatsapp">${glyph('whatsapp')}<span>${tr('اسأل عبر واتساب', 'Ask on WhatsApp')}</span></a>
            </div>
          </div>
          <figure class="proc-figure">
            ${illustration(p, { eager: true, cls: 'proc-hero-illus' })}
            <figcaption>${L(p.alt)}</figcaption>
          </figure>
        </div>
      </div>
    </header>

    <div class="container proc-layout">
      ${c ? `<nav class="proc-toc" aria-label="${tr('في هذه الصفحة', 'On this page')}">
        <p class="drawer-label">${tr('في هذه الصفحة', 'On this page')}</p>
        <ol>${sections.map(([id, ar, en]) => `<li><a href="${hereHref(`p-${id}`)}" data-nav>${tr(ar, en)}</a></li>`).join('')}${p.simulator ? `<li><a href="${hereHref('cataract-3d')}" data-nav>${tr('التجربة ثلاثية الأبعاد', '3D walkthrough')}</a></li>` : ''}</ol>
      </nav>` : ''}
      <div class="proc-body">${body}</div>
    </div>

    ${p.simulator ? renderCataract3D(true) : ''}

    <section class="section section-band proc-related" aria-labelledby="related-title">
      <div class="container">
        <header class="section-head"><p class="kicker">${tr('تابع القراءة', 'Keep reading')}</p><h2 id="related-title">${tr('إجراءات ذات صلة', 'Related procedures')}</h2></header>
        <div class="related-grid">${related.map(r => procCard(r, { compact: true })).join('')}</div>
      </div>
    </section>

    <section class="closing proc-book" aria-labelledby="proc-book-title">
      <div class="container closing-inner">
        <div>
          <p class="kicker">${tr('الخطوة التالية', 'Next step')}</p>
          <h2 id="proc-book-title">${tr(`ناقش ${p.name.ar} مع د. معن البري`, `Discuss ${p.name.en.toLowerCase().startsWith('icl') ? p.name.en : p.name.en.charAt(0).toLowerCase() + p.name.en.slice(1)} with Dr. Maan Al Barry`)}</h2>
          <p class="closing-sub">${tr('يبدأ كل قرار علاجي بفحص شامل لعينك.', 'Every treatment decision starts with a full examination of your eye.')}</p>
        </div>
        <div class="closing-actions">
          <a href="${C.bookingUrl}" ${EXT} class="btn btn-light btn-lg" data-cta="book"><span class="btn-label">${tr('احجز موعداً', 'Book appointment')}</span>${icon('arrow', 18)}</a>
          <a href="tel:${C.clinicDirect.tel}" class="btn btn-ghost-light btn-lg" data-cta="call">${icon('phone', 18)}<span><bdi dir="ltr">${C.clinicDirect.display}</bdi></span></a>
          <a href="${D.clinic.mapUrl}" ${EXT} class="btn btn-ghost-light btn-lg">${icon('pin', 18)}<span>${tr('موقع المستشفى', 'Hospital location')}</span></a>
        </div>
      </div>
    </section>
  </article>`;
}

// --- FOOTER ---
function renderFooter() {
  const navLink = id => { const [, ar, en] = DRAWER_NAV.find(n => n[0] === id); return `<a href="${secHref(id)}" data-nav>${tr(ar, en)}</a>`; };
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <p class="footer-name">${L(D.identity.name)}</p>
          <p class="footer-title">${L(D.identity.title)}</p>
          <div class="social-row">
            <a href="${D.social.instagram}" ${EXT} class="icon-btn" aria-label="Instagram">${glyph('instagram')}</a>
            <a href="${D.social.twitter}" ${EXT} class="icon-btn" aria-label="X (Twitter)">${glyph('x', 16)}</a>
            <a href="${D.social.youtube}" ${EXT} class="icon-btn" aria-label="YouTube">${glyph('youtube')}</a>
            <a href="${getWhatsAppUrl()}" ${EXT} class="icon-btn" aria-label="WhatsApp" data-cta="whatsapp">${glyph('whatsapp')}</a>
          </div>
        </div>
        <nav class="footer-col" aria-label="${tr('الإجراءات', 'Procedures')}">
          <h3>${tr('الإجراءات', 'Procedures')}</h3>
          ${PROCEDURES.map(p => `<a href="${pageHref(currentLang, p.slug)}" data-nav>${L(p.name)}</a>`).join('')}
        </nav>
        <nav class="footer-col" aria-label="${tr('روابط الموقع', 'Site links')}">
          <h3>${tr('المحتويات', 'Contents')}</h3>
          ${['profile', 'simulator', 'cataract-3d', 'education', 'faq', 'clinic'].map(navLink).join('')}
        </nav>
        <div class="footer-col">
          <h3>${tr('التواصل', 'Contact')}</h3>
          <a href="tel:${C.clinicDirect.tel}" data-cta="call">${tr('عيادة الدكتور: ', 'Clinic line: ')}<bdi dir="ltr">${C.clinicDirect.display}</bdi></a>
          <a href="tel:${C.callCenter.tel}" data-cta="call">${tr('مركز اتصال مغربي: ', 'Magrabi contact center: ')}<bdi dir="ltr">${C.callCenter.display}</bdi></a>
          <a href="${C.bookingUrl}" ${EXT}>${tr('بوابة الحجز الإلكتروني', 'Online booking')}</a>
          <a href="${D.clinic.mapUrl}" ${EXT}>${tr('مغربي طريق المطار (خرائط جوجل)', 'Airport Road, Madinah (Maps)')}</a>
        </div>
      </div>

      <p class="footer-disclaimer"><strong>${tr('إخلاء مسؤولية طبي:', 'Medical disclaimer:')}</strong> ${tr(
        'المحتوى المنشور على هذا الموقع مخصص للتوعية الطبية العامة، ولا يُعد بديلاً عن الفحص السريري المباشر والتشخيص لدى طبيب العيون.',
        'Content on this website is for general education only and does not replace an in-person clinical examination and diagnosis by an ophthalmologist.')}</p>

      <div class="footer-bottom">
        <p>© ${new Date().getFullYear()} ${L(D.identity.name)} — ${tr('جميع الحقوق محفوظة', 'All rights reserved')}</p>
        <p class="footer-links">
          <a href="${D.social.magrabiProfile}" ${EXT}>${tr('الملف الطبي في مغربي', 'Magrabi profile')}</a>
          <a href="${D.social.taibahProfile}" ${EXT}>${tr('ملف جامعة طيبة', 'Taibah University profile')}</a>
          <a href="${D.clinic.mapUrl}" ${EXT}>Google Maps</a>
        </p>
      </div>
    </div>
  </footer>`;
}

// --- FIXED MOBILE BOOKING BAR ---
// Three primary actions only (book, call, WhatsApp). Maps stays reachable from the clinic section,
// the closing band, the drawer and the footer.
function renderBookingBar() {
  const call = C.callCenter;
  return `
  <nav class="booking-bar" id="booking-bar" aria-label="${tr('إجراءات الحجز السريعة', 'Quick booking actions')}">
    <div class="booking-bar-inner">
      <a href="${C.bookingUrl}" ${EXT} class="booking-action booking-action-book" data-cta="book">${icon('calendar', 20)}<span>${tr('احجز موعداً', 'Book')}</span></a>
      <a href="tel:${call.tel}" class="booking-action booking-action-call" data-cta="call" aria-label="${tr(`اتصال بمركز اتصال مغربي ${call.display}`, `Call Magrabi contact center ${call.display}`)}">${icon('phone', 20)}<span>${tr('اتصال', 'Call')}</span></a>
      <a href="${getWhatsAppUrl()}" ${EXT} class="booking-action booking-action-whatsapp" data-cta="whatsapp" aria-label="${tr('واتساب عيادة د. معن', 'Dr. Maan’s clinic on WhatsApp')}">${glyph('whatsapp', 20)}<span>${tr('واتساب', 'WhatsApp')}</span></a>
    </div>
  </nav>`;
}

// --- HEAD METADATA (client-side navigation keeps it in step with the prerendered pages) ---
function updateHead(full) {
  const meta = pageMeta(currentLang, route.slug);
  document.title = meta.title;
  if (!full) return;
  const set = (sel, attr, val) => { const el = document.querySelector(sel); if (el) el.setAttribute(attr, val); };
  const url = (lang, slug = route.slug) => `${SITE_URL}/${pathFor(lang, slug)}`;
  set('meta[name="description"]', 'content', meta.description);
  set('link[rel="canonical"]', 'href', url(currentLang));
  set('link[rel="alternate"][hreflang="ar"]', 'href', url('ar'));
  set('link[rel="alternate"][hreflang="en"]', 'href', url('en'));
  set('link[rel="alternate"][hreflang="x-default"]', 'href', url('ar'));
  set('meta[property="og:url"]', 'content', url(currentLang));
  set('meta[property="og:title"]', 'content', meta.title);
  set('meta[property="og:description"]', 'content', meta.description);
  set('meta[name="twitter:title"]', 'content', meta.title);
  set('meta[name="twitter:description"]', 'content', meta.description);
  set('meta[property="og:locale"]', 'content', currentLang === 'ar' ? 'ar_SA' : 'en_US');
  set('meta[property="og:locale:alternate"]', 'content', currentLang === 'ar' ? 'en_US' : 'ar_SA');
  const ld = document.querySelector('script[type="application/ld+json"]');
  if (ld) {
    const faq = route.slug && PROC ? PROC.CONTENT[route.slug][currentLang].faq : [];
    ld.textContent = JSON.stringify(route.slug ? buildProcedureJsonLd(route.slug, currentLang, url(currentLang), SITE_URL, faq) : buildJsonLd(), null, 2);
  }
}

// --- THEME ---
function applyTheme() {
  const theme = resolvedTheme();
  document.documentElement.setAttribute('data-theme', theme);
  const isDark = theme === 'dark';
  const label = isDark ? tr('الوضع الليلي مفعّل، انقر للتحويل للوضع النهاري', 'Dark mode on. Switch to light mode')
    : tr('الوضع النهاري مفعّل، انقر للتحويل للوضع الليلي', 'Light mode on. Switch to dark mode');
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.setAttribute('aria-checked', String(isDark));
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  });
  // procedure renders have a dark-studio variant
  document.querySelectorAll('.illus img[data-dark]').forEach(img => {
    const want = isDark ? img.dataset.dark : img.dataset.light;
    if (img.getAttribute('src') !== want) img.setAttribute('src', want);
  });
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', isDark ? '#0E1716' : '#F4F6F5');
  if (c3d.controller && typeof c3d.controller.setTheme === 'function') {
    try { c3d.controller.setTheme(theme); } catch (e) { /* module handles its own errors */ }
  }
}

darkQuery.addEventListener('change', () => { if (!savedTheme) applyTheme(); });

window.toggleTheme = function () {
  savedTheme = resolvedTheme() === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', savedTheme); } catch (e) { /* storage unavailable: session-only */ }
  applyTheme();
};
window.cycleTheme = window.toggleTheme;

// --- LANGUAGE: switches to the same page in the other language (its own URL) ---
window.toggleLang = function () {
  const lang = currentLang === 'ar' ? 'en' : 'ar';
  try { localStorage.setItem('lang', lang); } catch (e) { /* storage unavailable: session-only */ }
  currentQStep = 0;
  qAnswers = [];
  qCompleted = false;
  openArticleId = null;
  go({ lang, slug: route.slug }, { scrollTo: 0 });
};

// --- CLIENT-SIDE NAVIGATION ---
// Commit a route: push history, re-render, then scroll (to a section, a saved position or the top).
function go(next, { push = true, hash = '', scrollTo = null } = {}) {
  const commit = () => {
    const changed = next.lang !== route.lang || next.slug !== route.slug;
    if (changed) {
      if (push) {
        history.replaceState({ ...(history.state || {}), y: window.scrollY }, '');
        history.pushState({ y: 0 }, '', new URL(pathFor(next.lang, next.slug) + hash, SITE_ROOT));
      }
      route = { lang: next.lang, slug: next.slug, known: true };
      currentLang = next.lang;
      if (!route.slug) currentActiveNavId = hash ? hash.slice(1) : 'home';
      renderApp(true);
    } else if (push && hash) {
      history.replaceState(history.state, '', new URL(pathFor(next.lang, next.slug) + hash, SITE_ROOT));
    }
    const target = hash ? hash.slice(1) : null;
    if (target && document.getElementById(target)) {
      requestAnimationFrame(() => window.scrollToSection(target));
    } else if (changed || scrollTo !== null) {
      window.scrollTo(0, scrollTo || 0);
      if (changed && push) document.querySelector('main h1, #main')?.focus({ preventScroll: true });
    }
  };
  if (next.slug && !PROC) loadProcedureContent().then(commit, commit); else commit();
}

// One delegated handler for every internal link (data-nav): header, drawer, cards, breadcrumbs, TOC.
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[data-nav]');
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const rel = relOf(a.href);
  if (rel === null) return;
  e.preventDefault();
  setMobileMenu(false);
  const next = parseRoute(rel);
  go(next, { hash: new URL(a.href).hash });
});

window.addEventListener('popstate', e => {
  const next = parseRoute(relOf(location.href) || '');
  const y = e.state && typeof e.state.y === 'number' ? e.state.y : 0;
  const hash = location.hash;
  if (next.lang === route.lang && next.slug === route.slug) {
    if (hash && document.getElementById(hash.slice(1))) window.scrollToSection(hash.slice(1));
    return;
  }
  go(next, { push: false, scrollTo: y });
  // restore the reading position once the page has rendered
  requestAnimationFrame(() => window.scrollTo(0, y));
});

// --- ACTIVE SECTION TRACKER & SCROLLSPY ---
window.setActiveNav = function (id) {
  if (!id) return;
  currentActiveNavId = id;
  document.querySelectorAll('.nav-links a, .mobile-nav a[data-section]').forEach(a => {
    const on = isHome() && a.dataset.section === id;
    a.classList.toggle('active', on);
    if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
  });
};

window.scrollToSection = function (id) {
  const el = document.getElementById(id);
  if (!el) return;
  window.setActiveNav(id);
  isClickScrolling = true;
  clearTimeout(clickScrollTimer);
  clickScrollTimer = setTimeout(() => { isClickScrolling = false; }, 850);
  const headerOffset = document.getElementById('site-header')?.offsetHeight || 68;
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset - 8;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
};

function initScrollSpy() {
  function checkScroll() {
    if (isClickScrolling || !isHome()) return;
    const scrollY = window.scrollY;
    const headerHeight = document.getElementById('site-header')?.offsetHeight || 68;
    const scrollPos = scrollY + headerHeight + 120;
    if ((window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 70)) { window.setActiveNav('clinic'); return; }
    if (scrollY < 180) { window.setActiveNav('home'); return; }
    let activeId = 'home';
    for (const sectionId of NAV_SECTION_IDS) {
      const el = document.getElementById(sectionId);
      if (el && el.getBoundingClientRect().top + window.scrollY <= scrollPos) activeId = sectionId;
    }
    window.setActiveNav(activeId);
  }
  if (window.__scrollSpyHandler) window.removeEventListener('scroll', window.__scrollSpyHandler);
  window.__scrollSpyHandler = () => { window.requestAnimationFrame(checkScroll); };
  window.addEventListener('scroll', window.__scrollSpyHandler, { passive: true });
  checkScroll();
}

// --- MOBILE DRAWER ---
function setMobileMenu(open) {
  const nav = document.getElementById('mobile-nav');
  if (!nav) return;
  nav.classList.toggle('open', open);
  document.documentElement.classList.toggle('drawer-open', open);
  document.querySelectorAll('.mobile-menu-btn').forEach(b => b.setAttribute('aria-expanded', String(open)));
}

window.toggleMobileMenu = function () {
  const nav = document.getElementById('mobile-nav');
  setMobileMenu(!(nav && nav.classList.contains('open')));
};

window.closeMobileMenu = function () { setMobileMenu(false); };

// Escape closes the drawer and returns focus to its button (registered once; survives re-renders).
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const nav = document.getElementById('mobile-nav');
  if (nav && nav.classList.contains('open')) {
    setMobileMenu(false);
    const btn = document.querySelector('.mobile-menu-btn');
    if (btn) btn.focus();
  }
});

// --- PROCEDURE GALLERY FILTER ---
window.filterProcedures = function (id) {
  procFilter = id;
  const grid = document.querySelector('.proc-grid');
  if (grid) grid.dataset.filter = id;
  document.querySelectorAll('.proc-filter .chip').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === id)));
  document.querySelectorAll('.proc-grid .proc-card').forEach(card => { card.hidden = id !== 'all' && card.dataset.group !== id; });
};

// --- QUESTIONNAIRE ---
window.updateQuestionnaireUI = function () {
  const container = document.getElementById('questionnaire-card-container');
  if (container) container.innerHTML = renderQuestionnaireCard();
};
window.selectQOption = function (optIdx) { qAnswers[currentQStep] = optIdx; window.updateQuestionnaireUI(); };
window.nextQStep = function () {
  if (qAnswers[currentQStep] === undefined) return;
  if (currentQStep < 3) currentQStep++; else qCompleted = true;
  window.updateQuestionnaireUI();
};
window.prevQStep = function () { if (currentQStep > 0) { currentQStep--; window.updateQuestionnaireUI(); } };
window.restartQ = function () { currentQStep = 0; qAnswers = []; qCompleted = false; window.updateQuestionnaireUI(); };

// --- ACCORDIONS ---
window.toggleArticle = function (id) {
  openArticleId = (openArticleId === id ? null : id);
  const el = document.getElementById(`art-item-${id}`);
  if (el) {
    const open = el.classList.toggle('open');
    const btn = el.querySelector('.article-trigger');
    if (btn) btn.setAttribute('aria-expanded', String(open));
  }
};

window.toggleFaq = function (idx, prefix = 'faq') {
  const item = document.getElementById(`${prefix}-${idx}`);
  if (item) {
    const open = item.classList.toggle('open');
    const btn = item.querySelector('.faq-question');
    if (btn) btn.setAttribute('aria-expanded', String(open));
  }
};

// --- REVEAL ON SCROLL ---
let fadeObserver = null;
function observeIntersection() {
  if (fadeObserver) fadeObserver.disconnect();
  const observer = fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function headerScrollShadow() {
  // renderApp() runs again on every navigation; register the listener only once.
  if (window.__headerShadowBound) return;
  window.__headerShadowBound = true;
  window.addEventListener('scroll', () => {
    const header = document.getElementById('site-header');
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  }, { passive: true });
}

// --- MASTER APPLICATION RENDERER ---
// `navigated` = true after a client-side route change (head metadata is rewritten then; on the
// first render the prerendered head is already correct for this URL).
function renderApp(navigated = false) {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = (currentLang === 'ar' ? 'rtl' : 'ltr');
  document.body.className = `${currentLang === 'en' ? 'lang-en' : 'lang-ar'} ${route.slug ? 'is-procedure' : 'is-home'}`;
  updateHead(navigated);

  const app = document.getElementById('app');
  if (!app) return;

  // Keep a running 3D scene alive across the re-render: detach its host, re-insert it afterwards.
  if (c3d.host) c3d.host.remove();
  setMobileMenu(false);

  const proc = route.slug ? procedureBySlug(route.slug) : null;
  app.innerHTML = `
    <a class="skip-link" href="${hereHref('main')}">${tr('تخطَّ إلى المحتوى', 'Skip to content')}</a>
    ${renderHeader()}
    <main id="main" tabindex="-1">
      ${proc ? renderProcedurePage(proc) : renderHome()}
    </main>
    ${renderFooter()}
    ${renderBookingBar()}
  `;

  applyTheme();
  observeIntersection();
  headerScrollShadow();
  initScrollSpy();
  if (!proc) window.filterProcedures(procFilter);
  window.setActiveNav(currentActiveNavId);

  // 3D: survives re-renders on pages that host it; torn down when the visitor leaves them.
  if ((c3d.state === 'active' || c3d.state === 'loading') && !document.getElementById('cataract-3d-stage')) closeCataract3D(false);
  c3dSync();
  if (c3d.controller && typeof c3d.controller.setLang === 'function') {
    try { c3d.controller.setLang(currentLang); } catch (e) { /* module handles its own errors */ }
  }

  const simHost = document.querySelector('[data-vision-host]');
  if (simHost && window.VisionSim) VisionSim.mount(simHost, { lang: currentLang });
  else if (window.VisionSim) VisionSim.destroy();

  if (proc && !PROC) loadProcedureContent().then(() => { if (route.slug === proc.slug) renderApp(navigated); }, () => {});
}

// Initialize: on a procedure URL, wait for its content so the prerendered page is replaced only
// by an equally complete one (no flash of a loading state).
if (route.slug) loadProcedureContent().then(() => renderApp(false), () => renderApp(false));
else renderApp(false);
