# Critical Fix: Zustand Store Reactivity Issue

## Date: 2025-10-21

## Problem

Documents were not retaining unsaved formatting when switching between open documents. The content would revert to the original saved state or show content from a different document.

## Root Cause: Broken Zustand Subscriptions

The issue was **NOT** with the store itself, but with **how components were subscribing to the store**.

### The Broken Pattern

```typescript
// ❌ BROKEN - Component won't re-render when document content changes!
const activeDocument = useDocumentStore((state) => state.getActiveDocument());
```

### Why This Breaks

When you do `state.getActiveDocument()`, you're calling a function that uses `get()` internally:

```typescript
// In documentStore.ts
getActiveDocument: () => {
  const state = get();  // ❌ This hides the actual state from Zustand!
  if (!state.activeDocumentId) return null;
  return state.documents.get(state.activeDocumentId) || null;
}
```

**The problem:**
- Zustand doesn't know what state the selector depends on
- The selector returns the **result** of calling `getActiveDocument()`
- Zustand can't track `state.documents` or `state.activeDocumentId` because they're accessed via `get()`
- **Result:** Component doesn't re-render when document content changes!

### The Sequence of Failure

1. User types in Document A → content updates in store
2. Component's selector `state.getActiveDocument()` is called
3. Zustand doesn't detect that `state.documents` changed
4. Component doesn't re-render
5. **User switches to Document B → sees stale content from Document A!**

## The Fix

### Correct Pattern

```typescript
// ✅ CORRECT - Component re-renders when document content changes!
const activeDocument = useDocumentStore((state) => {
  if (!state.activeDocumentId) return null;
  return state.documents.get(state.activeDocumentId) || null;
});
```

**Why this works:**
- The selector directly accesses `state.documents` and `state.activeDocumentId`
- Zustand can track these dependencies
- When either changes, the component re-renders
- **Result:** Always shows current document content!

## Files Fixed

### 1. [src/renderer/components/editor/TipTapEditor.tsx](src/renderer/components/editor/TipTapEditor.tsx#L61-L67)

**Before:**
```typescript
const activeDocument = useDocumentStore((state) => state.getActiveDocument());
```

**After:**
```typescript
// IMPORTANT: Subscribe to the actual state, not the getter function
// This ensures the component re-renders when document content changes
const activeDocument = useDocumentStore((state) => {
  if (!state.activeDocumentId) return null;
  return state.documents.get(state.activeDocumentId) || null;
});
```

### 2. [src/renderer/components/sidebar/OutlineTab.tsx](src/renderer/components/sidebar/OutlineTab.tsx#L8-L14)

**Before:**
```typescript
const activeDocument = useDocumentStore((state) =>
  state.getActiveDocument()
);
```

**After:**
```typescript
// IMPORTANT: Subscribe to the actual state, not the getter function
// This ensures the component re-renders when document content changes
const activeDocument = useDocumentStore((state) => {
  if (!state.activeDocumentId) return null;
  return state.documents.get(state.activeDocumentId) || null;
});
```

### 3. [src/renderer/components/layout/StatusBar.tsx](src/renderer/components/layout/StatusBar.tsx#L6-L12)

**Before:**
```typescript
const activeDocument = useDocumentStore((state) =>
  state.getActiveDocument()
);
```

**After:**
```typescript
// IMPORTANT: Subscribe to the actual state, not the getter function
// This ensures the component re-renders when document content changes
const activeDocument = useDocumentStore((state) => {
  if (!state.activeDocumentId) return null;
  return state.documents.get(state.activeDocumentId) || null;
});
```

### 4. [src/renderer/components/layout/Toolbar.tsx](src/renderer/components/layout/Toolbar.tsx)

**No change needed** - Toolbar uses `getActiveDocument` correctly:
```typescript
const { getActiveDocument } = useDocumentStore();  // Destructure the function

// Use it in event handlers (one-time calls, not reactive)
const handleSave = async () => {
  const doc = getActiveDocument();  // ✅ OK for event handlers
  // ...
}
```

