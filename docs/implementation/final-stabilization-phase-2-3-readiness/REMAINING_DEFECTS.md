# Defect register — final stabilization

Severity: P0 site unusable or unsafe · P1 a main task fails · P2 a task is hard · P3 minor. Numbering BUG-FS-nn.

| ID | Sev | Problem | Root cause | Fix | Test | State |
|---|---|---|---|---|---|---|
| FS-01 | P2 | Desktop: Back to a position below the Lens Lab reference landed ≈5,000 px too high | The restore scrolled once; the page was still short (module not mounted), so the scroll was clamped and never repeated; the clamped position then replaced the saved one | The hold repeats the scroll until the page can reach the target; a clamped position does not overwrite the one being restored | `returning-visitor.spec.js` "Back below a module that mounts late" (0 ms and 1,500 ms delay). Failed before the fix (3,294 vs >8,165), passes after | Fixed |
| FS-02 | P2 | 568×320 sideways: picture plus controls did not fit; at 125–150 % text a lens button could not be brought between the bars; labels broke mid-word | Two narrow columns on a very short screen | One-column fallback by screen height in text lines; no sticking when the picture column cannot fit; smaller labels on narrow sideways phones; one-line caption on short pictures | `lens-lab-distance.spec.js` "short landscape" (3 sizes × 3 text sizes) | Fixed |
| FS-03 | P2 | Unknown address: GitHub's generic error page on Pages; a silent copy of the home page under an SPA fallback | No 404.html; unknown routes fell back to home | Site not-found page (noindex, no canonical, links, booking) and `dist/404.html` | `routing.spec.js` "Unknown addresses" (8 tests); `journey-regressions` BUG-11 updated | Fixed |
| FS-04 | P3 | Four atlas figures had two pins overlapping; label key 13 px | Anchors 16–23 px apart for 20–28 px pins | Pins drawn up to 1.3 % of the width apart (manifest unchanged); key 15 px | `tests/audit-atlas.mjs` re-run: 0 overlaps, 0 small text | Fixed |
| FS-05 | P3 | Light-journey reserve 640/900 px for a 1,195–1,290 px module | Old estimate | Reserve 1,200/1,250 px | `evidence/bugs/reservation-after.json` | Fixed |
| FS-06 | P3 (test) | `first-render` "fade-in" check failed 1 in 5 runs | Measured before the first-load containment lifted | Waits for the lift | `--repeat-each=3`: 75/75 | Fixed |
| FS-07 | P3 (test) | `first-render` "reserve after adoption" failed in the gate run | Simulator mounted before the check on a fast machine | Holds the simulator code during the check, then checks it releases the reserve | `--repeat-each=3`: 75/75 | Fixed |
| FS-08 | P3 (test) | Subpath test crashed under load: "Route is already handled" | Test proxy answered a request the browser had abandoned; also on the live commit | Abandoned requests recorded; test fails if one is the page itself | Loaded runs | Fixed |
| FS-09 | P3 (test) | Touch step "drag starting on Labels" saw the view change 1 in 3 loaded runs | Fixed 1.5 s wait; the reset fly-back outlasted it under load | Waits until the view is at rest | 4 loaded repeats: pass | Fixed |
| FS-10 | P3 (test, under load) | Subpath test: a breadcrumb click sometimes does not navigate within 5 s at 8 parallel workers | Not found. Seen 3 times in 12 loaded repeats on the current code, not in 9 on the live commit; never alone (6/6) or in the full suite | — | `routing.spec.js` subpath | **Open**: needs a trace from a failing run |

## Carried over

| ID | Sev | Problem | State |
|---|---|---|---|
| Desktop Lens Lab reference reserve 1,200 px vs ≈6,400 px mounted | P3 | Page grows by ≈5,100 px below the reader when it mounts; measured CLS 0.0001 and no scroll movement (`reservation-after.json`), Back now correct (FS-01). Not enlarged: a 6,400 px empty block would be worse for no-JS readers and short visits | Accepted |
| BUG-05 (earlier) layout shift when web fonts arrive on slow first loads | P2 | Measured CLS this milestone: ≤0.003 on the five pages (`PERFORMANCE_RESULTS.md`) | Effectively resolved; card #20 can be reviewed |
| BUG-13 harmless three.js warnings after context restore | P3 | Accepted |
| Portrait resolution | — | External asset (`DOCTOR_PORTRAIT_STATUS.md`) |

No reproducible P0 or P1 is open.
