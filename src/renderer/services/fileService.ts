import { Document } from '@shared/types';

export class FileService {
  private generateId(): string {
    return `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async createNewFile(): Promise<string> {
    return this.generateId();
  }

  async openFile(defaultPath?: string): Promise<Omit<Document, 'isModified' | 'lastSaved'> | null> {
    const result = await window.electronAPI.fileOpen(defaultPath);
    if (!result) return null;

    return {
      id: this.generateId(),
      filename: result.filename,
      filepath: result.filepath,
      content: result.content,
      isTemplate: result.isTemplate,
    };
  }

  async saveFile(filepath: string, content: string): Promise<boolean> {
    return await window.electronAPI.fileSave(filepath, content);
  }

  async saveFileAs(content: string, defaultPath?: string, suggestedFilename?: string): Promise<string | null> {
    console.log('[FileService] saveFileAs called with suggestedFilename:', suggestedFilename);
    return await window.electronAPI.fileSaveAs(content, defaultPath, suggestedFilename);
  }

  async readFile(filepath: string): Promise<string | null> {
    return await window.electronAPI.fileRead(filepath);
  }

  async saveTemplate(templatesLocation: string, filename: string, content: string): Promise<string | null> {
    const filepath = `${templatesLocation}/${filename}`;
    const success = await this.saveFile(filepath, content);
    return success ? filepath : null;
  }
}

export const fileService = new FileService();
