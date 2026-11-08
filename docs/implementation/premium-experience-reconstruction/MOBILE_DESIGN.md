# Mobile design — premium experience reconstruction

## Baseline mobile findings

Baseline build: `feat/premium-experience-reconstruction` at `9322dd9` (= `main`, live). Captured with Playwright
(Chromium, DPR 1, light theme unless stated) after scrolling each page so lazy modules mount. Full table:
`BEFORE_AFTER.md` → "Before"; raw numbers: `evidence/before/metrics.json`.

### Page heights (px, light theme)

| Page | 320 | 360 | 375 | 390 | 430 | 768 | 1440 |
|------|-----|-----|-----|-----|-----|-----|------|
| Home AR | 9,045 | 8,328 | 8,140 | 8,015 | 7,782 | 9,003 | 5,363 |
| Home EN | 9,221 | 8,589 | 8,377 | 8,272 | 7,869 | 8,959 | 5,585 |
| About AR | | | | 10,068 | | | 4,931 |
| Procedures AR / EN | | | | 4,783 / 4,735 | | | 3,203 / 3,271 |
| Cataract AR / EN | | | | 9,541 / 9,690 | | | 6,802 / 6,881 |
| Lens Lab AR | | | | 13,447 | | | 9,462 |
| Surgical education AR | | | | 4,117 | | | 2,423 |
| How vision works AR | | | | 3,546 | | | 2,745 |
| Clinic AR | | | | 5,357 | | | 2,960 |

Home on a 390px phone is ~1.5× the desktop height (≈9.5 screens of 844px) even though phones already hide 11 kinds of
content; the 768px tablet layout (9,003px) is taller than the 390px phone layout. Home sections at AR 390: hero 1,185 ·
expertise 1,019 · specialties 1,258 · explore 987 · education+FAQ 1,172 · clinic 1,162. Dark theme heights equal light.

### Rules that hide or truncate content at small widths

Audit of `style.css` and the module stylesheets (`src/lens-lab/styles.css`, `src/light-journey/styles.css`,
`src/cataract-sim/styles.css`, `src/vision-sim/styles.css`) for `display:none`, `visibility:hidden`, line clamps, off-screen
scrollers and container-query hiding that apply only at narrow widths. State toggles that apply at every width (open/closed
FAQ, `[hidden]`, theme icons, module loading states) are not listed.

Recommendation key: **Visible** = must stay visible on phones · **Compact** = show a shorter/smaller version ·
**Keep hidden** = acceptable because the same content is one tap away on a dedicated page.

