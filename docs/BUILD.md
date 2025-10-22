# VibeMD Build Instructions

This document provides comprehensive instructions for building VibeMD for different platforms.

## Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher
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

# Platform-specific builds
npm run package -- --platform=win32 --arch=ia32    # Windows 32-bit
npm run package -- --platform=win32 --arch=x64     # Windows 64-bit
npm run package -- --platform=darwin --arch=x64    # macOS Intel
npm run package -- --platform=darwin --arch=arm64  # macOS Apple Silicon
npm run package -- --platform=linux --arch=x64     # Linux 64-bit
```

## Windows Builds

### Building on Windows

When building on a Windows machine:

```bash
# Install dependencies
npm install

# Build for Windows 32-bit (x86)
npm run make -- --platform=win32 --arch=ia32

# Build for Windows 64-bit (x64)
npm run make -- --platform=win32 --arch=x64
```

**Note:** When building on macOS, Windows .exe/.msi installers are disabled due to Wine compatibility issues on modern macOS (especially ARM64). The build will create ZIP archives instead.

This will create:
- `.zip` archive (portable package)

Output location: `out/make/zip/win32/`

For proper Windows installers (.exe/.msi):
- Build on a native Windows machine, or
- Use GitHub Actions with Windows runners (recommended)
- Uncomment `MakerSquirrel` in `forge.config.ts` when building on Windows

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
npm install

# Build for current architecture
npm run make

# Or specify architecture
npm run make -- --platform=darwin --arch=x64     # Intel
npm run make -- --platform=darwin --arch=arm64   # Apple Silicon
```

This will create:
- `.app` bundle
- `.zip` archive

**Note:** macOS Universal builds (arm64 + x64) are currently disabled due to code signature mismatches. Use separate architecture builds instead.

Output location: `out/make/zip/darwin/`

### Code Signing (macOS)

For distribution, you'll need to sign the app:

```bash
# Set your Apple Developer ID
export APPLE_ID="your@email.com"
export APPLE_ID_PASSWORD="app-specific-password"

# Build with signing
npm run make
```

Add to `forge.config.ts`:
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

### Windows Build on macOS Shows Wine Errors

**Issue**: Wine compatibility issues on modern macOS (especially ARM64)

**Solution**: This is expected. The build is configured to create ZIP archives instead of .exe/.msi installers. For proper Windows installers, build on a Windows machine or use GitHub Actions.

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

- **Installer**: `VibeMD-1.0.0 Setup.exe` (Squirrel installer)
- **Portable**: Extract ZIP to any folder and run `VibeMD.exe`

### macOS

- **DMG**: Drag VibeMD.app to Applications folder
- **ZIP**: Extract and copy to Applications folder

### Linux

- **DEB**: `sudo dpkg -i vibemd_1.0.0_amd64.deb`
- **RPM**: `sudo rpm -i vibemd-1.0.0-1.x86_64.rpm`

## Continuous Integration

For automated builds, see example GitHub Actions workflow:

```yaml
name: Build
on: [push]
jobs:
  build:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run make
      - uses: actions/upload-artifact@v2
        with:
          name: VibeMD-${{ matrix.os }}
          path: out/make/**/*
```

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

## Version Updates

To release a new version:

1. Update `version` in `package.json`
2. Update `README.md` if needed
3. Reset settings for clean deployment (see above)
4. Build for all platforms
5. Create GitHub release with built artifacts
6. Tag the release: `git tag v1.0.1`

## Support

For build issues, check:
- [Electron Forge Documentation](https://www.electronforge.io/)
- [Electron Documentation](https://www.electronjs.org/docs/latest)
- Project Issues: GitHub repository

## License

MIT License - See LICENSE file for details
