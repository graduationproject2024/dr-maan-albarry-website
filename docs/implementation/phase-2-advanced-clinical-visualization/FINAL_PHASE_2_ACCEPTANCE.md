# Final Phase 2 acceptance

Branch `feat/phase-2` (local; not pushed, merged or deployed). Live site unchanged at `9e1773f`.

## 1. Executive verdict

| Area | Status |
|---|---|
| Engineering | Ready on the branch: 8 bugs fixed, 0 open, no P0/P1. See section 7 for test runs. |
| Android | Real Pixel 8 (production) + Android Emulator, two profiles (final 2 GB run 24/24) |
| iPhone Safari | Real iPhone 15 on production; branch only in WebKit emulation; no iOS Simulator |
| Lens Lab | Works on all devices; 3 landscape defects fixed; optics unchanged |
| Cataract 3D | Anatomy reviewed (no change needed); motion validator stricter (0 violations); faster start |
| Medical review | Owner-communicated approval of existing content recorded; items stay pending; no new medical content |
| Release | Not authorized for this branch |

## 2. Code changes

| Commit | Change |
|---|---|
| `ba82c30` | Safari Back keeps the reading position (P2-01) |
| `7442644` | 3D stage buttons and Play label on phones (P2-02, P2-03) |
| `09a5f59` | manifest icon path (P2-05) |
| `a7a59fe` | "Whole scene" placement (P2-07) |
| `132c1e4` | motion validator: instruments out of the lens body |
| `6fe0d38` | 3D start: no shader rebuilds in the first frame; rays built after ready |
| `6af65cb` | no page nudge at 732×256 (P2-08) |
| `ef6d4e6` | keyboard focus not hidden behind the booking bar (P2-09) |
| `b9aada8` | picture does not stick over the distance row at 732×256 (P2-10) |

Plus `tests/devices/` (emulator journey and probes), regression tests in 6 spec files, `release-status.json`.

## 3. Device testing

| Device | OS / browser | Class | Build | Result |
|---|---|---|---|---|
| iPhone 15 | iOS 26.6 Safari | CLOUD REAL DEVICE | production | pass with 2 findings (fixed) |
| Google Pixel 8 | Android 14 Chrome | CLOUD REAL DEVICE | production | pass with 1 finding (fixed) |
| AVD Pixel 7 profile, 4 GB | Android 14, Chrome 113 | OS SIMULATOR | branch before last 4 fixes | 24/24 |
| AVD 360×800, 2 GB | Android 14, Chrome 113 | OS SIMULATOR | final | 24/24 |
| Chromium / WebKit mobile profiles | Windows | BROWSER EMULATION | final | see section 7 |
| Physical phones, iOS Simulator | — | NOT TESTED | — | — |

## 4. Lens Lab

Previous: closer view per distance (live). New: fixes for short landscape (P2-07, P2-08, P2-10). Evidence: device screenshots and `LENS_LAB_QA.md`. Optics: unchanged; camera zoom is labelled as a view change, not a clinical prediction.

## 5. Cataract 3D

Anatomy: checked against sources, no change. Motion: three new validator rules, 0 violations. Visual: stage controls on phones. Performance: first-frame shader rebuilds 8 → 0; throttled 2,364 → 2,078 ms; cached 1,845 → 1,427 ms (target ~1.5 s met only when cached). Review implications: none (no medical change).

## 6. Bugs

Found 10 IDs: P0 0, P1 0, P2 5, P3 3, withdrawn 2. Fixed 8, retested 8, remaining 0, blocked 0. FS-10: not reproducible (0/92 loaded repeats). Known layout limit at 732×256 recorded.

## 7. Automated tests

Gate suite 383 passed, 0 failed, 0 flaky. Phase 2 affected files 291 passed, 1 failed under load (touch swipe 117 px vs 120 px; passes 3/3 alone), 4 opt-in skipped. Engines: Chromium (ANGLE/D3D11), WebKit; 2 workers. CI on GitHub: not run for this branch (not pushed). Details: `REGRESSION_RESULTS.md`.

## 8. Medical review

Owner-communicated approval (2026-11-17) of existing material, recorded without fabricating signatures (`CLINICAL_REVIEW_PROVENANCE.md`). New medical changes: none (`PHASE_2_MEDICAL_CHANGELOG.md`).

## 9. Trello

Updated #29, #30; created #31; comments on #22, #27; nothing completed (`TRELLO_RECONCILIATION.md`).

## 10. Release decision

| Question | Answer | Evidence |
|---|---|---|
| Engineering ready | YES (branch) | 0 open defects; gate 383/383; affected files 291/292 (one load-only touch threshold, passes alone) |
| Android Chrome verified | PARTIAL | real Pixel 8 on production; emulator on the branch; no physical phone |
| iPhone Safari verified | PARTIAL | real iPhone 15 on production only; branch in WebKit emulation |
| Simulator QA complete | PARTIAL | done on emulator/emulation; real-device pinch/rotation not tested |
| Medical change review complete | YES — nothing to review | no medically meaningful change |
| Owner deployment authorized | NO | — |
| Phase 2 complete | CONDITIONAL | needs: push + CI, owner deploy decision, real-iPhone re-check of the branch after deploy |
