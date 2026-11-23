# Final acceptance matrix (brief §40)

Legend: [x] done · [~] partial · [ ] not done

## Medical content
- [x] All supplied achievements inventoried (A01–A16, L01, D01, D02, each with its original wording)
- [x] All supplied dates preserved
- [x] Qualifications integrated (ICO, KSU 2004, KKESH 2005)
- [x] Conflicting credentials reconciled: 15,000+ marked superseded, no duplicates
- [x] First-in-region claims handled with evidence (`FIRST_IN_REGION_CLAIMS.md`)
- [x] Scientific publications linked where verified (6, PubMed)
- [x] No invented studies (the dropless paper was not found, so it is not published)
- [~] No false superlatives published. Exception: the "first President" role was already on the site and remains undocumented; the owner must confirm the organisation.

## Devices
- [x] iTrace section
- [ ] **Authentic iTrace photo** (none supplied or licensed)
- [x] Pentacam AXL Wave section
- [ ] **Authentic Pentacam AXL Wave photo** (none supplied or licensed)
- [x] Correct device names
- [x] Functions taken from the official manufacturer pages
- [x] First-in-region status documented

## IOL
- [x] Ocular-surface (dry-eye) guidance
- [x] Standard monofocal, enhanced monofocal, EDOF, trifocal and toric
- [x] Distance examples: 40 / 50 / 65 cm
- [x] No guaranteed freedom from glasses
- [x] Toric modelled as a correction added to a lens design
- [x] Simulator outputs medically responsible (unit-tested)

## Visual UX
- [x] Hero eye removed
- [x] Procedure gallery simplified
- [~] ICL image: 3D details are off by default; the static plate is unchanged
- [ ] Lens Lab visual redesign
- [~] Light Journey: autoplay added; the drawing is unchanged
- [x] 3D experiences discoverable

## Interactive systems
- [x] Lens Lab functional (the reported break was not reproduced in Chromium)
- [x] Lens comparison works
- [x] Light Journey autoplay, with Play / Pause / Replay
- [~] Cameras audited, not re-authored
- [x] Anatomy details hidden by default
- [x] Before / After where medically supportable
- [~] Mobile UX checked at Playwright widths only

## Biography and gallery
- [x] Employment, academic credentials and leadership wording
- [x] Coherent professional timeline
- [x] Photo gallery built (3 categories, lightbox, captions in Arabic and English)
- [x] Image permissions and patient privacy enforced in code
- [ ] **Gallery published** (no photos supplied)

## Quality
- [~] Security: manual review plus npm audit in the gate; Semgrep and ZAP not available here
- [x] Accessibility: axe runs in the gate
- [ ] Performance not re-measured
- [~] Mobile: partial
- [x] Relevant Playwright tests pass (`REGRESSION_RESULTS.md`)
- [x] No new critical engineering failure
- [x] Trello reconciled: card #32 created; nothing closed
- [x] Deployment status stated truthfully: not pushed, not deployed
