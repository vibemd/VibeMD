# VibeMD Architecture Guide

**Application:** VibeMD
**Version:** 1.0.11
**Release Date:** 2025-10-26
**License:** MIT

## Overview

VibeMD is a cross-platform desktop markdown editor built on Electron, React, and TypeScript. The application follows modern Electron security practices with a three-process architecture: Main Process, Preload Layer, and Renderer Process. This guide provides comprehensive technical documentation for developers working with or extending the VibeMD codebase.

## Architecture Overview

### Three-Process Model

**1. Main Process** ([src/main/](../src/main/))
- Manages application lifecycle (startup, shutdown, updates)
- Controls native window creation and management
- Handles file system operations with proper permissions
- Provides secure IPC (Inter-Process Communication) handlers
- Manages OS-level integrations (file associations, native dialogs)

**2. Preload Layer** ([src/preload/](../src/preload/))
- Secure bridge between Main and Renderer processes
- Exposes typed, sandboxed IPC channels
- Enforces context isolation for security
- Prevents direct Node.js access from renderer
- Validates and sanitizes all cross-process communication

**3. Renderer Process** ([src/renderer/](../src/renderer/))
- React-based user interface
- Tiptap WYSIWYG editor integration
- Zustand state management
- No direct Node.js or Electron API access
- Communicates with Main Process exclusively through Preload API

### Technology Stack

**Core Framework:**
- **Electron 38.2.2** - Desktop application framework
- **React 19.2.0** - UI component library
- **TypeScript 5.6.3** - Type-safe development
- **Webpack 5** - Module bundling
- **Electron Forge 7.10.2** - Build and packaging toolchain

**Editor & Markdown:**
- **Tiptap 3.7.1** - Extensible WYSIWYG editor (built on ProseMirror)
- **Marked 16.4.0** - Markdown-to-HTML parsing
- **Turndown 7.2.1** - HTML-to-Markdown conversion
- **KaTeX 0.16.25** - LaTeX mathematical formula rendering
- **Remark + plugins** - Markdown AST parsing and manipulation

**UI & Styling:**
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **Radix UI** - Headless accessible component primitives
- **Lucide React 0.545.0** - Icon library
- **Class Variance Authority** - Component variant management

**State Management:**
- **Zustand 5.0.8** - Lightweight reactive state management
- **Zod 4.1.12** - Runtime schema validation

## Directory Structure

```
VibeMD/
├── src/
│   ├── main/              # Electron main process
│   │   ├── index.ts       # Application entry point
│   │   ├── window.ts      # BrowserWindow management
│   │   └── handlers/      # IPC request handlers
│   │       ├── fileHandlers.ts
│   │       ├── settingsHandlers.ts
│   │       ├── dialogHandlers.ts
│   │       └── systemHandlers.ts
│   │
│   ├── preload/           # Secure IPC bridge
│   │   └── index.ts       # Exposed API surface
│   │
│   └── renderer/          # React UI application
│       ├── App.tsx        # Root component
│       ├── index.tsx      # Renderer entry point
│       ├── components/    # React components
│       │   ├── Layout.tsx
│       │   ├── Toolbar.tsx
│       │   ├── Sidebar.tsx
│       │   ├── StatusBar.tsx
│       │   ├── TipTapEditor.tsx
│       │   └── dialogs/
│       ├── stores/        # Zustand state stores
│       │   ├── documentStore.ts
│       │   ├── settingsStore.ts
│       │   ├── templatesStore.ts
│       │   └── uiStore.ts
│       ├── services/      # Business logic
│       │   ├── fileService.ts
│       │   ├── settingsService.ts
│       │   ├── editorService.ts
│       │   └── markdownService.ts
│       ├── hooks/         # React custom hooks
│       │   ├── useKeyboardShortcuts.ts
│       │   └── useTheme.ts
│       └── lib/           # Utilities
│
├── forge.config.ts        # Electron Forge configuration
├── webpack.main.config.ts # Main process bundling
├── webpack.renderer.config.ts # Renderer bundling
├── webpack.plugins.ts     # Shared webpack plugins
└── scripts/               # Build automation scripts
    ├── clean-build-output.js
    ├── stage-release-assets.js
    └── run-smoke-tests.js
```

