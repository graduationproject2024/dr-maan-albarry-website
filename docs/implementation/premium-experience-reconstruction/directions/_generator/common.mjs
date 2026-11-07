import fs from 'node:fs';
import path from 'node:path';
import { esc, bootScript } from './data.mjs';
export const OUT = 'C:/Users/sam20/dr-maan-albarry-website/docs/implementation/premium-experience-reconstruction/directions';

export function write(dir, file, html) {
  fs.mkdirSync(path.join(OUT, dir), { recursive: true });
  fs.writeFileSync(path.join(OUT, dir, file), html);
}

export function doc({ d, title, fonts, body, cls = '', css = 'style.css' }) {
  return `<!doctype html>
<html lang="${d.lang}" dir="${d.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fonts}&display=swap">
<link rel="stylesheet" href="${css}">
${bootScript}
</head>
<body class="${cls}">
${body}
</body>
</html>`;
}

// Labels over an illustration. `labels` use % of the full 1600x1000 image. When `crop` = {x,y,w} (in %),
// coordinates are remapped into the crop window (16:10 crop, so h = w). Labels outside the crop are dropped.
export function labels(list, crop = null, cls = 'lbl', inward = !!crop) {
  return list.map((l, i) => {
    let x = l.x, y = l.y;
    if (crop) { x = (l.x - crop.x) / crop.w * 100; y = (l.y - crop.y) / crop.w * 100; if (x < 3 || x > 97 || y < 3 || y > 97) return '';
      return `<span class="pin" style="--x:${x.toFixed(1)}%;--y:${y.toFixed(1)}%" title="${esc(l.t)}"><bdi>${String(l.k).padStart(2, '0')}</bdi><span class="sr">${esc(l.t)}</span></span>`; }
    const side = inward ? (x > 50 ? 'l' : 'r') : (x > 50 ? 'r' : 'l');
    return `<span class="${cls} ${cls}-${side}" style="--x:${x.toFixed(1)}%;--y:${y.toFixed(1)}%" data-n="${i + 1}"><i aria-hidden="true"></i><span class="lt"><b>${esc(l.t)}</b>${l.d ? `<small>${esc(l.d)}</small>` : ''}</span></span>`;
  }).join('');
}

// A crop window: an <img> scaled inside an overflow:hidden 16:10 box.
export function cropImg(src, alt, crop) {
  const s = 100 / crop.w;
  return `<img src="${src}" alt="${esc(alt)}" style="position:absolute;width:${(s * 100).toFixed(2)}%;max-width:none;height:auto;left:${(-crop.x * s).toFixed(2)}%;top:${(-crop.y * s).toFixed(2)}%" width="1600" height="1000">`;
}

// Navigation board: desktop header + mobile closed / open, rendered via iframes of the real prototype pages.
export function navBoard({ d, title, fonts, css, note }) {
  return doc({ d, title, fonts, css, cls: 'board', body: `
<main class="board-wrap">
  <p class="board-cap">Desktop header · 1440 · AR (procedures menu open)</p>
  <iframe class="frame-desk" src="home-ar.html?nav=open" width="1440" height="470" title="desktop header"></iframe>
  <p class="board-cap">Desktop header · 1440 · EN</p>
  <iframe class="frame-desk" src="home-en.html" width="1440" height="120" title="desktop header EN"></iframe>
  <div class="board-row">
    <figure><iframe src="home-ar.html" width="390" height="844" title="mobile closed"></iframe><figcaption>Mobile 390 · menu closed</figcaption></figure>
    <figure><iframe src="home-ar.html?menu=open" width="390" height="844" title="mobile open"></iframe><figcaption>Mobile 390 · menu open</figcaption></figure>
    <div class="board-note">${note}</div>
  </div>
</main>` });
}

export const boardCss = `
.board{margin:0;background:#8e8a84}
.board-wrap{padding:32px 0 40px;width:1440px}
.board-cap{font:600 13px/1.4 ui-monospace,Menlo,monospace;color:#fff;margin:0 32px 10px;letter-spacing:.04em}
.frame-desk{display:block;border:0;margin:0 0 28px;background:#fff}
.board-row{display:flex;gap:40px;padding:0 32px;align-items:flex-start}
.board-row figure{margin:0}
.board-row iframe{border:0;border-radius:28px;box-shadow:0 30px 60px -30px rgba(0,0,0,.5);background:#fff;display:block}
.board-row figcaption{font:600 13px/1.4 ui-monospace,Menlo,monospace;color:#fff;margin-top:10px;text-align:center}
.board-note{flex:1;color:#fff;font:400 15px/1.6 system-ui,sans-serif;max-width:420px;padding-top:12px}
.board-note h2{font-size:20px;margin:0 0 8px}
`;

// WCAG contrast helper injected into colour pages.
export const contrastScript = `<script>
function lum(hex){hex=hex.replace('#','');var c=[0,2,4].map(function(i){var v=parseInt(hex.substr(i,2),16)/255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)});return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]}
function ratio(a,b){var A=lum(a),B=lum(b);return (Math.max(A,B)+0.05)/(Math.min(A,B)+0.05)}
document.addEventListener('DOMContentLoaded',function(){document.querySelectorAll('[data-fg]').forEach(function(el){var r=ratio(el.dataset.fg,el.dataset.bg);var o=el.querySelector('.ratio');o.textContent=r.toFixed(2)+':1 '+(r>=7?'AAA':r>=4.5?'AA':r>=3?'AA large':'fail');el.dataset.ratio=r.toFixed(2);});});
</script>`;

// Sequential numbered pins over a full image + a matching legend.
export function pins(list, cls = 'pin') {
  return list.map((l, i) => `<span class="${cls}" style="--x:${l.x}%;--y:${l.y}%"><bdi>${i + 1}</bdi><span class="sr">${esc(l.t)}</span></span>`).join('');
}
export function legend(list, cls = 'key') {
  return `<p class="${cls}">${list.map((l, i) => `<span><b><bdi>${i + 1}</bdi></b>${esc(l.t)}</span>`).join('')}</p>`;
}
