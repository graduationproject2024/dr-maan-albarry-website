# Baseline — before the master redesign (2026-11-01)

## Repository state
- **Branch:** `main`, clean, in sync with `origin/main`.
- **HEAD:** `402bc49` ("Merge PR #1: Phase 0 + 1 …"). This matches the commit named in the brief.
- **Other branches:**
  - `feat/phase0-phase1-trust-booking-mobile` is already merged.
  - `gh-pages` is a legacy branch; the Pages source is now GitHub Actions.
- **Untracked:** only `graphify-out/`, the knowledge-graph output from earlier in the session. It is unrelated and left alone.
- **Live site:** https://graduationproject2024.github.io/dr-maan-albarry-website/. It serves the built `402bc49`.

## Historical commits reviewed for content provenance
| Commit | Date | What it established |
|---|---|---|
| `93465a6` / `683cfc6` | 2026-10-22 | Initial site; clinic hours first appear |
| `2fbf261` | 2026-10-25 | Owner rewrites the credentials: Chief of Staff/CMO wording, roles list, FRCS, since 1998, EDOF preference note |
| `9da524c` | 2026-10-25 | Hero stats "+26 / 100% / +15,000", Saudi Board, SCFHS badge, direct phone 0554946433 used for call **and** WhatsApp |
| `0a9d4f2` → `1b320ae` | 2026-10-31 | Phase 0/1: removes unsourced facts, centralises data, mobile booking UX |
| `402bc49` | 2026-11-01 | Merge to main and deploy |

Exact original wordings and their decisions are in `../recovery/DOCTOR_CONTENT_RECOVERY.md`.

## Architecture at baseline
- **App structure:** a vanilla-JS SPA with no framework.
  - `main.js` (2,567 lines) renders template strings into `#app`, and `renderApp()` re-renders when the language is toggled.
  - `style.css` has 3,861 lines.
  - `index.html` ships with an **empty `#app`**, so all content is rendered by JavaScript.
- **Data:** `doctor-data.js` is the single source of truth. A Vite plugin injects the JSON-LD and generates `llms.txt` from it.
- **Vision Simulator:** WebGL, using three.js r128 loaded as a CDN global.
- **SEO at baseline:**
  - Canonical and hreflang pointed to `/ar/` and `/en/`, routes that **did not exist**.
  - The sitemap listed `#fragment` URLs.
  - The domain `drmaanalbarry.com` does not resolve.
- **Tests:** 92 Playwright tests, all passing at `402bc49`.

## Visual baseline captured
Command: `node tests/capture-sections.mjs docs/implementation/master-redesign-phase-2-3/evidence/before/sections` (run against the `402bc49` build).

| Viewport | Combinations | Sections captured |
|---|---|---|
| 390×844 and 1440×900 | AR/EN × light/dark | home, qualifications, profile, specialties, simulator, cataracts, questionnaire, education, clinic, faq, footer, plus a full-page image |

The header-only crop failed in the first run because of a script selector bug, since fixed. The header is still visible in each `full.jpg` and `01-home.jpg`.

The measurement baseline, from `tests/measure.mjs`, is in `evidence/before/<vp>/` with `measurements.json`.

**Page heights at baseline:**
| Viewport | Arabic | English |
|---|---|---|
| 390 | ≈20,335 px | ≈20,484 px |
| 1440 | 13,214 px | 13,196 px |

## Owner feedback that defines success
1. **Visual change:** the site looked almost unchanged after Phase 0/1. The redesign must be visible, not superficial.
2. **Doctor information:** legitimate information supplied by Dr. Maan was removed for not being on public sites. It must be recovered under a documented provenance policy.
