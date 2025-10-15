# VibeMD - Detailed Requirements Specification

## 1. Product Overview

### 1.1 Product Description
VibeMD is a cross-platform desktop markdown editor designed for Windows, macOS, and Linux. It provides a flexible editing environment with multiple viewing modes and a template system for rapid document creation.

### 1.2 Core Value Proposition
- Seamless switching between WYSIWYG and split-view modes
- Template-based document scaffolding for increased productivity
- Native OS integration for familiar file management
- Full markdown standard support (CommonMark + GFM, with LaTeX planned)

### 1.3 Target Platforms
- Windows 10/11
- macOS 11.0+
- Linux (Ubuntu 20.04+, Fedora 35+, and equivalent distributions)

## 2. Functional Requirements

### 2.1 Editor Modes

#### 2.1.1 WYSIWYG Mode
- **FR-101**: Provide inline editing with visual formatting
- **FR-102**: Display full formatting toolbar from Wysimark
- **FR-103**: Support all CommonMark + GFM syntax elements
- **FR-104**: Allow direct manipulation of formatted content
- **FR-105**: Support real-time formatting preview
- **FR-106**: Enable keyboard shortcuts for common formatting operations

#### 2.1.2 Split Mode
- **FR-201**: Display markdown source editor on left side
- **FR-202**: Display synchronized HTML preview on right side
- **FR-203**: Implement bidirectional scroll synchronization
- **FR-204**: Show integrated formatting toolbar
- **FR-205**: Maintain cursor position mapping between views
- **FR-206**: Support live preview updates as user types
- **FR-207**: Display line numbers when enabled in settings

### 2.2 File Management

#### 2.2.1 New Document Creation
- **FR-401**: Create blank markdown document via toolbar button
- **FR-402**: Create document from template via sidebar
- **FR-403**: Add new document to Files tab automatically
- **FR-404**: Set focus to new document in editor
- **FR-405**: Mark document as unsaved with indicator
- **FR-406**: Display "New document not yet saved" in status bar

#### 2.2.2 Opening Documents
- **FR-501**: Open native OS file dialog via toolbar button
- **FR-502**: Support .md, .markdown, .txt, and .vibe file extensions
- **FR-503**: Add opened file to Files tab
- **FR-504**: Set focus to newly opened document
- **FR-505**: Load document content into appropriate editor mode
- **FR-506**: Remember last opened directory per session

#### 2.2.3 Saving Documents
- **FR-601**: Save changes to existing document via toolbar button
- **FR-602**: Invoke OS save dialog for unsaved documents
- **FR-603**: Update last saved timestamp in status bar
- **FR-604**: Remove unsaved indicator after successful save
- **FR-605**: Support default file extension from settings
- **FR-606**: Implement autosave for saved documents when enabled

#### 2.2.4 Save As Functionality
- **FR-701**: Always invoke OS save dialog
- **FR-702**: Allow saving to different location
- **FR-703**: Allow saving with different filename
- **FR-704**: Allow changing file extension
- **FR-705**: Update Files tab with new filename
- **FR-706**: Maintain document content during save as

#### 2.2.5 Multiple Document Management
- **FR-801**: Support opening multiple documents simultaneously
- **FR-802**: Display all open documents in Files tab
- **FR-803**: Highlight currently active document
- **FR-804**: Allow switching between documents via Files tab
- **FR-805**: Maintain separate undo/redo history per document
- **FR-806**: Track unsaved changes per document independently

### 2.3 Template System

#### 2.3.1 Template Storage
- **FR-901**: Store templates with .vibe file extension
- **FR-902**: Load templates from user-specified directory
- **FR-903**: Scan template directory on application startup
- **FR-904**: Refresh template list when directory changes
- **FR-905**: Support subdirectories within template folder

#### 2.3.2 Template Usage
- **FR-1001**: Display all available templates in Templates tab
- **FR-1002**: Provide "Use" button for each template
- **FR-1003**: Create new document with template content when "Use" clicked
- **FR-1004**: Add new document to Files tab
- **FR-1005**: Switch sidebar to Files tab after using template
- **FR-1006**: Highlight new document in Files tab

#### 2.3.3 Template Editing
- **FR-1101**: Allow viewing template content by clicking template name
- **FR-1102**: Display template in editor without adding to Files tab
- **FR-1103**: Show warning dialog when saving changes to .vibe file
- **FR-1104**: Provide "Yes" option to save changes to template
- **FR-1105**: Provide "No" option to create new .md file with changes
- **FR-1106**: Do not modify original template when "No" selected

### 2.4 User Interface Components

