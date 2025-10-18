import { useState, useEffect } from 'react';
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
import { NewDocumentDialogData } from '@shared/types';

interface NewDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: NewDocumentDialogData) => void;
}

export function NewDocumentDialog({ open, onOpenChange, onConfirm }: NewDocumentDialogProps) {
  const [filename, setFilename] = useState('');
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFilename('');
      setSaveAsTemplate(false);
    }
  }, [open]);

  const handleConfirm = () => {
    if (!filename.trim()) return;

    // Store the values before resetting
    const data = {
      filename: filename.trim(),
      saveAsTemplate,
    };

    // Reset form and close dialog FIRST
    setFilename('');
    setSaveAsTemplate(false);
    onOpenChange(false);

    // Then call onConfirm with the stored data
    onConfirm(data);
  };

  const handleCancel = () => {
    setFilename('');
    setSaveAsTemplate(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New</DialogTitle>
          <DialogDescription>
            Create a new document or template.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="filename">Name</Label>
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
              id="saveAsTemplate"
              checked={saveAsTemplate}
              onCheckedChange={(checked) => setSaveAsTemplate(!!checked)}
            />
            <Label htmlFor="saveAsTemplate" className="text-sm font-normal">
              Save as Template
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
