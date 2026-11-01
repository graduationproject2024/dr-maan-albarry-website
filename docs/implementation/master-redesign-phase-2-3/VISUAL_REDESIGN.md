# Visual redesign — Phase 2/3 ("the consultant's folio")

Design lead: Claude (Opus) design-specialist subagent. Skills loaded via the Skill tool: `taste-and-craft`,
`ui-design`, `typography`, `web-design-guidelines`. No "Claude Design" tool exists here; none was invoked.
System and tokens: `CLAUDE_DESIGN_SYSTEM.md`. Section-by-section pairs: `BEFORE_AFTER.md`.

## What was rebuilt (not restyled)

- `main.js` — every render function after the `VisionSim` module was rewritten (header, drawer, hero,
  credentials ledger, biography, expertise, cataract & lens guide, questionnaire, simulator shell, new 3D
  section, library, clinic/booking journey, FAQ, closing band, footer, booking bar). The VisionSim
  module (lines 1–849: data, three.js scene, shaders, UI, context-loss fallback) is untouched.
- `style.css` — replaced wholesale (3,861 → ~900 lines). No rule of the old stylesheet survives except the
  simulator's functional geometry (16:9 view, slider line, tag positions), re-tokenised for the dark stage.
- `index.html` — new font set (Newsreader, IBM Plex Sans / Plex Sans Arabic, Noto Naskh Arabic), resolved
  theme before first paint, theme-color. JSON-LD slot, `#app`, title/meta/canonical/hreflang untouched.
- All emoji icons removed; one inline SVG icon set.

## Behaviour changes worth knowing

- **Theme**: follows `prefers-color-scheme` (live) until the visitor toggles; only then is
  `localStorage.theme` written. `data-theme` always holds the resolved value.
- **Language**: initial language = `en` if `<html lang="en">` at boot (prerendered `/en/`), else saved
  `localStorage.lang`, else `ar`. Toggle re-renders in place and saves.
- **3D section**: `import('./src/cataract-sim/index.js')` on click (static specifier → Vite emits
  `cataract-sim-*.js` ≈ 626 kB with three.js; main chunk ≈ 119 kB, no three). The host node is created once
  and detached/re-attached around every `renderApp()`; after a language switch the *same* node is back in the
  section and `controller.setLang()` is called; theme toggles call `controller.setTheme()`; `close` →
  `destroy()` and the poster returns. Verified by script (evidence/after/interactions/c3d-*.jpg):
  `state: active → same host after language toggle: true → after close: idle, host removed, poster shown`.
- Swipe rows are gone (credentials and technology are stacked editorial lists).

## Critique → fix rounds

Screens were captured with `node tests/capture-sections.mjs …/evidence/after/sections` (390 and 1440 wide,
AR/EN × light/dark) after each round and read image by image. Extra interaction shots (drawer, 360/768/1366/1920
heroes, 3D active) were produced with throw-away Playwright probes.

### Round 1 (first full capture)

| # | Finding (art-director view) | Fix |
|---|---|---|
| 1 | Hero portrait read as a full-body event photo; congress signage ("…OLOGY THE RED SEA") visible at the arch's top-left; the face was small for a hero | portrait put in a clipping wrapper and zoomed (`scale(1.6)`, origin 47% 30%) to head-and-shoulders; signage now outside the crop |
| 2 | Fact label "In practice since — 28 years" broke mid-phrase into an orphan line | split into label + muted second line (`.hero-fact-sub`) |
| 3 | Conference photo cropped the "2024" stage lettering awkwardly | re-centred (`object-position: 50% 55%`) |
| 4 | 3D poster: a second dashed sclera ring read as noise, not anatomy | removed |
| 5 | Clinic: the highlighted "call/WhatsApp" step broke the numeral column (its number was indented by the box padding) | compensating negative inline margin so numerals stay on one axis |
| 6 | Footer "Clinic line:055…" lost its space (inline-flex trims trailing whitespace) | footer links are block-level |
| 7 | Evidence artefact: the sticky header and fixed bar were stamped over every section shot | capture script pins the header and hides the bar for section shots only (full-page shot unchanged) |

### Round 2 (after round-1 fixes + 3D module available)

| # | Finding | Fix |
|---|---|---|
| 1 | 360px EN: H1 ran to 4 lines; eyebrow wrapped and stranded "• MADINAH" on the right | smaller EN display size under 600px, eyebrow allowed to wrap with tighter tracking |
| 2 | Phone/tablet cameo still showed the un-zoomed full-body crop (inconsistent with desktop) | same zoom applied to the cameo |
| 3 | Mobile drawer: booking bar painted over the drawer's foot (header stacking context z 60 < bar z 70) | header raised above the bar while the drawer is open |
| 4 | 1920px: ~200px dead band between hero facts and section 01 | hero bottom padding reduced; section rhythm carries the gap |
| 5 | 3D active: our lede + notices duplicated the module's own title/disclaimer block directly below | while active only eyebrow + H2 stay; the module's disclaimer remains visible |

### Round 3

| # | Finding | Fix |
|---|---|---|
| 1 | Phones: procedure tags separated by "·" left dangling dots at line ends | tags are now gold-dot-prefixed items in a wrapping flex row (no trailing separators) |
| 2 | 3D poster labels (Cornea/Lens/Retina) ~9px on phones — illegible | SVG label size raised (11 → 15 units) |
| 3 | Footer on phones: seven single-column links made a long tail above the booking bar | footer contents list becomes two columns under 720px |
| 4 | Arabic clinic hours wrapped with a lone "٩:٣٠ م" | `text-wrap: balance` on the hours line (string kept verbatim — it is a registry-protected fact) |

### Known limits / not fixed

- The hero uses the congress portrait (682×1024) because the studio portrait is only 295×225 px; at 2× DPR the
  hero crop is slightly soft. A higher-resolution studio portrait would improve the hero most.
- `clinic-exam-room.jpg` and `surgery-phaco.jpg` are 512 px wide; they are displayed ≤ 520 px but are soft on
  retina screens.
- The 3D module renders its own light UI card regardless of our dark stage band when the site theme is light;
  that is the module's design (we pass the site theme as instructed).
- Console shows a three.js warning "Multiple instances of Three.js being imported" once the 3D module loads
  (CDN r128 for the vision simulator + bundled 0.170 for the 3D module). Warning only, not an error.

## Contrast check

Computed with the WCAG relative-luminance formula (node one-liner during design); values in
`CLAUDE_DESIGN_SYSTEM.md §2`. The automated contrast test (`phase1-mobile.spec.js`) passes in both themes.