## Main Process Architecture

### Entry Point ([src/main/index.ts](../src/main/index.ts))

The main process bootstraps the application:
- Registers IPC handlers for file, settings, dialog, and system operations
- Creates the main window on `app.whenReady()`
- Manages application lifecycle events
- Handles macOS-specific behaviors (dock, window restoration)
- Implements squirrel startup handling for Windows installers

### Window Management ([src/main/window.ts](../src/main/window.ts))

Creates and configures the BrowserWindow:
- Sets up secure web preferences (context isolation, sandbox)
- Configures window dimensions and behavior
- Handles ICU data loading on Windows platform
- Manages file associations and drag-drop support
- Implements window close event handling

### IPC Handlers ([src/main/handlers/](../src/main/handlers/))

**File Handlers** ([fileHandlers.ts](../src/main/handlers/fileHandlers.ts)):
- `file:open` - Open file dialog and return content
- `file:save` - Save file dialog and write content
- `file:read` - Read file from absolute path
- `file:write` - Write content to path

**Settings Handlers** ([settingsHandlers.ts](../src/main/handlers/settingsHandlers.ts)):
- `settings:load` - Load user settings from disk
- `settings:save` - Persist settings to disk
- Manages settings file at `~/Documents/VibeMD/settings.json`

**Dialog Handlers** ([dialogHandlers.ts](../src/main/handlers/dialogHandlers.ts)):
- `dialog:open-file` - Native file picker dialog
- `dialog:save-file` - Native save dialog
- `dialog:select-folder` - Directory selection dialog
- Platform-specific file filters and default paths

**System Handlers** ([systemHandlers.ts](../src/main/handlers/systemHandlers.ts)):
- `system:get-documents-path` - Returns OS documents directory
- `system:print` - Renders HTML content to print dialog

## Preload Layer

### Security Bridge ([src/preload/index.ts](../src/preload/index.ts))

The preload script exposes a controlled API to the renderer:

```typescript
contextBridge.exposeInMainWorld('electron', {
  // File operations
  openFile: () => ipcRenderer.invoke('file:open'),
  saveFile: (content: string) => ipcRenderer.invoke('file:save', content),
  readFile: (path: string) => ipcRenderer.invoke('file:read', path),
  writeFile: (path: string, content: string) =>
    ipcRenderer.invoke('file:write', path, content),

  // Settings
  loadSettings: () => ipcRenderer.invoke('settings:load'),
  saveSettings: (settings: object) =>
    ipcRenderer.invoke('settings:save', settings),

  // Dialogs
  openFileDialog: (options: object) =>
    ipcRenderer.invoke('dialog:open-file', options),
  saveFileDialog: (options: object) =>
    ipcRenderer.invoke('dialog:save-file', options),
  selectFolder: (title: string) =>
    ipcRenderer.invoke('dialog:select-folder', title),

  // System
  getDocumentsPath: () => ipcRenderer.invoke('system:get-documents-path'),
  print: (html: string) => ipcRenderer.invoke('system:print', html),

  // Menu events (one-way from main to renderer)
  onMenuCommand: (callback: Function) =>
    ipcRenderer.on('menu:command', callback),
});
```

**Security Features:**
- Context isolation prevents prototype pollution
- No direct Electron or Node.js API exposure
- Type-safe interfaces for all IPC calls
- Input validation on both sides of IPC boundary

## Renderer Process Architecture

### Component Hierarchy

