# VibeMD - Detailed Requirements Specification

## 1. Product Overview

### 1.1 Product Description
VibeMD is a cross-platform desktop markdown editor designed for Windows, macOS, and Linux. It provides a WYSIWYG editing environment with a template system for rapid document creation.

### 1.2 Core Value Proposition
- Professional WYSIWYG editing with TipTap-powered rich text editor
- Template-based document scaffolding for increased productivity
- Native OS integration for familiar file management
- Phased markdown support (CommonMark + GFM implemented, LaTeX planned)

### 1.3 Target Platforms
- Windows 10/11
- macOS 11.0+
- Linux (Ubuntu 20.04+, Fedora 35+, and equivalent distributions)

## 2. Functional Requirements

### 2.1 Editor Implementation

#### 2.1.1 WYSIWYG Mode (Current Implementation)
- **FR-101**: ✅ Provide inline editing with visual formatting via TipTap
- **FR-102**: ✅ Display professional toolbar with icon-based buttons
- **FR-103**: ✅ Support CommonMark + GFM syntax elements
- **FR-104**: ✅ Allow direct manipulation of formatted content
- **FR-105**: ✅ Support real-time formatting preview
- **FR-106**: ✅ Enable keyboard shortcuts for common formatting operations
- **FR-107**: ✅ Responsive toolbar with overflow dropdown for narrow windows
- **FR-108**: ✅ Professional dialog components for user input (links, images)

#### 2.1.2 Split Mode (Planned - Phase 2)
- **FR-201**: Display markdown source editor on left side
- **FR-202**: Display synchronized HTML preview on right side
- **FR-203**: Implement bidirectional scroll synchronization
- **FR-204**: Show integrated formatting toolbar
- **FR-205**: Maintain cursor position mapping between views
- **FR-206**: Support live preview updates as user types
- **FR-207**: Display line numbers when enabled in settings

### 2.2 File Management

#### 2.2.1 New Document Creation
- **FR-401**: ✅ Create blank markdown document via toolbar button
- **FR-402**: ✅ Create document from template via sidebar
- **FR-403**: ✅ Add new document to Files tab automatically
- **FR-404**: ✅ Set focus to new document in editor
- **FR-405**: ✅ Mark document as unsaved with indicator
- **FR-406**: ✅ Display "New document not yet saved" in status bar

#### 2.2.2 Opening Documents
- **FR-501**: ✅ Open markdown files via toolbar button
- **FR-502**: ✅ Use native OS file dialog for file selection
- **FR-503**: ✅ Support .md, .markdown, .txt file extensions
- **FR-504**: ✅ Add opened document to Files tab
- **FR-505**: ✅ Set focus to opened document in editor
- **FR-506**: ✅ Display filename in status bar
- **FR-507**: ✅ Handle file encoding (UTF-8)

#### 2.2.3 Saving Documents
- **FR-601**: ✅ Save document via toolbar button
- **FR-602**: ✅ Use native OS file dialog for new files
- **FR-603**: ✅ Save to existing file path automatically
- **FR-604**: ✅ Update status bar with save confirmation
- **FR-605**: ✅ Handle save errors gracefully
- **FR-606**: ✅ Support "Save As" functionality

### 2.3 Template System

#### 2.3.1 Template Management
- **FR-701**: ✅ Load templates from designated directory
- **FR-702**: ✅ Display templates in sidebar Templates tab
- **FR-703**: ✅ Create new document from template
- **FR-704**: ✅ Support .vibe file extension for templates
- **FR-705**: ✅ Refresh template list on demand
- **FR-706**: ✅ Handle template loading errors gracefully

### 2.4 User Interface

#### 2.4.1 Layout Components
- **FR-801**: ✅ Display toolbar with file actions and settings
- **FR-802**: ✅ Show collapsible sidebar with tabs (Files, Outline, Templates)
- **FR-803**: ✅ Display main editor area with TipTap editor
- **FR-804**: ✅ Show status bar with document statistics
- **FR-805**: ✅ Support window resizing and panel adjustment

