import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useUIStore } from '@/stores/uiStore';
import { SplitSquareHorizontal, Type } from 'lucide-react';

export function ModeSelector() {
  const { editorMode, setEditorMode } = useUIStore();

  return (
    <div style={{ borderBottom: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))', padding: '0.5rem' }}>
      <ToggleGroup
        type="single"
        value={editorMode}
        onValueChange={(value) => setEditorMode(value as any)}
        style={{ justifyContent: 'flex-start' }}
      >
        <ToggleGroupItem value="wysiwyg" className="gap-2">
          <Type style={{ height: '1rem', width: '1rem' }} />
          WYSIWYG
        </ToggleGroupItem>
        <ToggleGroupItem value="split" className="gap-2">
          <SplitSquareHorizontal style={{ height: '1rem', width: '1rem' }} />
          Split
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}