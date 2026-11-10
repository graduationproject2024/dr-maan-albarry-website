// ============================================================
// SECTION PATTERNS — the markup the existing pages share, as small render helpers, so a future section is built from
// the same design system. Each helper returns the HTML its page already used; class names, order and attributes are
// unchanged, and all styling stays in style.css. Text arrives already in the current language.
// Where each pattern is used: docs/implementation/premium-ux-refinement/FUTURE_SECTIONS_ARCHITECTURE.md
// ============================================================

export function createSectionPatterns({ icon, tr }) {
  /** Editorial introduction: the band at the top of a section page (kicker, h1, lede, optional aside). */
  function editorialIntro({ breadcrumb = '', kicker, title, lede, aside = '', after = '', cls = '' }) {
    return `
  <header class="page-hero ${cls}">
    <div class="container">
      ${breadcrumb}
      <div class="page-hero-grid${aside ? ' has-aside' : ''}">
        <div class="page-hero-text">
          <p class="kicker"><span>${kicker}</span></p>
          <h1 class="page-title">${title}</h1>
          ${lede ? `<p class="page-lede">${lede}</p>` : ''}
          ${after}
        </div>
        ${aside}
      </div>
    </div>
  </header>`;
  }

  /** Image and text side by side, with a list of links (the fields of expertise on /about/). */
  function imageTextSplit({ figure, code, title, text, links }) {
    return `<article class="area fade-in">
            <div class="area-fig">${figure}</div>
            <div class="area-body">
              <p class="pc-code"><bdi dir="ltr" class="pc-pl">${code}</bdi></p>
              <h3>${title}</h3>
              <p>${text}</p>
              <ul class="area-links">${links.map(l => `<li>${l}</li>`).join('')}</ul>
            </div>
          </article>`;
  }

  /** A gallery of procedure cards. `after` is markup placed after the last card (the library's help card). */
  function procedureGallery({ cls, attrs = '', cards, after = '' }) {
    return `<div class="${cls}"${attrs ? ` ${attrs}` : ''}>${cards.join('')}${after}</div>`;
  }

  /** One educational guide: numbered head, headed sections, and a link to the full procedure guide. */
  function educationalGuide({ id, number, title, summary, sections, moreHref, moreLabel }) {
    return `
          <article class="guide" id="${id}" aria-labelledby="${id}-h">
            <header class="guide-head">
              <span class="guide-num" aria-hidden="true">${String(number).padStart(2, '0')}</span>
              <div>
                <h3 id="${id}-h">${title}</h3>
                <p class="guide-summary">${summary}</p>
              </div>
            </header>
            <div class="guide-body">
              ${sections.map(([h, text, list]) => `<h4>${h}</h4>${text ? `<p>${text}</p>` : ''}${list ? `<ul class="bullets">${list.map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join('')}</ul>` : ''}`).join('')}
              <p class="guide-more"><a href="${moreHref}" data-nav class="text-link">${moreLabel}${icon('arrow', 16)}</a></p>
            </div>
          </article>`;
  }

  /** Accordion of questions. `items` = [{ q, a }]; `prefix` keeps ids unique on the page. */
  function faqList(items, prefix = 'faq') {
    return `<div class="faq-list">
        ${items.map((f, idx) => `
        <div class="faq-item" id="${prefix}-${idx}">
          <h3 class="faq-heading">
            <button type="button" class="faq-question" onclick="toggleFaq(${idx},'${prefix}')" aria-expanded="false" aria-controls="${prefix}-answer-${idx}"><span>${f.q}</span><span class="faq-icon" aria-hidden="true">${icon('plus', 20)}</span></button>
          </h3>
          <div class="faq-answer" id="${prefix}-answer-${idx}" role="region"><p>${f.a}</p></div>
        </div>`).join('')}
      </div>`;
  }

  /** Doctor profile: the list of appointments. `numbered` adds the running number; `note(role)` adds a line below the title. */
  function appointmentsTimeline(roles, { title, numbered = false, note = () => '' }) {
    return `<ol class="timeline">
              ${roles.map((r, i) => `
              <li class="timeline-item${r.current ? ' is-current' : ''}">
                <span class="timeline-when">${numbered ? `<span class="timeline-n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>` : ''}${r.current ? tr('حالياً', 'Current') : tr('سابقاً', 'Previously')}</span>
                <h4>${title(r)}</h4>
                ${note(r)}
              </li>`).join('')}
            </ol>`;
  }

  /** Preview card of an interactive tool: a drawing, a short description and a link. No module loads here. */
  function toolPreview({ cls, art, kicker, title, text, link }) {
    return `<article class="disc-card ${cls}">
            <div class="disc-visual">${art}</div>
            <div class="disc-body">
              <p class="disc-k">${kicker}</p>
              <h3>${title}</h3>
              <p>${text}</p>
              ${link}
            </div>
          </article>`;
  }

  /** Closing contact band. `actions` are the finished buttons, in order. */
  function contactCta({ cls = '', titleId, kicker, title, sub = '', actions }) {
    return `
    <section class="closing${cls ? ` ${cls}` : ''}" aria-labelledby="${titleId}">
      <div class="container closing-inner">
        <div>
          <p class="kicker"><span>${kicker}</span></p>
          <h2 id="${titleId}">${title}</h2>${sub ? `
          <p class="closing-sub">${sub}</p>` : ''}
        </div>
        <div class="closing-actions">
          ${actions.join(`
          `)}
        </div>
      </div>
    </section>`;
  }

  return { editorialIntro, imageTextSplit, procedureGallery, educationalGuide, faqList, appointmentsTimeline, toolPreview, contactCta };
}
