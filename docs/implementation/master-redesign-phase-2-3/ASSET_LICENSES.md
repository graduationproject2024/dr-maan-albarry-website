# Asset licences: cataract surgery simulator

No third-party 3D models, textures, HDR environments, images, fonts or sounds were downloaded, purchased or embedded for the simulator. Every visual asset is generated at runtime by original code in this repository.

| Asset | Source | Author | Licence | Commercial use | Attribution |
|---|---|---|---|---|---|
| Eye geometry: cornea, sclera/globe, limbus, iris, ciliary body and processes, zonules, lens capsule, cortex, nucleus | Procedural code: `src/cataract-sim/anatomy.js`, `lathe.js`, `eye-model.js` | Written for this project | Same as the project; owned by the site owner (Dr. Maan Albarry) | Yes | None required |
| Intraocular lens (optic and haptics) and its fold/unfold deformation | `eye-model.js` | Written for this project | As above | Yes | None required |
| Instruments: keratome, forceps, phaco handpiece, IOL injector | `instruments.js` | Written for this project | As above | Yes | None required |
| Textures: iris, sclera/retina, nucleus, cortex opacity | Painted at runtime on `<canvas>` by `materials.js` (seeded PRNG) | Written for this project | As above | Yes | None required |
| Shaders: Fresnel shell patch, light rays | `materials.js` | Written for this project | As above | Yes | None required |
| Fallback stage diagrams (inline SVG) | `fallback.js` | Written for this project | As above | Yes | None required |
| UI icons (inline SVG paths) | `ui.js` | Written for this project | As above | Yes | None required |
| `three` npm package **0.170.0**, including `examples/jsm` `OrbitControls`, `RoomEnvironment` and `BufferGeometryUtils` | https://github.com/mrdoob/three.js | three.js authors | MIT | Yes | MIT licence text is kept in `node_modules/three/LICENSE`. Bundled builds keep the upstream licence comment where Vite preserves it. |

`RoomEnvironment` is a procedural scene of boxes and lights, so no HDR file is fetched. The simulator makes no network requests beyond its own JS and CSS chunk.
