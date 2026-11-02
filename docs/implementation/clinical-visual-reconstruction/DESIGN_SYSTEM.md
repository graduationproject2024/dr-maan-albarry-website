# Design system: "The clinical atlas"

> Authorship: written by a Claude (Opus) design/frontend subagent using the `ui-design`, `typography`, `landing-page-design`, `i18n`, `seo` and `playwright-expert` skills.
> The information architecture was benchmarked against dramralamin.com (structure only). No text, colours, images, HTML or CSS were taken from it. No Stitch files or old mockups were used.

## 1. Direction

The previous design (navy, gold, ivory and an editorial serif) was rejected. This design replaces every part of it: the palette, the four typefaces, the layout and how procedures are presented.

The metaphor is an **anatomical atlas used in a modern clinic**:
- A porcelain page.
- A deep "lagoon" teal for actions.
- One terracotta accent, used only to mark the structure of the eye a procedure concerns, and as tiny markers.
- Procedures presented as **plates**: the same eye cross-section, from the same angle and in the same light, with the relevant structure highlighted.

The tone is calm, spacious and clinical. There are:
- no gradients used as decoration,
- no glass blur,
- no floating ornaments,
- no emoji,
- no stock photography.

| | Before (rejected) | Now |
|---|---|---|
| Palette | navy `#14294A`, gold `#B08A4E`, ivory `#F7F3EB` | porcelain `#F4F6F5`, lagoon `#0B5A52`, terracotta `#9E4322` |
| AR display / text | Noto Naskh Arabic / IBM Plex Sans Arabic | **Readex Pro** / **Noto Sans Arabic** |
| EN display / text | Newsreader / IBM Plex Sans | **Source Serif 4** / **Public Sans** |
| Procedures | 3 text rows inside an "Expertise" section | 7-card gallery, 3 groups, a filter, a featured card and 14 dedicated pages |
| Section openers | gold numeral, rule | short terracotta dash + kicker |

## 2. Colour tokens (`style.css` §1)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#F4F6F5` | `#0E1716` | page |
| `--surface` | `#FFFFFF` | `#14201F` | cards, panels |
| `--band` | `#E9EFED` | `#111C1B` | alternate sections, procedure hero |
| `--plate` | `#E4ECEA` | `#182625` | illustration plates |
| `--ink` / `--ink-2` / `--muted` | `#0F1E1C` / `#33433F` / `#56655F` | `#E7EFEC` / `#B9C8C4` / `#93A6A1` | headings / body / captions |
| `--line` / `--line-strong` | `#D6DFDC` / `#7C8B87` | `#223230` / `#5E716D` | hairlines (decorative only) / control borders |
| `--primary` / `--on-primary` | `#0B5A52` / `#FFF` | `#6CCBBE` / `#06201D` | primary buttons |
| `--primary-ink` | `#0B5A52` | `#7DD3C7` | links, kickers |
| `--accent` | `#9E4322` | `#EBA27F` | anatomy highlight, markers, group labels |
| draft badge | `#7A4A0C` on `#FBF1DF` | `#F0CB8C` on `#2A2112` | "Medical review status" |
| alert | `#8F2A1C` on `#FBEEEA` | `#F3B9AC` on `#2A1714` | urgent-care and risk notes |
| stage | `#0C1517`, text `#EAF1EF`, muted `#A9BAB6` | same | simulators and footer (always dark) |
| WhatsApp | `#15803D` + white | same | WhatsApp actions |

**Contrast check.** Run `node scripts/contrast.mjs`. It applies the WCAG 2.x relative-luminance formula to every text and UI pair. Text must reach at least 4.5:1, and UI boundaries such as control borders and the primary colour on the page must reach at least 3:1. **All 55 pairs pass.** Lowest values:

| Pair | Ratio |
|---|---|
| UI: `line-strong` on band | 3.06 |
| UI: `line-strong` on surface (dark) | 3.23 |
| Text: muted on plate | 5.11 |
| Text: WhatsApp | 5.02 |
| Text: muted on band | 5.27 |

Highest value: ink on surface, 17.17:1.

**Theme.** With nothing saved, the site follows `prefers-color-scheme` and keeps following it live. Clicking the toggle stores `localStorage.theme`. The `data-theme` attribute carries the resolved theme. A no-JS media guard covers the time before `main.js` resolves it.

## 3. Typography (Google Fonts, SIL Open Font License)

