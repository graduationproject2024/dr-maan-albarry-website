# Android Emulator setup (OS SIMULATOR)

## Installed

```
sdkmanager --install "emulator" "system-images;android-34;google_apis_playstore;x86_64"
sdkmanager --install "extras;google;Android_Emulator_Hypervisor_Driver"   # then, as Administrator: silent_install.bat
```
Emulator 37.2.13 · AEHD 2.2 · platform-tools 37.0.1 (the old adb 34 left the device "offline").

## Virtual devices

| AVD | Base | Screen | RAM | Viewport in Chrome | Purpose |
|---|---|---|---|---|---|
| `phase2_midrange` | pixel_4a, edited | 720×1600 @ 320 dpi | 2 GB | 360×652 (portrait), 732×256 (landscape) | mid-range, resource-limited |
| `phase2_highend` | pixel_7 | 1080×2400 @ 420 dpi | 4 GB | 412×783, 863×304 | high density, rotation, WebGL |

Android 14 (UE1A.230829.036.A4), Chrome 113.0.5672.136 (the image's own copy; updating needs a Google account, not done). WebGL2 through the host GPU ("Android Emulator OpenGL ES Translator (NVIDIA GeForce RTX 2060)"). `-gpu host`; the first mid-range boot hung and was restarted.

## Running the journeys

```
emulator -avd phase2_highend -no-snapshot -no-boot-anim -gpu host -port 5556
adb -s emulator-5556 reverse tcp:4174 tcp:4174
adb -s emulator-5556 forward tcp:9222 localabstract:chrome_devtools_remote
node tests/devices/android-emulator-journeys.mjs emulator-5556 <label>
```
Touch, Back, Home and rotation go through adb (the OS); page state is read through Chrome's DevTools socket. Never call `browser.close()` over CDP: it quits Chrome on the device.

## Problems met

- AEHD service disappeared once after install; reinstalled by the owner.
- `browser.close()` quit Chrome; an `am start` intent opened a second tab and the script attached to the hidden one; uiautomator sometimes returned a dump without the WebView. All fixed in the script.
- Emulator + parallel browser tests crashed the laptop (see `MOBILE_TEST_ENVIRONMENT.md`).
