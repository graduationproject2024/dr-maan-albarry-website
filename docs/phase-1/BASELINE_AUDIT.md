# Phase 1 — Baseline audit (2026-11-03)

## Source control
| Item | Value |
|---|---|
| Production | `main` at `95702cd`, live at https://graduationproject2024.github.io/dr-maan-albarry-website/ (deployed 2026-11-02) |
| Phase 1 branch | `feat/phase-1-premium-experience`, created from `origin/main` (`95702cd`) |
| Uncommitted user work at start | None. Only the untracked `.claude/`, `graphify-out/` and an old docs zip, all left untouched. |
| Production protection | Nothing pushed, merged or deployed during Phase 1 |

## Live site at baseline
16 prerendered pages: home and 7 procedure pages, each in Arabic and English. Interactive features:
- Vision simulator, embedded on the homepage
- 3D cataract simulator, started on demand
- Questionnaire
- FAQ

## Measured page heights (production, Playwright, full page)
| Page | Height |
|---|---|
| Home, AR, 1440 | **10,746 px** |
| Home, EN, 1440 | **11,026 px** |
| Home, AR, 390 | **14,943 px** |
| Home, EN, 390 | **15,322 px** |
| Lens implants page, EN, 1440 | 5,800 px |
| Cataract page, AR, 1440 | 6,357 px |

## Owner complaints, confirmed against the baseline screenshots
| # | Complaint | Observed |
|---|---|---|
| 1 | Homepage too long | Yes: about 10.7k px on desktop and 15k px on phones |
| 2 | Unused desktop width | Yes: content sits in a narrow column, with wide empty margins at 1440 |
| 3 | Content narrow and small | Yes: small card text in the procedure grid and qualification lists |
| 4 | Content removed | Yes: see `CONTENT_PRESERVATION_MATRIX.md`. The lens comparison sheet, the answer-driven questionnaire, the biography and the guides were lost or reduced. |
| 5 | Weak IOL comparison | Yes: only a "Types" list on the lens-implants page, with no side-by-side view and no pros and cons |
| 6 | Doctor identity weak | Yes: the profile was one compact section with no biography page |
| 7 | Repetitive illustrations | Yes: all 7 used the same sagittal cut-away with minor changes |
| 8 | Unclear simulator | Partly: many technical controls (astigmatism, axis, sphere, slider) were shown at once |
| 9–11 | No narrative; generic look; nothing for curious visitors | Yes: a uniform section rhythm and no exploratory experience |

## Screenshots
`docs/phase-1/evidence/baseline/`:
- `ar-desktop-light.jpg`, `ar-desktop-dark.jpg`, `en-desktop-light.jpg`
- `ar-mobile.jpg`, `en-mobile.jpg`
- `catalog-ar-desktop.jpg`, `profile-ar-desktop.jpg`
- `lens-comparison-en-desktop.jpg`, `vision-sim-ar-desktop.jpg`
- `procedure-cataract-ar-desktop.jpg`

They were taken from production, which is identical to `main`.
