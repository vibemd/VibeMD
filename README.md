# VibeMD

A professional cross-platform desktop markdown editor for Windows, macOS, and Linux featuring WYSIWYG editing, comprehensive CommonMark/GFM support, template system, and native OS integration.

## 🚀 Features

### Core Editor Features
- **WYSIWYG Editor**: TipTap-powered rich text editor with professional toolbar
- **Complete Markdown Support**: 100% CommonMark and GitHub Flavored Markdown (GFM) compliance
- **Real-time Preview**: Live markdown rendering with bidirectional conversion
- **Multi-document Support**: Work with multiple documents simultaneously
- **Outline Navigation**: Collapsible document outline with click-to-navigate functionality

### Formatting Capabilities
- **Text Formatting**: Bold, italic, strikethrough, inline code
- **Headings**: All levels (H1-H6) with automatic ID generation
- **Lists**: Bullet lists, numbered lists, and task lists with checkboxes
- **Tables**: Full table support with insert/delete operations
- **Media**: Links and images with professional dialog interfaces
- **Advanced**: Superscript, subscript, blockquotes, code blocks, horizontal rules

### Template System
- **Document Templates**: Create and use `.vibe` files for document scaffolding
- **Template Management**: Built-in template creation and organization
- **Quick Start**: Pre-built templates for common document types

### Native Integration
- **File Operations**: Native file dialogs for open/save operations
- **Print Support**: Direct printing with markdown-to-HTML conversion
- **System Theme**: Automatic light/dark/system theme detection
- **Keyboard Shortcuts**: Standard editor shortcuts (Ctrl+B, Ctrl+I, etc.)

### User Experience
- **Settings Management**: Comprehensive customization options
- **Responsive Design**: Adaptive toolbar with overflow handling
- **Status Bar**: Document statistics and save status indicators
- **Process Management**: Clean startup/shutdown with conflict avoidance

## 🏗️ Architecture

### Technology Stack
- **Desktop Framework**: Electron Forge with Webpack bundling
- **Frontend**: React 18 + TypeScript 5
- **Editor Engine**: TipTap with custom extensions
- **Markdown Processing**: marked + turndown for bidirectional conversion
- **UI Components**: ShadCN/ui with Tailwind CSS styling
- **State Management**: Zustand stores
- **Math Support**: KaTeX engine (ready for LaTeX integration)

### Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    VibeMD Desktop App                       │
├─────────────────────────────────────────────────────────────┤
│  Main Process (Electron)                                    │
│  ├── Window Management                                       │
│  ├── File Operations (IPC Handlers)                        │
│  ├── System Integration (Print, Dialogs)                    │
│  └── Process Management                                      │
├─────────────────────────────────────────────────────────────┤
│  Renderer Process (React)                                   │
│  ├── TipTap Editor Component                                │
│  │   ├── Toolbar (Formatting Controls)                     │
│  │   ├── Editor Content (WYSIWYG)                          │
│  │   └── Context Menus (Table Operations)                  │
│  ├── Layout Components                                      │
│  │   ├── Sidebar (Files, Outline, Templates)               │
│  │   ├── Status Bar (Document Stats)                       │
│  │   └── Dialogs (Settings, Links, Images)                 │
│  ├── Services Layer                                         │
│  │   ├── File Service (Markdown I/O)                       │
│  │   ├── Settings Service (Persistence)                   │
│  │   ├── Navigation Service (Outline)                       │
│  │   └── Markdown Service (Processing)                      │
│  └── State Management (Zustand)                            │
│      ├── Document Store (Active Documents)                 │
│      ├── Settings Store (User Preferences)                 │
│      ├── UI Store (Interface State)                        │
│      └── Templates Store (Template Management)              │
└─────────────────────────────────────────────────────────────┘
```

### Markdown Processing Pipeline

```
Markdown Input → marked (GFM) → HTML → TipTap Editor
TipTap Editor → HTML → turndown → Markdown Output
```

### Extension Architecture
- **Core Extensions**: StarterKit (bold, italic, headings, etc.)
- **GFM Extensions**: Tables, task lists, strikethrough, superscript/subscript
- **Custom Extensions**: Heading ID generation, navigation support
- **Future Extensions**: Mathematics (LaTeX) support ready for integration

## 📋 Markdown Support Status

### ✅ CommonMark (100% Complete)
- Headings (H1-H6)
- Paragraphs and line breaks
- Bold and italic emphasis
- Code blocks (fenced) and inline code
- Blockquotes
- Ordered and unordered lists
- Links and images
- Horizontal rules

### ✅ GitHub Flavored Markdown (100% Complete)
- Strikethrough text
- Tables with full editing capabilities
- Task lists with checkboxes
- Autolinks
- Subscript and superscript

### 🔄 LaTeX Math (Ready for Implementation)
- **Available Libraries**: KaTeX, remark-math, rehype-katex
- **Missing**: TipTap mathematics extension integration
- **Planned**: Inline math (`$...$`) and block math (`$$...$$`)

## 🛠️ Development

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Quick Start
```bash
# Clone and setup
git clone https://github.com/camonly1group/vibemd.git
cd vibemd
npm install

# Start development (recommended)
npm run start:clean

# Build for production
npm run make
```

### Development Scripts
- `npm run start:clean` - Start with process cleanup (recommended)
- `npm run stop` - Stop the application
- `npm run restart` - Restart the application
- `npm run status` - Check application status
- `npm run logs` - View recent logs
- `npm run make` - Build for production
- `npm run lint` - Run ESLint

### Process Management
VibeMD includes intelligent process management to avoid conflicts with development tools:

```bash
# Recommended startup
npm run start:clean

# Check status
npm run status

# View logs
npm run logs
```

For detailed process management, see [PROCESS_MANAGEMENT.md](./PROCESS_MANAGEMENT.md).

## 📦 Building and Distribution

### Cross-Platform Builds
```bash
npm run make
```

Builds native applications for:
- Windows (x64)
- macOS (x64, ARM64)
- Linux (x64)

### Build Configuration
- **Electron Forge**: Automated packaging and distribution
- **Webpack**: Optimized bundling for main, renderer, and preload processes
- **Code Signing**: Ready for macOS and Windows code signing
- **Auto-updater**: Electron Squirrel integration

## 🔧 Configuration

### Settings Categories
- **General**: Theme, language, startup behavior
- **Editor**: Font family, font size, line height, tab size
- **Files**: Default save location, templates directory
- **Advanced**: Debug options, experimental features

### Keyboard Shortcuts
- `Ctrl+N` - New document
- `Ctrl+O` - Open document
- `Ctrl+S` - Save document
- `Ctrl+Shift+S` - Save as
- `Ctrl+P` - Print document
- `Ctrl+,` - Open settings
- `Ctrl+B` - Bold text
- `Ctrl+I` - Italic text

## 📚 Documentation

- **[COMMONMARK_GFM_LATEX_GAPS_20251020.md](./docs/COMMONMARK_GFM_LATEX_GAPS_20251020.md)** - Comprehensive markdown support analysis
- **[PROCESS_MANAGEMENT.md](./PROCESS_MANAGEMENT.md)** - Development process management guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Prettier for code formatting
- Write comprehensive tests for new features
- Update documentation for significant changes

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🌐 Website

Visit [www.vibemd.app](https://www.vibemd.app) for more information, documentation, and updates.

---

**VibeMD** - Professional markdown editing for the modern developer.