```
App.tsx
└── Layout.tsx
    ├── Toolbar.tsx
    │   └── Various dialogs (Settings, Link, Image, Math, etc.)
    ├── Sidebar.tsx
    │   ├── FilesTab
    │   ├── TemplatesTab
    │   └── OutlineTab
    ├── TipTapEditor.tsx (main editor)
    └── StatusBar.tsx
```

### State Management (Zustand)

VibeMD uses Zustand for reactive state management across components:

**Document Store** ([stores/documentStore.ts](../src/renderer/stores/documentStore.ts)):
```typescript
interface DocumentStore {
  documents: Document[];           // All open documents
  activeDocumentId: string | null; // Currently active document
  addDocument: (doc: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  removeDocument: (id: string) => void;
  setActiveDocument: (id: string) => void;
  getActiveDocument: () => Document | undefined;
}
```

**Settings Store** ([stores/settingsStore.ts](../src/renderer/stores/settingsStore.ts)):
```typescript
interface SettingsStore {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
}

interface AppSettings {
  general: {
    autoSave: boolean;
    autoSaveInterval: number;
    openLastDocument: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  files: {
    defaultSavePath: string;
    templatesLocation: string;
  };
  editor: {
    fontSize: number;
    fontFamily: string;
    showLineNumbers: boolean;
  };
}
```

**Templates Store** ([stores/templatesStore.ts](../src/renderer/stores/templatesStore.ts)):
- Manages available templates
- Loads templates from configured directory
- Handles template creation and deletion

**UI Store** ([stores/uiStore.ts](../src/renderer/stores/uiStore.ts)):
- Tracks sidebar tab selection
- Manages dialog open/close state
- Controls UI-specific ephemeral state

### Editor Implementation

**TipTap Configuration** ([components/TipTapEditor.tsx](../src/renderer/components/TipTapEditor.tsx)):

The editor is built with Tiptap and includes extensive extensions:

```typescript
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      history: true,
      hardBreak: true,
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right'],
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { class: 'text-blue-500 underline' },
    }),
    Image,
    Table.configure({ resizable: true }),
    TableRow,
    TableCell,
    TableHeader,
    TaskList,
    TaskItem.configure({
      nested: true,
      HTMLAttributes: { class: 'task-item' },
    }),
    Mathematics.configure({
      katexOptions: { throwOnError: false },
    }),
    Superscript,
    Subscript,
    HorizontalRule,
    HardBreak,
  ],
  content: initialContent,
  onUpdate: ({ editor }) => {
    handleDocumentChange(editor.getHTML());
  },
});
```

**Editor Features:**
- Real-time WYSIWYG rendering
- Bi-directional markdown/HTML conversion
- Collaborative-editing-ready architecture (ProseMirror)
- Undo/redo with history tracking
- Custom keyboard shortcuts
- Context menus for tables

### Services Layer

**File Service** ([services/fileService.ts](../src/renderer/services/fileService.ts)):
- Abstracts file operations through Electron API
- Handles document loading/saving
- Manages file path resolution
- Provides error handling for file operations

**Markdown Service** ([services/markdownService.ts](../src/renderer/services/markdownService.ts)):
- Generates document outline from heading hierarchy
- Calculates word count and character count
- Parses markdown AST using Remark
- Handles special markdown features (GFM, math, tables)

**Editor Service** ([services/editorService.ts](../src/renderer/services/editorService.ts)):
- Manages editor instance lifecycle
- Handles content synchronization
- Implements navigation between outline and editor
- Manages cursor position and selection

**Settings Service** ([services/settingsService.ts](../src/renderer/services/settingsService.ts)):
- Loads and persists application settings
- Provides default settings initialization
- Validates settings schema with Zod
- Handles settings migration

### Custom Hooks

**useKeyboardShortcuts** ([hooks/useKeyboardShortcuts.ts](../src/renderer/hooks/useKeyboardShortcuts.ts)):
- Registers global keyboard shortcuts
- Platform-specific key combinations (Ctrl vs Cmd)
- Prevents default browser behaviors
- Integrates with editor commands

