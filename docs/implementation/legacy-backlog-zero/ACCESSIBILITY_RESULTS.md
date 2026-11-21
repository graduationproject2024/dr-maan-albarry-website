# Accessibility results

- **axe:** `journeys/axe.spec.js` reports 0 violations on all 60 page × theme checks in each of 3 full runs. The dark/light intravitreal pages were also scanned ×10, 40/40 (BUG-18 closed).
- **Reduced motion:** no Lenis, no GSAP effects, content and dialogs appear at once (`motion.spec` reduced-motion test). Turning reduced motion on later stops Lenis and its frame loop (LZ-08).
- **Focus:** the dialog's close button gets focus on open, and focus returns to the opening button on Escape, the close button or a backdrop click (`motion.spec`, `plates-clarity`). Focus is not hidden by the booking bar (P2-09 test passes).
- **Target size:** the dialog's close button is ≥ 44 px from the first frame. There is no transform on the dialog (LZ-04).
- **Never hidden:** reveals use opacity only, never `visibility` or `display`. Items stay in the accessibility tree and find-in-page. Items already on screen are never hidden. Print shows everything (LZ-06).
- **Keyboard scrolling:** native on desktop with Lenis; the End key is tested.
- **Not done:** a screen-reader session with a person (external, #19).
