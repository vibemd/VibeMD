import { ipcMain, dialog } from 'electron';

// Dialog handlers for user input
ipcMain.handle('dialog:prompt', async (event, title: string, message: string, defaultValue: string = '') => {
  try {
    // For now, return the default value since Electron doesn't have a built-in prompt
    // In a real implementation, you'd want to create a custom dialog window
    return defaultValue;
  } catch (error) {
    console.error('Error showing prompt dialog:', error);
    return null;
  }
});