#### 2.4.2 Sidebar Tabs
- **FR-901**: ✅ Files tab with document list and actions
- **FR-902**: ✅ Outline tab with collapsible heading navigation
- **FR-903**: ✅ Templates tab with template list
- **FR-904**: ✅ Click-to-navigate functionality in outline
- **FR-905**: ✅ Empty state messages for each tab

### 2.5 Settings Management

#### 2.5.1 Settings Dialog
- **FR-1001**: ✅ Display settings dialog via toolbar button
- **FR-1002**: ✅ Organize settings in tabs (General, Theme, Files, Editor, About)
- **FR-1003**: ✅ Save settings to persistent storage
- **FR-1004**: ✅ Apply settings changes immediately
- **FR-1005**: ✅ Reset settings to defaults option

#### 2.5.2 General Settings
- **FR-1101**: ✅ Language selection (English)
- **FR-1102**: ✅ Autosave toggle and interval setting
- **FR-1103**: ✅ Window size and position preferences

#### 2.5.3 Theme Settings
- **FR-1201**: ✅ Light/Dark/System theme selection
- **FR-1202**: ✅ Apply theme changes immediately
- **FR-1203**: ✅ Persist theme preference

#### 2.5.4 Files Settings
- **FR-1301**: ✅ Default file extension setting
- **FR-1302**: ✅ Documents directory setting
- **FR-1303**: ✅ Templates directory setting

#### 2.5.5 Editor Settings
- **FR-1401**: ✅ Font size setting
- **FR-1402**: ✅ Word wrap toggle
- **FR-1403**: ✅ Line numbers toggle
- **FR-1404**: ✅ LaTeX support toggle (for future implementation)

### 2.6 Markdown Support

#### 2.6.1 CommonMark Support (Phase 1 - Implemented)
- **FR-1501**: ✅ Headings (H1-H6) with proper styling
- **FR-1502**: ✅ Emphasis (bold, italic)
- **FR-1503**: ✅ Lists (bulleted, numbered)
- **FR-1504**: ✅ Links with professional dialog input
- **FR-1505**: ✅ Images with URL validation and alt text
- **FR-1506**: ✅ Code blocks and inline code
- **FR-1507**: ✅ Blockquotes
- **FR-1508**: ✅ Horizontal rules

#### 2.6.2 GFM Support (Phase 1 - Implemented)
- **FR-1601**: ✅ Tables with insert/delete row/column functionality
- **FR-1602**: ✅ Task lists with checkboxes
- **FR-1603**: ✅ Strikethrough text
- **FR-1604**: ✅ Super/subscript with mutual exclusion

#### 2.6.3 LaTeX Support (Phase 3 - Planned)
- **FR-1701**: Inline math expressions
- **FR-1702**: Block math expressions
- **FR-1703**: Math rendering via KaTeX
- **FR-1704**: Math toolbar integration
- **FR-1705**: Math syntax highlighting

### 2.7 Editor Features

#### 2.7.1 Toolbar Functionality
- **FR-1801**: ✅ Bold, italic, strikethrough formatting
- **FR-1802**: ✅ Heading dropdown (H1-H6, Normal text)
- **FR-1803**: ✅ Bullet and numbered lists
- **FR-1804**: ✅ Code block and blockquote
- **FR-1805**: ✅ Link and image insertion with dialogs
- **FR-1806**: ✅ Table insertion and management
- **FR-1807**: ✅ Task list creation
- **FR-1808**: ✅ Super/subscript formatting
- **FR-1809**: ✅ Responsive toolbar with overflow dropdown

#### 2.7.2 Navigation Features
- **FR-1901**: ✅ Outline generation from document headings
- **FR-1902**: ✅ Collapsible/expandable outline nodes
- **FR-1903**: ✅ Click-to-navigate to headings in editor
- **FR-1904**: ✅ Proper heading ID generation and preservation

