# Model versions

| Model | Version | File | Covers | Status |
|---|---|---|---|---|
| `csim-anatomy` (cataract) | 2026.11-r2 | `src/cataract-sim/anatomy.js` | Cataract surgery, 7 stages | Unchanged this phase. Earlier review state applies. |
| `ssim-anatomy` (shared library) | 2026.11-r1 | `src/surgical-sim/anatomy/geometry.js` | All six new simulators | New |
| `ssim-engine` | 2026.11-r1 | `src/surgical-sim/core/engine.js` | Engine | New |
| `ssim-iol` | 2026.11-r1 | `procedures/iol.js` | 6 stages, 4 lens types | Clinical review pending |
| `ssim-icl` | 2026.11-r1 | `procedures/icl.js` | 7 stages | Clinical review pending |
| `ssim-laser` | 2026.11-r1 | `procedures/laser.js` | LASIK 6, PRK 6, SMILE 4 stages | Clinical review pending |
| `ssim-cxl` | 2026.11-r1 | `procedures/keratoconus-cxl.js` | Keratoconus 5, CXL 6 stages | Clinical review pending |
| `ssim-kpl` | 2026.11-r1 | `procedures/corneal-transplant.js` | PK 6, DALK 6, EK 6 stages | Clinical review pending |
| `ssim-ivt` | 2026.11-r1 | `procedures/intravitreal.js` | 6 stages | Clinical review pending |

`getReviewMetadata()` returns, for every model and variant:
- model ID and version;
- library and engine versions;
- stages (Arabic and English);
- sources;
- simplifications;
- `clinicalStatus: 'pending'`;
- a content hash.

The hash changes whenever a stage text changes, so a later review can tell whether it saw the current content.

**Rule:** any change to stages, geometry or wording raises the version (r2, r3, …) and is listed here.
