# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated building and releasing of VibeMD.

## Workflows

### `build.yml` - Build and Release

Automatically builds VibeMD for all supported platforms and architectures.

**Triggers:**
- Push to `main` branch
- Pull requests to `main` branch
- Tags matching `v*` (e.g., `v1.0.0`)
- Manual workflow dispatch

**Jobs:**

#### 1. Build macOS (`build-macos`)
- **Runs on:** macOS latest
- **Matrix:** arm64, x64
- **Outputs:** ZIP archives for each architecture
- **Artifacts:** Uploaded for 30 days

#### 2. Build Windows (`build-windows`)
- **Runs on:** Windows latest
- **Matrix:** x64, arm64
- **Outputs:**
  - ZIP archives (portable)
  - Squirrel installers (.exe/.msi)
- **Special handling:** Automatically uncomments `MakerSquirrel` configuration for proper Windows installer creation
- **Artifacts:** Uploaded for 30 days

#### 3. Create Release (`create-release`)
- **Runs on:** Ubuntu latest
- **Condition:** Only runs on version tags (e.g., `v1.0.0`)
- **Action:** Creates GitHub release with all build artifacts attached
- **Permissions:** Requires `contents: write`

## Usage

### Automatic Builds on Push

Every push to `main` triggers builds for all platforms. Artifacts are available in the Actions tab.

### Creating a Release

1. Update version in `package.json`
2. Commit and push changes
3. Create and push a version tag:
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```
4. GitHub Actions will automatically:
   - Build for all platforms
   - Create a GitHub Release
   - Attach all build artifacts
   - Generate release notes

### Manual Workflow Dispatch

You can manually trigger builds from the Actions tab:
1. Go to Actions → Build VibeMD
2. Click "Run workflow"
3. Select branch
4. Click "Run workflow"

## Build Matrix

| Platform | Architecture | Runner | Output |
|----------|-------------|--------|--------|
| macOS | arm64 | macos-latest | ZIP |
| macOS | x64 | macos-latest | ZIP |
| Windows | x64 | windows-latest | ZIP + EXE + MSI |
| Windows | arm64 | windows-latest | ZIP + EXE + MSI |

## Artifacts

Build artifacts are automatically uploaded and available for:
- **30 days** for regular builds
- **Forever** when attached to a release

### Artifact Names

- `VibeMD-darwin-arm64` - macOS Apple Silicon ZIP
- `VibeMD-darwin-x64` - macOS Intel ZIP
- `VibeMD-win32-x64-zip` - Windows x64 portable ZIP
- `VibeMD-win32-arm64-zip` - Windows ARM64 portable ZIP
- `VibeMD-win32-x64-installer` - Windows x64 installers
- `VibeMD-win32-arm64-installer` - Windows ARM64 installers

## Windows Installer Creation

On Windows runners, the workflow automatically enables the Squirrel maker by uncommenting the relevant sections in `forge.config.ts`. This allows proper .exe and .msi installer creation without Wine dependency issues.

## Notes

- **Build time:** Approximately 10-15 minutes for all platforms
- **Concurrent builds:** macOS and Windows builds run in parallel
- **Node.js version:** 18.x with npm caching enabled
- **Dependencies:** Installed via `npm ci` for consistency

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

- Workflow uses minimal permissions
- Only `contents: write` for release creation
- Secrets not required for public repositories
- All dependencies cached and verified
