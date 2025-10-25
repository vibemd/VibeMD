import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface ImageDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (url: string, alt: string) => void;
  initialUrl?: string;
  initialAlt?: string;
}

export const ImageDialog: React.FC<ImageDialogProps> = ({
  open,
  onClose,
  onInsert,
  initialUrl = '',
  initialAlt = '',
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [alt, setAlt] = useState(initialAlt);

  const handleInsert = () => {
    if (url) {
      onInsert(url, alt);
      onClose();
      setUrl('');
      setAlt('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
          <DialogDescription>
            Enter the image URL and optional alt text for accessibility.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="imageUrl" className="text-right">
              URL
            </label>
            <Input
              id="imageUrl"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="alt" className="text-right">
              Alt Text
            </label>
            <Input
              id="alt"
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="col-span-3"
              placeholder="Image description"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleInsert}>Insert</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

