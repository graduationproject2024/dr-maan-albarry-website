// Direction B — Interactive Anatomical Atlas ("Plates")
import fs from 'node:fs';
import { data, esc, illus, IMG } from './data.mjs';
import { write, doc, labels, cropImg, navBoard, boardCss, contrastScript, OUT, pins, legend } from './common.mjs';

const FONTS = 'family=Noto+Kufi+Arabic:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,400..700&family=Public+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500';

export const PALETTE = {
  light: { table: '#E7E2D9', plate: '#F3EEE7', ink: '#141B2D', ink2: '#4A5164', rule: '#C9C1B3', mark: '#A33A21', ctaBg: '#141B2D', ctaFg: '#F3EEE7', night: '#181A1E', nightInk: '#E9E6DF' },
  dark: { table: '#101215', plate: '#181A1E', ink: '#E9E6DF', ink2: '#A4A8B1', rule: '#30343C', mark: '#F2916C', ctaBg: '#E9E6DF', ctaFg: '#101215', night: '#181A1E', nightInk: '#E9E6DF' }
};
const vars = p => Object.entries(p).map(([k, v]) => `--${k.replace(/[A-Z0-9]/g, m => '-' + m.toLowerCase())}:${v};`).join('');
const tokens = `:root{${vars(PALETTE.light)}--is-dark:0;color-scheme:light}
:root[data-theme="dark"]{${vars(PALETTE.dark)}--is-dark:1;color-scheme:dark}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${vars(PALETTE.dark)}--is-dark:1;color-scheme:dark}}
`;
const arrow = d => `<svg class="arr" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="${d.dir === 'rtl' ? 'M16 10H4m5-5-5 5 5 5' : 'M4 10h12m-5-5 5 5-5 5'}" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
const im = (slug, alt = '', { small = true, dark = null } = {}) => dark === true
  ? `<img src="${illus(slug, { dark: true, small })}" alt="${esc(alt)}" width="1600" height="1000">`
  : `<img src="${illus(slug, { small })}" data-light="${illus(slug, { small })}" data-dark="${illus(slug, { dark: true, small })}" alt="${esc(alt)}" width="1600" height="1000">`;
const pl = n => `<span class="code">PL.<bdi>${n}</bdi></span>`;

function header(d, { current = '' } = {}) {
  return `
<header class="hdr">
  <a class="mark" href="#"><svg viewBox="0 0 36 36" width="34" height="34" aria-hidden="true"><circle cx="18" cy="18" r="16.5" fill="none" stroke="currentColor"/><circle cx="18" cy="18" r="7" fill="none" stroke="currentColor"/><circle cx="18" cy="18" r="2.4" fill="currentColor"/><path d="M1.5 18h7M27.5 18h7" stroke="currentColor"/></svg><span><span class="mark-name">${d.shortName}</span><span class="mark-sub">${d.kicker}</span></span></a>
  <nav class="hdr-nav" aria-label="${d.tr('التنقل الرئيسي', 'Main navigation')}">${d.nav.map(n => `<a href="#" ${n.key === current ? 'aria-current="page"' : ''} ${n.key === 'procedures' ? 'class="has-menu"' : ''}>${n.label}${n.key === 'procedures' ? '<svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>' : ''}</a>`).join('')}</nav>
  <div class="hdr-act">
    <a class="lang" href="#">${d.ui.langOther}</a>
    <a class="btn btn-sm" href="#">${d.ui.bookShort}</a>
    <button class="menu-btn" type="button" aria-label="${d.ui.menu}" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
  <div class="mega" aria-hidden="true"><div class="mega-in">
    <p class="mega-k"><span class="code">PL. 01–07</span>${d.ui.procsKicker}</p>
    <ul class="mega-grid">${d.procs.map(p => `<li><a href="#"><span class="mg-img">${im(p.slug)}</span><span class="mg-t">${pl(p.n)}<span>${p.name}</span></span></a></li>`).join('')}</ul>
  </div></div>
</header>
<div class="mnav" aria-label="${d.tr('قائمة الموقع', 'Site menu')}">
  <p class="mnav-k"><span class="code">PL. 01–07</span>${d.ui.procedures}</p>
  <ul class="mnav-grid">${d.procs.map(p => `<li><a href="#"><span class="mg-img">${im(p.slug)}</span><span class="mg-t">${pl(p.n)}<span>${p.name}</span></span></a></li>`).join('')}</ul>
  <ul class="mnav-links"><li><a href="#">${d.ui.home}</a></li>${d.nav.map(n => `<li><a href="#">${n.label}</a></li>`).join('')}<li><a href="#">${d.lightJourney}</a></li></ul>
  <a class="btn btn-block" href="#">${d.ui.book}</a>
