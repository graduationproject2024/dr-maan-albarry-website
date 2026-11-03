// Intravitreal injection: the whole globe from the side (anterior to the left). A wedge of the posterior globe is
// opened (behind the ora serrata) so the vitreous cavity, the retina and macula and the optic disc are visible,
// while the front of the eye stays intact for the pars plana entry 3.75 mm behind the limbus. A fine 30 G needle
// points at the mid-vitreous and a soft medication bolus spreads from its tip.
import * as THREE from 'three';
import { buildGlobe } from '../globe.js';
import { EYE, DEG, shellPoint } from '../anatomy.js';
import { glowSprite } from '../kit.js';
import { injectionNeedle, orient } from '../instruments.js';

const CUT = { mode: 'wedge', phi0: 18 * DEG, phi1: 138 * DEG, zb: -4.4, floorAlpha: 0.6 };
const PHI_E = 112 * DEG; // entry meridian (inside the opened sector, so the tip is visible)

export default function injection(ctx) {
  const a = 102 * DEG, az = 64 * DEG;
  const dir = [Math.sin(a) * Math.cos(az), Math.sin(a) * Math.sin(az), Math.cos(a)];
  const up = [-Math.sin(az) - 0.15 * Math.cos(az), Math.cos(az) - 0.15 * Math.sin(az), 0.32];
  const cam = ctx.camera({ target: [0, 0, EYE.cz + 0.6], shift: [0.9, -0.6], dir, up, H: 27.5, fov: 18 });
  const scene = ctx.scene(cam);
  const eye = buildGlobe(ctx.mats, { lens: 'clear', opticNerve: true, cut: CUT, irisSeed: 5, gelAlpha: 0.1 });
  scene.add(eye.group, ...eye.caps({ r1: 12.4, z1: 4.4, ppm: 150, tones: [1, 0.86, 0.94], floorPpm: 110 }));

  // pars plana entry, 3.75 mm behind the limbus (arc on the outer scleral surface), aimed at the mid-vitreous
  const aE = EYE.aLimbus + 3.75 / EYE.scleraR;
  const [er, ez] = shellPoint(EYE.scleraR, aE);
  const entry = new THREE.Vector3(er * Math.cos(PHI_E), er * Math.sin(PHI_E), ez);
  const aim = new THREE.Vector3(1.2 * Math.cos(PHI_E), 1.2 * Math.sin(PHI_E), EYE.cz + 0.2);
  const d = aim.clone().sub(entry).normalize();
  const tip = entry.clone().addScaledVector(d, 7.4);
  scene.add(orient(injectionNeedle(ctx.mats, 13), tip.toArray(), d.clone().negate().toArray()));
  // medication bolus: a soft, slightly cool cloud spreading from the tip
  const b = tip.clone().addScaledVector(d, 0.9);
  scene.add(glowSprite(b.toArray(), 3.2, [120, 196, 214], 0.75));
  scene.add(glowSprite(tip.clone().addScaledVector(d, 0.4).toArray(), 1.6, [210, 244, 250], 0.9));
  scene.add(glowSprite(b.clone().addScaledVector(d, 0.9).toArray(), 4.6, [120, 196, 214], 0.35));

  const W = ctx.W, H = ctx.H;
  const [cx, cy] = ctx.project(cam, [0, 0, EYE.cz]);
  return {
    passes: [{ scene, camera: cam }],
    under(g, theme) {
      // soft ground shadow under the globe
      g.translate(cx, cy + H * 0.42); g.scale(1, 0.12);
      const gr = g.createRadialGradient(0, 0, 0, 0, 0, W * 0.3);
      gr.addColorStop(0, theme === 'light' ? 'rgba(70,58,48,0.2)' : 'rgba(0,0,0,0.5)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(-W, -H * 6, W * 2, H * 12);
    }
  };
}
