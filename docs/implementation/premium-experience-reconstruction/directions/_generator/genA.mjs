// Direction A — Premium Medical Editorial ("The Monograph")
import fs from 'node:fs';
import { data, esc, illus, IMG } from './data.mjs';
import { write, doc, labels, cropImg, navBoard, boardCss, contrastScript, OUT } from './common.mjs';

const FONTS = 'family=Noto+Naskh+Arabic:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..500&family=IBM+Plex+Sans:wght@400;500;600';

export const PALETTE = {
  light: { paper: '#F3EEE7', paper2: '#ECE5DA', ink: '#1B1915', ink2: '#544C42', rule: '#D6CCBE', accent: '#8A4B22', ctaBg: '#1B1915', ctaFg: '#F3EEE7', field: '#D6CDBF', fieldX: '#F0E6D7' },
  dark: { paper: '#181A1E', paper2: '#1F2227', ink: '#EFE9E0', ink2: '#ADA59A', rule: '#353840', accent: '#D99C6C', ctaBg: '#EFE9E0', ctaFg: '#181A1E', field: '#C9C0B2', fieldX: '#E2D8C8' }
};
const vars = p => Object.entries(p).map(([k, v]) => `--${k.replace(/[A-Z0-9]/g, m => '-' + m.toLowerCase())}:${v};`).join('');
const tokens = `:root{${vars(PALETTE.light)}color-scheme:light}
:root[data-theme="dark"]{${vars(PALETTE.dark)}color-scheme:dark}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${vars(PALETTE.dark)}color-scheme:dark}}
`;

const arrow = d => `<svg class="arr" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="${d.dir === 'rtl' ? 'M16 10H4m5-5-5 5 5 5' : 'M4 10h12m-5-5 5 5-5 5'}" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;

function header(d, { current = '' } = {}) {
  return `
<header class="hdr">
  <a class="mark" href="#"><span class="mark-name">${d.shortName}</span><span class="mark-sub">${d.kicker}</span></a>
  <nav class="hdr-nav" aria-label="${d.tr('التنقل الرئيسي', 'Main navigation')}">
    ${d.nav.map((n, i) => `<a href="#" ${n.key === current ? 'aria-current="page"' : ''} ${n.key === 'procedures' ? 'class="has-menu"' : ''}><span class="nn">${String(i + 1).padStart(2, '0')}</span>${n.label}</a>`).join('')}
  </nav>
  <div class="hdr-act">
    <a class="lang" href="#" lang="${d.lang === 'ar' ? 'en' : 'ar'}">${d.ui.langOther}</a>
    <a class="btn btn-ink btn-sm" href="#">${d.ui.bookShort}</a>
    <button class="menu-btn" type="button" aria-label="${d.ui.menu}" aria-expanded="false"><span></span><span></span></button>
  </div>
  <div class="mega" aria-hidden="true">
    <div class="mega-in">
      <p class="mega-k">${d.ui.procsKicker}</p>
      <ol class="mega-list">${d.procs.map(p => `<li><a href="#"><span class="nn">${p.n}</span><span>${p.name}</span></a></li>`).join('')}</ol>
      <figure class="mega-fig"><img src="${illus('cataract-surgery', { small: true })}" data-light="${illus('cataract-surgery', { small: true })}" data-dark="${illus('cataract-surgery', { dark: true, small: true })}" alt=""><figcaption>01 — ${d.procs[0].name}</figcaption></figure>
    </div>
  </div>
</header>
<div class="mnav" id="mnav" aria-label="${d.tr('قائمة الموقع', 'Site menu')}">
  <ol class="mnav-list">
    <li><a href="#"><span class="nn">00</span>${d.ui.home}</a></li>
    ${d.nav.map((n, i) => `<li><a href="#"><span class="nn">${String(i + 1).padStart(2, '0')}</span>${n.label}</a></li>`).join('')}
  </ol>
  <p class="mnav-k">${d.ui.procedures}</p>
  <ul class="mnav-procs">${d.procs.map(p => `<li><a href="#">${p.name}</a></li>`).join('')}</ul>
  <a class="btn btn-ink btn-block" href="#">${d.ui.book}</a>
  <p class="mnav-foot">${d.ui.clinicLineLabel} <bdi dir="ltr">${d.clinicLine}</bdi> · ${d.ui.whatsapp}</p>
