# VibeMD

A modern, cross-platform desktop markdown editor with WYSIWYG editing capabilities, a powerful template system, and seamless native OS integration.

## Overview

VibeMD is an Electron-based markdown editor that combines the simplicity of markdown with the convenience of rich-text editing. Built with React, TypeScript, and TipTap, it provides a distraction-free writing environment with real-time preview and extensive markdown support including GitHub Flavored Markdown (GFM) and mathematical expressions.

## Key Features

### Editor Capabilities
- **WYSIWYG Editing**: Real-time rich-text editing with TipTap editor framework
- **Markdown Support**: Full CommonMark and GitHub Flavored Markdown (GFM) support
- **Mathematical Expressions**: LaTeX math rendering powered by KaTeX
- **Syntax Highlighting**: Code blocks with syntax awareness
- **Tables**: Full table support with editing capabilities
- **Task Lists**: Interactive checkboxes for task management
- **Image Support**: Inline image embedding and display
- **Link Management**: Easy link insertion and editing

### Document Management
- **Multi-Document Interface**: Work with multiple documents simultaneously
- **Auto-Save**: Automatic saving to prevent data loss
- **File Operations**: New, Open, Save, Save As with native file dialogs
- **Template System**: Create and manage document templates
- **File Organization**: Sidebar navigation with document list and outline view

### Template System
- **Built-in Templates**: Pre-configured templates for common document types
- **Custom Templates**: Create your own templates for recurring document structures
- **Filesystem Templates**: Load templates from a designated folder
- **Template Categories**: Organize templates by use case (Meeting Notes, Project Proposal, etc.)

### User Interface
- **Dark/Light Theme**: System-integrated theme switching
- **Collapsible Sidebar**: Maximize writing space when needed
- **Toolbar**: Quick access to formatting options and document actions
- **Outline View**: Navigate long documents via heading structure
- **Settings Dialog**: Comprehensive settings management
- **Keyboard Shortcuts**: Efficient keyboard-driven workflow

### Native OS Integration
- **Native Menus**: Platform-native menu bars (macOS, Windows, Linux)
- **File Dialogs**: Native file open/save dialogs
- **Print Support**: System print dialog integration
- **Window Management**: Native window controls and behaviors

## Architecture

### Technology Stack

#### Core Framework
- **Electron 38.2.2**: Cross-platform desktop application framework
- **React 19.2.0**: UI component library
- **TypeScript 4.5.4**: Type-safe development
- **Electron Forge 7.10.2**: Build and packaging toolchain

#### Editor & Markdown
- **TipTap 3.7.1**: Headless editor framework with extensions
  - Starter Kit (base functionality)
  - Hard Break, Horizontal Rule
  - Image, Link
  - Subscript, Superscript
  - Table (with Cell, Header, Row)
  - Task List and Task Item
- **Marked 16.4.0**: Markdown parser and compiler
- **Turndown 7.2.1**: HTML to Markdown converter
- **Remark 15.0.1**: Markdown processor with plugins
  - Remark Parse 11.0.0
  - Remark GFM 4.0.1 (GitHub Flavored Markdown)
  - Remark Math 6.0.0
- **KaTeX 0.16.25**: Fast math typesetting
- **React Markdown 10.1.0**: Markdown rendering component
- **Rehype KaTeX 7.0.1**: KaTeX integration for HTML

#### UI Components
- **Radix UI**: Accessible, unstyled UI primitives
  - Checkbox, Dialog, Dropdown Menu
  - Label, Radio Group, Select
  - Separator, Slot, Tabs
  - Toggle Group, Tooltip
- **Tailwind CSS 3.4.18**: Utility-first CSS framework
- **Lucide React 0.545.0**: Icon library

#### State Management & Utilities
- **Zustand 5.0.8**: Lightweight state management
- **Date-fns 4.1.0**: Modern date utility library
- **UUID 13.0.0**: Unique identifier generation
- **Zod 4.1.12**: TypeScript-first schema validation
- **Class Variance Authority 0.7.1**: Variant-based component APIs
- **CLSX 2.1.1**: Conditional className construction
- **Tailwind Merge 3.3.1**: Tailwind class conflict resolution