### 2.8 Keyboard Shortcuts

#### 2.8.1 File Operations
- **FR-2001**: ✅ Ctrl+N for new document
- **FR-2002**: ✅ Ctrl+O for open document
- **FR-2003**: ✅ Ctrl+S for save document
- **FR-2004**: ✅ Ctrl+Shift+S for save as

#### 2.8.2 Editor Operations
- **FR-2101**: ✅ Ctrl+B for bold
- **FR-2102**: ✅ Ctrl+I for italic
- **FR-2103**: ✅ Ctrl+K for link insertion
- **FR-2104**: ✅ Ctrl+Shift+P for settings dialog

### 2.9 Status Bar

#### 2.9.1 Document Statistics
- **FR-2201**: ✅ Word count display
- **FR-2202**: ✅ Character count display
- **FR-2203**: ✅ Last saved time display
- **FR-2204**: ✅ Modified indicator

## 3. Non-Functional Requirements

### 3.1 Performance
- **NFR-301**: Application startup time < 3 seconds
- **NFR-302**: File open/save operations < 1 second
- **NFR-303**: Smooth scrolling and editing experience
- **NFR-304**: Memory usage < 200MB for typical documents

### 3.2 Usability
- **NFR-401**: Intuitive user interface following OS conventions
- **NFR-402**: Responsive design for different window sizes
- **NFR-403**: Accessible keyboard navigation
- **NFR-404**: Clear visual feedback for user actions

### 3.3 Reliability
- **NFR-501**: Graceful handling of file system errors
- **NFR-502**: Auto-recovery from application crashes
- **NFR-503**: Data integrity protection during saves
- **NFR-504**: Error logging and reporting

### 3.4 Security
- **NFR-601**: Sandboxed renderer process
- **NFR-602**: Content Security Policy implementation
- **NFR-603**: Input validation and sanitization
- **NFR-604**: Secure file path handling

### 3.5 Compatibility
- **NFR-701**: Windows 10/11 compatibility
- **NFR-702**: macOS 11.0+ compatibility
- **NFR-703**: Linux compatibility (Ubuntu 20.04+, Fedora 35+)
- **NFR-704**: Cross-platform file format support

## 4. Implementation Phases

### Phase 1: Core WYSIWYG Editor (Current - Implemented)
- ✅ TipTap WYSIWYG editor with professional toolbar
- ✅ CommonMark + GFM support
- ✅ File management (new, open, save)
- ✅ Template system
- ✅ Settings management
- ✅ Outline navigation
- ✅ Responsive design

### Phase 2: Enhanced Features (Planned)
- 🔄 Split view editor (CodeMirror + preview)
- 🔄 Preview mode
- 🔄 Enhanced table management
- 🔄 Advanced task list features
- 🔄 Template management UI

### Phase 3: LaTeX Support (Future)
- 🔄 Math expressions via KaTeX
- 🔄 Math toolbar integration
- 🔄 Math syntax highlighting
- 🔄 Math rendering optimization

## 5. Current Status

### ✅ Completed Features
- **TipTap WYSIWYG Editor**: Fully functional with professional toolbar
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

### 🔄 In Progress
- **Task List Functionality**: Final testing and refinement
- **Super/Subscript Functionality**: Final testing and refinement

### 🔄 Planned Enhancements
- **Enhanced Task Lists**: Advanced task list features
- **LaTeX Support**: Math expressions via KaTeX
- **Advanced Table Management**: More table operations
- **Split View**: CodeMirror + preview pane
- **Preview Mode**: Standalone preview mode
- **Enhanced Templates**: Template management UI

## 6. Technical Achievements

- **Professional UI**: ShadCN/ui components with Tailwind CSS
- **Robust Architecture**: Clean separation of concerns with Zustand state management
- **Type Safety**: Comprehensive TypeScript implementation
- **Performance**: Optimized with debouncing and lazy loading
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Security**: Content Security Policy and input validation
- **Cross-Platform**: Windows, macOS, and Linux support