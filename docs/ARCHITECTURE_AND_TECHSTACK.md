# VibeMD - Architecture and Tech Stack

## 1. Technology Stack Overview

### 1.1 Core Framework
- **Electron Forge**: Desktop application framework
  - Version: Latest stable (22.x+)
  - Rationale: Cross-platform desktop support, native OS integration
  - Build system: Webpack-based
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
- **TipTap**: Headless rich-text editor framework
  - Version: 3.7.1 (@tiptap/react, @tiptap/starter-kit)
  - Extensible architecture with custom extensions
  - Professional toolbar with icon-based buttons
  - Responsive toolbar with overflow dropdown
  - Components:
    - @tiptap/react (React integration)
    - @tiptap/starter-kit (core functionality)
    - Custom extensions for tables, tasks, super/subscript
    - Professional dialog components for user input

#### Markdown Processing
- **marked**: Markdown to HTML conversion
  - Version: 16.4.0
  - GFM (GitHub Flavored Markdown) support
  - Used for markdown file loading and preview

- **turndown**: HTML to Markdown conversion
  - Version: 7.2.1
  - Used for saving WYSIWYG content as markdown
  - Maintains formatting consistency

### 1.5 Phased Markdown Support

#### Phase 1: CommonMark + GFM (Current Implementation)
- **Core Features**: Headings (H1-H6), emphasis, lists, links, images, code blocks, blockquotes
- **GFM Features**: Tables, task lists, strikethrough, super/subscript
- **WYSIWYG**: TipTap with custom toolbar and extensions
- **Status**: ✅ Implemented and Working

#### Phase 2: Enhanced GFM (Planned)
- **Features**: Enhanced table management, advanced task list features
- **Implementation**: Additional TipTap extensions
- **Status**: Planned enhancement

#### Phase 3: LaTeX Support (Future)
- **Features**: Math expressions via KaTeX
- **Implementation**: @tiptap/extension-mathematics + KaTeX
- **Status**: Planned enhancement

### 1.6 Styling
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
│  - TipTap editor components                  │
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
│   │   │   ├── OutlineTree (collapsible/expandable)
│   │   │   └── EmptyState
│   │   └── TemplatesTab
│   │       ├── TemplateList
│   │       └── EmptyState
│   ├── EditorWindow
│   │   ├── TipTapEditor (WYSIWYG only)
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
    ├── LinkDialog (URL and text input)
    └── ImageDialog (URL and alt text input)
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
  settingsDialogOpen: boolean;
  setSidebarTab: (tab: string) => void;
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

