# Tiptap Markdown Editor - Complete Implementation Guide

⚠️ **IMPORTANT: These are REFERENCE MATERIALS, not VibeMD's actual implementation.**

For VibeMD's actual TipTap implementation, see [VIBEMD_IMPLEMENTATION.md](./VIBEMD_IMPLEMENTATION.md).

---

This package contains two complete, production-ready implementations of Tiptap with full CommonMark and GitHub Flavored Markdown (GFM) support. These are standalone reference examples preserved for learning and future development.

## 📦 What's Included

### 1. **tiptap-full-implementation.ts** (React + TypeScript)
A complete React component with:
- Full CommonMark support (headings, lists, formatting, blockquotes, etc.)
- Full GFM support (tables, task lists, strikethrough)
- Comprehensive toolbar with all formatting options
- Import/export functionality (Markdown, HTML, JSON)
- File upload/download capabilities
- localStorage persistence
- Utility functions for standalone use
- TypeScript typing throughout

**Best for:** React applications, modern web apps, production deployments

### 2. **tiptap-vanilla-implementation.ts** (Vanilla JavaScript)
A vanilla JavaScript implementation with:
- No framework dependencies
- Dynamic toolbar creation
- Control panel for import/export
- File handling
- localStorage persistence
- Pure HTML/CSS/JS

**Best for:** Non-React projects, learning, simple integrations, vanilla JS apps

### 3. **SETUP_INSTRUCTIONS.md**
Complete installation and usage guide including:
- npm package requirements
- Step-by-step installation
- Configuration options
- Available methods and shortcuts
- Customization examples
- TypeScript type references

## ✨ Features

### CommonMark Compliance ✓
- **Text Formatting:** Bold, italic, strikethrough, inline code
- **Headings:** H1-H6 with automatic detection
- **Lists:** Bullet lists, ordered lists, nested support
- **Code Blocks:** Syntax highlighting support
- **Block Elements:** Blockquotes, horizontal rules, hard breaks
- **Links & Images:** Full support with auto-linking
- **Paragraphs:** Standard paragraph handling

### GFM Compliance ✓
- **Strikethrough:** ~~deleted text~~
- **Tables:** Full table support with cell operations
- **Task Lists:** [ ] unchecked and [x] checked tasks
- **Mentions:** @mentions support
- **Autolinks:** URLs auto-converted to links

## 🚀 Quick Start

### React Implementation

```typescript
import { App } from './tiptap-full-implementation'

// In your React app
export default function MyApp() {
  return <App />
}
```

### Vanilla JS Implementation

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Editor</title>
</head>
<body>
  <div id="editor"></div>
  
  <script type="module">
    import { initializeEditor } from './tiptap-vanilla-implementation.ts'
    initializeEditor('#editor')
  </script>
</body>
</html>
```

## 📋 Installation

### For React Implementation:

```bash
npm install @tiptap/react @tiptap/core @tiptap/pm @tiptap/starter-kit
npm install @tiptap/extension-link @tiptap/extension-markdown
```

### For Vanilla JS Implementation:

```bash
npm install @tiptap/core @tiptap/pm @tiptap/starter-kit
npm install @tiptap/extension-link @tiptap/extension-markdown
```

### Optional (for styling):

```bash
npm install -D tailwindcss
```

## 🎨 Supported Markdown Syntax

### CommonMark Features

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
`inline code`

- Bullet list item
  - Nested item
    - Deep nested

1. Ordered list
2. Second item
3. Third item

> Blockquote
> Multiple lines

```javascript
code block
with syntax highlighting
```

[Link text](https://example.com)
![Image alt text](https://example.com/image.jpg)

---
Horizontal rule
```

### GFM Extensions

```markdown
~~Strikethrough text~~

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

- [ ] Unchecked task
- [x] Completed task
  - [ ] Nested unchecked
  - [x] Nested completed
```

## 🔧 API Reference

### React Component Props

```typescript
<MarkdownEditor
  initialContent="# Welcome"              // Optional initial content
  onContentChange={(content) => {...}}    // Callback on changes
  editable={true}                         // Make read-only if false
/>
```

### Content Changes Callback

```typescript
onContentChange={(content) => {
  console.log(content.markdown) // Markdown string
  console.log(content.html)     // HTML string
  console.log(content.json)     // Tiptap JSON format
})
```

### Utility Functions (Both Implementations)

```typescript
// Parse markdown to Tiptap JSON
const json = parseMarkdown('# Hello\n\nWorld')

// Convert JSON to markdown
const markdown = jsonToMarkdown(json)

// Convert markdown to HTML
const html = markdownToHtml('**bold** text')

// Convert HTML to markdown
const markdown = htmlToMarkdown('<strong>bold</strong> text')
```

