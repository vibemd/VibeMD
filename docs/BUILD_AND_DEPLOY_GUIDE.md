# VibeMD Build and Deploy Guide

**Application:** VibeMD
**Version:** 1.0.11
**Release Date:** 2025-10-26
**License:** MIT

## Overview

This guide provides comprehensive instructions for building and deploying VibeMD across all supported platforms. VibeMD uses Electron Forge with Webpack for bundling and platform-specific makers for creating installers.

## Prerequisites

### Required Software

**All Platforms:**
- **Node.js:** Version 20.x or higher
- **npm:** Version 10.x or higher (comes with Node.js)
- **Git:** For cloning the repository

**Platform-Specific Requirements:**

**macOS (for macOS builds):**
- **Xcode Command Line Tools:** `xcode-select --install`
- **Homebrew:** Package manager for additional tooling
- **dpkg:** `brew install dpkg` (required for Linux DEB builds on macOS)
- **rpm:** `brew install rpm` (required for Linux RPM builds on macOS)

**Windows (for Windows builds):**
- **WiX Toolset v3:** For MSI installer creation
  - Download from https://wixtoolset.org/
  - GitHub Actions runners have this pre-installed
- **Visual Studio Build Tools:** For native module compilation (if needed)

**Linux (for Linux builds):**
- **Build essentials:** `sudo apt-get install build-essential` (Debian/Ubuntu)
- **rpm-build:** `sudo apt-get install rpm` (for RPM packages)
- **Note:** Linux builds are typically performed on macOS runners in CI using Homebrew

### Environment Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ONLY1-Group/VibeMD.git
   cd VibeMD
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Verify installation:**
   ```bash
   npm run lint
   ```

## Development Workflow

### Running Locally

**Start the development server:**
```bash
npm start
```

This command:
- Starts Electron Forge in development mode
- Enables hot module reloading (HMR) for renderer process
- Opens DevTools automatically
- Watches for file changes and rebuilds

**Alternative development commands:**
```bash
npm run start:clean    # Clean start with fresh state
npm run restart        # Restart the development server
npm run stop          # Stop running development server
npm run status        # Check development server status
npm run logs          # View development server logs
```

### Code Quality

**Run ESLint:**
```bash
npm run lint
```

**Run smoke tests:**
```bash
node scripts/run-smoke-tests.js
```

Smoke tests verify:
- All TypeScript files pass ESLint
- Webpack builds complete without errors
- Main, renderer, and preload bundles are generated
- No critical compilation issues

## Building for Production

### Build Commands by Platform

VibeMD provides platform-specific build commands that handle cleaning, building, and staging artifacts:

**macOS Builds:**
```bash
# Apple Silicon (M1/M2/M3)
npm run build:mac-arm64

# Intel processors
npm run build:mac-x64

# Build both architectures
npm run build:all-mac
```

**Windows Builds:**
```bash
# x64 architecture (most common)
npm run build:win-x64

# ARM64 architecture (Surface Pro X, etc.)
npm run build:win-arm64

# Build both architectures
npm run build:all-windows
```

**Linux Builds:**
```bash
# x64 architecture
npm run build:linux-x64

# ARM64 architecture (future support)
npm run build:linux-arm64

# Build all Linux architectures
npm run build:all-linux
```

**Build All Platforms:**
```bash
npm run build:all
```
*Note: This builds macOS arm64, macOS x64, Windows x64, Windows ARM64, and Linux x64. Requires platform-specific tooling.*

### Build Process Details

Each build command executes three steps:

1. **Clean Build Output:**
   ```bash
   node scripts/clean-build-output.js --platform <platform> --arch <arch>
   ```
   - Removes previous build artifacts for the target platform/architecture
   - Cleans `.webpack/` and `out/` directories
   - Prevents stale artifact contamination

2. **Make Installers:**
   ```bash
   electron-forge make --platform=<platform> --arch=<arch>
   ```
   - Bundles application with Webpack
   - Packages with Electron Forge
   - Generates platform-specific installers
   - Output location: `out/make/`

