# CI/CD quality gates

## Before

`deploy.yml` on push to `main`: install, build, publish. No test ran. Permissions `pages: write` and `id-token: write` applied to the whole workflow.

## Now (branch `feat/final-stabilization`; first GitHub run passed 2026-11-17)

| Workflow | When | What | Publishes |
|---|---|---|---|
| `verify.yml` (reusable) | Called by the two below | Locked install (`npm ci`) → `npm audit --omit=dev --audit-level=high` → type check → `release:check` → Chromium → build + **gate suite** → test summary → report, traces and screenshots of failures kept 14 days | No; read-only |
| `ci.yml` | Every push to a branch other than `main`, every pull request | `verify` | No |
| `deploy.yml` | Push to `main`, manual | `verify` must pass → build → refuse a build with review-harness pages, check `index.html`, `404.html`, `sitemap.xml` → upload → deploy | Yes, only the `deploy` job, only after the gate |
| `full-regression.yml` | Manual (before a release) and Mondays 03:00 UTC | Whole suite (Chromium; the WebKit journey uses WebKit); a flaky test fails the run | No |

### The gate suite (`npm run test:gate`, 379 tests in 15 files)

Doctor-content integrity (`content-registry`, `phase0-content`), section registry (`section-registry`), routes, deep links, 404 and sitemap (`routing`, `seo`), first render (`first-render`), hero (`hero-portrait`), pages, navigation and booking links (`phase1-pages`, `closure`), Arabic/English and phone layouts (`phase1-mobile`), images (`plates-clarity`), unit tests of the optics model and the surgical constraints (`vision-optics`, `cataract-constraints`), accessibility (`journeys/axe`), security headers and external links (`journeys/security`).

Local result, Windows, `CI=true`, at 377 tests (before the two portrait tests were added): 376 passed and 1 failed (a timing race in a test, fixed: BUG-FS-07); the fixed test then passed 3 of 3 times. The gate files are all part of the final full run (`REGRESSION_RESULTS.md`).

The simulators' WebGL tests are in the full suite, not the gate: GitHub's Linux runners have no GPU and render WebGL in software, which makes them slow and timing-sensitive. They run weekly and before a release.

## Release states (`scripts/release-check.mjs`, `release-status.json`)

| State | Who decides | How it is recorded |
|---|---|---|
| Engineering readiness | CI | The gate result |
| Visual QA readiness | A person | `release-status.json` → `visualQa` |
| Medical content review | Dr. Maan only | Content files and the image manifest; never by CI |
| Deployment authorization | The owner | `release-status.json` → `deployment`, and the act of merging to `main` |

`release:check` exits 1 if an item claims approval without a reviewer and a date, if an item changed after review is marked approved, or if `release-status.json` says the medical review is complete while items are pending. Pending items do not block publishing (the owner's standing decision: they are shown as "pending physician review"); they block any claim of approval. Current output: 31 of 31 clinical items pending, no false claims.

## Security

- `permissions: contents: read` by default; `pages: write` and `id-token: write` only on the deploy job.
- No secrets are used or printed. No paid service was added.
- Actions are pinned to major versions (`@v4`, `@v3`), as before. Pinning to commit SHAs would be stricter; not done, to keep updates simple.

## Reports and retries

Job summary: commit, passed, failed, flaky, skipped with reasons (`scripts/ci-summary.mjs`). HTML report, traces and failure screenshots as artifacts. In CI a failed test is retried **once** and then reported as flaky in the summary; the pre-release run fails on any flaky test.

## First run on GitHub

The owner authorized pushing the branch on 2026-11-17. `ci.yml` run **44075670255** on `ubuntu-latest`: **success**. Every step passed: locked install, `npm audit` (shipped dependencies), type check, `release:check`, Chromium install, build and **379 of 379 gate tests** (4.8 min), summary, artifacts.

Warnings shown by GitHub (no action needed yet):
- `actions/checkout@v4`, `setup-node@v4`, `upload-artifact@v4` target Node.js 20, which GitHub now runs on Node.js 24. Move to their next major versions when released.
- The `ubuntu-latest` label moves to Ubuntu 26 from 2026-10-19 onward; the next runs may use it.

**Deploy path proven** on 2026-11-17 (owner: "Yes, deploy"): `deploy.yml` run 44077997526 ran `verify` (379/379) and then published; the published-files check passed (`index.html`, `404.html`, `sitemap.xml`, no review pages).

Not yet run on GitHub: `full-regression.yml` (manual or Mondays; the WebGL tests there use software rendering on Linux and may need timeout tuning).
