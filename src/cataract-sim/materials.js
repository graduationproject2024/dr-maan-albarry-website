// Materials and procedural textures. Every texture is painted at runtime on a <canvas> by the code in this
// file (original work, no downloaded images), so the licensing is clean — see ASSET_LICENSES.md.
import * as THREE from 'three';
import { WOUND, EYE } from './anatomy.js';

// Small deterministic PRNG so textures look identical on every load.
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

function toTexture(c, { srgb = true, repeatX = false } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = repeatX ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  t.wrapT = THREE.ClampToEdgeWrapping;
  t.anisotropy = 4;
  return t;
}

// ---------- Iris: polar layout (x = angle, y = radial v; canvas top = v 1 = iris root) ----------
export function irisTexture() {
  const W = 2048, H = 512;
  const [c, g] = canvas(W, H);
  const R = rng(7);
  const y = (v) => (1 - v) * H;
  // base radial colour bands (hazel-brown stroma)
  const grad = g.createLinearGradient(0, y(1), 0, y(0));
  grad.addColorStop(0.0, '#2a1a10'); // root / limbal shadow
  grad.addColorStop(0.08, '#4a2f1b');
  grad.addColorStop(0.35, '#6e4a2a');
  grad.addColorStop(0.6, '#7d5530');
  grad.addColorStop(0.7, '#9a6c3a'); // collarette zone
  grad.addColorStop(0.78, '#6a4424');
  grad.addColorStop(0.9, '#4b2c17');
  grad.addColorStop(0.94, '#2b170c'); // pupillary ruff
  grad.addColorStop(0.97, '#140b06');
  grad.addColorStop(1.0, '#0b0604');
  g.fillStyle = grad; g.fillRect(0, 0, W, H);
  // radial stromal fibres
  for (let i = 0; i < 4200; i++) {
    const x0 = R() * W, v0 = 0.08 + R() * 0.15, v1 = 0.55 + R() * 0.4;
    const light = R() < 0.6;
    g.strokeStyle = light ? `rgba(${190 + R() * 40},${140 + R() * 40},${80 + R() * 30},${0.05 + R() * 0.12})` : `rgba(25,12,5,${0.08 + R() * 0.14})`;
    g.lineWidth = 0.6 + R() * 1.8;
    g.beginPath();
    const amp = 2 + R() * 5, ph = R() * 6.28, fr = 4 + R() * 8;
    for (let k = 0; k <= 24; k++) {
      const v = v0 + (v1 - v0) * (k / 24);
      const xx = x0 + Math.sin(ph + v * fr) * amp;
      if (k === 0) g.moveTo(xx, y(v)); else g.lineTo(xx, y(v));
    }
    g.stroke();
  }
  // collarette: jagged light ridge with shadow
  const collar = (off, col, w) => {
    g.strokeStyle = col; g.lineWidth = w; g.beginPath();
    for (let x = 0; x <= W; x += 8) {
      const v = 0.705 + off + 0.025 * Math.sin(x * 0.021) + 0.015 * Math.sin(x * 0.067 + 1.3) + (R() - 0.5) * 0.008;
      if (x === 0) g.moveTo(x, y(v)); else g.lineTo(x, y(v));
    }
    g.stroke();
  };
  collar(-0.012, 'rgba(30,15,6,0.45)', 5);
  collar(0, 'rgba(214,170,110,0.55)', 3);
  // crypts (dark lacunae with lighter rims)
  for (let i = 0; i < 150; i++) {
    const x = R() * W;
    const inner = R() < 0.5;
    const v = inner ? 0.66 + R() * 0.07 : 0.3 + R() * 0.3;
    const rw = 2 + R() * (inner ? 5 : 7), rh = 7 + R() * (inner ? 12 : 22);
    g.fillStyle = `rgba(38,20,9,${0.18 + R() * 0.24})`;
    g.beginPath(); g.ellipse(x, y(v), rw, rh, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = `rgba(200,150,90,${0.08 + R() * 0.12})`; g.lineWidth = 1;
    g.beginPath(); g.ellipse(x, y(v), rw + 1.5, rh + 1.5, 0, 0, Math.PI * 2); g.stroke();
  }
  // circumferential contraction furrows near the periphery
  for (const v of [0.2, 0.27, 0.34]) {
    g.strokeStyle = 'rgba(20,10,4,0.32)'; g.lineWidth = 2;
    let x = 0;
    while (x < W) {
      const len = 60 + R() * 220;
      g.beginPath();
      g.moveTo(x, y(v + (R() - 0.5) * 0.02));
      g.lineTo(x + len, y(v + (R() - 0.5) * 0.02));
      g.stroke();
      x += len + 30 + R() * 120;
    }
  }
  // beaded pupillary ruff
  for (let x = 0; x < W; x += 5) {
    g.fillStyle = `rgba(${60 + R() * 30},${30 + R() * 15},${12},${0.5 + R() * 0.4})`;
    g.beginPath(); g.ellipse(x, y(0.075), 2.5 + R() * 2, 4 + R() * 4, 0, 0, Math.PI * 2); g.fill();
  }
  // posterior pigment epithelium region (v < 0.045)
  g.fillStyle = '#0a0503'; g.fillRect(0, y(0.045), W, H - y(0.045));
  return toTexture(c, { repeatX: true });
}

// ---------- Sclera + inner globe: x = angle, y = v (0..0.5 outer pole->limbus, 0.52..1 inner limbus->pole) ----------
export function scleraTexture() {
  const W = 2048, H = 1024;
  const [c, g] = canvas(W, H);
  const R = rng(11);
  const y = (v) => (1 - v) * H;
  // outer sclera: warm ivory, slightly cooler/grey-blue at the limbus
  let grad = g.createLinearGradient(0, y(0), 0, y(0.5));
  grad.addColorStop(0, '#e9e1d3');
  grad.addColorStop(0.7, '#f3eee6');
  grad.addColorStop(0.96, '#eeeae4');
  grad.addColorStop(0.99, '#d3d8da');
  grad.addColorStop(1, '#b9c1c4');
  g.fillStyle = grad; g.fillRect(0, y(0.5), W, y(0) - y(0.5));
  // soft mottling
  for (let i = 0; i < 900; i++) {
    g.fillStyle = `rgba(${200 + R() * 40},${170 + R() * 40},${150 + R() * 40},0.05)`;
    g.beginPath(); g.arc(R() * W, y(0.05 + R() * 0.42), 6 + R() * 30, 0, Math.PI * 2); g.fill();
  }
  // conjunctival / episcleral vessels running towards the limbus, branching and thinning
  const vessel = (x, v, w, depth) => {
    let ang = (R() - 0.5) * 0.6;
    g.lineCap = 'round';
    while (v < 0.485 && w > 0.25) {
      const step = 0.006 + R() * 0.006;
      ang += (R() - 0.5) * 0.5;
      ang = Math.max(-1, Math.min(1, ang));
      const nx = x + Math.sin(ang) * step * H * 0.9;
      const nv = v + Math.cos(ang) * step;
      g.strokeStyle = `rgba(${165 + R() * 30},${55 + R() * 20},${50 + R() * 15},${0.1 + w * 0.07})`;
      g.lineWidth = w * 0.8;
      g.beginPath(); g.moveTo(x, y(v)); g.lineTo(nx, y(nv)); g.stroke();
      x = nx; v = nv; w *= 0.985;
      if (depth < 3 && R() < 0.05) vessel(x, v, w * 0.6, depth + 1);
    }
  };
  for (let i = 0; i < 34; i++) vessel(R() * W, 0.26 + R() * 0.12, 1.4 + R() * 1.8, 0);
  // fine perilimbal capillaries
  for (let i = 0; i < 160; i++) vessel(R() * W, 0.43 + R() * 0.03, 0.5 + R() * 0.5, 2);
  // cut face (sclera cross-section)
  g.fillStyle = '#7d878c'; g.fillRect(0, y(0.52), W, y(0.5) - y(0.52));
  // inner globe: ciliary / choroid near the front, orange-red retina towards the posterior pole
  grad = g.createLinearGradient(0, y(0.52), 0, y(1));
  grad.addColorStop(0, '#3b1d14');
  grad.addColorStop(0.12, '#5a2418');
  grad.addColorStop(0.3, '#a2432a');
  grad.addColorStop(0.75, '#c2583a');
  grad.addColorStop(0.95, '#a8452c');
  grad.addColorStop(1, '#7d2f1f');
  g.fillStyle = grad; g.fillRect(0, y(1), W, y(0.52) - y(1));
  for (let i = 0; i < 700; i++) {
    g.fillStyle = `rgba(${90 + R() * 60},${25 + R() * 20},${15},${0.08 + R() * 0.1})`;
    g.beginPath(); g.arc(R() * W, y(0.6 + R() * 0.4), 4 + R() * 16, 0, Math.PI * 2); g.fill();
  }
  return toTexture(c, { repeatX: true });
}

// ---------- Nucleus: mottled brunescent yellow-brown ----------
export function nucleusTexture() {
  const W = 512, H = 256;
  const [c, g] = canvas(W, H);
  const R = rng(23);
  const grad = g.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#c49a52');
  grad.addColorStop(0.5, '#a8762f');
  grad.addColorStop(1, '#c49a52');
  g.fillStyle = grad; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 520; i++) {
    const dark = R() < 0.5;
    g.fillStyle = dark ? `rgba(110,66,22,${0.08 + R() * 0.12})` : `rgba(235,205,150,${0.06 + R() * 0.12})`;
    g.beginPath(); g.ellipse(R() * W, R() * H, 4 + R() * 26, 3 + R() * 14, R() * 3, 0, Math.PI * 2); g.fill();
  }
  // faint lamellar rings
  for (let k = 0; k < 9; k++) {
    g.strokeStyle = 'rgba(240,215,165,0.12)'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(0, (k + 0.5) * H / 9); g.lineTo(W, (k + 0.5) * H / 9 + (R() - 0.5) * 6); g.stroke();
  }
  return toTexture(c, { repeatX: true });
}

