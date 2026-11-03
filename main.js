// ============================================================
// DR. MAAN AL BARRY — OFFICIAL SITE
// Phase 1 "premium personal-physician" experience.
// Design system:          docs/phase-1/DESIGN_SYSTEM.md
// Information architecture: docs/phase-1/INFORMATION_ARCHITECTURE.md
// Every doctor fact is read from doctor-data.js; every procedure from PROCEDURES;
// page copy and patient education from src/site/content.js.
// ============================================================

import { DOCTOR, FAQ, PROCEDURES, PROCEDURE_GROUPS, procedureBySlug, whatsappUrl, publishableTestimonials, yearsOfExperience, buildJsonLd, buildProcedureJsonLd, buildSectionJsonLd } from './doctor-data.js';
import { parseRoute, splitPath, pathFor, pageMeta, breadcrumbFor, sectionPage, SECTION_PAGES } from './site-routes.js';
import { GUIDES, FEATURED_GUIDES, QUESTIONNAIRE, questionnaireResult, VISIT, ASSESSMENTS, AREAS, WHY_IT_MATTERS, DISCLAIMER, RED_FLAGS, LENS_SUMMARY, LIGHT_PATH, SURGERY_STAGES } from './src/site/content.js';
import { createFeatureMount, hasFeature } from './src/feature-loaders.js';

// Pick the current-language value from an { ar, en } pair.
const L = (pair) => pair[currentLang];

// --- ROUTING -------------------------------------------------
// The site lives at a domain root or under a GitHub Pages subpath. index.html pins <base> to the
// site root before anything loads, so every relative URL in this file is relative to the root.
const SITE_URL = (typeof __SITE_URL__ !== 'undefined' ? __SITE_URL__ : 'https://drmaanalbarry.com').replace(/\/+$/, '');
const PROC_IMAGES = typeof __PROC_IMAGES__ !== 'undefined' ? __PROC_IMAGES__ : {};
const SITE_ROOT = (() => {
  const b = document.querySelector('base');
  return new URL(b ? b.href : splitPath(location.pathname).root, location.href);
})();
/** Site-root-relative path of an absolute URL, or null when it is outside this site. */
const relOf = href => {
  const u = new URL(href, SITE_ROOT);
  if (u.origin !== SITE_ROOT.origin || !u.pathname.startsWith(SITE_ROOT.pathname)) return null;
  return u.pathname.slice(SITE_ROOT.pathname.length);
};

let route = parseRoute(relOf(location.href) || '');

// --- APP STATE & LOCAL STORAGE ---
// Language comes from the URL. The bare Arabic root still honours a saved English choice
// (and moves to /en/), so a returning English reader lands on English.
let currentLang = route.lang;
(() => {
  let saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) { /* storage unavailable */ }
  if (route.page === 'home' && route.lang === 'ar' && relOf(location.href) === '' && saved === 'en') {
    route = { ...route, lang: 'en' };
    currentLang = 'en';
    history.replaceState(history.state, '', new URL(pathFor('en') + location.hash, SITE_ROOT));
  }
})();
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

// Theme: an explicit visitor choice ('light' | 'dark') is stored under localStorage 'theme'.
// With no saved choice the site follows the device (prefers-color-scheme), live.
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
let savedTheme = (() => {
  try { const t = localStorage.getItem('theme'); return t === 'dark' || t === 'light' ? t : null; } catch (e) { return null; }
})();
const resolvedTheme = () => savedTheme || (darkQuery.matches ? 'dark' : 'light');
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let currentQStep = 0;
let qAnswers = [];
let qCompleted = false;
let procFilter = 'all';

// Long-form procedure text is a separate lazy chunk: the homepage never downloads it.
let PROC = null;
const loadProcedureContent = () => PROC ? Promise.resolve(PROC) : import('./src/procedures/content.js').then(m => (PROC = m));

const tr = (ar, en) => (currentLang === 'ar' ? ar : en);
const isHome = () => route.page === 'home';

/** href of a page (relative to the site root). The Arabic home is './'. */
const pageHref = (lang = currentLang, slug = null, page = null) => pathFor(lang, slug, page) || './';
/** href of a section page in the current language. */
const P = key => pageHref(currentLang, null, key);
/** href of an anchor on the current page. */
const hereHref = id => `${pathFor(currentLang, route.slug, route.page)}#${id}`;

// --- ICONS: one inline SVG set (24px grid, 1.6 stroke, round joins). No emoji anywhere. ---
const IC = {
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
  phone: '<path d="M20.5 16.3v2.8a1.9 1.9 0 0 1-2.1 1.9A18.6 18.6 0 0 1 3 5.6 1.9 1.9 0 0 1 4.9 3.5h2.8a1.9 1.9 0 0 1 1.9 1.6c.1.9.4 1.8.7 2.6a1.9 1.9 0 0 1-.4 2l-1.2 1.2a15 15 0 0 0 5.4 5.4l1.2-1.2a1.9 1.9 0 0 1 2-.4c.8.3 1.7.6 2.6.7a1.9 1.9 0 0 1 1.6 1.9z"/>',
  pin: '<path d="M12 21s-7-6.1-7-11.4a7 7 0 0 1 14 0C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.6" r="2.4"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  arrow: '<path d="M4.5 12h15M13.5 6l6 6-6 6"/>',
  external: '<path d="M14 4.5h5.5V10M19.5 4.5 11 13M17.5 14v5.5h-13v-13H10"/>',
  menu: '<path d="M4 7.5h16M4 12h16M4 16.5h10"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="M10 8.6v6.8l5.6-3.4z" fill="currentColor" stroke="none"/>',
  shield: '<path d="M12 3 4.5 6v5.5c0 4.6 3.1 8 7.5 9.5 4.4-1.5 7.5-4.9 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
  alert: '<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.2v.1"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 7.8v.1"/>',
  draft: '<path d="M14.5 3.5H6.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8.5z"/><path d="M14.5 3.5v5h5M8.5 13h7M8.5 16.5h4.5"/>',
  cube: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
  book: '<path d="M4.5 5.5A2 2 0 0 1 6.5 3.5h13v15h-13a2 2 0 0 0-2 2z"/><path d="M4.5 20.5a2 2 0 0 1 2-2h13v2z"/>',
  lens: '<ellipse cx="12" cy="12" rx="5" ry="8.5"/><path d="M12 3.5v17M2.5 12h4.5M17 12h4.5"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>'
};
const icon = (name, size = 20) =>
  `<svg class="ic ic-${name}" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${IC[name]}</svg>`;

// Brand glyphs (filled) — Instagram, X, YouTube, WhatsApp.
const GLYPH = {
  instagram: '<path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/>',
  x: '<path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24H16.17l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25H8.08l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z"/>',
  youtube: '<path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.87.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/>',
  whatsapp: '<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3z"/>'
};
const glyph = (name, size = 18) =>
  `<svg class="ic ic-${name}" viewBox="0 0 24 24" width="${size}" height="${size}" fill="currentColor" aria-hidden="true" focusable="false">${GLYPH[name]}</svg>`;

const EXT = 'target="_blank" rel="noopener noreferrer"';
const D = DOCTOR;
const C = DOCTOR.contact;
const role = id => D.professional.roles.find(r => r.id === id);
const short = r => (currentLang === 'ar' ? (r.shortAr || r.ar) : (r.shortEn || r.en));
const STAT = D.credibility.statistics.find(s => s.id === 'cases-15000');
const groupOf = id => PROCEDURE_GROUPS.find(g => g.id === id);
const guideBy = id => GUIDES.find(g => g.id === id);

function getWhatsAppUrl(msg) {
  return whatsappUrl(msg || tr(
    'مرحباً، أود الاستفسار عن حجز موعد استشارة مع د. معن بن عبدالله البري في مستشفى مغربي المدينة المنورة.',
    'Hello, I would like to inquire about booking a consultation with Dr. Maan bin Abdullah Al Barry at Magrabi Madinah.'));
}

/** Source tag for a doctor fact ("as published by Magrabi Health" / "confirmed by Dr. Maan"). */
function sourceTag(src) {
  const label = {
    magrabi: tr('منشور لدى مغربي الصحية', 'Published by Magrabi Health'),
    taibah: tr('منشور لدى جامعة طيبة', 'Published by Taibah University'),
    doctor: tr('أكده د. معن', 'Confirmed by Dr. Maan'),
    owner: tr('من إدارة الموقع', 'Supplied by the site owner')
  }[src];
  return label ? `<span class="src-tag">${label}</span>` : '';
}

// Shared section head: numbered kicker + title + optional lede.
const sectionHead = (num, kicker, title, lede = '', { cls = '', id = '' } = {}) => `
      <header class="section-head ${cls} fade-in">
        <p class="kicker">${num ? `<span class="kicker-num" aria-hidden="true">${num}</span>` : ''}<span>${kicker}</span></p>
        <h2${id ? ` id="${id}"` : ''}>${title}</h2>
        ${lede ? `<p class="lede">${lede}</p>` : ''}
      </header>`;

/** Breadcrumb trail for the current page (visible counterpart of the BreadcrumbList JSON-LD). */
function crumbs(trail) {
  if (!trail.length) return '';
  return `<nav class="crumbs" aria-label="${tr('مسار التنقل', 'Breadcrumb')}">
          <ol>${trail.map((c, i) => i === trail.length - 1
            ? `<li aria-current="page">${c.name}</li>`
            : `<li><a href="${c.path || './'}" data-nav>${c.name}</a></li>`).join('')}</ol>
        </nav>`;
}

/** Hero band shared by the section pages. */
function pageHero({ kicker, title, lede, aside = '', cls = '' }) {
  const trail = breadcrumbFor(currentLang, null, route.page);
  return `
  <header class="page-hero ${cls}">
    <div class="container">
      ${crumbs(trail)}
      <div class="page-hero-grid${aside ? ' has-aside' : ''}">
        <div class="page-hero-text">
          <p class="kicker"><span>${kicker}</span></p>
          <h1 class="page-title">${title}</h1>
          ${lede ? `<p class="page-lede">${lede}</p>` : ''}
        </div>
        ${aside}
      </div>
    </div>
  </header>`;
}

// --- ANATOMICAL ILLUSTRATIONS ---
// The 3D renders (public/images/procedures/<slug>.webp, 1600×1000, plus <slug>-dark.webp and -800 variants) are
// referenced only when they exist at build time (__PROC_IMAGES__). Otherwise — or if one fails to load — a
// schematic line drawing of the eye in section stands in, with the structure each procedure concerns highlighted.
const EYE_BASE = `
  <circle class="ap-globe" cx="150" cy="100" r="78"/>
  <path class="ap-retina" d="M118 30a74 74 0 0 0 0 140"/>
  <path class="ap-nerve" d="M73 92h-34M73 108h-34"/>
  <path class="ap-cornea" d="M214 56c26 22 26 66 0 88"/>
  <path class="ap-iris" d="M212 60v26M212 114v26"/>
  <path class="ap-zonule" d="M196 72l14-8M196 128l14 8"/>`;
const EYE_FOCUS = {
  'cataract-surgery': '<ellipse class="ap-focus ap-cloud" cx="196" cy="100" rx="12" ry="28"/><ellipse class="ap-focus-line" cx="196" cy="100" rx="6" ry="17"/>',
  'lens-implants': '<ellipse class="ap-focus" cx="196" cy="100" rx="8" ry="20"/><path class="ap-focus-line" d="M196 80c-8-6-10-12-6-18M196 120c-8 6-10 12-6 18"/>',
  'laser-vision-correction': '<path class="ap-focus-stroke" d="M214 56c26 22 26 66 0 88"/><path class="ap-beam" d="M300 70l-58 20M300 100h-56M300 130l-58-20"/>',
  icl: '<ellipse class="ap-lens-ghost" cx="196" cy="100" rx="12" ry="28"/><path class="ap-focus-stroke" d="M206 74c4 8 4 44 0 52"/>',
  'keratoconus-cxl': '<path class="ap-focus-stroke" d="M214 56c18 12 34 34 38 46-6 14-20 32-38 42"/><path class="ap-beam" d="M300 84l-40 10M300 116l-40-10"/>',
  'corneal-transplant': '<path class="ap-focus-stroke" d="M226 70c12 18 12 42 0 60"/><path class="ap-graft" d="M226 70l-6-4M226 130l-6 4"/>',
  'intravitreal-injections': '<path class="ap-vitreous" d="M186 44a68 68 0 1 0 0 112c-8-18-8-94 0-112z"/><path class="ap-focus-stroke" d="M118 30a74 74 0 0 0 0 140"/><circle class="ap-focus" cx="76" cy="100" r="5"/><path class="ap-needle" d="M230 4l-30 40"/><circle class="ap-drop" cx="186" cy="60" r="3"/>'
};
function anatomyPlate(slug, label) {
  const g = `<g class="ap-base">${EYE_BASE}</g><g class="ap-hl">${EYE_FOCUS[slug] || ''}</g>`;
  return `<svg class="anat-plate" viewBox="0 0 320 200" role="img" aria-label="${label}" focusable="false" preserveAspectRatio="xMidYMid meet">${g}</svg>`
    + `<svg class="anat-thumb" viewBox="${slug === 'intravitreal-injections' ? '62 6 188 188' : '122 18 172 164'}" role="img" aria-label="${label}" focusable="false" preserveAspectRatio="xMidYMid meet">${g}</svg>`;
}
/** Procedure illustration: the 3D render when it exists (with a 800 px variant for small slots), otherwise the plate. */
function illustration(p, { eager = false, cls = '', sizes = '(min-width: 1024px) 50vw, 100vw' } = {}) {
  const img = PROC_IMAGES[p.slug] || {};
  const alt = L(p.alt);
  const plate = anatomyPlate(p.slug, alt);
  if (!img.light) return `<div class="illus is-plate ${cls}">${plate}</div>`;
  const set = v => `images/procedures/${p.slug}${v}-800.webp 800w, images/procedures/${p.slug}${v}.webp 1600w`;
  const dark = img.dark ? '-dark' : '';
  const v = dark && resolvedTheme() === 'dark' ? '-dark' : '';
  return `<div class="illus ${cls}">
      <img src="images/procedures/${p.slug}${v}.webp" srcset="${set(v)}" sizes="${sizes}" data-light="images/procedures/${p.slug}.webp" data-light-set="${set('')}" ${dark ? `data-dark="images/procedures/${p.slug}-dark.webp" data-dark-set="${set('-dark')}"` : ''} width="1600" height="1000" alt="${alt}" ${eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async" onerror="this.parentNode.classList.add('is-plate');this.remove()">
      ${plate}
    </div>`;
}

// --- NAVIGATION MODEL ---
// Header: the dedicated pages. Drawer and footer add the remaining pages and every procedure.
const NAV = [
  ['about', 'عن الدكتور', 'About'],
  ['procedures', 'الإجراءات', 'Procedures'],
  ['lens-lab', 'مختبر العدسات', 'Lens Lab'],
  ['surgical-education', 'الجراحة ثلاثية الأبعاد', '3D surgery'],
  ['education', 'التثقيف الصحي', 'Education'],
  ['clinic', 'العيادة والحجز', 'Clinic & booking']
];
const DRAWER_NAV = [
  ['home', 'الرئيسية', 'Home'],
  ...NAV.slice(0, 4),
  ['how-vision-works', 'رحلة الضوء في العين', 'How vision works'],
  ...NAV.slice(4)
];
/** The header item that represents the current page. */
const activeKey = () => (route.slug ? 'procedures' : route.page);

