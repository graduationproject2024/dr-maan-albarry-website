## Repository-wide search for obsolete claims (excluding node_modules, docs, tests, artifacts, .git)
- `preferred`: no matches
- `favou?r(ed|s)`: no matches
- `المفضل`: no matches
- `يفضل`: no matches
- `Clinically Favored`: no matches
- `15,000`: only the code comment recording its removal — ./doctor-data.js:130:    // "+15,000 procedures" and "100% protocol adherence" had no source and were removed.
- `100%` (as a statistic): no matches. Remaining occurrences are CSS values and the simulator hedge "may not apply 100% to individual reality" (a disclaimer, kept intentionally).
- `الهيئة السعودية للتخصصات`: no matches
- `Board-Certified`: no matches
- `Saudi Board`: no matches
- `2\.2 ?(mm|ملم)`: no matches
- `0554946433|554946433`: no matches
- `راكان|Rakan`: no matches
- `Chief Medical Officer`: no matches
- `zero halos|انعدام الهالات`: no matches

Command: grep -rEn over *.js *.html *.css *.txt *.md *.webmanifest *.xml, excluding node_modules, docs, tests, artifacts, .git, test-results; `prefers-*` CSS media features filtered. Run 2026-10-31 after the final build.