// Navigation Store (for outline navigation)
interface NavigationStore {
  scrollToHeadingHandler: ((headingId: string) => void) | null;
  setScrollToHeadingHandler: (handler: (headingId: string) => void) => void;
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

// Dialog Operations
ipcMain.handle('dialog:prompt', async (title, message, defaultValue) => string);
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

class MarkdownService {
  generateOutline(markdown: string): OutlineNode[]
  markdownToHtml(markdown: string): string
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
│   ├── handlers/
│   │   ├── fileHandlers.ts      # File operation handlers
│   │   ├── settingsHandlers.ts  # Settings handlers
│   │   ├── systemHandlers.ts    # System operation handlers
│   │   └── dialogHandlers.ts    # Dialog handlers
│   └── utils/
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
│   │   │   └── TemplatesTab.tsx
│   │   │
│   │   ├── editor/
│   │   │   └── TipTapEditor.tsx # Main WYSIWYG editor
│   │   │
│   │   ├── dialogs/
│   │   │   ├── SettingsDialog.tsx
│   │   │   ├── LinkDialog.tsx
│   │   │   ├── ImageDialog.tsx
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
│   │       ├── tooltip.tsx
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
│   │   ├── markdownService.ts
│   │   └── navigationService.ts
│   │
│   ├── hooks/
│   │   ├── useKeyboardShortcuts.ts
│   │   └── useTheme.ts
│   │
│   ├── lib/
│   │   └── utils.ts
│   │
│   └── styles/
│       └── globals.css
│
├── shared/
│   └── types.ts
│
└── preload/
    └── index.ts                 # Preload script
```

## 3. Technical Design Decisions

### 3.1 Editor Selection Rationale

#### TipTap for WYSIWYG
- **Pros**:
  - Headless, framework-agnostic architecture
  - Excellent TypeScript support
  - Extensible with custom extensions
  - Professional toolbar implementation
  - Active development and community
  - Good performance
  - Built-in CommonMark support
  - Custom extension support for GFM features

- **Implementation Notes**:
  - Use @tiptap/react for React integration
  - Custom toolbar with icon-based buttons
  - Responsive toolbar with overflow dropdown
  - Professional dialog components for user input
  - Custom extensions for tables, tasks, super/subscript
  - Enhanced markdown-to-HTML conversion with heading IDs

#### marked for Markdown Processing
- **Pros**:
  - Fast, reliable markdown parser
  - GFM support out of the box
  - Good performance
  - Active maintenance

- **Implementation Notes**:
  - Configure with GFM support
  - Add heading ID generation for navigation
  - Handle markdown file loading and preview

#### turndown for HTML-to-Markdown
- **Pros**:
  - Reliable HTML-to-markdown conversion
  - Maintains formatting consistency
  - Good performance

- **Implementation Notes**:
  - Configure for consistent output
  - Handle WYSIWYG content saving

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
// Parse headings from markdown using unified
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
      line: node.position?.start.line || 0,
      id: generateHeadingId(toString(node))
    });
  });
  
  return outline;
};

// Create hierarchical structure
const buildOutlineTree = (nodes: OutlineNode[]): OutlineTree => {
  // Implementation for nested structure with collapsible/expandable nodes
};
```

### 3.8 Navigation Service

```typescript
// Navigation service for outline-to-editor navigation
interface NavigationStore {
  scrollToHeadingHandler: ((headingId: string) => void) | null;
  setScrollToHeadingHandler: (handler: (headingId: string) => void) => void;
}

// Custom TipTap extension to preserve heading IDs
const HeadingIdExtension = Extension.create({
  name: 'headingId',
  addGlobalAttributes() {
    return [
      {
        types: ['heading'],
        attributes: {
          id: {
            default: null,
            parseHTML: element => element.getAttribute('id'),
            renderHTML: attributes => {
              if (!attributes.id) return {};
              return { id: attributes.id };
            },
          },
        },
      },
    ];
  },
});
```

## 4. Security Considerations

### 4.1 Content Security Policy

```typescript
// In main process
webPreferences: {
  contextIsolation: true,
  nodeIntegration: false,
  sandbox: false // Required for preload script with webpack
}

// CSP configuration for external images
mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      'Content-Security-Policy': ["default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https:; img-src 'self' data: https:;"]
    }
  });
});
```

### 4.2 Input Sanitization

```typescript
// Sanitize HTML output from TipTap
const sanitizeHtml = (html: string): string => {
  // TipTap handles sanitization internally
  // Additional sanitization can be added if needed
  return html;
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
// Lazy load heavy components
const TipTapEditor = lazy(() => import('./components/editor/TipTapEditor'));

// Use with Suspense
<Suspense fallback={<EditorSkeleton />}>
  <TipTapEditor />
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

### 5.3 Responsive Toolbar

```typescript
// Responsive toolbar with overflow dropdown
const useResponsiveToolbar = () => {
  const [visibleButtons, setVisibleButtons] = useState<string[]>([]);
  const [hiddenButtons, setHiddenButtons] = useState<string[]>([]);
  
  useLayoutEffect(() => {
    const updateToolbar = () => {
      // Calculate which buttons fit in available space
      // Move overflow buttons to dropdown
    };
    
    updateToolbar();
    window.addEventListener('resize', updateToolbar);
    return () => window.removeEventListener('resize', updateToolbar);
  }, []);
  
  return { visibleButtons, hiddenButtons };
};
```

## 6. Testing Strategy

### 6.1 Unit Testing
- **Framework**: Vitest
- **Coverage**: Services, utilities, store logic
- **Example**:
  ```typescript
  describe('markdownService', () => {
    it('generates outline correctly', () => {
      const markdown = '# Heading\n## Subheading';
      const outline = generateOutline(markdown);
      expect(outline).toHaveLength(2);
    });
  });
  ```

### 6.2 Component Testing
- **Framework**: React Testing Library
- **Coverage**: Individual components
- **Example**:
  ```typescript
  describe('TipTapEditor', () => {
    it('renders toolbar buttons', () => {
      render(<TipTapEditor />);
      expect(screen.getByRole('button', { name: /bold/i })).toBeInTheDocument();
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

## 11. Current Implementation Status

### 11.1 Completed Features
- ✅ **TipTap WYSIWYG Editor**: Fully functional with professional toolbar
- ✅ **All Heading Levels**: H1-H6 with proper focus management
- ✅ **Link Insertion**: Professional dialog with URL and text input
- ✅ **Image Insertion**: Robust implementation with URL validation
- ✅ **Tables**: Insert/delete rows and columns functionality
- ✅ **Task Lists**: Configured with proper styling
- ✅ **Super/Subscript**: Mutual exclusion configuration
- ✅ **Responsive Toolbar**: Overflow dropdown for narrow windows
- ✅ **Outline Navigation**: Collapsible/expandable with click-to-navigate
- ✅ **File Management**: Open, save, new document functionality
- ✅ **Template System**: Load and use markdown templates
- ✅ **Settings Management**: Comprehensive settings with persistence
- ✅ **Theme Support**: Light/dark/system theme switching
- ✅ **Keyboard Shortcuts**: Standard editor shortcuts
- ✅ **Status Bar**: Document statistics and save status

### 11.2 Working Features
- ✅ **CommonMark Support**: All core markdown elements
- ✅ **GFM Support**: Tables, task lists, strikethrough, super/subscript
- ✅ **Markdown Processing**: Robust markdown-to-HTML and HTML-to-markdown conversion
- ✅ **Navigation**: Outline sidebar with heading navigation
- ✅ **Dialog System**: Professional user input dialogs
- ✅ **Error Handling**: Comprehensive validation and fallbacks

### 11.3 Planned Enhancements
- 🔄 **Enhanced Task Lists**: Advanced task list features
- 🔄 **LaTeX Support**: Math expressions via KaTeX
- 🔄 **Advanced Table Management**: More table operations
- 🔄 **Split View**: CodeMirror + preview pane
- 🔄 **Preview Mode**: Standalone preview mode
- 🔄 **Enhanced Templates**: Template management UI

### 11.4 Technical Achievements
- **Professional UI**: ShadCN/ui components with Tailwind CSS
- **Robust Architecture**: Clean separation of concerns with Zustand state management
- **Type Safety**: Comprehensive TypeScript implementation
- **Performance**: Optimized with debouncing and lazy loading
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Security**: Content Security Policy and input validation
- **Cross-Platform**: Windows, macOS, and Linux support