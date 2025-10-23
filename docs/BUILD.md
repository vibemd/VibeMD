# VibeMD Build Instructions

This document provides comprehensive instructions for building VibeMD for different platforms.

## Prerequisites

- Node.js 20.x
- npm 10.x
- Platform-specific requirements (see below)

## Icon Files

The project includes properly formatted icon files in `build/icons/`:
- `icon.svg` - Source SVG icon
- `icon.ico` - Windows icon (256x256, 128x128, 96x96, 64x64, 48x48, 32x32, 16x16)
- `icon.png` - macOS/Linux icon (512x512)
- `icon@2x.png` - macOS retina icon (1024x1024)
- `icon.icns` - macOS icon set

## Application Branding

The application is configured with the following branding:
- **Product Name**: VibeMD
- **Executable Name**: VibeMD (NOT "Electron")
- **Company**: ONLY1 Pty Ltd
- **Description**: VibeMD - Modern Markdown Editor
- **Bundle ID**: com.vibemd.app

All builds will show "VibeMD" as the application name, not "Electron".

## Build Commands

### Quick Reference

```bash
# Development
npm start                    # Start in development mode
npm run start:clean          # Clean start (via vibemd.sh)

# Building
npm run package              # Package for current platform
npm run make                 # Create distributable for current platform

# Platform-specific builds (local)
npm run build:win-x64       # Windows 64-bit (ZIP, EXE/MSI on Windows only)
npm run build:win-arm64     # Windows ARM64 (ZIP, EXE/MSI on Windows only)
npm run build:mac-x64       # macOS Intel (ZIP)
npm run build:mac-arm64     # macOS Apple Silicon (ZIP)
npm run build:linux-x64     # Linux x64 (DEB, RPM)
```

## Windows Builds

### Building on Windows

When building on a Windows machine:

```bash
# Install dependencies
npm install --no-audit --no-fund

# Build for Windows 64-bit (x64)
npm run build:win-x64

# Build for Windows ARM64
npm run build:win-arm64
```

Notes:
- Windows MSI (WiX) is produced on Windows only (EXE builds are disabled).
- On non-Windows hosts, Windows ZIPs can be produced; installers are skipped.
- Output locations under `out/make/` follow Electron Forge conventions (e.g., `zip/win32/x64`, `wix/x64`, `squirrel.windows/x64`).

### Alternative: Package Only (Without Installer)

If you just need the packaged application without creating an installer:

```bash
npm run package -- --platform=win32 --arch=ia32
```

Then manually create a ZIP file from the output directory.

## macOS Builds

### Building on macOS

```bash
# Install dependencies
npm install --no-audit --no-fund

# Build for current architecture
npm run make

# Or specify architecture
npm run make -- --platform=darwin --arch=x64     # Intel
npm run make -- --platform=darwin --arch=arm64   # Apple Silicon
```

This will create:
- `.app` bundle
- `.zip` archive
- `.dmg` installer (when MakerDMG is enabled)

Note: Universal builds are not currently configured. Build per-arch ZIPs instead.

Output location: `out/make/zip/darwin/`

### Code Signing & Notarization

macOS signing and notarization and Windows code signing are enabled automatically in CI if secrets are present. For local builds, provide environment variables as needed:

macOS (signing + notarization): `MAC_CODESIGN_IDENTITY`, `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, `APPLE_TEAM_ID`

Windows (code signing): `WINDOWS_CERT_BASE64`, `WINDOWS_CERT_PASSWORD`
```typescript
osxSign: {
  identity: 'Developer ID Application: Your Name (TEAM_ID)',
  'hardened-runtime': true,
  entitlements: 'entitlements.plist',
  'entitlements-inherit': 'entitlements.plist',
  'signature-flags': 'library'
},
osxNotarize: {
  appBundleId: 'com.vibemd.app',
  appleId: process.env.APPLE_ID,
  appleIdPassword: process.env.APPLE_ID_PASSWORD,
}
```

## Linux Builds

### Building on Linux

```bash
# Install dependencies
npm install

# Build DEB package (Debian/Ubuntu)
npm run make -- --platform=linux --arch=x64

# The config includes both DEB and RPM makers
```

This will create:
- `.deb` package (Debian/Ubuntu)
- `.rpm` package (Fedora/RHEL)

Output location: `out/make/`

### Building on macOS/Windows for Linux

Linux packages (.deb/.rpm) can be built on any platform:

```bash
npm run make -- --platform=linux --arch=x64
```

**Note:** The current build configuration focuses on macOS and Windows. Linux makers are configured but not part of the standard build process.

## Build Output Structure

### After `npm run package` (Package Only)

```
out/
└── VibeMD-win32-ia32/          # Windows x86 build
    ├── VibeMD.exe              # Main executable (173MB)
    ├── resources/
    │   └── app.asar            # Application code
    ├── locales/                # Language files
    ├── icudtl.dat              # ICU data (10MB)
    ├── *.dll                   # Required DLLs
    └── *.pak                   # Chrome resource files
