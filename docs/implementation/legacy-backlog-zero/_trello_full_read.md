# Trello full read — board "Dr. Maan website"

Board: https://trello.com/b/8CkEGIqW/dr-maan-website
Read on: 2026-11-21 (read-only; via trelloReadCard `list_by_board` filter=all, then `get` per card; no card had commentsHasMore or checklistsHasMore = true unless noted).
Total cards returned: 31. All cards are in list "software". Comments are listed newest first, as returned by the API. Dates are UTC.

---

## #1 — update UI/UX

- URL: https://trello.com/c/IvNF5ujK/1-update-ui-ux
- Card id: 6ade085f72f569951ed64dbe
- complete: false
- dueComplete: false
- closed (archived): false
- Description: (empty)

### Checklists
(none)

### Comments (3)

**2026-11-02T17:04:22.249Z** — Ahmed Osama

```
2026-11-02 — STILL REOPENED: the owner rejected both earlier UI results. The current redesign is tracked on #18 and #19, and it is awaiting owner acceptance. The API can't clear this card's complete flag, so please treat it as not done.
```

**2026-11-01T12:50:57.629Z** — Ahmed Osama

```
REOPENED (2026-11-01): the owner rejected the visual result. The site still looked substantially unchanged, so the earlier "complete" status no longer reflects reality. The API in use cannot clear the complete flag. The open work is now tracked on the linked card "REOPENED — Premium original redesign" at the top of this list. Please treat this card as NOT done.
```

**2026-11-01T11:55:34.303Z** — Ahmed Osama

```
Closed 2026-11-01 as part of Phase 1 (card #12). Delivered and verified: rebuilt mobile booking bar, hero/clinic CTAs, mobile hierarchy, simulator mobile layout, swipe rows for card sets, ARIA/Escape/language-persistence fixes, WCAG AA contrast, page height 390px AR 24,998 → 20,335. Evidence: 92/92 Playwright tests over 360/390/768/1366/1440 × AR/EN × light/dark; screenshots in docs/implementation/phase-0-phase-1/final-closure/evidence. Commits 0a9d4f2, cfa38e2, 1b320ae (branch feat/phase0-phase1-trust-booking-mobile, not pushed). Future visual work (e.g. Phase 2/3 animation) belongs on its own cards.
```

---

## #2 — security

- URL: https://trello.com/c/RT9gzgZa/2-security
- Card id: 6ade0867b11fb80e52b7f993
- complete: false
- dueComplete: false
- closed (archived): false
- Description: (empty)

### Checklists
(none)

### Comments (2)

**2026-11-21T15:06:37.471Z** — Ahmed Osama

```
Closed by the owner on 2026-11-21 to start Phase 2. Security checks in place: npm audit and a security test file in the CI gate; no separate security audit was done.
```

**2026-11-02T17:04:19.963Z** — Ahmed Osama

```
2026-11-02 security review (docs/implementation/clinical-visual-reconstruction/SECURITY_RESULTS.md):
- npm audit found 0 vulnerabilities.
- Every new-tab link has rel=noopener.
- Hostile URL path, hash and query values never reach innerHTML (tested).
- No secrets were found in the repository.
- The three.js CDN global was removed.

The card stays OPEN; the hosting, domain and HTTP security headers are not covered yet.
```

---

## #3 — buying domain and server

- URL: https://trello.com/c/I24CjuQh/3-buying-domain-and-server
- Card id: 6ade087ba1b123d63f23a529
- complete: false
- dueComplete: false
- closed (archived): false
- Description: (empty)

### Checklists
(none)

### Comments (1)

**2026-11-21T15:06:09.688Z** — Ahmed Osama

```
Closed by the owner on 2026-11-21 to start Phase 2. Not done: no domain or server was bought; the site still runs on GitHub Pages.
```

---

## #4 — update pics

- URL: https://trello.com/c/x5dmJu82/4-update-pics
- Card id: 6ade088ef312950ffe16f003
- complete: false
- dueComplete: false
- closed (archived): false
- Description: (empty)

### Checklists
(none)

### Comments (5)

**2026-11-21T15:06:11.725Z** — Ahmed Osama

```
Closed by the owner on 2026-11-21 to start Phase 2. Still pending: a sharper authentic portrait photo of Dr. Maan (current one is an enlarged 295x225 source).
```

**2026-11-17T11:29:04.417Z** — Ahmed Osama

```
2026-11-17: No larger copy of the studio portrait exists in the project (source is 295x225). The hero photo is now one setting (PORTRAIT in doctor-data.js), and scripts/build-portrait.py prepares a new photo without enlarging or retouching it. Needed: an authentic studio photo of Dr. Maan, at least ~1600 px on the long side, plain light background, head to mid-chest, with written permission for web use. Details: DOCTOR_PORTRAIT_STATUS.md.
```

**2026-11-14T12:39:37.360Z** — Ahmed Osama

```
2026-11-14: the hero now leads with the doctor's portrait (live since 2026-11-10). The only studio photo in the project is 295×225 px, so it is shown at about twice its pixels and looks soft on large and high-density screens. No larger original exists in the repository or its history.

Needed from the owner: a professional portrait, at least 1600 px on the long side, plain background. The layout needs no change to use it. Details: docs/implementation/premium-ux-refinement/HERO_PORTRAIT_IMPROVEMENT.md
```

**2026-11-08T13:41:06.740Z** — Ahmed Osama

```
2026-11-08 status. Still open. Needed from the owner:
- A high-resolution portrait of Dr. Maan. The current file is 295×225 px, and this is the most valuable image fix.
- Permission for dr-maan-redsea.jpg (still pending).
- A decision on clinic-exam-room.jpg and diagnostics-pentacam.jpg, marked do-not-restore in HOMEPAGE_CONTENT_MATRIX.md (X7).

The 27 anatomical images on branch feat/premium-experience-reconstruction are original renders from the project's own pipeline, and all are pending physician review (card #22).
```

**2026-11-02T17:04:21.211Z** — Ahmed Osama

```
2026-11-02: 7 original procedural 3D procedure illustrations were added (public/images/procedures/, light and dark versions, docs/implementation/clinical-visual-reconstruction/ILLUSTRATIONS.md). They are still pending Dr. Maan's review. The card stays OPEN because a studio portrait of the doctor is still wanted.
```

---

## #5 — feeding website with real data

- URL: https://trello.com/c/QChgFp6v/5-feeding-website-with-real-data
- Card id: 6ade089ae5380b300ebd4566
- complete: false
- dueComplete: false
- closed (archived): false
- Description: (empty)

### Checklists (1)

#### Checklist: "Doctor content recovery (2026-11-01)" (id 6ae735bc4ad7065b02747c9e)

| State | Item | Check item id |
|---|---|---|
| COMPLETE | 15,000+ restored as "eye examinations & surgical procedures" (meaning confirmed by Dr. Maan) | 6ae736136a9d49dad5ea060a |
| COMPLETE | "100% adherence" kept in internal registry only (no measurable definition) | 6ae73615b5ec42df3ddd6826 |
| COMPLETE | Chief of Staff + supervision scope, Saudi Board, Associate Professor restored | 6ae7361642b1f5249d596c69 |
| COMPLETE | Direct line 0554946433 restored for calls + WhatsApp; clinic hours restored | 6ae736172b5efe9b676fbc26 |
| COMPLETE | Protected content registry + regression tests passing | 6ae736189bd3eec1ba66ccec |
| INCOMPLETE | Testimonials: verbatim text + written reuse permission (EXTERNAL) | 6ae73619da6e004af5cccd2e |
| INCOMPLETE | Written record of Dr. Maan's confirmations kept by owner (EXTERNAL) | 6ae7361a3c855820351f60b6 |

### Comments (4)

**2026-11-21T15:06:36.610Z** — Ahmed Osama

```
Closed by the owner on 2026-11-21 to start Phase 2. Real doctor data is on the site; open clinic questions were on card #13 (still pending).
```

**2026-11-02T17:04:17.648Z** — Ahmed Osama

```
2026-11-02: The procedure scope is recorded in doctor-data.js (PROCEDURES) and in content/internal-registry.json.
- Published by Magrabi: cataract, lens implants, laser vision correction, keratoconus/CXL.
- Confirmed by the owner on 2026-11-01: corneal transplant, intravitreal injections, ICL.

Still needed: a written record of that confirmation, and Dr. Maan's review of the 14 procedure pages, which are marked as drafts on screen. The card stays OPEN.
```

**2026-11-01T11:55:36.622Z** — Ahmed Osama

