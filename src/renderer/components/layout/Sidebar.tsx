import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FilesTab } from '@/components/sidebar/FilesTab';
import { OutlineTab } from '@/components/sidebar/OutlineTab';
import { TemplatesTab } from '@/components/sidebar/TemplatesTab';

export function Sidebar() {
  return (
    <div style={{ width: '16rem', borderRight: '1px solid hsl(var(--border))' }} className="test-flex test-flex-col test-bg-background">
      <Tabs defaultValue="files" className="test-flex-1 test-flex test-flex-col">
        <TabsList className="test-grid test-w-full" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="outline">Outline</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="files" className="test-flex-1 test-overflow-hidden" style={{ overflow: 'auto' }}>
          <FilesTab />
        </TabsContent>
        
        <TabsContent value="outline" className="test-flex-1 test-overflow-hidden" style={{ overflow: 'auto' }}>
          <OutlineTab />
        </TabsContent>
        
        <TabsContent value="templates" className="test-flex-1 test-overflow-hidden" style={{ overflow: 'auto' }}>
          <TemplatesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}



