# Before / After (measured)

| Metric | Before (`main` 9da524c) | Start of closure sprint | After (`1b320ae`) |
|---|---|---|---|
| Sticky bar actions off-screen, 360 AR/EN | 2 / 4 | 0 / 3 | 0 / 3 |
| Sticky bar actions off-screen, 390 | 1 / 4 | 0 / 3 | 0 / 3 |
| Clinic CTA label / button, 360 AR | 273 / 246 px (clipped) | 171 / 246 | 171 / 246 |
| WhatsApp button text contrast | 1.98:1 (clinic), 4.12:1 (bar) | 5.0:1 | 5.0:1 |
| Simulator view width, 360 | 290 px, tags overlap | 310 px, no overlap | 310 px, no overlap, context-loss fallback |
| Page height, 390 AR | 24,998 px | 22,691 px | **20,335 px (−18.7%)** |
| Page height, 360 AR | 25,846 px | 23,378 px | **20,931 px (−19.0%)** |
| Hero CTA on first screen (360, 390, 1366, 1440) | No | Yes | Yes |
| Unsupported claims on page (stats, licence, EDOF preference, 2.2 mm, testimonials) | Present | None | None |
| FAQ / drawer ARIA state | Static / missing | Static / missing | Synced; Escape closes drawer |
| Language after reload | Reset to Arabic | Reset to Arabic | Remembered |

Screenshots:
- Before: `../EVIDENCE/before/<viewport>/`
- First after: `../EVIDENCE/after/<viewport>/`
- Final: `evidence/<viewport>/` and `screenshots/` (swipe rows)

Measurements: `evidence/measurements.json`, `evidence/summary.txt`.
