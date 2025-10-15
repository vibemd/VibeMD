import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useUIStore } from '@/stores/uiStore';
import { SplitSquareHorizontal, Type } from 'lucide-react';

export function ModeSelector() {
  const { editorMode, setEditorMode } = useUIStore();

  return (
    <ToggleGroup
      type="single"
      value={editorMode}
      onValueChange={(value) => setEditorMode(value as any)}
      className="bg-background"
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
  );
}