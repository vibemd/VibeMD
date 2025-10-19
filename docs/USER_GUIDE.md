# VibeMD User Guide

Welcome to **VibeMD** - a professional markdown editor designed for productivity and ease of use.

**Version:** 1.0.0  
**Last Updated:** October 2025

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [User Interface Overview](#user-interface-overview)
3. [Creating and Managing Documents](#creating-and-managing-documents)
4. [Editing Documents](#editing-documents)
5. [Using Templates](#using-templates)
6. [Navigation and Organization](#navigation-and-organization)
7. [Settings and Customization](#settings-and-customization)
8. [Keyboard Shortcuts](#keyboard-shortcuts)
9. [Tips and Best Practices](#tips-and-best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Getting Started

### What is VibeMD?

VibeMD is a cross-platform markdown editor that combines the power of markdown with an intuitive WYSIWYG (What You See Is What You Get) editing experience. Whether you're writing documentation, taking notes, or creating content, VibeMD makes markdown editing effortless.

### Key Features

- **WYSIWYG Editing**: See your formatting in real-time as you type
- **Professional Toolbar**: Quick access to all formatting options
- **Template System**: Create documents quickly using reusable templates
- **Multi-Document Support**: Work with multiple files simultaneously
- **Smart Navigation**: Jump to any section using the document outline
- **Theme Support**: Light, dark, or system-matched themes
- **Auto-Save**: Never lose your work with automatic saving
- **Cross-Platform**: Works on Windows, macOS, and Linux

### System Requirements

- **Windows**: Windows 10 or later
- **macOS**: macOS 11.0 or later
- **Linux**: Ubuntu 20.04+ or equivalent

---

## User Interface Overview

VibeMD's interface is designed for simplicity and efficiency:

```
┌─────────────────────────────────────────────────────┐
│  Toolbar (File actions, formatting, settings)       │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │          Editor Window                   │
│          │                                          │
│ - Files  │  (Your document appears here)            │
│ - Outline│                                          │
│ - Templates                                         │
│          │                                          │
├──────────┴──────────────────────────────────────────┤
│  Status Bar (Word count, save status)               │
└─────────────────────────────────────────────────────┘
```

### Toolbar

Located at the top of the window, the toolbar provides:
- **File operations**: New, Open, Save
- **Formatting tools**: Bold, italic, headings, lists, etc.
- **Settings**: Access to application preferences

### Sidebar

The collapsible sidebar on the left contains three tabs:

1. **Files**: Lists all currently open documents
2. **Outline**: Shows the structure of your document (headings hierarchy)
3. **Templates**: Displays available document templates

### Editor Window

The main area where you write and format your documents. The editor provides:
- Real-time formatting preview
- Visual representation of your markdown
- Familiar text editing experience

### Status Bar

Located at the bottom, showing:
- **Word count**: Total words in your document
- **Character count**: Total characters
- **Save status**: When the document was last saved
- **Modified indicator**: Shows if there are unsaved changes

---

## Creating and Managing Documents

### Creating a New Document

**Method 1: Using the Toolbar**
1. Click the **New** button in the toolbar
2. Enter a filename in the dialog
3. Choose whether to save as a template (.vibe) or regular document (.md)
4. Click **Create**

**Method 2: Using Keyboard Shortcut**
- Press `Ctrl+N` (Windows/Linux) or `Cmd+N` (macOS)

### Opening an Existing Document

**Method 1: Using the Toolbar**
1. Click the **Open** button in the toolbar
2. Browse to your markdown file
3. Select the file and click **Open**

**Method 2: Using Keyboard Shortcut**
- Press `Ctrl+O` (Windows/Linux) or `Cmd+O` (macOS)

**Supported File Types:**
- `.md` - Markdown files
- `.markdown` - Markdown files (alternate extension)
- `.txt` - Plain text files

### Saving Your Work

**Save (Update Existing File)**
1. Click the **Save** button in the toolbar
2. Or press `Ctrl+S` (Windows/Linux) or `Cmd+S` (macOS)

If the document hasn't been saved before, you'll be prompted to choose a location and filename.

**Save As (Create a Copy)**
1. Click the **Save** dropdown arrow
2. Select **Save As**
3. Or press `Ctrl+Shift+S` (Windows/Linux) or `Cmd+Shift+S` (macOS)
4. Choose a new location and filename

### Working with Multiple Documents

VibeMD supports multiple open documents:

1. **Opening Multiple Files**: Each opened file appears in the **Files** tab
2. **Switching Between Files**: Click on a filename in the Files tab
3. **Closing Files**: Click the **X** button next to the filename
4. **Unsaved Changes**: You'll be prompted to save before closing modified files

---

## Editing Documents

### Formatting Text

VibeMD provides a rich set of formatting options through the toolbar:

#### Text Styles

| Format | Toolbar Button | Keyboard Shortcut | Markdown |
|--------|---------------|-------------------|----------|
| **Bold** | **B** icon | `Ctrl+B` / `Cmd+B` | `**text**` |
| *Italic* | *I* icon | `Ctrl+I` / `Cmd+I` | `*text*` |
| ~~Strikethrough~~ | S̶ icon | - | `~~text~~` |
| `Inline Code` | `</>` icon | `Ctrl+`` | `` `text` `` |

#### Headings

Use the heading dropdown in the toolbar to select heading levels:

- **Heading 1** - Main document title
- **Heading 2** - Major sections
- **Heading 3** - Subsections
- **Heading 4-6** - Nested subsections
- **Normal text** - Regular paragraph

#### Lists

**Bulleted Lists**
1. Click the bullet list icon
2. Start typing
3. Press `Enter` for a new list item
4. Press `Enter` twice to exit the list

**Numbered Lists**
1. Click the numbered list icon
2. Follow the same steps as bulleted lists

**Task Lists**
1. Click the checkbox icon
2. Type your task
3. Click the checkbox to mark complete

#### Links and Images

**Insert a Link**
1. Select the text you want to link
2. Click the link icon or press `Ctrl+K`
3. Enter the URL
4. Optionally customize the link text
5. Click **Insert Link**

**Insert an Image**
1. Click the image icon
2. Enter the image URL
3. Add alt text (recommended for accessibility)
4. Click **Insert Image**

#### Tables

**Create a Table**
1. Click the table icon
2. A 3x3 table is inserted
3. Click inside cells to edit content

**Manage Tables**
When your cursor is in a table, right-click to:
- Insert row above/below
- Insert column left/right
- Delete row/column
- Delete table

#### Other Formatting

**Blockquotes**
- Click the quote icon to create a blockquote
- Useful for citations or highlighted text

**Horizontal Rule**
- Click the horizontal line icon to insert a separator

**Superscript and Subscript**
- Use the x² icon for superscript (e.g., x²)
- Use the x₂ icon for subscript (e.g., H₂O)
- Note: These are mutually exclusive

### Code Blocks

For multi-line code:
1. Click the code block icon
2. Type or paste your code
3. The code will be properly formatted and styled

---

## Using Templates

Templates help you create documents quickly with pre-formatted content and structure.

### What are Templates?

Templates are reusable markdown files (`.vibe` extension) that contain:
- Pre-written content
- Formatting structure
- Placeholder text
- Consistent layouts

### Setting Up Templates

**Configure Templates Location**
1. Open Settings (`Ctrl+Shift+P`)
2. Go to **Files** tab
3. Click **Browse** next to "Templates Location"
4. Select a folder containing your `.vibe` template files
5. Click **Save**

### Using a Template

1. Navigate to the **Templates** tab in the sidebar
2. Find your desired template
3. Click the **Use** button
4. Enter a filename for your new document
5. Choose whether to create a regular document or template
6. Click **Create**

The new document will be created with all the template content, ready for you to customize.

### Creating Your Own Templates

1. Create a new document
2. Add the content and formatting you want to reuse
3. When saving, choose "Save as template"
4. Give it a descriptive name with `.vibe` extension
5. The template will appear in your Templates tab

**Template Ideas:**
- Meeting notes with standard sections
- Project documentation structure
- Blog post layouts
- Technical specifications
- To-do lists

---

## Navigation and Organization

### Using the Outline

The **Outline** tab automatically generates a table of contents from your document headings.

**Benefits:**
- See your document structure at a glance
- Quickly navigate to any section
- Identify missing or misplaced sections

**How to Use:**
1. Click the **Outline** tab in the sidebar
2. Your headings appear in a hierarchical tree
3. Click any heading to jump directly to that section
4. The editor will scroll and highlight the heading

**Collapsible Sections:**
- Click the arrow next to a heading to collapse/expand its subsections
- Helps manage large documents

### Organizing Open Documents

Use the **Files** tab to manage multiple documents:

**File List Features:**
- **Green dot**: Document is saved
- **Red dot**: Document has unsaved changes
- **Click filename**: Switch to that document
- **X button**: Close the document

**Tips:**
- Keep related documents open for easy cross-referencing
- Close documents you're done with to reduce clutter
- The active document is highlighted in the list

---

## Settings and Customization

Access settings by clicking the **Settings** icon in the toolbar or pressing `Ctrl+Shift+P`.

### General Settings

**Autosave**
- Enable/disable automatic saving
- Set autosave interval (in seconds)
- Recommended: Keep enabled with 5-10 second interval

### Theme Settings

Choose your preferred appearance:
- **Light**: Bright theme for well-lit environments
- **Dark**: Easy on the eyes in low-light conditions
- **System**: Automatically matches your operating system theme

Changes apply immediately.

### Files Settings

**Default Save Path**
- Set where new documents save by default
- Browse to your preferred documents folder

**Templates Location**
- Specify where VibeMD looks for template files
- Must be a folder containing `.vibe` files

### Editor Settings

**Font Size**
- Adjust editor text size (12-24 pixels)
- Default: 14px

**Font Family**
- Choose your preferred font
- Options: Arial, Times New Roman, Courier New, and more

**Word Wrap**
- Enable to wrap long lines automatically
- Disable to allow horizontal scrolling

**Line Numbers**
- Show/hide line numbers in the editor
- Useful for technical documentation

### About

View information about VibeMD:
- Version number
- Build date
- License information
- Third-party dependencies

---

## Keyboard Shortcuts

Keyboard shortcuts help you work faster and more efficiently.

### File Operations

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| New document | `Ctrl+N` | `Cmd+N` |
| Open document | `Ctrl+O` | `Cmd+O` |
| Save document | `Ctrl+S` | `Cmd+S` |
| Save As | `Ctrl+Shift+S` | `Cmd+Shift+S` |

### Editing

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Bold | `Ctrl+B` | `Cmd+B` |
| Italic | `Ctrl+I` | `Cmd+I` |
| Insert link | `Ctrl+K` | `Cmd+K` |
| Inline code | ``Ctrl+` `` | ``Cmd+` `` |
| Bullet list | `Ctrl+Shift+8` | `Cmd+Shift+8` |

### Application

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Open settings | `Ctrl+Shift+P` | `Cmd+Shift+P` |

---

## Tips and Best Practices

### Writing Efficiently

1. **Use Templates**: Create templates for frequently-used document types
2. **Learn Shortcuts**: Master common keyboard shortcuts for faster editing
3. **Enable Autosave**: Never worry about losing work
4. **Use Headings**: Structure your documents with proper heading hierarchy
5. **Outline View**: Use the outline to plan and navigate long documents

### Document Organization

1. **Consistent Naming**: Use clear, descriptive filenames
2. **Folder Structure**: Organize documents in logical folders
3. **Template Library**: Build a collection of templates for different needs
4. **Regular Backups**: Back up your templates and important documents

### Formatting Best Practices

1. **Heading Hierarchy**: Don't skip heading levels (H1 → H2 → H3)
2. **Alt Text for Images**: Always add descriptive alt text for accessibility
3. **Link Text**: Use descriptive link text instead of "click here"
4. **Tables**: Keep tables simple and readable
5. **Code Blocks**: Use proper code blocks for multi-line code

### Performance Tips

1. **Close Unused Documents**: Keep only active documents open
2. **Moderate File Size**: Very large documents (>10,000 lines) may slow performance
3. **Template Cleanup**: Remove unused templates to speed up template loading

---

## Troubleshooting

### Common Issues and Solutions

#### Document Not Appearing in Editor

**Problem**: File appears in Files list but editor is blank

**Solutions:**
1. Click on the filename in the Files tab to ensure it's selected
2. Check if the file is empty (look at word count in status bar)
3. Try closing and reopening the file

#### Templates Not Loading

**Problem**: Templates tab shows "No templates available"

**Solutions:**
1. Open Settings → Files tab
2. Verify Templates Location is set to a valid folder
3. Ensure the folder contains `.vibe` files
4. Check file permissions on the templates folder

#### Autosave Not Working

**Problem**: Documents not saving automatically

**Solutions:**
1. Open Settings → General tab
2. Verify "Enable Autosave" is checked
3. Check autosave interval is set (default: 5 seconds)
4. Ensure you have write permission to the save location

#### Formatting Not Applying

**Problem**: Toolbar buttons don't seem to work

**Solutions:**
1. Ensure text is selected when applying formatting
2. Check if the cursor is in a valid location (e.g., can't format inside code blocks)
3. Try restarting the application

#### Can't Find Saved Files

**Problem**: Saved documents can't be located

**Solutions:**
1. Check Settings → Files → Default Save Path
2. Use your operating system's file search
3. Look in your Documents folder (common default location)

### Getting Help

If you encounter issues not covered in this guide:

1. Check the documentation at [www.vibemd.app](https://www.vibemd.app)
2. Review the GitHub repository for known issues
3. Submit a bug report with detailed information:
   - Operating system and version
   - VibeMD version
   - Steps to reproduce the issue
   - Expected vs actual behavior

---

## Markdown Reference

### Quick Markdown Syntax

VibeMD supports CommonMark and GitHub Flavored Markdown (GFM):

**Text Formatting**
```markdown
**bold text**
*italic text*
~~strikethrough~~
`inline code`
```

**Headings**
```markdown
# Heading 1
## Heading 2
### Heading 3
```

**Lists**
```markdown
- Bullet item
- Another item

1. Numbered item
2. Another item

- [ ] Task item
- [x] Completed task
```

**Links and Images**
```markdown
[Link text](https://example.com)
![Image alt text](https://example.com/image.png)
```

**Tables**
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

**Code Blocks**
````markdown
```
Code block
Multiple lines
```
````

**Other**
```markdown
> Blockquote text

---
(Horizontal rule)

H~2~O (subscript)
x^2^ (superscript)
```

---

## Version Information

**Current Version**: 1.0.0  
**Release Date**: October 2025  
**Phase**: Phase 1 Complete (CommonMark + GFM)

**Supported in This Version:**
- ✅ WYSIWYG editing
- ✅ CommonMark syntax
- ✅ GitHub Flavored Markdown (GFM)
- ✅ Templates system
- ✅ Multi-document support
- ✅ Theme customization
- ✅ Auto-save

**Coming in Future Versions:**
- 🔄 Split view (source + preview)
- 🔄 LaTeX math expressions
- 🔄 Advanced table operations
- 🔄 Enhanced template management

---

## License and Credits

VibeMD is released under the MIT License.

**Built With:**
- Electron - Cross-platform desktop framework
- TipTap - Headless WYSIWYG editor
- React - UI framework
- TypeScript - Type-safe development

---

**Thank you for using VibeMD!**

For the latest updates and information, visit [www.vibemd.app](https://www.vibemd.app)
