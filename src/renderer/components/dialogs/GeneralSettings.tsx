import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from '@shared/types';

interface GeneralSettingsProps {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function GeneralSettings({ settings, onChange }: GeneralSettingsProps) {
  const updateGeneral = (updates: Partial<Settings['general']>) => {
    onChange({
      ...settings,
      general: { ...settings.general, ...updates }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>General Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="autosave"
              checked={settings.general.autosave}
              onCheckedChange={(checked) => updateGeneral({ autosave: !!checked })}
            />
            <label htmlFor="autosave" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
              Enable autosave
            </label>
          </div>
          
          <div className="space-y-2">
            <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Autosave interval</label>
            <Select
              value={settings.general.autosaveInterval?.toString() || '5'}
              onValueChange={(value) => updateGeneral({ autosaveInterval: parseInt(value) })}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 minute</SelectItem>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}