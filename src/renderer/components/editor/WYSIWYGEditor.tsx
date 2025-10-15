import { useEffect, useRef } from 'react';
import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { Editor, rootCtx, editorViewOptionsCtx } from '@milkdown/core';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { commonmark } from '@milkdown/preset-commonmark';
import { gfm } from '@milkdown/preset-gfm';
import { history } from '@milkdown/plugin-history';
import { clipboard } from '@milkdown/plugin-clipboard';
import { cursor } from '@milkdown/plugin-cursor';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { trailing } from '@milkdown/plugin-trailing';
import { nord } from '@milkdown/theme-nord';

const MilkdownEditor = () => {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const markAsModified = useDocumentStore((state) => state.markAsModified);
  const settings = useSettingsStore((state) => state.settings);

  const { get } = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(editorViewOptionsCtx, {
          attributes: {
            style: `font-size: ${settings?.editor?.fontSize ?? 14}px; font-family: ${settings?.editor?.fontFamily ?? 'system-ui'};`,
          },
        });
        ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
          if (activeDocument && markdown !== prevMarkdown) {
            updateDocument(activeDocument.id, { content: markdown });
            markAsModified(activeDocument.id);
          }
        });
      })
      .use(nord())
      .use(commonmark())
      .use(gfm())
      .use(history())
      .use(clipboard())
      .use(cursor())
      .use(listener())
      .use(trailing())
  );

  useEffect(() => {
    if (activeDocument && get()) {
      const editor = get();
      if (editor && editor.action) {
        editor.action((ctx) => {
          const view = ctx.get(editorViewOptionsCtx);
          // Load content into editor
          editor.action((ctx) => {
            const view = ctx.get(editorViewOptionsCtx);
            if (view && view.state) {
              const tr = view.state.tr.replaceWith(0, view.state.doc.content.size, view.state.schema.text(activeDocument.content));
              view.dispatch(tr);
            }
          });
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
    <div className="flex-1" style={{ padding: '1rem' }}>
      <Milkdown />
    </div>
  );
};

export function WYSIWYGEditor() {
  return (
    <MilkdownProvider>
      <MilkdownEditor />
    </MilkdownProvider>
  );
}