This is fine because it's called **inside event handlers**, not used for reactive rendering.

## Understanding Zustand Selectors

### How Zustand Tracks Dependencies

Zustand uses **shallow equality checks** on the selector's return value:

```typescript
// Zustand internally does something like:
const currentValue = selector(state);
if (currentValue !== previousValue) {
  triggerReRender();
}
```

But it also tracks **which state properties you access** in the selector:

```typescript
// ✅ Zustand knows you're using state.documents and state.activeDocumentId
const activeDocument = useDocumentStore((state) => {
  return state.documents.get(state.activeDocumentId);
});

// ❌ Zustand only sees you're calling state.getActiveDocument
// It doesn't know getActiveDocument uses state.documents and state.activeDocumentId
const activeDocument = useDocumentStore((state) => state.getActiveDocument());
```

### The Golden Rule

**Never call functions that use `get()` inside a selector!**

❌ **Bad:**
```typescript
const value = useStore((state) => state.someFunction());  // If someFunction uses get()
```

✅ **Good:**
```typescript
const value = useStore((state) => state.someProperty);  // Direct property access
const value = useStore((state) => {                     // Direct state access
  // Compute derived value using state properties
  return computeSomething(state.prop1, state.prop2);
});
```

✅ **Also Good:**
```typescript
const someFunction = useStore((state) => state.someFunction);  // Get the function
const result = someFunction();  // Call it outside the selector
```

## Testing

### Test Case 1: Unsaved Changes Persist
1. Open Document A
2. Type: "# This is document A"
3. Type: "Some content here"
4. **Don't save**
5. Switch to Document B
6. Type: "# This is document B"
7. Switch back to Document A
8. **Expected:** See "# This is document A\n\nSome content here"
9. **Before fix:** Saw original empty content or Document B's content
10. **After fix:** ✅ Unsaved changes persist!

### Test Case 2: Outline Updates
1. Create new document
2. Type: "# Heading 1"
3. **Expected:** Outline shows "Heading 1"
4. Add: "## Heading 2"
5. **Expected:** Outline shows both headings
6. **Before fix:** Outline stayed empty or didn't update
7. **After fix:** ✅ Outline updates in real-time!

### Test Case 3: Status Bar Updates
1. Type in document
2. **Expected:** Word count updates in status bar
3. **Before fix:** Word count didn't update until you switched documents
4. **After fix:** ✅ Word count updates immediately!

## Performance Impact

**None!** The fix actually improves performance:

- **Before:** Components were making unnecessary re-renders in some cases
- **After:** Components only re-render when their actual dependencies change

The selector function is lightweight (just property access), so there's no performance cost.

## Why `getActiveDocument` Exists

You might ask: "Why have `getActiveDocument()` if we can't use it in selectors?"

**Answer:** It's useful for **imperative code** (event handlers, one-time calls):

```typescript
// ✅ Good use of getActiveDocument - in event handler
const handleSave = async () => {
  const doc = getActiveDocument();  // One-time call, not reactive
  if (!doc) return;
  await saveDocument(doc);
};
```

But for **reactive rendering**, always access state directly in the selector.

## Prevention: Lint Rule

Consider adding this ESLint rule (custom):

```javascript
// Warn when calling functions in Zustand selectors
{
  "no-function-calls-in-zustand-selectors": "error"
}
```

Or add a comment in the store:

```typescript
export const useDocumentStore = create<DocumentStore>((set, get) => ({
  // WARNING: Don't use getActiveDocument in useDocumentStore selectors!
  // Instead, access state.documents.get(state.activeDocumentId) directly
  getActiveDocument: () => {
    // ...
  }
}));
```

## Related Bugs Fixed

This fix also resolved:
1. ✅ Outline not populating with headings
2. ✅ Status bar not updating word count
3. ✅ File switching losing unsaved changes
4. ✅ Editor reverting to original content

All stemmed from the same Zustand subscription issue!

## Lesson Learned

**Zustand selectors must directly access state properties, not call functions that use `get()`.**

This is a subtle but critical distinction that can cause hard-to-debug reactivity issues.
