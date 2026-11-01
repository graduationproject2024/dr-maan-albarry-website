# Design System — Dr. Maan Al Barry (Phase 2/3 master redesign)

> **Authorship note (honest):** design lead = Claude (Opus) design-specialist subagent, working with the
> skills `taste-and-craft`, `ui-design`, `typography` and `web-design-guidelines` loaded through the Skill
> tool. No dedicated "Claude Design" tool or agent exists in this environment and none was invoked.
> No Stitch folder, mockup or third-party template was opened or used.

## 1. Direction

**"The consultant's folio."** The site reads like a well-made clinical monograph: ivory paper, deep-navy
ink, a single warm-gold hairline used as the only ornament, and typography doing the work that cards,
gradients, blobs and emoji did before. Trust comes from restraint and from facts set like a ledger
(rule, label, value) rather than from badges.

What we removed on purpose: glow orbs, optical rings, "+" sprinkles, shimmer/arrow-fill button effects,
card-per-credential grids, emoji icons (🏥📞🕒🔬👁️🛡️…), the floating "✓ FRCS" badge over the portrait,
and the Ruqaa calligraphic name in the H1 (kept only as a quiet signature in the biography).

What we kept: the brand family (navy + gold + ivory), the authentic photographs, every doctor fact
(rendered from `doctor-data.js`), every interaction contract (booking bar, drawer, accordions,
simulator, questionnaire, language/theme persistence).

## 2. Colour tokens

The previous stylesheet had drifted (teal `#1f5f6b` buttons in light, burgundy `#9e3349` in system-dark,
navy only in the header comment). We return to the brand triad and make it consistent across themes.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--canvas` | `#F7F3EB` ivory | `#0B1424` night navy | page background |
| `--paper` | `#FFFDF8` | `#111D31` | raised surfaces (forms, table, drawer) |
| `--sand` | `#EEE7DA` | `#0E1A2D` | alternate section band |
| `--ink` | `#13233A` | `#EFE8DA` | headings / primary text |
| `--ink-2` | `#3E4B5E` | `#B8C0CC` | body text |
| `--muted` | `#59626F` | `#8D98A9` | captions, labels |
| `--gold` | `#B08A4E` | `#D6B57E` | hairlines, numerals, ornaments (non-text in light) |
| `--gold-ink` | `#80602A` | `#D6B57E` | gold used as text |
| `--rule` | `#DCD2C0` | `#22324B` | decorative hairlines |
| `--rule-strong` | `#13233A` @ 0.55 | `#5A6B86` | control borders (≥3:1) |
| `--primary` / `--on-primary` | `#14294A` / `#FFFDF8` | `#D6B57E` / `#0B1424` | primary buttons |
| `--wa` | `#15803D` (white text) | same | WhatsApp actions |
| `--alert` | `#9B2C2C` on `#FBF1EE` | `#F2B8AE` on `#2A1517` | red-flag callout |
| `--stage` | `#0C1830` | `#08111F` | always-dark "instrument" band (simulators) |

Contrast (computed with the WCAG relative-luminance formula, script in VISUAL_REDESIGN.md):

- ink/canvas 14.3:1 · ink-2/canvas 8.0:1 · muted/canvas 5.3:1 · muted/sand 4.8:1
- gold-ink/canvas 5.2:1 · gold-ink/sand 4.7:1 · on-primary/primary 14.3:1 · white/WhatsApp 5.0:1
- dark: text 15.1:1 · ink-2 10.0:1 · muted 6.3:1 · gold 9.5:1 · navy-on-gold button 9.5:1
- stage text 14.5:1 · stage muted 7.2:1 · alert 6.8:1 (light) / 10.0:1 (dark)

Rule: gold is never used for body text in light mode except via `--gold-ink`; hairlines (`--rule`) are
decorative only — any control border uses `--rule-strong`.

**Theme behaviour:** with nothing saved the site follows `prefers-color-scheme` (and keeps following it
live). Only an explicit toggle writes `localStorage.theme` (`light`/`dark`). `data-theme` always holds the
resolved theme so CSS has a single switch; a `@media (prefers-color-scheme: dark)` guard covers no-JS.

## 3. Typography

| Role | Latin | Arabic | Why |
|---|---|---|---|
| Display (H1–H3, numerals) | **Newsreader** 500–600 (opsz) | **Noto Naskh Arabic** 600–700 | an editorial text-serif with optical sizes; Naskh is its natural Arabic counterpart — calm, classical, highly legible, unlike the geometric Alexandria it replaces |
| Text & UI | **IBM Plex Sans** 400–600 | **IBM Plex Sans Arabic** 400–600 | one superfamily designed for both scripts → matched x-height/colour in mixed AR/EN lines (EDOF, FRCS, logMAR) |
| Signature | — | Aref Ruqaa (local `fonts/`) | the doctor's name as a hand-set signature at the end of the biography only |

Scale (fluid, `clamp`): `--fs-display` 2.6→4.4rem, `--fs-h2` 1.9→2.9rem, `--fs-h3` 1.25→1.6rem,
`--fs-lede` 1.15→1.4rem, `--fs-body` 1rem (AR 1.06rem), `--fs-small` .875rem, `--fs-micro` .78rem.
Line-height: Latin display 1.08, Arabic display 1.35 (Naskh needs room for ascenders/dots), body 1.7 / AR 1.9.
Measure: body ≤ 66ch. **No letter-spacing on Arabic** (it breaks joining) — eyebrows are tracked
small caps in EN only, plain medium weight in AR. Numerals: lining, `font-variant-numeric: tabular-nums`
in ledgers; mixed-direction numbers wrapped in `<bdi>`.

