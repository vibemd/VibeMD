import { create } from 'zustand';

type EditorMode = 'wysiwyg' | 'split' | 'preview';
type SidebarTab = 'files' | 'outline' | 'templates';

interface UIStore {
  editorMode: EditorMode;
  sidebarTab: SidebarTab;
  settingsDialogOpen: boolean;
  
  setEditorMode: (mode: EditorMode) => void;
  setSidebarTab: (tab: SidebarTab) => void;
  toggleSettingsDialog: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  editorMode: 'wysiwyg',
  sidebarTab: 'files',
  settingsDialogOpen: false,

  setEditorMode: (mode) => set({ editorMode: mode }),
  setSidebarTab: (tab) => set({ sidebarTab: tab }),
  toggleSettingsDialog: () => 
    set((state) => ({ settingsDialogOpen: !state.settingsDialogOpen })),
}));







