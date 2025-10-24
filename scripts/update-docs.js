/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const docsDir = path.join(repoRoot, 'docs');
const repoSlug = process.env.GITHUB_REPOSITORY || 'ONLY1-Group/VibeMD';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeFile(targetPath, contents) {
  if (typeof contents !== 'string') {
    throw new TypeError(`Expected string contents when writing ${targetPath}, received ${typeof contents}`);
  }
  fs.writeFileSync(targetPath, `${contents.trim()}\n`, 'utf8');
  console.log(`Wrote ${path.relative(repoRoot, targetPath)}`);
}

function renderHeader(title, level = 1) {
  return `${'#'.repeat(level)} ${title}`;
}

function renderUnsignedNotice() {
  return [
    '> ⚠️ **Security notice**',
    '> Installers and packages are currently unsigned. Expect operating system prompts during installation until code signing certificates are issued.'
  ].join('\n');
}

function renderRootReadme(pkg) {
  return `
${renderHeader(pkg.productName)}

${pkg.description}

${renderUnsignedNotice()}

- Website: [https://vibemd.app](https://vibemd.app)
- Issues: [https://github.com/${repoSlug}/issues](https://github.com/${repoSlug}/issues)

${renderHeader('Getting Started', 2)}

1. Install dependencies: \`npm install\`
2. Run the app in development mode: \`npm start\`
3. Build release artifacts: \`npm run make\`

See \`docs/USER_GUIDE.md\` and \`docs/BUILD_AND_DEPLOY_GUIDE.md\` for detailed instructions.

${renderHeader('Contributing', 2)}

We welcome issues and pull requests. Please run \`npm run lint\` before opening a PR. Automated smoke tests execute as part of the build workflows to keep main shippable.

${renderHeader('License', 2)}

${pkg.license} © ${new Date().getFullYear()} ${pkg.author?.name || 'ONLY1 Pty Ltd'}.
`.trim();
}

function renderUserGuide(pkg, version, releaseDate) {
  return `
${renderHeader('User Guide')}

**Application:** ${pkg.productName} (${pkg.description})  
**Version:** ${version}  
**Updated:** ${releaseDate}

${renderHeader('Installation', 2)}

- **Windows:** Download the MSI or ZIP package from the releases page. As the installer is unsigned, Windows SmartScreen will prompt for confirmation—choose “More info” then “Run anyway”.
- **macOS:** Download the DMG or ZIP. Control-click to open unsigned apps if Gatekeeper warns you.
- **Linux:** Choose the DEB or RPM package for your distribution. Some distributions require confirming the unsigned package before installing.

${renderHeader('Quick Start', 2)}

1. Launch ${pkg.productName}.
2. Create or open a markdown document from the home screen.
3. Use the WYSIWYG editor or switch to code view for raw markdown.
4. Save documents locally or export to PDF/HTML via the File menu.

${renderHeader('Key Features', 2)}

- Dual-pane WYSIWYG and markdown editing
- Template management with live previews
- Math, table, and diagram support powered by Tiptap extensions
- System tray integration with recent document shortcuts
- Automatic update checks (manual install required while builds remain unsigned)

${renderHeader('Troubleshooting', 2)}

- Use \`Help → Toggle Developer Tools\` to inspect console output.
- Run \`npm run lint\` locally to catch common issues before reporting bugs.
- File detailed issues with logs at [GitHub Issues](https://github.com/${repoSlug}/issues).
`.trim();
}