// ---------- Cortex opacity (alpha map): haze + peripheral cortical spokes ----------
export function cortexAlphaTexture() {
  const W = 1024, H = 256;
  const [c, g] = canvas(W, H);
  const R = rng(31);
  g.fillStyle = 'rgb(70,70,70)'; g.fillRect(0, 0, W, H);
  // spokes start at the equator (v = 0.5) and point towards both poles, tapering
  for (let i = 0; i < 46; i++) {
    const x = R() * W, w = 6 + R() * 22, reach = 0.12 + R() * 0.22;
    const lum = 150 + R() * 100;
    for (const dir of [-1, 1]) {
      const gr = g.createLinearGradient(0, (1 - 0.5) * H, 0, (1 - (0.5 + dir * reach)) * H);
      gr.addColorStop(0, `rgba(${lum},${lum},${lum},0.95)`);
      gr.addColorStop(1, 'rgba(70,70,70,0)');
      g.fillStyle = gr;
      g.beginPath();
      g.moveTo(x - w / 2, 0.5 * H);
      g.lineTo(x + w / 2, 0.5 * H);
      g.lineTo(x + w * 0.1, (1 - (0.5 + dir * reach)) * H);
      g.lineTo(x - w * 0.1, (1 - (0.5 + dir * reach)) * H);
      g.closePath(); g.fill();
    }
  }
  return toTexture(c, { srgb: false, repeatX: true });
}

