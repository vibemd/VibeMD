import { useDocumentStore } from '@/stores/documentStore';

export function SplitEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const updateDocument = useDocumentStore((state) => state.updateDocument);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (activeDocument) {
      updateDocument(activeDocument.id, { content: e.target.value });
    }
  };

  if (!activeDocument) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p style={{ color: 'hsl(var(--muted-foreground))' }}>No document selected</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex">
      {/* Code Editor */}
      <div className="flex-1" style={{ padding: '1rem', borderRight: '1px solid hsl(var(--border))' }}>
        <textarea
          value={activeDocument.content}
          onChange={handleChange}
          placeholder="Start typing your markdown here..."
          className="w-full h-full resize-none border-none outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
          style={{ fontFamily: 'monospace' }}
        />
      </div>
      
      {/* Preview */}
      <div className="flex-1" style={{ padding: '1rem' }}>
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap text-sm">
            {activeDocument.content}
          </pre>
        </div>
      </div>
    </div>
  );
}