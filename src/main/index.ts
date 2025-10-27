import * as path from 'path';
import * as fs from 'fs';

// CRITICAL FIX: Set ICU_DATA_FILE environment variable BEFORE importing Electron
// Chromium reads this on startup, before any JavaScript runs
if (process.platform === 'win32') {
  // Determine the directory where the executable is located
  const exeDir = path.dirname(process.execPath);
  const icuDataPath = path.join(exeDir, 'icudtl.dat');

  console.log('[ICU] Pre-Electron ICU configuration for Windows x64');
  console.log('[ICU] Process executable:', process.execPath);
  console.log('[ICU] Executable directory:', exeDir);
  console.log('[ICU] Expected ICU data path:', icuDataPath);

  // Try to find ICU data file
  let foundPath: string | null = null;

  if (fs.existsSync(icuDataPath)) {
    foundPath = icuDataPath;
  } else {
    // Try alternative locations (for development vs production)
    const altPaths = [
      path.join(exeDir, 'resources', 'icudtl.dat'),
      path.join(exeDir, '..', 'icudtl.dat'),
    ];

    for (const altPath of altPaths) {
      if (fs.existsSync(altPath)) {
        foundPath = altPath;
        break;
      }
    }
  }

  if (foundPath) {
    // Set the environment variable that Chromium reads
    process.env.ICU_DATA_FILE = foundPath;
    console.log('[ICU] ✓ ICU data file found:', foundPath);
    console.log('[ICU] ✓ File size:', fs.statSync(foundPath).size, 'bytes');
    console.log('[ICU] ✓ Set ICU_DATA_FILE environment variable');
  } else {
    console.error('[ICU] ✗ ERROR: ICU data file not found!');
    console.error('[ICU] Searched locations:');
    console.error('[ICU]   -', icuDataPath);
    console.error('[ICU]   -', path.join(exeDir, 'resources', 'icudtl.dat'));
    console.error('[ICU]   -', path.join(exeDir, '..', 'icudtl.dat'));
  }
}

// Now import Electron - ICU should be configured
import { app, BrowserWindow, Menu, nativeImage } from 'electron';
import type { MenuItemConstructorOptions } from 'electron';
import { createMainWindow } from './window';
import './handlers'; // Import IPC handlers

// Windows ICU command line switch as backup
if (process.platform === 'win32' && process.env.ICU_DATA_FILE) {
  const icuDir = path.dirname(process.env.ICU_DATA_FILE);
  app.commandLine.appendSwitch('icu-data-dir', icuDir);
  console.log('[ICU] ✓ Set command line switch icu-data-dir:', icuDir);
}

// Set app name for macOS navbar and dock
app.setName('VibeMD');

