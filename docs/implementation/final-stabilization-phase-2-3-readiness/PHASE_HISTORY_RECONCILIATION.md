# Phase history reconciliation

## The naming problem

"Phase 2" and "Phase 3" already have a meaning in this project. They were used on 2026-11-01 for the cataract-surgery 3D work, and that work exists. The owner's new brief asks to prepare "the next two development phases". No document, Trello card or message defines what the **new** Phase 2 and Phase 3 contain.

Decision used here: the earlier phases keep their names, and the plans in this folder are called **next Phase 2 (provisional)** and **next Phase 3 (provisional)**. Nothing in them is owner-approved scope.

## What was promised, built, verified and approved

| Earlier phase | Promised (source) | Built | Technically verified | Clinically approved |
|---|---|---|---|---|
| Phase 0: doctor data and content integrity | Phase 0/1 brief; Trello #11 | Yes. `doctor-data.js` as the single source; unverified claims removed | Yes (`content-registry`, `phase0-content` specs) | Not applicable; clinic decisions D-1 to D-14 still open (#13) |
| Phase 1: booking and mobile UX | Phase 0/1 brief; Trello #12 | Yes | Yes | Not applicable |
| Phase 2 (2026-11-01): cataract 3D engine | `PHASE_2_3_HANDOFF.md` §1 and the closure brief: "real interactive 3D … start/pause/resume, zoom/pan/rotate, step-by-step, AR/EN, fallback" | Yes. `src/cataract-sim/` (engine, state machine, lifecycle, controls, fallback, review mode); documented in `master-redesign-phase-2-3/PHASE_2_ENGINEERING.md` | Yes (`cataract-sim`, `cataract-stress`, `cataract-integration`, `cataract-constraints` specs) | **No**. Pending (#22) |
| Phase 3 (2026-11-01): anatomy and surgical stages | Same sources | Yes. Procedural anatomy and 7 stages; rebuilt 2026-11-02 with literature dimensions, a constraint validator and traced rays; documented in `PHASE_3_SIMULATION.md` and `clinical-visual-reconstruction/CATARACT_*` | Yes | **No**. Pending (#22) |
| Later work, not called phases | Owner briefs of 2026-11-02 to 2026-11-15 | Procedure library (7 procedures, 30 pages), anatomical atlas (27 images), vision simulator rebuild, Lens Lab, premium design, refinements, this milestone | Yes | **No** for every clinical item |

## What is genuinely new

Nothing in the next phases is defined yet. The only stated owner wishes that are not built are on Trello and have no description: "MAKE RESERVATION SYSTEM" (#8), "make bot in website" (#9), "Make Automatiom" (#7), "feeding website with real data" (#5), "buying domain and server" (#3), "security" (#2), "update pics" (#4). Card #10 "make animation for procedures and services" overlaps with what was built for cataract surgery only.

## Not to be duplicated

- A new cataract 3D simulator: it exists. Improvements belong in `src/cataract-sim/`, versioned by `MODEL_VERSION`.
- A new vision simulator or Lens Lab: they exist.
- A new section system or routing: `section-registry.js` already drives routes, menus, sitemap, prerender, metadata and llms.txt.
- New design directions: the design is approved.

## Questions the owner must answer before any next phase starts

1. What does "Phase 2" mean now: more 3D procedures (for example lens implants or LASIK as animations, card #10), deeper accuracy of the existing simulators, or something else?
2. What does "Phase 3" mean now: booking (#8), a chat assistant (#9), new content sections, or something else?
3. Is clinical review of the existing material a precondition (recommended), or can new work run in parallel?
