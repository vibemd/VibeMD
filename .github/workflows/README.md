# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated building and releasing of VibeMD.

## Workflows

### `release.yml` - Build and Release (All Platforms)

Orchestrates end-to-end releases:

- Determines the next available version (bumps patch if the tag already exists) or uses an input version.
- Updates docs' Version labels and bumps `package.json`.
- Builds macOS x64/arm64 (ZIP, DMG), Windows x64/arm64 (ZIP, EXE, MSI), and Linux DEB/RPM.
- Creates a GitHub Release and uploads assets with standardized names.

Artifacts are named with platform, arch, and version, for example:

- `VibeMD-win32-x64-1.2.3.{exe,msi,zip}`
- `VibeMD-darwin-arm64-1.2.3.zip`
- `vibemd_1.2.3_amd64.deb`, `vibemd-1.2.3-x86_64.rpm`

Signing and notarization are enabled if secrets are set (see README Signing & Notarization).

### Aggregate Builds

- `build-windows-all.yml` - Runs both Windows reusable workflows
- `build-macos-linux-all.yml` - Builds macOS x64/arm64 and Linux DEB/RPM

### Reusable Workflows

- `build-windows-x64.yml` - Windows x64 build (ZIP, MSI)
- `build-windows-arm64.yml` - Windows ARM64 build (ZIP, EXE, MSI)
- `build-macos-intel.yml` - macOS x64 build (ZIP, DMG)
- `build-macos-silicon.yml` - macOS arm64 build (ZIP, DMG)
- `build-linux-deb.yml` - Linux DEB (x64)
- `build-linux-rpm.yml` - Linux RPM (x64)

These can be invoked from other workflows via:

```
uses: vibemd/VibeMD/.github/workflows/<workflow>.yml@main
```

## Usage

### Automatic Builds on Push

Every push to `main` triggers builds for all platforms. Artifacts are available in the Actions tab.

### Creating a Release

From the Actions tab, run the `Release` workflow.

Inputs:
- `version` (optional) � desired version (e.g., `1.2.3`)
- `prerelease` (optional) � mark the release as pre-release
- `build_macos` (optional, default true) � build macOS (ZIP, DMG)
- `build_windows` (optional, default true) � build Windows (ZIP, EXE, MSI)
- `build_linux` (optional, default true) � build Linux (DEB, RPM)

The workflow updates docs and `package.json`, builds the selected platforms, and publishes a release with assets. If the tag already exists as a release, it auto-bumps the patch.

### Manual Workflow Dispatch

You can manually trigger builds from the Actions tab:
1. Go to Actions -> Build VibeMD
2. Click "Run workflow"
3. Select branch
4. Click "Run workflow"

## Build Matrix

| Platform | Architecture | Runner | Output |
|----------|-------------|--------|--------|
| macOS | arm64 | macos-latest | ZIP + DMG |
| macOS | x64 | macos-latest | ZIP + DMG |
| Windows | x64 | windows-latest | ZIP + MSI |
| Windows | arm64 | windows-latest | ZIP + MSI |
| Linux | x64 | ubuntu-latest | DEB + RPM |

## Artifacts

Build artifacts are automatically uploaded and available for:
- **30 days** for regular builds
- **Forever** when attached to a release

### Artifact Names

Release asset names are standardized:
- macOS: `VibeMD-darwin-{arch}-{version}.{zip,dmg}`
- Windows: `VibeMD-win32-{arch}-{version}.{zip,msi}`
- Linux: `vibemd_{version}_amd64.deb`, `vibemd-{version}-x86_64.rpm`

## Windows Installer Creation

On Windows runners, MSI installers are created via WiX. The MSI builds create a Start Menu shortcut for VibeMD (no Desktop shortcut). EXE (Squirrel) installers are not produced.

## Notes

- Build time: ~10-15 minutes for all platforms
- macOS, Windows, and Linux build in parallel
- Node.js: 20.x with npm caching enabled
- Dependencies installed via `npm install --no-audit --no-fund`

## Troubleshooting

### Build Fails

Check the Actions tab for detailed logs. Common issues:
- Dependencies not installing: Check `package.json` syntax
- Build script errors: Verify build commands in `package.json`
- Artifact upload fails: Check file paths match expected output

### Release Not Created

Ensure:
- Tag matches pattern `v*` (e.g., `v1.0.0`)
- Both build jobs completed successfully
- Repository has proper permissions for GitHub token

## Security

- GITHUB_TOKEN with `contents: write` for release creation
- Optional secrets for signing and notarization (see README)



