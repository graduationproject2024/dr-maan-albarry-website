# Fix verification

| Bug | Verified by |
|---|---|
| SIM-01, SIM-02 | Every `surgical-sim.spec.js` test asserts 0 console errors (30 tests, ×2 repeats) |
| SIM-03 | Android re-run: 140 px → 1.27 rad (`evidence/android/highend-after-fix/log.json`) |
| SIM-04 | Mid-range: 37/37, then 3 × 19/19 (`evidence/android/midrange*/log.json`) |
| SIM-05 | Before / after experiment screenshots (lens section with and without the plane offset). All module screenshots were recaptured after the fix. |
| SIM-06 … SIM-13 | Recaptured screenshots in `evidence/<module>/`, plus probe tests (IOL lens gone and implant in the bag; ICL vault and iris above the implant; laser thickness, flap, epithelium and lenticule; intravitreal needle and medicine) |
| CAT-01, CAT-02 | `cataract-refinement.spec.js` 9/9 (3 tests × 3) |
| TEST-01 | Both suites 3/3 after the change |
| Context loss (new test) | Lose and restore ×2: notice shown, then hidden; the viewer still plays |
