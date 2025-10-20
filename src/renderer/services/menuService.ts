import { useEffect } from 'react';
import { useDocumentStore } from '../stores/documentStore';
import { useUIStore } from '../stores/uiStore';
import { fileService } from './fileService';
import { Document } from '@shared/types';
import { marked } from 'marked';

export function useMenuService() {
  const { addDocument, getActiveDocument, updateDocument, markAsSaved } = useDocumentStore();
  const { toggleSettingsDialog } = useUIStore();

  useEffect(() => {
    const handleMenuEvent = async (event: any, menuAction: string) => {
      console.log('[Menu] Received menu event:', menuAction);
      
      switch (menuAction) {
        case 'menu-new-file':
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
          
        case 'menu-open-file':
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
          
        case 'menu-save-file':
          const saveDoc = getActiveDocument();
          if (!saveDoc) return;

          if (!saveDoc.filepath) {
            const filepath = await fileService.saveFileAs(saveDoc.content);
            if (filepath) {
              updateDocument(saveDoc.id, { filepath });
              await fileService.saveFile(filepath, saveDoc.content);
              markAsSaved(saveDoc.id);
            }
          } else {
            await fileService.saveFile(saveDoc.filepath, saveDoc.content);
            markAsSaved(saveDoc.id);
          }
          break;
          
        case 'menu-save-as-file':
          const saveAsDoc = getActiveDocument();
          if (!saveAsDoc) return;

          const filepath = await fileService.saveFileAs(saveAsDoc.content);
          if (filepath) {
            updateDocument(saveAsDoc.id, { filepath });
            await fileService.saveFile(filepath, saveAsDoc.content);
            markAsSaved(saveAsDoc.id);
          }
          break;
          
        case 'menu-print-file':
          const printDoc = getActiveDocument();
          if (!printDoc) return;
          
          try {
            const htmlContent = await marked(printDoc.content);
            await window.electronAPI.printDocument(htmlContent);
          } catch (error) {
            console.error('[Menu] Error printing document:', error);
          }
          break;
      }
    };

    // Listen for menu events from main process
    if (window.electronAPI && window.electronAPI.onMenuEvent) {
      window.electronAPI.onMenuEvent(handleMenuEvent);
    }

    return () => {
      // Cleanup listeners
      if (window.electronAPI && window.electronAPI.removeMenuEventListener) {
        window.electronAPI.removeMenuEventListener(handleMenuEvent);
      }
    };
  }, [addDocument, getActiveDocument, updateDocument, markAsSaved, toggleSettingsDialog]);
}
