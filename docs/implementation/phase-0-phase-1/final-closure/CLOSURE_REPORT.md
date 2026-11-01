# Phase 0 + Phase 1 — Final Closure Report

**Date:** 2026-11-01 · **Branch:** `feat/phase0-phase1-trust-booking-mobile`
**Starting commit (before Phase 0/1):** `9da524c` (main) · **Sprint start:** `cfa38e2` · **Code head:** `1b320ae` (+ docs commit)
**GitHub:** not pushed. Local branch is 4 commits ahead of `origin/main` (incl. docs). **Deployment:** none.

## Status
| | Status | Why |
|---|---|---|
| Phase 0 | **TECHNICALLY COMPLETE — PENDING EXTERNAL APPROVAL** | All engineering criteria pass. Clinic facts that can't be verified are kept out or neutral; the decisions are listed in [REMAINING_BLOCKERS.md](REMAINING_BLOCKERS.md). |
| Phase 1 | **VERIFIED COMPLETE** | All criteria measured and tested at 5 viewports × AR/EN × light/dark; screenshots reviewed by eye. |
| Trello | **Synced** | Board re-read after updates; see [TRELLO_CLOSURE_REPORT.md](TRELLO_CLOSURE_REPORT.md). |

## Fixes this sprint (commit `1b320ae`)
| Area | Defect confirmed in code | Fix |
|---|---|---|
| ARIA | FAQ `aria-expanded` never changed; article triggers had none; menu button had none | Synced on every toggle; `aria-controls` added |
| Keyboard | Escape did nothing on the open drawer | Escape closes it and returns focus to the menu button |
| Language | Choice lost on reload | Saved in `localStorage` (safe fallback to Arabic) |
| Observers | A new fade-in `IntersectionObserver` per render, old one never disconnected | Previous one disconnected; elements unobserved once shown |
| Three.js | `destroy()` disposed only the renderer | Scene geometries, materials, textures, render target disposed |
| WebGL | No `webglcontextlost` handling (view froze) | Render loop stops; bilingual fallback message shown |
| Mobile length | 22,691px at 390 AR | 20,335px: swipe rows for qualification/technology cards, smaller media, tighter section padding, footer column that repeated one anchor 4× hidden on phones. No medical text removed. |
| Evidence tooling | Capture script needed a manually started server | `npm run test:evidence` builds, serves and shuts down by itself |

Earlier sprint commits: `0a9d4f2` (Phase 0/1 core), `cfa38e2` (remaining copy, FAQ parity, short simulator tags, testimonial render tests).

## Verified, not changed
- Duplicate scroll listener: already fixed (`0a9d4f2`) and tested.
- Vite output: JSON-LD and `llms.txt` are generated from `doctor-data.js` at build; tests scan `dist/`.
- Analytics: none present; tracking stays disabled (no consent decision). Inert `data-cta` hooks only.

## Known, not fixed (out of Phase 0/1 scope or blocked)
- Canonical / hreflang / sitemap point at `drmaanalbarry.com/ar|en/`. The domain does not resolve and those paths don't exist (B-6, needs a domain decision; SEO phase).
- All content is rendered by JavaScript, so crawlers that don't run JS see only meta tags and JSON-LD. Pre-rendering is SEO-phase work.
- Not tested on real iOS/Android devices or Linux CI.

## Files changed this sprint
`main.js`, `style.css`, `package.json`, `tests/closure.spec.js` (new), `tests/measure.mjs`, `docs/implementation/phase-0-phase-1/final-closure/**` (new), `docs/implementation/PHASE_2_3_HANDOFF.md` (new).

## Working tree
Clean after the docs commit (verified with `git status --short`).