```
2026-11-01 — PENDING EXTERNAL APPROVAL (kept open on purpose). Engineering done: all public facts come from doctor-data.js and were checked against the official Magrabi and Taibah profiles. Still needs clinic input before this card can close: confirm the 0554946433 number and its role, the role titles (Chief of Staff vs Executive Medical Director; Taibah chair), clinic hours, testimonial permission, and any statistic or licence record. Tracked in card #13: https://trello.com/c/pLeNoaz1
```

**2026-10-31T17:27:20.720Z** — Ahmed Osama

```
2026-10-31: doctor/clinic data is now centralised in doctor-data.js and checked against the official Magrabi and Taibah profiles. Open data questions are on the "Doctor / clinic decisions needed" card.
```

---

## #6 — link with real Links

- URL: https://trello.com/c/ExSE5rfI/6-link-with-real-links
- Card id: 6ade08bfc0597f96e3be1c6c
- complete: true
- dueComplete: true
- closed (archived): false
- Description: (empty)

### Checklists
(none)

### Comments (1)

**2026-11-01T11:55:37.836Z** — Ahmed Osama

```
Re-verified 2026-11-01 (stays Done): every booking, call, WhatsApp and maps link is checked by automated tests in 20 viewport/language/theme combinations. Booking → ob.magrabi.com.sa/OnlineBooking/, call → tel:920018000 / 19505, WhatsApp → Magrabi line 966508533309, maps → official Google Maps link. Social links point at the same profiles with tracking parameters removed.
```

---

## #7 — Make Automatiom

- URL: https://trello.com/c/1I4Ejwoe/7-make-automatiom
- Card id: 6ade08f64a324d7e5c66ea12
- complete: false
- dueComplete: false
- closed (archived): false
- Description: (empty)

### Checklists
(none)

### Comments (1)

**2026-11-21T15:06:35.729Z** — Ahmed Osama

```
Closed by the owner on 2026-11-21 to start Phase 2. Automation in place: CI test gate before every deploy (card #28). No other automation was built.
```

---

## #8 — MAKE RESERVATION SYSTEM

- URL: https://trello.com/c/QvG3U5qK/8-make-reservation-system
- Card id: 6adf8a8034365c08aa9250ce
- complete: false
- dueComplete: false
- closed (archived): false
- Description: (empty)

### Checklists
(none)

### Comments (1)

**2026-11-21T15:06:32.663Z** — Ahmed Osama

```
Closed by the owner on 2026-11-21 to start Phase 2. Not built: no reservation system exists; booking still goes to the clinic's channels.
```

---

## #9 — make bot in website

- URL: https://trello.com/c/Ze2gSsPI/9-make-bot-in-website
- Card id: 6adfa9b7ff7d3d8efaf4fe70
- complete: false
- dueComplete: false
- closed (archived): false
- Description: (empty)

### Checklists
(none)

### Comments (1)

**2026-11-21T15:06:33.526Z** — Ahmed Osama

```
Closed by the owner on 2026-11-21 to start Phase 2. Not built: no chat bot exists on the site.
```

---

## #10 — make animation for procedures and services

- URL: https://trello.com/c/PvRcLgbP/10-make-animation-for-procedures-and-services
- Card id: 6ae6042e35db0fe5b0fc997a
- complete: false
- dueComplete: false
- closed (archived): false
- Description: (empty)

### Checklists (1)

#### Checklist: "Phase 2/3 — 3D cataract surgery simulator" (id 6ae735bb4ac010d8f656b790)

| State | Item | Check item id |
|---|---|---|
| COMPLETE | Architecture: lazy module, mount/destroy contract, state machine | 6ae735f42338b9a316f3b6fd |
| COMPLETE | 3D engine: lifecycle, resize, context loss/restore, disposal | 6ae735f58083eb6947b03284 |
| COMPLETE | Anatomy models (cornea, iris, lens, capsule, zonules, IOL) | 6ae735f6648fa9990144bca2 |
| COMPLETE | Asset licensing documented | 6ae735f74c781e2e7bed2174 |
| COMPLETE | 7 surgical stages with animation matching the text | 6ae735f8a98497ba45fbb362 |
| COMPLETE | Medical explanations AR/EN with sources (draft) | 6ae735f9976b3df29cb4cd7a |
| COMPLETE | Controls: play/pause/restart/stages/scrub/camera/anatomy/close | 6ae735fad354edaedc114a3d |
| COMPLETE | Bilingual UI and site integration (lazy-loaded section) | 6ae735fccd1ba992ea5507af |
| COMPLETE | Accessibility: keyboard, ARIA live, reduced motion, non-WebGL fallback | 6ae735fdbf07daef151da88b |
| COMPLETE | Mobile design verified (390/430, no overflow, page scroll works) | 6ae735fe2a61aa94ea54d961 |
| COMPLETE | Performance measured (FPS, chunk size, no main-bundle growth) | 6ae735ff704b6ddff78d9547 |
| COMPLETE | Automated tests passing + visual QA of every stage | 6ae736006d6c18240a2bc09f |
| INCOMPLETE | Clinical review and written approval by Dr. Maan (EXTERNAL) | 6ae7360136669ce0be80f38b |
| INCOMPLETE | Public release (needs clinical approval + push/deploy authorization) | 6ae73602c975bdf1c1a43b9a |

### Comments (2)

**2026-11-21T15:06:34.372Z** — Ahmed Osama

```
Closed by the owner on 2026-11-21 to start Phase 2. Only cataract surgery has a 3D animation; the other procedures have none.
```

**2026-11-02T17:04:15.818Z** — Ahmed Osama

```
2026-11-02 progress (#19 https://trello.com/c/zuYZ8RCL):
- Cataract 3D was rebuilt: literature-based anatomy, constrained motion, a validator (0 violations), capped cross-sections, and a clinical review mode.
- The vision simulator was rebuilt with a separate optics model.
- 7 procedure illustrations were added.

The card stays OPEN. All 7 stages and the vision model are still "Pending review" by Dr. Maan (docs/implementation/clinical-visual-reconstruction/CLINICAL_APPROVAL_STATUS.md), and public release still needs push and deploy authorization.
```

---

## #11 — Phase 0 — Doctor data & medical content integrity — TECHNICALLY COMPLETE (approvals tracked in card #13)

- URL: https://trello.com/c/KC7m25el/11-phase-0-doctor-data-medical-content-integrity-technically-complete-approvals-tracked-in-card-13
- Card id: 6ae624e0276cb85b1b4653cb
- complete: false
- dueComplete: false
- closed (archived): false

### Description

```
Status: TECHNICALLY COMPLETE. External approvals are split out to card #13 (https://trello.com/c/pLeNoaz1); this card does NOT claim clinic approval.

Branch feat/phase0-phase1-trust-booking-mobile — commits 0a9d4f2, cfa38e2, 1b320ae (local, not pushed).
- doctor-data.js single source → page, JSON-LD (build-injected), /llms.txt (build-generated)
- Contacts: one role per number (Magrabi 920018000 / 19505, Magrabi WhatsApp 966508533309, booking portal); unverified 0554946433 kept out of UI and bundle (safe interim)
- Removed: +15,000 / 100% stats, SCFHS licence badge, Saudi Board, EDOF preference wording, 2.2 mm, reworded testimonials + stars, conflicting hours, guarantee/superiority phrasing
- JSON-LD mirrors visible FAQ/title/phone; no Review/AggregateRating/fake breadcrumbs/hours
- P0-7 analytics: intentionally disabled (no consent decision) — inert data-cta hooks only
Tests: 92/92 Playwright pass (2026-11-01). Evidence: docs/implementation/phase-0-phase-1/
```

### Checklists
(none)

### Comments
(none)

---

## #12 — Phase 1 — Booking & mobile UX — VERIFIED COMPLETE

- URL: https://trello.com/c/OlFSP4n3/12-phase-1-booking-mobile-ux-verified-complete
- Card id: 6ae624e1be3bc2afd88e1950
- complete: false
- dueComplete: false
- closed (archived): false

### Description

```
Status: VERIFIED COMPLETE (no external approval needed for this scope).
Verified by Playwright on the production build: 360/390/768/1366/1440 × AR/EN × light/dark (20-combination smoke matrix) + targeted geometry tests.
- Sticky bar: 3 actions (Book / Call / WhatsApp), 0 off-screen (was 2/4 at 360), no clipping/overlap, ≥48px targets, safe-area, WCAG AA contrast
- Hero CTA on the first screen (mobile, 1366×768, 1440×900); clinic CTA label wraps (171px in 246px, was 273px)
- Simulator: tags don't overlap, short labels on phones, 44px controls, WebGL context-loss fallback, GPU resources disposed
- Mobile page height 390 AR: 24,998 → 20,335px (−18.7%) without removing medical content
- ARIA states synced, Escape closes drawer, language persists
Commits 0a9d4f2, cfa38e2, 1b320ae. Tests 92/92 pass.
```

