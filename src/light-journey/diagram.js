// SVG diagram for the light journey. A schematic sagittal eye drawn at 20 units per mm from the same schematic-eye
// dimensions as the procedure illustrations (corneal radius 7.8 mm, axial length 23.5 mm, lens 4 x 9.5 mm).
// Light travels left to right in the drawing coordinates; in Arabic the drawing is mirrored so the journey flows
// right to left, with labels drawn unmirrored on top.
// The diagram is one role="img" with a full text description; every part is also reachable through the step
// controls, so the click targets inside it are a pointer convenience only.
//
// Visual reconstruction (2026-11-24): anatomical-atlas rendering (layered sclera / choroid / retina with a
// photoreceptor layer, optic disc and nerve with its sheath, lens nucleus and capsule, iris stroma and pigment
// epithelium, ciliary processes), a light beam (the cone between the outermost rays) under the individual rays,
// photon pulses (.lj-flow, real-length dashes advanced by index.js while the journey plays), refraction highlights
// at the cornea and the lens, a signal travelling along the optic nerve to the visual cortex, and a gentle camera
// push-in per step (CAMERA). Geometry and optics are unchanged: the cornea does about two-thirds of the bending,
// the lens the rest, and the image of the object point lands, inverted, on the macula.

export const VB = { w: 1200, h: 600 };
const CX = 800, CY = 300; // globe centre
const R_OUT = 225, R_RET = 204; // sclera outer (11.25 mm), retina (10.2 mm)
const CORNEA_ANT = { cx: 711, r: 156 }, CORNEA_POST = { cx: 695.4, r: 130 };
const LIMBUS_H = 117; // 5.85 mm
const IRIS_ROOT = 111; // 5.55 mm
export const PUPIL = { bright: 24, dim: 66 }; // pupil radius: 1.2 mm in bright light, 3.3 mm in dim light
export const LENS = { far: { eq: 658, front: 32, back: 48, r: 95 }, near: { eq: 656, front: 42, back: 52, r: 89 } }; // accommodation
const FOCUS = { x: CX + R_RET - 3, y: CY + 9 }; // inverted image point on the macula
const OBJ = { far: { x: 104, y: 236 }, near: { x: 338, y: 268 } };
const DISC = { a: 11.2, b: 21.2 }; // optic disc: degrees below the posterior pole

/** Photon pulse pattern along the rays (user units): a dash, then a gap (see .lj-flow in styles.css). */
export const FLOW = { dash: 9, gap: 61 };
/** Camera per step while playing: focal point (drawing x, y) and scale. The drawn content spans about x 20..1180,
 *  so a push-in that keeps every part and label inside the frame is at most ~3 % (the focal x must stay within
 *  about 515..685; tests/light-journey.spec.js checks every step against the measured content box). */
// Scale capped at 1.01: the label column reaches x ≈ 1187 with Linux/Android fonts (≈ 1180 on Windows), so a larger
// push-in crossed the 1200 frame edge there (full regression 45640303933, step 2 → 1202.4).
export const CAMERA = [
  [600, 300, 1.0], [560, 300, 1.01], [560, 300, 1.01], [570, 300, 1.01], [580, 300, 1.01],
  [600, 300, 1.01], [620, 300, 1.01], [640, 300, 1.01], [640, 300, 1.01]
];
/** Phone layout (containers under 560 px): a tighter, taller crop around the eye, with the scene drawn smaller and
 *  closer (the distance is marked as shortened on the axis), so the eye fills the width and labels stay legible. */
export const COMPACT_VB = { x: 400, y: 30, w: 790, h: 530 };
const OBJ_C = { far: { x: 440, y: 248 }, near: { x: 492, y: 272 } };
const SCENE_C = { far: [388, 130, 0.5], near: [323, 138, 0.5], sky: [372.4, 27.2, 0.6] }; // translate x, y, scale
const LABELS_C = {
  scene: { far: [440, 232, 530, 170], near: [492, 256, 540, 170] },
  tear: [603, 206, 600, 70],
  cornea: [566, 262, 600, 70],
  aqueous: [606, 372, 640, 548],
  iris: [618, 214, 680, 70],
  lens: [668, 244, 760, 70],
  vitreous: [860, 226, 820, 70],
  retina: [978, 400, 860, 548],
  nerve: [1070, 366, 960, 548]
};
export function cameraTransform(step, lang) {
  const [x0, y, s] = CAMERA[step] || CAMERA[0];
  const x = lang === 'ar' ? VB.w - x0 : x0;
  return `translate(${f(x * (1 - s))}px, ${f(y * (1 - s))}px) scale(${s})`;
}

