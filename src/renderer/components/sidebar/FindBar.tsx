import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/uiStore';
import { useDocumentStore } from '@/stores/documentStore';
import { findService } from '@/services/findService';
import { Search, ChevronUp, ChevronDown, X } from 'lucide-react';

export function FindBar() {
  const findQuery = useUIStore((state) => state.findQuery);
  const findMatches = useUIStore((state) => state.findMatches);
  const currentMatchIndex = useUIStore((state) => state.currentMatchIndex);
  const findBarVisible = useUIStore((state) => state.findBarVisible);
  const setFindQuery = useUIStore((state) => state.setFindQuery);
  const setFindMatches = useUIStore((state) => state.setFindMatches);
  const setCurrentMatchIndex = useUIStore((state) => state.setCurrentMatchIndex);
  const hideFindBar = useUIStore((state) => state.hideFindBar);
  const nextMatch = useUIStore((state) => state.nextMatch);
  const previousMatch = useUIStore((state) => state.previousMatch);
  
  const editorMode = useUIStore((state) => state.editorMode);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Debounced search function
  const performSearch = React.useCallback((query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      if (!query.trim()) {
        setFindMatches([]);
        return;
      }

      const matches = findService.findMatches(query, editorMode === 'plain' ? 'plain' : 'wysiwyg');
      setFindMatches(matches);
      
      // Select first match if any found
      if (matches.length > 0) {
        findService.selectMatch(matches[0], editorMode === 'plain' ? 'plain' : 'wysiwyg');
        setCurrentMatchIndex(0);
      }
    }, 300);
  }, [editorMode, setFindMatches, setCurrentMatchIndex]);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Handle query change
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setFindQuery(query);
    performSearch(query);
  };

  // Handle next match
  const handleNextMatch = () => {
    if (findMatches.length === 0) return;
    const nextIndex = currentMatchIndex < findMatches.length - 1 ? currentMatchIndex + 1 : 0;
    setCurrentMatchIndex(nextIndex);
    const match = findMatches[nextIndex];
    findService.selectMatch(match, editorMode === 'plain' ? 'plain' : 'wysiwyg');
  };

  // Handle previous match
  const handlePreviousMatch = () => {
    if (findMatches.length === 0) return;
    const prevIndex = currentMatchIndex > 0 ? currentMatchIndex - 1 : findMatches.length - 1;
    setCurrentMatchIndex(prevIndex);
    const match = findMatches[prevIndex];
    findService.selectMatch(match, editorMode === 'plain' ? 'plain' : 'wysiwyg');
  };

  // Handle close
  const handleClose = () => {
    hideFindBar();
    // Clear highlights will be handled by editor components
  };

  // Handle clear input
  const handleClear = () => {
    setFindQuery('');
    setFindMatches([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Focus input when find bar becomes visible
  React.useEffect(() => {
    if (findBarVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [findBarVisible]);

  // Navigate to current match when index changes (but not from our handlers to avoid double calls)
  // This effect is mainly for when matches are set initially
  React.useEffect(() => {
    // Only navigate if we have matches and a valid index, but skip if triggered by our navigation handlers
    // The navigation handlers will call selectMatch directly
  }, [currentMatchIndex, findMatches, editorMode]);

  // Update search when document changes
  const activeDocument = useDocumentStore((state) => {
    if (!state.activeDocumentId) return null;
    return state.documents.get(state.activeDocumentId) || null;
  });

  React.useEffect(() => {
    if (findQuery && activeDocument) {
      performSearch(findQuery);
    }
  }, [activeDocument?.content, findQuery, performSearch]);

  if (!findBarVisible) {
    return null;
  }

  const matchCountText = findMatches.length > 0
    ? `${currentMatchIndex + 1} of ${findMatches.length}`
    : findQuery.trim()
    ? 'No matches'
    : '';

  return (
    <div className="border-t border-border bg-background p-2 flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Find in document..."
            value={findQuery}
            onChange={handleQueryChange}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleClose();
              } else if (e.key === 'Enter') {
                if (e.shiftKey) {
                  handlePreviousMatch();
                } else {
                  handleNextMatch();
                }
              }
            }}
            className="pl-8 pr-8 h-8 text-sm"
          />
          {findQuery && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex-1">{matchCountText}</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreviousMatch}
            disabled={findMatches.length === 0}
            className="h-6 px-2"
            aria-label="Previous match"
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextMatch}
            disabled={findMatches.length === 0}
            className="h-6 px-2"
            aria-label="Next match"
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 px-2 ml-1"
            aria-label="Close find"
            title="Close (Esc)"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

