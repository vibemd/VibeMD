import React, { useEffect, useMemo, useState } from 'react';
import { useDocumentStore } from '@/stores/documentStore';
import { markdownService, OutlineNode } from '@/services/markdownService';
import { useNavigationStore } from '@/services/navigationService';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown } from 'lucide-react';

export function OutlineTab() {
  // IMPORTANT: Subscribe to the actual state, not the getter function
  // This ensures the component re-renders when document content changes
  const activeDocument = useDocumentStore((state) => {
    if (!state.activeDocumentId) return null;
    return state.documents.get(state.activeDocumentId) || null;
  });
  const scrollToHeading = useNavigationStore((state) => state.scrollToHeading);
  const hasScrollHandler = useNavigationStore((state) => state.hasScrollHandler);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [pendingHeadingId, setPendingHeadingId] = useState<string | null>(null);
  const editorMode = useUIStore((state) => state.editorMode);
  const setEditorMode = useUIStore((state) => state.setEditorMode);

  const outline = useMemo(() => {
    if (!activeDocument) return [];
    console.log('[OutlineTab] Generating outline for document:', activeDocument.id, 'content length:', activeDocument.content.length);
    const result = markdownService.generateOutline(activeDocument.content);
    console.log('[OutlineTab] Generated outline with', result.length, 'top-level items');
    return result;
  }, [activeDocument?.id, activeDocument?.content]);

  const toggleCollapse = (nodeId: string) => {
    setCollapsedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleHeadingClick = (heading: OutlineNode) => {
    if (!heading.id) {
      return;
    }

    const shouldSwitchToWysiwyg = editorMode === 'plain';
    const shouldDeferNavigation = shouldSwitchToWysiwyg || !hasScrollHandler;

    if (shouldSwitchToWysiwyg) {
      setEditorMode('wysiwyg');
    }

    if (shouldDeferNavigation) {
      setPendingHeadingId(heading.id);
      return;
    }

    scrollToHeading(heading.id);
  };

  useEffect(() => {
    if (!pendingHeadingId) {
      return;
    }

    if (editorMode !== 'wysiwyg' || !hasScrollHandler) {
      return;
    }

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 12;
    const navigationDelayMs = 100;
    const timeouts: number[] = [];

    const isSelectionInsideHeading = (headingElement: HTMLElement): boolean => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        return false;
      }
      const anchorNode = selection.anchorNode;
      if (!anchorNode) {
        return false;
      }
      return headingElement.contains(anchorNode);
    };

    const attemptNavigation = () => {
      if (cancelled) {
        return;
      }

      const headingElement = document.getElementById(pendingHeadingId);
      if (!headingElement) {
        scheduleNextAttempt();
        return;
      }

      try {
        const handler = useNavigationStore.getState().scrollToHeading;
        handler(pendingHeadingId);
      } catch (error) {
        console.error('Failed to navigate to heading after switching editor mode:', error);
        setPendingHeadingId(null);
        return;
      }

      if (isSelectionInsideHeading(headingElement)) {
        setPendingHeadingId(null);
        return;
      }

      scheduleNextAttempt();
    };

    const scheduleNextAttempt = () => {
      attempts += 1;
      if (attempts >= maxAttempts) {
        setPendingHeadingId(null);
        return;
      }
      const timeoutId = window.setTimeout(attemptNavigation, navigationDelayMs);
      timeouts.push(timeoutId);
    };

    const initialTimeout = window.setTimeout(attemptNavigation, navigationDelayMs);
    timeouts.push(initialTimeout);

    return () => {
      cancelled = true;
      for (const timeoutId of timeouts) {
        clearTimeout(timeoutId);
      }
    };
  }, [pendingHeadingId, editorMode, hasScrollHandler]);

  const renderOutlineNode = (node: OutlineNode, level = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isCollapsed = collapsedNodes.has(node.id || '');
    const nodeId = node.id || `node-${node.line}`;

    return (
      <div key={nodeId}>
        <div
          className={cn(
            'flex items-center p-2 rounded hover:bg-accent cursor-pointer text-sm',
            // Better indentation based on heading depth
            node.depth === 1 && 'ml-0',
            node.depth === 2 && 'ml-4',
            node.depth === 3 && 'ml-8',
            node.depth === 4 && 'ml-12',
            node.depth === 5 && 'ml-16',
            node.depth === 6 && 'ml-20'
          )}
          onClick={() => handleHeadingClick(node)}
        >
          {hasChildren && (
            <button
              className="mr-1 p-0.5 hover:bg-accent hover:text-accent-foreground rounded"
              onClick={(e) => {
                e.stopPropagation();
                toggleCollapse(nodeId);
              }}
            >
              {isCollapsed ? (
                <ChevronRight className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}
          <span className={cn(
            'flex-1',
            node.depth === 1 && 'font-semibold text-base',
            node.depth === 2 && 'font-medium text-sm',
            node.depth >= 3 && 'text-sm text-muted-foreground'
          )}>
            {node.text}
          </span>
        </div>
        {hasChildren && !isCollapsed && (
          <div>
            {(node.children ?? []).map(child => renderOutlineNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!activeDocument) {
    return (
      <div className="h-full overflow-y-auto overflow-x-hidden p-4">
        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
          <p>No document open</p>
        </div>
      </div>
    );
  }

  if (outline.length === 0) {
    return (
      <div className="h-full overflow-y-auto overflow-x-hidden p-4">
        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
          <p>No headings found</p>
          <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
            Add headings (# ## ###) to see outline
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden p-2">
      {outline.map(node => renderOutlineNode(node))}
    </div>
  );
}
