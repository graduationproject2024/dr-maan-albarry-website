# Baseline at the start of the pass (2026-11-24)

- `main` = `4e55b40` (PR #5), live via deploy run 45242684926. Branch `feat/phase-2-final-closure` cut from it.
- Last full regression (45169661762, on PR #3 code): 52 failed, 3 flaky, 788 passed, 24 skipped — WebGL suites timing out on GPU-less runners (BUG-C01), job near its 2 h limit.
- Security scanners (Semgrep, Gitleaks, OSV, CodeQL, ZAP) never run. npm audit 0.
- Trello: 32 cards, no checklists/comments except #30; many titles said "NOT pushed / NOT live" for work already live.
- Owner-reported "Lens Lab not working"; not reproduced earlier.
- Known visual gaps from the 2026-11-23 report: Lens Lab look, Light Journey drawing, surgical cameras only audited, ICL plate, no device or gallery photos.
