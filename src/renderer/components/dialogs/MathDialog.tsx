import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface MathDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (type: 'inline' | 'block', latex: string) => void;
  initialType?: 'inline' | 'block';
  initialLatex?: string;
}

export function MathDialog({ 
  open, 
  onOpenChange, 
  onInsert, 
  initialType = 'inline',
  initialLatex = ''
}: MathDialogProps) {
  const [mathType, setMathType] = useState<'inline' | 'block'>(initialType);
  const [latex, setLatex] = useState(initialLatex);

  const handleInsert = () => {
    console.log('[MathDialog] Insert button clicked', { mathType, latex });
    if (latex.trim()) {
      onInsert(mathType, latex.trim());
      // Don't close here - let the parent handler close after successful insertion
      // Reset the latex input for next time
      setLatex('');
    } else {
      console.warn('[MathDialog] Cannot insert empty LaTeX formula');
    }
  };

  const handleCancel = () => {
    console.log('[MathDialog] Cancel button clicked');
    onOpenChange(false);
    setLatex('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Insert Math Formula</DialogTitle>
          <DialogDescription>
            Enter your LaTeX formula below. Choose whether it should be inline or displayed as a block.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="math-type">Math Type</Label>
            <RadioGroup
              value={mathType}
              onValueChange={(value: string) => setMathType(value as 'inline' | 'block')}
              className="flex flex-row space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inline" id="inline" />
                <Label htmlFor="inline">Inline ($...$)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="block" id="block" />
                <Label htmlFor="block">Block ($$...$$)</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="latex">LaTeX Formula</Label>
            <Input
              id="latex"
              value={latex}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLatex(e.target.value)}
              placeholder="E = mc^2"
              className="font-mono"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleInsert} disabled={!latex.trim()}>
            Insert Math
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}




