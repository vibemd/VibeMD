import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from '@shared/types';

interface ThemeSettingsProps {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function ThemeSettings({ settings, onChange }: ThemeSettingsProps) {
  const updateTheme = (updates: Partial<Settings['theme']>) => {
    onChange({
      ...settings,
      theme: { ...settings.theme, ...updates }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Theme Settings</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Theme</label>
            <Select
              value={settings.theme.currentTheme}
              onValueChange={(value) => updateTheme({ currentTheme: value as any })}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}