#### 2.4.1 Top Toolbar
- **FR-1201**: Display horizontally across top of window
- **FR-1202**: Include New button with document icon
- **FR-1203**: Include Open button with folder icon
- **FR-1204**: Include Save button with save icon
- **FR-1205**: Include Print button with printer icon
- **FR-1206**: Include Settings button with gear icon
- **FR-1207**: Disable Save button when no unsaved changes exist
- **FR-1208**: Group file operations on left side
- **FR-1209**: Group utility buttons on right side

#### 2.4.2 Left Sidebar
- **FR-1301**: Display vertically on left side of window
- **FR-1302**: Implement tab navigation at top (Files, Outline, Templates)
- **FR-1303**: Maintain sidebar width of approximately 250-300px
- **FR-1304**: Allow resizing sidebar width
- **FR-1305**: Persist sidebar width preference

##### 2.4.2.1 Files Tab
- **FR-1401**: Display list of all open documents
- **FR-1402**: Show filename for each document
- **FR-1403**: Indicate unsaved documents with visual marker
- **FR-1404**: Highlight currently active document
- **FR-1405**: Support clicking to switch between documents
- **FR-1406**: Show close button for each document
- **FR-1407**: Show empty state with action buttons when no files open
- **FR-1408**: Include "New Document" button in empty state
- **FR-1409**: Include "Open Document" button in empty state
- **FR-1410**: Include "Use Template" button in empty state

##### 2.4.2.2 Outline Tab
- **FR-1501**: Parse markdown headings (H1-H6) from active document
- **FR-1502**: Display hierarchical outline structure
- **FR-1503**: Support collapsing/expanding outline sections
- **FR-1504**: Navigate to heading location when clicked
- **FR-1505**: Update outline in real-time as document changes
- **FR-1506**: Indicate current scroll position in outline
- **FR-1507**: Show empty state when no headings exist

##### 2.4.2.3 Templates Tab
- **FR-1601**: Display list of all available templates
- **FR-1602**: Show template filename for each entry
- **FR-1603**: Include "Use" button for each template
- **FR-1604**: Support clicking template name to preview
- **FR-1605**: Show empty state when no templates exist
- **FR-1606**: Provide link to template directory in empty state

#### 2.4.3 Editor Window
- **FR-1701**: Occupy main central area of application
- **FR-1702**: Display mode selection controls (WYSIWYG/Split/Preview)
- **FR-1703**: Render active document in selected mode
- **FR-1704**: Support smooth transitions between modes
- **FR-1705**: Preserve scroll position when switching modes
- **FR-1706**: Show empty state when no document open
- **FR-1707**: Display centered message in empty state
- **FR-1708**: Include action buttons in empty state

#### 2.4.4 Status Bar
- **FR-1801**: Display horizontally across bottom of window
- **FR-1802**: Show character count (updating in real-time)
- **FR-1803**: Show word count (updating in real-time)
- **FR-1804**: Display last saved timestamp on right side
- **FR-1805**: Show "New document not yet saved" for unsaved documents
- **FR-1806**: Update counts as user types

### 2.5 Settings Management

#### 2.5.1 Settings Dialog
- **FR-1901**: Open modal dialog when Settings button clicked
- **FR-1902**: Display vertical tab navigation on left
- **FR-1903**: Show settings content area on right
- **FR-1904**: Include Cancel button to discard changes
- **FR-1905**: Include Save button to apply changes
- **FR-1906**: Support keyboard navigation (Tab, Enter, Esc)
- **FR-1907**: Close dialog with X button in top-right

#### 2.5.2 General Settings
- **FR-2001**: Provide Language dropdown (default: English)
- **FR-2002**: Provide Autosave checkbox
- **FR-2003**: Provide Autosave Interval dropdown (5/15/30 minutes)
- **FR-2004**: Disable interval dropdown when autosave unchecked
- **FR-2005**: Apply autosave only to already-saved documents
- **FR-2006**: Reserve language implementation for future

#### 2.5.3 Theme Settings
- **FR-2101**: Provide radio buttons for Light/Dark/System themes
- **FR-2102**: Apply theme immediately when selected
- **FR-2103**: Persist theme preference
- **FR-2104**: Respect system theme when System selected
- **FR-2105**: Listen for system theme changes when applicable

#### 2.5.4 Files Settings
- **FR-2201**: Provide Default File Extension dropdown (.md/.markdown/.txt)
- **FR-2202**: Provide Documents Storage Location field
- **FR-2203**: Include Browse button for documents location
- **FR-2204**: Provide Templates Storage Location field
- **FR-2205**: Include Browse button for templates location
- **FR-2206**: Default documents location to OS user documents folder
- **FR-2207**: Validate storage locations are accessible
- **FR-2208**: Allow manual text entry for storage paths