function renderThemeToggle(id) {
  const isDark = resolvedTheme() === 'dark';
  const label = isDark ? tr('الوضع الليلي مفعّل، انقر للتحويل للوضع النهاري', 'Dark mode on. Switch to light mode')
    : tr('الوضع النهاري مفعّل، انقر للتحويل للوضع الليلي', 'Light mode on. Switch to dark mode');
  return `<button id="${id}" type="button" class="icon-btn theme-toggle" onclick="toggleTheme()" role="switch" aria-checked="${isDark}" aria-label="${label}" title="${label}">${icon('sun', 20)}${icon('moon', 20)}</button>`;
}

function renderLangToggle(extra = '') {
  return `<button type="button" class="icon-btn lang-switch ${extra}" onclick="toggleLang()" aria-label="${tr('EN — Switch to English', 'التحويل إلى العربية')}" title="${tr('Switch to English', 'التحويل إلى العربية')}">
          <span lang="${tr('en', 'ar')}">${tr('EN', 'ع')}</span>
        </button>`;
}

// --- HEADER ---
function renderHeader() {
  const cur = activeKey();
  const link = ([id, ar, en], i, drawer) => {
    const on = cur === id;
    return `<a href="${id === 'home' ? pageHref() : P(id)}" data-nav data-section="${id}" class="${on ? 'active' : ''}" ${on ? 'aria-current="page"' : ''}>${drawer ? `<span class="drawer-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>` : ''}<span>${tr(ar, en)}</span></a>`;
  };
  return `
  <header class="site-header" id="site-header">
    <div class="header-inner">
      <a href="${pageHref()}" data-nav data-section="home" class="wordmark">
        <span class="wordmark-mark" aria-hidden="true"><svg viewBox="0 0 32 32" width="30" height="30"><circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M5 16s4.6-6.5 11-6.5S27 16 27 16s-4.6 6.5-11 6.5S5 16 5 16z" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="16" cy="16" r="3.4" fill="currentColor"/></svg></span>
        <span class="wordmark-text"><span class="wordmark-name">${L(D.identity.shortName)}</span>
        <span class="wordmark-sub">${tr('استشاري طب وجراحة العيون', 'Consultant Ophthalmologist')}</span><span class="sr-only"> — ${tr('الصفحة الرئيسية', 'home')}</span></span>
      </a>

      <nav class="header-nav" aria-label="${tr('التنقل الرئيسي', 'Main navigation')}">
        <div class="nav-links">${NAV.map((n, i) => link(n, i, false)).join('')}</div>
      </nav>

      <div class="header-actions">
        ${renderLangToggle()}
        ${renderThemeToggle('theme-toggle-btn')}
        <a href="${C.bookingUrl}" ${EXT} class="btn btn-primary btn-sm btn-header-book" data-cta="book">
          <span class="btn-label">${tr('احجز موعداً', 'Book appointment')}</span>
        </a>
        <button type="button" class="icon-btn mobile-menu-btn" onclick="toggleMobileMenu()" aria-label="${tr('القائمة', 'Menu')}" aria-expanded="false" aria-controls="mobile-nav">${icon('menu', 22)}</button>
      </div>
    </div>

    <nav class="mobile-nav" id="mobile-nav" aria-label="${tr('قائمة الموقع', 'Site menu')}">
      <div class="drawer-head">
        <span class="drawer-title">${tr('المحتويات', 'Contents')}</span>
        <button type="button" class="icon-btn" onclick="closeMobileMenu();document.querySelector('.mobile-menu-btn').focus();" aria-label="${tr('إغلاق القائمة', 'Close menu')}">${icon('close', 22)}</button>
      </div>
      <div class="drawer-links">${DRAWER_NAV.map((n, i) => link(n, i, true)).join('')}</div>
      <div class="drawer-procs">
        <p class="drawer-label">${tr('الإجراءات', 'Procedures')}</p>
        <ul>${PROCEDURES.map(p => `<li><a href="${pageHref(currentLang, p.slug)}" data-nav ${route.slug === p.slug ? 'aria-current="page"' : ''}>${L(p.name)}</a></li>`).join('')}</ul>
      </div>
      <div class="drawer-foot">
        <a href="${D.clinic.mapUrl}" ${EXT} class="drawer-map">${icon('pin', 18)}<span>${tr('موقع المستشفى على خرائط جوجل', 'Hospital on Google Maps')}</span></a>
        <div class="drawer-row">
          <span>${tr('المظهر', 'Appearance')}</span>
          ${renderThemeToggle('theme-toggle-btn-mobile')}
        </div>
        <div class="drawer-row">
          <span>${tr('قنوات الدكتور', 'Channels')}</span>
          <span class="social-row">
            <a href="${D.social.instagram}" ${EXT} class="icon-btn" aria-label="Instagram">${glyph('instagram')}</a>
            <a href="${D.social.twitter}" ${EXT} class="icon-btn" aria-label="X (Twitter)">${glyph('x', 16)}</a>
            <a href="${D.social.youtube}" ${EXT} class="icon-btn" aria-label="YouTube">${glyph('youtube')}</a>
          </span>
        </div>
      </div>
    </nav>
  </header>`;
}

// ============================================================
// HOMEPAGE — a focused editorial journey:
// physician → expertise → specialties → vision discovery → surgical education → education → clinic
// Detail lives on the dedicated pages; every section ends in a link to its page.
// ============================================================

// 1. Physician hero
function renderHero() {
  const chief = role('magrabi-chief');
  const years = yearsOfExperience();
  const intents = [
    [tr('أعاني من ضبابية أو وهج في الرؤية', 'My vision is cloudy or glary'), pageHref(currentLang, 'cataract-surgery')],
    [tr('أفكر في الاستغناء عن النظارة', 'I want to depend less on glasses'), P('lens-lab')],
    [tr('مقاس نظارتي يتغير باستمرار', 'My prescription keeps changing'), pageHref(currentLang, 'keratoconus-cxl')],
    [tr('أريد حجز موعد', 'I want an appointment'), P('clinic')]
  ];
  return `
  <section class="hero" id="home" aria-labelledby="hero-title">
    <div class="container hero-grid">
      <div class="hero-text">
        <p class="kicker hero-kicker"><span>${tr('استشاري طب وجراحة العيون', 'Consultant ophthalmologist')}</span><span class="dot" aria-hidden="true"></span><span>${tr('المدينة المنورة', 'Madinah')}</span></p>
        <h1 class="hero-title" id="hero-title">${L(D.identity.name)}</h1>
        <p class="hero-specialty-subtitle">${L(D.identity.title)}</p>
        <p class="hero-intro">${tr(
          `${chief.shortAr}، و${D.professional.academicRank.ar}، يمارس طب وجراحة العيون منذ <bdi>${D.professional.experienceSince}</bdi> ويستقبل مراجعيه في ${D.clinic.name.ar}.`,
          `${chief.shortEn} and ${D.professional.academicRank.en}. In ophthalmic practice since <bdi>${D.professional.experienceSince}</bdi>, he sees patients at ${D.clinic.name.en}.`)}</p>
        <div class="hero-cta">
          <a href="${C.bookingUrl}" ${EXT} class="btn btn-primary btn-lg" id="hero-primary-cta" data-cta="book">
            ${icon('calendar', 20)}<span class="btn-label">${tr('احجز موعد كشف أو استشارة', 'Book a consultation')}</span>
          </a>
          <a href="${P('about')}" data-nav class="btn btn-quiet btn-lg" id="hero-about-cta">
            <span class="btn-label">${tr('تعرّف على خبرته', 'Discover his expertise')}</span>${icon('arrow', 18)}
          </a>
        </div>
        <p class="hero-aside">${icon('phone', 16)}<span>${tr('عيادة الدكتور', 'Clinic line')} <a href="tel:${C.clinicDirect.tel}" class="text-link" id="hero-call-cta" data-cta="call"><bdi dir="ltr">${C.clinicDirect.display}</bdi></a> · ${tr('متاح أيضاً على', 'also on')} <a href="${getWhatsAppUrl()}" ${EXT} class="text-link" data-cta="whatsapp">${tr('واتساب', 'WhatsApp')}</a></span></p>
      </div>

      <figure class="hero-portrait">
        <div class="portrait-plate">
          <img src="images/dr-maan-portrait.png" width="295" height="225" alt="${tr('صورة د. معن بن عبدالله البري', 'Portrait of Dr. Maan bin Abdullah Al Barry')}" loading="eager" fetchpriority="high" decoding="async">
        </div>
        <figcaption class="portrait-caption"><span class="portrait-name">${L(D.identity.shortName)}</span><span class="portrait-role">${short(chief)}</span></figcaption>
      </figure>
    </div>

    <div class="container hero-lower">
      <ul class="hero-facts" aria-label="${tr('حقائق مهنية', 'Professional facts')}">
        <li class="hero-fact">
          <strong class="hero-fact-value"><bdi>${D.professional.experienceSince}</bdi></strong>
          <span class="hero-fact-label">${tr('بداية الممارسة السريرية والجراحية', 'In clinical & surgical practice since')}<span class="hero-fact-sub">${tr(`<bdi>${years}</bdi> عاماً من الخبرة`, `<bdi>${years}</bdi> years of experience`)}</span></span>
        </li>
        ${STAT ? `<li class="hero-fact">
          <strong class="hero-fact-value"><bdi dir="ltr">${STAT.value}</bdi></strong>
          <span class="hero-fact-label">${L(STAT.label)}<span class="hero-fact-sub">${tr('إجمالي المسيرة: فحوص وإجراءات معاً', 'Career total: examinations and procedures combined')}</span></span>
        </li>` : ''}
        <li class="hero-fact">
          <strong class="hero-fact-value"><bdi dir="ltr">FRCS</bdi></strong>
          <span class="hero-fact-label">${tr('زميل كلية الجراحين الملكية – بريطانيا', 'Royal College of Surgeons, UK')}<span class="hero-fact-sub">${tr('والبورد السعودي في طب وجراحة العيون', 'and the Saudi Board in Ophthalmology')}</span></span>
        </li>
      </ul>
      <nav class="intents" aria-label="${tr('ابدأ من حاجتك', 'Start from what you need')}">
        <p class="intents-label">${tr('ابدأ من حاجتك', 'Start from what you need')}</p>
        <ul>${intents.map(([t, h]) => `<li><a href="${h}" data-nav>${t}${icon('arrow', 16)}</a></li>`).join('')}</ul>
      </nav>
    </div>
  </section>`;
}

// 2. Professional expertise — verified, dated, sourced (no counters).
function renderExpertise() {
  const P_ = D.professional;
  return `
  <section class="section section-band" id="profile" aria-labelledby="profile-title">
    <div class="container expertise-grid">
      <div class="expertise-intro">
        ${sectionHead('01', tr('الخبرة المهنية', 'Professional expertise'), tr('خبرة سريرية وأكاديمية منذ', 'Clinical and academic experience since') + ` <bdi>${P_.experienceSince}</bdi>`,
          tr('يعمل ضمن وحدة الماء الأبيض ووحدة القرنية وتصحيح النظر. كل بند هنا منشور لدى مغربي الصحية أو جامعة طيبة، أو أكده د. معن شخصياً.',
            'He works within the cataract unit and the cornea & refractive unit. Every item here is published by Magrabi Health or Taibah University, or confirmed by Dr. Maan himself.'), { id: 'profile-title' })}
        <a href="${P('about')}" data-nav class="text-link fade-in">${tr('السيرة المهنية الكاملة', 'Full professional profile')}${icon('arrow', 16)}</a>
      </div>
      <div class="expertise-cols fade-in" id="qualifications">
        <div class="ledger-block">
          <h3 class="ledger-title">${tr('المؤهلات والصفة الأكاديمية', 'Qualifications & academic rank')}</h3>
          <ul class="cred-list">
            ${P_.qualifications.map(q => `<li class="cred"><span class="cred-key"><bdi dir="ltr">${q.short}</bdi></span><span class="cred-val">${L(q)} ${sourceTag(q.source)}</span></li>`).join('')}
            <li class="cred"><span class="cred-key">${tr('أكاديمي', 'Academic')}</span><span class="cred-val">${L(P_.academicRank)} ${sourceTag(P_.academicRank.source)}</span></li>
            <li class="cred cred-quiet"><span class="cred-key">${tr('عضوية', 'Member')}</span><span class="cred-val">${P_.memberships.map(m => L(m)).join(tr('، ', ', '))} ${sourceTag('magrabi')}</span></li>
          </ul>
        </div>
        <div class="ledger-block">
          <h3 class="ledger-title">${tr('القيادة والمناصب', 'Leadership & appointments')}</h3>
          <ol class="timeline">
            ${P_.roles.map(r => `
            <li class="timeline-item${r.current ? ' is-current' : ''}">
              <span class="timeline-when">${r.current ? tr('حالياً', 'Current') : tr('سابقاً', 'Previously')}</span>
              <h4>${short(r)}</h4>
            </li>`).join('')}
          </ol>
          <a href="${P('about')}#profile" data-nav class="text-link timeline-more">${tr('المناصب بالتفصيل', 'Roles in detail')}${icon('arrow', 16)}</a>
        </div>
      </div>
    </div>
  </section>`;
}

// 3. Core specialties — three featured with their artwork, the rest as an index, then the library.
const FEATURED_SPECIALTIES = ['cataract-surgery', 'laser-vision-correction', 'keratoconus-cxl'];
function specCard(p, big) {
  const g = groupOf(p.group);
  return `
        <article class="spec-card${big ? ' is-lead' : ''}">
          ${illustration(p, { cls: 'spec-illus', sizes: big ? '(min-width: 1024px) 58vw, 100vw' : '(min-width: 1024px) 22vw, 100vw' })}
          <div class="spec-body">
            <p class="spec-group">${L(g)}</p>
            <h3 class="spec-title">${L(p.name)}</h3>
            <p class="spec-text">${L(p.summary)}</p>
            <a class="spec-link" href="${pageHref(currentLang, p.slug)}" data-nav>${tr('اقرأ الدليل', 'Read the guide')}<span class="sr-only">: ${L(p.name)}</span>${icon('arrow', 18)}</a>
          </div>
        </article>`;
}
function renderSpecialties() {
  const [lead, ...rest] = FEATURED_SPECIALTIES.map(procedureBySlug);
  const others = PROCEDURES.filter(p => !FEATURED_SPECIALTIES.includes(p.slug));
  return `
  <section class="section" id="procedures" aria-labelledby="procedures-title">
    <div class="container">
      ${sectionHead('02', tr('التخصصات الرئيسية', 'Core specialties'), tr('ما الذي يعالجه د. معن؟', 'What Dr. Maan treats'),
        tr('ثلاثة مجالات يتمحور حولها عمله، ولكل إجراء دليل مبسّط للتشريح والخطوات والتعافي والمخاطر.', 'Three fields at the centre of his work. Each procedure has a plain-language guide to anatomy, steps, recovery and risks.'), { cls: 'section-head-split', id: 'procedures-title' })}
      <div class="spec-grid fade-in">
        ${specCard(lead, true)}
        <div class="spec-stack">${rest.map(p => specCard(p, false)).join('')}</div>
      </div>
      <div class="spec-index fade-in">
        <p class="spec-index-label">${tr('وأيضاً', 'Also')}</p>
        <ul>${others.map(p => `<li><a href="${pageHref(currentLang, p.slug)}" data-nav>${L(p.name)}</a></li>`).join('')}</ul>
        <a href="${P('procedures')}" data-nav class="btn btn-quiet">${tr('مكتبة الإجراءات الكاملة', 'The full procedure library')}${icon('arrow', 18)}</a>
      </div>
    </div>
  </section>`;
}

