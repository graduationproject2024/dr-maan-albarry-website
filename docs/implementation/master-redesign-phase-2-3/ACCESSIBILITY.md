# Accessibility (target: WCAG 2.2 AA)

Each item lists the evidence for it. Anything that was not verified is listed as not verified.

## Website
| Requirement | Implementation | Evidence |
|---|---|---|
| Text contrast ≥ 4.5:1 / UI ≥ 3:1 | Navy/gold/ivory tokens computed with the WCAG formula, in both themes | Table in `CLAUDE_DESIGN_SYSTEM.md`. `phase1-mobile.spec.js` measures CTA and booking-bar contrast. |
| Visible focus | 2 px `--focus` ring with 3 px offset on every interactive element | `CLAUDE_DESIGN_SYSTEM.md`, checked visually |
| Keyboard navigation, no traps | Native links and buttons. The drawer closes on Escape and returns focus to the menu button. Skip link present (`main.js`). | `closure.spec.js` covers the drawer's Escape key and focus return. |
| ARIA state | `aria-expanded`/`aria-controls` on the drawer, FAQ and articles, kept in sync | `closure.spec.js` accordion and drawer tests |
| Language and direction | `<html lang/dir>` switches. Mixed-direction numbers sit in `<bdi dir=ltr>`. `/en/` is a real LTR document. | `seo.spec.js` and the smoke matrix |
| Reduced motion | Reveals and smooth scroll are off under `prefers-reduced-motion` | Design doc. The 3D module is tested separately below. |
| Touch targets ≥ 44 px | Booking bar ≥ 48 px. Vision Simulator controls 44 px. | `phase1-mobile.spec.js` geometry |
| Reflow (no horizontal scroll) | Mobile-first layouts | Smoke matrix at 360–1920 widths, plus `measure.mjs` in 20 combinations |
| Content without JavaScript | Prerendered HTML for `/` and `/en/` | `seo.spec.js` with JavaScript disabled |

## 3D cataract simulator
| Requirement | Implementation | Evidence |
|---|---|---|
| Keyboard | Space plays/pauses. ←/→ change stage, mirrored in RTL. All controls are buttons or a range input. | `cataract-sim.spec.js` |
| Screen readers | `aria-live=polite` announces stage changes. Every control is labelled in AR and EN. The text explanation of each stage is always present in the DOM. | `cataract-sim.spec.js` |
| Reduced motion | No autoplay. Camera cuts instead of flights. Slower playback that runs only on request. | `cataract-sim.spec.js` |
| No WebGL / context lost | A structured, illustrated fallback with working stage navigation. On context loss it shows "Restoring…" and resumes. | `cataract-sim.spec.js` |
| Readable when embedded | Self-contained colours. Contrast ≥ 4.5 on the card, in both themes. | `cataract-integration.spec.js` |
| Touch | A one-finger swipe scrolls the page. Rotating needs "Explore 3D" mode, which avoids a scroll trap. | `cataract-sim.spec.js` (mobile) |

## Not verified
- **Screen readers:** no real screen-reader session was run (NVDA, VoiceOver, TalkBack). The ARIA structure is tested, but the spoken output was not.
- **Automated audits:** no axe/Lighthouse audit was run, because neither is installed in this repository. Adding `@axe-core/playwright` is a recommended follow-up.
- **Zoom:** 200%/400% browser zoom was not tested beyond the 360 px reflow check.
