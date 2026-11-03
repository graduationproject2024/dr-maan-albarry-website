// Vision simulator — the three depth layers drawn with three.js.
//   distance     : a street with a road sign, buildings, street lamps and cars (6 m+)
//   intermediate : a laptop on a table (66 cm)
//   near         : a phone held in the hand (40 cm)
// All layers share ONE perspective camera, so angular sizes are physically consistent across layers and the
// optics model's blur angles convert to pixels through the same focal length. Everything is deterministic
// (seeded pseudo-random numbers, no time-based animation).
import * as THREE from 'three';
import { VIEWING } from './optics/params.js';

const DEG = Math.PI / 180;
const EYE_HEIGHT = 1.25; // metres above the road (seated on a raised terrace)

function seeded(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const PALETTE = {
  day: {
    skyTop: '#6f9fcf', skyHorizon: '#d9e6ef', ground: '#7d8076', road: '#55585e', walk: '#a7a39a', line: '#f2f2ee',
    building: ['#c9b9a1', '#b7a58c', '#d8cbb6', '#a99a86', '#c2b5a4'], window: '#5e6d7a', windowLit: null,
    pole: '#3b4148', table: ['#a07850', '#6e4e30'], body: '#9aa1a8', bezel: '#1c1f24', screenDim: 1, sign: ['#13804f', '#0b5c38'], signInk: '#ffffff',
    car: ['#a8b0b8', '#5d6f86', '#8c2f2f', '#d9d6cf'], lampsOn: false, headlights: false, ambient: 1,
  },
  dusk: {
    skyTop: '#2a3a68', skyHorizon: '#e3a070', ground: '#3b3a3c', road: '#38393f', walk: '#5f5c5a', line: '#c9c6bd',
    building: ['#6d6060', '#5d5153', '#776a66', '#544a4c', '#685d5a'], window: '#3a3f4a', windowLit: '#f6c987',
    pole: '#22262c', table: ['#7a5a3c', '#4a3422'], body: '#6b7178', bezel: '#15171b', screenDim: 0.92, sign: ['#0f6a42', '#094a2e'], signInk: '#f1f1ea',
    car: ['#6e747b', '#3d4a5c', '#5e2222', '#9d9a94'], lampsOn: true, headlights: true, ambient: 0.62,
  },
  night: {
    skyTop: '#03060f', skyHorizon: '#1b2338', ground: '#0d0f13', road: '#17191e', walk: '#24252a', line: '#6f6f6a',
    building: ['#16181e', '#1b1d24', '#121419', '#1e2028', '#17191f'], window: '#0f1116', windowLit: '#ffc978',
    pole: '#0d0f12', table: ['#3a2a1d', '#21170f'], body: '#2f3338', bezel: '#0b0c0e', screenDim: 0.85, sign: ['#0b4e31', '#073823'], signInk: '#c9d3cc',
    car: ['#22252a', '#1a202a', '#2a1414', '#3a3936'], lampsOn: true, headlights: true, ambient: 0.32,
  },
};

const TEXT = {
  ar: {
    signTop: 'وسط المدينة', signBottom: '٣ كم',
    laptopTitle: 'العناية بالعين بعد العملية', laptopLines: ['استخدم القطرات حسب تعليمات الطبيب', 'تجنّب فرك العين في الأسابيع الأولى', 'راجع العيادة في الموعد المحدد', 'ارتدِ النظارة الواقية عند النوم'],
    phoneTime: '٩:٤١', phoneTitle: 'رسالة جديدة', phoneLines: ['موعد المراجعة', 'الأحد ١٠:٣٠ صباحاً', 'العيادة الخارجية', 'الطابق الثاني'],
    dir: 'rtl', font: '"IBM Plex Sans Arabic", "Noto Sans Arabic", "Segoe UI", Tahoma, sans-serif',
  },
  en: {
    signTop: 'City Centre', signBottom: '3 km',
    laptopTitle: 'Eye care after surgery', laptopLines: ['Use your drops as your doctor advised', 'Avoid rubbing the eye for a few weeks', 'Keep your follow-up appointment', 'Wear the eye shield while sleeping'],
    phoneTime: '9:41', phoneTitle: 'New message', phoneLines: ['Follow-up visit', 'Sunday 10:30 am', 'Outpatient clinic', 'Second floor'],
    dir: 'ltr', font: '"Inter", "Segoe UI", system-ui, sans-serif',
  },
};

function canvasTexture(w, h, draw, track) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  track.push(t);
  return t;
}

