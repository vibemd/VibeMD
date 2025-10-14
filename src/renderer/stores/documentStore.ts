import { create } from 'zustand';
import { Document } from '@shared/types';

interface DocumentStore {
  documents: Map<string, Document>;
  activeDocumentId: string | null;
  
  addDocument: (doc: Document) => void;
  removeDocument: (id: string) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  setActiveDocument: (id: string) => void;
  getActiveDocument: () => Document | null;
  markAsModified: (id: string) => void;
  markAsSaved: (id: string) => void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: new Map(),
  activeDocumentId: null,

  addDocument: (doc) =>
    set((state) => {
      const newDocs = new Map(state.documents);
      newDocs.set(doc.id, doc);
      return { 
        documents: newDocs,
        activeDocumentId: doc.id 
      };
    }),

  removeDocument: (id) =>
    set((state) => {
      const newDocs = new Map(state.documents);
      newDocs.delete(id);
      
      let newActiveId = state.activeDocumentId;
      if (state.activeDocumentId === id) {
        const remaining = Array.from(newDocs.keys());
        newActiveId = remaining.length > 0 ? remaining[0] : null;
      }
      
      return { 
        documents: newDocs,
        activeDocumentId: newActiveId 
      };
    }),

  updateDocument: (id, updates) =>
    set((state) => {
      const doc = state.documents.get(id);
      if (!doc) return state;

      const newDocs = new Map(state.documents);
      newDocs.set(id, { ...doc, ...updates });
      return { documents: newDocs };
    }),

  setActiveDocument: (id) =>
    set({ activeDocumentId: id }),

  getActiveDocument: () => {
    const state = get();
    if (!state.activeDocumentId) return null;
    return state.documents.get(state.activeDocumentId) || null;
  },

  markAsModified: (id) =>
    set((state) => {
      const doc = state.documents.get(id);
      if (!doc) return state;

      const newDocs = new Map(state.documents);
      newDocs.set(id, { ...doc, isModified: true });
      return { documents: newDocs };
    }),

  markAsSaved: (id) =>
    set((state) => {
      const doc = state.documents.get(id);
      if (!doc) return state;

      const newDocs = new Map(state.documents);
      newDocs.set(id, { 
        ...doc, 
        isModified: false,
        lastSaved: new Date()
      });
      return { documents: newDocs };
    }),
}));