</div>`;
}

function hero(d) {
  return `
<section class="hero" aria-labelledby="h1">
  <div class="hero-text">
    <p class="eyebrow"><span class="chap">01</span><span>${d.kicker}</span><span class="sep" aria-hidden="true"></span><span>${d.city}</span></p>
    <h1 id="h1">${d.name}</h1>
    <p class="hero-title">${d.title}</p>
    <p class="hero-intro">${d.intro}</p>
    <div class="cta">
      <a class="btn btn-ink" href="#">${d.ui.book}</a>
      <a class="link-quiet" href="#">${d.ui.about}${arrow(d)}</a>
    </div>
  </div>
  <figure class="portrait">
    <div class="pf"><div class="pf-img"><img src="${IMG}dr-maan-portrait.png" width="295" height="225" alt="${d.tr('صورة د. معن بن عبدالله البري', 'Portrait of Dr. Maan bin Abdullah Al Barry')}"></div></div>
    <figcaption><span class="cap-n">${d.shortName}</span><span class="cap-r">${d.chief}</span></figcaption>
  </figure>
  <dl class="ledger">
    <div><dt><bdi>${d.since}</bdi></dt><dd>${d.facts.sinceLabel}<small>${d.facts.yearsSub}</small></dd></div>
    <div><dt><bdi dir="ltr">${d.stat.value}</bdi></dt><dd>${d.stat.label}<small>${d.stat.scope}</small></dd></div>
    <div><dt><bdi dir="ltr">FRCS</bdi></dt><dd>${d.facts.frcsLabel}<small>${d.facts.frcsSub}</small></dd></div>
    <div class="ledger-rank"><dt class="dt-sm">${d.rank.split(' – ')[0]}</dt><dd>${d.rank.split(' – ')[1]}</dd></div>
  </dl>
</section>`;
}

function item(d, p, size) {
  return `<article class="it it-${size}">
    <a class="it-fig" href="#">${`<img src="${illus(p.slug, { small: size !== 'lg' })}" data-light="${illus(p.slug, { small: size !== 'lg' })}" data-dark="${illus(p.slug, { dark: true, small: size !== 'lg' })}" alt="${esc(p.alt)}" loading="eager">`}</a>
    <div class="it-meta"><span class="it-n">${p.n}</span><h3 class="it-name"><a href="#">${p.name}</a></h3></div>
    <p class="it-sum">${p.summary}</p>
    <a class="it-link" href="#">${d.ui.readGuide}<span class="sr">: ${p.name}</span>${arrow(d)}</a>
  </article>`;
}

function gallery(d) {
  const rows = d.groups.map(g => {
    const ps = d.procs.filter(p => p.group === g.id);
    const size = ps.length === 3 ? 'sm' : 'md';
    return `<div class="grow grow-${ps.length}">
      <div class="grow-head"><p class="grow-n"><bdi dir="ltr">${ps[0].n}–${ps[ps.length - 1].n}</bdi></p><h3 class="grow-t">${g.name}</h3></div>
      <div class="grow-items">${ps.map((p, i) => item(d, p, g.id === 'lens' && i === 0 ? 'lg' : size)).join('')}</div>
    </div>`;
  }).join('');
  return `
<section class="chapter" id="procedures" aria-labelledby="procs-t">
  <header class="chap-head">
    <p class="chap-num" aria-hidden="true">02</p>
    <div class="chap-titles"><p class="chap-k">${d.ui.procsKicker}</p><h2 id="procs-t">${d.ui.procsTitle}</h2></div>
    <div class="chap-lede"><p>${d.ui.sevenLede}</p><a class="link-quiet" href="#">${d.ui.library}${arrow(d)}</a></div>
  </header>
  ${rows}