#### 2.5.5 Editor Settings
- **FR-2301**: Provide Font Size dropdown (8-24pt)
- **FR-2302**: Apply font size to Normal/Paragraph text
- **FR-2303**: Apply font size across all editor modes
- **FR-2304**: Provide Word Wrap checkbox
- **FR-2305**: Apply word wrap to code blocks when enabled
- **FR-2306**: Show horizontal scrollbar when word wrap disabled
- **FR-2307**: Provide Show Line Numbers checkbox
- **FR-2308**: Display line numbers in Split mode plain text editor
- **FR-2309**: Provide LaTeX Support checkbox
- **FR-2310**: Enable/disable LaTeX rendering based on setting

#### 2.5.6 About Tab
- **FR-2401**: Display application name "VibeMD"
- **FR-2402**: Display version number (default 1.0.0)
- **FR-2403**: Display website URL (www.vibemd.app)
- **FR-2404**: Include scrollable list of third-party components
- **FR-2405**: List each component with name, copyright, and license
- **FR-2406**: Include clickable links for component websites

### 2.6 Print Functionality
- **FR-2501**: Invoke OS print dialog when Print button clicked
- **FR-2502**: Print rendered HTML version of document
- **FR-2503**: Support all OS print options (printer selection, page range, etc.)
- **FR-2504**: Maintain document formatting in print output
- **FR-2505**: Include proper page breaks for long documents

### 2.7 Markdown Support

#### 2.7.1 CommonMark Support
- **FR-2601**: Support all CommonMark specification elements
- **FR-2602**: Render headings (H1-H6)
- **FR-2603**: Render emphasis and strong emphasis
- **FR-2604**: Render blockquotes
- **FR-2605**: Render lists (ordered and unordered)
- **FR-2606**: Render code blocks and inline code
- **FR-2607**: Render links and images
- **FR-2608**: Render horizontal rules
- **FR-2609**: Render line breaks and paragraphs

#### 2.7.2 GitHub Flavored Markdown Support (Phase 2)
- **FR-2701**: Support GFM tables
- **FR-2702**: Support task lists
- **FR-2703**: Support strikethrough text
- **FR-2704**: Support autolinks
- **FR-2705**: Support disallowed raw HTML filtering

#### 2.7.3 LaTeX Support (Phase 3)
- **FR-2801**: Render LaTeX math expressions when enabled
- **FR-2802**: Support inline math (single $)
- **FR-2803**: Support display math (double $$)
- **FR-2804**: Fallback gracefully when LaTeX disabled
- **FR-2805**: Show LaTeX source when rendering fails

#### 2.7.4 Phased Implementation Plan
- **Phase 1 (MVP)**: CommonMark support only
  - Headings, emphasis, lists, links, images, code blocks, blockquotes
  - Milkdown Crepe WYSIWYG editor
  - react-markdown for Split and Preview modes
- **Phase 2 (Future)**: GFM extensions
  - Strikethrough, tables, task lists
  - Extend Crepe toolbar with additional buttons
  - Add remark-gfm to react-markdown
- **Phase 3 (Future)**: LaTeX support
  - Math expressions via KaTeX
  - Add remark-math + rehype-katex to react-markdown

## 3. Non-Functional Requirements

### 3.1 Performance
- **NFR-101**: Application startup time < 3 seconds
- **NFR-102**: Document switching time < 200ms
- **NFR-103**: Editor mode switching time < 500ms
- **NFR-104**: Support documents up to 10MB in size
- **NFR-105**: Real-time preview latency < 100ms
- **NFR-106**: Memory usage < 500MB for typical usage

### 3.2 Usability
- **NFR-201**: Support standard keyboard shortcuts (Ctrl/Cmd+S, Ctrl/Cmd+O, etc.)
- **NFR-202**: Provide tooltips for all toolbar buttons
- **NFR-203**: Ensure consistent UI patterns across platforms
- **NFR-204**: Support keyboard navigation throughout application
- **NFR-205**: Provide clear visual feedback for all actions
- **NFR-206**: Maintain accessibility standards (WCAG 2.1 AA)

### 3.3 Reliability
- **NFR-301**: Implement autosave to prevent data loss
- **NFR-302**: Recover unsaved changes after crash
- **NFR-303**: Validate file operations before execution
- **NFR-304**: Handle file system errors gracefully
- **NFR-305**: Prevent data corruption during save operations

