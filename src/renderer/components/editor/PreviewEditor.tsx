import { useDocumentStore } from '@/stores/documentStore';

export function PreviewEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());

  if (!activeDocument) {
    return (
      <div className="test-flex-1 test-flex test-items-center test-justify-center">
        <p style={{ color: 'hsl(var(--muted-foreground))' }}>No document selected</p>
      </div>
    );
  }

  return (
    <div className="test-flex-1" style={{ padding: '2rem' }}>
      <div className="test-prose test-prose-sm test-max-w-none">
        <pre className="test-whitespace-pre-wrap test-text-sm">
          {activeDocument.content}
        </pre>
      </div>
    </div>
  );
}