# Mobile test environment (detected 2026-11-17)

| Item | Found |
|---|---|
| OS | Windows 11 Home 10.0.26200 |
| CPU | Intel Core i7-9750H, 12 logical processors, virtualization enabled in firmware |
| RAM | 32 GB |
| GPU | NVIDIA GeForce RTX 2060 + Intel UHD 630 |
| Disk C | 12 GB free at start (46 GB later) |
| Java | 1.8 only → Temurin JDK 17.0.21 added (portable, `C:\Users\sam20\tools`, from adoptium.net) |
| Android SDK | present (platform-tools 34, cmdline-tools); no emulator, no system image |
| Hypervisor | none installed; VBS off → AEHD driver needed (admin) |
| macOS / Xcode | not available |
| Device cloud | BrowserStack connector present, Free plan, 5 parallel sessions |

## Choice

1. Android: official Android Emulator with Chrome (OS SIMULATOR).
2. iPhone: real iPhone in BrowserStack (CLOUD REAL DEVICE) — iOS Simulator impossible on Windows.
3. Android real device: Pixel 8 in BrowserStack (CLOUD REAL DEVICE).
4. Branch build on iPhone engine: Playwright WebKit (BROWSER EMULATION, not Safari).

## Evidence classes used in every result

REAL DEVICE (none: no physical phone was connected) · OS SIMULATOR · BROWSER EMULATION · CLOUD REAL DEVICE · NOT TESTED.

## Safety notes

- Downloads only from official sources (Google SDK repository, Adoptium).
- Chrome first-run accepted on each virtual phone with the owner's approval, without an account, usage reporting off, notifications declined.
- Running the emulator together with many browser workers crashed the owner's laptop; do not combine them.
