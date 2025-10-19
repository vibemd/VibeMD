# VibeMD TipTap Implementation

This document describes the actual TipTap editor implementation used in VibeMD.

## File Location

**Main Editor Component:** `/src/renderer/components/editor/TipTapEditor.tsx` (904 lines)

## Architecture Overview

### Core Dependencies

```typescript
// TipTap Core
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// Extensions
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table*';
import { TaskList, TaskItem } from '@tiptap/extension-task-*';
import { Superscript } from '@tiptap/extension-superscript';
import { Subscript } from '@tiptap/extension-subscript';

// Markdown Processing
import { marked } from 'marked';
import TurndownService from 'turndown';
```

### State Management

- **documentStore** - Active document content and modification tracking
- **settingsStore** - Editor preferences (font size, font family)
- **navigationStore** - Heading navigation integration

## Implemented Features

### Phase 1 - Complete ✅

#### CommonMark Support (100%)
- ✅ Headings (H1-H6) with custom IDs for navigation
- ✅ Bold, Italic, Inline Code
- ✅ Lists (bullet and ordered)
- ✅ Code blocks
- ✅ Blockquotes
- ✅ Horizontal rules
- ✅ Links (with LinkDialog)
- ✅ Images (with ImageDialog)
- ✅ Hard breaks

#### GFM Support
- ✅ Strikethrough
- ✅ Tables (with row/column operations)
- ✅ Task lists with checkboxes
- ✅ Superscript
- ✅ Subscript

### Custom Extensions

#### 1. HeadingIdExtension
**Purpose:** Automatically generates IDs for headings to enable outline navigation

**Implementation:**
```typescript
const HeadingIdExtension = Extension.create({
  name: 'headingId',
  addGlobalAttributes() {
    return [{
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
    }];
  },
});
```

**Usage:** Integrates with OutlineTab for click-to-navigate functionality

## Editor Configuration

### Extensions Array
```typescript
extensions: [
  StarterKit.configure({
    heading: false,    // Replaced with custom Heading extension
    bulletList: false, // Replaced with custom BulletList extension  
    orderedList: false,// Replaced with custom OrderedList extension
    listItem: false,   // Replaced with custom ListItem extension
  }),
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: { class: 'cursor-pointer' },
  }),
  Image.configure({
    inline: true,
    allowBase64: true,
  }),
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableCell,
  TableHeader,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Superscript.configure({
    excludeNodes: ['subscript'],
  }),
  Subscript.configure({
    excludeNodes: ['superscript'],
  }),
  HeadingIdExtension,
]
```

### Event Handlers

**onUpdate:** Auto-save on content change
```typescript
onUpdate: ({ editor }) => {
  if (!activeDocument) return;
  
  const html = editor.getHTML();
  const markdown = htmlToMarkdown(html);
  
  updateDocument(activeDocument.id, { content: markdown });
  markAsModified(activeDocument.id);
}
```

**onCreate:** Set up navigation handler
```typescript
onCreate: ({ editor }) => {
  setScrollToHeadingHandler((headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Flash selection
      editor.chain()
        .focus()
        .setTextSelection({ from: pos, to: pos + node.nodeSize })
        .run();
    }
  });
}
```

## Toolbar Implementation

### Responsive Toolbar
Uses custom `useResponsiveToolbar` hook to calculate available space and show overflow dropdown when needed.

### Toolbar Buttons
- Text formatting: Bold, Italic, Strikethrough, Code
- Headings: Dropdown with H1-H6 + Normal text
- Lists: Bullet list, Ordered list
- Block elements: Blockquote, Horizontal rule
- Rich content: Links, Images, Tables
- Special: Task lists, Superscript, Subscript

### Table Operations
Context menu for table manipulation:
- Insert row above/below
- Insert column left/right
- Delete row/column
- Delete table

## Markdown Processing

### Markdown → HTML (marked)
```typescript
const markdownToHtml = (markdown: string): string => {
  const html = marked.parse(markdown, {
    gfm: true,
    breaks: false,
    pedantic: false,
  });
  
  // Add heading IDs
  return html.replace(/<h([1-6])>(.*?)<\/h\1>/g, (match, level, text) => {
    const id = generateHeadingId(text);
    return `<h${level} id="${id}">${text}</h${level}>`;
  });
};
```

### HTML → Markdown (turndown)
```typescript
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

// Custom rules for GFM
turndownService.addRule('strikethrough', {
  filter: ['del', 's', 'strike'],
  replacement: content => `~~${content}~~`
});

turndownService.addRule('taskList', {
  filter: node => {
    return node.nodeName === 'INPUT' && 
           node.getAttribute('type') === 'checkbox';
  },
  replacement: (content, node) => {
    return node.checked ? '[x] ' : '[ ] ';
  }
});
```

## Styling

### Editor Styles
Applied via `globals.css`:
- `.ProseMirror` - Main editor styling
- `.ProseMirror h1-h6` - Heading typography
- `.ProseMirror table` - Table borders and cell styling
- `.ProseMirror ul[data-type="taskList"]` - Task list styling
- `.ProseMirror code` - Code block styling
- `.ProseMirror blockquote` - Blockquote styling

### Dynamic Styling
Font size and family controlled by settings store:
```typescript
style={{
  fontSize: `${settings.editor.fontSize}px`,
  fontFamily: settings.editor.fontFamily
}}
```

## Dialogs

### LinkDialog
- URL input with validation
- Optional link text
- Edit existing links
- Remove links

### ImageDialog
- Image URL input
- Alt text input
- URL validation
- Preview support

## Integration Points

### 1. Document Store
- Loads markdown content
- Saves HTML as markdown
- Tracks modification state

### 2. Navigation Service
- Registers scroll handler
- Enables outline click-to-navigate
- Centers heading in viewport

### 3. Settings Store
- Font size (12-24px)
- Font family (Arial, Times New Roman, Courier New, etc.)

## Performance Optimizations

1. **Debounced Updates** - Document updates debounced to prevent excessive writes
2. **Lazy Rendering** - Only visible content rendered
3. **Responsive Toolbar** - Dynamically shows/hides buttons based on available space

## Known Limitations

1. **No Split View** - Phase 2 feature
2. **No LaTeX Support** - Phase 3 feature
3. **Basic Table Operations** - Advanced operations planned for Phase 2
4. **No Collaborative Editing** - Future consideration

## Testing

Currently manual testing only. Automated tests planned for Phase 10.

## Future Enhancements (Phase 2+)

- [ ] Split view with CodeMirror
- [ ] LaTeX math expressions (KaTeX)
- [ ] Advanced table formatting
- [ ] Image upload to local storage
- [ ] Drag-and-drop images
- [ ] Auto-linking URLs
- [ ] Emoji picker
- [ ] Markdown shortcuts (e.g., `##` auto-converts to H2)

## Related Files

- **LinkDialog:** `/src/renderer/components/dialogs/LinkDialog.tsx`
- **ImageDialog:** `/src/renderer/components/dialogs/ImageDialog.tsx`
- **Markdown Service:** `/src/renderer/services/markdownService.ts`
- **Navigation Service:** `/src/renderer/services/navigationService.ts`
- **Document Store:** `/src/renderer/stores/documentStore.ts`
- **Settings Store:** `/src/renderer/stores/settingsStore.ts`
- **Global Styles:** `/src/renderer/styles/globals.css`

## References

- TipTap Docs: https://tiptap.dev/
- Marked.js: https://marked.js.org/
- Turndown: https://github.com/mixmark-io/turndown
