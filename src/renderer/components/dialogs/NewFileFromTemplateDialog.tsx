import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NewFileFromTemplateDialogData } from '@shared/types';

interface NewFileFromTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: NewFileFromTemplateDialogData) => void;
  templateName: string;
}

export function NewFileFromTemplateDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  templateName 
}: NewFileFromTemplateDialogProps) {
  const [filename, setFilename] = useState('');
  const [createNewTemplate, setCreateNewTemplate] = useState(false);

  const handleConfirm = () => {
    if (!filename.trim()) return;
    
    onConfirm({
      filename: filename.trim(),
      createNewTemplate,
    });
    
    // Reset form and close dialog
    setFilename('');
    setCreateNewTemplate(false);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFilename('');
    setCreateNewTemplate(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New File from Template</DialogTitle>
          <DialogDescription>
            Create a new file or template from "{templateName}".
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="filename">File Name</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConfirm();
                }
              }}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="createNewTemplate"
              checked={createNewTemplate}
              onCheckedChange={(checked) => setCreateNewTemplate(!!checked)}
            />
            <Label htmlFor="createNewTemplate" className="text-sm font-normal">
              Create New Template
            </Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!filename.trim()}>
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
