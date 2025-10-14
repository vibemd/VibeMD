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
      <div className="test-flex-1 test-flex test-items-center test-justify-center">
        <p style={{ color: 'hsl(var(--muted-foreground))' }}>No document selected</p>
      </div>
    );
  }

  return (
    <div className="test-flex-1 test-flex">
      {/* Code Editor */}
      <div className="test-flex-1" style={{ padding: '1rem', borderRight: '1px solid hsl(var(--border))' }}>
        <textarea
          value={activeDocument.content}
          onChange={handleChange}
          placeholder="Start typing your markdown here..."
          className="test-w-full test-h-full test-resize-none test-border-none test-outline-none test-bg-transparent test-text-foreground placeholder:test-text-muted-foreground"
          style={{ fontFamily: 'monospace' }}
        />
      </div>
      
      {/* Preview */}
      <div className="test-flex-1" style={{ padding: '1rem' }}>
        <div className="test-prose test-prose-sm test-max-w-none">
          <pre className="test-whitespace-pre-wrap test-text-sm">
            {activeDocument.content}
          </pre>
        </div>
      </div>
    </div>
  );
}