/** Place an object at a visual direction (azimuth right +, elevation up +) and distance from the eye. */
function placeAt(obj, distM, azDeg, elDeg) {
  const az = azDeg * DEG, el = elDeg * DEG;
  obj.position.set(distM * Math.sin(az) * Math.cos(el), distM * Math.sin(el), -distM * Math.cos(az) * Math.cos(el));
  obj.lookAt(0, 0, 0);
  return obj;
}

export function createCamera(aspect) {
  const cam = new THREE.PerspectiveCamera(VIEWING.vFovDeg, aspect, 0.05, 900);
  cam.position.set(0, 0, 0);
  cam.lookAt(0, 0, -1);
  return cam;
}

/**
 * Build the three layer scenes for a lighting condition and language.
 * Returns { scenes: {distance, intermediate, near}, lights: [{position, color, intensity, coreDeg}], dispose }.
 */
export function buildScenes({ lighting = 'day', lang = 'en', aspect = 1.6 }) {
  const P = PALETTE[lighting] || PALETTE.day;
  const T = TEXT[lang] || TEXT.en;
  const tex = [], geos = [], mats = [];
  const rnd = seeded(20261101);
  // Horizontal half-field (deg). On narrow frames the laptop (≈26° wide) and the phone (≈10°) are fitted to the field
  // so they never overlap down to a 7:6 frame; at 16:10 this gives exactly the original -9° / 13.5° placement.
  const hf = Math.atan(Math.tan((VIEWING.vFovDeg / 2) * DEG) * aspect) / DEG;
  const laptopAz = -Math.max(0, Math.min(9, hf - 13.4));
  const phoneAz = Math.max(0, Math.min(13.5, hf - 5.6));
  const basic = (opts) => { const m = new THREE.MeshBasicMaterial(opts); mats.push(m); return m; };
  const geo = (g) => { geos.push(g); return g; };
  const mesh = (g, m) => new THREE.Mesh(geo(g), m);
  const col = (hex, f = 1) => new THREE.Color(hex).multiplyScalar(f);

  // ---------------- distance layer ----------------
  const far = new THREE.Scene();
  const lights = [];
  const amb = P.ambient;
  const sky = mesh(new THREE.PlaneGeometry(1400, 700), basic({
    map: canvasTexture(16, 512, (x, w, h) => {
      const g = x.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, P.skyTop); g.addColorStop(0.92, P.skyHorizon); g.addColorStop(1, P.skyHorizon);
      x.fillStyle = g; x.fillRect(0, 0, w, h);
    }, tex), depthWrite: false,
  }));
  sky.position.set(0, 300 - EYE_HEIGHT, -800);
  far.add(sky);
  const ground = mesh(new THREE.PlaneGeometry(1600, 900), basic({ color: col(P.ground) }));
  ground.rotation.x = -Math.PI / 2; ground.position.set(0, -EYE_HEIGHT - 0.02, -450);
  far.add(ground);
  // road with lane markings
  const roadTex = canvasTexture(256, 1024, (x, w, h) => {
    x.fillStyle = P.road; x.fillRect(0, 0, w, h);
    const r2 = seeded(7);
    for (let i = 0; i < 2600; i++) { const v = r2() * 0.18; x.fillStyle = `rgba(255,255,255,${v * 0.25})`; x.fillRect(r2() * w, r2() * h, 1.4, 1.4); }
    x.fillStyle = P.line;
    x.fillRect(6, 0, 6, h); x.fillRect(w - 12, 0, 6, h);
    for (let y = 0; y < h; y += 256) x.fillRect(w / 2 - 3, y, 6, 110);
  }, tex);
  roadTex.wrapT = THREE.RepeatWrapping; roadTex.repeat.set(1, 30);
  const road = mesh(new THREE.PlaneGeometry(9, 600), basic({ map: roadTex, color: col('#ffffff', amb > 0.9 ? 1 : 0.9) }));
  road.rotation.x = -Math.PI / 2; road.position.set(0.6, -EYE_HEIGHT, -303);
  far.add(road);
  for (const sx of [-5.6, 6.8]) {
    const walk = mesh(new THREE.PlaneGeometry(3.4, 600), basic({ color: col(P.walk) }));
    walk.rotation.x = -Math.PI / 2; walk.position.set(sx, -EYE_HEIGHT + 0.12, -303);
    far.add(walk);
  }
  // buildings (two rows) with window textures
  const facade = (lit) => canvasTexture(256, 512, (x, w, h) => {
    x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h);
    const r3 = seeded(lit ? 11 : 13);
    for (let y = 18; y < h - 20; y += 44) for (let xx = 14; xx < w - 20; xx += 40) {
      const on = lit && r3() < 0.38;
      x.fillStyle = on ? P.windowLit : P.window;
      x.fillRect(xx, y, 24, 28);
    }
  }, tex);
  const facadeTex = facade(!!P.windowLit);
  for (const side of [-1, 1]) {
    let z = -9;
    while (z > -260) {
      const w = 8 + rnd() * 10, hgt = 9 + rnd() * 22, d = 8;
      const c = P.building[Math.floor(rnd() * P.building.length)];
      const m = basic({ map: facadeTex, color: col(c, side < 0 ? 0.92 : 1) });
      const b = mesh(new THREE.BoxGeometry(d, hgt, w), m);
      b.position.set(side * (9.6 + d / 2 + rnd() * 1.5), -EYE_HEIGHT + hgt / 2, z - w / 2);
      far.add(b);
      z -= w + 1 + rnd() * 3;
    }
  }
  // street lamps
  const poleMat = basic({ color: col(P.pole) });
  const headMat = basic({ color: P.lampsOn ? col('#ffe2b0', 1.4) : col('#d8d8d0') });
  for (let i = 0; i < 9; i++) {
    for (const side of [-1, 1]) {
      const z = -8 - i * 22 - (side > 0 ? 11 : 0);
      const x = side * 5.6 + (side > 0 ? 1.2 : 0);
      const pole = mesh(new THREE.BoxGeometry(0.16, 7.5, 0.16), poleMat);
      pole.position.set(x, -EYE_HEIGHT + 3.75, z); far.add(pole);
      const arm = mesh(new THREE.BoxGeometry(1.6, 0.1, 0.1), poleMat);
      arm.position.set(x - side * 0.8, -EYE_HEIGHT + 7.45, z); far.add(arm);
      const head = mesh(new THREE.BoxGeometry(0.6, 0.12, 0.3), headMat);
      head.position.set(x - side * 1.5, -EYE_HEIGHT + 7.35, z); far.add(head);
      if (P.lampsOn) lights.push({ position: new THREE.Vector3(x - side * 1.5, -EYE_HEIGHT + 7.27, z), color: [1.0, 0.78, 0.48], intensity: lighting === 'night' ? 1 : 0.55, coreDeg: 0.16 });
    }
  }
  // cars: two ahead (tail lights), two oncoming (headlights)
  const car = (x, z, colour, oncoming) => {
    const g = new THREE.Group();
    const bodyM = basic({ color: col(colour) });
    const glass = basic({ color: col('#20262e') });
    const b1 = mesh(new THREE.BoxGeometry(1.8, 0.7, 4.3), bodyM); b1.position.y = 0.55; g.add(b1);
    const b2 = mesh(new THREE.BoxGeometry(1.55, 0.55, 2.2), glass); b2.position.set(0, 1.15, 0.2); g.add(b2);
    g.position.set(x, -EYE_HEIGHT, z);
    far.add(g);
    const zFace = oncoming ? z + 2.16 : z + 2.16;
    for (const dx of [-0.66, 0.66]) {
      const lamp = mesh(new THREE.BoxGeometry(0.34, 0.14, 0.04), basic({ color: oncoming ? col('#f4f1e6') : col('#b0201c') }));
      lamp.position.set(x + dx, -EYE_HEIGHT + 0.72, zFace); far.add(lamp);
      if (P.headlights) lights.push({ position: new THREE.Vector3(x + dx, -EYE_HEIGHT + 0.72, zFace + 0.03), color: oncoming ? [1, 0.97, 0.9] : [1, 0.12, 0.08], intensity: oncoming ? 1.4 : 0.5, coreDeg: oncoming ? 0.22 : 0.14 });
    }
  };
  car(-0.9, -26, P.car[0], false);
  car(2.4, -48, P.car[2], false);
  car(-2.9, -38, P.car[1], true);
  car(-3.0, -82, P.car[3], true);
  // road sign gantry (the "distance" reading target)
  const sign = new THREE.Group();
  const signTex = canvasTexture(1024, 360, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, P.sign[0]); g.addColorStop(1, P.sign[1]);
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.strokeStyle = P.signInk; x.lineWidth = 10; x.strokeRect(16, 16, w - 32, h - 32);
    x.fillStyle = P.signInk; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.direction = T.dir; x.font = `600 118px ${T.font}`;
    x.fillText(T.signTop, w * 0.57, h * 0.40);
    x.font = `500 66px ${T.font}`;
    x.fillText(T.signBottom, w * 0.57, h * 0.76);
    const ax = w * 0.12, ay = h * 0.5, u = h * 0.17; // up arrow
    x.beginPath(); x.moveTo(ax, ay - u * 1.4); x.lineTo(ax + u, ay - u * 0.2); x.lineTo(ax + u * 0.36, ay - u * 0.2);
    x.lineTo(ax + u * 0.36, ay + u * 1.4); x.lineTo(ax - u * 0.36, ay + u * 1.4); x.lineTo(ax - u * 0.36, ay - u * 0.2); x.lineTo(ax - u, ay - u * 0.2); x.closePath(); x.fill();
  }, tex);
  const signPanel = mesh(new THREE.PlaneGeometry(4.6, 1.62), basic({ map: signTex, color: col('#ffffff', lighting === 'night' ? 0.75 : lighting === 'dusk' ? 0.85 : 1) }));
  signPanel.position.set(2.2, 0, 0.18); sign.add(signPanel);
  for (const px of [-4.6, 5.8]) { const p = mesh(new THREE.BoxGeometry(0.22, 6.4, 0.22), poleMat); p.position.set(px, -1.9 + 0.1, 0); sign.add(p); }
  const beam = mesh(new THREE.BoxGeometry(10.6, 0.3, 0.2), poleMat); beam.position.set(0.6, 1.0, 0); sign.add(beam);
  sign.position.set(0.6, -EYE_HEIGHT + 5.0, -15);
  far.add(sign);

  // ---------------- intermediate layer: laptop on a table ----------------
  const mid = new THREE.Scene();
  const table = mesh(new THREE.PlaneGeometry(2.6, 0.9), basic({
    map: canvasTexture(512, 256, (x, w, h) => {
      const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, P.table[0]); g.addColorStop(1, P.table[1]);
      x.fillStyle = g; x.fillRect(0, 0, w, h);
      x.strokeStyle = 'rgba(0,0,0,0.12)'; x.lineWidth = 2;
      for (let y = 4; y < h; y += 9) { x.beginPath(); x.moveTo(0, y); x.bezierCurveTo(w * 0.3, y + 5, w * 0.7, y - 5, w, y + 2); x.stroke(); }
    }, tex),
    color: col('#ffffff', Math.max(0.35, amb)),
  }));
  table.rotation.x = -Math.PI / 2; table.position.set(0, -0.27, -0.82);
  mid.add(table);
  const laptop = new THREE.Group();
  const screenW = 0.30, screenH = 0.19;
  const lid = mesh(new THREE.PlaneGeometry(screenW + 0.024, screenH + 0.026), basic({ color: col(P.bezel) }));
  laptop.add(lid);
  const laptopTex = canvasTexture(1024, 650, (x, w, h) => {
    x.fillStyle = '#f7f8f9'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#1d3a4a'; x.fillRect(0, 0, w, 64);
    x.fillStyle = '#ffffff'; x.font = `600 30px ${T.font}`; x.textBaseline = 'middle';
    x.direction = T.dir; x.textAlign = T.dir === 'rtl' ? 'right' : 'left';
    const xs = T.dir === 'rtl' ? w - 48 : 48;
    x.fillText(lang === 'ar' ? 'صحة العين' : 'Eye health', xs, 32);
    x.fillStyle = '#13212b'; x.font = `700 46px ${T.font}`;
    x.fillText(T.laptopTitle, xs, 140);
    x.font = `400 27px ${T.font}`; x.fillStyle = '#26343e';
    T.laptopLines.forEach((line, i) => x.fillText(line, xs, 236 + i * 52));
    x.fillStyle = '#c9d2d8';
    for (let i = 0; i < 4; i++) x.fillRect(T.dir === 'rtl' ? w - 48 - (760 - i * 90) : 48, 470 + i * 40, 760 - i * 90, 14);
    x.fillStyle = '#b8955a'; x.fillRect(T.dir === 'rtl' ? w - 48 - 220 : 48, 196, 220, 6);
  }, tex);
  const screen = mesh(new THREE.PlaneGeometry(screenW, screenH), basic({ map: laptopTex, color: col('#ffffff', P.screenDim) }));
  screen.position.z = 0.001; laptop.add(screen);
  placeAt(laptop, 0.66, laptopAz, -11.5);
  mid.add(laptop);

  // ---------------- near layer: a phone held in the hand ----------------
  const near = new THREE.Scene();
  const phone = new THREE.Group();
  const pw = 0.072, ph = 0.152;
  const caseM = mesh(new THREE.PlaneGeometry(pw + 0.006, ph + 0.006), basic({ color: col('#111317') })); phone.add(caseM);
  const phoneTex = canvasTexture(512, 1080, (x, w, h) => {
    x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#13212b'; x.textBaseline = 'middle'; x.direction = T.dir; x.textAlign = 'center';
    x.font = `600 30px ${T.font}`; x.fillText(T.phoneTime, w / 2, 46);
    x.fillStyle = '#e9eef1'; x.fillRect(28, 110, w - 56, 120);
    x.fillStyle = '#13212b'; x.font = `700 42px ${T.font}`; x.fillText(T.phoneTitle, w / 2, 170);
    x.font = `500 32px ${T.font}`; x.fillStyle = '#1f2d36';
    T.phoneLines.forEach((line, i) => x.fillText(line, w / 2, 300 + i * 66));
    x.fillStyle = '#d5dde2';
    for (let i = 0; i < 4; i++) x.fillRect(70, 590 + i * 34, w - 140 - (i % 2) * 90, 12);
    x.fillStyle = '#1d6b5a'; x.fillRect(80, 760, w - 160, 92);
    x.fillStyle = '#ffffff'; x.font = `600 40px ${T.font}`; x.fillText(lang === 'ar' ? 'تأكيد' : 'Confirm', w / 2, 806);
  }, tex);
  const phoneScreen = mesh(new THREE.PlaneGeometry(pw, ph), basic({ map: phoneTex, color: col('#ffffff', P.screenDim) }));
  phoneScreen.position.z = 0.001; phone.add(phoneScreen);
  placeAt(phone, 0.40, phoneAz, -9.5);
  phone.rotateZ((lang === 'ar' ? 1 : -1) * 0.06);
  near.add(phone);

  for (const s of [far, mid, near]) s.background = null;
  far.background = col(P.skyHorizon);

  return {
    scenes: { distance: far, intermediate: mid, near },
    lights,
    dispose() {
      for (const g of geos) g.dispose();
      for (const m of mats) m.dispose();
      for (const t of tex) t.dispose();
      geos.length = mats.length = tex.length = 0;
    },
    get counts() { return { geometries: geos.length, materials: mats.length, textures: tex.length }; },
  };
}
