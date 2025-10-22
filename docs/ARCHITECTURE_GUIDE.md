# VibeMD Architecture Guide

**Version:** 1.0.2
**Date:** October 21, 2025
**Purpose:** Comprehensive technical documentation of VibeMD's architecture, components, and implementation patterns

---

## Table of Contents

1. [Overview](#overview)
2. [High-Level Architecture](#high-level-architecture)
3. [Technology Stack](#technology-stack)
4. [Directory Structure](#directory-structure)
5. [Main Process Architecture](#main-process-architecture)
6. [Renderer Process Architecture](#renderer-process-architecture)
7. [State Management](#state-management)
8. [Component Architecture](#component-architecture)
9. [Services Layer](#services-layer)
10. [IPC Communication](#ipc-communication)
11. [Markdown Processing Pipeline](#markdown-processing-pipeline)
12. [Build and Packaging](#build-and-packaging)

---

## Overview

VibeMD is built as an Electron desktop application using a modern React-based architecture with TypeScript for type safety. The application follows Electron's multi-process architecture with clear separation between main process (Node.js), preload scripts (context bridge), and renderer process (React UI).

### Key Architectural Principles

1. **Separation of Concerns**: Clear boundaries between main process, preload, and renderer
2. **Type Safety**: Full TypeScript coverage with strict type checking
3. **Unidirectional Data Flow**: Zustand stores manage application state with predictable updates
4. **Component Composition**: React components follow composition patterns for reusability
5. **Context Isolation**: Secure IPC communication via context bridge
6. **File System Abstraction**: All file operations handled through IPC to main process

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Main Process                             │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────────────────┐ │
│  │   index.ts   │  │  window.ts  │  │     handlers/          │ │
│  │              │  │             │  │  - fileHandlers.ts     │ │
│  │  • App init  │  │  • Window   │  │  - settingsHandlers.ts │ │
│  │  • IPC setup │  │    creation │  │                        │ │
│  └──────────────┘  └─────────────┘  └────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │ IPC Channel
┌────────────────────────┴────────────────────────────────────────┐
│                      Preload Script                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   index.ts (Context Bridge)                 │ │
│  │  • exposes electronAPI to renderer                         │ │
│  │  • security barrier between main and renderer              │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │ window.electronAPI
┌────────────────────────┴────────────────────────────────────────┐
│                      Renderer Process                            │
│  ┌─────────────┐  ┌───────────┐  ┌──────────┐  ┌────────────┐ │
│  │   App.tsx   │──│ Components│──│ Services │──│   Stores   │ │
│  │             │  │           │  │          │  │            │ │
│  │  • Root     │  │  • Layout │  │  • File  │  │  • Document│ │
│  │  • Routing  │  │  • Editor │  │  • Menu  │  │  • UI      │ │
│  │  • Theme    │  │  • Dialogs│  │  • Mark- │  │  • Settings│ │
│  │             │  │  • Sidebar│  │    down  │  │            │ │
│  └─────────────┘  └───────────┘  └──────────┘  └────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Core Framework (Main Process)

| Technology | Version | Purpose |
|-----------|---------|----------|
| **Electron** | 38.2.2 | Cross-platform desktop framework |
| **Node.js** | Built-in | Runtime for main process |
| **TypeScript** | 4.5.4 | Type-safe development |

### Frontend (Renderer Process)

| Technology | Version | Purpose |
|-----------|---------|----------|
| **React** | 19.2.0 | UI framework |
| **TypeScript** | 4.5.4 | Type safety |
| **Zustand** | 5.0.8 | State management |
| **Tailwind CSS** | 3.4.18 | Utility-first CSS framework |
| **Radix UI** | Various | Accessible UI primitives |
| **Lucide React** | 0.545.0 | Icon library |

### Editor & Markdown

| Technology | Version | Purpose |
|-----------|---------|----------|
| **TipTap** | 3.7.1 | WYSIWYG editor framework |
| **Marked** | 16.4.0 | Markdown parser (MD → HTML) |
| **Turndown** | 7.2.1 | HTML to Markdown converter |
| **Remark** | 15.0.1 | Markdown processor |
| **Remark GFM** | 4.0.1 | GitHub Flavored Markdown support |
| **KaTeX** | 0.16.25 | LaTeX math rendering |

### Build Tools

| Technology | Version | Purpose |
|-----------|---------|----------|
| **Electron Forge** | 7.10.2 | Build and packaging |
| **Webpack** | Via Forge | Module bundling |
| **PostCSS** | 8.5.6 | CSS processing |
| **Autoprefixer** | 10.4.21 | CSS vendor prefixes |

---

## Directory Structure

```
VibeMD/
│
├── src/
│   ├── main/                           # Electron Main Process
│   │   ├── index.ts                   # Main entry point, app lifecycle
│   │   ├── window.ts                  # Window creation and management
│   │   └── handlers/                  # IPC request handlers
│   │       ├── fileHandlers.ts        # File I/O operations
│   │       └── settingsHandlers.ts    # Settings, print, system paths
│   │
│   ├── preload/                       # Preload Scripts (Context Bridge)
│   │   └── index.ts                   # Exposes electronAPI to renderer
│   │
│   ├── renderer/                      # React Application (Renderer Process)
│   │   ├── index.tsx                  # React app entry point
│   │   ├── App.tsx                    # Root component with providers
│   │   │
│   │   ├── components/                # UI Components
│   │   │   ├── dialogs/               # Modal Dialog Components
│   │   │   │   ├── SettingsDialog.tsx     # Main settings dialog container
│   │   │   │   ├── MathDialog.tsx         # LaTeX formula input dialog
│   │   │   │   ├── LinkDialog.tsx         # Link insertion dialog
│   │   │   │   ├── ImageDialog.tsx        # Image insertion dialog
│   │   │   │   ├── GeneralSettings.tsx    # General settings tab
│   │   │   │   ├── ThemeSettings.tsx      # Appearance settings tab
│   │   │   │   ├── FilesSettings.tsx      # Files settings tab
│   │   │   │   ├── EditorSettings.tsx     # Editor settings tab
│   │   │   │   └── AboutTab.tsx           # About/licenses tab
│   │   │   │
│   │   │   ├── editor/                # Editor Components
│   │   │   │   └── TipTapEditor.tsx       # Main WYSIWYG editor component
│   │   │   │
│   │   │   ├── layout/                # Layout Components
│   │   │   │   ├── Layout.tsx             # Main application layout
│   │   │   │   ├── Toolbar.tsx            # Top formatting toolbar
│   │   │   │   ├── Sidebar.tsx            # Left sidebar container
│   │   │   │   ├── StatusBar.tsx          # Bottom status bar
│   │   │   │   └── EditorWindow.tsx       # Editor container
│   │   │   │
│   │   │   ├── sidebar/               # Sidebar Tab Components
│   │   │   │   ├── FilesTab.tsx           # Open documents list
│   │   │   │   ├── OutlineTab.tsx         # Document heading outline
│   │   │   │   └── TemplatesTab.tsx       # Available templates
│   │   │   │
│   │   │   └── ui/                    # Reusable UI Primitives (shadcn/ui)
│   │   │       ├── button.tsx             # Button component
│   │   │       ├── dialog.tsx             # Dialog primitive
│   │   │       ├── input.tsx              # Input field
│   │   │       ├── select.tsx             # Select dropdown
│   │   │       ├── tabs.tsx               # Tabs component
│   │   │       ├── tooltip.tsx            # Tooltip component
│   │   │       ├── checkbox.tsx           # Checkbox component
│   │   │       ├── label.tsx              # Label component
│   │   │       ├── radio-group.tsx        # Radio group component
│   │   │       └── separator.tsx          # Visual separator
│   │   │
│   │   ├── hooks/                     # Custom React Hooks
│   │   │   ├── useKeyboardShortcuts.ts    # Keyboard shortcut handling
│   │   │   └── useTheme.ts                # Theme management hook
│   │   │
│   │   ├── services/                  # Business Logic Services
│   │   │   ├── fileService.ts             # File operations wrapper
│   │   │   ├── menuService.ts             # Menu event handling
│   │   │   ├── settingsService.ts         # Settings persistence
│   │   │   ├── markdownService.ts         # Markdown conversion
│   │   │   ├── editorService.ts           # Editor utilities
│   │   │   ├── navigationService.ts       # Navigation logic
│   │   │   └── appService.ts              # App-level utilities
│   │   │
│   │   ├── stores/                    # Zustand State Stores
│   │   │   ├── documentStore.ts           # Document state (content, files)
│   │   │   ├── uiStore.ts                 # UI state (theme, sidebar)
│   │   │   ├── settingsStore.ts           # Settings state
│   │   │   └── templatesStore.ts          # Templates state
│   │   │
│   │   ├── lib/                       # Utility Functions
│   │   │   └── utils.ts                   # Common utilities (cn, etc.)
│   │   │
│   │   └── styles/                    # Global Styles
│   │       └── globals.css                # Tailwind CSS + custom styles
│   │
│   └── shared/                        # Shared Types and Constants
│       └── types.ts                       # TypeScript interfaces
│
├── build/                             # Build Assets
│   └── icons/                         # Application icons
│       ├── icon.svg                       # Source SVG icon
│       ├── icon.png                       # macOS/Linux icon (512x512)
│       ├── icon@2x.png                    # macOS retina icon (1024x1024)
│       ├── icon.ico                       # Windows icon (multi-resolution)
│       └── icon.icns                      # macOS icon set
│
├── templates/                         # Built-in Document Templates
│   ├── meeting-notes.vibe                 # Meeting notes template
│   ├── project-proposal.vibe              # Project proposal template
│   └── ...                                # Additional templates
│
├── scripts/                           # Build and Development Scripts
│   ├── pre-build.js                       # Pre-build documentation
│   └── reset-settings.sh                  # Settings reset utility
│
├── docs/                              # Documentation
│   ├── USER_GUIDE.md                      # End-user documentation
│   ├── ARCHITECTURE_GUIDE.md              # This document
│   └── MARKDOWN_CONFORMANCE.md            # Markdown specification compliance
│
├── forge.config.ts                    # Electron Forge configuration
├── package.json                       # Project dependencies and scripts
├── tsconfig.json                      # TypeScript configuration
├── tailwind.config.js                 # Tailwind CSS configuration
├── postcss.config.js                  # PostCSS configuration
├── .eslintrc.json                     # ESLint configuration
├── README.md                          # Project overview
├── BUILD.md                           # Build instructions
├── DEPLOYMENT_GUIDE.md                # Deployment guide
└── vibemd.sh                          # Process management script (macOS/Linux)
```

---

## Main Process Architecture

The main process is the heart of the Electron application, responsible for lifecycle management, window creation, and IPC handling.

### src/main/index.ts

**Purpose:** Application entry point and lifecycle management

**Key Responsibilities:**
- Initialize Electron app
- Register IPC handlers
- Manage app lifecycle events (ready, window-all-closed, activate)
- Create application window

**Code Structure:**
```typescript
import { app } from 'electron';
import { createWindow } from './window';
import './handlers/fileHandlers';        // Auto-registers IPC handlers
import './handlers/settingsHandlers';    // Auto-registers IPC handlers

app.on('ready', async () => {
  await createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
```

### src/main/window.ts

**Purpose:** Window creation and configuration

**Key Responsibilities:**
- Create BrowserWindow with proper configuration
- Set window properties (size, icon, webPreferences)
- Load index.html
- Configure context isolation and preload script

**Window Configuration:**
```typescript
const window = new BrowserWindow({
  width: 1400,
  height: 900,
  icon: path.join(__dirname, '../../build/icons/icon.png'),
  webPreferences: {
    contextIsolation: true,        // Security: isolate renderer context
    nodeIntegration: false,        // Security: disable Node in renderer
    preload: path.join(__dirname, '../preload/index.js')
  }
});
```

### src/main/handlers/

**Purpose:** IPC request handlers

#### fileHandlers.ts

Handles all file system operations:
- `file:open` - Show open dialog and read file
- `file:save` - Save document to file system
- `file:saveAs` - Show save dialog and write file
- `file:new` - Create new document
- `dialog:showOpenDialog` - Show native open dialog
- `dialog:showSaveDialog` - Show native save dialog

#### settingsHandlers.ts

Handles settings and system operations:
- `settings:load` - Load settings from app data directory
- `settings:save` - Save settings to app data directory
- `system:getUserDocumentsPath` - Get OS documents folder path
- `print:document` - Show print dialog

---

## Renderer Process Architecture

The renderer process is a React application that handles all UI rendering and user interactions.

### src/renderer/index.tsx

**Purpose:** React application entry point

**Responsibilities:**
- Render root `<App />` component
- Mount to DOM element

### src/renderer/App.tsx

**Purpose:** Root application component

**Key Responsibilities:**
- Initialize stores (settings, documents, templates)
- Provide theme context
- Set up keyboard shortcuts
- Render main layout
- Handle menu events

**Component Structure:**
```tsx
function App() {
  const { loadSettings } = useSettingsStore();
  const { theme } = useSettingsStore();

  useEffect(() => {
    loadSettings();
    loadTemplates();
    initializeMenuHandlers();
  }, []);

  useKeyboardShortcuts();

  return (
    <div className={theme}>
      <Layout>
        <Toolbar />
        <Sidebar />
        <EditorWindow />
        <StatusBar />
      </Layout>
      <SettingsDialog />
      <MathDialog />
      {/* Other dialogs */}
    </div>
  );
}
```

---

## State Management

VibeMD uses Zustand for state management with three separate stores for clear separation of concerns.

### documentStore.ts

**Purpose:** Manage document state and operations

**State:**
```typescript
interface DocumentState {
  documents: Document[];           // All open documents
  activeDocumentId: string | null; // Currently active document
  templates: Template[];           // Available templates
}
```

**Actions:**
- `addDocument(document)` - Add new document
- `updateDocument(id, updates)` - Update document content/metadata
- `removeDocument(id)` - Close document
- `setActiveDocument(id)` - Switch active document
- `saveDocument(id)` - Trigger save operation
- `loadTemplates()` - Load available templates

**Key Logic:**
- Documents stored in memory with unsaved changes tracking
- Auto-save integration
- Template loading from file system
- Document metadata (created, modified, file path)

### uiStore.ts

**Purpose:** Manage UI-specific state

**State:**
```typescript
interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  activeSidebarTab: 'files' | 'outline' | 'templates';
  activeDialog: string | null;
}
```

**Actions:**
- `setTheme(theme)` - Change application theme
- `toggleSidebar()` - Show/hide sidebar
- `setActiveSidebarTab(tab)` - Switch sidebar tab
- `openDialog(dialogId)` - Open modal dialog
- `closeDialog()` - Close active dialog

### settingsStore.ts

**Purpose:** Manage application settings

**State:**
```typescript
interface SettingsState {
  settings: {
    general: {
      openLastDocumentOnStartup: boolean;
      autoSave: boolean;
      autoSaveInterval: number;
    };
    appearance: {
      theme: 'light' | 'dark' | 'system';
    };
    files: {
      defaultSavePath: string;
      templatesLocation: string;
    };
    editor: {
      fontSize: number;
      fontFamily: string;
      showLineNumbers: boolean;
    };
  };
}
```

**Actions:**
- `loadSettings()` - Load from file system
- `saveSettings(settings)` - Persist to file system
- `updateSettings(partial)` - Update specific settings
- `resetPathsToDefaults()` - Reset file paths to OS defaults

**Auto-Initialization Logic:**
```typescript
loadSettings: async () => {
  const userDocumentsPath = await window.electronAPI.getUserDocumentsPath();

  if (!existingSettings) {
    // First launch - initialize with OS defaults
    const initialSettings = {
      ...defaultSettings,
      files: {
        defaultSavePath: userDocumentsPath,
        templatesLocation: `${userDocumentsPath}/VibeMD/Templates`,
      },
    };
    set({ settings: initialSettings });
    await saveSettings(initialSettings);
  } else if (settings.files.defaultSavePath === null) {
    // Auto-fix null paths
    settings.files.defaultSavePath = userDocumentsPath;
    await saveSettings(settings);
  }
}
```

---

## Component Architecture

### Layout Components

#### Toolbar.tsx

**Purpose:** Top formatting toolbar with all editor controls

**Features:**
- File operations (New, Open, Save, Print)
- Formatting buttons (Bold, Italic, Strikethrough, etc.)
- Heading dropdown (H1-H6, Normal text)
- List controls (Bullet, Numbered, Task)
- Insert controls (Link, Image, Table, Math Formula)
- Alignment controls (Left, Center, Right)
- Settings button

**Integration:**
- Uses TipTap editor instance via prop
- Reads editor state for button active states
- Executes editor commands on click

#### Sidebar.tsx

**Purpose:** Left sidebar container with tabs

**Features:**
- Collapsible panel
- Three tabs: Files, Outline, Templates
- Tab switching
- Empty state when no documents

**Component Structure:**
```tsx
<Sidebar>
  <Tabs value={activeSidebarTab} onValueChange={setActiveSidebarTab}>
    <TabsList>
      <TabsTrigger value="files">Files</TabsTrigger>
      <TabsTrigger value="outline">Outline</TabsTrigger>
      <TabsTrigger value="templates">Templates</TabsTrigger>
    </TabsList>
    <TabsContent value="files"><FilesTab /></TabsContent>
    <TabsContent value="outline"><OutlineTab /></TabsContent>
    <TabsContent value="templates"><TemplatesTab /></TabsContent>
  </Tabs>
</Sidebar>
```

#### StatusBar.tsx

**Purpose:** Bottom status bar with document information

**Displays:**
- Current document title
- Word count
- Character count
- Line count
- Cursor position

### Editor Component

#### TipTapEditor.tsx

**Purpose:** Main WYSIWYG markdown editor

**Key Features:**
- TipTap integration with full extension suite
- Bidirectional markdown ↔ HTML conversion
- LaTeX math support with placeholder system
- Table editing with context menu
- Task list with interactive checkboxes
- Custom list indentation
- Text alignment

**TipTap Extensions:**
```typescript
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4, 5, 6] },
      codeBlock: { HTMLAttributes: { class: 'code-block' } },
    }),
    Link.configure({ autolink: true, linkOnPaste: true }),
    Image,
    Table.configure({ resizable: true }),
    TableRow,
    TableCell,
    TableHeader,
    TaskList,
    TaskItem.configure({ nested: true }),
    Subscript,
    Superscript,
    Mathematics,           // LaTeX math extension
    HeadingIdExtension,    // Custom: auto-generate heading IDs
    ListIndentExtension,   // Custom: Tab/Shift+Tab support
  ],
  content: markdownToHTML(document.content),
  onUpdate: ({ editor }) => {
    const markdown = htmlToMarkdown(editor.getHTML());
    updateDocument(document.id, { content: markdown });
  },
});
```

**Markdown Conversion Pipeline:**

1. **Markdown → HTML (markdownToHTML):**
   ```typescript
   marked.parse(markdown, {
     gfm: true,
     breaks: false,
     pedantic: false,
   });
   ```

2. **HTML → Markdown (htmlToMarkdown):**
   ```typescript
   // Extract LaTeX math to placeholders
   const mathNodes = extractMathNodes(html);

   // Convert HTML to Markdown
   const markdown = turndownService.turndown(html);

   // Restore LaTeX math from placeholders
   const finalMarkdown = restoreMathNodes(markdown, mathNodes);
   ```

**LaTeX Math Placeholder System:**
- Problem: Turndown escapes underscores in math expressions
- Solution: Extract math nodes before Turndown, replace with placeholders
- Placeholders: `___MATH_PLACEHOLDER_0___`
- After Turndown: Replace both original and escaped placeholders
- Ensures LaTeX formulas preserve correctly

### Dialog Components

#### MathDialog.tsx

**Purpose:** LaTeX formula insertion dialog

**Features:**
- Radio group for inline vs. block math selection
- Text area for LaTeX input
- Preview rendering (future enhancement)
- Insert button to add to editor

**Workflow:**
1. User clicks Formula (ƒ) button in toolbar
2. Dialog opens with inline/block selection
3. User enters LaTeX in plain text
4. Clicks "Insert Math"
5. Math node inserted into editor at cursor
6. Formula renders via KaTeX

#### SettingsDialog.tsx

**Purpose:** Application settings management

**Tabs:**
- General: Auto-save, startup behavior
- Appearance: Theme selection
- Files: Default paths, templates location
- Editor: Font size, line numbers
- About: Version info, licenses

**Settings Persistence:**
- Changes saved to `settings.json` in app data directory
- macOS: `~/Library/Application Support/VibeMD/settings.json`
- Windows: `%APPDATA%\VibeMD\settings.json`
- Linux: `~/.config/VibeMD/settings.json`

---

## Services Layer

Services provide abstraction over complex operations and IPC communication.

### fileService.ts

**Purpose:** File I/O operations wrapper

**Key Functions:**
- `openFile()` - Show open dialog, read file, return content
- `saveFile(content, filePath)` - Write content to file
- `saveFileAs(content)` - Show save dialog, write file
- `showOpenDialog(options)` - Show native open dialog
- `showSaveDialog(options)` - Show native save dialog

**Implementation:**
All functions call IPC via `window.electronAPI`:
```typescript
export async function openFile(): Promise<FileResult | null> {
  const result = await window.electronAPI.openFile();
  if (result.success) {
    return {
      content: result.content,
      filePath: result.filePath,
      fileName: path.basename(result.filePath),
    };
  }
  return null;
}
```

### menuService.ts

**Purpose:** Application menu event handling

**Registered Events:**
- `menu:new` - Create new document
- `menu:open` - Open file dialog
- `menu:save` - Save active document
- `menu:save-as` - Save As dialog
- `menu:print` - Print document
- `menu:settings` - Open settings dialog
- `menu:toggle-sidebar` - Show/hide sidebar

**Event Registration:**
```typescript
export function initializeMenuHandlers() {
  window.electronAPI.on('menu:new', handleNew);
  window.electronAPI.on('menu:open', handleOpen);
  window.electronAPI.on('menu:save', handleSave);
  // ...
}
```

### markdownService.ts

**Purpose:** Markdown conversion utilities

**Key Functions:**
- `markdownToHTML(markdown)` - Parse markdown to HTML
- `htmlToMarkdown(html)` - Convert HTML back to markdown
- `extractMathNodes(html)` - Extract LaTeX math for placeholder system
- `restoreMathNodes(markdown, mathNodes)` - Restore LaTeX from placeholders

### settingsService.ts

**Purpose:** Settings persistence

**Key Functions:**
- `loadSettings()` - Read from app data directory
- `saveSettings(settings)` - Write to app data directory
- `getDefaultSettings()` - Return default settings object

---

## IPC Communication

Electron uses Inter-Process Communication (IPC) to communicate between main and renderer processes.

### Context Bridge Pattern (Preload)

**src/preload/index.ts:**
```typescript
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  openFile: () => ipcRenderer.invoke('file:open'),
  saveFile: (content, filePath) => ipcRenderer.invoke('file:save', content, filePath),
  saveFileAs: (content) => ipcRenderer.invoke('file:saveAs', content),

  // Settings
  loadSettings: () => ipcRenderer.invoke('settings:load'),
  saveSettings: (settings) => ipcRenderer.invoke('settings:save', settings),

  // System
  getUserDocumentsPath: () => ipcRenderer.invoke('system:getUserDocumentsPath'),

  // Menu events (renderer listens)
  on: (channel, callback) => {
    ipcRenderer.on(channel, (_, ...args) => callback(...args));
  },
});
```

### IPC Handlers (Main Process)

**src/main/handlers/fileHandlers.ts:**
```typescript
import { ipcMain, dialog } from 'electron';
import * as fs from 'fs/promises';

ipcMain.handle('file:open', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Markdown', extensions: ['md', 'vibe'] }],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const content = await fs.readFile(result.filePaths[0], 'utf-8');
    return {
      success: true,
      content,
      filePath: result.filePaths[0],
    };
  }
  return { success: false };
});

ipcMain.handle('file:save', async (_, content, filePath) => {
  await fs.writeFile(filePath, content, 'utf-8');
  return { success: true };
});
```

### Type Safety

**src/shared/types.ts:**
```typescript
export interface ElectronAPI {
  openFile: () => Promise<FileOpenResult>;
  saveFile: (content: string, filePath: string) => Promise<SaveResult>;
  saveFileAs: (content: string) => Promise<SaveResult>;
  loadSettings: () => Promise<Settings>;
  saveSettings: (settings: Settings) => Promise<void>;
  getUserDocumentsPath: () => Promise<string>;
  on: (channel: string, callback: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
```

---

## Markdown Processing Pipeline

### Overview

VibeMD uses a bidirectional conversion system to maintain both WYSIWYG editing and markdown file compatibility.

### Markdown → HTML (Display in Editor)

**Process:**
1. Read markdown file or load from store
2. Parse with `marked` library
3. Convert to HTML
4. Load HTML into TipTap editor
5. TipTap renders WYSIWYG view

**Code:**
```typescript
import { marked } from 'marked';

function markdownToHTML(markdown: string): string {
  return marked.parse(markdown, {
    gfm: true,         // GitHub Flavored Markdown
    breaks: false,     // Don't convert \n to <br>
    pedantic: false,   // Use GFM over strict CommonMark
  });
}
```

### HTML → Markdown (Save to File)

**Process:**
1. Get HTML from TipTap editor
2. Extract LaTeX math nodes (preserve formulas)
3. Convert HTML to markdown with Turndown
4. Restore LaTeX math nodes
5. Save markdown to file

**Code:**
```typescript
import TurndownService from 'turndown';

function htmlToMarkdown(html: string): string {
  // 1. Extract math nodes
  const mathNodesData: Array<{
    type: 'inline' | 'block';
    latex: string;
    placeholder: string;
  }> = [];

  const mathProcessedHtml = html.replace(
    /<math-inline[^>]*data-latex="([^"]*)"[^>]*>.*?<\/math-inline>/g,
    (match, latex) => {
      const placeholder = `___MATH_PLACEHOLDER_${mathNodesData.length}___`;
      mathNodesData.push({ type: 'inline', latex, placeholder });
      return placeholder;
    }
  );

  // 2. Convert to markdown
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
  });

  // Custom rules for GFM features
  turndownService.addRule('strikethrough', {
    filter: (node) => node.nodeName === 'DEL',
    replacement: (content) => `~~${content}~~`,
  });

  turndownService.addRule('taskItem', {
    filter: (node) =>
      node.nodeName === 'LI' &&
      node.getAttribute('data-type') === 'taskItem',
    replacement: (content, node) => {
      const checkbox = node.querySelector('input[type="checkbox"]');
      const isChecked = checkbox?.checked || false;
      const textDiv = node.querySelector('div');
      const taskText = textDiv?.textContent?.trim() || '';
      return `- [${isChecked ? 'x' : ' '}] ${taskText}\n`;
    },
  });

  const markdown = turndownService.turndown(mathProcessedHtml);

  // 3. Restore math nodes (handle both original and escaped placeholders)
  let finalMarkdown = markdown;
  mathNodesData.forEach(({ type, latex, placeholder }) => {
    const mathMarkdown = type === 'block' ? `\n$$${latex}$$\n` : `$${latex}$`;

    // Turndown escapes underscores: ___ → \_\_\_
    const escapedPlaceholder = placeholder.replace(/_/g, '\\_');

    const regex1 = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const regex2 = new RegExp(escapedPlaceholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

    finalMarkdown = finalMarkdown.replace(regex1, mathMarkdown);
    finalMarkdown = finalMarkdown.replace(regex2, mathMarkdown);
  });

  return finalMarkdown;
}
```

### LaTeX Math Handling

**Challenge:**
- TipTap stores math as custom nodes with `data-latex` attribute
- Turndown escapes underscores in placeholders
- Need to preserve exact LaTeX syntax

**Solution:**
1. Extract math nodes before Turndown processing
2. Replace with unique placeholders
3. Run Turndown on HTML without math nodes
4. Replace both original and escaped placeholders with LaTeX syntax
5. Result: Perfect preservation of math formulas

---

## Build and Packaging

### Electron Forge Configuration

**forge.config.ts:**
```typescript
import type { ForgeConfig } from '@electron-forge/shared-types';

const config: ForgeConfig = {
  packagerConfig: {
    name: 'VibeMD',
    executableName: 'VibeMD',
    icon: './build/icons/icon',
    appBundleId: 'com.vibemd.app',
    appCategoryType: 'public.app-category.productivity',
    win32metadata: {
      CompanyName: 'ONLY1 Pty Ltd',
      ProductName: 'VibeMD',
      FileDescription: 'VibeMD - Modern Markdown Editor',
      InternalName: 'VibeMD',
    },
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',  // Windows installer
      config: {
        name: 'VibeMD',
        setupIcon: './build/icons/icon.ico',
      },
    },
    {
      name: '@electron-forge/maker-dmg',       // macOS disk image
      config: {
        icon: './build/icons/icon.icns',
        name: 'VibeMD',
      },
    },
    {
      name: '@electron-forge/maker-deb',       // Linux Debian package
      config: {
        options: {
          name: 'vibemd',
          productName: 'VibeMD',
          icon: './build/icons/icon.png',
        },
      },
    },
    {
      name: '@electron-forge/maker-rpm',       // Linux RPM package
      config: {
        options: {
          name: 'vibemd',
          productName: 'VibeMD',
          icon: './build/icons/icon.png',
        },
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [{
            html: './src/renderer/index.html',
            js: './src/renderer/index.tsx',
            name: 'main_window',
            preload: {
              js: './src/preload/index.ts',
            },
          }],
        },
      },
    },
  ],
};

export default config;
```

### Build Process

1. **Development:**
   ```bash
   npm start  # Webpack dev server + Electron
   ```

2. **Package (without installer):**
   ```bash
   npm run package  # Creates app bundle in out/
   ```

3. **Make (with installer):**
   ```bash
   npm run make  # Creates distributable in out/make/
   ```

### Platform-Specific Builds

**Windows:**
```bash
npm run package -- --platform=win32 --arch=x64
```

**macOS:**
```bash
npm run package -- --platform=darwin --arch=arm64
```

**Linux:**
```bash
npm run package -- --platform=linux --arch=x64
```

---

## Summary

VibeMD's architecture follows Electron best practices with:

- **Clear process separation**: Main, preload, and renderer processes with defined responsibilities
- **Type safety**: Full TypeScript coverage across all code
- **Secure IPC**: Context bridge pattern prevents security vulnerabilities
- **State management**: Zustand provides predictable state updates
- **Component composition**: React components follow single-responsibility principle
- **Service abstraction**: Business logic separated from UI components
- **Bidirectional markdown**: Seamless conversion between markdown and WYSIWYG
- **Cross-platform**: Native OS integration across macOS, Windows, and Linux

The architecture is designed to be maintainable, extensible, and performant while providing an excellent user experience for markdown editing.

---

**VibeMD Architecture Guide v1.0.0**
**Copyright © 2025 ONLY1 Pty Ltd**
**Last Updated: October 21, 2025**
