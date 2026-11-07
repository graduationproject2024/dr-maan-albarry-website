// Direction C — Modern Patient Experience ("Care, clearly")
import fs from 'node:fs';
import { data, esc, illus, IMG } from './data.mjs';
import { write, doc, labels, cropImg, navBoard, boardCss, contrastScript, OUT, pins } from './common.mjs';

const FONTS = 'family=Alexandria:wght@400;500;600;700&family=Readex+Pro:wght@300;400;500;600&family=Manrope:wght@400;500;600;700;800';

export const PALETTE = {
  light: { bg: '#FFFFFF', mist: '#EEF4F3', line: '#DCE6E4', ink: '#0F2422', ink2: '#4A5D5A', teal: '#0B6E72', onTeal: '#FFFFFF', tint: '#E2F0EE', sand: '#F3EEE7', note: '#7A4F00', noteBg: '#FFF3D9' },
  dark: { bg: '#0D1414', mist: '#121C1C', line: '#243231', ink: '#E6EFEE', ink2: '#A1B2AF', teal: '#5CC2C3', onTeal: '#062021', tint: '#173032', sand: '#181A1E', note: '#F3C46B', noteBg: '#2A2212' }
};
const vars = p => Object.entries(p).map(([k, v]) => `--${k.replace(/[A-Z0-9]/g, m => '-' + m.toLowerCase())}:${v};`).join('');
const tokens = `:root{${vars(PALETTE.light)}color-scheme:light}
:root[data-theme="dark"]{${vars(PALETTE.dark)}color-scheme:dark}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${vars(PALETTE.dark)}color-scheme:dark}}
`;
const P = {
  cal: '<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  phone: '<path d="M6.5 3.5h3l1.5 4-2 1.3a11 11 0 0 0 6.2 6.2L16.5 13l4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z"/>',
  chat: '<path d="M4 19.5l1.3-3.8A8 8 0 1 1 8.5 19z"/><path d="M9 10.5h6M9 13.5h4"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  pin: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
  lens: '<circle cx="12" cy="12" r="8.5"/><path d="M5 9.5c4.5 2 9.5 2 14 0M5 14.5c4.5-2 9.5-2 14 0"/>',
  user: '<circle cx="12" cy="8.5" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.4"/>'
};
const ic = (n, s = 20) => `<svg class="ic" viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${P[n]}</svg>`;
const chev = d => `<svg class="chev" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="${d.dir === 'rtl' ? 'M12 5l-5 5 5 5' : 'M8 5l5 5-5 5'}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const im = (slug, alt = '', small = true) => `<img src="${illus(slug, { small })}" data-light="${illus(slug, { small })}" data-dark="${illus(slug, { dark: true, small })}" alt="${esc(alt)}" width="1600" height="1000">`;

function header(d, { current = '' } = {}) {
  const groups = d.groups.map(g => `<div class="mg-col"><p class="mg-k">${g.name}</p>${d.procs.filter(p => p.group === g.id).map(p => `<a href="#" class="mg-row"><span class="mg-th">${im(p.slug)}</span><span>${p.name}</span></a>`).join('')}</div>`).join('');
  return `
<header class="hdr">
  <a class="mark" href="#"><span class="mark-badge" aria-hidden="true">${ic('lens', 20)}</span><span><span class="mark-name">${d.shortName}</span><span class="mark-sub">${d.kicker}</span></span></a>
  <nav class="hdr-nav" aria-label="${d.tr('التنقل الرئيسي', 'Main navigation')}">${d.nav.map(n => `<a href="#" ${n.key === current ? 'aria-current="page"' : ''} ${n.key === 'procedures' ? 'class="has-menu"' : ''}>${n.label}</a>`).join('')}</nav>
  <div class="hdr-act">
    <a class="lang" href="#">${d.ui.langOther}</a>
    <a class="hdr-tel" href="#">${ic('phone', 18)}<bdi dir="ltr">${d.clinicLine}</bdi></a>
    <a class="btn btn-sm" href="#">${ic('cal', 18)}${d.ui.bookShort}</a>
    <button class="menu-btn" type="button" aria-label="${d.ui.menu}" aria-expanded="false">${ic('grid', 22)}</button>
  </div>
  <div class="mega" aria-hidden="true"><div class="mega-in">${groups}
    <div class="mg-help"><p class="mg-k">${d.ui.notSure}</p><p class="mg-h">${d.ui.startExam}</p><p class="mg-t">${d.ui.notSureText}</p><a class="btn btn-sm" href="#">${d.ui.bookExam}</a></div>
  </div></div>
