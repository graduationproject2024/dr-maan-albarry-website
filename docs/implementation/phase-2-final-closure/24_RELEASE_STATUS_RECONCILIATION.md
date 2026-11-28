# Release status reconciliation

| State | Value |
|---|---|
| Live (main) | `4e55b40`, deploy run 45242684926 |
| Closure branch | `feat/phase-2-final-closure`, draft PR #6, 41+ commits ahead |
| Locally tested | full suite 950/951 on GPU (flake fixed); GPU layer and CPU layer defined |
| Pushed | yes |
| Merged / deployed | no — needs the owner |
| Owner-approved design | yes (2026-11-09) |
| Clinically reviewed | no — 39 items pending (`npm run release:check`) |
`release-status.json` now lists each deploy with the owner's own chat instruction and marks PR #6 not authorized.
