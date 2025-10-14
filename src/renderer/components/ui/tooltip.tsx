import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'test-z-50 test-overflow-hidden test-rounded-md test-border test-bg-popover test-px-3 test-py-1.5 test-text-sm test-text-popover-foreground test-shadow-md test-animate-in test-fade-in-0 test-zoom-in-95 data-[state=closed]:test-animate-out data-[state=closed]:test-fade-out-0 data-[state=closed]:test-zoom-out-95 data-[side=bottom]:test-slide-in-from-top-2 data-[side=left]:test-slide-in-from-right-2 data-[side=right]:test-slide-in-from-left-2 data-[side=top]:test-slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };



