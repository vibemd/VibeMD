import { create } from 'zustand';
import { Settings } from '@shared/types';
import { settingsService } from '../services/settingsService';

interface SettingsState {
  settings: Settings;
  loading: boolean;
  loadSettings: () => Promise<void>;
  saveSettings: (newSettings: Partial<Settings>) => Promise<void>;
  updateGeneralSettings: (updates: Partial<Settings['general']>) => void;
  updateThemeSettings: (updates: Partial<Settings['theme']>) => void;
  updateFileSettings: (updates: Partial<Settings['files']>) => void;
  updateEditorSettings: (updates: Partial<Settings['editor']>) => void;
  resetPathsToDefaults: () => Promise<void>;
}

const defaultSettings: Settings = {
  general: {
    openLastDocument: true,
    autosave: true,
    autosaveInterval: 5,
  },
  theme: {
    currentTheme: 'system',
  },
  files: {
    defaultSavePath: null, // This will be set to user's documents path by default
    templatesLocation: null, // This will be set to user's documents path + /VibeMD/Templates
  },
  editor: {
    fontSize: 12, // Changed default from 16 to 12
    fontFamily: 'Arial', // Set default font family
    lineNumbers: false, // Removed line numbers by default
  },
  about: {
    version: '1.0.0',
    buildDate: new Date().toISOString(),
  },
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: defaultSettings,
  loading: true,

  loadSettings: async () => {
    set({ loading: true });
    const loadedSettings = await settingsService.loadSettings();

    // Get the user's documents path from the OS
    const userDocumentsPath = await window.electronAPI.getUserDocumentsPath();
    // Get app version from main process
    const appVersion = await window.electronAPI.getAppVersion();

    if (loadedSettings) {
      // Merge loaded settings with defaults
      const mergedSettings = { ...defaultSettings, ...loadedSettings };
      // Ensure about info reflects current build
      mergedSettings.about = {
        ...mergedSettings.about,
        version: appVersion,
        buildDate: new Date().toISOString(),
      };

      // Auto-initialize paths if they are null (first run or reset scenario)
      if (mergedSettings.files.defaultSavePath === null) {
        mergedSettings.files.defaultSavePath = userDocumentsPath;
      }

      if (mergedSettings.files.templatesLocation === null) {
        mergedSettings.files.templatesLocation = `${userDocumentsPath}/VibeMD/Templates`;
      }

      set({ settings: mergedSettings });

      // Save the updated settings if paths were auto-initialized
      if (loadedSettings.files?.defaultSavePath === null || loadedSettings.files?.templatesLocation === null) {
        await settingsService.saveSettings(mergedSettings);
      }
    } else {
      // First run - initialize with OS defaults
      const initialSettings: Settings = {
        ...defaultSettings,
        files: {
          defaultSavePath: userDocumentsPath,
          templatesLocation: `${userDocumentsPath}/VibeMD/Templates`,
        },
      };
      // Stamp version/build info
      initialSettings.about = {
        ...defaultSettings.about,
        version: appVersion,
        buildDate: new Date().toISOString(),
      };

      set({ settings: initialSettings });
      await settingsService.saveSettings(initialSettings);
    }

    set({ loading: false });
  },

  saveSettings: async (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
    await settingsService.saveSettings(get().settings);
  },

  updateGeneralSettings: (updates) => {
    set((state) => ({
      settings: {
        ...state.settings,
        general: { ...state.settings.general, ...updates },
      },
    }));
    settingsService.saveSettings(get().settings);
  },

  updateThemeSettings: (updates) => {
    set((state) => ({
      settings: {
        ...state.settings,
        theme: { ...state.settings.theme, ...updates },
      },
    }));
    settingsService.saveSettings(get().settings);
  },

  updateFileSettings: (updates) => {
    set((state) => ({
      settings: {
        ...state.settings,
        files: { ...state.settings.files, ...updates },
      },
    }));
    settingsService.saveSettings(get().settings);
  },

  updateEditorSettings: (updates) => {
    set((state) => ({
      settings: {
        ...state.settings,
        editor: { ...state.settings.editor, ...updates },
      },
    }));
    settingsService.saveSettings(get().settings);
  },

  resetPathsToDefaults: async () => {
    // Get the user's documents path from the OS
    const userDocumentsPath = await window.electronAPI.getUserDocumentsPath();

    // Reset paths to OS defaults
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
  },
}));
