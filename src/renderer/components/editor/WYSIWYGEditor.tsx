import { useEffect, useRef } from 'react';
import { useDocumentStore } from '@/stores/documentStore';

export function WYSIWYGEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current && activeDocument) {
      textareaRef.current.value = activeDocument.content;
    }
  }, [activeDocument]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (activeDocument) {
      updateDocument(activeDocument.id, { content: e.target.value });
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
        <textarea
          ref={textareaRef}
          value={activeDocument.content}
          onChange={handleChange}
          placeholder="Start typing your markdown here..."
          className="w-full h-full resize-none border-none outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
          style={{ fontFamily: 'monospace' }}
        />
      </div>
    </div>
  );
}
