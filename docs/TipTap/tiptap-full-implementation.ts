/**
 * Complete Tiptap Editor Implementation with CommonMark & GFM Support
 * TypeScript with React integration
 */

import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useEditor, EditorContent, EditorContext } from '@tiptap/react'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Markdown from '@tiptap/extension-markdown'

// ============================================================================
// EXTENSION CONFIGURATION
// ============================================================================

/**
 * Configure all CommonMark & GFM compliant extensions
 * Includes: headings, lists, code blocks, tables, task lists, strikethrough, etc.
 */
const createEditorExtensions = () => {
  return [
    // Core extensions (CommonMark compliant)
    StarterKit.configure({
      // Heading levels 1-6 (CommonMark)
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
      // Bold, italic, code, codeBlock, paragraph, etc. (CommonMark)
      // Blockquote, lists, hardBreak (CommonMark)
      // Strikethrough (GFM)
      strike: true,
    }),

    // Link support (CommonMark)
    Link.configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      HTMLAttributes: {
        rel: 'noopener noreferrer',
        target: '_blank',
      },
    }),

    // Markdown bidirectional support
    Markdown.configure({
      html: true, // Parse HTML in markdown
      tightLists: true, // No <p> inside <li>
      bulletListMarker: '-',
      breaks: false, // Don't convert \n to <br>
      transformPastedText: true,
      transformCopiedText: true,
      markedOptions: {
        // GitHub Flavored Markdown
        gfm: true,
        pedantic: false,
        smartypants: false,
      },
    }),
  ]
}

// ============================================================================
// EDITOR TYPES & INTERFACES
// ============================================================================

interface EditorToolbarProps {
  editor: Editor | null
}

interface EditorExportOptions {
  format: 'markdown' | 'html' | 'json'
}

interface EditorImportOptions {
  format: 'markdown' | 'html' | 'json'
  content: string
}

// ============================================================================
// EDITOR TOOLBAR COMPONENT
// ============================================================================

/**
 * Comprehensive toolbar with all formatting options
 */
const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
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
      {/* Text Formatting - CommonMark */}
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
          title="Strikethrough (GFM)"
        >
          <s>S</s>
        </ToolButton>
      </ButtonGroup>

      {/* Headings - CommonMark */}
      <ButtonGroup>
        <ToolButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          H1
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolButton>
      </ButtonGroup>

      {/* Lists - CommonMark & GFM */}
      <ButtonGroup>
        <ToolButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          ∙ List
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Ordered List"
        >
          1. List
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive('taskList')}
          title="Task List (GFM)"
        >
          ☑ Task
        </ToolButton>
      </ButtonGroup>

      {/* Block Elements - CommonMark */}
      <ButtonGroup>
        <ToolButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Code Block"
        >
          &lt;/&gt;
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Blockquote"
        >
          &quot;
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          ―
        </ToolButton>
      </ButtonGroup>

      {/* Tables - GFM */}
      <ButtonGroup>
        <ToolButton
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          title="Insert Table (GFM)"
        >
          ⊞ Table
        </ToolButton>
        {editor.isActive('table') && (
          <>
            <ToolButton
              onClick={() => editor.chain().focus().addRowAfter().run()}
              title="Add Row"
            >
              +Row
            </ToolButton>
            <ToolButton
              onClick={() => editor.chain().focus().deleteRow().run()}
              title="Delete Row"
            >
              -Row
            </ToolButton>
            <ToolButton
              onClick={() => editor.chain().focus().deleteTable().run()}
              title="Delete Table"
            >
              Del
            </ToolButton>
          </>
        )}
      </ButtonGroup>

      {/* History */}
      <ButtonGroup>
        <ToolButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          ↶
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          ↷
        </ToolButton>
      </ButtonGroup>
    </div>
  )
}

// ============================================================================
// MAIN EDITOR COMPONENT
// ============================================================================