</div>`;
}

function hero(d) {
  const p = d.procs[0];
  return `
<section class="hero" aria-labelledby="h1">
  <div class="hero-text">
    <p class="kick"><span class="code">PL.<bdi>01</bdi> / <bdi>07</bdi></span><span>${d.kicker} · ${d.city}</span></p>
    <h1 id="h1">${d.name}</h1>
    <p class="hero-title">${d.title}</p>
    <p class="hero-intro">${d.intro}</p>
    <div class="cta"><a class="btn" href="#">${d.ui.book}</a><a class="link" href="#">${d.ui.about}${arrow(d)}</a></div>
    <div class="sig">
      <span class="sig-ph"><img src="${IMG}dr-maan-portrait.png" alt="${d.tr('صورة د. معن بن عبدالله البري', 'Portrait of Dr. Maan bin Abdullah Al Barry')}" width="295" height="225"></span>
      <span class="sig-t"><b>${d.shortName}</b><span>${d.chief}</span><span>${d.quals.map(q => `<bdi dir="ltr">${q.short}</bdi>`).join(' · ')}</span></span>
    </div>
  </div>
  <figure class="hero-plate">
    <div class="frame">
      <p class="frame-top">${pl(p.n)}<span>${p.name}</span><span class="code fig">FIG. A</span></p>
      <div class="plate-img">${im(p.slug, p.alt, { small: false })}${labels(p.labels, null, 'lb')}</div>
      <figcaption>${p.alt}</figcaption>
    </div>
  </figure>
  <nav class="index" aria-label="${d.ui.procedures}">
    ${d.procs.map((x, i) => `<a href="#" ${i === 0 ? 'aria-current="true"' : ''}><span class="ix-img">${im(x.slug)}</span><span class="ix-t">${pl(x.n)}<span>${x.name}</span></span></a>`).join('')}
  </nav>
</section>`;
}

function plateCard(d, p, area) {
  return `<article class="pc pc-${area}">
    <p class="pc-top">${pl(p.n)}<span>${p.groupName}</span></p>
    <a class="pc-img" href="#">${im(p.slug, p.alt, { small: area !== 'a' })}${area === 'a' ? labels(p.labels, null, 'lb') : pins(p.labels, 'pn')}</a>
    ${area === 'a' ? '' : legend(p.labels, 'pc-key')}
    <div class="pc-body">
      <h3><a href="#">${p.name}</a></h3>
      <p>${p.summary}</p>
      <a class="link" href="#">${d.ui.readGuide}<span class="sr">: ${p.name}</span>${arrow(d)}</a>
    </div>
  </article>`;
}

function gallery(d) {
  const areas = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  return `
<section class="plates" id="procedures" aria-labelledby="pt">
  <header class="pl-head">
    <p class="kick"><span class="code">PL. 01–07</span><span>${d.ui.procsKicker}</span></p>
    <h2 id="pt">${d.ui.procsTitle}</h2>
    <p class="pl-lede">${d.ui.sevenLede}</p>
  </header>
  <div class="pl-grid">${d.procs.map((p, i) => plateCard(d, p, areas[i])).join('')}</div>
</section>`;
}

function homePage(lang) {
  const d = data(lang);
  return doc({ d, fonts: FONTS, cls: 'b', title: `B · Atlas · ${lang.toUpperCase()}`, body: `${header(d)}<main>${hero(d)}${gallery(d)}</main>` });
}

const CROP = { x: 24, y: 6, w: 52 };
function procPage(lang) {
  const d = data(lang);
  const p = d.procs[0];
  const body = `${header(d, { current: 'procedures' })}