</section>`;
}

function homePage(lang) {
  const d = data(lang);
  return doc({ d, fonts: FONTS, cls: 'a', title: `A · Editorial · ${lang.toUpperCase()}`, body: `${header(d)}<main>${hero(d)}${gallery(d)}</main>` });
}

const CROP = { x: 24, y: 6, w: 52 };
function procPage(lang) {
  const d = data(lang);
  const p = d.procs[0];
  const crumbs = `<nav class="crumbs" aria-label="${d.tr('مسار التنقل', 'Breadcrumb')}"><a href="#">${d.ui.home}</a><span aria-hidden="true">/</span><a href="#">${d.ui.procedures}</a><span aria-hidden="true">/</span><span aria-current="page">${p.name}</span></nav>`;
  const body = `${header(d, { current: 'procedures' })}
<main class="proc">
  <header class="p-hero">
    ${crumbs}
    <div class="p-grid">
      <div class="p-text">
        <p class="eyebrow"><span class="chap">${p.n}</span><span>${p.groupName}</span></p>
        <h1>${p.name}</h1>
        <p class="p-intro">${p.intro}</p>
        <p class="review"><svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M10 6v5M10 13.5v.5" stroke="currentColor" stroke-width="1.6"/></svg><span>${d.ui.review}</span></p>
        <div class="cta"><a class="btn btn-ink" href="#">${d.ui.bookProc}</a><a class="link-quiet" href="#">${d.ui.askWhatsapp}${arrow(d)}</a></div>
      </div>
      <nav class="toc" aria-label="${d.ui.onThisPage}"><p class="toc-k">${d.ui.onThisPage}</p><ol>${d.sections.map((s, i) => `<li><a href="#"><span class="nn">${String(i + 1).padStart(2, '0')}</span>${s.label}</a></li>`).join('')}<li class="toc-3d"><a href="#"><span class="nn">3D</span>${d.ui.watch3d}</a></li></ol></nav>
      <details class="toc-m"><summary><span>${d.ui.onThisPage}</span><span class="nn">01–08</span></summary></details>
    </div>
  </header>
  <figure class="plate">
    <div class="plate-img"><img src="${illus(p.slug)}" data-light="${illus(p.slug)}" data-dark="${illus(p.slug, { dark: true })}" alt="${esc(p.alt)}" width="1600" height="1000">${labels(p.labels, null, 'lbl')}</div>
    <figcaption><span class="fig-n">${d.tr('شكل ١', 'Fig. 1')}</span>${p.alt}</figcaption>
  </figure>
  <section class="closeup" aria-labelledby="anat-t">
    <figure class="cu-fig">
      <div class="cu-win">${cropImg(illus(p.slug), p.alt, CROP)}${labels(p.labels, CROP, 'lbl')}</div>
      <figcaption><span class="fig-n">${d.tr('شكل ٢ — تفصيل', 'Fig. 2 — detail')}</span><span class="cu-key"><span><b>02</b>${p.parts[1][0]} — ${p.parts[1][1]}</span><span><b>03</b>${p.parts[2][0]} — ${p.parts[2][1]}</span></span></figcaption>
    </figure>
    <div class="cu-text">
      <p class="chap-k"><span class="chap">01</span> ${d.sections[0].label}</p>
      <h2 id="anat-t">${d.sections[0].label}</h2>
      <dl class="parts">${p.parts.map((x, i) => `<div><dt><span class="nn">${String(i + 1).padStart(2, '0')}</span>${x[0]}</dt><dd>${x[1]}</dd></div>`).join('')}</dl>
    </div>
  </section>
</main>`;
  return doc({ d, fonts: FONTS, cls: 'a', title: `A · Procedure · ${lang.toUpperCase()}`, body });
}

function typePage() {
  const ar = data('ar'), en = data('en');
  const spec = (s) => `<p class="spec">${s}</p>`;
  const body = `
