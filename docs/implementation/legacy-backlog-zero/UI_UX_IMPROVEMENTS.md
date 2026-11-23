# UI/UX improvements (no redesign)

Desktop with mouse or trackpad only; phones unchanged by decision (see PERFORMANCE_COMPARISON).

| Change | What the reader notices | Rule |
|---|---|---|
| Smooth wheel scrolling (Lenis, lerp 0.14) | the page glides and settles a few frames after the wheel; it does not "float" | keyboard, scrollbar, find-in-page, site jumps and Back unchanged |
| Staggered entry of plates, path tiles, guide rows and booking ways | items below the screen arrive in reading order as they come into view | 0.45 s, 14 px rise, never for items already on screen |
| Menu links arrive in order | links fade in within 0.18 s after the sheet opens | stagger spread capped |
| Figure dialog cross-fade | enlarge view fades in (0.22 s) and out (0.14 s) | no transform; Escape/backdrop/close identical |
| Lens Lab "More settings" | the settings panel opens with a short height reveal | measured first; closing stays instant |
| Plate spotlight | a faint warm light follows the pointer over an anatomical plate | CSS only; light and dark variants |

Not changed: layout, typography, colours, content, the 3D surgery, the vision picture.
