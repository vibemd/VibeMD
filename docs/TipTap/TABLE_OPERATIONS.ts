/**
 * TIPTAP TABLE OPERATIONS - Complete Implementation
 * Row & Column Insert/Delete with Context Menu
 * 
 * Tiptap native commands:
 * - addRowBefore() / addRowAfter()
 * - deleteRow()
 * - addColumnBefore() / addColumnAfter()
 * - deleteColumn()
 * - deleteTable()
 * - mergeCells()
 * - splitCell()
 */

import { Editor } from '@tiptap/core'

// ============================================================================
// TABLE COMMANDS - Direct Usage
// ============================================================================

/**
 * These are the native Tiptap table commands
 * User must have cursor/selection in a table cell to use them
 */

export const TableCommands = {
  // ROW OPERATIONS
  addRowBefore: (editor: Editor) => {
    editor.chain().focus().addRowBefore().run()
  },

  addRowAfter: (editor: Editor) => {
    editor.chain().focus().addRowAfter().run()
  },

  deleteRow: (editor: Editor) => {
    editor.chain().focus().deleteRow().run()
  },

  // COLUMN OPERATIONS
  addColumnBefore: (editor: Editor) => {
    editor.chain().focus().addColumnBefore().run()
  },

  addColumnAfter: (editor: Editor) => {
    editor.chain().focus().addColumnAfter().run()
  },

  deleteColumn: (editor: Editor) => {
    editor.chain().focus().deleteColumn().run()
  },

  // CELL OPERATIONS
  mergeCells: (editor: Editor) => {
    editor.chain().focus().mergeCells().run()
  },

  splitCell: (editor: Editor) => {
    editor.chain().focus().splitCell().run()
  },

  // HEADER OPERATIONS
  toggleHeaderRow: (editor: Editor) => {
    editor.chain().focus().toggleHeaderRow().run()
  },

  toggleHeaderColumn: (editor: Editor) => {
    editor.chain().focus().toggleHeaderColumn().run()
  },

  toggleHeaderCell: (editor: Editor) => {
    editor.chain().focus().toggleHeaderCell().run()
  },

  // TABLE OPERATIONS
  deleteTable: (editor: Editor) => {
    if (confirm('Delete entire table?')) {
      editor.chain().focus().deleteTable().run()
    }
  },
}

// ============================================================================
// CAN CHECK - Verify if command is available
// ============================================================================

/**
 * Check if a command can be executed (cursor must be in table)
 * Use .can() to check without executing
 */

export const TableCanCommands = {
  canAddRowBefore: (editor: Editor): boolean => {
    return editor.can().addRowBefore().run()
  },

  canAddRowAfter: (editor: Editor): boolean => {
    return editor.can().addRowAfter().run()
  },

  canDeleteRow: (editor: Editor): boolean => {
    return editor.can().deleteRow().run()
  },

  canAddColumnBefore: (editor: Editor): boolean => {
    return editor.can().addColumnBefore().run()
  },

  canAddColumnAfter: (editor: Editor): boolean => {
    return editor.can().addColumnAfter().run()
  },

  canDeleteColumn: (editor: Editor): boolean => {
    return editor.can().deleteColumn().run()
  },

  canMergeCells: (editor: Editor): boolean => {
    return editor.can().mergeCells().run()
  },

  canSplitCell: (editor: Editor): boolean => {
    return editor.can().splitCell().run()
  },

  canDeleteTable: (editor: Editor): boolean => {
    return editor.isActive('table')
  },
}

// ============================================================================
// CONTEXT MENU - Appears when clicking in table cell
// ============================================================================

/**
 * Build context menu for table operations
 * Show different options based on what's available
 */

export interface TableContextMenuItem {
  id: string
  label: string
  icon: string
  command: () => void
  canExecute: boolean
  group: 'rows' | 'columns' | 'cells' | 'headers' | 'table'
}

