import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from '@shared/types';

interface EditorSettingsProps {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function EditorSettings({ settings, onChange }: EditorSettingsProps) {
  const updateEditor = (updates: Partial<Settings['editor']>) => {
    onChange({
      ...settings,
      editor: { ...settings.editor, ...updates }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Editor Settings</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Font Size</label>
            <Select
              value={settings.editor.fontSize?.toString() || '16'}
              onValueChange={(value) => updateEditor({ fontSize: parseInt(value) })}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12px</SelectItem>
                <SelectItem value="14">14px</SelectItem>
                <SelectItem value="16">16px</SelectItem>
                <SelectItem value="18">18px</SelectItem>
                <SelectItem value="20">20px</SelectItem>
                <SelectItem value="24">24px</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="wordWrap"
              checked={settings.editor.wordWrap}
              onCheckedChange={(checked) => updateEditor({ wordWrap: !!checked })}
            />
            <label htmlFor="wordWrap" className="text-sm font-medium">
              Enable word wrap
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="lineNumbers"
              checked={settings.editor.lineNumbers}
              onCheckedChange={(checked) => updateEditor({ lineNumbers: !!checked })}
            />
            <label htmlFor="lineNumbers" className="text-sm font-medium">
              Show line numbers
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="latexSupport"
              checked={settings.editor.latexSupport}
              onCheckedChange={(checked) => updateEditor({ latexSupport: !!checked })}
            />
            <label htmlFor="latexSupport" className="text-sm font-medium">
              Enable LaTeX support
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}