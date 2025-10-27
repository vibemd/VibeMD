# VibeMD Release Notes

**Application:** VibeMD
**Current Version:** 1.0.12
**Release Date:** 2025-10-27
**License:** MIT

---

## v1.0.12 — 2025-10-27

### Highlights

**Editor Experience**
- Plain text (CodeMirror) view no longer hides the scrollbar thumb or repositions the caret incorrectly after switching back from WYSIWYG.
- Outline navigation automatically flips from plain text to WYSIWYG, waits for the editor to mount, and focuses the chosen heading reliably.
- Added regression coverage for the navigation store plus `data-testid` hooks to keep smoke tests green.

**macOS User Experience**
- Forced Chromium to use the mock keychain and basic password store so unsigned builds stop prompting for keychain access.
- Updated build instructions so macOS DMG/ZIP artifacts carry the new keychain behaviour.

**Release Automation**
- New `get-next-release-version` script increments from the latest Git tag, keeping CI builds in sync even when package.json lags.
- Staging script now honours explicit `RELEASE_VERSION` overrides, reducing manual rename work.
- Refreshed marketing site content to match the 1.0.12 feature set.

**Documentation**
- Updated release notes to reflect the latest fixes and behaviour.

### Technical Details

- **Platform Support:** Windows (x64, ARM64), macOS (Apple Silicon, Intel), Linux (x64, ARM64)
- **Installers:** MSI/ZIP (Windows), DMG/ZIP (macOS), DEB (Linux)
- **Electron Version:** 38.2.2
- **React Version:** 19.2.0
- **Tiptap Version:** 3.7.1

### Known Issues

- Installers remain unsigned; users must approve OS security prompts (see Installation Notes).
- Windows 1.0.12 binaries still need to be rebuilt and uploaded before final release.
- Code signing and notarisation work is ongoing.

### Installation Notes

> ⚠️ **Security Notice**
> Installers and packages are currently **unsigned**. This is expected behaviour until code signing certificates are provisioned. You will need to explicitly allow installation:
>
> - **Windows:** Click "More info" then "Run anyway" when SmartScreen appears.
> - **macOS:** Control-click the app and select "Open" to bypass Gatekeeper.
> - **Linux:** Use `--force-overwrite` if the package manager warns about unsigned packages.
>
> Code signing will be implemented in a future release.

---

## v1.0.11 — 2025-10-26

### Improvements

**UI & Theming:**
- Improved dark mode support for link and image dialogs
- Context menus now respect dark/light theme settings
- Replaced hardcoded light colors with theme-aware tokens for better visual consistency

**Global Shortcuts:**
- Enhanced keyboard shortcut handling across the application
- Fixed issues with global shortcuts not triggering in certain contexts

**Build System:**
- Fixed macOS ARM64 release signing configuration
- Improved Windows installer versioning with proper MSI filenames
- Added option to skip WiX maker for faster local ZIP-only builds
- Normalized package.json encoding by removing BOM characters
- Updated WiX maker `appIconPath` to avoid icon extraction dependencies

**Documentation:**
- Comprehensive overhaul of all documentation files
- Updated architecture guide with detailed technical specifications
- Expanded build and deploy guide with complete CI/CD pipeline documentation
- Enhanced user guide with accurate feature descriptions
- Updated build strategy documentation

### Technical Details

- **Platform Support:** Windows (x64, ARM64), macOS (Apple Silicon, Intel), Linux (x64)
- **Installers:** MSI and ZIP (Windows), DMG and ZIP (macOS), DEB and RPM (Linux)
- **Electron Version:** 38.2.2
- **React Version:** 19.2.0
- **Tiptap Version:** 3.7.1

### Known Issues

- Installers remain unsigned; users will see OS security warnings during installation
- Notification system not yet implemented
- Syntax highlighting for code blocks is basic (full language support planned)

### Installation Notes

> ⚠️ **Security Notice**
> Installers and packages are currently **unsigned**. This is expected behavior as code signing certificates have not yet been provisioned. You will need to explicitly allow installation:
>
> - **Windows:** Click "More info" then "Run anyway" when SmartScreen appears
> - **macOS:** Control-click the app and select "Open" to bypass Gatekeeper
> - **Linux:** Use `--force-overwrite` if package manager warns about unsigned packages
>
> Code signing will be implemented in a future release.

---

## v1.0.10 — 2025-10-24

### Features

**Core Functionality:**
- Multi-document editing with tabbed interface
- Template system for reusable document structures
- Document outline navigation with collapsible headings
- Auto-save functionality with configurable intervals
- Native print support with HTML rendering

**Editor Features:**
- Full WYSIWYG markdown editing powered by Tiptap
- Rich text formatting (bold, italic, strikethrough, code)
- Headings (H1-H6) with quick formatting toolbar
- Bullet lists, ordered lists, and task lists (with interactive checkboxes)
- Tables with context menu operations (add/delete rows/columns)
- Mathematical formulas (inline and block) using KaTeX
- Links and images with dialog-based insertion
- Text alignment (left, center, right)
- Superscript and subscript support
- Blockquotes and horizontal rules
- Code blocks with language support

