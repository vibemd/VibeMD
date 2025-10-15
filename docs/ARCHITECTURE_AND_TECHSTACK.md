# VibeMD - Architecture and Tech Stack

## 1. Technology Stack Overview

### 1.1 Core Framework
- **Electron Forge**: Desktop application framework
  - Version: Latest stable (22.x+)
  - Rationale: Cross-platform desktop support, native OS integration
  - Build system: Webpack-based (NOT Vite as specified)
  - Package distribution for Windows, macOS, and Linux

### 1.2 Frontend Framework
- **React**: UI library
  - Version: 18.x
  - TypeScript: 5.x for type safety
  - Rationale: Component-based architecture, extensive ecosystem

### 1.3 UI Component Library
- **ShadCN/ui**: Component collection
  - Built on Radix UI primitives
  - Tailwind CSS for styling
  - Customizable, accessible components

### 1.4 Editor Components

#### WYSIWYG Editor
- **Milkdown Crepe**: Primary WYSIWYG markdown editor
  - Version: Latest stable
  - Built-in extensible toolbar with formatting buttons
  - CommonMark support built-in (Phase 1)
  - Plugin ecosystem for extensibility
  - Components:
    - @milkdown/crepe (complete editor solution)
    - Built-in toolbar with bold, italic, headings, lists, links, images, code blocks

#### Split View Editor
- **CodeMirror 6**: Plain text editor (via react-codemirror)
  - Syntax highlighting for markdown
  - Line numbers support
  - Customizable key bindings
  - Package: @uiw/react-codemirror

- **react-markdown**: Markdown preview renderer
  - HTML rendering of markdown
  - CommonMark compatible (Phase 1)
  - Synchronized scrolling support

#### Preview Mode
- **react-markdown**: Preview-only renderer
  - Same component as split view preview
  - Ensures consistent rendering
  - CommonMark compatible (Phase 1)

### 1.5 Markdown Processing
- **remark**: Markdown processor
  - remark-parse: Markdown to AST
  - remark-gfm: GitHub Flavored Markdown (Phase 2)
  - remark-math: LaTeX math support (Phase 3)
  - remark-rehype: Markdown to HTML

- **rehype**: HTML processor
  - rehype-katex: LaTeX rendering (Phase 3)
  - rehype-sanitize: Security (XSS prevention)
  - rehype-stringify: HTML output

### 1.6 Phased Markdown Support

#### Phase 1: CommonMark (MVP)
- **Core Features**: Headings, emphasis, lists, links, images, code blocks, blockquotes
- **WYSIWYG**: Milkdown Crepe with built-in toolbar
- **Split/Preview**: react-markdown with CommonMark support
- **Status**: Primary implementation focus

#### Phase 2: GFM Extensions (Future)
- **Features**: Strikethrough, tables, task lists
- **Implementation**: Extend Crepe toolbar, add remark-gfm to react-markdown
- **Status**: Planned enhancement

#### Phase 3: LaTeX Support (Future)
- **Features**: Math expressions via KaTeX
- **Implementation**: Add remark-math + rehype-katex to react-markdown
- **Status**: Planned enhancement

### 1.7 Styling
- **Tailwind CSS**: Utility-first CSS framework
  - Version: 3.x
  - Custom configuration for theming
  - Dark mode support

- **CSS Variables**: Dynamic theming
  - Light/Dark/System theme switching
  - ShadCN theme integration

### 1.7 State Management
- **Zustand**: Lightweight state management
  - Document state management
  - Settings management
  - UI state (sidebar, active tab, etc.)
  - Persist middleware for settings

### 1.8 File System Operations
- **Electron APIs**: Native file system access
  - dialog: File open/save dialogs
  - fs: File read/write operations
  - path: Path manipulation
  - app: Application paths

### 1.9 Additional Libraries
- **date-fns**: Date/time formatting for status bar
- **clsx**: Conditional CSS classes
- **react-resizable-panels**: Resizable sidebar/editor panels
- **lucide-react**: Icon library
- **zod**: Schema validation for settings

## 2. Application Architecture

### 2.1 Process Architecture

```
┌─────────────────────────────────────────────┐
│           Main Process (Node.js)             │
│  - Window management                         │
│  - File system operations                    │
│  - OS integration (dialogs, print)           │
│  - IPC handler registration                  │
│  - Menu and accelerators                     │
└─────────────────┬───────────────────────────┘
                  │ IPC
                  │
┌─────────────────▼───────────────────────────┐
│       Renderer Process (Chromium)            │
│  - React application                         │
│  - UI rendering                              │
│  - Editor components                         │
│  - User interactions                         │
└──────────────────────────────────────────────┘
```

