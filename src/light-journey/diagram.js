// SVG diagram for the light journey. A schematic sagittal eye drawn at 20 units per mm from the same schematic-eye
// dimensions as the procedure illustrations (corneal radius 7.8 mm, axial length 23.5 mm, lens 4 x 9.5 mm).
// Light travels left to right in the drawing coordinates; in Arabic the drawing is mirrored so the journey flows
// right to left, with labels drawn unmirrored on top.
// The diagram is one role="img" with a full text description; every part is also reachable through the step
// controls, so the click targets inside it are a pointer convenience only.

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

const f = (n) => Math.round(n * 10) / 10;
const antX = (y) => CORNEA_ANT.cx - Math.sqrt(CORNEA_ANT.r ** 2 - (y - CY) ** 2);
const postX = (y) => CORNEA_POST.cx - Math.sqrt(CORNEA_POST.r ** 2 - (y - CY) ** 2);
const lensFrontX = (L, h) => L.eq - L.front * Math.sqrt(Math.max(0, 1 - (h / L.r) ** 2));
const lensBackX = (L, h) => L.eq + L.back * Math.sqrt(Math.max(0, 1 - (h / L.r) ** 2));
const arcPt = (r, deg, sgn) => [CX - r * Math.cos(deg * Math.PI / 180), CY + sgn * r * Math.sin(deg * Math.PI / 180)];
const d = (pts) => 'M' + pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' L');

export function lensPath(focus) {
  const L = LENS[focus];
  return `M${L.eq},${CY - L.r} A${L.front},${L.r} 0 0 0 ${L.eq},${CY + L.r} A${L.back},${L.r} 0 0 0 ${L.eq},${CY - L.r}Z`;
}

// Iris leaves (upper and lower): root at the ciliary body, pupillary margin resting on the lens front.
export function irisPaths(light, focus) {
  const ap = PUPIL[light], L = LENS[focus];
  const leaf = (s) => {
    const xm = lensFrontX(L, ap) - 3, xr = 621;
    const y0 = CY + s * IRIS_ROOT, y1 = CY + s * ap;
    const mid = (y0 + y1) / 2;
    return `M${f(xr - 4)},${f(y0)} C${f(xr - 6)},${f(mid)} ${f(xm - 7)},${f(y1 + s * 10)} ${f(xm - 4)},${f(y1)} `
      + `Q${f(xm)},${f(y1 - s * 2)} ${f(xm + 3)},${f(y1 + s * 3)} C${f(xm + 4)},${f(y1 + s * 16)} ${f(xr + 9)},${f(mid)} ${f(xr + 8)},${f(y0 - s * 2)}Z`;
  };
  return [leaf(-1), leaf(1)];
}

// Illustrative rays: from the object, bent strongly at the cornea and gently by the lens, to a focus on the macula.
// Each ray is split into stage segments (step indices) so the journey can be revealed step by step.
export function rays(light, focus) {
  const ap = PUPIL[light], L = LENS[focus], O = OBJ[focus];
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
  retina: [1002, 238, 1068, 214],
  nerve: [1080, 366, 1092, 492]
};

