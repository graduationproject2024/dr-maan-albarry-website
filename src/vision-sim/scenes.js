// Vision simulator — the three depth layers drawn with three.js (procedural: no image or model downloads).
//   distance     : a palm-lined city boulevard with a road-sign gantry, shopfronts, street lamps, cars and distant
//                  hills (6 m and beyond)
//   intermediate : a laptop on a café table, with a cup beside it (65 cm — a desk screen or a car dashboard distance)
//   near         : a phone held in the hand (40 cm — the reading distance; it also stands in for a book page)
// All layers share ONE perspective camera, so angular sizes are physically consistent across layers and the
// optics model's blur angles convert to pixels through the same focal length. Everything is deterministic
// (seeded pseudo-random numbers, no time-based animation).
//
// Lighting (2026-11 visual reconstruction): each layer is lit by a sky/ground hemisphere light and a sun (or moon)
// with Lambert materials, plus aerial-perspective fog in the distance layer. Screens and the road sign stay
// self-lit (MeshBasic). Dusk and night add lit windows, lamp light pools and the model-scaled point lights
// (pipeline.js draws their halos and glare from the optics model; nothing here exaggerates them).
//
// Invariants used by index.js (targetBox): near.children[0] is the phone group whose children[0] is the case plane;
// intermediate.children.at(-1) is the laptop group whose children[0] is the lid plane; distance.children.at(-1) is the
// sign group whose children[0] is the sign panel. Their sizes and positions are unchanged from the earlier scene.
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
    sky: ['#4f86c6', '#8fb7dc', '#dfe9ee'], sun: { color: '#fff3df', intensity: 2.0, dir: [0.45, 0.6, 0.66] },
    hemi: { sky: '#cfe2f5', ground: '#a89a82', intensity: 0.85 }, fog: { color: '#cfdde6', density: 0.0042 },
    hills: ['#8ea6ae', '#a7b8bb', '#c3cfd1'], clouds: 0.85, stars: false,
    ground: '#9b9280', road: '#4d5056', walk: '#c9c1b1', curb: '#e2ddd2', line: '#f4f2ea',
    wall: ['#e8dcc6', '#d9c7a8', '#efe7d8', '#cdbb9c', '#e3d2b4', '#d4cbbd'], glass: ['#8fb0c9', '#4d6b84'], windowLit: null,
    awning: ['#2f6f62', '#9c4b33', '#c79a3a', '#3d5a80'], shopGlass: '#55697a',
    pole: '#3b4148', trunk: '#8a7458', frond: ['#5e8a3a', '#3f6a2a'],
    table: ['#b08356', '#7d5634'], bezel: '#1c1f24', screenDim: 1, sign: ['#13804f', '#0b5c38'], signInk: '#ffffff',
    car: ['#c9ced3', '#4f6a8c', '#9a2f2f', '#e8e5de'], lampsOn: false, headlights: false,
    near: { hemi: 1.0, sun: 1.2 }, skin: '#e0b496',
  },
  dusk: {
    sky: ['#1f2d5c', '#7a5a7c', '#f0a56b'], sun: { color: '#ffb27a', intensity: 1.0, dir: [-0.65, 0.18, -0.6] },
    hemi: { sky: '#7d7fa8', ground: '#4a3b35', intensity: 0.55 }, fog: { color: '#8b7487', density: 0.005 },
    hills: ['#3d3550', '#5a4a63', '#7b6378'], clouds: 0.55, stars: false,
    ground: '#4b4542', road: '#36373d', walk: '#77706a', curb: '#8d857c', line: '#d0ccc0',
    wall: ['#8f7f78', '#83726e', '#9a8a80', '#776866', '#8a7a72', '#7f7470'], glass: ['#4b4f6a', '#2a2d40'], windowLit: '#f6c987',
    awning: ['#24564c', '#7a3a28', '#9b772d', '#2f4663'], shopGlass: '#f0c88a',
    pole: '#22262c', trunk: '#5c4c3a', frond: ['#3c5a2a', '#2a4320'],
    table: ['#8a6440', '#5a3d25'], bezel: '#15171b', screenDim: 0.92, sign: ['#0f6a42', '#094a2e'], signInk: '#f1f1ea',
    car: ['#7e848b', '#3d4a5c', '#6e2626', '#aaa69f'], lampsOn: true, headlights: true,
    near: { hemi: 0.7, sun: 0.6 }, skin: '#cfa086',
  },
  night: {
    sky: ['#02040b', '#0a1124', '#1d2640'], sun: { color: '#9fb4d8', intensity: 0.12, dir: [-0.3, 0.7, -0.4] },
    hemi: { sky: '#2a3552', ground: '#140f0c', intensity: 0.22 }, fog: { color: '#141a2a', density: 0.006 },
    hills: ['#090c16', '#0d1220', '#121a2c'], clouds: 0.12, stars: true,
    ground: '#121316', road: '#1b1d22', walk: '#2b2b2f', curb: '#38383c', line: '#7b7a72',
    wall: ['#34302e', '#2c2a2b', '#3a3532', '#262426', '#302d2c', '#2e2c2e'], glass: ['#10131c', '#07090f'], windowLit: '#ffc978',
    awning: ['#173a33', '#4a2419', '#5e4a1f', '#1d2b3e'], shopGlass: '#ffd59a',
    pole: '#0d0f12', trunk: '#2b241c', frond: ['#1b2a14', '#121d0e'],
    table: ['#4a3624', '#2a1d12'], bezel: '#0b0c0e', screenDim: 0.85, sign: ['#0b4e31', '#073823'], signInk: '#c9d3cc',
    car: ['#3a3e44', '#1a202a', '#3a1616', '#55534f'], lampsOn: true, headlights: true,
    near: { hemi: 0.45, sun: 0.15 }, skin: '#b48a74',
  },
};

