import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneralSettings } from './GeneralSettings';
import { ThemeSettings } from './ThemeSettings';
import { FilesSettings } from './FilesSettings';
import { EditorSettings } from './EditorSettings';
import { AboutTab } from './AboutTab';
import { useUIStore } from '@/stores/uiStore';
import { useSettingsStore } from '@/stores/settingsStore';

export function SettingsDialog() {
  const { settingsDialogOpen, toggleSettingsDialog } = useUIStore();
  const { settings, saveSettings } = useSettingsStore();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = async () => {
    await saveSettings(localSettings);
    toggleSettingsDialog();
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    toggleSettingsDialog();
  };

  return (
    <Dialog open={settingsDialogOpen} onOpenChange={toggleSettingsDialog}>
      <DialogContent className="max-w-3xl" style={{ height: '600px' }}>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <div style={{ height: '460px', overflow: 'hidden' }}>
          <Tabs defaultValue="general" className="h-full">
            <div className="flex h-full">
              <TabsList className="flex-col w-32 h-full items-start justify-start" style={{ paddingTop: '0.5rem' }}>
                <TabsTrigger value="general" className="w-full justify-start">General</TabsTrigger>
                <TabsTrigger value="theme" className="w-full justify-start">Theme</TabsTrigger>
                <TabsTrigger value="files" className="w-full justify-start">Files</TabsTrigger>
                <TabsTrigger value="editor" className="w-full justify-start">Editor</TabsTrigger>
                <TabsTrigger value="about" className="w-full justify-start">About</TabsTrigger>
              </TabsList>
              
              <div className="flex-1 h-full overflow-hidden" style={{ marginLeft: '1rem' }}>
                <TabsContent value="general" className="h-full overflow-y-auto">
                  <GeneralSettings
                    settings={localSettings}
                    onChange={setLocalSettings}
                  />
                </TabsContent>

                <TabsContent value="theme" className="h-full overflow-y-auto">
                  <ThemeSettings
                    settings={localSettings}
                    onChange={setLocalSettings}
                  />
                </TabsContent>

                <TabsContent value="files" className="h-full overflow-y-auto">
                  <FilesSettings
                    settings={localSettings}
                    onChange={setLocalSettings}
                  />
                </TabsContent>

                <TabsContent value="editor" className="h-full overflow-y-auto">
                  <EditorSettings
                    settings={localSettings}
                    onChange={setLocalSettings}
                  />
                </TabsContent>

                <TabsContent value="about" className="h-full">
                  <AboutTab />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>

        <DialogFooter className="pt-2 pb-8">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