3. **Stage Release Assets:**
   ```bash
   node scripts/stage-release-assets.js --platform <platform> --arch <arch> --types <types>
   ```
   - Copies installers to `release-staging/` directory
   - Generates `manifest.json` with metadata:
     - Version number
     - Platform and architecture
     - File paths and checksums (SHA256)
     - Unsigned status flag
   - Prepares artifacts for GitHub release

### Build Outputs by Platform

**macOS:**
- **DMG:** Disk image with drag-to-Applications installation
  - Location: `out/make/VibeMD-<version>-arm64.dmg` or `-x64.dmg`
  - Custom background and layout
- **ZIP:** Portable application bundle
  - Location: `out/make/zip/darwin/<arch>/VibeMD-darwin-<arch>-<version>.zip`
  - Extract and run `VibeMD.app`

**Windows:**
- **MSI:** Windows Installer package (recommended)
  - Location: `out/make/wix/x64/VibeMD-<version>.msi`
  - Standard Windows installation experience
  - Created with WiX Toolset
- **ZIP:** Portable executable
  - Location: `out/make/zip/win32/<arch>/VibeMD-win32-<arch>-<version>.zip`
  - Extract and run `VibeMD.exe`

**Linux:**
- **DEB:** Debian/Ubuntu package
  - Location: `out/make/deb/x64/vibemd_<version>_amd64.deb`
  - Install with `sudo dpkg -i`
- **RPM:** RedHat/Fedora package
  - Location: `out/make/rpm/x64/vibemd-<version>.x86_64.rpm`
  - Install with `sudo rpm -i`

## CI/CD Pipeline

VibeMD uses GitHub Actions for automated building and releasing across all platforms.

### Workflow Architecture

The CI/CD pipeline consists of six workflows:

#### 1. Build Windows ([.github/workflows/build-windows.yml](../.github/workflows/build-windows.yml))

**Triggers:**
- Push to `main` branch
- Pull requests
- Manual dispatch

**Runners:** `windows-latest`

**Process:**
1. Checkout repository
2. Setup Node.js 20.x
3. Install dependencies with npm
4. Build for Windows x64 and ARM64
5. Generate manifests with version, checksums, and unsigned status
6. Upload artifacts to GitHub Actions
   - Artifact name: `build-windows-<arch>-v<version>`
   - Contents: Installers (MSI, ZIP) + manifest.json

**Outputs:**
- `VibeMD-<version>-x64.msi`
- `VibeMD-win32-x64-<version>.zip`
- `VibeMD-<version>-arm64.msi`
- `VibeMD-win32-arm64-<version>.zip`
- `manifest.json` for each architecture

#### 2. Build macOS ([.github/workflows/build-macos.yml](../.github/workflows/build-macos.yml))

**Triggers:**
- Push to `main` branch
- Pull requests
- Manual dispatch

**Runners:** `macos-latest`

**Process:**
1. Separate jobs for arm64 and x64 architectures
2. Each job:
   - Checks out repository
   - Sets up Node.js 20.x
   - Installs dependencies
   - Builds platform-specific installers
   - Generates manifest
   - Uploads artifacts
3. Architectures can release independently

**Outputs:**
- `VibeMD-<version>-arm64.dmg`
- `VibeMD-darwin-arm64-<version>.zip`
- `VibeMD-<version>-x64.dmg`
- `VibeMD-darwin-x64-<version>.zip`
- `manifest.json` for each architecture

**Special Considerations:**
- Code signing prepared but not yet enabled (requires certificate)
- Notarization placeholder for future implementation

#### 3. Build Linux ([.github/workflows/build-linux.yml](../.github/workflows/build-linux.yml))

**Triggers:**
- Push to `main` branch
- Pull requests
- Manual dispatch

**Runners:** `macos-latest` (cross-compilation approach)

**Process:**
1. Checkout repository
2. Setup Node.js 20.x
3. Install Homebrew packaging tools:
   - `brew install dpkg` (for DEB packages)
   - `brew install rpm` (for RPM packages)
4. Build Linux x64 installers
5. Generate manifest
6. Upload artifacts

**Outputs:**
- `vibemd_<version>_amd64.deb`
- `vibemd-<version>.x86_64.rpm`
- `manifest.json`

