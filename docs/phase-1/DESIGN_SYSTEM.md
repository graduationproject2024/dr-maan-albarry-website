# Phase 1 design system — "the physician's monograph"

Source of truth: `style.css` (tokens §1, components §3–§21). Contrast checker: `node scripts/contrast.mjs`.
Fallback-font calibration: `node scripts/measure-fallback-fonts.mjs`. Visual QA capture:
`node scripts/qa-shots.mjs <base> <outDir>`; height probe: `node scripts/qa-measure.mjs <base> [path]`.
Owner acceptance is **pending**; nothing here claims the design is finished or excellent.

Skills applied: `ui-design` (patterns, sharp edges, validations), `apple-design` (hierarchy, size-specific
tracking/leading, purposeful motion, reduced motion), `typography`, `i18n`, `seo`, `playwright-expert`.
`21st-ui-review`: the `21st` CLI is **not installed** in this environment, so its review checklist (semantic
controls, focus, alt text, touch targets, overflow, reduced motion, token drift, duplicate primitives,
typography/radius/spacing consistency, placeholder copy) was applied manually during the QA passes below.

## 1. Evaluation of the previous "clinical atlas"

What worked and was kept: the deep-lagoon primary and terracotta accent (distinctive in a sector dominated by
blue), AA contrast discipline, logical CSS properties for RTL, the metric-matched fallback fonts (BUG-05), the
procedure-page template, the always-dark "stage" for simulators, 44 px touch targets, the single fade-in reveal.

What did not: cool porcelain neutrals read clinical rather than personal; the 1,200 px container with
`max-width: 760px` heads left large unused areas at 1440; body text at 17 px (16 px EN) and many 13–15 px
labels felt small; the Readex Pro display face was competent but generic; seven equal cards and stacked
full-width blocks produced a 10,700 px homepage with no narrative order.

## 2. Identity

A personal physician's editorial monograph: warm paper neutrals, a calligraphic Naskh display face for Arabic
paired with a book serif for English, numbered chapters (01–06) that tell one story (who he is → what he has
done → what he treats → understand your eye → see the operation → read before you come → book), hairline rules
instead of boxes where possible, and asymmetric 7/5 and 4/8 splits that use the width.

## 3. Colour tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#F6F3EC` ivory paper | `#0F1514` | Page |
| `--surface` | `#FFFDF8` | `#161E1D` | Cards, ledgers |
| `--band` | `#EEE8DC` sand | `#121A19` | Alternate sections |
| `--plate` | `#E7E1D4` | `#1B2423` | Illustration plates |
| `--ink` / `--ink-2` / `--muted` | `#14201E` / `#33403D` / `#545D59` | `#EDE9E0` / `#C5C9C2` / `#9DA7A1` | Text |
| `--primary` (action) | `#0D4D47` | `#7FCFC2` | Primary buttons |
| `--primary-ink` | `#0E5750` | `#86D3C7` | Links, kickers |
| `--accent` (warm) | `#9C4220` terracotta | `#EBA27F` | Markers, anatomy highlights |
| `--gold` (warm complement) | `#7D5A1C` | `#D9B46C` | Chapter numerals, credential keys, years |
| info | `#1C5680` on `#E5EEF4` | `#A9CBE6` on `#14212B` | "Coming soon", "what to bring" |
| warning (draft) | `#7A4A0C` on `#FBF1DF` | `#F0CB8C` on `#2A2112` | Review status, module errors |
| error / alert | `#8F2A1C` on `#FBEEEA` | `#F3B9AC` on `#2A1714` | Red flags, emergency |
| success | `#2B643A` on `#E6F0E7` | `#A6D4B0` on `#15241A` | Reserved |
| stage (always dark) | `#0C1416`, cards `#111D1F` | same | Explore band, simulators, footer |

`scripts/contrast.mjs` checks every text/UI pair in both themes and on the stage: **all pass WCAG AA**
(text ≥ 4.5:1, UI ≥ 3:1). No gradients except the loading shimmer of a reserved module slot (disabled with
reduced motion); no glassmorphism.

## 4. Typography (Arabic first)

Families (SIL OFL, Google Fonts): **Noto Naskh Arabic** (AR display), **Noto Sans Arabic** (AR text),
**Source Serif 4** (EN display), **Public Sans** (EN text). Readex Pro was replaced by Noto Naskh Arabic:
a calligraphic Naskh gives the Arabic headings an editorial, personal voice and pairs with the English serif.

