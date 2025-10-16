import React, { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';

export function SplitEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const markAsModified = useDocumentStore((state) => state.markAsModified);
  const settings = useSettingsStore((state) => state.settings);
  const [markdownContent, setMarkdownContent] = useState('');

  // Update markdown content when document changes
  useEffect(() => {
    if (activeDocument) {
      setMarkdownContent(activeDocument.content);
    }
  }, [activeDocument]);

  const handleChange = (value: string) => {
    setMarkdownContent(value);
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
      {/* MDEditor with both editor and preview */}
      <MDEditor
        value={markdownContent}
        onChange={(value) => handleChange(value || '')}
        height="100%"
        data-color-mode="light"
        hideToolbar={true}
        style={{
          fontSize: `${settings?.editor?.fontSize ?? 14}px`,
          fontFamily: settings?.editor?.fontFamily ?? 'system-ui',
          height: '100%',
          width: '100%'
        }}
      />
    </div>
  );
}