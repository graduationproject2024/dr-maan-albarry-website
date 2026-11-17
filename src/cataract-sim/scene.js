// Renderer, camera, lights and image-based environment (RoomEnvironment via PMREM — no HDR downloads).
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export const BG = { light: 0xdfe5e7, dark: 0x0c171d };

// The capability probe releases its context at once: browsers cap live WebGL contexts (~16) and an unreleased
// probe per mount used to add one leaked context every time the viewer was opened (BUG-03).
export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (gl) { const ext = gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext(); }
    return !!gl;
  } catch {
    return false;
  }
}

export function maxDpr() {
  return Math.min(window.devicePixelRatio || 1, 2);
}

// Shader programs are built in parallel (KHR_parallel_shader_compile) only when renderer.compileAsync() builds the SAME
// programs the first frame then uses. In three.js r170 compile() does not set up local clipping (only render() does), so
// every material with cross-section clipping planes was compiled without them and then rebuilt, one at a time and
// blocking, inside the first render: 8 programs, about half of the time from the tap to a ready viewer (Phase 2,
// CATARACT_PERFORMANCE.md). Compiling in two batches — clipped and unclipped objects — each after a one-mesh "primer"
// render that leaves three's clipping state as that batch needs it, makes the programs match. Nothing is drawn
// differently: the primer renders the scene's own background colour behind the loading overlay.
// renderer.compileAsync() without its one flaw here: if the viewer is closed while it is still waiting, three's own
// polling timer reads the program of a disposed material and throws (seen in the mount/destroy stress test). Same
// steps — compile() synchronously, then poll each program's isReady() — but it stops as soon as `alive()` is false.
function compileParallel(renderer, scene, camera, alive) {
  const materials = renderer.compile(scene, camera);
  return new Promise((resolve) => {
    const check = () => {
      if (!alive()) { resolve(); return; }
      for (const mat of materials) {
        const program = renderer.properties.get(mat).currentProgram;
        if (!program || program.isReady()) materials.delete(mat);
      }
      if (materials.size === 0) resolve(); else setTimeout(check, 10);
    };
    check();
  });
}
const clippedMaterial = (o) => (Array.isArray(o.material) ? o.material : [o.material]).find((m) => m && m.clippingPlanes && m.clippingPlanes.length) || null;
const drawn = (o) => { for (let n = o; n; n = n.parent) if (!n.visible) return false; return true; };
export async function precompileScene(renderer, scene, camera, { hidden = false, alive = () => true } = {}) {
  const nodes = []; scene.traverse((o) => nodes.push(o));
  const own = new Map(nodes.map((o) => [o, o.visible]));
  const objs = nodes.filter((o) => o.isMesh || o.isLine || o.isPoints);
  const shown = new Map(objs.map((o) => [o, drawn(o)]));
  // with hidden: only the objects not drawn yet (instruments, IOL, fragments) — compiled ahead of the stage that shows them
  const wanted = (o) => (hidden ? !shown.get(o) : shown.get(o));
  const sample = objs.map(clippedMaterial).find(Boolean);
  const primerTarget = new THREE.WebGLRenderTarget(1, 1);
  const pending = [];
  for (const clipped of [true, false]) {
    const batch = objs.filter((o) => wanted(o) && !!clippedMaterial(o) === clipped);
    if (!batch.length) continue;
    const primer = new THREE.Scene();
    primer.background = scene.background;
    const pm = new THREE.MeshBasicMaterial(clipped && sample ? { clippingPlanes: sample.clippingPlanes, clipIntersection: sample.clipIntersection } : {});
    const pg = new THREE.PlaneGeometry(1e-4, 1e-4);
    const pmesh = new THREE.Mesh(pg, pm);
    pmesh.frustumCulled = false; // it must really be drawn: three sets a material's clipping state only when drawing it
    primer.add(pmesh);
    // into a 1 × 1 off-screen target, so the visible canvas is never touched; leaves three's clipping state as this
    // batch needs it (one tiny basic program)
    const prevTarget = renderer.getRenderTarget();
    renderer.setRenderTarget(primerTarget);
    renderer.render(primer, camera);
    renderer.setRenderTarget(prevTarget); // compile() derives tone mapping from the current target: back to the canvas
    for (const o of nodes) o.visible = (o.isMesh || o.isLine || o.isPoints) ? batch.includes(o) : true; // groups open so hidden parts are reached
    try { pending.push(compileParallel(renderer, scene, camera, alive)); }
    finally { for (const o of nodes) o.visible = own.get(o); } // compile() itself is synchronous: nothing is ever drawn in this state
    pg.dispose(); pm.dispose();
  }
  primerTarget.dispose();
  await Promise.all(pending);
}

export function createScene({ canvas, debug = false, theme = 'light' }) {
  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, alpha: false, powerPreference: 'high-performance',
    preserveDrawingBuffer: !!debug // only so tests can read pixels back
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.setPixelRatio(maxDpr());
  renderer.localClippingEnabled = true; // cross-section clipping planes (eye-model.js)

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG[theme] ?? BG.light);
  scene.environmentIntensity = 0.65;

  const camera = new THREE.PerspectiveCamera(32, 16 / 10, 0.1, 400);
  camera.position.set(0, 0, 40);

  // Soft studio lighting with a slightly warm microscope key, a cool rim and a coaxial "microscope" light.
  const hemi = new THREE.HemisphereLight(0xf5f1ea, 0x3a2f2a, 0.55);
  const key = new THREE.DirectionalLight(0xfff4e6, 2.1);
  key.position.set(8, 14, 24);
  const rim = new THREE.DirectionalLight(0xcfe3ff, 1.3);
  rim.position.set(-14, 8, -16);
  const fill = new THREE.DirectionalLight(0xffffff, 0.45);
  fill.position.set(-12, -6, 10);
  const coax = new THREE.PointLight(0xfff8ef, 60, 0, 2);
  camera.add(coax);
  scene.add(hemi, key, rim, fill, camera);

  let envRT = null;
  function buildEnvironment() {
    if (envRT) { envRT.dispose(); envRT = null; }
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    envRT = pmrem.fromScene(room, 0.035);
    scene.environment = envRT.texture;
    pmrem.dispose();
    if (typeof room.dispose === 'function') room.dispose();
  }
  buildEnvironment();

  function setTheme(t) { scene.background = new THREE.Color(BG[t] ?? BG.light); }

  function dispose() {
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const m of mats) {
        for (const v of Object.values(m)) if (v && v.isTexture) v.dispose();
        m.dispose();
      }
      if (o.isInstancedMesh && o.dispose) o.dispose();
    });
    if (envRT) { envRT.dispose(); envRT = null; }
    scene.environment = null;
    renderer.renderLists.dispose();
    renderer.dispose();
  }

  return { renderer, scene, camera, buildEnvironment, setTheme, dispose };
}
