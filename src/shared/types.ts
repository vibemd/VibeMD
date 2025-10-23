export interface NewDocumentDialogData {
  filename: string;
  saveAsTemplate: boolean;
}

export interface NewFileFromTemplateDialogData {
  filename: string;
  createNewTemplate: boolean;
}

export interface ElectronAPI {
  fileNew: () => Promise<string>;
  fileOpen: (defaultPath?: string) => Promise<{ filepath: string; filename: string; content: string; isTemplate: boolean } | null>;
  fileSave: (filepath: string, content: string) => Promise<boolean>;
  fileSaveAs: (content: string, defaultPath?: string, suggestedFilename?: string) => Promise<string | null>;
  fileRead: (filepath: string) => Promise<string | null>;
  fileOpenFromPath: (filepath: string) => Promise<{ filepath: string; filename: string; content: string; isTemplate: boolean } | null>;
  selectFolder: () => Promise<string | null>;
  readTemplates: (dirPath: string) => Promise<Template[]>;
  getUserDocumentsPath: () => Promise<string>;
  loadSettings: () => Promise<Settings | null>;
  saveSettings: (settings: Settings) => Promise<boolean>;
  printDocument: (htmlContent: string) => Promise<void>;
  checkUnsavedChanges: () => Promise<boolean>;
  showCloseConfirmation: () => Promise<boolean>;
  getAppVersion: () => Promise<string>;
  testPing: () => Promise<string>;
  onMenuEvent: (callback: (event: any, menuAction: string) => void) => void;
  removeMenuEventListener: (callback: (event: any, menuAction: string) => void) => void;
  onOpenFileFromAssociation: (callback: (event: any, filepath: string) => void) => void;
  removeOpenFileFromAssociationListener: (callback: (event: any, filepath: string) => void) => void;
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