// 4. Vision Discovery — previews of the Lens Lab and the Light Journey (no heavy module on the homepage).
const LENS_LAB_ART = () => `
  <svg class="disc-art" viewBox="0 0 480 200" aria-hidden="true" focusable="false">
    <g class="da-zones">
      <rect x="0" y="0" width="160" height="200"/><rect x="160" y="0" width="160" height="200"/><rect x="320" y="0" width="160" height="200"/>
    </g>
    <g class="da-icons" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M50 70 80 34l30 36M62 70v20h36V70"/><path d="M40 100h80"/>
      <rect x="205" y="38" width="70" height="44" rx="4"/><path d="M228 94h24M240 82v12"/>
      <path d="M372 42h36a6 6 0 0 1 6 6v46h-36a6 6 0 0 0-6 6V42z"/><path d="M414 94V42"/>
    </g>
    <g class="da-labels" font-size="15">
      <text x="80" y="130" text-anchor="middle">${tr('بعيد', 'Far')}</text>
      <text x="240" y="130" text-anchor="middle">${tr('متوسط', 'Intermediate')}</text>
      <text x="400" y="130" text-anchor="middle">${tr('قريب', 'Near')}</text>
    </g>
    <g class="da-bands">${LENS_SUMMARY.slice(0, 3).map((l, i) => `<rect x="${12 + i * 6}" y="${152 + i * 14}" width="${[150, 300, 456][i]}" height="6" rx="3"/>`).join('')}</g>
  </svg>`;
const LIGHT_ART = () => `
  <svg class="disc-art light-art" viewBox="0 0 360 200" aria-hidden="true" focusable="false">
    <g fill="none" stroke="currentColor" stroke-linecap="round">
      <circle cx="170" cy="100" r="78" stroke-width="1.2" opacity=".55"/>
      <path d="M234 56c26 22 26 66 0 88" stroke-width="1.8"/>
      <ellipse cx="216" cy="100" rx="11" ry="27" stroke-width="1.4"/>
      <path d="M138 30a74 74 0 0 0 0 140" stroke-width="2.4" opacity=".6"/>
      <path d="M93 92H60M93 108H60" stroke-width="1.6" opacity=".6"/>
    </g>
    <g class="la-rays" fill="none" stroke-width="1.3" stroke-linecap="round">
      <path d="M356 70 250 82 216 92 100 100"/><path d="M356 130 250 118 216 108 100 100"/><path d="M356 100H100"/>
    </g>
    <circle class="la-focus" cx="100" cy="100" r="5"/>
  </svg>`;
function renderDiscovery() {
  return `
      <div class="explore-part explore-discover" id="discover" aria-labelledby="discover-title" role="region">
        ${sectionHead('03', tr('اكتشف رؤيتك', 'Vision discovery'), tr('افهم كيف ترى، وما الذي يغيّره كل خيار', 'Understand how you see, and what each option changes'),
          tr('أداتان تثقيفيتان لمن يستعد لموعده، ولكل من يحب أن يفهم العين.', 'Two educational tools for anyone preparing for a visit, and for anyone curious about the eye.'), { id: 'discover-title' })}
        <div class="discover-grid fade-in">
          <article class="disc-card disc-lab">
            <div class="disc-visual">${LENS_LAB_ART()}</div>
            <div class="disc-body">
              <p class="spec-group">${tr('مختبر الرؤية والعدسات', 'Vision & Lens Lab')}</p>
              <h3>${tr('قارن العدسات كما تعيش يومك', 'Compare lenses the way you live your day')}</h3>
              <p>${tr('ماذا تقدم كل عدسة مزروعة للرؤية البعيدة والمتوسطة والقريبة، وللأضواء ليلاً؟ مع محاكي رؤية تقريبي.', 'What does each lens implant give at far, intermediate and near distances, and to lights at night? With an approximate vision simulator.')}</p>
              <div class="disc-actions">
                <a href="${P('lens-lab')}" data-nav class="btn btn-light">${tr('افتح مختبر العدسات', 'Open the Lens Lab')}${icon('arrow', 18)}</a>
              </div>
            </div>
          </article>
          <article class="disc-card disc-light">
            <div class="disc-visual">${LIGHT_ART()}</div>
            <div class="disc-body">
              <p class="spec-group">${tr('رحلة الضوء', 'The light journey')}</p>
              <h3>${tr('كيف تتحول الأشعة إلى صورة؟', 'How does light become an image?')}</h3>
              <p>${tr('تتبّع الضوء عبر القرنية والعدسة حتى الشبكية، واعرف أين يحدث كل إجراء.', 'Follow light through the cornea and lens to the retina, and see where each procedure takes place.')}</p>
              <div class="disc-actions">
                <a href="${P('how-vision-works')}" data-nav class="btn btn-ghost-light">${tr('ابدأ رحلة الضوء', 'Start the light journey')}${icon('arrow', 18)}</a>
              </div>
            </div>
          </article>
        </div>
      </div>`;
}

// 5. Surgical education preview — the 3D simulator itself lives on /surgical-education/ and the cataract page.
const C3D_POSTER = () => `
        <svg viewBox="0 0 400 300" class="c3d-svg" focusable="false" aria-hidden="true">
          <g fill="none" stroke="currentColor" stroke-linecap="round">
            <path d="M300 150c0 66-52 118-118 118S64 216 64 150 116 32 182 32s118 52 118 118z" stroke-width="1.2" opacity=".5"/>
            <path d="M292 96c22 30 22 78 0 108" stroke-width="1.6"/>
            <path d="M262 100c-6 16-6 84 0 100M262 100l-14 4M262 200l-14-4" stroke-width="1.2" opacity=".7"/>
            <ellipse class="c3d-lens" cx="238" cy="150" rx="17" ry="40" stroke-width="1.6"/>
            <ellipse cx="238" cy="150" rx="9" ry="26" stroke-width=".8" opacity=".55"/>
            <path d="M238 110c-20-10-34-14-46-14M238 190c-20 10-34 14-46 14" stroke-width=".8" opacity=".5"/>
            <path d="M108 70c-36 40-36 120 0 160" stroke-width="2.4" opacity=".55"/>
            <path d="M74 150h-34" stroke-width="3" opacity=".45"/>
            <path class="c3d-ray" d="M392 120 240 128 104 150M392 180 240 172 104 150" stroke-width=".9" stroke-dasharray="3 5"/>
          </g>
          <g class="c3d-labels" font-size="15">
            <text x="302" y="86">${tr('القرنية', 'Cornea')}</text>
            <text x="222" y="236">${tr('العدسة', 'Lens')}</text>
            <text x="84" y="60">${tr('الشبكية', 'Retina')}</text>
          </g>
        </svg>`;
function renderSurgeryPreview() {
  return `
      <div class="explore-part explore-surgery" id="surgery-3d" aria-labelledby="surgery-3d-title" role="region">
        ${sectionHead('04', tr('التثقيف الجراحي', 'Surgical education'), tr('عملية الماء الأبيض بالأبعاد الثلاثة', 'Cataract surgery in 3D'),
          tr('نموذج تفاعلي للعين يشرح مراحل إزالة الساد وزراعة العدسة، لتفهم ما يحدث قبل موعدك.', 'An interactive model of the eye that walks through cataract removal and lens implantation, so you understand what happens before your visit.'), { id: 'surgery-3d-title' })}
        <figure class="c3d-poster fade-in">
          ${C3D_POSTER()}
          <figcaption>${tr('رسم توضيحي للعين: الضوء يمر عبر القرنية والعدسة إلى الشبكية.', 'The eye in section: light passes through the cornea and lens to the retina.')}</figcaption>
        </figure>
        <ol class="stage-list">${SURGERY_STAGES[currentLang].map(([t], i) => `<li><span aria-hidden="true">${i + 1}</span>${t}</li>`).join('')}</ol>
        <div class="c3d-actions">
          <a href="${P('surgical-education')}" data-nav class="btn btn-light">${icon('play', 20)}<span class="btn-label">${tr('شاهد التجربة ثلاثية الأبعاد', 'Open the 3D walkthrough')}</span></a>
          <a href="${pageHref(currentLang, 'cataract-surgery')}" data-nav class="text-link text-link-light">${tr('دليل جراحة الماء الأبيض', 'Cataract surgery guide')}${icon('arrow', 16)}</a>
        </div>
      </div>`;
}
function renderExplore() {
  return `
  <section class="section section-stage explore" aria-label="${tr('اكتشف وتعلّم', 'Explore and learn')}">
    <div class="container explore-grid">
      ${renderDiscovery()}
      ${renderSurgeryPreview()}
    </div>
  </section>`;
}

// 6. Selected medical education — three guides + the site FAQ (mirrored in the FAQPage JSON-LD).
function renderFaqList(prefix = 'faq') {
  return `<div class="faq-list">
        ${FAQ.map((f, idx) => `
        <div class="faq-item" id="${prefix}-${idx}">
          <h3 class="faq-heading">
            <button type="button" class="faq-question" onclick="toggleFaq(${idx},'${prefix}')" aria-expanded="false" aria-controls="${prefix}-answer-${idx}"><span>${L(f.q)}</span><span class="faq-icon" aria-hidden="true">${icon('plus', 20)}</span></button>
          </h3>
          <div class="faq-answer" id="${prefix}-answer-${idx}" role="region"><p>${L(f.a)}</p></div>
        </div>`).join('')}
      </div>`;
}
function renderEducationPreview() {
  const items = FEATURED_GUIDES.map(guideBy);
  return `
  <section class="section" id="education" aria-labelledby="education-title">
    <div class="container">
      ${sectionHead('05', tr('التثقيف الصحي', 'Medical education'), tr('ما يفيد معرفته قبل موعدك', 'Worth knowing before your visit'),
        tr('أدلة قصيرة بلغة واضحة، وإجابات عن أكثر الأسئلة شيوعاً. محتوى توعوي عام لا يغني عن الفحص.', 'Short guides in plain language, and answers to the questions patients ask most. General education that does not replace an examination.'), { cls: 'section-head-split', id: 'education-title' })}
      <div class="edu-grid">
        <div class="guide-list fade-in">
          ${items.map((g, i) => `
          <article class="guide-row">
            <span class="guide-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3><a href="${P('education')}#${g.id}" data-nav>${L(g.title)}</a></h3>
              <p>${L(g.summary)}</p>
            </div>
          </article>`).join('')}
          <div class="guide-foot">
            <a href="${P('education')}" data-nav class="btn btn-quiet">${icon('book', 18)}${tr('مكتبة التثقيف واستبيان الزيارة', 'Education library & visit questionnaire')}</a>
            <a href="${P('education')}#red-flags" data-nav class="text-link text-link-alert">${icon('alert', 18)}${tr('طوارئ العين: متى تتوجه فوراً؟', 'Eye emergency: when to go now')}</a>
          </div>
        </div>
        <div class="faq-block fade-in" id="faq">
          <h3 class="faq-block-title">${tr('أسئلة يطرحها المرضى كثيراً', 'Questions patients often ask')}</h3>
          ${renderFaqList('faq')}
        </div>
      </div>
    </div>
  </section>`;
}

