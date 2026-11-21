# Actual implementation changes (branch `feat/legacy-zero`)

| File | Change |
|---|---|
| `src/motion/index.js` (new) | Optional motion layer: Lenis on desktop pointers, GSAP (core) per-item reveals in four list groups (IntersectionObserver, below-the-screen items only; fade only on touch), drawer link stagger (≤ 0.18 s spread), figure dialog cross-fade, settings panel expand, plate spotlight. Off with reduced motion. Exposes `window.__siteMotion`. |
| `main.js` | `pageScrollTo()` routes every programmatic scroll through Lenis when present; `bootMotion()` loads the layer at idle time after first load (skipped on data saver / 2G); `closePlateZoom()` animates the close; menu and dialog call the motion hooks; `renderApp` refreshes triggers. |
| `src/vision-sim/ui.js` | "More settings" panel expands smoothly when the motion layer is present (closing stays instant). No change to the optics. |
| `style.css` | `.fade-in.is-staggered` hand-off; Lenis base rules; plate spotlight (desktop pointer only, light and dark). |
| `index.html` | `Content-Security-Policy` meta (self only + Google Maps frame) and `referrer` meta `strict-origin-when-cross-origin`; inherited by all prerendered pages and `404.html`. |
| `tests/motion.spec.js` (new) | 9 tests: late loading, Lenis on/off by device and preference, section jumps, dialog behaviour, stagger end state, trigger cleanup, simulator canvas not scroll-jacked. |
| `package.json`, lockfile | `lenis` 1.3.27, `gsap` 3.15.1, exact versions. |
| `docs/implementation/legacy-backlog-zero/` | this milestone's records. |

Not changed: 3D cataract timeline and anatomy, vision-simulator optics, medical text, release-status item approvals, deploy workflows.
