# Build Strategy

**Application:** VibeMD  
**Version:** 1.0.9  
**Documented:** 2025-10-24

## Goals

- Deliver nightly-built, ready-to-release artifacts for Windows, macOS, and Linux.
- Separate build, release, and documentation responsibilities.
- Maintain transparent documentation that reflects the current release state.

## Workflows

1. **build-windows.yml** — Windows-hosted runners build MSI and ZIP installers for x64 and ARM64, staging results under `releases/windows/<arch>`.
2. **build-macos.yml** — macOS-hosted runners build DMG/ZIP for Apple Silicon and Intel in discrete jobs, staging results under `releases/macos/<arch>` so architectures can release on separate cadences.
3. **build-linux.yml** — macOS-hosted runners install Homebrew packaging tooling, produce DEB/RPM outputs using the custom RPM maker, and stage them under `releases/linux/<arch>`.
4. **release-nightly.yml** — Nightly scheduler checks for unreleased versions, downloads ready build artifacts, publishes a GitHub release, and invokes docs updates.
5. **update-docs.yml** — Regenerates README and all guides, committing directly to main with release metadata supplied by the caller.

## Artifact Management

- Each build job stages outputs into `releases/<platform>/<arch>` before publishing CI artifacts.
- Each staged directory emits a manifest (`manifest.json`) containing version, platform, architecture, formats, checksums, and unsigned status.
- Artifact names follow `build-<platform>-<arch>-v<version>` for easy discovery via the GitHub Actions API.
- Release workflow reconstructs the staged `releases` tree and only publishes artifacts whose manifests match the target version, enabling partial releases.

## Testing

- `scripts/run-smoke-tests.js` runs linting, type-checking, and release folder verification in CI.
- Future enhancements can expand test coverage without altering the release pipeline design.

## Documentation Updates

- Documentation is regenerated after every release with authoritative data (version, date, unsigned status).
- Auto-generated files: README.md, docs/USER_GUIDE.md, docs/ARCHITECTURE_GUIDE.md, docs/BUILD_AND_DEPLOY_GUIDE.md, docs/RELEASE_NOTES.md, docs/BUILD_STRATEGY.md.
- Additional ad-hoc documentation should live in `docs/` alongside these core guides.

## Next Steps

- Introduce code-signing certificates and notarization when available.
- Expand automated testing and artifact verification (e.g., checksum validation on download).
- Evaluate release candidate channels (beta) once signing is in place.