// 7. Clinic & booking (homepage version: compact; /clinic/ adds the map, visit pathway and assessments).
function bookingWays() {
  return `
        <ol class="booking-ways fade-in">
          <li class="way way-featured">
            <span class="way-num" aria-hidden="true">1</span>
            <div class="way-body">
              <h3>${tr('الحجز الإلكتروني', 'Book online')}</h3>
              <p>${tr('عبر البوابة الرسمية لمستشفيات مغربي — اختر د. معن البري وموعداً مناسباً.', 'Through Magrabi’s official booking portal — choose Dr. Maan Al Barry and a suitable time.')}</p>
              <a href="${C.bookingUrl}" ${EXT} class="btn btn-primary" id="clinic-booking-cta" data-cta="book">
                <span class="btn-label">${tr('الحجز عبر بوابة مغربي', 'Book on the Magrabi portal')}</span>${icon('external', 18)}
              </a>
            </div>
          </li>
          <li class="way">
            <span class="way-num" aria-hidden="true">2</span>
            <div class="way-body">
              <h3>${tr('عيادة د. معن مباشرة — اتصال أو واتساب', 'Dr. Maan’s clinic — call or WhatsApp')}</h3>
              <p class="way-number"><bdi dir="ltr">${C.clinicDirect.display}</bdi></p>
              <div class="way-actions">
                <a href="tel:${C.clinicDirect.tel}" class="btn btn-quiet" data-cta="call">${icon('phone', 18)}<span>${tr('اتصال', 'Call')}</span></a>
                <a href="${getWhatsAppUrl()}" ${EXT} class="btn btn-whatsapp" data-cta="whatsapp">${glyph('whatsapp')}<span>${tr('واتساب', 'WhatsApp')}</span></a>
              </div>
            </div>
          </li>
          <li class="way">
            <span class="way-num" aria-hidden="true">3</span>
            <div class="way-body">
              <h3>${tr('مركز اتصال مغربي الصحية', 'Magrabi Health contact center')}</h3>
              <p class="contact-numbers">
                <a href="tel:${C.callCenter.tel}" class="contact-number" data-cta="call">${icon('phone', 16)}<bdi dir="ltr">${C.callCenter.display}</bdi></a>
                <a href="tel:${C.callCenterShort.tel}" class="contact-number" data-cta="call">${icon('phone', 16)}<bdi dir="ltr">${C.callCenterShort.display}</bdi></a>
              </p>
            </div>
          </li>
        </ol>`;
}
function visitFacts({ map = false } = {}) {
  return `
        <div class="visit fade-in">
          <div class="visit-row">
            <p class="visit-label">${icon('clock', 18)}<span>${tr('مواعيد العيادة', 'Clinic hours')}</span></p>
            <p class="visit-hours-text">${L(D.clinic.workingHours)}</p>
            <p class="visit-small">${tr('يُرجى تأكيد الموعد عبر الحجز، فقد يتغير الجدول.', 'Please confirm through booking, as the schedule can change.')}</p>
          </div>
          <div class="visit-row">
            <p class="visit-label">${icon('pin', 18)}<span>${tr('المستشفى والعنوان', 'Hospital & address')}</span></p>
            <p class="visit-strong">${L(D.clinic.name)}</p>
            <p class="visit-small">${L(D.clinic.address)}</p>
            <a href="${D.clinic.mapUrl}" ${EXT} class="text-link">${tr('الاتجاهات عبر خرائط جوجل', 'Directions in Google Maps')}${icon('external', 16)}</a>
          </div>
          ${map ? `<div class="clinic-map">
            <iframe src="https://maps.google.com/maps?q=${D.clinic.mapEmbedQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed" title="${tr('خريطة موقع مستشفى مغربي المدينة المنورة', 'Map of Magrabi Eye Hospital, Madinah')}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>` : ''}
          <p class="accreditation">${icon('shield', 20)}<span>${tr(
            `${D.clinic.name.ar} معتمد من الهيئة المشتركة الدولية (JCI) والمركز السعودي لاعتماد المنشآت الصحية (CBAHI)، بحسب ما تنشره مغربي الصحية.`,
            `${D.clinic.name.en} is accredited by Joint Commission International (JCI) and CBAHI, as published by Magrabi Health.`)}</span></p>
        </div>`;
}
function renderClinicHome() {
  return `
  <section class="section section-band" id="clinic" aria-labelledby="clinic-title">
    <div class="container">
      ${sectionHead('06', tr('العيادة والحجز', 'Clinic & booking'), tr('موعدك مع د. معن البري', 'Your appointment with Dr. Maan'),
        tr('ثلاث طرق للحجز، ومواعيد ثابتة، وعنوان واحد.', 'Three ways to book, regular hours, one address.'), { cls: 'section-head-split', id: 'clinic-title' })}
      <div class="clinic-grid">
        ${bookingWays()}
        <div class="clinic-side">
          ${visitFacts()}
          <a href="${P('clinic')}" data-nav class="text-link fade-in">${tr('خطوات الزيارة والفحوصات والخريطة', 'Your visit, assessments and map')}${icon('arrow', 16)}</a>
        </div>
      </div>
      ${renderTestimonials()}
    </div>
  </section>`;
}

// PATIENT TESTIMONIALS (publication-gated) — renders nothing unless a testimonial has a source
// URL, documented reuse permission, attribution and approved text (isPublishableTestimonial).
function renderTestimonials() {
  const items = publishableTestimonials();
  if (!items.length) return '';
  return `
      <div class="testimonials fade-in" id="testimonials">
        <p class="kicker"><span>${tr('آراء المرضى', 'Patient testimonials')}</span></p>
        <div class="reviews-grid">
          ${items.map(t => `
          <figure class="review-card">
            <blockquote class="review-text">${t.approvedText[currentLang] || t.approvedText.ar || t.approvedText.en}</blockquote>
            <figcaption class="review-author">
              <strong>${t.attribution}</strong>
              <a href="${t.source.url}" ${EXT}>${tr('المصدر', 'Source')}</a>
            </figcaption>
          </figure>`).join('')}
        </div>
      </div>`;
}

function renderHome() {
  return `
      ${renderHero()}
      ${renderExpertise()}
      ${renderSpecialties()}
      ${renderExplore()}
      ${renderEducationPreview()}
      ${renderClinicHome()}`;
}

// ============================================================
// /about/ — the physician profile
// ============================================================
function renderAboutPage() {
  const P_ = D.professional;
  const chief = role('magrabi-chief');
  const groups = [
    { title: tr('المؤهلات', 'Qualifications'), rows: P_.qualifications.map(q => [q.short, L(q), false, q.id, q.source]) },
    { title: tr('الصفة الأكاديمية', 'Academic'), rows: [[tr('حالياً', 'Rank'), L(P_.academicRank), false, 'rank', P_.academicRank.source], [tr('سابقاً', 'Former'), short(role('taibah-chair')), false, 'taibah-chair', role('taibah-chair').source]] },
    { title: tr('القيادة', 'Leadership'), rows: [[tr('حالياً', 'Current'), short(chief), true, 'magrabi-chief', chief.source], [tr('سابقاً', 'Former'), short(role('sscc-president')), false, 'sscc-president', role('sscc-president').source]] },
    { title: tr('العضويات', 'Memberships'), rows: P_.memberships.map(m => [tr('عضو', 'Member'), L(m), false, null, m.source]) }
  ];
  const aside = `
        <figure class="about-portrait">
          <img src="images/dr-maan-redsea.jpg" width="682" height="1024" alt="${tr('د. معن البري في مؤتمر طب العيون السعودي 2024 – البحر الأحمر', 'Dr. Maan Al Barry at Saudi Ophthalmology 2024 – The Red Sea')}" loading="eager" fetchpriority="high" decoding="async">
          <figcaption>${tr('في مؤتمر طب العيون السعودي 2024 – البحر الأحمر', 'At Saudi Ophthalmology 2024 – The Red Sea')}</figcaption>
        </figure>`;
  return `
    ${pageHero({
      kicker: tr('عن الطبيب', 'About the doctor'),
      title: L(D.identity.name),
      lede: tr(
        `${D.identity.name.ar}، ${D.identity.title.ar}، في ${D.clinic.name.ar}، بخبرة سريرية وأكاديمية وجراحية ممتدة منذ عام <bdi>${P_.experienceSince}</bdi>.`,
        `${D.identity.name.en} is a ${D.identity.title.en} at ${D.clinic.name.en}, with clinical, academic and surgical experience since <bdi>${P_.experienceSince}</bdi>.`),
      aside, cls: 'about-hero'
    })}
    <section class="section about-bio" aria-labelledby="bio-title">
      <div class="container about-bio-grid">
        <div class="prose">
          <h2 id="bio-title" class="sub-title">${tr('نبذة', 'Profile')}</h2>
          <p class="bio-lede">${tr(
            `يعمل د. معن البري ضمن وحدة جراحة الماء الأبيض ووحدة جراحة القرنية وتصحيح النظر، ويساعد المرضى في تقييم الحالات التي تتطلب دقة في فحص عدسة العين، وتشخيص القرنية المخروطية، وتحديد خيارات تصحيح الإبصار بالليزر أو زراعة العدسات.`,
            `He works within the cataract unit and the cornea & refractive surgery unit, helping patients whose care depends on careful assessment of the lens and cornea — from keratoconus diagnosis to laser vision correction and lens implantation.`)}</p>
          <p>${tr(
            `يشغل حالياً منصب ${chief.ar}، وهو ${P_.academicRank.ar}. ومن مناصبه السابقة: ${role('sscc-president').ar}، و${role('taibah-chair').ar}.`,
            `He is currently ${chief.en}, and ${P_.academicRank.en}. Earlier roles include ${role('sscc-president').en}, and ${role('taibah-chair').en}.`)}</p>
          <div class="about-cta">
            <a href="${C.bookingUrl}" ${EXT} class="btn btn-primary btn-lg" data-cta="book">${icon('calendar', 20)}<span class="btn-label">${tr('احجز موعداً مع د. معن', 'Book with Dr. Maan')}</span></a>
            <a href="${P('clinic')}" data-nav class="btn btn-quiet btn-lg">${tr('العيادة والتواصل', 'Clinic & contact')}${icon('arrow', 18)}</a>
          </div>
        </div>
        <ul class="about-facts" aria-label="${tr('حقائق مهنية', 'Professional facts')}">
          <li><strong><bdi>${P_.experienceSince}</bdi></strong><span>${tr('بداية الممارسة السريرية والجراحية', 'Start of clinical and surgical practice')}</span></li>
          ${STAT ? `<li><strong><bdi dir="ltr">${STAT.value}</bdi></strong><span>${L(STAT.label)} — ${tr('إجمالي المسيرة، فحوص وإجراءات معاً', 'career total, examinations and procedures combined')}</span></li>` : ''}
          <li><strong><bdi dir="ltr">FRCS</bdi></strong><span>${tr('زمالة كلية الجراحين الملكية – بريطانيا', 'Fellowship of the Royal College of Surgeons, UK')}</span></li>
        </ul>
      </div>
    </section>

    <section class="section section-band" id="expertise" aria-labelledby="areas-title">
      <div class="container">
        ${sectionHead('', tr('مجالات الخبرة', 'Areas of expertise'), tr('ثلاثة مجالات، وسبعة إجراءات', 'Three fields, seven procedures'), '', { id: 'areas-title' })}
        <div class="areas">
          ${AREAS.map(a => {
            const p = procedureBySlug(a.slug);
            return `<article class="area fade-in">
            ${illustration(p, { cls: 'area-illus', sizes: '(min-width: 1024px) 30vw, 100vw' })}
            <div class="area-body">
              <h3>${L(a.title)}</h3>
              <p>${L(a.text)}</p>
              <ul class="area-links">${[a.slug, ...a.more].map(s => `<li><a href="${pageHref(currentLang, s)}" data-nav class="text-link">${L(procedureBySlug(s).name)}${icon('arrow', 16)}</a></li>`).join('')}</ul>
            </div>
          </article>`;
          }).join('')}
        </div>
      </div>
    </section>

    <section class="section" id="profile" aria-labelledby="quals-title">
      <div class="container">
        ${sectionHead('', tr('المؤهلات والمناصب', 'Qualifications & appointments'), tr('ما تعنيه كل شهادة لك كمريض', 'What each credential means for you as a patient'),
          tr('مؤهلات ومناصب كما نشرتها مغربي الصحية وجامعة طيبة، أو أكدها د. معن شخصياً. السطر الثاني في كل بند يشرح بلغة بسيطة لماذا يهمك.', 'Qualifications and roles as published by Magrabi Health and Taibah University, or confirmed by Dr. Maan himself. The second line of each item explains, in plain words, why it matters to you.'), { cls: 'section-head-split', id: 'quals-title' })}
        <div class="profile-grid" id="qualifications">
          <div class="ledger qualifications-grid fade-in">
            ${groups.map(g => `
            <div class="ledger-group">
              <h3 class="ledger-title">${g.title}</h3>
              <ul class="ledger-list">
                ${g.rows.map(([k, v, em, why, src]) => `<li class="ledger-row${em ? ' is-emphasis' : ''}"><span class="ledger-key">${k}</span><span class="ledger-val">${v}${why && WHY_IT_MATTERS[why] ? `<span class="why">${L(WHY_IT_MATTERS[why])}</span>` : ''}${sourceTag(src)}</span></li>`).join('')}
              </ul>
            </div>`).join('')}
          </div>
          <div class="appointments fade-in">
            <h3 class="ledger-title">${tr('المناصب والمسيرة', 'Appointments')}</h3>
            <ol class="timeline">
              ${P_.roles.map(r => `
              <li class="timeline-item${r.current ? ' is-current' : ''}">
                <span class="timeline-when">${r.current ? tr('حالياً', 'Current') : tr('سابقاً', 'Previously')}</span>
                <h4>${r[currentLang]}</h4>
                ${WHY_IT_MATTERS[r.id] ? `<p class="why">${L(WHY_IT_MATTERS[r.id])}</p>` : ''}
              </li>`).join('')}
            </ol>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-band" id="record" aria-labelledby="record-title">
      <div class="container record-grid">
        <div>
          ${sectionHead('', tr('السجل المهني', 'Professional record'), tr('محطات مؤرخة وموثقة فقط', 'Dated, verified milestones only'),
            tr('لا نذكر تاريخاً لم يُوثق. المناصب غير المؤرخة مدرجة أعلاه دون سنوات.', 'No date is shown unless it is documented. Undated roles are listed above without years.'), { id: 'record-title' })}
          <ol class="record">
            <li><span class="record-year"><bdi>${P_.experienceSince}</bdi></span><div><h3>${tr('بداية الممارسة السريرية والجراحية في طب العيون', 'Start of clinical and surgical practice in ophthalmology')}</h3><p>${sourceTag('owner')}</p></div></li>
            <li><span class="record-year"><bdi>2024</bdi></span><div><h3>${tr('مشاركة في مؤتمر طب العيون السعودي 2024 – البحر الأحمر', 'Took part in Saudi Ophthalmology 2024 – The Red Sea')}</h3><p>${tr('موثقة بصورة المؤتمر المرفقة.', 'Documented by the conference photograph on this page.')} ${sourceTag('owner')}</p></div></li>
            <li><span class="record-year">${tr('اليوم', 'Today')}</span><div><h3>${chief[currentLang]}</h3><p>${sourceTag(chief.source)}</p></div></li>
          </ol>
        </div>
        <div>
          ${sectionHead('', tr('الإسهام التعليمي', 'Educational contributions'), tr('التعليم جزء من الممارسة', 'Teaching is part of the practice'), '', { id: 'contrib-title' })}
          <ul class="contrib">
            <li>${icon('book', 20)}<span>${L(P_.academicRank)}: ${tr('تعليم طلاب الطب والأطباء المتدربين.', 'teaching medical students and doctors in training.')}</span></li>
            <li>${icon('book', 20)}<span>${role('taibah-chair')[currentLang]}.</span></li>
            <li>${icon('book', 20)}<span>${role('redsea')[currentLang]}.</span></li>
            <li>${icon('book', 20)}<span>${role('sos-rep')[currentLang]}.</span></li>
            <li>${icon('sparkle', 20)}<span>${tr('على هذا الموقع: ', 'On this site: ')}<a href="${P('education')}" data-nav class="text-link">${tr('مكتبة التثقيف', 'the education library')}</a>، <a href="${P('surgical-education')}" data-nav class="text-link">${tr('الجراحة ثلاثية الأبعاد', 'the 3D surgery walkthrough')}</a>، <a href="${P('lens-lab')}" data-nav class="text-link">${tr('مختبر العدسات', 'the Lens Lab')}</a>.</span></li>
          </ul>
          <div class="social-row profile-social">
            <span>${tr('قنوات الدكتور', 'Dr. Maan’s channels')}</span>
            <a href="${D.social.instagram}" ${EXT} class="icon-btn" aria-label="Instagram">${glyph('instagram')}</a>
            <a href="${D.social.twitter}" ${EXT} class="icon-btn" aria-label="X (Twitter)">${glyph('x', 16)}</a>
            <a href="${D.social.youtube}" ${EXT} class="icon-btn" aria-label="YouTube">${glyph('youtube')}</a>
          </div>
          <p class="profile-links"><a href="${D.social.magrabiProfile}" ${EXT} class="text-link">${tr('الملف الطبي في مغربي الصحية', 'Magrabi Health profile')}${icon('external', 14)}</a> <a href="${D.social.taibahProfile}" ${EXT} class="text-link">${tr('ملف جامعة طيبة', 'Taibah University profile')}${icon('external', 14)}</a></p>
        </div>
      </div>
    </section>
    ${renderClosing('about')}`;
}

// ============================================================
// /procedures/ — the full procedure library
// ============================================================
function procCard(p, { featured = false, compact = false } = {}) {
  const g = groupOf(p.group);
  return `
        <article class="proc-card${featured ? ' is-featured' : ''}${compact ? ' is-compact' : ''}" data-group="${p.group}">
          ${illustration(p, { cls: 'proc-card-illus', sizes: featured ? '(min-width: 1024px) 40vw, 100vw' : '(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 104px' })}
          <div class="proc-card-body">
            <p class="proc-card-group">${L(g)}</p>
            <h3 class="proc-card-title">${L(p.name)}</h3>
            <p class="proc-card-text">${L(p.summary)}</p>
            ${p.simulator ? `<p class="proc-card-badge">${icon('cube', 16)}<span>${tr('مع تجربة ثلاثية الأبعاد', 'With a 3D walkthrough')}</span></p>` : ''}
            <a class="proc-card-link" href="${pageHref(currentLang, p.slug)}" data-nav>${tr('تفاصيل الإجراء', 'Procedure details')}<span class="sr-only">: ${L(p.name)}</span>${icon('arrow', 18)}</a>
          </div>
        </article>`;
}
function renderProceduresPage() {
  const chips = [['all', tr('جميع الإجراءات', 'All procedures')], ...PROCEDURE_GROUPS.map(g => [g.id, L(g)])];
  return `
    ${pageHero({
      kicker: tr('مكتبة الإجراءات', 'Procedure library'),
      title: tr('سبعة إجراءات، بلغة واضحة', 'Seven procedures, in plain language'),
      lede: tr('لكل إجراء صفحة تشرح التشريح وخطوات الإجراء والتعافي والمخاطر. معلومات توعوية عامة بانتظار مراجعة د. معن، ولا تغني عن الفحص.', 'Each procedure has a page explaining the anatomy, the steps, recovery and risks. General education pending Dr. Maan’s review; it does not replace an examination.')
    })}
    <section class="section" id="procedures" aria-label="${tr('الإجراءات', 'Procedures')}">
      <div class="container">
        <div class="proc-filter" role="group" aria-label="${tr('تصفية حسب المجموعة', 'Filter by group')}">
          ${chips.map(([id, label]) => `<button type="button" class="chip" data-filter="${id}" aria-pressed="${procFilter === id}" onclick="filterProcedures('${id}')">${label}</button>`).join('')}
        </div>
        <div class="proc-grid" data-filter="${procFilter}">
          ${PROCEDURES.map((p, i) => procCard(p, { featured: i === 0 })).join('')}
          <aside class="proc-help">
            <p class="proc-card-group">${tr('غير متأكد؟', 'Not sure?')}</p>
            <h3>${tr('ابدأ بفحص شامل', 'Start with an examination')}</h3>
            <p>${tr('لا تحتاج إلى معرفة اسم الإجراء مسبقاً. يحدد الفحص سبب المشكلة والخيارات المناسبة لعينك.', 'You do not need to know the procedure name. An examination finds the cause and the options that suit your eye.')}</p>
            <a href="${C.bookingUrl}" ${EXT} class="btn btn-primary" data-cta="book"><span class="btn-label">${tr('احجز موعد فحص', 'Book an examination')}</span></a>
          </aside>
        </div>
        <aside class="library-note">
          ${icon('lens', 22)}
          <p>${tr('تقارن بين أنواع العدسات المزروعة؟ ', 'Comparing lens implants? ')}<a href="${P('lens-lab')}" data-nav class="text-link">${tr('افتح مختبر الرؤية والعدسات', 'Open the Vision & Lens Lab')}</a>${tr(' — أين يحدث كل إجراء في العين؟ ', ' — Where in the eye does each procedure happen? ')}<a href="${P('how-vision-works')}" data-nav class="text-link">${tr('رحلة الضوء', 'The light journey')}</a></p>
        </aside>
      </div>
    </section>
    ${renderClosing('procedures')}`;
}

// ============================================================
// Interactive features: Lens Lab, Light Journey (feature-loaders), vision simulator, 3D cataract.
// ============================================================
const featureMsgs = name => () => ({
  error: tr(`تعذر تحميل ${name.ar} على هذا الجهاز أو الاتصال. الملخص أدناه يعرض أهم النقاط.`, `${name.en} could not load on this device or connection. The summary below covers the key points.`),
  retry: tr('إعادة المحاولة', 'Try again')
});
const lensLab = createFeatureMount({
  key: 'lens-lab', slotId: 'lens-lab-host',
  options: () => ({ lang: currentLang, theme: resolvedTheme(), reducedMotion: reducedMotion() }),
  messages: featureMsgs({ ar: 'مختبر العدسات', en: 'The Lens Lab' })
});
const lightJourney = createFeatureMount({
  key: 'light-journey', slotId: 'light-journey-host',
  options: () => ({ lang: currentLang, theme: resolvedTheme(), reducedMotion: reducedMotion(), linkFor: slug => pathFor(currentLang, slug) }),
  messages: featureMsgs({ ar: 'رحلة الضوء', en: 'The light journey' })
});

/** Feature wrapper: module slot (reserved while a mount is expected) + static text summary for no-JS/fallback. */
function featureBlock({ key, hostAttr, slotId, staticHtml, name }) {
  const available = hasFeature(key);
  return `
      <div class="feature feature-${key}" data-feature="${key}">
        <div class="feature-slot" id="${slotId}" ${hostAttr} ${available ? 'data-reserve' : ''} aria-label="${name}"></div>
        <div class="feature-static">
          ${available ? '' : `<p class="feature-soon" role="note">${icon('sparkle', 18)}<span>${tr('النسخة التفاعلية قيد الإعداد وستظهر هنا قريباً. إلى ذلك الحين، هذا ملخص مكتوب للنقاط الأساسية.', 'The interactive version is being prepared and will appear here soon. Until then, here is a written summary of the key points.')}</span></p>`}
          ${staticHtml}
        </div>
      </div>`;
}

// /lens-lab/
function renderSimulator() {
  return `
  <section class="section section-stage vs-section" id="simulator" aria-labelledby="simulator-title">
    <div class="container">
      ${sectionHead('', tr('أداة تثقيفية تفاعلية', 'Interactive education'), tr('محاكي الرؤية: كيف قد تبدو الرؤية بعد زراعة العدسة؟', 'Vision simulator: how might vision look after a lens implant?'),
        tr('قارن بين أنواع العدسات على مسافات النظر المختلفة وفي ظروف إضاءة مختلفة. نموذج تقريبي تثقيفي، وليس توقعاً لرؤيتك.', 'Compare lens types at different viewing distances and in different lighting. An educational approximation, not a prediction of your vision.'), { cls: 'section-head-split', id: 'simulator-title' })}
      <div class="vsim-launch fade-in">
        <div class="vsim-host" id="simulator-host" data-vision-host ${vsim.failed ? '' : 'data-reserve'}></div>
      </div>
      <ul class="disclaimers fade-in">
        <li>${icon('info', 18)}<span>${tr('أداة تعليمية توضح الفروق العامة بين العدسات، ولا تتنبأ بنتيجة عينك.', 'An educational tool showing general differences between lenses. It does not predict your own result.')}</span></li>
        <li>${icon('eye', 18)}<span>${tr('يُختار نوع العدسة بعد الفحص والقياسات ومناقشة أولوياتك مع الطبيب.', 'The lens type is chosen after examination, measurements and a conversation about your priorities.')}</span></li>
        <li>${icon('arrow', 18)}<span><a href="${pageHref(currentLang, 'lens-implants')}" data-nav class="text-link">${tr('اقرأ عن أنواع العدسات المزروعة', 'Read about lens implant types')}</a></span></li>
      </ul>
    </div>
  </section>`;
}
function renderLensLabPage() {
  const summary = `
          <ul class="lens-summary">
            ${LENS_SUMMARY.map(l => `<li><p class="type-code"><bdi dir="ltr">${l.code}</bdi></p><h3>${L(l)[0]}</h3><p>${L(l)[1]}</p></li>`).join('')}
          </ul>
          <p class="feature-note">${icon('info', 18)}<span>${tr('لا توجد عدسة تناسب الجميع؛ لكل نوع مزايا وحدود، ويُختار بعد الفحص والقياسات ومناقشة أولوياتك. ', 'No single lens suits everyone; each type has strengths and limits, and the choice follows examination, measurements and a conversation about your priorities. ')}<a href="${pageHref(currentLang, 'lens-implants')}" data-nav class="text-link">${tr('دليل العدسات المزروعة', 'Lens implants guide')}</a></span></p>`;
  return `
    ${pageHero({
      kicker: tr('مختبر الرؤية والعدسات', 'Vision & Lens Lab'),
      title: tr('قارن العدسات المزروعة، مسافةً بمسافة', 'Compare lens implants, distance by distance'),
      lede: tr('أداة تثقيفية لمن يستعد لجراحة الماء الأبيض أو يسأل عن العدسات: ماذا تقدم كل عدسة على المسافة البعيدة والمتوسطة والقريبة، وماذا يحدث للأضواء ليلاً. لا تتنبأ بنتيجة عينك.', 'An educational tool for anyone preparing for cataract surgery or asking about lenses: what each lens offers at far, intermediate and near distances, and what happens to lights at night. It does not predict your own result.')
    })}
    <section class="section" id="lab" aria-labelledby="lab-title">
      <div class="container">
        <h2 class="sr-only" id="lab-title">${tr('المقارنة', 'The comparison')}</h2>
        ${featureBlock({ key: 'lens-lab', hostAttr: 'data-lens-lab-host', slotId: 'lens-lab-host', staticHtml: summary, name: tr('مختبر الرؤية والعدسات', 'Vision & Lens Lab') })}
      </div>
    </section>
    ${renderSimulator()}
    ${renderClosing('lens-lab')}`;
}

// /how-vision-works/
function renderLightJourneyPage() {
  const outline = `
          <ol class="light-path">
            ${LIGHT_PATH.map((s, i) => `<li><span class="lp-num" aria-hidden="true">${i + 1}</span><div><h3>${L(s)[0]}</h3><p>${L(s)[1]}</p><a href="${pageHref(currentLang, s.slug)}" data-nav class="text-link">${L(procedureBySlug(s.slug).name)}${icon('arrow', 16)}</a></div></li>`).join('')}
          </ol>`;
  return `
    ${pageHero({
      kicker: tr('رحلة الضوء', 'The light journey'),
      title: tr('كيف ترى العين؟', 'How does the eye see?'),
      lede: tr('يمر الضوء بأربع محطات قبل أن يصبح صورة: القرنية، ثم القزحية والبؤبؤ، ثم العدسة، ثم الشبكية. في كل محطة قد يحدث خلل، ولكل خلل إجراء.', 'Light passes four stations before it becomes an image: the cornea, the iris and pupil, the lens, and the retina. Something can go wrong at each one, and each has its procedure.'),
      aside: `<figure class="page-hero-art">${LIGHT_ART()}</figure>`
    })}
    <section class="section" id="journey" aria-labelledby="journey-title">
      <div class="container">
        <h2 class="sub-title" id="journey-title">${tr('المحطات الأربع', 'The four stations')}</h2>
        ${featureBlock({ key: 'light-journey', hostAttr: 'data-light-journey-host', slotId: 'light-journey-host', staticHtml: outline, name: tr('رحلة الضوء التفاعلية', 'Interactive light journey') })}
      </div>
    </section>
    ${renderClosing('how-vision-works')}`;
}

// Vision simulator: one host node and controller for the page's lifetime; mounted lazily near the viewport.
const vsim = { host: null, ctrl: null, loading: false, io: null, failed: false };
async function loadVisionSim() {
  if (vsim.loading || vsim.ctrl) return;
  vsim.loading = true;
  try {
    const mod = await import('./src/vision-sim/index.js');
    if (!vsim.host || !vsim.host.isConnected) return; // visitor left the page while it loaded
    vsim.host.innerHTML = ''; // drop a previous load-error message
    vsim.ctrl = await mod.mount(vsim.host, { lang: currentLang, theme: resolvedTheme(), reducedMotion: reducedMotion() });
    vsim.ctrl.setLang(currentLang); vsim.ctrl.setTheme(resolvedTheme()); // in case they changed while loading
    vsim.failed = false;
    document.getElementById('simulator-host')?.removeAttribute('data-reserve'); // mounted: it sizes itself now
  } catch (err) {
    console.warn('Vision simulator failed to load', err);
    showVisionSimError();
  } finally { vsim.loading = false; }
}
// A failed download used to leave an empty 1,500 px reserved box with no explanation (BUG-09): say what happened,
// release the reserved height and offer a retry.
function showVisionSimError() {
  vsim.failed = true;
  const slot = document.getElementById('simulator-host');
  if (!slot || !vsim.host) return;
  slot.removeAttribute('data-reserve');
  vsim.host.innerHTML = `<div class="vsim-load-error" role="status">
      <p>${tr('تعذر تحميل محاكي الرؤية على هذا الجهاز أو الاتصال. يمكنك المحاولة مرة أخرى، أو قراءة شرح أنواع العدسات أدناه.', 'The vision simulator could not load on this device or connection. You can try again, or read about lens types below.')}</p>
      <button type="button" class="btn btn-light" data-vsim-retry>${tr('إعادة المحاولة', 'Try again')}</button>
    </div>`;
  vsim.host.querySelector('[data-vsim-retry]').addEventListener('click', () => {
    const s = document.getElementById('simulator-host');
    if (s) s.setAttribute('data-reserve', '');
    vsim.host.innerHTML = '';
    loadVisionSim();
  });
}
function mountVisionSim() {
  const slot = document.getElementById('simulator-host');
  if (!slot) { destroyVisionSim(); return; }
  if (!vsim.host) vsim.host = document.createElement('div');
  if (vsim.host.parentNode !== slot) slot.appendChild(vsim.host); // survive renderApp() re-renders
  if (vsim.ctrl) { slot.removeAttribute('data-reserve'); vsim.ctrl.setLang(currentLang); vsim.ctrl.setTheme(resolvedTheme()); return; }
  if (vsim.loading) return;
  if (vsim.failed) { showVisionSimError(); return; } // re-render in the new language; retry stays one tap away
  if (vsim.io) vsim.io.disconnect();
  vsim.io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    vsim.io.disconnect(); vsim.io = null;
    loadVisionSim();
  }, { rootMargin: '400px 0px' });
  vsim.io.observe(slot);
}
function destroyVisionSim() {
  if (vsim.io) { vsim.io.disconnect(); vsim.io = null; }
  if (vsim.ctrl) { try { vsim.ctrl.destroy(); } catch (e) { /* module handles its own errors */ } vsim.ctrl = null; }
  if (vsim.host) { vsim.host.remove(); vsim.host = null; }
  vsim.failed = false;
}

// 3D cataract surgery (lazy module src/cataract-sim, started on demand). The host node is created once and kept
// outside the re-rendered markup so a re-render never destroys the running scene.
const c3d = { host: null, controller: null, state: 'idle' }; // idle | loading | active | error

function renderCataract3D(onProcedurePage = false) {
  const st = c3d.state;
  return `
  <section class="section section-stage section-stage-deep" id="cataract-3d" data-state="${st}" aria-labelledby="cataract-3d-title">
    <div class="container c3d-grid">
      <div class="c3d-text fade-in">
        <p class="kicker"><span>${tr('تجربة تعليمية ثلاثية الأبعاد', 'Interactive 3D education')}</span></p>
        <h2 id="cataract-3d-title">${tr('عملية الماء الأبيض، خطوة بخطوة', 'Cataract surgery, step by step')}</h2>
        <p class="lede">${tr('نموذج ثلاثي الأبعاد للعين يوضح المراحل الرئيسية لعملية إزالة الساد الحديثة وزراعة العدسة، لتفهم ما يحدث قبل أن تسأل عنه في العيادة.', 'A 3D model of the eye that walks through the main stages of modern cataract removal and lens implantation — so you understand what happens before you ask about it in clinic.')}</p>
        <ul class="c3d-notes">
          <li>${icon('info', 18)}<span>${tr('محتوى تعليمي توضيحي قيد المراجعة الطبية من الطبيب.', 'Illustrative education, pending physician review.')}</span></li>
          <li>${icon('alert', 18)}<span>${tr('لا يغني عن الاستشارة والفحص؛ تختلف تفاصيل كل عملية بحسب حالة العين.', 'Not a substitute for a consultation; every operation is tailored to the individual eye.')}</span></li>
        </ul>
        <div class="c3d-actions">
          <button type="button" class="btn btn-light btn-lg" id="cataract-3d-start" onclick="startCataract3D()" ${st === 'loading' ? 'aria-busy="true"' : ''}>
            ${icon('play', 20)}<span class="btn-label">${st === 'loading' ? tr('جارٍ التحميل…', 'Loading…') : tr('ابدأ التجربة ثلاثية الأبعاد', 'Start the 3D experience')}</span>
          </button>
          ${onProcedurePage ? '' : `<a href="${pageHref(currentLang, 'cataract-surgery')}" data-nav class="text-link text-link-light">${tr('دليل جراحة الماء الأبيض', 'Cataract surgery guide')}${icon('arrow', 16)}</a>`}
          <p class="c3d-status" role="status">${st === 'error' ? tr('تعذر تحميل التجربة ثلاثية الأبعاد على هذا الجهاز. يمكنك المحاولة مرة أخرى.', 'The 3D experience could not load on this device. You can try again.') : ''}</p>
        </div>
      </div>

      <figure class="c3d-poster fade-in" aria-hidden="true">
        ${C3D_POSTER()}
        <figcaption>${tr('رسم توضيحي للعين: الضوء يمر عبر القرنية والعدسة إلى الشبكية.', 'The eye in section: light passes through the cornea and lens to the retina.')}</figcaption>
      </figure>

      <div class="c3d-stage" id="cataract-3d-stage" ${st === 'active' || st === 'loading' ? '' : 'hidden'} aria-label="${tr('التجربة ثلاثية الأبعاد', '3D experience')}" role="region"></div>
    </div>
  </section>`;
}

function c3dSync() {
  const sec = document.getElementById('cataract-3d');
  if (!sec) return;
  sec.dataset.state = c3d.state;
  const stage = document.getElementById('cataract-3d-stage');
  const btn = document.getElementById('cataract-3d-start');
  const status = sec.querySelector('.c3d-status');
  if (stage) {
    stage.hidden = !(c3d.state === 'active' || c3d.state === 'loading');
    if (c3d.host && c3d.host.parentNode !== stage) stage.appendChild(c3d.host);
  }
  if (btn) {
    // aria-busy must be the string "true" (an empty value means false) — BUG-08
    if (c3d.state === 'loading') btn.setAttribute('aria-busy', 'true'); else btn.removeAttribute('aria-busy');
    const label = btn.querySelector('.btn-label');
    if (label) label.textContent = c3d.state === 'loading' ? tr('جارٍ التحميل…', 'Loading…') : tr('ابدأ التجربة ثلاثية الأبعاد', 'Start the 3D experience');
  }
  if (status) status.textContent = c3d.state === 'error' ? tr('تعذر تحميل التجربة ثلاثية الأبعاد على هذا الجهاز. يمكنك المحاولة مرة أخرى.', 'The 3D experience could not load on this device. You can try again.') : '';
}

function closeCataract3D(refocus = true) {
  const ctrl = c3d.controller;
  c3d.controller = null;
  try { if (ctrl) ctrl.destroy(); } catch (e) { /* already torn down */ }
  if (c3d.host) c3d.host.remove();
  c3d.host = null;
  c3d.state = 'idle';
  c3dSync();
  const btn = document.getElementById('cataract-3d-start');
  if (btn && refocus !== false) btn.focus({ preventScroll: true });
}

window.startCataract3D = async function () {
  if (c3d.state === 'loading' || c3d.state === 'active') return;
  c3d.state = 'loading';
  c3d.host = document.createElement('div');
  c3d.host.className = 'c3d-host';
  c3dSync();
  try {
    // Static specifier so Vite code-splits the module (and three.js) out of the main chunk.
    const mod = await import('./src/cataract-sim/index.js');
    const ctrl = await mod.mount(c3d.host, { lang: currentLang, theme: resolvedTheme(), reducedMotion: reducedMotion() });
    if (c3d.state !== 'loading') { ctrl && ctrl.destroy && ctrl.destroy(); return; }
    c3d.controller = ctrl;
    c3d.state = 'active';
    // the visitor may have switched language or theme while the module was loading
    ctrl.setLang(currentLang);
    ctrl.setTheme(resolvedTheme());
    if (ctrl && typeof ctrl.on === 'function') ctrl.on('close', closeCataract3D);
    // The Start button is hidden once the viewer is active; if it held focus (keyboard or tap), hand focus to the
    // viewer's own start control so keyboard users are not dropped to <body> — BUG-06
    const hadFocus = document.activeElement === document.getElementById('cataract-3d-start') || document.activeElement === document.body;
    c3dSync();
    if (hadFocus && c3d.host) {
      const target = [...c3d.host.querySelectorAll('[data-ref="start"], [data-ref="playPause"], [data-ref="viewport"]')].find(el => el.offsetParent !== null);
      if (target) target.focus({ preventScroll: true });
    }
    document.getElementById('cataract-3d-stage')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  } catch (e) {
    console.warn('3D cataract module unavailable:', e);
    if (c3d.host) c3d.host.remove();
    c3d.host = null;
    c3d.controller = null;
    c3d.state = 'error';
    c3dSync();
  }
};
window.closeCataract3D = closeCataract3D;

// /surgical-education/
function renderSurgicalEducationPage() {
  return `
    ${pageHero({
      kicker: tr('التثقيف الجراحي', 'Surgical education'),
      title: tr('جراحة الماء الأبيض، كما تحدث داخل العين', 'Cataract surgery, as it happens inside the eye'),
      lede: tr('تجربة ثلاثية الأبعاد تشرح المراحل الرئيسية للعملية بلغة واضحة. ابدأها عندما تكون مستعداً؛ تُحمَّل فقط عند الضغط على زر البدء.', 'A 3D walkthrough of the main stages of the operation, in plain language. Start it when you are ready; it only loads when you press start.')
    })}
    ${renderCataract3D(false)}
    <section class="section" id="stages" aria-labelledby="stages-title">
      <div class="container stages-grid">
        <div>
          ${sectionHead('', tr('المراحل الرئيسية', 'The main stages'), tr('أربع خطوات في دقائق قليلة', 'Four steps, usually in a short procedure'),
            tr('ملخص مكتوب لما تعرضه التجربة ثلاثية الأبعاد. تختلف التفاصيل بحسب حالة كل عين.', 'A written summary of what the 3D walkthrough shows. Details differ from eye to eye.'), { id: 'stages-title' })}
        </div>
        <ol class="steps steps-lg">
          ${SURGERY_STAGES[currentLang].map(([t, d], i) => `<li><span class="step-num" aria-hidden="true">${i + 1}</span><div><h3>${t}</h3><p>${d}</p></div></li>`).join('')}
        </ol>
      </div>
      <div class="container">
        <aside class="library-note">
          ${icon('book', 22)}
          <p>${tr('التحضير والتعافي والمخاطر بالتفصيل: ', 'Preparation, recovery and risks in detail: ')}<a href="${pageHref(currentLang, 'cataract-surgery')}" data-nav class="text-link">${L(procedureBySlug('cataract-surgery').name)}</a> · <a href="${P('education')}#surgery-journey" data-nav class="text-link">${L(guideBy('surgery-journey').title)}</a> · <a href="${P('lens-lab')}" data-nav class="text-link">${tr('مختبر العدسات', 'The Lens Lab')}</a></p>
        </aside>
      </div>
    </section>
    ${renderClosing('surgical-education')}`;
}

// ============================================================
// /education/ — the medical education library
// ============================================================
function renderQuestionnaireCard() {
  const steps = QUESTIONNAIRE[currentLang];
  if (qCompleted) {
    const blocks = questionnaireResult(qAnswers, currentLang);
    return `
      <div class="questionnaire">
        <div class="q-result" role="status">
          <p class="q-step-label">${tr('الملخص', 'Summary')}</p>
          <h3>${tr('ملخص أولوياتك البصرية جاهز', 'Your discussion summary is ready')}</h3>
          <p class="q-desc">${tr('بناءً على إجاباتك، هذه محاور يُستحسن مناقشتها خلال الاستشارة:', 'Based on your answers, these are topics worth raising in your consultation:')}</p>
          <ol class="q-result-list">
            ${blocks.map(b => `<li class="q-result-item" data-block="${b.id}"><h4>${b.title}</h4><p>${b.text}</p></li>`).join('')}
          </ol>
          <div class="q-actions">
            <a href="${C.bookingUrl}" ${EXT} class="btn btn-primary" data-cta="book"><span class="btn-label">${tr('احجز موعد الفحص', 'Book an examination')}</span></a>
            <a href="${getWhatsAppUrl(tr('مرحباً، أجريت استبيان نمط الحياة البصري على الموقع وأرغب بالاستفسار عن حجز موعد مع د. معن البري.', 'Hello, I completed the visual lifestyle questionnaire on the website and would like to ask about an appointment with Dr. Maan Al Barry.'))}" ${EXT} class="btn btn-whatsapp" data-cta="whatsapp">${glyph('whatsapp')}<span>${tr('واتساب', 'WhatsApp')}</span></a>
            <button type="button" class="btn btn-quiet" onclick="window.print()">${tr('اطبع الملخص', 'Print the summary')}</button>
            <button type="button" class="btn btn-quiet" onclick="restartQ()">${tr('إعادة الاستبيان', 'Restart')}</button>
          </div>
          <p class="q-safety"><strong>${tr('تنبيه:', 'Note:')}</strong> ${tr('هذا الملخص تثقيفي فقط ولا يمثل تشخيصاً أو وصفة لنوع عدسة. القرار الطبي يتخذه الاستشاري بعد الفحص المباشر.', 'This summary is educational only and is not a diagnosis or a lens prescription. Treatment decisions follow an in-person examination.')}</p>
        </div>
      </div>`;
  }
  const cur = steps[currentQStep];
  return `
    <div class="questionnaire">
      <div class="q-progress" aria-hidden="true">${steps.map((_, i) => `<span class="step ${i < currentQStep ? 'done' : ''} ${i === currentQStep ? 'current' : ''}"></span>`).join('')}</div>
      <p class="q-step-label">${tr(`الخطوة ${currentQStep + 1} من 4`, `Step ${currentQStep + 1} of 4`)}</p>
      <h3 class="q-question">${cur.question}</h3>
      <p class="q-desc">${cur.desc}</p>
      <div class="q-options" role="group" aria-label="${cur.question}">
        ${cur.options.map((opt, i) => `<button type="button" class="q-option ${qAnswers[currentQStep] === i ? 'selected' : ''}" aria-pressed="${qAnswers[currentQStep] === i}" onclick="selectQOption(${i})"><span class="q-radio" aria-hidden="true"></span><span>${opt}</span></button>`).join('')}
      </div>
      <div class="q-nav">
        ${currentQStep > 0 ? `<button type="button" class="btn btn-quiet btn-sm" onclick="prevQStep()">${tr('السابق', 'Previous')}</button>` : '<span></span>'}
        <button type="button" class="btn btn-primary btn-sm" onclick="nextQStep()" ${qAnswers[currentQStep] === undefined ? 'disabled' : ''}>
          ${currentQStep < steps.length - 1 ? tr('التالي', 'Next') : tr('عرض الملخص', 'View summary')}
        </button>
      </div>
    </div>`;
}

function guideArticle(g, i) {
  const secs = g.sections[currentLang];
  return `
          <article class="guide" id="${g.id}" aria-labelledby="${g.id}-h">
            <header class="guide-head">
              <span class="guide-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 id="${g.id}-h">${L(g.title)}</h3>
                <p class="guide-summary">${L(g.summary)}</p>
              </div>
            </header>
            <div class="guide-body">
              ${secs.map(([h, text, list]) => `<h4>${h}</h4>${text ? `<p>${text}</p>` : ''}${list ? `<ul class="bullets">${list.map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join('')}</ul>` : ''}`).join('')}
              <p class="guide-more"><a href="${pageHref(currentLang, g.slug)}" data-nav class="text-link">${tr('الدليل الكامل للإجراء', 'Full procedure guide')}: ${L(procedureBySlug(g.slug).name)}${icon('arrow', 16)}</a></p>
            </div>
          </article>`;
}

function redFlagsCard() {
  return `
        <aside class="red-flags" id="red-flags" aria-labelledby="red-flags-title">
          <h2 id="red-flags-title">${icon('alert', 20)}<span>${L(RED_FLAGS.title)}</span></h2>
          <ul>${RED_FLAGS.items[currentLang].map(t => `<li>${t}</li>`).join('')}</ul>
          <p>${L(RED_FLAGS.action)}</p>
        </aside>`;
}

function renderEducationPage() {
  return `
    ${pageHero({
      kicker: tr('مكتبة التثقيف الصحي', 'Patient education library'),
      title: tr('افهم عينك قبل موعدك', 'Understand your eye before your visit'),
      lede: tr('أدلة مبسّطة، واستبيان يرتب أولوياتك قبل الاستشارة، وعلامات تستوجب رعاية عاجلة. محتوى توعوي عام بانتظار مراجعة د. معن، ولا يغني عن الفحص.', 'Plain-language guides, a questionnaire that organises your priorities before the consultation, and the warning signs that need urgent care. General education pending Dr. Maan’s review; it does not replace an examination.')
    })}
    <section class="section" id="guides" aria-labelledby="guides-title">
      <div class="container edu-library">
        <nav class="edu-toc" aria-label="${tr('في هذه الصفحة', 'On this page')}">
          <p class="drawer-label">${tr('في هذه الصفحة', 'On this page')}</p>
          <ol>
            ${GUIDES.map(g => `<li><a href="${hereHref(g.id)}" data-nav>${L(g.title)}</a></li>`).join('')}
            <li><a href="${hereHref('questionnaire')}" data-nav>${tr('استبيان نمط الحياة البصري', 'Visual lifestyle questionnaire')}</a></li>
            <li><a href="${hereHref('red-flags')}" data-nav>${L(RED_FLAGS.title)}</a></li>
            <li><a href="${hereHref('more-questions')}" data-nav>${tr('أسئلة شائعة', 'Common questions')}</a></li>
          </ol>
        </nav>
        <div class="edu-main">
          <h2 class="sub-title" id="guides-title">${tr('الأدلة', 'Guides')}</h2>
          ${GUIDES.map(guideArticle).join('')}
        </div>
      </div>
    </section>

    <section class="section section-band" id="education" aria-labelledby="q-title">
      <div class="container">
        <div class="q-layout" id="questionnaire">
          <div class="q-intro fade-in">
            <p class="kicker"><span>${tr('استبيان نمط الحياة البصري', 'Visual lifestyle questionnaire')}</span></p>
            <h2 id="q-title">${tr('أربعة أسئلة قبل موعدك', 'Four questions before your visit')}</h2>
            <p>${tr('أداة تثقيفية تساعدك على ترتيب أولوياتك اليومية قبل جلسة الفحص والاستشارة، وتعرض ملخصاً بحسب إجاباتك. لا تُحفظ إجاباتك ولا تُرسل.', 'An educational tool that organises your daily priorities before the consultation and shows a summary based on your answers. Your answers are not stored or sent.')}</p>
          </div>
          <div id="questionnaire-card-container" class="fade-in">${renderQuestionnaireCard()}</div>
        </div>
      </div>
    </section>

    <section class="section" id="safety" aria-label="${tr('السلامة والأسئلة', 'Safety and questions')}">
      <div class="container safety-grid">
        ${redFlagsCard()}
        <div id="more-questions">
          <h2 class="sub-title">${tr('أسئلة شائعة', 'Common questions')}</h2>
          <ul class="link-list">
            <li><a href="${pageHref()}#faq" data-nav>${tr('أسئلة عامة عن د. معن والعيادة والحجز', 'General questions about Dr. Maan, the clinic and booking')}${icon('arrow', 16)}</a></li>
            ${PROCEDURES.map(p => `<li><a href="${pageHref(currentLang, p.slug)}#p-faq" data-nav>${tr('أسئلة عن ', 'Questions about ')}${L(p.name)}${icon('arrow', 16)}</a></li>`).join('')}
          </ul>
        </div>
      </div>
    </section>
    ${renderClosing('education')}`;
}

// ============================================================
// /clinic/ — clinic & booking
// ============================================================
function renderClinicPage() {
  return `
    ${pageHero({
      kicker: tr('العيادة والحجز', 'Clinic & booking'),
      title: tr('موعدك مع د. معن البري', 'Your appointment with Dr. Maan Al Barry'),
      lede: tr(`يستقبل د. معن مراجعيه في ${D.clinic.name.ar}، طريق المطار. ثلاث طرق للحجز، ومواعيد ثابتة، وخطوات واضحة للزيارة.`, `Dr. Maan sees patients at ${D.clinic.name.en}, Airport Road. Three ways to book, regular hours and a clear visit pathway.`)
    })}
    <section class="section" id="clinic" aria-label="${tr('طرق الحجز', 'Ways to book')}">
      <div class="container clinic-grid">
        ${bookingWays()}
        <div class="clinic-side">${visitFacts({ map: true })}</div>
      </div>
    </section>
    <section class="section section-band" id="visit" aria-labelledby="visit-title">
      <div class="container">
        ${sectionHead('', tr('زيارتك', 'Your visit'), tr('من الفحص إلى المتابعة', 'From examination to follow-up'),
          tr('أربع خطوات واضحة. لا تحتاج إلى معرفة اسم الإجراء مسبقاً؛ يبدأ كل شيء بفحص شامل.', 'Four clear steps. You do not need to know the procedure name in advance; everything starts with a full examination.'), { cls: 'section-head-split', id: 'visit-title' })}
        <ol class="pathway fade-in">
          ${VISIT.map((s, i) => `<li class="path-step"><span class="path-num" aria-hidden="true">${i + 1}</span><h3>${L(s)[0]}</h3><p>${L(s)[1]}</p></li>`).join('')}
        </ol>
        <div class="assess fade-in">
          <h3 class="sub-title">${tr('قبل أي إجراء: الفحوصات الأساسية', 'Before any procedure: the core assessments')}</h3>
          <ul class="tech-grid" aria-label="${tr('الفحوصات', 'Assessments')}">
            ${ASSESSMENTS.map((a, i) => `<li class="tech-item"><span class="tech-num" aria-hidden="true">${i + 1}</span><h4>${L(a)[0]}</h4><p>${L(a)[1]}</p></li>`).join('')}
          </ul>
        </div>
        <p class="bring">${icon('info', 18)}<span>${tr('أحضر معك: النظارة الحالية أو العدسات اللاصقة، وأي تقارير أو صور فحوصات سابقة، وقائمة بأدويتك.', 'Bring: your current glasses or contact lenses, any previous reports or scans, and a list of your medicines.')}</span></p>
      </div>
    </section>
    ${renderClosing('clinic')}`;
}

// Closing booking band (section pages and procedure pages).
function renderClosing(key) {
  return `
    <section class="closing" aria-labelledby="closing-title-${key}">
      <div class="container closing-inner">
        <div>
          <p class="kicker"><span>${tr('مغربي المدينة المنورة · طريق المطار', 'Magrabi Madinah · Airport Road')}</span></p>
          <h2 id="closing-title-${key}">${tr('موعدك مع د. معن البري يبدأ بخطوة', 'Your appointment with Dr. Maan starts here')}</h2>
        </div>
        <div class="closing-actions">
          <a href="${C.bookingUrl}" ${EXT} class="btn btn-light btn-lg" data-cta="book"><span class="btn-label">${tr('احجز موعداً', 'Book appointment')}</span>${icon('arrow', 18)}</a>
          <a href="${getWhatsAppUrl()}" ${EXT} class="btn btn-whatsapp btn-lg" data-cta="whatsapp">${glyph('whatsapp')}<span>${tr('واتساب العيادة', 'Clinic WhatsApp')}</span></a>
          <a href="${D.clinic.mapUrl}" ${EXT} class="btn btn-ghost-light btn-lg">${icon('pin', 18)}<span>${tr('موقع المستشفى', 'Hospital location')}</span></a>
        </div>
      </div>
    </section>`;
}

// ============================================================
// PROCEDURE PAGE — /procedures/<slug>/ and /en/procedures/<slug>/
// ============================================================
const PROC_SECTIONS = [
  ['anatomy', 'التشريح: أين يحدث الإجراء؟', 'Anatomy: where it happens'],
  ['purpose', 'الهدف من الإجراء', 'What it is for'],
  ['types', 'الأنواع والخيارات', 'Types and options'],
  ['candidates', 'لمن قد يكون مناسباً؟', 'Who may be considered'],
  ['steps', 'ماذا يحدث؟ شرح مبسّط', 'What happens, in plain words'],
  ['benefits', 'الفوائد والحدود', 'Benefits and limitations'],
  ['risks', 'المخاطر والمضاعفات المحتملة', 'Risks and possible complications'],
  ['recovery', 'التعافي', 'Recovery'],
  ['faq', 'أسئلة شائعة', 'Questions']
];

function reviewStatus(cls = '') {
  return `<p class="review-status ${cls}" role="note">${icon('draft', 18)}<span><strong>${tr('حالة المراجعة الطبية:', 'Medical review status:')}</strong> ${tr('مسودة بانتظار مراجعة د. معن', 'draft pending review by Dr. Maan')}</span></p>`;
}

function renderProcedurePage(p) {
  const c = PROC && PROC.CONTENT[p.slug] ? PROC.CONTENT[p.slug][currentLang] : null;
  const g = groupOf(p.group);
  const sections = c ? PROC_SECTIONS.filter(([id]) => id !== 'types' || c.types) : [];
  const list = (items, cls = '') => `<ul class="bullets ${cls}">${items.map(t => `<li>${t}</li>`).join('')}</ul>`;
  const sec = (id, inner) => {
    const s = PROC_SECTIONS.find(x => x[0] === id);
    return `<section class="proc-sec" id="p-${id}" aria-labelledby="p-${id}-h"><h2 id="p-${id}-h">${tr(s[1], s[2])}</h2>${inner}</section>`;
  };
  // Cataract recovery: the post-operative photograph restored from R5 (matrix I8; origin to be confirmed by the owner).
  const phaco = p.slug === 'cataract-surgery' ? `<figure class="proc-photo"><img src="images/surgery-phaco.jpg" width="512" height="279" loading="lazy" decoding="async" alt="${tr('قطرات العين ونظارة واقية ونشرة إرشادات على طاولة معقمة: أدوات شائعة بعد جراحة الماء الأبيض', 'Eye drops, protective glasses and an instruction leaflet on a sterile drape: common items after cataract surgery')}"><figcaption>${tr('أدوات شائعة بعد العملية: القطرات الموصوفة، ونظارة واقية، وتعليمات مكتوبة.', 'Common items after surgery: the prescribed drops, protective glasses and written instructions.')}</figcaption></figure>` : '';
  const body = !c ? `<p class="proc-loading" role="status">${tr('جارٍ تحميل المحتوى…', 'Loading content…')}</p>` : `
        ${sec('anatomy', `<div class="anat"><p>${c.anatomy.text}</p><dl class="anat-parts">${c.anatomy.parts.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl></div>`)}
        ${sec('purpose', `<p class="proc-p-lg">${c.purpose}</p>`)}
        ${c.types ? sec('types', `<ul class="types">${c.types.map(([n, code, d]) => `<li class="type"><p class="type-code"><bdi dir="ltr">${code}</bdi></p><h3>${n}</h3><p>${d}</p></li>`).join('')}</ul>${p.slug === 'lens-implants' || p.slug === 'cataract-surgery' ? `<p class="proc-note">${icon('lens', 18)}<span>${tr('قارن العدسات مسافةً بمسافة في ', 'Compare lenses distance by distance in the ')}<a href="${P('lens-lab')}" data-nav class="text-link">${tr('مختبر الرؤية والعدسات', 'Vision & Lens Lab')}</a></span></p>` : ''}`) : ''}
        ${sec('candidates', `${list(c.candidates, 'bullets-check')}<p class="proc-note">${icon('info', 18)}<span>${tr('اعتبارات عامة فقط؛ يحدد الطبيب الملاءمة بعد فحص عينك.', 'General considerations only; suitability is decided by your doctor after examining your eye.')}</span></p>`)}
        ${sec('steps', `<ol class="steps">${c.steps.map((t, i) => `<li><span class="step-num" aria-hidden="true">${i + 1}</span><p>${t}</p></li>`).join('')}</ol>`)}
        ${sec('benefits', `<div class="two-col"><div class="pane pane-pos"><h3>${icon('check', 18)}${tr('الفوائد المحتملة', 'Possible benefits')}</h3>${list(c.benefits)}</div><div class="pane"><h3>${icon('minus', 18)}${tr('الحدود', 'Limitations')}</h3>${list(c.limitations)}</div></div>`)}
        ${sec('risks', `${list(c.risks)}<p class="proc-note proc-note-alert">${icon('alert', 18)}<span>${tr('تواصل مع العيادة فوراً عند ألم متزايد، أو احمرار شديد، أو تراجع مفاجئ في الرؤية.', 'Contact the clinic at once for increasing pain, marked redness or a sudden drop in vision.')}</span></p>`)}
        ${sec('recovery', `${list(c.recovery)}${phaco}`)}
        ${sec('faq', `<div class="faq-list">${c.faq.map((f, i) => `
          <div class="faq-item" id="pfaq-${i}">
            <h3 class="faq-heading"><button type="button" class="faq-question" onclick="toggleFaq(${i},'pfaq')" aria-expanded="false" aria-controls="pfaq-answer-${i}"><span>${f.q}</span><span class="faq-icon" aria-hidden="true">${icon('plus', 20)}</span></button></h3>
            <div class="faq-answer" id="pfaq-answer-${i}" role="region"><p>${f.a}</p></div>
          </div>`).join('')}</div>`)}
        <aside class="proc-sources">
          <h2 class="sub-title">${tr('المصادر والمراجعة', 'Sources and review')}</h2>
          <p>${tr('معلومات توعوية عامة أُعدت من مصادر طبية للمرضى، ولا تغني عن الفحص والاستشارة:', 'General patient education prepared from these patient-information sources; it does not replace an examination:')}</p>
          <ul>${(PROC.SOURCES[p.slug] || []).map(([label, url]) => `<li><a href="${url}" ${EXT} class="text-link">${label}${icon('external', 14)}</a></li>`).join('')}</ul>
          ${reviewStatus()}
        </aside>`;
  const related = p.related.map(procedureBySlug).filter(Boolean);
  return `
  <article class="proc-page" data-slug="${p.slug}">
    <header class="proc-hero">
      <div class="container">
        ${crumbs(breadcrumbFor(currentLang, p.slug))}
        <div class="proc-hero-grid">
          <div class="proc-hero-text">
            <p class="kicker"><span>${L(g)}</span></p>
            <h1 class="proc-title">${L(p.name)}</h1>
            <p class="proc-lede">${c ? c.intro : L(p.summary)}</p>
            ${reviewStatus('review-status-hero')}
            <div class="proc-cta">
              <a href="${C.bookingUrl}" ${EXT} class="btn btn-primary btn-lg" data-cta="book">${icon('calendar', 20)}<span class="btn-label">${tr('احجز استشارة مع د. معن', 'Book a consultation with Dr. Maan')}</span></a>
              <a href="${getWhatsAppUrl()}" ${EXT} class="btn btn-quiet btn-lg" data-cta="whatsapp">${glyph('whatsapp')}<span>${tr('اسأل عبر واتساب', 'Ask on WhatsApp')}</span></a>
            </div>
            ${p.simulator ? `<p class="proc-3d-jump"><a href="${hereHref('cataract-3d')}" data-nav class="text-link">${icon('cube', 18)}<span>${tr('شاهد شرح العملية ثلاثي الأبعاد', 'Watch the 3D walkthrough')}</span></a></p>` : ''}
          </div>
          <figure class="proc-figure">
            ${illustration(p, { eager: true, cls: 'proc-hero-illus', sizes: '(min-width: 960px) 45vw, 100vw' })}
            <figcaption>${L(p.alt)}</figcaption>
          </figure>
        </div>
      </div>
    </header>

    <div class="container proc-layout">
      ${c ? `<nav class="proc-toc" aria-label="${tr('في هذه الصفحة', 'On this page')}">
        <p class="drawer-label">${tr('في هذه الصفحة', 'On this page')}</p>
        <ol>${sections.map(([id, ar, en]) => `<li><a href="${hereHref(`p-${id}`)}" data-nav>${tr(ar, en)}</a></li>`).join('')}${p.simulator ? `<li><a href="${hereHref('cataract-3d')}" data-nav>${tr('التجربة ثلاثية الأبعاد', '3D walkthrough')}</a></li>` : ''}</ol>
      </nav>` : ''}
      <div class="proc-body">${body}</div>
    </div>

    ${p.simulator ? renderCataract3D(true) : ''}

    <section class="section section-band proc-related" aria-labelledby="related-title">
      <div class="container">
        <header class="section-head"><p class="kicker"><span>${tr('تابع القراءة', 'Keep reading')}</span></p><h2 id="related-title">${tr('إجراءات ذات صلة', 'Related procedures')}</h2></header>
        <div class="related-grid">${related.map(r => procCard(r, { compact: true })).join('')}</div>
        <p class="related-more"><a href="${P('procedures')}" data-nav class="text-link">${tr('جميع الإجراءات', 'All procedures')}${icon('arrow', 16)}</a></p>
      </div>
    </section>

    <section class="closing proc-book" aria-labelledby="proc-book-title">
      <div class="container closing-inner">
        <div>
          <p class="kicker"><span>${tr('الخطوة التالية', 'Next step')}</span></p>
          <h2 id="proc-book-title">${tr(`ناقش ${p.name.ar} مع د. معن البري`, `Discuss ${p.name.en.toLowerCase().startsWith('icl') ? p.name.en : p.name.en.charAt(0).toLowerCase() + p.name.en.slice(1)} with Dr. Maan Al Barry`)}</h2>
          <p class="closing-sub">${tr('يبدأ كل قرار علاجي بفحص شامل لعينك.', 'Every treatment decision starts with a full examination of your eye.')}</p>
        </div>
        <div class="closing-actions">
          <a href="${C.bookingUrl}" ${EXT} class="btn btn-light btn-lg" data-cta="book"><span class="btn-label">${tr('احجز موعداً', 'Book appointment')}</span>${icon('arrow', 18)}</a>
          <a href="tel:${C.clinicDirect.tel}" class="btn btn-ghost-light btn-lg" data-cta="call">${icon('phone', 18)}<span><bdi dir="ltr">${C.clinicDirect.display}</bdi></span></a>
          <a href="${D.clinic.mapUrl}" ${EXT} class="btn btn-ghost-light btn-lg">${icon('pin', 18)}<span>${tr('موقع المستشفى', 'Hospital location')}</span></a>
        </div>
      </div>
    </section>
  </article>`;
}

// --- FOOTER ---
function renderFooter() {
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <p class="footer-name">${L(D.identity.name)}</p>
          <p class="footer-title">${L(D.identity.title)}</p>
          <p class="footer-place">${L(D.clinic.name)} · ${L(D.clinic.address)}</p>
          <div class="social-row">
            <a href="${D.social.instagram}" ${EXT} class="icon-btn" aria-label="Instagram">${glyph('instagram')}</a>
            <a href="${D.social.twitter}" ${EXT} class="icon-btn" aria-label="X (Twitter)">${glyph('x', 16)}</a>
            <a href="${D.social.youtube}" ${EXT} class="icon-btn" aria-label="YouTube">${glyph('youtube')}</a>
            <a href="${getWhatsAppUrl()}" ${EXT} class="icon-btn" aria-label="WhatsApp" data-cta="whatsapp">${glyph('whatsapp')}</a>
          </div>
        </div>
        <nav class="footer-col" aria-label="${tr('صفحات الموقع', 'Site pages')}">
          <h3>${tr('الموقع', 'Site')}</h3>
          <a href="${pageHref()}" data-nav>${tr('الرئيسية', 'Home')}</a>
          ${SECTION_PAGES.map(s => `<a href="${P(s.key)}" data-nav>${L(s.crumb)}</a>`).join('')}
        </nav>
        <nav class="footer-col footer-procs" aria-label="${tr('الإجراءات', 'Procedures')}">
          <h3>${tr('الإجراءات', 'Procedures')}</h3>
          ${PROCEDURES.map(p => `<a href="${pageHref(currentLang, p.slug)}" data-nav>${L(p.name)}</a>`).join('')}
        </nav>
        <div class="footer-col">
          <h3>${tr('التواصل', 'Contact')}</h3>
          <a href="tel:${C.clinicDirect.tel}" data-cta="call">${tr('عيادة الدكتور: ', 'Clinic line: ')}<bdi dir="ltr">${C.clinicDirect.display}</bdi></a>
          <a href="tel:${C.callCenter.tel}" data-cta="call">${tr('مركز اتصال مغربي: ', 'Magrabi contact center: ')}<bdi dir="ltr">${C.callCenter.display}</bdi></a>
          <a href="${C.bookingUrl}" ${EXT}>${tr('بوابة الحجز الإلكتروني', 'Online booking')}</a>
          <a href="${D.clinic.mapUrl}" ${EXT}>${tr('مغربي طريق المطار (خرائط جوجل)', 'Airport Road, Madinah (Maps)')}</a>
          <p class="footer-hours">${L(D.clinic.workingHours)}</p>
        </div>
      </div>

      <div class="footer-notices">
        <p class="footer-disclaimer"><strong>${tr('إخلاء مسؤولية طبي:', 'Medical disclaimer:')}</strong> ${L(DISCLAIMER)}</p>
        <p class="footer-disclaimer"><strong>${tr('عن المحتوى التثقيفي:', 'About the educational content:')}</strong> ${tr('الأدلة والأدوات التفاعلية توضيحية، أُعدت من مصادر طبية للمرضى وهي بانتظار مراجعة د. معن، ولا تتنبأ بنتيجة عينك.', 'Guides and interactive tools are educational illustrations from patient-information sources, pending Dr. Maan’s review; they do not predict your own result.')}</p>
      </div>

      <div class="footer-bottom">
        <p>© ${new Date().getFullYear()} ${L(D.identity.name)} — ${tr('جميع الحقوق محفوظة', 'All rights reserved')}</p>
        <p class="footer-links">
          <a href="${D.social.magrabiProfile}" ${EXT}>${tr('الملف الطبي في مغربي', 'Magrabi profile')}</a>
          <a href="${D.social.taibahProfile}" ${EXT}>${tr('ملف جامعة طيبة', 'Taibah University profile')}</a>
          <a href="${D.clinic.mapUrl}" ${EXT}>Google Maps</a>
        </p>
      </div>
    </div>
  </footer>`;
}