function renderArchitectureGuide(pkg, version, releaseDate) {
  return `
${renderHeader('Architecture Guide')}

**Application:** ${pkg.productName}  
**Version:** ${version}  
**Updated:** ${releaseDate}

${renderHeader('Overview', 2)}

${pkg.productName} is an Electron application using the Electron Forge + Webpack toolchain. The renderer is built with React and Tailwind CSS, while the editor experience relies on Tiptap.

${renderHeader('Key Components', 2)}

- **Electron Main Process** (\`src/main\`): boots the app, coordinates native integrations, and exposes APIs to the renderer through preload bindings.
- **Preload Layer** (\`src/preload\`): bridges secure, typed IPC channels between the renderer and main processes.
- **Renderer** (\`src/renderer\`): React-based UI with modular stores (Zustand) and rich Markdown editing features.
- **Build Pipeline** (\`webpack.*.config.ts\` + \`forge.config.ts\`): Webpack handles bundling, Forge manages packaging for each target platform.

${renderHeader('State Management', 2)}

- Uses Zustand stores for document state, preferences, and cross-window communication.
- IPC communication is wrapped in typed helpers to keep the renderer sandboxed.

${renderHeader('File & Template Handling', 2)}

- Templates live under \`templates/\` and are bundled at build time.
- Documents are saved through the main process using native dialogs to ensure correct permissions.

${renderHeader('Extensibility', 2)}

- Add new renderer features by extending the Tiptap configuration in \`src/renderer/editor\`.
- Native integrations should expose explicit IPC channels and be registered in the preload layer to maintain security boundaries.

${renderHeader('Build Outputs', 2)}

- Artifacts are produced via Electron Forge makers defined in \`forge.config.ts\`.
- Platform-specific installers bundle compiled assets from \`.webpack/\`.
- Smoke tests run on every build to ensure renderer and preload bundles compile and lint cleanly.
`.trim();
}

function renderBuildGuide(pkg, version, releaseDate) {
  return `
${renderHeader('Build and Deploy Guide')}

**Application:** ${pkg.productName}  
**Version:** ${version}  
**Updated:** ${releaseDate}

${renderHeader('Prerequisites', 2)}

- Node.js 20.x
- npm 10.x
- Platform toolchains:
  - **Windows:** WiX Toolset (pre-installed on GitHub-hosted runners)
  - **macOS:** Xcode command line tools, Homebrew packages \`dpkg\` and \`rpm\`
  - **Linux Builds:** Executed on macOS runners using the Homebrew toolchain

${renderHeader('Local Build Steps', 2)}

1. Install dependencies: \`npm install\`
2. Run lint + smoke tests: \`node scripts/run-smoke-tests.js\`
3. Build for your platform:
   - Windows x64: \`npm run build:win-x64\`
   - Windows ARM64: \`npm run build:win-arm64\`
   - macOS arm64: \`npm run build:mac-arm64\`
   - macOS x64: \`npm run build:mac-x64\`
   - Linux x64: \`npm run build:linux-x64\`

${renderHeader('CI/CD Strategy', 2)}

- **Windows Build Workflow:** Runs on Windows runners, produces MSI and ZIP for x64 and ARM64, and uploads artifacts with manifests.
- **macOS Build Workflow:** Runs on macOS runners, producing DMG/ZIP for Apple Silicon and Intel in separate jobs so each architecture can ship independently.
- **Linux Build Workflow:** Runs on macOS runners, installs Homebrew packaging dependencies, produces DEB/RPM assets via the custom RPM maker, and stages manifests for release orchestration.
- **Nightly Release Workflow:** Checks for a new semantic version, downloads ready artifacts, cuts a GitHub release, and invokes the documentation workflow.
- **Documentation Workflow:** Generates README, guides, release notes, and this build strategy document, committing updates directly to \`main\`.

${renderHeader('Release Process', 2)}

1. Merge version bump to \`main\`.
2. Allow platform build workflows to complete and upload artifacts.
3. Nightly release workflow publishes a release if matching artifacts are available.
4. Documentation workflow updates Markdown guides with the latest release information.

${renderHeader('Security Notes', 2)}

- Installers remain unsigned until certificates are provisioned. Communicate this prominently in release notes.
- Secrets (signing certificates, Apple notarization) should be injected via GitHub environments when available.
`.trim();
}

