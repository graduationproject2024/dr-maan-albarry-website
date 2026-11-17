# Production status

Corrects the older reports. Verified on 2026-11-15 from GitHub Actions and the live site.

| Item | Value |
|---|---|
| Live site | https://graduationproject2024.github.io/dr-maan-albarry-website/ |
| Live commit | `c7cdbed` (`main`), deployed 2026-11-14 16:33 UTC by run `43616223259` |
| Authorized by | The owner, in chat: "Yes, deploy" (2026-11-14) |
| Deployment method | GitHub Actions → GitHub Pages (`deploy.yml`). Not the legacy `gh-pages` branch |
| Tests before that deployment | Local only (713 passed, 0 failed, 24 skipped on `c13c474`). The workflow itself ran none |

## What is on `main` and live

Hero with the doctor first, 13 clearer anatomical images, mobile Lens Lab rebuild, scrubber and jump fixes, Back/Forward/reload position, preference reset, section registry.

## What is NOT live (this milestone)

Everything on the local branch `feat/final-stabilization`:

| Change | Commit |
|---|---|
| Lens Lab closer view for each distance; More settings in groups | `7467750` |
| Back below a late module; short-landscape fallbacks; light-journey reserve | `3a26e87` |
| Site's own not-found page and `404.html` | `d8233a2` |
| 3D viewer code downloads just before the tap | `3a77b13` |
| CI quality gate before deployment | `2e9239e` |
| Stylesheet inside each prerendered page (faster first paint) | `c5b7b6c` |
| Portrait as one replaceable setting | (portrait commit) |
| Anatomy pins no longer overlap; 15 px label key | `d3ab9b6` |

The branch was pushed on 2026-11-17 on the owner's instruction ("Yes, push branch"); its CI run passed. It is not merged into `main`, so it is not live. Deployment is **not authorized**: the owner has not given an instruction to deploy this branch.

## Stale statements corrected

- `premium-ux-refinement/FINAL_ACCEPTANCE.md` (as on `main`): "the refinement branch is not deployed". It was deployed in `c7cdbed` on 2026-11-14.
- Trello card #25 says "On the branch, NOT live yet" for the Lens Lab rebuild. It is live. Updated in `TRELLO_RECONCILIATION.md`.