### 2.2 Component Architecture

```
App (Root)
├── Layout
│   ├── Toolbar
│   │   ├── FileActions (New, Open, Save, Save As)
│   │   └── UtilityActions (Print, Settings)
│   ├── Sidebar
│   │   ├── TabNavigation
│   │   ├── FilesTab
│   │   │   ├── FileList
│   │   │   └── EmptyState
│   │   ├── OutlineTab
│   │   │   ├── OutlineTree
│   │   │   └── EmptyState
│   │   └── TemplatesTab
│   │       ├── TemplateList
│   │       └── EmptyState
│   ├── EditorWindow
│   │   ├── ModeSelector
│   │   ├── WYSIWYGEditor (Milkdown)
│   │   ├── SplitEditor
│   │   │   ├── PlainTextEditor (CodeMirror)
│   │   │   └── PreviewPane (react-md-editor)
│   │   ├── PreviewEditor (react-md-editor)
│   │   └── EmptyState
│   └── StatusBar
│       ├── DocumentStats (words, characters)
│       └── SaveStatus (last saved time)
└── Dialogs
    ├── SettingsDialog
    │   ├── TabNavigation
    │   ├── GeneralSettings
    │   ├── ThemeSettings
    │   ├── FilesSettings
    │   ├── EditorSettings
    │   └── AboutTab
    └── ConfirmationDialog (template save warning)
```

### 2.3 State Management Architecture

#### Global State (Zustand Store)

```typescript
// Document Store
interface DocumentStore {
  documents: Map<string, Document>;
  activeDocumentId: string | null;
  addDocument: (doc: Document) => void;
  removeDocument: (id: string) => void;
  updateDocument: (id: string, content: string) => void;
  setActiveDocument: (id: string) => void;
}

// Document Interface
interface Document {
  id: string;
  filename: string;
  filepath: string | null;
  content: string;
  isModified: boolean;
  lastSaved: Date | null;
  isTemplate: boolean;
}

// Settings Store
interface SettingsStore {
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
  resetSettings: () => void;
}

// Settings Interface
interface Settings {
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

// UI Store
interface UIStore {
  sidebarTab: 'files' | 'outline' | 'templates';
  editorMode: 'wysiwyg' | 'split' | 'preview';
  settingsDialogOpen: boolean;
  setSidebarTab: (tab: string) => void;
  setEditorMode: (mode: string) => void;
  toggleSettingsDialog: () => void;
}

// Templates Store
interface TemplatesStore {
  templates: Template[];
  loadTemplates: () => Promise<void>;
  refreshTemplates: () => Promise<void>;
}

interface Template {
  id: string;
  filename: string;
  filepath: string;
  content: string;
}
```

### 2.4 IPC Communication Architecture

#### Main Process Handlers

```typescript
// File Operations
ipcMain.handle('file:new', async () => Document);
ipcMain.handle('file:open', async () => { filepath: string, content: string });
ipcMain.handle('file:save', async (filepath, content) => boolean);
ipcMain.handle('file:saveAs', async (content) => string);
ipcMain.handle('file:read', async (filepath) => string);

// Directory Operations
ipcMain.handle('dir:selectFolder', async () => string);
ipcMain.handle('dir:readTemplates', async (dirPath) => Template[]);

// Print Operations
ipcMain.handle('print:document', async (htmlContent) => void);

// Settings Operations
ipcMain.handle('settings:load', async () => Settings);
ipcMain.handle('settings:save', async (settings) => void);

// System Operations
ipcMain.handle('system:getUserDocumentsPath', async () => string);
```

#### Renderer Process Invocations

```typescript
// Services in Renderer
class FileService {
  async createNewFile(): Promise<Document>
  async openFile(): Promise<{ filepath: string, content: string }>
  async saveFile(filepath: string, content: string): Promise<boolean>
  async saveFileAs(content: string): Promise<string>
  async readFile(filepath: string): Promise<string>
}

class SettingsService {
  async loadSettings(): Promise<Settings>
  async saveSettings(settings: Settings): Promise<void>
}

class TemplateService {
  async loadTemplates(dirPath: string): Promise<Template[]>
}
```

### 2.5 Data Flow Architecture

```
User Action
    ↓
UI Component
    ↓
Event Handler
    ↓
Service Layer
    ↓
IPC Communication (if file/system operation)
    ↓
Main Process Handler
    ↓
File System / OS API
    ↓
Response back through IPC
    ↓
State Update (Zustand)
    ↓
UI Re-render (React)
```

### 2.6 Module Structure

