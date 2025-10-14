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
      <DialogContent className="test-max-w-4xl" style={{ height: '600px' }}>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <div className="test-flex-1 test-overflow-hidden">
          <Tabs defaultValue="general" className="test-h-full test-flex">
            <TabsList className="test-flex-col test-h-full" style={{ width: '12rem' }}>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="theme">Theme</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            
            <div className="test-flex-1" style={{ marginLeft: '1rem' }}>
              <TabsContent value="general" className="test-h-full">
                <GeneralSettings 
                  settings={localSettings} 
                  onChange={setLocalSettings} 
                />
              </TabsContent>
              
              <TabsContent value="theme" className="test-h-full">
                <ThemeSettings 
                  settings={localSettings} 
                  onChange={setLocalSettings} 
                />
              </TabsContent>
              
              <TabsContent value="files" className="test-h-full">
                <FilesSettings 
                  settings={localSettings} 
                  onChange={setLocalSettings} 
                />
              </TabsContent>
              
              <TabsContent value="editor" className="test-h-full">
                <EditorSettings 
                  settings={localSettings} 
                  onChange={setLocalSettings} 
                />
              </TabsContent>
              
              <TabsContent value="about" className="test-h-full">
                <AboutTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <DialogFooter>
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
