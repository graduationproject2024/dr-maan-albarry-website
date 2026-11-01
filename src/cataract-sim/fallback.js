// Non-WebGL educational fallback: each stage as an illustrated 2-D cross-section diagram (inline SVG, original
// artwork drawn by this code). Light enters from the left; the front of the eye faces left.

const C = {
  sclera: '#efe9df', scleraLine: '#c8bfb2', cornea: 'rgba(170,205,225,0.35)', corneaLine: '#7fa3b8',
  iris: '#6e4a2a', lensClear: 'rgba(225,238,245,0.55)', lensLine: '#9fb6c4', nucleus: '#b4873f', cortex: 'rgba(233,220,186,0.75)',
  retina: '#b9573a', ray: '#d8a64a', steel: '#8d969d', iol: 'rgba(200,225,250,0.75)', accent: '#b8955a'
};

function eyeBase({ pupilWide = false, cloudy = true, lens = true, iol = false, rhexis = false }) {
  const pupilGap = pupilWide ? 34 : 18;
  let s = '';
  // globe
  s += `<path d="M150 40 A110 110 0 1 1 150 210" fill="${C.sclera}" stroke="${C.scleraLine}" stroke-width="3"/>`;
  s += `<path d="M162 52 A98 98 0 1 1 162 198" fill="none" stroke="${C.retina}" stroke-width="5" opacity="0.85"/>`;
  // cornea
  s += `<path d="M150 40 C95 62 95 188 150 210" fill="${C.cornea}" stroke="${C.corneaLine}" stroke-width="3"/>`;
  // iris (two leaves)
  s += `<path d="M147 45 L147 ${125 - pupilGap}" stroke="${C.iris}" stroke-width="7" stroke-linecap="round"/>`;
  s += `<path d="M147 205 L147 ${125 + pupilGap}" stroke="${C.iris}" stroke-width="7" stroke-linecap="round"/>`;
  // ciliary body + zonules
  s += `<path d="M150 58 l14 10 M150 192 l14 -10" stroke="#5a2a20" stroke-width="6" stroke-linecap="round"/>`;
  if (lens || iol) s += `<path d="M164 70 L172 86 M164 180 L172 164" stroke="#d6cfc2" stroke-width="1.5"/>`;
  if (lens) {
    s += `<ellipse cx="178" cy="125" rx="26" ry="44" fill="${cloudy ? C.cortex : C.lensClear}" stroke="${C.lensLine}" stroke-width="2"/>`;
    if (cloudy) s += `<ellipse cx="178" cy="125" rx="16" ry="27" fill="${C.nucleus}" opacity="0.9"/>`;
  } else {
    s += `<ellipse cx="178" cy="125" rx="26" ry="44" fill="none" stroke="${C.lensLine}" stroke-width="1.5" stroke-dasharray="${rhexis ? '0' : '0'}"/>`;
  }
  if (rhexis) s += `<path d="M156 106 L156 144" stroke="#ffffff" stroke-width="4"/><path d="M156 106 L156 144" stroke="${C.accent}" stroke-width="2" stroke-dasharray="3 3"/>`;
  if (iol) {
    s += `<ellipse cx="176" cy="125" rx="7" ry="24" fill="${C.iol}" stroke="#7fa6c9" stroke-width="2"/>`;
    s += `<path d="M176 101 C178 86 172 78 168 72 M176 149 C178 164 172 172 168 178" fill="none" stroke="#7fa6c9" stroke-width="2.5"/>`;
  }
  return s;
}

const raysIn = (n = 5, spread = 14) => {
  let s = '';
  for (let i = 0; i < n; i++) {
    const y = 125 - spread + (2 * spread * i) / (n - 1);
    s += `<path d="M10 ${y} L118 ${y}" stroke="${C.ray}" stroke-width="2" opacity="0.85"/>`;
  }
  return s;
};

const ART = [
  // 1 cloudy lens: rays scatter inside the lens
  () => eyeBase({}) + raysIn() + [[-40, 70], [-20, 95], [10, 120], [25, 150], [45, 175], [-10, 205]].map(([dy, x]) =>
    `<path d="M178 125 L${178 + x * 0.5} ${125 + dy}" stroke="${C.ray}" stroke-width="1.6" opacity="0.5"/>`).join(''),
  // 2 dilated pupil + microscope view
  () => eyeBase({ pupilWide: true }) + `<g transform="translate(20 18)"><rect x="0" y="0" width="34" height="22" rx="4" fill="${C.steel}"/><path d="M17 22 L17 34" stroke="${C.steel}" stroke-width="5"/><path d="M17 40 L60 90" stroke="${C.ray}" stroke-width="2" stroke-dasharray="4 4"/></g>`,
  // 3 small incision at the edge of the cornea
  () => eyeBase({ pupilWide: true }) + `<path d="M60 20 L138 48" stroke="${C.steel}" stroke-width="5" stroke-linecap="round"/><path d="M138 48 l10 4 -8 -10 z" fill="${C.steel}"/><circle cx="146" cy="47" r="6" fill="none" stroke="${C.accent}" stroke-width="2"/>`,
  // 4 opening the capsule
  () => eyeBase({ pupilWide: true, rhexis: true }) + `<path d="M60 26 L144 52 L156 108" stroke="${C.steel}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  // 5 removing the cloudy lens (phaco)
  () => eyeBase({ pupilWide: true, cloudy: true, rhexis: true }) + `<path d="M50 30 L144 52 L172 118" stroke="${C.steel}" stroke-width="6" fill="none" stroke-linecap="round"/>` +
    [[166, 110], [160, 132], [170, 140], [158, 120]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${C.nucleus}"/>`).join(''),
  // 6 placing the artificial lens
  () => eyeBase({ pupilWide: true, lens: false, iol: true, rhexis: true }) + `<path d="M40 28 L140 50" stroke="#9fb4c2" stroke-width="9" stroke-linecap="round" opacity="0.8"/>`,
  // 7 clear path: rays focus on the retina
  () => eyeBase({ lens: false, iol: true }) + raysIn() + [-14, -7, 0, 7, 14].map((y) =>
    `<path d="M118 ${125 + y} L176 ${125 + y * 0.8} L262 125" stroke="${C.ray}" stroke-width="2" fill="none" opacity="0.9"/>`).join('') +
    `<circle cx="262" cy="125" r="4" fill="${C.accent}"/>`
];

export function stageDiagram(index, title) {
  const id = `csim-fb-${index}-${Math.random().toString(36).slice(2, 7)}`;
  return `<svg class="csim-diagram" viewBox="0 0 300 250" role="img" aria-labelledby="${id}" focusable="false">
    <title id="${id}">${title}</title>${ART[index]()}</svg>`;
}