</header>
<div class="sheet-scrim"></div>
<div class="msheet" aria-label="${d.tr('قائمة الموقع', 'Site menu')}">
  <span class="grab" aria-hidden="true"></span>
  <div class="ms-actions">
    <a href="#">${ic('cal', 22)}<span>${d.ui.onlineBooking}</span></a>
    <a href="#">${ic('phone', 22)}<span>${d.ui.clinicLineLabel}</span></a>
    <a href="#">${ic('chat', 22)}<span>${d.ui.whatsapp}</span></a>
  </div>
  <p class="ms-k">${d.ui.procedures}</p>
  <ul class="ms-procs">${d.procs.map(p => `<li><a href="#"><span class="mg-th">${im(p.slug)}</span><span>${p.name}</span>${chev(d)}</a></li>`).join('')}</ul>
  <p class="ms-k">${d.ui.contents}</p>
  <ul class="ms-links">${d.nav.filter(n => n.key !== 'procedures').map(n => `<li><a href="#">${n.label}${chev(d)}</a></li>`).join('')}</ul>
</div>`;
}

function hero(d) {
  const finderChips = d.procs.map(p => `<a href="#" class="fchip" data-group="${p.group}"><span class="fchip-th">${im(p.slug)}</span><span>${p.name}</span></a>`).join('');
  return `
<section class="hero" aria-labelledby="h1">
  <div class="hero-in">
    <div class="hero-text">
      <p class="pill">${ic('pin', 16)}<span>${d.kicker} · ${d.city}</span></p>
      <h1 id="h1">${d.name}</h1>
      <p class="hero-title">${d.title}</p>
      <p class="hero-intro">${d.intro}</p>
      <div class="cta"><a class="btn" href="#">${ic('cal', 20)}${d.ui.book}</a><a class="btn btn-soft" href="#">${d.ui.about}${chev(d)}</a></div>
    </div>
    <aside class="dcard" aria-label="${d.shortName}">
      <div class="dc-ph"><img src="${IMG}dr-maan-portrait.png" width="295" height="225" alt="${d.tr('صورة د. معن بن عبدالله البري', 'Portrait of Dr. Maan bin Abdullah Al Barry')}"></div>
      <div class="dc-body">
        <p class="dc-n">${d.shortName}</p>
        <p class="dc-r">${d.chief}</p>
        <ul class="dc-chips">${d.quals.map(q => `<li><bdi dir="ltr">${q.short}</bdi></li>`).join('')}<li>${d.rank}</li></ul>
        <p class="dc-h">${ic('clock', 18)}<span><b>${d.ui.hoursLabel}</b>${d.hours}</span></p>
      </div>
    </aside>
  </div>
  <div class="finder" role="search">
    <div class="f-main">
      <div class="f-head"><p class="f-k">${d.ui.startNeed}</p>
        <div class="seg" role="group" aria-label="${d.tr('تصفية حسب المجموعة', 'Filter by group')}"><button aria-pressed="true">${d.ui.allProcs}</button>${d.groups.map(g => `<button aria-pressed="false">${g.name}</button>`).join('')}</div>
      </div>
      <div class="f-chips">${finderChips}</div>
    </div>
    <div class="f-book">
      <p class="f-k">${d.tr('طرق الحجز', 'Ways to book')}</p>
      <a href="#" class="fb-row fb-main">${ic('cal', 20)}<span><b>${d.ui.onlineBooking}</b><small>ob.magrabi.com.sa</small></span>${chev(d)}</a>
      <a href="#" class="fb-row">${ic('chat', 20)}<span><b>${d.ui.clinicLineLabel} · ${d.ui.whatsapp}</b><small><bdi dir="ltr">${d.clinicLine}</bdi></small></span>${chev(d)}</a>
      <a href="#" class="fb-row">${ic('phone', 20)}<span><b>${d.ui.callCenterLabel}</b><small><bdi dir="ltr">${d.callCenter}</bdi> · <bdi dir="ltr">${d.callShort}</bdi></small></span>${chev(d)}</a>
    </div>
  </div>
  <nav class="paths" aria-label="${d.ui.startNeed}">
    <p class="f-k">${d.ui.startNeed}</p>
    ${[['procedures', 'grid'], ['lens-lab', 'lens'], ['about', 'user'], ['clinic', 'cal']].map(([k, i]) => `<a href="#">${ic(i, 22)}<span>${d.nav.find(n => n.key === k).label}</span></a>`).join('')}
  </nav>