| # | Selector | File:line | Breakpoint | What it hides | Recommendation |
|---|----------|-----------|------------|---------------|----------------|
| M1 | `.hero-fact-sub` | `style.css:353` | ≤639px | Hero fact sub-lines: "N years of experience", **"Career total: examinations and procedures combined"** (the scope qualifier of the 15,000+ figure) and **"and the Saudi Board in Ophthalmology"** | **Visible** (compact). The 15,000+ number must never appear without its scope (`cases-15000` registry scope); the Saudi Board otherwise disappears from the phone hero |
| M2 | `.intents ul` (horizontal scroller, `white-space:nowrap`) | `style.css:354-356` | ≤639px | 3 of the 4 "Start from what you need" links sit off-screen in a sideways scroller with a hidden scrollbar | **Compact**: 2×2 grid of the four new pathways, no hidden scroller |
| M3 | `#main[data-page="home"] .expertise-cols .timeline-item:nth-child(n+4)` | `style.css:392` | ≤719px | Home timeline roles 4–5: former Saudi Ophthalmological Society representative (Madinah), Red Sea conference co-founder | **Keep hidden** on Home (credentials summary) — all 5 roles remain on `/about/`, and the "Roles in detail" link stays |
| M4 | `.spec-stack .spec-text` | `style.css:444` (also 3-line clamp at all widths, `:431`) | ≤719px | **Procedure summaries** of laser vision correction and keratoconus/CXL on the Home specialties cards | **Visible** (2–3 line clamp). Target gallery needs a short line for every procedure |
| M5 | `#main[data-page="home"] .cred .src-tag` | `style.css:450` | ≤719px | Source tags (Magrabi / Taibah / confirmed by Dr. Maan) on Home credentials | **Keep hidden** on Home; shown on `/about/` |
| M6 | `#main[data-page="home"] :is(#procedures, #education, #clinic, .explore-part) .section-head .lede` | `style.css:452` | ≤719px | **Section descriptions** on Home: specialties ("each procedure has a plain-language guide…"), vision discovery, cataract 3D, education (**"general education that does not replace an examination"**), clinic ("three ways to book…") | **Compact** (one short line). The education disclaimer sentence must stay **visible** |
| M7 | `#main[data-page="home"] .cred-quiet` | `style.css:453` | ≤719px | Memberships (Saudi Ophthalmological Society, American Academy of Ophthalmology) on Home | **Keep hidden** on Home; full on `/about/` |
| M8 | `.disc-body > p:not(.spec-group)` | `style.css:454` | ≤719px | **Lens Lab and Light Journey descriptions** on the Home preview cards | **Compact** (one line each) — otherwise a heading + button with no explanation |
| M9 | `#main[data-page="home"] .visit-row:first-child .visit-small`, `#main[data-page="home"] .accreditation` | `style.css:456` | ≤719px | "Please confirm through booking, as the schedule can change" caveat; JCI/CBAHI accreditation line | Caveat **Visible** (it qualifies the published hours); accreditation **Compact** (one line) |
| M10 | `.footer-hours` | `style.css:457` | ≤719px | Clinic hours in the footer (every page) | **Compact** (one line) — hours are otherwise only on Home §9 and `/clinic/` |
| M11 | `.footer-title` | `style.css:460` | ≤719px | Doctor's full specialty title in the footer | **Compact** (short specialty) |
| M12 | `.explore-surgery .c3d-poster figcaption` | `style.css:527` | all widths (Home only) | Caption of the Home cataract poster ("light passes through the cornea and lens to the retina") | **Visible** or `sr-only` — the poster SVG is `aria-hidden`, so with the caption hidden the image has no text alternative |
| M13 | `.disc-visual`, `.explore-surgery .c3d-poster` | `style.css:530` | ≤639px | **Vision previews** (Lens Lab far/intermediate/near art, Light Journey eye-and-rays art) and the **cataract poster imagery** on Home | **Visible** (compact height, e.g. max 120–160px). Target §5–§6 are visual previews |
| M14 | `.guide-row p` | `style.css:606` | ≤639px | Summaries of the 3 featured guides on Home | **Compact** (2-line clamp) |
| M15 | `.way-body > p:not(.way-number):not(.contact-numbers)` | `style.css:648` | ≤639px | Booking-method descriptions ("Through Magrabi's official booking portal — choose Dr. Maan Al Barry…") on **Home and `/clinic/`** | **Visible** on `/clinic/`; **Compact** on Home — the instruction to pick Dr. Maan in the portal is useful |
| M16 | `.proc-card:not(.is-featured) .illus.is-plate .anat-plate` (→ `.anat-thumb`) | `style.css:783` | ≤639px | Swaps the full anatomical plate for a cropped thumbnail (fallback only when no 3D render exists) | **Keep** (already a compact version) |
| M17 | `.proc-card:not(.is-featured) .proc-card-text` (3-line clamp) | `style.css:786` | ≤639px | Truncates procedure summaries on `/procedures/` | **Compact** (acceptable: the full summary is on each procedure page) |
| M18 | `.edu-toc` | `style.css:846` | <1024px | "On this page" contents of `/education/` (4 guides, questionnaire, red flags, questions) | **Compact**: collapsible contents or chip row at the top |
| M19 | `.proc-toc` | `style.css:918` | <1024px | "On this page" contents of every procedure page (9 sections + 3D) | **Compact**: collapsible jump-nav; only the 3D jump link exists today (`.proc-3d-jump`) |
| M20 | `.related-grid .proc-card .anat-plate`, `.related-grid .proc-card-text` (clamp) | `style.css:982`, `:985` | ≤639px | Related-procedure cards: plate → thumbnail, summary clamped to 3 lines | **Keep** (compact) |
| M21 | `.footer-procs` | `style.css:1016` | ≤719px | **The 7 procedure links** in the footer (every page) | **Compact**: 2-column list. On phones the procedures are otherwise only in the drawer and on `/procedures/` |
| M22 | `.llab-table-wrap` / `.llab-cards > .llab-card:not(.is-shown)` | `src/lens-lab/styles.css:159-161`, `:167` | container ≤760px | Lens comparison table replaced by cards; **only one lens card visible at a time** (chips choose it) | **Keep** (compact version exists); consider a "compare two" toggle later |
| M23 | `.lj-labels, .lj-illus` | `src/light-journey/styles.css:335` | container ≤560px | **Anatomical labels** on the Light Journey diagram (cornea, iris, lens, retina…) and the "Illustrative" tag | **Visible** (compact labels): the labels are the educational point of the diagram; the "illustrative" note survives as `.lj-note` text below |
| M24 | `.csim-counter` | `src/cataract-sim/styles.css:226` | ≤600px | Stage counter in the 3D cataract player (segments still show progress) | **Keep hidden** |
| M25 | `.csim-close span` (visually hidden label) | `src/cataract-sim/styles.css:216` | ≤600px | "Close" text on the 3D close button (icon + accessible name remain) | **Keep** |
| M26 | `.llab .llab-sim-mount .vsim-disclaimer` | `src/lens-lab/styles.css:250` | all widths | The simulator's own disclaimer inside the Lens Lab (the Lens Lab shows its own `.llab-label` note instead) | **Keep** (not width-specific) |

