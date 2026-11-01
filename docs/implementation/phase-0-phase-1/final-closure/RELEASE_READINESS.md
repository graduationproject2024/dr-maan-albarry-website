# Release Readiness

**Verdict: technically ready to release to the existing GitHub Pages site, pending your authorization to push.** No clinic approval is needed to ship this branch. Every unconfirmed fact is either hidden or neutral, so the release is *safer* than what is live now (the live site still shows the unsourced stats, the licence badge, EDOF preference, and the unverified number).

| Gate | State |
|---|---|
| Build | ✔ `npm run build` |
| Automated tests | ✔ 92/92 |
| Dependency audit | ✔ 0 vulnerabilities |
| Visual check | ✔ 5 viewports × AR/EN × light/dark |
| Console / network | ✔ no errors (same-origin) |
| Content safety | ✔ no unsupported claims; scan in `../EVIDENCE/claim-search.md` |
| Clinic approvals | ⏳ pending (doesn't block this release) |
| Pushed to GitHub | ✖ not pushed — needs your OK |
| Deployed | ✖ — `.github/workflows/deploy.yml` deploys `main` to GitHub Pages on push |

## Release steps (once authorized)
```bash
git push -u origin feat/phase0-phase1-trust-booking-mobile
```
Then open a PR into `main`. Merging triggers the existing Pages workflow.

Note: the workflow runs `npm ci && npm run build` only; it does not run Playwright. Adding tests to CI needs a GPU runner or longer simulator timeouts (see `playwright.config.js`).

After deploy:
1. Open the live URL on a phone.
2. Tap Book, Call and WhatsApp.
3. Check that `/llms.txt` loads.

Rollback: revert the merge commit on `main`; Pages redeploys the previous build.
