import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'test-flex test-h-10 test-w-full test-items-center test-justify-between test-rounded-md test-border test-border-input test-bg-background test-px-3 test-py-2 test-text-sm test-ring-offset-background placeholder:test-text-muted-foreground test-focus:outline-none test-focus:ring-2 test-focus:ring-ring test-focus:ring-offset-2 test-disabled:cursor-not-allowed test-disabled:opacity-50 [&>span]:test-line-clamp-1',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown style={{ height: '1rem', width: '1rem', opacity: 0.5 }} />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'test-flex test-cursor-default test-items-center test-justify-center test-py-1',
      className
    )}
    {...props}
  >
    <ChevronUp style={{ height: '1rem', width: '1rem' }} />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'test-flex test-cursor-default test-items-center test-justify-center test-py-1',
      className
    )}
    {...props}
  >
    <ChevronDown style={{ height: '1rem', width: '1rem' }} />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'test-relative test-z-50 test-max-h-96 test-min-w-\[8rem\] test-overflow-hidden test-rounded-md test-border test-bg-popover test-text-popover-foreground test-shadow-md data-[state=open]:test-animate-in data-[state=closed]:test-animate-out data-[state=closed]:test-fade-out-0 data-[state=open]:test-fade-in-0 data-[state=closed]:test-zoom-out-95 data-[state=open]:test-zoom-in-95 data-[side=bottom]:test-slide-in-from-top-2 data-[side=left]:test-slide-in-from-right-2 data-[side=right]:test-slide-in-from-left-2 data-[side=top]:test-slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:test-translate-y-1 data-[side=left]:test--translate-x-1 data-[side=right]:test-translate-x-1 data-[side=top]:test--translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'test-p-1',
          position === 'popper' &&
            'test-h-\[var\(--radix-select-trigger-height\)\] test-w-full test-min-w-\[var\(--radix-select-trigger-width\)\]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('test-py-1\.5 test-pl-8 test-pr-2 test-text-sm test-font-semibold', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'test-relative test-flex test-w-full test-cursor-default test-select-none test-items-center test-rounded-sm test-py-1\.5 test-pl-8 test-pr-2 test-text-sm test-outline-none test-focus:bg-accent test-focus:text-accent-foreground data-[disabled]:test-pointer-events-none data-[disabled]:test-opacity-50',
      className
    )}
    {...props}
  >
    <span style={{ position: 'absolute', left: '0.5rem' }} className="test-flex test-h-3\.5 test-w-3\.5 test-items-center test-justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check style={{ height: '1rem', width: '1rem' }} />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('test--mx-1 test-my-1 test-h-px test-bg-muted', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};



