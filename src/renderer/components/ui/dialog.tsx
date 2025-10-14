import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'test-fixed test-inset-0 test-z-50 test-bg-background\/80 test-backdrop-blur-sm data-[state=open]:test-animate-in data-[state=closed]:test-animate-out data-[state=closed]:test-fade-out-0 data-[state=open]:test-fade-in-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'test-fixed test-left-\[50\%\] test-top-\[50\%\] test-z-50 test-grid test-w-full test-max-w-lg test-translate-x-\[-50\%\] test-translate-y-\[-50\%\] test-gap-4 test-border test-bg-background test-p-6 test-shadow-lg test-duration-200 data-[state=open]:test-animate-in data-[state=closed]:test-animate-out data-[state=closed]:test-fade-out-0 data-[state=open]:test-fade-in-0 data-[state=closed]:test-zoom-out-95 data-[state=open]:test-zoom-in-95 data-[state=closed]:test-slide-out-to-left-1\/2 data-[state=closed]:test-slide-out-to-top-\[48\%\] data-[state=open]:test-slide-in-from-left-1\/2 data-[state=open]:test-slide-in-from-top-\[48\%\] sm:test-rounded-lg',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="test-absolute test-right-4 test-top-4 test-rounded-sm test-opacity-70 test-ring-offset-background test-transition-opacity test-hover:opacity-100 test-focus:outline-none test-focus:ring-2 test-focus:ring-ring test-focus:ring-offset-2 test-disabled:pointer-events-none data-[state=open]:test-bg-accent data-[state=open]:test-text-muted-foreground">
        <X style={{ height: '1rem', width: '1rem' }} />
        <span className="test-sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'test-flex test-flex-col test-space-y-1\.5 test-text-center sm:test-text-left',
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'test-flex test-flex-col-reverse sm:test-flex-row sm:test-justify-end sm:test-space-x-2',
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'test-text-lg test-font-semibold test-leading-none test-tracking-tight',
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('test-text-sm test-text-muted-foreground', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};



