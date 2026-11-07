# Madinah Cultivator: section map and measurements

Reference site: https://www.madinahcultivator.com/ar and https://www.madinahcultivator.com/en (the brand on the page is "Madinah Tech" / "مدينة تك").
Studied on 2026-11-07 with Playwright 1.64.1 and headless Chromium. Desktop viewport was 1440x900. Mobile viewport was 390x844 with `isMobile` and `hasTouch` on. Method details and limits are in `REFERENCE_SITE_AUDIT.md`.

> **Copyright.** No assets or copy from this site are stored in this repo. Screenshots, filmstrips and raw JSON measurements are kept outside the repo, in the session scratchpad:
> `C:\Users\sam20\AppData\Local\Temp\claude\f2087d8af4436a92\57913716-dded-44b8-8dcd-991689f3201b\scratchpad\research\` (`out\` holds the viewport and full-page PNGs plus the per-page JSON; `film\` holds viewport filmstrips taken every 900 px or 844 px of scroll, with contact sheets).
> Headlines are paraphrased below. Quotes are kept to a few words.

**Platform facts.** The site is a Next.js app (`/_next/image` responsive images and CSS-module class names). It uses one typeface for both languages, **IBM Plex Sans Arabic** (400/500/600/700). `scroll-behavior: smooth` is set, there is a light/dark theme toggle, and there are 14 `prefers-reduced-motion` rules. The sitemap lists only 6 URLs: `/ar`, `/en`, `/ar|en/register` and `/ar|en/event`.

---

## 1. Homepage section inventory (EN desktop; AR differences noted)

Section heights are shown in px and in viewports (vp = 900 px desktop, 844 px mobile). The EN desktop page is 19,131 px tall (21.3 vp). The AR desktop page is 18,565 px (20.6 vp). On mobile, EN is 21,030 px (24.9 vp) and AR is 19,687 px.

| # | id | Purpose | Headline (paraphrase) | Supporting text type | Main image | Image share of section (rendered rects) | Height desktop / mobile |
|---|---|---|---|---|---|---|---|
| 0 | `what` | Identity and promise; cinematic opener | Brand name as h1, then a one-line "from idea to pilot" promise | Partner credit ("Powered by" plus a partner logo), kicker with a rule, 26 px lead, 20 px secondary line with a vertical rule, "scroll to explore" hint | Scroll-scrubbed image sequence on a full-bleed `<canvas>`: an aerial view of the old city through a torn map shape (`seq/forest/frame_N.jpg`, natural 864x496, drawn `cover` at 1440x900) | Image covers 100% of every viewport. Text covers only **19.5%** of the first viewport in EN and **12.7%** in AR | 3,600 px (4.0 vp, pinned) / 2,532 px (3.0 vp) |
| 1 | `startups` | Social proof | none (no heading) | none | Infinite logo marquee of 28 startup logos, each 173x80 `object-fit: contain`, 72 px gap | about 26% (about 6 logos visible) | 220 / 148 |
| 2 | `direction` | Self-selection: which path fits you | "Where can your idea take you?" (numbered 01) | Centered 26 px lead (max-width 736 px), then two cards with a 39.6 px title, 4 check bullets and a link CTA | none (only a decorative line-wave pattern) | 0% | 1,249 / 1,478 |
| 3 | `sandbox` | Explain the programme model | "What is an Urban Cultivator?" (numbered 02) | Split intro (heading left, 26 px plus 20 px paragraphs right). Two numbered stage strips. A 3-card "what we test" table with "More details +" expanders. A second 3-card "how to read results" table | none (canvas line pattern, orbit animation) | 0% | 1,849 / 2,940 |
| 4 | `tracks` | Focus areas (categories) | "Where we focus our impact" (numbered 03), then 4 category titles | Split intro on a dark backdrop. Four stacked cards, each with a kicker, a 61 px title, two lines of copy, a CTA pill, a giant numeral 01–04 and an image chip label | A second scroll-scrubbed full-bleed sequence (forest canopy, `seq/tracks/frame_N.webp` at 1916x1080 desktop, separate `seq/tracks/mobile/` frames at 960x541). Each card holds an illustration of natural size 1672x941 rendered at 1146x645 (ratio 1.78) | **46%** of the section is card imagery, on top of a 100% image backdrop | 4,440 (4.9 vp, pinned) / 3,127 |
| 5 | `challenges` | Concrete problem statements | "Real challenges. Meaningful opportunities." (not numbered, labelled "City challenges") | Split head (heading 671 px, intro 537 px). Seven numbered cards, each with a 46 px line icon, a 27 px title and a 2–4 line description. A full-width text-link CTA with an arrow | 7 icons only | under 1% | 1,295 / 2,519 |
| 6 | `compare` | Differentiation and FAQ-like proof | "Why Madinah Tech" (numbered 04) | Split head (heading 498 px, 4-line paragraph 702 px with a left rule). Two columns: a 10-row accordion ("how our approach differs", one row open) and a sticky "what you can expect" card with 3 icon points and a "Contact us" pill | 3 icons | under 1% | 1,939 / 2,546 |
| 7 | `world` | Invitation / call to apply | "Global ideas. Local impact." (numbered 05) | Centered 3-line paragraph and a primary pill CTA | Decorative dotted world-map `<canvas>` (1300 px wide), no photo | decorative only | 1,115 / 740 |
| 8 | `media` | External validation | "In the media" | Split head. Three link cards, each with a thumbnail, a type chip, outlet and date meta, a 27 px title, a 3-line summary and a "Read article ↗" footer | 3 thumbnails rendered at 409x280 (1.46) from 420 px `next/image` sources. Each has its own crop: `cover 50% 50%`, `cover 50% 78%`, and `contain` for a magazine cover | **20%** | 1,185 / 2,235 |
| 9 | `join` | Contact and conversion | "Turn a conversation into impact" | Centered intro, a "Watch the film" pill, a contact bar (email, registration link, LinkedIn), then a split lower area with an illustration (1/3) and an inline contact form (2/3) with a large round "Send message" button | Inline SVG illustration of a paper plane, 360x330 | 4.7% | 1,741 / 2,126 |
| — | footer | Wayfinding and legal | — | Logos, a 3-line description, quick links (4), contact (2), copyright | partner logos | — | 497 / 642 |

### Per-section layout, type, spacing, interaction, links

All h2 headings are **67.2 px / 700** on desktop and **38 px** on mobile. Body text is **20 px** on desktop (line-height 33 px EN / 36 px AR) and **18.06 px** on mobile. Text colour is dark green `rgb(11,58,44)`, with secondary text in `rgb(30,74,67)`.

| # | Grid structure (desktop → mobile) | Background | Padding (T R B L, desktop → mobile) | Interactions / motion | Links to | Deferred elsewhere |
|---|---|---|---|---|---|---|
| 0 | Flex column copy block 580 px wide at x=173 (12% inset), over a full-bleed sticky canvas → 346 px column at x=22 | `rgb(4,21,15)` with the image sequence | 0; the copy block has 70 px top and 76 px bottom padding | Section pinned for 4 vp. The canvas scrubs about 70 frames with scroll. Headline words rise in a stagger (`translateY` about 88 px, 0.9 s `cubic-bezier(.16,1,.3,1)`, 55 ms stagger). Scroll-wheel hint animation | none (no CTA in the hero; the only CTA above the fold is "Join Us" in the header) | Everything |
| 1 | Flex belt 13,709 px wide, two duplicated `ul` groups | gradient `rgb(226,236,220)` → `rgb(209,224,201)` | 64 0 → 40 0 | CSS marquee keyframe `travel` | none | Startup details (not on the site) |
| 2 | Cards `grid 605px 605px`, gap 40 → 1 column, gap 18 | gradient `rgb(240,248,232)` → `rgb(217,237,200)`; the last 64 px is flat for a torn edge | 93.6 72 129.6 → 58 22 64 | Kicker, title and lead fade up (opacity plus translate 0.85 s `cubic-bezier(.2,.8,.2,1)`; 0.35 s on mobile). Cards enter rotated about ±3–4° and settle | `/register#company`, `/register#contributor` | The application form |
| 3 | Intro `grid 520px 693.5px`, gap 86.4 (43:57). Stages `636px 636px`, gap 28. Tables `3×366px`, gap 28 → all 1 column | gradient `rgb(230,240,233)` → `rgb(207,227,216)` | 90 70 108 → 58 18 64 | "More details +" expanders. Orbit/appear keyframes on a table connector | none | none (fully explained here) |
| 4 | Intro `grid 576px 576px`, gap 86.4 (pinned). Cards 1146 px wide, max 1340 → cards 315 px image area | `rgb(4,21,15)` plus the forest sequence | 126 100.8 72 (intro pin) | Sticky background canvas and sticky intro. Cards are stacked sticky slots: each enters at `scale(.9) translateY(36px)`, opacity 0 → 1, and covers the previous one | 4× `/register#company` | Per-area detail pages (none exist) |
| 5 | Head `grid 671px 537px`, gap 72. Cards on a **12-column** grid, gap 18; 7 cards laid out as 4 + 3 → 1 column, gap 14 | flat `rgb(191,211,187)` | 32 72 115.2 → 32 22 80 | Fade-up reveal | `/register#company` | none |
| 6 | Head `grid 497.5px 702px`, gap 80. Body `grid 2×622.7px`, gap 34.56. Accordion rows: 536 px buttons, 20/26 padding → 1 column | gradient `rgb(214,231,221)` → `rgb(191,217,204)` | 108 70 45 → 58 18 54 | Accordion with 10 rows, first open, each row numbered 01–10. The "Expect" column is `position: sticky` | `#join` | none |
| 7 | Single centered column | gradient `rgb(232,246,240)` → `rgb(201,232,219)` | 90 70 → 58 22 44 | Dotted map canvas | `/register#company` | Form |
| 8 | Head `grid 632.75px 575.25px`, gap 72. Cards `3×410.7px`, gap 24; card radius 26 → 1 column 346 px | flat `rgb(201,232,219)` | 115.2 72 → 72 22 | Card links (open in a new tab) | 3 external URLs | Full articles (off-site) |
| 9 | Contact bar flex. Lower `grid 385px 771px`, gap 24, max-width 1180. Form `2×310.7px`, gap 26/34 → 1 column | gradient `rgb(238,248,223)` → `rgb(213,234,192)` | 90 57.6 117 → 58 18 64 | Floating keyframe on the illustration. 160 px round submit button | mailto, `/register`, LinkedIn | Application (only general contact happens here) |

