import { ipcMain, dialog } from 'electron';
import { readdir, stat } from 'fs/promises';
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
        templates.push({
          name: file.replace('.vibe', ''),
          path: filePath
        });
      }
    }

    return templates;
  } catch (error) {
    console.error('Error reading templates directory:', error);
    return [];
  }
});

