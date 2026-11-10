# Hero portrait improvement

Date: 2026-11-09. Branch `feat/premium-ux-refinement`, commit `c15699a`. Screenshots: `evidence/hero/before-*.jpg` and `after-*.jpg`, Chromium emulation.

## The problem

The portrait was a small card overlapping a large anatomy image, so the artwork competed with the doctor.

## Measured result

| Viewport | Portrait before (px) | Portrait after (px) | Anatomy image before | Anatomy image after | Booking button bottom / bar top after |
|---|---|---|---|---|---|
| 360×800 Arabic | 157×120, beside the plate | 320×240, first on the page | 139×139 | not shown (see below) | 603 / 729 |
| 390×844 Arabic | 174×133 | 350×253 | 152×152 | not shown | 619 / 773 |
| 430×932 English | 196×149 | 390×270 | 170×170 | not shown | 657 / 861 |
| 768×1024 Arabic | 295×225 | 278×334 beside the name | 273×273 | 112×112 | 568 / 955 |
| 1100×800 English | 188×143 | 378×454 | 404×404 | 112×112 | 571 / none |
| 1366×768 Arabic, dark | 230×175 | 373×448 | 448×448 | 183×183 | 631 / none |
| 1440×900 English | 230×175 | 378×454 | 448×448 | 192×192 | 605 / none |
| 1920×1080 English | 230×175 | 378×454 | 448×448 | 192×192 | 608 / none |

On desktop the portrait's area went from about 40,000 px² to about 172,000 px², and the anatomy image from about 200,000 px² to about 37,000 px². The portrait no longer overlaps anything.

## What changed

- **Desktop, 1320 px and wider:** three columns: text (6), small lens plate (2), portrait (4). The columns mirror in Arabic.
- **1024–1319 px:** text and portrait; the plate is a small strip under the text.
- **Tablet:** text beside the portrait; the plate is a small strip under the text.
- **Phones, under 640 px:** the portrait comes first, in a full-width panel whose background is the photograph's own grey, then name, specialty and booking. The short biography follows the booking button. Its text is unchanged; only the order differs on phones.
- **The lens plate on phones is hidden.** The same cataract plate is PL.01 in the gallery directly below, so nothing is lost. A lazy image in a hidden element is not downloaded, so phones save that request.

The approved palette, type, numbered eyebrow and portrait mat are unchanged.

## Image source

| File | Size | Finding |
|---|---|---|
| `dr-maan-portrait.png` | 295×225 | Studio photograph. Figure about 187 px wide. **Used.** |
| `dr-maan-redsea.jpg` | 682×1024 | Conference photo, sharper face. Rejected for the hero: purple stage background against the approved palette, conference lanyard, event logos and a background attendee. Owner confirmation for it is still open. It stays on `/about/`. |
| `dr-maan-faculty.jpg` | 1024×768 | Group of seven people, no documented consent. Not used. |
| `doctor-portrait.jpg` | 200×200 | Smaller than the studio photo. Used only for social and structured data. |

No higher-resolution original exists in the repository or in its git history.

`dr-maan-portrait-hero.webp` (374×450, 17 KB) is the studio photograph cropped to the figure and resampled to twice its size with Lanczos. Nothing was generated, retouched or sharpened, and no AI enhancement was used.

## Known limit

The photograph is displayed at about twice its source pixels, so it is visibly soft on large and high-density screens. The display width is capped for that reason (`tests/hero-portrait.spec.js` enforces at most 2.1 times the source figure). **A new professional photograph, at least 1600 px on the long side, remains the real fix.** The layout needs no change to use one: replace the image file and its width and height.

## Tests

`tests/hero-portrait.spec.js`, real browser geometry: portrait first and at least 190 px tall at 320–430 px in AR and EN, no overlap with the title, no sideways scroll, plate hidden on phones; booking button on the first screen at 360, 390 and 430 px; on desktop at 1366, 1440 and 1920 px the portrait is at least 340 px wide and more than three times the plate's area and everything sits in the first screen; no distortion.

One existing test changed: `tests/phase1-mobile.spec.js` "images load" now counts only rendered images, because a lazy image in a hidden element is never fetched by design. Broken-image detection for every rendered image is unchanged.

The phone home height budgets are unchanged. Arabic is 9,228 px against 9,250.
