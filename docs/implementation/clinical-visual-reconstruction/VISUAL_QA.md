# Visual QA: design and engineering loop

## Method
- **Rendering:** every screenshot was rendered by Playwright (Chromium, `reducedMotion: reduce`) against the production build served by `vite preview`.
- **Reviewers:** the agent opened the images itself and judged them. No human reviewed them, and no real phones were used. All mobile results are **emulated** viewports.
- **Tools:**
  - `tests/capture-redesign.mjs`: full-page and first-screen JPEGs at quality 82.
  - `tests/capture-sections-review.mjs`: per-section crops for close inspection.
  - `scripts/contrast.mjs`: WCAG contrast check.

## Baseline (before)
**Folder:** `evidence/baseline/`. It holds the previous navy and gold design (commit `5423751`) at 390×844 and 1440×900, in AR and EN, light and dark:
- 8 first-screen images,
- 4 full-page images.

## Round 1: first implementation
**Captures:**
- every first screen,
- full pages at 390 and 1440,
- section crops for EN light at 1440, AR dark at 390, the keratoconus page (EN dark, 1440) and the lens-implants page (AR light, 390).

| # | Defect found | Fix |
|---|---|---|
| 1 | The credential ledger groups were separate cards that stretched to the height of the appointments column, leaving large empty blocks. | One ledger sheet with four ruled groups; `align-items: start` on the profile grid. |
| 2 | On the featured cataract card, "Procedure details" was pushed far below the text (`margin-top: auto`). | Fixed spacing inside the featured card. |
| 3 | The "Not sure?" tile had a large dead area above its button. | Content is centred vertically and the button sits directly after the text. |
| 4 | Phone compact cards: the thumbnail showed a small, clipped piece of the full plate, with the highlighted structure at the edge. | Added a second crop of the same drawing (`.anat-thumb`, a close-up of the front of the eye) for thumbnails. |
| 5 | Phone hero card: a stray divider under the last visible row. | Border removed on the last shown row. |
| 6 | **Test regression (real):** the padded simulator frame made the vision-simulator view narrower than its phone guarantee (`view.w ≥ w − 56`). | The frame has no padding or border below 640 px. **The test was not changed.** |

## Round 2
**Captures:**
- home section crops in AR light and dark at 1440,
- EN at 390,
- the intravitreal page in AR light at 1440.

| # | Defect found | Fix |
|---|---|---|
| 7 | The intravitreal plate read as a pink disc, with a needle drawn across the middle of the eye. | Redrawn. The vitreous is tinted behind the lens, the retina is highlighted, and the macula is marked. The needle enters at the pars plana with a single drop. |
| 8 | Phone hero facts: the value column was ragged (1998 / 15,000+ / FRCS), so the labels did not line up. | Fixed 6.6 rem value column. |
| 9 | The thumbnail crops still clipped the cornea and laser lines on the right. | Thumbnail viewBox widened (`122 18 172 164`; intravitreal `62 6 188 188`). |

## Round 3: final
**Captures:**
- intravitreal at 1440 (light),
- lens-implants at 390 (dark),
- the full evidence set.

| # | Defect found | Fix |
|---|---|---|
| 10 | The cataract caption and alt text said "3D anatomical cross-section" while the schematic placeholder was showing, which is inaccurate. | Alt text and caption now say "Anatomical cross-section…", which is true of both the placeholder and the forthcoming render. |

**Verified in round 3:**
- RTL type cards (codes align to the inline end),
- related cards,
- closing band,
- dark procedure hero,
- AR phone hero (Book CTA above the booking bar, which has three actions).

## Accepted or known (not fixed)
- **Clinic map:** the Google Maps iframe is blank in headless captures because it is an external embed. It loads in a normal browser.
- **Portrait in dark mode:** the studio portrait has a light grey backdrop. In dark mode it shows as a light panel. It is authentic and unfiltered. A studio portrait on a neutral or transparent background would sit better (see the photography blocker in `RELEASE_READINESS`).
- **Legacy simulator styling:** the legacy Vision Simulator keeps its original navy and gold internal styling on purpose. Its replacement (`src/vision-sim`) mounts into `[data-vision-host]`.
- **En dash spacing:** in Public Sans, an en dash between words ("Chief of Staff – Magrabi") looks slightly tight. The text is the doctor-data wording and was left unchanged.

## Final evidence
**Folder:** `evidence/redesigned/`. It holds 44 JPEGs (quality 82), 14.1 MB in total.

| Pages | What was captured |
|---|---|
| Homepage | first screen + full page at 390 and 1440, AR/EN, light/dark |
| `cataract-surgery` and `keratoconus-cxl` | first screen at 390 and 1440 in AR/EN light/dark; full page in light at 1440 and in both themes at 390 |

## Automated checks run on the final build
| Check | Result |
|---|---|
| `node scripts/contrast.mjs` | 55/55 pairs pass (text ≥ 4.5:1, UI ≥ 3:1) |
| Full Playwright suite (`PW_PORT=4273 PRERENDER_PORT=4276 npx playwright test`) | **172 passed, 4 skipped** (pre-existing env-gated 3D evidence/perf tests), 0 failed |
| Horizontal overflow (`tests/procedures.spec.js`) | none at 320 / 360 / 390 / 768 / 1440 on the home page and all 7 procedure pages, in both languages |

Nothing is pushed or deployed.