// --- FIXED MOBILE BOOKING BAR ---
// Three primary actions only (book, call, WhatsApp).
function renderBookingBar() {
  const call = C.callCenter;
  return `
  <nav class="booking-bar" id="booking-bar" aria-label="${tr('إجراءات الحجز السريعة', 'Quick booking actions')}">
    <div class="booking-bar-inner">
      <a href="${C.bookingUrl}" ${EXT} class="booking-action booking-action-book" data-cta="book">${icon('calendar', 20)}<span>${tr('احجز موعداً', 'Book')}</span></a>
      <a href="tel:${call.tel}" class="booking-action booking-action-call" data-cta="call" aria-label="${tr(`اتصال بمركز اتصال مغربي ${call.display}`, `Call Magrabi contact center ${call.display}`)}">${icon('phone', 20)}<span>${tr('اتصال', 'Call')}</span></a>
      <a href="${getWhatsAppUrl()}" ${EXT} class="booking-action booking-action-whatsapp" data-cta="whatsapp" aria-label="${tr('واتساب عيادة د. معن', 'Dr. Maan’s clinic on WhatsApp')}">${glyph('whatsapp', 20)}<span>${tr('واتساب', 'WhatsApp')}</span></a>
    </div>
  </nav>`;
}

// --- HEAD METADATA (client-side navigation keeps it in step with the prerendered pages) ---
function updateHead(full) {
  const meta = pageMeta(currentLang, route.slug, route.page);
  document.title = meta.title;
  if (!full) return;
  const set = (sel, attr, val) => { const el = document.querySelector(sel); if (el) el.setAttribute(attr, val); };
  const url = (lang) => `${SITE_URL}/${pathFor(lang, route.slug, route.page)}`;
  set('meta[name="description"]', 'content', meta.description);
  set('link[rel="canonical"]', 'href', url(currentLang));
  set('link[rel="alternate"][hreflang="ar"]', 'href', url('ar'));
  set('link[rel="alternate"][hreflang="en"]', 'href', url('en'));
  set('link[rel="alternate"][hreflang="x-default"]', 'href', url('ar'));
  set('meta[property="og:url"]', 'content', url(currentLang));
  set('meta[property="og:title"]', 'content', meta.title);
  set('meta[property="og:description"]', 'content', meta.description);
  set('meta[name="twitter:title"]', 'content', meta.title);
  set('meta[name="twitter:description"]', 'content', meta.description);
  set('meta[property="og:locale"]', 'content', currentLang === 'ar' ? 'ar_SA' : 'en_US');
  set('meta[property="og:locale:alternate"]', 'content', currentLang === 'ar' ? 'en_US' : 'ar_SA');
  const ld = document.querySelector('script[type="application/ld+json"]');
  if (ld) {
    const trail = breadcrumbFor(currentLang, route.slug, route.page);
    let graph;
    if (route.slug) graph = buildProcedureJsonLd(route.slug, currentLang, url(currentLang), SITE_URL, PROC ? PROC.CONTENT[route.slug][currentLang].faq : [], trail);
    else if (route.page !== 'home') graph = buildSectionJsonLd(route.page, currentLang, url(currentLang), SITE_URL, meta, trail, { procedureUrls: PROCEDURES.map(p => ({ name: L(p.name), url: `${SITE_URL}/${pathFor(currentLang, p.slug)}` })) });
    else graph = buildJsonLd();
    ld.textContent = JSON.stringify(graph, null, 2);
  }
}