</section>
<div class="mbar" aria-label="${d.ui.bookShort}"><a href="#" class="mb-main">${ic('cal', 20)}${d.ui.bookShort}</a><a href="#" aria-label="${d.ui.clinicLineLabel}">${ic('phone', 20)}</a><a href="#" aria-label="${d.ui.whatsapp}">${ic('chat', 20)}</a></div>`;
}

function card(d, p, cls) {
  return `<article class="card ${cls}" data-group="${p.group}">
    <a class="c-media" href="#">${im(p.slug, p.alt, cls !== 'c-lead')}${p.simulator ? `<span class="badge">${ic('cube', 16)}3D</span>` : ''}</a>
    <div class="c-body">
      <p class="chip">${p.groupName}</p>
      <h3><a href="#">${p.name}</a></h3>
      <p class="c-sum">${p.summary}</p>
      <div class="c-foot"><a href="#" class="c-link">${d.ui.readGuide}<span class="sr">: ${p.name}</span></a><span class="c-go" aria-hidden="true">${chev(d)}</span></div>
      ${p.simulator ? `<a href="#" class="c-3d">${ic('cube', 18)}${d.ui.watch3d}</a>` : ''}
    </div>
  </article>`;
}

function gallery(d) {
  const cls = ['c-lead', '', '', '', '', 'c-row', 'c-row'];
  return `
<section class="procs" id="procedures" aria-labelledby="pt">
  <header class="p-head">
    <div><p class="eyebrow">${d.ui.procsKicker}</p><h2 id="pt">${d.ui.procsTitle}</h2><p class="p-lede">${d.ui.sevenLede}</p></div>
    <div class="seg" role="group" aria-label="${d.tr('تصفية حسب المجموعة', 'Filter by group')}"><button aria-pressed="true">${d.ui.allProcs}</button>${d.groups.map(g => `<button aria-pressed="false">${g.name}</button>`).join('')}</div>
  </header>
  <div class="bento">
    ${d.procs.map((p, i) => card(d, p, cls[i])).join('')}
    <aside class="card c-help"><p class="chip chip-inv">${d.ui.notSure}</p><h3>${d.ui.startExam}</h3><p class="c-sum">${d.ui.notSureText}</p><a class="btn btn-inv" href="#">${ic('cal', 18)}${d.ui.bookExam}</a></aside>
  </div>
</section>`;
}

function homePage(lang) {
  const d = data(lang);
  return doc({ d, fonts: FONTS, cls: 'c', title: `C · Patient · ${lang.toUpperCase()}`, body: `${header(d)}<main>${hero(d)}${gallery(d)}</main>` });
}

const CROP = { x: 24, y: 6, w: 52 };
function procPage(lang) {
  const d = data(lang);
  const p = d.procs[0];
  const body = `${header(d, { current: 'procedures' })}
