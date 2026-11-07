# Before / after — premium experience reconstruction

## Before

**Build:** branch `feat/premium-experience-reconstruction` at `9322dd9` (identical to `main`, live on GitHub Pages),
built with `npm run build` (`tsc && vite build && node scripts/prerender.mjs`, 30 prerendered pages), served with
`npx vite preview --port 4390 --strictPort --host 127.0.0.1`. Captured on 2026-11-07.

**Method:** Playwright Chromium (repo `node_modules`), one fresh context per shot, DPR 1, viewport height 800 (≤430px),
1024 (768px) or 900 (1440px), `colorScheme` + `localStorage.theme` set for the theme, `localStorage.lang` cleared.
Each page was walked top-to-bottom twice (400px steps) so IntersectionObserver modules (Lens Lab, vision simulator,
Light Journey) and lazy images mount, then `.fade-in` was forced visible and a full-page JPEG (quality 70) taken.
"Horizontal overflow" = `document.documentElement.scrollWidth > innerWidth`. Console errors = `console.error`,
`pageerror` and failed requests. Raw numbers: `evidence/before/metrics.json` (incl. per-section heights).
Capture script: kept outside the repo (session scratchpad, `baseline/capture.mjs`); `scripts/qa-shots.mjs` is the in-repo equivalent.

| Page | Lang | Width | Theme | URL | Height (px) | Horizontal overflow | Console errors | Screenshot |
|---|---|---|---|---|---|---|---|---|
| home | AR | 390 | light | `/` | 8,015 | no | 0 | `evidence/before/home-ar-390-light.jpg` |
| home | AR | 320 | light | `/` | 9,045 | no | 0 | `evidence/before/home-ar-320-light.jpg` |
| home | AR | 360 | light | `/` | 8,328 | no | 0 | `evidence/before/home-ar-360-light.jpg` |
| home | AR | 375 | light | `/` | 8,140 | no | 0 | `evidence/before/home-ar-375-light.jpg` |
| home | AR | 430 | light | `/` | 7,782 | no | 0 | `evidence/before/home-ar-430-light.jpg` |
| home | AR | 768 | light | `/` | 9,003 | no | 0 | `evidence/before/home-ar-768-light.jpg` |
| home | AR | 1440 | light | `/` | 5,363 | no | 0 | `evidence/before/home-ar-1440-light.jpg` |
| home | EN | 320 | light | `/en/` | 9,221 | no | 0 | `evidence/before/home-en-320-light.jpg` |
| home | EN | 360 | light | `/en/` | 8,589 | no | 0 | `evidence/before/home-en-360-light.jpg` |
| home | EN | 375 | light | `/en/` | 8,377 | no | 0 | `evidence/before/home-en-375-light.jpg` |
| home | EN | 390 | light | `/en/` | 8,272 | no | 0 | `evidence/before/home-en-390-light.jpg` |
| home | EN | 430 | light | `/en/` | 7,869 | no | 0 | `evidence/before/home-en-430-light.jpg` |
| home | EN | 768 | light | `/en/` | 8,959 | no | 0 | `evidence/before/home-en-768-light.jpg` |
| home | EN | 1440 | light | `/en/` | 5,585 | no | 0 | `evidence/before/home-en-1440-light.jpg` |
| home | AR | 390 | dark | `/` | 8,015 | no | 0 | `evidence/before/home-ar-390-dark.jpg` |
| home | AR | 1440 | dark | `/` | 5,363 | no | 0 | `evidence/before/home-ar-1440-dark.jpg` |
| about | AR | 390 | light | `/about/` | 10,068 | no | 0 | `evidence/before/about-ar-390-light.jpg` |
| about | AR | 1440 | light | `/about/` | 4,931 | no | 0 | `evidence/before/about-ar-1440-light.jpg` |
| procedures | AR | 390 | light | `/procedures/` | 4,783 | no | 0 | `evidence/before/procedures-ar-390-light.jpg` |
| procedures | AR | 1440 | light | `/procedures/` | 3,203 | no | 0 | `evidence/before/procedures-ar-1440-light.jpg` |
| cataract | AR | 390 | light | `/procedures/cataract-surgery/` | 9,541 | no | 0 | `evidence/before/cataract-ar-390-light.jpg` |
| cataract | AR | 1440 | light | `/procedures/cataract-surgery/` | 6,802 | no | 0 | `evidence/before/cataract-ar-1440-light.jpg` |
| lens-lab | AR | 390 | light | `/lens-lab/` | 13,447 | no | 0 | `evidence/before/lens-lab-ar-390-light.jpg` |
| lens-lab | AR | 1440 | light | `/lens-lab/` | 9,462 | no | 0 | `evidence/before/lens-lab-ar-1440-light.jpg` |
| surgical-education | AR | 390 | light | `/surgical-education/` | 4,117 | no | 0 | `evidence/before/surgical-education-ar-390-light.jpg` |
| surgical-education | AR | 1440 | light | `/surgical-education/` | 2,423 | no | 0 | `evidence/before/surgical-education-ar-1440-light.jpg` |
| how-vision-works | AR | 390 | light | `/how-vision-works/` | 3,546 | no | 0 | `evidence/before/how-vision-works-ar-390-light.jpg` |
| how-vision-works | AR | 1440 | light | `/how-vision-works/` | 2,745 | no | 0 | `evidence/before/how-vision-works-ar-1440-light.jpg` |
| clinic | AR | 390 | light | `/clinic/` | 5,357 | no | 1: requestfailed: https://maps.google.com/maps?q=Magrabi+Eye+Hospital+Madinah&t=&z=15&ie=UTF8&iwloc=&output=embed net::ERR_ | `evidence/before/clinic-ar-390-light.jpg` |
| clinic | AR | 1440 | light | `/clinic/` | 2,960 | no | 2: requestfailed: https://maps.google.com/maps?q=Magrabi+Eye+Hospital+Madinah&t=&z=15&ie=UTF8&iwloc=&output=embed net::ERR_; requestfailed: https://www.google.com/maps/vt?pb=!1m5!1m4!1i14!2i9997!3i7040!4i256!2m1!1e1!3m12!2sen-US!3sUS!5e289!12m3! | `evidence/before/clinic-ar-1440-light.jpg` |
| procedures | EN | 390 | light | `/en/procedures/` | 4,735 | no | 0 | `evidence/before/procedures-en-390-light.jpg` |
| procedures | EN | 1440 | light | `/en/procedures/` | 3,271 | no | 0 | `evidence/before/procedures-en-1440-light.jpg` |
| cataract | EN | 390 | light | `/en/procedures/cataract-surgery/` | 9,690 | no | 0 | `evidence/before/cataract-en-390-light.jpg` |
| cataract | EN | 1440 | light | `/en/procedures/cataract-surgery/` | 6,881 | no | 0 | `evidence/before/cataract-en-1440-light.jpg` |

