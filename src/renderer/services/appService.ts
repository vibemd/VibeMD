import { useDocumentStore } from '../stores/documentStore';

// Service to expose app-level functionality to the main process
export class AppService {
  static hasUnsavedChanges(): boolean {
    const { hasUnsavedChanges } = useDocumentStore.getState();
    return hasUnsavedChanges();
  }
}

declare global {
  interface Window {
    appService?: typeof AppService;
  }
}

// Expose to window for main process access
if (typeof window !== 'undefined') {
  window.appService = AppService;
}

export {};
