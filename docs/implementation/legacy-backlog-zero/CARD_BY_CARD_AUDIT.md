# Card-by-card audit (2026-11-21)

Source: `_trello_full_read.md` (every description, checklist item and comment). "Close" means the card is marked complete only after its evidence comment is posted and read back (`TRELLO_CLOSURE_EVIDENCE.md`).

Note: 20 cards carry a comment dated 2026-11-21 15:06 UTC "Closed by the owner … to start Phase 2". The owner reopened those cards by hand the same day; the comments are out of date. Each audited card gets a new comment that states its real status.

| # | Card | Classification | Evidence / reason | Action |
|---|---|---|---|---|
| 1 | update UI/UX | SUPERSEDED (by #18 → #25) | redesign live since 2026-11-09; direction approved by the owner (#25); final visual acceptance not recorded | comment, keep open for the owner |
| 2 | security | BLOCKED — EXTERNAL (engineering part done) | npm audit 0; rel=noopener; hostile URL tests; this milestone adds CSP + referrer meta. HTTP headers (HSTS, frame-ancestors) need a host that sets headers | comment, keep open |
| 3 | buying domain and server | BLOCKED — EXTERNAL | purchase; brief forbids buying services | comment, keep open |
| 4 | update pics | BLOCKED — EXTERNAL | needs an authentic ≥1600 px portrait | comment, keep open |
| 5 | feeding website with real data | BLOCKED — EXTERNAL | engineering items done; testimonials permission and written record are external | comment, keep open |
| 6 | link with real Links | DONE — VERIFIED (already complete) | link tests in the gate | none |
| 7 | Make Automatiom | DEFERRED — FUTURE SCOPE | no requirement written; CI gate (#28) is the only automation | comment, keep open |
| 8 | MAKE RESERVATION SYSTEM | DEFERRED — FUTURE SCOPE | booking uses the clinic portal; brief forbids a new backend for the board's sake | comment, keep open |
| 9 | make bot in website | DEFERRED — FUTURE SCOPE | brief forbids a chatbot for the board's sake | comment, keep open |
| 10 | make animation for procedures and services | BLOCKED — EXTERNAL | cataract 3D: 12/14 checklist items done; clinical approval external; other procedures future scope | comment, keep open |
| 11 | Phase 0 — doctor data integrity | DONE — VERIFIED | `phase0-content.spec.js`, `content-registry.spec.js` pass; live; approvals split to #13 | close |
| 12 | Phase 1 — booking & mobile UX | DONE — VERIFIED | `phase1-mobile.spec.js`, `phase1-pages.spec.js` pass; live | close |
| 13 | Doctor / clinic decisions D-1…D-14 | BLOCKED — EXTERNAL | decisions not answered | comment, keep open |
| 14 | Booking fixes | DONE — VERIFIED | `phase1-mobile.spec.js`, `closure.spec.js` pass; live | close |
| 15 | Mobile regression tests | DONE — VERIFIED | suites exist and pass (2 workers) | close |
| 16 | Independent review (phase 0/1) | DONE — VERIFIED | `phase-0-phase-1/EVIDENCE/REVIEWER_FINDINGS.md` exists; in-scope findings fixed and live | close |
| 17 | Phase 0+1 completion verification | DONE — VERIFIED | deployed (PR #1, 402bc49); gate passes | close |
| 18 | Premium original redesign | BLOCKED — EXTERNAL | engineering live; only checklist item left is "Owner visual acceptance" | comment, keep open |
| 19 | Clinical & visual reconstruction | BLOCKED — EXTERNAL | engineering live; clinical review, owner acceptance, physical-device + screen-reader test open | comment, keep open |
| 20 | Bug register — patient-journey QA | see `TRELLO_CLOSURE_EVIDENCE.md` | BUG-11: custom 404 live since 2026-11-17 (`routing.spec.js`); BUG-18: axe repeat run | tick verified items; close only if both verified |
| 21 | Premium reconstruction tracker | BLOCKED — EXTERNAL | engineering live; one item left = clinical approvals (#22, #13) | comment, keep open |
| 22 | Pending physician review | BLOCKED — EXTERNAL | 8 items pending; owner's general approval recorded, not item approvals | comment, keep open |
| 23 | Bug register — premium journeys | DONE — VERIFIED | `premium-regressions.spec.js` passes; live | close |
| 24 | Throttled LCP got worse | DONE — VERIFIED | live since ea3e44d; `first-render.spec.js`; LCP re-measured (`PERFORMANCE_COMPARISON.md`). Field data external (no tracking authorized) | close |
| 25 | Premium UX refinement | DONE — VERIFIED | all live (c7cdbed, 9e1773f); real-phone check tracked on #29 | close |
| 26 | Lens Lab closer view | DONE — VERIFIED | live 9e1773f; `lens-lab-distance.spec.js` passes; wording review on #22, phone on #29 | close |
| 27 | Stability fixes | DONE — VERIFIED | live 9e1773f; BUG-FS-10 not reproducible (52 loaded repeats) | close |
| 28 | CI quality gate | OPEN — ENGINEERING (minor) | gated deploy proven; `full-regression.yml` has not run on GitHub | comment, keep open |
| 29 | Real-device check | BLOCKED — EXTERNAL | physical phone and branch check on a real iPhone need the owner / a deploy | comment, keep open |
| 30 | Phase 2 | INTEGRATED BUT NOT DEPLOYED | `feat/phase-2` + `feat/legacy-zero`, local | comment, keep open |
| 31 | Bug register — Phase 2 | INTEGRATED BUT NOT DEPLOYED | fixes local, tests pass | comment, keep open |