### Checklists
(none)

### Comments
(none)

---

## #13 — PENDING EXTERNAL APPROVAL — Doctor / clinic decisions (D-1 … D-14)

- URL: https://trello.com/c/pLeNoaz1/13-pending-external-approval-doctor-clinic-decisions-d-1-d-14
- Card id: 6ae624e317047136a084cd5c
- complete: false
- dueComplete: false
- closed (archived): false

### Description

```
See docs/implementation/phase-0-phase-1/DOCTOR_DATA_DECISIONS.md and BLOCKERS.md.
Key items:
- D-1 Is 0554946433 official, and for which role? (Magrabi publishes WhatsApp 966508533309 for Dr. Maan)
- D-2/D-3 Role wording: "Chief of Staff" vs Magrabi's "Executive Medical Director"; Taibah chair "former, 10 yrs" vs Magrabi present tense
- D-4..D-7 Confirm first SSCCRS president, Red Sea co-founder, SOS rep, since 1998
- D-8 Clinic hours
- D-9 SCFHS licence record (if a badge is wanted)
- D-10 Written permission + verbatim text for testimonials
- D-11 Any statistic with a source
- D-12 Any personal lens statement (approved text)
- D-13 Analytics provider + consent (P0-7)
- D-14 Production domain (drmaanalbarry.com does not resolve)
```

### Checklists
(none)

### Comments (5)

**2026-11-21T15:06:07.941Z** — Ahmed Osama

```
Closed by the owner on 2026-11-21 to start Phase 2 with a clean board. Clinic decisions D-1 to D-14 are still PENDING: closing this card does not answer them (DOCTOR_DATA_DECISIONS.md).
```

**2026-11-02T17:39:13.876Z** — Ahmed Osama

```
2026-11-02 update: item (f) is resolved. On the owner's go-ahead, BUG-05 was fixed with metric-matched fallback fonts. The brand fonts are unchanged; layout shift went from 0.25–0.28 to 0.0002 (emulated). The fallback metrics were calibrated on Windows fonts, so a real Android or iOS device check is still recommended. Items (a)–(e) remain open.
```

**2026-11-02T17:04:18.775Z** — Ahmed Osama

```
2026-11-02, new external items from the clinical and visual reconstruction (#19):
- (a) Dr. Maan reviews the 14 procedure pages.
- (b) Dr. Maan reviews the 7 cataract simulator stages, using the review mode (?review=1).
- (c) Dr. Maan reviews the vision simulator's optical model and its wording.
- (d) Dr. Maan reviews the 7 procedure illustrations.
- (e) A written record of the owner's procedure-scope confirmation.
- (f) A font-loading decision for BUG-05, a layout shift on slow first loads (#20).

Nothing has been approved.
```

**2026-11-01T17:13:04.692Z** — Ahmed Osama

```
2026-11-01: the owner answered for Dr. Maan, and these items are now resolved and implemented:
- D-1: 0554946433 is approved for calls + WhatsApp. It replaces the Magrabi WhatsApp line on the site.
- D-2/D-3: Chief of Staff, with the general-supervision scope, is confirmed.
- D-8: clinic hours Sat–Thu 9:00–13:00 and 17:00–21:30 are confirmed.
- D-11: 15,000+ is confirmed as a combined total of eye examinations and surgical procedures. "100%" is kept internal only.
- Saudi Board and Associate Professor are also confirmed.

Still open:
- D-9: licence/SCFHS classification statement, only if a badge is wanted.
- D-10: testimonial permission plus verbatim text.
- D-12: any personal lens statement.
- D-13: analytics and consent.
- D-14: production domain.
- NEW: clinical review and written sign-off of the 3D surgery stage texts (docs/implementation/master-redesign-phase-2-3/CLINICAL_REVIEW.md).
- NEW: the owner should keep the written or messaged record of Dr. Maan's confirmations.

Record: docs/implementation/recovery/DOCTOR_CONTENT_RECOVERY.md
```

**2026-11-01T11:55:38.833Z** — Ahmed Osama

```
2026-11-01: This is now the single card holding every open external approval for Phase 0/1. All engineering cards are closed; nothing here blocks further development. When the clinic answers, update doctor-data.js and run `npm test`.
```

---

## #14 — Booking fixes — sticky bar, hero CTA, clinic CTA

- URL: https://trello.com/c/pZMWtOVi/14-booking-fixes-sticky-bar-hero-cta-clinic-cta
- Card id: 6ae624e4ab3b37e41bc0ed82
- complete: false
- dueComplete: false
- closed (archived): false

### Description

```
Done and verified (bounding-box tests at 360/390/768/1366/1440, AR+EN, light+dark). Before/after screenshots in docs/implementation/phase-0-phase-1/EVIDENCE/.
```

### Checklists
(none)

### Comments
(none)

---

## #15 — Mobile regression tests (Playwright)

- URL: https://trello.com/c/drvka5fD/15-mobile-regression-tests-playwright
- Card id: 6ae624e55c25f90f38e83158
- complete: false
- dueComplete: false
- closed (archived): false

### Description

```
tests/phase0-content.spec.js (14) + tests/phase1-mobile.spec.js (52) + tests/closure.spec.js (26): 92 tests, all passing on 2026-11-01. Earlier stability run: 128/128 with --repeat-each=2, 0 flaky. Run with `npm test` (always rebuilds; uses the GPU via ANGLE on Windows because SwiftShader makes the WebGL simulator ~9 s per interaction).
```

### Checklists
(none)

### Comments
(none)

---

## #16 — Independent review (medical content, code, UI/accessibility)

- URL: https://trello.com/c/56cY9Oam/16-independent-review-medical-content-code-ui-accessibility
- Card id: 6ae624e7a320aa832253855c
- complete: false
- dueComplete: false
- closed (archived): false

### Description

```
Three independent reviews ran. All blocker/should-fix findings in scope were fixed and retested (WhatsApp contrast, stale-build test risk, trust labels, "zero halos"/"95%" options, desktop CTA fold, etc.). Findings and dispositions: docs/implementation/phase-0-phase-1/EVIDENCE/REVIEWER_FINDINGS.md
```

### Checklists
(none)

### Comments
(none)

---

## #17 — Phase 0+1 completion verification — technical verification DONE (approvals in #13)

- URL: https://trello.com/c/LieKDul1/17-phase-01-completion-verification-technical-verification-done-approvals-in-13
- Card id: 6ae624e8e49afe003173c314
- complete: false
- dueComplete: false
- closed (archived): false

### Description

```
Technical verification complete on 2026-11-01: build OK, 92/92 Playwright tests, 20-combination viewport/language/theme matrix, manual screenshot review, npm audit 0 vulnerabilities. Report: docs/implementation/phase-0-phase-1/final-closure/CLOSURE_REPORT.md.
Not claimed: clinic approvals (card #13), GitHub push, deployment. Cataract 3D work not started (Phase 2/3).
```

### Checklists
(none)

### Comments (1)

**2026-11-01T12:19:24.131Z** — Ahmed Osama

```
2026-11-01 — Deployed. PR #1 merged to main (402bc49). GitHub Pages source switched from "Deploy from a branch" to "GitHub Actions", so the built output is now served. Verified live at https://graduationproject2024.github.io/dr-maan-albarry-website/:
- 3-action booking bar
- JSON-LD (Physician + FAQPage, telephone 920018000)
- /llms.txt returns 200
- no preference claims, no 0554946433
Clinic approvals remain on card #13.
```

---

## #18 — REOPENED — Premium original redesign (owner rejected previous UI result)

- URL: https://trello.com/c/5BmdrjxS/18-reopened-premium-original-redesign-owner-rejected-previous-ui-result
- Card id: 6ae735b0390f7221017ba231
- complete: false
- dueComplete: false
- closed (archived): false

### Description

```
Corrective task for "update UI/UX" (https://trello.com/c/IvNF5ujK), which was marked complete on 2026-11-01. The owner does not accept that visual result as a redesign: the site still looked almost unchanged. The Trello API used here cannot clear a card's complete flag, so this linked card carries the open work instead.

Scope: an original, art-directed redesign of every section in AR/EN and light/dark, mobile-first, with no Stitch files or templates. The before/after evidence goes in docs/implementation/master-redesign-phase-2-3/.

Design lead: a design-specialist subagent using real skills. There is no dedicated "Claude Design" tool, and this is disclosed.
```

### Checklists (1)

#### Checklist: "Redesign acceptance" (id 6ae735ba13b12e65c66c0996)

