import { ipcMain, app, BrowserWindow } from 'electron';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import type { SerializableSettings } from '@shared/types';

console.log('[Main] Settings handlers module loaded');

// Test handler to verify IPC is working
ipcMain.handle('test:ping', async () => {
  console.log('[Main] Test ping handler called');
  return 'pong';
});

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

ipcMain.handle('settings:save', async (event, settings: SerializableSettings) => {
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
  console.log('[Main] Print handler called with HTML content length:', htmlContent.length);
  try {
    const mainWindow = BrowserWindow.fromWebContents(event.sender);
    if (!mainWindow) {
      console.error('[Main] Main window not found');
      throw new Error('Main window not found');
    }
    console.log('[Main] Main window found:', mainWindow.id);

    // Create a simple HTML document for printing
    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Print Document</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1, h2, h3, h4, h5, h6 { color: #333; }
            code { background: #f5f5f5; padding: 2px 4px; }
            pre { background: #f5f5f5; padding: 10px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;

    // Create a temporary window for printing
    console.log('[Main] Creating print window...');
    const printWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      }
    });
    console.log('[Main] Print window created:', printWindow.id);

    // Set up the did-finish-load listener BEFORE loading content
    // to avoid race condition
    const contentLoadedPromise = new Promise<void>((resolve) => {
      printWindow.webContents.once('did-finish-load', () => {
        console.log('[Main] Content finished loading');
        resolve();
      });
    });

    // Load the HTML content into the print window
    console.log('[Main] Loading HTML content into print window...');
    await printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(printHTML)}`);
    console.log('[Main] HTML content loaded');

    // Wait for the content to finish loading before printing
    await contentLoadedPromise;

    console.log('[Main] Starting print process...');
    // Show the print dialog
    const printOptions = {
      silent: false,
      printBackground: true,
      color: true,
      margin: {
        marginType: 'default'
      },
      landscape: false,
      pagesPerSheet: 1,
      collate: true,
      copies: 1,
      header: '',
      footer: ''
    };

    console.log('[Main] Calling printWindow.webContents.print...');
    // Print from the hidden window with callback
    printWindow.webContents.print(printOptions, (success, failureReason) => {
      if (success) {
        console.log('[Main] Print initiated successfully');
      } else {
        console.error('[Main] Print failed:', failureReason);
      }
      
      // Close the print window after printing
      setTimeout(() => {
        printWindow.close();
        console.log('[Main] Print window closed');
      }, 2000);
    });
    console.log('[Main] Print dialog should have appeared');
    
    console.log('[Main] Print handler completed successfully');
    return true;
  } catch (error) {
    console.error('[Main] Error printing document:', error);
    throw error;
  }
});
