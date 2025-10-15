import { useEffect, useState, useRef } from 'react';
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
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Convert markdown to HTML for display
  useEffect(() => {
    if (activeDocument?.content && !isEditing) {
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
  }, [activeDocument?.content, isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (activeDocument && editorRef.current) {
      const newContent = editorRef.current.textContent || '';
      if (newContent !== activeDocument.content) {
        updateDocument(activeDocument.id, { content: newContent });
        markAsModified(activeDocument.id);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertHTML', false, '<br>');
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
        {isEditing ? (
          <div
            ref={editorRef}
            contentEditable
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="prose prose-sm max-w-none outline-none min-h-full"
            style={{
              fontSize: `${settings?.editor?.fontSize ?? 14}px`,
              fontFamily: settings?.editor?.fontFamily ?? 'system-ui',
              minHeight: '100%',
            }}
            suppressContentEditableWarning={true}
          >
            {activeDocument.content}
          </div>
        ) : (
          <div
            onDoubleClick={handleDoubleClick}
            className="prose prose-sm max-w-none cursor-text hover:bg-muted/20 transition-colors rounded p-2"
            style={{
              fontSize: `${settings?.editor?.fontSize ?? 14}px`,
              fontFamily: settings?.editor?.fontFamily ?? 'system-ui',
              minHeight: '100%',
            }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
        {!isEditing && (
          <div className="text-xs text-muted-foreground mt-2 text-center">
            Double-click to edit
          </div>
        )}
      </div>
    </div>
  );
}
