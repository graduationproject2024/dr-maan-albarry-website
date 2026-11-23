# Landscape results

| Size | Source | Result |
|---|---|---|
| 863×304 | AVD high-end, Chrome | Lens Lab works; "Whole scene" overlapped the enlarge button → fixed (P2-07); 3D open in landscape OK |
| 732×256 | AVD mid-range, Chrome | first tap on a distance moved the page 11 px → fixed (P2-08); stuck picture covered the distance row → fixed (P2-10) |
| 568×320, 667×331, 844×340, 844×390, 667×375 | Chromium emulation | existing tests pass; P2-07 also reproduced at 568×320 and fixed |

## Known limit at 732×256 (360 × 800 phones held sideways in Chrome)

Only 122 px remain between the 65 px header and the 69 px booking bar. The picture and all controls cannot be on screen together; the workbench scrolls as ordinary content. Every control can be brought between the bars and tapped (tested at 100, 125 and 150 % text), and a tap does not move the page. Keyboard focus may leave the distance row partly behind the booking bar here. Fixing that would need a layout change (for example hiding the booking bar in very short landscape), which is a design decision for the owner.

Also known (earlier milestone, unchanged): when the 3D viewer opens on a short phone it is scrolled so its controls end above the booking bar, which can put the top of the picture under the header.
