/**
 * UPDATED: Tiptap Implementation with Superscript, Subscript & Escape Mechanisms
 * 
 * This shows the key changes needed to handle formatting escape properly.
 * Add these to your existing implementation.
 */

import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'

// ============================================================================
// EXTENSION CONFIGURATION (Updated)
// ============================================================================

const createEditorExtensions = () => {
  return [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
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

    // NEW: Add Superscript and Subscript support
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
// TOOLBAR WITH ESCAPE MECHANISMS
// ============================================================================

/**
 * Enhanced toolbar configuration with escape mechanisms
 */
interface ToolbarButton {
  label: string
  title: string
  command: (editor: Editor) => void
  isActive?: (editor: Editor) => boolean
  group?: string
  separator?: boolean
}

const toolbarButtons: ToolbarButton[] = [
  // Text Formatting - CommonMark
  {
    group: 'format',
    label: '<strong>B</strong>',
    title: 'Bold (Ctrl+B)',
    command: (e) => e.chain().focus().toggleBold().run(),
    isActive: (e) => e.isActive('bold'),
  },
  {
    group: 'format',
    label: '<em>I</em>',
    title: 'Italic (Ctrl+I)',
    command: (e) => e.chain().focus().toggleItalic().run(),
    isActive: (e) => e.isActive('italic'),
  },
  {
    group: 'format',
    label: '<code>&lt;&gt;</code>',
    title: 'Inline Code',
    command: (e) => e.chain().focus().toggleCode().run(),
    isActive: (e) => e.isActive('code'),
  },
  {
    group: 'format',
    label: '<s>S</s>',
    title: 'Strikethrough (GFM)',
    command: (e) => e.chain().focus().toggleStrike().run(),
    isActive: (e) => e.isActive('strike'),
  },

  // NEW: Superscript & Subscript with escape mechanism
  {
    group: 'format',
    label: 'x<sup>2</sup>',
    title: 'Superscript (Click again to exit)',
    command: (e) => e.chain().focus().toggleSuperscript().run(),
    isActive: (e) => e.isActive('superscript'),
  },
  {
    group: 'format',
    label: 'x<sub>2</sub>',
    title: 'Subscript (Click again to exit)',
    command: (e) => e.chain().focus().toggleSubscript().run(),
    isActive: (e) => e.isActive('subscript'),
  },

  // NEW: Clear Formatting button - ESCAPE MECHANISM
  {
    group: 'format',
    label: 'Clear',
    title: 'Remove all formatting from selection',
    command: (e) => e.chain().focus().clearNodes().run(),
  },

  // NEW: Normal Text button - EXPLICIT ESCAPE
  {
    group: 'format',
    label: 'Normal',
    title: 'Convert to normal paragraph text',
    command: (e) => {
      // Remove all marks and convert to paragraph
      e.chain()
        .focus()
        .clearNodes()
        .clearMarks()
        .setParagraph()
        .run()
    },
  },

  // Headings - CommonMark
  {
    group: 'headings',
    label: 'H1',
    title: 'Heading 1',
    command: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (e) => e.isActive('heading', { level: 1 }),
  },
  {
    group: 'headings',
    label: 'H2',
    title: 'Heading 2',
    command: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (e) => e.isActive('heading', { level: 2 }),
  },
  {
    group: 'headings',
    label: 'H3',
    title: 'Heading 3',
    command: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (e) => e.isActive('heading', { level: 3 }),
  },

  // Lists - CommonMark & GFM
  {
    group: 'lists',
    label: '∙ List',
    title: 'Bullet List',
    command: (e) => e.chain().focus().toggleBulletList().run(),
    isActive: (e) => e.isActive('bulletList'),
  },
  {
    group: 'lists',
    label: '1. List',
    title: 'Ordered List',
    command: (e) => e.chain().focus().toggleOrderedList().run(),
    isActive: (e) => e.isActive('orderedList'),
  },
  {
    group: 'lists',
    label: '☑ Task',
    title: 'Task List (GFM)',
    command: (e) => e.chain().focus().toggleTaskList().run(),
    isActive: (e) => e.isActive('taskList'),
  },

  // Block Elements - CommonMark
  {
    group: 'blocks',
    label: '&lt;/&gt;',
    title: 'Code Block',
    command: (e) => e.chain().focus().toggleCodeBlock().run(),
    isActive: (e) => e.isActive('codeBlock'),
  },
  {
    group: 'blocks',
    label: '&quot;',
    title: 'Blockquote',
    command: (e) => e.chain().focus().toggleBlockquote().run(),
    isActive: (e) => e.isActive('blockquote'),
  },
  {
    group: 'blocks',
    label: '―',
    title: 'Horizontal Rule',
    command: (e) => e.chain().focus().setHorizontalRule().run(),
  },

  // Tables - GFM
  {
    group: 'tables',
    label: '⊞ Table',
    title: 'Insert Table (GFM)',
    command: (e) =>
      e
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run(),
  },

  // History
  {
    group: 'history',
    label: '↶',
    title: 'Undo',
    command: (e) => e.chain().focus().undo().run(),
  },
  {
    group: 'history',
    label: '↷',
    title: 'Redo',
    command: (e) => e.chain().focus().redo().run(),
  },
]

// ============================================================================
// ESCAPE MECHANISMS EXPLAINED
// ============================================================================

/**
 * THREE WAYS TO ESCAPE FORMATTING:
 * 
 * 1. TOGGLE METHOD (for inline marks)
 *    Click the same button again to toggle formatting off
 *    e.g., click Bold button once to turn ON, again to turn OFF
 *    Works for: Bold, Italic, Code, Strike, Superscript, Subscript
 *    
 *    Implementation:
 *    command: (e) => e.chain().focus().toggleBold().run()
 *    
 *    When already bold and you click again:
 *    - It calls toggleBold() which removes the mark
 * 
 * 2. CLEAR FORMATTING BUTTON (removes all marks)
 *    Clears all inline formatting marks from selection
 *    Does NOT affect block structure
 *    
 *    Implementation:
 *    command: (e) => e.chain().focus().clearNodes().run()
 *    
 *    This removes: bold, italic, code, superscript, subscript, etc.
 *    But keeps: paragraph structure, lists, headings
 * 
 * 3. NORMAL TEXT BUTTON (complete reset)
 *    Removes ALL formatting and converts to regular paragraph
 *    Affects both marks AND block structure
 *    
 *    Implementation:
 *    command: (e) => {
 *      e.chain()
 *        .focus()
 *        .clearNodes()        // Remove all block marks
 *        .clearMarks()        // Remove all inline marks
 *        .setParagraph()      // Convert to paragraph
 *        .run()
 *    }
 *    
 *    This gives a complete "reset to defaults" experience
 */

// ============================================================================
// KEYBOARD SHORTCUTS FOR ESCAPING
// ============================================================================

/**
 * Add these keyboard shortcuts to your editor configuration
 * for additional escape mechanisms:
 */

const keyboardShortcuts = {
  // Method 1: Press Escape key to exit formatting mode
  'Escape': (editor: Editor) => {
    // When pressing Escape, set to paragraph and clear all marks
    return editor.chain().focus().clearNodes().clearMarks().setParagraph().run()
  },

  // Method 2: Ctrl+0 or Cmd+0 to clear all formatting
  'Mod-0': (editor: Editor) => {
    return editor.chain().focus().clearMarks().run()
  },

  // Method 3: Ctrl+Alt+0 or Cmd+Option+0 for complete reset
  'Mod-Alt-0': (editor: Editor) => {
    return editor.chain().focus().clearNodes().clearMarks().setParagraph().run()
  },

  // Superscript: Ctrl+. or Cmd+.
  'Mod-.': (editor: Editor) => {
    return editor.chain().focus().toggleSuperscript().run()
  },

  // Subscript: Ctrl+, or Cmd+,
  'Mod-,': (editor: Editor) => {
    return editor.chain().focus().toggleSubscript().run()
  },
}

// ============================================================================
// ADD TO EDITOR CONFIGURATION
// ============================================================================

/**
 * Add this to your editor's useEditor hook:
 * 
 * const editor = useEditor({
 *   extensions: [
 *     StarterKit.configure({ ... }),
 *     Superscript,
 *     Subscript,
 *     // ... other extensions
 *   ],
 *   onKeyDown({ editor, event }) {
 *     // Escape key to exit formatting
 *     if (event.key === 'Escape') {
 *       editor.chain().focus().clearNodes().clearMarks().setParagraph().run()
 *       return true
 *     }
 *   },
 * })
 */

// ============================================================================
// PRACTICAL EXAMPLES
// ============================================================================

/**
 * EXAMPLE 1: User applies Superscript
 * 
 * User does:
 * 1. Types "E=mc"
 * 2. Selects "2" at the end
 * 3. Clicks Superscript button
 * 4. Result: "E=mc²"
 * 
 * To escape:
 * Option A: Click Superscript button again (toggle off)
 * Option B: Press Escape key
 * Option C: Click "Normal" button
 * Option D: Click "Clear" button
 */

/**
 * EXAMPLE 2: User applies Bold and Code together
 * 
 * User does:
 * 1. Types "important function"
 * 2. Selects "function"
 * 3. Clicks Bold → "**function**"
 * 4. Clicks Code → "**`function`**"
 * 5. Now stuck in Code mode with Bold active
 * 
 * To escape:
 * Option A: Click Code button to toggle off Code mark
 * Option B: Click Bold button to toggle off Bold mark
 * Option C: Click "Clear" button to remove both
 * Option D: Click "Normal" button for complete reset
 */

/**
 * EXAMPLE 3: Selecting text in different formatting
 * 
 * If user selects text that has mixed formatting
 * (e.g., some bold, some not), they can:
 * 1. Click Bold button → makes entire selection bold
 * 2. Click Bold again → removes bold from entire selection
 * 3. Or click "Clear" to remove all formatting
 */

// ============================================================================
// BEST PRACTICES
// ============================================================================

/**
 * RECOMMENDATIONS FOR UX:
 * 
 * 1. ALWAYS include a "Normal" button
 *    Gives users a clear "reset to default" option
 *    Shows explicitly what button does
 * 
 * 2. USE meaningful titles
 *    "Bold (Click again to exit)" is better than just "Bold"
 *    Teach users the toggle behavior
 * 
 * 3. SHOW active state with visual feedback
 *    Highlight active formatting buttons (done with isActive)
 *    Makes it clear which formatting is applied
 * 
 * 4. KEYBOARD SHORTCUT for Escape
 *    Pressing Escape should clear all formatting
 *    Natural expectation from desktop apps
 * 
 * 5. GROUP related buttons
 *    Keep formatting buttons together
 *    Separate escape/clear buttons
 * 
 * 6. DOCUMENT in UI
 *    Show hints in button titles
 *    Help users discover toggle behavior
 */

// ============================================================================
// COMMANDS REFERENCE
// ============================================================================

/**
 * ALL formatting toggle commands:
 * 
 * e.chain().focus().toggleBold().run()
 * e.chain().focus().toggleItalic().run()
 * e.chain().focus().toggleCode().run()
 * e.chain().focus().toggleStrike().run()
 * e.chain().focus().toggleSuperscript().run()
 * e.chain().focus().toggleSubscript().run()
 * e.chain().focus().toggleUnderline().run()
 * 
 * ESCAPE commands:
 * 
 * e.chain().focus().clearMarks().run()
 * e.chain().focus().clearNodes().run()
 * e.chain().focus().setParagraph().run()
 * e.chain().focus().clearNodes().clearMarks().setParagraph().run()
 * 
 * QUERY commands (check state):
 * 
 * editor.isActive('bold')
 * editor.isActive('superscript')
 * editor.isActive('codeBlock')
 */

export { toolbarButtons, keyboardShortcuts, createEditorExtensions }