**Cards:** radius 30 px desktop / 22 px mobile; padding 37×45 px desktop / 26×22 px mobile; shadow almost invisible (`0 7px 28px rgba(13,53,46,.03)`); table cards use a 1 px border at `rgba(112,192,80,.33)` with radius 34 px.
**CTA pills:** primary is green `rgb(112,192,80)` with near-black text `rgb(4,21,15)`, 17 px / 700, padding 13–14 × 26–30 px, rendered height **54–58 px** (51–53 px on mobile), radius 999 or 60. Secondary is tonal `rgb(237,244,233)` with dark green text, 17 px / 600.

---

## 2. First-screen study

### Desktop 1440x900, EN

- **Navigation hierarchy.** The fixed header is **87 px** tall (AR: 89.6 px). Left: two logos with a divider. Centre: **6 text links at 17 px / 500** (About, Startups, Urban Cultivator, Focus Areas, Contact, Event); five are in-page anchors and one is a page. Right: a 40x40 theme toggle, a language pill showing the *other* language's name, and the **Join Us** primary pill (133x54). The header background is `rgba(243,247,242,.72)`, translucent with **no** backdrop blur, so the hero image shows through.
- **Secondary navigation.** A fixed **"Page sections" rail** sits at x=23 on the left (AR: right edge). It has 14 dots, one per section and focus area. Only the active label is visible ("About Madinah Tech" at 14 px); the other labels have opacity 0. The rail is hidden below the mobile breakpoint (`display: none`). A dotted vertical progress line with a node runs down the right edge.
- **Hero layout.** Full-bleed image (canvas, 1440x900) with text on the left. The copy column is **580 px wide (40.3% of the viewport)** and starts at **x=173 (12% inset)**. Vertical order is: partner credit (17 px, letter-spacing 1.02 px), partner logo (210x41), kicker with a 38 px rule (17 px / 600, pale green `rgb(203,230,198)`), h1, lead, then a secondary line with a 2 px left rule. A "Scroll to explore" hint sits at the bottom left (y about 840).
- **Title.** h1 is **95.68 px / 700, line-height 1.2 (114.8 px)**, `max-width: 574px`, which is **10 ch** (one "0" glyph is 57.4 px). It breaks into two lines ("Madinah" 387 px, "Tech" 210 px) at y=293 and y=407.
- **Lead.** 26 px / 500, line-height 1.65, 580 px wide (**37 ch**), 3 lines. The secondary line is 20 px / 400, 562 px (47 ch), 2 lines.
- **Focal point.** The subject (the city inside the torn map shape) sits in the right 55% of the frame. Text sits on the darker left side, so contrast comes from the image itself and a bottom fade.
- **CTA placement.** There is **no CTA button in the hero body**. The only conversion element in the first viewport is the header pill (top right; top left in AR). The first in-content CTA appears at about y=4,500 (the "Apply as a startup" link in section 2).
- **Relative type scale (desktop).** h1 : h2 : h3 : h3-small : lead : body : kicker/nav = 95.68 : 67.2 : 39.6 : 27.12 : 26 : 20 : 17. As ratios to body 20: **4.78 / 3.36 / 1.98 / 1.36 / 1.3 / 1 / 0.85**. h1/h2 = 1.42 and h2/h3 = 1.70.
- **Space.** Text boxes (h1, paragraphs, logo, links) occupy **19.5%** of the first viewport in EN and 12.7% in AR. The remaining ~80% is image. There is no empty colour field; the "negative space" is photographic.

