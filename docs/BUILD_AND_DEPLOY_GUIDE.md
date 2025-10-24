# Build and Deploy Guide

**Application:** VibeMD  
**Version:** 1.0.9  
**Updated:** 2025-10-24

## Prerequisites

- Node.js 20.x
- npm 10.x
- Platform toolchains:
  - **Windows:** WiX Toolset (pre-installed on GitHub-hosted runners)
  - **macOS:** Xcode command line tools, Homebrew packages `dpkg` and `rpm`
  - **Linux Builds:** Executed on macOS runners using the Homebrew toolchain

## Local Build Steps

1. Install dependencies: `npm install`
2. Run lint + smoke tests: `node scripts/run-smoke-tests.js`
3. Build for your platform:
   - Windows x64: `npm run build:win-x64`
   - Windows ARM64: `npm run build:win-arm64`
   - macOS arm64: `npm run build:mac-arm64`
   - macOS x64: `npm run build:mac-x64`
   - Linux x64: `npm run build:linux-x64`
   - Linux ARM64: `npm run build:linux-arm64`

Each build command copies the generated installers and archives into `releases/<platform>/<arch>`, keeping the repository’s release payloads in sync across operating systems.

## CI/CD Strategy

- **Windows Build Workflow:** Runs on Windows runners, stages MSI/ZIP outputs into `releases/windows/<arch>`, and uploads the staged directory with a manifest.
- **macOS Build Workflow:** Runs on macOS runners, stages DMG/ZIP outputs into `releases/macos/<arch>`, and uploads per-architecture artifacts so each cadence can ship independently.
- **Linux Build Workflow:** Runs on macOS runners, installs Homebrew packaging dependencies, stages DEB/RPM outputs into `releases/linux/<arch>`, and publishes manifests for release orchestration.
- **Nightly Release Workflow:** Checks for a new semantic version, downloads the staged release directories, cuts a GitHub release directly from `releases/*`, and invokes the documentation workflow.
- **Documentation Workflow:** Generates README, guides, release notes, and this build strategy document, committing updates directly to `main`.

## Release Process

1. Merge version bump to `main`.
2. Allow platform build workflows to complete and upload artifacts.
3. Nightly release workflow publishes a release using the installers and packages staged in `releases/<platform>/<arch>` for the requested version.
4. Documentation workflow updates Markdown guides with the latest release information.

## Security Notes

- Installers remain unsigned until certificates are provisioned. Communicate this prominently in release notes.
- Secrets (signing certificates, Apple notarization) should be injected via GitHub environments when available.