| State | Item | Check item id |
|---|---|---|
| COMPLETE | Design system documented (tokens, type, grid, motion, RTL/LTR) | 6ae735d068ea02968dfed6d0 |
| COMPLETE | Header, navigation and hero materially redesigned | 6ae735d2b0aa48fb4a84df84 |
| COMPLETE | Doctor profile, credentials and achievements redesigned | 6ae735d3f1ff425e824de6fa |
| COMPLETE | Specialties, services, education, FAQ, clinic and footer redesigned | 6ae735d42d41b7ade91d7cc4 |
| COMPLETE | Mobile 360–430 polished; AR/EN and light/dark verified | 6ae735d5277f0dbab028fba8 |
| COMPLETE | Before/after screenshots reviewed; critical visual defects fixed | 6ae735d6b09a583af93c1523 |
| INCOMPLETE | Owner visual acceptance (EXTERNAL) | 6ae735d8624056173f2681f3 |

### Comments (5)

**2026-11-21T15:06:10.536Z** — Ahmed Osama

```
Closed by the owner on 2026-11-21 to start Phase 2. The redesign direction was approved and is live (card #25).
```

**2026-11-14T12:39:35.369Z** — Ahmed Osama

```
2026-11-14: the owner's brief of 2026-11-09 states that the current overall visual design is APPROVED and must be preserved ("A — Premium Medical Editorial" with the anatomical atlas). That is the owner acceptance this card was waiting for, so its redesign scope is accepted.

What is still open is not the redesign: UX refinements (new card "Premium UX refinement"), a higher-resolution portrait (card #4), and physician review (card #22). This card is left for the owner to mark complete.
```

**2026-11-09T11:58:02.134Z** — Ahmed Osama

```
2026-11-09: the new design is live, because the owner asked to deploy it to show a customer. That instruction is not recorded as visual acceptance, so this card stays OPEN until the owner says the redesign is accepted.
```

**2026-11-08T13:41:02.572Z** — Ahmed Osama

```
2026-11-08 status. A new design is built and verified on branch feat/premium-experience-reconstruction: "A — Premium Medical Editorial" with labelled anatomical plates, chosen by the owner on 2026-11-07 from three rendered directions. It is NOT pushed, merged or live.

Engineering: four visual review passes done (VISUAL_ACCEPTANCE.md), full suite 497 passed, 0 failed, 24 skipped. Tracker: card #21.

This card stays OPEN. Owner acceptance is still pending, and engineering tests do not stand in for it. To close: the owner reviews the branch build and accepts it. Open owner items: a high-resolution portrait (the current file is 295×225 px), and Lens Lab is still very long at 390 px.
```

**2026-11-02T17:04:14.568Z** — Ahmed Osama

```
2026-11-02: The owner also rejected the navy/gold redesign (PR #2), and it has been replaced by an original "clinical atlas" design on branch feat/clinical-visual-reconstruction. That branch is stacked on PR #2 and is not pushed. The work is tracked on card #19 (https://trello.com/c/zuYZ8RCL). This card stays OPEN: "Owner visual acceptance" has not happened.
```

---

## #19 — Clinical & visual reconstruction — procedure library, simulators, patient-journey QA

- URL: https://trello.com/c/zuYZ8RCL/19-clinical-visual-reconstruction-procedure-library-simulators-patient-journey-qa
- Card id: 6ae8c1fd1a7638e7a5ed0826
- complete: false
- dueComplete: false
- closed (archived): false

### Description

```
Branch feat/clinical-visual-reconstruction (local, NOT pushed). It stacks on PR #2 (feat/master-redesign-phase-2-3).

Engineering is done and verified on 2026-11-02. Clinical approval and owner acceptance are still open, so this card stays OPEN.

What was delivered:
- **Design and structure:** an original "clinical atlas" design system (rejected navy/gold design replaced) and a new homepage structure.
- **Procedure library:** 7 procedures with 14 prerendered pages (AR/EN) and consistent procedural 3D illustrations.
  - Scope: Magrabi-published + owner-confirmed 2026-11-01 (corneal transplant, intravitreal injections, ICL).
- **3D cataract simulator:** anatomy rebuilt from literature values, motion rebuilt (continuous capsulorhexis, phaco quadrants, IOL unfold in the bag), a constraint validator (0 violations over 7007 states), capped cross-sections, Snell-traced illustrative rays, and a clinical review mode.
- **Vision simulator:** rebuilt with a pure optics model (defocus, pupil, astigmatism, through-focus lens models, halo/glare), every effect classified, and the legacy r128 simulator removed.
- **Patient-journey QA (emulated devices):** 8 personas + 13 core journeys, 217 logged steps; 17 defects recorded and every P0/P1 fixed.
- **Checks:** axe found 0 violations on 16 pages × 2 themes; npm audit 0.
- **Tests:** full suite 306 passed, 0 failed, 16 skipped.

Docs: docs/implementation/clinical-visual-reconstruction/
```

### Checklists (1)

#### Checklist: "Acceptance gates" (id 6ae8c2078b73fc7a50913567)

| State | Item | Check item id |
|---|---|---|
| COMPLETE | Original redesign + new homepage IA (DESIGN_SYSTEM.md, VISUAL_QA.md) | 6ae8c223b15c919536e8ce10 |
| COMPLETE | Procedure gallery + 14 dedicated pages AR/EN, prerendered, SEO | 6ae8c224c9ab57d48b87dcd7 |
| COMPLETE | Consistent 3D procedure illustrations (ILLUSTRATIONS.md) | 6ae8c226e2af1f4be3de23d6 |
| COMPLETE | Cataract 3D: anatomy, motion, cross-section, constraints, review mode (engineering) | 6ae8c22740427649f98887ae |
| COMPLETE | Vision simulator: optics model separated, effects classified, UI rebuilt (engineering) | 6ae8c228603a0bbec4ec162a |
| COMPLETE | Patient-journey QA: personas A–H + J01–J13 logged, fixed, retested (emulated) | 6ae8c22a1b07651d132710d3 |
| COMPLETE | No open P0/P1 engineering defects; full suite green | 6ae8c22b559d20a818029003 |
| INCOMPLETE | Clinical review of procedure pages, 7 cataract stages and vision model by Dr. Maan (EXTERNAL) | 6ae8c22c185aaea015f66c1d |
| INCOMPLETE | Owner visual acceptance of the new design (EXTERNAL) | 6ae8c22e72876d9c27713869 |
| INCOMPLETE | Real-device + screen-reader testing (not done; emulation only) | 6ae8c22fa9e9737da3d812f1 |
| COMPLETE | Push + deploy — DONE 2026-11-02 on owner instruction (main 95702cd, Pages run 41495932578 success) | 6ae8c230653c87c62390619d |

### Comments (2)

**2026-11-08T13:41:03.584Z** — Ahmed Osama

```
2026-11-08 status. The "local, NOT pushed" note in the description is out of date: this work was merged and deployed to main at 95702cd.

New on branch feat/premium-experience-reconstruction (not live yet): separate clinical review gates and versioning for the 3D cataract simulator and a new review mode for the vision simulator.

This card stays OPEN. Physician review is now tracked on card #22, and owner acceptance on card #18. Nothing has been clinically approved.
```

**2026-11-02T17:59:53.892Z** — Ahmed Osama

```
2026-11-02 DEPLOYED on the owner's instruction. feat/clinical-visual-reconstruction was merged into main (95702cd), and the GitHub Pages Actions run 41495932578 succeeded.
Live: https://graduationproject2024.github.io/dr-maan-albarry-website/

Verified live:
- All 16 pages return 200, plus the sitemap and the illustrations.
- All images load.
- The vision simulator and the 3D cataract simulator mount.
- No console errors and no horizontal overflow at 390 and 1440.
- SEO tags (canonical, hreflang, sitemap) point at the Pages address, because drmaanalbarry.com does not resolve yet.

The site is public BEFORE Dr. Maan's clinical review. Every procedure page and simulator stage shows "draft pending review". The card stays OPEN for the clinical review and the owner's acceptance. PR #2 is now superseded.
```

---

## #20 — Bug register — patient-journey QA (17 defects)

- URL: https://trello.com/c/8qITIvEl/20-bug-register-patient-journey-qa-17-defects
- Card id: 6ae8c1ff9fd2d66e37757d65
- complete: false
- dueComplete: false
- closed (archived): false

### Description

```
Source: docs/implementation/clinical-visual-reconstruction/BUG_REGISTER.md. That file holds each bug's reproduction steps, evidence, root cause, fix, regression test and retest. The regression tests are in tests/journey-regressions.spec.js. All results come from emulated devices (Chromium, Windows, RTX 2060); no physical device was used.

Status:
- P0: 0.
- P1: 2 (BUG-03 WebGL context leak, BUG-16 vision simulator contrast 1.1:1). Both fixed and verified.
- Open:
  - BUG-05 (P2): layout shift 0.17–0.28 on slow first loads at 320–360px when the web fonts arrive. Needs a font-loading decision.
  - BUG-13 (P3): harmless three.js warnings after the graphics context is restored. Accepted.
- Won't fix: BUG-14 (P3), by design.
- Rejected: BUG-07, a test artefact.
- Partial fix: BUG-11 (P3), deep links on hosts without a 404 fallback page.

Integration fixes (also verified):
- The lazy vision simulator mount pushed sections about 1,350px down.
- The phone viewer was 332px wide, below the 334px floor.

This card stays OPEN until BUG-05 is resolved.
```