export const getTableContextMenu = (editor: Editor): TableContextMenuItem[] => {
  // Only show if cursor is in a table
  if (!editor.isActive('table')) {
    return []
  }

  return [
    // Row Operations
    {
      id: 'add-row-before',
      label: 'Insert Row Above',
      icon: '↑ Row',
      command: () => TableCommands.addRowBefore(editor),
      canExecute: TableCanCommands.canAddRowBefore(editor),
      group: 'rows',
    },
    {
      id: 'add-row-after',
      label: 'Insert Row Below',
      icon: '↓ Row',
      command: () => TableCommands.addRowAfter(editor),
      canExecute: TableCanCommands.canAddRowAfter(editor),
      group: 'rows',
    },
    {
      id: 'delete-row',
      label: 'Delete Row',
      icon: '✕ Row',
      command: () => TableCommands.deleteRow(editor),
      canExecute: TableCanCommands.canDeleteRow(editor),
      group: 'rows',
    },

    // Column Operations
    {
      id: 'add-column-before',
      label: 'Insert Column Left',
      icon: '← Col',
      command: () => TableCommands.addColumnBefore(editor),
      canExecute: TableCanCommands.canAddColumnBefore(editor),
      group: 'columns',
    },
    {
      id: 'add-column-after',
      label: 'Insert Column Right',
      icon: '→ Col',
      command: () => TableCommands.addColumnAfter(editor),
      canExecute: TableCanCommands.canAddColumnAfter(editor),
      group: 'columns',
    },
    {
      id: 'delete-column',
      label: 'Delete Column',
      icon: '✕ Col',
      command: () => TableCommands.deleteColumn(editor),
      canExecute: TableCanCommands.canDeleteColumn(editor),
      group: 'columns',
    },

    // Cell Operations
    {
      id: 'merge-cells',
      label: 'Merge Cells',
      icon: 'Merge',
      command: () => TableCommands.mergeCells(editor),
      canExecute: TableCanCommands.canMergeCells(editor),
      group: 'cells',
    },
    {
      id: 'split-cell',
      label: 'Split Cell',
      icon: 'Split',
      command: () => TableCommands.splitCell(editor),
      canExecute: TableCanCommands.canSplitCell(editor),
      group: 'cells',
    },

    // Header Operations
    {
      id: 'toggle-header-row',
      label: 'Toggle Header Row',
      icon: 'TH Row',
      command: () => TableCommands.toggleHeaderRow(editor),
      canExecute: true,
      group: 'headers',
    },
    {
      id: 'toggle-header-column',
      label: 'Toggle Header Column',
      icon: 'TH Col',
      command: () => TableCommands.toggleHeaderColumn(editor),
      canExecute: true,
      group: 'headers',
    },
    {
      id: 'toggle-header-cell',
      label: 'Toggle Header Cell',
      icon: 'TH Cell',
      command: () => TableCommands.toggleHeaderCell(editor),
      canExecute: true,
      group: 'headers',
    },

    // Table Operations
    {
      id: 'delete-table',
      label: 'Delete Table',
      icon: '✕ Table',
      command: () => TableCommands.deleteTable(editor),
      canExecute: TableCanCommands.canDeleteTable(editor),
      group: 'table',
    },
  ]
}

// ============================================================================
// REACT CONTEXT MENU COMPONENT
// ============================================================================

/**
 * React component for table context menu
 * Shows when user is editing a table cell
 */

import React, { useState, useCallback } from 'react'
import { Editor } from '@tiptap/core'

interface TableContextMenuProps {
  editor: Editor | null
  isOpen: boolean
  onClose: () => void
  position?: { x: number; y: number }
}

