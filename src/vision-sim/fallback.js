// Static explanatory comparison (no WebGL needed): defocus-curve SHAPES from the same pure optics model,
// drawn as inline SVG, plus each lens's intended range and trade-offs.
import { throughFocus } from './optics/model.js';
import { PUPIL_BY_LIGHTING } from './optics/params.js';
import { STRINGS, LENS_INFO, fmt } from './i18n.js';

const COLORS = { monofocal: 'var(--vsim-c-mono)', edof: 'var(--vsim-c-edof)', trifocal: 'var(--vsim-c-tri)', toric: 'var(--vsim-c-toric)', cataract: 'var(--vsim-c-cat)' };
const DASH = { monofocal: '', edof: '7 4', trifocal: '2 3', toric: '', cataract: '10 3 2 3' };
let uid = 0;

/** SVG through-focus chart for the given lenses. Lines are labelled in a legend; the chart has a text title. */
export function curveChart(lang, lenses = ['monofocal', 'edof', 'trifocal'], { pupilMm = PUPIL_BY_LIGHTING.day, highlight } = {}) {
  const s = STRINGS[lang];
  const W = 640, H = 300, L = 46, R = 16, T = 18, B = 58, maxD = 3;
  const x = (v) => (lang === 'ar' ? W - R - ((v / maxD) * (W - L - R)) : L + (v / maxD) * (W - L - R));
  const y = (q) => T + (1 - q) * (H - T - B);
  const id = `vsim-chart-${++uid}`;
  let out = `<svg class="vsim-chart" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="${id}" focusable="false"><title id="${id}">${s.chartTitle}</title>`;
  for (const q of [0, 0.25, 0.5, 0.75, 1]) out += `<line x1="${L}" x2="${W - R}" y1="${y(q)}" y2="${y(q)}" class="vsim-grid"/>`;
  const marks = [[1 / 6, s.presetDist.distance], [1, `1 ${s.m}`], [1 / 0.66, s.presetDist.intermediate], [2.5, s.presetDist.near], [3, `${fmt(lang, 33)} ${s.cm}`]];
  for (const [v, label] of marks) {
    out += `<line x1="${x(v)}" x2="${x(v)}" y1="${T}" y2="${H - B}" class="vsim-grid vsim-grid-v"/>`;
    out += `<text x="${x(v)}" y="${H - B + 18}" text-anchor="middle" class="vsim-axis">${label}</text>`;
  }
  out += `<text x="${W / 2}" y="${H - 10}" text-anchor="middle" class="vsim-axis vsim-axis-title">${s.chartX}</text>`;
  for (const lens of lenses) {
    const pts = throughFocus(lens, { pupilMm, toD: maxD, stepD: 0.05 });
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.vergenceD).toFixed(1)},${y(Math.min(1, p.sharpness)).toFixed(1)}`).join('');
    const on = !highlight || highlight.includes(lens);
    out += `<path d="${d}" fill="none" stroke="${COLORS[lens]}" stroke-width="${on ? 3 : 1.6}" stroke-dasharray="${DASH[lens]}" opacity="${on ? 1 : 0.45}" stroke-linejoin="round"/>`;
  }
  out += '</svg>';
  const legend = `<ul class="vsim-legend">${lenses.map((l) => `<li><svg width="28" height="10" aria-hidden="true"><line x1="0" x2="28" y1="5" y2="5" stroke="${COLORS[l]}" stroke-width="3" stroke-dasharray="${DASH[l]}"/></svg>${s.lenses[l].name}</li>`).join('')}</ul>`;
  return `<figure class="vsim-figure">${out}<figcaption><span class="vsim-chart-y">${s.chartY}</span>${legend}</figcaption></figure>`;
}

export function fallbackHTML(lang) {
  const s = STRINGS[lang];
  const info = LENS_INFO[lang];
  const items = ['monofocal', 'edof', 'trifocal', 'toric', 'cataract'].map((k) => `
    <li><strong>${s.lenses[k].name}</strong>
      <span><b>${s.intended}:</b> ${info[k].intended}</span>
      <span><b>${s.tradeoffs}:</b> ${info[k].tradeoffs}</span></li>`).join('');
  return `<div class="vsim-fallback-body">
    <h3 class="vsim-fallback-title">${s.fallbackTitle}</h3>
    <p>${s.fallbackIntro}</p>
    ${curveChart(lang, ['monofocal', 'edof', 'trifocal', 'cataract'])}
    <ul class="vsim-lens-list">${items}</ul>
  </div>`;
}
