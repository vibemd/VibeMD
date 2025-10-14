import { useDocumentStore } from '@/stores/documentStore';

export function PreviewEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());

  if (!activeDocument) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p style={{ color: 'hsl(var(--muted-foreground))' }}>No document selected</p>
      </div>
    );
  }

  return (
    <div className="flex-1" style={{ padding: '2rem' }}>
      <div className="prose prose-sm max-w-none">
        <pre className="whitespace-pre-wrap text-sm">
          {activeDocument.content}
        </pre>
      </div>
    </div>
  );
}