# Build Strategy

**Application:** VibeMD
**Version:** 1.0.16
**Updated:** 2025-10-28
**License:** MIT © 2025 ONLY1 Pty Ltd

---

## Overview

VibeMD uses automated GitHub Actions workflows to build, test, and release software across Windows, macOS, and Linux. The strategy prioritizes:
- **Automation:** Minimal manual intervention in the release process
- **Transparency:** Comprehensive documentation and artifact manifests
- **Reliability:** Separate build jobs for independent release cadences
- **Quality:** Automated testing and code quality checks

---

## Workflow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  GitHub Actions Workflows                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │  Trigger: Push   │  │  Trigger: Daily  │                 │
│  │  to main         │  │  at 00:00 UTC    │                 │
│  └────────┬─────────┘  └────────┬─────────┘                 │
│           │                     │                            │
│      ┌────▼─────────────────────▼────┐                      │
│      │   Platform Build Workflows     │                      │
│      ├────────────────────────────────┤                      │
│      │ 1. build-windows.yml           │                      │
│      │    └─ Windows x64, ARM64       │                      │
│      │ 2. build-macos.yml             │                      │
│      │    └─ macOS arm64, x64         │                      │
│      │ 3. build-linux.yml             │                      │
│      │    └─ Linux x64                │                      │
│      └────┬──────────────────────────┘                      │
│           │                                                  │
│    ┌──────▼──────────────────────────┐                     │
│    │  Nightly Release Workflow       │                     │
│    │ (release-nightly.yml)           │                     │
│    │  - Detect version tag           │                     │
│    │  - Download ready artifacts     │                     │
│    │  - Create GitHub release        │                     │
│    │  - Trigger docs update          │                     │
│    └──────┬───────────────────────────┘                    │
│           │                                                 │
│    ┌──────▼──────────────────────────┐                    │
│    │  Documentation Workflow         │                    │
│    │ (update-docs.yml)               │                    │
│    │  - Generate README.md           │                    │
│    │  - Update all docs/*.md         │                    │
│    │  - Commit to main               │                    │
│    └─────────────────────────────────┘                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Build Workflows

### 1. build-windows.yml

**Trigger:** Push to main, manual dispatch
**Runs on:** `windows-latest`
**Duration:** ~10 minutes
**Parallel Jobs:** 2 (x64, ARM64)

**Process:**
1. Checkout code
2. Setup Node.js 20.x
3. Install dependencies
4. Run smoke tests
5. Build MSI and ZIP for x64
6. Build MSI and ZIP for ARM64
7. Generate manifest with checksums
8. Upload artifacts

**Outputs:**
```
windows/
├── x64/
│   ├── VibeMD-1.0.16-x64.msi
│   ├── VibeMD-win32-x64-1.0.16.zip
│   └── manifest.json
└── arm64/
    ├── VibeMD-1.0.16-arm64.msi
    ├── VibeMD-win32-arm64-1.0.16.zip
    └── manifest.json
```

### 2. build-macos.yml

**Trigger:** Push to main, manual dispatch
**Runs on:** `macos-latest`
**Duration:** ~15 minutes per architecture
**Parallel Jobs:** 2 (arm64, x64) — Independent

**Process (each architecture):**
1. Checkout code
2. Setup Node.js 20.x
3. Install dependencies + Homebrew tools (dpkg, rpm)
4. Run smoke tests
5. Build DMG and ZIP for specified architecture
6. Generate manifest
7. Upload artifacts

**Key Advantage:** Separate jobs allow:
- Independent failure handling (one arch can be released if other fails)
- Parallel execution (faster combined time)
- Architecture-specific decisions (e.g., skip if upstream fails)

**Outputs:**
```
macos/
├── arm64/
│   ├── VibeMD-1.0.16-arm64.dmg
│   ├── VibeMD-darwin-arm64-1.0.16.zip
│   └── manifest.json
└── x64/
    ├── VibeMD-1.0.16-x64.dmg
    ├── VibeMD-darwin-x64-1.0.16.zip
    └── manifest.json
```

### 3. build-linux.yml

**Trigger:** Push to main, manual dispatch
**Runs on:** `macos-latest` (cross-compile)
**Duration:** ~12 minutes

**Why macOS for Linux builds?**
- GitHub doesn't provide Linux runners that include packaging tools
- macOS has Homebrew with `dpkg` and `rpm` packages
- Electron Forge supports cross-compilation via these tools

**Process:**
1. Checkout code
2. Setup Node.js 20.x
3. Install Homebrew tools (dpkg, rpm)
4. Run smoke tests
5. Build DEB package
6. Build RPM package (custom maker)
7. Generate manifest
8. Upload artifacts

**Outputs:**
```
linux/
└── x64/
    ├── vibemd_1.0.16_amd64.deb
    ├── vibemd-1.0.16-1.x86_64.rpm
    └── manifest.json
```

---

## Release Workflows

### 4. release-nightly.yml

**Trigger:** Daily at 00:00 UTC (can also manually dispatch)
**Runs on:** `ubuntu-latest`
**Duration:** ~5 minutes

**Process:**
1. Detect latest version from git tags
2. Check if version has been released
3. Download all ready artifacts from build workflows
4. Verify all platform manifests match version
5. Create GitHub release with all artifacts
6. Invoke `update-docs.yml` workflow

**Partial Release Support:**
- If one platform hasn't finished building yet, release only ready platforms
- Next nightly run will publish missing platforms when ready
- Example: macOS arm64 fails overnight → x64 releases; arm64 releases when fixed

**Manifest Matching:**
Each artifact must have `manifest.json` with matching version:
```json
{
  "version": "1.0.16",
  "platform": "windows",
  // ... other fields
}
```

### 5. update-docs.yml

**Trigger:** Called by `release-nightly.yml`
**Runs on:** `ubuntu-latest`
**Duration:** ~3 minutes

**Input Parameters** (from release-nightly):
- `version` — Release version (e.g., `1.0.16`)
- `releaseDate` — ISO date (e.g., `2025-10-28`)
- `unsigned` — Boolean (installers unsigned)

**Process:**
1. Checkout code
2. Update version in all docs to match release
3. Regenerate README.md
4. Regenerate docs/USER_GUIDE.md
5. Regenerate docs/ARCHITECTURE_GUIDE.md
6. Regenerate docs/BUILD_AND_DEPLOY_GUIDE.md
7. Update docs/RELEASE_NOTES.md with new version
8. Regenerate docs/BUILD_STRATEGY.md
9. Commit all changes to main

**Files Updated:**
- `README.md` — Main repository readme
- `docs/USER_GUIDE.md` — User-facing documentation
- `docs/ARCHITECTURE_GUIDE.md` — Technical architecture
- `docs/BUILD_AND_DEPLOY_GUIDE.md` — Build instructions
- `docs/RELEASE_NOTES.md` — Version history
- `docs/BUILD_STRATEGY.md` — This file
- Package.json version (generated, not edited)

---

## Artifact Management

### Manifest Files (`manifest.json`)

Each platform build generates a manifest containing:

**Example Manifest:**
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
      "sha256": "7c5a8b3e9f2d1a4c6e8f9a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1",
      "unsigned": true,
      "format": "msi"
    },
    {
      "name": "VibeMD-win32-x64-1.0.16.zip",
      "size": 128000000,
      "sha256": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
      "unsigned": true,
      "format": "zip"
    }
  ],
  "buildDate": "2025-10-28T18:30:00Z",
  "unsigned": true,
  "checksum": "sha256"
}
```

### Release Directory Structure

After all builds complete:
```
releases/
├── windows/
│   ├── x64/
│   │   ├── VibeMD-1.0.16-x64.msi
│   │   ├── VibeMD-win32-x64-1.0.16.zip
│   │   └── manifest.json
│   └── arm64/
│       ├── VibeMD-1.0.16-arm64.msi
│       ├── VibeMD-win32-arm64-1.0.16.zip
│       └── manifest.json
├── macos/
│   ├── arm64/
│   │   ├── VibeMD-1.0.16-arm64.dmg
│   │   ├── VibeMD-darwin-arm64-1.0.16.zip
│   │   └── manifest.json
│   └── x64/
│       ├── VibeMD-1.0.16-x64.dmg
│       ├── VibeMD-darwin-x64-1.0.16.zip
│       └── manifest.json
└── linux/
    └── x64/
        ├── vibemd_1.0.16_amd64.deb
        ├── vibemd-1.0.16-1.x86_64.rpm
        └── manifest.json
```

### GitHub Release Assets

When published to GitHub:
```
https://github.com/vibemd/VibeMD/releases/tag/v1.0.16

Assets:
├── VibeMD-1.0.16-x64.msi
├── VibeMD-win32-x64-1.0.16.zip
├── VibeMD-1.0.16-arm64.msi
├── VibeMD-win32-arm64-1.0.16.zip
├── VibeMD-1.0.16-arm64.dmg
├── VibeMD-darwin-arm64-1.0.16.zip
├── VibeMD-1.0.16-x64.dmg
├── VibeMD-darwin-x64-1.0.16.zip
├── vibemd_1.0.16_amd64.deb
└── vibemd-1.0.16-1.x86_64.rpm
```

---

## Testing Strategy

### Smoke Tests (`scripts/run-smoke-tests.js`)

Runs in **every build workflow** before packaging:

**Checks:**
1. **Linting:** ESLint for code quality
   - TypeScript strict mode
   - Unused variable detection
   - Common pitfalls flagged
2. **Bundle Validation:** Webpack compilation
   - Main process bundles correctly
   - Renderer bundles correctly
   - Preload bundle compiles
   - Source maps generated
3. **Type Checking:** TypeScript compilation
   - No type errors
   - All imports resolve
4. **File Structure:** Basic sanity checks
   - All entry files exist
   - Config files are valid

**Fails Build If:**
- Linting errors found
- Bundle fails to compile
- Type errors present
- Critical files missing

### Manual Testing (Pre-Release)

Before marking release as stable:
1. Install on Windows 10/11
2. Install on macOS 10.15+
3. Install on Linux (Ubuntu)
4. Test core features (new document, save, open, edit)
5. Verify themes work
6. Check settings persistence
7. Test template system
8. Verify file associations

---

## Release Checklist

### Before Committing Version Bump

- [ ] Update version in `package.json`
- [ ] Update `docs/RELEASE_NOTES.md` with changelog
- [ ] Run `npm run lint` — no errors
- [ ] Run `npm start` — app launches
- [ ] Test basic features locally
- [ ] Update version number in documentation (if not auto-generated)

### After Commit

- [ ] Monitor GitHub Actions — all platform builds succeed
- [ ] Check manifests generated correctly
- [ ] Wait for nightly release workflow (00:00 UTC)
- [ ] Verify GitHub release created with all artifacts
- [ ] Verify documentation auto-updated with new version
- [ ] Test downloaded installers on each platform
- [ ] Announce release

---

## Troubleshooting Build Failures

### Windows Build Fails

**Common Causes:**
- WiX Toolset version mismatch
- Node.js version incompatible
- Icon files missing

**Debug:**
```bash
npm run build:win-x64 --verbose
```

**Recovery:**
1. Check WiX version on CI
2. Update local WiX to match
3. Verify icon files in `build/icons/`

### macOS Build Fails

**Common Causes:**
- Missing Xcode command line tools
- Homebrew tools not installed
- Code signing issues (if enabled)

**Debug:**
```bash
xcode-select --install
brew install dpkg rpm
npm run build:mac-arm64 --verbose
```

### Linux Build Fails

**Common Causes:**
- Homebrew tools outdated
- Custom RPM maker issue
- Dependency resolution failure

**Debug:**
```bash
# Run from macOS to debug cross-compilation
npm run build:linux-x64 --verbose
```

### Release Workflow Doesn't Trigger

**Possible Causes:**
- Version tag already exists
- Artifacts don't have matching manifests
- Nightly schedule not set correctly

**Recovery:**
1. Check version tag: `git tag | grep v1.0.16`
2. Verify manifests: `cat releases/*/manifest.json | jq .version`
3. Manually trigger: `gh workflow run release-nightly.yml`

---

## Performance Optimization

### Build Time Optimization

- **Parallel Jobs:** macOS arm64 and x64 build simultaneously (~15 min vs 30 min)
- **Caching:** Node modules cached between runs
- **Incremental Builds:** Webpack caches unchanged modules

**Current Timings (GitHub-hosted runners):**
- Windows (both arch): ~10 minutes
- macOS (per arch): ~15 minutes
- Linux: ~12 minutes
- Nightly release: ~5 minutes
- Documentation: ~3 minutes
- **Total:** ~45 minutes for full cycle

### Future Optimizations

- Enable sccache for Rust bindings compilation
- Pre-build Electron binaries
- Parallel artifact uploads
- Incremental documentation generation

---

## Security

### Secrets Management

No secrets required for unsigned builds. Future code signing will require:
- GitHub Actions environment variables
- Certificate files in secrets
- Apple ID credentials (encrypted)

### Artifact Integrity

Manifests include:
- SHA256 checksums for verification
- File sizes for validation
- Build metadata (timestamp, platform)

Users can verify downloads:
```bash
sha256sum -c manifest.json
```

---

## Future Enhancements

### Planned Improvements

1. **Code Signing** — Add certificate-based signing when available
2. **Notarization** — Apple notarization for macOS
3. **Auto-Updates** — In-app update mechanism
4. **Beta Channels** — Pre-release versions for testing
5. **Distribution** — Homebrew, Chocolatey, Snap/Flatpak
6. **Rollback** — Keep previous versions for easy rollback

### Testing Expansion

1. Unit tests — Service layer coverage
2. Integration tests — IPC communication
3. E2E tests — User workflows
4. Performance tests — Benchmark large documents

### Artifact Verification

1. Checksum validation on download
2. Digital signatures
3. Tamper detection
4. Version compatibility matrix

---

**VibeMD is developed and maintained by ONLY1 Pty Ltd.**
**License:** MIT © 2025 ONLY1 Pty Ltd
