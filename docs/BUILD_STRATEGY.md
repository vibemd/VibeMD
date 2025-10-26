# VibeMD Build Strategy

**Application:** VibeMD
**Version:** 1.0.11
**Release Date:** 2025-10-26
**License:** MIT

## Overview

This document outlines the strategic approach to building, releasing, and documenting VibeMD. The build strategy emphasizes automation, platform independence, transparency, and maintainability.

## Strategic Goals

### 1. Automated Multi-Platform Delivery
- **Objective:** Produce production-ready installers for Windows, macOS, and Linux with minimal manual intervention
- **Approach:** Platform-specific GitHub Actions workflows that build independently and upload artifacts
- **Benefit:** Reduces human error, ensures consistency, enables rapid iteration

### 2. Separation of Concerns
- **Build Workflows:** Focus solely on compiling and packaging for specific platforms
- **Release Workflow:** Orchestrates artifact collection and GitHub release creation
- **Documentation Workflow:** Maintains authoritative version information across all docs
- **Benefit:** Each workflow has a single responsibility, making debugging and maintenance easier

### 3. Transparent Documentation
- **Objective:** Documentation always reflects the current release state
- **Approach:** Automated documentation updates triggered by releases
- **Benefit:** Users and developers always have accurate information about versions, features, and build status

### 4. Flexible Release Cadence
- **Objective:** Support both scheduled nightly releases and on-demand releases
- **Approach:** Nightly scheduler with manual dispatch fallback
- **Benefit:** Maintainers can release immediately when needed or rely on automation for routine releases

### 5. Partial Release Support
- **Objective:** Release available platforms even if some are not yet ready
- **Approach:** Artifact manifest validation allows mixing platform completion states
- **Benefit:** macOS can ship while Windows build is still in progress, reducing time-to-market

## Workflow Architecture

### Build Workflows (Platform-Specific)

Three independent build workflows handle platform-specific compilation:

#### 1. Build Windows ([.github/workflows/build-windows.yml](../.github/workflows/build-windows.yml))

**Runner:** `windows-latest`

**Responsibilities:**
- Build MSI and ZIP installers for x64 and ARM64 architectures
- Generate manifests with version, file paths, checksums, and unsigned status
- Upload artifacts to GitHub Actions with standardized naming

**Triggers:**
- Push to `main` branch
- Pull requests (for validation)
- Manual workflow dispatch

**Outputs:**
- `build-windows-x64-v<version>` artifact
- `build-windows-arm64-v<version>` artifact

**Key Design Decisions:**
- **Why separate architectures:** x64 and ARM64 may complete at different times; separating allows independent progress
- **Why Windows runner:** Native tooling (WiX) works best on Windows OS
- **Why both MSI and ZIP:** MSI for standard installation, ZIP for portable use

#### 2. Build macOS ([.github/workflows/build-macos.yml](../.github/workflows/build-macos.yml))

**Runner:** `macos-latest`

**Responsibilities:**
- Build DMG and ZIP installers for Apple Silicon (arm64) and Intel (x64)
- Separate jobs for each architecture enable independent completion
- Prepare for code signing and notarization (infrastructure ready, certificates pending)

**Triggers:**
- Push to `main` branch
- Pull requests
- Manual workflow dispatch

**Outputs:**
- `build-macos-arm64-v<version>` artifact
- `build-macos-x64-v<version>` artifact

**Key Design Decisions:**
- **Why separate jobs:** arm64 and x64 can release on different schedules; allows Apple Silicon to ship faster
- **Why macOS runner:** Native Xcode tooling and eventual code signing/notarization
- **Why both DMG and ZIP:** DMG for traditional drag-to-Applications, ZIP for automation and CI

#### 3. Build Linux ([.github/workflows/build-linux.yml](../.github/workflows/build-linux.yml))

**Runner:** `macos-latest` (with Homebrew tooling)

**Responsibilities:**
- Build DEB and RPM packages for x64 architecture
- Install `dpkg` and `rpm` via Homebrew for cross-platform building
- Generate manifest

**Triggers:**
- Push to `main` branch
- Pull requests
- Manual workflow dispatch

**Outputs:**
- `build-linux-x64-v<version>` artifact (contains both DEB and RPM)

**Key Design Decisions:**
- **Why macOS runner:** Electron Forge's Linux makers work reliably on macOS with Homebrew; avoids need for Linux CI infrastructure
- **Why both DEB and RPM:** Covers Debian/Ubuntu and RedHat/Fedora ecosystems
- **Why single job:** Linux builds are fast enough to bundle both package types together

