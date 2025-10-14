import { useEffect, useState } from 'react';
import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

export function WYSIWYGEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const markAsModified = useDocumentStore((state) => state.markAsModified);
  const settings = useSettingsStore((state) => state.settings);
  const [htmlContent, setHtmlContent] = useState('');

  // Convert markdown to HTML for display
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

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (activeDocument) {
      const newContent = e.currentTarget.textContent || '';
      updateDocument(activeDocument.id, { content: newContent });
      markAsModified(activeDocument.id);
    }
  };

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
        <div 
          contentEditable
          onInput={handleInput}
          className="prose prose-sm max-w-none outline-none"
          style={{
            fontSize: `${settings?.editor?.fontSize ?? 14}px`,
            fontFamily: settings?.editor?.fontFamily ?? 'system-ui',
            minHeight: '100%',
          }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}
