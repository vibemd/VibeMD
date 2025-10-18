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
import { useSettingsStore } from '@/stores/settingsStore';
import { fileService } from '@/services/fileService';
import { Document, NewDocumentDialogData } from '@shared/types';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { NewDocumentDialog } from '@/components/dialogs/NewDocumentDialog';

export function FilesTab() {
  const { 
    documents, 
    activeDocumentId, 
    setActiveDocument, 
    removeDocument,
    addDocument,
    addTemplate,
    updateDocument,
    markAsSaved
  } = useDocumentStore();
  const { setSidebarTab } = useUIStore();
  const { settings } = useSettingsStore();
  
  // Helper function to remove file extensions from display names
  const getDisplayName = (filename: string) => {
    return filename.replace(/\.(md|vibe)$/, '');
  };
  
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [documentToClose, setDocumentToClose] = useState<Document | null>(null);
  const [newDocumentDialogOpen, setNewDocumentDialogOpen] = useState(false);

  const handleNew = () => {
    setNewDocumentDialogOpen(true);
  };

  const handleNewDocumentConfirm = async (data: NewDocumentDialogData) => {
    const id = await fileService.createNewFile();
    const filename = data.saveAsTemplate
      ? (data.filename.endsWith('.vibe') ? data.filename : `${data.filename}.vibe`)
      : (data.filename.endsWith('.md') ? data.filename : `${data.filename}.md`);

    const newDoc: Document = {
      id,
      filename,
      filepath: null,
      content: '',
      isModified: true, // New documents start as modified
      lastSaved: null,
      isTemplate: data.saveAsTemplate,
    };

    if (data.saveAsTemplate) {
      addTemplate(newDoc);
      setSidebarTab('templates'); // Switch to templates tab
    } else {
      addDocument(newDoc);
    }
  };

  const handleOpen = async () => {
    const result = await fileService.openFile(settings.files.defaultSavePath || undefined);
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
        if (documentToClose.isTemplate) {
          // Templates save to templates location
          const templatesLocation = settings.files.templatesLocation;
          if (templatesLocation) {
            const filepath = await fileService.saveTemplate(templatesLocation, documentToClose.filename, documentToClose.content);
            if (filepath) {
              updateDocument(documentToClose.id, { filepath });
              markAsSaved(documentToClose.id);
            }
          }
        } else {
          // Regular files use Save As dialog
          const filepath = await fileService.saveFileAs(documentToClose.content);
          if (filepath) {
            updateDocument(documentToClose.id, { filepath });
            await fileService.saveFile(filepath, documentToClose.content);
            markAsSaved(documentToClose.id);
          }
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

  // Filter out templates - only show regular documents
  const regularDocuments = Array.from(documents.values()).filter(doc => !doc.isTemplate);

  return (
    <>
      {regularDocuments.length === 0 ? (
        <div className="h-full overflow-y-auto overflow-x-hidden p-4">
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
      ) : (
        <div className="h-full overflow-y-auto overflow-x-hidden p-2">
          <div className="space-y-1">
            {regularDocuments.map((doc) => (
              <div
                key={doc.id}
                className={cn(
                  'p-2 rounded hover:bg-accent cursor-pointer group',
                  doc.id === activeDocumentId && 'bg-accent'
                )}
                onClick={() => setActiveDocument(doc.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="flex-1 truncate text-sm">{getDisplayName(doc.filename)}</span>

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
                    style={{ height: '1.5rem', width: '1.5rem', opacity: 0.7 }}
                    className="hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
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
        </div>
      )}

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

      {/* New document dialog */}
      <NewDocumentDialog
        open={newDocumentDialogOpen}
        onOpenChange={setNewDocumentDialogOpen}
        onConfirm={handleNewDocumentConfirm}
      />
    </>
  );
}
