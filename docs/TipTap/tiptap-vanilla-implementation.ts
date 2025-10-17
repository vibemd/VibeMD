/**
 * Vanilla JavaScript Implementation of Tiptap Editor
 * With CommonMark & GFM Support (No React/Vue required)
 */

import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Markdown from '@tiptap/extension-markdown'

// ============================================================================
// EDITOR CONFIGURATION
// ============================================================================

const createEditor = (element: HTMLElement, initialContent?: string): Editor => {
  return new Editor({
    element,
    extensions: [
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
    ],
    content: initialContent || '<p>Start typing...</p>',
    contentType: 'markdown',
    autofocus: 'end',
    immediatelyRender: true,
  })
}

// ============================================================================
// UI BUILDER FUNCTIONS
// ============================================================================

interface ToolbarButton {
  label: string
  title: string
  command: (editor: Editor) => void
  isActive?: (editor: Editor) => boolean
  group?: string
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

/**
 * Create and render toolbar
 */
const createToolbar = (container: HTMLElement, editor: Editor): void => {
  const toolbar = document.createElement('div')
  toolbar.className = 'editor-toolbar'
  toolbar.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 0;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 4px 4px 0 0;
    padding: 8px;
  `

  let currentGroup = ''

  toolbarButtons.forEach((btn) => {
    // Add separator between groups
    if (btn.group && btn.group !== currentGroup) {
      if (currentGroup !== '') {
        const separator = document.createElement('div')
        separator.style.cssText = `
          border-right: 1px solid #d1d5db;
          margin: 0 8px;
          height: 24px;
        `
        toolbar.appendChild(separator)
      }
      currentGroup = btn.group
    }

    const button = document.createElement('button')
    button.innerHTML = btn.label
    button.title = btn.title
    button.className = 'editor-toolbar-button'
    button.style.cssText = `
      padding: 8px 12px;
      border-radius: 4px;
      background: #e5e7eb;
      color: #1f2937;
      border: none;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
      font-weight: 500;
    `

    button.addEventListener('mousedown', (e) => {
      e.preventDefault()
      btn.command(editor)
    })

    // Update button state on selection/transaction change
    editor.on('selectionUpdate', () => {
      if (btn.isActive) {
        button.style.background = btn.isActive(editor) ? '#3b82f6' : '#e5e7eb'
        button.style.color = btn.isActive(editor) ? 'white' : '#1f2937'
      }
    })

    button.addEventListener('mouseover', () => {
      if (!btn.isActive || !btn.isActive(editor)) {
        button.style.background = '#d1d5db'
      }
    })

    button.addEventListener('mouseout', () => {
      button.style.background = btn.isActive && btn.isActive(editor) ? '#3b82f6' : '#e5e7eb'
    })

    toolbar.appendChild(button)
  })

  container.appendChild(toolbar)
}

/**
 * Create control panel with export/import buttons
 */
const createControlPanel = (container: HTMLElement, editor: Editor): void => {
  const panel = document.createElement('div')
  panel.className = 'editor-control-panel'
  panel.style.cssText = `
    background: white;
    border-bottom: 1px solid #d1d5db;
    padding: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  `

  const exportMarkdown = document.createElement('button')
  exportMarkdown.textContent = 'Copy Markdown'
  exportMarkdown.style.cssText = `
    padding: 8px 16px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  `
  exportMarkdown.addEventListener('click', () => {
    const markdown = editor.storage.markdown.getMarkdown()
    navigator.clipboard.writeText(markdown).then(() => {
      alert('Markdown copied to clipboard!')
    })
  })
  panel.appendChild(exportMarkdown)

  const exportHtml = document.createElement('button')
  exportHtml.textContent = 'Copy HTML'
  exportHtml.style.cssText = `
    padding: 8px 16px;
    background: #10b981;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  `
  exportHtml.addEventListener('click', () => {
    const html = editor.getHTML()
    navigator.clipboard.writeText(html).then(() => {
      alert('HTML copied to clipboard!')
    })
  })
  panel.appendChild(exportHtml)

  const exportJson = document.createElement('button')
  exportJson.textContent = 'Copy JSON'
  exportJson.style.cssText = `
    padding: 8px 16px;
    background: #a855f7;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  `
  exportJson.addEventListener('click', () => {
    const json = JSON.stringify(editor.getJSON(), null, 2)
    navigator.clipboard.writeText(json).then(() => {
      alert('JSON copied to clipboard!')
    })
  })
  panel.appendChild(exportJson)

  // Separator
  const separator = document.createElement('div')
  separator.style.cssText = 'border-left: 1px solid #d1d5db; height: 24px;'
  panel.appendChild(separator)

  const importFile = document.createElement('input')
  importFile.type = 'file'
  importFile.accept = '.md,.markdown,text/markdown'
  importFile.style.display = 'none'
  importFile.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      editor.chain().focus().setContent(content, 'markdown').run()
    }
    reader.readAsText(file)
  })
  panel.appendChild(importFile)

  const importButton = document.createElement('button')
  importButton.textContent = 'Import Markdown'
  importButton.style.cssText = `
    padding: 8px 16px;
    background: #f97316;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  `
  importButton.addEventListener('click', () => {
    importFile.click()
  })
  panel.appendChild(importButton)

  container.appendChild(panel)
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

