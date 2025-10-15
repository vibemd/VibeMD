import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';

export function PreviewEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const settings = useSettingsStore((state) => state.settings);

  if (!activeDocument) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p style={{ color: 'hsl(var(--muted-foreground))' }}>No document selected</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-auto bg-background">
      <div 
        className="prose prose-sm max-w-none"
        style={{
          fontSize: `${settings?.editor?.fontSize ?? 14}px`,
          fontFamily: settings?.editor?.fontFamily ?? 'system-ui',
        }}
      >
        <ReactMarkdown
          remarkPlugins={[
            remarkGfm,  // GFM support (Phase 2)
            remarkMath  // LaTeX support (Phase 3)
          ]}
          rehypePlugins={[
            rehypeKatex  // LaTeX rendering (Phase 3)
          ]}
        >
          {activeDocument.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}