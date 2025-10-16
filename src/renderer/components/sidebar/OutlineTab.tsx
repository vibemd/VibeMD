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
    console.log('=== OUTLINE CLICK DEBUG ===');
    console.log('Clicked heading:', heading);
    console.log('Heading ID:', heading.id);
    console.log('Navigation service available:', !!scrollToHeading);
    console.log('Navigation service function:', scrollToHeading);
    
    if (heading.id) {
      console.log('Calling scrollToHeading with ID:', heading.id);
      try {
        scrollToHeading(heading.id);
        console.log('scrollToHeading called successfully');
      } catch (error) {
        console.error('Error calling scrollToHeading:', error);
      }
    } else {
      console.log('No heading ID found - cannot navigate');
    }
    console.log('=== END OUTLINE CLICK DEBUG ===');
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
            node.depth === 1 && 'font-semibold text-base',
            node.depth === 2 && 'font-medium text-sm',
            node.depth >= 3 && 'text-sm text-gray-600'
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
      {/* Debug test button */}
      <div className="mb-2 p-2 bg-yellow-100 rounded text-xs">
        <button 
          onClick={() => {
            console.log('=== MANUAL NAVIGATION TEST ===');
            console.log('Testing navigation service:', scrollToHeading);
            scrollToHeading('test-heading');
            console.log('=== END MANUAL TEST ===');
          }}
          className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
        >
          Test Navigation
        </button>
        <span className="ml-2 text-gray-600">Click to test navigation service</span>
      </div>
      
      {outline.map(node => renderOutlineNode(node))}
    </div>
  );
}