Not hiding but worth noting: the reserved heights for lazy modules on phones (`.vsim-host[data-reserve]` 1930px,
`style.css:554`; Lens Lab slot 1600px and Light Journey slot 900px, `style.css:813`) make the shimmer placeholder very tall
before mount; `.vsim-launch` loses its frame ≤639px (`style.css:557`).

### Most important mobile-hidden content (priority)

1. **Cataract and vision imagery on Home** (M13): the poster and both preview artworks disappear ≤639px.
2. **Procedure short lines** (M4): on a phone Home only the cataract card has a summary; laser and keratoconus lose theirs,
   and the other four procedures have no card at all.
3. **15,000+ scope qualifier and Saudi Board** in the hero facts (M1) — an integrity issue, not only a layout one.
4. **Section descriptions incl. the education disclaimer** (M6) and **vision preview descriptions** (M8).
5. **Contents navigation** on procedure and education pages (M18, M19) and the **footer procedure list** (M21).
6. **Light Journey anatomical labels** (M23).

### Overflow and console findings

- No page has document-level horizontal overflow (`scrollWidth > innerWidth`) at 320–1440px in either language.
- Two **hidden sideways scrollers** push content off-screen on phones: the Home hero intents (`.intents ul`,
  `style.css:354`; 3 of 4 links off-screen at 390px) and the `/procedures/` filter chips (`.proc-filter`, `style.css:788`;
  2 of 4 chips off-screen). Both hide their scrollbar (`scrollbar-width: none`), so nothing signals more content.
- Console: clean everywhere except `/clinic/`, where the Google Maps iframe requests were aborted in headless Chromium
  (`net::ERR_ABORTED`, third-party embed; not an app error).
- Measured CSS-hidden content at 390px vs 1440px matches the table above: Home (M1, M3–M9, M13), cataract (M19),
  Lens Lab (M22), Light Journey (M23), `/clinic/` (M15); footer (M10, M11, M21) is outside `<main>`.

## Mobile design principles

Implemented in `style.css` (the phone rules sit with each component, and §28 holds the density rules).

1. **Nothing is hidden because the screen is small.** Text and images may get smaller or be rearranged, but they stay on the page. The only content still hidden at phone width is listed in the table below, with the reason.
2. **No sideways scrolling inside the page.** Both hidden scrollers are gone: pathways are a 2×2 grid and the filter chips wrap.
3. **One thumb, three actions.** The booking bar (book, call, WhatsApp) stays at the bottom below 1024 px. On phones of 440 px and narrower the icon sits above the label, so "WhatsApp" is never clipped.
4. **The header gets out of the way.** It hides while reading down and returns on the first scroll up.
5. **Targets stay at least 44 px.** Whole plates are links. Footer links are 44 px tall.