// --- THEME ---
function applyTheme() {
  const theme = resolvedTheme();
  document.documentElement.setAttribute('data-theme', theme);
  const isDark = theme === 'dark';
  const label = isDark ? tr('الوضع الليلي مفعّل، انقر للتحويل للوضع النهاري', 'Dark mode on. Switch to light mode')
    : tr('الوضع النهاري مفعّل، انقر للتحويل للوضع الليلي', 'Light mode on. Switch to dark mode');
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.setAttribute('aria-checked', String(isDark));
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  });
  // procedure renders have a dark-studio variant
  document.querySelectorAll('.illus img[data-dark]').forEach(img => {
    const want = isDark ? img.dataset.dark : img.dataset.light;
    const wantSet = isDark ? img.dataset.darkSet : img.dataset.lightSet;
    if (wantSet && img.getAttribute('srcset') !== wantSet) img.setAttribute('srcset', wantSet);
    if (img.getAttribute('src') !== want) img.setAttribute('src', want);
  });
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', isDark ? '#0F1514' : '#F6F3EC');
  if (vsim.ctrl) { try { vsim.ctrl.setTheme(theme); } catch (e) { /* module handles its own errors */ } }
  lensLab.setTheme(theme);
  lightJourney.setTheme(theme);
  if (c3d.controller && typeof c3d.controller.setTheme === 'function') {
    try { c3d.controller.setTheme(theme); } catch (e) { /* module handles its own errors */ }
  }
}

