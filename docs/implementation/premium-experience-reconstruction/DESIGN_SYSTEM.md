# Design system: Direction A, "The Monograph"

The site reads like a well-set medical monograph: ivory paper, ink, one oxide-bronze accent, numbered chapters and hairline rules. The anatomical images are presented as numbered plates, which is the one thing taken from Direction B. Everything is implemented in `style.css`; the sections below follow its numbering.

## Colour tokens (`style.css` §1)

All pairs are checked by `node scripts/contrast.mjs` (WCAG 2.x, 70 pairs, all pass). Text pairs need 4.5:1; control borders, focus rings and icons need 3:1.

| Token | Light | Dark | Use | On paper (light / dark) |
|---|---|---|---|---|
| `--paper` | #F3EEE7 | #181A1E | Page. Light value is the legacy illustrations' own ground | |
| `--paper-2` | #ECE5DA | #1F2227 | Alternate band | |
| `--paper-3` | #E4DACB | #272A30 | Deepest tint | |
| `--ink` | #1B1915 | #EFE9E0 | Headings, primary text | 15.2 / 14.4 |
| `--ink-2` | #544C42 | #ADA59A | Body text | 7.3 / 7.2 |
| `--ink-3` | #655B4F | #A19A8E | Captions, meta | 5.8 / 6.3 |
| `--rule` | #D6CCBE | #353840 | Hairlines (decorative) | |
| `--rule-strong` | #82776A | #767982 | Control borders | 3.8 / 4.0 |
| `--accent` | #8A4B22 | #D99C6C | Numerals, arrows, focus | 5.9 / 7.4 |
| `--cta-bg` / `--cta-fg` | #1B1915 / #F3EEE7 | #EFE9E0 / #181A1E | Primary button | 15.2 / 14.4 |
| `--wa` | #1C7342 | #62C48D | WhatsApp glyph only | |
| `--alert-*` | #8C2B1D on #F6E6DF | #F0B6A8 on #2C1B18 | Warning signs, risk notes | |

**Night scope.** `.chapter-night`, `.section-stage` and `.closing` re-value the same token names (paper #181A1E in the light theme, #111316 in the dark theme), so components inside them need no special cases. The homepage has one night chapter, which is the only full-bleed chapter.

## Spacing, radius, motion

- **Space:** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px (`--s-1` to `--s-10`). Gutter `clamp(20px, 4.4vw, 64px)`. Content maximum 1312 px on a 12-column grid. Chapter padding `--chapter-y` is 44 px on phones and 64 px at 1440.
- **Radius:** 4, 10, 22, 30 and pill. The system is mostly square with hairlines: 22 px appears on close-up frames, the questionnaire and the warning box. Buttons are pills.
- **Motion:** one fade-rise reveal, once per block: 0.6 s on desktop, 0.35 s at 767 px and below, `cubic-bezier(.22,1,.36,1)`. The header slides in 0.45 s. There is no scroll-jacking, parallax, count-up or carousel. `prefers-reduced-motion` turns all of it off; `prefers-reduced-transparency` replaces the blur with a solid surface.

## Components

| Component | Notes |
|---|---|
| Chapter head | Large italic Newsreader numeral, kicker, h2, optional lede column. On phones the numeral moves inline with the kicker to save height. |
| Credentials ledger | Three typographic columns separated by hairlines, never stat tiles. The 15,000+ figure always keeps its scope line. |
| Plate card | Atlas L1 image (transparent), `PL.0n` code, group, title (the link, stretched over the whole card), full summary, quiet cue. |
| Plate (Fig. 1) | Atlas L2 image with numbered pins at the manifest's projected anchors, plus a numbered key below. |
| Close-up (Fig. 2, 3) | Atlas L3 on its off-white ground in a rounded frame, with its own pins and key. |
| Pin and key | Pins are decorative duplicates (`aria-hidden`); the key holds the text. Hovering a key entry highlights its pin. |
| Pending note | The visible "Educational illustration — pending physician review" line on every clinical image. |
| Quiet link | Underlined text with a bronze arrow; the only secondary action style. |
| Menu sheet | Full height, numbered pages, all seven procedures, booking as the last filled row. |
| Booking bar | Book (filled), call and WhatsApp (outlined). Below 1024 px. |

## Why the labels are pins and a key

The atlas anchors are projected from the 3D scene and are often close together, for example 0.31 and 0.33 of the frame height on the cataract plate. Text labels placed on the image would collide. Numbered pins sit exactly on the anchors, and the terms sit in a key where they can wrap in either language. No pin position was set by hand.

## Images

- Atlas assets come from `public/images/procedures/manifest.json`. `vite.config.js` bundles a compact form (`__PROC_MANIFEST__`) with only sizes, anchors, alt text and captions.
- L1 and L2 use the transparent masters; L3 uses the neutral off-white, because close-ups fill their frame.
- Every image has `width` and `height`, `srcset` with `sizes`, lazy loading below the fold, and `fetchpriority="high"` on the LCP plate.
- If an image fails, the card falls back to the line-drawn plate.
- The cataract 3D poster keeps the legacy dark render, whose ground matches the night chapter.
- The portrait source is 295 × 225 px. It is never shown wider than that, so the card is 317 px including its frame.

## Modules

The Lens Lab, Light Journey, vision simulator and cataract 3D stylesheets keep their own self-contained tokens. Only their UI colour and font tokens changed. Anatomy, lens-identity colours and all optical logic are unchanged.

## Self-review against the 21st UI checklist (applied by hand; the CLI is not installed)

Checked with `scripts/qa-premium.mjs` screenshots: consistent spacing tokens, one accent, visible focus, 44 px targets, no text over images, no horizontal scrollers, and both themes. Automated checks are in the test suite (axe in both themes, contrast of booking actions, overflow at six widths).
