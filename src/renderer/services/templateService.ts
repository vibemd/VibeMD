import { Template } from '@shared/types';

export class TemplateService {
  async loadTemplates(dirPath: string): Promise<Template[]> {
    return await window.electronAPI.readTemplates(dirPath);
  }
}

export const templateService = new TemplateService();




