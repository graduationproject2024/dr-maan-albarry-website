# Phase 2 scope

"Phase 2" here is the next milestone: clinical visualization quality, interaction reliability and mobile device validation. It does not rebuild the earlier cataract engine.

## In scope (done)

- Known defects: FS-10 investigated; release state reconciled.
- Mobile testing on real platforms: real iPhone and real Android in a device cloud, two official Android Emulator profiles.
- Fix every reproducible defect found (10 bug IDs, 8 fixed, 2 withdrawn as not bugs).
- Cataract 3D: anatomy reviewed against sources; motion validator strengthened; startup made faster.
- Lens Lab: mobile QA on device; optical integrity kept.
- Records: owner-communicated approval, medical changelog, Trello.

## Out of scope

- Phase 3 (booking system, chat, new sections, domain).
- New medical content, new stages, new optical model.
- Redesign, framework change, deployment of this branch.

## Limits of this run

- No macOS: no Xcode iOS Simulator. iPhone coverage is a real iPhone in the cloud (production build only) plus Playwright WebKit (branch build).
- Cloud devices could reach only the public site, so the branch fixes were verified on real phones only indirectly (same bugs reproduced locally, then fixed and re-tested locally and on the Android Emulator).
- The owner's laptop crashed while the emulator ran next to parallel browser tests; the last part was finished in "light mode" (no emulator, two test workers).
