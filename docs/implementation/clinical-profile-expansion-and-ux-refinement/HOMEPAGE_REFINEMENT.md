# Homepage refinement

- **Hero:**
  - `.hero-plate` (the eye render and its caption) and its grid row are removed.
  - The text spans 7/12 columns at 1024 px and wider.
  - The portrait keeps its 374 × 450 source size.
- **Facts ledger:** 1998 · **25,000+** surgical operations over his career · FRCS. 15,000+ appears nowhere.
- **Count-up:**
  - Starts when the number is on screen (IntersectionObserver, threshold 0.6).
  - Eases out over 1.4 s, runs once, and lands exactly on "25,000+".
  - The final value is in the markup and in an `.sr-only` twin; the animated digits are `aria-hidden`.
  - Under reduced motion there is no animation.
- **Not added:** diagnostic and photo teasers (no authentic images yet).
