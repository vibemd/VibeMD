# VibeMD - Implementation Plan

## 1. Project Overview

### 1.1 Development Methodology
- **Approach**: Agile/Iterative development
- **Phase Duration**: 2-3 weeks per phase
- **Testing**: Continuous testing throughout each phase
- **Review**: End-of-phase review and adjustment

### 1.2 Development Phases
1. **Phase 0**: Project Setup and Infrastructure
2. **Phase 1**: Core Application Structure
3. **Phase 2**: File Management System
4. **Phase 3**: Editor Implementation (WYSIWYG)
5. **Phase 4**: Editor Implementation (Split & Preview)
6. **Phase 5**: Template System
7. **Phase 6**: Settings and Configuration
8. **Phase 7**: UI Polish and Theming
9. **Phase 8**: Testing and Bug Fixes
10. **Phase 9**: Documentation and Release Preparation

## 2. Phase 0: Project Setup and Infrastructure

**Duration**: 3-5 days

### 2.1 Repository Setup
```bash
# Initialize project
mkdir vibemd
cd vibemd
git init
npm init -y

# Setup .gitignore
cat > .gitignore << EOF
node_modules/
out/
.DS_Store
*.log
dist/
.webpack/
.vscode/settings.json
EOF
```

### 2.2 Electron Forge Installation
```bash
# Install Electron Forge with Webpack template
npm install --save-dev @electron-forge/cli
npx electron-forge import

# Or create new project
npx create-electron-app vibemd --template=webpack-typescript
```

### 2.3 Install Core Dependencies
```bash
# React and TypeScript
npm install react react-dom
npm install --save-dev @types/react @types/react-dom

# State Management
npm install zustand

# UI Components
npm install @radix-ui/react-dialog @radix-ui/react-tabs
npm install @radix-ui/react-select @radix-ui/react-checkbox
npm install @radix-ui/react-dropdown-menu

# Styling
npm install tailwindcss postcss autoprefixer
npm install clsx tailwind-merge

# Utilities
npm install date-fns
npm install lucide-react
npm install zod

# Development
npm install --save-dev typescript
npm install --save-dev eslint prettier
npm install --save-dev @typescript-eslint/eslint-plugin
npm install --save-dev @typescript-eslint/parser
```

### 2.4 Configure Tailwind CSS
```bash
npx tailwindcss init -p
```

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/renderer/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Add more colors as needed
      },
    },
  },
  plugins: [],
}
```

### 2.5 Setup Project Structure
```bash
mkdir -p src/{main,renderer,preload,shared}
mkdir -p src/renderer/{components,stores,services,hooks,utils,types,styles}
mkdir -p src/renderer/components/{layout,sidebar,editor,dialogs,ui}
mkdir -p src/main/{handlers,utils}
mkdir -p assets
```

### 2.6 Configure TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "commonjs",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "strict": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/renderer/*"],
      "@main/*": ["./src/main/*"],
      "@shared/*": ["./src/shared/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "out"]
}
```

### 2.7 Setup ESLint and Prettier
```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react"],
  "rules": {
    "react/react-in-jsx-scope": "off"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### 2.8 Deliverables
- [ ] Project initialized with Electron Forge
- [ ] All core dependencies installed
- [ ] Tailwind CSS configured
- [ ] TypeScript configured with path aliases
- [ ] ESLint and Prettier configured
- [ ] Project structure created
- [ ] Git repository initialized with .gitignore

---

## 3. Phase 1: Core Application Structure

**Duration**: 5-7 days

### 3.1 Main Process Setup

#### 3.1.1 Create Main Window Manager
```typescript
// src/main/window.ts
import { BrowserWindow, app } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

export const createMainWindow = (): BrowserWindow => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, '../preload/index.js'),
    },
    show: false, // Show after ready-to-show
  });

  // Load renderer
  if (MAIN_WINDOW_WEBPACK_ENTRY) {
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  }

  // Show when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Handle close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
};

export const getMainWindow = (): BrowserWindow | null => mainWindow;
```

#### 3.1.2 Create Application Entry Point
```typescript
// src/main/index.ts
import { app, BrowserWindow } from 'electron';
import { createMainWindow } from './window';
import './handlers'; // Import IPC handlers

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) {
  app.quit();
}

