import { useMemo } from 'react';
import { useDocumentStore } from '@/stores/documentStore';
import { markdownService, OutlineNode } from '@/services/markdownService';
import { cn } from '@/lib/utils';

export function OutlineTab() {
  const activeDocument = useDocumentStore((state) => 
    state.getActiveDocument()
  );

  const outline = useMemo(() => {
    if (!activeDocument) return [];
    return markdownService.generateOutline(activeDocument.content);
  }, [activeDocument?.content]);

  if (!activeDocument) {
    return (
      <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
        <p>No document open</p>
      </div>
    );
  }

  if (outline.length === 0) {
    return (
      <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
        <p>No headings found</p>
        <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
          Add headings (# ## ###) to see outline
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '0.5rem' }}>
      {outline.map((heading, index) => (
        <div
          key={index}
          className={cn(
            'p-2 rounded hover:bg-accent cursor-pointer text-sm',
            heading.depth === 1 && 'font-semibold',
            heading.depth === 2 && 'ml-2',
            heading.depth === 3 && 'ml-4',
            heading.depth === 4 && 'ml-6',
            heading.depth === 5 && 'ml-8',
            heading.depth === 6 && 'ml-10'
          )}
          onClick={() => {
            // TODO: Implement scroll to heading
            console.log('Scroll to line:', heading.line);
          }}
        >
          {heading.text}
        </div>
      ))}
    </div>
  );
}