<main class="proc">
  <header class="night">
    <nav class="crumbs" aria-label="${d.tr('مسار التنقل', 'Breadcrumb')}"><a href="#">${d.ui.home}</a><span aria-hidden="true">/</span><a href="#">${d.ui.procedures}</a><span aria-hidden="true">/</span><span aria-current="page">${p.name}</span></nav>
    <div class="n-grid">
      <div class="n-text">
        <p class="kick"><span class="code">PL.<bdi>${p.n}</bdi></span><span>${p.groupName}</span></p>
        <h1>${p.name}</h1>
        <p class="n-intro">${p.intro}</p>
        <p class="review"><svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M10 6v5M10 13.5v.5" stroke="currentColor" stroke-width="1.6"/></svg><span>${d.ui.review}</span></p>
        <div class="cta"><a class="btn btn-inv" href="#">${d.ui.bookProc}</a><a class="link" href="#">${d.ui.watch3d}${arrow(d)}</a></div>
      </div>
      <figure class="n-plate">
        <div class="plate-img">${im(p.slug, p.alt, { small: false, dark: true })}${labels(p.labels, null, 'lb')}</div>
        <figcaption><span class="code">FIG. A</span>${p.alt}</figcaption>
      </figure>
    </div>
    <nav class="n-toc" aria-label="${d.ui.onThisPage}">${d.sections.map((s, i) => `<a href="#"><span class="code"><bdi>${String(i + 1).padStart(2, '0')}</bdi></span>${s.label}</a>`).join('')}</nav>
  </header>
  <section class="loupe-sec" aria-labelledby="lt">
    <div class="lp-key">
      <p class="kick"><span class="code">FIG. B</span><span>${d.sections[0].label}</span></p>
      <h2 id="lt">${d.sections[0].label}</h2>
      <div class="lp-src"><div class="plate-img">${im(p.slug, '', { small: true })}<span class="lp-box" style="--x:${CROP.x}%;--y:${CROP.y}%;--w:${CROP.w}%"></span></div><p class="code">FIG. A ⟶ B · ×${(100 / CROP.w).toFixed(1)}</p></div>
    </div>
    <figure class="loupe">
      <div class="lp-circle">${cropImg(illus(p.slug), p.alt, CROP)}${labels(p.labels, CROP, 'lb')}</div>
    </figure>
    <dl class="parts">${p.parts.map((x, i) => `<div><dt><span class="pin-i"><bdi>${String(i + 1).padStart(2, '0')}</bdi></span>${x[0]}</dt><dd>${x[1]}</dd></div>`).join('')}</dl>
  </section>
</main>`;
  return doc({ d, fonts: FONTS, cls: 'b', title: `B · Procedure · ${lang.toUpperCase()}`, body });
}

function typePage() {
  const ar = data('ar'), en = data('en');
  const spec = s => `<p class="spec">${s}</p>`;
  const body = `
<main class="sheet">
  <header class="sheet-head"><p class="kick"><span class="code">DIRECTION B</span><span>Interactive Anatomical Atlas</span></p><h1 class="sheet-t">Type specimen</h1><p class="sheet-sub">Noto Kufi Arabic + Noto Sans Arabic · Source Serif 4 + Public Sans · IBM Plex Mono for plate codes</p></header>
  <section class="sp-grid">
    <div class="sp" dir="rtl" lang="ar">${spec('AR DISPLAY · Noto Kufi Arabic 600 · 54px / 1.55 · 0')}<p class="t-ar-d">${ar.name}</p></div>
    <div class="sp" dir="ltr" lang="en">${spec('EN DISPLAY · Source Serif 4 600 (opsz 60) · 56px / 1.08 · −0.015em')}<p class="t-en-d">${en.name}</p></div>
    <div class="sp" dir="rtl" lang="ar">${spec('AR H2 · Noto Kufi Arabic 600 · 40px / 1.6')}<p class="t-ar-h2">${ar.ui.procsTitle}</p>${spec('AR PLATE TITLE · Noto Kufi Arabic 600 · 20px / 1.7')}<p class="t-ar-h3">${ar.procs[0].name}</p></div>
    <div class="sp" dir="ltr" lang="en">${spec('EN H2 · Source Serif 4 600 · 42px / 1.12 · −0.01em')}<p class="t-en-h2">${en.ui.procsTitle}</p>${spec('EN PLATE TITLE · Source Serif 4 600 · 21px / 1.3')}<p class="t-en-h3">${en.procs[0].name}</p></div>
    <div class="sp" dir="rtl" lang="ar">${spec('AR BODY · Noto Sans Arabic 400 · 17px / 1.9 · measure 60ch')}<p class="t-ar-b">${ar.procs[0].intro}</p></div>
    <div class="sp" dir="ltr" lang="en">${spec('EN BODY · Public Sans 400 · 16.5px / 1.65 · measure 66ch')}<p class="t-en-b">${en.procs[0].intro}</p></div>
    <div class="sp" dir="rtl" lang="ar">${spec('MEDICAL LABEL · Noto Kufi Arabic 600 13.5px + Noto Sans Arabic 12px · vermilion 7px dot, 1px leader')}<div class="lb-demo"><div class="plate-img">${im('cataract-surgery', '', {})}${labels(ar.procs[0].labels, null, 'lb')}</div></div>${spec('PLATE CODE · IBM Plex Mono 500 · 11.5px · +0.08em · uppercase')}<p class="kick"><span class="code">PL.01 / 07</span><span>${ar.procs[0].groupName}</span></p></div>
    <div class="sp" dir="ltr" lang="en">${spec('BUTTONS · Public Sans 600 · 15px · 50px · radius 4 (instrument-like)')}<div class="cta"><a class="btn">${en.ui.book}</a><a class="link">${en.ui.about}${arrow(en)}</a></div>${spec('BUTTONS AR · Noto Sans Arabic 600 · 16px')}<div class="cta" dir="rtl" lang="ar"><a class="btn">${ar.ui.book}</a><a class="link">${ar.ui.about}${arrow(ar)}</a></div>${spec('CAPTION · Public Sans 400 · 13px / 1.55 + mono figure code')}<p class="t-cap"><span class="code">FIG. A</span> ${en.procs[0].alt}</p>${spec('NUMERICAL FACTS · Source Serif 4 600 · 44px / 1 · lining')}<dl class="facts"><div><dt>${en.since}</dt><dd>${en.facts.sinceLabel}</dd></div><div><dt>${en.stat.value}</dt><dd>${en.stat.label}<small>${en.stat.scope}</small></dd></div><div><dt>FRCS</dt><dd>${en.facts.frcsLabel}</dd></div></dl></div>
  </section>