### Observations

- **No document-level horizontal overflow** on any page at any width (AR or EN, light or dark).
- **Contained sideways scrollers** (content placed off-screen inside an `overflow-x:auto` strip with a hidden scrollbar):
  - Home ≤639px: the hero "Start from what you need" links (`.intents ul`) — 3 of 4 links start off-screen
    (e.g. AR 390: items at x = −130…100 and −369…−138; EN 390: x = 274…558 and 566…847).
  - `/procedures/` ≤639px: the filter chips (`.proc-filter`) — 2 of 4 chips off-screen at 390px.
- **Console errors:** none on any page except `/clinic/`, where the Google Maps embed (`maps.google.com/maps?…output=embed`)
  and one tile request were reported as `net::ERR_ABORTED` in the headless run (third-party iframe; no app error, no
  `pageerror` anywhere).
- **Height:** Home is 5,363px (AR) / 5,585px (EN) at 1440 but 7,782–9,221px on phones and **9,003px at 768** (tablet is
  taller than a 390px phone). Home section heights at AR 390: hero 1,185 · expertise 1,019 · specialties 1,258 ·
  explore 987 · education+FAQ 1,172 · clinic 1,162 (+ header/footer). Tallest pages on phones: Lens Lab 13,447px,
  About 10,068px, cataract 9,541px (AR) / 9,690px (EN).
- **Dark theme** (home AR 390/1440) has identical heights to light.
- **Content hidden on phones** (CSS, inside `<main>`, hidden at 390 but visible at 1440): Home 11 element types
  (hero fact sub-lines, source tags, memberships, timeline roles 4–5, section ledes, specialty summaries, vision preview
  art + descriptions, cataract poster, hours caveat, accreditation); cataract page `nav.proc-toc`; Lens Lab table
  (cards instead, one at a time); Light Journey diagram labels; `/clinic/` booking-method descriptions. Outside `<main>`:
  footer procedure list, footer hours, footer title. Details and recommendations: `MOBILE_DESIGN.md`.

## After

_To be filled after implementation._
