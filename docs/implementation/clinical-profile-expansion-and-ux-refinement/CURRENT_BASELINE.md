# Current baseline (2026-11-23)

## Repository
- `main` is at `4a3e4f9`, the merge of PR #3 (phase 2 simulators).
  - "Deploy to GitHub Pages" run 45165305866 succeeded in 8 min 23 s, so the live site is that commit.
- The work branch is `feat/clinical-profile-expansion`, created from `origin/main`. Nothing on it is pushed or deployed.
- The local working tree has 278 modified evidence screenshots from earlier test runs (under `docs/implementation/clinical-visual-reconstruction/` and `premium-experience-reconstruction/`). They were left alone and are not part of these commits.

## CI
- The nightly "Full regression" run 45169661762 on `main` **failed**.
  - Almost all failures are WebGL suites on the ubuntu runner's software renderer: cataract-sim, cataract-stress, cataract-review, lens-lab, vision-sim, light-journey, surgical-sim and some journeys.
  - They are mostly timeouts.
- It was this workflow's first scheduled run, so there is no earlier baseline to compare against.
- Locally, on a GPU, the same suites pass (see `REGRESSION_RESULTS.md`).
- Tracked as BUG-C01.

## Owner-reported Lens Lab failure: reproduction attempt
- **Live site, desktop Chromium (1280 × 860):** the vision simulator mounts (1 canvas, road-sign scene) and the comparison renders.
- **Live site, phone width (375 × 812):** both work.
- **Vite dev server:** the simulator stayed on "Loading the simulator…".
  - The dev server's first-run dependency optimisation ("Re-optimizing dependencies because vite config has changed") left module requests pending.
  - This is a local development artefact, not a production fault.
- **Result:** the failure was **not reproduced** in production Chromium. The owner's device and browser are unknown (see `LENS_LAB_RECOVERY.md`).
