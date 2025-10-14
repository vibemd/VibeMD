import { useEffect } from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTemplatesStore } from '@/stores/templatesStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useDocumentStore } from '@/stores/documentStore';
import { useUIStore } from '@/stores/uiStore';
import { Document } from '@shared/types';

export function TemplatesTab() {
  const { templates, loading, loadTemplates } = useTemplatesStore();
  const templatesLocation = useSettingsStore(
    (state) => state.settings.files.templatesLocation
  );
  const addDocument = useDocumentStore((state) => state.addDocument);
  const setSidebarTab = useUIStore((state) => state.setSidebarTab);

  useEffect(() => {
    if (templatesLocation) {
      loadTemplates(templatesLocation);
    }
  }, [templatesLocation, loadTemplates]);

  const handleUseTemplate = (template: any) => {
    const newDoc: Document = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      filename: `Untitled.md`,
      filepath: null,
      content: template.content,
      isModified: false,
      lastSaved: null,
      isTemplate: false,
    };
    addDocument(newDoc);
    setSidebarTab('files');
  };

  if (loading) {
    return (
      <div style={{ padding: '1rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>Loading templates...</p>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div style={{ padding: '1rem', textAlign: 'center' }} className="test-space-y-2">
        <FileText style={{ height: '3rem', width: '3rem', margin: '0 auto', color: 'hsl(var(--muted-foreground))' }} />
        <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>No templates available</p>
        <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>
          Add .vibe files to your templates folder
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '0.5rem' }} className="test-space-y-1">
      {templates.map((template) => (
        <div
          key={template.id}
          className="test-p-2 test-rounded test-hover-bg-accent test-group"
        >
          <div className="test-flex test-items-center test-gap-2">
            <FileText style={{ height: '1rem', width: '1rem' }} />
            <span className="test-flex-1 test-truncate test-text-sm">
              {template.filename}
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="test-w-full test-mt-2"
            onClick={() => handleUseTemplate(template)}
          >
            Use
          </Button>
        </div>
      ))}
    </div>
  );
}
