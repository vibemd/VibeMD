import { Settings } from '@shared/types';

export class SettingsService {
  async loadSettings(): Promise<Settings | null> {
    return await window.electronAPI.loadSettings();
  }

  async saveSettings(settings: Settings): Promise<boolean> {
    return await window.electronAPI.saveSettings(settings);
  }
}

export const settingsService = new SettingsService();






