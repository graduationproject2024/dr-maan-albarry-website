// Hand-written narrative for the generated journey reports: which defects each journey surfaced and the expert
// heuristic observations. NUMBERS AND STEP TABLES ARE NOT HERE — report.mjs reads them from the JSON logs.
export const FILES = {
  'persona-a': 'persona-a-older-patient.md',
  'persona-b': 'persona-b-first-visitor.md',
  'persona-c': 'persona-c-english-mobile.md',
  'persona-d': 'persona-d-slow-network.md',
  'persona-e': 'persona-e-accessibility.md',
  'persona-f': 'persona-f-impatient-user.md',
  'persona-g': 'persona-g-returning-patient.md',
  'persona-h': 'persona-h-lens-comparison.md',
};

export const NOTES = {
  'persona-a': {
    defects: ['BUG-01', 'BUG-02', 'BUG-03', 'BUG-15'],
    observations: [
      'The first screen answers "who is this doctor" well: name, specialty, current role and portrait are all above the fold at 360 px.',
      'The cataract card sits about one and a half screens down; an older reader has to scroll past the hero facts first. A "Cataract" shortcut in the hero could shorten this, but the drawer and the procedures section already provide it.',
      'Arabic reading text is now 17 px with ~1.85 line height on the procedure page; long pages remain long — the page contents list is hidden on phones (see BUG-04 for the 3D jump link that was added).',
      'The 3D player is understandable without instructions (large Play/Pause, numbered stage buttons); the "Back to site" label for closing is clearer than an X.',
    ],
  },
  'persona-b': {
    defects: [],
    observations: [
      'The filter chips make the 7 procedures easy to scan by group; the active chip state is visible.',
      'Related-procedure cards at the end of every procedure page give a natural "compare" path; Back restores the reading position.',
      'Qualifications are presented as a ledger with sources named — good for trust; the Maps link opens externally and the embedded map has a meaningful title.',
    ],
  },
  'persona-c': {
    defects: ['BUG-04'],
    observations: [
      'Switching language keeps the visitor on the equivalent page and scrolls to the top — expected and predictable.',
      'Before BUG-04 was fixed, reaching the 3D walkthrough on a phone took ~13 swipes past the whole article; the new jump link under the hero CTAs fixes this.',
      'Navigating home with the 3D viewer open carries the same viewer into the home page\'s 3D section (by design; single instance verified).',
    ],
  },
  'persona-d': {
    defects: ['BUG-05', 'BUG-08', 'BUG-14'],
    observations: [
      'On Fast 3G + CPU×4 the prerendered heading appears in ~3 s; the procedure content chunk and 3D load stay usable.',
      'The 3D Start button shows "جارٍ التحميل…" immediately; with BUG-08 fixed it is now also exposed as aria-busy="true".',
      'Layout shift on the first screen at 320 px (web fonts arriving late and re-wrapping the hero kicker/title) is still measurable — BUG-05 stays open and is reported as a FAIL step in this journey.',
      'A 3D load abandoned on the cataract page finishes in the background and the viewer appears in the home page\'s 3D section (BUG-14, product decision).',
    ],
  },
  'persona-e': {
    defects: ['BUG-06', 'BUG-17'],
    observations: [
      'Skip link, header order and focus rings are consistent; stretched card links draw their ring around the whole card (::after).',
      'The 3D viewer is fully keyboard operable (arrows mirror in RTL, Space toggles playback) and there is no keyboard trap.',
      'Reduced motion is honoured: in-page jumps are instant and camera flights are replaced by cuts.',
      'This is an automated keyboard + accessibility-tree check. NO screen reader was run; names were read from the browser accessibility tree only.',
    ],
  },
  'persona-f': {
    defects: ['BUG-03'],
    observations: [
      'Rapid repeated taps never produce a second viewer; play/pause parity stays correct; stage navigation clamps at both ends.',
      'Before the fix every close/reopen leaked one WebGL context (capability probe); after the fix live contexts stay at one per open simulator.',
      'Rotation re-fits the canvas to its container in both orientations without page overflow.',
    ],
  },
  'persona-g': {
    defects: ['BUG-12'],
    observations: [
      'Language and theme are remembered; the bare address redirects a returning English reader to /en/ with no flash of the light theme.',
      'Shared deep links to a section (#p-risks) are reliable after BUG-12 was fixed (the position was sometimes lost when the app replaced the prerendered markup).',
    ],
  },
  'persona-h': {
    defects: ['BUG-16'],
    observations: [
      'Every lens, distance and lighting change updates the explanation card and is announced politely; the disclaimer is persistent under the viewer.',
      'Negated statements ("cannot be guaranteed") are present and appropriate; no positive certainty claim was found in the simulator or on the lens implant page.',
      'VS-RTL: the Arabic sharpness bars fill from the right (measured by geometry in single and compare mode at 390 and 1366 px) — the reported issue did not reproduce on this build.',
      'In the light theme the lens-card and meter titles were nearly invisible before BUG-16 was fixed (found by axe, not by this journey\'s steps).',
    ],
  },
};

export const CORE = {
  'j01-cataract-consultation': { defects: [], observations: ['Education accordion → full guide → FAQ → 3D → booking flows without dead ends.'] },
  'j02-corneal-care': { defects: [], observations: ['The call links were checked by URL only; no call was placed.'] },
  'j03-vision-comparison': { defects: [], observations: ['FIXED-2 verified: viewer ≥ viewport − 56 px at 390 px.', 'A one-finger vertical swipe on the viewer scrolls the page (touch-action: pan-y).'] },
  'j04-language-theme-persistence': { defects: [], observations: ['The URL decides the language on Back/Forward; the saved choice only redirects the bare root.'] },
  'j05-loading-failure': { defects: ['BUG-09'], observations: ['Chromium refetches a failed dynamic import on retry, so the 3D retry works.', 'Before BUG-09 the vision simulator left an empty 1,540 px box when its chunk failed; it now explains and offers a retry.'] },
  'j06-360-full-scroll': { defects: ['BUG-10'], observations: ['Every main section renders at 360 px without sideways overflow; the footer clears the fixed booking bar.'] },
  'j07-repeated-3d': { defects: ['BUG-03'], observations: ['Eight cycles: ready time stays flat (~0.6 s warm) and live WebGL contexts return to 0 after each close since the fix.'] },
  'j08-slow-3g': { defects: [], observations: ['Slow 3G is usable: prerendered content first, then the scripts; the 3D shows a loading state for several seconds.'] },
  'j09-webgl-context-loss': { defects: ['BUG-13'], observations: ['Both simulators show a "restoring" note and recover; restoring triggers harmless three.js "object does not belong to this context" warnings (BUG-13).'] },
  'j10-trust-contact': { defects: [], observations: ['Credentials name their sources (Magrabi, Taibah University).'] },
  'j11-viewport-matrix': { defects: [], observations: ['All nine required viewports, both languages: no overflow, booking reachable, no reserved-space gap.'] },
  'j12-missing-images': { defects: [], observations: ['Missing illustrations fall back to the schematic line plate everywhere.'] },
  'j13-no-js-prerender': { defects: ['BUG-10'], observations: ['Without JavaScript the pages are complete; the simulator section no longer reserves a 1,540 px blank box.'] },
  'webkit-iphone': { defects: [], observations: ['Run in Playwright WebKit 27.2 on Windows — not iOS Safari. Host 125 % display scaling forced a compensated viewport and mouse clicks (see MOBILE_TEST_MATRIX.md).'] },
};
