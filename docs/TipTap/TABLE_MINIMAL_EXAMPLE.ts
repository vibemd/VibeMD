/**
 * TABLE OPERATIONS - MINIMAL WORKING EXAMPLE
 * Copy and paste into your project - works immediately!
 */

// ============================================================================
// INSTALLATION REQUIRED
// ============================================================================

/*
npm install @tiptap/extension-table
npm install @tiptap/extension-table-row
npm install @tiptap/extension-table-header
npm install @tiptap/extension-table-cell
*/

// ============================================================================
// REACT - MINIMAL EXAMPLE
// ============================================================================

import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'

export function MinimalTableEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: '<p>Click Insert Table to start</p>',
  })

  if (!editor) return null

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Table Editor Example</h1>

      {/* Main Insert Button */}
      <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          marginBottom: '10px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        Insert Table
      </button>

      {/* Show table controls only when editing a table */}
      {editor.isActive('table') && (
        <div
          style={{
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: '#e3f2fd',
            border: '1px solid #90caf9',
            borderRadius: '4px',
          }}
        >
          <h3 style={{ marginTop: 0 }}>Table Controls</h3>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {/* Row Controls */}
            <button
              onClick={() => editor.chain().focus().addRowBefore().run()}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
              }}
            >
              Add Row Above
            </button>

            <button
              onClick={() => editor.chain().focus().addRowAfter().run()}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
              }}
            >
              Add Row Below
            </button>

            <button
              onClick={() => {
                if (confirm('Delete this row?')) {
                  editor.chain().focus().deleteRow().run()
                }
              }}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
              }}
            >
              Delete Row
            </button>

            {/* Column Controls */}
            <button
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
              }}
            >
              Add Column Left
            </button>

            <button
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
              }}
            >
              Add Column Right
            </button>

            <button
              onClick={() => {
                if (confirm('Delete this column?')) {
                  editor.chain().focus().deleteColumn().run()
                }
              }}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
              }}
            >
              Delete Column
            </button>

            {/* Delete Table */}
            <button
              onClick={() => {
                if (confirm('Delete entire table?')) {
                  editor.chain().focus().deleteTable().run()
                }
              }}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                backgroundColor: '#d32f2f',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                fontWeight: 'bold',
              }}
            >
              Delete Table
            </button>
          </div>
        </div>
      )}

      {/* Editor */}
      <div
        style={{
          border: '2px solid #ddd',
          borderRadius: '4px',
          padding: '15px',
          minHeight: '300px',
          backgroundColor: '#fff',
        }}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Instructions */}
      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
        }}
      >
        <h3>How to use:</h3>
        <ol>
          <li>Click "Insert Table" button above</li>
          <li>Click inside a table cell to edit</li>
          <li>Use the Table Controls to add/delete rows and columns</li>
          <li>The controls appear automatically when editing a table</li>
        </ol>
      </div>
    </div>
  )
}

// ============================================================================
// VANILLA JS - MINIMAL EXAMPLE
// ============================================================================