app.on('ready', () => {
  createMainWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
```

### 3.2 Preload Script Setup

```typescript
// src/preload/index.ts
import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  fileNew: () => ipcRenderer.invoke('file:new'),
  fileOpen: () => ipcRenderer.invoke('file:open'),
  fileSave: (filepath: string, content: string) => 
    ipcRenderer.invoke('file:save', filepath, content),
  fileSaveAs: (content: string) => 
    ipcRenderer.invoke('file:saveAs', content),
  fileRead: (filepath: string) => 
    ipcRenderer.invoke('file:read', filepath),
  
  // Directory operations
  selectFolder: () => ipcRenderer.invoke('dir:selectFolder'),
  readTemplates: (dirPath: string) => 
    ipcRenderer.invoke('dir:readTemplates', dirPath),
  
  // System operations
  getUserDocumentsPath: () => 
    ipcRenderer.invoke('system:getUserDocumentsPath'),
  
  // Settings operations
  loadSettings: () => ipcRenderer.invoke('settings:load'),
  saveSettings: (settings: any) => 
    ipcRenderer.invoke('settings:save', settings),
  
  // Print operations
  printDocument: (htmlContent: string) => 
    ipcRenderer.invoke('print:document', htmlContent),
});
```

```typescript
// src/shared/types.ts
export interface ElectronAPI {
  fileNew: () => Promise<string>;
  fileOpen: () => Promise<{ filepath: string; content: string }>;
  fileSave: (filepath: string, content: string) => Promise<boolean>;
  fileSaveAs: (content: string) => Promise<string>;
  fileRead: (filepath: string) => Promise<string>;
  selectFolder: () => Promise<string>;
  readTemplates: (dirPath: string) => Promise<Template[]>;
  getUserDocumentsPath: () => Promise<string>;
  loadSettings: () => Promise<Settings>;
  saveSettings: (settings: Settings) => Promise<void>;
  printDocument: (htmlContent: string) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
```

### 3.3 Basic IPC Handlers

```typescript
// src/main/handlers/index.ts
import './fileHandlers';
import './settingsHandlers';
import './systemHandlers';

// Re-export for main process import
```

```typescript
// src/main/handlers/fileHandlers.ts
import { ipcMain, dialog } from 'electron';
import { promises as fs } from 'fs';
import path from 'path';
import { getMainWindow } from '../window';

// Placeholder implementations - will be fully implemented in Phase 2
ipcMain.handle('file:new', async () => {
  return '';
});

ipcMain.handle('file:open', async () => {
  const window = getMainWindow();
  if (!window) return null;

  const result = await dialog.showOpenDialog(window, {
    properties: ['openFile'],
    filters: [
      { name: 'Markdown', extensions: ['md', 'markdown'] },
      { name: 'Text', extensions: ['txt'] },
      { name: 'Templates', extensions: ['vibe'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const filepath = result.filePaths[0];
  const content = await fs.readFile(filepath, 'utf-8');

  return { filepath, content };
});

// More handlers will be implemented in Phase 2
```

### 3.4 Renderer Setup

#### 3.4.1 Create Root Component
```typescript
// src/renderer/App.tsx
import { useState, useEffect } from 'react';
import './styles/globals.css';

function App() {
  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-4xl font-bold">VibeMD</h1>
      </div>
    </div>
  );
}

export default App;
```

```typescript
// src/renderer/index.tsx
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);
root.render(<App />);
```

```html
<!-- src/renderer/index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>VibeMD</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

#### 3.4.2 Create Global Styles
```css
/* src/renderer/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    /* Add more CSS variables */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --border: 217.2 32.6% 17.5%;
    /* Add more CSS variables */
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
    'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
    'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  width: 100%;
  height: 100vh;
}
```

### 3.5 Deliverables
- [ ] Main process window manager implemented
- [ ] Preload script with IPC bridge configured
- [ ] Basic IPC handlers registered
- [ ] Renderer process with React setup
- [ ] Global styles and Tailwind configured
- [ ] Application launches successfully

---

## 4. Phase 2: File Management System

**Duration**: 7-10 days

### 4.1 Type Definitions

```typescript
// src/renderer/types/document.ts
export interface Document {
  id: string;
  filename: string;
  filepath: string | null;
  content: string;
  isModified: boolean;
  lastSaved: Date | null;
  isTemplate: boolean;
}

export interface Template {
  id: string;
  filename: string;
  filepath: string;
  content: string;
}
```

```typescript
// src/renderer/types/settings.ts
export interface Settings {
  general: {
    language: string;
    autosave: boolean;
    autosaveInterval: number;
  };
  theme: 'light' | 'dark' | 'system';
  files: {
    defaultExtension: string;
    documentsLocation: string;
    templatesLocation: string;
  };
  editor: {
    fontSize: number;
    wordWrap: boolean;
    showLineNumbers: boolean;
    latexSupport: boolean;
  };
  window: {
    width: number;
    height: number;
    sidebarWidth: number;
  };
}

export const defaultSettings: Settings = {
  general: {
    language: 'en',
    autosave: false,
    autosaveInterval: 5,
  },
  theme: 'system',
  files: {
    defaultExtension: 'md',
    documentsLocation: '',
    templatesLocation: '',
  },
  editor: {
    fontSize: 14,
    wordWrap: true,
    showLineNumbers: true,
    latexSupport: false,
  },
  window: {
    width: 1200,
    height: 800,
    sidebarWidth: 250,
  },
};
```

### 4.2 Complete IPC Handlers

```typescript
// src/main/handlers/fileHandlers.ts
import { ipcMain, dialog } from 'electron';
import { promises as fs } from 'fs';
import path from 'path';
import { getMainWindow } from '../window';
import { v4 as uuidv4 } from 'uuid';

ipcMain.handle('file:new', async () => {
  return uuidv4();
});

ipcMain.handle('file:open', async () => {
  const window = getMainWindow();
  if (!window) return null;

  const result = await dialog.showOpenDialog(window, {
    properties: ['openFile'],
    filters: [
      { name: 'Markdown', extensions: ['md', 'markdown'] },
      { name: 'Text', extensions: ['txt'] },
      { name: 'Templates', extensions: ['vibe'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const filepath = result.filePaths[0];
  const content = await fs.readFile(filepath, 'utf-8');
  const filename = path.basename(filepath);

  return { 
    id: uuidv4(),
    filepath, 
    filename,
    content,
    isTemplate: filepath.endsWith('.vibe')
  };
});

ipcMain.handle('file:save', async (_event, filepath: string, content: string) => {
  try {
    await fs.writeFile(filepath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving file:', error);
    return false;
  }
});

ipcMain.handle('file:saveAs', async (_event, content: string, defaultPath?: string) => {
  const window = getMainWindow();
  if (!window) return null;

  const result = await dialog.showSaveDialog(window, {
    defaultPath,
    filters: [
      { name: 'Markdown', extensions: ['md', 'markdown'] },
      { name: 'Text', extensions: ['txt'] },
      { name: 'Templates', extensions: ['vibe'] },
    ],
  });

  if (result.canceled || !result.filePath) {
    return null;
  }

  try {
    await fs.writeFile(result.filePath, content, 'utf-8');
    return result.filePath;
  } catch (error) {
    console.error('Error saving file:', error);
    return null;
  }
});

ipcMain.handle('file:read', async (_event, filepath: string) => {
  try {
    const content = await fs.readFile(filepath, 'utf-8');
    return content;
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
});

ipcMain.handle('dir:selectFolder', async () => {
  const window = getMainWindow();
  if (!window) return null;

  const result = await dialog.showOpenDialog(window, {
    properties: ['openDirectory'],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
});

ipcMain.handle('dir:readTemplates', async (_event, dirPath: string) => {
  try {
    const files = await fs.readdir(dirPath);
    const templates = [];

    for (const file of files) {
      if (file.endsWith('.vibe')) {
        const filepath = path.join(dirPath, file);
        const content = await fs.readFile(filepath, 'utf-8');
        templates.push({
          id: uuidv4(),
          filename: file,
          filepath,
          content,
        });
      }
    }

    return templates;
  } catch (error) {
    console.error('Error reading templates:', error);
    return [];
  }
});
```

```typescript
// src/main/handlers/settingsHandlers.ts
import { ipcMain, app } from 'electron';
import { promises as fs } from 'fs';
import path from 'path';

const getSettingsPath = (): string => {
  const userDataPath = app.getPath('userData');
  return path.join(userDataPath, 'settings.json');
};

ipcMain.handle('settings:load', async () => {
  const settingsPath = getSettingsPath();
  
  try {
    const data = await fs.readFile(settingsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Return default settings if file doesn't exist
    return null;
  }
});

ipcMain.handle('settings:save', async (_event, settings: any) => {
  const settingsPath = getSettingsPath();
  
  try {
    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
});
```

```typescript
// src/main/handlers/systemHandlers.ts
import { ipcMain, app } from 'electron';

ipcMain.handle('system:getUserDocumentsPath', async () => {
  return app.getPath('documents');
});
```

### 4.3 Document Store

```typescript
// src/renderer/stores/documentStore.ts
import { create } from 'zustand';
import { Document } from '@/types/document';

interface DocumentStore {
  documents: Map<string, Document>;
  activeDocumentId: string | null;
  
  addDocument: (doc: Document) => void;
  removeDocument: (id: string) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  setActiveDocument: (id: string) => void;
  getActiveDocument: () => Document | null;
  markAsModified: (id: string) => void;
  markAsSaved: (id: string) => void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: new Map(),
  activeDocumentId: null,

  addDocument: (doc) =>
    set((state) => {
      const newDocs = new Map(state.documents);
      newDocs.set(doc.id, doc);
      return { 
        documents: newDocs,
        activeDocumentId: doc.id 
      };
    }),

  removeDocument: (id) =>
    set((state) => {
      const newDocs = new Map(state.documents);
      newDocs.delete(id);
      
      let newActiveId = state.activeDocumentId;
      if (state.activeDocumentId === id) {
        const remaining = Array.from(newDocs.keys());
        newActiveId = remaining.length > 0 ? remaining[0] : null;
      }
      
      return { 
        documents: newDocs,
        activeDocumentId: newActiveId 
      };
    }),

  updateDocument: (id, updates) =>
    set((state) => {
      const doc = state.documents.get(id);
      if (!doc) return state;

      const newDocs = new Map(state.documents);
      newDocs.set(id, { ...doc, ...updates });
      return { documents: newDocs };
    }),

  setActiveDocument: (id) =>
    set({ activeDocumentId: id }),

  getActiveDocument: () => {
    const state = get();
    if (!state.activeDocumentId) return null;
    return state.documents.get(state.activeDocumentId) || null;
  },

  markAsModified: (id) =>
    set((state) => {
      const doc = state.documents.get(id);
      if (!doc) return state;

      const newDocs = new Map(state.documents);
      newDocs.set(id, { ...doc, isModified: true });
      return { documents: newDocs };
    }),

  markAsSaved: (id) =>
    set((state) => {
      const doc = state.documents.get(id);
      if (!doc) return state;

      const newDocs = new Map(state.documents);
      newDocs.set(id, { 
        ...doc, 
        isModified: false,
        lastSaved: new Date()
      });
      return { documents: newDocs };
    }),
}));
```

### 4.4 File Service

```typescript
// src/renderer/services/fileService.ts
import { Document } from '@/types/document';

export class FileService {
  async createNewFile(): Promise<string> {
    return await window.electronAPI.fileNew();
  }

  async openFile(): Promise<Omit<Document, 'isModified' | 'lastSaved'> | null> {
    const result = await window.electronAPI.fileOpen();
    if (!result) return null;

    return {
      id: crypto.randomUUID(),
      filename: result.filename,
      filepath: result.filepath,
      content: result.content,
      isTemplate: result.isTemplate,
    };
  }

  async saveFile(filepath: string, content: string): Promise<boolean> {
    return await window.electronAPI.fileSave(filepath, content);
  }

  async saveFileAs(content: string, defaultPath?: string): Promise<string | null> {
    return await window.electronAPI.fileSaveAs(content, defaultPath);
  }

  async readFile(filepath: string): Promise<string | null> {
    return await window.electronAPI.fileRead(filepath);
  }
}

export const fileService = new FileService();
```

### 4.5 Deliverables
- [ ] Complete type definitions for documents and settings
- [ ] All IPC handlers fully implemented
- [ ] Document store with Zustand implemented
- [ ] File service abstraction layer created
- [ ] File operations tested (create, open, save, save as)

---

## 5. Phase 3: Layout and Basic UI

**Duration**: 7-10 days

### 5.1 Install ShadCN Components
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add scroll-area
```

### 5.2 Create Layout Components

```typescript
// src/renderer/components/layout/Layout.tsx
import { Toolbar } from './Toolbar';
import { Sidebar } from './Sidebar';
import { EditorWindow } from './EditorWindow';
import { StatusBar } from './StatusBar';

export function Layout() {
  return (
    <div className="h-screen flex flex-col">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <EditorWindow />
      </div>
      <StatusBar />
    </div>
  );
}
```

```typescript
// src/renderer/components/layout/Toolbar.tsx
import { 
  FileText, 
  FolderOpen, 
  Save, 
  Printer, 
  Settings 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function Toolbar() {
  const handleNew = () => {
    // Will be implemented with document store
  };

  const handleOpen = () => {
    // Will be implemented with document store
  };

  const handleSave = () => {
    // Will be implemented with document store
  };

  const handlePrint = () => {
    // Will be implemented later
  };

  const handleSettings = () => {
    // Will be implemented with settings dialog
  };

  return (
    <div className="h-14 border-b flex items-center px-4 gap-2">
      {/* Left side - File operations */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleNew}
        className="gap-2"
      >
        <FileText className="h-4 w-4" />
        New
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleOpen}
        className="gap-2"
      >
        <FolderOpen className="h-4 w-4" />
        Open
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSave}
        className="gap-2"
      >
        <Save className="h-4 w-4" />
        Save
      </Button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side - Utility actions */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePrint}
        className="gap-2"
      >
        <Printer className="h-4 w-4" />
        Print
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSettings}
        className="gap-2"
      >
        <Settings className="h-4 w-4" />
        Settings
      </Button>
    </div>
  );
}
```

```typescript
// src/renderer/components/layout/Sidebar.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FilesTab } from '@/components/sidebar/FilesTab';
import { OutlineTab } from '@/components/sidebar/OutlineTab';
import { TemplatesTab } from '@/components/sidebar/TemplatesTab';

export function Sidebar() {
  return (
    <div className="w-64 border-r flex flex-col">
      <Tabs defaultValue="files" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="outline">Outline</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="files" className="flex-1 overflow-auto">
          <FilesTab />
        </TabsContent>
        
        <TabsContent value="outline" className="flex-1 overflow-auto">
          <OutlineTab />
        </TabsContent>
        
        <TabsContent value="templates" className="flex-1 overflow-auto">
          <TemplatesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

```typescript
// src/renderer/components/layout/EditorWindow.tsx
export function EditorWindow() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-semibold">No document open</h2>
          <p className="text-muted-foreground">
            Create or open a document to start editing
          </p>
        </div>
      </div>
    </div>
  );
}
```

```typescript
// src/renderer/components/layout/StatusBar.tsx
export function StatusBar() {
  return (
    <div className="h-8 border-t flex items-center px-4 text-sm text-muted-foreground">
      <div className="flex-1">
        <span>0 words, 0 characters</span>
      </div>
      <div>
        <span>No document open</span>
      </div>
    </div>
  );
}
```

### 5.3 Create Sidebar Tab Components

```typescript
// src/renderer/components/sidebar/FilesTab.tsx
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDocumentStore } from '@/stores/documentStore';

export function FilesTab() {
  const documents = useDocumentStore((state) => state.documents);

  if (documents.size === 0) {
    return (
      <div className="p-4 space-y-4">
        <div className="text-center space-y-2">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No documents open</p>
          <p className="text-xs text-muted-foreground">
            Get started by creating or opening a document
          </p>
        </div>
        <div className="space-y-2">
          <Button className="w-full" variant="default">
            New Document
          </Button>
          <Button className="w-full" variant="outline">
            Open Document
          </Button>
          <Button className="w-full" variant="outline">
            Use Template
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      {Array.from(documents.values()).map((doc) => (
        <div
          key={doc.id}
          className="p-2 rounded hover:bg-accent cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="flex-1 truncate">{doc.filename}</span>
            {doc.isModified && (
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

```typescript
// src/renderer/components/sidebar/OutlineTab.tsx
export function OutlineTab() {
  return (
    <div className="p-4 text-center text-sm text-muted-foreground">
      <p>Outline will be generated from document headings</p>
    </div>
  );
}
```

```typescript
// src/renderer/components/sidebar/TemplatesTab.tsx
export function TemplatesTab() {
  return (
    <div className="p-4 text-center text-sm text-muted-foreground">
      <p>No templates available</p>
    </div>
  );
}
```

### 5.4 Update App Component

```typescript
// src/renderer/App.tsx
import { Layout } from '@/components/layout/Layout';
import '@/styles/globals.css';

function App() {
  return <Layout />;
}

export default App;
```

### 5.5 Deliverables
- [ ] ShadCN components installed and configured
- [ ] Layout structure implemented (Toolbar, Sidebar, Editor, StatusBar)
- [ ] Sidebar tabs created with empty states
- [ ] UI matches design from screen samples
- [ ] Responsive layout working

---

## 6. Phase 4: Connect UI to File Operations

**Duration**: 5-7 days

### 6.1 Integrate File Operations with Toolbar

```typescript
// src/renderer/components/layout/Toolbar.tsx (updated)
import { useDocumentStore } from '@/stores/documentStore';
import { fileService } from '@/services/fileService';
import { Document } from '@/types/document';

export function Toolbar() {
  const { addDocument, getActiveDocument, updateDocument, markAsSaved } = 
    useDocumentStore();

  const handleNew = async () => {
    const id = await fileService.createNewFile();
    const newDoc: Document = {
      id,
      filename: 'Untitled.md',
      filepath: null,
      content: '',
      isModified: false,
      lastSaved: null,
      isTemplate: false,
    };
    addDocument(newDoc);
  };

  const handleOpen = async () => {
    const result = await fileService.openFile();
    if (result) {
      const doc: Document = {
        ...result,
        isModified: false,
        lastSaved: new Date(),
      };
      addDocument(doc);
    }
  };

  const handleSave = async () => {
    const doc = getActiveDocument();
    if (!doc) return;

    if (!doc.filepath) {
      // Trigger Save As
      const filepath = await fileService.saveFileAs(doc.content);
      if (filepath) {
        updateDocument(doc.id, { filepath });
        await fileService.saveFile(filepath, doc.content);
        markAsSaved(doc.id);
      }
    } else {
      await fileService.saveFile(doc.filepath, doc.content);
      markAsSaved(doc.id);
    }
  };

  // ... rest of component
}
```

### 6.2 Make File List Interactive

```typescript
// src/renderer/components/sidebar/FilesTab.tsx (updated)
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FilesTab() {
  const { 
    documents, 
    activeDocumentId, 
    setActiveDocument, 
    removeDocument 
  } = useDocumentStore();

  // ... empty state code

  return (
    <div className="p-2">
      {Array.from(documents.values()).map((doc) => (
        <div
          key={doc.id}
          className={cn(
            'p-2 rounded hover:bg-accent cursor-pointer group',
            doc.id === activeDocumentId && 'bg-accent'
          )}
          onClick={() => setActiveDocument(doc.id)}
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="flex-1 truncate">{doc.filename}</span>
            {doc.isModified && (
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                removeDocument(doc.id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 6.3 Update Status Bar

```typescript
// src/renderer/components/layout/StatusBar.tsx (updated)
import { useDocumentStore } from '@/stores/documentStore';
import { format } from 'date-fns';
import { useMemo } from 'react';

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function StatusBar() {
  const activeDocument = useDocumentStore((state) => 
    state.getActiveDocument()
  );

  const stats = useMemo(() => {
    if (!activeDocument) return null;
    
    return {
      words: countWords(activeDocument.content),
      chars: activeDocument.content.length,
    };
  }, [activeDocument?.content]);

  const lastSavedText = useMemo(() => {
    if (!activeDocument) return 'No document open';
    if (!activeDocument.lastSaved) return 'New document not yet saved';
    return `Last saved: ${format(activeDocument.lastSaved, 'PPp')}`;
  }, [activeDocument?.lastSaved]);

  return (
    <div className="h-8 border-t flex items-center px-4 text-sm text-muted-foreground">
      <div className="flex-1">
        {stats ? (
          <span>{stats.words} words, {stats.chars} characters</span>
        ) : (
          <span>No document open</span>
        )}
      </div>
      <div>
        <span>{lastSavedText}</span>
      </div>
    </div>
  );
}
```

### 6.4 Deliverables
- [ ] Toolbar buttons functional (New, Open, Save)
- [ ] Files tab shows open documents
- [ ] Document switching working
- [ ] Document close functionality
- [ ] Status bar shows accurate stats
- [ ] Modified indicator working

---

## 7. Phase 5: Editor Implementation (WYSIWYG)

**Duration**: 10-14 days

### 7.1 Install Milkdown Crepe Dependencies
```bash
npm install @milkdown/crepe
npm install @milkdown/react
npm install katex
```

### 7.2 Create WYSIWYG Editor Component

```typescript
// src/renderer/components/editor/WYSIWYGEditor.tsx
import { useEffect, useRef } from 'react';
import { crepe } from '@milkdown/crepe';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';

export function WYSIWYGEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const markAsModified = useDocumentStore((state) => state.markAsModified);
  const latexSupport = useSettingsStore((state) => state.settings.editor.latexSupport);

  const { get } = useEditor((root) => {
    const editor = crepe({
      root,
      features: [
        'toolbar',           // Built-in formatting toolbar
        'commonmark',        // CommonMark support (Phase 1)
        'code-highlight',    // Syntax highlighting
        'image',             // Image handling
        'link',              // Link management
        ...(latexSupport ? ['latex'] : [])  // LaTeX support (Phase 3)
      ]
    });

    return editor;
  }, [activeDocument?.id, latexSupport]);

  useEffect(() => {
    if (!activeDocument) return;

    const editor = get();
    if (!editor) return;

    // Listen for content changes
    const listener = () => {
      const markdown = editor.action((ctx) => {
        const editorView = ctx.get(editorViewCtx);
        return serializer(editorView.state.doc);
      });

      if (markdown !== activeDocument.content) {
        updateDocument(activeDocument.id, { content: markdown });
        markAsModified(activeDocument.id);
      }
    };

    // Add listener
    editor.action((ctx) => {
      const editorView = ctx.get(editorViewCtx);
      editorView.dom.addEventListener('input', listener);
    });

    return () => {
      // Cleanup
    };
  }, [activeDocument, get, updateDocument, markAsModified]);

  if (!activeDocument) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">No document selected</p>
      </div>
    );
  }

  return (
    <MilkdownProvider>
      <div className="flex-1 overflow-auto p-8">
        <Milkdown />
      </div>
    </MilkdownProvider>
  );
}
```

### 7.3 Implement Mode Selector

```typescript
// src/renderer/components/editor/ModeSelector.tsx
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useUIStore } from '@/stores/uiStore';

export function ModeSelector() {
  const { editorMode, setEditorMode } = useUIStore();

  return (
    <div className="h-12 border-b flex items-center px-4">
      <ToggleGroup
        type="single"
        value={editorMode}
        onValueChange={(value) => {
          if (value) setEditorMode(value as any);
        }}
      >
        <ToggleGroupItem value="wysiwyg">
          WYSIWYG
        </ToggleGroupItem>
        <ToggleGroupItem value="split">
          Split
        </ToggleGroupItem>
        <ToggleGroupItem value="preview">
          Preview
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
```

### 7.4 Update Editor Window

```typescript
// src/renderer/components/layout/EditorWindow.tsx (updated)
import { ModeSelector } from '@/components/editor/ModeSelector';
import { WYSIWYGEditor } from '@/components/editor/WYSIWYGEditor';
import { SplitEditor } from '@/components/editor/SplitEditor';
import { PreviewEditor } from '@/components/editor/PreviewEditor';
import { useUIStore } from '@/stores/uiStore';
import { useDocumentStore } from '@/stores/documentStore';

export function EditorWindow() {
  const editorMode = useUIStore((state) => state.editorMode);
  const hasActiveDocument = useDocumentStore(
    (state) => state.activeDocumentId !== null
  );

  if (!hasActiveDocument) {
    return (
      <div className="flex-1 flex flex-col">
        {/* Empty state */}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <ModeSelector />
      {editorMode === 'wysiwyg' && <WYSIWYGEditor />}
      {editorMode === 'split' && <SplitEditor />}
      {editorMode === 'preview' && <PreviewEditor />}
    </div>
  );
}
```

### 7.5 Create UI Store

```typescript
// src/renderer/stores/uiStore.ts
import { create } from 'zustand';

type EditorMode = 'wysiwyg' | 'split' | 'preview';
type SidebarTab = 'files' | 'outline' | 'templates';

interface UIStore {
  editorMode: EditorMode;
  sidebarTab: SidebarTab;
  settingsDialogOpen: boolean;
  
  setEditorMode: (mode: EditorMode) => void;
  setSidebarTab: (tab: SidebarTab) => void;
  toggleSettingsDialog: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  editorMode: 'wysiwyg',
  sidebarTab: 'files',
  settingsDialogOpen: false,

  setEditorMode: (mode) => set({ editorMode: mode }),
  setSidebarTab: (tab) => set({ sidebarTab: tab }),
  toggleSettingsDialog: () => 
    set((state) => ({ settingsDialogOpen: !state.settingsDialogOpen })),
}));
```

### 7.6 Deliverables
- [ ] Milkdown Crepe installed and configured
- [ ] WYSIWYG editor functional with built-in toolbar
- [ ] Mode selector implemented
- [ ] Editor updates document store
- [ ] CommonMark support working (Phase 1)
- [ ] Editor preserves formatting

---

## 7.5 Phase 2.5: GFM Extensions Implementation (Future)

**Duration**: 5-7 days
**Status**: Planned for Phase 2

### 7.5.1 Install GFM Dependencies
```bash
npm install remark-gfm
```

### 7.5.2 Extend Crepe Toolbar
- Add strikethrough button
- Add table insertion button
- Add task list button

### 7.5.3 Update react-markdown
- Add remark-gfm plugin
- Configure GFM features

---

## 7.6 Phase 2.6: LaTeX Support Implementation (Future)

**Duration**: 3-5 days
**Status**: Planned for Phase 3

### 7.6.1 Install LaTeX Dependencies
```bash
npm install remark-math rehype-katex katex
```

### 7.6.2 Configure LaTeX Rendering
- Add remark-math to react-markdown
- Add rehype-katex for rendering
- Configure KaTeX options

---

## 8. Phase 6: Editor Implementation (Split & Preview)

**Duration**: 7-10 days

### 8.1 Install Dependencies
```bash
npm install @uiw/react-codemirror react-markdown
npm install @codemirror/lang-markdown
npm install remark remark-gfm remark-math
npm install rehype-katex rehype-sanitize
```

### 8.2 Create Split Editor

```typescript
// src/renderer/components/editor/SplitEditor.tsx
import { useRef, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import MDEditor from '@uiw/react-md-editor';
import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useSyncScroll } from '@/hooks/useSyncScroll';

export function SplitEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const markAsModified = useDocumentStore((state) => state.markAsModified);
  
  const { showLineNumbers, fontSize } = useSettingsStore(
    (state) => state.settings.editor
  );

  const editorRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  
  const { syncScroll } = useSyncScroll(editorRef, previewRef);

  const handleChange = useCallback((value: string) => {
    if (!activeDocument) return;
    updateDocument(activeDocument.id, { content: value });
    markAsModified(activeDocument.id);
  }, [activeDocument, updateDocument, markAsModified]);

  if (!activeDocument) return null;

  return (
    <div className="flex-1 flex">
      {/* Plain Text Editor */}
      <div 
        ref={editorRef}
        className="flex-1 overflow-auto"
        onScroll={() => syncScroll('editor')}
      >
        <CodeMirror
          value={activeDocument.content}
          onChange={handleChange}
          extensions={[markdown()]}
          options={{
            lineNumbers: showLineNumbers,
            fontSize: `${fontSize}px`,
          }}
          theme="light"
        />
      </div>

      {/* Preview */}
      <div 
        ref={previewRef}
        className="flex-1 border-l overflow-auto"
        onScroll={() => syncScroll('preview')}
      >
        <MDEditor.Markdown 
          source={activeDocument.content}
          style={{ padding: '1rem' }}
        />
      </div>
    </div>
  );
}
```

### 8.3 Create Preview Editor

```typescript
// src/renderer/components/editor/PreviewEditor.tsx
import MDEditor from '@uiw/react-md-editor';
import { useDocumentStore } from '@/stores/documentStore';

export function PreviewEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());

  if (!activeDocument) return null;

  return (
    <div className="flex-1 overflow-auto p-8">
      <MDEditor.Markdown source={activeDocument.content} />
    </div>
  );
}
```

### 8.4 Create Sync Scroll Hook

```typescript
// src/renderer/hooks/useSyncScroll.ts
import { RefObject, useState, useCallback } from 'react';

export function useSyncScroll(
  editorRef: RefObject<HTMLElement>,
  previewRef: RefObject<HTMLElement>
) {
  const [scrolling, setScrolling] = useState<'editor' | 'preview' | null>(null);

  const syncScroll = useCallback((source: 'editor' | 'preview') => {
    if (scrolling && scrolling !== source) return;

    setScrolling(source);
    
    const sourceEl = source === 'editor' 
      ? editorRef.current 
      : previewRef.current;
    const targetEl = source === 'editor' 
      ? previewRef.current 
      : editorRef.current;

    if (!sourceEl || !targetEl) return;

    const percentage = sourceEl.scrollTop / 
      (sourceEl.scrollHeight - sourceEl.clientHeight);
    
    targetEl.scrollTop = percentage * 
      (targetEl.scrollHeight - targetEl.clientHeight);

    setTimeout(() => setScrolling(null), 100);
  }, [editorRef, previewRef, scrolling]);

  return { syncScroll };
}
```

### 8.5 Deliverables
- [ ] Split view editor implemented
- [ ] Plain text editor with CodeMirror working
- [ ] Preview pane rendering correctly
- [ ] Scroll synchronization working
- [ ] Preview editor (view-only) implemented
- [ ] Line numbers toggle working

---

## 9. Phase 7: Template System

**Duration**: 5-7 days

### 9.1 Create Templates Store

```typescript
// src/renderer/stores/templatesStore.ts
import { create } from 'zustand';
import { Template } from '@/types/document';

interface TemplatesStore {
  templates: Template[];
  loading: boolean;
  
  loadTemplates: (dirPath: string) => Promise<void>;
  addTemplate: (template: Template) => void;
  removeTemplate: (id: string) => void;
}

export const useTemplatesStore = create<TemplatesStore>((set) => ({
  templates: [],
  loading: false,

  loadTemplates: async (dirPath) => {
    set({ loading: true });
    try {
      const templates = await window.electronAPI.readTemplates(dirPath);
      set({ templates, loading: false });
    } catch (error) {
      console.error('Error loading templates:', error);
      set({ loading: false });
    }
  },

  addTemplate: (template) =>
    set((state) => ({ 
      templates: [...state.templates, template] 
    })),

  removeTemplate: (id) =>
    set((state) => ({ 
      templates: state.templates.filter((t) => t.id !== id) 
    })),
}));
```

### 9.2 Update Templates Tab

```typescript
// src/renderer/components/sidebar/TemplatesTab.tsx (complete)
import { useEffect } from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTemplatesStore } from '@/stores/templatesStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useDocumentStore } from '@/stores/documentStore';
import { useUIStore } from '@/stores/uiStore';

export function TemplatesTab() {
  const { templates, loading, loadTemplates } = useTemplatesStore();
  const templatesLocation = useSettingsStore(
    (state) => state.settings.files.templatesLocation
  );
  const addDocument = useDocumentStore((state) => state.addDocument);
  const setSidebarTab = useUIStore((state) => state.setSidebarTab);

  useEffect(() => {
    if (templatesLocation) {
      loadTemplates(templatesLocation);
    }
  }, [templatesLocation, loadTemplates]);

  const handleUseTemplate = (template: Template) => {
    const newDoc = {
      id: crypto.randomUUID(),
      filename: `Untitled.md`,
      filepath: null,
      content: template.content,
      isModified: false,
      lastSaved: null,
      isTemplate: false,
    };
    addDocument(newDoc);
    setSidebarTab('files');
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-muted-foreground">Loading templates...</p>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="p-4 text-center space-y-2">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No templates available</p>
        <p className="text-xs text-muted-foreground">
          Add .vibe files to your templates folder
        </p>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-1">
      {templates.map((template) => (
        <div
          key={template.id}
          className="p-2 rounded hover:bg-accent group"
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="flex-1 truncate text-sm">
              {template.filename}
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="w-full mt-2"
            onClick={() => handleUseTemplate(template)}
          >
            Use
          </Button>
        </div>
      ))}
    </div>
  );
}
```

### 9.3 Implement Template Save Warning

```typescript
// src/renderer/components/dialogs/ConfirmationDialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>No</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Yes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

### 9.4 Update Toolbar Save Logic

```typescript
// Add template warning to Toolbar.tsx
const handleSave = async () => {
  const doc = getActiveDocument();
  if (!doc) return;

  // Check if editing a template
  if (doc.isTemplate) {
    setShowTemplateSaveWarning(true);
    return;
  }

  // Regular save logic...
};

const handleTemplateSaveConfirm = async () => {
  // Save to template
  const doc = getActiveDocument();
  if (!doc || !doc.filepath) return;
  
  await fileService.saveFile(doc.filepath, doc.content);
  markAsSaved(doc.id);
  setShowTemplateSaveWarning(false);
};

const handleTemplateSaveCancel = async () => {
  // Create new document from template
  const doc = getActiveDocument();
  if (!doc) return;

  const newDoc = {
    ...doc,
    id: crypto.randomUUID(),
    filename: 'Untitled.md',
    filepath: null,
    isTemplate: false,
  };
  
  addDocument(newDoc);
  setShowTemplateSaveWarning(false);
};
```

### 9.5 Deliverables
- [ ] Templates store implemented
- [ ] Templates tab loads .vibe files
- [ ] Template usage creates new document
- [ ] Template save warning dialog working
- [ ] Template preview functionality

---

## 10. Phase 8: Settings and Configuration

**Duration**: 7-10 days

### 10.1 Create Settings Store

```typescript
// src/renderer/stores/settingsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings, defaultSettings } from '@/types/settings';

interface SettingsStore {
  settings: Settings;
  loading: boolean;
  
  loadSettings: () => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      loading: false,

      loadSettings: async () => {
        set({ loading: true });
        try {
          const saved = await window.electronAPI.loadSettings();
          if (saved) {
            set({ settings: { ...defaultSettings, ...saved }, loading: false });
          } else {
            // First time - set default paths
            const documentsPath = await window.electronAPI.getUserDocumentsPath();
            const templatesPath = `${documentsPath}/VibeMD/Templates`;
            
            set({
              settings: {
                ...defaultSettings,
                files: {
                  ...defaultSettings.files,
                  documentsLocation: documentsPath,
                  templatesLocation: templatesPath,
                },
              },
              loading: false,
            });
          }
        } catch (error) {
          console.error('Error loading settings:', error);
          set({ loading: false });
        }
      },

      updateSettings: async (updates) => {
        const newSettings = { ...get().settings, ...updates };
        set({ settings: newSettings });
        await window.electronAPI.saveSettings(newSettings);
      },

      resetSettings: async () => {
        set({ settings: defaultSettings });
        await window.electronAPI.saveSettings(defaultSettings);
      },
    }),
    {
      name: 'vibemd-settings',
    }
  )
);
```

### 10.2 Create Settings Dialog

```typescript
// src/renderer/components/dialogs/SettingsDialog.tsx
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/uiStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { GeneralSettings } from './settings/GeneralSettings';
import { ThemeSettings } from './settings/ThemeSettings';
import { FilesSettings } from './settings/FilesSettings';
import { EditorSettings } from './settings/EditorSettings';
import { AboutTab } from './settings/AboutTab';

export function SettingsDialog() {
  const { settingsDialogOpen, toggleSettingsDialog } = useUIStore();
  const { settings, updateSettings } = useSettingsStore();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = async () => {
    await updateSettings(localSettings);
    toggleSettingsDialog();
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    toggleSettingsDialog();
  };

  return (
    <Dialog open={settingsDialogOpen} onOpenChange={toggleSettingsDialog}>
      <DialogContent className="max-w-3xl h-[600px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="flex-1 flex">
          <TabsList className="flex-col h-full w-40 justify-start">
            <TabsTrigger value="general" className="w-full">
              General
            </TabsTrigger>
            <TabsTrigger value="theme" className="w-full">
              Theme
            </TabsTrigger>
            <TabsTrigger value="files" className="w-full">
              Files
            </TabsTrigger>
            <TabsTrigger value="editor" className="w-full">
              Editor
            </TabsTrigger>
            <TabsTrigger value="about" className="w-full">
              About
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 pl-6">
            <TabsContent value="general">
              <GeneralSettings
                settings={localSettings}
                onChange={setLocalSettings}
              />
            </TabsContent>
            <TabsContent value="theme">
              <ThemeSettings
                settings={localSettings}
                onChange={setLocalSettings}
              />
            </TabsContent>
            <TabsContent value="files">
              <FilesSettings
                settings={localSettings}
                onChange={setLocalSettings}
              />
            </TabsContent>
            <TabsContent value="editor">
              <EditorSettings
                settings={localSettings}
                onChange={setLocalSettings}
              />
            </TabsContent>
            <TabsContent value="about">
              <AboutTab />
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### 10.3 Create Settings Tab Components

```typescript
// src/renderer/components/dialogs/settings/GeneralSettings.tsx
import { Checkbox } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';
import { Settings } from '@/types/settings';

interface GeneralSettingsProps {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function GeneralSettings({ settings, onChange }: GeneralSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">General Settings</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="autosave"
            checked={settings.general.autosave}
            onCheckedChange={(checked) =>
              onChange({
                ...settings,
                general: { ...settings.general, autosave: !!checked },
              })
            }
          />
          <label htmlFor="autosave" className="text-sm">
            Autosave
            <p className="text-xs text-muted-foreground">
              Automatically save documents at regular intervals
            </p>
          </label>
        </div>

        {settings.general.autosave && (
          <div className="ml-6">
            <label className="text-sm">Autosave Interval</label>
            <Select
              value={settings.general.autosaveInterval.toString()}
              onValueChange={(value) =>
                onChange({
                  ...settings,
                  general: {
                    ...settings.general,
                    autosaveInterval: parseInt(value),
                  },
                })
              }
            >
              <option value="5">5 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}
```

Similar components for ThemeSettings, FilesSettings, EditorSettings, and AboutTab...

### 10.4 Implement Autosave Hook

```typescript
// src/renderer/hooks/useAutosave.ts
import { useEffect } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';
import { useDocumentStore } from '@/stores/documentStore';
import { fileService } from '@/services/fileService';

export function useAutosave() {
  const { settings } = useSettingsStore();
  const { documents, activeDocumentId, markAsSaved } = useDocumentStore();

  useEffect(() => {
    if (!settings.general.autosave) return;

    const interval = settings.general.autosaveInterval * 60 * 1000;

    const timer = setInterval(async () => {
      const doc = documents.get(activeDocumentId);
      
      // Only autosave documents that are already saved
      if (doc?.isModified && doc?.filepath && !doc.isTemplate) {
        const success = await fileService.saveFile(doc.filepath, doc.content);
        if (success) {
          markAsSaved(doc.id);
        }
      }
    }, interval);

    return () => clearInterval(timer);
  }, [settings, documents, activeDocumentId, markAsSaved]);
}
```

### 10.5 Deliverables
- [ ] Settings store with persistence
- [ ] Settings dialog implemented
- [ ] All settings tabs functional
- [ ] Settings save/load working
- [ ] Autosave functionality implemented
- [ ] Theme switching working

---

## 11. Phase 9: Outline Generation

**Duration**: 3-5 days

### 11.1 Install Dependencies
```bash
npm install unified remark-parse mdast-util-to-string
```

### 11.2 Create Outline Utilities

```typescript
// src/renderer/utils/outline.ts
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';

export interface OutlineNode {
  depth: number;
  text: string;
  position: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
  children?: OutlineNode[];
}

export function generateOutline(markdown: string): OutlineNode[] {
  const processor = unified().use(remarkParse);
  const tree = processor.parse(markdown);
  const outline: OutlineNode[] = [];

  visit(tree, 'heading', (node: any) => {
    outline.push({
      depth: node.depth,
      text: toString(node),
      position: node.position,
    });
  });

  return buildOutlineTree(outline);
}

function buildOutlineTree(nodes: OutlineNode[]): OutlineNode[] {
  const root: OutlineNode[] = [];
  const stack: OutlineNode[] = [];

  for (const node of nodes) {
    while (
      stack.length > 0 &&
      stack[stack.length - 1].depth >= node.depth
    ) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(node);
    } else {
      const parent = stack[stack.length - 1];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(node);
    }

    stack.push(node);
  }

  return root;
}
```

### 11.3 Update Outline Tab

```typescript
// src/renderer/components/sidebar/OutlineTab.tsx (complete)
import { useEffect, useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useDocumentStore } from '@/stores/documentStore';
import { generateOutline, OutlineNode } from '@/utils/outline';
import { cn } from '@/lib/utils';

export function OutlineTab() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const [outline, setOutline] = useState<OutlineNode[]>([]);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!activeDocument?.content) {
      setOutline([]);
      return;
    }

    const newOutline = generateOutline(activeDocument.content);
    setOutline(newOutline);
  }, [activeDocument?.content]);

  const handleNodeClick = (node: OutlineNode) => {
    // Scroll to heading in editor
    // This requires integration with editor components
  };

  const toggleCollapse = (text: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(text)) {
        next.delete(text);
      } else {
        next.add(text);
      }
      return next;
    });
  };

  const renderNode = (node: OutlineNode) => {
    const hasChildren = node.children && node.children.length > 0;
    const isCollapsed = collapsed.has(node.text);

    return (
      <div key={`${node.text}-${node.position.start.line}`}>
        <div
          className={cn(
            'flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-accent',
            `ml-${(node.depth - 1) * 4}`
          )}
          onClick={() => handleNodeClick(node)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCollapse(node.text);
              }}
              className="p-0.5"
            >
              {isCollapsed ? (
                <ChevronRight className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
          )}
          <span className="text-sm truncate">{node.text}</span>
        </div>

        {hasChildren && !isCollapsed && (
          <div>{node.children?.map(renderNode)}</div>
        )}
      </div>
    );
  };

  if (!activeDocument) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        <p>No document open</p>
      </div>
    );
  }

  if (outline.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        <p>No headings found in document</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      {outline.map(renderNode)}
    </div>
  );
}
```

### 11.4 Deliverables
- [ ] Outline generation utility implemented
- [ ] Outline tab displays document structure
- [ ] Collapsible outline tree working
- [ ] Outline updates in real-time
- [ ] Navigation to headings functional

---

## 12. Phase 10: Print Functionality

**Duration**: 2-3 days

### 12.1 Implement Print Handler

```typescript
// src/main/handlers/printHandlers.ts
import { ipcMain } from 'electron';
import { getMainWindow } from '../window';

ipcMain.handle('print:document', async (_event, htmlContent: string) => {
  const window = getMainWindow();
  if (!window) return;

  // Create a new hidden window for printing
  const { BrowserWindow } = require('electron');
  const printWindow = new BrowserWindow({ show: false });

  // Load HTML content
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2cm;
          }
          pre {
            background: #f5f5f5;
            padding: 1em;
            border-radius: 4px;
          }
          code {
            background: #f5f5f5;
            padding: 0.2em 0.4em;
            border-radius: 3px;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

  await printWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(html)}`
  );

  // Show print dialog
  printWindow.webContents.print({}, (success, errorType) => {
    if (!success) {
      console.error('Print failed:', errorType);
    }
    printWindow.close();
  });
});
```

### 12.2 Add Print Functionality to Toolbar

```typescript
// Update Toolbar.tsx
const handlePrint = async () => {
  const doc = getActiveDocument();
  if (!doc) return;

  // Convert markdown to HTML
  const html = await convertMarkdownToHTML(doc.content);
  await window.electronAPI.printDocument(html);
};
```

### 12.3 Deliverables
- [ ] Print handler implemented in main process
- [ ] Print button functional in toolbar
- [ ] Document prints with proper formatting
- [ ] Print preview working

---

## 13. Phase 11: Theme Implementation

**Duration**: 3-5 days

### 13.1 Create Theme Hook

```typescript
// src/renderer/hooks/useTheme.ts
import { useEffect } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';

export function useTheme() {
  const theme = useSettingsStore((state) => state.settings.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);

      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => {
        root.classList.remove('light', 'dark');
        root.classList.add(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);
}
```

### 13.2 Apply Theme in App

```typescript
// Update src/renderer/App.tsx
import { useTheme } from '@/hooks/useTheme';
import { useSettingsStore } from '@/stores/settingsStore';
import { useEffect } from 'react';

function App() {
  const { loadSettings } = useSettingsStore();
  useTheme();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return <Layout />;
}
```

### 13.3 Deliverables
- [ ] Theme hook implemented
- [ ] Light theme working
- [ ] Dark theme working
- [ ] System theme detection working
- [ ] Theme persists across sessions

---

## 14. Phase 12: Testing and Bug Fixes

**Duration**: 10-14 days

### 14.1 Unit Tests
- File service tests
- Utility function tests
- Store logic tests

### 14.2 Component Tests
- Toolbar functionality
- Sidebar tabs
- Editor modes
- Settings dialog

### 14.3 Integration Tests
- File operations end-to-end
- Template workflow
- Settings persistence
- Autosave functionality

### 14.4 Manual Testing
- Cross-platform testing (Windows, macOS, Linux)
- Performance testing with large files
- Edge cases and error handling
- UI/UX testing

### 14.5 Bug Fixes
- Address all critical bugs
- Fix UI inconsistencies
- Optimize performance issues
- Improve error messages

### 14.6 Deliverables
- [ ] All unit tests passing
- [ ] Component tests implemented
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] All critical bugs fixed

---

## 15. Phase 13: Documentation and Release

**Duration**: 5-7 days

### 15.1 User Documentation
- Getting started guide
- Feature documentation
- Keyboard shortcuts
- FAQ section

### 15.2 Developer Documentation
- Architecture overview
- API documentation
- Contributing guidelines
- Build instructions

### 15.3 Release Preparation
- Version bump
- Changelog creation
- Build for all platforms
- Code signing
- Create installers

### 15.4 Distribution
- GitHub releases
- Website updates
- Documentation site

### 15.5 Deliverables
- [ ] User guide completed
- [ ] Developer docs completed
- [ ] Release notes written
- [ ] Builds created for all platforms
- [ ] Installers tested
- [ ] v1.0.0 released

---

## 16. Post-Launch Considerations

### 16.1 Monitoring
- Track crash reports
- Monitor user feedback
- Performance analytics

### 16.2 Maintenance
- Bug fixes
- Security updates
- Performance improvements

### 16.3 Future Enhancements
- Mobile version (Capacitor)
- Multi-language support
- Plugin system
- Cloud sync
- Collaborative editing

---

## 17. Development Best Practices

### 17.1 Code Quality
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Keep components small and focused

### 17.2 Git Workflow
- Use feature branches
- Write descriptive commit messages
- Regular commits
- Code reviews before merging

### 17.3 Performance
- Lazy load heavy components
- Debounce expensive operations
- Optimize re-renders
- Monitor memory usage

### 17.4 Security
- Validate all user input
- Sanitize HTML output
- Use context isolation
- Follow Electron security guidelines

---

## 18. Timeline Summary

| Phase | Duration | Cumulative |
|-------|----------|-----------|
| 0: Project Setup | 3-5 days | 5 days |
| 1: Core Structure | 5-7 days | 12 days |
| 2: File Management | 7-10 days | 22 days |
| 3: Layout & UI | 7-10 days | 32 days |
| 4: Connect UI | 5-7 days | 39 days |
| 5: WYSIWYG Editor | 10-14 days | 53 days |
| 6: Split & Preview | 7-10 days | 63 days |
| 7: Templates | 5-7 days | 70 days |
| 8: Settings | 7-10 days | 80 days |
| 9: Outline | 3-5 days | 85 days |
| 10: Print | 2-3 days | 88 days |
| 11: Theming | 3-5 days | 93 days |
| 12: Testing | 10-14 days | 107 days |
| 13: Documentation | 5-7 days | 114 days |

**Total Estimated Time: 15-17 weeks (3.5-4 months)**

---

## 19. Success Criteria

### 19.1 Functional Criteria
- [ ] All editor modes working (WYSIWYG, Split, Preview)
- [ ] File operations complete (New, Open, Save, Save As, Print)
- [ ] Template system functional
- [ ] Settings persist correctly
- [ ] Autosave working
- [ ] Multi-document support
- [ ] Outline generation
- [ ] Theme switching

### 19.2 Quality Criteria
- [ ] No critical bugs
- [ ] Performance meets specifications
- [ ] UI matches design specifications
- [ ] Cross-platform compatibility
- [ ] Comprehensive documentation
- [ ] Test coverage > 70%

### 19.3 User Experience Criteria
- [ ] Intuitive interface
- [ ] Fast and responsive
- [ ] Stable and reliable
- [ ] Accessible
- [ ] Professional appearance
