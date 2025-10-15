import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { EditorView, basicSetup } from 'codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorState } from '@codemirror/state';
import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';

export function SplitEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const markAsModified = useDocumentStore((state) => state.markAsModified);
  const settings = useSettingsStore((state) => state.settings);
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const handleChange = (value: string) => {
    if (activeDocument) {
      updateDocument(activeDocument.id, { content: value });
      markAsModified(activeDocument.id);
    }
  };

  useEffect(() => {
    if (!editorRef.current || !activeDocument) return;

    const startState = EditorState.create({
      doc: activeDocument.content,
      extensions: [
        basicSetup,
        markdown(),
        EditorView.theme({
          '&': { fontSize: `${settings?.editor?.fontSize ?? 14}px` },
          '.cm-content': { 
            fontFamily: settings?.editor?.fontFamily ?? 'SF Mono, Monaco, Inconsolata, Roboto Mono, Source Code Pro, monospace',
            padding: '1rem',
            lineHeight: '1.5'
          },
          '.cm-editor': { height: '100%' },
          '.cm-scroller': { fontFamily: 'inherit' },
          '.cm-focused': { outline: 'none' },
        }),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newContent = update.state.doc.toString();
            handleChange(newContent);
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [activeDocument?.id]);

  useEffect(() => {
    if (viewRef.current && activeDocument) {
      const currentContent = viewRef.current.state.doc.toString();
      if (currentContent !== activeDocument.content) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: viewRef.current.state.doc.length,
            insert: activeDocument.content,
          },
        });
      }
    }
  }, [activeDocument?.content]);

  if (!activeDocument) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p style={{ color: 'hsl(var(--muted-foreground))' }}>No document selected</p>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Left Pane: Plain Text Editor */}
      <div className="w-1/2 border-r bg-background">
        <div ref={editorRef} className="h-full" />
      </div>
      
      {/* Right Pane: HTML Preview */}
      <div className="w-1/2 p-4 overflow-auto bg-background">
        <div 
          className="prose prose-sm max-w-none"
          style={{
            fontSize: `${settings?.editor?.fontSize ?? 14}px`,
            fontFamily: settings?.editor?.fontFamily ?? 'system-ui',
          }}
        >
          <ReactMarkdown
            remarkPlugins={[
              remarkGfm,  // GFM support (Phase 2)
              remarkMath  // LaTeX support (Phase 3)
            ]}
            rehypePlugins={[
              rehypeKatex  // LaTeX rendering (Phase 3)
            ]}
          >
            {activeDocument.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}