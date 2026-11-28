# Legacy requirements matrix (brief §14–§30)

| Requirement | Result | Evidence |
|---|---|---|
| Lens Lab recovery (failure paths) | DONE — 7 failure paths recover; owner's device never captured | 06, tests/lens-lab-recovery.spec.js |
| Lens Lab visual reconstruction | DONE (pending physician review N-08) | 06, evidence/lens-lab |
| Five lens categories, toric as add-on, 40/50/65 cm + far | DONE (50 cm neutral caption pending N-09) | 06 |
| Ocular-surface guidance | DONE (live since PR #4) | 11 |
| Light Journey cinematic rebuild | DONE (pending N-07) | 07 |
| Surgical cameras, all procedures + cataract | DONE | 08 |
| Anatomy labels hidden by default | DONE (all 7 simulators) | 08, cataract-sim ui `labels:false` |
| Before/After every procedure | DONE incl. cataract (pending N-10) | 10 |
| ICL illustration | DONE (pending N-01–N-03) | 09 |
| BUG-SIM-14 ICL through iris | FIXED, model r2 | 08 |
| Doctor content (25,000+, KKESH, ICO, KSU…) | DONE, live | 11 |
| Device photos (iTrace, Pentacam AXL Wave) | BLOCKED — EXTERNAL | 12 |
| Photo gallery | Engineering DONE; content BLOCKED — EXTERNAL | 13 |
| Full regression | DONE locally (950/951 then fixed); GitHub = CPU layer | 19 |
| Security scanners | DONE, findings fixed; headers need a host | 15 |
| Performance | Measured vs live; no regression; load CLS fixed | 17 |
| Android / iPhone on real devices for this build | NOT DONE — needs owner OK (BrowserStack minutes) or a phone | 18 |
| Cards #7 automation, #8 reservation, #9 bot | SCOPE UNDEFINED — owner | 23 |
| Domain/server (#3) | BLOCKED — purchase | 23 |
