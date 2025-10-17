# TABLE OPERATIONS - IMPLEMENTATION SUMMARY

## What Tiptap Provides (Native Commands)

Tiptap has **built-in native commands** for table manipulation. You don't need to build anything from scratch - just call these commands when the cursor is in a table:

### Available Commands

| Operation | Command | What It Does |
|-----------|---------|-------------|
| **Add Row Above** | `editor.chain().focus().addRowBefore().run()` | Insert row above cursor position |
| **Add Row Below** | `editor.chain().focus().addRowAfter().run()` | Insert row below cursor position |
| **Delete Row** | `editor.chain().focus().deleteRow().run()` | Remove current row |
| **Add Column Left** | `editor.chain().focus().addColumnBefore().run()` | Insert column to the left |
| **Add Column Right** | `editor.chain().focus().addColumnAfter().run()` | Insert column to the right |
| **Delete Column** | `editor.chain().focus().deleteColumn().run()` | Remove current column |
| **Delete Table** | `editor.chain().focus().deleteTable().run()` | Remove entire table |
| **Merge Cells** | `editor.chain().focus().mergeCells().run()` | Combine selected cells |
| **Split Cell** | `editor.chain().focus().splitCell().run()` | Divide a cell into two |
| **Toggle Header Row** | `editor.chain().focus().toggleHeaderRow().run()` | Make/unmake row a header |
| **Toggle Header Column** | `editor.chain().focus().toggleHeaderColumn().run()` | Make/unmake column a header |

---

## Key Requirement

**The cursor MUST be inside a table cell** for these commands to work.

Check this with:
```typescript
if (editor.isActive('table')) {
  // User is editing a table, show table controls
}
```

---

## Files I've Created For You

### 1. **TABLE_OPERATIONS.ts** ⭐ START HERE
Complete implementation with:
- `TableCommands` object - Direct command execution
- `TableCanCommands` object - Check if commands are available
- `getTableContextMenu()` - Build context menu
- `TableContextMenu` React component - Right-click menu
- `TableToolbar` React component - Always-visible toolbar
- `TableBubbleMenuContent` React component - Floating menu

**Use This For:** Full-featured implementation with all UI components

### 2. **TABLE_OPERATIONS_INTEGRATION.ts**
How to integrate table operations into your editor:
- React integration example
- Vanilla JS integration example
- Right-click context menu setup
- Toolbar button setup
- BubbleMenu setup
- Complete working example
- API reference
- UX best practices

**Use This For:** Understanding how to add it to existing code

### 3. **TABLE_MINIMAL_EXAMPLE.ts** ⭐ QUICKEST START
Copy-paste ready minimal example:
- React version with buttons
- Vanilla JS version with HTML/CSS
- Instructions and step-by-step
- Quick reference of all commands

**Use This For:** Getting something working in 2 minutes

---

## Implementation Approaches

### Approach 1: Toolbar (Simplest)
Show a toolbar with buttons that only appears when editing a table:

```typescript
{editor.isActive('table') && (
  <div>
    <button onClick={() => editor.chain().focus().addRowBefore().run()}>
      Add Row Above
    </button>
    <button onClick={() => editor.chain().focus().addRowAfter().run()}>
      Add Row Below
    </button>
    {/* ... more buttons ... */}
  </div>
)}
```

**Pros:** Simple, always visible, easy to discover
**Cons:** Takes up space only when editing tables

### Approach 2: Context Menu (Right-Click)
Show a menu when user right-clicks on a table cell:

```typescript
editor.view.dom.addEventListener('contextmenu', (e) => {
  if (editor.isActive('table')) {
    e.preventDefault()
    // Show context menu
  }
})
```

**Pros:** Clean UI, traditional, expected behavior
**Cons:** Less discoverable for new users

### Approach 3: BubbleMenu (Auto-Positioning)
Use Tiptap's built-in BubbleMenu that appears near the cursor:

```typescript
<BubbleMenu editor={editor} shouldShow={({ editor }) => editor.isActive('table')}>
  {/* Table controls here */}
</BubbleMenu>
```

**Pros:** Auto-positioned, follows cursor, professional
**Cons:** Requires BubbleMenu extension

---

## Quick Start - 30 Seconds

### For React:

```typescript
import { MinimalTableEditor } from './TABLE_MINIMAL_EXAMPLE'

export default MinimalTableEditor
```

### For Vanilla JS:

Copy the HTML example from `TABLE_MINIMAL_EXAMPLE.ts` into your HTML file.

---

## Integration Steps

### Step 1: Install extensions
```bash
npm install @tiptap/extension-table
npm install @tiptap/extension-table-row
npm install @tiptap/extension-table-header
npm install @tiptap/extension-table-cell
```

### Step 2: Add to editor config
```typescript
const editor = useEditor({
  extensions: [
    StarterKit,
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
  ],
})
```

### Step 3: Add UI for table operations
Choose one approach:
- **Toolbar** - Show buttons when table is active
- **Context Menu** - Right-click on cells
- **BubbleMenu** - Auto-positioned menu

