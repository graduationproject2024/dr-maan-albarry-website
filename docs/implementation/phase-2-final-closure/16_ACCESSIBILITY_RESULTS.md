# Accessibility

- axe-core (WCAG A/AA) runs in the gate on 16 pages × 2 themes and on the simulators: 0 violations (journeys/axe.spec.js, surgical-sim axe, light-journey axe EN/AR light/dark).
- Fixed this pass: focus hidden under the booking bar in fade-in blocks (WCAG 2.4.11); Before/After single announcement; reduced motion respected in Light Journey (no autoplay, no attribute writes), Lens Lab cross-fade, cataract compare.
- Keyboard: data-act buttons are real `<button>`s; journeys persona E (keyboard + reduced motion) green.
- Not done: screen-reader session with NVDA/VoiceOver on real devices.