<main class="sheet">
  <header class="sheet-head"><p class="chap-k">Direction A · Premium Medical Editorial</p><h1 class="sheet-t">Type specimen</h1><p class="sheet-sub">Noto Naskh Arabic + IBM Plex Sans Arabic · Newsreader + IBM Plex Sans</p></header>
  <section class="sp-grid">
    <div class="sp" dir="rtl" lang="ar">${spec('AR DISPLAY · Noto Naskh Arabic 600 · 88px / 1.3 · tracking 0')}<p class="t-ar-d">${ar.name}</p></div>
    <div class="sp" dir="ltr" lang="en">${spec('EN DISPLAY · Newsreader 400 (opsz 72) · 84px / 1.04 · −0.022em')}<p class="t-en-d">${en.name}</p></div>
    <div class="sp" dir="rtl" lang="ar">${spec('AR H2 · Noto Naskh Arabic 600 · 52px / 1.35')}<p class="t-ar-h2">${ar.ui.procsTitle}</p>${spec('AR H3 · Noto Naskh Arabic 600 · 28px / 1.45')}<p class="t-ar-h3">${ar.procs[0].name}</p></div>
    <div class="sp" dir="ltr" lang="en">${spec('EN H2 · Newsreader 400 · 52px / 1.08 · −0.018em')}<p class="t-en-h2">${en.ui.procsTitle}</p>${spec('EN H3 · Newsreader 500 · 28px / 1.2 · −0.01em')}<p class="t-en-h3">${en.procs[0].name}</p></div>
    <div class="sp" dir="rtl" lang="ar">${spec('AR BODY · IBM Plex Sans Arabic 400 · 18px / 1.9 · measure 62ch')}<p class="t-ar-b">${ar.procs[0].intro}</p>${spec('AR LEAD · IBM Plex Sans Arabic 400 · 20px / 1.85')}<p class="t-ar-lead">${ar.title}</p></div>
    <div class="sp" dir="ltr" lang="en">${spec('EN BODY · IBM Plex Sans 400 · 17px / 1.65 · measure 66ch')}<p class="t-en-b">${en.procs[0].intro}</p>${spec('EN LEAD · IBM Plex Sans 400 · 20px / 1.55')}<p class="t-en-lead">${en.title}</p></div>
    <div class="sp" dir="rtl" lang="ar">${spec('BUTTONS · Plex Sans Arabic 600 · 16px · pill 52px · link 500 underline offset 6px')}<div class="cta"><a class="btn btn-ink">${ar.ui.book}</a><a class="link-quiet">${ar.ui.about}${arrow(ar)}</a></div>${spec('CAPTION · Plex Sans Arabic 400 · 14px / 1.7 · ink-2')}<p class="t-cap"><span class="fig-n">شكل ١</span>${ar.procs[0].alt}</p></div>
    <div class="sp" dir="ltr" lang="en">${spec('BUTTONS · IBM Plex Sans 600 · 15px · +0.01em · pill 52px')}<div class="cta"><a class="btn btn-ink">${en.ui.book}</a><a class="link-quiet">${en.ui.about}${arrow(en)}</a></div>${spec('CAPTION · IBM Plex Sans 400 · 13.5px / 1.6')}<p class="t-cap"><span class="fig-n">Fig. 1</span>${en.procs[0].alt}</p></div>
    <div class="sp" dir="rtl" lang="ar">${spec('MEDICAL LABEL · Plex Sans Arabic 600 · 14px + 12.5px 400 description · 1px leader rule')}<div class="lbl-demo">${ar.procs[0].parts.slice(0, 3).map(x => `<p><b>${x[0]}</b> — ${x[1]}</p>`).join('')}</div>${spec('CHAPTER KICKER · Newsreader italic numerals 18px + Plex Sans Arabic 500 14px')}<p class="eyebrow"><span class="chap">02</span><span>${ar.ui.procsKicker}</span></p></div>
    <div class="sp" dir="ltr" lang="en">${spec('NUMERICAL FACTS · Newsreader 400 lining figures · 56px / 1 · −0.02em; label Plex Sans 14px')}<dl class="ledger ledger-demo"><div><dt>${en.since}</dt><dd>${en.facts.sinceLabel}<small>${en.facts.yearsSub}</small></dd></div><div><dt>${en.stat.value}</dt><dd>${en.stat.label}<small>${en.stat.scope}</small></dd></div><div><dt>FRCS</dt><dd>${en.facts.frcsLabel}</dd></div></dl></div>
  </section>
