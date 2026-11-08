# Original design direction

The owner chose "A — Premium Medical Editorial, with B's labelled anatomical plates" on 2026-11-07 (`DESIGN_DIRECTION_SELECTION.md`). This page records what makes the implemented result specific to this doctor rather than a template.

## The idea

A monograph about one physician and one organ. The page has the rhythm of a printed medical book: a named author, numbered chapters, plates with figure numbers, a key to each plate, and a ledger of credentials set as type.

## What is original here

1. **The plate as the site's unit of meaning.** Seven procedures are seven numbered plates (PL.01–07). The same plate number follows a procedure from the homepage to the library, the menu sheet and its own page.
2. **A key instead of captions on the picture.** Numbered pins sit where the 3D model says the structure is, and the words sit in a key that reads correctly in either language. This is how atlases work, and it also solves a real bilingual problem.
3. **The doctor and the anatomy share the first screen.** The portrait is a small source file, so it is presented honestly at its true size, as a print laid on the plate. That turns a weakness into a composition.
4. **One night chapter.** The only full-bleed moment on the homepage uses the dark render's own ground, so the image has no visible edge and the page has one dramatic turn rather than many.
5. **Bilingual type treated as two settings of the same book.** Naskh and Newsreader are set with their own leading, tracking and weight, but share the numerals, the rules and the grid.

## What was deliberately left out

Cards with shadows, gradients and glass, count-up statistics, carousels, stock photographs, testimonials without permission, scroll-jacking, and any superlative wording.

## Rules for future work

- One accent. Bronze marks numbers, arrows and focus, and nothing else.
- Numbers are set in Newsreader. New numbered lists follow the same style.
- A new clinical image must come through the manifest with anchors, alt text, a caption and a review status.
- Hairlines separate; boxes are the exception (warning signs, the questionnaire, close-up frames).
- Keep images unmirrored in RTL, and keep their pins physical.
