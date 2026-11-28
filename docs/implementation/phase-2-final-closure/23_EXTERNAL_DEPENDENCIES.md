# External dependencies

| Item | Why needed | Who | Blocks Phase 3? | Smallest action |
|---|---|---|---|---|
| Merge + deploy PR #6 | publishes this work | Owner | yes (baseline) | say "merge it" after reviewing PR #6 |
| GPU run before release | CI has no GPU | Owner's PC (done 2026-11-28) | no | rerun `npm run test:gpu` if code changes |
| Real iPhone/Android check | emulation ≠ devices | Owner | recommended | approve BrowserStack minutes or test on a phone |
| Physician review N-01…N-11, R-01…R-09, C-* | medical accuracy | Dr. Maan | for "approved" status | answer per item (14) |
| Claims: EDOF 2010, dropless paper, 25,000+ attribution, association name, "first" evidence | content truth | Owner / Dr. Maan | no | send sources or accept current wording |
| Device photos, gallery photos | 12, 13 | Owner / clinic | no | send photos with permission |
| Domain + header-capable host | security headers, canonical URLs | Owner (purchase) | no | buy/point domain |
| Cards #7, #8, #9 scope | undefined requirements | Owner | no | define or cancel |
| D-1…D-14 clinic decisions | card #13 | Clinic | no | answer per item |
| Overwritten old evidence files (286) | tidy working copy | Owner (permission check blocked me) | no | `git restore --source=HEAD -- docs/implementation/{clinical-visual-reconstruction,final-stabilization-phase-2-3-readiness,premium-experience-reconstruction}` |
