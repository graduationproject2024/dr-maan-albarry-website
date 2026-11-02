// The seven procedure scenes. Each returns { scene, frame, fade, inset? } built on the shared eye.
import * as THREE from 'three';
import { EYE, DEG, corneaAntZ, corneaThickness, lensAntZ, shellPoint, smoothstep, mirrorX, fullSection } from './anatomy.js';
import { corneaSpec, sectionPlane, lathe, offsetLine } from './kit.js';
import { buildEye, paintCornea } from './eye.js';
import { phacoTip, injectionNeedle, iol, phakicLens, orient, lightColumn } from './instruments.js';
import { C, M } from './style.js';

// Framing presets (target in eye x/z, H = visible height in mm at the section plane).
const FRAME_ANT = { target: [0.4, -1.7], H: 15.2 };
const FRAME_CORNEA = { target: [0.0, 2.0], H: 11.2 };
const FRAME_GLOBE = { target: [1.6, -7.6], H: 28.5 };
// Edge fades (eye-space centre, radii in mm): the globe continues outside anterior/cornea frames.
const FADE_ANT = { center: [0, -0.6], rx: 8.6, rz: 10.5, inner: 0.55 };
const FADE_CORNEA = { center: [0, 2.6], rx: 6.6, rz: 9.0, inner: 0.62 };
const FADE_GLOBE = { center: [0, EYE.cz], rx: 16.5, rz: 16.5, inner: 0.72 };

export const SLUGS = ['cataract-surgery', 'lens-implants', 'laser-vision-correction', 'icl', 'keratoconus-cxl', 'corneal-transplant', 'intravitreal-injections'];