### Mobile 390x844

- Header is **65 px**: logo on the left, then theme toggle 44x44, language pill (61 px wide) and a hamburger 44x44 on the right. The **Join Us pill is hidden** in the header and appears as the last menu item instead. The header also hides on scroll down (`translateY(-71.5px)`).
- The menu is a native `<details><summary aria-label="Menu">`. It opens as a **362x466 px rounded panel (radius 20, bg `rgb(228,238,227)`)** that drops down 72 px from the top. It lists 8 links at 18 px with **50 px rows** (53 px in AR); the last is a filled green "Join Us" pill. The page behind is not locked.
- h1 is **48 px** (line-height 57.6 EN / 61.4 AR) with `max-width: 288px` (still 10 ch), in two lines (194 / 105 px) in EN and one line in AR. Lead is 20 px / 1.65, 346 px wide (29 ch). Side gutter is **22 px**.
- Text covers 34.7% of the first viewport (EN) and 23.3% (AR). The hero is pinned for 3.0 vp (2,532 px). The image is a heavy centre crop of the same 864x496 frames (portrait 0.46 ratio from a 1.74 source).
- Mobile type ratios to body 18.06: h1 2.66, h2 2.10, h3 1.55 / 1.22, lead 1.11. **The scale compresses from 4.78 to 2.66 for h1.**

