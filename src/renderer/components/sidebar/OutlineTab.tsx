import { useMemo, useState } from 'react';
import { useDocumentStore } from '@/stores/documentStore';
import { markdownService, OutlineNode } from '@/services/markdownService';
import { useNavigationStore } from '@/services/navigationService';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown } from 'lucide-react';

export function OutlineTab() {
  const activeDocument = useDocumentStore((state) => 
    state.getActiveDocument()
  );
  const scrollToHeading = useNavigationStore((state) => state.scrollToHeading);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());

  const outline = useMemo(() => {
    if (!activeDocument) return [];
    return markdownService.generateOutline(activeDocument.content);
  }, [activeDocument?.content]);

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
    if (heading.id) {
      scrollToHeading(heading.id);
    }
  };

  const renderOutlineNode = (node: OutlineNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isCollapsed = collapsedNodes.has(node.id || '');
    const nodeId = node.id || `node-${node.line}`;

    return (
      <div key={nodeId}>
        <div
          className={cn(
            'flex items-center p-2 rounded hover:bg-accent cursor-pointer text-sm',
            level > 0 && `ml-${level * 2}`
          )}
          onClick={() => handleHeadingClick(node)}
        >
          {hasChildren && (
            <button
              className="mr-1 p-0.5 hover:bg-gray-200 rounded"
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
            node.depth === 1 && 'font-semibold',
            node.depth === 2 && 'font-medium'
          )}>
            {node.text}
          </span>
        </div>
        {hasChildren && !isCollapsed && (
          <div>
            {node.children!.map(child => renderOutlineNode(child, level + 1))}
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
