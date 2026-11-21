# Skills, agents and tools actually used

## Used

| Tool | For |
|---|---|
| BrowserStack MCP connector (devicecontrol), Free plan | Real iPhone 15 Safari and real Pixel 8 Chrome sessions (owner approved using free minutes) |
| Android SDK: emulator 37.2.13, AEHD 2.2, platform-tools 37.0.1, Android 14 Play image | Android Emulator (owner installed the AEHD driver as administrator) |
| adb (input tap/swipe, keyevent, rotation, screencap, uiautomator) | OS-level touch, hardware Back, Home, rotation, device screenshots |
| Playwright over Chrome DevTools (connectOverCDP to Chrome on the AVD) | Reading page state on the emulator |
| Playwright (Chromium, WebKit) | Local reproduction, regression tests, performance profiles, WebGL link tracing |
| Trello MCP connector | Board update |
| `caveman:caveman` skill | Chat replies style (owner request) |
| `graphify` skill | Rebuilt the code knowledge graph (code only, owner's choice) |

## Not used

- Subagents: none. All work was done in one session (no parallel specialist agents).
- Xcode / iOS Simulator: not available on Windows.
- Appium: not needed (adb + DevTools covered the Android journeys).
- Claude Design, `12ui-design`, other UI skills: not invoked; no design work was in scope.

No skill result or agent participation is claimed beyond this list.