export const SCENES = {
  'cataract-surgery'(ctx) {
    const eye = buildEye(ctx.mats, { lens: 'cataract', rhexis: 2.6, pupilR: 3.1 });
    const k = ctx.section(FRAME_ANT);
    eye.paint(k);
    const scene = ctx.scene();
    scene.add(eye.group, sectionPlane(k));
    // phaco tip through a temporal clear-corneal incision, aimed at the nucleus within the rhexis
    const E = [5.62, 0, corneaAntZ(5.62)];
    const T = [1.25, 0, lensAntZ(1.25) + 0.42];
    const out = [E[0] - T[0], 0, E[2] - T[2]];
    scene.add(orient(phacoTip(ctx.mats), T, out));
    return { scene, frame: FRAME_ANT, fade: FADE_ANT };
  },

  'lens-implants'(ctx) {
    const eye = buildEye(ctx.mats, { lens: 'bag', pupilR: 2.4 });
    const k = ctx.section(FRAME_ANT);
    eye.paint(k);
    const lens = iol(ctx.mats, { zc: -1.25, span: 4.45, phi0: -38 * DEG, half: true });
    paintImplant(k, fullSection(lens.userData.profile));
    const scene = ctx.scene();
    scene.add(eye.group, sectionPlane(k), lens);
    // inset: monofocal vs multifocal (trifocal) optic patterns, face-on, abstract and brand-free
    const inset = ctx.scene();
    const a = iol(ctx.mats, { zc: 0, span: 5.6, phi0: 70 * DEG });
    const b = iol(ctx.mats, { zc: 0, span: 5.6, phi0: 70 * DEG, rings: true });
    a.position.y = 6.6; b.position.y = -6.6;
    for (const m of [a, b]) { m.rotation.y = -14 * DEG; inset.add(m); }
    return {
      scene, frame: FRAME_ANT, fade: { ...FADE_ANT, center: [0, 0.2] },
      inset: { scene: inset, width: 27.5, rect: [1092, 664, 452, 282] }
    };
  },

  'laser-vision-correction'(ctx) {
    const rf = 4.3, tf = 0.11, d0 = 0.08, rz = 3.8;
    const abl = (r) => (r < rz ? d0 * (1 - (r / rz) ** 2) ** 2 : 0);
    const G = (x, y) => { const r = Math.hypot(x, y); return corneaAntZ(r) - (r < rf ? tf + abl(r) : 0); };
    const spec = corneaSpec({ G });
    const theta = 62 * DEG; // flap folded back on its superior hinge
    const hinge = [rf, corneaAntZ(rf) - tf / 2];
    const rot = ([x, z]) => {
      const dx = x - hinge[0], dz = z - hinge[1];
      return [hinge[0] + dx * Math.cos(theta) + dz * Math.sin(theta), hinge[1] - dx * Math.sin(theta) + dz * Math.cos(theta)];
    };
    const eye = buildEye(ctx.mats, {
      cornea: spec, corneaRadii: [rf - 0.0008, rf + 0.0008],
      paintCornea: (k, sp) => {
        const sec = sp.section(360, [rf - 0.0008, rf + 0.0008, -rf + 0.0008, -rf - 0.0008]);
        paintCornea(k, { section: () => sec }, {
          epiFrom: rf,
          over: (kk) => {
            // stromal bed highlight (the reshaped central profile)
            const bed = sec.ant.filter(([x]) => Math.abs(x) < rf - 0.01);
            kk.stroke(bed, 'rgba(255,255,255,0.75)', 2.0, false);
          }
        });
        // lifted flap: anterior 110 um cap, rotated about the hinge, drawn as its own section strip
        const ant = [], post = [];
        for (let x = -rf; x <= rf + 1e-6; x += 0.02) { ant.push([x, corneaAntZ(Math.abs(x))]); post.push([x, corneaAntZ(Math.abs(x)) - tf]); }
        const strip = [...ant, ...post.reverse()].map(rot);
        const epi = [...ant, ...offsetLine(ant, -0.05).reverse()].map(rot);
        k.fill(strip, C.cornea);
        k.clipTo(strip, () => k.fill(epi, C.corneaEpi));
        k.shade(strip, C.corneaShade, 3, 3);
        k.stroke(strip);
      }
    });
    const k = ctx.section(FRAME_CORNEA);
    eye.paint(k);
    const scene = ctx.scene();
    scene.add(eye.group, sectionPlane(k));
    // flap 3D (half), rotated about an axis parallel to y through the hinge
    const prof = [];
    for (let r = 0; r <= rf + 1e-6; r += 0.05) prof.push([r, corneaAntZ(r) - tf]);
    for (let r = rf; r >= -1e-6; r -= 0.05) prof.push([Math.max(0, r), corneaAntZ(Math.max(0, r))]);
    const flapMat = ctx.mats.cornea.clone(); flapMat.opacity = 0.6; flapMat.color = new THREE.Color('#DCEBEF');
    const flap = new THREE.Mesh(lathe(prof, { segments: 160 }), flapMat);
    flap.renderOrder = 3;
    const pivot = new THREE.Group(); pivot.position.set(hinge[0], 0, hinge[1]);
    flap.position.set(-hinge[0], 0, -hinge[1]); pivot.add(flap); pivot.rotation.y = theta;
    scene.add(pivot);
    // thin excimer beam (illustrative colour; the real 193 nm light is invisible)
    const x0 = -1.05, zHit = G(x0, 0);
    const beamCore = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 30, 24, 1, true), new THREE.MeshBasicMaterial({ color: '#7A68DC', transparent: true, opacity: 0.85, depthWrite: false }));
    beamCore.rotation.x = Math.PI / 2; beamCore.position.set(x0, 0, zHit + 15); beamCore.renderOrder = 21;
    scene.add(beamCore);
    scene.add(lightColumn({ radius: 0.24, zFar: zHit + 30, zEnd: () => zHit, opacity: 0.5, cx: x0, cy: 0 }));
    scene.add(glowSprite([x0, -0.05, zHit + 0.02], 0.9, 'rgba(140,123,224,0.8)'));
    return { scene, frame: FRAME_CORNEA, fade: { ...FADE_CORNEA, center: [0.4, 3.6], rz: 10.5 } };
  },

  'icl'(ctx) {
    const eye = buildEye(ctx.mats, { lens: 'clear', pupilR: 2.2, irisLift: 0.72 });
    const k = ctx.section(FRAME_ANT);
    eye.paint(k);
    const icl = phakicLens(ctx.mats);
    paintImplant(k, icl.userData.section);
    const scene = ctx.scene();
    scene.add(eye.group, sectionPlane(k), icl);
    return { scene, frame: FRAME_ANT, fade: FADE_ANT };
  },

  'keratoconus-cxl'(ctx) {
    const cx = -1.15, A = 0.4, sg = 1.95;
    const win = (r) => 1 - smoothstep(4.0, EYE.corneaRadius, r);
    const bump = (x, y) => A * Math.exp(-(((x - cx) ** 2 + y * y) / (sg * sg))) * win(Math.hypot(x, y));
    const F = (x, y) => corneaAntZ(Math.hypot(x, y)) + bump(x, y);
    const T = (x, y) => corneaThickness(Math.hypot(x, y)) - 0.14 * Math.exp(-(((x - cx) ** 2 + y * y) / (1.5 * 1.5)));
    const spec = corneaSpec({ F, T });
    const corneaMat = ctx.mats.cornea.clone(); corneaMat.color = new THREE.Color('#EEEBA8'); corneaMat.opacity = 0.3;
    const eye = buildEye(ctx.mats, {
      cornea: spec, corneaMaterial: corneaMat,
      paintCornea: (k, sp) => paintCornea(k, sp, {
        epiFrom: 4.0,
        over: (kk, sec) => {
          const front = sec.ant.filter(([x]) => Math.abs(x) < 4.4);
          kk.ctx.save(); kk.ctx.filter = `blur(${kk.mm(0.14)}px)`;
          kk.stroke(front, C.riboflavin, kk.mm(0.6) / 2, false);
          kk.ctx.restore();
        }
      })
    });
    const k = ctx.section(FRAME_CORNEA);
    eye.paint(k);
    const scene = ctx.scene();
    scene.add(eye.group, sectionPlane(k));
    scene.add(lightColumn({ radius: 4.4, zFar: 22, zEnd: (x, y) => F(x, y) + 0.02, opacity: 0.24 }));
    // a few faint parallel rays inside the field
    const rays = [];
    for (const x of [-3.6, -2.4, -1.2, 0, 1.2, 2.4, 3.6]) rays.push(x, -0.02, 20, x, -0.02, F(x, 0) + 0.03);
    const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.Float32BufferAttribute(rays, 3));
    const rl = new THREE.LineSegments(rg, new THREE.LineBasicMaterial({ color: M.violet, transparent: true, opacity: 0.22, depthWrite: false }));
    rl.renderOrder = 21; scene.add(rl);
    return { scene, frame: FRAME_CORNEA, fade: FADE_CORNEA };
  },

  'corneal-transplant'(ctx) {
    const rg = 4.0; // 8 mm donor button
    const spec = corneaSpec();
    const sutureLoop = (s) => { // section path of one interrupted suture crossing the junction at x = s * rg
      const pts = [];
      for (let t = 0; t <= 1.0001; t += 0.04) {
        const x = s * (3.25 + 1.5 * t), n = spec.normal(x, 0), d = 0.86 * corneaThickness(Math.abs(x)) * Math.sin(Math.PI * t);
        pts.push([x - n[0] * d, spec.F(x, 0) - n[2] * d]);
      }
      for (let t = 1; t >= -0.0001; t -= 0.04) { const x = s * (3.25 + 1.5 * t); pts.push([x, spec.F(x, 0) + 0.035]); }
      return pts;
    };
    const pkCornea = ctx.mats.cornea.clone(); pkCornea.opacity = 0.42; pkCornea.color = new THREE.Color('#E2EEF2');
    const eye = buildEye(ctx.mats, {
      corneaMaterial: pkCornea,
      paintCornea: (k, sp) => paintCornea(k, sp, {
        under: (kk, sec) => {
          const graft = sec.poly.filter(() => true);
          kk.clipTo(graft, () => {
            const [, top] = kk.P([rg, 0]), [, bot] = kk.P([-rg, 0]);
            kk.ctx.fillStyle = C.graft; kk.ctx.fillRect(0, top, kk.canvas.width, bot - top);
          });
        },
        over: (kk) => {
          for (const s of [1, -1]) {
            const x = s * rg, n = spec.normal(x, 0), pp = spec.post(x, 0);
            kk.stroke([[x, spec.F(x, 0)], [pp[0], pp[2]]], 'rgba(60,80,92,0.75)', 1.4, false);
          }
        }
      })
    });
    const k = ctx.section(FRAME_CORNEA);
    eye.paint(k);
    for (const s of [1, -1]) k.stroke(sutureLoop(s), C.suture, 1.5, true);
    const scene = ctx.scene();
    scene.add(eye.group, sectionPlane(k));
    // 3D interrupted sutures on the kept half and the graft-host junction ring
    for (let i = 1; i < 8; i++) {
      const phi = (i / 8) * Math.PI;
      const pts = [];
      for (let r = 3.25; r <= 4.75 + 1e-6; r += 0.1) pts.push(new THREE.Vector3(r * Math.cos(phi), r * Math.sin(phi), corneaAntZ(r) + 0.018));
      const t = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.022, 8, false), ctx.mats.suture);
      t.renderOrder = 4;
      scene.add(t);
    }
    const ring = [];
    for (let i = 0; i <= 120; i++) { const p = (i / 120) * Math.PI; ring.push(new THREE.Vector3(rg * Math.cos(p), rg * Math.sin(p), corneaAntZ(rg) + 0.01)); }
    const rm = new THREE.MeshStandardMaterial({ color: '#6E8A96', transparent: true, opacity: 0.7, roughness: 0.4 });
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ring), 120, 0.016, 6, false), rm));
    return { scene, frame: FRAME_CORNEA, fade: FADE_CORNEA };
  },

  'intravitreal-injections'(ctx) {
    const eye = buildEye(ctx.mats, { lens: 'clear', opticNerve: true });
    const k = ctx.section(FRAME_GLOBE);
    eye.paint(k);
    const scene = ctx.scene();
    scene.add(eye.group, sectionPlane(k));
    // pars plana entry ~3.75 mm behind the limbus (arc on the outer scleral surface), aimed at mid-vitreous
    const a = EYE.aLimbus + 3.75 / EYE.scleraR;
    const [ex, ez] = shellPoint(EYE.scleraR, a);
    const inward = new THREE.Vector2(0 - ex, EYE.cz - ez).normalize();
    const depth = 6.2;
    const tip = [ex + inward.x * depth, 0, ez + inward.y * depth];
    scene.add(orient(injectionNeedle(ctx.mats), tip, [-inward.x, 0, -inward.y]));
    return { scene, frame: FRAME_GLOBE, fade: FADE_GLOBE };
  }
};

function paintImplant(k, poly) {
  k.fill(poly, C.implantSection);
  k.shade(poly, 'rgba(40,110,120,0.35)', 3, 3);
  k.stroke(poly, 'rgba(40,96,106,0.9)', 2.0);
}

function glowSprite(pos, size, color) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, color); gr.addColorStop(0.35, color.replace(/[\d.]+\)$/, '0.35)')); gr.addColorStop(1, 'rgba(140,123,224,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, depthTest: false }));
  s.scale.set(size, size, 1); s.position.set(...pos); s.renderOrder = 22;
  return s;
}

void mirrorX;
