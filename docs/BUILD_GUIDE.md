# VibeMD Build Guide

Complete guide for building VibeMD for all supported platforms and architectures.

## Prerequisites

### All Platforms
- **Node.js** v18+ and npm
- **Git**

### For Windows Builds (from macOS)
**Note:** Windows .exe/.msi installers cannot be reliably created on macOS due to Wine compatibility issues on modern macOS (especially ARM64). The build will create ZIP archives instead.

For proper Windows installers (.exe/.msi):
- Build on a native Windows machine, or
- Use GitHub Actions with Windows runners (recommended)

## Supported Build Targets

### macOS
- **Apple Silicon** (arm64) - For M1/M2/M3/M4 Macs
- **Intel** (x64) - For older Intel Macs
- **Universal** (arm64 + x64) - Currently disabled due to code signature issues with Electron

### Windows
- **x64** - For Intel/AMD 64-bit systems (most common) - ZIP archives only
- **ARM64** - For Windows on ARM (Surface Pro X, etc.) - ZIP archives only
- **.exe/.msi installers** - Requires building on native Windows or using GitHub Actions

## Quick Start

### Build Everything
```bash
./build-all.sh
```

This creates:
- macOS Apple Silicon (arm64) ZIP archive
- macOS Intel (x64) ZIP archive
- Windows x64 portable ZIP
- Windows ARM64 portable ZIP

**Note:** macOS Universal builds are currently disabled due to code signature mismatches. Separate architecture builds are created instead.

### Build Specific Platforms

**macOS Apple Silicon** (Recommended for M-series Macs)
```bash
npm run build:mac-arm64
```

**macOS Apple Silicon only**
```bash
npm run build:mac-arm64
```

**macOS Intel only**
```bash
npm run build:mac-x64
```

**Windows x64**
```bash
npm run build:win-x64
```

**Windows ARM64**
```bash
npm run build:win-arm64
```

**All macOS variants**
```bash
npm run build:all-mac
```

**All Windows variants**
```bash
npm run build:all-windows
```

## Using the Build Script

The `build-all.sh` script provides more control and better output:

**Build everything**
```bash
./build-all.sh
```

**macOS only**
```bash
./build-all.sh --mac-only
```

**Windows only**
```bash
./build-all.sh --windows-only
```

**Separate architectures instead of universal**
```bash
./build-all.sh --no-universal
```

**Help**
```bash
./build-all.sh --help
```

## Build Output

All builds are created in the `out/` directory:

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
└── [intermediate build files]
```

**Note:** Windows .exe/.msi installers are not created when building on macOS. To create Windows installers, uncomment the `MakerSquirrel` configuration in `forge.config.ts` and build on a Windows machine or use GitHub Actions.

## Build Times (Approximate)

On Apple Silicon Mac:
- macOS arm64: ~2-3 minutes
- macOS x64: ~2-3 minutes
- Windows x64 (ZIP): ~3-4 minutes
- Windows ARM64 (ZIP): ~3-4 minutes
- **Total (all platforms)**: ~10-14 minutes

## Distribution

### macOS
- Provide both **arm64** and **x64** builds for maximum compatibility
- Users on Apple Silicon Macs use the arm64 build
- Users on Intel Macs use the x64 build
- ZIP archives can be extracted and run immediately
- No notarization required for personal use
- For App Store or notarized distribution, see [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)

### Windows
- **x64 ZIP** for most users (portable, no installation)
- **ARM64 ZIP** for Windows on ARM devices (portable, no installation)
- For .exe/.msi installers, build on Windows or use GitHub Actions

## Troubleshooting

### Build fails on Windows targets with Wine errors
Windows .exe/.msi installers require Wine on macOS, which has compatibility issues on modern macOS (especially ARM64). The build is configured to create ZIP archives instead. This is expected behavior.

**Solution:** Use ZIP archives for distribution, or build Windows installers on a Windows machine.

### "Out of disk space" error
Clean previous builds:
```bash
rm -rf out/
npm run build:all
```

### macOS Universal builds fail
Universal builds are currently disabled due to code signature mismatches between arm64 and x64 builds. This is a known Electron limitation. The build script automatically creates separate architecture builds instead.

## Development Builds

For development, use the standard npm scripts:

```bash
npm start              # Start dev server
npm run package        # Package without distribution
npm run make           # Create distributable for current platform
```

## Clean Builds

To ensure a clean build:

```bash
# Remove all build artifacts
rm -rf out/

# Remove node_modules and reinstall (nuclear option)
rm -rf node_modules/
npm install
npm run build:all
```

## Next Steps

- See [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for production deployment
- See [docs/BUILD.md](docs/BUILD.md) for detailed development setup
- See [docs/ARCHITECTURE_GUIDE.md](docs/ARCHITECTURE_GUIDE.md) for codebase architecture

## Questions?

For issues or questions, please file an issue at:
https://github.com/vibemd/VibeMD/issues
