import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'test-inline-flex test-h-10 test-items-center test-justify-center test-rounded-md test-bg-muted test-p-1 test-text-muted-foreground',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'test-inline-flex test-items-center test-justify-center test-whitespace-nowrap test-rounded-sm test-px-3 test-py-1.5 test-text-sm test-font-medium test-ring-offset-background test-transition-all test-focus-visible:outline-none test-focus-visible:ring-2 test-focus-visible:ring-ring test-focus-visible:ring-offset-2 test-disabled-pointer-events-none test-disabled-opacity-50 data-[state=active]:test-bg-background data-[state=active]:test-text-foreground data-[state=active]:test-shadow-sm',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'test-mt-2 test-ring-offset-background test-focus-visible:outline-none test-focus-visible:ring-2 test-focus-visible:ring-ring test-focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };



