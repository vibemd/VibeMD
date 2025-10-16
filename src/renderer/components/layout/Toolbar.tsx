import { 
  FileText, 
  FolderOpen, 
  Save, 
  Download,
  Printer, 
  Settings 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { useDocumentStore } from '@/stores/documentStore';
import { useUIStore } from '@/stores/uiStore';
import { fileService } from '@/services/fileService';
import { Document } from '@shared/types';

export function Toolbar() {
  const { addDocument, getActiveDocument, updateDocument, markAsSaved } = 
    useDocumentStore();
  const { toggleSettingsDialog } = useUIStore();

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

  const handleSave = async () => {
    const doc = getActiveDocument();
    if (!doc) return;

    if (!doc.filepath) {
      // Trigger Save As
      const filepath = await fileService.saveFileAs(doc.content);
      if (filepath) {
        updateDocument(doc.id, { filepath });
        await fileService.saveFile(filepath, doc.content);
        markAsSaved(doc.id);
      }
    } else {
      await fileService.saveFile(doc.filepath, doc.content);
      markAsSaved(doc.id);
    }
  };

  const handleSaveAs = async () => {
    const doc = getActiveDocument();
    if (!doc) return;

    const filepath = await fileService.saveFileAs(doc.content, doc.filepath || undefined);
    if (filepath) {
      updateDocument(doc.id, { filepath });
      await fileService.saveFile(filepath, doc.content);
      markAsSaved(doc.id);
    }
  };

  const handlePrint = async () => {
    const doc = getActiveDocument();
    if (!doc) return;

    // Convert markdown to HTML for printing
    // This is a simple implementation - in production, you'd use a proper markdown renderer
    const htmlContent = doc.content
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
      .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`(.*)`/gim, '<code>$1</code>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/\n/g, '<br>');

    await window.electronAPI.printDocument(htmlContent);
  };

  const handleSettings = () => {
    toggleSettingsDialog();
  };

  const activeDoc = getActiveDocument();
  const hasUnsavedChanges = activeDoc?.isModified;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="h-14 border-b flex items-center px-4 gap-2 bg-background">
        {/* Left side - File operations */}
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNew}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              New
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>New Document (Ctrl+N)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpen}
              className="gap-2"
            >
              <FolderOpen className="h-4 w-4" />
              Open
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Open Document (Ctrl+O)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="gap-2"
              disabled={!hasUnsavedChanges}
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save Document (Ctrl+S)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveAs}
              className="gap-2"
              disabled={!activeDoc}
            >
              <Download className="h-4 w-4" />
              Save As
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save Document As (Ctrl+Shift+S)</p>
          </TooltipContent>
        </Tooltip>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side - Utility actions */}
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrint}
              className="gap-2"
              disabled={!activeDoc}
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Print Document (Ctrl+P)</p>
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />
        
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSettings}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Settings (Ctrl+,)</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