Fallback faces (BUG-05): the Naskh fallback was re-measured against local Times New Roman (which carries Naskh
glyphs on Windows) with `scripts/measure-fallback-fonts.mjs`: 500 → `size-adjust 111.52%`, ascent `95.95%`,
descent `56.49%`; 700 → `111.7% / 95.8% / 56.4%`. The other three pairs keep their BUG-05 values (re-measured
within ±2–5%, the earlier values were validated by the journey tests).

Size-specific leading and tracking (fluid 360 → 1440):

| Role | Arabic size / leading / tracking | English size / leading / tracking |
|---|---|---|
| Display (hero name) | 40 → 68 px / 1.42 / 0 | 44 → 76 px / 1.04 / −0.026em |
| H1 (page titles) | 35 → 56 px / 1.45 / 0 | 38 → 60 px / 1.08 / −0.02em |
| H2 | 29 → 43 px / 1.5 / 0 | 31 → 46 px / 1.14 / −0.015em |
| H3 | 21 → 26 px / 1.55 / 0 | 22 → 26 px / 1.28 / −0.006em |
| Lede | 19 → 22 px / 1.85 | 19 → 22 px / 1.6 |
| Body | **18 px / 1.9** | **18 px / 1.66** |
| Small | 16 px / 1.75 | 16 px / 1.6 |
| Caption / labels | 15 px | 14 px, +0.004em; uppercase kickers +0.12em |

Arabic is never letter-spaced. Hierarchy uses weight (700 AR / 600 EN headings) with size and leading as a set.
Measure: `--measure: 66ch` for prose; guides and procedure bodies cap at ~800 px.

## 5. Layout

- Container 1,280 px content + fluid gutter `clamp(20px, 4.5vw, 64px)` (was 1,200 px). At 1440 the content is
  1,280 px wide; long-form text stays within ~66 characters.
- Asymmetric editorial splits: 7/5 (hero, specialties, explore, education, clinic), 4/8 (expertise),
  side table of contents + 800 px prose (procedure pages, education library).
- Section rhythm `clamp(40px, 3.9vw, 60px)`; 8-pt spacing scale with a 4-pt half step.
- Radius 8/12/18/26; two shadows only.
- Phone compositions are not scaled-down desktop: the hero facts become a 3-column strip, intent shortcuts a
  single scrollable row, secondary specialties compact thumbnail rows, the procedure index a 2-column list,
  the explore band drops decorative art, section ledes that the dedicated pages repeat are hidden on the
  homepage, and the footer drops the procedure list (in the drawer and library).

## 6. Components

Buttons (primary, quiet, WhatsApp, light/ghost on dark; 50/56 px; press scales to 0.98), chips, numbered
section head with gold chapter numeral, credential ledger with source tags (`src-tag`), timeline, specialty
cards (lead + compact), discovery cards, page hero with breadcrumb, booking ways, visit facts, pathway steps,
assessment tiles, guide articles, questionnaire, red-flag card, feature slot (reserved/mounted/failed/static),
library note, closing band, footer, mobile booking bar. All interactive elements have hover, focus-visible
(2 px outline), active and disabled states; touch targets ≥ 44 px on phones (footer links 36 px only on
≥1100 px pointer devices, above the WCAG 2.5.8 minimum).

## 7. Motion

One reveal (opacity + 12 px, 500 ms, once per section), 150–250 ms colour transitions, arrow nudge on card
hover, press feedback on buttons. `prefers-reduced-motion: reduce` removes transforms, transitions and the
shimmer. No parallax, no autoplay, no looping animation.

## 8. Imagery

The authentic studio portrait on a matching studio-grey plate (edge fade, natural aspect — the source is
295×225); the conference portrait on `/about/`; the in-house procedure illustrations (light/dark, 1600/800 px
`srcset`); line-art SVGs for the Lens Lab and Light Journey previews and the 3D poster. The faculty group photo
is not used (third parties). See `PHYSICIAN_PROFILE_REVIEW.md`.

## 9. Visual QA (three evidence-based passes)

See §9 below the results table; screenshots in `docs/phase-1/evidence/after/`.
