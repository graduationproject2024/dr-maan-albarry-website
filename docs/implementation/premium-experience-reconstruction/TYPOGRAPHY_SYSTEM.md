# Typography system

## Families

All four are licensed under the SIL Open Font License 1.1 and self-hosted in `public/fonts/`, with licence texts beside them. There is no Google Fonts request any more.

| Role | Family | Weights shipped | File size |
|---|---|---|---|
| Arabic display | Noto Naskh Arabic | 600 | 57 KB |
| Arabic text | IBM Plex Sans Arabic | 400, 600 | 43 + 46 KB |
| English text, and Latin inside Arabic text | IBM Plex Sans | 400, 600 | 23 + 24 KB |
| English display and every numeral | Newsreader | Roman 400–500, italic 400 | 35 + 23 KB |

`scripts/build-fonts.py` produces these from the `@fontsource` packages. Newsreader is instanced to one optical size (48) and subset to Latin, which reduces it from 132 KB to 35 KB (roman) and from 147 KB to 23 KB (italic). Only the two faces of the first screen are preloaded, and the prerender swaps them for the English pair on English pages.

## Stacks

Arabic text falls through to IBM Plex Sans for Latin characters such as FRCS or CXL, and Arabic display falls through to Newsreader. This avoids shipping duplicate Latin glyphs.

## Scale (fluid, 360 to 1440 px)

| Token | Arabic | English |
|---|---|---|
| Display (home h1) | 42 → 80 px, line-height 1.3 | 44 → 84 px, line-height 1.02, tracking −0.025em |
| h1 (page titles) | 38 → 68 px, 1.32 | 40 → 72 px, 1.04, −0.022em |
| h2 (chapter titles) | 30 → 50 px, 1.38 | 32 → 54 px, 1.08, −0.018em |
| h3 | 19 → 24 px, 1.5 | 20 → 26 px, 1.22, −0.008em |
| Lede | 17 → 20 px, 1.85 | 17 → 20 px, 1.6 |
| Body | 16 → 17 px, 1.9 | 16 → 17 px, 1.65 |
| Small | 15 px, 1.8 | 15 px, 1.6 |
| Caption | 13 px, 1.65 | 13 px, 1.55 |
| Chapter numeral | 72 → 132 px, Newsreader italic | Same |

Arabic gets more leading and no tracking, because joined letters must not be spaced and Naskh has tall ascenders and descenders. English display is tightly tracked because Newsreader is set large. English headings use weight 400 and Arabic headings 600, which gives the two scripts a similar colour on the page.

## Rules

- Every numeral device (chapter numbers, plate codes, ledger figures, steps) uses Newsreader lining figures, in both languages.
- Text is never placed on an image; labels sit in a key.
- The body measure is limited to about 66–68 characters.
- `text-wrap: balance` on headings and `pretty` on paragraphs keep Arabic line breaks calm.
- The smallest text is 12 px (portrait role, source tags); ordinary text is never below 13 px.

## Preventing layout shift

`font-display: swap` is paired with metric-matched local fallbacks (`style.css` §0): "Noto Naskh Arabic Fallback" from Times New Roman Bold, "IBM Plex Sans Arabic Fallback" from Segoe UI, "Newsreader Fallback" from Times New Roman, and "IBM Plex Sans Fallback" from Arial. The size-adjust, ascent and descent values were measured by `scripts/measure-fallback-fonts.mjs` in Chromium on Windows, so other platforms get a close but not exact match.
