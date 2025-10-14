import { ipcMain, app } from 'electron';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

// Settings operations
ipcMain.handle('settings:load', async () => {
  try {
    const settingsPath = join(app.getPath('userData'), 'settings.json');
    const data = await readFile(settingsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Return default settings if file doesn't exist
    return {
      theme: 'light',
      fontSize: 14,
      fontFamily: 'system',
      autoSave: true,
      wordWrap: true,
      showLineNumbers: true,
      tabSize: 2,
      insertSpaces: true
    };
  }
});

ipcMain.handle('settings:save', async (event, settings: any) => {
  try {
    const settingsPath = join(app.getPath('userData'), 'settings.json');
    await writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
});

// System operations
ipcMain.handle('system:getUserDocumentsPath', async () => {
  return app.getPath('documents');
});

// Print operations
ipcMain.handle('print:document', async (event, htmlContent: string) => {
  // This is a placeholder - in a real implementation, you'd use electron's printing API
  console.log('Print document requested:', htmlContent);
  return true;
});

