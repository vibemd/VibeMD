import { create } from 'zustand';

type EditorMode = 'wysiwyg' | 'split' | 'preview' | 'plain';
type SidebarTab = 'files' | 'outline' | 'templates';

interface UIStore {
  editorMode: EditorMode;
  sidebarTab: SidebarTab;
  settingsDialogOpen: boolean;
  sidebarCollapsed: boolean;
  
  setEditorMode: (mode: EditorMode) => void;
  setSidebarTab: (tab: SidebarTab) => void;
  toggleSettingsDialog: () => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  editorMode: 'wysiwyg',
  sidebarTab: 'files',
  settingsDialogOpen: false,
  sidebarCollapsed: false,

  setEditorMode: (mode) => set({ editorMode: mode }),
  setSidebarTab: (tab) => set({ sidebarTab: tab }),
  toggleSettingsDialog: () => 
    set((state) => ({ settingsDialogOpen: !state.settingsDialogOpen })),
  toggleSidebar: () => 
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));








