import React, { useEffect, useRef, useState } from 'react';
import MarkdownEditor from '@uiw/react-markdown-editor';
import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';

export function SplitEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const markAsModified = useDocumentStore((state) => state.markAsModified);
  const settings = useSettingsStore((state) => state.settings);
  const editorRef = useRef<HTMLDivElement>(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const [isResizing, setIsResizing] = useState(false);

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

  // Custom split pane functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !editorRef.current) return;
      
      const container = editorRef.current;
      const rect = container.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;
      
      // Constrain between 20% and 80%
      const constrainedWidth = Math.max(20, Math.min(80, newLeftWidth));
      
      const leftPane = container.querySelector('.split-pane-left') as HTMLElement;
      const rightPane = container.querySelector('.split-pane-right') as HTMLElement;
      
      if (leftPane && rightPane) {
        leftPane.style.width = `${constrainedWidth}%`;
        rightPane.style.width = `${100 - constrainedWidth}%`;
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

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
    <div className="flex-1" ref={editorRef} style={{ display: 'flex', height: '100%' }}>
      {/* Left Pane - Markdown Editor */}
      <div 
        className="split-pane-left" 
        style={{ 
          width: '50%', 
          height: '100%', 
          overflow: 'hidden',
          borderRight: '1px solid hsl(var(--border))'
        }}
      >
        <MarkdownEditor
          value={markdownContent}
          onChange={handleChange}
          height="100%"
          visible={true}
          visibleEditor={true}
          enablePreview={false}
          enableScroll={true}
          showToolbar={false}
          data-color-mode="light"
          style={{
            fontSize: `${settings?.editor?.fontSize ?? 14}px`,
            fontFamily: settings?.editor?.fontFamily ?? 'system-ui',
            height: '100%',
            width: '100%'
          }}
        />
      </div>

      {/* Resizer */}
      <div
        className="split-pane-resizer"
        style={{
          width: '4px',
          height: '100%',
          backgroundColor: 'hsl(var(--border))',
          cursor: 'col-resize',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseDown={handleMouseDown}
      >
        <div style={{
          width: '2px',
          height: '20px',
          backgroundColor: 'hsl(var(--muted-foreground))',
          borderRadius: '1px'
        }} />
      </div>

      {/* Right Pane - Preview */}
      <div 
        className="split-pane-right" 
        style={{ 
          width: '50%', 
          height: '100%', 
          overflow: 'auto',
          padding: '1rem',
          backgroundColor: 'hsl(var(--background))'
        }}
      >
        <MarkdownEditor
          value={markdownContent}
          onChange={() => {}} // Read-only
          height="100%"
          visible={true}
          visibleEditor={false}
          enablePreview={true}
          enableScroll={true}
          showToolbar={false}
          data-color-mode="light"
          style={{
            fontSize: `${settings?.editor?.fontSize ?? 14}px`,
            fontFamily: settings?.editor?.fontFamily ?? 'system-ui',
            height: '100%',
            width: '100%'
          }}
        />
      </div>
    </div>
  );
}