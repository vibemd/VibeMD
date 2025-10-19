import { useEffect, useState } from 'react';
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
import { useTemplatesStore } from '@/stores/templatesStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useDocumentStore } from '@/stores/documentStore';
import { useUIStore } from '@/stores/uiStore';
import { Document, Template, NewFileFromTemplateDialogData } from '@shared/types';
import { NewFileFromTemplateDialog } from '@/components/dialogs/NewFileFromTemplateDialog';
import { cn } from '@/lib/utils';
import { fileService } from '@/services/fileService';

export function TemplatesTab() {
  const { templates, loading, loadTemplates } = useTemplatesStore();
  const { settings } = useSettingsStore();
  const { 
    documents, 
    activeDocumentId, 
    setActiveDocument, 
    addDocument, 
    addTemplate,
    removeTemplate,
    updateDocument,
    markAsSaved
  } = useDocumentStore();
  const setSidebarTab = useUIStore((state) => state.setSidebarTab);
  
  // Force re-render when documents change by converting Map to Array
  const documentsArray = Array.from(documents.values());
  
  // Helper function to remove file extensions from display names
  const getDisplayName = (filename: string) => {
    return filename.replace(/\.(md|vibe)$/, '');
  };
  
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [templateToClose, setTemplateToClose] = useState<Document | null>(null);

  useEffect(() => {
    if (settings.files.templatesLocation) {
      loadTemplates(settings.files.templatesLocation);
    }
  }, [settings.files.templatesLocation, loadTemplates]);

  const handleUseTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setTemplateDialogOpen(true);
  };

  const handleUseActiveTemplate = (template: Document) => {
    // Convert Document to Template format for the dialog
    const templateForDialog: Template = {
      id: template.id,
      filename: template.filename,
      filepath: template.filepath || '',
      content: template.content
    };
    setSelectedTemplate(templateForDialog);
    setTemplateDialogOpen(true);
  };

  const handleTemplateDialogConfirm = async (data: NewFileFromTemplateDialogData) => {
    if (!selectedTemplate) return;
    
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const filename = data.filename.endsWith('.md') ? data.filename : `${data.filename}.md`;
    
    const newDoc: Document = {
      id,
      filename,
      filepath: null,
      content: selectedTemplate.content,
      isModified: true, // New documents start as modified
      lastSaved: null,
      isTemplate: data.createNewTemplate,
    };

    if (data.createNewTemplate) {
      addTemplate(newDoc);
    } else {
      addDocument(newDoc);
      setSidebarTab('files'); // Switch to files tab
    }
  };

  const handleCloseTemplate = async (template: Document) => {
    if (template.isModified) {
      // Show save confirmation dialog
      setTemplateToClose(template);
      setCloseDialogOpen(true);
    } else {
      // Template is saved, close directly
      removeTemplate(template.id);
    }
  };

  const handleSaveAndCloseTemplate = async () => {
    if (!templateToClose) return;

    try {
      if (templateToClose.filepath) {
        // Template exists, save to existing path
        await fileService.saveFile(templateToClose.filepath, templateToClose.content);
        markAsSaved(templateToClose.id);
      } else {
        // New template, save to templates location
        const templatesLocation = settings.files.templatesLocation;
        if (templatesLocation) {
          const filepath = await fileService.saveTemplate(templatesLocation, templateToClose.filename, templateToClose.content);
          if (filepath) {
            updateDocument(templateToClose.id, { filepath });
            markAsSaved(templateToClose.id);
          }
        }
      }
      
      // Close the template
      removeTemplate(templateToClose.id);
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setCloseDialogOpen(false);
      setTemplateToClose(null);
    }
  };

  const handleCloseWithoutSavingTemplate = () => {
    if (templateToClose) {
      removeTemplate(templateToClose.id);
    }
    setCloseDialogOpen(false);
    setTemplateToClose(null);
  };

  if (loading) {
    return (
      <div className="h-full overflow-y-auto overflow-x-hidden p-4">
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>Loading templates...</p>
        </div>
      </div>
    );
  }

  // Get active template documents (templates being edited)
  const activeTemplates = documentsArray.filter((doc: Document) => doc.isTemplate);

  // Check if we should show the empty state
  const shouldShowEmpty = activeTemplates.length === 0 && templates.length === 0;

  if (shouldShowEmpty) {
    return (
      <div className="h-full overflow-y-auto overflow-x-hidden p-4">
        <div style={{ textAlign: 'center' }} className="space-y-2">
          <FileText style={{ height: '3rem', width: '3rem', margin: '0 auto', color: 'hsl(var(--muted-foreground))' }} />
          <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>No templates available</p>
          <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>
            Add .vibe files to your templates folder
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-full overflow-y-auto overflow-x-hidden p-2">
        <div className="space-y-1">
          {/* Active template documents (being edited) */}
          {activeTemplates.map((template: Document) => (
            <div
              key={template.id}
              className={cn(
                'p-2 rounded cursor-pointer group',
                template.id === activeDocumentId ? 'bg-accent' : 'bg-secondary/30 hover:bg-accent'
              )}
              onClick={() => setActiveDocument(template.id)}
            >
              <div className="flex items-center gap-2">
                <span className="flex-1 truncate text-sm">
                  {getDisplayName(template.filename)}
                </span>
                
                {/* Save state indicator */}
                <span 
                  style={{ 
                    width: '0.5rem', 
                    height: '0.5rem', 
                    borderRadius: '50%',
                    backgroundColor: template.isModified ? '#ef4444' : '#22c55e' // red for unsaved, green for saved
                  }} 
                  title={template.isModified ? 'Unsaved changes' : 'Saved'}
                />
                
                <Button
                  size="sm"
                  variant="default"
                  className="h-7 text-xs px-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseActiveTemplate(template);
                  }}
                >
                  Use
                </Button>
              </div>
            </div>
          ))}
          
          {/* Loaded templates from filesystem */}
          {templates.map((template) => (
            <div
              key={template.id}
              className="p-2 rounded hover:bg-accent cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <FileText style={{ height: '1rem', width: '1rem' }} />
                <span className="flex-1 truncate text-sm">
                  {getDisplayName(template.filename)}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs px-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseTemplate(template);
                  }}
                >
                  Use
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Template dialog */}
      <NewFileFromTemplateDialog
        open={templateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        onConfirm={handleTemplateDialogConfirm}
        templateName={selectedTemplate?.filename || ''}
      />

      {/* Save confirmation dialog for templates */}
      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              There are unsaved changes to "{templateToClose?.filename}". Do you wish to save these?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseWithoutSavingTemplate}>
              No
            </Button>
            <Button onClick={handleSaveAndCloseTemplate}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
