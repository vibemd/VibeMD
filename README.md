# VibeMD

A modern, cross-platform desktop markdown editor with rich WYSIWYG editing, plain text markdown mode, templates, and native OS integration.

**Current Version:** 1.0.17 | **License:** MIT © 2025 ONLY1 Pty Ltd

- Website: [https://vibemd.app](https://vibemd.app)
- Issues: [https://github.com/vibemd/VibeMD/issues](https://github.com/vibemd/VibeMD/issues)
- Releases: [https://github.com/vibemd/VibeMD/releases](https://github.com/vibemd/VibeMD/releases)

## What is VibeMD?

VibeMD is a feature-rich Electron-based markdown editor designed for creative and technical writers. It combines a beautiful WYSIWYG editor (powered by Tiptap) with a raw markdown code editor (powered by CodeMirror), giving users the flexibility to edit in their preferred style. The application includes a powerful template system, comprehensive settings, cross-platform autosave, and native OS integration.

### Key Features

**Editing Modes**
- **WYSIWYG Editor** (Tiptap): Rich text editing with live preview
- **Plain Text Editor** (CodeMirror 6): Raw markdown editing with syntax highlighting
- Toggle seamlessly between modes with a single click

**Formatting & Rich Content**
- Text formatting: Bold, italic, strikethrough, subscript, superscript, code
- Headings: H1–H6 with auto-numbering
- Lists: Bullet, ordered, and interactive task lists
- Tables: Create, edit, and manage table cells, rows, and columns
- Mathematical formulas: Inline and block equations with KaTeX
- Links and images: Dialog-based insertion with preview
- Code blocks: Syntax-highlighted with language detection
- Text alignment: Left, center, right alignment

**Document Management**
- Multi-document editing with tabbed interface
- Auto-save with configurable intervals (default: 5 minutes)
- Open last document on startup (configurable)
- Support for `.md`, `.markdown`, and `.vibe` file formats
- File association: Double-click to open markdown files
- Find functionality: Search text across documents with real-time highlighting and match navigation (Ctrl/Cmd+F)

**Template System**
- Create reusable document templates
- Live preview in sidebar
- Quick-start new documents from templates
- Store templates in dedicated folder

**Settings & Customization**
- Theme: Light, Dark, or System (OS-aware)
- Editor font size and family customization
- Line number toggle
- Default save location
- Templates directory
- Print-friendly documents with HTML rendering

**Cross-Platform Support**
- Windows (x64, ARM64): MSI installer + ZIP portable
- macOS (Apple Silicon, Intel): DMG + ZIP
- Linux (x64): DEB + RPM packages

> ⚠️ **Security Notice**
> Installers and packages are currently **unsigned**. Operating systems will prompt with security warnings during installation. This is expected—VibeMD is safe, free of malware, and does not collect user data. See [INSTALLATION_SECURITY_WARNINGS.md](docs/INSTALLATION_SECURITY_WARNINGS.md) for bypass instructions.

## Getting Started

### For Users

Download the latest release for your platform:
- **Windows:** MSI (recommended) or ZIP
- **macOS:** DMG or ZIP
- **Linux:** DEB or RPM

See [Installation & Security Warnings](docs/INSTALLATION_SECURITY_WARNINGS.md) for OS-specific instructions.

### For Developers

1. **Install dependencies:** `npm install`
2. **Run in development mode:** `npm start` (includes hot module reloading)
3. **Run linting:** `npm run lint`
4. **Build for your platform:**
   ```bash
   npm run make                    # Current platform only
   npm run build:all               # All platforms
   npm run build:all-windows       # Windows (x64 + ARM64)
   npm run build:all-mac           # macOS (arm64 + x64)
   npm run build:all-linux         # Linux x64
   ```

## Technology Stack

- **Framework:** Electron 38.2.2 with Electron Forge 7.10.2
- **UI:** React 19.2.0 with TypeScript 5.6.3
- **Styling:** Tailwind CSS 3.4.18 + PostCSS
- **Editors:** Tiptap 3.7.1 (WYSIWYG) + CodeMirror 6 (markdown)
- **State Management:** Zustand 5.0.8
- **Components:** Radix UI + Lucide React icons
- **Markdown:** Marked, Remark, Turndown, KaTeX
- **Build:** Webpack 5 + Node.js 20+

## Documentation

- [User Guide](docs/USER_GUIDE.md) — Feature overview and basic usage
- [Architecture Guide](docs/ARCHITECTURE_GUIDE.md) — Technical architecture and design patterns
- [Build & Deploy Guide](docs/BUILD_AND_DEPLOY_GUIDE.md) — Local builds, CI/CD pipeline, release process
- [Build Strategy](docs/BUILD_STRATEGY.md) — Workflows, artifact management, testing
- [Installation Security Warnings](docs/INSTALLATION_SECURITY_WARNINGS.md) — OS-specific security bypass instructions
- [Release Notes](docs/RELEASE_NOTES.md) — Version history and changelog

## Development Workflow

### Quick Commands

```bash
npm install                       # Install dependencies
npm start                         # Launch dev app with hot reload
npm run lint                      # Run ESLint
npm run test                      # Run tests
npm run make                      # Build for current platform
npm run build:all                 # Build all platforms
npm run clean                     # Clear build artifacts
```

### Project Structure

```
src/
├── main/                    # Electron main process
│   ├── handlers/           # IPC request handlers
│   └── index.ts            # App entry point
├── preload/                # Secure IPC bridge
├── renderer/               # React UI
│   ├── components/         # React components
│   ├── stores/             # Zustand state stores
│   ├── services/           # Business logic layer
│   └── hooks/              # Custom React hooks
└── shared/                 # Shared types
```

## Contributing

We welcome contributions! Please:

1. Run `npm run lint` before opening a PRs
2. Ensure all tests pass locally
3. Update documentation for user-facing changes
4. Include clear commit messages

See [GitHub Issues](https://github.com/vibemd/VibeMD/issues) to report bugs or request features.

## Code Quality

- **Linting:** ESLint with TypeScript support
- **Type Safety:** Full TypeScript coverage
- **Testing:** Unit tests for critical paths
- **Security:** Electron security hardening (context isolation, fuses, CSP)

## Future Roadmap

**Planned Features**
- Syntax highlighting for code blocks
- Diagram support (Mermaid, PlantUML)
- Collaborative editing
- Split-pane editor (source + preview)
- PDF export with styling
- Git integration
- Cloud sync (Google Drive, Dropbox, OneDrive)
- Automatic updates
- Command palette for quick actions

**Infrastructure**
- Code signing for Windows and macOS
- Apple notarization for macOS
- Automatic update system
- Beta release channels
- Distribution via Homebrew, Chocolatey, Snap/Flatpak

## Support & Feedback

- **GitHub Issues:** [Report bugs or request features](https://github.com/vibemd/VibeMD/issues)
- **Email:** hello@vibemd.app
- **Documentation:** [Full documentation](https://github.com/vibemd/VibeMD/tree/main/docs)

When reporting issues, please include:
- VibeMD version (Settings → About)
- Operating system and version
- Steps to reproduce
- Expected vs. actual behavior
- Error messages or console logs

## License

MIT © 2025 ONLY1 Pty Ltd. See [LICENSE](LICENSE) for details.