/*
<!DOCTYPE html>
<html>
<head>
  <title>Tiptap Table Editor</title>
  <style>
    body {
      font-family: sans-serif;
      padding: 20px;
    }
    .editor {
      border: 2px solid #ddd;
      padding: 15px;
      min-height: 300px;
      margin: 20px 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    table td, table th {
      border: 1px solid #ddd;
      padding: 8px;
    }
    button {
      padding: 8px 12px;
      margin: 5px;
      cursor: pointer;
      border: none;
      border-radius: 3px;
      background: #2196F3;
      color: white;
    }
    button:hover {
      background: #1976D2;
    }
    button.delete {
      background: #f44336;
    }
    button.delete:hover {
      background: #d32f2f;
    }
    .controls {
      padding: 10px;
      margin: 10px 0;
      background: #e3f2fd;
      border-radius: 4px;
      display: none;
    }
    .controls.active {
      display: block;
    }
  </style>
</head>
<body>
  <h1>Tiptap Table Editor</h1>
  
  <button id="insertTableBtn">Insert Table</button>
  
  <div class="controls" id="tableControls">
    <h3>Table Controls</h3>
    <button id="addRowBefore">Add Row Above</button>
    <button id="addRowAfter">Add Row Below</button>
    <button id="deleteRow" class="delete">Delete Row</button>
    <button id="addColumnBefore">Add Column Left</button>
    <button id="addColumnAfter">Add Column Right</button>
    <button id="deleteColumn" class="delete">Delete Column</button>
    <button id="deleteTable" class="delete">Delete Table</button>
  </div>
  
  <div id="editor" class="editor"></div>

  <script type="module">
    import { Editor } from '@tiptap/core'
    import StarterKit from '@tiptap/starter-kit'
    import Table from '@tiptap/extension-table'
    import TableRow from '@tiptap/extension-table-row'
    import TableHeader from '@tiptap/extension-table-header'
    import TableCell from '@tiptap/extension-table-cell'

    const editor = new Editor({
      element: document.getElementById('editor'),
      extensions: [
        StarterKit,
        Table.configure({ resizable: true }),
        TableRow,
        TableHeader,
        TableCell,
      ],
      content: '<p>Click Insert Table to start</p>',
    })

    // Insert table button
    document.getElementById('insertTableBtn').addEventListener('click', () => {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    })

    // Show/hide controls based on table active state
    editor.on('update', () => {
      const controls = document.getElementById('tableControls')
      if (editor.isActive('table')) {
        controls.classList.add('active')
      } else {
        controls.classList.remove('active')
      }
    })

    // Row operations
    document.getElementById('addRowBefore').addEventListener('click', () => {
      editor.chain().focus().addRowBefore().run()
    })
    document.getElementById('addRowAfter').addEventListener('click', () => {
      editor.chain().focus().addRowAfter().run()
    })
    document.getElementById('deleteRow').addEventListener('click', () => {
      if (confirm('Delete this row?')) {
        editor.chain().focus().deleteRow().run()
      }
    })

    // Column operations
    document.getElementById('addColumnBefore').addEventListener('click', () => {
      editor.chain().focus().addColumnBefore().run()
    })
    document.getElementById('addColumnAfter').addEventListener('click', () => {
      editor.chain().focus().addColumnAfter().run()
    })
    document.getElementById('deleteColumn').addEventListener('click', () => {
      if (confirm('Delete this column?')) {
        editor.chain().focus().deleteColumn().run()
      }
    })

    // Delete table
    document.getElementById('deleteTable').addEventListener('click', () => {
      if (confirm('Delete entire table?')) {
        editor.chain().focus().deleteTable().run()
      }
    })
  </script>
</body>
</html>
*/

// ============================================================================
// COMMANDS REFERENCE - Quick Lookup
// ============================================================================

/**
 * ROWS:
 * editor.chain().focus().addRowBefore().run()     // Add row above
 * editor.chain().focus().addRowAfter().run()      // Add row below
 * editor.chain().focus().deleteRow().run()        // Delete row
 *
 * COLUMNS:
 * editor.chain().focus().addColumnBefore().run()  // Add column left
 * editor.chain().focus().addColumnAfter().run()   // Add column right
 * editor.chain().focus().deleteColumn().run()     // Delete column
 *
 * CELLS:
 * editor.chain().focus().mergeCells().run()       // Merge selected cells
 * editor.chain().focus().splitCell().run()        // Split cell
 *
 * HEADERS:
 * editor.chain().focus().toggleHeaderRow().run()     // Toggle row as header
 * editor.chain().focus().toggleHeaderColumn().run()  // Toggle column as header
 * editor.chain().focus().toggleHeaderCell().run()    // Toggle cell as header
 *
 * TABLE:
 * editor.chain().focus().deleteTable().run()      // Delete entire table
 *
 * CHECK:
 * editor.isActive('table')                        // Is cursor in table?
 * editor.can().addRowBefore().run()               // Can add row above?
 */

// ============================================================================
// STEP-BY-STEP - What's happening
// ============================================================================

/**
 * HOW IT WORKS:
 *
 * 1. User inserts a table (3x3 with header)
 * 2. When cursor enters any cell, table controls become visible
 * 3. User can click buttons to modify the table:
 *    - Add rows above/below current position
 *    - Add columns left/right of current position
 *    - Delete current row or column
 *    - Delete entire table
 * 4. All operations affect the table structure
 * 5. Table automatically maintains consistency
 *
 * KEY INSIGHT:
 * The user must have cursor/selection IN the table for commands to work
 * This is why we check editor.isActive('table') before showing controls
 */

export { MinimalTableEditor }
