import { Button } from '@/components/ui/button';
import { Settings } from '@shared/types';

interface FilesSettingsProps {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function FilesSettings({ settings, onChange }: FilesSettingsProps) {
  const updateFiles = (updates: Partial<Settings['files']>) => {
    onChange({
      ...settings,
      files: { ...settings.files, ...updates }
    });
  };

  const handleSelectTemplatesLocation = async () => {
    const path = await window.electronAPI.selectFolder();
    if (path) {
      updateFiles({ templatesLocation: path });
    }
  };

  const handleSelectDefaultSaveLocation = async () => {
    const path = await window.electronAPI.selectFolder();
    if (path) {
      updateFiles({ defaultSavePath: path });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Files Settings</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Default location for files</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={settings.files.defaultSavePath || 'Documents folder (default)'}
                readOnly
                className="flex-1 px-3 py-2 border rounded-md bg-muted text-sm"
              />
              <Button onClick={handleSelectDefaultSaveLocation} size="sm">
                Browse
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Default location for opening and saving files
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Templates Location</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={settings.files.templatesLocation || 'Documents folder (default)'}
                readOnly
                className="flex-1 px-3 py-2 border rounded-md bg-muted text-sm"
              />
              <Button onClick={handleSelectTemplatesLocation} size="sm">
                Browse
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Location for storing document templates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}