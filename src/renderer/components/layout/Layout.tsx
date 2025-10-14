import { Toolbar } from './Toolbar';
import { Sidebar } from './Sidebar';
import { EditorWindow } from './EditorWindow';
import { StatusBar } from './StatusBar';
import { SettingsDialog } from '@/components/dialogs/SettingsDialog';

export function Layout() {
  return (
    <div className="test-h-screen test-flex test-flex-col test-bg-background">
      <Toolbar />
      <div className="test-flex-1 test-flex test-overflow-hidden">
        <Sidebar />
        <EditorWindow />
      </div>
      <StatusBar />
      <SettingsDialog />
    </div>
  );
}
