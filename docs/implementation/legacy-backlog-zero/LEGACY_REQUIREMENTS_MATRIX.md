# Legacy requirements matrix

| Requirement (from cards) | Cards | Engineering state | External part | Final state |
|---|---|---|---|---|
| Redesigned, premium UI | #1, #18, #19, #21, #25 | done, live | owner's final visual acceptance | BLOCKED — EXTERNAL (acceptance only) |
| Security | #2 | audit 0, link/URL hardening, CSP + referrer meta (new) | HTTP headers need a host | BLOCKED — EXTERNAL |
| Domain and server | #3 | — | purchase | BLOCKED — EXTERNAL |
| Real photos | #4 | portrait pipeline ready | photo file | BLOCKED — EXTERNAL |
| Real doctor data | #5, #11, #13 | done, live, tested | D-1…D-14, testimonials, written record | engineering DONE; decisions external |
| Real links | #6 | done, tested | — | DONE — VERIFIED |
| Automation | #7, #28 | CI gate live | full-regression run on GitHub | #28 OPEN (minor) / #7 FUTURE |
| Reservation system | #8 | booking via clinic portal, phone, WhatsApp | clinic decision | DEFERRED — FUTURE |
| Website bot | #9 | — | provider, privacy, wording | DEFERRED — FUTURE |
| Procedure animation | #10, #19, #22 | cataract 3D + vision simulator live, pending review | Dr. Maan's item review | BLOCKED — EXTERNAL |
| Booking and mobile UX | #12, #14, #15, #17 | done, live, tested | — | DONE — VERIFIED |
| Reviews and bug registers | #16, #20, #23, #31 | fixed and tested | — | DONE (#16, #23); #20 per item; #31 not deployed |
| Performance | #24, #27 | fixed, live, re-measured | field data (needs tracking authorization) | DONE — VERIFIED (lab) |
| Lens Lab | #26 | live | wording review (#22) | DONE — VERIFIED (engineering) |
| Device testing | #29, #30 | cloud real devices on production, emulator | physical phone, real-iPhone branch check | BLOCKED — EXTERNAL |
| Premium motion (this brief) | — | Lenis + GSAP layer on `feat/legacy-zero` | deploy authorization | INTEGRATED BUT NOT DEPLOYED |