```
src/
├── main/
│   ├── index.ts                 # Main process entry
│   ├── window.ts                # Window management
│   ├── menu.ts                  # Application menu
│   ├── handlers/
│   │   ├── fileHandlers.ts      # File operation handlers
│   │   ├── settingsHandlers.ts  # Settings handlers
│   │   └── templateHandlers.ts  # Template handlers
│   └── utils/
│       └── paths.ts             # Path utilities
│
├── renderer/
│   ├── index.tsx                # Renderer entry
│   ├── App.tsx                  # Root component
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx
│   │   │   ├── Toolbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── EditorWindow.tsx
│   │   │   └── StatusBar.tsx
│   │   │
│   │   ├── sidebar/
│   │   │   ├── FilesTab.tsx
│   │   │   ├── OutlineTab.tsx
│   │   │   ├── TemplatesTab.tsx
│   │   │   └── EmptyState.tsx
│   │   │
│   │   ├── editor/
│   │   │   ├── WYSIWYGEditor.tsx
│   │   │   ├── SplitEditor.tsx
│   │   │   ├── PreviewEditor.tsx
│   │   │   └── ModeSelector.tsx
│   │   │
│   │   ├── dialogs/
│   │   │   ├── SettingsDialog.tsx
│   │   │   ├── ConfirmationDialog.tsx
│   │   │   └── settings/
│   │   │       ├── GeneralSettings.tsx
│   │   │       ├── ThemeSettings.tsx
│   │   │       ├── FilesSettings.tsx
│   │   │       ├── EditorSettings.tsx
│   │   │       └── AboutTab.tsx
│   │   │
│   │   └── ui/                  # ShadCN components
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       ├── tabs.tsx
│   │       ├── select.tsx
│   │       ├── checkbox.tsx
│   │       └── ...
│   │
│   ├── stores/
│   │   ├── documentStore.ts
│   │   ├── settingsStore.ts
│   │   ├── uiStore.ts
│   │   └── templatesStore.ts
│   │
│   ├── services/
│   │   ├── fileService.ts
│   │   ├── settingsService.ts
│   │   ├── templateService.ts
│   │   └── markdownService.ts
│   │
│   ├── hooks/
│   │   ├── useDocuments.ts
│   │   ├── useSettings.ts
│   │   ├── useTemplates.ts
│   │   ├── useAutosave.ts
│   │   └── useTheme.ts
│   │
│   ├── utils/
│   │   ├── markdown.ts
│   │   ├── outline.ts
│   │   ├── wordCount.ts
│   │   └── dateFormat.ts
│   │
│   ├── types/
│   │   ├── document.ts
│   │   ├── settings.ts
│   │   └── template.ts
│   │
│   └── styles/
│       ├── globals.css
│       └── themes.css
│
├── shared/
│   ├── constants.ts
│   └── types.ts
│
└── preload/
    └── index.ts                 # Preload script
```

## 3. Technical Design Decisions

### 3.1 Editor Selection Rationale

#### Milkdown Crepe for WYSIWYG
- **Pros**:
  - Built specifically for markdown
  - Excellent TypeScript support
  - Built-in extensible toolbar with formatting buttons
  - Active development and community
  - Good performance
  - Built-in CommonMark support (Phase 1)

- **Implementation Notes**:
  - Use @milkdown/crepe for complete editor solution
  - Built-in toolbar eliminates custom development
  - Extensible for future GFM and LaTeX features
  - Integrate with React via @milkdown/react

#### CodeMirror 6 for Plain Text
- **Pros**:
  - Industry-standard code editor
  - Excellent performance
  - Extensive language support
  - Highly customizable
  - Active development

- **Implementation Notes**:
  - Use markdown language mode
  - Configure line numbers display
  - Implement custom key bindings
  - Synchronize scroll with preview

#### react-markdown for Preview
- **Pros**:
  - React-friendly
  - Good rendering performance
  - Supports CommonMark (Phase 1)
  - Easy integration with remark/rehype
  - Extensible for GFM and LaTeX (future phases)

- **Implementation Notes**:
  - Use in preview-only mode
  - Share rendering pipeline with split view
  - Configure for LaTeX support (Phase 3)

### 3.2 State Management: Zustand

- **Rationale**:
  - Lightweight (minimal bundle size)
  - No boilerplate (unlike Redux)
  - TypeScript-first
  - Excellent React integration
  - Built-in persistence support

- **Alternative Considered**: Redux Toolkit
  - Rejected: Too much boilerplate for app complexity level

### 3.3 IPC Architecture Pattern

