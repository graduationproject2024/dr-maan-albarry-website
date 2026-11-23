# Accessibility results

- **Count-up:** the animated digits are `aria-hidden`; an `.sr-only` twin holds the final value.
- **Gallery items:** each is one link with the visible name. The 3D pill has a screen-reader suffix.
- **"Details" button:** `aria-pressed`, with visible Show / Hide text.
- **Before/After:** `aria-pressed` buttons; the explanation is `aria-live="polite"`.
- **Light Journey:**
  - the button label changes between Play, Pause and Replay;
  - the scrubber is a labelled range;
  - the speed choices are a labelled group;
  - there is no autoplay under reduced motion.
- **Lightbox:**
  - a modal `<dialog>` labelled by its caption;
  - Esc closes it and focus returns to the thumbnail;
  - RTL-aware arrow keys;
  - targets of at least 44 px.
- **Toric switch:** a native checkbox with a label.
- **axe:** `tests/journeys/axe.spec.js` is in the gate run.