---

## 3. Section rhythm

| Order | Section | Density (text chars / height) | Bleed | Background tone | Numbered |
|---|---|---|---|---|---|
| 0 | Hero | sparse (280 chars / 3,600 px) | full-bleed image, pinned | **dark** | – |
| 1 | Logo belt | none (0 chars / 220 px) | full-bleed strip | light | – |
| 2 | Direction | medium (648 / 1,249) | contained cards | light | 01 |
| 3 | Sandbox | **dense** (1,733 / 1,849) | contained | light | 02 |
| 4 | Tracks | medium (1,188 / 4,440) | full-bleed image, pinned | **dark** | 03 |
| 5 | Challenges | dense (1,017 / 1,295) | contained, 1280 max | mid-light flat | label only |
| 6 | Compare | **densest** (2,415 / 1,939), mostly collapsed | contained | light | 04 |
| 7 | World | sparse (259 / 1,115) | centered, decorative | light | 05 |
| 8 | Media | medium (717 / 1,185) | contained, 1280 max | light flat | label only |
| 9 | Join | form-heavy | contained, 1180 max | light | – |

- **Dense and sparse alternate**: sparse, none, medium, dense, medium, dense, densest, sparse, medium, form. Every dense block is followed by either a cinematic block or a sparse one.
- **Full-bleed versus contained:** only 2 of 10 sections are full-bleed image chapters, at positions 0 and 4. Together they take **8,040 of 19,131 px (42%)** of the desktop scroll. Everything else is contained, with 70–72 px side padding (about 5%) or a 1,280 px max-width.
- **Numbered chapters:** 5 of 9 content sections carry an "NN — label" kicker (17 px / 700) above the h2. Inside sections, numbering repeats as 01–02 stages, 01–07 challenge cards, 01–10 accordion rows and giant 01–04 track numerals.
- **Background transitions:** light sections use top-to-bottom gradients that move between close greens (for example `rgb(240,248,232)` → `rgb(217,237,200)`). The last **64 px** of each is flat and cut with an organic torn edge, so one section's bottom colour runs into the next. The page never switches abruptly except into and out of the two dark image chapters, which use a jagged forest silhouette edge.
- **Progressive disclosure:** a 10-row accordion with 1 open row, three "More details +" expanders, contact links condensed into a single bar, the mobile menu as `<details>`, and registration split into "Step 1 of 2" on `/register`.

## 4. Image presentation

