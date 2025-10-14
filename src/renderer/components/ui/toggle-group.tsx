import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const toggleVariants = cva(
  'test-inline-flex test-items-center test-justify-center test-rounded-md test-text-sm test-font-medium test-ring-offset-background test-transition-colors test-hover-bg-muted test-hover-text-muted-foreground test-focus-visible:outline-none test-focus-visible:ring-2 test-focus-visible:ring-ring test-focus-visible:ring-offset-2 test-disabled-pointer-events-none test-disabled-opacity-50 data-[state=on]:test-bg-accent data-[state=on]:test-text-accent-foreground',
  {
    variants: {
      variant: {
        default: 'test-bg-transparent',
        outline:
          'test-border test-border-input test-bg-transparent test-hover-bg-accent test-hover-text-accent-foreground',
      },
      size: {
        default: 'test-h-10 test-px-3',
        sm: 'test-h-9 test-px-2\.5',
        lg: 'test-h-11 test-px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn('test-flex test-items-center test-justify-center test-gap-1', className)}
    {...props}
  >
    {children}
  </ToggleGroupPrimitive.Root>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  >
    {children}
  </ToggleGroupPrimitive.Item>
));

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };



