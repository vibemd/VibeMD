import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';
import MDEditor from '@uiw/react-md-editor';
import katex from 'katex';

export function WYSIWYGEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const markAsModified = useDocumentStore((state) => state.markAsModified);
  const settings = useSettingsStore((state) => state.settings);

  const handleChange = (value?: string) => {
    if (activeDocument && value !== undefined) {
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
      <MDEditor
        value={activeDocument.content}
        onChange={handleChange}
        data-color-mode="light"
        height="100%"
        visibleDragbar={false}
        hideToolbar={false}
        preview="live"
        style={{
          fontSize: `${settings?.editor?.fontSize ?? 14}px`,
          fontFamily: settings?.editor?.fontFamily ?? 'system-ui',
        }}
        previewOptions={{
          components: {
            code: ({ children, className, ...props }) => {
              // Handle inline LaTeX: $$...$$
              if (typeof children === 'string' && /^\$\$(.*)\$\$/.test(children)) {
                const html = katex.renderToString(
                  children.replace(/^\$\$(.*)\$\$/, '$1'), 
                  { throwOnError: false }
                );
                return <code dangerouslySetInnerHTML={{ __html: html }} style={{ background: 'transparent' }} />;
              }
              
              // Handle block LaTeX: ```KaTeX
              if (typeof className === 'string' && /^language-katex/.test(className.toLowerCase())) {
                const html = katex.renderToString(String(children), { throwOnError: false });
                return <code style={{ fontSize: '150%' }} dangerouslySetInnerHTML={{ __html: html }} />;
              }
              
              return <code className={String(className)}>{children}</code>;
            },
          },
        }}
      />
    </div>
  );
}
