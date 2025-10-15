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
          console.log('Found editor element:', editor);
          console.log('Editor children:', Array.from(editor.children));
          
          // Log all classes in the editor
          console.log('Editor classes:', editor.className);
          
          // Find all direct children that might be panes
          const children = Array.from(editor.children) as HTMLElement[];
          children.forEach((child, index) => {
            console.log(`Child ${index}:`, child.className, child.tagName);
            child.style.flex = '1 1 50%';
            child.style.width = '50%';
            child.style.minWidth = '0';
            child.style.maxWidth = '50%';
            child.style.boxSizing = 'border-box';
          });

          // Try multiple selectors for the panes
          const selectors = [
            '[class*="text-input"]',
            '[class*="editor"]', 
            '[class*="preview"]',
            '[class*="html"]',
            '[class*="markdown"]',
            '.w-md-editor-text-input',
            '.w-md-editor-preview',
            '.w-md-editor-text',
            '.w-md-editor-html'
          ];
          
          selectors.forEach(selector => {
            const elements = editor.querySelectorAll(selector);
            elements.forEach((element, index) => {
              console.log(`Found element with selector ${selector}:`, element.className);
              (element as HTMLElement).style.flex = '1 1 50%';
              (element as HTMLElement).style.width = '50%';
              (element as HTMLElement).style.minWidth = '0';
              (element as HTMLElement).style.maxWidth = '50%';
              (element as HTMLElement).style.boxSizing = 'border-box';
            });
          });

          // Force the editor container itself
          (editor as HTMLElement).style.display = 'flex';
          (editor as HTMLElement).style.flexDirection = 'row';
          (editor as HTMLElement).style.width = '100%';
        }
      }
    };

    // Apply immediately and after delays to catch dynamic content
    forceEqualWidth();
    const timeoutId1 = setTimeout(forceEqualWidth, 100);
    const timeoutId2 = setTimeout(forceEqualWidth, 500);
    const timeoutId3 = setTimeout(forceEqualWidth, 1000);
    
    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
    };
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