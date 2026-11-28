# Bug register — this pass

| ID | Sev | Found by | Defect | Status |
|---|---|---|---|---|
| CL-01 | P1 | journey run | Lens Lab `#lab` bookmark never loaded the simulator (section between them) | FIXED `ffed997`, `90dcb94` |
| CL-02 | P1 | full run | Back to the bottom of Lens Lab landed ~5,000 px high (BUG-FS-01 regression) | FIXED `90dcb94`, `b34a668` |
| CL-03 | P2 | full run | Keyboard focus finished under the booking bar inside rising fade-in blocks | FIXED `90dcb94` |
| CL-04 | P1 | audit + measurement | Arabic Lens Lab page jumps on load, CLS 0.30–0.57 (also live) | FIXED `b34a668` (≤ 0.008) |
| CL-05 | P2 | audit | Module reserves far from real heights (Lens Lab CLS 0.141) | FIXED `b34a668` + test |
| CL-06 | P2 | measurement | Home at 800 px CLS 0.22 (Arabic semibold font not preloaded) | FIXED `b34a668` (0.003) |
| CL-07 | P2 | CI | Light Journey labels crossed the frame on Linux fonts | FIXED `b34a668` |
| CL-08 | P1 | review | Lens Lab 50 cm captions reused 40 cm promises (trifocal "often without glasses" while blurred) | FIXED `db22c4a` |
| CL-09 | P2 | cataract pass | Tools cut off on phones held sideways; 2 px overflow at 390; paused seek didn't redraw (IOL "missing"); camera could enter the globe | FIXED `e31fad6`, `8549040` |
| CL-10 | P2 | CodeQL | release-check regex accepted any "complete…"/"…approved" claim | FIXED `c65c548` |
| CL-11 | P3 | Semgrep | GitHub Actions pinned by tag | FIXED `a7c29bd` |
| CL-12 | P3 | review | Light Journey drifted on pause; push-in clipped step 7 | FIXED `82e51f3` |
| CL-13 | P3 | review | Lens Lab stale-build check could hang a stalled connection | FIXED `ad66ec0` |
| BUG-SIM-14 | P3 | register | ICL crossed the iris during the tuck | FIXED, model r2 |
| BUG-C01 | P2 | CI | WebGL suites time out on GPU-less runners | RESOLVED by layer split (owner decision) |
| FS-10 | P3 | register | Breadcrumb under load | NOT REPRODUCIBLE (92 repeats) |
| BUG-05 | P2 | register | Font layout shift | RESOLVED (+ CL-06) |
Open engineering defects: 0 known.