<main class="proc">
  <header class="ph">
    <nav class="crumbs" aria-label="${d.tr('مسار التنقل', 'Breadcrumb')}"><a href="#">${d.ui.home}</a>${chev(d)}<a href="#">${d.ui.procedures}</a>${chev(d)}<span aria-current="page">${p.name}</span></nav>
    <div class="ph-grid">
      <div class="ph-text">
        <p class="chip">${p.groupName}</p>
        <h1>${p.name}</h1>
        <p class="ph-intro">${p.intro}</p>
        <p class="note">${ic('info', 18)}<span>${d.ui.review}</span></p>
        <div class="cta"><a class="btn" href="#">${ic('cal', 20)}${d.ui.bookProc}</a><a class="btn btn-soft" href="#">${ic('chat', 20)}${d.ui.askWhatsapp}</a></div>
        <nav class="jump" aria-label="${d.ui.onThisPage}"><p class="f-k">${d.ui.onThisPage}</p><div>${d.sections.slice(0, 6).map(s => `<a href="#">${s.label}</a>`).join('')}<a href="#" class="j3d">${ic('cube', 16)}${d.ui.watch3d}</a></div></nav>
        <details class="jump-m"><summary>${d.ui.onThisPage}<span>${d.sections.length}</span></summary></details>
      </div>
      <figure class="ph-media">
        <div class="pm-well"><div class="pm-img">${im(p.slug, p.alt, false)}${pins(p.labels, 'hp')}
          <div class="tip" style="--x:${p.labels[0].x}%;--y:${p.labels[0].y}%"><b>${p.labels[0].t}</b><span>${p.labels[0].d}</span></div></div></div>
        <figcaption class="pm-legend">${p.labels.map((l, i) => `<button ${i === 0 ? 'aria-pressed="true"' : 'aria-pressed="false"'}><b><bdi>${i + 1}</bdi></b>${l.t}</button>`).join('')}</figcaption>
      </figure>
    </div>
  </header>
  <section class="detail">
    <figure class="zoom">
      <div class="z-win">${cropImg(illus(p.slug), p.alt, CROP)}${labels(p.labels.map((l, i) => ({ ...l, k: i + 1 })), CROP, 'lb').replace(/<bdi>0(\d)<\/bdi>/g, '<bdi>$1</bdi>')}<span class="z-badge">${ic('lens', 16)}×<bdi>${(100 / CROP.w).toFixed(1)}</bdi></span></div>
      <figcaption><b>${d.tr('تفصيل', 'Close-up')}</b> · ${p.parts[1][0]} — ${p.parts[1][1]}. ${p.parts[2][0]} — ${p.parts[2][1]}.</figcaption>
    </figure>
    <div class="steps">
      <p class="eyebrow">${d.sections[3].label}</p>
      <ol>${p.steps.map((s, i) => `<li><span class="st-n"><bdi>${i + 1}</bdi></span><p>${s}</p></li>`).join('')}</ol>
    </div>
  </section>
</main>`;
  return doc({ d, fonts: FONTS, cls: 'c', title: `C · Procedure · ${lang.toUpperCase()}`, body });
}

function typePage() {
  const ar = data('ar'), en = data('en');
  const spec = s => `<p class="spec">${s}</p>`;
  const body = `
<main class="sheet">
  <header class="sheet-head"><p class="eyebrow">Direction C · Modern Patient Experience</p><h1 class="sheet-t">Type specimen</h1><p class="sheet-sub">Alexandria + Readex Pro (Arabic) · Manrope (English display and body)</p></header>
  <section class="sp-grid">
    <div class="sp" dir="rtl" lang="ar">${spec('AR DISPLAY · Alexandria 600 · 56px / 1.45 · −0.005em')}<p class="t-ar-d">${ar.name}</p></div>
    <div class="sp" dir="ltr" lang="en">${spec('EN DISPLAY · Manrope 800 · 58px / 1.06 · −0.03em')}<p class="t-en-d">${en.name}</p></div>
    <div class="sp" dir="rtl" lang="ar">${spec('AR H2 · Alexandria 600 · 40px / 1.5')}<p class="t-ar-h2">${ar.ui.procsTitle}</p>${spec('AR CARD TITLE · Alexandria 600 · 20px / 1.6')}<p class="t-ar-h3">${ar.procs[0].name}</p></div>
    <div class="sp" dir="ltr" lang="en">${spec('EN H2 · Manrope 800 · 42px / 1.1 · −0.025em')}<p class="t-en-h2">${en.ui.procsTitle}</p>${spec('EN CARD TITLE · Manrope 700 · 20px / 1.3 · −0.01em')}<p class="t-en-h3">${en.procs[0].name}</p></div>
    <div class="sp" dir="rtl" lang="ar">${spec('AR BODY · Readex Pro 400 · 17px / 1.85 · measure 60ch')}<p class="t-ar-b">${ar.procs[0].intro}</p></div>
    <div class="sp" dir="ltr" lang="en">${spec('EN BODY · Manrope 500 · 16.5px / 1.65 · measure 64ch')}<p class="t-en-b">${en.procs[0].intro}</p></div>
    <div class="sp" dir="rtl" lang="ar">${spec('BUTTONS · Readex Pro 500 · 16px · 52px pill · 20px icon')}<div class="cta"><a class="btn">${ic('cal', 20)}${ar.ui.book}</a><a class="btn btn-soft">${ar.ui.about}${chev(ar)}</a></div>${spec('MEDICAL LABEL · Readex Pro 500 13.5px · numbered hotspot 28px teal')}<div class="lbl-demo">${ar.procs[0].labels.map((l, i) => `<span><b>${i + 1}</b>${l.t}</span>`).join('')}</div>${spec('CHIP / CAPTION · Readex Pro 500 12.5px / 400 13.5px')}<p class="chip">${ar.procs[0].groupName}</p><p class="t-cap">${ar.procs[0].alt}</p></div>
    <div class="sp" dir="ltr" lang="en">${spec('BUTTONS · Manrope 700 · 15px · 52px pill')}<div class="cta"><a class="btn">${ic('cal', 20)}${en.ui.book}</a><a class="btn btn-soft">${en.ui.about}${chev(en)}</a></div>${spec('NUMERICAL FACTS · Manrope 800 · 40px / 1 · tabular')}<dl class="facts"><div><dt>${en.since}</dt><dd>${en.facts.sinceLabel}</dd></div><div><dt>${en.stat.value}</dt><dd>${en.stat.label}<small>${en.stat.scope}</small></dd></div><div><dt>FRCS</dt><dd>${en.facts.frcsLabel}</dd></div></dl>${spec('CAPTION · Manrope 500 · 13px / 1.55')}<p class="t-cap">${en.procs[0].alt}</p></div>
  </section>
