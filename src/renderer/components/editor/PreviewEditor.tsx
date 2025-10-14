import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useEffect, useState } from 'react';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

export function PreviewEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const settings = useSettingsStore((state) => state.settings);
  const [htmlContent, setHtmlContent] = useState('');

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

  return (
    <div className="flex-1" style={{ padding: '2rem' }}>
      <div 
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        style={{
          fontSize: `${settings?.editor?.fontSize ?? 14}px`,
          fontFamily: settings?.editor?.fontFamily ?? 'system-ui',
        }}
      />
    </div>
  );
}