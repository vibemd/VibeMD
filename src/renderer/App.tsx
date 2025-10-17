import { useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useSettingsStore } from '@/stores/settingsStore';
import { useTheme } from '@/hooks/useTheme';
import './styles/globals.css';

function App() {
  const loadSettings = useSettingsStore((state) => state.loadSettings);
  const loading = useSettingsStore((state) => state.loading);
  
  // Apply theme changes
  useTheme();
  
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);
  
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
