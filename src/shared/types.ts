export interface ElectronAPI {
  fileNew: () => Promise<string>;
  fileOpen: () => Promise<{ filepath: string; filename: string; content: string; isTemplate: boolean } | null>;
  fileSave: (filepath: string, content: string) => Promise<boolean>;
  fileSaveAs: (content: string, defaultPath?: string) => Promise<string | null>;
  fileRead: (filepath: string) => Promise<string | null>;
  selectFolder: () => Promise<string | null>;
  readTemplates: (dirPath: string) => Promise<Template[]>;
  getUserDocumentsPath: () => Promise<string>;
  loadSettings: () => Promise<Settings | null>;
  saveSettings: (settings: Settings) => Promise<boolean>;
  printDocument: (htmlContent: string) => Promise<void>;
  checkUnsavedChanges: () => Promise<boolean>;
  showCloseConfirmation: () => Promise<boolean>;
}

export interface Document {
  id: string;
  filename: string;
  filepath: string | null;
  content: string;
  isModified: boolean;
  lastSaved: Date | null;
  isTemplate: boolean;
}

export interface Template {
  id: string;
  filename: string;
  filepath: string;
  content: string;
}

export interface Settings {
  general: {
    openLastDocument: boolean;
    autosave: boolean;
    autosaveInterval: number;
  };
  theme: {
    currentTheme: 'light' | 'dark' | 'system';
  };
  files: {
    defaultSavePath: string | null;
    templatesLocation: string | null;
  };
  editor: {
    fontSize: number;
    fontFamily: string;
    lineNumbers: boolean;
    latexSupport: boolean;
  };
  about: {
    version: string;
    buildDate: string;
  };
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
