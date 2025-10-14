import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';
import { useEffect, useState } from 'react';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

export function SplitEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const markAsModified = useDocumentStore((state) => state.markAsModified);
  const settings = useSettingsStore((state) => state.settings);
  const [htmlContent, setHtmlContent] = useState('');

  const handleChange = (value: string) => {
    if (activeDocument) {
      updateDocument(activeDocument.id, { content: value });
      markAsModified(activeDocument.id);
    }
  };

  // Convert markdown to HTML
  useEffect(() => {
    if (activeDocument?.content) {
      remark()
        .use(remarkHtml)
        .process(activeDocument.content)
        .then((result) => {
          setHtmlContent(String(result));
        })
        .catch((error) => {
          console.error('Error converting markdown to HTML:', error);
          setHtmlContent(activeDocument.content);
        });
    }
  }, [activeDocument?.content]);

  if (!activeDocument) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p style={{ color: 'hsl(var(--muted-foreground))' }}>No document selected</p>
      </div>
    );
  }

  const showLineNumbers = settings?.editor?.lineNumbers ?? true;

  return (
    <div className="flex-1 flex">
      {/* Code Editor */}
      <div className="flex-1" style={{ padding: '1rem', borderRight: '1px solid hsl(var(--border))' }}>
        <CodeMirror
          value={activeDocument.content}
          onChange={handleChange}
          extensions={[
            markdown(),
            EditorView.theme({
              '&': {
                fontSize: `${settings?.editor?.fontSize ?? 14}px`,
                fontFamily: settings?.editor?.fontFamily ?? 'monospace',
              },
              '.cm-content': {
                padding: '1rem',
              },
              '.cm-editor': {
                height: '100%',
              },
              '.cm-scroller': {
                fontFamily: settings?.editor?.fontFamily ?? 'monospace',
              },
            }),
            ...(showLineNumbers ? [EditorView.lineWrapping] : []),
          ]}
          basicSetup={{
            lineNumbers: showLineNumbers,
            foldGutter: true,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            highlightSelectionMatches: false,
          }}
          placeholder="Start typing your markdown here..."
        />
      </div>
      
      {/* Preview */}
      <div className="flex-1" style={{ padding: '1rem' }}>
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          style={{
            fontSize: `${settings?.editor?.fontSize ?? 14}px`,
            fontFamily: settings?.editor?.fontFamily ?? 'system-ui',
          }}
        />
      </div>
    </div>
  );
}