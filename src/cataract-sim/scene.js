// Renderer, camera, lights and image-based environment (RoomEnvironment via PMREM — no HDR downloads).
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export const BG = { light: 0xdfe5e7, dark: 0x0c171d };

export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export function maxDpr() {
  return Math.min(window.devicePixelRatio || 1, 2);
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
