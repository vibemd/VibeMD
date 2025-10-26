import * as React from 'react';
import { TipTapEditor } from '@/components/editor/TipTapEditor';
import { PlainTextEditor } from '@/components/editor/PlainTextEditor';
import { useDocumentStore } from '@/stores/documentStore';
import { useUIStore } from '@/stores/uiStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { FileText } from 'lucide-react';

export function EditorWindow() {
  const hasActiveDocument = useDocumentStore(
    (state) => state.activeDocumentId !== null
  );
  const editorMode = useUIStore((state) => state.editorMode);
  const setEditorMode = useUIStore((state) => state.setEditorMode);
  const plainTextEnabled = useSettingsStore((state) => state.settings.editor.enablePlainTextEditing);

  React.useEffect(() => {
    if (!plainTextEnabled && editorMode === 'plain') {
      setEditorMode('wysiwyg');
    }
  }, [plainTextEnabled, editorMode, setEditorMode]);

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
      {plainTextEnabled && editorMode === 'plain' ? <PlainTextEditor /> : <TipTapEditor />}
    </div>
  );
}
