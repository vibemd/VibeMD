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
    latexSupport: false,
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
    if (loadedSettings) {
      set({ settings: { ...defaultSettings, ...loadedSettings } });
    } else {
      // If no settings found, keep paths blank - user must set them on first use
      set({ settings: defaultSettings });
      await settingsService.saveSettings(get().settings); // Save initial settings
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
}));