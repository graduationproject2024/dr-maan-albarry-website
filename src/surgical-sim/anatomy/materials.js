// Shared materials for the procedure simulators. Tissue colours follow the cataract simulator (same textures for the
// iris, sclera and lens) so every simulator reads as one family; new tissues (corneal layers, retina) use matte,
// low-gloss materials so cross-sections read as tissue, not glass.
import * as THREE from 'three';
import { irisTexture, scleraTexture } from '../../cataract-sim/materials.js';

// Collagen lamellae: fine wavy lines parallel to the corneal surface, for the stroma band of the cross-section.
function lamellaeTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, 256, 128);
  g.strokeStyle = 'rgba(90,120,140,0.28)'; g.lineWidth = 1.1;
  for (let k = 0; k < 14; k++) {
    const y0 = 6 + k * 8.6;
    g.beginPath();
    for (let x = 0; x <= 256; x += 8) g.lineTo(x, y0 + Math.sin(x / 23 + k * 1.7) * 1.2);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping; t.repeat.set(3, 1); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
// Cross-links: short bridges between the lamellae (CXL), drawn as an overlay band whose opacity the procedure sets.
function crosslinkTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 128;
  const g = c.getContext('2d');
  g.clearRect(0, 0, 256, 128);
  g.strokeStyle = 'rgba(150,95,20,0.95)'; g.lineWidth = 1.6;
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let k = 0; k < 13; k++) for (let n = 0; n < 9; n++) {
    const x = rnd() * 256, y = 6 + k * 8.6;
    g.beginPath(); g.moveTo(x, y + 1); g.lineTo(x + (rnd() - 0.5) * 3, y + 7.6); g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping; t.repeat.set(3, 1); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** clipPlane: the shared section plane (moved far away when the section view is off, so no shader is rebuilt). */
export function createMaterials(clipPlane) {
  const clip = [clipPlane];
  const tex = { iris: irisTexture(), sclera: scleraTexture(), lamellae: lamellaeTexture(), crosslink: crosslinkTexture() };
  const tissue = (o) => new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0, side: THREE.DoubleSide, clippingPlanes: clip, ...o });
  const glass = (o) => new THREE.MeshPhysicalMaterial({
    roughness: 0.06, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03, transparent: true, depthWrite: false,
    side: THREE.DoubleSide, clippingPlanes: clip, ...o
  });
  const free = (o) => new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0, ...o }); // not clipped
  const m = {
    tex,
    sclera: new THREE.MeshPhysicalMaterial({ map: tex.sclera, roughness: 0.5, clearcoat: 0.3, clearcoatRoughness: 0.35, sheen: 0.25, sheenRoughness: 0.6, sheenColor: new THREE.Color(0xffeedd), side: THREE.DoubleSide, clippingPlanes: clip }),
    scleraCut: tissue({ color: 0xdccfc2 }),
    // cornea: a faint, glossy dome; its tissue shows in the cross-section bands
    corneaSurface: glass({ color: 0xe7f1f5, opacity: 0.16, ior: 1.376, envMapIntensity: 1.2 }),
    corneaTomo: glass({ color: 0xffffff, vertexColors: true, opacity: 0.78, roughness: 0.3, clearcoat: 0.4 }),
    corneaBack: glass({ color: 0xf2e2c2, opacity: 0.1 }),
    corneaEdge: tissue({ color: 0xd9e4e8, transparent: true, opacity: 0.55, depthWrite: false }),
    epithelium: tissue({ color: 0xf1ddd4, roughness: 0.7 }),
    stroma: tissue({ color: 0xcadde6, map: tex.lamellae, roughness: 0.75 }),
    endothelium: tissue({ color: 0xd99a55, roughness: 0.6 }),
    crosslinks: tissue({ map: tex.crosslink, transparent: true, opacity: 0, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }),
    riboflavin: tissue({ color: 0xf2c400, transparent: true, opacity: 0, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 }),
    haze: tissue({ color: 0xf3f1ec, transparent: true, opacity: 0, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 }),
    graftSurface: glass({ color: 0xdff0e2, opacity: 0.32 }),
    graftEpithelium: tissue({ color: 0xe8e3c9 }),
    graftStroma: tissue({ color: 0xc4e0cb, map: tex.lamellae }),
    graftEndothelium: tissue({ color: 0xd7a35a }),
    flapSurface: glass({ color: 0xe9f3f7, opacity: 0.3 }),
    lenticule: tissue({ color: 0xa9cbe0, map: tex.lamellae, transparent: true, opacity: 0.92 }),
    lenticuleSurface: glass({ color: 0x9cc6e2, opacity: 0.55 }),
    iris: new THREE.MeshStandardMaterial({ map: tex.iris, bumpMap: tex.iris, bumpScale: 2, roughness: 0.72, side: THREE.DoubleSide, clippingPlanes: clip }),
    irisCap: tissue({ color: 0x3d2414 }),
    ciliary: tissue({ color: 0x4a2219, roughness: 0.78 }),
    ciliaryCut: tissue({ color: 0x6a3226 }),
    zonule: new THREE.LineBasicMaterial({ color: 0xe9e1d2, transparent: true, opacity: 0.3, clippingPlanes: clip }),
    lens: glass({ color: 0xf6efdf, opacity: 0.32, roughness: 0.2, clearcoat: 0.6, ior: 1.42 }),
    lensCap: tissue({ color: 0xeee3c6, transparent: true, opacity: 0.85 }),
    capsule: glass({ color: 0xf6f8f9, opacity: 0.1 }),
    capsuleCap: tissue({ color: 0xf7f3ea, roughness: 0.5 }),
    iol: glass({ color: 0xbcd8ff, opacity: 0.42, ior: 1.47, envMapIntensity: 1.4 }),
    iolCap: tissue({ color: 0xbcd8ff }),
    iolSolid: free({ color: 0xbcd8ff, transparent: true, opacity: 0.8 }),
    haptic: new THREE.MeshPhysicalMaterial({ color: 0xcfe2f6, roughness: 0.15, clearcoat: 1, transparent: true, opacity: 0.92, side: THREE.DoubleSide, clippingPlanes: clip }),
    iolRing: new THREE.LineBasicMaterial({ color: 0x3f6f9e, transparent: true, opacity: 0.75, clippingPlanes: clip }),
    toricMark: free({ color: 0x2b4f73 }),
    icl: glass({ color: 0xc9b8e8, opacity: 0.5, roughness: 0.12, envMapIntensity: 1.1 }),
    iclRim: free({ color: 0x8a72b8, roughness: 0.3, clippingPlanes: clip }),
    choroid: tissue({ color: 0x5a1f17 }),
    retina: tissue({ color: 0xd9705a, roughness: 0.72 }),
    retinaCut: tissue({ color: 0xe48a6e }),
    macula: tissue({ color: 0xb4532c, transparent: true, opacity: 0.55, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }),
    fovea: tissue({ color: 0x7e2e14, transparent: true, opacity: 0.7, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3 }),
    opticDisc: tissue({ color: 0xf2d2a2, polygonOffset: true, polygonOffsetFactor: -3 }),
    vessel: tissue({ color: 0x7c1712, roughness: 0.5 }),
    artery: tissue({ color: 0xb02a1d, roughness: 0.5 }),
    vitreous: new THREE.MeshStandardMaterial({ color: 0xdbe9ef, transparent: true, opacity: 0.06, roughness: 0.6, depthWrite: false, side: THREE.FrontSide, clippingPlanes: clip }),
    vitreousCap: tissue({ color: 0xe6eff3, transparent: true, opacity: 0.16, depthWrite: false }),
    medicine: new THREE.MeshBasicMaterial({ color: 0x4f9fd6, transparent: true, opacity: 0, depthWrite: false }),
    fluid: tissue({ color: 0xf0d27a, transparent: true, opacity: 0, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 }),
    steel: free({ color: 0xc4cad0, metalness: 1, roughness: 0.18, envMapIntensity: 1.5 }),
    hub: free({ color: 0x47708a, roughness: 0.4 }),
    plastic: new THREE.MeshPhysicalMaterial({ color: 0xe9f1f5, roughness: 0.25, transparent: true, opacity: 0.5, clearcoat: 0.6, depthWrite: false, side: THREE.DoubleSide }),
    suture: free({ color: 0x1d2633, roughness: 0.5 }),
    bandage: new THREE.MeshPhysicalMaterial({ color: 0xe8f6ff, transparent: true, opacity: 0.22, roughness: 0.05, clearcoat: 1, depthWrite: false, side: THREE.DoubleSide }),
    drop: new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, roughness: 0.02, clearcoat: 1, depthWrite: false }),
    dropRibo: new THREE.MeshPhysicalMaterial({ color: 0xf5c518, transparent: true, opacity: 0.8, roughness: 0.05, clearcoat: 1, depthWrite: false }),
    airBubble: new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.25, roughness: 0.02, clearcoat: 1, depthWrite: false, side: THREE.DoubleSide, clippingPlanes: clip }),
    // light: additive, never lit
    laserBeam: new THREE.MeshBasicMaterial({ color: 0x7fd4ff, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }),
    femtoBeam: new THREE.MeshBasicMaterial({ color: 0xff8a5c, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }),
    uvBeam: new THREE.MeshBasicMaterial({ color: 0x8f7bff, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }),
    rays: new THREE.LineBasicMaterial({ color: 0xffc45a, transparent: true, opacity: 0.9, depthTest: false }),
    raysAlt: new THREE.LineBasicMaterial({ color: 0x5ab0ff, transparent: true, opacity: 0.9, depthTest: false }),
    marker: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, depthTest: false })
  };
  return m;
}

/** Dispose every material and texture created above. */
export function disposeMaterials(m) {
  for (const t of Object.values(m.tex)) t.dispose();
  for (const [k, v] of Object.entries(m)) if (k !== 'tex' && v && v.dispose) v.dispose();
}