const TEXT = {
  ar: {
    signTop: 'وسط المدينة', signBottom: '٣ كم',
    laptopTitle: 'العناية بالعين بعد العملية', laptopLines: ['استخدم القطرات حسب تعليمات الطبيب', 'تجنّب فرك العين في الأسابيع الأولى', 'راجع العيادة في الموعد المحدد', 'ارتدِ النظارة الواقية عند النوم'],
    phoneTime: '٩:٤١', phoneTitle: 'رسالة جديدة', phoneLines: ['موعد المراجعة', 'الأحد ١٠:٣٠ صباحاً', 'العيادة الخارجية', 'الطابق الثاني'],
    shops: ['صيدلية', 'مخبز', 'بصريات', 'مقهى', 'زهور', 'كتب'],
    dir: 'rtl', font: '"IBM Plex Sans Arabic", "Noto Sans Arabic", "Segoe UI", Tahoma, sans-serif',
  },
  en: {
    signTop: 'City Centre', signBottom: '3 km',
    laptopTitle: 'Eye care after surgery', laptopLines: ['Use your drops as your doctor advised', 'Avoid rubbing the eye for a few weeks', 'Keep your follow-up appointment', 'Wear the eye shield while sleeping'],
    phoneTime: '9:41', phoneTitle: 'New message', phoneLines: ['Follow-up visit', 'Sunday 10:30 am', 'Outpatient clinic', 'Second floor'],
    shops: ['Pharmacy', 'Bakery', 'Optician', 'Café', 'Flowers', 'Books'],
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

function roundRect(x, X, Y, w, h, r) {
  x.beginPath();
  x.moveTo(X + r, Y); x.lineTo(X + w - r, Y); x.quadraticCurveTo(X + w, Y, X + w, Y + r);
  x.lineTo(X + w, Y + h - r); x.quadraticCurveTo(X + w, Y + h, X + w - r, Y + h);
  x.lineTo(X + r, Y + h); x.quadraticCurveTo(X, Y + h, X, Y + h - r);
  x.lineTo(X, Y + r); x.quadraticCurveTo(X, Y, X + r, Y); x.closePath();
}

/** Place an object at a visual direction (azimuth right +, elevation up +) and distance from the eye. */
function placeAt(obj, distM, azDeg, elDeg) {
  const az = azDeg * DEG, el = elDeg * DEG;
  obj.position.set(distM * Math.sin(az) * Math.cos(el), distM * Math.sin(el), -distM * Math.cos(az) * Math.cos(el));
  obj.lookAt(0, 0, 0);
  return obj;
}

export function createCamera(aspect) {
  const cam = new THREE.PerspectiveCamera(VIEWING.vFovDeg, aspect, 0.05, 1200);
  cam.position.set(0, 0, 0);
  cam.lookAt(0, 0, -1);
  return cam;
}

/** Sun / moon + sky-ground fill for one layer. */
function addLights(scene, P, hemiScale = 1, sunScale = 1) {
  scene.add(new THREE.HemisphereLight(new THREE.Color(P.hemi.sky), new THREE.Color(P.hemi.ground), P.hemi.intensity * hemiScale));
  const sun = new THREE.DirectionalLight(new THREE.Color(P.sun.color), P.sun.intensity * sunScale);
  sun.position.set(...P.sun.dir).multiplyScalar(100);
  scene.add(sun);
}

/**
 * Build the three layer scenes for a lighting condition and language.
 * Returns { scenes: {distance, intermediate, near}, lights: [{position, color, intensity, coreDeg}], dispose }.
 */
export function buildScenes({ lighting = 'day', lang = 'en', aspect = 1.6 }) {
  const P = PALETTE[lighting] || PALETTE.day;
  const T = TEXT[lang] || TEXT.en;
  const night = lighting === 'night', dusk = lighting === 'dusk';
  const tex = [], geos = [], mats = [];
  const rnd = seeded(20261101);
  // Horizontal half-field (deg). On narrow frames the laptop (≈26° wide) and the phone (≈10°) are fitted to the field
  // so they never overlap down to a 7:6 frame; at 16:10 this gives exactly the original -9° / 13.5° placement.
  const hf = Math.atan(Math.tan((VIEWING.vFovDeg / 2) * DEG) * aspect) / DEG;
  const laptopAz = -Math.max(0, Math.min(9, hf - 13.4));
  const phoneAz = Math.max(0, Math.min(13.5, hf - 5.6));
  const track = (m) => { mats.push(m); return m; };
  const basic = (opts) => track(new THREE.MeshBasicMaterial(opts));
  const lambert = (opts) => track(new THREE.MeshLambertMaterial(opts));
  const geo = (g) => { geos.push(g); return g; };
  const mesh = (g, m) => new THREE.Mesh(geos.includes(g) ? g : geo(g), m);
  const col = (hex, f = 1) => new THREE.Color(hex).multiplyScalar(f);
  const radial = (stops) => canvasTexture(128, 128, (x, w, h) => {
    const g = x.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    for (const [o, c] of stops) g.addColorStop(o, c);
    x.fillStyle = g; x.fillRect(0, 0, w, h);
  }, tex);
  const blob = radial([[0, 'rgba(255,255,255,1)'], [0.55, 'rgba(255,255,255,0.55)'], [1, 'rgba(255,255,255,0)']]);
  const shadowMat = (o) => basic({ color: 0x000000, alphaMap: blob, transparent: true, opacity: o, depthWrite: false });

  // ---------------- distance layer ----------------
  const far = new THREE.Scene();
  far.fog = new THREE.FogExp2(col(P.fog.color), P.fog.density);
  addLights(far, P);
  const lights = [];

  // sky: gradient, sun / sunset glow or moon and stars, soft clouds (baked into one texture, not fogged)
  const skyTex = canvasTexture(1024, 512, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, P.sky[0]); g.addColorStop(0.62, P.sky[1]); g.addColorStop(0.97, P.sky[2]); g.addColorStop(1, P.sky[2]);
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    const r = seeded(night ? 9 : dusk ? 5 : 3);
    if (P.stars) {
      for (let i = 0; i < 420; i++) { const a = 0.25 + r() * 0.6; x.fillStyle = `rgba(235,240,255,${a * (1 - i / 600)})`; const s = r() < 0.08 ? 1.6 : 0.9; x.fillRect(r() * w, r() * h * 0.7, s, s); }
      const mx = w * 0.78, my = h * 0.2; // moon, high on the right
      const mg = x.createRadialGradient(mx, my, 0, mx, my, 70); mg.addColorStop(0, 'rgba(210,220,255,0.35)'); mg.addColorStop(1, 'rgba(210,220,255,0)');
      x.fillStyle = mg; x.fillRect(mx - 70, my - 70, 140, 140);
      x.fillStyle = '#e9ecf2'; x.beginPath(); x.arc(mx, my, 9, 0, Math.PI * 2); x.fill();
    } else {
      const sx = dusk ? w * 0.18 : w * 0.86, sy = dusk ? h * 0.93 : h * 0.12;
      const sg = x.createRadialGradient(sx, sy, 0, sx, sy, dusk ? 420 : 260);
      sg.addColorStop(0, dusk ? 'rgba(255,190,120,0.7)' : 'rgba(255,250,235,0.55)'); sg.addColorStop(1, 'rgba(255,220,180,0)');
      x.fillStyle = sg; x.fillRect(0, 0, w, h);
    }
    // clouds: soft overlapping ellipses in a few horizontal bands
    const tone = night ? '120,130,160' : dusk ? '255,196,170' : '255,255,255';
    for (let b = 0; b < 7; b++) {
      const cy = h * (0.12 + r() * 0.55), cx = r() * w, len = 120 + r() * 260;
      for (let i = 0; i < 26; i++) {
        const px = cx + (r() - 0.5) * len, py = cy + (r() - 0.5) * 22, rx = 26 + r() * 46, ry = 10 + r() * 16;
        const cg = x.createRadialGradient(px, py, 0, px, py, rx);
        cg.addColorStop(0, `rgba(${tone},${0.16 * P.clouds})`); cg.addColorStop(1, `rgba(${tone},0)`);
        x.save(); x.translate(px, py); x.scale(1, ry / rx); x.translate(-px, -py);
        x.fillStyle = cg; x.beginPath(); x.arc(px, py, rx, 0, Math.PI * 2); x.fill(); x.restore();
      }
    }
  }, tex);
  const sky = mesh(new THREE.PlaneGeometry(2200, 900), basic({ map: skyTex, depthWrite: false, fog: false }));
  sky.position.set(0, 380 - EYE_HEIGHT, -1000);
  far.add(sky);
  // distant hills: three ridges, lighter with distance (aerial perspective baked in)
  const hillTex = canvasTexture(2048, 256, (x, w, h) => {
    const r = seeded(17);
    for (const layer of [0, 1, 2].reverse()) { // back ridge (lightest) first
      x.fillStyle = P.hills[layer];
      x.beginPath(); x.moveTo(0, h);
      let y = h * (0.2 + (2 - layer) * 0.0 + layer * 0.16);
      for (let px = 0; px <= w; px += 16) {
        y += (r() - 0.5) * 10 + Math.sin(px / (90 + layer * 40)) * 1.6;
        y = Math.max(h * 0.08, Math.min(h * 0.92, y));
        x.lineTo(px, y);
      }
      x.lineTo(w, h); x.closePath(); x.fill();
    }
  }, tex);
  const hills = mesh(new THREE.PlaneGeometry(1800, 110), basic({ map: hillTex, transparent: true, depthWrite: false, fog: false }));
  hills.position.set(-60, 49 - EYE_HEIGHT - 6, -760);
  far.add(hills);
  const ground = mesh(new THREE.PlaneGeometry(1800, 1000), lambert({ color: col(P.ground) }));
  ground.rotation.x = -Math.PI / 2; ground.position.set(0, -EYE_HEIGHT - 0.02, -500);
  far.add(ground);

  // road: asphalt grain, tyre tracks, edge lines, dashed centre line, a zebra crossing ahead
  const roadTex = canvasTexture(256, 1024, (x, w, h) => {
    x.fillStyle = P.road; x.fillRect(0, 0, w, h);
    const r2 = seeded(7);
    for (let i = 0; i < 5200; i++) { const v = r2(); x.fillStyle = v < 0.5 ? `rgba(255,255,255,${v * 0.07})` : `rgba(0,0,0,${(v - 0.5) * 0.12})`; x.fillRect(r2() * w, r2() * h, 1.5, 1.5); }
    for (let i = 0; i < 6; i++) { x.fillStyle = 'rgba(0,0,0,0.05)'; x.fillRect(w * (0.18 + i * 0.12), 0, 14, h); }
    x.fillStyle = P.line;
    x.fillRect(6, 0, 5, h); x.fillRect(w - 11, 0, 5, h);
    for (let y = 0; y < h; y += 256) x.fillRect(w / 2 - 3, y, 6, 110);
  }, tex);
  roadTex.wrapT = THREE.RepeatWrapping; roadTex.repeat.set(1, 30);
  const road = mesh(new THREE.PlaneGeometry(9, 600), lambert({ map: roadTex }));
  road.rotation.x = -Math.PI / 2; road.position.set(0.6, -EYE_HEIGHT, -303);
  far.add(road);
  const zebraMat = lambert({ color: col(P.line, 0.95) });
  const zebraGeo = geo(new THREE.PlaneGeometry(0.5, 3.2));
  for (let i = 0; i < 9; i++) {
    const s = mesh(zebraGeo, zebraMat);
    s.rotation.x = -Math.PI / 2; s.position.set(-3.3 + i * 0.98, -EYE_HEIGHT + 0.005, -30);
    far.add(s);
  }
  // pavements: tiles, raised kerb
  const walkTex = canvasTexture(128, 512, (x, w, h) => {
    x.fillStyle = P.walk; x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(0,0,0,0.13)'; x.lineWidth = 2;
    for (let y = 0; y < h; y += 32) { x.beginPath(); x.moveTo(0, y); x.lineTo(w, y); x.stroke(); }
    for (let xx = 0; xx < w; xx += 32) { x.beginPath(); x.moveTo(xx, 0); x.lineTo(xx, h); x.stroke(); }
  }, tex);
  walkTex.wrapT = THREE.RepeatWrapping; walkTex.repeat.set(1, 60);
  const curbMat = lambert({ color: col(P.curb) });
  const walkMat = lambert({ map: walkTex });
  for (const [sx, cx] of [[-5.6, -3.92], [6.8, 5.12]]) {
    const walk = mesh(new THREE.PlaneGeometry(3.4, 600), walkMat);
    walk.rotation.x = -Math.PI / 2; walk.position.set(sx, -EYE_HEIGHT + 0.14, -303);
    far.add(walk);
    const curb = mesh(new THREE.BoxGeometry(0.16, 0.15, 600), curbMat);
    curb.position.set(cx, -EYE_HEIGHT + 0.07, -303); far.add(curb);
  }

  // buildings: shopfront ground floor (fascia lettering, glazing, awning) + repeating upper storeys + cornice + parapet
  const windowsOf = (variant, draw) => {
    const r3 = seeded(31 + variant);
    const bays = variant % 2 ? 3 : 4, floors = 4;
    for (let f = 0; f < floors; f++) for (let b = 0; b < bays; b++) draw(f, b, bays, floors, P.windowLit && r3() < (night ? 0.3 : 0.2));
  };
  const upperTex = (variant) => canvasTexture(256, 256, (x, w, h) => {
    x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h); // tinted by the material colour
    x.fillStyle = 'rgba(0,0,0,0.04)'; for (let y = 0; y < h; y += 4) x.fillRect(0, y, w, 1);
    windowsOf(variant, (f, b, bays, floors, lit) => {
      const bw = w / bays, fh = h / floors;
      const wx = b * bw + bw * 0.22, wy = f * fh + fh * 0.2, ww = bw * 0.56, wh = fh * 0.56;
      x.fillStyle = 'rgba(0,0,0,0.22)'; x.fillRect(wx - 3, wy - 3, ww + 6, wh + 8); // reveal
      if (lit) { x.fillStyle = P.windowLit; x.fillRect(wx, wy, ww, wh); } else {
        const g = x.createLinearGradient(wx, wy, wx + ww, wy + wh);
        g.addColorStop(0, P.glass[0]); g.addColorStop(1, P.glass[1]);
        x.fillStyle = g; x.fillRect(wx, wy, ww, wh);
        if (!night) { x.fillStyle = 'rgba(255,255,255,0.16)'; x.beginPath(); x.moveTo(wx, wy + wh * 0.7); x.lineTo(wx + ww * 0.5, wy); x.lineTo(wx + ww * 0.7, wy); x.lineTo(wx, wy + wh); x.fill(); }
      }
      x.fillStyle = 'rgba(40,40,40,0.55)'; x.fillRect(wx + ww / 2 - 1, wy, 2, wh); // mullion
      x.fillStyle = 'rgba(255,255,255,0.5)'; x.fillRect(wx - 5, wy + wh + 3, ww + 10, 4); // sill
      if (variant % 3 === 0 && f > 0) { x.fillStyle = 'rgba(0,0,0,0.28)'; x.fillRect(wx - 6, wy + wh * 0.62, ww + 12, 3); } // balcony rail
    });
  }, tex);
  const emissiveTex = (variant) => canvasTexture(256, 256, (x, w, h) => {
    x.fillStyle = '#000'; x.fillRect(0, 0, w, h);
    windowsOf(variant, (f, b, bays, floors, lit) => {
      if (!lit) return;
      const bw = w / bays, fh = h / floors;
      x.fillStyle = ['#ffc978', '#ffe0b0', '#e9a95a', '#d6e2ff', '#ffcf8f'][(f * 7 + b * 3 + variant) % 5]; x.fillRect(b * bw + bw * 0.22, f * fh + fh * 0.2, bw * 0.56, fh * 0.56); // lamps differ from room to room
    });
  }, tex);
  const UPPER = [0, 1, 2, 3].map((v) => ({ map: upperTex(v), emissive: P.windowLit ? emissiveTex(v) : null }));
  const shopTex = (i) => canvasTexture(512, 128, (x, w, h) => {
    x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h);
    x.fillStyle = P.awning[i % P.awning.length]; x.fillRect(0, 4, w, 38); // fascia
    x.fillStyle = '#ffffff'; x.font = `700 30px ${T.font}`; x.textBaseline = 'middle'; x.textAlign = 'center'; x.direction = T.dir;
    x.fillText(T.shops[i % T.shops.length], w / 2, 24);
    const g = x.createLinearGradient(0, 44, 0, h);
    g.addColorStop(0, P.shopGlass); g.addColorStop(1, night || dusk ? P.shopGlass : '#2c3a46');
    x.fillStyle = g; x.fillRect(24, 46, w - 48, h - 52);
    x.fillStyle = 'rgba(30,30,30,0.6)'; for (let k = 1; k < 4; k++) x.fillRect(24 + k * (w - 48) / 4, 46, 3, h - 52);
  }, tex);
  // after dark only the shop glazing and the fascia lettering give light (not the whole shopfront)
  const shopGlow = (night || dusk) ? canvasTexture(512, 128, (x, w, h) => {
    x.fillStyle = '#000'; x.fillRect(0, 0, w, h);
    const bay = (w - 48) / 4;
    for (const k of [0, 2, 3]) { // not every bay is lit; light falls off towards the floor
      const g = x.createLinearGradient(0, 46, 0, h); g.addColorStop(0, P.shopGlass); g.addColorStop(1, 'rgba(0,0,0,1)');
      x.fillStyle = g; x.fillRect(24 + k * bay + 3, 46, bay - 3, h - 52);
    }
    x.fillStyle = '#ffffff'; x.fillRect(w * 0.3, 14, w * 0.4, 16);
  }, tex) : null;
  const SHOPS = [0, 1, 2, 3, 4, 5].map((i) => lambert({ map: shopTex(i), ...(shopGlow ? { emissiveMap: shopGlow, emissive: col('#ffffff', night ? 0.3 : 0.18) } : {}) }));
  const AWNINGS = P.awning.map((c) => lambert({ color: col(c) }));
  const awningGeo = geo(new THREE.BoxGeometry(1.1, 0.06, 1));
  for (const side of [-1, 1]) {
    let z = -7;
    let k = side < 0 ? 0 : 3;
    while (z > -300) {
      const w = 9 + rnd() * 9, upper = 6 + Math.floor(rnd() * 4) * 3 + (side < 0 ? 0 : 3), d = 10;
      const wall = col(P.wall[Math.floor(rnd() * P.wall.length)]);
      const x0 = side * (8.9 + d / 2);
      const v = UPPER[k % UPPER.length];
      const map = v.map.clone(); map.wrapS = map.wrapT = THREE.RepeatWrapping; map.repeat.set(w / 12, upper / 12); map.needsUpdate = true; tex.push(map);
      let extra = {};
      if (v.emissive) {
        const emap = v.emissive.clone(); emap.wrapS = emap.wrapT = THREE.RepeatWrapping; emap.repeat.copy(map.repeat); emap.needsUpdate = true; tex.push(emap);
        extra = { emissiveMap: emap, emissive: col('#ffffff', night ? 0.8 : 0.55) };
      }
      const upperBox = mesh(new THREE.BoxGeometry(d, upper, w), lambert({ map, color: wall, ...extra }));
      upperBox.position.set(x0, -EYE_HEIGHT + 4.2 + upper / 2, z - w / 2); far.add(upperBox);
      const shop = mesh(new THREE.BoxGeometry(d - 0.4, 4.2, w), SHOPS[k % SHOPS.length]);
      shop.position.set(x0 + side * 0.2, -EYE_HEIGHT + 2.1, z - w / 2); far.add(shop);
      const trim = lambert({ color: wall.clone().multiplyScalar(0.82) });
      const parapet = mesh(new THREE.BoxGeometry(d + 0.3, 0.5, w + 0.2), trim);
      parapet.position.set(x0, -EYE_HEIGHT + 4.2 + upper + 0.25, z - w / 2); far.add(parapet);
      const cornice = mesh(new THREE.BoxGeometry(d + 0.35, 0.22, w + 0.1), trim);
      cornice.position.set(x0, -EYE_HEIGHT + 4.25, z - w / 2); far.add(cornice);
      const aw = mesh(awningGeo, AWNINGS[k % AWNINGS.length]);
      aw.scale.set(1, 1, w * 0.86);
      aw.position.set(side * 8.55, -EYE_HEIGHT + 3.25, z - w / 2); aw.rotation.z = side * -0.32; far.add(aw);
      z -= w + (rnd() < 0.25 ? 6 : 0.6); // an occasional side street opens the view
      k++;
    }
  }

  // palms along both pavements (shared trunk and frond geometry)
  const trunkGeo = geo(new THREE.CylinderGeometry(0.13, 0.22, 1, 7, 6));
  const frondGeo = (() => { // a long leaf, bent downwards along its length
    const g = new THREE.PlaneGeometry(2.6, 0.62, 8, 1);
    const p = g.attributes.position;
    // lay the leaf flat (its width along z), starting at the trunk, and droop it with distance from the trunk
    for (let i = 0; i < p.count; i++) { const x = p.getX(i) + 1.3, y = p.getY(i); p.setXYZ(i, x, -0.16 * x * x, y); }
    g.computeVertexNormals();
    return geo(g);
  })();
  const frondTex = canvasTexture(256, 64, (x, w, h) => {
    x.clearRect(0, 0, w, h);
    x.strokeStyle = P.frond[1]; x.lineWidth = 3; x.beginPath(); x.moveTo(0, h / 2); x.lineTo(w, h / 2); x.stroke();
    for (let i = 4; i < w - 6; i += 6) {
      const len = (h / 2 - 2) * Math.sin((i / w) * Math.PI) * 0.98 + 3;
      x.strokeStyle = i % 12 ? P.frond[0] : P.frond[1]; x.lineWidth = 3;
      x.beginPath(); x.moveTo(i, h / 2); x.lineTo(i + 7, h / 2 - len); x.stroke();
      x.beginPath(); x.moveTo(i, h / 2); x.lineTo(i + 7, h / 2 + len); x.stroke();
    }
  }, tex);
  const frondMat = lambert({ map: frondTex, alphaTest: 0.45, side: THREE.DoubleSide });
  const trunkMat = lambert({ color: col(P.trunk) });
  const palm = (x, z, h, seed) => {
    const r = seeded(seed);
    const lean = (r() - 0.5) * 0.08;
    const t = mesh(trunkGeo, trunkMat); t.scale.set(1, h, 1); t.position.set(x, -EYE_HEIGHT + 0.14 + h / 2, z); t.rotation.z = lean; far.add(t);
    const topX = x - Math.sin(lean) * h, topY = -EYE_HEIGHT + 0.14 + h;
    for (let i = 0; i < 11; i++) {
      const f = mesh(frondGeo, frondMat);
      f.position.set(topX, topY, z);
      f.rotation.set(0, (i / 11) * Math.PI * 2 + r() * 0.4, 0);
      f.rotateZ(0.3 + r() * 0.35); // rise first; the bent geometry droops towards the tip
      f.rotateX((r() - 0.5) * 0.5);
      far.add(f);
    }
  };
  for (let i = 0; i < 8; i++) {
    palm(-6.6, -19 - i * 22, 6.2 + (i % 3) * 0.7, 100 + i);
    palm(7.9, -8 - i * 22, 6.5 + ((i + 1) % 3) * 0.6, 200 + i);
  }

  // street lamps (the point lights at dusk / night: their halos and glare come from the optics model in pipeline.js)
  const poleMat = lambert({ color: col(P.pole) });
  const headMat = P.lampsOn ? basic({ color: col('#ffe2b0', 1.5) }) : lambert({ color: col('#d8d8d0') });
  const poleGeo = geo(new THREE.CylinderGeometry(0.07, 0.1, 7.5, 8));
  const armGeo = geo(new THREE.BoxGeometry(1.6, 0.08, 0.08));
  const headGeo = geo(new THREE.BoxGeometry(0.6, 0.12, 0.3));
  const poolMat = P.lampsOn ? basic({ map: radial([[0, 'rgba(255,214,160,0.9)'], [0.45, 'rgba(255,200,140,0.35)'], [1, 'rgba(255,190,130,0)']]), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: night ? 0.5 : 0.25 }) : null;
  const poolGeo = poolMat ? geo(new THREE.PlaneGeometry(7, 7)) : null;
  for (let i = 0; i < 9; i++) {
    for (const side of [-1, 1]) {
      const z = -8 - i * 22 - (side > 0 ? 11 : 0);
      const x = side * 5.6 + (side > 0 ? 1.2 : 0);
      const pole = mesh(poleGeo, poleMat); pole.position.set(x, -EYE_HEIGHT + 3.75, z); far.add(pole);
      const arm = mesh(armGeo, poleMat); arm.position.set(x - side * 0.8, -EYE_HEIGHT + 7.45, z); far.add(arm);
      const head = mesh(headGeo, headMat); head.position.set(x - side * 1.5, -EYE_HEIGHT + 7.35, z); far.add(head);
      if (P.lampsOn) {
        lights.push({ position: new THREE.Vector3(x - side * 1.5, -EYE_HEIGHT + 7.27, z), color: [1.0, 0.78, 0.48], intensity: night ? 1 : 0.55, coreDeg: 0.16 });
        const pool = mesh(poolGeo, poolMat); pool.rotation.x = -Math.PI / 2; pool.position.set(x - side * 1.5, -EYE_HEIGHT + 0.01, z); far.add(pool);
      }
    }
  }

  // cars: two ahead (tail lights), two oncoming (headlights)
  const carShadow = shadowMat(night ? 0.35 : 0.5);
  const carShadowGeo = geo(new THREE.PlaneGeometry(2.4, 5.2));
  const wheelGeo = geo(new THREE.CylinderGeometry(0.33, 0.33, 0.24, 14));
  const wheelMat = lambert({ color: col('#16181b') });
  const glassMat = lambert({ color: col(night ? '#0c0f14' : '#28323d') });
  const bodyGeo = geo(new THREE.BoxGeometry(1.82, 0.62, 4.4));
  const cabinGeo = geo(new THREE.BoxGeometry(1.56, 0.56, 2.3));
  const roofGeo = geo(new THREE.BoxGeometry(1.5, 0.06, 1.9));
  const lampGeo = geo(new THREE.BoxGeometry(0.36, 0.13, 0.04));
  const car = (x, z, colour, oncoming) => {
    const g = new THREE.Group();
    const paint = lambert({ color: col(colour) });
    const body = mesh(bodyGeo, paint); body.position.y = 0.56; g.add(body);
    const cabin = mesh(cabinGeo, glassMat); cabin.position.set(0, 1.13, oncoming ? 0.15 : -0.15); g.add(cabin);
    const roof = mesh(roofGeo, paint); roof.position.set(0, 1.43, oncoming ? 0.15 : -0.15); g.add(roof);
    for (const [wx, wz] of [[-0.86, 1.4], [0.86, 1.4], [-0.86, -1.4], [0.86, -1.4]]) { const w = mesh(wheelGeo, wheelMat); w.rotation.z = Math.PI / 2; w.position.set(wx, 0.33, wz); g.add(w); }
    const sh = mesh(carShadowGeo, carShadow); sh.rotation.x = -Math.PI / 2; sh.position.y = 0.012; g.add(sh);
    g.position.set(x, -EYE_HEIGHT, z);
    far.add(g);
    const zFace = z + 2.21;
    for (const dx of [-0.66, 0.66]) {
      const lit = P.headlights;
      const lamp = mesh(lampGeo, basic({ color: oncoming ? col('#f4f1e6', lit ? 2 : 1) : col('#c0221c', lit ? 1.6 : 0.8) }));
      lamp.position.set(x + dx, -EYE_HEIGHT + 0.7, zFace); far.add(lamp);
      if (lit) lights.push({ position: new THREE.Vector3(x + dx, -EYE_HEIGHT + 0.72, zFace + 0.03), color: oncoming ? [1, 0.97, 0.9] : [1, 0.12, 0.08], intensity: oncoming ? 1.4 : 0.5, coreDeg: oncoming ? 0.22 : 0.14 });
    }
  };
  car(-0.9, -26, P.car[0], false);
  car(2.4, -48, P.car[2], false);
  car(-2.9, -38, P.car[1], true);
  car(-3.0, -82, P.car[3], true);

  // road sign gantry (the "distance" reading target) — last child of the layer (see targetBox in index.js)
  const sign = new THREE.Group();
  const signTex = canvasTexture(1024, 360, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, P.sign[0]); g.addColorStop(1, P.sign[1]);
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.strokeStyle = P.signInk; x.lineWidth = 10; roundRect(x, 18, 18, w - 36, h - 36, 22); x.stroke();
    x.fillStyle = P.signInk; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.direction = T.dir; x.font = `600 118px ${T.font}`;
    x.fillText(T.signTop, w * 0.57, h * 0.40);
    x.font = `500 66px ${T.font}`;
    x.fillText(T.signBottom, w * 0.57, h * 0.76);
    const ax = w * 0.12, ay = h * 0.5, u = h * 0.17; // up arrow
    x.beginPath(); x.moveTo(ax, ay - u * 1.4); x.lineTo(ax + u, ay - u * 0.2); x.lineTo(ax + u * 0.36, ay - u * 0.2);
    x.lineTo(ax + u * 0.36, ay + u * 1.4); x.lineTo(ax - u * 0.36, ay + u * 1.4); x.lineTo(ax - u * 0.36, ay - u * 0.2); x.lineTo(ax - u, ay - u * 0.2); x.closePath(); x.fill();
  }, tex);
  const signPanel = mesh(new THREE.PlaneGeometry(4.6, 1.62), basic({ map: signTex, color: col('#ffffff', night ? 0.75 : dusk ? 0.85 : 1), fog: false }));
  signPanel.position.set(2.2, 0, 0.18); sign.add(signPanel);
  const gantryMat = lambert({ color: col(P.pole, 1.4) });
  const back = mesh(new THREE.BoxGeometry(4.7, 1.7, 0.08), gantryMat); back.position.set(2.2, 0, 0.12); sign.add(back);
  for (const px of [-4.6, 5.8]) { const p = mesh(new THREE.CylinderGeometry(0.13, 0.15, 6.4, 10), gantryMat); p.position.set(px, -1.9 + 0.1, 0); sign.add(p); }
  const beam = mesh(new THREE.BoxGeometry(10.6, 0.28, 0.22), gantryMat); beam.position.set(0.6, 1.0, 0); sign.add(beam);
  const beam2 = mesh(new THREE.BoxGeometry(10.6, 0.16, 0.16), gantryMat); beam2.position.set(0.6, -0.95, 0); sign.add(beam2);
  sign.position.set(0.6, -EYE_HEIGHT + 5.0, -15);
  far.add(sign);

  // ---------------- intermediate layer: laptop on a café table ----------------
  const mid = new THREE.Scene();
  addLights(mid, P, (P.near.hemi / P.hemi.intensity) * 0.85, P.near.sun / P.sun.intensity);
  const TABLE_Y = -0.243;
  const woodTex = canvasTexture(1024, 512, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, P.table[0]); g.addColorStop(1, P.table[1]);
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    const r = seeded(23);
    for (let y = 2; y < h; y += 5 + r() * 6) {
      x.strokeStyle = `rgba(${r() < 0.5 ? '0,0,0' : '255,235,200'},${0.05 + r() * 0.08})`; x.lineWidth = 1 + r() * 2;
      const a = (r() - 0.5) * 10;
      x.beginPath(); x.moveTo(0, y); x.bezierCurveTo(w * 0.3, y + a, w * 0.7, y - a, w, y + a * 0.3); x.stroke();
    }
    x.fillStyle = 'rgba(0,0,0,0.25)'; for (let b = 1; b < 4; b++) x.fillRect((w / 4) * b, 0, 2, h); // plank joints
  }, tex);
  const edge = lambert({ color: col(P.table[1], 0.8) });
  const top = mesh(new THREE.BoxGeometry(2.6, 0.035, 0.95), [edge, edge, lambert({ map: woodTex }), edge, edge, edge]);
  top.position.set(0, TABLE_Y - 0.0175, -0.82);
  mid.add(top);
  // a cup and saucer beside the laptop — the same layer, so they share its focus
  const ceramic = lambert({ color: col('#f3f1ec') });
  const cupPts = [[0, 0], [0.026, 0], [0.03, 0.006], [0.036, 0.05], [0.038, 0.072], [0.035, 0.072], [0.033, 0.052], [0.027, 0.012], [0, 0.012]].map(([a, b]) => new THREE.Vector2(a, b));
  const cupZ = -0.6, cupX = laptopAz < -4 ? 0.27 : 0.2;
  const cup = mesh(new THREE.LatheGeometry(cupPts, 28), ceramic); cup.position.set(cupX, TABLE_Y + 0.01, cupZ);
  const saucer = mesh(new THREE.CylinderGeometry(0.068, 0.05, 0.01, 32), ceramic); saucer.position.set(cupX, TABLE_Y + 0.005, cupZ);
  const coffee = mesh(new THREE.CircleGeometry(0.033, 24), lambert({ color: col('#3a2416') })); coffee.rotation.x = -Math.PI / 2; coffee.position.set(cupX, TABLE_Y + 0.071, cupZ);
  const handle = mesh(new THREE.TorusGeometry(0.016, 0.0045, 8, 18, Math.PI), ceramic); handle.position.set(cupX + 0.046, TABLE_Y + 0.046, cupZ); handle.rotation.z = -Math.PI / 2;
  const cupShadow = mesh(new THREE.PlaneGeometry(0.2, 0.2), shadowMat(0.35)); cupShadow.rotation.x = -Math.PI / 2; cupShadow.position.set(cupX + 0.01, TABLE_Y + 0.001, cupZ);
  mid.add(cupShadow, saucer, cup, coffee, handle);

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
  const shell = mesh(new THREE.BoxGeometry(screenW + 0.026, screenH + 0.028, 0.006), lambert({ color: col('#8e949b') }));
  shell.position.z = -0.0035; laptop.add(shell);
  placeAt(laptop, 0.66, laptopAz, -11.5);
  // keyboard base, lying on the table from the hinge towards the viewer
  laptop.updateMatrixWorld(true);
  const hinge = laptop.localToWorld(new THREE.Vector3(0, -(screenH + 0.026) / 2, 0));
  const toEye = new THREE.Vector2(-hinge.x, -hinge.z).normalize();
  const kbTex = canvasTexture(512, 360, (x, w, h) => {
    x.fillStyle = '#9aa0a7'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#25282c'; roundRect(x, 34, 22, w - 68, h * 0.5, 8); x.fill();
    x.fillStyle = '#3a3e44';
    for (let r = 0; r < 5; r++) for (let c = 0; c < 14; c++) x.fillRect(40 + c * ((w - 80) / 14), 28 + r * (h * 0.5 / 5), (w - 80) / 14 - 4, h * 0.5 / 5 - 5);
    x.fillStyle = '#8a9097'; roundRect(x, w * 0.33, h * 0.62, w * 0.34, h * 0.3, 10); x.fill();
  }, tex);
  const alu = lambert({ color: col('#7d838a') });
  const base = mesh(new THREE.BoxGeometry(screenW + 0.026, 0.014, 0.215), [alu, alu, lambert({ map: kbTex }), alu, alu, alu]);
  base.position.set(hinge.x + toEye.x * 0.1075, TABLE_Y + 0.007, hinge.z + toEye.y * 0.1075);
  base.rotation.y = Math.atan2(toEye.x, toEye.y);
  const lapShadow = mesh(new THREE.PlaneGeometry(0.46, 0.34), shadowMat(night ? 0.3 : 0.45));
  lapShadow.rotation.x = -Math.PI / 2; lapShadow.rotation.z = -base.rotation.y; lapShadow.position.set(base.position.x, TABLE_Y + 0.001, base.position.z - 0.02);
  mid.add(lapShadow, base);
  mid.add(laptop); // last child (targetBox)

  // ---------------- near layer: a phone held in the hand ----------------
  const near = new THREE.Scene();
  const phone = new THREE.Group();
  const pw = 0.072, ph = 0.152;
  const caseTex = canvasTexture(128, 256, (x, w, h) => { x.clearRect(0, 0, w, h); x.fillStyle = '#ffffff'; roundRect(x, 0, 0, w, h, 16); x.fill(); }, tex);
  const caseM = mesh(new THREE.PlaneGeometry(pw + 0.006, ph + 0.006), basic({ color: col('#111317'), alphaMap: caseTex, transparent: true, depthWrite: false }));
  phone.add(caseM); // first child of the phone group (targetBox)
  const phoneTex = canvasTexture(512, 1080, (x, w, h) => {
    x.clearRect(0, 0, w, h);
    x.save(); roundRect(x, 0, 0, w, h, 52); x.clip();
    x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#13212b'; x.textBaseline = 'middle'; x.direction = T.dir; x.textAlign = 'center';
    x.font = `600 30px ${T.font}`; x.fillText(T.phoneTime, w / 2, 46);
    x.fillStyle = '#e9eef1'; x.fillRect(28, 110, w - 56, 120);
    x.fillStyle = '#13212b'; x.font = `700 42px ${T.font}`; x.fillText(T.phoneTitle, w / 2, 170);
    x.fillStyle = '#d3e4f0'; roundRect(x, 44, 256, w - 88, 286, 34); x.fill(); // the message bubble
    x.font = `500 32px ${T.font}`; x.fillStyle = '#1f2d36';
    T.phoneLines.forEach((line, i) => x.fillText(line, w / 2, 300 + i * 66));
    x.fillStyle = '#d5dde2';
    for (let i = 0; i < 4; i++) x.fillRect(70, 590 + i * 34, w - 140 - (i % 2) * 90, 12);
    x.fillStyle = '#1d6b5a'; roundRect(x, 80, 760, w - 160, 92, 46); x.fill();
    x.fillStyle = '#ffffff'; x.font = `600 40px ${T.font}`; x.fillText(lang === 'ar' ? 'تأكيد' : 'Confirm', w / 2, 806);
    x.restore();
  }, tex);
  const phoneScreen = mesh(new THREE.PlaneGeometry(pw, ph), basic({ map: phoneTex, color: col('#ffffff', P.screenDim), transparent: true }));
  phoneScreen.position.z = 0.001; phone.add(phoneScreen);
  // the hand: the thumb resting on the near edge, finger tips just showing round the far edge (matte skin)
  const skin = lambert({ color: col(P.skin) });
  const thumb = mesh(new THREE.CapsuleGeometry(0.0095, 0.05, 8, 14), skin);
  thumb.position.set(-0.045, -0.076, 0.006); thumb.rotation.z = -0.3; thumb.scale.set(1, 1, 0.7); phone.add(thumb);
  const fingerGeo = geo(new THREE.CapsuleGeometry(0.0072, 0.01, 8, 12));
  for (const [fy, dx] of [[-0.016, 0], [-0.038, 0.0015], [-0.06, 0.001]]) {
    const f = mesh(fingerGeo, skin);
    f.position.set(0.038 + dx, fy, -0.005); f.rotation.z = Math.PI / 2 - 0.1; f.scale.set(1, 1, 0.75); phone.add(f);
  }
  placeAt(phone, 0.40, phoneAz, -9.5);
  phone.rotateZ((lang === 'ar' ? 1 : -1) * 0.06);
  near.add(phone); // first child (targetBox) — the lights are added after it
  addLights(near, P, P.near.hemi / P.hemi.intensity, P.near.sun / P.sun.intensity);

  for (const s of [far, mid, near]) s.background = null;
  far.background = col(P.sky[2]);

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
