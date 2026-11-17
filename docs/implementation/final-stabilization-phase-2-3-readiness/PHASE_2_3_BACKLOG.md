# Next Phase 2 and 3 — execution backlog (PROVISIONAL, not owner-approved)

Small, separately testable tasks. Complexity: S (≤1 day), M (2–4 days), L (≥1 week), as an engineering guess only, not a schedule. No task duplicates finished work (`PHASE_HISTORY_RECONCILIATION.md`).

## Critical prerequisites

### P2-01 Physician review of existing material
- **Objective:** turn "pending" into Dr. Maan's decisions for the 27 images, 35 terms, label choices, captions, 7 cataract stages, both optical models, the Lens Lab lines.
- **Baseline:** all pending; review tools exist; queue in `CLINICAL_APPROVAL_QUEUE.md`.
- **Scope:** one or two guided sessions; record decisions in the manifest and content files; apply requested changes.
- **Approach:** walk the queue in the review screens; export each session file into `docs/clinical-review/<date>/`.
- **Assets:** none. **Skills:** ophthalmology (Dr. Maan); engineering to apply changes.
- **Dependencies:** Dr. Maan's time. **Medical review impact:** this is the review.
- **Acceptance:** every item has approve / change / reject with name and date; `release:check` clean.
- **Tests:** `release:check`; plates-clarity; vision-review; cataract-review.
- **Complexity:** M (engineering part). **Risks:** large change requests. **Done:** queue empty, changes deployed on instruction.

### P2-05 Real-device verification
- **Objective:** run `MOBILE_DEVICE_TEST_PLAN.md` on a real iPhone (Safari) and a mid-range Android (Chrome).
- **Baseline:** none done; all results so far are emulation.
- **Acceptance:** every checklist row recorded with device, OS and browser versions; defects filed.
- **Complexity:** S per device. **Risks:** iOS-only sticky/viewport behaviour. **Done:** both reports in the repo.

### P0-CI Prove the CI gate on GitHub
- **Objective:** one push of the branch so `ci.yml` runs on GitHub runners; fix anything Linux-specific (fonts, GPU fallback).
- **Baseline:** workflows written and validated locally; the gate suite passes on Windows (`CI_CD_QUALITY_GATES.md`).
- **Dependencies:** owner authorization to push. **Complexity:** S. **Done:** green run linked in the docs.

## High-value improvements

### P2-02 Cataract viewer: faster set-up after the tap
- **Baseline:** 2.5 s median on the throttled phone profile, of which geometry ≈1.0 s and materials ≈0.35 s.
- **Approach:** build geometry in a worker or precompute it at build time; generate textures once and cache them.
- **Medical impact:** none if the geometry is identical (compare vertex hashes).
- **Acceptance:** ≤1.5 s median; identical render hash per stage; no new long task > 500 ms.
- **Complexity:** M. **Risks:** worker transfer cost on small phones.

### P3-04 Production domain
- **Baseline:** canonical/sitemap point at the GitHub Pages address (D-14).
- **Approach:** buy domain (owner), add CNAME, change `SITE_URL` in `deploy.yml`, re-run SEO tests.
- **Complexity:** S after the purchase. **Dependencies:** owner, registrar.

### P3-05 New portrait
- **Baseline:** 295×225 source enlarged to 374×450 (`DOCTOR_PORTRAIT_STATUS.md`).
- **Approach:** `python scripts/build-portrait.py <photo>`; paste the printed setting; re-measure LCP.
- **Acceptance:** sharp at 2× density; `hero-portrait` spec green; LCP not worse.
- **Complexity:** S. **Dependencies:** an authentic photograph with permission.

### P2-03 Animations for other procedures (Trello #10)
- **Baseline:** only cataract surgery has a 3D viewer.
- **Scope:** one procedure first (owner chooses), stage list written and approved by Dr. Maan before modelling.
- **Approach:** reuse the cataract engine (state machine, timeline, review mode, fallback).
- **Acceptance:** same criteria as `PHASE_2_READINESS.md` §E.
- **Complexity:** L per procedure. **Risks:** clinical accuracy; asset licensing if external.

## Optional enhancements

### P2-04 Optical model extension
Only if the owner wants distance to change simulated blur in ways the current model does not (e.g. depth within a layer). Needs a cited model, numeric tests, a new model version and review. **L.**

### P3-01 New education sections
One registry entry and one renderer per section, unpublished until approved (`PHASE_3_READINESS.md` workflow). **S–M** each, excluding writing.

## External dependencies

| Task | Waiting on |
|---|---|
| P3-02 Booking system (#8) | Owner: clinic system, data protection decision, hosting with a server |
| P3-03 Chat assistant (#9) | Owner: provider, budget, medical answer policy; Dr. Maan: approved answer set |
| P3-06 Analytics (D-13) | Owner: provider and consent wording |
| D-1 to D-14 | Clinic |

None of these tasks is approved. They are inputs for the owner's scoping decision.