// Set dock icon for macOS
if (process.platform === 'darwin') {
  // Avoid macOS keychain prompts when unsigned by using Chromium's mock keychain
  // Until we ship fully signed builds, we don't need encrypted cookie storage.
  app.commandLine.appendSwitch('use-mock-keychain');

  const iconPath = path.join(app.getAppPath(), 'build', 'icons', 'icon.png');
  console.log('Attempting to set dock icon from:', iconPath);
  console.log('Icon file exists:', fs.existsSync(iconPath));

  if (fs.existsSync(iconPath)) {
    const icon = nativeImage.createFromPath(iconPath);
    app.dock?.setIcon(icon);
    console.log('Dock icon set successfully');
  } else {
    console.error('Icon file not found at:', iconPath);
  }
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;

// Store file path to open on launch (for file associations)
let fileToOpen: string | null = null;

// Handle file opening on macOS (open-file event)
app.on('open-file', (event, path) => {
  event.preventDefault();
  console.log('[File Association] open-file event received:', path);

  if (mainWindow) {
    // Window is already open, send file path to renderer
    mainWindow.webContents.send('open-file-from-association', path);
  } else {
    // Window not yet created, store path for later
    fileToOpen = path;
  }
});

// Handle file opening on Windows/Linux (via command line arguments)
if (process.platform === 'win32' || process.platform === 'linux') {
  // Check if a file path was passed as command line argument
  const args = process.argv.slice(1);
  if (args.length > 0 && !args[0].startsWith('--') && (args[0].endsWith('.md') || args[0].endsWith('.markdown') || args[0].endsWith('.vibe'))) {
    fileToOpen = args[0];
    console.log('[File Association] File to open from command line:', fileToOpen);
  }
}

app.on('ready', () => {
  mainWindow = createMainWindow();

  // If a file was queued to open, send it to the renderer after window is ready
  if (fileToOpen && mainWindow) {
    console.log('[File Association] Sending queued file to renderer:', fileToOpen);
    // Give the renderer time to initialize
    setTimeout(() => {
      mainWindow?.webContents.send('open-file-from-association', fileToOpen);
      fileToOpen = null;
    }, 1000);
  }
  
  // Set application menu for macOS
  if (process.platform === 'darwin') {
    const template: MenuItemConstructorOptions[] = [
      {
        label: 'VibeMD',
        submenu: [
          { label: 'About VibeMD', role: 'about' },
          { type: 'separator' },
          { label: 'Services', role: 'services' },
          { type: 'separator' },
          { label: 'Hide VibeMD', accelerator: 'Command+H', role: 'hide' },
          { label: 'Hide Others', accelerator: 'Command+Shift+H', role: 'hideOthers' },
          { label: 'Show All', role: 'unhide' },
          { type: 'separator' },
          { label: 'Quit', accelerator: 'Command+Q', click: () => app.quit() }
        ]
      },
      {
        label: 'File',
        submenu: [
          { label: 'New', accelerator: 'Command+N', click: () => mainWindow?.webContents.send('menu-event', 'menu-new-file') },
          { label: 'Open', accelerator: 'Command+O', click: () => mainWindow?.webContents.send('menu-event', 'menu-open-file') },
          { label: 'Save', accelerator: 'Command+S', click: () => mainWindow?.webContents.send('menu-event', 'menu-save-file') },
          { label: 'Save As', accelerator: 'Command+Shift+S', click: () => mainWindow?.webContents.send('menu-event', 'menu-save-as-file') },
          { type: 'separator' },
          { label: 'Print', accelerator: 'Command+P', click: () => mainWindow?.webContents.send('menu-event', 'menu-print-file') },
          { type: 'separator' },
          { label: 'Close', accelerator: 'Command+W', role: 'close' }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { label: 'Undo', accelerator: 'Command+Z', role: 'undo' },
          { label: 'Redo', accelerator: 'Command+Shift+Z', role: 'redo' },
          { type: 'separator' },
          { label: 'Cut', accelerator: 'Command+X', role: 'cut' },
          { label: 'Copy', accelerator: 'Command+C', role: 'copy' },
          { label: 'Paste', accelerator: 'Command+V', role: 'paste' },
          { label: 'Select All', accelerator: 'Command+A', role: 'selectAll' }
        ]
      },
      {
        label: 'View',
        submenu: [
          { label: 'Reload', accelerator: 'Command+R', role: 'reload' },
          { label: 'Force Reload', accelerator: 'Command+Shift+R', role: 'forceReload' },
          { label: 'Toggle Developer Tools', accelerator: 'F12', role: 'toggleDevTools' },
          { type: 'separator' },
          { label: 'Actual Size', accelerator: 'Command+0', role: 'resetZoom' },
          { label: 'Zoom In', accelerator: 'Command+Plus', role: 'zoomIn' },
          { label: 'Zoom Out', accelerator: 'Command+-', role: 'zoomOut' },
          { type: 'separator' },
          { label: 'Toggle Fullscreen', accelerator: 'Control+Command+F', role: 'togglefullscreen' }
        ]
      },
      {
        label: 'Window',
        submenu: [
          { label: 'Minimize', accelerator: 'Command+M', role: 'minimize' },
          { label: 'Close', accelerator: 'Command+W', role: 'close' }
        ]
      }
    ];
    
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createMainWindow();
  }
});
