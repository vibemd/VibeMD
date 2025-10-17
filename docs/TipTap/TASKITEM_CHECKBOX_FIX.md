# TipTap TaskItem Checkbox Issue - Troubleshooting Guide

## Problem
When implementing a Task item, text appears under the checkbox instead of next to it, suggesting an erroneous carriage return is being inserted after the checkbox.

## Root Cause
The paragraph wrapper is being rendered as a **block-level element**, which pushes the text down even though it's nested inside the taskItem. This causes unwanted line breaks between the checkbox and the text.

---

## Solutions

### Option 1: Use Inline Content Instead of Paragraph (Recommended ✓)

Remove the paragraph wrapper and insert text directly:

```typescript
editor?.chain().focus().insertContent({
  type: 'taskList',
  content: [
    {
      type: 'taskItem',
      attrs: { checked: false },
      content: [
        { type: 'text', text: 'Your task text here' }  // Direct text, no paragraph
      ],
    },
  ],
}).run()
```

**Advantages:**
- Cleanest solution
- Text renders inline with checkbox
- No extra DOM nesting

---

### Option 2: Configure TaskItem to Accept Inline Content Only

Update your TaskItem extension configuration:

```typescript
import { TaskItem } from '@tiptap/extension-list'

const editor = new Editor({
  extensions: [
    StarterKit,
    TaskList,
    TaskItem.configure({
      nested: true,
      // Only allow inline content
    }).extend({
      content: 'text*', // Direct text nodes only
    }),
  ],
})
```

---

### Option 3: CSS Fix - Force Paragraph to Display Inline

If you need to keep the paragraph wrapper for other reasons:

```css
.task-item-custom p {
  display: inline;
  margin: 0;
  padding: 0;
  line-height: 1;
}

.task-item-custom p:first-child {
  display: inline; /* Ensure first paragraph stays inline */
}
```

---

### Option 4: Check Your Schema Configuration

Make sure your TaskItem extension allows text nodes directly:

```typescript
TaskItem.extend({
  content: 'text*', // Allows direct text content
})
```

Or with more flexibility for formatted text:

```typescript
TaskItem.extend({
  content: '(text | hardBreak)*', // Text with optional line breaks
})
```

---

## Quick Comparison

| Option | Effort | Result | Best For |
|--------|--------|--------|----------|
| Option 1 | Minimal | ✓ Inline text | Most cases |
| Option 2 | Low | ✓ Inline text | Custom configs |
| Option 3 | Very Low | ~ Workaround | Legacy code |
| Option 4 | Low | ✓ Flexible | Complex content |

---

## Implementation Example

### Full Example with Insertion Function

```typescript
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TaskList } from '@tiptap/extension-list'
import { TaskItem } from '@tiptap/extension-list'

export function TaskEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
  })

  const addTask = (taskText: string) => {
    editor?.chain().focus().insertContent({
      type: 'taskList',
      content: [
        {
          type: 'taskItem',
          attrs: { checked: false },
          content: [
            { type: 'text', text: taskText },  // Inline text
          ],
        },
      ],
    }).run()
  }

  return (
    <div>
      <button onClick={() => addTask('New task')}>Add Task</button>
      <EditorContent editor={editor} />
    </div>
  )
}
```

---

## Testing

After implementing your fix:

1. Add a new task via your insertion function
2. Verify text appears **next to** the checkbox
3. No carriage return should appear after the checkbox
4. Text should be on the same line as the checkbox

If the issue persists after trying **Option 1**, check:
- Editor CSS for any `display: block` rules on task items
- Browser DevTools to inspect actual rendered HTML structure
- Whether `hardBreak` is being inadvertently inserted
