# VibeMD Build Guide

Complete guide for building VibeMD for all supported platforms and architectures.

## Prerequisites

### All Platforms
- **Node.js** v18+ and npm
- **Git**

### For Windows Builds (from macOS)
- **Mono** - Required for creating Windows installers
  ```bash
  brew install mono
  ```
- **Wine** - Required for Windows installer creation
  ```bash
  brew install --cask wine-stable
  ```

## Supported Build Targets

### macOS
- **Universal** (arm64 + x64) - Single app that runs on both Apple Silicon and Intel Macs
- **Apple Silicon** (arm64) - For M1/M2/M3 Macs
- **Intel** (x64) - For older Intel Macs

### Windows
- **x64** - For Intel/AMD 64-bit systems (most common)
- **ARM64** - For Windows on ARM (Surface Pro X, etc.)

## Quick Start

### Build Everything
```bash
npm run build:all
```

This creates:
- macOS Universal build (runs on both Apple Silicon and Intel)
- Windows x64 installer and portable ZIP
- Windows ARM64 installer and portable ZIP

### Build Specific Platforms

**macOS Universal** (Recommended)
```bash
npm run build:mac-universal
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
│   ├── squirrel.windows/
│   │   ├── x64/
│   │   │   ├── VibeMD-Setup.exe      # Windows x64 installer
│   │   │   └── VibeMD-Setup.msi      # Windows x64 MSI
│   │   └── arm64/
│   │       ├── VibeMD-Setup.exe      # Windows ARM64 installer
│   │       └── VibeMD-Setup.msi      # Windows ARM64 MSI
│   └── zip/
│       ├── darwin/
│       │   └── universal/
│       │       └── VibeMD-darwin-universal-1.0.0.zip
│       └── win32/
│           ├── x64/
│           │   └── VibeMD-win32-x64-1.0.0.zip
│           └── arm64/
│               └── VibeMD-win32-arm64-1.0.0.zip
└── [intermediate build files]
```

## Build Times (Approximate)

On Apple Silicon Mac:
- macOS Universal: ~3-5 minutes
- Windows x64: ~4-6 minutes
- Windows ARM64: ~4-6 minutes
- **Total (all platforms)**: ~12-15 minutes

## Distribution

### macOS
- **Universal build** is recommended for distribution (supports both architectures)
- Users can download and run immediately
- No notarization required for personal use
- For App Store or notarized distribution, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

### Windows
- **x64 installer** (.exe or .msi) for most users
- **ARM64 installer** for Windows on ARM devices
- **ZIP packages** for portable/no-install usage

## Troubleshooting

### "Mono not found" error
```bash
brew install mono
export MONO_GAC_PREFIX="/opt/homebrew"
```

### "Wine not found" error
```bash
brew install --cask wine-stable
```

### Build fails on Windows targets
Ensure both Mono and Wine are installed and accessible:
```bash
mono --version
wine --version
```

### "Out of disk space" error
Clean previous builds:
```bash
rm -rf out/
npm run build:all
```

### Slow universal builds
Universal builds compile for both architectures, taking 2x time.
Use `--no-universal` for faster separate builds during development.

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

- See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for production deployment
- See [BUILD.md](BUILD.md) for detailed development setup
- See [ARCHITECTURE_GUIDE.md](ARCHITECTURE_GUIDE.md) for codebase architecture

## Questions?

For issues or questions, please file an issue at:
https://github.com/vibemd/VibeMD/issues
