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
            <label className="text-sm font-medium">Font Family</label>
            <Select
              value={settings.editor.fontFamily || 'Arial'}
              onValueChange={(value) => updateEditor({ fontFamily: value })}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Courier New">Courier New</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Font family for all text formatting. Code blocks retain their system font.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Default Font Size</label>
            <Select
              value={settings.editor.fontSize?.toString() || '12'}
              onValueChange={(value) => updateEditor({ fontSize: parseInt(value) })}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8">8px</SelectItem>
                <SelectItem value="10">10px</SelectItem>
                <SelectItem value="12">12px</SelectItem>
                <SelectItem value="14">14px</SelectItem>
                <SelectItem value="16">16px</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Sets the base font size for normal text. All other formatting scales from this value.
            </p>
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