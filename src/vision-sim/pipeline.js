// Vision simulator — GPU pipeline.
//  1. each depth layer (distance / intermediate / near) is rendered once into its own linear-light target;
//  2. for each lens shown, every focus term of the optics model is applied to the layer as an ANISOTROPIC
//     separable Gaussian (major/minor axes = astigmatic meridians, σ = blur-disk diameter / 4) and the terms
//     are summed with their light-share weights (simultaneous-vision superposition), plus the lost-light veil;
//  3. point lights of the distance layer are added as model-scaled core / halo / glare sprites;
//  4. a composite pass layers the three results back-to-front, applies contrast/tint grading, the split
//     comparison and the sRGB transfer.
// Blurs are recomputed only when their inputs change (cache keys), so an unchanged view costs one composite.
import * as THREE from 'three';
import { focalPx, sigmaPx } from './optics/model.js';
import { VIEWING } from './optics/params.js';

const LAYERS = ['distance', 'intermediate', 'near'];
const SLOTS = ['A', 'B'];

const VS = /* glsl */`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const BLUR_FS = /* glsl */`
precision highp float;
uniform sampler2D tSrc; uniform vec2 uDir; uniform float uSigma; uniform float uWeight; uniform float uTaps;
varying vec2 vUv;
void main(){
  if (uSigma < 0.35) { gl_FragColor = textureLod(tSrc, vUv, 0.0) * uWeight; return; }
  float stepPx = max(1.0, 3.0 * uSigma / uTaps);
  float lod = max(0.0, log2(stepPx) - 0.5);
  vec4 acc = vec4(0.0); float ws = 0.0;
  for (int i = -16; i <= 16; i++) {
    float fi = float(i);
    if (abs(fi) > uTaps) continue;
    float x = fi * stepPx;
    float w = exp(-0.5 * x * x / (uSigma * uSigma));
    acc += textureLod(tSrc, vUv + uDir * x, lod) * w; ws += w;
  }
  gl_FragColor = acc / ws * uWeight;
}`;

const COMPOSITE_FS = /* glsl */`
precision highp float;
uniform sampler2D tA0; uniform sampler2D tA1; uniform sampler2D tA2;
uniform sampler2D tB0; uniform sampler2D tB1; uniform sampler2D tB2;
uniform sampler2D tMean;
uniform float uSplit; uniform float uCompare; uniform vec2 uRes;
uniform vec4 uGradeA; uniform vec3 uTintA; uniform vec4 uGradeB; uniform vec3 uTintB; // x desat, y contrastLoss, z veil
varying vec2 vUv;
vec4 over(vec4 f, vec4 b){ return f + (1.0 - f.a) * b; }
float lum(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
vec3 shoulder(vec3 x){ vec3 k = max(x - 0.8, 0.0); return min(x, 0.8) + 0.2 * (1.0 - exp(-k / 0.2)); }
vec3 toSRGB(vec3 c){ c = clamp(c, 0.0, 1.0); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
vec3 grade(vec3 c, vec4 g, vec3 tint, vec3 mean){
  c *= tint;
  c = mix(c, vec3(lum(mean * tint)), g.y);          // contrast loss toward mean scene luminance
  c = c * (1.0 - g.z) + g.z * mean * tint * 1.6;     // straylight veil
  c = mix(c, vec3(lum(c)), g.x);                     // low-light desaturation
  return c;
}
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  bool b = uCompare > 0.5 && vUv.x > uSplit;
  vec4 c = b ? over(texture2D(tB2, vUv), over(texture2D(tB1, vUv), texture2D(tB0, vUv)))
             : over(texture2D(tA2, vUv), over(texture2D(tA1, vUv), texture2D(tA0, vUv)));
  vec3 mean = textureLod(tMean, vec2(0.5), 12.0).rgb;
  vec3 col = b ? grade(c.rgb, uGradeB, uTintB, mean) : grade(c.rgb, uGradeA, uTintA, mean);
  col = toSRGB(shoulder(col));
  col += (hash(vUv * uRes) - 0.5) / 255.0;            // fixed (deterministic) dither against banding
  gl_FragColor = vec4(col, 1.0);
}`;

// Output stage: the composite is drawn into one of three 8-bit targets (current, previous, spare) and shown through this pass, which can cross-fade
// from the previous view to the new one (lens / distance / lighting changes). Display-only: never part of the optics.
const BLEND_FS = /* glsl */`
precision highp float;
uniform sampler2D tPrev; uniform sampler2D tCur; uniform float uMix;
varying vec2 vUv;
void main(){
  vec4 c = texture2D(tCur, vUv);
  if (uMix < 1.0) { float t = uMix * uMix * (3.0 - 2.0 * uMix); c = mix(texture2D(tPrev, vUv), c, t); }
  gl_FragColor = vec4(c.rgb, 1.0);
}`;

function softDiskTexture(size = 128) {
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const r = Math.hypot(x + 0.5 - size / 2, y + 0.5 - size / 2) / (size / 2);
    // uniform disk with a slightly brighter rim (diffractive halos often look ring-like) and soft edge
    const a = r > 1 ? 0 : (r > 0.86 ? (1 - r) / 0.14 : 1) * (0.85 + 0.25 * r * r);
    const v = Math.max(0, Math.min(255, Math.round(a * 200)));
    const i = (y * size + x) * 4; data[i] = data[i + 1] = data[i + 2] = data[i + 3] = v;
  }
  const t = new THREE.DataTexture(data, size, size); t.needsUpdate = true; t.magFilter = t.minFilter = THREE.LinearFilter;
  return t;
}
function falloffTexture(size, fn) {
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const r = Math.hypot(x + 0.5 - size / 2, y + 0.5 - size / 2) / (size / 2);
    const v = Math.round(255 * Math.max(0, fn(r)));
    const i = (y * size + x) * 4; data[i] = data[i + 1] = data[i + 2] = data[i + 3] = v;
  }
  const t = new THREE.DataTexture(data, size, size); t.needsUpdate = true; t.magFilter = t.minFilter = THREE.LinearFilter;
  return t;
}

// Releases the probe context immediately (an unreleased probe leaked one WebGL context per mount — BUG-03).
export function hasWebGL2() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (gl) { const ext = gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext(); }
    return !!gl;
  } catch { return false; }
}

export function createPipeline({ canvas, debug = false }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: !!debug });
  if (!renderer.capabilities.isWebGL2) { renderer.dispose(); throw new Error('webgl2-required'); }
  renderer.autoClear = false;
  // A shader the driver rejects draws nothing. Record it (instead of three.js's console error) so the simulator can
  // switch to the static comparison rather than show a blank or black picture (06_LENS_LAB_FINAL_RECOVERY.md, F3).
  let shaderError = null;
  renderer.debug.checkShaderErrors = true;
  renderer.debug.onShaderError = (gl, program) => {
    let log = '';
    try { log = gl.getProgramInfoLog(program) || ''; } catch { /* context gone */ }
    shaderError = log || 'shader compile / link failed';
  };
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // the composite shader does its own sRGB transfer
  const floatOK = renderer.extensions.has('EXT_color_buffer_float') || renderer.extensions.has('EXT_color_buffer_half_float');
  const TYPE = floatOK ? THREE.HalfFloatType : THREE.UnsignedByteType;

  const quadGeo = new THREE.PlaneGeometry(2, 2);
  const ortho = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const blurMat = new THREE.ShaderMaterial({
    uniforms: { tSrc: { value: null }, uDir: { value: new THREE.Vector2() }, uSigma: { value: 0 }, uWeight: { value: 1 }, uTaps: { value: 12 } },
    vertexShader: VS, fragmentShader: BLUR_FS, depthTest: false, depthWrite: false,
  });
  const blurAddMat = blurMat.clone();
  blurAddMat.blending = THREE.CustomBlending;
  blurAddMat.blendEquation = THREE.AddEquation; blurAddMat.blendSrc = THREE.OneFactor; blurAddMat.blendDst = THREE.OneFactor;
  blurAddMat.blendSrcAlpha = THREE.OneFactor; blurAddMat.blendDstAlpha = THREE.OneFactor;
  const quad = new THREE.Mesh(quadGeo, blurMat);
  const quadScene = new THREE.Scene(); quadScene.add(quad);
  const compMat = new THREE.ShaderMaterial({
    uniforms: {
      tA0: { value: null }, tA1: { value: null }, tA2: { value: null }, tB0: { value: null }, tB1: { value: null }, tB2: { value: null },
      tMean: { value: null }, uSplit: { value: 0.5 }, uCompare: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) },
      uGradeA: { value: new THREE.Vector4() }, uTintA: { value: new THREE.Vector3(1, 1, 1) }, uGradeB: { value: new THREE.Vector4() }, uTintB: { value: new THREE.Vector3(1, 1, 1) },
    },
    vertexShader: VS, fragmentShader: COMPOSITE_FS, depthTest: false, depthWrite: false,
  });
  const blendMat = new THREE.ShaderMaterial({
    uniforms: { tPrev: { value: null }, tCur: { value: null }, uMix: { value: 1 } },
    vertexShader: VS, fragmentShader: BLEND_FS, depthTest: false, depthWrite: false,
  });
  const out = [null, null, null]; let cur = 0, prev = 1, outW = 0, outH = 0, outFresh = false, drawn = false, lastMix = 1;
  function ensureOut() {
    const bw = Math.max(1, renderer.domElement.width), bh = Math.max(1, renderer.domElement.height);
    if (out[0] && bw === outW && bh === outH) return;
    for (const t of out) if (t) { t.dispose(); rtCount--; }
    outW = bw; outH = bh;
    cur = 0; prev = 1;
    for (let i = 0; i < 3; i++) { out[i] = new THREE.WebGLRenderTarget(bw, bh, { type: THREE.UnsignedByteType, format: THREE.RGBAFormat, depthBuffer: false, generateMipmaps: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter }); rtCount++; }
    outFresh = false; drawn = false;
  }
  function freeOut() { for (let i = 0; i < 3; i++) if (out[i]) { out[i].dispose(); out[i] = null; rtCount--; } outW = outH = 0; outFresh = false; }

  // light sprites (instanced, additive) drawn into the distance accumulation target in pixel space
  const spriteTex = { disk: softDiskTexture(), gauss: falloffTexture(64, (r) => Math.exp(-4.5 * r * r)), glare: falloffTexture(128, (r) => (r >= 1 ? 0 : (1 / (1 + (r / 0.06) ** 2) - 0.0036) * (1 - r))) };
  const MAX_SPRITES = 256;
  const spriteScene = new THREE.Scene();
  const spriteCam = new THREE.OrthographicCamera(0, 1, 1, 0, -1, 1);
  const spriteGeo = new THREE.PlaneGeometry(1, 1);
  const sprites = {};
  for (const k of Object.keys(spriteTex)) {
    const m = new THREE.MeshBasicMaterial({ map: spriteTex[k], transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending });
    const im = new THREE.InstancedMesh(spriteGeo, m, MAX_SPRITES);
    im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX_SPRITES * 3), 3);
    im.count = 0; im.frustumCulled = false;
    spriteScene.add(im); sprites[k] = im;
  }

  let W = 2, H = 2;
  const rtOpts = (mips) => ({ type: TYPE, format: THREE.RGBAFormat, depthBuffer: false, generateMipmaps: mips, minFilter: mips ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter, magFilter: THREE.LinearFilter, wrapS: THREE.ClampToEdgeWrapping, wrapT: THREE.ClampToEdgeWrapping });
  const src = {}; const acc = { A: {}, B: {} }; let tmp = null; let rtCount = 0;
  const depthRT = () => new THREE.WebGLRenderTarget(W, H, { ...rtOpts(true), depthBuffer: true });
  const keys = { A: {}, B: {} };
  let srcVersion = 0, srcRendered = -1;
  // Closer view (framing): the camera shows a sub-rectangle of the full picture, `zoom` times larger. Every angular
  // size is converted to pixels with the magnified focal length, so the result is the same picture seen closer:
  // the optics model, the blur angles and the light sizes do not change (see OPTICAL_MODEL_FINDINGS.md).
  let zoom = 1, frameX = 0, frameY = 0;
  const blank = new THREE.DataTexture(new Uint8Array(4), 1, 1); blank.needsUpdate = true;

  function allocate(w, h) {
    if (w === W && h === H && tmp) return false;
    freeTargets();
    W = w; H = h;
    for (const L of LAYERS) src[L] = depthRT();
    tmp = new THREE.WebGLRenderTarget(W, H, rtOpts(true));
    rtCount = LAYERS.length + 1;
    for (const s of SLOTS) keys[s] = {};
    srcRendered = -1;
    return true;
  }
  function ensureAcc(slot) {
    if (acc[slot].distance) return;
    for (const L of LAYERS) acc[slot][L] = new THREE.WebGLRenderTarget(W, H, rtOpts(false));
    rtCount += LAYERS.length;
    keys[slot] = {};
  }
  function freeAcc(slot) {
    if (!acc[slot].distance) return;
    for (const L of LAYERS) { acc[slot][L].dispose(); rtCount--; }
    acc[slot] = {}; keys[slot] = {};
  }
  function freeTargets() {
    for (const L of LAYERS) if (src[L]) { src[L].dispose(); delete src[L]; }
    if (tmp) { tmp.dispose(); tmp = null; }
    for (const s of SLOTS) freeAcc(s);
    freeOut();
    rtCount = 0;
  }

  function pass(mat, srcTex, target, dirDeg, sigma, weight, taps) {
    quad.material = mat;
    const u = mat.uniforms;
    u.tSrc.value = srcTex;
    const a = (dirDeg * Math.PI) / 180;
    u.uDir.value.set(Math.cos(a) / W, Math.sin(a) / H);
    u.uSigma.value = sigma; u.uWeight.value = weight; u.uTaps.value = taps;
    renderer.setRenderTarget(target);
    renderer.render(quadScene, ortho);
  }

  /** Accumulate all model terms of one layer for one lens into acc[slot][layer]. */
  function blurLayer(slot, L, layer, taps, lightsPx) {
    const f = focalPx(H, VIEWING.vFovDeg) * zoom;
    const target = acc[slot][L];
    renderer.setRenderTarget(target);
    renderer.setClearColor(0x000000, 0); renderer.clear(true, false, false);
    const s = src[L].texture;
    let passes = 0;
    for (const t of layer.terms) {
      if (t.weight <= 0) continue;
      const sa = sigmaPx(t.blurAxisArcmin, f), sp = sigmaPx(t.blurPerpArcmin, f);
      // image axis: optics axis angle measured counter-clockwise from horizontal; uv y points up
      if (sa < 0.35 && sp < 0.35) { pass(blurAddMat, s, target, 0, 0, t.weight, taps); passes++; continue; }
      pass(blurMat, s, tmp, t.axisDeg, sa, 1, taps);
      pass(blurAddMat, tmp.texture, target, t.axisDeg + 90, sp, t.weight, taps);
      passes += 2;
    }
    if (layer.loss.fraction > 0) {
      const sig = ((layer.loss.spreadDeg / 2) * Math.PI / 180) * f;
      pass(blurMat, s, tmp, 0, sig, 1, taps);
      pass(blurAddMat, tmp.texture, target, 90, sig, layer.loss.fraction, taps);
      passes += 2;
    }
    if (L === 'distance' && lightsPx) passes += drawLights(target, layer, lightsPx, f);
    return passes;
  }

  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v3 = new THREE.Vector3(), sc = new THREE.Vector3(), z = new THREE.Vector3(0, 0, 1);
  function drawLights(target, layer, lightsPx, f) {
    const n = { disk: 0, gauss: 0, glare: 0 };
    const put = (kind, x, y, sx, sy, rotDeg, r, g, b) => {
      const im = sprites[kind];
      if (n[kind] >= MAX_SPRITES) return;
      q.setFromAxisAngle(z, (rotDeg * Math.PI) / 180);
      m4.compose(v3.set(x, y, 0), q, sc.set(sx, sy, 1));
      im.setMatrixAt(n[kind], m4);
      im.instanceColor.setXYZ(n[kind], r, g, b);
      n[kind]++;
    };
    const glareGain = layer.straylight != null ? layer.straylight : 1;
    for (const Lt of lightsPx) {
      const core = Math.max(1.5, ((Lt.coreDeg * Math.PI) / 180) * f);
      const E = Lt.intensity * 40 * core * core; // light energy ∝ intensity × core area
      for (const t of layer.terms) {
        const da = Math.max(core, (t.blurAxisArcmin / 3437.75) * f), dp = Math.max(core, (t.blurPerpArcmin / 3437.75) * f);
        const peak = (t.weight * E) / (da * dp); // energy conserved: brightness ∝ 1 / area
        // disk diameter da×dp; soft-disk texture fills ~0.93 of the quad
        put('disk', Lt.x, Lt.y, da * 1.08, dp * 1.08, t.axisDeg, Lt.color[0] * peak, Lt.color[1] * peak, Lt.color[2] * peak);
      }
      if (layer.loss.fraction > 0) {
        const d = ((layer.loss.spreadDeg * Math.PI) / 180) * f * 1.6;
        const peak = (layer.loss.fraction * E * 1.3) / (d * d * 0.25);
        put('gauss', Lt.x, Lt.y, d, d, 0, Lt.color[0] * peak, Lt.color[1] * peak, Lt.color[2] * peak);
      }
      // straylight glare: wide 1/θ²-like skirt (Stiles–Holladay shape). Veiling luminance is PROPORTIONAL to the
      // straylight parameter s (van den Berg), so the skirt scales with s, not s² (audit 2026-11: the earlier s²
      // drew the cataract glare 6.25× instead of 2.5× and the multifocal glare 1.69× instead of 1.3×).
      const gd = ((9 * Math.PI) / 180) * f;
      const gp = 0.018 * Lt.intensity * glareGain;
      put('glare', Lt.x, Lt.y, gd, gd, 0, Lt.color[0] * gp, Lt.color[1] * gp, Lt.color[2] * gp);
    }
    for (const k of Object.keys(sprites)) { sprites[k].count = n[k]; sprites[k].instanceMatrix.needsUpdate = true; sprites[k].instanceColor.needsUpdate = true; }
    spriteCam.left = 0; spriteCam.right = W; spriteCam.top = H; spriteCam.bottom = 0; spriteCam.updateProjectionMatrix();
    renderer.setRenderTarget(target);
    renderer.render(spriteScene, spriteCam);
    return 1;
  }

  /**
   * Render a frame.
   * views: { A: view, B: view|null } where view = optics computeView() output (+ straylight on layers).
   * scenes: buildScenes() result; camera: shared camera; opts: { split, taps, sourceVersion, frame }.
   * frame: { zoom, x, y } — the part of the full picture the camera shows (x, y = top-left corner as a fraction of
   * the full picture; zoom 1 = the whole picture). The camera's view offset must already match it.
   */
  function render({ views, scenes, camera, split = 0.5, taps = 12, sourceVersion = 0, frame = null, mix = 1 }) {
    const stats = { passes: 0, reblurred: 0 };
    const nz = frame && frame.zoom > 1 ? frame.zoom : 1, nx = nz > 1 ? frame.x : 0, ny = nz > 1 ? frame.y : 0;
    if (nz !== zoom || nx !== frameX || ny !== frameY) { zoom = nz; frameX = nx; frameY = ny; srcRendered = -1; }
    if (sourceVersion !== srcRendered) {
      for (const L of LAYERS) {
        renderer.setRenderTarget(src[L]);
        const bg = scenes.scenes[L].background;
        if (bg && bg.isColor) renderer.setClearColor(bg, 1); else renderer.setClearColor(0x000000, 0);
        renderer.clear(true, true, false);
        renderer.render(scenes.scenes[L], camera);
      }
      srcRendered = sourceVersion;
      for (const s of SLOTS) keys[s] = {};
    }
    const lightsPx = scenes.lights.map((l) => {
      v3.copy(l.position).project(camera);
      return { x: (v3.x * 0.5 + 0.5) * W, y: (v3.y * 0.5 + 0.5) * H, color: l.color, intensity: l.intensity, coreDeg: l.coreDeg, visible: v3.z < 1 };
    }).filter((l) => {
      // A light is kept when it is inside the FULL picture (plus the usual 50 px margin there), so a closer view shows
      // the same lights, halos and glare as the matching part of the whole scene. v3.y points up; frameY counts from the top.
      const fx = l.x / zoom + frameX * W, fy = l.y / zoom + (1 - frameY - 1 / zoom) * H;
      return l.visible && fx > -50 && fx < W + 50 && fy > -50 && fy < H + 50;
    });
    for (const slot of SLOTS) {
      const v = views[slot];
      if (!v) { if (slot === 'B') freeAcc('B'); continue; }
      ensureAcc(slot);
      for (const L of LAYERS) {
        const layer = { ...v.layers[L], straylight: v.halo.straylight };
        const key = JSON.stringify([layer.terms.map((t) => [t.weight, t.blurAxisArcmin.toFixed(3), t.blurPerpArcmin.toFixed(3), t.axisDeg]), layer.loss, layer.straylight, taps, L === 'distance' ? lightsPx.length : 0, zoom]);
        if (keys[slot][L] === key) continue;
        stats.passes += blurLayer(slot, L, layer, taps, L === 'distance' ? lightsPx : null);
        stats.reblurred++;
        keys[slot][L] = key;
      }
    }
    const u = compMat.uniforms;
    const A = acc.A, B = acc.B.distance ? acc.B : acc.A;
    u.tA0.value = A.distance.texture; u.tA1.value = A.intermediate.texture; u.tA2.value = A.near.texture;
    u.tB0.value = B.distance.texture; u.tB1.value = B.intermediate.texture; u.tB2.value = B.near.texture;
    u.tMean.value = src.distance.texture;
    u.uSplit.value = split; u.uCompare.value = views.B ? 1 : 0;
    u.uRes.value.set(renderer.domElement.width, renderer.domElement.height);
    const setGrade = (v, g, t) => {
      g.set(v.grade.desaturate, v.grade.contrastLoss, 0.05 * (v.halo.straylight - 1), 0);
      const tint = v.grade.tint || [1, 1, 1]; t.set(tint[0], tint[1], tint[2]);
    };
    setGrade(views.A, u.uGradeA.value, u.uTintA.value);
    setGrade(views.B || views.A, u.uGradeB.value, u.uTintB.value);
    ensureOut();
    quad.material = compMat;
    renderer.setRenderTarget(out[cur]);
    renderer.render(quadScene, ortho);
    const bu = blendMat.uniforms;
    bu.tCur.value = out[cur].texture;
    bu.tPrev.value = out[prev].texture;
    bu.uMix.value = lastMix = outFresh && mix < 1 ? Math.max(0, mix) : 1;
    drawn = true;
    quad.material = blendMat;
    renderer.setRenderTarget(null);
    renderer.render(quadScene, ortho);
    stats.passes += 2;
    return stats;
  }

  return {
    renderer,
    get size() { return { width: W, height: H }; },
    get halfFloat() { return TYPE === THREE.HalfFloatType; },
    get renderTargets() { return rtCount; },
    get shaderError() { return shaderError; },
    /** Keep the view now on screen as the start of a cross-fade: the next frame draws into the other target. */
    /**
     * Keep the view now on screen as the start of a cross-fade; the next frame draws into a free target. During a fade
     * the frame on screen is the blend, so that blend is frozen as the new start (a quick second change continues
     * smoothly instead of jumping). Returns false when nothing was drawn since the last hold: the running fade goes on.
     */
    holdFrame() {
      if (!out[0] || !drawn) return false;
      drawn = false;
      const free = 3 - cur - prev;
      if (outFresh && lastMix < 1) {
        const bu = blendMat.uniforms;
        bu.tCur.value = out[cur].texture; bu.tPrev.value = out[prev].texture; bu.uMix.value = lastMix;
        quad.material = blendMat;
        renderer.setRenderTarget(out[free]);
        renderer.render(quadScene, ortho);
        const old = prev; prev = free; cur = old;
      } else { prev = cur; cur = free; }
      outFresh = true;
      return true;
    },
    setSize(cssW, cssH, dpr, scale) {
      renderer.setPixelRatio(dpr);
      renderer.setSize(cssW, cssH, false);
      const bw = renderer.domElement.width, bh = renderer.domElement.height;
      const cap = Math.min(1, 1600 / Math.max(1, bw)); // never blur more pixels than needed
      // adaptive scale lowers the cost on high-DPR screens, but never below ~1 internal px per CSS px (≤640 wide)
      const f = Math.max(scale * cap, Math.min(1, 640 / Math.max(1, bw), cssW / Math.max(1, bw)));
      const w = Math.max(64, Math.round(bw * f)), h = Math.max(64, Math.round(bh * f));
      return allocate(w, h);
    },
    invalidateSources() { srcVersion++; srcRendered = -1; outFresh = false; },
    render,
    dispose() {
      freeTargets();
      quadGeo.dispose(); spriteGeo.dispose(); blurMat.dispose(); blurAddMat.dispose(); compMat.dispose(); blendMat.dispose(); blank.dispose();
      for (const k of Object.keys(sprites)) { sprites[k].material.dispose(); sprites[k].dispose(); }
      for (const t of Object.values(spriteTex)) t.dispose();
      renderer.dispose();
    },
  };
}
