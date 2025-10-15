import React from 'react';
import MarkdownEditor from '@uiw/react-markdown-editor';
import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';

export function SplitEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const markAsModified = useDocumentStore((state) => state.markAsModified);
  const settings = useSettingsStore((state) => state.settings);

  const handleChange = (value: string) => {
    if (activeDocument && value !== activeDocument.content) {
      updateDocument(activeDocument.id, { content: value });
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
      <style jsx>{`
        .w-md-editor {
          display: flex !important;
          flex-direction: row !important;
        }
        
        .w-md-editor-content {
          flex: 1 !important;
          display: flex !important;
          flex-direction: row !important;
        }
        
        .w-md-editor-text-input {
          flex: 1 !important;
          width: 50% !important;
        }
        
        .w-md-editor-preview {
          flex: 1 !important;
          width: 50% !important;
        }
      `}</style>
      <MarkdownEditor
        value={activeDocument.content}
        onChange={handleChange}
        height="100%"
        visible={true}
        visibleEditor={true}
        enablePreview={true}
        enableScroll={true}
        showToolbar={false}
        data-color-mode="light"
        style={{
          fontSize: `${settings?.editor?.fontSize ?? 14}px`,
          fontFamily: settings?.editor?.fontFamily ?? 'system-ui',
        }}
      />
    </div>
  );
}