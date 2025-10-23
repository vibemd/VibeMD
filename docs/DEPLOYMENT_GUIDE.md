# VibeMD Deployment Guide

## Automatic Path Initialization

VibeMD automatically initializes file paths to the user's operating system default documents folder when the application is first launched or when settings are reset.

### How It Works

1. **First Launch**: When VibeMD is launched for the first time, the settings store automatically detects that no settings file exists and initializes paths to OS defaults.

2. **Path Detection**: The application queries the operating system for the user's documents folder path using Electron's `app.getPath('documents')` API.

3. **Auto-Initialization**: The following paths are automatically set:
   - **Default Save Path**: Set to the user's Documents folder (e.g., `~/Documents` on macOS/Linux, `C:\Users\<username>\Documents` on Windows)
   - **Templates Location**: Set to `Documents/VibeMD/Templates`

4. **Null Path Handling**: If settings exist but paths are `null`, they will be automatically re-initialized on next load.

### Settings File Locations

The settings file (`settings.json`) is stored in the OS-specific application data directory:

| OS | Location |
|----|----------|
| **macOS** | `~/Library/Application Support/VibeMD/settings.json` |
| **Windows** | `%APPDATA%\VibeMD\settings.json` |
| **Linux** | `~/.config/VibeMD/settings.json` |

## Deployment Preparation

### For Fresh Deployments

When deploying VibeMD for the first time or creating a fresh installation package:

1. **Ensure Clean Build**: Remove any existing settings from your development environment before building.

2. **Use Reset Script**: Run the reset script to clear settings:
   ```bash
   ./scripts/reset-settings.sh
   ```

3. **Build Application**: Build the application using electron-forge:
   ```bash
   npm run make
   ```

4. **Verify**: The built application will automatically initialize paths on first launch for each user.

### For Updates/Upgrades

When users update from a previous version:

1. **Existing Settings Preserved**: User settings from the previous version will be preserved.

2. **Null Path Migration**: If any paths are `null` in the existing settings, they will be automatically initialized to OS defaults on next launch.

3. **No Manual Intervention Required**: Users don't need to take any action; paths are automatically detected and configured.

## Testing Path Initialization

### Test Fresh Installation

1. Remove existing settings file:
   ```bash
   ./scripts/reset-settings.sh
   ```

2. Launch VibeMD

3. Open Settings and verify:
   - Default Save Path is set to your OS documents folder
   - Templates Location is set to `Documents/VibeMD/Templates`

### Test Path Reset

You can programmatically reset paths to OS defaults using the store method:

```typescript
import { useSettingsStore } from '@/stores/settingsStore';

// Reset paths to OS defaults
await useSettingsStore.getState().resetPathsToDefaults();
```

## Implementation Details

### settingsStore.ts

The `loadSettings()` method in the settings store handles automatic path initialization:

```typescript
loadSettings: async () => {
  // Get user's documents path from OS
  const userDocumentsPath = await window.electronAPI.getUserDocumentsPath();

  if (loadedSettings) {
    // Auto-initialize null paths
    if (mergedSettings.files.defaultSavePath === null) {
      mergedSettings.files.defaultSavePath = userDocumentsPath;
    }
    if (mergedSettings.files.templatesLocation === null) {
      mergedSettings.files.templatesLocation = `${userDocumentsPath}/VibeMD/Templates`;
    }
  } else {
    // First run - initialize with OS defaults
    const initialSettings = {
      ...defaultSettings,
      files: {
        defaultSavePath: userDocumentsPath,
        templatesLocation: `${userDocumentsPath}/VibeMD/Templates`,
      },
    };
    set({ settings: initialSettings });
    await settingsService.saveSettings(initialSettings);
  }
}
```

### Reset Paths Method

A dedicated method is available to reset paths to OS defaults:

```typescript
resetPathsToDefaults: async () => {
  const userDocumentsPath = await window.electronAPI.getUserDocumentsPath();

  const updatedSettings = {
    ...get().settings,
    files: {
      ...get().settings.files,
      defaultSavePath: userDocumentsPath,
      templatesLocation: `${userDocumentsPath}/VibeMD/Templates`,
    },
  };

  set({ settings: updatedSettings });
  await settingsService.saveSettings(updatedSettings);
}
```

## Troubleshooting

### Paths Not Initializing

If paths are not initializing correctly:

1. Check that the Electron IPC handler is working:
   ```javascript
   // In main process (settingsHandlers.ts)
   ipcMain.handle('system:getUserDocumentsPath', async () => {
     return app.getPath('documents');
   });
   ```

2. Verify the preload script exposes the API:
   ```javascript
   // In preload/index.ts
   getUserDocumentsPath: () =>
     ipcRenderer.invoke('system:getUserDocumentsPath')
   ```

3. Check browser console for errors during settings load

### Manual Path Reset

If automatic initialization fails, users can manually set paths in Settings:

1. Open Settings (Cmd/Ctrl + ,)
2. Navigate to Files section
3. Click "Browse" to select custom paths

## Build Scripts

### scripts/pre-build.js

Informational script that documents the settings file location and initialization behavior.

### scripts/reset-settings.sh

Interactive script to remove the settings file for testing deployment behavior:

```bash
./scripts/reset-settings.sh
```

This script:
- Detects the OS
- Locates the settings file
- Shows current path settings
- Prompts for confirmation before deletion
- Provides information about re-initialization

## Platform-Specific Notes

### macOS

- Documents folder: `~/Documents`
- Settings location: `~/Library/Application Support/VibeMD/`
- Template path: `~/Documents/VibeMD/Templates`

## Release Artifacts & Versioning

- Official builds are published to the GitHub Releases page.
- Assets include Windows (ZIP, EXE, MSI), macOS (ZIP), and Linux (DEB, RPM).
- Filenames include platform, architecture, and semantic version. Example:
  - `VibeMD-win32-x64-1.2.3.msi`
  - `VibeMD-darwin-arm64-1.2.3.zip`
  - `vibemd_1.2.3_amd64.deb`
- Releases are immutable; if a tag already exists, the automation bumps the patch version to avoid conflicts.

### Windows

- Documents folder: `C:\Users\<username>\Documents`
- Settings location: `%APPDATA%\VibeMD\`
- Template path: `C:\Users\<username>\Documents\VibeMD\Templates`

### Linux

- Documents folder: `~/Documents`
- Settings location: `~/.config/VibeMD/`
- Template path: `~/Documents/VibeMD/Templates`

## Security Considerations

- The application only accesses standard OS documents folders
- No privileged paths are accessed
- Users can change paths to any location they have access to
- Path validation should be performed when users select custom locations

## Conclusion

VibeMD's automatic path initialization ensures a smooth user experience across all platforms. The system is designed to:

✅ Work out-of-the-box on first launch
✅ Respect OS-specific file system conventions
✅ Allow user customization when needed
✅ Handle migrations and resets gracefully
✅ Require no manual configuration for standard use cases

For questions or issues, please consult the main README or open an issue on the project repository.
