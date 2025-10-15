const { contextBridge, ipcRenderer } = require('electron');

// Minimal preload script - no webpack processing
const electronAPI = {
  fileNew: () => ipcRenderer.invoke('file:new'),
  fileOpen: () => ipcRenderer.invoke('file:open'),
  fileSave: (filepath, content) => ipcRenderer.invoke('file:save', filepath, content),
  fileSaveAs: (content, defaultPath) => ipcRenderer.invoke('file:saveAs', content, defaultPath),
  fileRead: (filepath) => ipcRenderer.invoke('file:read', filepath),
  selectFolder: () => ipcRenderer.invoke('dir:selectFolder'),
  readTemplates: (dirPath) => ipcRenderer.invoke('dir:readTemplates', dirPath),
  getUserDocumentsPath: () => ipcRenderer.invoke('system:getUserDocumentsPath'),
  loadSettings: () => ipcRenderer.invoke('settings:load'),
  saveSettings: (settings) => ipcRenderer.invoke('settings:save', settings),
  printDocument: (htmlContent) => ipcRenderer.invoke('print:document', htmlContent),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);