## Section-by-section mobile layout

| Chapter | At 390 px |
|---|---|
| 01 Doctor | Name, specialty, intro, full-width booking pill, secondary link; then plate and portrait side by side (the portrait is never shown above 295 px); ledger as three rows with every scope line visible |
| 02 Pathways | 2×2 grid, each with a description |
| 03 Procedures | Lead plate beside its numbered key; the other six as rows with a 92 px thumbnail and the full summary |
| 04 Credentials | Two-column ledger rows; all five roles and the memberships are visible |
| 05 Vision education | Both previews with their drawing, description and link |
| 06 Cataract 3D | Poster image with caption, four stages in a 2×2 grid, CTA and guide link |
| 07 Guides | Three guides with full summaries, library link, emergency link |
| 08 Questions | Four general questions as an accordion |
| 09 Clinic | Three booking methods with descriptions, hours with the confirm caveat, address, one-line accreditation |
| Footer | Identity, then site and contact link groups flowing across the width (44 px rows), seven procedures in two columns, hours, disclaimers |
| Menu | Full-height sheet: numbered pages, seven procedures in two columns, filled booking row, maps, theme, channels |

### Status of each audited rule

| # | Status now |
|---|---|
| M1 hero sub-lines | Visible |
| M2 hero scroller | Removed (replaced by the 2×2 pathways) |
| M3 home roles 4–5 | Visible (more than the audit required) |
| M4 procedure summaries | Visible and not clamped, for all seven |
| M5 source tags | Not shown on Home at any width; shown on `/about/` |
| M6 section ledes | Visible, including the education disclaimer |
| M7 memberships | Visible |
| M8 preview descriptions | Visible |
| M9 hours caveat, accreditation | Visible |
| M10, M11 footer hours and title | Visible |
| M12 poster caption | Visible; the poster is now a real image with alt text |
| M13 previews and poster | Visible |
| M14 guide summaries | Visible and not clamped |
| M15 booking descriptions | Visible |
| M16, M20 thumbnails | Replaced by atlas L1 cards at every width |
| M17 library summaries | Visible and not clamped |
| M18, M19 contents lists | Collapsible "On this page" at the top of the page below 1024 px |
| M21 footer procedures | Visible, in two columns |
| M22 Lens Lab cards | Kept: one card at a time, chosen by chips (a compact version exists; unchanged module logic) |
| M23 Light Journey labels | Visible, enlarged for small containers; the "illustrative" tag moves to the note below |
| M24, M25, M26 | Kept hidden, as the audit recommended |

## Verification

- Captured at 320, 360, 375, 390, 430 and 768 px in Arabic and English, in both themes. The screenshots are in `evidence/after/`.
- No horizontal overflow on any page or width; the test suite checks 320, 390, 768, 1024, 1366 and 1440 px.
- Booking bar: three actions, at least 44 px tall, labels not clipped, at 360 and 390 px in both languages and themes.
- Axe (automated rules only) passes on all 30 pages in both themes at 390 × 844. This is not a screen-reader or manual accessibility audit.
- **Height decision.** The owner decided on 2026-11-08 ("Trim, new limit"): tighten the phone homepage without hiding anything, then set the 390 px budget from the result. Trimmed from 9,846 to 9,153 px (Arabic) and from 10,614 to 9,943 px (English) at 390 px, a saving of 693 / 671 px. The budget in `tests/phase1-pages.spec.js` is now 9,250 (Arabic) and 10,040 (English): the measured heights plus about 100 px. The credentials, footer, chapter spacing, guides and FAQ, and clinic were tightened; all seven procedures, images, summaries, the credentials, and the 15,000+ scope line stay on the page. The 1440 px budget (5,750) is unchanged; English at 1440 went from 5,695 to 5,647 px by tightening chapter spacing. The hero booking button stays on the first screen (checked at 360×800 and 390×844).