#### Build Tools
- **Autoprefixer 10.4.21**: CSS vendor prefix automation
- **PostCSS 8.5.6**: CSS transformation tool
- **Webpack**: Module bundler (via Electron Forge)

### Application Structure

```
VibeMD/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── index.ts            # Main entry point, window management
│   │   └── handlers/           # IPC handlers
│   │       ├── fileHandlers.ts     # File operations (open, save, etc.)
│   │       └── settingsHandlers.ts # Settings, print operations
│   │
│   ├── preload/                 # Preload scripts (context bridge)
│   │   └── index.ts            # IPC API exposure to renderer
│   │
│   ├── renderer/                # React application
│   │   ├── App.tsx             # Main application component
│   │   ├── components/         # UI components
│   │   │   ├── dialogs/        # Modal dialogs
│   │   │   │   ├── SettingsDialog.tsx
│   │   │   │   ├── SettingsTab.tsx
│   │   │   │   └── AboutTab.tsx
│   │   │   ├── editor/         # Editor components
│   │   │   │   └── TipTapEditor.tsx  # Main WYSIWYG editor
│   │   │   ├── layout/         # Layout components
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Toolbar.tsx
│   │   │   ├── sidebar/        # Sidebar tab components
│   │   │   │   ├── FilesTab.tsx
│   │   │   │   ├── OutlineTab.tsx
│   │   │   │   └── TemplatesTab.tsx
│   │   │   └── ui/             # Reusable UI primitives (shadcn/ui)
│   │   │       ├── button.tsx
│   │   │       ├── dialog.tsx
│   │   │       ├── tabs.tsx
│   │   │       └── ...
│   │   ├── hooks/              # Custom React hooks
│   │   │   └── useKeyboardShortcuts.ts
│   │   ├── lib/                # Utility functions
│   │   │   └── utils.ts
│   │   ├── services/           # Business logic
│   │   │   ├── menuService.ts      # Menu event handling
│   │   │   └── settingsService.ts  # Settings persistence
│   │   ├── stores/             # Zustand state stores
│   │   │   ├── documentStore.ts    # Document state
│   │   │   ├── uiStore.ts          # UI state (theme, sidebar)
│   │   │   └── settingsStore.ts    # Application settings
│   │   └── styles/             # Global styles
│   │       └── globals.css     # Tailwind & custom CSS
│   │
│   └── shared/                  # Shared types and constants
│       └── types.ts            # TypeScript interfaces
│
├── templates/                   # Built-in document templates
│   ├── meeting-notes.vibe
│   ├── project-proposal.vibe
│   └── ...
│
├── package.json                 # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── forge.config.ts             # Electron Forge configuration
└── vibemd.sh                   # Process management script (macOS/Linux)
```

### Key Architectural Patterns

#### IPC Communication
The application uses Electron's IPC (Inter-Process Communication) with context isolation:
- **Main Process**: Handles file I/O, system dialogs, print operations
- **Preload Script**: Exposes secure API to renderer via `contextBridge`
- **Renderer Process**: React UI that calls exposed APIs

#### State Management
Three separate Zustand stores manage different concerns:
- **documentStore**: Active documents, content, templates
- **uiStore**: Theme, sidebar state, active tabs
- **settingsStore**: User preferences, editor settings

#### Document Format
Documents are stored with metadata in a structured format:
```typescript
{
  id: string;              // UUID
  title: string;           // Document title
  content: string;         // Markdown content
  filePath?: string;       // Filesystem path
  isModified: boolean;     // Unsaved changes flag
  isTemplate: boolean;     // Template designation
  createdAt: Date;
  updatedAt: Date;
}
```

## Installation

### Prerequisites
- Node.js 16.x or higher
- npm 7.x or higher

### Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd VibeMD
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