**Why macOS Runners:**
Electron Forge's Linux makers work reliably on macOS with Homebrew-installed tooling, providing consistent builds without requiring a Linux CI environment.

#### 4. Release Nightly ([.github/workflows/release-nightly.yml](../.github/workflows/release-nightly.yml))

**Triggers:**
- Scheduled: Nightly at 2:00 AM UTC
- Manual dispatch with version input

**Process:**
1. **Version Detection:**
   - Reads version from `package.json`
   - Checks if version already has a GitHub release
   - Exits early if already released

2. **Artifact Discovery:**
   - Queries GitHub Actions API for build artifacts
   - Filters artifacts matching current version
   - Downloads all matching artifacts:
     - `build-windows-x64-v<version>`
     - `build-windows-arm64-v<version>`
     - `build-macos-arm64-v<version>`
     - `build-macos-x64-v<version>`
     - `build-linux-x64-v<version>`

3. **Manifest Validation:**
   - Verifies manifest.json for each platform/architecture
   - Confirms version numbers match
   - Validates file checksums
   - Checks unsigned status

4. **Release Creation:**
   - Creates GitHub release with tag `v<version>`
   - Generates release notes from RELEASE_NOTES.md
   - Uploads all installer files
   - Marks as prerelease if version contains `-beta` or `-rc`
   - Includes security warning about unsigned installers

5. **Documentation Update:**
   - Triggers `update-docs.yml` workflow
   - Passes version and release date as parameters

**Partial Releases:**
The workflow supports partial releases. If only some platform artifacts are ready (e.g., macOS but not Windows), it will release the available platforms and can be re-run later to add remaining platforms.

#### 5. Update Documentation ([.github/workflows/update-docs.yml](../.github/workflows/update-docs.yml))

**Triggers:**
- Called by `release-nightly.yml` after successful release
- Manual dispatch with version and date inputs

**Process:**
1. Checkout repository
2. Update all documentation files with new version and date:
   - `README.md`
   - `docs/USER_GUIDE.md`
   - `docs/ARCHITECTURE_GUIDE.md`
   - `docs/BUILD_AND_DEPLOY_GUIDE.md`
   - `docs/BUILD_STRATEGY.md`
   - `docs/RELEASE_NOTES.md`
3. Commit changes to `main` branch
4. Push updates

**Note:** This workflow is automated. Manual documentation updates should be done outside this workflow to prevent conflicts.

#### 6. GitHub Pages ([.github/workflows/pages.yml](../.github/workflows/pages.yml))

**Triggers:**
- Push to `main` branch (after documentation updates)

**Process:**
1. Builds static site from documentation
2. Deploys to GitHub Pages
3. Makes documentation accessible at project URL

### Artifact Management

**Artifact Naming Convention:**
```
build-<platform>-<arch>-v<version>
```

Examples:
- `build-windows-x64-v1.0.11`
- `build-macos-arm64-v1.0.11`
- `build-linux-x64-v1.0.11`

**Manifest Structure:**
```json
{
  "version": "1.0.11",
  "platform": "windows",
  "architecture": "x64",
  "buildDate": "2025-10-26T12:00:00Z",
  "formats": ["msi", "zip"],
  "files": [
    {
      "name": "VibeMD-1.0.11-x64.msi",
      "path": "release-staging/windows/x64/VibeMD-1.0.11-x64.msi",
      "size": 85123456,
      "checksum": "sha256:abcd1234..."
    }
  ],
  "unsigned": true
}
```

**Artifact Retention:**
- GitHub Actions artifacts: 90 days default
- Release assets: Permanent (hosted on GitHub Releases)

## Local Release Process

For maintainers creating releases from local machines:

### 1. Version Bump

Update version in `package.json`:
```bash
npm version patch  # 1.0.11 -> 1.0.12
npm version minor  # 1.0.11 -> 1.1.0
npm version major  # 1.0.11 -> 2.0.0
```

Or manually edit `package.json`:
```json
{
  "version": "1.0.12"
}
```

### 2. Update Release Notes

