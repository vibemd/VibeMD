# Task List Fix - Round 3

## Problem Identified

From the console output, I can see that when markdown is converted to HTML, task lists don't have the `data-type` attributes:

**Current (broken):**
```html
<ul>
<li><input checked="" disabled="" type="checkbox"> Completed task</li>
<li><input disabled="" type="checkbox"> Incomplete task</li>
</ul>
```

**Needed (for Turndown to work):**
```html
<ul data-type="taskList">
<li data-type="taskItem"><input checked="" disabled="" type="checkbox"> Completed task</li>
<li data-type="taskItem"><input disabled="" type="checkbox"> Incomplete task</li>
</ul>
```

## Root Cause

The `marked` library (markdown parser) converts `- [ ] task` to HTML with checkboxes, but doesn't add TipTap-specific `data-type` attributes. Our Turndown rules look for these attributes to convert back to markdown.

## Fix Applied

Added post-processing to `markdownToHtml()` function [TipTapEditor.tsx:165-179](src/renderer/components/editor/TipTapEditor.tsx#L165-L179):

```typescript
// Fix task lists - add data-type attributes for TipTap
finalHtml = finalHtml.replace(/<ul>\s*<li><input[^>]*type="checkbox"[^>]*>/gi, (match) => {
  if (match.includes('data-type="taskList"')) return match;
  return '<ul data-type="taskList"><li data-type="taskItem"><input type="checkbox">';
});

// Fix remaining task list items in the same list
finalHtml = finalHtml.replace(/<li><input([^>]*)type="checkbox"([^>]*)>/gi, (match, before, after) => {
  if (match.includes('data-type="taskItem"')) return match;
  return `<li data-type="taskItem"><input${before}type="checkbox"${after}>`;
});
```

## Testing Required

1. **Reload the app** - Type `rs` in terminal or restart
2. **Edit a task** in the sample markdown file (sections 5 or 15)
3. **Switch to another document**
4. **Switch back**
5. **Check console for:**
   - `[htmlToMarkdown] HTML input:` - should show `data-type="taskList"` and `data-type="taskItem"`
   - `[htmlToMarkdown] Markdown output:` - should show `- [ ]` and `- [x]` format

## Expected Result

Task lists should now:
- ✅ Retain checkbox state when switching documents
- ✅ Convert properly: `- [ ] Task` for unchecked, `- [x] Task` for checked
- ✅ Not revert to bulleted lists
- ✅ Not have text appear below bullets

## LaTeX & Alignment Status

From the console, I can see LaTeX is working in markdown → HTML:
```html
<span data-type="inline-math" data-latex="E = mc^2"></span>
```

But I need to see the `[htmlToMarkdown]` logs to check if it's converting back correctly. **Please scroll down in the console and look for those logs after you edit something.**
