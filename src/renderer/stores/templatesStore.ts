import { create } from 'zustand';
import { Template } from '@shared/types';

interface TemplatesStore {
  templates: Template[];
  loading: boolean;
  
  loadTemplates: (dirPath: string) => Promise<void>;
  addTemplate: (template: Template) => void;
  removeTemplate: (id: string) => void;
}

export const useTemplatesStore = create<TemplatesStore>((set) => ({
  templates: [],
  loading: false,

  loadTemplates: async (dirPath) => {
    set({ loading: true });
    try {
      const templates = await window.electronAPI.readTemplates(dirPath);
      set({ templates, loading: false });
    } catch (error) {
      console.error('Error loading templates:', error);
      set({ loading: false });
    }
  },

  addTemplate: (template) =>
    set((state) => ({ 
      templates: [...state.templates, template] 
    })),

  removeTemplate: (id) =>
    set((state) => ({ 
      templates: state.templates.filter((t) => t.id !== id) 
    })),
}));