Edit `docs/RELEASE_NOTES.md` with changelog:
```markdown
## v1.0.12 — 2025-10-27

- Feature: Added export to PDF
- Fix: Resolved table cell merging issue
- Improvement: Faster template loading

> ⚠️ **Security notice**
> Installers remain unsigned...
```

### 3. Commit Version Changes

```bash
git add package.json docs/RELEASE_NOTES.md
git commit -m "chore: bump version to 1.0.12"
git push origin main
```

### 4. Let CI Build

GitHub Actions workflows automatically:
- Build all platforms
- Run smoke tests
- Upload artifacts
- Create release (nightly workflow)
- Update documentation

### 5. Verify Release

1. Check GitHub Actions for successful builds
2. Download artifacts and test installers
3. Verify release notes and download links
4. Test installation on target platforms

## Code Signing (Future)

Currently, all VibeMD installers are **unsigned**. This section documents the planned code signing implementation.

### macOS Code Signing

**Requirements:**
- Apple Developer account ($99/year)
- Developer ID Application certificate
- Developer ID Installer certificate

**Process:**
1. Generate certificates in Apple Developer portal
2. Download and install in Keychain
3. Set environment variables in CI:
   ```bash
   APPLE_ID=developer@example.com
   APPLE_PASSWORD=app-specific-password
   APPLE_TEAM_ID=ABC123DEF4
   CSC_LINK=path/to/certificate.p12
   CSC_KEY_PASSWORD=certificate_password
   ```
4. Enable signing in `forge.config.ts`:
   ```typescript
   osxSign: {
     identity: 'Developer ID Application: Your Name (TEAMID)',
     'hardened-runtime': true,
     entitlements: 'entitlements.plist',
     'entitlements-inherit': 'entitlements.plist',
     'signature-flags': 'library'
   },
   osxNotarize: {
     appleId: process.env.APPLE_ID,
     appleIdPassword: process.env.APPLE_PASSWORD,
     teamId: process.env.APPLE_TEAM_ID
   }
   ```

### Windows Code Signing

**Requirements:**
- Code signing certificate from trusted CA (Sectigo, DigiCert, etc.)
- Certificate can be file-based (.pfx) or hardware token

**Process:**
1. Obtain certificate from Certificate Authority
2. Set environment variables in CI:
   ```bash
   WINDOWS_CERTIFICATE_FILE=path/to/cert.pfx
   WINDOWS_CERTIFICATE_PASSWORD=password
   ```
3. Enable signing in build workflow:
   ```yaml
   - name: Sign Windows binaries
     run: |
       signtool sign /f $CERT_FILE /p $CERT_PASSWORD /tr http://timestamp.digicert.com /td sha256 /fd sha256 out/make/**/*.exe
   ```

### Linux Signing

Linux packages can be signed but it's optional for most distributions:

**DEB Signing:**
```bash
dpkg-sig --sign builder vibemd_1.0.11_amd64.deb
```

**RPM Signing:**
```bash
rpm --addsign vibemd-1.0.11.x86_64.rpm
```

## Troubleshooting

### Common Build Issues

**Error: "electron-forge command not found"**
- Solution: Run `npm install` to install dependencies

**Error: "Make target not found"**
- Solution: Check `forge.config.ts` makers configuration
- Verify platform-specific tooling is installed

**Error: "EPERM: operation not permitted"**
- Solution: Close VibeMD if running, clear `out/` and `.webpack/` directories
- On Windows: Disable antivirus temporarily

**Error: "WiX Toolset not found" (Windows)**
- Solution: Install WiX Toolset v3 from https://wixtoolset.org/
- Add WiX to PATH: `C:\Program Files (x86)\WiX Toolset v3.11\bin`

**Error: "dpkg or rpm not found" (macOS Linux builds)**
- Solution: Install Homebrew tools:
  ```bash
  brew install dpkg rpm
  ```

**Error: "Code signing failed"**
- Solution: Verify certificates are valid and not expired
- Check environment variables are set correctly
- Ensure certificate password is correct

### Build Performance

