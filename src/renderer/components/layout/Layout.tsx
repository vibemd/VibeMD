import { Toolbar } from './Toolbar';
import { Sidebar } from './Sidebar';
import { EditorWindow } from './EditorWindow';
import { StatusBar } from './StatusBar';
import { SettingsDialog } from '@/components/dialogs/SettingsDialog';

export function Layout() {
  return (
    <div className="h-screen flex flex-col bg-background">
      <Toolbar />
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <Sidebar />
        <EditorWindow />
      </div>
      <StatusBar />
      <SettingsDialog />
    </div>
  );
}
