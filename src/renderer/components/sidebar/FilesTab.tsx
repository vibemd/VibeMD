import { FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDocumentStore } from '@/stores/documentStore';
import { useUIStore } from '@/stores/uiStore';
import { fileService } from '@/services/fileService';
import { Document } from '@shared/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function FilesTab() {
  const { 
    documents, 
    activeDocumentId, 
    setActiveDocument, 
    removeDocument,
    addDocument,
    updateDocument,
    markAsSaved
  } = useDocumentStore();
  const { setSidebarTab } = useUIStore();
  
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [documentToClose, setDocumentToClose] = useState<Document | null>(null);

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

  const handleCloseFile = async (doc: Document) => {
    if (doc.isModified) {
      // Show save confirmation dialog
      setDocumentToClose(doc);
      setCloseDialogOpen(true);
    } else {
      // File is saved, close directly
      removeDocument(doc.id);
    }
  };

  const handleSaveAndClose = async () => {
    if (!documentToClose) return;

    try {
      if (documentToClose.filepath) {
        // File exists, save to existing path
        await fileService.saveFile(documentToClose.filepath, documentToClose.content);
        markAsSaved(documentToClose.id);
      } else {
        // New file, show save as dialog
        const filepath = await fileService.saveFileAs(documentToClose.content);
        if (filepath) {
          updateDocument(documentToClose.id, { filepath });
          await fileService.saveFile(filepath, documentToClose.content);
          markAsSaved(documentToClose.id);
        }
      }
      
      // Close the file
      removeDocument(documentToClose.id);
    } catch (error) {
      console.error('Error saving file:', error);
    } finally {
      setCloseDialogOpen(false);
      setDocumentToClose(null);
    }
  };

  const handleCloseWithoutSaving = () => {
    if (documentToClose) {
      removeDocument(documentToClose.id);
    }
    setCloseDialogOpen(false);
    setDocumentToClose(null);
  };

  if (documents.size === 0) {
    return (
      <div style={{ padding: '1rem' }} className="space-y-4">
        <div style={{ textAlign: 'center' }} className="space-y-2">
          <FileText style={{ height: '3rem', width: '3rem', margin: '0 auto', color: 'hsl(var(--muted-foreground))' }} />
          <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>No documents open</p>
          <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>
            Get started by creating or opening a document
          </p>
        </div>
        <div className="space-y-2">
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
    <>
      <div style={{ padding: '0.5rem' }}>
        {Array.from(documents.values()).map((doc) => (
          <div
            key={doc.id}
            className={cn(
              'p-2 rounded hover:bg-accent cursor-pointer group',
              doc.id === activeDocumentId && 'bg-accent'
            )}
            onClick={() => setActiveDocument(doc.id)}
          >
            <div className="flex items-center gap-2">
              <FileText style={{ height: '1rem', width: '1rem' }} />
              <span className="flex-1 truncate">{doc.filename}</span>
              
              {/* Save state indicator */}
              <span 
                style={{ 
                  width: '0.5rem', 
                  height: '0.5rem', 
                  borderRadius: '50%',
                  backgroundColor: doc.isModified ? '#ef4444' : '#22c55e' // red for unsaved, green for saved
                }} 
                title={doc.isModified ? 'Unsaved changes' : 'Saved'}
              />
              
              <Button
                variant="ghost"
                size="icon"
                style={{ height: '1.5rem', width: '1.5rem', opacity: 0 }}
                className="group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseFile(doc);
                }}
              >
                <X style={{ height: '0.75rem', width: '0.75rem' }} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Save confirmation dialog */}
      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              There are unsaved changes to "{documentToClose?.filename}". Do you wish to save these?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseWithoutSaving}>
              No
            </Button>
            <Button onClick={handleSaveAndClose}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
