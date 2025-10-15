import React, { useEffect, useRef } from 'react';
import MarkdownEditor from '@uiw/react-markdown-editor';
import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';

export function SplitEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const markAsModified = useDocumentStore((state) => state.markAsModified);
  const settings = useSettingsStore((state) => state.settings);
  const editorRef = useRef<HTMLDivElement>(null);

  // Force equal width distribution via JavaScript
  useEffect(() => {
    const forceEqualWidth = () => {
      if (editorRef.current) {
        const editor = editorRef.current.querySelector('.w-md-editor');
        if (editor) {
          // Find all direct children that might be panes
          const children = Array.from(editor.children) as HTMLElement[];
          children.forEach((child, index) => {
            child.style.flex = '1 1 50%';
            child.style.width = '50%';
            child.style.minWidth = '0';
            child.style.maxWidth = '50%';
          });

          // Also try to find nested panes
          const textInput = editor.querySelector('[class*="text-input"], [class*="editor"]');
          const preview = editor.querySelector('[class*="preview"], [class*="html"]');
          
          if (textInput && preview) {
            (textInput as HTMLElement).style.flex = '1 1 50%';
            (textInput as HTMLElement).style.width = '50%';
            (textInput as HTMLElement).style.minWidth = '0';
            (textInput as HTMLElement).style.maxWidth = '50%';
            
            (preview as HTMLElement).style.flex = '1 1 50%';
            (preview as HTMLElement).style.width = '50%';
            (preview as HTMLElement).style.minWidth = '0';
            (preview as HTMLElement).style.maxWidth = '50%';
          }
        }
      }
    };

    // Apply immediately and after a short delay to catch dynamic content
    forceEqualWidth();
    const timeoutId = setTimeout(forceEqualWidth, 100);
    
    return () => clearTimeout(timeoutId);
  }, [activeDocument]);

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
    <div className="flex-1" ref={editorRef}>
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