// Fresnel-weighted alpha for thin transparent shells (cornea, capsule, IOL): edges read clearly while the
// centre stays see-through, like a glass object in a medical illustration. Also exposes object-space
// position for local effects (limbal haze, incision mark, capsulorhexis opening).
function fresnelShell(mat, { edgeAlpha = 0.5, power = 3, extraUniforms = {}, fragHead = '', fragBody = '' } = {}) {
  mat.userData.uniforms = extraUniforms;
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, extraUniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vObjPos;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvObjPos = position;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vObjPos;\n${fragHead}`)
      .replace('#include <opaque_fragment>', `
        float fres = pow(1.0 - clamp(abs(dot(normalize(vViewPosition), normal)), 0.0, 1.0), ${power.toFixed(2)});
        float shellA = clamp(diffuseColor.a + fres * ${edgeAlpha.toFixed(3)}, 0.0, 1.0);
        ${fragBody}
        gl_FragColor = vec4(outgoingLight, shellA);`);
  };
  mat.customProgramCacheKey = () => `fresnel-${edgeAlpha}-${power}-${fragBody.length}`;
  return mat;
}

export function createMaterials() {
  const tex = {
    iris: irisTexture(),
    sclera: scleraTexture(),
    nucleus: nucleusTexture(),
    cortex: cortexAlphaTexture()
  };

  const corneaUniforms = {
    uIncision: { value: 0 },
    uIncisionPhi: { value: 0 },
    uIncR0: { value: WOUND.internalR },
    uIncR1: { value: WOUND.externalR },
    uLimbusR: { value: EYE.corneaRadius }
  };
  const cornea = fresnelShell(new THREE.MeshPhysicalMaterial({
    color: 0xffffff, transparent: true, opacity: 0.05, roughness: 0.04, metalness: 0,
    ior: 1.376, clearcoat: 1, clearcoatRoughness: 0.02, specularIntensity: 1, envMapIntensity: 1.1,
    depthWrite: false
  }), {
    edgeAlpha: 0.46, power: 2.6, extraUniforms: corneaUniforms,
    fragHead: 'uniform float uIncision; uniform float uIncisionPhi; uniform float uLimbusR; uniform float uIncR0; uniform float uIncR1;',
    fragBody: `
      float rr = length(vObjPos.xy);
      float limb = smoothstep(uLimbusR - 0.45, uLimbusR, rr);
      outgoingLight = mix(outgoingLight, vec3(0.74, 0.79, 0.82), limb * 0.45);
      shellA = max(shellA, limb * 0.42);
      float ang = atan(vObjPos.y, vObjPos.x) - uIncisionPhi;
      float inc = (1.0 - smoothstep(0.19, 0.22, abs(ang))) * smoothstep(uIncR0 - 0.05, uIncR0 + 0.05, rr) * (1.0 - smoothstep(uIncR1 - 0.05, uIncR1 + 0.05, rr)) * (0.55 + 0.45 * smoothstep(uIncR1 - 0.25, uIncR1, rr));
      outgoingLight = mix(outgoingLight, vec3(0.93, 0.95, 0.96), inc * uIncision * 0.85);
      shellA = max(shellA, inc * uIncision * 0.75);`
  });

  const capsuleUniforms = { uOpen: { value: 0 }, uRhexisR: { value: EYE.rhexisR }, uEqZ: { value: EYE.lensEqZ } };
  const capsule = fresnelShell(new THREE.MeshPhysicalMaterial({
    color: 0xf3f6f7, transparent: true, opacity: 0.04, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05,
    ior: 1.4, depthWrite: false, side: THREE.DoubleSide
  }), {
    edgeAlpha: 0.32, power: 2.4, extraUniforms: capsuleUniforms,
    fragHead: 'uniform float uOpen; uniform float uRhexisR; uniform float uEqZ;',
    fragBody: 'if (uOpen > 0.001 && vObjPos.z > uEqZ + 0.05 && length(vObjPos.xy) < uRhexisR) discard;'
  });

  const flap = fresnelShell(new THREE.MeshPhysicalMaterial({
    color: 0xf0f3f4, transparent: true, opacity: 0.18, roughness: 0.2, clearcoat: 1, depthWrite: false, side: THREE.DoubleSide
  }), { edgeAlpha: 0.4, power: 2 });

  const iol = fresnelShell(new THREE.MeshPhysicalMaterial({
    color: 0xbcd8ff, transparent: true, opacity: 0.34, roughness: 0.03, metalness: 0, clearcoat: 1,
    clearcoatRoughness: 0.02, ior: 1.47, specularIntensity: 1, envMapIntensity: 1.4, depthWrite: false
  }), { edgeAlpha: 0.85, power: 2.0 });
  const haptic = new THREE.MeshPhysicalMaterial({
    color: 0xcfe2f6, transparent: true, opacity: 0.88, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.05,
    envMapIntensity: 1.2, depthWrite: true, side: THREE.DoubleSide
  });
  // Cut faces of the cross-section (flat, matte, so the section reads as tissue rather than glass).
  const capMat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, side: THREE.DoubleSide, ...extra });

  const mats = {
    tex,
    cornea, capsule, flap, iol, haptic,
    sclera: new THREE.MeshPhysicalMaterial({
      map: tex.sclera, roughness: 0.5, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.35,
      sheen: 0.25, sheenRoughness: 0.6, sheenColor: new THREE.Color(0xffeedd)
    }),
    scleraCut: new THREE.MeshStandardMaterial({ color: 0xd9cdc1, roughness: 0.8 }),
    iris: new THREE.MeshStandardMaterial({ map: tex.iris, bumpMap: tex.iris, bumpScale: 2.2, roughness: 0.72, metalness: 0, side: THREE.DoubleSide }),
    ciliary: new THREE.MeshStandardMaterial({ color: 0x4a2219, roughness: 0.78 }),
    ciliaryBody: new THREE.MeshStandardMaterial({ color: 0x4a2219, roughness: 0.78 }),
    corneaCap: capMat(0xb9d3df, { transparent: true, opacity: 0.6, depthWrite: false, roughness: 0.3 }),
    irisCap: capMat(0x3d2414),
    nucleusCap: capMat(0xb98a45, { roughness: 0.6 }),
    cortexCap: capMat(0xe9dfc4, { transparent: true, opacity: 0.55, depthWrite: false }),
    capsuleCap: capMat(0xf4f1ea, { roughness: 0.5 }),
    iolCap: capMat(0xc7defa, { transparent: true, opacity: 0.75, roughness: 0.2, depthWrite: false }),
    ciliaryCut: new THREE.MeshStandardMaterial({ color: 0x6a3226, roughness: 0.85 }),
    nucleus: new THREE.MeshPhysicalMaterial({
      map: tex.nucleus, color: 0xf0d7a8, roughness: 0.48, clearcoat: 0.2, clearcoatRoughness: 0.4,
      sheen: 0.4, sheenColor: new THREE.Color(0xffe2a8), emissive: new THREE.Color(0x000000), side: THREE.DoubleSide
    }),
    cortex: new THREE.MeshPhysicalMaterial({
      color: 0xeee3c6, alphaMap: tex.cortex, transparent: true, opacity: 0.55, roughness: 0.6,
      depthWrite: false, side: THREE.FrontSide
    }),
    fragment: new THREE.MeshStandardMaterial({ map: tex.nucleus, roughness: 0.55 }),
    zonule: new THREE.MeshStandardMaterial({ color: 0xece6da, roughness: 0.55, transparent: true, opacity: 0.75 }),
    rhexisEdge: new THREE.MeshBasicMaterial({ color: 0xf6efe2, transparent: true, opacity: 0.85, depthWrite: false }),
    pupilRing: new THREE.MeshBasicMaterial({ color: 0xd8b878, transparent: true, opacity: 0, depthWrite: false }),
    steel: new THREE.MeshStandardMaterial({ color: 0xc4cad0, metalness: 1, roughness: 0.16, envMapIntensity: 1.5 }),
    steelDark: new THREE.MeshStandardMaterial({ color: 0x8c949b, metalness: 1, roughness: 0.38 }),
    titanium: new THREE.MeshStandardMaterial({ color: 0xbdb7ac, metalness: 1, roughness: 0.3 }),
    sleeve: new THREE.MeshPhysicalMaterial({ color: 0x9db6c4, roughness: 0.42, clearcoat: 0.5 }),
    handle: new THREE.MeshStandardMaterial({ color: 0x5f6f7c, metalness: 0.6, roughness: 0.35 }),
    plastic: new THREE.MeshPhysicalMaterial({ color: 0xe9f1f5, roughness: 0.25, transparent: true, opacity: 0.55, clearcoat: 0.6, depthWrite: false }),
    plunger: new THREE.MeshStandardMaterial({ color: 0x47708a, roughness: 0.4 }),
    bore: new THREE.MeshBasicMaterial({ color: 0x1a1a1a })
  };
  return mats;
}

// Light-ray material: flowing dashes along the tube's u coordinate, additive and depth-tested.
export function rayMaterial(color, { fadeTail = false } = {}) {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 }, uColor: { value: new THREE.Color(color) } },
    vertexShader: 'varying float vU; void main(){ vU = uv.x; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `uniform float uTime; uniform float uOpacity; uniform vec3 uColor; varying float vU;
      void main(){
        float dash = 0.55 + 0.45 * smoothstep(0.35, 0.0, abs(fract(vU * 5.0 - uTime * 0.35) - 0.5));
        float a = uOpacity * dash * smoothstep(0.0, 0.04, vU) ${fadeTail ? '* (1.0 - smoothstep(0.35, 1.0, vU))' : '* (1.0 - smoothstep(0.97, 1.0, vU))'};
        gl_FragColor = vec4(uColor, a);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
}