```

**Note**: The ICU error when trying to run VibeMD.exe on macOS is expected. The .exe can only run on Windows.

### After `npm run make` (With Distributables)

```
out/
├── make/
│   └── zip/
│       ├── darwin/
│       │   ├── arm64/
│       │   │   └── VibeMD-darwin-arm64-1.0.0.zip
│       │   └── x64/
│       │       └── VibeMD-darwin-x64-1.0.0.zip
│       └── win32/
│           ├── x64/
│           │   └── VibeMD-win32-x64-1.0.0.zip
│           └── arm64/
│               └── VibeMD-win32-arm64-1.0.0.zip
└── VibeMD-{platform}-{arch}/
    └── [Application files]
```

**Note:** Windows .exe/.msi installers are disabled when building on macOS. To create them, uncomment `MakerSquirrel` in `forge.config.ts` and build on Windows.

### Distribution Package

ZIP archives are automatically created for all platforms during the build process. Users can extract and run the application without installation.

## Configuration Files

### forge.config.ts

Main configuration for Electron Forge:
- Packager options (name, executable, icon)
- Windows metadata (company, description, etc.)
- Makers (Squirrel, ZIP, DEB, RPM)
- Plugins (Webpack, Auto-unpack natives, Fuses)

### package.json

Contains:
- `productName`: "VibeMD"
- `name`: "vibemd"
- `version`: "1.0.0"
- Build scripts and dependencies

## Troubleshooting

### Windows installers on non-Windows hosts

Expected: installers are only built on Windows runners. Use GitHub Actions (Windows) to produce MSI.

### Icon Not Showing

**Issue**: Application shows default Electron icon

**Solution**: Ensure `build/icons/icon.ico` (Windows) or `build/icons/icon.icns` (macOS) exists and is referenced correctly in `forge.config.ts`

### "Electron" Instead of "VibeMD"

**Issue**: Application shows as "Electron" instead of "VibeMD"

**Solution**: Verify these settings in `forge.config.ts`:
```typescript
packagerConfig: {
  name: 'VibeMD',
  executableName: 'VibeMD',
  win32metadata: {
    ProductName: 'VibeMD',
    InternalName: 'VibeMD'
  }
}
```

### Build Fails with Native Dependencies

**Error**: Native module compilation fails

**Solution**: Rebuild native modules for target platform:
```bash
npm run package -- --platform=win32 --arch=ia32
```

## Distribution

### Windows

- Installer (MSI): `VibeMD-win32-{arch}-{version}.msi`
  - Creates a Start Menu shortcut for VibeMD (no Desktop shortcut)
- Portable ZIP: `VibeMD-win32-{arch}-{version}.zip`

### macOS

- ZIP: `VibeMD-darwin-{arch}-{version}.zip`

### Linux

- DEB: `vibemd_{version}_amd64.deb`
- RPM: `vibemd-{version}-x86_64.rpm`

## Continuous Integration

For automated builds and releases, use these workflows:

- `release.yml` – determines next available version, updates docs and package.json, builds selected platforms (via inputs), and creates a GitHub Release with standardized assets.
- `build-windows-all.yml` – runs Windows x64 + ARM64 reusable workflows.
- `build-macos-linux-all.yml` – runs macOS x64 + arm64 and Linux DEB/RPM builds.

Release inputs (platform toggles):
- `build_macos` (default true): macOS ZIP + DMG
- `build_windows` (default true): Windows ZIP + EXE + MSI
- `build_linux` (default true): Linux DEB + RPM

Windows build jobs are reusable workflows referenced via `uses: vibemd/VibeMD/.github/workflows/...@main`.

## Pre-Build Preparation

### Settings Reset for Clean Deployment

Before building for deployment, ensure settings are reset to allow automatic path initialization:

```bash
# Run the settings reset script
./scripts/reset-settings.sh
```

This removes the local settings file so that:
- Users get automatic OS-appropriate default paths on first launch
- defaultSavePath is set to user's Documents folder
- templatesLocation is set to Documents/VibeMD/Templates

**Important**: The application is designed to auto-initialize paths on first run. No settings file should be included in the build.

See [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for comprehensive deployment information.

## Versioning & Releases

Releases are managed by `release.yml` and are immutable:

- Provide a version input or allow the workflow to pick the next patch version.
- The workflow bumps `package.json`, updates docs' Version labels, builds all platforms, and creates a Release with consistently named assets.
- If a tag already exists as a Release, the workflow bumps the patch until it finds an available tag.

## Support

For build issues, check:
- [Electron Forge Documentation](https://www.electronforge.io/)
- [Electron Documentation](https://www.electronjs.org/docs/latest)
- Project Issues: GitHub repository

## License

MIT License - See LICENSE file for details
