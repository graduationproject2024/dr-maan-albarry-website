# Anatomy annotation visibility

- **Procedure simulators:** labels start **hidden**.
  - A text button reads «إظهار التفاصيل» / "Show details" and switches to «إخفاء التفاصيل» / "Hide details".
  - Stage explanations stay in the side panel.
  - API: `showDetails(on)` and `getState().details`.
- **Cataract simulator:** labels were already off by default.
- **Tested on ICL:** 0 labels at start, and more than 0 after the button is pressed.
