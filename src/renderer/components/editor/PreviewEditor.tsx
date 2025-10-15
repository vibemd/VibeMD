import { useDocumentStore } from '@/stores/documentStore';
import { useSettingsStore } from '@/stores/settingsStore';
import MDEditor from '@uiw/react-md-editor';

export function PreviewEditor() {
  const activeDocument = useDocumentStore((state) => state.getActiveDocument());
  const settings = useSettingsStore((state) => state.settings);

  if (!activeDocument) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p style={{ color: 'hsl(var(--muted-foreground))' }}>No document selected</p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <MDEditor.Markdown
        source={activeDocument.content}
        data-color-mode="light"
        style={{
          fontSize: `${settings?.editor?.fontSize ?? 14}px`,
          fontFamily: settings?.editor?.fontFamily ?? 'system-ui',
          padding: '1rem',
        }}
      />
    </div>
  );
}