### Checklists (1)

#### Checklist: "Defects" (id 6ae8c208fbef1f9081b1b744)

| State | Item | Check item id |
|---|---|---|
| COMPLETE | P1 BUG-03 WebGL context leak per simulator mount — fixed, regression test, retested | 6ae8c25c62f3c611576ef7af |
| COMPLETE | P1 BUG-16 vision-sim title contrast 1.1:1 (light) — fixed, axe clean, retested | 6ae8c25debd085c67d6abde1 |
| COMPLETE | P2 BUG-01/02/06/09/10/12/17 + P3 BUG-04/08/15 — fixed, regression tests, journeys retested | 6ae8c25ece21013bbb1a9605 |
| COMPLETE | Integration: lazy vision-sim mount shifted sections ~1,350 px; phone viewer 332 px < 334 px floor — fixed | 6ae8c25f687b1282558f2b91 |
| COMPLETE | P2 BUG-05 font-swap layout shift — FIXED (metric-matched fallback fonts; CLS 0.25–0.28 → 0.0002, Slow 3G 0.17 → 0; commit d995bcc) | 6ae8c260bf4c1a4264601821 |
| INCOMPLETE | P3 BUG-11 deep links on static hosts without a 404 fallback — partial; custom 404 page still to do | 6ae8c261f8bc1c44fda71bd4 |
| COMPLETE | P3 BUG-13 accepted (benign three.js warnings), BUG-14 won't fix (by design), BUG-07 rejected (test artefact) | 6ae8c262981d899494dbdfb3 |
| INCOMPLETE | P3 BUG-18 intermittent axe failure (dark intravitreal page, 1 of ~6 full runs, not reproducible) — monitoring; scan now waits for transitions and keeps failure details | 6ae8cac0f0b7439393c2e16d |

### Comments (3)

**2026-11-21T15:07:00.763Z** — Ahmed Osama

```
Closed by the owner on 2026-11-21 to start Phase 2. BUG-05 measured effectively resolved (CLS ≤ 0.003 on five pages, final-stabilization PERFORMANCE_RESULTS.md); BUG-13 accepted.
```

**2026-11-17T11:29:05.436Z** — Ahmed Osama

```
2026-11-17 measurement for BUG-05 (layout shift when fonts arrive): on the final-stabilization branch, Fast 3G + 4x CPU, 5 runs each, CLS was at most 0.003 on home AR/EN, cataract and procedures pages (0.034 max on the Lens Lab page). Lab numbers, not field data. Suggest the owner closes this card if satisfied; I have not marked it done. BUG-11 (deep links on hosts without a 404 page) is fixed on the branch: the build now ships a 404.html.
```

**2026-11-08T13:41:04.561Z** — Ahmed Osama

```
2026-11-08 status. This card's close condition is met: BUG-05 is Fixed (docs/implementation/clinical-visual-reconstruction/BUG_REGISTER.md).

Re-measured on the current branch build, home page in Arabic, Fast 3G + CPU 4x, emulated: CLS 0 in 3 of 3 runs at 320 px and 3 of 3 runs at 360 px (the bug measured 0.17-0.28).

Dispositions carried over: BUG-11 (P3) partial fix, deep links on hosts without a 404 fallback page; BUG-13 (P3) accepted; BUG-14 (P3) won't fix; BUG-07 rejected.

New defects are on card #23.
```

---

## #21 — Premium experience reconstruction — engineering tracker (live since 2026-11-09)

- URL: https://trello.com/c/okVpWtNG/21-premium-experience-reconstruction-engineering-tracker-live-since-2026-11-09
- Card id: 6af07bcb975568633122cb0a
- complete: false
- dueComplete: false
- closed (archived): false

### Description

```
Branch feat/premium-experience-reconstruction at 0210e89 and later doc commits. Built on main 9322dd9. NOT pushed, merged or deployed.

This card tracks engineering only. The checklist items are ticked when their own technical criteria passed. A ticked item does not mean the redesign is accepted:
- Owner visual acceptance stays on card #18.
- Physician review is on the separate "PENDING PHYSICIAN REVIEW" card.

Design: "A — Premium Medical Editorial" with B's labelled anatomical plates, chosen by the owner on 2026-11-07 from three rendered directions.

Test result, 2026-11-08, at 0210e89: full Playwright suite 497 passed, 0 failed, 24 skipped (flag-gated perf and evidence runs). An earlier full run on 20e1eae had 2 flaky failures (persona C step 8, routing subpath), each passing 3/3 alone; see FIX_VERIFICATION.md.

All results are Chromium/WebKit browser emulation on Windows. No physical phone and no screen reader were used.

Docs: docs/implementation/premium-experience-reconstruction/

This card stays open until the branch is merged on the owner's instruction.
```

### Checklists (1)

#### Checklist: "Tracks (engineering criteria only)" (id 6af07bec0288e4b799d66b8c)