### Step 4: Connect buttons to commands
```typescript
<button onClick={() => editor.chain().focus().addRowBefore().run()}>
  Add Row Above
</button>
```

---

## How Selection Works

When user clicks a cell, that cell becomes the "current" cell:

- `addRowBefore()` adds a row above the **current row** (where cursor is)
- `addColumnBefore()` adds a column before the **current column** (where cursor is)
- `deleteRow()` deletes the **current row** (where cursor is)
- `deleteColumn()` deletes the **current column** (where cursor is)

**User doesn't need to select** - just click in a cell and the operation affects that cell's row/column.

---

## UX Recommendations

### ✅ DO:

1. **Show controls only when editing a table**
   - Reduces UI clutter
   - Use `editor.isActive('table')` to check

2. **Group related operations**
   - Row operations together
   - Column operations together
   - Table operations separately (maybe in red)

3. **Provide visual feedback**
   - Highlight buttons for available commands
   - Use `.can()` to check if command available
   - Gray out/disable unavailable commands

4. **Add keyboard shortcuts**
   - Ctrl+Alt+↑ = Add row above
   - Ctrl+Alt+↓ = Add row below
   - Ctrl+Alt+← = Add column left
   - Ctrl+Alt+→ = Add column right

5. **Confirm destructive operations**
   - `if (confirm('Delete this row?'))` before deleteRow()
   - `if (confirm('Delete table?'))` before deleteTable()

6. **Show help text**
   - Use tooltips on buttons
   - Show status message when editing table
   - Hint about right-click context menu

### ❌ DON'T:

1. Show table controls when not in a table
2. Let users delete table without confirmation
3. Make it unclear what each button does
4. Bury table operations deep in menus
5. Forget about keyboard users

---

## Example User Flow

```
1. User clicks "Insert Table" button
   → Table with 3 rows, 3 cols appears

2. User clicks inside a cell
   → Table toolbar appears
   → User sees row/column operation buttons

3. User clicks "Add Row Below"
   → New row appears below current row

4. User clicks "Add Column Right"
   → New column appears to the right

5. User clicks "Delete Table" with confirmation
   → Entire table is removed
   → Table toolbar disappears
```

---

## Testing Checklist

- [ ] Can insert a table
- [ ] Can add row above current position
- [ ] Can add row below current position
- [ ] Can delete a row
- [ ] Can add column to the left
- [ ] Can add column to the right
- [ ] Can delete a column
- [ ] Can delete entire table
- [ ] Table controls only show when editing table
- [ ] Confirmation appears before deleting table
- [ ] All commands work from different cell positions
- [ ] Keyboard shortcuts work (if implemented)
- [ ] Context menu works (if implemented)

---

## Troubleshooting

### Commands don't work
- **Check:** Is cursor inside a table cell?
- **Fix:** Cursor must be in table for commands to execute
- **Verify:** `editor.isActive('table')` returns true

### Table controls not showing
- **Check:** Are you checking `editor.isActive('table')`?
- **Fix:** Show controls when this condition is true
- **Debug:** Console log `editor.isActive('table')` when clicking

### Can't delete row/column
- **Check:** Is cursor in that cell?
- **Fix:** Click in cell of row/column you want to delete
- **Note:** Command deletes row/column of current cursor position

### Buttons disabled/grayed out
- **Check:** Are you using `.can()` to check availability?
- **Fix:** Only disable if `.can()[command]().run()` returns false
- **Note:** Some commands may not be available in certain states

---

## Files Reference

| File | Purpose | Best For |
|------|---------|----------|
| TABLE_OPERATIONS.ts | Complete implementation | Production use |
| TABLE_OPERATIONS_INTEGRATION.ts | Integration guide | Understanding setup |
| TABLE_MINIMAL_EXAMPLE.ts | Minimal working example | Quick start |
| TABLE_OPERATIONS.ts | Core functions | Reference |

---

## Next Steps

1. **Choose your approach:**
   - Toolbar (simplest)
   - Context Menu (traditional)
   - BubbleMenu (professional)

2. **Copy example code:**
   - Use `TABLE_MINIMAL_EXAMPLE.ts` to start
   - Or `TABLE_OPERATIONS.ts` for full features

3. **Customize to your needs:**
   - Change button labels/icons
   - Adjust styling
   - Add keyboard shortcuts
   - Implement your preferred approach

4. **Test thoroughly:**
   - Try all operations
   - Test from different positions
   - Verify keyboard shortcuts work

---

## Summary

Tiptap provides **native, built-in commands** for:
✓ Adding/deleting rows  
✓ Adding/deleting columns  
✓ Merging/splitting cells  
✓ Managing headers  
✓ Deleting tables  

You just need to:
1. Put them in buttons/menu
2. Check if cursor is in table (`editor.isActive('table')`)
3. Call the command when button clicked

I've provided **3 complete implementations** ready to use!