**Settings:**
- Theme selection (light, dark, system)
- Customizable auto-save interval
- Configurable default save and templates paths
- Editor font size and family customization
- Option to open last document on startup

**Build & Deployment:**
- Cross-platform builds for Windows, macOS, and Linux
- Platform-specific installers (MSI, DMG, DEB, RPM, ZIP)
- Automated CI/CD pipeline with GitHub Actions
- Nightly release workflow
- Artifact staging with manifest generation

### Technical Implementation

- Electron 38.2.2 with secure three-process architecture
- React 19.2.0 with functional components and hooks
- Zustand state management for documents, settings, templates, and UI
- TypeScript throughout the codebase for type safety
- Tailwind CSS for styling with Radix UI component primitives
- Webpack bundling with hot module reloading in development

### Bug Fixes

- Fixed file save dialog not appearing on first save
- Resolved template loading issues on startup
- Corrected document state synchronization between editor and sidebar
- Fixed theme switching not persisting correctly
- Addressed memory leak in editor instance management

---

## v1.0.9 — 2025-10-23

### Initial Public Release

This was the first public release of VibeMD with core markdown editing functionality.

**Highlights:**
- Basic WYSIWYG markdown editor
- File open/save operations
- Settings management
- Cross-platform support

> ⚠️ **Security Notice**
> Installers are unsigned. See installation notes above.

---

## Release Checklist

For maintainers preparing new releases:

1. [ ] Update version in `package.json`
2. [ ] Update this `RELEASE_NOTES.md` with changelog
3. [ ] Run `npm run lint` to ensure code quality
4. [ ] Test locally with `npm start`
5. [ ] Commit version bump to `main` branch
6. [ ] Push to trigger CI/CD builds
7. [ ] Monitor GitHub Actions for build success
8. [ ] Wait for nightly release or trigger manually
9. [ ] Download and test installers on each platform
10. [ ] Verify documentation was auto-updated
11. [ ] Announce release

---

## Future Roadmap

### Planned Features

**Editor Enhancements:**
- Syntax highlighting for code blocks with language detection
- Diagram support (Mermaid, PlantUML)
- Collaborative editing with real-time sync
- Split-pane editing (markdown source + preview)
- Custom themes and editor color schemes

**Export Capabilities:**
- Export to PDF with styling
- Export to DOCX (Microsoft Word)
- Export to HTML with embedded styles
- Export to LaTeX

**Template System:**
- Template marketplace/sharing
- Template variables and placeholders
- Template categories and organization

**Integrations:**
- Git integration for version control
- Cloud sync (Google Drive, Dropbox, OneDrive)
- Third-party plugin support
- API for automation

**Performance:**
- Virtual scrolling for very large documents
- Web Workers for heavy processing
- Incremental markdown parsing
- Faster startup times with code splitting

**User Experience:**
- Notification system for saves, errors, updates
- Command palette for quick actions
- Recent files quick access
- Drag-and-drop image uploads with local storage
- Find and replace functionality

### Infrastructure

**Code Signing:**
- Apple Developer certificate for macOS
- Code signing certificate for Windows
- Automated signing in CI/CD pipeline

**Testing:**
- Jest unit tests for services and utilities
- Integration tests for IPC communication
- End-to-end tests with Playwright
- Visual regression testing

**Distribution:**
- Automatic update system
- Beta/RC release channels
- Homebrew cask for macOS
- Chocolatey package for Windows
- Snap/Flatpak for Linux

---

## Version History Summary

| Version | Release Date | Highlights |
|---------|--------------|------------|
| 1.0.12  | 2025-10-27   | Plain text editor stability, outline navigation reliability, macOS keychain workaround |
| 1.0.11  | 2025-10-26   | Dark mode improvements, enhanced shortcuts, build fixes |
| 1.0.10  | 2025-10-24   | Multi-document editing, templates, comprehensive features |
| 1.0.9   | 2025-10-23   | Initial public release with core editor |

---

## Feedback and Support

We welcome feedback, bug reports, and feature requests!

- **GitHub Issues:** [https://github.com/ONLY1-Group/VibeMD/issues](https://github.com/ONLY1-Group/VibeMD/issues)
- **Email:** hello@vibemd.app
- **Documentation:** [https://github.com/ONLY1-Group/VibeMD/tree/main/docs](https://github.com/ONLY1-Group/VibeMD/tree/main/docs)

When reporting issues, please include:
- VibeMD version (from Settings → About)
- Operating system and version
- Steps to reproduce the issue
- Expected vs. actual behavior
- Any error messages or console logs

---

## License

VibeMD is released under the MIT License. See [LICENSE](../LICENSE) for details.

---

**Version:** 1.0.12
**Release Date:** 2025-10-27
**Developed by:** ONLY1 Pty Ltd
