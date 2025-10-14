import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useEffect, useState } from 'react';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

export function SplitEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const markAsModified = useDocumentStore((state) => state.markAsModified);
  const settings = useSettingsStore((state) => state.settings);
  const [htmlContent, setHtmlContent] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (activeDocument) {
      updateDocument(activeDocument.id, { content: e.target.value });
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
        <textarea
          value={activeDocument.content}
          onChange={handleChange}
          placeholder="Start typing your markdown here..."
          className="w-full h-full resize-none border-none outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
          style={{ 
            fontFamily: settings?.editor?.fontFamily ?? 'monospace',
            fontSize: `${settings?.editor?.fontSize ?? 14}px`,
            lineHeight: '1.5',
          }}
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