### Release Workflow

#### Release Nightly ([.github/workflows/release-nightly.yml](../.github/workflows/release-nightly.yml))

**Runner:** `ubuntu-latest`

**Responsibilities:**
- Detect version from `package.json`
- Check if version already has a GitHub release
- Download all matching build artifacts from previous workflows
- Validate manifests (version, checksums, unsigned status)
- Create GitHub release with tag `v<version>`
- Upload all installers to release
- Generate release notes from `RELEASE_NOTES.md`
- Trigger documentation update workflow

**Triggers:**
- Scheduled: Daily at 2:00 AM UTC
- Manual dispatch with optional version override

**Key Design Decisions:**
- **Why nightly:** Ensures releases happen automatically without maintainer intervention
- **Why version detection:** Prevents duplicate releases; allows idempotent execution
- **Why manifest validation:** Ensures only valid, versioned artifacts are released
- **Why partial release support:** If only macOS artifacts exist, releases macOS; Windows can be added later
- **Why separate from builds:** Release orchestration is platform-independent; separating keeps build logic simple

**Process Flow:**
```
1. Read package.json version
2. Query GitHub Releases API for existing v<version>
3. If exists, exit (already released)
4. Query GitHub Actions API for artifacts matching version
5. Download all matching artifacts
6. Read and validate manifests
7. Create release with tag v<version>
8. Upload all installer files from artifacts
9. Publish release with generated notes
10. Trigger update-docs workflow
```

### Documentation Workflow

#### Update Documentation ([.github/workflows/update-docs.yml](../.github/workflows/update-docs.yml))

**Runner:** `ubuntu-latest`

**Responsibilities:**
- Update version number and release date in all documentation files
- Maintain consistency across README and all guides
- Commit updates directly to `main` branch
- Ensure documentation is always current

**Triggers:**
- Called by `release-nightly.yml` after successful release
- Manual dispatch with version and date inputs

**Files Updated:**
- `README.md`
- `docs/USER_GUIDE.md`
- `docs/ARCHITECTURE_GUIDE.md`
- `docs/BUILD_AND_DEPLOY_GUIDE.md`
- `docs/BUILD_STRATEGY.md`
- `docs/RELEASE_NOTES.md`

**Key Design Decisions:**
- **Why automated:** Eliminates manual version updates; prevents documentation drift
- **Why triggered by release:** Documentation should reflect released versions, not in-progress work
- **Why commit to main:** Documentation updates are authoritative and non-controversial
- **Why separate workflow:** Documentation update is logically distinct from release creation

#### GitHub Pages ([.github/workflows/pages.yml](../.github/workflows/pages.yml))

**Runner:** `ubuntu-latest`

**Responsibilities:**
- Build static documentation site from markdown files
- Deploy to GitHub Pages
- Make documentation publicly accessible

**Triggers:**
- Push to `main` branch (typically after documentation updates)

**Key Design Decisions:**
- **Why GitHub Pages:** Free hosting, automatic SSL, integrates with repository
- **Why triggered on main push:** Documentation should update immediately when committed

## Artifact Management Strategy

### Naming Convention

**Artifacts use consistent naming:**
```
build-<platform>-<arch>-v<version>
```

Examples:
- `build-windows-x64-v1.0.11`
- `build-macos-arm64-v1.0.11`
- `build-linux-x64-v1.0.11`

**Rationale:**
- Platform and architecture in name enables filtering via GitHub API
- Version in name allows artifact discovery without downloading
- Consistent structure simplifies scripting and automation

### Manifest Schema

Each artifact includes a `manifest.json` file:

```json
{
  "version": "1.0.11",
  "platform": "windows",
  "architecture": "x64",
  "buildDate": "2025-10-26T08:00:00Z",
  "formats": ["msi", "zip"],
  "files": [
    {
      "name": "VibeMD-1.0.11-x64.msi",
      "path": "release-staging/windows/x64/VibeMD-1.0.11-x64.msi",
      "size": 85123456,
      "checksum": "sha256:abc123def456..."
    },
    {
      "name": "VibeMD-win32-x64-1.0.11.zip",
      "path": "release-staging/windows/x64/VibeMD-win32-x64-1.0.11.zip",
      "size": 82456789,
      "checksum": "sha256:def789ghi012..."
    }
  ],
  "unsigned": true
}
```