- **Pattern**: Request-Response via ipcMain.handle/ipcRenderer.invoke
- **Rationale**:
  - Promise-based (async/await support)
  - Type-safe with TypeScript
  - Clear separation of concerns
  - Easy error handling

- **Security**: Preload script with contextBridge
  - Expose only necessary APIs
  - No direct Node.js access in renderer

### 3.4 File System Strategy

- **Native Dialogs**: Use Electron dialog API
  - Familiar UX for users
  - OS-integrated appearance
  - Security (sandboxed file access)

- **File Watching**: Not implemented initially
  - Consider chokidar for future external file changes
  - Risk of conflict with autosave

### 3.5 Theme Implementation

```typescript
// CSS Variables approach
:root[data-theme="light"] {
  --background: #ffffff;
  --foreground: #000000;
  --primary: #0066cc;
  // ... more variables
}

:root[data-theme="dark"] {
  --background: #1a1a1a;
  --foreground: #ffffff;
  --primary: #4d94ff;
  // ... more variables
}

// System theme detection
const useSystemTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mediaQuery.matches ? 'dark' : 'light');
    
    const handler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return theme;
};
```

### 3.6 Autosave Implementation

```typescript
// Custom hook for autosave
const useAutosave = () => {
  const { settings } = useSettingsStore();
  const { documents, activeDocumentId, updateDocument } = useDocumentStore();
  
  useEffect(() => {
    if (!settings.general.autosave) return;
    
    const interval = settings.general.autosaveInterval * 60 * 1000;
    const timer = setInterval(async () => {
      const doc = documents.get(activeDocumentId);
      if (doc?.isModified && doc?.filepath) {
        await fileService.saveFile(doc.filepath, doc.content);
        // Update last saved time
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [settings, documents, activeDocumentId]);
};
```

### 3.7 Outline Generation

```typescript
// Parse headings from markdown
const generateOutline = (markdown: string): OutlineNode[] => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm);
    
  const tree = processor.parse(markdown);
  const outline: OutlineNode[] = [];
  
  visit(tree, 'heading', (node: Heading) => {
    outline.push({
      depth: node.depth,
      text: toString(node),
      position: node.position
    });
  });
  
  return outline;
};

// Create hierarchical structure
const buildOutlineTree = (nodes: OutlineNode[]): OutlineTree => {
  // Implementation for nested structure
};
```

### 3.8 Scroll Synchronization (Split View)

```typescript
const useSyncScroll = (
  editorRef: RefObject<HTMLElement>,
  previewRef: RefObject<HTMLElement>
) => {
  const [scrolling, setScrolling] = useState<'editor' | 'preview' | null>(null);
  
  const syncScroll = (source: 'editor' | 'preview') => {
    if (scrolling && scrolling !== source) return;
    
    setScrolling(source);
    const sourceEl = source === 'editor' ? editorRef.current : previewRef.current;
    const targetEl = source === 'editor' ? previewRef.current : editorRef.current;
    
    if (!sourceEl || !targetEl) return;
    
    const percentage = sourceEl.scrollTop / 
      (sourceEl.scrollHeight - sourceEl.clientHeight);
    targetEl.scrollTop = percentage * 
      (targetEl.scrollHeight - targetEl.clientHeight);
    
    setTimeout(() => setScrolling(null), 100);
  };
  
  return { syncScroll };
};
```

## 4. Security Considerations

### 4.1 Content Security Policy

```typescript
// In main process
webPreferences: {
  contextIsolation: true,
  nodeIntegration: false,
  sandbox: true
}

// CSP headers
const csp = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'", // Required for dynamic theming
  "img-src 'self' data: https:",
  "font-src 'self' data:"
].join('; ');
```

### 4.2 Input Sanitization

```typescript
// Sanitize HTML output
import rehypeSanitize from 'rehype-sanitize';

const processMarkdown = async (markdown: string) => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(markdown);
    
  return result.toString();
};
```

### 4.3 Path Validation

```typescript
// Prevent directory traversal
const validatePath = (filepath: string): boolean => {
  const normalized = path.normalize(filepath);
  const resolved = path.resolve(filepath);
  
  // Check for directory traversal attempts
  if (normalized.includes('..')) return false;
  
  // Ensure within allowed directories
  const documentsDir = app.getPath('documents');
  if (!resolved.startsWith(documentsDir)) return false;
  
  return true;
};
```

## 5. Performance Optimization

### 5.1 Lazy Loading