**Slow Webpack builds:**
- Clear Webpack cache: `rm -rf .webpack/`
- Reduce worker count if memory constrained
- Disable source maps in production builds

**Large bundle sizes:**
- Review dependencies: `npm ls`
- Use bundle analyzer (future enhancement)
- Verify tree shaking is working

### Platform-Specific Issues

**macOS:**
- If DMG creation fails, check disk space
- If app won't open, run: `xattr -cr VibeMD.app`

**Windows:**
- MSI build requires WiX v3 specifically (not v4)
- If installer fails, run as administrator

**Linux:**
- DEB/RPM builds require specific directory structure
- Check for permission errors in packaging scripts

## Testing Releases

### Manual Testing Checklist

Before releasing, test the following on each platform:

**Installation:**
- [ ] Installer launches without errors
- [ ] Application installs to correct location
- [ ] File associations are registered
- [ ] Application appears in Start Menu/Applications folder

**Core Functionality:**
- [ ] Application launches successfully
- [ ] Create new document
- [ ] Open existing markdown file
- [ ] Save document (new and existing)
- [ ] All formatting tools work (bold, italic, lists, etc.)
- [ ] Tables can be created and edited
- [ ] Math formulas render correctly
- [ ] Templates load and create documents

**Settings:**
- [ ] Settings dialog opens
- [ ] Theme switching works
- [ ] Auto-save functions correctly
- [ ] File paths can be configured

**Performance:**
- [ ] Application launches in < 3 seconds
- [ ] Typing is responsive (no lag)
- [ ] Large documents (>10,000 words) load and edit smoothly
- [ ] Memory usage is reasonable (< 300MB idle)

**Upgrade Testing:**
- [ ] Install previous version
- [ ] Create and save documents
- [ ] Install new version over old
- [ ] Verify documents still load correctly
- [ ] Check settings are preserved

## Release Checklist

Before creating a new release:

1. [ ] Update version in `package.json`
2. [ ] Update `RELEASE_NOTES.md` with changelog
3. [ ] Run `npm run lint` successfully
4. [ ] Run smoke tests successfully
5. [ ] Test locally with `npm start`
6. [ ] Commit version bump to `main`
7. [ ] Wait for CI builds to complete
8. [ ] Download and test artifacts from each platform
9. [ ] Verify GitHub release created automatically
10. [ ] Verify documentation updated
11. [ ] Announce release (website, social media, etc.)

## Security Considerations

### Current Security Posture

**Unsigned Installers:**
- All installers are currently unsigned
- Users will see OS security warnings
- Installation requires explicit user approval

**Communication:**
- Clearly document unsigned status in release notes
- Provide instructions for bypassing security warnings
- Explain that signing will be implemented in future

**Verification:**
- Provide SHA256 checksums in release notes
- Users can verify download integrity
- Manifests include checksums for all artifacts

### Future Security Enhancements

1. **Code Signing Certificates:**
   - Budget allocation for certificates
   - Certificate procurement and installation
   - CI/CD integration for automated signing

2. **Notarization:**
   - macOS notarization with Apple
   - SmartScreen reputation building for Windows

3. **Update System:**
   - Automatic update checks
   - Secure update downloads (HTTPS)
   - Signature verification before applying updates

4. **Supply Chain Security:**
   - Dependency auditing (`npm audit`)
   - Dependabot for automated security updates
   - Lock file verification

## Resources

### Documentation
- **Electron Forge:** https://www.electronforge.io/
- **Webpack:** https://webpack.js.org/
- **GitHub Actions:** https://docs.github.com/en/actions
- **WiX Toolset:** https://wixtoolset.org/documentation/

### Build Scripts
- [clean-build-output.js](../scripts/clean-build-output.js) - Cleans previous build artifacts
- [stage-release-assets.js](../scripts/stage-release-assets.js) - Prepares release artifacts
- [run-smoke-tests.js](../scripts/run-smoke-tests.js) - Runs pre-build validation

### Support
- **GitHub Issues:** https://github.com/ONLY1-Group/VibeMD/issues
- **Email:** hello@vibemd.app

---

**Version:** 1.0.11
**Release Date:** 2025-10-26
**License:** MIT
