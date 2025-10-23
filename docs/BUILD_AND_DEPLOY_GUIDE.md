# Build and Deploy Guide

**Application:** VibeMD  
**Version:** 1.0.9  
**Updated:** 2025-10-23

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
   - macOS universal: `npm run build:mac-universal`
   - Linux x64: `npm run build:linux-x64`

## CI/CD Strategy

- **Windows Build Workflow:** Runs on Windows runners, produces MSI and ZIP for x64 and ARM64, and uploads artifacts with manifests.
- **macOS Build Workflow:** Runs on macOS runners, produces DMG/ZIP for macOS (both arches) and DEB/RPM for Linux, using Homebrew-installed packaging tools.
- **Nightly Release Workflow:** Checks for a new semantic version, downloads ready artifacts, cuts a GitHub release, and invokes the documentation workflow.
- **Documentation Workflow:** Generates README, guides, release notes, and this build strategy document, committing updates directly to `main`.

## Release Process

1. Merge version bump to `main`.
2. Allow platform build workflows to complete and upload artifacts.
3. Nightly release workflow publishes a release if matching artifacts are available.
4. Documentation workflow updates Markdown guides with the latest release information.

## Security Notes

- Installers remain unsigned until certificates are provisioned. Communicate this prominently in release notes.
- Secrets (signing certificates, Apple notarization) should be injected via GitHub environments when available.
