# Release Notes

**Application:** VibeMD
**Latest Version:** 1.0.17
**Updated:** 2025-01-10
**License:** MIT © 2025 ONLY1 Pty Ltd

---

## v1.0.17 — 2025-01-10

### Highlights

**New Feature: Find and Replace**

- **Find Functionality** — Search for text across your document with real-time highlighting
- **Sidebar Integration** — Find bar integrated at the bottom of the sidebar for easy access
- **Default Open** — Find bar is open by default when you launch VibeMD for immediate accessibility (users can close it manually)
- **Dynamic Match Counter** — Live indicator showing the number of search results found
- **Navigation Arrows** — Previous/Next buttons to traverse through all matches
- **Dual Editor Support** — Works seamlessly in both WYSIWYG (TipTap) and Plain Text (CodeMirror) editor modes
- **Keyboard Shortcuts** —
  - `Cmd/Ctrl+F` to toggle the find bar on/off
  - `Escape` to close the find bar
  - `Enter` to navigate to next match
  - `Shift+Enter` to navigate to previous match
- **Visual Feedback** — Active match is highlighted differently from other matches
- **Accurate Text Selection** — Precise position calculation for ProseMirror document structure ensures correct highlighting in WYSIWYG mode

### Technical Improvements

- **Editor Service Abstraction** — New `findService.ts` provides editor-agnostic search interface
- **Position Mapping** — Accurate conversion from flat text positions to ProseMirror document positions
- **Real-time Search** — Debounced search updates as you type
- **State Management** — Integrated with Zustand UI store for find query, matches, and navigation state
- **Default State** — Modified `findBarVisible` default from `false` to `true` in UI store (uiStore.ts:49) for improved accessibility

### Included Builds

| Platform | Architectures | Formats |
|----------|---------------|---------|
| Windows | x64, ARM64 | MSI, ZIP |
| macOS | arm64, x64 | DMG, ZIP |
| Linux | x64, ARM64 | DEB, RPM |

### Known Issues

- Replace functionality not yet implemented (find-only in this release)
- Installers are **unsigned** — Expected security warnings on installation (see [INSTALLATION_SECURITY_WARNINGS.md](INSTALLATION_SECURITY_WARNINGS.md))

---

## v1.0.16 — 2025-10-28

### Highlights

**Major Release:** Complete documentation review and refresh for v1.0.16 as baseline release

- **Comprehensive Documentation Overhaul** — All docs rewritten from ground up to reflect current v1.0.16 architecture and features
- **README.md Expansion** — Enhanced with feature details, technology stack, and development workflow
- **User Guide** — Complete rewrite with installation steps, features reference, keyboard shortcuts, and troubleshooting
- **Architecture Guide** — Detailed technical documentation with diagrams, process architecture, and extensibility patterns
- **Build & Deploy Guide** — Step-by-step local build instructions, platform-specific guidance, and CI/CD pipeline documentation
- **Build Strategy** — Comprehensive overview of GitHub Actions workflows, artifact management, and release processes
- **Installation Security Guide** — OS-specific bypass instructions for unsigned installers with verification methods
- **Plain Text Editor** — CodeMirror 6 integration with syntax highlighting and seamless WYSIWYG/Code toggle
- **Autosave** — Cross-platform autosave with configurable intervals (default 5 minutes)
- **Template System** — Pre-formatted `.vibe` file support for reusable document structures
- **Settings Persistence** — Theme, editor, and file preferences saved across sessions
- **File Associations** — Double-click markdown files to open in VibeMD

### Included Builds

| Platform | Architectures | Formats |
|----------|---------------|---------|
| Windows | x64, ARM64 | MSI, ZIP |
| macOS | arm64, x64 | DMG, ZIP |
| Linux | x64 | DEB, RPM |

### Technical Improvements