const f = (n) => Math.round(n * 10) / 10;
const antX = (y) => CORNEA_ANT.cx - Math.sqrt(CORNEA_ANT.r ** 2 - (y - CY) ** 2);
const postX = (y) => CORNEA_POST.cx - Math.sqrt(CORNEA_POST.r ** 2 - (y - CY) ** 2);
const lensFrontX = (L, h) => L.eq - L.front * Math.sqrt(Math.max(0, 1 - (h / L.r) ** 2));
const lensBackX = (L, h) => L.eq + L.back * Math.sqrt(Math.max(0, 1 - (h / L.r) ** 2));
const arcPt = (r, deg, sgn) => [CX - r * Math.cos(deg * Math.PI / 180), CY + sgn * r * Math.sin(deg * Math.PI / 180)];
const d = (pts) => 'M' + pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' L');
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);

/** Lens outline; k < 1 draws the nucleus (same shape, scaled about the lens centre). */
export function lensPath(focus, k = 1) {
  const L = LENS[focus];
  const fr = L.front * k, bk = L.back * k, r = L.r * k, eq = L.eq + (L.back - L.front) * (1 - k) * 0.5;
  return `M${f(eq)},${f(CY - r)} A${f(fr)},${f(r)} 0 0 0 ${f(eq)},${f(CY + r)} A${f(bk)},${f(r)} 0 0 0 ${f(eq)},${f(CY - r)}Z`;
}

// Iris leaves (upper and lower): root at the ciliary body, pupillary margin resting on the lens front.
function irisGeom(light, focus, s) {
  const ap = PUPIL[light], L = LENS[focus];
  const xm = lensFrontX(L, ap) - 3, xr = 621;
  const y0 = CY + s * IRIS_ROOT, y1 = CY + s * ap;
  return { xm, xr, y0, y1, mid: (y0 + y1) / 2 };
}
export function irisPaths(light, focus) {
  const leaf = (s) => {
    const { xm, xr, y0, y1, mid } = irisGeom(light, focus, s);
    return `M${f(xr - 4)},${f(y0)} C${f(xr - 6)},${f(mid)} ${f(xm - 7)},${f(y1 + s * 10)} ${f(xm - 4)},${f(y1)} `
      + `Q${f(xm)},${f(y1 - s * 2)} ${f(xm + 3)},${f(y1 + s * 3)} C${f(xm + 4)},${f(y1 + s * 16)} ${f(xr + 9)},${f(mid)} ${f(xr + 8)},${f(y0 - s * 2)}Z`;
  };
  return [leaf(-1), leaf(1)];
}
// posterior pigment epithelium (the dark back surface of each leaf) and a few stromal folds
function irisDetail(light, focus) {
  return [-1, 1].map((s) => {
    const { xm, xr, y0, y1, mid } = irisGeom(light, focus, s);
    const pe = `M${f(xm + 3)},${f(y1 + s * 3)} C${f(xm + 4)},${f(y1 + s * 16)} ${f(xr + 9)},${f(mid)} ${f(xr + 8)},${f(y0 - s * 2)}`;
    const fib = [0.3, 0.55, 0.8].map((t) => {
      const y = y1 + (y0 - y1) * t, x = xm + (xr - xm) * t;
      return `M${f(x - 2)},${f(y - s * 4)} Q${f(x + 2)},${f(y)} ${f(x - 1)},${f(y + s * 5)}`;
    }).join(' ');
    return { pe, fib };
  });
}

// Illustrative rays: from the object, bent strongly at the cornea and gently by the lens, to a focus on the macula.
// Each ray is split into stage segments (step indices) so the journey can be revealed step by step.
export function rays(light, focus, O = OBJ[focus]) {
  const ap = PUPIL[light], L = LENS[focus];
  const out = [];
  for (let i = 0; i < 5; i++) {
    const hc = (i / 2 - 1) * ap * 0.86;
    const p1 = [antX(CY + hc), CY + hc];
    const y2 = CY + hc * 0.95, p2 = [postX(y2), y2];
    const h3 = hc * 0.9, p3 = [lensFrontX(L, h3) - 1, CY + h3];
    const h4 = hc * 0.8, p4 = [lensBackX(L, h4), CY + h4];
    out.push([
      { stage: 0, pts: [[O.x, O.y], p1] },
      { stage: 2, pts: [p1, p2] },
      { stage: 3, pts: [p2, p3] },
      { stage: 5, pts: [p3, p4] },
      { stage: 6, pts: [p4, [FOCUS.x, FOCUS.y]] }
    ]);
  }
  // rays outside the pupil stop on the iris: the aperture at work
  const blocked = [];
  for (const s of [-1, 1]) for (const k of [1, 2]) {
    const hc = s * (ap + 18 * k);
    if (Math.abs(hc) > IRIS_ROOT - 8) continue;
    const p1 = [antX(CY + hc), CY + hc];
    blocked.push({ stage: 4, pts: [[O.x, O.y], p1, [616, CY + hc * 0.97]] });
  }
  return { rays: out, blocked };
}

