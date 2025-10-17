import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Settings } from '@shared/types';
import { useSettingsStore } from '@/stores/settingsStore';

interface ThemeSettingsProps {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function ThemeSettings({ settings, onChange }: ThemeSettingsProps) {
  const { updateThemeSettings } = useSettingsStore();
  
  const updateTheme = (updates: Partial<Settings['theme']>) => {
    // Update local state for dialog
    onChange({
      ...settings,
      theme: { ...settings.theme, ...updates }
    });
    
    // Immediately apply theme changes to the app
    updateThemeSettings(updates);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Theme Settings</h3>
        
        <div className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Theme</Label>
            <RadioGroup
              value={settings.theme.currentTheme}
              onValueChange={(value: 'light' | 'dark' | 'system') => updateTheme({ currentTheme: value })}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="text-sm font-normal">Light</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="text-sm font-normal">Dark</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system" className="text-sm font-normal">System</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );
}