# VibeMD User Guide

**Application:** VibeMD **Version:** 1.0.11 **Release Date:** 2025-10-26 **License:** MIT

## Overview

VibeMD is a cross-platform desktop markdown editor built with Electron that provides a professional WYSIWYG (What You See Is What You Get) editing experience. It combines the simplicity of markdown with the power of rich text editing, making it ideal for both casual note-taking and professional document creation.

## Installation

### Windows

-   Download the MSI installer or ZIP package from the [releases page](https://github.com/ONLY1-Group/VibeMD/releases)
    
-   **MSI Installer:** Double-click to run the installer. As the installer is currently unsigned, Windows SmartScreen will display a warning. Click "More info" then "Run anyway" to proceed.
    
-   **ZIP Package:** Extract to your preferred location and run `VibeMD.exe`
    
-   Supported architectures: x64 and ARM64
    

### macOS

-   Download the DMG or ZIP package from the [releases page](https://github.com/ONLY1-Group/VibeMD/releases)
    
-   **DMG:** Open the DMG file and drag VibeMD to your Applications folder. Control-click and select "Open" to bypass Gatekeeper warnings for unsigned applications.
    
-   **ZIP:** Extract and move to Applications folder
    
-   Supported architectures: Apple Silicon (arm64) and Intel (x64)
    

### Linux

-   Download the DEB or RPM package for your distribution from the [releases page](https://github.com/ONLY1-Group/VibeMD/releases)
    
-   **Debian/Ubuntu:** `sudo dpkg -i vibemd-*.deb`
    
-   **Fedora/RHEL:** `sudo rpm -i vibemd-*.rpm`
    
-   Supported architecture: x64
    

> **Note:** All installers are currently unsigned. Operating systems will display security warnings during installation. This is expected behavior and will be addressed in future releases once code signing certificates are provisioned.

## Quick Start

1.  **Launch VibeMD** from your applications menu or desktop shortcut
    
2.  **Create a new document:**
    
    -   Click "New Document" in the sidebar Files tab, or
        
    -   Use keyboard shortcut `Ctrl+N` (Windows/Linux) or `Cmd+N` (macOS)
        
3.  **Start writing** using the WYSIWYG editor with formatting toolbar
    
4.  **Save your document:**
    
    -   Click the Save button in the toolbar, or
        
    -   Use `Ctrl+S` / `Cmd+S`
        
    -   Choose a location and filename (supports `.md`, `.markdown`, or `.vibe` extensions)
        

## User Interface

### Main Layout

![VibeMD UI](/site/Screenshot.png)

VibeMD's interface consists of four main areas:

1.  **Toolbar** (top): Quick access buttons for file operations and text formatting
    
2.  **Sidebar** (left): Multi-tab panel for Files, Templates, and Outline navigation
    
3.  **Editor** (center): WYSIWYG markdown editor with rich formatting
    
4.  **Status Bar** (bottom): Document statistics (word count, character count) and last-saved timestamp
    

### Sidebar Tabs

#### Files Tab

-   View all currently open documents
    
-   Create new documents with the "New Document" button
    
-   Click on any document to switch to it
    
-   Close documents (with unsaved changes warning if needed)
    
-   Visual indicators show which document is currently active
    

#### Templates Tab

-   Browse available document templates
    
-   Create new documents from templates by clicking on any template
    
-   Templates are stored in your configured templates directory
    
-   Save any document as a template for reuse
    

#### Outline Tab

-   Automatically generated document structure based on headings
    
-   Click any heading to jump to that section in the editor
    
-   Collapsible heading hierarchy for easy navigation
    
-   Updates in real-time as you edit
    

## Core Features

### Text Formatting

VibeMD supports comprehensive text formatting through both toolbar buttons and keyboard shortcuts:

-   **Bold:** `Ctrl+B` / `Cmd+B`
    
-   **Italic:** `Ctrl+I` / `Cmd+I`
    
-   **Strikethrough:** `Ctrl+Shift+X` / `Cmd+Shift+X`
    
-   **Code:** `Ctrl+E` / `Cmd+E` (inline code)
    
-   **Superscript:** Toolbar button
    
-   **Subscript:** Toolbar button
    

### Headings

Create headings from H1 to H6 using the heading dropdown in the toolbar or markdown syntax:

-   H1: `# Heading 1`
    
-   H2: `## Heading 2`
    
-   H3: `### Heading 3`
    
-   And so on...
    

### Lists

**Bullet Lists:**

-   Click the bullet list button in the toolbar
    
-   Use `-`, `*`, or `+` at the start of a line
    
-   Nest lists by indenting with Tab
    

**Ordered Lists:**

-   Click the numbered list button in the toolbar
    
-   Start a line with `1.` followed by a space
    
-   Nest lists by indenting with Tab
    

**Task Lists:**

-   Create interactive checkboxes for to-do items
    
-   Click the task list button in the toolbar
    
-   Use markdown syntax: `- [ ]` for unchecked, `- [x]` for checked
    
-   Click checkboxes directly in the editor to toggle completion
    
-   Support for nested task lists
    

### Links and Images

**Insert Links:**

1.  Select text to convert to a link
    
2.  Click the link button in the toolbar or press `Ctrl+K` / `Cmd+K`
    
3.  Enter the URL in the dialog
    
4.  Click "Insert" to create the link
    

**Insert Images:**

1.  Click the image button in the toolbar
    
2.  Enter the image URL in the dialog
    
3.  Optionally add alt text for accessibility
    
4.  Click "Insert" to add the image
    

### Tables

**Create Tables:**

1.  Click the table button in the toolbar
    
2.  A 3x3 table is inserted by default
    

**Table Operations:**

-   Right-click on any cell to access the context menu
    
-   Add rows above or below the current row
    
-   Add columns to the left or right
    
-   Delete rows or columns
    
-   Delete the entire table
    
-   Merge and split cells
    

### Mathematical Formulas

VibeMD supports LaTeX mathematical notation using KaTeX:

**Inline Math:**

-   Click the formula button in the toolbar
    
-   Use `<!-- MATH_INLINE_2 -->` syntax in markdown
    
-   Example: `<!-- MATH_INLINE_3 -->` renders as E = mc²
    

**Block Math:**

-   Use `<!-- MATH_BLOCK_0 -->` syntax for centered display equations
    
-   Example:
    
    ```
    <!-- MATH_BLOCK_1 -->
    ```
    

### Text Alignment

Align paragraphs and headings using the alignment buttons in the toolbar:

-   Left align (default)
    
-   Center align
    
-   Right align
    

### Code Blocks

**Inline Code:**

-   Use `Ctrl+E` / `Cmd+E` or surround text with backticks: `` `code` ``
    

**Code Blocks:**

-   Click the code block button in the toolbar
    
-   Use triple backticks with optional language identifier:
    
    ````
    ```javascript
    function hello() {
      console.log("Hello, world!");
    }
    ```
    ````
    

### Additional Elements

-   **Blockquotes:** Use `>` at the start of a line
    
-   **Horizontal Rules:** Click the toolbar button or use `---` or `***`
    
-   **Hard Breaks:** Press `Shift+Enter` for line breaks without creating new paragraphs
    

## Document Management

### Creating Documents

1.  **New Blank Document:**
    
    -   Click "New Document" in the Files tab
        
    -   Use `Ctrl+N` / `Cmd+N`
        
2.  **New from Template:**
    
    -   Go to the Templates tab
        
    -   Click on any template to create a new document based on it
        
    -   A dialog will prompt you to name your new document
        

### Opening Documents

1.  **From Menu:**
    
    -   Click "Open" in the toolbar
        
    -   Use `Ctrl+O` / `Cmd+O`
        
    -   Navigate to and select your markdown file
        
2.  **Drag and Drop:**
    
    -   Drag `.md`, `.markdown`, or `.vibe` files directly onto the VibeMD window
        
3.  **File Association:**
    
    -   VibeMD registers as the default handler for markdown files
        
    -   Double-click any `.md` or `.markdown` file in your file explorer
        

### Saving Documents

1.  **Save:**
    
    -   Click the Save button in the toolbar
        
    -   Use `Ctrl+S` / `Cmd+S`
        
    -   If the document hasn't been saved before, you'll be prompted to choose a location
        
2.  **Auto-save:**
    
    -   Enable in Settings → General
        
    -   Configure auto-save interval (default: 5 seconds)
        
    -   Visual indicator in status bar shows last saved time
        

### Multiple Documents

-   Open multiple documents simultaneously
    
-   Switch between documents using the Files tab in the sidebar
    
-   Each document maintains its own edit history and state
    
-   Unsaved changes are indicated visually in the Files tab
    

### Templates

**Creating Templates:**

1.  Create or open a document with your desired content and formatting
    
2.  Save it to your templates directory (configured in Settings)
    
3.  Use `.vibe` extension for VibeMD-specific templates
    
4.  Templates appear automatically in the Templates tab
    

**Using Templates:**

1.  Open the Templates tab in the sidebar
    
2.  Click on any template
    
3.  Enter a name for your new document
    
4.  A new document is created with the template's content
    

**Template Location:**

-   Default: `~/Documents/VibeMD/Templates`
    
-   Customizable in Settings → Files → Templates Location
    

## Settings

Access settings via the toolbar button or `Ctrl+,` / `Cmd+,`

### General Settings

-   **Enable Auto-save:** Toggle automatic document saving
    
-   **Auto-save Interval:** Set how frequently to auto-save (in seconds)
    
-   **Open Last Document on Startup:** Automatically reopen your most recent document when launching VibeMD
    

### Theme Settings

Choose your preferred color scheme:

-   **Light:** Bright theme for daytime use
    
-   **Dark:** Reduced eye strain for low-light environments
    
-   **System:** Automatically matches your operating system's theme preference
    

### File Settings

-   **Default Save Path:** Choose where new documents are saved by default
    
-   **Templates Location:** Set the directory where templates are stored
    
-   Clicking the folder icon allows you to browse and select directories
    

### Editor Settings

-   **Font Size:** Adjust editor font size (default: 12px)
    
-   **Font Family:** Choose your preferred editor font
    
-   **Show Line Numbers:** Toggle line number display (when applicable)
    

### About

View application information:

-   Current version number
    
-   Build information
    
-   License details
    

## Keyboard Shortcuts

### File Operations

-   **New Document:** `Ctrl+N` / `Cmd+N`
    
-   **Open Document:** `Ctrl+O` / `Cmd+O`
    
-   **Save Document:** `Ctrl+S` / `Cmd+S`
    
-   **Print Document:** `Ctrl+P` / `Cmd+P`
    
-   **Settings:** `Ctrl+,` / `Cmd+,`
    

### Text Formatting

-   **Bold:** `Ctrl+B` / `Cmd+B`
    
-   **Italic:** `Ctrl+I` / `Cmd+I`
    
-   **Strikethrough:** `Ctrl+Shift+X` / `Cmd+Shift+X`
    
-   **Inline Code:** `Ctrl+E` / `Cmd+E`
    
-   **Insert Link:** `Ctrl+K` / `Cmd+K`
    

### Editing

-   **Undo:** `Ctrl+Z` / `Cmd+Z`
    
-   **Redo:** `Ctrl+Y` / `Cmd+Shift+Z`
    
-   **Hard Break:** `Shift+Enter`
    

## Printing

Print your documents with native print dialog support:

1.  Click the Print button in the toolbar or press `Ctrl+P` / `Cmd+P`
    
2.  Your document is rendered as HTML for printing
    
3.  Use your system's print dialog to:
    
    -   Print to a physical printer
        
    -   Save as PDF
        
    -   Configure page layout and margins
        

## File Formats

VibeMD supports the following file formats:

-   `.md` - Standard markdown files
    
-   `.markdown` - Alternative markdown extension
    
-   `.vibe` - VibeMD-specific format (markdown with metadata)
    

All formats use standard markdown syntax and are compatible with other markdown editors. The `.vibe` format is recommended for templates as it can store VibeMD-specific metadata.

## Technical Specifications

### Markdown Support

VibeMD implements **GitHub Flavored Markdown (GFM)** with extensions:

-   All standard markdown syntax
    
-   Tables with alignment
    
-   Task lists with checkboxes
    
-   Strikethrough text
    
-   Automatic URL linking
    
-   LaTeX mathematical formulas (via KaTeX)
    

### Supported Features

**Text Elements:**

-   Headings (H1-H6)
    
-   Paragraphs with text alignment
    
-   Blockquotes
    
-   Horizontal rules
    

**Inline Formatting:**

-   Bold, italic, strikethrough
    
-   Inline code
    
-   Superscript and subscript
    
-   Links
    

**Block Elements:**

-   Bullet lists (nested)
    
-   Ordered lists (nested)
    
-   Task lists with interactive checkboxes
    
-   Code blocks with syntax highlighting
    
-   Tables with full manipulation
    
-   Images
    
-   Mathematical formulas (inline and block)
    

## Troubleshooting

### Application Won't Start

**Windows:**

-   Ensure you've allowed the unsigned application through SmartScreen
    
-   Try running as administrator if you encounter permission errors
    
-   Check that .NET Framework dependencies are installed
    

**macOS:**

-   Control-click and select "Open" to bypass Gatekeeper
    
-   Grant necessary permissions in System Preferences → Security & Privacy
    
-   Ensure the app is in your Applications folder
    

**Linux:**

-   Verify package dependencies are installed
    
-   Check permissions on the application binary
    
-   Review system logs for error messages
    

### Documents Not Saving

-   Check that you have write permissions for the target directory
    
-   Ensure adequate disk space is available
    
-   Verify the file path doesn't contain invalid characters
    
-   Check Settings → Files for default save path configuration
    

### Templates Not Appearing

-   Verify the templates directory exists and is accessible
    
-   Check Settings → Files → Templates Location
    
-   Ensure template files use supported extensions (`.md`, `.markdown`, `.vibe`)
    
-   Try refreshing by clicking on the Templates tab
    

### Formatting Not Working

-   Some markdown syntax requires a space after the marker (e.g., `# Heading` not `#Heading`)
    
-   Tables require proper pipe `|` formatting
    
-   LaTeX formulas must be enclosed in `$` or `$$` delimiters
    
-   Use the toolbar buttons if keyboard shortcuts aren't working
    

### Developer Tools

For advanced troubleshooting:

1.  Enable developer tools through the View menu (if available)
    
2.  Check the console for error messages
    
3.  Inspect the application state
    
4.  Report issues with console logs to the [GitHub Issues](https://github.com/ONLY1-Group/VibeMD/issues) page
    

## Getting Help

-   **Report Issues:** [GitHub Issues](https://github.com/ONLY1-Group/VibeMD/issues)
    
-   **Email Support:** [hello@vibemd.app](mailto:hello@vibemd.app)
    
-   **Documentation:** Check the `docs/` folder in the repository
    

When reporting issues, please include:

-   VibeMD version number (found in Settings → About)
    
-   Operating system and version
    
-   Steps to reproduce the problem
    
-   Any error messages from developer tools
    
-   Screenshots if applicable
    

## Privacy and Security

-   VibeMD stores all documents locally on your computer
    
-   No data is transmitted to external servers
    
-   Settings and preferences are stored locally
    
-   File operations use native OS dialogs for security
    
-   The application follows Electron security best practices:
    
    -   Context isolation enabled
        
    -   Node.js integration disabled in renderer
        
    -   Sandboxed renderer process
        
    -   IPC communication through secure preload layer
        

## Credits

VibeMD is built with:

-   **Electron** - Cross-platform desktop framework
    
-   **React** - UI library
    
-   **Tiptap** - WYSIWYG editor framework
    
-   **KaTeX** - Mathematical formula rendering
    
-   **Marked** - Markdown parser
    
-   **Tailwind CSS** - Styling framework
    

Developed by ONLY1 Pty Ltd

* * *

**Version:** 1.0.11 **Release Date:** 2025-10-26 **License:** MIT