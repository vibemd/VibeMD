import { ipcMain, dialog } from 'electron';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { app } from 'electron';

// File operations
ipcMain.handle('file:new', async () => {
  // Generate a unique ID for the new file
  return `untitled-${Date.now()}`;
});

ipcMain.handle('file:open', async (event, defaultPath?: string) => {
  const result = await dialog.showOpenDialog({
    defaultPath: defaultPath || undefined,
    properties: ['openFile'],
    filters: [
      { name: 'Markdown Files', extensions: ['md', 'markdown'] },
      { name: 'Template Files', extensions: ['vibe'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filepath = result.filePaths[0];
    try {
      const content = await readFile(filepath, 'utf-8');
      const filename = filepath.split('/').pop() || 'Untitled.md';
      const isTemplate = filepath.endsWith('.vibe');
      return {
        filename,
        filepath,
        content,
        isTemplate
      };
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  }
  return null;
});

ipcMain.handle('file:save', async (event, filepath: string, content: string) => {
  try {
    await writeFile(filepath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving file:', error);
    throw error;
  }
});

ipcMain.handle('file:saveAs', async (event, content: string, defaultPath?: string, suggestedFilename?: string) => {
  console.log('[FileHandler] saveAs called with suggestedFilename:', suggestedFilename);
  const defaultFilename = suggestedFilename || 'untitled.md';
  console.log('[FileHandler] Using filename:', defaultFilename);
  
  // Construct the full default path
  const documentsPath = app.getPath('documents');
  const fullDefaultPath = defaultPath ? join(defaultPath, defaultFilename) : join(documentsPath, defaultFilename);
  console.log('[FileHandler] Full default path:', fullDefaultPath);
  
  const result = await dialog.showSaveDialog({
    defaultPath: fullDefaultPath,
    filters: [
      { name: 'Markdown Files', extensions: ['md', 'markdown'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!result.canceled && result.filePath) {
    try {
      await writeFile(result.filePath, content, 'utf-8');
      return result.filePath;
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  }
  return null;
});

ipcMain.handle('file:read', async (event, filepath: string) => {
  try {
    const content = await readFile(filepath, 'utf-8');
    return content;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
});

