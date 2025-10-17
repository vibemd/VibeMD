/**
 * QUICK FIX: Add These Lines to Your Implementation
 */

// ============================================================================
// STEP 1: Add imports for Superscript and Subscript
// ============================================================================

// At the top of tiptap-full-implementation.ts, add:
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'

// ============================================================================
// STEP 2: Add extensions to configuration
// ============================================================================

// In createEditorExtensions() function, update to:
const createEditorExtensions = () => {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4, 5, 6] },
      strike: true,
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      HTMLAttributes: {
        rel: 'noopener noreferrer',
        target: '_blank',
      },
    }),
    
    // ADD THESE TWO LINES:
    Superscript,
    Subscript,
    
    Markdown.configure({
      html: true,
      tightLists: true,
      bulletListMarker: '-',
      breaks: false,
      transformPastedText: true,
      transformCopiedText: true,
      markedOptions: {
        gfm: true,
        pedantic: false,
        smartypants: false,
      },
    }),
  ]
}

// ============================================================================
// STEP 3: Add buttons to toolbar (in EditorToolbar component)
// ============================================================================

// Find the bold button area and ADD these buttons after the strikethrough button:

<ToolButton
  onClick={() => editor.chain().focus().toggleSuperscript().run()}
  isActive={editor.isActive('superscript')}
  title="Superscript (click again to exit)"
>
  x<sup>2</sup>
</ToolButton>

<ToolButton
  onClick={() => editor.chain().focus().toggleSubscript().run()}
  isActive={editor.isActive('subscript')}
  title="Subscript (click again to exit)"
>
  x<sub>2</sub>
</ToolButton>

// Then ADD these escape buttons (after the toolbar group separator):

<ToolButton
  onClick={() => editor.chain().focus().clearNodes().clearMarks().run()}
  title="Clear all formatting"
>
  Clear
</ToolButton>

<ToolButton
  onClick={() => 
    editor
      .chain()
      .focus()
      .clearNodes()
      .clearMarks()
      .setParagraph()
      .run()
  }
  title="Reset to normal paragraph text"
>
  Normal
</ToolButton>

// ============================================================================
// STEP 4 (OPTIONAL): Add keyboard shortcuts
// ============================================================================

// Add this to the editor configuration in useEditor hook:

const editor = useEditor({
  extensions: createEditorExtensions(),
  content: initialContent,
  contentType: 'markdown',
  editable,
  immediatelyRender: false,
  onKeyDown: ({ event }) => {
    // Escape key: clear all formatting
    if (event.key === 'Escape') {
      event.preventDefault()
      editor
        ?.chain()
        .focus()
        .clearNodes()
        .clearMarks()
        .setParagraph()
        .run()
      return true
    }
  },
  onUpdate: ({ editor }) => {
    const markdown = editor.storage.markdown.getMarkdown()
    const html = editor.getHTML()
    const json = editor.getJSON()
    onContentChange?.({ markdown, html, json })
  },
})

// ============================================================================
// SUMMARY OF THE THREE ESCAPE METHODS
// ============================================================================

/**
 * METHOD 1: Click the same button again (TOGGLE)
 * 
 * User clicks Superscript button → applies superscript
 * User clicks Superscript button again → removes superscript
 * 
 * Applies to ALL inline formatting:
 * - Bold, Italic, Code, Strike, Superscript, Subscript, Underline
 * 
 * Code: e.chain().focus().toggleSuperscript().run()
 */

/**
 * METHOD 2: Click "Clear" button
 * 
 * Removes ALL inline marks from selection
 * Keeps block structure (paragraphs, lists, etc.)
 * Does NOT convert to normal paragraph
 * 
 * Code: e.chain().focus().clearMarks().run()
 * 
 * Useful when user has mixed formatting they want to clear
 */

/**
 * METHOD 3: Click "Normal" button (RECOMMENDED)
 * 
 * Complete reset to normal paragraph text
 * Removes ALL formatting (marks and blocks)
 * Converts current node to paragraph
 * 
 * Code: 
 * e.chain()
 *   .focus()
 *   .clearNodes()      // Remove block-level marks
 *   .clearMarks()      // Remove inline marks
 *   .setParagraph()    // Convert to paragraph node
 *   .run()
 * 
 * Best for "Get me back to normal" use case
 */

/**
 * BONUS: Keyboard Shortcut
 * 
 * Pressing Escape key → clears all formatting
 * Natural behavior users expect
 * Implement in onKeyDown handler
 */

// ============================================================================
// INSTALLATION
// ============================================================================

/*
npm install @tiptap/extension-superscript
npm install @tiptap/extension-subscript
*/

// ============================================================================
// COMPLETE EXAMPLE IN CONTEXT
// ============================================================================

/*
export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  if (!editor) return null

  const ButtonGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex gap-1 border-r border-gray-300 px-2" role="group">
      {children}
    </div>
  )

  const ToolButton: React.FC<{
    onClick: () => void
    isActive?: boolean
    title: string
    children: React.ReactNode
  }> = ({ onClick, isActive, title, children }) => (
    <button
      onClick={onClick}
      title={title}
      className={`px-3 py-2 rounded transition-colors ${
        isActive
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="flex flex-wrap gap-0 bg-white border border-gray-300 rounded-t p-2">
      <ButtonGroup>
        <ToolButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          title="Inline Code"
        >
          <code>&lt;&gt;</code>
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          <s>S</s>
        </ToolButton>
        
        {/* NEW: Superscript & Subscript */}
        <ToolButton
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          isActive={editor.isActive('superscript')}
          title="Superscript - click again to exit"
        >
          x<sup>2</sup>
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          isActive={editor.isActive('subscript')}
          title="Subscript - click again to exit"
        >
          x<sub>2</sub>
        </ToolButton>
        
        {/* NEW: Escape Mechanisms */}
        <ToolButton
          onClick={() => editor.chain().focus().clearMarks().run()}
          title="Clear all inline formatting"
        >
          Clear
        </ToolButton>
        <ToolButton
          onClick={() => 
            editor
              .chain()
              .focus()
              .clearNodes()
              .clearMarks()
              .setParagraph()
              .run()
          }
          title="Reset to normal paragraph text"
        >
          Normal
        </ToolButton>
      </ButtonGroup>

      {/* ... rest of toolbar ... */}
    </div>
  )
}
*/