export function svgMarkup({ id, state, lang, labelFor, illustrative }) {
  const mirror = lang === 'ar';
  const mx = (x) => (mirror ? VB.w - x : x);
  const [irisA, irisB] = irisPaths(state.light, state.focus);
  const R = rays(state.light, state.focus);
  const [ox1, oy1] = arcPt(R_OUT - 7.5, 31.3, -1), [ox2, oy2] = arcPt(R_OUT - 7.5, 31.3, 1);
  const [rx1, ry1] = arcPt(R_RET, 67, -1), [rx2, ry2] = arcPt(R_RET, 67, 1);
  const [cx1, cy1] = arcPt(R_RET + 5, 67, -1), [cx2, cy2] = arcPt(R_RET + 5, 67, 1);
  const tearA = [antX(CY - LIMBUS_H) - 4, CY - LIMBUS_H - 3], tearB = [antX(CY + LIMBUS_H) - 4, CY + LIMBUS_H + 3];
  const lim1 = [antX(CY - LIMBUS_H), CY - LIMBUS_H], lim2 = [antX(CY + LIMBUS_H), CY + LIMBUS_H];
  const pl1 = [postX(CY - 115), CY - 115], pl2 = [postX(CY + 115), CY + 115];
  const corneaD = `M${f(lim1[0])},${f(lim1[1])} A${CORNEA_ANT.r},${CORNEA_ANT.r} 0 0 0 ${f(lim2[0])},${f(lim2[1])} L${f(pl2[0])},${f(pl2[1])} A${CORNEA_POST.r},${CORNEA_POST.r} 0 0 1 ${f(pl1[0])},${f(pl1[1])}Z`;
  const aqueousD = `M${f(pl1[0])},${f(pl1[1])} A${CORNEA_POST.r},${CORNEA_POST.r} 0 0 0 ${f(pl2[0])},${f(pl2[1])} L620,${CY + IRIS_ROOT - 4} L626,${CY} L620,${CY - IRIS_ROOT + 4}Z`;
  const tearD = `M${f(tearA[0])},${f(tearA[1])} A${CORNEA_ANT.r + 4},${CORNEA_ANT.r + 4} 0 0 0 ${f(tearB[0])},${f(tearB[1])}`;
  const retinaD = `M${f(rx1)},${f(ry1)} A${R_RET},${R_RET} 0 1 1 ${f(rx2)},${f(ry2)}`;
  const rayPaths = (cls) => R.rays.flatMap((r, i) => r.map((s, j) => `<path class="${cls}" data-stage="${s.stage}" data-ray="${i}-${j}" d="${d(s.pts)}" pathLength="1"/>`)).join('');
  const blocked = R.blocked.map((b, i) => `<path class="lj-ray lj-ray--blocked" data-stage="${b.stage}" d="${d(b.pts)}" pathLength="1"/>`).join('');
  const L = LENS[state.focus];
  const zonules = [-1, 1].flatMap((s) => [0, 1, 2, 3].map((k) => `<line x1="${636 + k * 5}" y1="${CY + s * (IRIS_ROOT + 2 - k * 3)}" x2="${L.eq - 6 + k * 4}" y2="${CY + s * (L.r - 3)}"/>`)).join('');
  const labels = Object.keys(LABELS).map((part) => {
    const P = part === 'scene' ? LABELS.scene[state.focus] : LABELS[part];
    return `<g class="lj-label" data-part="${part}"><line x1="${mx(P[0])}" y1="${P[1]}" x2="${mx(P[2])}" y2="${P[3] + 10}"/><circle cx="${mx(P[0])}" cy="${P[1]}" r="5"/>`
      + `<text x="${mx(P[2])}" y="${P[3]}" text-anchor="middle">${labelFor(part)}</text></g>`;
  }).join('');
  const cells = Array.from({ length: 9 }, (_, i) => {
    const x = 1036 + i * 12.5;
    return i % 3 === 1 ? `<path class="lj-cone" d="M${x - 4},172 L${x - 4},128 L${x},106 L${x + 4},128 L${x + 4},172Z"/>` : `<rect class="lj-rod" x="${x - 3}" y="88" width="6" height="84" rx="3"/>`;
  }).join('');
  const sun = Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return `<line x1="${f(96 + 28 * Math.cos(a))}" y1="${f(88 + 28 * Math.sin(a))}" x2="${f(96 + 38 * Math.cos(a))}" y2="${f(88 + 38 * Math.sin(a))}"/>`; }).join('');
  const ap = PUPIL[state.light];
  return `<svg class="lj-svg" viewBox="0 0 ${VB.w} ${VB.h}" role="img" aria-labelledby="${id}-t ${id}-d" focusable="false">
<title id="${id}-t"></title><desc id="${id}-d"></desc>
<defs>
<radialGradient id="${id}-sky" cx="0.5" cy="0.42" r="0.6"><stop offset="0" class="lj-sky-a"/><stop offset="1" class="lj-sky-b"/></radialGradient>
<radialGradient id="${id}-gel" cx="0.62" cy="0.5" r="0.6"><stop offset="0" class="lj-gel-a"/><stop offset="1" class="lj-gel-b"/></radialGradient>
<radialGradient id="${id}-mac" cx="0.5" cy="0.5" r="0.5"><stop offset="0" class="lj-mac-a"/><stop offset="1" class="lj-mac-b"/></radialGradient>
<filter id="${id}-glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="6"/></filter>
<clipPath id="${id}-inset"><circle cx="1086" cy="112" r="60"/></clipPath>
</defs>
<g class="lj-world"${mirror ? ` transform="matrix(-1 0 0 1 ${VB.w} 0)"` : ''}>
<g class="lj-part" data-part="scene">
<ellipse class="lj-sky" cx="196" cy="236" rx="236" ry="200" fill="url(#${id}-sky)"/>
<g class="lj-sun" data-light="bright"><circle cx="96" cy="88" r="20"/>${sun}</g>
<path class="lj-moon" data-light="dim" d="M108,68 A24,24 0 1 0 108,112 A18,18 0 1 1 108,68Z"/>
<line class="lj-ground" x1="24" y1="372" x2="396" y2="372"/>
<g class="lj-obj" data-focus="far"><rect class="lj-trunk" x="98" y="300" width="12" height="72" rx="3"/><path class="lj-canopy" d="M104,232 C140,232 156,262 150,286 C164,300 150,330 124,326 C112,338 88,336 82,324 C56,326 46,296 62,284 C56,256 76,232 104,232Z"/><circle class="lj-src" cx="104" cy="236" r="5"/></g>
<g class="lj-obj" data-focus="near"><path class="lj-book" d="M300,300 Q338,284 338,268 Q338,284 376,300 L376,346 Q338,330 338,316 Q338,330 300,346Z"/><path class="lj-book-lines" d="M310,306 Q328,298 333,290 M310,318 Q328,310 333,302 M366,306 Q348,298 343,290 M366,318 Q348,310 343,302"/><circle class="lj-src" cx="338" cy="268" r="5"/></g>
</g>
<line class="lj-axis" x1="40" y1="${CY}" x2="${CX + R_OUT + 8}" y2="${CY}"/>
<g class="lj-part" data-part="vitreous"><circle class="lj-vitreous" cx="${CX}" cy="${CY}" r="${R_RET - 3}" fill="url(#${id}-gel)"/></g>
<g class="lj-part" data-part="nerve">
<path class="lj-nerve" d="M1012,326 C1052,330 1090,344 1126,350 L1128,402 C1094,398 1052,392 1012,388Z"/>
<path class="lj-nerve-fibres" d="M1018,338 C1060,344 1092,354 1126,362 M1018,356 C1060,360 1094,368 1126,376 M1018,374 C1060,378 1094,386 1126,390"/>
<path class="lj-brain" d="M1128,330 C1150,306 1196,312 1198,346 C1206,372 1196,414 1168,420 C1146,428 1124,408 1126,384 C1112,370 1114,344 1128,330Z"/>
<path class="lj-gyri" d="M1140,340 C1156,332 1170,344 1162,356 C1176,354 1188,366 1176,378 M1136,372 C1150,366 1160,380 1152,392 C1166,394 1176,404 1166,412"/>
<path class="lj-signal" data-stage="8" d="M1016,357 C1060,361 1094,369 1160,376" pathLength="1"/>
</g>
<path class="lj-sclera" d="M${f(ox1)},${f(oy1)} A${R_OUT - 7.5},${R_OUT - 7.5} 0 1 1 ${f(ox2)},${f(oy2)}"/>
<path class="lj-choroid" d="M${f(cx1)},${f(cy1)} A${R_RET + 5},${R_RET + 5} 0 1 1 ${f(cx2)},${f(cy2)}"/>
<g class="lj-part" data-part="retina">
<path class="lj-retina" d="${retinaD}"/>
<ellipse class="lj-macula" cx="${CX + R_RET - 2}" cy="${CY}" rx="10" ry="32" fill="url(#${id}-mac)"/>
</g>
<g class="lj-ciliary">${[-1, 1].map((s) => `<path d="M627,${CY + s * (IRIS_ROOT + 4)} C640,${CY + s * (IRIS_ROOT + 10)} 660,${CY + s * (IRIS_ROOT + 2)} 664,${CY + s * (IRIS_ROOT - 6)} C652,${CY + s * (IRIS_ROOT - 8)} 636,${CY + s * (IRIS_ROOT - 6)} 627,${CY + s * (IRIS_ROOT + 4)}Z"/>`).join('')}</g>
<g class="lj-zonules">${zonules}</g>
<g class="lj-part" data-part="lens"><path class="lj-lens" d="${lensPath(state.focus)}"/><path class="lj-lens-shine" d="M${L.eq - L.front + 10},${CY - 40} Q${L.eq - L.front + 4},${CY} ${L.eq - L.front + 10},${CY + 40}"/></g>
<g class="lj-part" data-part="aqueous"><path class="lj-aqueous" d="${aqueousD}"/></g>
<g class="lj-part" data-part="iris"><path class="lj-iris" d="${irisA}"/><path class="lj-iris" d="${irisB}"/></g>
<g class="lj-part" data-part="cornea"><path class="lj-cornea" d="${corneaD}"/></g>
<g class="lj-part" data-part="tear"><path class="lj-tear" d="${tearD}"/></g>
<g class="lj-rays">${blocked}${rayPaths('lj-ray')}<g class="lj-flows">${rayPaths('lj-flow')}</g></g>
<circle class="lj-focus-glow" data-stage="7" cx="${FOCUS.x}" cy="${FOCUS.y}" r="16" filter="url(#${id}-glow)"/>
<circle class="lj-focus" data-stage="7" cx="${FOCUS.x}" cy="${FOCUS.y}" r="6"/>
<g class="lj-inset" data-stage="7" data-only="7">
<line class="lj-inset-lead" x1="1048" y1="160" x2="1008" y2="${CY - 20}"/>
<circle class="lj-inset-bg" cx="1086" cy="112" r="60"/>
<g clip-path="url(#${id}-inset)">${cells}<path class="lj-inset-ray" d="M1062,38 L1070,84 M1086,34 L1086,82 M1110,38 L1102,84"/></g>
<circle class="lj-inset-ring" cx="1086" cy="112" r="60"/>
</g>
<g class="lj-hits">
<rect data-hit="scene" x="20" y="40" width="${state.focus === 'near' ? 400 : 340}" height="350" rx="20"/>
<circle data-hit="vitreous" cx="860" cy="300" r="125"/>
<path data-hit="nerve" d="M1010,318 L1200,300 L1200,440 L1010,398Z"/>
<path data-hit="retina" class="lj-hit-line" d="${retinaD}"/>
<path data-hit="lens" d="${lensPath(state.focus)}"/>
<path data-hit="aqueous" d="${aqueousD}"/>
<path data-hit="iris" d="M610,${CY - IRIS_ROOT - 8} L640,${CY - IRIS_ROOT - 8} L640,${CY - ap} L610,${CY - ap}Z M610,${CY + ap} L640,${CY + ap} L640,${CY + IRIS_ROOT + 8} L610,${CY + IRIS_ROOT + 8}Z"/>
<path data-hit="cornea" class="lj-hit-line lj-hit-line--wide" d="${corneaD}"/>
<path data-hit="tear" class="lj-hit-line lj-hit-line--thin" d="${tearD}"/>
</g>
</g>
<g class="lj-labels" aria-hidden="true">${labels}</g>
<g class="lj-illus" aria-hidden="true"><rect x="${mirror ? VB.w - 182 : 26}" y="546" width="156" height="32" rx="16"/><circle cx="${mx(46)}" cy="562" r="4.5"/><text x="${mx(119)}" y="568" text-anchor="middle">${illustrative}</text></g>
</svg>`;
}
