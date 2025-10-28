# Architecture Guide

**Application:** VibeMD
**Version:** 1.0.16
**Updated:** 2025-10-28
**License:** MIT © 2025 ONLY1 Pty Ltd

---

## Table of Contents

1. [Overview](#overview)
2. [Application Architecture](#application-architecture)
3. [Technology Stack](#technology-stack)
4. [Process Architecture](#process-architecture)
5. [State Management](#state-management)
6. [IPC Communication](#ipc-communication)
7. [File & Template Handling](#file--template-handling)
8. [Build Pipeline](#build-pipeline)
9. [Security Architecture](#security-architecture)
10. [Extensibility](#extensibility)

---

## Overview

VibeMD is a modern, cross-platform desktop markdown editor built on **Electron** with **React** UI, **Tiptap** WYSIWYG editing, **CodeMirror** markdown editing, and **Zustand** state management. The architecture follows Electron best practices with secure process separation, typed IPC communication, and modular component design.

### Architecture Philosophy

- **Security First:** Renderer process is sandboxed; only explicit IPC channels expose main process APIs
- **Type Safety:** Full TypeScript coverage ensures compile-time safety across process boundaries
- **Separation of Concerns:** Service layer abstracts business logic from UI components
- **State Centralization:** Zustand stores provide single source of truth for application state

---

## Application Architecture

### High-Level Diagram

```
┌─────────────────────────────────────────────────────┐
│                Electron Application                   │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────────────────────────────────────────┐   │
│  │  Main Process (src/main/)                    │   │
│  │  ├── Window Management                       │   │
│  │  ├── IPC Handlers                            │   │
│  │  │   ├── fileHandlers.ts                     │   │
│  │  │   ├── settingsHandlers.ts                 │   │
│  │  │   ├── systemHandlers.ts                   │   │
│  │  │   └── dialogHandlers.ts                   │   │
│  │  ├── Menu System                             │   │
│  │  └── Native OS Integration                   │   │
│  └──────────────────────────────────────────────┘   │
│                       ↕️ IPC                         │
│  ┌──────────────────────────────────────────────┐   │
│  │  Preload Layer (src/preload/)                │   │
│  │  └── Context Bridge (Typed API)              │   │
│  └──────────────────────────────────────────────┘   │
│                       ↕️ (Exposed API)               │
│  ┌──────────────────────────────────────────────┐   │
│  │  Renderer Process (React UI)                 │   │
│  │                                              │   │
│  │  ┌────────────────────────────────────────┐ │   │
│  │  │ Zustand Stores                         │ │   │
│  │  │  ├── documentStore                     │ │   │
│  │  │  ├── settingsStore                     │ │   │
│  │  │  ├── templatesStore                    │ │   │
│  │  │  └── uiStore                           │ │   │
│  │  └────────────────────────────────────────┘ │   │
│  │                                              │   │
│  │  ┌────────────────────────────────────────┐ │   │
│  │  │ Service Layer                          │ │   │
│  │  │  ├── fileService                       │ │   │
│  │  │  ├── editorService                     │ │   │
│  │  │  ├── settingsService                   │ │   │
│  │  │  ├── menuService                       │ │   │
│  │  │  ├── markdownService                   │ │   │
│  │  │  ├── appService                        │ │   │
│  │  │  └── navigationService                 │ │   │
│  │  └────────────────────────────────────────┘ │   │
│  │                                              │   │
│  │  ┌────────────────────────────────────────┐ │   │
│  │  │ React Components                       │ │   │
│  │  │  ├── Layout Components                 │ │   │
│  │  │  ├── Editor Components                 │ │   │
│  │  │  ├── Sidebar Components                │ │   │
│  │  │  ├── Dialog Components                 │ │   │
│  │  │  └── UI Components (Radix)             │ │   │
│  │  └────────────────────────────────────────┘ │   │
│  │                                              │   │
│  │  ┌────────────────────────────────────────┐ │   │
│  │  │ Custom Hooks                           │ │   │
│  │  │  ├── useAutosave                       │ │   │
│  │  │  ├── useTheme                          │ │   │
│  │  │  └── useKeyboardShortcuts              │ │   │
│  │  └────────────────────────────────────────┘ │   │
│  │                                              │   │
│  └──────────────────────────────────────────────┘   │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Core Framework
- **Electron:** 38.2.2 (desktop application runtime)
- **Electron Forge:** 7.10.2 (build tooling and packaging)
- **Node.js:** 20.x (JavaScript runtime)

### UI & Styling
- **React:** 19.2.0 (UI framework)
- **TypeScript:** 5.6.3 (type-safe JavaScript)
- **Tailwind CSS:** 3.4.18 (utility-first CSS framework)
- **PostCSS:** CSS processing
- **Radix UI:** Headless component library

### Editing & Content
- **Tiptap:** 3.7.1 (WYSIWYG editor with ProseMirror)
  - Extensions: headings, lists, tables, code blocks, math, links, images
- **CodeMirror:** 6.x (markdown editor)
  - Syntax highlighting, language support
- **Marked:** Markdown parsing
- **Remark:** Markdown processor
- **Turndown:** HTML to Markdown conversion
- **KaTeX:** Mathematical formula rendering

### State & Logic
- **Zustand:** 5.0.8 (lightweight state management)
- **date-fns:** Date utilities
- **uuid:** Unique identifier generation
- **zod:** Schema validation

### Build & Bundling
- **Webpack:** 5.x (module bundler)
- **ts-loader:** TypeScript loader for Webpack
- **ESLint:** Code linting with TypeScript

### Icons & UI
- **Lucide React:** Icon library
- **class-variance-authority:** Component styling utility
- **clsx:** Classname merging

---

## Process Architecture

### Main Process (`src/main/`)

The Main Process runs with full Node.js capabilities and handles system-level operations:

**Entry Point:** `src/main/index.ts`
- Initializes Electron app
- Configures ICU data (international characters)
- Creates application window
- Sets up menu system
- Registers IPC handlers

**Window Management:** `src/main/window.ts`
- Creates BrowserWindow with security settings
- Configures preload script
- Handles window lifecycle
- Manages development tools

**IPC Handlers:** `src/main/handlers/`
- `fileHandlers.ts` — File I/O, open, save, save-as
- `settingsHandlers.ts` — Settings persistence, print
- `systemHandlers.ts` — System info, directory operations, app state
- `dialogHandlers.ts` — Native dialog handling

### Preload Layer (`src/preload/`)

Secure bridge between sandboxed renderer and main process:

**Entry Point:** `src/preload/index.ts`
- Exposes typed IPC API via `window.electron`
- Uses `contextBridge` to safely expose selected methods
- No direct Node.js module access to renderer
- All IPC calls are type-checked

**Exposed API:**
```typescript
window.electron = {
  file: {
    openFile(): Promise<string>,
    saveFile(content): Promise<boolean>,
    // ... other methods
  },
  settings: {
    loadSettings(): Promise<Settings>,
    saveSettings(settings): Promise<void>,
    // ... other methods
  },
  // ... other namespace APIs
}
```

### Renderer Process (`src/renderer/`)

React-based UI running in a sandboxed BrowserWindow:

**Entry Point:** `src/renderer/index.tsx`
- Mounts React app to DOM
- Initializes stores
- Sets up service layer

**Root Component:** `src/renderer/App.tsx`
- File association handling
- Route management
- Context providers

**Components Directory:** `src/renderer/components/`
- Modular React components
- Organized by feature (dialogs, editor, layout, sidebar)

**Stores Directory:** `src/renderer/stores/`
- Zustand state stores
- Persistent settings
- Document management

**Services Directory:** `src/renderer/services/`
- Business logic layer
- File operations abstraction
- Markdown conversions

---

## State Management

### Document Store (`stores/documentStore.ts`)

Manages open documents and active document state.

**State:**
```typescript
{
  documents: Map<string, Document>,
  activeDocumentId: string | null,
}
```

**Methods:**
- `addDocument(doc)` — Create new or open existing document
- `removeDocument(id)` — Close document
- `updateDocument(id, updates)` — Partial document update
- `setActiveDocument(id)` — Switch active document
- `markAsModified(id)` — Flag document as unsaved
- `markAsSaved(id)` — Flag document as saved
- `hasUnsavedChanges()` — Check if any document modified

### Settings Store (`stores/settingsStore.ts`)

Persists user preferences.

**State:**
```typescript
{
  settings: Settings {
    general: { openLastDocument, autosaveEnabled, autosaveInterval },
    theme: { mode: 'light' | 'dark' | 'system' },
    files: { defaultSavePath, templatesPath },
    editor: { fontSize, fontFamily, showLineNumbers, plainTextMode },
  },
  loading: boolean,
}
```

**Methods:**
- `loadSettings()` — Load from disk
- `saveSettings(newSettings)` — Persist to disk
- `updateGeneralSettings(updates)` — Partial update
- `updateThemeSettings(updates)` — Theme changes
- `updateFileSettings(updates)` — Path settings
- `updateEditorSettings(updates)` — Editor preferences
- `resetPathsToDefaults()` — Reset to defaults

### Templates Store (`stores/templatesStore.ts`)

Manages available templates.

**State:**
```typescript
{
  templates: Template[],
  loading: boolean,
}
```

**Methods:**
- `loadTemplates(dirPath)` — Scan directory
- `getTemplates()` — Return all templates

### UI Store (`stores/uiStore.ts`)

Manages UI state (dialogs, sidebar tabs).

**State:**
```typescript
{
  sidebarTab: 'files' | 'templates' | 'outline',
  settingsDialogOpen: boolean,
  // ... other UI flags
}
```

**Methods:**
- `setSidebarTab(tab)` — Switch sidebar section
- `openSettingsDialog()` / `closeSettingsDialog()`

---

## IPC Communication

### Secure Message Passing

IPC (Inter-Process Communication) is the only bridge between renderer and main process:

**Pattern:**
```typescript
// In preload (src/preload/index.ts):
contextBridge.exposeInMainWorld('electron', {
  file: {
    openFile: () => ipcRenderer.invoke('file:open'),
    // ...
  }
})

// In main (src/main/handlers/fileHandlers.ts):
ipcMain.handle('file:open', async (event) => {
  // Handle request
})

// In renderer (component):
const content = await window.electron.file.openFile()
```

### Key IPC Channels

**File Operations:**
- `file:open` — Open file dialog
- `file:save` — Save file
- `file:saveAs` — Save as new file
- `file:getRecentFiles` — Get recent documents

**Settings:**
- `settings:load` — Load user settings
- `settings:save` — Persist settings
- `settings:print` — Print document

**System:**
- `system:getInfo` — Get system info
- `system:getAppState` — Get app state (version, platform)

**Dialogs:**
- `dialog:showMessage` — Show native dialog

### Type Safety

Shared types in `src/shared/types.ts` ensure type-safe IPC:

```typescript
interface ElectronAPI {
  file: FileAPI,
  settings: SettingsAPI,
  system: SystemAPI,
  // ...
}

// Renderer code has autocomplete and type checking
const success = await window.electron.file.saveFile(content)
```

---

## File & Template Handling

### Document Management

Documents are stored on disk with metadata in application state:

**Document Lifecycle:**
1. User opens file → `fileService.openFile(path)`
2. Main process reads file with `readFile()`
3. Content passed to renderer via IPC
4. Renderer creates `Document` object in `documentStore`
5. Changes tracked in editor state
6. Auto-save or manual save → `fileService.saveFile()`
7. Main process writes to disk

### Template System

Templates are `.vibe` files stored in user's Documents folder:

**Template Creation:**
1. User clicks "Save as Template"
2. Service layer saves document to templates directory
3. Template becomes available in Templates sidebar

**Template Usage:**
1. User selects template from sidebar
2. Template content loaded into new document
3. User edits and saves as regular document

### Cross-Platform Path Handling

`fileService` handles platform differences:
- **Windows:** Uses `\` separator, handles UNC paths
- **macOS/Linux:** Uses `/` separator
- Path normalization before IPC
- Proper encoding (UTF-8)

---

## Build Pipeline

### Webpack Configuration

#### Main Process Build (`webpack.main.config.ts`)
- Entry: `src/main/index.ts`
- Target: `electron-main`
- Output: `.webpack/main/`
- Source maps enabled
- TypeScript compiled to JavaScript

#### Renderer Build (`webpack.renderer.config.ts`)
- Entry: `src/renderer/index.tsx`
- Target: `web`
- Loaders: CSS, PostCSS, Tailwind
- Path aliases configured
- Hot module reloading in dev
- Output: `.webpack/renderer/`

#### Preload Build (`webpack.preload.config.ts`)
- Entry: `src/preload/index.ts`
- Isolated bundle
- No externalization
- Included in app package

### Electron Forge Configuration (`forge.config.ts`)

**Packager Config:**
- ASAR bundling enabled
- Platform-specific icons
- File associations
- Protocol scheme support

**Makers:**
- **Windows:** MakerWix (MSI) + MakerZIP
- **macOS:** MakerDMG + MakerZIP
- **Linux:** MakerDeb + CustomMakerRpm

**Plugins:**
- AutoUnpackNativesPlugin
- WebpackPlugin (main + renderer)
- FusesPlugin (security hardening)

### Electron Fuses (Security Hardening)

Applied to built app:
- `EnableCookieEncryption` — Encrypt cookies
- `EnableEmbeddedAsarIntegrityValidation` — Verify ASAR integrity
- `OnlyLoadAppFromAsar` — Load app only from ASAR
- `RunAsNode: false` — Disable Node.js mode
- `EnableNodeOptionsEnvironmentVariable: false` — Disable env variable execution

---

## Security Architecture

### Context Isolation

- **Enabled** in all windows
- Preload script runs in isolated context
- No direct Node.js access in renderer
- Communication only via IPC

### Content Security Policy

```
default-src 'self' 'unsafe-inline' 'unsafe-eval' data:
script-src 'self' 'unsafe-eval' 'unsafe-inline' data:
style-src 'self' 'unsafe-inline'
img-src 'self' data: https:
```

### Sandbox

- Disabled for preload compatibility
- Preload handles isolation duties

### Node Integration

- **Disabled** in renderer windows
- Main process has full Node.js access
- Services abstract Node.js APIs

---

## Extensibility

### Adding New Editor Features

Extend Tiptap in `src/renderer/editor/TipTapEditor.tsx`:

```typescript
// Add new extension
const newExtension = Extension.create({
  name: 'myFeature',
  // ... configuration
})

// Include in editor
const editor = useEditor({
  extensions: [
    // ... existing extensions
    newExtension,
  ]
})
```

### Adding New IPC Channels

1. Create handler in `src/main/handlers/`
2. Register in `src/main/handlers/index.ts`
3. Expose in preload via `contextBridge`
4. Update `src/shared/types.ts`
5. Use in renderer components with full type safety

### Adding New State Stores

1. Create store in `src/renderer/stores/`
2. Use Zustand pattern with TypeScript types
3. Initialize in components with `useStore()` hook
4. Persist to disk if needed

### Adding New Services

1. Create service in `src/renderer/services/`
2. Encapsulate business logic
3. Use in components via hooks or direct imports
4. Keep services independent and testable

---

## Performance Considerations

### Code Splitting

- Webpack automatically splits large bundles
- Async imports for heavy components
- Dynamic requires for large libraries

### Autosave Optimization

- Only saves modified documents
- Configurable interval to balance responsiveness
- Debounced to avoid excessive disk I/O

### Large Document Handling

- CodeMirror handles large documents efficiently
- Tiptap performance degrades with very large documents
- Consider splitting into multiple files for > 10MB documents

---

## Testing

### Unit Tests

- `scripts/navigationService.test.js` — Service layer tests
- Run with `npm test`

### Integration Tests

- IPC communication testing (planned)
- File I/O operations (planned)

### Smoke Tests

- `scripts/run-smoke-tests.js`
- Runs linting and bundle validation
- Executed in CI/CD pipeline

---

## Future Architectural Changes

### Planned Improvements

1. **Web Version** — Share UI code with Electron desktop app
2. **Plugin System** — Allow third-party extensions
3. **Sync & Collaboration** — Cloud storage and real-time sync
4. **Advanced Testing** — Comprehensive integration and e2e tests
5. **Performance Monitoring** — User analytics and performance metrics

---

**VibeMD is developed and maintained by ONLY1 Pty Ltd.**
**License:** MIT © 2025 ONLY1 Pty Ltd
