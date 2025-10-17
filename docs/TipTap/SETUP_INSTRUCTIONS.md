/**
 * SETUP INSTRUCTIONS
 * 
 * This implementation requires the following npm packages:
 */

{
  "name": "tiptap-markdown-editor",
  "version": "1.0.0",
  "description": "Complete Tiptap editor with CommonMark and GFM support",
  "type": "module",
  "dependencies": {
    "@tiptap/core": "^2.3.0",
    "@tiptap/extension-link": "^2.3.0",
    "@tiptap/extension-markdown": "^2.3.0",
    "@tiptap/extension-table": "^2.3.0",
    "@tiptap/extension-table-cell": "^2.3.0",
    "@tiptap/extension-table-header": "^2.3.0",
    "@tiptap/extension-table-row": "^2.3.0",
    "@tiptap/extension-task-item": "^2.3.0",
    "@tiptap/extension-task-list": "^2.3.0",
    "@tiptap/react": "^2.3.0",
    "@tiptap/starter-kit": "^2.3.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "postcss": "^8.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "type-check": "tsc --noEmit"
  }
}

// ============================================================================
// INSTALLATION STEPS
// ============================================================================

/*
1. Create a new React + TypeScript project:
   npx create-react-app tiptap-editor --template typescript
   cd tiptap-editor

2. Install Tiptap and dependencies:
   npm install @tiptap/react @tiptap/core @tiptap/pm @tiptap/starter-kit
   npm install @tiptap/extension-link @tiptap/extension-markdown
   npm install @tiptap/extension-table @tiptap/extension-table-cell
   npm install @tiptap/extension-table-header @tiptap/extension-table-row
   npm install @tiptap/extension-task-item @tiptap/extension-task-list

3. Install Tailwind CSS for styling (optional):
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p

4. Copy the implementation file:
   cp tiptap-full-implementation.ts src/Editor.tsx

5. Use in your app:
   import { App } from './Editor'
   export default App

6. Add Tailwind CSS configuration to tailwind.config.js:
   module.exports = {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }

7. Start development server:
   npm start

*/

// ============================================================================
// COMMONMARK FEATURES SUPPORTED
// ============================================================================

/*
✓ Headings (# to ######)
✓ Bold (**text**)
✓ Italic (*text*)
✓ Inline code (`code`)
✓ Code blocks (```language)
✓ Paragraphs
✓ Hard line breaks (two spaces + newline)
✓ Bullet lists (- or * or +)
✓ Ordered lists (1. 2. 3.)
✓ Blockquotes (>)
✓ Horizontal rules (--- or *** or ___)
✓ Links ([text](url))
✓ Images (![alt](src))
*/

// ============================================================================
// GITHUB FLAVORED MARKDOWN (GFM) FEATURES SUPPORTED
// ============================================================================

/*
✓ Strikethrough (~~text~~)
✓ Task lists (- [ ] item or - [x] item)
✓ Tables:
  | Header 1 | Header 2 |
  |----------|----------|
  | Cell 1   | Cell 2   |
*/

// ============================================================================
// TYPESCRIPT TYPES REFERENCE
// ============================================================================

/*
EditorToolbarProps - Props for the toolbar component
  - editor: Editor | null - The Tiptap editor instance

EditorExportOptions - Options for exporting content
  - format: 'markdown' | 'html' | 'json'

EditorImportOptions - Options for importing content
  - format: 'markdown' | 'html' | 'json'
  - content: string

MarkdownEditorProps - Props for the main editor component
  - initialContent?: string - Initial markdown content
  - onContentChange?: callback - Called when content changes
  - editable?: boolean - Whether editor is editable

*/

// ============================================================================
// AVAILABLE METHODS
// ============================================================================

/*
Editor Commands (called on editor instance):

Text Formatting:
- editor.chain().focus().toggleBold().run()
- editor.chain().focus().toggleItalic().run()
- editor.chain().focus().toggleCode().run()
- editor.chain().focus().toggleStrike().run()

Headings:
- editor.chain().focus().toggleHeading({ level: 1 }).run()
- editor.chain().focus().toggleHeading({ level: 2 }).run()
- ... up to level 6

Lists:
- editor.chain().focus().toggleBulletList().run()
- editor.chain().focus().toggleOrderedList().run()
- editor.chain().focus().toggleTaskList().run()

Blocks:
- editor.chain().focus().toggleCodeBlock().run()
- editor.chain().focus().toggleBlockquote().run()
- editor.chain().focus().setHorizontalRule().run()

Tables (GFM):
- editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
- editor.chain().focus().addRowAfter().run()
- editor.chain().focus().deleteRow().run()
- editor.chain().focus().deleteTable().run()

History:
- editor.chain().focus().undo().run()
- editor.chain().focus().redo().run()

Content Export/Import:
- editor.storage.markdown.getMarkdown() - Get markdown content
- editor.getHTML() - Get HTML content
- editor.getJSON() - Get JSON content
- editor.chain().focus().setContent(content, 'markdown').run() - Set markdown content

*/

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

/*
Built-in keyboard shortcuts:

Formatting:
- Ctrl/Cmd + B → Bold
- Ctrl/Cmd + I → Italic
- Ctrl/Cmd + ` → Code
- Ctrl/Cmd + Alt + 0 → Paragraph
- Ctrl/Cmd + Alt + 1-6 → Heading 1-6

Lists:
- Ctrl/Cmd + Shift + 8 → Bullet list
- Ctrl/Cmd + Shift + 7 → Ordered list

History:
- Ctrl/Cmd + Z → Undo
- Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z → Redo

Markdown Shortcuts (automatic):
- # Text → Heading 1
- ## Text → Heading 2
- - Text → Bullet list
- 1. Text → Ordered list
- > Text → Blockquote
- ``` → Code block
- --- → Horizontal rule
- [ ] → Task list
- ~~text~~ → Strikethrough (requires two tildes)

*/

// ============================================================================
// LOCALSTORAGE PERSISTENCE
// ============================================================================

/*
The App component automatically saves content to localStorage:

Key: 'editorContent'
Value: Markdown content as string

To retrieve:
const content = localStorage.getItem('editorContent')

To clear:
localStorage.removeItem('editorContent')

*/

// ============================================================================
// CUSTOMIZATION EXAMPLES
// ============================================================================

/*

1. Change initial content:
   <MarkdownEditor initialContent="# My Custom Title" />

2. Handle content updates:
   <MarkdownEditor
     onContentChange={(content) => {
       console.log('Markdown:', content.markdown)
       console.log('HTML:', content.html)
       saveToDatabase(content)
     }}
   />

3. Make editor read-only:
   <MarkdownEditor editable={false} />

4. Get editor instance for advanced usage:
   const editorRef = useRef<Editor | null>(null)
   Use ref to access editor instance directly

5. Add custom extensions:
   const extensions = [
     ...createEditorExtensions(),
     YourCustomExtension
   ]

6. Export utility functions for non-React usage:
   import { markdownToHtml, htmlToMarkdown, parseMarkdown, jsonToMarkdown } from './Editor'
   
   const html = markdownToHtml('# Hello')
   const markdown = htmlToMarkdown('<h1>Hello</h1>')
   const json = parseMarkdown('# Hello')
   const md = jsonToMarkdown(json)

*/
