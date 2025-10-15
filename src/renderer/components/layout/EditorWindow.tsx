import { WysimarkWYSIWYGEditor } from '@/components/editor/WysimarkWYSIWYGEditor';
import { SplitEditor } from '@/components/editor/SplitEditor';
import { useUIStore } from '@/stores/uiStore';
import { useDocumentStore } from '@/stores/documentStore';
import { FileText } from 'lucide-react';

export function EditorWindow() {
  const editorMode = useUIStore((state) => state.editorMode);
  const hasActiveDocument = useDocumentStore(
    (state) => state.activeDocumentId !== null
  );

  if (!hasActiveDocument) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center" style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center' }} className="space-y-4">
            <FileText style={{ height: '4rem', width: '4rem', margin: '0 auto', color: 'hsl(var(--muted-foreground))' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>No document open</h2>
            <p style={{ color: 'hsl(var(--muted-foreground))' }}>
              Create or open a document to start editing
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {editorMode === 'wysiwyg' && <WysimarkWYSIWYGEditor />}
      {editorMode === 'split' && <SplitEditor />}
    </div>
  );
}
