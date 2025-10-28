# VibeMD User Guide

**Application:** VibeMD
**Version:** 1.0.16
**Updated:** 2025-10-28
**License:** MIT © 2025 ONLY1 Pty Ltd

---

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Editing Modes](#editing-modes)
4. [Features](#features)
5. [Settings & Customization](#settings--customization)
6. [Templates](#templates)
7. [Keyboard Shortcuts](#keyboard-shortcuts)
8. [Troubleshooting](#troubleshooting)
9. [FAQ](#faq)

---

## Installation

### Download

Download the latest release for your operating system from [GitHub Releases](https://github.com/vibemd/VibeMD/releases):

- **Windows:** MSI installer (recommended) or ZIP portable
- **macOS:** DMG disk image or ZIP portable
- **Linux:** DEB (Debian-based) or RPM (RedHat-based) package

### Installation Steps

#### Windows

1. Download `VibeMD-1.0.16-x64.msi` or `VibeMD-win32-x64-1.0.16.zip`
2. **MSI:** Double-click to run. Windows SmartScreen may warn "Unknown Publisher"—click **"More info" → "Run anyway"**
3. **ZIP:** Extract to a folder and run `VibeMD.exe`
4. Launch VibeMD from the Start Menu or desktop shortcut

#### macOS

1. Download `VibeMD-1.0.16-x64.dmg` or `VibeMD-darwin-x64-1.0.16.zip`
2. **DMG:** Double-click to mount, then drag `VibeMD` to the Applications folder
3. **ZIP:** Extract and move `VibeMD.app` to Applications
4. **First Launch:** Control-click (right-click) the app → **"Open"** to bypass Gatekeeper
5. macOS will prompt "Cannot be verified"—click **"Open Anyway"**

#### Linux (Ubuntu/Debian)

```bash
sudo dpkg -i vibemd_1.0.16_amd64.deb
```

Or use your package manager (GNOME Software, KDE Discover, etc.)

#### Linux (Fedora/RHEL/CentOS)

```bash
sudo rpm -i vibemd-1.0.16-1.x86_64.rpm
```

> For detailed security warning resolution, see [Installation & Security Warnings](INSTALLATION_SECURITY_WARNINGS.md)

---

## Quick Start

### First Launch

1. **Create a new document:** Click "New Document" on the home screen
2. **Start editing:** Type in the WYSIWYG editor (you'll see formatted text)
3. **Save your work:** Press `Ctrl+S` (Windows/Linux) or `Cmd+S` (macOS)
4. **Choose a location** and filename (defaults to your Documents folder)

### Opening Existing Files

- **File Menu:** File → Open, then select a `.md`, `.markdown`, or `.vibe` file
- **File Association:** Double-click a markdown file in your file explorer (if VibeMD is set as the default editor)
- **Drag & Drop:** Drag a markdown file onto the VibeMD window

---

## Editing Modes

### WYSIWYG Editor (Default)

The WYSIWYG ("What You See Is What You Get") editor shows formatted text as you type:

- **Bold:** `Ctrl+B` / `Cmd+B`
- **Italic:** `Ctrl+I` / `Cmd+I`
- **Code:** `Ctrl+K` / `Cmd+K`
- **Strikethrough:** `Ctrl+Shift+X` / `Cmd+Shift+X`
- **Undo:** `Ctrl+Z` / `Cmd+Z`
- **Redo:** `Ctrl+Shift+Z` / `Cmd+Shift+Z`

### Plain Text Editor (Markdown Mode)

Click the **"Code"** button in the toolbar or use `Ctrl+Shift+M` (Windows/Linux) / `Cmd+Shift+M` (macOS) to edit raw markdown:

- See the underlying markdown syntax
- Full syntax highlighting
- Line numbers (togglable in Settings)
- Useful for complex formatting or pasting markdown from other sources

### Switching Between Modes

Toggle seamlessly between WYSIWYG and code views without losing your content. The switch is instantaneous and preserves your caret position.

---

## Features

### Text Formatting

| Style | Keyboard Shortcut | Toolbar |
|-------|-------------------|---------|
| **Bold** | `Ctrl+B` / `Cmd+B` | Button |
| *Italic* | `Ctrl+I` / `Cmd+I` | Button |
| ~~Strikethrough~~ | `Ctrl+Shift+X` / `Cmd+Shift+X` | Menu |
| `Code` | `Ctrl+K` / `Cmd+K` | Button |
| Superscript | — | Menu |
| Subscript | — | Menu |

### Headings

Click the heading dropdown in the toolbar or use:
- `Ctrl+Alt+1–6` / `Cmd+Alt+1–6` for H1–H6

Headings appear in the document outline (right sidebar).

### Lists

- **Bullet List:** Click bullet icon or `Ctrl+Shift+8` / `Cmd+Shift+8`
- **Ordered List:** Click number icon or `Ctrl+Shift+7` / `Cmd+Shift+7`
- **Task List:** Click checkbox icon
  - Click checkboxes to toggle completion (✓)

### Tables

1. Click **Insert Table** in the toolbar
2. Specify rows and columns
3. Right-click a cell to add/delete rows or columns
4. Navigate between cells with `Tab` (forward) / `Shift+Tab` (backward)

### Mathematical Formulas

Insert KaTeX formulas for mathematics and chemistry:

- **Inline Math:** Click the **∑** button or wrap in `$...$`
  - Example: `$E = mc^2$`
- **Block Math:** Click the **∑∑** button or wrap in `$$...$$`
  - Example: Display on its own line

Supports full LaTeX/KaTeX syntax.

### Links & Images

**Links:**
1. Select text or place your cursor where you want the link
2. Click **Link** button or `Ctrl+K` / `Cmd+K`
3. Enter URL and optional title
4. Click **Insert**

**Images:**
1. Click **Image** button in the toolbar
2. Enter image URL or path
3. Optional: Add alt text for accessibility
4. Click **Insert**

### Code Blocks

1. Click **Code Block** in the toolbar
2. Optionally select a language for syntax highlighting
3. Type your code
4. Exit with `Escape` or click outside the block

Supported languages: JavaScript, TypeScript, Python, Java, C++, SQL, Bash, JSON, XML, HTML, CSS, and more.

### Text Alignment

Select text and use the alignment buttons in the toolbar:
- Left align
- Center align
- Right align

### Blockquotes

1. Click the blockquote button in the toolbar or type `> `
2. Write your quote
3. Nested blockquotes are supported

### Horizontal Rules

Insert a visual separator with the HR button in the toolbar.

---

## Settings & Customization

Open **Settings** with `Ctrl+,` (Windows/Linux) or `Cmd+,` (macOS).

### General

- **Open last document on startup:** Automatically opens your most recently edited document
- **Autosave:** Enable or disable automatic saving
- **Autosave interval:** Time (in minutes) between auto-saves (default: 5 min)

### Theme

- **Light Mode:** Classic light interface
- **Dark Mode:** Dark interface (easier on the eyes)
- **System:** Follows your OS theme preferences

### Files

- **Default save path:** Where new documents are saved (defaults to Documents folder)
- **Templates path:** Where template files are stored

### Editor

- **Font size:** Adjust text size (8–32pt)
- **Font family:** Choose your preferred font
- **Line numbers:** Show/hide line numbers in code editor
- **Plain text mode:** Toggle between WYSIWYG and code editor

### About

- Application version and license information
- Core dependencies (Electron, React, Tiptap, CodeMirror)
- Links to source code and GitHub

---

## Templates

### What Are Templates?

Templates are pre-formatted markdown documents (`.vibe` files) that serve as starting points for new documents. Use them to maintain consistency or quickly create documents with boilerplate content.

### Creating a Template

1. Create or open a document with your desired structure
2. **File → Save as Template** (or in the Templates sidebar)
3. Give your template a name
4. The template is saved to your Templates folder

### Using Templates

1. Click **"New from Template"** button or use the Templates sidebar
2. Select a template from the list
3. A new document is created with the template content
4. Edit and save as a new document

### Managing Templates

The **Templates** sidebar tab shows all available templates:
- **Preview:** Click a template to see its content
- **Delete:** Right-click to delete a template (or click the ⚠️ button)

---

## Keyboard Shortcuts

### File Operations

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| New Document | `Ctrl+N` | `Cmd+N` |
| Open File | `Ctrl+O` | `Cmd+O` |
| Save | `Ctrl+S` | `Cmd+S` |
| Save As | `Ctrl+Shift+S` | `Cmd+Shift+S` |
| Print | `Ctrl+P` | `Cmd+P` |

### Editing

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Undo | `Ctrl+Z` | `Cmd+Z` |
| Redo | `Ctrl+Shift+Z` | `Cmd+Shift+Z` |
| Select All | `Ctrl+A` | `Cmd+A` |
| Cut | `Ctrl+X` | `Cmd+X` |
| Copy | `Ctrl+C` | `Cmd+C` |
| Paste | `Ctrl+V` | `Cmd+V` |

### Formatting

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Bold | `Ctrl+B` | `Cmd+B` |
| Italic | `Ctrl+I` | `Cmd+I` |
| Code | `Ctrl+K` | `Cmd+K` |
| Strikethrough | `Ctrl+Shift+X` | `Cmd+Shift+X` |
| Bullet List | `Ctrl+Shift+8` | `Cmd+Shift+8` |
| Ordered List | `Ctrl+Shift+7` | `Cmd+Shift+7` |
| H1–H6 | `Ctrl+Alt+1–6` | `Cmd+Alt+1–6` |

### View & Settings

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Toggle Code Mode | `Ctrl+Shift+M` | `Cmd+Shift+M` |
| Settings | `Ctrl+,` | `Cmd+,` |
| Toggle Sidebar | `Ctrl+B` | `Cmd+B` |
| Toggle Dark Mode | (via Settings) | (via Settings) |

---

## Troubleshooting

### The app won't launch or crashes on startup

1. **Check system requirements:** Windows 7+, macOS 10.12+, or modern Linux
2. **Verify installation:** Reinstall from the latest release
3. **Clear settings:** Delete the settings file (user settings are stored in OS-specific locations):
   - **Windows:** `%APPDATA%\VibeMD`
   - **macOS:** `~/Library/Application Support/VibeMD`
   - **Linux:** `~/.config/VibeMD`
4. **Check logs:** Look for error messages in the console (Settings → **Toggle Developer Tools**)

### Autosave isn't working

1. **Verify autosave is enabled:** Settings → General → Autosave
2. **Check the save path:** Settings → Files → Default save path exists and is writable
3. **Disk space:** Ensure you have free disk space
4. **Permissions:** Check that VibeMD has write permissions to the save folder

### Code editor shows strange characters or formatting issues

1. **Check your file encoding:** Save the file as UTF-8
2. **Clear the cache:** Settings → Toggle Developer Tools → Console → type `localStorage.clear()`
3. **Reload:** Press `F5` or `Cmd+R`

### Performance is slow with large documents

1. **Use plain text editor:** Large documents render faster in code mode
2. **Split into multiple files:** Consider breaking very large documents into smaller ones
3. **Close unused tabs:** Each open document uses memory

### Security warning on installation

> This is expected! See [Installation & Security Warnings](INSTALLATION_SECURITY_WARNINGS.md) for detailed instructions by OS.

### File won't open

1. **Check file format:** VibeMD supports `.md`, `.markdown`, and `.vibe` files
2. **Check file encoding:** Ensure the file is UTF-8 encoded
3. **Verify file isn't locked:** Close the file in other applications
4. **Check file path:** Very long paths (>260 characters on Windows) may cause issues

---

## FAQ

**Q: Can I use VibeMD offline?**
A: Yes! VibeMD works completely offline. All documents are stored locally on your computer.

**Q: Can I export documents to PDF?**
A: Yes, use **File → Print** and select "Save as PDF" (or your system's PDF printer).

**Q: Does VibeMD collect my data?**
A: No. VibeMD is offline-first and doesn't collect, transmit, or analyze your data.

**Q: Can I sync documents across devices?**
A: Currently, no built-in sync. You can use cloud storage (Google Drive, Dropbox, OneDrive) by saving documents to a synced folder. Cloud sync is planned for a future release.

**Q: What's the difference between `.md` and `.vibe` files?**
A: Both are markdown files. `.vibe` is VibeMD's native template format, but they're interchangeable. Rename as needed.

**Q: Can I contribute to VibeMD?**
A: Yes! See the [main README](../README.md#contributing) for contribution guidelines.

**Q: Where can I report bugs or request features?**
A: Open an issue on [GitHub Issues](https://github.com/vibemd/VibeMD/issues).

**Q: Is VibeMD free?**
A: Yes, VibeMD is open-source and free to use under the MIT License.

---

## Getting Help

- **GitHub Issues:** [Report bugs or request features](https://github.com/vibemd/VibeMD/issues)
- **Email:** hello@vibemd.app
- **Documentation:** See the [main repository](https://github.com/vibemd/VibeMD)

---

**VibeMD is developed and maintained by ONLY1 Pty Ltd.**
**License:** MIT © 2025 ONLY1 Pty Ltd