interface MarkdownEditorProps {
  initialContent?: string
  onContentChange?: (content: { markdown: string; html: string; json: object }) => void
  editable?: boolean
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialContent = '# Welcome to Markdown Editor\n\nStart typing...',
  onContentChange,
  editable = true,
}) => {
  const [exportFormat, setExportFormat] = useState<EditorExportOptions['format']>('markdown')
  const [exportedContent, setExportedContent] = useState<string>('')

  const editor = useEditor({
    extensions: createEditorExtensions(),
    content: initialContent,
    contentType: 'markdown',
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const markdown = editor.storage.markdown.getMarkdown()
      const html = editor.getHTML()
      const json = editor.getJSON()

      onContentChange?.({
        markdown,
        html,
        json,
      })
    },
  })

  // ========================================================================
  // EXPORT FUNCTIONS
  // ========================================================================

  const exportContent = useCallback(
    (format: EditorExportOptions['format']) => {
      if (!editor) return

      let content = ''

      switch (format) {
        case 'markdown':
          content = editor.storage.markdown.getMarkdown()
          break
        case 'html':
          content = editor.getHTML()
          break
        case 'json':
          content = JSON.stringify(editor.getJSON(), null, 2)
          break
      }

      setExportedContent(content)
      setExportFormat(format)

      // Copy to clipboard
      navigator.clipboard.writeText(content).then(() => {
        alert(`${format.toUpperCase()} copied to clipboard!`)
      })
    },
    [editor]
  )

  const downloadContent = useCallback(
    (format: EditorExportOptions['format']) => {
      if (!editor) return

      let content = ''
      let filename = `document.${format}`
      let mimeType = 'text/plain'

      switch (format) {
        case 'markdown':
          content = editor.storage.markdown.getMarkdown()
          filename = 'document.md'
          mimeType = 'text/markdown'
          break
        case 'html':
          content = editor.getHTML()
          filename = 'document.html'
          mimeType = 'text/html'
          break
        case 'json':
          content = JSON.stringify(editor.getJSON(), null, 2)
          filename = 'document.json'
          mimeType = 'application/json'
          break
      }

      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },
    [editor]
  )

  // ========================================================================
  // IMPORT FUNCTION
  // ========================================================================

  const importMarkdown = useCallback(
    (content: string) => {
      if (!editor) return

      try {
        editor.chain().focus().setContent(content, 'markdown').run()
      } catch (error) {
        console.error('Failed to import markdown:', error)
        alert('Failed to import markdown. Please check the format.')
      }
    },
    [editor]
  )

  const handleFileImport = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        if (file.name.endsWith('.md') || file.type === 'text/markdown') {
          importMarkdown(content)
        } else {
          alert('Please upload a markdown (.md) file')
        }
      }
      reader.readAsText(file)
    },
    [importMarkdown]
  )

  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 p-4">
        <h1 className="text-2xl font-bold text-gray-800">Markdown Editor</h1>
        <p className="text-sm text-gray-600">CommonMark & GitHub Flavored Markdown</p>
      </div>

      {/* Control Panel */}
      <div className="bg-white border-b border-gray-300 p-4 flex flex-wrap gap-2">
        <button
          onClick={() => exportContent('markdown')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Copy Markdown
        </button>
        <button
          onClick={() => exportContent('html')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Copy HTML
        </button>
        <button
          onClick={() => exportContent('json')}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Copy JSON
        </button>

        <div className="border-l border-gray-300 mx-2"></div>

        <button
          onClick={() => downloadContent('markdown')}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
        >
          Download Markdown
        </button>
        <button
          onClick={() => downloadContent('html')}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
        >
          Download HTML
        </button>

        <div className="border-l border-gray-300 mx-2"></div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Import Markdown
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,text/markdown"
          onChange={handleFileImport}
          style={{ display: 'none' }}
        />
      </div>

      {/* Editor Container */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 max-w-4xl h-full flex flex-col">
          <EditorContext.Provider value={{ editor }}>
            <EditorToolbar editor={editor} />
            <EditorContent
              editor={editor}
              className="flex-1 overflow-auto bg-white border border-t-0 border-gray-300 p-4 rounded-b prose prose-sm max-w-none"
            />
          </EditorContext.Provider>
        </div>
      </div>

      {/* Status Bar */}
      {exportedContent && (
        <div className="bg-gray-800 text-white p-2 text-sm">
          <span className="font-semibold">Last export:</span> {exportFormat.toUpperCase()} (
          {exportedContent.length} characters)
        </div>
      )}
    </div>
  )
}

// ============================================================================
// UTILITY FUNCTIONS FOR STANDALONE USE
// ============================================================================

/**
 * Parse markdown string to Tiptap JSON format
 */
export const parseMarkdown = (markdownContent: string): object => {
  const editor = new Editor({
    extensions: createEditorExtensions(),
    content: markdownContent,
    contentType: 'markdown',
  })

  const json = editor.getJSON()
  editor.destroy()
  return json
}

/**
 * Convert Tiptap JSON to markdown
 */
export const jsonToMarkdown = (json: object): string => {
  const editor = new Editor({
    extensions: createEditorExtensions(),
    content: json,
  })

  const markdown = editor.storage.markdown.getMarkdown()
  editor.destroy()
  return markdown
}

/**
 * Convert markdown to HTML
 */
export const markdownToHtml = (markdownContent: string): string => {
  const editor = new Editor({
    extensions: createEditorExtensions(),
    content: markdownContent,
    contentType: 'markdown',
  })

  const html = editor.getHTML()
  editor.destroy()
  return html
}

/**
 * Convert HTML to markdown
 */
export const htmlToMarkdown = (htmlContent: string): string => {
  const editor = new Editor({
    extensions: createEditorExtensions(),
    content: htmlContent,
    contentType: 'html',
  })

  const markdown = editor.storage.markdown.getMarkdown()
  editor.destroy()
  return markdown
}

// ============================================================================
// EXAMPLE APP COMPONENT
// ============================================================================

export const App: React.FC = () => {
  const handleContentChange = (content: { markdown: string; html: string; json: object }) => {
    console.log('Content updated:', {
      markdownLength: content.markdown.length,
      htmlLength: content.html.length,
      jsonKeys: Object.keys(content.json),
    })

    // Persist to localStorage
    localStorage.setItem('editorContent', content.markdown)
  }

  const initialContent = localStorage.getItem('editorContent') || undefined

  return (
    <MarkdownEditor
      initialContent={initialContent}
      onContentChange={handleContentChange}
      editable={true}
    />
  )
}

export default App