```typescript
// Lazy load heavy editor components
const WYSIWYGEditor = lazy(() => import('./components/editor/WYSIWYGEditor'));
const SplitEditor = lazy(() => import('./components/editor/SplitEditor'));
const PreviewEditor = lazy(() => import('./components/editor/PreviewEditor'));

// Use with Suspense
<Suspense fallback={<EditorSkeleton />}>
  {mode === 'wysiwyg' && <WYSIWYGEditor />}
  {mode === 'split' && <SplitEditor />}
  {mode === 'preview' && <PreviewEditor />}
</Suspense>
```

### 5.2 Debouncing

```typescript
// Debounce outline updates
import { debounce } from 'lodash-es';

const debouncedUpdateOutline = useMemo(
  () => debounce((content: string) => {
    const outline = generateOutline(content);
    setOutline(outline);
  }, 300),
  []
);

// Debounce word count updates
const debouncedUpdateStats = useMemo(
  () => debounce((content: string) => {
    const words = countWords(content);
    const chars = content.length;
    setStats({ words, chars });
  }, 100),
  []
);
```

### 5.3 Virtual Scrolling

```typescript
// For large file lists (future optimization)
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={documents.size}
  itemSize={50}
  width="100%"
>
  {({ index, style }) => (
    <FileListItem
      style={style}
      document={documents[index]}
    />
  )}
</FixedSizeList>
```

## 6. Testing Strategy

### 6.1 Unit Testing
- **Framework**: Vitest
- **Coverage**: Services, utilities, store logic
- **Example**:
  ```typescript
  describe('wordCount utility', () => {
    it('counts words correctly', () => {
      expect(countWords('Hello world')).toBe(2);
    });
  });
  ```

### 6.2 Component Testing
- **Framework**: React Testing Library
- **Coverage**: Individual components
- **Example**:
  ```typescript
  describe('Toolbar', () => {
    it('renders all buttons', () => {
      render(<Toolbar />);
      expect(screen.getByRole('button', { name: /new/i })).toBeInTheDocument();
    });
  });
  ```

### 6.3 Integration Testing
- **Framework**: Playwright
- **Coverage**: Main process + renderer interactions
- **Example**:
  ```typescript
  test('create and save document', async ({ page }) => {
    await page.click('button:has-text("New")');
    await page.fill('[data-testid="editor"]', '# Hello');
    await page.click('button:has-text("Save")');
    // Assert file saved
  });
  ```

### 6.4 E2E Testing
- **Framework**: Spectron (Electron-specific)
- **Coverage**: Full application workflows
- **Focus**: File operations, settings persistence

## 7. Build and Distribution

### 7.1 Build Configuration

```javascript
// forge.config.js
module.exports = {
  packagerConfig: {
    name: 'VibeMD',
    icon: './assets/icon',
    asar: true,
    extraResource: ['./assets']
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'VibeMD',
        setupIcon: './assets/icon.ico'
      }
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: './assets/icon.icns',
        format: 'ULFO'
      }
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: './assets/icon.png'
        }
      }
    }
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
            name: 'main_window'
          }]
        }
      }
    }
  ]
};
```

### 7.2 Distribution Targets
- **Windows**: Squirrel installer (.exe)
- **macOS**: DMG package (.dmg)
- **Linux**: Debian package (.deb), AppImage

### 7.3 Auto-Update Configuration
```typescript
// Using electron-updater
import { autoUpdater } from 'electron-updater';

autoUpdater.checkForUpdatesAndNotify();
```

## 8. Development Environment

### 8.1 Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- Git

### 8.2 Environment Setup
```bash
# Install dependencies
npm install

# Development mode
npm run start

# Build for production
npm run make

# Run tests
npm run test
```

### 8.3 IDE Configuration
- **Recommended**: VS Code
- **Extensions**:
  - ESLint
  - Prettier
  - TypeScript
  - Tailwind CSS IntelliSense

## 9. Deployment Considerations

### 9.1 Code Signing
- **Windows**: Sign with Authenticode certificate
- **macOS**: Sign with Apple Developer certificate
- **Notarization**: Required for macOS 10.15+

### 9.2 Release Channels
- **Stable**: Production releases
- **Beta**: Pre-release testing
- **Development**: Internal testing

### 9.3 Update Strategy
- Check for updates on startup
- Notify user of available updates
- Download and install in background
- Restart to apply updates

## 10. Monitoring and Analytics

### 10.1 Error Tracking
- Implement error boundary in React
- Log errors to file system
- Optional: Send crash reports (with user consent)

### 10.2 Performance Monitoring
- Track application startup time
- Monitor memory usage
- Log file operation durations

### 10.3 User Analytics (Optional)
- Document creation/open frequency
- Feature usage statistics
- Editor mode preferences
- Requires explicit user consent
