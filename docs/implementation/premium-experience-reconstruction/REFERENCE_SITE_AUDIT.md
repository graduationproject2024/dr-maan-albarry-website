# Reference site audit: overview and transferable mechanics

Companion documents: `MADINAH_CULTIVATOR_SECTION_MAP.md` (premium-experience reference) and `MEDICAL_SITE_BENCHMARK.md` (medical information architecture).

## Sites studied

| Site | Role | Pages opened | Status |
|---|---|---|---|
| https://www.madinahcultivator.com/ar and `/en` | Primary premium-experience reference (bilingual, Arabic-first, Madinah) | Homepage AR and EN (desktop and mobile, with the mobile menu opened); `/en/register`, `/ar/register`, `/en/event`, `/ar/event`. These are **all** the pages in the site's sitemap (6 URLs) | HTTP 200 on every page, no blocking |
| https://dramralamin.com/ | Medical information-architecture reference (Arabic-only ophthalmology site) | Homepage (desktop and mobile, desktop dropdown and mobile drawer opened), doctor profile, LASIK, keratoconus, lens implantation, the medical-articles category | HTTP 200 on every page, no blocking |

**Date:** 2026-11-07.

## Method

- **Tool:** Playwright 1.64.1 (resolved from this repo's `node_modules`) driving headless Chromium. The scripts live outside the repo in the scratchpad `research\` folder (`probe.mjs`, `film.mjs`, `sheet.mjs`, `mcdetail.mjs`, `mcmenu2.mjs`, `mcmore.mjs`, `amrnav.mjs`).
- **Viewports:** desktop 1440x900 at DPR 1; mobile 390x844 with `isMobile` and `hasTouch` on (DPR 2 for the probe pass, DPR 1 for the filmstrips).
- **Procedure per page:**
  1. Load, wait for network idle plus 2–2.5 s, and take a first-viewport screenshot.
  2. **Scroll slowly** (300 px steps every 180 ms) to the bottom to trigger lazy images, IntersectionObserver reveals and scroll-linked sequences. Then return to the top and take a full-page screenshot.
  3. Extract DOM facts with `page.evaluate`: section order and heights, headings, computed font family, size, weight, line-height and letter-spacing, colours and gradients, image natural versus rendered size, `object-fit` and `object-position`, grid template columns, gaps, padding, max-widths, links, keyframes, transitions, sticky selectors, media queries and reduced-motion rules.
  4. Record **filmstrips**, i.e. viewport screenshots every 900 px (desktop) or 844 px (mobile) of scroll, plus the header transform and the visible headings at each step, so pinned and scroll-scrubbed chapters can be seen as the user sees them. Contact sheets were built from these frames.
  5. Instrument `IntersectionObserver` before page scripts ran (count observers and targets), log scroll-sequence frame requests, measure the header on scroll down and on scroll up, and measure the hero headline in `ch` using canvas `measureText('0')`.
- **Screenshots and raw data are kept outside the repo for copyright reasons.** They are in `C:\Users\sam20\AppData\Local\Temp\claude\f2087d8af4436a92\57913716-dded-44b8-8dcd-991689f3201b\scratchpad\research\`: `out\` holds the PNGs and per-page JSON, and `film\` holds the per-page frame folders with `sheet*.png` contact sheets. This scratchpad is session-scoped and temporary, so copy it elsewhere (not into the repo) if it must be kept.

## Limitations (stated honestly)

- Neither site blocked automation, and no CAPTCHA, consent wall or non-200 status was met.
- **Full-page screenshots of Madinah Cultivator are misleading.** The page has pinned sections (a 3,600 px hero and a 4,440 px tracks chapter) whose sticky canvases render once, so the stitched image shows empty or duplicated areas. The **filmstrips are the reliable visual record**.
- Madinah Cultivator has only **2 internal page types** (register, event) per language, so "3–5 secondary pages" was met with 4 pages (2 types × 2 languages). There are no further internal pages to study.
- Hover states, dark-mode styling, and real-device scroll performance were not measured systematically. (Dark mode was triggered once by accident in a throwaway browser context; it exists, but it was not audited.)
- No forms were submitted. No call or WhatsApp links were activated. Interactive measurements stopped at opening the menus and the dropdown.
- Animation timing comes from computed CSS and the stylesheets. JS-driven timings (canvas frame mapping) were inferred from scroll position and frame requests (142 sequence-frame requests per full scroll), not from source code.
- dramralamin.com is Arabic only, so there is no AR/EN comparison for it.

---

## Transferable mechanics for Dr. Maan's site (with measured numbers)

These are mechanics, not looks. The values are the reference's numbers; each one is translated to Dr. Maan's context.

1. **Hero headline scale and measure.** The reference sets h1 at **95.68 px desktop and 48 px at 390 px** (line-height 1.2 EN / 1.28 AR), capped at **max-width 10 ch (574 px)**. That is **4.8x body** on desktop and **2.7x** on mobile. *For Dr. Maan:* the doctor's name and specialty as a single H1 of about 88–96 px desktop / 44–48 px mobile, short enough to fit 1–2 lines, with `max-width` set in `ch`.
2. **Hero copy column at 40% width with a 12% inset.** The copy block is **580 px of 1,440 (40.3%)**, starting at **x=173**. The lead is **26 px / 1.65 at 37 ch**, followed by one 20 px supporting line with a 2 px start-side rule. Text occupies only **13–20% of the first viewport**. *For Dr. Maan:* one image (the doctor or the clinic), with a copy column of about 40% on the start side (right in AR), one lead sentence of 35–40 ch, and one supporting line.
3. **Fix the reference's missing hero CTA.** The reference has **no CTA in the hero**; its first in-content CTA comes about 4,500 px down. *For Dr. Maan:* keep its restraint (one primary pill, no button clutter), but place **one primary booking pill (54–58 px tall, 17 px / 700, radius 999) plus one tonal secondary** in the hero copy column. Patients need a route on screen one.
4. **Hide-on-scroll header.** Fixed, **87 px desktop / 65 px mobile**, background **72% opaque**, `translateY(-header height)` on scroll down and back on scroll up, **0.45 s `cubic-bezier(.22,1,.36,1)`**. *For Dr. Maan:* the same behaviour, but add a `backdrop-filter` blur or raise opacity to ≥ 90% so nav text stays legible over imagery (the reference has no blur). Keep the booking pill visible in the header on desktop.
5. **Numbered chapter kickers.** "NN — label" at **17 px / 700** above a **67.2 px h2** (38 px mobile), used on **5 of 9** content sections. Inner lists are also numbered (01–07 cards, 01–10 accordion rows). *For Dr. Maan:* number the patient journey on the homepage (for example 01 the doctor, 02 conditions, 03 treatments, 04 your visit, 05 contact) so long scroll reads as a sequence.
6. **Spacing tokens.** Section vertical padding is **90–130 px desktop / 58–80 px mobile**. Side gutters are **70–72 px (≈5 vw) desktop / 18–22 px mobile**. Content max-width is **1,280–1,300 px** (forms 1,180). Split headers are 2 columns at about **55:45 with 72–86 px gaps**. Card gaps are **40 px** (2-up), **28 px** (3-up), **24 px** (media), and **18 px** on a 12-column grid. *For Dr. Maan:* adopt the ratios as spacing tokens and use the 12-column grid for uneven counts (for example 4 + 3 cards).
7. **Only 2 cinematic chapters per page, and only light sections in between.** Full-bleed image chapters sit at **positions 1 and 5 of 10** and take **42% of the scroll**. Every other section is contained on light gradients. Adjacent sections share an edge colour, with a **64 px flat tail** on each gradient so the transition is seamless. *For Dr. Maan:* at most one or two full-bleed image moments (for example the clinic or Madinah light), with light tinted sections between them and no hard background jumps. **Do not pin them for 4 viewports** (see "Do not copy").
8. **Density alternation.** Text density follows the pattern sparse → none → medium → dense → medium → dense → densest (collapsed) → sparse → medium → form. A dense block is never followed by another dense block. *For Dr. Maan:* follow a dense block (for example a conditions grid) with a sparse one (a single statement or the doctor's quote).
9. **Progressive disclosure for detail.** A **10-row accordion with 1 open row**, "More details +" expanders on cards, a contact bar that compresses 3 channels into one row, and the mobile menu as native `<details>`. *For Dr. Maan:* procedure FAQs, eligibility and aftercare in accordions on internal pages. The homepage shows only the summaries.
10. **Category cards that deep-link with intent.** Each of the 4 focus-area cards (image **1146x645**, giant numeral 01–04, one CTA) links to `/register#company`. The two path cards preselect `#company` or `#contributor`. *For Dr. Maan:* each condition or treatment card links to its own page, and the booking CTA on that page can preselect the reason for visit.
11. **Card system.** Radius **30 px desktop / 22 px mobile**, padding **37×45 px / 26×22 px**, shadow almost nil (**3% alpha, 0 7 28**), table cards with a 1 px tinted border at 33% alpha. Tonal fills sit just one step off the section background. *For Dr. Maan:* the same quiet card language, which reads as calm and clinical rather than "app-like".
12. **Motion budget.** Reveals use opacity plus translate at **0.85 s `cubic-bezier(.2,.8,.2,1)` on desktop, shortened to 0.35 s on mobile**. Words rise with a **55 ms stagger** on desktop only. IntersectionObserver uses **threshold 0.15, rootMargin -5% bottom**. There are **14 `prefers-reduced-motion` overrides**. *For Dr. Maan:* the same curve, shorter on mobile, and every reveal disabled under reduced motion. Content must stay readable with JS off.
13. **Bilingual typography from one family, with AR line-height bumps.** One family (IBM Plex Sans Arabic) for AR and EN with the same size tokens. Arabic gets **body line-height 1.80 vs 1.65** and **heading line-height 1.28 vs 1.20**. Arabic display titles are set larger (**70 vs 61 px** on cards). *For Dr. Maan:* keep one size scale, but add language-scoped line-height tokens (+0.15 body, +0.08 headings for `:lang(ar)`). Expect AR pages to run **3–6% shorter**.
14. **Responsive art direction.** A separate **mobile image sequence**. Card images are re-cropped from **1.78 to 1.23** with `object-position: 50% 100%`. Media thumbnails share one frame ratio (**1.46**) with a **per-image focal point** (for example `50% 78%`). *For Dr. Maan:* define a focal point per photo (the doctor's face, the device) and serve mobile crops rather than shrinking desktop crops.
15. **Mobile navigation pattern.** A **65 px** header with theme toggle, language pill and hamburger, all **44x44**. The menu is a **362 px rounded (20 px) drop-panel** with **50–53 px rows**, and the **last row is the filled primary CTA**. Section-index rails are **hidden on mobile**. *For Dr. Maan:* the same panel, with "Book" as the last filled row, and the language switch always outside the menu.
16. **(From the medical benchmark) Condition / procedure split and a question-led page outline.** The top nav splits **conditions (5)** from **procedures (6)**. Each procedure page uses about **15 plain-language question H3s** in patient order (what it is, who it suits, tests, before, during, after, recovery, risks, FAQs) and repeats the credentials in a sidebar. *For Dr. Maan:* the same outline on **one consistent template**, with an H1, a "last reviewed" date, an in-page booking CTA and a short "when to seek urgent care" box. The measure should be 60–75 ch, not 90+.

## Do not copy

**From Madinah Cultivator:**
- The **3,600 px pinned hero** (4 viewports before content) and the **4,440 px pinned tracks chapter**. They cost 142 image-frame requests per scroll and delay medical information.
- The brand look itself: the green palette, torn-paper and forest edges, the dotted world map, AI-style city illustrations, the logo marquee, the side rail styling, the paper-plane form illustration.
- A homepage of about **19–21k px (21–25 viewports)**. A clinic homepage should summarize and route, at roughly 8–10 viewports.
- A translucent header **without blur** over imagery (legibility risk).
- Using the homepage as the only content page with an anchor-only nav. Medical topics need their own URLs for search, sharing and referral.

**From dramralamin.com:**
- **Unlinked service tiles** (dead ends) and **missing or late H1s** (H1 about 1,300 px down the homepage; no H1 on one procedure page).
- **Inconsistent procedure templates**, blog-post meta on clinical pages (author/date "2021"), and irrelevant sidebar widgets (calendar, search).
- **Unsourced animated counters** ("approximately N operations"), anonymous testimonial walls, and manufacturer logos presented as "partners".
- SEO pages built on "best doctor" or price queries, and superlative or guarantee language.
- Graphic pathology renders as homepage service imagery, stock photos with English text on Arabic pages, and YouTube thumbnails with burned-in text.
- A **black background with gold headings** and a 17 px body at 90+ characters per line.
- WhatsApp/call as the **only** booking path, with no hours or next-step expectations; social icon rows repeated twice.
- Any of its procedures, statistics or claims as a proxy for Dr. Maan's services.