| Role | Arabic | English |
|---|---|---|
| Display (H1–H3, numerals in EN) | **Readex Pro** 500–700: a modern Kufi-influenced sans with generous counters and a calm geometry. It is clearly not the Naskh of the old design. | **Source Serif 4** 600 (optical sizes): sturdy, with a medical-journal authority. It is less literary than Newsreader. |
| Text and UI | **Noto Sans Arabic** 400–700: very legible at 14–17 px, with good mixed Latin. | **Public Sans** 400–700: a neutral, accessible grotesque designed for public-service UI. |

Fact numerals (1998, 15,000+, FRCS) are always set in Source Serif 4 with lining, tabular figures, so they look identical in both languages.

**Scale.** All sizes are fluid `clamp()` values, from a 360 px viewport to 1440 px.

| Role | Arabic | English | Line height |
|---|---|---|---|
| Display | 2.0 → 3.25 rem | 2.25 → 3.75 rem | AR 1.32 · EN 1.10 |
| H1 (procedure pages) | 1.9 → 3.0 rem | 2.1 → 3.35 rem | as display |
| H2 | 1.55 → 2.3 rem | 1.75 → 2.6 rem | AR 1.4 · EN 1.25 |
| H3 | 1.12 → 1.3 rem | same | AR 1.4 · EN 1.25 |
| Lede | 1.05 → 1.2 rem | same | 1.7 |
| Body | 1.0625 rem | 1 rem | AR 1.85 · EN 1.65 |
| Small | .9375 rem | same | — |
| Caption | .8125 rem | same | — |
| Buttons | 1 rem / 600 | same | — |

**Arabic sizing.** Arabic display is set smaller with more leading, because Arabic has taller ascenders and dots. Arabic body text is set slightly larger.

**Measure.** Running text is capped at 68ch. Ledes are capped at 60ch.

**Kickers.**
- EN: uppercase, tracked .09em, .75 rem.
- AR: no tracking, because tracking breaks joining; weight 600.

**Buttons and captions.** Button text is 1 rem at weight 600, in the text face. Captions are .8125 rem in muted ink.

**Mixed direction.** Numbers, phone numbers and lens codes are wrapped in `<bdi dir="ltr">`. Directional arrows flip in RTL.

## 4. Grid, spacing, surfaces

- **Spacing:** 4-pt tokens `--s-1 … --s-9` = 4, 8, 12, 16, 24, 32, 48, 64, 96 px.
- **Container and gutters:** the container is 1200 px. Gutters are `clamp(16px, 4vw, 40px)`, so 16 px on phones.
- **Section rhythm:** `clamp(56px, 7.5vw, 112px)`. Bands alternate: porcelain, mist, then dark stage for the two simulators, then porcelain, then a lagoon closing band and a dark footer.
- **Recurring splits:**
  - 7/5 for the hero (text and doctor card).
  - 5/6 for section heads (title and lede).
  - 6/5 for the procedure hero.
  - 240 px table of contents plus content on procedure pages.
  - 7/5 for credentials and appointments.
- **Surfaces:**
  - Cards: radius 16, 1 px line, `--shadow-1`. On hover the border shifts toward the primary colour and the card lifts 2 px.
  - Panels: radius 22.
  - The doctor card uses `--shadow-2`.

## 5. Components

- **Buttons.**
  - Sizes: 48 px minimum height; 54 px for `lg`; 44 px for `sm`.
  - Radius: 10.
  - Variants: `primary`, `quiet` (outlined), `light` (on dark), `ghost-light`, and `whatsapp`.
  - Icon size: 18–20 px.
- **Navigation.**
  - Sticky header: 64 px on phones, 72 px from 1024 px. It gets a rule and a soft shadow once the page scrolls.
  - Wordmark: an eye monogram plus the name and specialty.
  - Six section links, with a terracotta underline on the active one, shown from 1200 px.
  - Language and theme buttons are 44 px icons. The Book button shows from 640 px.
  - Drawer: full height. It holds numbered section links, then all 7 procedure links, then Maps, appearance and channels. Escape closes it and returns focus to the menu button.
- **Procedure card.**
  - Contents: illustration plate (16:10), group label (terracotta), title, a 1–2 line summary, and a "Procedure details" link. The link covers the whole card through `::after`, and its accessible name includes the procedure name.
  - Featured card (cataract): spans two columns and carries a "With a 3D walkthrough" badge.
  - Phones: cards become compact rows with a 104 px thumbnail, which uses a close-up crop of the same plate.
