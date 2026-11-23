# iPhone Safari test setup

| Route | Status |
|---|---|
| A. macOS + Xcode iOS Simulator | NOT AVAILABLE (Windows 11 machine). Not claimed. |
| B. Cloud real device | USED: BrowserStack, real iPhone 15, iOS 26.6, Safari (session `5a5de0497c413c52012e2d1ee582688958f46fa4`, build "phase-2-baseline-production"). Owner approved free minutes. |
| C. Playwright WebKit | USED for the branch build: WebKit on Windows, iPhone user agent. BROWSER EMULATION, not Safari. |

## Why the branch was not re-tested on the real iPhone

Cloud devices can reach only public addresses. Reaching `localhost` needs BrowserStack Local with an access key, which the connector does not expose; deploying the branch needs the owner's authorization. So: the real iPhone found BUG-P2-01 and P2-02 on production; both were reproduced in WebKit/Chromium locally, fixed, and covered by tests.

## To finish (owner)

After a deployment is authorized, open on a real iPhone (or a new BrowserStack session): Lens Lab → Far → Night; 3D page → Start → stage 7 visible; open another site, press Back → same reading position.
