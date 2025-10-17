import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FilesTab } from '@/components/sidebar/FilesTab';
import { OutlineTab } from '@/components/sidebar/OutlineTab';
import { TemplatesTab } from '@/components/sidebar/TemplatesTab';
import { useUIStore } from '@/stores/uiStore';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  if (sidebarCollapsed) {
    return (
      <TooltipProvider delayDuration={300} skipDelayDuration={100}>
        <div style={{ width: '3rem', borderRight: '1px solid hsl(var(--border))' }} className="flex flex-col bg-background h-full">
          <div className="p-2">
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="w-full justify-center toolbar-button"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Expand sidebar</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={300} skipDelayDuration={100}>
      <div style={{ width: '16rem', borderRight: '1px solid hsl(var(--border))' }} className="flex flex-col bg-background h-full">
        <div className="p-2 border-b">
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="w-full justify-center toolbar-button"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Collapse sidebar</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <Tabs defaultValue="files" className="flex-1 flex flex-col h-full">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="outline">Outline</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="files" className="flex-1 overflow-y-auto overflow-x-hidden">
            <FilesTab />
          </TabsContent>
          
          <TabsContent value="outline" className="flex-1 overflow-y-auto overflow-x-hidden">
            <OutlineTab />
          </TabsContent>
          
          <TabsContent value="templates" className="flex-1 overflow-y-auto overflow-x-hidden">
            <TemplatesTab />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}



