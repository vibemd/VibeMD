# Markdown Conversion Fixes - Formatting Retention

## Date: 2025-10-21

## Issues Fixed

The `htmlToMarkdown` function in TipTapEditor was missing Turndown rules for several formatting types, causing them to be lost when documents were saved or switched.

### Formatting That Was Lost

1. ❌ **Headings** - Reverted to normal text
2. ❌ **Strikethrough** - Lost formatting
3. ❌ **Superscript/Subscript** - Lost formatting
4. ❌ **Text alignment** (center/right) - Lost alignment
5. ❌ **LaTeX equations** - Disappeared entirely
6. ❌ **Table structure** - Corrupted (header row expanded to 6 cells)

### Formatting That Worked

✅ Bold, Italics, Inline code
✅ Bulleted and numbered lists (including indenting)
✅ Quotes, Code blocks
✅ Links, Images

## Root Cause

Turndown Service (HTML → Markdown converter) needs explicit rules for each formatting type. Without rules, it strips the formatting and returns plain text.

## Fixes Applied

### 1. Strikethrough Support

**Added:**
```typescript
turndownService.addRule('strikethrough', {
  filter: ['del', 's', 'strike'],
  replacement: function (content) {
    return '~~' + content + '~~';
  }
});
```

**Result:** `<del>text</del>` → `~~text~~`

### 2. Superscript/Subscript Support

**Added:**
```typescript
turndownService.addRule('superscript', {
  filter: 'sup',
  replacement: function (content) {
    return '<sup>' + content + '</sup>';
  }
});

turndownService.addRule('subscript', {
  filter: 'sub',
  replacement: function (content) {
    return '<sub>' + content + '</sub>';
  }
});
```

**Result:** Preserves HTML tags in markdown (markdown doesn't have native super/subscript)

### 3. Heading Alignment Support

**Fixed:**
```typescript
turndownService.addRule('headingWithAlignment', {
  filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  replacement: function (content, node, options) {
    const hLevel = parseInt(node.nodeName.charAt(1));
    const hPrefix = '#'.repeat(hLevel);
    const align = (node as HTMLElement).style?.textAlign;

    // If heading has alignment, wrap in div
    if (align && align !== 'left' && (align === 'center' || align === 'right')) {
      return `<div style="text-align: ${align}">${hPrefix} ${content}</div>\n\n`;
    }

    // Default heading
    return hPrefix + ' ' + content + '\n\n';
  }
});
```

**Problem:** The previous `textAlign` rule matched ALL headings, not just aligned ones.
**Solution:** Separate rule that only wraps headings with explicit alignment.

### 4. Text Alignment Support (Improved)

**Fixed:**
```typescript
turndownService.addRule('textAlign', {
  filter: function (node, options) {
    // Only match p tags with explicit text-align style
    if (node.nodeName === 'P') {
      const align = (node as HTMLElement).style?.textAlign;
      return !!(align && align !== 'left' && (align === 'center' || align === 'right'));
    }
    return false;
  },
  replacement: function (content, node) {
    const align = (node as HTMLElement).style?.textAlign;
    return `<div style="text-align: ${align}">${content}</div>\n\n`;
  }
});
```

**Problem:** Rule was matching ALL paragraphs and headings, corrupting the output.
**Solution:** Only match paragraphs with explicit center/right alignment.

### 5. LaTeX Math Support (Enhanced)

**Fixed:**
```typescript
// TipTap Mathematics extension uses specific class names and attributes
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
    return latex ? `$${latex}$` : '';
  }
});

turndownService.addRule('mathDisplayNode', {
  filter: function (node) {
    const elem = node as HTMLElement;
    return (
      (node.nodeName === 'DIV' || node.nodeName === 'MATH-DISPLAY') &&
      (elem.classList?.contains('math-node') ||
       elem.getAttribute('data-type') === 'block-math' ||
       elem.getAttribute('data-math-style') === 'display')
    );
  },
  replacement: function (content, node) {
    const elem = node as HTMLElement;
    const latex = elem.getAttribute('data-latex') || elem.textContent?.trim() || '';
    return latex ? `\n$$${latex}$$\n\n` : '';
  }
});
```

**Problem:** Rules weren't matching TipTap's Mathematics extension HTML structure.
**Solution:**
- Added check for `math-node` class (TipTap's class)
- Added fallback to textContent if data-latex attribute isn't present
- Added logging to debug what HTML structure is actually generated

### 6. Table Structure Issue

**Status:** Investigating

The table issue (3x3 table becoming 6-cell header + 2 rows of 3 cells) is likely caused by:
- The table rule always treating row 0 as a header
- TipTap inserting tables without a header row by default

**Current table rule:**
```typescript
// Add separator row after header row with alignment
if (rowIndex === 0) {
  const separators = cells.map(cell => {
    const align = (cell as HTMLElement).style.textAlign;
    switch (align) {
      case 'center': return ':---:';
      case 'right': return '---:';
      default: return '---';
    }
  });
  markdown += '| ' + separators.join(' | ') + ' |\n';
}
```

**Problem:** Always adds separator after first row, treating it as a header.
**Solution:** Need to detect if row contains `<th>` (table header) vs `<td>` (table data) cells.

## Testing Required

With the dev build running, test:

1. **Headings:** Create `# H1`, `## H2`, `### H3` → switch docs → verify headings persist
2. **Strikethrough:** Type text, apply strikethrough → switch docs → verify formatting
3. **Alignment:** Center or right-align text/headings → switch docs → verify alignment
4. **Super/Subscript:** Type H₂O (subscript), E=mc² (superscript) → switch docs → verify
5. **LaTeX:**
   - Inline: Type `$x^2 + y^2 = z^2$` → switch docs → verify
   - Block: Type `$$\int_0^\infty e^{-x^2} dx$$` → switch docs → verify
6. **Tables:** Insert 3x3 table → verify structure doesn't corrupt

## Debug Logging Added

To help diagnose issues, added extensive logging:

```typescript
console.log('[htmlToMarkdown] HTML input:', html);
console.log('[htmlToMarkdown] Markdown output:', markdown);
console.log('[htmlToMarkdown] Inline math:', { latex, content, html: elem.outerHTML });
console.log('[htmlToMarkdown] Block math:', { latex, content, html: elem.outerHTML });
```

Check the browser DevTools console to see:
- What HTML TipTap generates
- What markdown Turndown produces
- Whether math nodes are being detected

## Next Steps

1. **Test in dev build** - See console output to verify rules are working
2. **Inspect HTML structure** - Use DevTools to see actual TipTap output
3. **Fix table rule** - Detect header rows properly
4. **Remove debug logging** - Once everything works
5. **Package for Windows** - Test on both platforms

## Files Changed

- **[src/renderer/components/editor/TipTapEditor.tsx:239-345](src/renderer/components/editor/TipTapEditor.tsx#L239-L345)** - Added/fixed Turndown rules

## Notes

- Markdown doesn't have native superscript/subscript, so we preserve HTML tags
- Alignment uses HTML `<div style="text-align">` wrappers (not pure markdown)
- LaTeX uses `$...$` for inline and `$$...$$` for display math
- The Mathematics extension might render to MathML or keep LaTeX, needs testing