darkQuery.addEventListener('change', () => { if (!savedTheme) applyTheme(); });

window.toggleTheme = function () {
  savedTheme = resolvedTheme() === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', savedTheme); } catch (e) { /* storage unavailable: session-only */ }
  applyTheme();
};
window.cycleTheme = window.toggleTheme;

// --- LANGUAGE: switches to the same page in the other language (its own URL) ---
window.toggleLang = function () {
  const lang = currentLang === 'ar' ? 'en' : 'ar';
  try { localStorage.setItem('lang', lang); } catch (e) { /* storage unavailable: session-only */ }
  currentQStep = 0;
  qAnswers = [];
  qCompleted = false;
  go({ lang, slug: route.slug, page: route.page }, { scrollTo: 0 });
};

// --- CLIENT-SIDE NAVIGATION ---
// Commit a route: push history, re-render, then scroll (to a section, a saved position or the top).
const samePage = (a, b) => a.lang === b.lang && a.slug === b.slug && a.page === b.page;
function go(next, { push = true, hash = '', scrollTo = null } = {}) {
  const commit = () => {
    const changed = !samePage(next, route);
    if (changed) {
      if (push) {
        history.replaceState({ ...(history.state || {}), y: window.scrollY }, '');
        history.pushState({ y: 0 }, '', new URL(pathFor(next.lang, next.slug, next.page) + hash, SITE_ROOT));
      }
      route = { lang: next.lang, slug: next.slug, page: next.page, known: true };
      currentLang = next.lang;
      renderApp(true);
    } else if (push && hash) {
      history.replaceState(history.state, '', new URL(pathFor(next.lang, next.slug, next.page) + hash, SITE_ROOT));
    }
    const target = hash ? hash.slice(1) : null;
    if (target && document.getElementById(target)) {
      requestAnimationFrame(() => window.scrollToSection(target));
    } else if (changed || scrollTo !== null) {
      window.scrollTo(0, scrollTo || 0);
      if (changed && push) document.querySelector('main h1, #main')?.focus({ preventScroll: true });
    }
  };
  if (next.slug && !PROC) loadProcedureContent().then(commit, commit); else commit();
}