| Image role | Natural size | Rendered (desktop / mobile) | Ratio | Fit / crop | Notes |
|---|---|---|---|---|---|
| Hero sequence frame | 864x496 JPG | 1440x900 / 390x844 canvas | 1.74 → 1.6 / 0.46 | `cover`, centred | 142 sequence frame requests over a full scroll. The mobile hero uses the same frames, centre-cropped |
| Tracks backdrop sequence | 1916x1080 WebP (desktop), 960x541 (mobile set) | 1440x900 / 390x844 | 1.77 | `cover` | **Separate mobile asset set** (`/seq/tracks/mobile/`) |
| Track card illustration | 1672x941 (one is 1672x881) | **1146x645** / **315x256** | 1.78 → **1.23** | desktop `fill`; mobile `cover` at **`50% 100%`** (bottom-anchored) | Responsive art direction keeps the ground plane and drops the sky. A caption chip sits bottom-left over the image ("Smart Cities & Urban Life") |
| Media thumbnails | 420 px wide (`next/image` w=640, q=75), mixed ratios 1.78 / 0.78 / 0.77 | 409x280 / 344x240 | **1.46** fixed | `cover 50% 50%`, `cover 50% 78%` (per-image focal point), `contain` (magazine cover) | Same frame ratio for all three. The focal point is tuned per image |
| Startup logos | 192–480 px wide | 173x80 / 120x56 | 2.16 box | `contain` | Monochrome-friendly marks on a gradient |
| Icons | inline SVG | 44–46 px squares | 1 | – | Line icons on rounded tonal tiles |

- **Captions:** there are no editorial captions. Labels appear only as chips on track images and as type chips ("Article", "Digital magazine") on media cards.
- **Alt text:** sequence frames are decorative (`alt=""`); track images have descriptive alt text.
- **Density:** track images are 1672 px wide rendered at 1146 px (about 1.46x). They are not 2x-retina on large screens.

## 5. Homepage versus internal pages

| Content | Homepage | Internal pages |
|---|---|---|
| Programme explanation, focus areas, challenges, differentiation | **Shown in full** (long-scroll single page; the nav is anchors) | not repeated |
| Application / registration | **Summarized** as a "two paths" pair of cards; every CTA deep-links to `/register#company` or `#contributor` | `/register`: **full form**, centred h1 (95.68 px EN/AR), a segmented toggle (startup / contributor), and a 1:1 two-card layout (left: 4 numbered benefit tiles 01–04, each a 44 px number column plus text; right: the form, "Step 1 of 2", 2-column fields 214 px each with 26/30 gaps, a 160 px round submit). Height 2,057 px EN / 1,884 px AR |
| Event | **Only a nav link** | `/event`: status page (registration closed). Centred h1 72 px, 2-line subline, one centred card with an icon, a 39.6 px h2, a paragraph and a "Back to home" pill. 1,200 px tall |
| Contact | **Shown** (inline form plus contact bar at the bottom of the homepage) | – |
| Media coverage | **Summarized** as 3 cards | **Deferred off-site** (external articles, a flipbook) |
| Startup portfolio | logo marquee only | **Excluded** (no portfolio page) |
| Per-focus-area detail | one card each | **Excluded** (no detail pages) |

Internal page chrome differs from the homepage. The header is `position: sticky` and does not hide (81 px EN / 83.6 px AR) and shows only the logo, a "← Back to home" outline pill, the language pill and the theme toggle; there is no main nav. The background is a soft radial gradient with the same line-wave pattern. The footer is a single centred line (copyright and email).

## 6. AR versus EN differences (measured)

| Aspect | EN | AR |
|---|---|---|
| Direction | `ltr` | `rtl`, whole layout mirrored: rail on the right (x=1291), Join pill on the far left (x=54), first card on the right, arrows flip (→ becomes ←, ↗ becomes ↖) |
| Typeface | IBM Plex Sans Arabic | the same family and the same font-size tokens |
| Body line-height | 20/33 (**1.65**) | 20/36 (**1.80**) |
| Heading line-height | h1 1.20, h3 1.20 | h1 **1.28**, h2 1.28, h3 1.28 |
| h1 | 2 lines (387 + 210 px) | **1 line** (about 360 px wide) at the same 95.68 px |
| Hero text coverage | 19.5% | 12.7% |
| Page length desktop / mobile | 19,131 / 21,030 px | 18,565 / 19,687 px (about 3% / 6% shorter) |
| Track card titles | 61.28 px | **70.24 px** (desktop), 40 vs 34 px (mobile): AR display headings are set larger |
| Numerals | Western "01" | Western "01" (kept), dates localized ("29 سبتمبر 2026") |
| Hero image | – | **Not mirrored**; the same frames are used, and text sits over the right side of the image |
| Brand / outlet names | Latin | kept Latin (partner, outlet names) |
| Language switch | pill labelled "العربية" | pill labelled "English"; `aria-label` in the target language |
| Header height | 87 px | 89.6 px (taller Arabic line box) |
