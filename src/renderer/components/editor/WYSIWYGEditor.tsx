import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { useEffect } from 'react';

export function WYSIWYGEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const markAsModified = useDocumentStore((state) => state.markAsModified);
  const settings = useSettingsStore((state) => state.settings);

  const { get } = useEditor((root) => {
    const editor = Editor.make()
      .use(commonmark)
      .config((ctx) => {
        ctx.set(rootCtx, root);
        if (activeDocument) {
          ctx.set(defaultValueCtx, activeDocument.content);
        }
      });

    return editor;
  }, [activeDocument?.id]);

  useEffect(() => {
    if (!activeDocument) return;

    const editor = get();
    if (!editor) return;

    // Listen for content changes
    const listener = () => {
      const markdown = editor.action((ctx) => {
        const editorView = ctx.get('editorViewCtx') as any;
        return editorView.state.doc.textContent;
      });

      if (markdown !== activeDocument.content) {
        updateDocument(activeDocument.id, { content: markdown });
        markAsModified(activeDocument.id);
      }
    };

    // Add listener
    editor.action((ctx) => {
      const editorView = ctx.get('editorViewCtx') as any;
      editorView.dom.addEventListener('input', listener);
    });

    return () => {
      // Cleanup
    };
  }, [activeDocument, get, updateDocument, markAsModified]);

  if (!activeDocument) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div style={{ textAlign: 'center' }} className="space-y-4">
          <div style={{ fontSize: '3.75rem', color: 'hsl(var(--muted-foreground))' }}>📝</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'hsl(var(--muted-foreground))' }}>No document open</h2>
          <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>Create or open a document to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <MilkdownProvider>
        <Milkdown />
      </MilkdownProvider>
    </div>
  );
}
