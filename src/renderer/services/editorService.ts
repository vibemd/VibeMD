// Service to manage editor state and content saving
class EditorService {
  private saveCurrentContentCallback: (() => void) | null = null;

  setSaveCurrentContentCallback(callback: () => void) {
    this.saveCurrentContentCallback = callback;
  }

  saveCurrentContent() {
    if (this.saveCurrentContentCallback) {
      this.saveCurrentContentCallback();
    }
  }

  clearSaveCallback() {
    this.saveCurrentContentCallback = null;
  }
}

export const editorService = new EditorService();



