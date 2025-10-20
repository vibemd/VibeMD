import { contextBridge, ipcRenderer } from 'electron';

// Simple preload script without any Node.js globals
const electronAPI = {
  // File operations
  fileNew: () => ipcRenderer.invoke('file:new'),
  fileOpen: (defaultPath?: string) => ipcRenderer.invoke('file:open', defaultPath),
  fileSave: (filepath: string, content: string) => 
    ipcRenderer.invoke('file:save', filepath, content),
  fileSaveAs: (content: string, defaultPath?: string, suggestedFilename?: string) => 
    ipcRenderer.invoke('file:saveAs', content, defaultPath, suggestedFilename),
  fileRead: (filepath: string) => 
    ipcRenderer.invoke('file:read', filepath),
  
  // Directory operations
  selectFolder: () => ipcRenderer.invoke('dir:selectFolder'),
  readTemplates: (dirPath: string) => 
    ipcRenderer.invoke('dir:readTemplates', dirPath),
  
  // System operations
  getUserDocumentsPath: () => 
    ipcRenderer.invoke('system:getUserDocumentsPath'),
  
  // Settings operations
  loadSettings: () => ipcRenderer.invoke('settings:load'),
  saveSettings: (settings: any) => 
    ipcRenderer.invoke('settings:save', settings),
  
  // Print operations
  printDocument: (htmlContent: string) => 
    ipcRenderer.invoke('print:document', htmlContent),
  
  // Test operations
  testPing: () => 
    ipcRenderer.invoke('test:ping'),
  
  // App operations
  checkUnsavedChanges: () => ipcRenderer.invoke('app:checkUnsavedChanges'),
  showCloseConfirmation: () => ipcRenderer.invoke('app:showCloseConfirmation'),
  
  // Menu event handling
  onMenuEvent: (callback: (event: any, menuAction: string) => void) => {
    ipcRenderer.on('menu-event', callback);
  },
  removeMenuEventListener: (callback: (event: any, menuAction: string) => void) => {
    ipcRenderer.removeListener('menu-event', callback);
  },
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', electronAPI);