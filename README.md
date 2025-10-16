# VibeMD

A cross-platform desktop markdown editor for Windows, macOS, and Linux featuring WYSIWYG editing, template system, and native OS integration.

## Features

- **WYSIWYG Editor**: TipTap-powered rich text editor with professional toolbar
- **Template System**: Create and use `.vibe` files for document scaffolding
- **Native OS Integration**: File dialogs, printing, and system theme support
- **Markdown Support**: CommonMark + GFM support (Phase 1), with LaTeX planned for future phases
- **Settings Management**: Autosave, theming, and customization options
- **Multi-document Support**: Work with multiple documents simultaneously
- **Outline Navigation**: Collapsible document outline with click-to-navigate
- **Responsive Design**: Adaptive toolbar with overflow dropdown

## Technology Stack

- **Electron Forge** with Webpack (desktop app framework)
- **React 18** + **TypeScript 5** (UI framework)
- **TipTap** (headless rich-text editor with custom extensions)
- **marked** + **turndown** (markdown processing)
- **ShadCN/ui** (UI components)
- **Tailwind CSS** (styling)
- **Zustand** (state management)

## Current Implementation Status

### ✅ Working Features
- **TipTap WYSIWYG Editor**: Professional toolbar with icon-based buttons
- **All Heading Levels**: H1-H6 with proper focus management
- **Link Insertion**: Professional dialog with URL and text input
- **Image Insertion**: Robust implementation with URL validation
- **Tables**: Insert/delete rows and columns functionality
- **Task Lists**: Configured with proper styling
- **Super/Subscript**: Mutual exclusion configuration
- **Responsive Toolbar**: Overflow dropdown for narrow windows
- **Outline Navigation**: Collapsible/expandable with click-to-navigate
- **File Management**: Open, save, new document functionality
- **Template System**: Load and use markdown templates
- **Settings Management**: Comprehensive settings with persistence
- **Theme Support**: Light/dark/system theme switching
- **Keyboard Shortcuts**: Standard editor shortcuts
- **Status Bar**: Document statistics and save status

### 🔄 Planned Enhancements
- **Enhanced Task Lists**: Advanced task list features
- **LaTeX Support**: Math expressions via KaTeX (Phase 3)
- **Advanced Table Management**: More table operations
- **Split View**: CodeMirror + preview pane (Phase 2)
- **Preview Mode**: Standalone preview mode (Phase 2)
- **Enhanced Templates**: Template management UI

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

## Architecture

VibeMD uses a modern Electron + React architecture with:

- **Main Process**: Window management, file operations, IPC handlers
- **Renderer Process**: React UI with TipTap editor
- **State Management**: Zustand stores for documents, settings, UI state
- **Services**: File operations, markdown processing, navigation
- **Components**: Modular React components with ShadCN/ui

For detailed architecture information, see [ARCHITECTURE_AND_TECHSTACK.md](./docs/ARCHITECTURE_AND_TECHSTACK.md).

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