# MODFORGE — App & Game Modding Hub

A responsive React + Tailwind interface for an app/game modding hub, pre-wired for a
future Capacitor Android build. Dark cyberpunk shell: `#0f1115` canvas, `#1a1d24`
surfaces, `#00ff66` neon accent, neon red for failures.

> **Sandbox prototype.** The catalog is fictional, the security scan and patch
> pipeline are timed simulations, and the download manager ships a JSON build
> receipt. No file is hashed or uploaded, no APK is decompiled, patched or signed,
> and no billing, license or antivirus service is contacted.

## Run it

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # static bundle in dist/
npm run preview
```

## Structure

```
modding-hub/
├── index.html
├── capacitor.config.json          # webDir: dist · appId com.modforge.hub
├── src/
│   ├── App.jsx                    # shell, hero, workflow state, toasts
│   ├── index.css                  # @theme tokens + utilities (grid, scanlines, glow)
│   ├── components/
│   │   ├── Marketplace.jsx        # search, platform/status filters, sort, cards
│   │   ├── PatchEngine.jsx        # dropzone + simulated terminal pipeline
│   │   └── DownloadManager.jsx    # staged builds, storage paths, receipt download
│   ├── data/mockApps.json         # 5 fictional target profiles + mod variables
│   └── lib/                       # cn, formatters, hashes, icon map
└── android/                       # Capacitor scaffold (Java)
    ├── build.gradle · settings.gradle · variables.gradle · gradle.properties
    └── app/
        ├── build.gradle · proguard-rules.pro
        └── src/main/
            ├── AndroidManifest.xml
            ├── java/com/modforge/hub/
            │   ├── MainActivity.java          # BridgeActivity host
            │   └── DownloadBridgePlugin.java  # writes receipts to Download/ModForge
            ├── res/values/{strings,styles}.xml
            └── res/xml/{file_paths,backup_rules,data_extraction_rules}.xml
```

## Components

**`Marketplace`** — `apps`, `selectedId`, `onSelect(app)`. Filters by
platform (All/Android/PC), status (ready/guarded), free-text query across title,
package, studio and tags, plus three sort modes. Cards expose the package name,
success rate meter, version, platform chips and mod tags.

**`PatchEngine`** — `target`, `onBuildComplete(build)`. Validates `.apk` / `.exe`
drops, then runs a **security scan phase** before any patch line is written: a
sweeping radar, an integrity progress bar and streamed checks (`Scanning file hash
against security database...`, `Heuristic analysis: 0/65 engines detected threats`,
`Signature verified: Safe & Clean`). The scanner card glows green with a shield
once the file is verified, and only then does `Inject patch` unlock the five-stage
pipeline (analyze → decompile → billing → inject → re-sign). Guarded targets stop
with an `ERR-409` state; local targets finish with `Build Successful!` and emit a
build object. Reset discards the container and its scan result.

**`DownloadManager`** — `builds`, `onToast`, `onClear`. Shows the storage root
(`/sdcard/Download/ModForge`), each artifact path, size, checksum and timestamp,
with copy-path and download actions.

## Catalog data

`src/data/mockApps.json` holds five profiles. Every entry carries:

```json
{
  "id": "neon-rift",
  "title": "Neon Rift",
  "package": "com.helixforge.neonrift",
  "platforms": ["Android", "PC"],
  "status": "ready",
  "is_secure": true,
  "antivirus_status": "Verified Clean",
  "successRate": 98,
  "tags": ["Full Premium Unlocked", "Ads Removed", "All Skins"],
  "modVariables": {
    "subscription": { "tier": "Rift Pass Elite", "monthlyPrice": 9.99, "sku": "..." },
    "currency": { "name": "Rift Crystals", "amount": 999999 },
    "hooks": [{ "className": "BillingProcessor", "method": "isSubscribed", "returnValue": "true" }],
    "removedEntitlements": ["rift.pass.elite"]
  }
}
```

Every profile also carries `"is_secure": true` and
`"antivirus_status": "Verified Clean"`, surfaced as a shield chip in the engine and
in the scan confirmation. `Aegis Arena` is the guarded profile used to exercise the
error path.

## Android scaffold

The manifest already declares `INTERNET`, `REQUEST_INSTALL_PACKAGES`,
`WRITE_EXTERNAL_STORAGE` (plus read + media permissions) and a `FileProvider` for
staged artifacts. `DownloadBridgePlugin` writes receipts through MediaStore on
Android 10+ and the legacy `Download/` directory below that.

To produce an APK, install the native packages and sync:

```bash
npm i @capacitor/core @capacitor/android @capacitor/cli @capacitor/app @capacitor/filesystem
npm run build
npx cap add android   # if starting from scratch
npx cap sync android
npm run android:open  # or: cd android && ./gradlew assembleDebug
```

Requires JDK 17 and the Android SDK (API 34). Gradle is not vendored here.

## Screens

Captured from the running build at 1440 px and 390 px:

| Desktop | Mobile |
| --- | --- |
| ![Catalog](screenshots/desktop-overview.png) | ![Catalog on mobile](screenshots/mobile-marketplace.png) |
| ![Verified clean](screenshots/desktop-verified-clean.png) | ![Scanner on mobile](screenshots/mobile-verified-clean.png) |
| ![ERR-409](screenshots/desktop-err409.png) | ![Engine complete](screenshots/mobile-engine-complete.png) |
| ![Downloads](screenshots/desktop-downloads.png) | ![Downloads on mobile](screenshots/mobile-downloads.png) |

`desktop-success.png` shows the completed pipeline and staged artifact side by side.

## Checks

```bash
npm run build
```

The bundle builds with the WASM Rollup fallback on Windows hosts where the native
binary is blocked by application-control policy.