**Purpose:**
- **Version validation:** Release workflow verifies artifact version matches target version
- **Checksum integrity:** Users can verify download integrity
- **Unsigned status tracking:** Documents current signing state
- **File metadata:** Provides size and location information

### Artifact Retention

**GitHub Actions Artifacts:**
- Retention: 90 days (GitHub default)
- Purpose: Temporary storage during release process
- Cleanup: Automatic after retention period

**GitHub Release Assets:**
- Retention: Permanent
- Purpose: Public distribution
- Cleanup: Manual deletion only (rare)

**Rationale:**
- Artifacts are ephemeral; releases are permanent
- Artifacts enable automation; releases serve users
- 90-day retention ensures recent builds are available for debugging

## Testing Strategy

### Smoke Tests

**Script:** `scripts/run-smoke-tests.js`

**Responsibilities:**
- Run ESLint on all TypeScript files
- Verify Webpack builds complete successfully
- Ensure main, renderer, and preload bundles are generated
- Check for compilation errors

**When Run:**
- Before every build in CI
- Manually via `npm run` scripts
- As pre-commit hooks (future)

**Purpose:**
- Catch syntax errors before expensive builds
- Ensure code quality standards
- Prevent broken builds from reaching artifact stage

### Integration Tests (Future)

**Planned:**
- IPC communication tests
- File operation tests
- Settings persistence tests

**Rationale:**
- Smoke tests only validate compilation; integration tests validate behavior
- IPC is critical; needs explicit testing
- File operations have platform-specific quirks

### End-to-End Tests (Future)

**Planned:**
- Electron testing with Spectron or Playwright
- User workflow simulations
- Cross-platform behavioral consistency

**Rationale:**
- Ensures user-facing functionality works as expected
- Catches regressions in UI and interactions
- Validates platform-specific behaviors

## Release Cadence

### Nightly Releases

**Schedule:** 2:00 AM UTC daily

**Process:**
1. Nightly workflow checks for new version in `package.json`
2. If version already released, exits early (no-op)
3. If new version, downloads artifacts and creates release
4. Triggers documentation update

**Use Cases:**
- Routine releases after version bumps
- Automated releases without maintainer action
- Consistent release timing

### On-Demand Releases

**Trigger:** Manual workflow dispatch

**Process:**
1. Maintainer triggers `release-nightly.yml` manually
2. Optionally specifies version to release
3. Workflow proceeds as normal (artifact download, release creation, docs update)

**Use Cases:**
- Urgent hotfix releases
- Beta/RC releases
- Testing release process

### Version Bumping

**Process:**
1. Update `version` in `package.json`
2. Update `RELEASE_NOTES.md` with changelog
3. Commit to `main` branch
4. Push to trigger builds
5. Wait for nightly or manually trigger release

**Semantic Versioning:**
- **Patch (1.0.11 → 1.0.12):** Bug fixes, minor improvements
- **Minor (1.0.11 → 1.1.0):** New features, backward-compatible
- **Major (1.0.11 → 2.0.0):** Breaking changes, architecture overhauls

## Future Enhancements

### 1. Code Signing and Notarization

**Status:** Infrastructure ready, certificates pending

**Required:**
- Apple Developer account and certificates
- Windows code signing certificate (Sectigo, DigiCert, etc.)

**Implementation:**
- Set environment variables in GitHub Secrets
- Enable signing in `forge.config.ts`
- Add signing steps to build workflows

**Timeline:** Post-MVP, when budget allows

### 2. Automated Testing Expansion

**Status:** Smoke tests implemented, integration/E2E planned

**Planned:**
- Jest unit tests for services and utilities
- IPC integration tests
- Playwright E2E tests

**Timeline:** Ongoing, prioritize critical paths first

### 3. Beta/RC Channels

**Status:** Not implemented

**Approach:**
- Version naming: `1.1.0-beta.1`, `1.1.0-rc.1`
- Separate releases marked as "prerelease" in GitHub
- Documentation distinguishes stable vs. beta

**Timeline:** When user base justifies beta testing

### 4. Artifact Checksum Verification

**Status:** Checksums generated, not yet verified in release workflow

**Implementation:**
- Release workflow reads checksums from manifests
- Verifies downloaded artifact checksums before uploading to release
- Aborts release if checksum mismatch detected

**Timeline:** Next release cycle

### 5. Dependency Auditing