</main>`;
  return doc({ d: en, fonts: FONTS, cls: 'b sheet-page', title: 'B · Type specimen', body });
}

function coloursPage() {
  const en = data('en');
  const names = { table: 'Table (page ground)', plate: 'Plate (= illustration ground)', ink: 'Ink navy', ink2: 'Ink 2', rule: 'Plate rule', mark: 'Vermilion mark (labels, dots)', ctaBg: 'CTA fill', ctaFg: 'CTA text', night: 'Night plate (= dark illustration ground)', nightInk: 'Night ink' };
  const sw = mode => {
    const p = PALETTE[mode];
    const pairs = [['ink', 'plate', 'Body on plate'], ['ink', 'table', 'Body on table'], ['ink2', 'plate', 'Secondary on plate'], ['mark', 'plate', 'Label mark on plate'], ['ctaFg', 'ctaBg', 'Primary button'], ['nightInk', 'night', 'Night plate text']];
    return `<section class="sw-sec" style="${vars(p)}background:${p.table};color:${p.ink}"><h2>${mode === 'light' ? 'Light' : 'Dark'}</h2>
      <div class="sw-row">${Object.entries(p).map(([k, v]) => `<div class="sw"><span style="background:${v}"></span><b>${names[k]}</b><code>${v}</code></div>`).join('')}</div>
      <div class="pairs">${pairs.map(([f, b, n]) => `<div class="pair" data-fg="${p[f]}" data-bg="${p[b]}" style="background:${p[b]};color:${p[f]}"><span class="pair-s">Aa أبجد</span><span class="pair-n">${n}</span><span class="ratio"></span></div>`).join('')}</div></section>`;
  };
  return doc({ d: en, fonts: FONTS, cls: 'b sheet-page', title: 'B · Colour', body: `<main class="sheet"><header class="sheet-head"><p class="kick"><span class="code">DIRECTION B</span><span>Interactive Anatomical Atlas</span></p><h1 class="sheet-t">Colour &amp; surface</h1><p class="sheet-sub">Plates sit on a darker “table”; plate and night grounds equal the light and dark illustration renders. One vermilion mark is reserved for anatomical labels. Ratios computed live (WCAG 2.x).</p></header>${sw('light')}${sw('dark')}</main>${contrastScript}` });
}

export function build() {
  write('b', 'home-ar.html', homePage('ar'));
  write('b', 'home-en.html', homePage('en'));
  write('b', 'procedure-ar.html', procPage('ar'));
  write('b', 'procedure-en.html', procPage('en'));
  write('b', 'type.html', typePage());
  write('b', 'colours.html', coloursPage());
  write('b', 'nav.html', navBoard({ d: data('en'), title: 'B · Navigation', fonts: FONTS, css: 'style.css', note: `<h2>Navigation — B</h2><p>Navigation is image-led. “Procedures” opens a plate index: seven illustration thumbnails with plate codes. On the homepage the same index runs under the hero plate. On mobile the menu opens on the plate grid first (2 columns, all 7 visible), then the page links, then booking.</p>` }));
  fs.writeFileSync(`${OUT}/b/style.css`, tokens + fs.readFileSync(new URL('./b.css', import.meta.url), 'utf8') + boardCss);
}
