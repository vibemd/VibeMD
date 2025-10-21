import { useDocumentStore } from '@/stores/documentStore';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { markdownService } from '@/services/markdownService';

export function StatusBar() {
  // IMPORTANT: Subscribe to the actual state, not the getter function
  // This ensures the component re-renders when document content changes
  const activeDocument = useDocumentStore((state) => {
    if (!state.activeDocumentId) return null;
    return state.documents.get(state.activeDocumentId) || null;
  });

  const stats = useMemo(() => {
    if (!activeDocument) return null;
    
    return {
      words: markdownService.countWords(activeDocument.content),
      chars: markdownService.countCharacters(activeDocument.content),
    };
  }, [activeDocument?.content]);

  const lastSavedText = useMemo(() => {
    if (!activeDocument) return 'No document open';
    if (!activeDocument.lastSaved) return 'New document not yet saved';
    return `Last saved: ${format(activeDocument.lastSaved, 'PPp')}`;
  }, [activeDocument?.lastSaved]);

  return (
    <div style={{ height: '2rem', borderTop: '1px solid hsl(var(--border))' }} className="flex items-center px-4 text-sm text-muted-foreground bg-background">
      <div className="flex-1">
        {stats ? (
          <span>{stats.words} words, {stats.chars} characters</span>
        ) : (
          <span>No document open</span>
        )}
      </div>
      <div>
        <span>{lastSavedText}</span>
      </div>
    </div>
  );
}
