# Test Results — Final Closure (2026-11-01)

## Commands (reproducible)
```bash
npm ci
npm run build           # tsc && vite build
npm test                # Playwright: builds, serves dist/ on :4173, runs all specs
npm run test:evidence   # build + screenshots/measurements → final-closure/evidence (serves itself on :4174)
npm audit
```
Windows note: Playwright routes WebGL to the real GPU (ANGLE/D3D11). Software WebGL (SwiftShader) made each simulator click take ~9 s; that is an environment limit, not an app defect.

## Results
| Check | Result |
|---|---|
| `npm run build` | ✔ |
| `npm test` | **92 passed, 0 failed, 0 skipped, 0 flaky** (1.6 min) |
| `npm audit` | 0 vulnerabilities |
| Evidence capture (20 combos) | 0 off-screen bar actions, 0 clipped CTAs, 0 horizontal overflow, 0 console/network errors — [summary](evidence/summary.txt) |

| Spec | Tests | Covers |
|---|---|---|
| `tests/phase0-content.spec.js` | 14 | contacts from central data, no unsupported claims, roles, hours, JSON-LD = page, llms.txt, `dist/` scan, testimonial gate + render |
| `tests/phase1-mobile.spec.js` | 52 | bar geometry/destinations, overflow, hero/clinic CTAs, simulator, desktop fold, contrast, regression (lang, theme, drawer, scroll-spy, FAQ, accordion, questionnaire, images, listeners) |
| `tests/closure.spec.js` | 26 | **20-combination smoke** (360/390/768/1366/1440 × AR/EN × light/dark: loads, scrolls, all booking/call/WhatsApp/maps/header links, no overflow, no blocking overlay, no console errors) + drawer ARIA/Escape, accordion ARIA, language persistence, WebGL context-loss fallback, swipe rows, SEO metadata/robots/sitemap/llms |

## Manual visual review
Reviewed by eye: 768 AR light (hero + bar), 1440 EN light (hero, CTA on first screen), 390 AR light / EN dark swipe rows, plus earlier 360/390 bar, clinic and simulator captures. No overlaps, clipping or dark-mode contrast problems seen.