export interface EditorContent {
  markdown: string
  html: string
  json: object
}

export const getContent = (editor: Editor): EditorContent => {
  return {
    markdown: editor.storage.markdown.getMarkdown(),
    html: editor.getHTML(),
    json: editor.getJSON(),
  }
}

export const downloadContent = (
  editor: Editor,
  format: 'markdown' | 'html' | 'json'
): void => {
  let content = ''
  let filename = `document.${format}`
  let mimeType = 'text/plain'

  const editorContent = getContent(editor)

  switch (format) {
    case 'markdown':
      content = editorContent.markdown
      filename = 'document.md'
      mimeType = 'text/markdown'
      break
    case 'html':
      content = editorContent.html
      filename = 'document.html'
      mimeType = 'text/html'
      break
    case 'json':
      content = JSON.stringify(editorContent.json, null, 2)
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
}

// ============================================================================
// INITIALIZATION FUNCTION
// ============================================================================

/**
 * Initialize the editor with toolbar and control panel
 * @param containerSelector CSS selector for editor container
 * @param initialContent Optional initial markdown content
 * @returns Editor instance for further manipulation
 */
export const initializeEditor = (
  containerSelector: string,
  initialContent?: string
): Editor => {
  const container = document.querySelector(containerSelector) as HTMLElement

  if (!container) {
    throw new Error(`Container element not found: ${containerSelector}`)
  }

  // Create wrapper
  const wrapper = document.createElement('div')
  wrapper.style.cssText = `
    display: flex;
    flex-direction: column;
    height: 100%;
    max-width: 900px;
    margin: 0 auto;
  `

  // Create editor element
  const editorElement = document.createElement('div')
  editorElement.className = 'editor-content'
  editorElement.style.cssText = `
    flex: 1;
    overflow: auto;
    border: 1px solid #d1d5db;
    border-top: none;
    border-radius: 0 0 4px 4px;
    padding: 16px;
    background: white;
  `

  // Initialize editor
  const editor = createEditor(editorElement, initialContent)

  // Build UI
  createControlPanel(wrapper, editor)
  createToolbar(wrapper, editor)
  wrapper.appendChild(editorElement)

  container.appendChild(wrapper)

  // Add localStorage persistence
  editor.on('update', () => {
    localStorage.setItem('tiptap-content', editor.storage.markdown.getMarkdown())
  })

  return editor
}

// ============================================================================
// HTML SETUP EXAMPLE
// ============================================================================

/*
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tiptap Markdown Editor</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f3f4f6;
      padding: 20px;
    }
    
    .container {
      width: 100%;
      height: 100vh;
    }
  </style>
</head>
<body>
  <div class="container" id="editor"></div>
  
  <script type="module">
    import { initializeEditor } from './editor.js'
    
    const savedContent = localStorage.getItem('tiptap-content')
    const editor = initializeEditor('#editor', savedContent)
  </script>
</body>
</html>
*/

export default { initializeEditor, createEditor, getContent, downloadContent }
