# Accessibility results

| Check | Result |
|---|---|
| axe-core (`journeys/axe.spec.js`) | pass |
| Focus not obscured (WCAG 2.2, 2.4.11) at 390×844 and 360×652, four pages | failed (6–12 per page) → fixed (P2-09), test added |
| Touch targets ≥ 44×44 px in the 3D controls at six phone sizes | pass after P2-02 (no target was shrunk) |
| Play/Pause accessible name when the label is hidden | kept (`aria-label`) |
| Reduced motion | existing tests pass |
| Arabic RTL on real devices | pass (Pixel 8 Lens Lab and 3D, AVD 3D) |

Known limit: at 732×256 keyboard focus may leave the distance row partly behind the booking bar (`LANDSCAPE_TEST_RESULTS.md`).

Not tested: screen readers (TalkBack, VoiceOver), system text size on real phones.