// Label anchors per part (drawing coordinates): [anchorX, anchorY, labelX, labelY].
export const LABELS = {
  scene: { far: [104, 214, 104, 196], near: [338, 252, 338, 226] },
  tear: [603, 206, 520, 118],
  cornea: [566, 262, 452, 176],
  aqueous: [606, 372, 486, 476],
  iris: [618, 214, 596, 58],
  lens: [668, 244, 720, 58],
  vitreous: [860, 226, 870, 58],
  retina: [1002, 238, 1040, 214],
  nerve: [1070, 366, 1030, 500]
};

export function svgMarkup({ id, state, lang, labelFor, illustrative, compact = false }) {
  const mirror = lang === 'ar';
  const O = (compact ? OBJ_C : OBJ)[state.focus];
  const tr = (k) => (compact ? `translate(${SCENE_C[k][0]} ${SCENE_C[k][1]}) scale(${SCENE_C[k][2]})` : 'translate(0 0) scale(1)');
  const vb = compact ? { ...COMPACT_VB, x: mirror ? VB.w - COMPACT_VB.x - COMPACT_VB.w : COMPACT_VB.x } : { x: 0, y: 0, w: VB.w, h: VB.h };
  const mx = (x) => (mirror ? VB.w - x : x);
  const [irisA, irisB] = irisPaths(state.light, state.focus);
  const [detA, detB] = irisDetail(state.light, state.focus);
  const R = rays(state.light, state.focus, O);
  const ap = PUPIL[state.light];
  const L = LENS[state.focus];
  const arc = (r, a0, s0, a1, s1) => { const [x0, y0] = arcPt(r, a0, s0), [x1, y1] = arcPt(r, a1, s1); return `M${f(x0)},${f(y0)} A${r},${r} 0 0 1 ${f(x1)},${f(y1)}`; };
  // retina-like layers stop at the optic disc (DISC.a..DISC.b degrees below the posterior pole)
  const layer = (r) => `${arc(r, 67, -1, 180 - DISC.a, 1)} ${arc(r, 180 - DISC.b, 1, 67, 1)}`;
  const [ox1, oy1] = arcPt(R_OUT - 7.5, 31.3, -1), [ox2, oy2] = arcPt(R_OUT - 7.5, 31.3, 1);
  const [ex1, ey1] = arcPt(R_OUT, 30, -1), [ex2, ey2] = arcPt(R_OUT, 30, 1);
  const [rx1, ry1] = arcPt(R_RET, 67, -1), [rx2, ry2] = arcPt(R_RET, 67, 1);
  const [cx1, cy1] = arcPt(R_RET + 5, 67, -1), [cx2, cy2] = arcPt(R_RET + 5, 67, 1);
  const [da1x, da1y] = arcPt(R_RET, 180 - DISC.a, 1), [db1x, db1y] = arcPt(R_RET, 180 - DISC.b, 1);
  const tearA = [antX(CY - LIMBUS_H) - 4, CY - LIMBUS_H - 3], tearB = [antX(CY + LIMBUS_H) - 4, CY + LIMBUS_H + 3];
  const lim1 = [antX(CY - LIMBUS_H), CY - LIMBUS_H], lim2 = [antX(CY + LIMBUS_H), CY + LIMBUS_H];
  const pl1 = [postX(CY - 115), CY - 115], pl2 = [postX(CY + 115), CY + 115];
  const corneaD = `M${f(lim1[0])},${f(lim1[1])} A${CORNEA_ANT.r},${CORNEA_ANT.r} 0 0 0 ${f(lim2[0])},${f(lim2[1])} L${f(pl2[0])},${f(pl2[1])} A${CORNEA_POST.r},${CORNEA_POST.r} 0 0 1 ${f(pl1[0])},${f(pl1[1])}Z`;
  const corneaFrontD = `M${f(lim1[0])},${f(lim1[1])} A${CORNEA_ANT.r},${CORNEA_ANT.r} 0 0 0 ${f(lim2[0])},${f(lim2[1])}`;
  const corneaBackD = `M${f(pl1[0])},${f(pl1[1])} A${CORNEA_POST.r},${CORNEA_POST.r} 0 0 0 ${f(pl2[0])},${f(pl2[1])}`;
  const gl1 = [antX(CY - 96) + 6, CY - 96], gl2 = [antX(CY - 46) + 5, CY - 46];
  const glintD = `M${f(gl1[0])},${f(gl1[1])} A${CORNEA_ANT.r - 6},${CORNEA_ANT.r - 6} 0 0 0 ${f(gl2[0])},${f(gl2[1])}`;
  const aqueousD = `M${f(pl1[0])},${f(pl1[1])} A${CORNEA_POST.r},${CORNEA_POST.r} 0 0 0 ${f(pl2[0])},${f(pl2[1])} L620,${CY + IRIS_ROOT - 4} L626,${CY} L620,${CY - IRIS_ROOT + 4}Z`;
  const tearD = `M${f(tearA[0])},${f(tearA[1])} A${CORNEA_ANT.r + 4},${CORNEA_ANT.r + 4} 0 0 0 ${f(tearB[0])},${f(tearB[1])}`;
  const retinaD = `M${f(rx1)},${f(ry1)} A${R_RET},${R_RET} 0 1 1 ${f(rx2)},${f(ry2)}`; // hit target: the whole arc
  const discD = `M${f(da1x)},${f(da1y)} C${f(da1x + 10)},${f(da1y + 6)} ${f(db1x + 12)},${f(db1y - 8)} ${f(db1x)},${f(db1y)} L${f(db1x + 20)},${f(db1y + 6)} L${f(da1x + 24)},${f(da1y - 4)}Z`;

  // rays: per stage segment, the beam (the cone between the outer rays), the ray lines and the photon pulses
  const segLen = R.rays.map((r) => r.map((s) => dist(s.pts[0], s.pts[1])));
  const rayPaths = R.rays.flatMap((r, i) => r.map((s, j) => `<path class="lj-ray" data-stage="${s.stage}" data-ray="${i}-${j}" d="${d(s.pts)}" pathLength="1"/>`)).join('');
  const flowPaths = (cls) => R.rays.flatMap((r, i) => {
    let cum = [0, 35, 14, 49, 24][i]; // stagger the rays so the pulses do not march in step
    return r.map((s, j) => {
      const base = cum; cum += segLen[i][j];
      return `<path class="${cls}" data-stage="${s.stage}" data-base="${f(base)}" stroke-dashoffset="${f(base)}" d="${d(s.pts)}"/>`;
    });
  }).join('');
  const top = R.rays[0], bot = R.rays[R.rays.length - 1];
  const beams = top.map((s, j) => `<path class="lj-beam" data-stage="${s.stage}" d="${d([s.pts[0], s.pts[1], bot[j].pts[1], bot[j].pts[0]])}Z"/>`).join('');
  const blocked = R.blocked.map((b) => `<path class="lj-ray lj-ray--blocked" data-stage="${b.stage}" d="${d(b.pts)}" pathLength="1"/>`).join('');
  const blockedEnds = R.blocked.map((b) => { const [x, y] = b.pts[2]; return `<circle class="lj-absorb" data-stage="${b.stage}" cx="${f(x)}" cy="${f(y)}" r="3.5"/>`; }).join('');
  // refraction highlights: where the rays bend (cornea on step 3, lens on step 6)
  const hR = ap * 0.86 + 10;
  const refrCornea = `M${f(antX(CY - hR))},${f(CY - hR)} A${CORNEA_ANT.r},${CORNEA_ANT.r} 0 0 0 ${f(antX(CY + hR))},${f(CY + hR)}`;
  const hL = Math.min(L.r - 8, ap * 0.86 * 0.9 + 10);
  const refrLens = `M${f(lensFrontX(L, -hL))},${f(CY - hL)} A${L.front},${L.r} 0 0 0 ${f(lensFrontX(L, hL))},${f(CY + hL)} M${f(lensBackX(L, -hL))},${f(CY - hL)} A${L.back},${L.r} 0 0 1 ${f(lensBackX(L, hL))},${f(CY + hL)}`;
  const zonules = [-1, 1].flatMap((s) => [0, 1, 2, 3, 4].map((k) => `<line x1="${636 + k * 5}" y1="${CY + s * (IRIS_ROOT + 2 - k * 3)}" x2="${L.eq - 8 + k * 4}" y2="${CY + s * (L.r - 3 + (k % 2) * 2)}"/>`)).join('');
  const ciliary = [-1, 1].map((s) => {
    const y = (o) => CY + s * (IRIS_ROOT + o);
    // ciliary body with scalloped processes along its inner edge
    return `<path d="M624,${y(6)} C640,${y(14)} 662,${y(8)} 672,${y(0)} C666,${y(-4)} 662,${y(-9)} 656,${y(-6)} C652,${y(-11)} 646,${y(-10)} 643,${y(-6)} C639,${y(-11)} 633,${y(-10)} 630,${y(-5)} C626,${y(-8)} 623,${y(-3)} 624,${y(6)}Z"/>`;
  }).join('');
  const labelNames = Object.keys(LABELS);
  const LT = compact ? LABELS_C : LABELS;
  const anchor = (part) => (part === 'scene' ? LT.scene[state.focus] : LT[part]);
  const labels = labelNames.map((part, i) => {
    const P = anchor(part);
    return `<g class="lj-label" data-part="${part}"><line x1="${mx(P[0])}" y1="${P[1]}" x2="${mx(P[2])}" y2="${P[3] + 10}"/><circle cx="${mx(P[0])}" cy="${P[1]}" r="5"/>`
      + `<text x="${mx(P[2])}" y="${P[3]}" text-anchor="middle"><tspan class="lj-label-n">${String(i + 1).padStart(2, '0')}</tspan> ${labelFor(part)}</text></g>`;
  }).join('');
  const cells = Array.from({ length: 9 }, (_, i) => {
    const x = 1036 + i * 12.5;
    return i % 3 === 1 ? `<path class="lj-cone" d="M${x - 4},172 L${x - 4},128 L${x},106 L${x + 4},128 L${x + 4},172Z"/>` : `<rect class="lj-rod" x="${x - 3}" y="88" width="6" height="84" rx="3"/>`;
  }).join('');
  const sun = Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6, r1 = 28, r2 = i % 2 ? 35 : 41; return `<line x1="${f(96 + r1 * Math.cos(a))}" y1="${f(88 + r1 * Math.sin(a))}" x2="${f(96 + r2 * Math.cos(a))}" y2="${f(88 + r2 * Math.sin(a))}"/>`; }).join('');
  const sig = 'M1004,358 C1046,360 1076,366 1100,370 C1126,374 1148,366 1166,350';
  const sigA = 'M1008,344 C1048,346 1078,352 1100,358 C1124,362 1146,354 1164,342';
  const sigB = 'M1000,374 C1046,376 1076,382 1100,384 C1128,386 1150,374 1168,358';
  const lg = (name, x1, y1, x2, y2, stops) => `<linearGradient id="${id}-${name}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c]) => `<stop offset="${o}" class="${c}"/>`).join('')}</linearGradient>`;
  return `<svg class="lj-svg" viewBox="${vb.x} ${vb.y} ${vb.w} ${vb.h}" data-layout="${compact ? 'compact' : 'wide'}" role="img" aria-labelledby="${id}-t ${id}-d" focusable="false">
<title id="${id}-t"></title><desc id="${id}-d"></desc>
<defs>
<radialGradient id="${id}-sky" cx="0.5" cy="0.42" r="0.6"><stop offset="0" class="lj-sky-a"/><stop offset="1" class="lj-sky-b"/></radialGradient>
<radialGradient id="${id}-sunglow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" class="lj-sunglow-a"/><stop offset="1" class="lj-sunglow-b"/></radialGradient>
<radialGradient id="${id}-gel" gradientUnits="userSpaceOnUse" cx="${CX - 70}" cy="${CY - 50}" r="${R_RET + 30}"><stop offset="0" class="lj-gel-a"/><stop offset="1" class="lj-gel-b"/></radialGradient>
<radialGradient id="${id}-shade" gradientUnits="userSpaceOnUse" cx="${CX}" cy="${CY}" r="${R_RET}"><stop offset="0.6" class="lj-shade-a"/><stop offset="1" class="lj-shade-b"/></radialGradient>
<radialGradient id="${id}-sclera" gradientUnits="userSpaceOnUse" cx="${CX}" cy="${CY}" r="${R_OUT}"><stop offset="0.93" class="lj-sclera-in"/><stop offset="0.965" class="lj-sclera-mid"/><stop offset="1" class="lj-sclera-out"/></radialGradient>
<radialGradient id="${id}-mac" cx="0.5" cy="0.5" r="0.5"><stop offset="0" class="lj-mac-a"/><stop offset="1" class="lj-mac-b"/></radialGradient>
<radialGradient id="${id}-lens" cx="0.45" cy="0.42" r="0.62"><stop offset="0" class="lj-lens-a"/><stop offset="0.6" class="lj-lens-b"/><stop offset="1" class="lj-lens-c"/></radialGradient>
${lg('cornea', 550, 0, 600, 0, [[0, 'lj-cornea-a'], [1, 'lj-cornea-b']])}
${lg('iris', 614, 0, 652, 0, [[0, 'lj-iris-a'], [1, 'lj-iris-b']])}
${lg('nerve', 1000, 0, 1122, 0, [[0, 'lj-nerve-a'], [1, 'lj-nerve-b']])}
${lg('brain', 1110, 296, 1196, 412, [[0, 'lj-brain-a'], [1, 'lj-brain-b']])}
<filter id="${id}-glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="${id}-soft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="4"/></filter>
<clipPath id="${id}-inset"><circle cx="1086" cy="112" r="60"/></clipPath>
</defs>
<rect class="lj-plate" x="${vb.x + 12}" y="${vb.y + 12}" width="${vb.w - 24}" height="${vb.h - 24}" rx="14"/>
<g class="lj-cam">
<g class="lj-world"${mirror ? ` transform="matrix(-1 0 0 1 ${VB.w} 0)"` : ''}>
<g class="lj-part" data-part="scene">
<ellipse class="lj-sky" cx="${compact ? 452 : 210}" cy="${compact ? 210 : 236}" rx="${compact ? 48 : 190}" ry="${compact ? 150 : 196}" fill="url(#${id}-sky)"/>
<g class="lj-sun" data-light="bright" transform="${tr('sky')}"><circle cx="96" cy="88" r="62" fill="url(#${id}-sunglow)"/>${sun}<circle class="lj-sun-disc" cx="96" cy="88" r="20"/></g>
<g class="lj-moon" data-light="dim" transform="${tr('sky')}"><path d="M108,68 A24,24 0 1 0 108,112 A18,18 0 1 1 108,68Z"/><circle class="lj-star" cx="170" cy="70" r="2.2"/><circle class="lj-star" cx="52" cy="150" r="1.8"/><circle class="lj-star" cx="204" cy="122" r="1.6"/></g>
<line class="lj-ground" x1="${compact ? 404 : 24}" y1="${compact ? 318 : 372}" x2="${compact ? 520 : 396}" y2="${compact ? 318 : 372}"/>
<path class="lj-break" d="${compact ? `M${O.x + 34},${CY - 14} l-8,28 M${O.x + 42},${CY - 14} l-8,28` : `M${O.x},${O.y}`}"/>
<g class="lj-obj" data-focus="far" transform="${tr('far')}"><ellipse class="lj-shadow" cx="106" cy="373" rx="46" ry="5"/><path class="lj-trunk" d="M99,372 L101,318 C101,306 96,298 92,292 L98,292 C102,298 104,302 105,306 C107,298 112,292 118,288 L121,292 C114,298 110,306 110,318 L111,372Z"/><path class="lj-canopy" d="M104,232 C140,232 156,262 150,286 C164,300 150,330 124,326 C112,338 88,336 82,324 C56,326 46,296 62,284 C56,256 76,232 104,232Z"/><path class="lj-canopy-hi" d="M98,240 C118,236 134,248 136,262 C124,256 110,256 98,262 C84,268 74,280 70,290 C64,270 76,246 98,240Z"/><circle class="lj-src" cx="104" cy="236" r="5"/></g>
<g class="lj-obj" data-focus="near" transform="${tr('near')}"><ellipse class="lj-shadow" cx="338" cy="352" rx="44" ry="5"/><path class="lj-book" d="M300,300 Q338,284 338,268 Q338,284 376,300 L376,346 Q338,330 338,316 Q338,330 300,346Z"/><path class="lj-book-lines" d="M310,306 Q328,298 333,290 M310,318 Q328,310 333,302 M310,330 Q328,322 333,314 M366,306 Q348,298 343,290 M366,318 Q348,310 343,302 M366,330 Q348,322 343,314"/><circle class="lj-src" cx="338" cy="268" r="5"/></g>
</g>
<line class="lj-axis" x1="${compact ? 404 : 40}" y1="${CY}" x2="${CX + R_OUT + 8}" y2="${CY}"/>
<g class="lj-part" data-part="vitreous"><circle class="lj-vitreous" cx="${CX}" cy="${CY}" r="${R_RET - 3}" fill="url(#${id}-gel)"/><circle class="lj-vit-shade" cx="${CX}" cy="${CY}" r="${R_RET - 3}" fill="url(#${id}-shade)"/>
<path class="lj-vit-fibres" d="M712,206 C790,194 866,212 934,204 M704,394 C780,406 864,390 938,398 M724,246 C800,236 880,254 958,246 M728,356 C806,366 884,348 956,356"/></g>
<g class="lj-part" data-part="nerve">
<path class="lj-sheath" d="M996,318 C1040,318 1080,330 1122,340 L1122,408 C1080,404 1040,402 990,402Z"/>
<path class="lj-nerve" d="M998,328 C1042,329 1080,340 1122,348 L1122,400 C1080,396 1042,394 994,392Z" fill="url(#${id}-nerve)"/>
<path class="lj-nerve-fibres" d="M1010,338 C1052,342 1090,352 1122,358 M1008,350 C1052,354 1090,363 1122,368 M1006,366 C1050,370 1090,377 1122,380 M1004,380 C1050,384 1090,389 1122,391"/>
<path class="lj-vessel" d="M1122,374 C1086,371 1046,364 1008,359"/>
<g class="lj-brain-g" transform="translate(-20 0)">
<path class="lj-brain" d="M1112,356 C1106,326 1126,298 1156,296 C1182,294 1198,314 1197,342 C1197,362 1190,376 1176,382 C1170,394 1152,400 1138,394 C1122,394 1114,378 1112,356Z" fill="url(#${id}-brain)"/>
<path class="lj-cerebellum" d="M1168,384 C1178,380 1194,386 1194,398 C1194,410 1178,414 1168,406 C1162,400 1162,388 1168,384Z"/>
<path class="lj-gyri" d="M1124,330 C1136,316 1152,320 1150,334 M1158,306 C1170,304 1180,314 1172,324 C1184,324 1192,334 1184,344 M1122,362 C1132,350 1148,354 1146,366 M1152,346 C1162,342 1170,350 1164,360 C1172,362 1178,370 1170,376 M1172,392 C1180,392 1186,396 1188,402"/>
<ellipse class="lj-cortex" data-stage="8" cx="1184" cy="348" rx="11" ry="22" filter="url(#${id}-soft)"/>
</g>
<path class="lj-pulse" data-stage="8" data-base="0.33" stroke-dashoffset="0.33" d="${sigA}" pathLength="1"/>
<path class="lj-signal" data-stage="8" data-base="0" stroke-dashoffset="0" d="${sig}" pathLength="1"/>
<path class="lj-pulse" data-stage="8" data-base="0.66" stroke-dashoffset="0.66" d="${sigB}" pathLength="1"/>
</g>
<path class="lj-sclera" d="M${f(ox1)},${f(oy1)} A${R_OUT - 7.5},${R_OUT - 7.5} 0 1 1 ${f(ox2)},${f(oy2)}" stroke="url(#${id}-sclera)"/>
<path class="lj-sclera-edge" d="M${f(ex1)},${f(ey1)} A${R_OUT},${R_OUT} 0 1 1 ${f(ex2)},${f(ey2)}"/>
<path class="lj-choroid" d="${layer(R_RET + 5)}"/>
<g class="lj-part" data-part="retina">
<path class="lj-retina" d="${layer(R_RET)}"/>
<path class="lj-retina-cells" d="${layer(R_RET + 2)}"/>
<path class="lj-retina-ilm" d="${layer(R_RET - 3.4)}"/>
<path class="lj-disc" d="${discD}"/>
<ellipse class="lj-macula" cx="${CX + R_RET - 3}" cy="${CY}" rx="12" ry="36" fill="url(#${id}-mac)"/>
<path class="lj-fovea" d="M${CX + R_RET - 4.5},${CY - 13} Q${CX + R_RET + 1},${CY} ${CX + R_RET - 4.5},${CY + 13}"/>
</g>
<g class="lj-ciliary">${ciliary}</g>
<g class="lj-zonules">${zonules}</g>
<g class="lj-part" data-part="lens"><path class="lj-lens" d="${lensPath(state.focus)}" fill="url(#${id}-lens)"/><path class="lj-lens-nucleus" d="${lensPath(state.focus, 0.6)}"/><path class="lj-lens-shine" d="M${L.eq - L.front + 10},${CY - 50} Q${L.eq - L.front + 3},${CY - 14} ${L.eq - L.front + 7},${CY + 22}"/></g>
<g class="lj-part" data-part="aqueous"><path class="lj-aqueous" d="${aqueousD}"/></g>
<g class="lj-part" data-part="iris"><path class="lj-iris" d="${irisA}" fill="url(#${id}-iris)"/><path class="lj-iris" d="${irisB}" fill="url(#${id}-iris)"/>
<path class="lj-iris-pe" d="${detA.pe}"/><path class="lj-iris-pe" d="${detB.pe}"/><path class="lj-iris-fib" d="${detA.fib}"/><path class="lj-iris-fib" d="${detB.fib}"/></g>
<g class="lj-part" data-part="cornea"><path class="lj-cornea" d="${corneaD}" fill="url(#${id}-cornea)"/><path class="lj-cornea-epi" d="${corneaFrontD}"/><path class="lj-cornea-endo" d="${corneaBackD}"/><path class="lj-glint" d="${glintD}"/></g>
<g class="lj-part" data-part="tear"><path class="lj-tear" d="${tearD}"/></g>
<g class="lj-rays">
<g class="lj-beams">${beams}</g>
${blocked}${blockedEnds}${rayPaths}
<g class="lj-flows">${flowPaths('lj-flow lj-flow--halo')}${flowPaths('lj-flow')}</g>
</g>
<path class="lj-refract" data-stage="2" data-only="2" d="${refrCornea}"/>
<path class="lj-refract" data-stage="5" data-only="5" d="${refrLens}"/>
<circle class="lj-focus-glow" data-stage="7" cx="${FOCUS.x}" cy="${FOCUS.y}" r="16" filter="url(#${id}-glow)"/>
<circle class="lj-focus" data-stage="7" cx="${FOCUS.x}" cy="${FOCUS.y}" r="6"/>
<g class="lj-inset" data-stage="7" data-only="7">
<line class="lj-inset-lead" x1="1048" y1="160" x2="1008" y2="${CY - 20}"/>
<circle class="lj-inset-bg" cx="1086" cy="112" r="60"/>
<g clip-path="url(#${id}-inset)">${cells}<path class="lj-inset-ray" d="M1062,38 L1070,84 M1086,34 L1086,82 M1110,38 L1102,84"/></g>
<circle class="lj-inset-ring" cx="1086" cy="112" r="60"/>
<circle class="lj-inset-ring2" cx="1086" cy="112" r="66"/>
</g>
<g class="lj-hits">
<rect data-hit="scene" x="${compact ? 404 : 20}" y="40" width="${compact ? 140 : state.focus === 'near' ? 400 : 340}" height="${compact ? 290 : 350}" rx="20"/>
<circle data-hit="vitreous" cx="860" cy="300" r="125"/>
<path data-hit="nerve" d="M1010,318 L1108,290 L1180,290 L1180,420 L1010,404Z"/>
<path data-hit="retina" class="lj-hit-line" d="${retinaD}"/>
<path data-hit="lens" d="${lensPath(state.focus)}"/>
<path data-hit="aqueous" d="${aqueousD}"/>
<path data-hit="iris" d="M610,${CY - IRIS_ROOT - 8} L640,${CY - IRIS_ROOT - 8} L640,${CY - ap} L610,${CY - ap}Z M610,${CY + ap} L640,${CY + ap} L640,${CY + IRIS_ROOT + 8} L610,${CY + IRIS_ROOT + 8}Z"/>
<path data-hit="cornea" class="lj-hit-line lj-hit-line--wide" d="${corneaD}"/>
<path data-hit="tear" class="lj-hit-line lj-hit-line--thin" d="${tearD}"/>
</g>
</g>
<g class="lj-labels" aria-hidden="true">${labels}</g>
</g>
<g class="lj-illus" aria-hidden="true"><rect x="${mirror ? VB.w - 182 : 26}" y="546" width="156" height="32" rx="16"/><circle cx="${mx(46)}" cy="562" r="4.5"/><text x="${mx(119)}" y="568" text-anchor="middle">${illustrative}</text></g>
</svg>`;
}
