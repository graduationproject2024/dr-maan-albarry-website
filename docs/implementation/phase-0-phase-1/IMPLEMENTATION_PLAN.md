# Implementation Plan — Phase 0 + Phase 1

**Branch:** `feat/phase0-phase1-trust-booking-mobile` (from `main` @ `9da524c`, clean tree)
**Date:** 2026-10-31
**Source of truth:** the audit package named in the brief (`docs/project-audit/*`) is not present in the repository, its history, or the local machine. Every roadmap item was re-verified against the code, the running build, and the official Magrabi and Taibah profiles. See [DOCTOR_DATA_DECISIONS.md](DOCTOR_DATA_DECISIONS.md).

## Baseline (measured on `main` build, see EVIDENCE/before)

| Defect | Measurement |
|---|---|
| Sticky bar actions off-screen | 2/4 at 360px (AR & EN), 1/4 at 390px |
| Clinic booking CTA label overflow | 273px label in 246px button (360 AR) |
| Simulator comparison tags | Overlapping at 360/390; view 290px wide |
| Hero booking CTA | Below a 380px portrait, off the first screen on phones |
| Page height | 25,846px (360 AR), 24,998px (390 AR) |
| Contacts | 3 numbers with overlapping roles (0554946433 for call **and** WhatsApp) |
| Claims | 15,000+/100% stats, SCFHS licence badge, Saudi Board, EDOF "favored" ×6 places, 2.2 mm, 3 reworded testimonials + 5★ |
| JSON-LD | Hand-written; hours, roles, FAQ and phone contradicted the page; fake breadcrumbs |

## Approach

1. **Single data module** `doctor-data.js` → page, JSON-LD (build-time injection), `/llms.txt` (build-time emission). Removes hand-maintained duplicates.
2. **Content integrity**: remove or neutralise every unverifiable claim. Nothing invented to replace it.
3. **Booking UX**: root-cause fixes. `.btn { white-space: nowrap }` caused the clipping, and a 4-item `flex` row caused the overflow. Replaced with a 3-column grid, wrapping labels, and mobile flex `order` for the hero.
4. **Tests**: Playwright against the production build (`vite preview`), bounding-box assertions, regression coverage, GPU-backed WebGL on Windows.
5. **Independent review**: medical content, code, and UI/accessibility reviewers. Fix all valid findings, then retest.

## Checklist

- [x] Baseline build, screenshots, measurements
- [x] `doctor-data.js` + Vite publisher plugin (JSON-LD, llms.txt)
- [x] Contact model reconciliation
- [x] Claims removed/neutralised (stats, licence, testimonials, EDOF, incision, hours, roles)
- [x] Testimonial publication gate
- [x] Booking bar rebuild (3 actions, safe-area, RTL/LTR, dark)
- [x] Hero CTA + mobile hierarchy
- [x] Clinic CTA wrapping
- [x] Simulator mobile tags and width
- [x] Duplicate scroll-listener fix
- [x] Playwright suite (Phase 0, Phase 1, regression)
- [x] Independent reviews + fixes + retest
- [ ] Clinic decisions (see BLOCKERS.md): open, not implementable by engineering