| State | Item | Check item id |
|---|---|---|
| COMPLETE | Reference research (REFERENCE_SITE_AUDIT, MADINAH_CULTIVATOR_SECTION_MAP, MEDICAL_SITE_BENCHMARK, 21ST_COMPONENT_RESEARCH) | 6af07c3d5b40f86681be7d44 |
| COMPLETE | Skill discovery (SKILLS_AND_AGENTS_USED) | 6af07c3e5a8e45bf4745fc0f |
| COMPLETE | Three design directions, rendered (THREE_DESIGN_DIRECTIONS, directions/) | 6af07c409eed177aa2710cbb |
| COMPLETE | Chosen design direction (owner choice 2026-11-07, DESIGN_DIRECTION_SELECTION) | 6af07c4166397aad170b82a1 |
| COMPLETE | Typography (self-hosted Arabic and English fonts, TYPOGRAPHY_SYSTEM) | 6af07c424152e7686a6d8df8 |
| COMPLETE | Homepage rebuilt (HOMEPAGE_CONTENT_MATRIX, BEFORE_AFTER) | 6af07c43ddb703d80085852b |
| COMPLETE | Procedure gallery (all 7 procedures as plates PL.01-07) | 6af07c44d73ae4bf957382a6 |
| COMPLETE | Anatomical images rendered and integrated: 27 images (engineering only; physician review on card #22) | 6af07c45fb0e7945ffaa4cf1 |
| COMPLETE | Secondary pages (procedure pages, doctor profile, internal pages) | 6af07c468c5e3b3ed5d2c8b3 |
| COMPLETE | Mobile design: 320-1440 px, phone trim per owner decision 2026-11-08 (MOBILE_DESIGN) | 6af07c4751760d2b9299bfa8 |
| COMPLETE | Simulator presentation in the new design tokens | 6af07c4876c11ca64042032f |
| COMPLETE | Cataract review mode (separate gates, versioning, export; tool only, no approvals recorded) | 6af07c497d406b15f177d5eb |
| COMPLETE | Vision review mode (separate gates, versioning, export; tool only, no approvals recorded) | 6af07c4a5501e19668e8fa32 |
| COMPLETE | Browser tests: 497 passed, 0 failed, 24 skipped at 0210e89 (emulation) | 6af07c4b0fd4e89566088cb5 |
| COMPLETE | Visual QA: four engineering passes (VISUAL_ACCEPTANCE; owner acceptance on card #18) | 6af07c4c2e2b62e8d4ad5d9b |
| COMPLETE | Bug fixes: BUG-19 to BUG-28 (card #23) | 6af07c4de3632e83627b738d |
| INCOMPLETE | External clinical approvals: NOT DONE (card #22 and card #13) | 6af07c4e2b264d1a0342c601 |

### Comments (2)

**2026-11-14T12:39:38.476Z** — Ahmed Osama

```
2026-11-14: follow-up work is tracked on the new card "Premium UX refinement". The scrubber-tap flake recorded here (Persona C step 8) had a real cause: on short phones the 3D playback controls could sit under the booking bar after Start. Fixed on branch feat/premium-ux-refinement with a regression test; not live yet.
```

**2026-11-09T11:58:00.975Z** — Ahmed Osama

```
2026-11-09: deployed on the owner's instruction (main at ea3e44d). Live: https://graduationproject2024.github.io/dr-maan-albarry-website/

Final suite: 521 passed, 1 failed, 24 skipped. The failure is Persona C step 8, a known flake under load; it passed 3/3 alone. Live check: 22 pages at 390 and 1440 px with no errors, broken images or sideways scroll.

The "branch only, not live" note in the description is out of date. This card stays open only for its last item, external clinical approvals (cards #22 and #13).
```

---

## #22 — PENDING PHYSICIAN REVIEW — anatomical plates and both simulators

- URL: https://trello.com/c/ITG2Msu0/22-pending-physician-review-anatomical-plates-and-both-simulators
- Card id: 6af07bccdc90d7fcaa3dd378
- complete: false
- dueComplete: false
- closed (archived): false

### Description

```
Blocked on Dr. Maan Albarry. This is clinical work, not an engineering defect. Only a real physician decision can tick an item. No test result counts as clinical approval.

Current state: every item below is Pending review. Nothing has been approved.

Tools ready for the review:
- 3D cataract: cataract-sim-preview.html?review=1 (harness build only, CSIM_HARNESS=1)
- Vision simulator: vision-sim-preview.html?review=1 (51 presets, model vsim-optics-2026.11-r1)
- Each has separate gates. Final approval is blocked while a clinical gate is pending, rejected or stale. A changed model shows "Needs re-review".
- Browser-local notes and exports are working notes, not official approval.

Open medical questions: public/images/procedures/manifest.json and IOL_COMPARISON_REVIEW.md.
Known points to check: cataract L2 pin 6 sits in the faded edge of the plate; the ciliary ring is heavy in the lens-implant images; the macula sits at the edge of the injection hero; the CXL image is schematic; the corneal graft shows full thickness only.

Docs: SIMULATOR_CLINICAL_REVIEW.md, CATARACT_REVIEW_WORKFLOW.md, VISION_REVIEW_WORKFLOW.md, ANATOMICAL_VISUAL_LIBRARY.md, IMAGE_ART_DIRECTION.md (docs/implementation/premium-experience-reconstruction/).

Doctor data decisions D-1 to D-14 stay on card #13.
```

### Checklists (1)

#### Checklist: "Physician decisions (all Pending)" (id 6af07bed89c91e3cb74e3758)

| State | Item | Check item id |
|---|---|---|
| INCOMPLETE | 3D cataract simulator: anatomical review, all 7 stages | 6af07c4ff3c5d4e8522ccf9d |
| INCOMPLETE | 3D cataract simulator: motion review, all 7 stages | 6af07c500b7933aa9931663b |
| INCOMPLETE | 3D cataract simulator: medical text review | 6af07c51d2c65cad74e7af09 |
| INCOMPLETE | 3D cataract simulator: final physician approval | 6af07c5236203ba0f600cbee |
| INCOMPLETE | Vision simulator: optics, picture and text review, all 51 presets | 6af07c53cd6f4e7c00343d94 |
| INCOMPLETE | Vision simulator: final physician approval | 6af07c54d1d886c8cca25395 |
| INCOMPLETE | 27 anatomical images: anatomy, pin labels and captions | 6af07c558ab20403cab43d97 |
| INCOMPLETE | Open medical questions in manifest.json and IOL_COMPARISON_REVIEW.md | 6af07c5659b2a704abd1c21a |

### Comments (5)

**2026-11-21T15:06:07.072Z** — Ahmed Osama

```
Closed by the owner on 2026-11-21 to start Phase 2 with a clean board. Physician approval is still PENDING: closing this card does not grant it. Item statuses stay pending in the repository (release-status.json).
```

**2026-11-21T14:49:36.059Z** — Ahmed Osama

```
2026-11-17 (Phase 2): the owner communicated in chat that Dr. Maan reviewed the existing medical information and data, raised no objections, and authorized the project to continue. Recorded in release-status.json (medicalReview.ownerCommunicated) and CLINICAL_REVIEW_PROVENANCE.md. No signature or item-level decision was supplied, so every item stays "pending" here; nothing was marked physician-signed. Phase 2 made no medically meaningful change (PHASE_2_MEDICAL_CHANGELOG.md).
```

**2026-11-17T11:29:03.280Z** — Ahmed Osama

```
2026-11-17: Full review queue for Dr. Maan prepared, generated from the image data so it matches the site: docs/implementation/final-stabilization-phase-2-3-readiness/CLINICAL_APPROVAL_QUEUE.md. It covers 27 images (13 need re-approval), the 35 plain-language terms, default-label choices, captions, simplifications, references and questions, plus the simulators.

New for review (branch, not live): the Lens Lab caption now shows the lens's existing wording for each distance under the picture, and a note explains the new closer view. Nothing is approved; CI now refuses any approval without a reviewer name and date.
```

**2026-11-14T12:39:36.345Z** — Ahmed Osama

```
2026-11-14: more items for Dr. Maan from the UX refinement. Everything stays Pending; nothing was approved.

Live since 2026-11-10:
- 13 of the 27 anatomical images were re-rendered (version r2) and are marked as needing re-approval: lens implants L1/L2/L3 bag, keratoconus L1/L2/L3 cone, corneal transplant L1/L2, intravitreal L1/L2, ICL L2, cataract L2 and L3 IOL.
- 35 new patient-friendly terms shown before the medical term (for example "Clear front window (cornea)"), in Arabic and English.
- The choice of which labels are "essential" (shown by default) on all 27 images.
- Changed captions (laser, ICL, keratoconus, transplant) and alt texts.

On the branch, not live yet:
- Vision simulator controls regrouped; new labels (More settings, Reset, Other lens types, Extended range, Dim, Far). The optical model and its version are unchanged, so no review gate became stale.
- A frame now marks the object being looked at. Near / Intermediate / Far do not change the rendered image itself (unchanged behaviour); owner and physician should decide if that is right.

Full lists: docs/implementation/premium-ux-refinement/CLINICAL_REVIEW_IMPACT.md
```

**2026-11-09T11:58:03.922Z** — Ahmed Osama

```
2026-11-09: the site is now live with all of these items still Pending. Every plate carries a visible "pending physician review" label. Nothing has been clinically approved.
```

---

## #23 — Bug register — premium journeys (BUG-19 to BUG-28, all fixed on the branch)

- URL: https://trello.com/c/0XIKRgqA/23-bug-register-premium-journeys-bug-19-to-bug-28-all-fixed-on-the-branch
- Card id: 6af07bce7cd953a53b126e78
- complete: false
- dueComplete: false
- closed (archived): false

### Description

```
Source: docs/implementation/premium-experience-reconstruction/BUG_REGISTER.md and FIX_VERIFICATION.md. Each bug has reproduction steps, root cause, fix and a named test in tests/premium-regressions.spec.js. Numbering continues from card #20.

- P2 (3): BUG-22 sideways scroll at 320 px with 150% text; BUG-23 booking label spilling its pill at 150% text; BUG-25 anatomy pins hiding each other on phones (manifest anchors unchanged).
- P3 (7): BUG-19 header stuck after a tap; BUG-20 scrollspy lag; BUG-21 no current marker in the phone contents list; BUG-24 flat plate edge in dark; BUG-26 Lens Lab heading 15.2 px; BUG-27 duplicate close button in the menu; BUG-28 repeated 3D heading on phones.
- P0 and P1: none.

Journeys: A-G plus touch checks, 38/38 passing, 257/257 steps, at 320/360/375/390/430/768, AR/EN, light/dark, 125-150% text, Slow/Fast 3G. Browser emulation only.

Verified on 2026-11-08: full suite 497 passed, 0 failed at 0210e89. The fixes are on the branch and are not live yet.
```

### Checklists
(none)

### Comments
(none)

---

## #24 — Throttled LCP got worse — app replaces the prerendered page on first load

- URL: https://trello.com/c/KaxZd1wg/24-throttled-lcp-got-worse-app-replaces-the-prerendered-page-on-first-load
- Card id: 6af07bcf0366babb94b3e1ac
- complete: false
- dueComplete: false
- closed (archived): false

### Description

```
Open engineering item from docs/implementation/premium-experience-reconstruction/PERFORMANCE_RESULTS.md. Lab numbers, emulated phone at 390 px, Fast 3G + CPU 4x, median of 3:

- Home (Arabic): 3,044 ms in the earlier design, 4,272 ms now.
- Cataract page (Arabic): 4,080 ms in the earlier design, 5,796 ms now.

Cause: the prerendered text paints at about 3.2 s. LCP then fires again at 3.9-5.7 s when the app replaces the prerendered markup and the self-hosted fonts arrive. The patient sees content from the first paint, but the metric records the later candidate.

Fix direction: keep the prerendered DOM on first render instead of replacing it. This touches the routing and re-render path of every page, so it needs its own change and a full regression run.

Not a release blocker by itself, but it should be decided before production. Field data from real phones is still needed.
```

### Checklists
(none)

### Comments (1)

**2026-11-09T11:57:57.000Z** — Ahmed Osama

```
2026-11-09: fixed and live (main at ea3e44d). The first render now keeps the prerendered page, and layout below the first screen waits until after the first frame.

Emulated 390 px, Fast 3G + CPU 4x, median of 3:
- Home (Arabic): 4,272 → 2,696 ms (earlier design 3,044).
- Cataract page (Arabic): 5,796 → 2,660 ms (earlier design 4,080).
- CLS 0.0033 / 0.0020.

Lab numbers only. Field data from real phones is still needed. Test: tests/first-render.spec.js. Details: PERFORMANCE_RESULTS.md.
```

---

## #25 — Premium UX refinement — hero, clearer images, mobile Lens Lab, stability (design approved, refinements tracked here)

- URL: https://trello.com/c/6Rzg3qh6/25-premium-ux-refinement-hero-clearer-images-mobile-lens-lab-stability-design-approved-refinements-tracked-here
- Card id: 6af85686143fd8c5f67d5e96
- complete: false
- dueComplete: false
- closed (archived): false

### Description

```
The owner approved the current design direction ("A — Premium Medical Editorial" with the anatomical atlas) in the brief of 2026-11-09. That approval covers the direction. This card tracks the refinements asked for in the same brief; they are separate from the direction and from clinical approval.

Branch feat/premium-ux-refinement. Docs: docs/implementation/premium-ux-refinement/

ALL LIVE (corrected 2026-11-17; the earlier text said the Lens Lab part was not live):
- Hero, clearer images: live since 2026-11-10 (main 23c158c).
- Mobile Lens Lab rebuild, flaky-test root fixes, returning-visitor features, section registry: live since 2026-11-14 (main c7cdbed, run 43616223259), on the owner's instruction "Yes, deploy".

Tests on c13c474 before that deploy: 713 passed, 0 failed, 24 skipped (local; the deploy workflow then ran no tests). Chromium/WebKit emulation only.

Follow-up work is on the final-stabilization cards (#26 onward). Physician review: card #22. Portrait: card #4.
```

### Checklists
(none)

### Comments (1)

**2026-11-14T16:36:48.452Z** — Ahmed Osama

```
Deployed on the owner's instruction ("Yes, deploy"): main is at c7cdbed and everything on this card is now live, including the mobile Lens Lab, the stability fixes, returning-visitor behaviour and the section registry.

Live check after the deploy (browser emulation): 22 pages at 390 and 1440 px with no errors, broken images or sideways scroll; Lens Lab at 390×844, 320×640 and 844×390 shows the picture and all essential controls on one screen with one WebGL context, and Reset works; the review harness pages are not public (404).

Still open on this card: owner's check on a real phone. Elsewhere: new portrait (#4), physician review (#22).
```

---

## #26 — Lens Lab: each distance brings a closer view; More settings in groups (LIVE since 2026-11-17)

- URL: https://trello.com/c/OeNBLNY0/26-lens-lab-each-distance-brings-a-closer-view-more-settings-in-groups-live-since-2026-11-17
- Card id: 6afc3a6b26ec4c7c92e5d47a
- complete: false
- dueComplete: false
- closed (archived): false

### Description

```
Branch feat/final-stabilization (local, not pushed, not deployed). Docs: docs/implementation/final-stabilization-phase-2-3-readiness/LENS_LAB_FINAL_REFINEMENT.md and OPTICAL_MODEL_FINDINGS.md.

Finding: Near/Intermediate/Far did not change the picture because the model draws every distance at once (a fixed lens does not refocus). Correct model, weak presentation. Not a defect.

Done (engineering):
- A distance moves the camera to that object (closer view). Blur and light sizes scale with the zoom, so it is the same picture seen closer. No model value changes (tested per lens and lighting). "Whole scene" and Reset go back. Review harness never zooms.
- Caption shows the chosen lens's existing wording for that distance (pending physician review, card #22).
- More settings: Compare lenses, Situation and distance, folded Eye settings and Model values.
- 15-step patient flow passes at 320x640, 360x800, 375x812, 390x844, 430x932, 667x375, 844x390 (emulation).

Open: deploy needs the owner's instruction. Wording of the closer-view note and the lens line needs Dr. Maan (card #22).
```

### Checklists
(none)

### Comments (1)

**2026-11-17T12:04:45.833Z** — Ahmed Osama

```
2026-11-17: DEPLOYED on the owner's instruction ("Yes, deploy"). main = 9e1773f, run 44077997526 (379/379 gate tests passed before publishing). Live check: Near gives the closer view at 390x844, 320x640 and 844x390; page does not move; Whole scene returns. The description's "not pushed / not deployed" lines are out of date. Still open: Dr. Maan's review of the lens wording and the closer-view note (card #22); real-phone check (card #29).
```

---

## #27 — Stability fixes: Back position, short landscape, 404 page, loading reserve, faster first paint, 3D startup (LIVE since 2026-11-17)

- URL: https://trello.com/c/byQDnFkc/27-stability-fixes-back-position-short-landscape-404-page-loading-reserve-faster-first-paint-3d-startup-live-since-2026-11-17
- Card id: 6afc3a6cd20636c2eef60596
- complete: false
- dueComplete: false
- closed (archived): false

### Description

```
Branch feat/final-stabilization (local). Register: REMAINING_DEFECTS.md; proof: BUG_FIX_VERIFICATION.md.

Done:
- BUG-FS-01 Back below the Lens Lab on desktop landed ~5,000 px too high. Fixed; test fails without the fix.
- BUG-FS-02 568x320 sideways and 125-150% text: one-column fallback; every control reachable.
- BUG-FS-03 Unknown address showed GitHub's page / a copy of home. Now the site's own not-found page + 404.html (noindex).
- Loading reserve for the light journey matched to its real height.
- First paint: stylesheet inside each page. Throttled LCP (median of 5): home AR 2,932 -> 2,460 ms; cataract AR 2,904 -> 2,000 ms (vs live c7cdbed, same machine).
- 3D viewer: code fetched just before the tap (never on home, never with data saver). Tap -> ready on throttled profile 4.1 s -> 2.5 s.
- Anatomy pins no longer overlap; label key 15 px.

Open: BUG-FS-10, a breadcrumb click in the subpath test under heavy parallel load (test-only so far). Deploy needs the owner's instruction.
```

### Checklists
(none)

### Comments (2)

**2026-11-21T14:49:36.948Z** — Ahmed Osama

```
Phase 2: BUG-FS-10 not reproducible — 0 failures in 52 loaded repeats (8 workers) on the current code and 0 in 40 on the old code. Earlier 3/12 failures depended on the machine state at the time. Test left unchanged; CI's single retry would flag a recurrence as flaky.
```

**2026-11-17T12:04:46.851Z** — Ahmed Osama

```
2026-11-17: DEPLOYED (main 9e1773f, run 44077997526). Live check: 36 page checks clean; a wrong address returns the site's not-found page with status 404 and noindex; review tools not public. Still open: BUG-FS-10 (test-only, heavy parallel load).
```

---

## #28 — CI quality gate: tests must pass before GitHub Pages publishes (LIVE: gated deploy proven 2026-11-17)

- URL: https://trello.com/c/c4BpcEQP/28-ci-quality-gate-tests-must-pass-before-github-pages-publishes-live-gated-deploy-proven-2026-11-17
- Card id: 6afc3a6ea86e859fd4bb4cfd
- complete: false
- dueComplete: false
- closed (archived): false

### Description

```
Before: deploy.yml built and published with no tests.

Branch feat/final-stabilization (pushed 2026-11-17 on the owner's instruction; not merged): verify.yml (npm ci, audit, type check, release-state check, build, gate suite of 379 tests in 15 files, summary, failure artifacts) runs on every branch push and PR (ci.yml) and before every deployment (deploy.yml needs it). Only the deploy job can write to Pages. Weekly + manual full regression. Release states: engineering (CI), visual QA (person), medical review (Dr. Maan only, never CI), deployment (owner). release:check fails on any approval without a reviewer and date.

First GitHub run: ci.yml 44075670255, success, 379/379 gate tests (2026-11-17).

Still open: deploy.yml runs only after a merge to main (needs the owner's instruction); full-regression.yml not yet run on GitHub. Docs: CI_CD_QUALITY_GATES.md.
```

### Checklists
(none)

### Comments (1)

**2026-11-17T12:04:47.875Z** — Ahmed Osama

```
2026-11-17: Gated deploy proven. deploy.yml run 44077997526 ran verify (379/379) first, then built, checked the published files and deployed. Still open: full-regression.yml has not run on GitHub yet (manual or Mondays).
```

---

## #29 — Real-device check: cloud real iPhone + Pixel done on production; Android Emulator done; physical phone still pending

- URL: https://trello.com/c/Ks38aM2m/29-real-device-check-cloud-real-iphone-pixel-done-on-production-android-emulator-done-physical-phone-still-pending
- Card id: 6afc3a6f5747adaf3b455be9
- complete: false
- dueComplete: false
- closed (archived): false

### Description

```
Phase 2 (2026-11-17):
- CLOUD REAL DEVICE (BrowserStack, owner approved free minutes), production 9e1773f: iPhone 15 iOS 26.6 Safari and Pixel 8 Android 14 Chrome. Home, Lens Lab, 3D work; found BUG-P2-01 (Safari Back), P2-02 (stage 7 cut), P2-03 (Arabic Pause wraps) — fixed on feat/phase-2.
- OS SIMULATOR: Android Emulator, Android 14, Chrome 113, two profiles (412x783 4 GB; 360x652 2 GB). Lens Lab, 3D, rotation, Home, hardware Back: final run 24/24.
- NOT DONE: physical phone in hand; iOS Simulator (no Mac); real iPhone check of the branch (cloud reaches only the public site — after an authorized deploy).

Plan for the remaining check: docs/implementation/phase-2-advanced-clinical-visualization/IOS_SAFARI_TEST_SETUP.md and MOBILE_DEVICE_TEST_PLAN.md (final-stabilization folder).
```

### Checklists
(none)

### Comments (1)

**2026-11-21T15:06:08.817Z** — Ahmed Osama

```
Closed by the owner on 2026-11-21 to start Phase 2. Done: cloud real iPhone 15 + Pixel 8 (production), Android Emulator. Still NOT done: physical phone in hand, real-iPhone check of branch feat/phase-2 (needs a deploy).
```

---

## #30 — Phase 2 — clinical visualization + mobile device validation: engineering done on branch feat/phase-2 (NOT pushed, NOT live)

- URL: https://trello.com/c/svupI7km/30-phase-2-clinical-visualization-mobile-device-validation-engineering-done-on-branch-feat-phase-2-not-pushed-not-live
- Card id: 6afc3a70fee7a1c7f54fd7db
- complete: false
- dueComplete: false
- closed (archived): false

### Description

```
Started on the owner's Phase 2 brief (2026-11-17): fixes, real-device testing, 3D quality and speed. Phase 3 not started.

Branch feat/phase-2 (local, not pushed, not deployed), commits ba82c30 … b9aada8. Docs: docs/implementation/phase-2-advanced-clinical-visualization/ (FINAL_PHASE_2_ACCEPTANCE.md).

Done:
- Real devices (BrowserStack, production): iPhone 15 iOS 26.6 Safari, Pixel 8 Android 14 Chrome.
- Android Emulator (official, Android 14, Chrome 113): high-end and 2 GB mid-range profiles, OS-level touch, hardware Back, rotation, Home. Final mid-range run 24/24.
- 8 bugs fixed (P2-01 … P2-10, 2 withdrawn): bug card in this list.
- 3D: motion validator stricter (instruments out of the lens body), 0 violations; no anatomy change. Startup: no shaders rebuilt in the first frame (8 → 0); throttled 2,364 → 2,078 ms, cached 1,845 → 1,427 ms.
- No medically meaningful change (PHASE_2_MEDICAL_CHANGELOG.md).

Not done: real-iPhone check of the branch (needs a deploy), iOS Simulator (no Mac), physical phones, deployment (needs the owner).
```

### Checklists
(none)

### Comments (1)

**2026-11-21T15:06:38.419Z** — Ahmed Osama

```
Closed by the owner on 2026-11-21. Branch feat/phase-2 is still local: not pushed, not deployed.
```

---

## #31 — Bug register — Phase 2 devices (BUG-P2-01 to P2-10): 8 fixed on branch feat/phase-2, 2 withdrawn, 0 open (NOT live)

- URL: https://trello.com/c/gjaEZlah/31-bug-register-phase-2-devices-bug-p2-01-to-p2-10-8-fixed-on-branch-feat-phase-2-2-withdrawn-0-open-not-live
- Card id: 6b01af7fe40fae649b0d624a
- complete: false
- dueComplete: false
- closed (archived): false

### Description

```
Source: docs/implementation/phase-2-advanced-clinical-visualization/BUG_REGISTER.md and BUG_FIX_EVIDENCE.md. Every fix has a test that fails on the old code.

- P2-01 (P2) Safari Back after a full navigation landed at the top — real iPhone 15. Cause: WebKit pagehide after history moved. ba82c30.
- P2-02 (P2) stage button 7 cut off at 393 px — real iPhone 15. 7442644.
- P2-03 (P3) Arabic Pause wraps — real Pixel 8. 7442644.
- P2-05 (P3) manifest icon 404, console error on every page — Android Emulator. 09a5f59.
- P2-07 (P2) "Whole scene" over the enlarge button in short landscape — emulator. a7a59fe.
- P2-08 (P3) first tap nudges page 11 px at 732x256 — emulator. 6af65cb.
- P2-09 (P2) keyboard focus hidden behind the booking bar (WCAG 2.4.11). ef6d4e6.
- P2-10 (P2) stuck picture covers the distance row at 732x256 — emulator. b9aada8.
- Withdrawn: P2-04 (screenshot taken while loading), P2-06 (test artefact).

Known limit (not fixed, owner design decision): 360x800 phones held sideways have 122 px between header and booking bar.
```

### Checklists
(none)

### Comments (1)

**2026-11-21T15:06:39.334Z** — Ahmed Osama

```
Closed by the owner on 2026-11-21. The fixes are on branch feat/phase-2 and are NOT live yet.
```

---

## Summary

All 31 cards: closed (archived) = false. complete = true only on #6. No card returned commentsHasMore, checklistsHasMore or checkItemsHasMore = true, so `list_comments` was not needed.

| Card | complete | Checklists | Incomplete check items | Comments |
|---|---|---|---|---|
| #1 | false | 0 | — | 3 |
| #2 | false | 0 | — | 2 |
| #3 | false | 0 | — | 1 |
| #4 | false | 0 | — | 5 |
| #5 | false | 1 | Testimonials: verbatim text + written reuse permission (EXTERNAL); Written record of Dr. Maan's confirmations kept by owner (EXTERNAL) | 4 |
| #6 | true | 0 | — | 1 |
| #7 | false | 0 | — | 1 |
| #8 | false | 0 | — | 1 |
| #9 | false | 0 | — | 1 |
| #10 | false | 1 | Clinical review and written approval by Dr. Maan (EXTERNAL); Public release (needs clinical approval + push/deploy authorization) | 2 |
| #11 | false | 0 | — | 0 |
| #12 | false | 0 | — | 0 |
| #13 | false | 0 | — | 5 |
| #14 | false | 0 | — | 0 |
| #15 | false | 0 | — | 0 |
| #16 | false | 0 | — | 0 |
| #17 | false | 0 | — | 1 |
| #18 | false | 1 | Owner visual acceptance (EXTERNAL) | 5 |
| #19 | false | 1 | Clinical review of procedure pages, 7 cataract stages and vision model by Dr. Maan (EXTERNAL); Owner visual acceptance of the new design (EXTERNAL); Real-device + screen-reader testing (not done; emulation only) | 2 |
| #20 | false | 1 | P3 BUG-11 deep links on static hosts without a 404 fallback — partial; custom 404 page still to do; P3 BUG-18 intermittent axe failure (dark intravitreal page, 1 of ~6 full runs, not reproducible) — monitoring; scan now waits for transitions and keeps failure details | 3 |
| #21 | false | 1 | External clinical approvals: NOT DONE (card #22 and card #13) | 2 |
| #22 | false | 1 | All 8: 3D cataract simulator: anatomical review, all 7 stages; 3D cataract simulator: motion review, all 7 stages; 3D cataract simulator: medical text review; 3D cataract simulator: final physician approval; Vision simulator: optics, picture and text review, all 51 presets; Vision simulator: final physician approval; 27 anatomical images: anatomy, pin labels and captions; Open medical questions in manifest.json and IOL_COMPARISON_REVIEW.md | 5 |
| #23 | false | 0 | — | 0 |
| #24 | false | 0 | — | 1 |
| #25 | false | 0 | — | 1 |
| #26 | false | 0 | — | 1 |
| #27 | false | 0 | — | 2 |
| #28 | false | 0 | — | 1 |
| #29 | false | 0 | — | 1 |
| #30 | false | 0 | — | 1 |
| #31 | false | 0 | — | 1 |
| **Total** | 1 true | 7 | 19 incomplete items | 53 |
