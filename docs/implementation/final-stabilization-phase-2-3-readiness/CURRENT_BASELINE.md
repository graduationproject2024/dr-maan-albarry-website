# Current baseline (verified 2026-11-15)

## Repository

| Item | Value |
|---|---|
| Remote | `github.com/graduationproject2024/dr-maan-albarry-website` |
| `origin/main` | `c7cdbed7ea0f52f76e8452a24df030b7900cfba0` |
| Previous working branch | `feat/premium-ux-refinement` at `13393a8` (one docs-only commit ahead of main) |
| This milestone's branch | `feat/final-stabilization`, cut from `13393a8`. Local only: not pushed, not merged, not deployed |

## Production

| Question | Answer and evidence |
|---|---|
| Production commit | `c7cdbed`. GitHub Actions run `43616223259`, "Deploy to GitHub Pages", push to `main`, success, 2026-11-14 16:33 UTC |
| How it deploys | `.github/workflows/deploy.yml` on push to `main`, through `actions/deploy-pages`. The old `gh-pages` branch and the `npm run deploy` script are not what serves the site |
| Which refinements are live | Everything in `premium-ux-refinement`: portrait-first hero, 13 re-rendered images, mobile Lens Lab rebuild, scrubber and jump fixes, returning-visitor features, section registry |
| Is the documentation stale | Partly. `premium-ux-refinement/FINAL_ACCEPTANCE.md` on `main` still says the Lens Lab work is "not deployed"; it was deployed in `c7cdbed`. The fix to that text is commit `13393a8`, which is on the branch, not on `main`. `PRODUCTION_STATUS.md` here is the corrected record |
| Did tests run before deployment | No. The workflow had no test stage: it built and published. The suite was run locally before the owner's instruction (713 passed, 0 failed, 24 skipped on `c13c474`) |
| Does production match the source | Yes for the code. `c7cdbed` only adds documents on top of `c13c474`, the commit that was tested |

## State of the product before this milestone

Screenshots of the production build taken at the start of this milestone, before any change, are in `evidence/before/` (home, cataract page, Lens Lab; phone and desktop) and `evidence/lens-lab/before-*.jpg`.

Measured at the start (details in the topic files):

- Lens Lab: choosing Near, Intermediate or Far changed only a frame and a caption. The rendered picture was the same scene each time (`evidence/before/capture.json`).
- Unknown address on GitHub Pages: GitHub's own "Page not found" page, not the site's.
- Back to a position below the Lens Lab reference on a desktop landed about 5,000 px too high.
- A 320 px-high landscape phone could not fit the picture and the controls together.
- 3D viewer on a throttled phone profile: 4.1 s from the tap to ready (median of 5).
- Throttled LCP (median of 5): home AR 2,744 ms, home EN 2,464 ms, cataract AR 2,880 ms.
- Four anatomy figures had two numbered pins overlapping; the label key was 13 px.
- The deploy workflow ran no tests.

## Historical results treated as historical

The last documented full run (713 passed, 0 failed, 24 skipped) was not taken on trust. This milestone's own full run on the final code is in `REGRESSION_RESULTS.md`.
