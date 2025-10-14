import { FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDocumentStore } from '@/stores/documentStore';
import { useUIStore } from '@/stores/uiStore';
import { fileService } from '@/services/fileService';
import { Document } from '@shared/types';
import { cn } from '@/lib/utils';

export function FilesTab() {
  const { 
    documents, 
    activeDocumentId, 
    setActiveDocument, 
    removeDocument,
    addDocument
  } = useDocumentStore();
  const { setSidebarTab } = useUIStore();

  const handleNew = async () => {
    const id = await fileService.createNewFile();
    const newDoc: Document = {
      id,
      filename: 'Untitled.md',
      filepath: null,
      content: '',
      isModified: false,
      lastSaved: null,
      isTemplate: false,
    };
    addDocument(newDoc);
  };

  const handleOpen = async () => {
    const result = await fileService.openFile();
    if (result) {
      const doc: Document = {
        ...result,
        isModified: false,
        lastSaved: new Date(),
      };
      addDocument(doc);
    }
  };

  const handleUseTemplate = () => {
    setSidebarTab('templates');
  };

  if (documents.size === 0) {
    return (
      <div style={{ padding: '1rem' }} className="test-space-y-4">
        <div style={{ textAlign: 'center' }} className="test-space-y-2">
          <FileText style={{ height: '3rem', width: '3rem', margin: '0 auto', color: 'hsl(var(--muted-foreground))' }} />
          <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>No documents open</p>
          <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>
            Get started by creating or opening a document
          </p>
        </div>
        <div className="test-space-y-2">
          <Button style={{ width: '100%' }} variant="default" onClick={handleNew}>
            New Document
          </Button>
          <Button style={{ width: '100%' }} variant="outline" onClick={handleOpen}>
            Open Document
          </Button>
          <Button style={{ width: '100%' }} variant="outline" onClick={handleUseTemplate}>
            Use Template
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0.5rem' }}>
      {Array.from(documents.values()).map((doc) => (
        <div
          key={doc.id}
          className={cn(
            'test-p-2 test-rounded test-hover-bg-accent test-cursor-pointer test-group',
            doc.id === activeDocumentId && 'test-bg-accent'
          )}
          onClick={() => setActiveDocument(doc.id)}
        >
          <div className="test-flex test-items-center test-gap-2">
            <FileText style={{ height: '1rem', width: '1rem' }} />
            <span className="test-flex-1 test-truncate">{doc.filename}</span>
            {doc.isModified && (
              <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
            )}
            <Button
              variant="ghost"
              size="icon"
              style={{ height: '1.5rem', width: '1.5rem', opacity: 0 }}
              className="test-group-hover:test-opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                removeDocument(doc.id);
              }}
            >
              <X style={{ height: '0.75rem', width: '0.75rem' }} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
