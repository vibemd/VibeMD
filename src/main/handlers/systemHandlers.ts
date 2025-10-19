import { ipcMain, dialog, BrowserWindow } from 'electron';
import { readdir, stat, readFile } from 'fs/promises';
import { join, extname } from 'path';

// Directory operations
ipcMain.handle('dir:selectFolder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle('dir:readTemplates', async (event, dirPath: string) => {
  try {
    const files = await readdir(dirPath);
    const templates = [];

    for (const file of files) {
      const filePath = join(dirPath, file);
      const stats = await stat(filePath);

      if (stats.isFile() && extname(file) === '.vibe') {
        try {
          const content = await readFile(filePath, 'utf-8');
          templates.push({
            id: filePath, // Use filepath as unique ID
            filename: file,
            filepath: filePath,
            content: content
          });
        } catch (readError) {
          console.error(`Error reading template file ${file}:`, readError);
          // Skip this template if we can't read it
        }
      }
    }

    return templates;
  } catch (error) {
    console.error('Error reading templates directory:', error);
    return [];
  }
});

// App close confirmation
ipcMain.handle('app:checkUnsavedChanges', async () => {
  const mainWindow = BrowserWindow.getFocusedWindow();
  if (!mainWindow) return false;

  // Send message to renderer to check for unsaved changes
  const hasUnsaved = await mainWindow.webContents.executeJavaScript(`
    window.appService?.hasUnsavedChanges?.() || false
  `);
  
  return hasUnsaved;
});

ipcMain.handle('app:showCloseConfirmation', async () => {
  const result = await dialog.showMessageBox({
    type: 'warning',
    title: 'Unsaved Changes',
    message: 'Unsaved Changes',
    detail: 'There are unsaved changes in open files. Do you wish to save these?',
    buttons: ['No', 'Yes'],
    defaultId: 1, // Default to "Yes" (cancel close)
    cancelId: 0   // "No" cancels the dialog
  });

  return result.response === 0; // 0 = No (allow close), 1 = Yes (cancel close)
});

