import { create } from 'zustand';

type EditorMode = 'wysiwyg' | 'split' | 'preview' | 'plain';
type SidebarTab = 'files' | 'outline' | 'templates';

export interface FindMatch {
  from: number;
  to: number;
}

interface UIStore {
  editorMode: EditorMode;
  sidebarTab: SidebarTab;
  settingsDialogOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Find state
  findQuery: string;
  findMatches: FindMatch[];
  currentMatchIndex: number;
  findBarVisible: boolean;
  
  setEditorMode: (mode: EditorMode) => void;
  setSidebarTab: (tab: SidebarTab) => void;
  toggleSettingsDialog: () => void;
  toggleSidebar: () => void;
  
  // Find actions
  setFindQuery: (query: string) => void;
  setFindMatches: (matches: FindMatch[]) => void;
  setCurrentMatchIndex: (index: number) => void;
  toggleFindBar: () => void;
  showFindBar: () => void;
  hideFindBar: () => void;
  nextMatch: () => void;
  previousMatch: () => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  editorMode: 'wysiwyg',
  sidebarTab: 'files',
  settingsDialogOpen: false,
  sidebarCollapsed: false,

  // Find state
  findQuery: '',
  findMatches: [],
  currentMatchIndex: -1,
  findBarVisible: false,

  setEditorMode: (mode) => set({ editorMode: mode }),
  setSidebarTab: (tab) => set({ sidebarTab: tab }),
  toggleSettingsDialog: () => 
    set((state) => ({ settingsDialogOpen: !state.settingsDialogOpen })),
  toggleSidebar: () => 
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  
  // Find actions
  setFindQuery: (query) => set({ findQuery: query, currentMatchIndex: -1 }),
  setFindMatches: (matches) => set({ findMatches: matches, currentMatchIndex: matches.length > 0 ? 0 : -1 }),
  setCurrentMatchIndex: (index) => set({ currentMatchIndex: index }),
  toggleFindBar: () => set((state) => ({ findBarVisible: !state.findBarVisible })),
  showFindBar: () => set({ findBarVisible: true }),
  hideFindBar: () => set({ findBarVisible: false, findQuery: '', findMatches: [], currentMatchIndex: -1 }),
  nextMatch: () => {
    const { findMatches, currentMatchIndex } = get();
    if (findMatches.length === 0) return;
    const nextIndex = currentMatchIndex < findMatches.length - 1 ? currentMatchIndex + 1 : 0;
    set({ currentMatchIndex: nextIndex });
  },
  previousMatch: () => {
    const { findMatches, currentMatchIndex } = get();
    if (findMatches.length === 0) return;
    const prevIndex = currentMatchIndex > 0 ? currentMatchIndex - 1 : findMatches.length - 1;
    set({ currentMatchIndex: prevIndex });
  },
}));








