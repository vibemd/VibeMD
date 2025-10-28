# Build and Deploy Guide

**Application:** VibeMD
**Version:** 1.0.16
**Updated:** 2025-10-28
**License:** MIT © 2025 ONLY1 Pty Ltd

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Build Steps](#local-build-steps)
3. [Build Commands Reference](#build-commands-reference)
4. [Platform-Specific Instructions](#platform-specific-instructions)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Release Process](#release-process)
7. [Troubleshooting](#troubleshooting)
8. [Security & Code Signing](#security--code-signing)

---

## Prerequisites

### System Requirements

- **Node.js:** 20.x LTS
- **npm:** 10.x
- **Disk Space:** 2–5 GB (for dependencies and build artifacts)
- **RAM:** 4 GB minimum (8 GB recommended)

### Platform-Specific Tools

#### Windows
- **WiX Toolset 3.14+** — Required for MSI generation
  - Download: https://github.com/wixtoolset/wix3/releases
  - Pre-installed on GitHub-hosted `windows-latest` runners
- **Visual Studio Build Tools** — Optional, for native module compilation

#### macOS
- **Xcode Command Line Tools:**
  ```bash
  xcode-select --install
  ```
- **Homebrew:** For `dpkg` and `rpm` installation
  ```bash
  brew install dpkg rpm
  ```

#### Linux
- **DEB/RPM Tools** — Only needed if building locally on Linux
  ```bash
  # Ubuntu/Debian
  sudo apt-get install dpkg rpm

  # Fedora/RHEL
  sudo dnf install dpkg rpm
  ```

### GitHub Actions (CI/CD)

All platform builds run on GitHub-hosted runners:
- **Windows builds:** `windows-latest` (Windows Server with WiX pre-installed)
- **macOS builds:** `macos-latest` (includes Xcode and Homebrew)
- **Linux builds:** `macos-latest` (cross-compile using Homebrew tools)

---

## Local Build Steps

### 1. Install Dependencies

```bash
git clone https://github.com/vibemd/VibeMD.git
cd VibeMD
npm install
```

This installs:
- Electron and Electron Forge
- React, TypeScript, and build tools
- Development dependencies (ESLint, webpack, etc.)

### 2. Verify Installation

```bash
npm run lint
node scripts/run-smoke-tests.js
```

This ensures:
- Code passes linting checks
- TypeScript compiles without errors
- Bundle structure is valid

### 3. Run in Development Mode

```bash
npm start
```

Features:
- Hot module reloading (code changes appear instantly)
- Electron developer tools enabled
- Console shows debug messages

### 4. Build for Your Platform

Choose one of the platform-specific commands below. Building takes 5–15 minutes depending on your hardware.

---

## Build Commands Reference

### Build Current Platform Only

```bash
npm run make
```

Auto-detects your OS and builds appropriate installers.

### Build All Platforms

```bash
npm run build:all
```

Builds for Windows (x64, ARM64), macOS (arm64, x64), and Linux (x64). **Note:** macOS builds can only run on macOS; Linux builds must run on Linux; Windows builds on Windows.

### Platform-Specific Builds

#### Windows

```bash
# x64 architecture
npm run build:win-x64

# ARM64 architecture (Windows 11 on ARM)
npm run build:win-arm64

# Both architectures
npm run build:all-windows
```

**Outputs:**
- `VibeMD-1.0.16-x64.msi` (MSI installer)
- `VibeMD-win32-x64-1.0.16.zip` (Portable ZIP)
- `VibeMD-1.0.16-arm64.msi` (ARM installer)
- `VibeMD-win32-arm64-1.0.16.zip` (ARM portable)

#### macOS

```bash
# Apple Silicon (M1/M2/M3)
npm run build:mac-arm64

# Intel 64-bit
npm run build:mac-x64

# Both architectures
npm run build:all-mac
```

**Outputs:**
- `VibeMD-1.0.16-arm64.dmg` (DMG disk image)
- `VibeMD-darwin-arm64-1.0.16.zip` (ZIP archive)
- `VibeMD-1.0.16-x64.dmg` (Intel DMG)
- `VibeMD-darwin-x64-1.0.16.zip` (Intel ZIP)

#### Linux

```bash
# x64 (Ubuntu, Debian, Fedora, RHEL)
npm run build:linux-x64

# Outputs:
# vibemd_1.0.16_amd64.deb (Debian)
# vibemd-1.0.16-1.x86_64.rpm (RedHat)
```

### Cleaning Build Artifacts

```bash
npm run clean
```

Removes:
- `.webpack/` (Webpack output)
- `out/` (Electron Forge output)
- `releases/` (Previous release artifacts)

Use this before building if you encounter stale artifact issues.

---

## Platform-Specific Instructions

### Windows Build

**Prerequisites:**
- Windows 10/11
- WiX Toolset installed
- Node.js 20.x

**Steps:**

```bash
npm install
npm run build:all-windows
```

**Expected Output:**
```
out/
├── VibeMD-1.0.16-x64.msi
├── VibeMD-win32-x64-1.0.16.zip
├── VibeMD-1.0.16-arm64.msi
└── VibeMD-win32-arm64-1.0.16.zip
```

**Testing:**
1. Run the MSI: Double-click and follow installer prompts
2. Run the ZIP: Extract and run `VibeMD.exe`
3. Verify app starts and features work

### macOS Build

**Prerequisites:**
- macOS 10.15+
- Xcode Command Line Tools: `xcode-select --install`
- Homebrew: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
- DPK and RPM: `brew install dpkg rpm`

**Steps:**

```bash
npm install
npm run build:all-mac
```

**Expected Output:**
```
out/
├── VibeMD-1.0.16-arm64.dmg
├── VibeMD-darwin-arm64-1.0.16.zip
├── VibeMD-1.0.16-x64.dmg
└── VibeMD-darwin-x64-1.0.16.zip
```

**Testing DMG:**
1. Double-click the DMG to mount it
2. Drag `VibeMD.app` to the Applications folder
3. Launch from Applications
4. If prompted about "Unknown Developer," Control-click and select "Open"

**Testing ZIP:**
1. Extract the ZIP file
2. Right-click the app → "Open"

### Linux Build

**Prerequisites:**
- Ubuntu 20.04+ or equivalent distro
- Node.js 20.x
- Build tools: `sudo apt-get install build-essential`

**Steps:**

```bash
npm install
npm run build:linux-x64
```

**Expected Output:**
```
out/
├── vibemd_1.0.16_amd64.deb
└── vibemd-1.0.16-1.x86_64.rpm
```

**Testing DEB:**
```bash
sudo dpkg -i vibemd_1.0.16_amd64.deb
vibemd
```

**Testing RPM:**
```bash
sudo rpm -i vibemd-1.0.16-1.x86_64.rpm
vibemd
```

---

## CI/CD Pipeline

VibeMD uses GitHub Actions to automate builds across all platforms. Workflows are defined in `.github/workflows/`.

### Workflow Files

#### build-windows.yml
**Trigger:** Push to main, manual dispatch
**Runs on:** `windows-latest`
**Builds:** Windows x64 and ARM64 MSI/ZIP
**Duration:** ~10 minutes

```yaml
# Output artifacts:
# - VibeMD-1.0.16-x64.msi
# - VibeMD-win32-x64-1.0.16.zip
# - VibeMD-1.0.16-arm64.msi
# - VibeMD-win32-arm64-1.0.16.zip
# - manifest.json (with checksums and metadata)
```

#### build-macos.yml
**Trigger:** Push to main, manual dispatch
**Runs on:** `macos-latest`
**Builds:** macOS arm64 and x64 DMG/ZIP
**Duration:** ~15 minutes per architecture

```yaml
# Separate jobs for arm64 and x64
# Allows independent releases if one architecture fails
```

#### build-linux.yml
**Trigger:** Push to main, manual dispatch
**Runs on:** `macos-latest` (cross-compile)
**Builds:** Linux x64 DEB/RPM
**Duration:** ~12 minutes

```yaml
# Cross-compiles for Linux on macOS using Homebrew tools
# Output artifacts:
# - vibemd_1.0.16_amd64.deb
# - vibemd-1.0.16-1.x86_64.rpm
```

#### release-nightly.yml
**Trigger:** Daily at 00:00 UTC
**Runs on:** `ubuntu-latest`
**Actions:**
1. Detects new semantic version from tags
2. Downloads ready artifacts from build workflows
3. Creates GitHub release if version is new
4. Invokes documentation workflow

#### update-docs.yml
**Trigger:** Called by release-nightly.yml
**Runs on:** `ubuntu-latest`
**Actions:**
1. Regenerates README.md
2. Regenerates all docs/*.md files
3. Commits changes to main branch

### Artifact Management

Each build workflow produces:

**Manifest File** (`manifest.json`):
```json
{
  "version": "1.0.16",
  "platform": "windows",
  "architecture": "x64",
  "formats": ["msi", "zip"],
  "files": [
    {
      "name": "VibeMD-1.0.16-x64.msi",
      "size": 134217728,
      "sha256": "abc123...",
      "unsigned": true
    },
    {
      "name": "VibeMD-win32-x64-1.0.16.zip",
      "size": 128000000,
      "sha256": "def456...",
      "unsigned": true
    }
  ],
  "buildDate": "2025-10-28T18:30:00Z",
  "unsigned": true
}
```

Artifacts are uploaded to GitHub Actions run artifacts and staged in `releases/` directory structure:
```
releases/
├── windows/
│   ├── x64/
│   │   ├── VibeMD-1.0.16-x64.msi
│   │   └── VibeMD-win32-x64-1.0.16.zip
│   └── arm64/
│       ├── VibeMD-1.0.16-arm64.msi
│       └── VibeMD-win32-arm64-1.0.16.zip
├── macos/
│   ├── arm64/
│   │   ├── VibeMD-1.0.16-arm64.dmg
│   │   └── VibeMD-darwin-arm64-1.0.16.zip
│   └── x64/
│       ├── VibeMD-1.0.16-x64.dmg
│       └── VibeMD-darwin-x64-1.0.16.zip
└── linux/
    └── x64/
        ├── vibemd_1.0.16_amd64.deb
        └── vibemd-1.0.16-1.x86_64.rpm
```

---

## Release Process

### Manual Release (Recommended for Stable Releases)

1. **Bump Version:**
   ```bash
   # Edit package.json
   {
     "version": "1.0.16"  # ← Change version
   }
   ```

2. **Commit Version Bump:**
   ```bash
   git add package.json
   git commit -m "chore(release): bump version to v1.0.16"
   git push origin main
   ```

3. **Wait for Builds:**
   - GitHub Actions automatically builds for all platforms
   - Monitor: https://github.com/vibemd/VibeMD/actions
   - Each platform build takes 10–15 minutes

4. **Create Release:**
   ```bash
   # Option A: Via GitHub CLI
   gh release create v1.0.16 --generate-notes

   # Option B: Via GitHub Web UI
   # https://github.com/vibemd/VibeMD/releases → "Draft a new release"
   ```

5. **Add Release Assets:**
   - Attach all artifacts from `releases/` directory
   - Include checksums
   - Note if installers are unsigned

6. **Publish Release:**
   - Mark as "Latest Release" on GitHub
   - Announce on website and social media

### Nightly Release (Automated)

The `release-nightly.yml` workflow runs daily and:
1. Checks for new semantic version tags
2. Downloads ready artifacts
3. Auto-creates release if version is new
4. Regenerates documentation

**To trigger manually:**
```bash
gh workflow run release-nightly.yml
```

---

## Troubleshooting

### Build Fails with "WiX Toolset not found" (Windows)

**Solution:**
1. Download WiX v3.14+: https://github.com/wixtoolset/wix3/releases
2. Run installer and complete setup
3. Restart your terminal/IDE
4. Try build again

### Build Fails with "xcode-select" Error (macOS)

**Solution:**
```bash
xcode-select --install
```

If already installed:
```bash
xcode-select --reset
```

### Build Fails with "dpkg not found" (macOS)

**Solution:**
```bash
brew install dpkg rpm
```

### Bundle Size is Unexpectedly Large

**Investigation:**
```bash
# Analyze bundle
npm run build:win-x64
ls -lh out/
```

**Solutions:**
- Remove unused dependencies: `npm prune --production`
- Enable code splitting in webpack config
- Use tree-shaking to remove dead code

### App Crashes on Startup After Build

**Troubleshooting:**
1. Check console logs:
   - Windows: Look in `%APPDATA%\VibeMD\`
   - macOS: `~/Library/Application Support/VibeMD/`
   - Linux: `~/.config/VibeMD/`

2. Clear app cache:
   ```bash
   # Remove settings file (platform-specific location)
   ```

3. Rebuild from scratch:
   ```bash
   npm run clean
   npm install
   npm run build:all
   ```

### MSI Installation Fails on Windows

**Possible Causes:**
- WiX Toolset not installed
- Incompatible Windows version
- Missing MSVC redistributables

**Solution:**
```bash
# Verify WiX installation
wix --version

# Try ZIP version instead
# Extract VibeMD-win32-x64-1.0.16.zip and run VibeMD.exe
```

### Unsigned Installer Warning

This is **expected and normal**:
- Windows: "Unknown Publisher" — Click "More info" → "Run anyway"
- macOS: "Cannot verify developer" — Control-click → "Open Anyway"
- Linux: Package signature warning — Use `--force-overwrite` if needed

Code signing is planned for future releases.

---

## Security & Code Signing

### Current Status (v1.0.16)

All installers are **unsigned**. This means:
- ✅ App is safe (no malware or tracking)
- ⚠️ OS prompts users with security warnings
- ✅ Users can safely ignore warnings

### Future: Code Signing Setup

When certificates are obtained:

**Windows Code Signing:**
1. Obtain EV certificate from authorized CA (Sectigo, DigiCert, etc.)
2. Configure GitHub Actions secret: `WINDOWS_CERT_PATH` and `WINDOWS_CERT_PASSWORD`
3. Uncomment signing code in `forge.config.ts`

**macOS Code Signing:**
1. Enroll in Apple Developer Program ($99/year)
2. Create Developer ID certificate
3. Configure GitHub Actions environment:
   - `MAC_CODESIGN_IDENTITY`
   - `APPLE_ID`
   - `APPLE_ID_PASSWORD`
   - `APPLE_TEAM_ID`
4. Uncomment code signing in `forge.config.ts`
5. Configure notarization (Apple requirement for distribution)

**Implementation Steps:**
1. Update `forge.config.ts` with certificate paths
2. Add code signing scripts in `scripts/`
3. Configure GitHub Actions secrets in repository settings
4. Test signing locally before pushing
5. Update release notes to indicate signed status

### Signing Workflow (Future)

```yaml
# In fork.config.ts (pseudocode)
const config = {
  packagerConfig: {
    osxSign: {
      identity: process.env.MAC_CODESIGN_IDENTITY,
      hardened: true,
      gatekeeper: true,
    },
    certificateFile: process.env.WINDOWS_CERT_PATH,
    certificatePassword: process.env.WINDOWS_CERT_PASSWORD,
  }
}
```

---

**VibeMD is developed and maintained by ONLY1 Pty Ltd.**
**License:** MIT © 2025 ONLY1 Pty Ltd