## 4. Space, grid, rhythm

- 4-pt base; tokens `--s-1 … --s-12` = 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px.
- Container 1240px max, gutters `clamp(16px, 4vw, 40px)` (16px at 360–390).
- 12-column CSS grid (`.grid-12`, 24px column gap desktop). Recurring splits: 5/7 (head/body),
  7/5 (hero text/portrait), 4/8 (sticky heading/list).
- Section rhythm: `--section-y` = clamp(64px, 9vw, 128px). Bands alternate canvas → sand → canvas, with
  the two simulators on the dark `--stage` band so the page has a deliberate tonal arc:
  light (identity) → light/sand (credentials, expertise) → dark (tools) → light (library, FAQ) → navy footer.
- Every section opens with the same head: index numeral (gold, Newsreader) + eyebrow + H2 + optional lede.

## 5. Components

- **Buttons**: 48px min height (44px compact), 2px radius-6 corners, no gradients/shimmer. `primary`
  (navy / gold in dark), `quiet` (1px `--rule-strong` outline), `wa` (green), `link` (underlined, arrow).
  Icon + label, icon 18px stroke 1.75.
- **Ledger** (replaces credential cards): rows of label/value separated by 1px rules, group titles in
  small caps; selective emphasis = the one current role set larger in serif.
- **Index list** (expertise, library): numbered rows `01 … 04`, serif titles, hairline separators,
  hover = gold rule grows under the title.
- **Comparison table** (IOL): a true `<table>` on ≥720px with dot scales (●●●○); on phones each lens
  becomes its own compact block (same rows), no horizontal scroll.
- **Cards** are used only where content is an object (FAQ answer panel, questionnaire, booking ways):
  1px rule, 8px radius, no shadow by default.
- **Nav**: slim sticky header (68px), wordmark (name in serif + specialty micro-line), 7 text links with
  a gold underline for the active section, language + theme as 44px icon buttons, primary Book.
  Mobile drawer: full-height sheet, numbered serif links, appearance + channels at the foot.
- **Booking bar** (≤768px): opaque paper bar, three equal actions (Book / Call / WhatsApp), safe-area
  inset, 52px targets.
- **Focus**: 2px `--focus` ring (navy in light, gold in dark) with 3px offset on every interactive element.

## 6. Imagery

Authentic photographs only (`images/`). The hero uses the Red Sea congress portrait (682×1024, the
only high-resolution portrait) cropped to head-and-shoulders inside a tall arch frame with an offset gold
hairline; a slight desaturation (`saturate(.82)`) calms the purple stage lighting without altering the
person. The studio portrait (295×225) is shown small (never upscaled) in the biography. The clinic
photo illustrates expertise; the post-operative kit photo illustrates the cataract guide. The
AI-looking "bench testing" image and the phone mock-up are not used. The 3D section poster is a
lightweight inline SVG line drawing of the eye in cross-section (no bitmap, no WebGL until requested).

## 7. Icons

One inline SVG set (24px grid, 1.75 stroke, round caps): calendar, phone, whatsapp, pin, clock, arrow,
external, menu, close, sun, moon, globe, play, shield, alert, chevron, eye. Brand glyphs (Instagram, X,
YouTube) stay filled. No emoji anywhere.

## 8. Motion

- Only opacity/translate reveals (12px, 500ms, `cubic-bezier(.2,.7,.2,1)`), section-level, once.
- Hover: colour and underline transitions ≤ 200ms. No parallax, no looping animation.
- `prefers-reduced-motion: reduce` → reveals off, smooth scroll off, simulator intro sweep already
  respects it.

## 9. RTL vs LTR (designed, not mirrored)

- Arabic is the default and the master composition; English is adapted, not the reverse.
- Arabic display uses Naskh at a slightly smaller size but taller line-height; English uses Newsreader
  with -0.01em tracking. Eyebrows: EN tracked small caps; AR medium weight, no tracking.
- The hero portrait sits at the inline-end in both (left in AR, right in EN) so the eye meets the
  name first in each reading direction.
- Directional icons (arrows) flip with `[dir=rtl]`; numerals, phone numbers and lens codes stay LTR
  inside `<bdi dir="ltr">`.
- Ledger values align to the inline-start; numerals column aligns to the inline-end in both.

## 10. Information architecture

1. Header · 2. Hero (`#home`) · 3. Credentials ledger (`#qualifications`) · 4. Biography + appointments
(`#profile`, incl. conferences) · 5. Expertise & procedures (`#specialties`, incl. technology and care
pathway) · 6. Cataract & lens guide (`#cataracts`) + lifestyle questionnaire (`#questionnaire`) ·
7. Vision simulator (`#simulator`) · 8. 3D cataract surgery (`#cataract-3d`) · 9. Library
(`#education`) · 10. Clinic, hours & booking (`#clinic`) · 11. FAQ (`#faq`) · 12. Closing CTA · Footer.
