# Doctor portrait — status

## Search

Every image in the project and in the user's Downloads, Desktop, Pictures and Documents folders whose name suggests the doctor was listed with its pixel size:

| File | Size | Use |
|---|---|---|
| `public/images/dr-maan-portrait.png` (= `uploaded_1.png`) | 295×225 | The only studio portrait; source of the hero |
| `public/images/dr-maan-portrait-hero.webp` | 374×450 | Hero (crop of the above, enlarged ≈2× with Lanczos) |
| `public/images/doctor-portrait.jpg` | 200×200 | Social cards / JSON-LD image |
| `public/images/dr-maan-redsea.jpg` (= `uploaded_2.jpg`) | 682×1024 | Conference photograph, About page; event logos and other people in frame |
| `public/images/dr-maan-faculty.jpg` (= `uploaded_3.jpg`) | 1024×768 | Faculty photograph |

**No higher-resolution version of the studio portrait exists.** The conference and faculty photographs are larger but different pictures with busy backgrounds; using them in the hero would change the approved composition, so they were not used.

## Done in this milestone

- The hero reads its image from one setting, `PORTRAIT` in `doctor-data.js` (file, size, type, optional wider copies, `sizes`). The page, the `srcset` and the preload in the prerendered HTML all come from it (`tests/hero-portrait.spec.js` checks they agree and that the declared size is the real size).
- `scripts/build-portrait.py <photo>` prepares a replacement: crops to the 5:6 frame around the face, writes 480/800/1200 px WebP copies **only up to the photo's own size**, and prints the setting to paste. It never enlarges, sharpens, retouches, recolours or generates anything, and refuses a photo whose crop is under 480 px wide (it refused the current 295×225 source).
- Nothing about the doctor's face was altered. The layout is unchanged.

## Asset requirement (for the owner)

- An authentic, recent studio photograph of Dr. Maan, the same person and attire style as today.
- At least ≈1600 px on the long side (1200×1440 or larger after the 5:6 crop is ideal).
- Plain, light neutral background (the current hero field is warm off-white).
- Head and shoulders to mid-chest, face roughly one third from the top.
- Written permission for website use from Dr. Maan (and the photographer if needed).

With such a photo the swap is: run the script, paste the setting, `npm run build`, run the hero tests, re-measure LCP.
