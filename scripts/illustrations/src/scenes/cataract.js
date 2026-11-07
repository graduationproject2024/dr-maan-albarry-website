// Cataract surgery: a split "before | after" macro of the anterior segment, seen from the front and above,
// with the upper wedge of the eye cut away. Left: the cloudy, brunescent natural lens filling the capsular bag.
// Right: the same eye after surgery, the bag holding a clear (ghosted) artificial lens.
import { buildGlobe } from '../globe.js';
import { DEG } from '../anatomy.js';

const CUT = { mode: 'half', zc: -4.0, floorAlpha: 0.6 }; // translucent gel floor: no bright slab behind the lens
const EL = 50 * DEG;

export default function cataract(ctx) {
  const cam = ctx.camera({ target: [0, -0.2, -0.9], shift: [0, -0.75], dir: [0, Math.sin(EL), Math.cos(EL)], up: [0, 1, 0], H: 9.0, fov: 16 });
  const make = (lens) => {
    const eye = buildGlobe(ctx.mats, { lens, pupilR: 3.15, cut: CUT, iolOpts: { phi0: 205 * DEG }, fundusTint: '#6E5652', gelAlpha: 0.66 }); // gel kept translucent: it was the brightest patch on dark
    const s = ctx.scene(cam);
    s.add(eye.group, ...eye.caps({ r1: 11.6, z1: 4.3, ppm: 230, tones: [1, 1, 0.8] }));
    return s;
  };
  const W = ctx.W, H = ctx.H;
  const fade = { cx: W / 2, cy: H * 0.56, rx: W * 0.5, ry: H * 0.62, inner: 0.58 };
  const half = (left) => (g) => {
    const gr = g.createLinearGradient(W / 2 - 1.5, 0, W / 2 + 1.5, 0);
    gr.addColorStop(0, left ? '#000' : 'rgba(0,0,0,0)'); gr.addColorStop(1, left ? 'rgba(0,0,0,0)' : '#000');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
  };
  return {
    passes: [
      { scene: make('cataract'), camera: cam, mask: half(true), fade },
      { scene: make('iol'), camera: cam, mask: half(false), fade }
    ],
    over(g, theme) {
      // hairline seam between "before" and "after"
      const gr = g.createLinearGradient(0, H * 0.04, 0, H * 0.96);
      const col = theme === 'light' ? '255,255,255' : '240,244,246';
      gr.addColorStop(0, `rgba(${col},0)`); gr.addColorStop(0.2, `rgba(${col},0.85)`); gr.addColorStop(0.8, `rgba(${col},0.85)`); gr.addColorStop(1, `rgba(${col},0)`);
      g.fillStyle = gr; g.fillRect(W / 2 - 1.5, 0, 3, H);
      const sh = g.createLinearGradient(0, H * 0.04, 0, H * 0.96);
      sh.addColorStop(0, 'rgba(40,30,25,0)'); sh.addColorStop(0.5, 'rgba(40,30,25,0.18)'); sh.addColorStop(1, 'rgba(40,30,25,0)');
      g.fillStyle = sh; g.fillRect(W / 2 + 1.5, 0, 2, H);
    }
  };
}