**Status:** Manual via `npm audit`

**Planned:**
- Automated Dependabot pull requests
- GitHub Actions workflow for security scans
- Fail builds on high-severity vulnerabilities

**Timeline:** Immediate (low effort, high value)

### 6. Bundle Size Monitoring

**Status:** Not implemented

**Planned:**
- Webpack bundle analyzer integration
- Size budgets in CI
- Alert on significant size increases

**Timeline:** When performance becomes priority

## Troubleshooting Workflow Issues

### Build Workflow Fails

**Common Causes:**
- Linting errors (fix in code)
- Missing dependencies (`npm install` locally)
- Platform-specific tooling issues (check runner logs)

**Resolution:**
1. Review workflow logs in GitHub Actions
2. Reproduce locally with same Node.js version
3. Fix code or configuration
4. Push fix to re-trigger build

### Release Workflow Can't Find Artifacts

**Common Causes:**
- Builds haven't completed yet
- Version mismatch between `package.json` and artifacts
- Artifact naming inconsistency

**Resolution:**
1. Check that all build workflows completed successfully
2. Verify artifact names match `build-<platform>-<arch>-v<version>`
3. Verify version in `package.json` matches build artifacts
4. Re-run release workflow after builds complete

### Documentation Workflow Commits Fail

**Common Causes:**
- Merge conflicts (manual edits to docs during automated update)
- Permissions issues (GitHub token expired)

**Resolution:**
1. Manually pull latest `main` branch
2. Resolve any conflicts in documentation files
3. Re-trigger documentation workflow
4. If permissions issue, regenerate GitHub token

### Partial Release Created

**Scenario:** Only macOS artifacts available, Windows still building

**Expected Behavior:** Release created with macOS installers only

**Follow-Up:**
1. Wait for remaining build workflows to complete
2. Re-run release workflow (will add missing artifacts to existing release)
3. Update release notes if needed

## Best Practices

### For Maintainers

1. **Always bump version before merging features**
   - Update `package.json` and `RELEASE_NOTES.md` together
   - Prevents accidental re-releases of same version

2. **Test locally before pushing to main**
   - Run `npm run lint` and `npm start`
   - Verify changes work as expected

3. **Use descriptive commit messages**
   - Format: `type(scope): description`
   - Examples: `feat(editor): add table support`, `fix(save): handle empty documents`

4. **Monitor CI workflows after pushing**
   - Check GitHub Actions tab for build status
   - Address failures promptly

5. **Verify releases manually**
   - Download installers from release
   - Test installation on target platforms
   - Ensure documentation updated correctly

### For Contributors

1. **Follow coding standards**
   - Run `npm run lint` before committing
   - Use TypeScript types consistently
   - Write descriptive variable names

2. **Test changes locally**
   - Use `npm start` for development
   - Verify changes don't break existing functionality

3. **Keep pull requests focused**
   - One feature or fix per PR
   - Include tests when appropriate

4. **Update documentation if needed**
   - User-facing changes should update `USER_GUIDE.md`
   - Architecture changes should update `ARCHITECTURE_GUIDE.md`

## Metrics and Monitoring (Future)

### Planned Metrics

1. **Build Success Rate**
   - Track percentage of successful builds
   - Alert on declining success rate

2. **Build Duration**
   - Monitor build times per platform
   - Identify performance regressions

3. **Artifact Size Trends**
   - Track installer size over time
   - Alert on significant increases

4. **Release Frequency**
   - Monitor releases per month
   - Evaluate release cadence effectiveness

5. **Download Statistics**
   - Track downloads per platform
   - Inform platform prioritization decisions

### Implementation

- GitHub Actions provides basic build metrics
- GitHub Releases API provides download counts
- Custom scripts for aggregation and visualization
- Dashboard (future): Grafana or similar

## Conclusion

VibeMD's build strategy prioritizes automation, flexibility, and transparency. By separating build, release, and documentation responsibilities into distinct workflows, the strategy enables:

- **Independent platform builds** that can complete and release asynchronously
- **Automated nightly releases** that require no maintainer intervention
- **Partial releases** that ship available platforms without waiting for all
- **Authoritative documentation** that always reflects the current release state

This approach scales with the project, supports multiple platforms and architectures, and provides a foundation for future enhancements like code signing, beta channels, and expanded testing.

---

**Version:** 1.0.11
**Release Date:** 2025-10-26
**License:** MIT
