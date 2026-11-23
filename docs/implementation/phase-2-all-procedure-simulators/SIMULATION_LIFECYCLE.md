# Simulation lifecycle

The full contract is in `SHARED_ENGINE_ARCHITECTURE.md`. This file summarises the states and what is tested.

| State | Entered by | Leaves to |
|---|---|---|
| `idle` | mount starts | `loading` |
| `loading` | the shell is built and the scene is being built and precompiled | `ready`, or `fallback` (no WebGL / build error), or `error` |
| `ready` | first frame is possible | `playing`, `paused`, `completed` |
| `playing` / `paused` / `completed` | Play / Pause / end of timeline. Seek and stage changes from `completed` go back to `paused`. | each other, or `error` |
| `error` | WebGL context lost: the notice is shown and rendering stops | back to `playing` or `paused` when the context is restored |
| `fallback` | no WebGL or a build failure: the written stage list stays fully usable | nothing (final) |

## Guarantees, each covered by a test in `tests/surgical-sim.spec.js` (all six procedures)

| Guarantee | Test |
|---|---|
| Pause freezes the scene | `elapsed` is unchanged after 700 ms |
| Seek is deterministic | The probe at 0.63 is equal after seeking elsewhere and back |
| Every stage is reachable | By the list and by previous / next, for every variant |
| Reset restores the start | Stage 0, progress 0, paused, defaults |
| Language and theme switches keep the same scene | The marked canvas survives; the stage is kept |
| No duplicate renderers | Close and reopen ×4 → one canvas |
| Leaving the page destroys the viewer | Another procedure gets a fresh one |
| Context loss recovers | Lose and restore ×2 → notice shown, then gone; playback works |
| The no-WebGL fallback is usable | All six slugs: full written list, stage selection works |