</main>`;
  return doc({ d: en, fonts: FONTS, cls: 'c sheet-page', title: 'C · Type specimen', body });
}

function coloursPage() {
  const en = data('en');
  const names = { bg: 'Base', mist: 'Mist (hero / bands)', line: 'Line', ink: 'Ink', ink2: 'Ink 2', teal: 'Lagoon (primary)', onTeal: 'Text on primary', tint: 'Tint (chips)', sand: 'Media well (= illustration ground)', note: 'Review note text', noteBg: 'Review note ground' };
  const sw = mode => {
    const p = PALETTE[mode];
    const pairs = [['ink', 'bg', 'Body'], ['ink2', 'bg', 'Secondary'], ['teal', 'bg', 'Links / primary on base'], ['onTeal', 'teal', 'Primary button'], ['ink2', 'mist', 'Secondary on mist'], ['teal', 'tint', 'Chip text'], ['note', 'noteBg', 'Review note'], ['ink', 'sand', 'Text on media well']];
    return `<section class="sw-sec" style="${vars(p)}background:${p.bg};color:${p.ink}"><h2>${mode === 'light' ? 'Light' : 'Dark'}</h2>
      <div class="sw-row">${Object.entries(p).map(([k, v]) => `<div class="sw"><span style="background:${v}"></span><b>${names[k]}</b><code>${v}</code></div>`).join('')}</div>
      <div class="pairs">${pairs.map(([f, b, n]) => `<div class="pair" data-fg="${p[f]}" data-bg="${p[b]}" style="background:${p[b]};color:${p[f]}"><span class="pair-s">Aa أبجد</span><span class="pair-n">${n}</span><span class="ratio"></span></div>`).join('')}</div></section>`;
  };
  return doc({ d: en, fonts: FONTS, cls: 'c sheet-page', title: 'C · Colour', body: `<main class="sheet"><header class="sheet-head"><p class="eyebrow">Direction C · Modern Patient Experience</p><h1 class="sheet-t">Colour &amp; surface</h1><p class="sheet-sub">White base, a cool mist for the hero and bands, one lagoon primary for every action; media wells match the illustration ground. Ratios computed live (WCAG 2.x).</p></header>${sw('light')}${sw('dark')}</main>${contrastScript}` });
}

export function build() {
  write('c', 'home-ar.html', homePage('ar'));
  write('c', 'home-en.html', homePage('en'));
  write('c', 'procedure-ar.html', procPage('ar'));
  write('c', 'procedure-en.html', procPage('en'));
  write('c', 'type.html', typePage());
  write('c', 'colours.html', coloursPage());
  write('c', 'nav.html', navBoard({ d: data('en'), title: 'C · Navigation', fonts: FONTS, css: 'style.css', note: `<h2>Navigation — C</h2><p>Task-first chrome: the clinic line and a filled booking button sit in the header. “Procedures” opens a grouped menu (3 groups with thumbnails) plus a “Not sure? Start with an examination” card. On mobile a persistent bottom bar holds Book · Call · WhatsApp, and the menu is a bottom sheet: three booking actions first, then the seven procedures with thumbnails, then the pages.</p>` }));
  fs.writeFileSync(`${OUT}/c/style.css`, tokens + fs.readFileSync(new URL('./c.css', import.meta.url), 'utf8') + boardCss);
}