- **Electron 38.2.2** with Forge 7.10.2 for robust cross-platform builds
- **React 19.2.0** with TypeScript 5.6.3 for type-safe UI
- **Tiptap 3.7.1** WYSIWYG editor + **CodeMirror 6** markdown editor
- **Zustand 5.0.8** state management for documents, settings, templates
- **Tailwind CSS 3.4.18** with Radix UI components
- **KaTeX** for mathematical formula support
- **Full TypeScript** coverage across main, preload, and renderer processes
- **Webpack 5** with source maps and CSS processing
- **Electron Fuses** security hardening (ASAR validation, context isolation)

### Breaking Changes

None — v1.0.16 is the baseline release establishing current feature set.

### Known Issues

- Installers are **unsigned** — Expected security warnings on installation (see [INSTALLATION_SECURITY_WARNINGS.md](INSTALLATION_SECURITY_WARNINGS.md))
- Code signing certificates not yet provisioned
- Notification system not implemented
- Syntax highlighting for code blocks is basic

### Installation

See [INSTALLATION_SECURITY_WARNINGS.md](INSTALLATION_SECURITY_WARNINGS.md) for OS-specific security warning resolution.

> ⚠️ **Security Notice**
> Installers and packages are currently **unsigned**. This is expected. VibeMD is safe, free of malware, and does not collect user data. See installation guide for bypass instructions.

---

## v1.0.13 — 2025-10-28

### Highlights
- Documented the mobile strategy experiment for upcoming tablet builds and shared prerequisites.
- Updated the About dialog to list core editor dependencies including ProseMirror and CodeMirror.
- Regenerated architecture and build guides to reflect the streamlined documentation workflow.

### Included Builds
- **Windows x64:** MSI, ZIP
- **Windows ARM64:** MSI, ZIP
- **macOS arm64:** DMG, ZIP
- **macOS x64:** DMG, ZIP
- **Linux x64:** DEB, RPM

### Installation Notes
Installers remain unsigned. You may see security prompts:
- **Windows:** Click "More info" then "Run anyway"
- **macOS:** Control-click the app and choose "Open"
- **Linux:** Use standard package manager installation

> ⚠️ **Security Notice**
> Installers and packages are currently unsigned. Expect operating system prompts during installation until code signing certificates are issued.

## v1.0.12 — 2025-10-27
## Highlights
- Introduced plain text editing interface (CodeMirror 6) with toggle on/off in Settings
- Plain text editor scroll thumb now starts at the top and preserves caret position when toggling views.
- Outline clicks auto-switch back to WYSIWYG and focus the chosen heading without errors.
- macOS builds are configured to bypass keychain prompts while installers remain unsigned.
- Automated version detection keeps build workflows aligned with the next semantic tag.

## Included builds
- **macOS arm64:** DMG, ZIP
- **macOS x64:** DMG, ZIP
- **Windows x64:** MSI, ZIP
- **Windows arm64:** MSI, ZIP
- **Linux x64:** DEB
- **Linux arm64:** DEB

## Installation Notes
Installers are currently unsigned. You may see security prompts:
- Windows: click "More info" then "Run anyway".
- macOS: Control-click the app and choose "Open".
- Linux: use `--force-overwrite` if your package manager warns about unsigned packages.

Code signing and notarisation are planned for a future release.
> ⚠️ **Security notice**
> Installers and packages are currently unsigned. Expect operating system prompts during installation until code signing certificates are issued.
# VibeMD Release Notes
**Application:** VibeMD
**Current Version:** 1.0.13
**Release Date:** 2025-10-28
**License:** MIT
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
- Replace functionality for find and replace (find implemented in v1.0.17)
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
| 1.0.17  | 2025-01-10   | Find and Replace functionality with dual editor support, default-open find bar |
| 1.0.16  | 2025-10-28   | Comprehensive documentation overhaul, baseline release |
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
**Version:** 1.0.13
**Release Date:** 2025-10-28
**Developed by:** ONLY1 Pty Ltd