function renderBuildStrategyDoc(pkg, version, releaseDate) {
  return `
${renderHeader('Build Strategy')}

**Application:** ${pkg.productName}  
**Version:** ${version}  
**Documented:** ${releaseDate}

${renderHeader('Goals', 2)}

- Deliver nightly-built, ready-to-release artifacts for Windows, macOS, and Linux.
- Separate build, release, and documentation responsibilities.
- Maintain transparent documentation that reflects the current release state.

${renderHeader('Workflows', 2)}

1. **build-windows.yml** — Windows-hosted runners build MSI and ZIP installers for x64 and ARM64.
2. **build-macos.yml** — macOS-hosted runners build DMG/ZIP for Apple Silicon and Intel in discrete jobs so architectures can release on separate cadences.
3. **build-linux.yml** — macOS-hosted runners install Homebrew packaging tooling and produce DEB/RPM outputs using the custom RPM maker.
4. **release-nightly.yml** — Nightly scheduler checks for unreleased versions, downloads ready build artifacts, publishes a GitHub release, and invokes docs updates.
5. **update-docs.yml** — Regenerates README and all guides, committing directly to main with release metadata supplied by the caller.

${renderHeader('Artifact Management', 2)}

- Each build job emits a manifest (\`manifest.json\`) containing version, platform, architecture, formats, checksums, and unsigned status.
- Artifact names follow \`build-<platform>-<arch>-v<version>\` for easy discovery via the GitHub Actions API.
- Release workflow only publishes artifacts whose manifests match the target version, enabling partial releases.

${renderHeader('Testing', 2)}

- \`scripts/run-smoke-tests.js\` runs linting and renderer bundle checks in CI.
- Future enhancements can expand test coverage without altering the release pipeline design.

${renderHeader('Documentation Updates', 2)}

- Documentation is regenerated after every release with authoritative data (version, date, unsigned status).
- Auto-generated files: README.md, docs/USER_GUIDE.md, docs/ARCHITECTURE_GUIDE.md, docs/BUILD_AND_DEPLOY_GUIDE.md, docs/RELEASE_NOTES.md, docs/BUILD_STRATEGY.md.
- Additional ad-hoc documentation should live in \`docs/\` alongside these core guides.

${renderHeader('Next Steps', 2)}

- Introduce code-signing certificates and notarization when available.
- Expand automated testing and artifact verification (e.g., checksum validation on download).
- Evaluate release candidate channels (beta) once signing is in place.
`.trim();
}

function renderReleaseNotes(existingNotes, version, releaseDate, changelog) {
  const intro = '# Release Notes';
  const noteBody = changelog
    ? changelog.trim()
    : '- Incremental improvements and stability fixes.';

  const newEntry = `
## v${version} — ${releaseDate}

${noteBody}

${renderUnsignedNotice()}
`.trim();

  const sanitizedExisting = existingNotes
    .split('\n')
    .filter((line, idx, arr) => {
      // Remove previous entry for the same version
      if (line.startsWith(`## v${version} `)) {
        // Skip until next header
        let i = idx + 1;
        while (i < arr.length && !arr[i].startsWith('## ')) {
          arr[i] = '';
          i += 1;
        }
        return false;
      }
      return true;
    })
    .filter(Boolean)
    .join('\n');

  if (!sanitizedExisting || sanitizedExisting.trim() === intro) {
    return `${intro}\n\n${newEntry}\n`;
  }

  const withoutIntro = sanitizedExisting.replace(`${intro}\n`, '').trim();
  return `${intro}\n\n${newEntry}\n\n${withoutIntro}\n`;
}

function main() {
  const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
  const version = process.env.RELEASE_VERSION || pkg.version;
  const releaseDate = process.env.RELEASE_DATE || new Date().toISOString().slice(0, 10);
  let changelog = process.env.RELEASE_CHANGELOG || '';
  const changelogPath = process.env.RELEASE_CHANGELOG_PATH;
  if (changelogPath && fs.existsSync(changelogPath)) {
    changelog = fs.readFileSync(changelogPath, 'utf8');
  }

  ensureDir(docsDir);

  writeFile(path.join(repoRoot, 'README.md'), renderRootReadme(pkg));
  writeFile(path.join(docsDir, 'USER_GUIDE.md'), renderUserGuide(pkg, version, releaseDate));
  writeFile(path.join(docsDir, 'ARCHITECTURE_GUIDE.md'), renderArchitectureGuide(pkg, version, releaseDate));
  writeFile(path.join(docsDir, 'BUILD_AND_DEPLOY_GUIDE.md'), renderBuildGuide(pkg, version, releaseDate));
  writeFile(path.join(docsDir, 'BUILD_STRATEGY.md'), renderBuildStrategyDoc(pkg, version, releaseDate));

  const releaseNotesPath = path.join(docsDir, 'RELEASE_NOTES.md');
  const existingNotes = fs.existsSync(releaseNotesPath)
    ? fs.readFileSync(releaseNotesPath, 'utf8')
    : '# Release Notes\n';

  const updatedNotes = renderReleaseNotes(existingNotes, version, releaseDate, changelog);
  writeFile(releaseNotesPath, updatedNotes);
}

if (require.main === module) {
  main();
}

module.exports = {
  main
};
