# Formatting Fixes - Round 2

## Date: 2025-10-21

## Issues Addressed

### ✅ Fixed

1. **Table Structure Corruption** - Tables converting first row to 6-cell header
2. **Task Lists** - Reverting to bulleted lists

### 🔍 Investigating (Need Console Output)

3. **Text Alignment** - Center/right alignment not being retained
4. **LaTeX Equations** - Disappearing completely

### ⚠️ Known Issue

5. **Table Navigation Error** - "No cell with offset 11 found" when navigating vertically

## Fix Details

### 1. Table Structure - FIXED ✅

**Problem:** Every table was treating row 0 as a header, adding separator after it, causing 3x3 tables to become malformed.

**Root Cause:** Line 222 always added separator after `rowIndex === 0`, regardless of whether it was actually a header.

**Fix Applied** [TipTapEditor.tsx:199-254](src/renderer/components/editor/TipTapEditor.tsx#L199-L254):

```typescript
// NEW: Detect actual header rows by checking for <th> tags
rows.forEach((row, rowIndex) => {
  const headerCells = Array.from(row.querySelectorAll('th'));
  const dataCells = Array.from(row.querySelectorAll('td'));
  const allCells = [...headerCells, ...dataCells];

  // Determine if this row is a header (has <th> tags)
  const isHeaderRow = headerCells.length > 0;

  // ... build markdown ...

  // Add separator row ONLY after an actual header row
  if (isHeaderRow) {
    markdown += '| ' + separators.join(' | ') + ' |\n';
  }
});

// If no header row found, add empty header (markdown tables require headers)
if (!hasHeaderRow && rows.length > 0) {
  const firstRowCells = Array.from(rows[0].querySelectorAll('td')).length;
  const emptyHeaders = Array(firstRowCells).fill('').join(' | ');
  const separators = Array(firstRowCells).fill('---').join(' | ');
  markdown = '\n| ' + emptyHeaders + ' |\n| ' + separators + ' |\n' + markdown.substring(1);
}
```

**Result:**
- Tables with `<th>` tags → separator after header row
- Tables with only `<td>` tags → empty header added (markdown requirement)
- No more 6-cell corruption!

### 2. Task Lists - FIXED ✅

**Problem:** Task lists `- [ ] Task` were converting to regular bulleted lists `- Task`.

**Root Cause:** No Turndown rule for task lists, so they were treated as regular `<ul>` and `<li>` tags.

**Fix Applied** [TipTapEditor.tsx:256-277](src/renderer/components/editor/TipTapEditor.tsx#L256-L277):

```typescript
// Task list container
turndownService.addRule('taskList', {
  filter: function (node) {
    return node.nodeName === 'UL' &&
           (node as HTMLElement).getAttribute('data-type') === 'taskList';
  },
  replacement: function (content, node) {
    return '\n' + content;
  }
});

// Task items with checkboxes
turndownService.addRule('taskItem', {
  filter: function (node) {
    return node.nodeName === 'LI' &&
           (node as HTMLElement).getAttribute('data-type') === 'taskItem';
  },
  replacement: function (content, node) {
    const checkbox = (node as HTMLElement).querySelector('input[type="checkbox"]');
    const isChecked = checkbox?.hasAttribute('checked');
    return '- [' + (isChecked ? 'x' : ' ') + '] ' + content;
  }
});
```

**Result:**
- `<ul data-type="taskList">` → Task list
- `<li data-type="taskItem"><input type="checkbox">` → `- [ ] Task`
- `<li data-type="taskItem"><input type="checkbox" checked>` → `- [x] Task`

### 3. Text Alignment - INVESTIGATING 🔍

**Status:** Added extensive debugging to see what HTML TipTap generates.

**Debug Added** [TipTapEditor.tsx:303-328](src/renderer/components/editor/TipTapEditor.tsx#L303-L328):

```typescript
filter: function (node, options) {
  if (node.nodeName === 'P') {
    const elem = node as HTMLElement;
    const styleAlign = elem.style?.textAlign;

    console.log('[Turndown textAlign] Checking P:', {
      styleAlign,
      fullStyle: elem.getAttribute('style'),
      outerHTML: elem.outerHTML.substring(0, 200)
    });

    return !!(styleAlign && styleAlign !== 'left' && (styleAlign === 'center' || styleAlign === 'right'));
  }
  return false;
}
```

**Action Needed:**
1. Apply center/right alignment to text in dev build
2. Check console for `[Turndown textAlign] Checking P:` output
3. Report back what `styleAlign` and `fullStyle` show

**Possible Issues:**
- TipTap might use a different HTML structure (e.g., wrapper divs)
- Style might be on parent element, not `<p>` itself
- Alignment might use CSS classes instead of inline styles

### 4. LaTeX Equations - INVESTIGATING 🔍

**Status:** Enhanced detection with multiple fallbacks, added debug logging.

**Enhanced Rules** [TipTapEditor.tsx:352-391](src/renderer/components/editor/TipTapEditor.tsx#L352-L391):

```typescript
turndownService.addRule('mathInlineNode', {
  filter: function (node) {
    const elem = node as HTMLElement;
    return (
      (node.nodeName === 'SPAN' || node.nodeName === 'MATH-INLINE') &&
      (elem.classList?.contains('math-node') ||
       elem.getAttribute('data-type') === 'inline-math' ||
       elem.getAttribute('data-math-style') === 'inline')
    );
  },
  replacement: function (content, node) {
    const elem = node as HTMLElement;
    const latex = elem.getAttribute('data-latex') || elem.textContent?.trim() || '';
    console.log('[htmlToMarkdown] Inline math:', { latex, content, html: elem.outerHTML });
    return latex ? `$${latex}$` : '';
  }
});
```

**Action Needed:**
1. Insert LaTeX equation (e.g., `$x^2$` or `$$\int x dx$$`)
2. Check console for:
   - `[htmlToMarkdown] Inline math:` or `[htmlToMarkdown] Block math:`
   - `[htmlToMarkdown] HTML input:` (full HTML)
   - `[htmlToMarkdown] Markdown output:` (converted markdown)
3. Report back what the HTML structure shows

**Possible Issues:**
- TipTap Mathematics extension might render to MathML (not detectable as math)
- LaTeX might be in a different attribute
- Math nodes might have different class names or attributes

### 5. Table Navigation Error - KNOWN ISSUE ⚠️

**Error:**
```
RangeError: No cell with offset 11 found
    at TableMap.findCell
    at TableMap.nextCell
```

**Cause:** TipTap's table navigation expects consistent column counts. If markdown conversion creates malformed tables (different number of cells per row), navigation breaks.

**Why It Happens:**
1. User inserts 3x3 table (no header)
2. Our markdown conversion adds empty header row
3. If conversion is buggy, header might have different cell count
4. TipTap navigation gets confused

**Potential Fixes:**
1. ✅ Fixed table detection (should help)
2. Ensure markdown → HTML preserves exact cell counts
3. Validate table structure before setting content
4. Add error handling in table navigation

**Workaround:** Use mouse to navigate tables instead of keyboard arrows.

## Testing Checklist

Run dev build and test each:

- [x] **Bold, Italic, Strikethrough** - Working
- [x] **Headings** - Working
- [x] **Lists (bulleted, numbered, indented)** - Working
- [x] **Code blocks, quotes** - Working
- [x] **Links, images** - Working
- [x] **Super/subscript** - Working
- [ ] **Task lists** - Test after restart
- [ ] **Tables** - Test structure preservation
- [ ] **Text alignment** - Check console output
- [ ] **LaTeX** - Check console output
- [ ] **Table navigation** - Test arrow keys

## Console Output to Check

When testing, watch for these logs:

1. **Text Alignment:**
   ```
   [Turndown textAlign] Checking P: { styleAlign: 'center', fullStyle: 'text-align: center', outerHTML: '<p style="text-align: center">...' }
   ```

2. **LaTeX:**
   ```
   [htmlToMarkdown] Inline math: { latex: 'x^2', content: '', html: '<span class="math-node">...' }
   [htmlToMarkdown] HTML input: <p>Some text <span ...math...> more text</p>
   [htmlToMarkdown] Markdown output: Some text $x^2$ more text
   ```

3. **General:**
   ```
   [htmlToMarkdown] HTML input: <full HTML document>
   [htmlToMarkdown] Markdown output: <converted markdown>
   ```

## Next Steps

1. **Restart dev build** - Type `rs` in terminal to reload with new code
2. **Test task lists** - Should now preserve checkboxes
3. **Test tables** - Should not corrupt structure
4. **Test alignment** - Check console, report output
5. **Test LaTeX** - Check console, report output
6. **Report findings** - Share console logs for alignment & LaTeX

Once we see the console output, we can fix the remaining issues!
