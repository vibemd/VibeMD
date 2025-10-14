import { Document } from '@shared/types';

export class FileService {
  async createNewFile(): Promise<string> {
    return await window.electronAPI.fileNew();
  }

  async openFile(): Promise<Omit<Document, 'isModified' | 'lastSaved'> | null> {
    const result = await window.electronAPI.fileOpen();
    if (!result) return null;

    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      filename: result.filename,
      filepath: result.filepath,
      content: result.content,
      isTemplate: result.isTemplate,
    };
  }

  async saveFile(filepath: string, content: string): Promise<boolean> {
    return await window.electronAPI.fileSave(filepath, content);
  }

  async saveFileAs(content: string, defaultPath?: string): Promise<string | null> {
    return await window.electronAPI.fileSaveAs(content, defaultPath);
  }

  async readFile(filepath: string): Promise<string | null> {
    return await window.electronAPI.fileRead(filepath);
  }
}

export const fileService = new FileService();
