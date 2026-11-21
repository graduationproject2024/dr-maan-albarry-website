# Motion design rules

Applied from the `apple-design` skill (WWDC "Designing Fluid Interfaces") and the owner's brief.

1. **Purpose first.** Each effect tells the reader something: order (staggered groups), arrival (dialog cross-fades in and out the same way), state (panel opens). Decoration alone is rejected.
2. **Never hide what is already there.** Only items still below the screen (checked after a restored position is applied) animate; the doctor's portrait and the page heading are never animated.
3. **Short and decelerating.** 0.14–0.45 s, `power3.out` (critically damped feel, no bounce).
4. **Same path both ways.** The dialog fades in and out the same way; no transform, so its controls never change size.
5. **Interruptible.** Tweens use `overwrite: true`; any new input replaces the running motion.
6. **Transform and opacity.** One exception: the settings panel height.
7. **Reduced motion = no motion.** No Lenis, no GSAP effects; content appears immediately.
8. **Phones stay as they were.** The motion layer is not loaded on touch screens (measured cost, little gain); gestures belong to the page and the simulators.
9. **Simulators are off limits.** No GSAP on the 3D cataract timeline or the vision picture.
10. **Optional layer.** Loaded after the page's load event, in idle time; if it fails, the site is complete without it.
