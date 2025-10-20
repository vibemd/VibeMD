import { useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useSettingsStore } from '@/stores/settingsStore';
import { useDocumentStore } from '@/stores/documentStore';
import { useTheme } from '@/hooks/useTheme';
import { useMenuService } from '@/services/menuService';
import { Document } from '@shared/types';
import './services/appService'; // Initialize app service
import './styles/globals.css';

function App() {
  const loadSettings = useSettingsStore((state) => state.loadSettings);
  const loading = useSettingsStore((state) => state.loading);
  const addDocument = useDocumentStore((state) => state.addDocument);
  const setActiveDocument = useDocumentStore((state) => state.setActiveDocument);

  // Apply theme changes
  useTheme();

  // Initialize menu service
  useMenuService();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Handle file opening from file association (double-click, "Open With", etc.)
  useEffect(() => {
    const handleOpenFileFromAssociation = async (_event: any, filepath: string) => {
      console.log('[File Association] Received file to open:', filepath);

      try {
        const fileData = await window.electronAPI.fileOpenFromPath(filepath);
        if (fileData) {
          const { filename, filepath: path, content, isTemplate } = fileData;

          // Create a complete Document object
          const doc: Document = {
            id: `${Date.now()}-${filename}`,
            filename,
            filepath: path,
            content,
            isModified: false,
            lastSaved: new Date(),
            isTemplate,
          };

          // Add the document to the store and set it as active
          addDocument(doc);

          console.log('[File Association] File opened successfully:', filename);
        }
      } catch (error) {
        console.error('[File Association] Error opening file:', error);
      }
    };

    // Register the listener
    window.electronAPI.onOpenFileFromAssociation(handleOpenFileFromAssociation);

    // Cleanup on unmount
    return () => {
      window.electronAPI.removeOpenFileFromAssociationListener(handleOpenFileFromAssociation);
    };
  }, [addDocument, setActiveDocument]);
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>Loading VibeMD...</div>
          <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>Please wait</div>
        </div>
      </div>
    );
  }
  
  return <Layout />;
}

export default App;
