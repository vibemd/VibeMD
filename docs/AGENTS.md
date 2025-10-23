# VibeMD – Agent Guide (Release Pipeline v2)

This document gives agents the minimum, reliable context to work on builds and releases without reading every workflow file. It reflects the current “v2” pipeline in this repo.

## Sources of Truth
- Version: `package.json:version` is authoritative for the app version at build time.
- Workflow orchestration: `.github/workflows/release.yml:1` controls end‑to‑end releases and resolves the next available version (immutable releases ➜ auto‑bump patch).
- Forge config: `forge.config.ts:1` defines makers (ZIP, WiX MSI, Squirrel EXE, DEB, RPM) and env‑gated signing.

## Workflows (What to Use)
- `release.yml` (Actions ➜ Release):
  - Resolves version or bumps to next free tag
  - Updates docs’ Version labels (README, User Guide, Architecture Guide)
  - Bumps `package.json:version` if needed
  - Builds macOS x64/arm64, Windows x64/arm64, Linux DEB/RPM
  - Creates a GitHub Release and uploads standardized assets
- Reusable Windows builds:
  - `build-windows-x64.yml`, `build-windows-arm64.yml` (used by `release.yml` and aggregates)
- Aggregates for manual builds:
  - `build-windows-all.yml` (calls the two Windows reusables)
  - `build-macos-linux-all.yml` (macOS x64/arm64 + Linux DEB/RPM)

## Toolchain & Commands
- Node.js 20.x, npm 10.x
- Install with `npm install --no-audit --no-fund` (avoid `npm ci` on hosted runners)
- Local build scripts (per arch):
  - `npm run build:mac-x64`, `npm run build:mac-arm64`
  - `npm run build:win-x64`, `npm run build:win-arm64`
  - `npm run build:linux-x64`

## Artifacts & Naming
- Windows: `VibeMD-win32-{arch}-{version}.{msi,zip}`
- macOS: `VibeMD-darwin-{arch}-{version}.{zip,dmg}`
- Linux: `vibemd_{version}_amd64.deb`, `vibemd-{version}-x86_64.rpm`
- Release workflow copies/renames artifacts into a stable `upload/` set before publishing.

## Signing & Notarization (Env‑Gated)
- Windows (EXE/MSI via Squirrel/WiX):
  - `WINDOWS_CERT_BASE64` (Base64 PFX), `WINDOWS_CERT_PASSWORD`
- macOS (app signing + notarization):
  - `MAC_CODESIGN_IDENTITY`, `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, `APPLE_TEAM_ID`
- Without secrets, builds are unsigned but still produced.

## Versioning & Immutability
- Releases are immutable. The orchestrator bumps the patch if a release for the requested tag already exists.
- Do not edit existing releases to swap assets; publish a new version instead.
- Docs with "Version:" labels are auto‑updated by the release workflow.

## Do / Don’t
- Do keep Node 20 and `npm install --no-audit --no-fund` in CI.
- Do use the Windows reusable workflows instead of re‑implementing steps.
- Do keep artifact naming consistent (scripts assume these patterns).
- Don’t downgrade node/npm or switch back to `npm ci` on runners.
- Don’t modify `release.yml` to overwrite existing releases; rely on auto‑bump.

## Forge Makers (Current)
- ZIP (darwin, win32), DMG (darwin), WiX (MSI), DEB, RPM are enabled. (EXE/Squirrel disabled.)

## Common Paths
- Windows: `out/make/zip/win32/{arch}/*.zip`, `out/make/wix/{arch}/*.msi`, `out/make/squirrel.windows/{arch}/*.exe`
- macOS: `out/make/zip/darwin/{arch}/*.zip`
- Linux: `out/make/deb/x64/*.deb`, `out/make/rpm/x64/*.rpm`

## Quick How‑To (Release)
1) Open Actions ➜ Release ➜ Run workflow
2) Optionally set `version` (e.g., `1.2.3`); set `prerelease` if needed
3) Workflow updates docs and package.json, builds, publishes release with standardized assets

If something fails, prefer adjusting the smallest workflow step or asset glob rather than changing the conventions above.