// One delegated handler for every internal link (data-nav): header, drawer, cards, breadcrumbs, TOC.
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[data-nav]');
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const rel = relOf(a.href);
  if (rel === null) return;
  e.preventDefault();
  setMobileMenu(false);
  const next = parseRoute(rel);
  go(next, { hash: new URL(a.href).hash });
});

window.addEventListener('popstate', e => {
  const next = parseRoute(relOf(location.href) || '');
  const y = e.state && typeof e.state.y === 'number' ? e.state.y : 0;
  const hash = location.hash;
  if (samePage(next, route)) {
    if (hash && document.getElementById(hash.slice(1))) window.scrollToSection(hash.slice(1));
    return;
  }
  go(next, { push: false, scrollTo: y });
  // restore the reading position once the page has rendered
  requestAnimationFrame(() => window.scrollTo(0, y));
});

window.scrollToSection = function (id) {
  const el = document.getElementById(id);
  if (!el) return;
  const headerOffset = document.getElementById('site-header')?.offsetHeight || 68;
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset - 8;
  window.scrollTo({ top, behavior: reducedMotion() ? 'auto' : 'smooth' });
};

// --- MOBILE DRAWER ---
function setMobileMenu(open) {
  const nav = document.getElementById('mobile-nav');
  if (!nav) return;
  nav.classList.toggle('open', open);
  document.documentElement.classList.toggle('drawer-open', open);
  document.querySelectorAll('.mobile-menu-btn').forEach(b => b.setAttribute('aria-expanded', String(open)));
}

window.toggleMobileMenu = function () {
  const nav = document.getElementById('mobile-nav');
  setMobileMenu(!(nav && nav.classList.contains('open')));
};

window.closeMobileMenu = function () { setMobileMenu(false); };

// Escape closes the drawer and returns focus to its button (registered once; survives re-renders).
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const nav = document.getElementById('mobile-nav');
  if (nav && nav.classList.contains('open')) {
    setMobileMenu(false);
    const btn = document.querySelector('.mobile-menu-btn');
    if (btn) btn.focus();
  }
});

// --- PROCEDURE LIBRARY FILTER ---
window.filterProcedures = function (id) {
  procFilter = id;
  const grid = document.querySelector('.proc-grid');
  if (grid) grid.dataset.filter = id;
  document.querySelectorAll('.proc-filter .chip').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === id)));
  document.querySelectorAll('.proc-grid .proc-card').forEach(card => { card.hidden = id !== 'all' && card.dataset.group !== id; });
};

// --- QUESTIONNAIRE ---
window.updateQuestionnaireUI = function () {
  const container = document.getElementById('questionnaire-card-container');
  if (container) container.innerHTML = renderQuestionnaireCard();
};
window.selectQOption = function (optIdx) { qAnswers[currentQStep] = optIdx; window.updateQuestionnaireUI(); };
window.nextQStep = function () {
  if (qAnswers[currentQStep] === undefined) return;
  if (currentQStep < 3) currentQStep++; else qCompleted = true;
  window.updateQuestionnaireUI();
};
window.prevQStep = function () { if (currentQStep > 0) { currentQStep--; window.updateQuestionnaireUI(); } };
window.restartQ = function () { currentQStep = 0; qAnswers = []; qCompleted = false; window.updateQuestionnaireUI(); };

// --- ACCORDIONS ---
window.toggleFaq = function (idx, prefix = 'faq') {
  const item = document.getElementById(`${prefix}-${idx}`);
  if (item) {
    const open = item.classList.toggle('open');
    const btn = item.querySelector('.faq-question');
    if (btn) btn.setAttribute('aria-expanded', String(open));
  }
};

// --- REVEAL ON SCROLL ---
let fadeObserver = null;
function observeIntersection() {
  if (fadeObserver) fadeObserver.disconnect();
  const observer = fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function headerScrollShadow() {
  // renderApp() runs again on every navigation; register the listener only once.
  if (window.__headerShadowBound) return;
  window.__headerShadowBound = true;
  window.addEventListener('scroll', () => {
    const header = document.getElementById('site-header');
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  }, { passive: true });
}

// --- MASTER APPLICATION RENDERER ---
// `navigated` = true after a client-side route change (head metadata is rewritten then; on the
// first render the prerendered head is already correct for this URL).
const PAGE_RENDERERS = {
  home: renderHome,
  about: renderAboutPage,
  procedures: renderProceduresPage,
  'lens-lab': renderLensLabPage,
  'surgical-education': renderSurgicalEducationPage,
  education: renderEducationPage,
  'how-vision-works': renderLightJourneyPage,
  clinic: renderClinicPage
};
function renderApp(navigated = false) {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = (currentLang === 'ar' ? 'rtl' : 'ltr');
  const key = route.slug ? 'procedure' : route.page;
  document.body.className = `${currentLang === 'en' ? 'lang-en' : 'lang-ar'} ${route.slug ? 'is-procedure' : `is-${route.page === 'home' ? 'home' : 'section'}`}`;
  updateHead(navigated);

  const app = document.getElementById('app');
  if (!app) return;

  // Keep a running 3D scene alive across the re-render: detach its host, re-insert it afterwards.
  if (c3d.host) c3d.host.remove();
  setMobileMenu(false);

  const proc = route.slug ? procedureBySlug(route.slug) : null;
  app.innerHTML = `
    <a class="skip-link" href="${hereHref('main')}">${tr('تخطَّ إلى المحتوى', 'Skip to content')}</a>
    ${renderHeader()}
    <main id="main" tabindex="-1" data-page="${key}">
      ${proc ? renderProcedurePage(proc) : (PAGE_RENDERERS[route.page] || renderHome)()}
    </main>
    ${renderFooter()}
    ${renderBookingBar()}
  `;

  applyTheme();
  observeIntersection();
  headerScrollShadow();
  if (route.page === 'procedures') window.filterProcedures(procFilter);

  // 3D: survives re-renders on pages that host it; torn down when the visitor leaves them.
  if ((c3d.state === 'active' || c3d.state === 'loading') && !document.getElementById('cataract-3d-stage')) closeCataract3D(false);
  c3dSync();
  if (c3d.controller && typeof c3d.controller.setLang === 'function') {
    try { c3d.controller.setLang(currentLang); } catch (e) { /* module handles its own errors */ }
  }

  mountVisionSim();
  lensLab.sync();
  lightJourney.sync();

  if (proc && !PROC) loadProcedureContent().then(() => { if (route.slug === proc.slug) renderApp(navigated); }, () => {});
}

// Initialize: on a procedure URL, wait for its content so the prerendered page is replaced only
// by an equally complete one (no flash of a loading state).
// A deep link such as /en/procedures/icl/#p-risks: the browser scrolled to the anchor in the prerendered markup,
// but replacing #app collapses the document for a moment and that position is lost. Re-apply it once the app
// has rendered (instantly — this is a page load, not a click) — BUG-12.
function applyInitialHash() {
  let id = '';
  try { id = decodeURIComponent(location.hash.slice(1)); } catch (e) { return; }
  const el = id && document.getElementById(id);
  if (!el) return;
  const headerOffset = document.getElementById('site-header')?.offsetHeight || 68;
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - headerOffset - 8);
}
const boot = () => { renderApp(false); requestAnimationFrame(applyInitialHash); };
if (route.slug) loadProcedureContent().then(boot, boot);
else boot();