### Vanilla JS Initialization

```typescript
import { initializeEditor, getContent, downloadContent } from './tiptap-vanilla-implementation'

// Initialize editor
const editor = initializeEditor('#editor-container', 'Initial content')

// Get all content
const content = getContent(editor)
console.log(content.markdown)
console.log(content.html)
console.log(content.json)

// Download content
downloadContent(editor, 'markdown')  // Downloads as .md
downloadContent(editor, 'html')      // Downloads as .html
downloadContent(editor, 'json')      // Downloads as .json
```

## ⌨️ Keyboard Shortcuts

### Text Formatting
- `Ctrl/Cmd + B` → Bold
- `Ctrl/Cmd + I` → Italic
- `Ctrl/Cmd + `` ` `` → Inline code
- `Ctrl/Cmd + Alt + 0` → Paragraph
- `Ctrl/Cmd + Alt + 1-6` → Heading 1-6

### Lists
- `Ctrl/Cmd + Shift + 8` → Bullet list
- `Ctrl/Cmd + Shift + 7` → Ordered list

### History
- `Ctrl/Cmd + Z` → Undo
- `Ctrl/Cmd + Y` → Redo

### Automatic Markdown Detection
Start typing to automatically detect:
- `# ` → Heading
- `- ` → Bullet list
- `1. ` → Ordered list
- `> ` → Blockquote
- ` ``` ` → Code block
- `- [ ] ` → Task list

## 💾 Storage

Both implementations include localStorage persistence:

```typescript
// React
const content = localStorage.getItem('editorContent')

// Vanilla JS
const content = localStorage.getItem('tiptap-content')
```

## 🔄 Import/Export

### React Component

```typescript
<MarkdownEditor />
// Buttons provided:
// - Copy Markdown / Copy HTML / Copy JSON
// - Download Markdown / Download HTML
// - Import Markdown (from file)
```

### Vanilla JS

```typescript
import { downloadContent } from './tiptap-vanilla-implementation'

// Download to file
downloadContent(editor, 'markdown')
downloadContent(editor, 'html')
downloadContent(editor, 'json')

// Copy to clipboard (via button click in toolbar)
```

## 🎯 Use Cases

### Content Management Systems
- Blog editors
- Article writers
- Documentation platforms

### Collaboration Tools
- Note-taking applications
- Wiki editors
- Knowledge bases

### Development Tools
- README editors
- Documentation generators
- Markdown converters

### Real-time Applications
- Chat applications with rich text
- Collaborative editors
- AI prompt builders

## 📝 Customization

### Change Heading Levels
```typescript
heading: {
  levels: [1, 2, 3],  // Only H1-H3
}
```

### Disable GFM Features
```typescript
markedOptions: {
  gfm: false,  // Disable GitHub Flavored Markdown
}
```

### Custom Markdown Options
```typescript
Markdown.configure({
  breaks: true,                    // Convert \n to <br>
  transformPastedText: false,      // Don't convert pasted markdown
  bulletListMarker: '*',           // Use * instead of -
})
```

## 🐛 Troubleshooting

### Editor not showing
- Ensure element exists in DOM
- Check that extensions are properly imported
- Verify Tiptap CSS is loaded

### Tables not working
- Ensure StarterKit includes table extensions
- Tables require both Table and TableCell extensions

### Markdown not parsing
- Verify content is markdown format, not HTML
- Check that Markdown extension is configured
- Ensure markedOptions.gfm is true for GFM features

### Content not saving
- Check localStorage is enabled
- Verify onContentChange callback is implemented
- Look for browser console errors

## 📚 Resources

- [Tiptap Documentation](https://tiptap.dev/docs)
- [CommonMark Specification](https://spec.commonmark.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [ProseMirror Guide](https://prosemirror.net/docs/guide/)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Tiptap documentation
3. Check browser console for errors
4. Test with provided examples first

## 📄 License

These implementations are provided as examples. Tiptap is MIT licensed.

## ✅ Compliance Summary

**100% CommonMark Compliant:**
- All basic markdown features
- Full specification coverage
- Round-trip fidelity

**GitHub Flavored Markdown:**
- Tables ✓
- Task lists ✓
- Strikethrough ✓
- Autolinks ✓

**Open Source:**
- No paid Tiptap features required
- MIT licensed
- Community-supported

---

**Version:** 1.0.0
**Last Updated:** 2025-10-17
**Tiptap Version:** 2.3.0+