</main>`;
  return doc({ d: en, fonts: FONTS, cls: 'a sheet-page', title: 'A · Type specimen', body });
}

function coloursPage() {
  const en = data('en');
  const sw = (mode) => {
    const p = PALETTE[mode];
    const names = { paper: 'Paper (= illustration ground #F3EEE7)', paper2: 'Paper 2 (alt band)', ink: 'Ink', ink2: 'Ink 2 (secondary text)', rule: 'Hairline rule', accent: 'Oxide bronze (numerals, kickers)', ctaBg: 'CTA fill', ctaFg: 'CTA text', field: 'Portrait field', fieldX: 'Portrait multiply tint' };
    if (mode === 'dark') names.paper = 'Night paper (= dark illustration ground #181A1E)';
    const pairs = [['ink', 'paper', 'Body text'], ['ink2', 'paper', 'Secondary text'], ['accent', 'paper', 'Kicker / numerals'], ['ctaFg', 'ctaBg', 'Primary button'], ['ink', 'paper2', 'Text on alt band'], ['ink2', 'paper2', 'Secondary on alt band']];
    return `<section class="sw-sec sw-${mode}" style="${vars(p)}background:${p.paper};color:${p.ink}">
      <h2>${mode === 'light' ? 'Light' : 'Dark'} surfaces</h2>
      <div class="sw-row">${Object.entries(p).map(([k, v]) => `<div class="sw"><span style="background:${v}"></span><b>${names[k]}</b><code>${v}</code></div>`).join('')}</div>
      <div class="pairs">${pairs.map(([f, b, n]) => `<div class="pair" data-fg="${p[f]}" data-bg="${p[b]}" style="background:${p[b]};color:${p[f]}"><span class="pair-s">Aa أبجد</span><span class="pair-n">${n}</span><span class="ratio"></span></div>`).join('')}</div>
    </section>`;
  };
  return doc({ d: en, fonts: FONTS, cls: 'a sheet-page', title: 'A · Colour & surface', body: `<main class="sheet"><header class="sheet-head"><p class="chap-k">Direction A · Premium Medical Editorial</p><h1 class="sheet-t">Colour &amp; surface</h1><p class="sheet-sub">Two grounds matched to the illustration renders so plates sit edge-free; one accent used only for numerals and kickers. Ratios computed live (WCAG 2.x).</p></header>${sw('light')}${sw('dark')}</main>${contrastScript}` });
}

export function build() {
  write('a', 'home-ar.html', homePage('ar'));
  write('a', 'home-en.html', homePage('en'));
  write('a', 'procedure-ar.html', procPage('ar'));
  write('a', 'procedure-en.html', procPage('en'));
  write('a', 'type.html', typePage());
  write('a', 'colours.html', coloursPage());
  write('a', 'nav.html', navBoard({ d: data('en'), title: 'A · Navigation', fonts: FONTS, css: 'style.css', note: `<h2>Navigation — A</h2><p>Desktop: numbered text links (01–06) set like a table of contents, wordmark in Naskh, a single ink pill for booking, and a numbered procedure index that opens under “Procedures” with the cataract plate as preview. Mobile: a full-height editorial index (numbered rows 58px), the 7 procedures as a second list, booking as the last filled row; the language switch stays outside the menu.</p>` }));
  const css = tokens + fs.readFileSync(new URL('./a.css', import.meta.url), 'utf8') + boardCss;
  fs.writeFileSync(`${OUT}/a/style.css`, css);
}
