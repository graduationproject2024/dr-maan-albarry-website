# Bug register

| id | Sev | Description | Status |
|---|---|---|---|
| BUG-C01 | P2 | The nightly "Full regression" on `main` (run 45169661762) fails on the CI software renderer. The WebGL suites time out. | Open, pre-existing. The suites pass locally on GPU. Needs a CI GPU decision or a split of the WebGL suites out of the nightly run. |
| BUG-C02 | P3 | Lens Lab stays on "Loading" on the local Vite dev server while dependencies re-optimise. | Not a production bug; documented. |
| BUG-C03 | P1 (reported) | Owner reports that Lens Lab does not work. | Not reproduced in production Chromium (desktop and 375 px). Needs the owner's device, browser and a screenshot. |
| BUG-C04 | P2 | Before/After on the keratoconus "understanding" tab would label disease progression as "after". | Fixed: the comparison is limited to the CXL tab (`compare.variants`). |
| BUG-C05 | P2 | The count-up changed the page's text while it animated, so the adopted prerender differed from the client render (first-render test, 6 cases). | Fixed: the digits are drawn from `data-n` by CSS, and the text content is always the final value. |
| BUG-C06 | P3 | Build parse error from a comment placed before an array comma (laser.js). | Fixed before commit. |
| BUG-C07 | P3 | The gallery harness page lacked the JSON-LD marker, which broke the harness build. | Fixed. |
| BUG-C08 | P3 | Older tests still expected the removed hero plate, 15,000+, 66 cm, toric as a lens button, and the homepage card markup. | Updated to the new behaviour. Each change is commented in the test. |
| BUG-C09 | P3 | Homepage height budget at 390 px exceeded (10,097 AR / 10,856 EN) after the owner-requested large gallery images. | Budget raised to the measured height + 100 px, with the reason in the test. |
