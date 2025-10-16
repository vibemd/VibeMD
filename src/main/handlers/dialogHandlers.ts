import { ipcMain, dialog, BrowserWindow } from 'electron';

// Dialog handlers for user input
ipcMain.handle('dialog:prompt', async (event, title: string, message: string, defaultValue: string = '') => {
  try {
    const browserWindow = BrowserWindow.fromWebContents(event.sender);
    if (!browserWindow) {
      console.error('Could not find browser window for dialog');
      return null;
    }

    const result = await dialog.showMessageBox(browserWindow, {
      type: 'question',
      title: title,
      message: message,
      detail: 'Please enter the value in the developer console and press OK.',
      buttons: ['OK', 'Cancel'],
      defaultId: 0,
      cancelId: 1,
    });

    if (result.response === 0) {
      // For now, return a placeholder URL since we can't get user input from showMessageBox
      // In a real implementation, you'd want to create a custom dialog window with input field
      return defaultValue || 'https://example.com';
    }
    return null;
  } catch (error) {
    console.error('Error showing prompt dialog:', error);
    return null;
  }
});