- **Filter chips.** Toggle buttons with `aria-pressed` for All, Cataract & lens, Vision correction, and Cornea & retina. Every card stays in the DOM; hidden ones use `hidden`.
- **Ledger.** One sheet with four groups (qualifications, academic, leadership, memberships) separated by rules. Next to it, an appointments timeline whose current role is marked with a terracotta dot.
- **Procedure page.**
  - Breadcrumb, kicker, H1, lede, **draft review badge**, then the CTAs.
  - Sticky table of contents.
  - Sections in order: anatomy (text plus key-structure tiles), purpose, types (cards with a code such as EDOF or DMEK), candidates (check list), steps (numbered circles), benefits and limitations (two panes), risks (plus an alert note), recovery, FAQ accordion, then sources and the review badge again.
  - Related procedures, then a lagoon booking band.
- **Booking bar.** Shown below 1024 px: Book, Call and WhatsApp, each at least 52 px tall, with a safe-area inset. The body is padded so the bar never covers the footer.
- **Focus.** A 2 px `--focus` ring with a 3 px offset on every interactive element.

## 6. Icons

One inline SVG set on a 24 px grid, with a 1.6 stroke and round caps and joins:

calendar, phone, pin, clock, arrow, external, menu, close, sun, moon, play, shield, alert, chevron, plus, minus, check, eye, globe, info, draft, layers, cube, book.

The brand glyphs (Instagram, X, YouTube, WhatsApp) are filled. No emoji appears anywhere.

## 7. Photo treatment

**Authentic photographs only.**
- The hero uses the studio portrait `images/dr-maan-portrait.png`. It is 295×225, so it is shown at about 1× inside a "doctor card" on a matching `#ECECEC` mat and never upscaled beyond its slot.
- On phones it becomes a 112 px square crop placed beside the role lines.
- No filters are applied to the person.
- The Red Sea congress photo is no longer used on the homepage, because the brief asked for the authentic portrait.

## 8. Anatomical-visual treatment

**3D renders.**
- Every procedure has one plate: `images/procedures/<slug>.webp` (1600×1000, light background) and `<slug>-dark.webp`.
- These renders are delivered by another workstream.
- `vite.config.js` checks at build time which files exist (`__PROC_IMAGES__`). Only existing files are referenced, so a missing render never produces a 404.
- The dark file is swapped in when the theme is dark.
- If a render fails to load at runtime, `onerror` falls back to the schematic plate.

**Schematic plate (current placeholder).** A single line drawing of the eye in cross-section, built from the same base geometry for every procedure:
- Cornea, iris, lens zonules, retina and optic nerve drawn in neutral `--ap-line` on an atlas dot grid.
- The structure a procedure concerns drawn in terracotta:

| Procedure | Highlighted structure |
|---|---|
| Cataract | clouded lens |
| Lens implants | IOL with haptics |
| Laser vision correction | cornea plus laser lines |
| ICL | lens in front of the natural lens |
| Keratoconus/CXL | cone-shaped cornea plus UV lines |
| Corneal transplant | graft segment |
| Intravitreal injections | vitreous, retina, macula and pars-plana needle |

This avoids both stock photos and "one generic eye for every card".

## 9. Motion

- **Reveals:** opacity plus a 12 px rise, 500 ms with `cubic-bezier(.2,.7,.2,1)`, once per section.
- **Hovers:** 150–200 ms colour and border changes, plus a 2 px card lift.
- No parallax, no looping animation, no animation on procedure pages. The only exception is the user-started 3D simulator on the cataract page.
- `prefers-reduced-motion: reduce` turns off reveals, the lift and smooth scrolling.

## 10. RTL / LTR

- **Arabic** is the master composition and the default.
- **Logical properties** are used throughout (`inset-inline`, `border-inline-start`, `padding-inline`).
- **Layout:** the hero doctor card sits at the inline end in both languages.
- **Icons:** arrows flip with `[dir=rtl]`.
- **Check marks:** the diagonal of the check bullets mirrors in RTL.
- **Fact numerals:** Latin numerals in Source Serif 4, isolated with `bdi`.
- **Legacy simulator:** the internals are not restyled. Their original tokens are re-declared on `.vs-card` (`style.css` §18) until `src/vision-sim` replaces them.