### Building for Production

1. Package the application:
```bash
npm run package
```

2. Create distributables:
```bash
npm run make
```

This will create platform-specific distributables in the `out/` directory:
- macOS: `.dmg` and `.zip`
- Windows: `.exe` installer
- Linux: `.deb` and `.rpm` packages

## Usage

### Keyboard Shortcuts

#### File Operations
- `Cmd+N` / `Ctrl+N`: New document
- `Cmd+O` / `Ctrl+O`: Open document
- `Cmd+S` / `Ctrl+S`: Save document
- `Cmd+Shift+S` / `Ctrl+Shift+S`: Save As
- `Cmd+P` / `Ctrl+P`: Print document

#### Editing
- `Cmd+B` / `Ctrl+B`: Bold
- `Cmd+I` / `Ctrl+I`: Italic
- `Cmd+U` / `Ctrl+U`: Underline
- `Cmd+Z` / `Ctrl+Z`: Undo
- `Cmd+Shift+Z` / `Ctrl+Shift+Z`: Redo

#### Application
- `Cmd+,` / `Ctrl+,`: Settings
- `Cmd+Q` / `Ctrl+Q`: Quit (macOS)

### Working with Templates

1. **Using Built-in Templates**:
   - Click "Use Template" button in sidebar (when no documents open)
   - Select from available templates in the Templates tab
   - Click "Use Template" on desired template

2. **Creating Custom Templates**:
   - Create a new document
   - Add your template content
   - Save with `.vibe` extension
   - Place in templates folder or save as template within app

3. **Managing Templates**:
   - Templates tab shows all available templates
   - Can set a custom templates directory in Settings
   - Templates are automatically loaded on app start

### Configuration

Settings are accessible via `Cmd+,` / `Ctrl+,`:

- **Appearance**: Theme (Light/Dark/System)
- **Editor**: Font size, line numbers, word wrap
- **Files**: Auto-save, templates directory
- **About**: Version info, licenses, third-party components

## Development

### Project Scripts

```bash
npm start              # Start development server
npm run start:clean    # Clean start (via vibemd.sh)
npm run stop           # Stop running instance (via vibemd.sh)
npm run restart        # Restart instance (via vibemd.sh)
npm run status         # Check running status (via vibemd.sh)
npm run logs           # View application logs (via vibemd.sh)
npm run package        # Package for current platform
npm run make           # Build distributables
npm run lint           # Run ESLint
```

### Process Management (macOS/Linux)

The `vibemd.sh` script provides process management:
```bash
./vibemd.sh start      # Start in background
./vibemd.sh stop       # Stop all instances
./vibemd.sh restart    # Restart application
./vibemd.sh status     # Check if running
./vibemd.sh logs       # Tail application logs
```

### Adding New Features

1. **New IPC Handlers**: Add to `src/main/handlers/`
2. **Expose to Renderer**: Update `src/preload/index.ts`
3. **Type Definitions**: Add to `src/shared/types.ts`
4. **UI Components**: Add to `src/renderer/components/`
5. **State Management**: Update relevant store in `src/renderer/stores/`

## License

MIT License - See LICENSE file for details

Copyright (c) 2025 ONLY1 Pty Ltd

## Third-Party Licenses

This application incorporates open-source software. Full license information for all third-party components is available in the About section of the application (Settings → About).

Major components:
- Electron (MIT)
- React (MIT)
- TipTap (MIT)
- Tailwind CSS (MIT)
- Radix UI (MIT)
- And many others - see application About section for complete list

## Support

For issues, questions, or contributions, please contact:
- Email: hello@vibemd.app
- Project: VibeMD v1.0.0

## Acknowledgments

VibeMD is built on the shoulders of giants. Special thanks to:
- The Electron team for the amazing cross-platform framework
- The TipTap team for the flexible editor framework
- The Radix UI team for accessible UI primitives
- The Tailwind CSS team for the utility-first CSS framework
- All open-source contributors whose libraries make this project possible