export const TableContextMenu: React.FC<TableContextMenuProps> = ({
  editor,
  isOpen,
  onClose,
  position = { x: 0, y: 0 },
}) => {
  if (!editor || !isOpen) return null

  const items = getTableContextMenu(editor)
  if (items.length === 0) return null

  // Group items by category
  const groupedItems = items.reduce(
    (acc, item) => {
      if (!acc[item.group]) acc[item.group] = []
      acc[item.group].push(item)
      return acc
    },
    {} as Record<string, TableContextMenuItem[]>
  )

  const handleMenuItemClick = (item: TableContextMenuItem) => {
    if (!item.canExecute) return
    item.command()
    onClose()
  }

  return (
    <div
      className="fixed bg-white border border-gray-300 rounded shadow-lg z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        minWidth: '200px',
      }}
    >
      {/* Rows */}
      {groupedItems.rows && (
        <>
          <div className="px-4 py-2 text-xs font-bold text-gray-600 border-b">
            Rows
          </div>
          {groupedItems.rows.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuItemClick(item)}
              disabled={!item.canExecute}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                !item.canExecute ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {item.label}
            </button>
          ))}
        </>
      )}

      {/* Columns */}
      {groupedItems.columns && (
        <>
          <div className="px-4 py-2 text-xs font-bold text-gray-600 border-b">
            Columns
          </div>
          {groupedItems.columns.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuItemClick(item)}
              disabled={!item.canExecute}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                !item.canExecute ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {item.label}
            </button>
          ))}
        </>
      )}

      {/* Cells */}
      {groupedItems.cells && (
        <>
          <div className="px-4 py-2 text-xs font-bold text-gray-600 border-b">
            Cells
          </div>
          {groupedItems.cells.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuItemClick(item)}
              disabled={!item.canExecute}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                !item.canExecute ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {item.label}
            </button>
          ))}
        </>
      )}

      {/* Headers */}
      {groupedItems.headers && (
        <>
          <div className="px-4 py-2 text-xs font-bold text-gray-600 border-b">
            Headers
          </div>
          {groupedItems.headers.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuItemClick(item)}
              disabled={!item.canExecute}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                !item.canExecute ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {item.label}
            </button>
          ))}
        </>
      )}

      {/* Table */}
      {groupedItems.table && (
        <>
          <div className="px-4 py-2 text-xs font-bold text-gray-600 border-b border-red-300">
            Table
          </div>
          {groupedItems.table.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuItemClick(item)}
              disabled={!item.canExecute}
              className={`w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 ${
                !item.canExecute ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {item.label}
            </button>
          ))}
        </>
      )}
    </div>
  )
}

// ============================================================================
// TABLE OPERATIONS TOOLBAR
// ============================================================================

/**
 * Dedicated toolbar for table operations
 * Shows only when cursor is in a table
 */

interface TableToolbarProps {
  editor: Editor | null
}

export const TableToolbar: React.FC<TableToolbarProps> = ({ editor }) => {
  if (!editor || !editor.isActive('table')) {
    return null
  }

  const ToolButton = ({
    onClick,
    disabled,
    label,
    title,
  }: {
    onClick: () => void
    disabled: boolean
    label: string
    title: string
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-3 py-2 rounded text-sm ${
        disabled
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="bg-blue-50 border border-blue-300 rounded p-3 mb-4">
      <div className="text-sm font-bold text-blue-900 mb-3">Table Operations</div>

      <div className="space-y-2">
        {/* Row Operations */}
        <div className="flex gap-2">
          <ToolButton
            onClick={() => TableCommands.addRowBefore(editor)}
            disabled={!TableCanCommands.canAddRowBefore(editor)}
            label="Insert Row Above"
            title="Insert a row above the current row"
          />
          <ToolButton
            onClick={() => TableCommands.addRowAfter(editor)}
            disabled={!TableCanCommands.canAddRowAfter(editor)}
            label="Insert Row Below"
            title="Insert a row below the current row"
          />
          <ToolButton
            onClick={() => TableCommands.deleteRow(editor)}
            disabled={!TableCanCommands.canDeleteRow(editor)}
            label="Delete Row"
            title="Delete the current row"
          />
        </div>

        {/* Column Operations */}
        <div className="flex gap-2">
          <ToolButton
            onClick={() => TableCommands.addColumnBefore(editor)}
            disabled={!TableCanCommands.canAddColumnBefore(editor)}
            label="Insert Column Left"
            title="Insert a column to the left"
          />
          <ToolButton
            onClick={() => TableCommands.addColumnAfter(editor)}
            disabled={!TableCanCommands.canAddColumnAfter(editor)}
            label="Insert Column Right"
            title="Insert a column to the right"
          />
          <ToolButton
            onClick={() => TableCommands.deleteColumn(editor)}
            disabled={!TableCanCommands.canDeleteColumn(editor)}
            label="Delete Column"
            title="Delete the current column"
          />
        </div>

        {/* Cell Operations */}
        <div className="flex gap-2">
          <ToolButton
            onClick={() => TableCommands.mergeCells(editor)}
            disabled={!TableCanCommands.canMergeCells(editor)}
            label="Merge Cells"
            title="Merge selected cells"
          />
          <ToolButton
            onClick={() => TableCommands.splitCell(editor)}
            disabled={!TableCanCommands.canSplitCell(editor)}
            label="Split Cell"
            title="Split the current cell"
          />
        </div>

        {/* Header Operations */}
        <div className="flex gap-2">
          <ToolButton
            onClick={() => TableCommands.toggleHeaderRow(editor)}
            disabled={false}
            label="Header Row"
            title="Toggle current row as header"
          />
          <ToolButton
            onClick={() => TableCommands.toggleHeaderColumn(editor)}
            disabled={false}
            label="Header Column"
            title="Toggle current column as header"
          />
        </div>

        {/* Delete Table */}
        <div className="flex gap-2">
          <button
            onClick={() => TableCommands.deleteTable(editor)}
            className="px-3 py-2 rounded text-sm bg-red-500 text-white hover:bg-red-600"
            title="Delete the entire table"
          >
            Delete Table
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// BUBBLE MENU - Context menu inside editor (Optional)
// ============================================================================

/**
 * Use with @tiptap/extension-bubble-menu for automatic positioning
 * 
 * Install: npm install @tiptap/extension-bubble-menu
 * 
 * Usage in editor:
 * extensions: [
 *   BubbleMenu,
 *   // ... other extensions
 * ]
 * 
 * In JSX:
 * <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
 *   <TableToolbar editor={editor} />
 * </BubbleMenu>
 */

export const TableBubbleMenuContent: React.FC<TableToolbarProps> = ({ editor }) => {
  if (!editor || !editor.isActive('table')) {
    return null
  }

  return (
    <div className="flex gap-1 bg-white rounded shadow-lg border border-gray-300 p-2">
      <button
        onClick={() => TableCommands.addRowBefore(editor)}
        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        title="Add row above"
      >
        ↑ Row
      </button>
      <button
        onClick={() => TableCommands.addRowAfter(editor)}
        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        title="Add row below"
      >
        ↓ Row
      </button>
      <button
        onClick={() => TableCommands.deleteRow(editor)}
        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
        title="Delete row"
      >
        ✕ Row
      </button>

      <div className="border-l border-gray-300 mx-1"></div>

      <button
        onClick={() => TableCommands.addColumnBefore(editor)}
        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        title="Add column left"
      >
        ← Col
      </button>
      <button
        onClick={() => TableCommands.addColumnAfter(editor)}
        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        title="Add column right"
      >
        → Col
      </button>
      <button
        onClick={() => TableCommands.deleteColumn(editor)}
        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
        title="Delete column"
      >
        ✕ Col
      </button>

      <div className="border-l border-gray-300 mx-1"></div>

      <button
        onClick={() => TableCommands.deleteTable(editor)}
        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
        title="Delete table"
      >
        Del Table
      </button>
    </div>
  )
}

export default {
  TableCommands,
  TableCanCommands,
  getTableContextMenu,
  TableContextMenu,
  TableToolbar,
  TableBubbleMenuContent,
}
