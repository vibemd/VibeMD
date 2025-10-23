import { useEffect } from 'react';
import { useDocumentStore } from '@/stores/documentStore';
import { useUIStore } from '@/stores/uiStore';
import { fileService } from '@/services/fileService';
import { Document } from '@shared/types';
import { marked } from 'marked';

export function useKeyboardShortcuts() {
  const { addDocument, getActiveDocument, updateDocument, markAsSaved } = 
    useDocumentStore();
  const { toggleSettingsDialog } = useUIStore();

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;
      
      if (isCtrlOrCmd) {
        switch (event.key) {
          case 'n': {
            event.preventDefault();
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
            break;
          }
          case 'o': {
            event.preventDefault();
            const result = await fileService.openFile();
            if (result) {
              const doc: Document = {
                ...result,
                isModified: false,
                lastSaved: new Date(),
              };
              addDocument(doc);
            }
            break;
          }
          case 's': {
            event.preventDefault();
            const doc = getActiveDocument();
            if (!doc) {
              return;
            }

            if (!doc.filepath) {
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
            break;
          }
          case 'p': {
            event.preventDefault();
            // Print functionality
            const printDoc = getActiveDocument();
            if (!printDoc) {
              return;
            }
            
            try {
              const htmlContent = await marked(printDoc.content);
              await window.electronAPI.printDocument(htmlContent);
            } catch (error) {
              console.error('[Keyboard] Error printing document:', error);
            }
            break;
          }
          case ',':
            event.preventDefault();
            toggleSettingsDialog();
            break;
            
          case 'c':
            // Copy - let browser handle this naturally
            // No preventDefault needed - browser handles clipboard
            break;
            
          case 'x':
            // Cut - let browser handle this naturally
            // No preventDefault needed - browser handles clipboard
            break;
            
          case 'v':
            // Paste - let browser handle this naturally
            // No preventDefault needed - browser handles clipboard
            break;
            
          case 'a':
            // Select All - let browser handle this naturally
            // No preventDefault needed - browser handles selection
            break;
            
          case 'z':
            // Undo - let TipTap handle this naturally
            // No preventDefault needed - TipTap has built-in undo
            break;
            
          case 'y':
            // Redo - let TipTap handle this naturally
            // No preventDefault needed - TipTap has built-in redo
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [addDocument, getActiveDocument, updateDocument, markAsSaved, toggleSettingsDialog]);
}





