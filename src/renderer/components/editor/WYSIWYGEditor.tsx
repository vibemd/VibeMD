import { useEffect, useRef } from 'react';
import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { Editor, rootCtx, editorViewCtx, parserCtx, serializerCtx } from '@milkdown/core';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { commonmark } from '@milkdown/preset-commonmark';
import { gfm } from '@milkdown/preset-gfm';
import { history } from '@milkdown/plugin-history';
import { clipboard } from '@milkdown/plugin-clipboard';
import { cursor } from '@milkdown/plugin-cursor';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { trailing } from '@milkdown/plugin-trailing';
import { nord } from '@milkdown/theme-nord';

function MilkdownEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const markAsModified = useDocumentStore((state) => state.markAsModified);
  const settings = useSettingsStore((state) => state.settings);
  const editorRef = useRef<Editor | null>(null);

  const { get } = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        
        // Listen for markdown changes
        ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
          if (activeDocument && markdown !== prevMarkdown) {
            updateDocument(activeDocument.id, { content: markdown });
            markAsModified(activeDocument.id);
          }
        });
      })
      .use(nord)
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(clipboard)
      .use(cursor)
      .use(listener)
      .use(trailing)
  );

  // Update editor content when document changes
  useEffect(() => {
    if (activeDocument && get()) {
      const editor = get();
      if (editor && editor.action) {
        editor.action((ctx) => {
          const view = ctx.get(editorViewCtx);
          const parser = ctx.get(parserCtx);
          
          try {
            const doc = parser(activeDocument.content);
            const tr = view.state.tr.replaceWith(0, view.state.doc.content.size, doc.content);
            view.dispatch(tr);
          } catch (error) {
            console.error('Error parsing markdown:', error);
          }
        });
      }
    }
  }, [activeDocument?.id, get]);

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
    <div className="flex-1 flex flex-col">
      <div className="flex-1" style={{ padding: '1rem' }}>
        <Milkdown />
      </div>
    </div>
  );
}

export function WYSIWYGEditor() {
  return (
    <MilkdownProvider>
      <MilkdownEditor />
    </MilkdownProvider>
  );
}