### 3.4 Compatibility
- **NFR-401**: Support UTF-8 file encoding
- **NFR-402**: Handle different line ending formats (LF, CRLF)
- **NFR-403**: Support file paths with Unicode characters
- **NFR-404**: Work with read-only file systems (preview mode)
- **NFR-405**: Integrate with OS file associations

### 3.5 Security
- **NFR-501**: Validate file paths to prevent directory traversal
- **NFR-502**: Sanitize HTML output to prevent XSS
- **NFR-503**: Respect file system permissions
- **NFR-504**: Do not store sensitive data in plain text
- **NFR-505**: Follow OS security best practices

### 3.6 Maintainability
- **NFR-601**: Use modular architecture
- **NFR-602**: Follow TypeScript best practices
- **NFR-603**: Maintain comprehensive documentation
- **NFR-604**: Use version control for all code
- **NFR-605**: Implement logging for debugging

## 4. User Interface Requirements

### 4.1 Visual Design
- **UIR-101**: Use clean, minimalist interface design
- **UIR-102**: Implement consistent spacing and alignment
- **UIR-103**: Use icon.svg for application branding
- **UIR-104**: Support high-DPI displays
- **UIR-105**: Ensure sufficient color contrast
- **UIR-106**: Use system fonts for native appearance

### 4.2 Responsive Behavior
- **UIR-201**: Support minimum window size of 1024x768
- **UIR-202**: Allow window resizing
- **UIR-203**: Persist window size and position
- **UIR-204**: Handle window maximize/minimize correctly
- **UIR-205**: Support fullscreen mode

### 4.3 Feedback and Messaging
- **UIR-301**: Show loading states for long operations
- **UIR-302**: Display error messages clearly
- **UIR-303**: Provide confirmation for destructive actions
- **UIR-304**: Show success feedback for completed actions
- **UIR-305**: Use toast notifications for background operations

## 5. Data Requirements

### 5.1 File Formats
- **DR-101**: Support .md files (markdown)
- **DR-102**: Support .markdown files (markdown)
- **DR-103**: Support .txt files (plain text)
- **DR-104**: Support .vibe files (templates)
- **DR-105**: Use UTF-8 encoding for all files

### 5.2 Configuration Storage
- **DR-201**: Store user preferences in JSON format
- **DR-202**: Use OS-appropriate config location
  - Windows: %APPDATA%/VibeMD/config.json
  - macOS: ~/Library/Application Support/VibeMD/config.json
  - Linux: ~/.config/VibeMD/config.json
- **DR-203**: Include default values for all settings
- **DR-204**: Validate configuration on load
- **DR-205**: Migrate configuration for version updates

### 5.3 Default Settings
```json
{
  "general": {
    "language": "en",
    "autosave": false,
    "autosaveInterval": 5
  },
  "theme": "system",
  "files": {
    "defaultExtension": "md",
    "documentsLocation": "<OS_DOCUMENTS_DIR>",
    "templatesLocation": "<OS_DOCUMENTS_DIR>/VibeMD/Templates"
  },
  "editor": {
    "fontSize": 14,
    "wordWrap": true,
    "showLineNumbers": true,
    "latexSupport": false
  },
  "window": {
    "width": 1200,
    "height": 800,
    "sidebarWidth": 250
  }
}
```

## 6. Constraints and Assumptions

### 6.1 Technical Constraints
- Must use Electron Forge (not Vite)
- Must use Milkdown for WYSIWYG editing
- Must use specified editor components
- Must use ShadCN for UI components
- Desktop-only for initial release

### 6.2 Assumptions
- Users have basic markdown knowledge
- Users have write access to documents directory
- Internet connection not required for core functionality
- Users running supported OS versions

## 7. Future Considerations

### 7.1 Mobile Support
- Implement using Capacitor (planned)
- iOS and Android support
- Touch-optimized interface
- Cloud sync capabilities

### 7.2 Additional Features
- Multi-language UI support
- Plugin system
- Custom theme creation
- Export to PDF directly
- Git integration
- Collaborative editing
- Cloud storage integration

## 8. Acceptance Criteria

### 8.1 Core Functionality
- User can create, open, save, and print markdown documents
- All three editor modes work correctly
- Template system functions as specified
- Settings persist across sessions
- Multiple documents can be opened simultaneously

### 8.2 Quality Standards
- No critical bugs in release
- UI matches provided screen samples
- Performance meets specified thresholds
- Works on all target platforms
- All markdown features render correctly

### 8.3 Documentation
- User guide provided
- Developer documentation complete
- API documentation for extensibility
- Installation instructions for all platforms