Implemented shortcuts:
- `Ctrl/Cmd+N` - New document
- `Ctrl/Cmd+O` - Open document
- `Ctrl/Cmd+S` - Save document
- `Ctrl/Cmd+P` - Print document
- `Ctrl/Cmd+,` - Open settings

**useTheme** ([hooks/useTheme.ts](../src/renderer/hooks/useTheme.ts)):
- Applies theme to document root
- Listens to system theme changes
- Handles light/dark/system preference
- Updates CSS variables for theming

## Data Flow

### Document Lifecycle

1. **Creation:**
   - User triggers new document (button or `Ctrl+N`)
   - DocumentStore creates new document object with UUID
   - Editor initializes with empty content or template
   - Document added to Files tab

2. **Editing:**
   - User types in TipTap editor
   - `onUpdate` callback fires on every change
   - Document store updates content and sets `modified` flag
   - Auto-save timer triggers save operation if enabled
   - Status bar shows last saved timestamp

3. **Saving:**
   - User triggers save (`Ctrl+S` or toolbar button)
   - If no file path exists, save dialog opens
   - Content converted from HTML to markdown (via Turndown)
   - File service invokes IPC call to main process
   - Main process writes file using Node.js fs module
   - Document store updates file path and clears `modified` flag

4. **Loading:**
   - User opens file (dialog, drag-drop, or file association)
   - Main process reads file content
   - File service receives content
   - Content converted from markdown to HTML (via Marked)
   - Editor loads HTML content
   - Document added to store with file path

### Settings Persistence

1. **Load on Startup:**
   - Renderer calls `loadSettings()` from settings service
   - IPC call to main process
   - Main process reads `~/Documents/VibeMD/settings.json`
   - If file doesn't exist, returns default settings
   - Settings store populated with loaded data
   - UI components react to settings changes

2. **Save on Change:**
   - User modifies setting in Settings dialog
   - Settings store updated immediately
   - Debounced save operation triggered
   - IPC call to main process with full settings object
   - Main process writes JSON to disk
   - Settings persisted for next session

### Template System

1. **Template Discovery:**
   - On startup, templates store loads templates from configured directory
   - File system watcher monitors directory for changes (future enhancement)
   - Templates tab displays all `.md`, `.markdown`, and `.vibe` files

2. **Template Usage:**
   - User clicks template in Templates tab
   - Dialog prompts for new document name
   - Template content loaded via file service
   - New document created with template content
   - User can immediately edit and save

## Build System

### Webpack Configuration

VibeMD uses three Webpack configurations:

**Main Process** ([webpack.main.config.ts](../webpack.main.config.ts)):
- Bundles Node.js/Electron code
- Target: `electron-main`
- Entry: `src/main/index.ts`
- Output: `.webpack/main`
- No external dependencies bundled

**Renderer Process** ([webpack.renderer.config.ts](../webpack.renderer.config.ts)):
- Bundles React application
- Target: `electron-renderer`
- Entry: `src/renderer/index.tsx`
- Output: `.webpack/renderer`
- CSS extraction with MiniCssExtractPlugin
- PostCSS with Tailwind processing

**Preload Script** (configured in Forge):
- Bundles preload layer
- Target: `electron-preload`
- Entry: `src/preload/index.ts`
- Output: `.webpack/preload`

### Electron Forge Configuration ([forge.config.ts](../forge.config.ts))

**Packager Configuration:**
```typescript
{
  name: 'VibeMD',
  executableName: 'vibemd',
  icon: 'assets/icon',
  appBundleId: 'com.only1.vibemd',
  appCategoryType: 'public.app-category.productivity',
}
```

**Makers (Platform-Specific Installers):**
- **macOS:** DMG (disk image) and ZIP
- **Windows:** WiX MSI and ZIP
- **Linux:** DEB (Debian) and RPM (RedHat)

