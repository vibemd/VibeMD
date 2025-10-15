# VibeMD

A cross-platform desktop markdown editor for Windows, macOS, and Linux featuring WYSIWYG editing, split-view editing, template system, and native OS integration.

## Features

- **Three Editor Modes**: WYSIWYG (Milkdown Crepe), Split view (CodeMirror + preview), and Preview-only
- **Template System**: Create and use `.vibe` files for document scaffolding
- **Native OS Integration**: File dialogs, printing, and system theme support
- **Markdown Support**: CommonMark support (Phase 1), with GFM and LaTeX planned for future phases
- **Settings Management**: Autosave, theming, and customization options
- **Multi-document Support**: Work with multiple documents simultaneously

## Technology Stack

- **Electron Forge** with Webpack (desktop app framework)
- **React 18** + **TypeScript 5** (UI framework)
- **Milkdown Crepe** (WYSIWYG markdown editor)
- **CodeMirror 6** (plain text editor)
- **ShadCN/ui** (UI components)
- **Tailwind CSS** (styling)
- **Zustand** (state management)

## Development

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/camonly1group/vibemd.git
cd vibemd

# Install dependencies
npm install

# Start development server (with process cleanup)
npm run start:clean

# Build for production
npm run make
```

### Process Management

VibeMD includes a process management script to avoid conflicts with Cursor IDE and other development tools:

```bash
# Start with cleanup (recommended)
npm run start:clean

# Stop the application
npm run stop

# Restart the application
npm run restart

# Check status
npm run status

# View logs
npm run logs
```

For detailed process management information, see [PROCESS_MANAGEMENT.md](./PROCESS_MANAGEMENT.md).

### Scripts

- `npm run start` - Start development server
- `npm run start:clean` - Start with process cleanup (recommended)
- `npm run stop` - Stop the application
- `npm run restart` - Restart the application
- `npm run status` - Check application status
- `npm run logs` - View recent logs
- `npm run make` - Build for production
- `npm run lint` - Run ESLint

## Building

The app builds for Windows, macOS, and Linux using Electron Forge:

```bash
npm run make
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Website

Visit [www.vibemd.app](https://www.vibemd.app) for more information.
