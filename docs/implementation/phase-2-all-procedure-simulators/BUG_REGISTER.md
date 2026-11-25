# Bug register: Phase 2 procedure simulators

Severity scale:
- **P0:** broken or unsafe;
- **P1:** a core interaction fails or the content is misleading;
- **P2:** a visible defect;
- **P3:** minor.

| ID | Sev | Found by | Defect | Status |
|---|---|---|---|---|
| BUG-SIM-01 | P0 | dev browser | `ReferenceError: v3` before initialisation: labels crashed the frame loop | Fixed |
| BUG-SIM-02 | P1 | dev console | NaN iris geometry when no pupil height was given | Fixed |
| BUG-SIM-03 | P2 | Android Emulator | Touch rotation far too sensitive (about 190° per 140 px swipe) | Fixed |
| BUG-SIM-04 | P1 | Android mid-range | Chrome restarted the tab once on rotation with a viewer open (memory pressure suspected) | Mitigated (≤ 2 GB → pixel ratio 1). Not reproduced in 94 later steps. Recheck on a real low-memory phone. |
| BUG-SIM-05 | P2 | screenshots | White speckle on every cross-section face (cut faces lying exactly on the clipping plane) | Fixed |
| BUG-SIM-06 | P2 | screenshots | Simulator title and stage heading invisible on the page band | Fixed |
| BUG-SIM-07 | P1 | screenshots | Empty capsular bag drawn filled, so it looked as if the natural lens were still present | Fixed |
| BUG-SIM-08 | P3 | screenshots | Retina / choroid moiré; vitreous banding | Fixed |
| BUG-SIM-09 | P2 | builder screenshots | Additive beams washed the background white | Fixed |
| BUG-SIM-10 | P1 | screenshots | IOL light focus lined up with the optic disc from the side view (misleading) | Fixed (camera raised; macula labelled) |
| BUG-SIM-11 | P3 | screenshots | Inner-structure labels shown on the closed eye | Fixed |
| BUG-SIM-12 | P2 | screenshots | Transplant stitch ring looked offset from the graft (oblique parallax) | Fixed |
| BUG-SIM-13 | P2 | builder | ICL plate cut through the iris | Fixed (own plate; Node check) |
| BUG-SIM-14 | P3 | builder | ICL plate briefly passes through the iris while being tucked behind it | Fixed (phase-2-final-closure/08_SURGICAL_SIMULATOR_CAMERA_QA.md; 200-sample tests) |
| BUG-CAT-01 | P2 | code review | Cataract viewer captured the plain mouse wheel (page scroll stopped over it) | Fixed (Ctrl/⌘ + wheel zooms) |
| BUG-CAT-02 | P2 | Phase 2 brief | Cataract viewer had no full screen for phones | Fixed |
| BUG-TEST-01 | P3 | full run | Two older tests assumed only cataract had 3D, or raced the cataract pre-fetch | Fixed (assertions match the intended behaviour) |
| BUG-TEST-02 | P3 | full run | `cataract-warmup` "no program is linked…" failed once in 3 repeats under mixed load | Open, intermittent. 14/14 in isolation. The cataract renderer was not changed in this phase. |

**Totals:** P0 1, P1 4, P2 8, P3 5.
- Fixed: 15.
- Mitigated: 1 (BUG-SIM-04).
- Open: 2, both P3.
- **Open P0/P1: 0** (BUG-SIM-04 is mitigated).