**Plugins:**
- **Webpack Plugin:** Integrates with Webpack build
- **Fuses Plugin:** Enables Electron security fuses
- **Auto Unpack Natives:** Handles native Node modules

### Platform-Specific Build Commands

```json
"build:mac-arm64": "clean && make --platform=darwin --arch=arm64 && stage",
"build:mac-x64": "clean && make --platform=darwin --arch=x64 && stage",
"build:win-x64": "clean && make --platform=win32 --arch=x64 && stage",
"build:win-arm64": "clean && make --platform=win32 --arch=arm64 && stage",
"build:linux-x64": "clean && make --platform=linux --arch=x64 && stage"
```

Each command:
1. Cleans previous build output for that platform/arch
2. Runs Electron Forge make to create installers
3. Stages release assets with manifest generation

## Security Architecture

### Electron Security Best Practices

VibeMD implements comprehensive security measures:

**Context Isolation:**
- Renderer cannot access Node.js or Electron APIs directly
- Preload script is the only bridge
- Prevents XSS attacks from compromising main process

**Sandbox:**
- Renderer process runs in Chromium sandbox
- Limited system access
- Cannot spawn child processes

**Node Integration Disabled:**
- `nodeIntegration: false` in web preferences
- Renderer has no `require()` or Node.js globals
- All privileged operations go through IPC

**Content Security Policy:**
- Restricts inline scripts and styles (future enhancement)
- Only allows loading resources from allowed origins

**IPC Validation:**
- All IPC handlers validate input parameters
- Type checking via TypeScript
- Path traversal prevention in file operations

**Security Fuses:**
- Electron fuses enabled via Forge plugin
- Disables legacy/insecure features
- Enforces modern security defaults

### File System Security

- All file operations go through main process
- Native dialogs prevent path injection
- Read/write permissions checked by OS
- No direct filesystem access from renderer
- Settings stored in user's document directory (OS-managed permissions)

## Extension Points

### Adding New Markdown Features

To add a new Tiptap extension:

1. **Install the extension:**
   ```bash
   npm install @tiptap/extension-[name]
   ```

2. **Import in TipTapEditor.tsx:**
   ```typescript
   import NewExtension from '@tiptap/extension-[name]';
   ```

3. **Add to extensions array:**
   ```typescript
   const editor = useEditor({
     extensions: [
       // ... existing extensions
       NewExtension.configure({ /* options */ }),
     ],
   });
   ```

4. **Add toolbar button if needed:**
   - Add button to Toolbar.tsx
   - Connect to editor command: `editor.chain().focus().[command]().run()`

### Adding New Settings

1. **Update AppSettings interface** in `settingsStore.ts`
2. **Add default value** in settings initialization
3. **Add UI controls** in Settings Dialog component
4. **Implement setting logic** in relevant component/service

### Adding New IPC Channels

1. **Define handler in main process:**
   ```typescript
   // src/main/handlers/customHandlers.ts
   ipcMain.handle('custom:operation', async (event, arg) => {
     // Implementation
     return result;
   });
   ```

2. **Expose in preload:**
   ```typescript
   // src/preload/index.ts
   customOperation: (arg) => ipcRenderer.invoke('custom:operation', arg),
   ```

3. **Use in renderer:**
   ```typescript
   const result = await window.electron.customOperation(arg);
   ```

## Testing Strategy

### Current Testing

**Smoke Tests** ([scripts/run-smoke-tests.js](../scripts/run-smoke-tests.js)):
- Runs ESLint on all TypeScript files
- Verifies Webpack builds complete successfully
- Ensures no compilation errors
- Validates bundle output structure

### Future Testing Enhancements

- **Unit Tests:** Jest + React Testing Library for components
- **Integration Tests:** Test IPC communication flows
- **E2E Tests:** Spectron or Playwright for full application testing
- **Snapshot Tests:** Visual regression testing for UI components

## Performance Considerations

### Optimization Strategies

