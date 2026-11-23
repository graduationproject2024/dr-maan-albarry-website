# Lenis integration

Source studied: https://github.com/darkroomengineering/lenis (README, `lenis.css`), npm `lenis@1.3.27`, MIT.

## Decision

Accepted for **desktop pointers only** (`(hover: hover) and (pointer: fine)`), never with `prefers-reduced-motion: reduce`. Phones and tablets keep native scrolling: Lenis is not created there at all (its default `syncTouch: false` would already leave touch native; not creating it removes every risk to touch, Lens Lab sliders and 3D gestures).

## Configuration (`src/motion/index.js`)

| Option | Value | Why |
|---|---|---|
| `autoRaf` | false | driven by `gsap.ticker` (one frame loop) |
| `lerp` | 0.14 | light smoothing; settles in a few frames |
| `smoothWheel` | true | the point of Lenis |
| `syncTouch` | false | touch stays native |
| `anchors` | false | the site's own link handling (`go`, `scrollToSection`) owns jumps |
| `allowNestedScroll` | true | menu sheet, figure dialog and settings scroll themselves (README warns of a per-event DOM check; acceptable on desktop) |
| `prevent` | `canvas, dialog, .mobile-nav, [data-lenis-prevent]` | the 3D viewer and the vision picture keep the wheel; dialogs never scroll the page |

GSAP recipe from the README (ScrollTrigger part dropped with ScrollTrigger): `gsap.ticker.add(t => lenis.raf(t * 1000))`, `gsap.ticker.lagSmoothing(0)`.

## Site integration

- `main.js pageScrollTo()`: every programmatic scroll (section jumps, Back/reload restoration, 3D viewer reveal, holds while late modules mount) goes through Lenis when it is active, so the two never disagree.
- A `MutationObserver` on `<html>` stops Lenis while `dialog-open` or `drawer-open` is set and starts it again after.
- CSS: the three rules of `lenis.css` the site needs (`html.lenis` height, stopped overflow, iframe).
- Loaded lazily in idle time after the first page load (`bootMotion`), never on a data-saver or 2G connection.

## Verified (tests/motion.spec.js, Chromium desktop 1280×800)

Lenis active; wheel scroll moves and settles; End key still works; section jump lands under the header; the dialog stops Lenis and a wheel over it does not move the page; Escape closes and returns focus; a wheel over the vision picture does not start a smooth scroll; touch profile has no Lenis; reduced motion has no Lenis.

## Compared with native scrolling

Native is not worse; Lenis adds a short glide to mouse-wheel steps on desktop. On phones nothing changes. Limits from the README: Safari capped at 60 fps; smooth scroll pauses over iframes (the site has none).
