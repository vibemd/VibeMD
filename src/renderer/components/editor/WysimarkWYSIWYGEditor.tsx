import React, { useEffect } from 'react';
import { Editable, useEditor } from '@wysimark/react';
import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';

export function WysimarkWYSIWYGEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const markAsModified = useDocumentStore((state) => state.markAsModified);
  const settings = useSettingsStore((state) => state.settings);

  const editor = useEditor();

  const handleChange = (markdown: string) => {
    if (activeDocument && markdown !== activeDocument.content) {
      updateDocument(activeDocument.id, { content: markdown });
      markAsModified(activeDocument.id);
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
    <div className="flex-1">
      <div
        style={{
          fontSize: `${settings?.editor?.fontSize ?? 14}px`,
          fontFamily: settings?.editor?.fontFamily ?? 'system-ui',
          height: '100%',
        }}
      >
        <Editable
          editor={editor}
          value={activeDocument.content}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