**Renderer Performance:**
- React component memoization with `React.memo()`
- Zustand selector optimization to prevent unnecessary re-renders
- Debounced auto-save to reduce file I/O
- Lazy loading of large documents

**Editor Performance:**
- ProseMirror's efficient document model
- Virtual scrolling for large documents (future)
- Throttled outline updates
- Efficient markdown parsing with Remark

**Build Performance:**
- Webpack caching for faster rebuilds
- Tree shaking to eliminate unused code
- Code splitting (future enhancement)
- Asset optimization

### Memory Management

- Document store limits number of open documents (future)
- Editor releases resources when document closed
- Event listener cleanup in useEffect hooks
- File handles properly closed after operations

## Cross-Platform Considerations

### Platform-Specific Code

**macOS:**
- ICU data loading not required (built into Electron)
- App menu integration
- Dock icon behavior
- DMG installer with custom background

**Windows:**
- ICU data loaded manually from `icudtl.dat`
- System tray integration (future)
- MSI installer with Wix Toolset
- File association registry entries

**Linux:**
- DEB and RPM package formats
- .desktop file for application menu
- Icon installation to `/usr/share/icons`
- Build performed on macOS with Homebrew tooling

### Path Handling

- All paths use `path` module for cross-platform compatibility
- Home directory via `app.getPath('documents')`
- Path separators handled automatically
- File URI conversion for drag-and-drop

## Troubleshooting & Debugging

### Developer Tools

- Press `Ctrl+Shift+I` / `Cmd+Option+I` to open DevTools
- Main process debugging via `--inspect` flag
- Console logging throughout codebase
- React DevTools extension compatible

### Common Issues

**Build Failures:**
- Clear `.webpack/` and `out/` directories
- Delete `node_modules/` and reinstall
- Check Node.js version compatibility
- Verify platform-specific tooling installed

**Runtime Errors:**
- Check main process console (terminal)
- Check renderer console (DevTools)
- Verify IPC channel names match
- Ensure file paths are absolute

**Performance Issues:**
- Profile with React DevTools Profiler
- Check for unnecessary re-renders
- Monitor main process memory usage
- Review Webpack bundle sizes

## Future Architecture Enhancements

### Planned Improvements

1. **Plugin System:**
   - Third-party extension support
   - Custom Tiptap extensions
   - Theme plugins

2. **Collaborative Editing:**
   - WebRTC or WebSocket backend
   - Operational transformation with ProseMirror
   - Real-time cursors and selections

3. **Cloud Sync:**
   - Optional cloud storage integration
   - Conflict resolution
   - Offline-first architecture

4. **Advanced Features:**
   - Diagramming (Mermaid, PlantUML)
   - Export to DOCX, PDF, LaTeX
   - Version control integration
   - Split-pane editing

5. **Performance:**
   - Web Workers for heavy processing
   - Virtual scrolling for large documents
   - Incremental markdown parsing
   - Code splitting for faster startup

## Contributing Guidelines

### Code Style

- TypeScript strict mode enabled
- ESLint configuration enforced
- Prettier for code formatting
- Descriptive variable and function names
- JSDoc comments for public APIs

### Component Guidelines

- Functional components with hooks (no class components)
- Props interfaces defined with TypeScript
- Proper error boundaries
- Accessibility considerations (ARIA labels)

### Commit Guidelines

- Descriptive commit messages
- Reference issue numbers
- Separate refactoring from feature commits
- Keep commits atomic and focused

## Resources

### Documentation
- **Electron:** https://www.electronjs.org/docs
- **React:** https://react.dev
- **Tiptap:** https://tiptap.dev
- **Zustand:** https://github.com/pmndrs/zustand
- **Tailwind CSS:** https://tailwindcss.com

### Tools
- **Electron Forge:** https://www.electronforge.io
- **Webpack:** https://webpack.js.org
- **TypeScript:** https://www.typescriptlang.org

---

**Version:** 1.0.11
**Release Date:** 2025-10-26
**License:** MIT
