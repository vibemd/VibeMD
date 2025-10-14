import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'test-peer test-h-4 test-w-4 test-shrink-0 test-rounded-sm test-border test-border-primary test-ring-offset-background test-focus-visible:outline-none test-focus-visible:ring-2 test-focus-visible:ring-ring test-focus-visible:ring-offset-2 test-disabled:cursor-not-allowed test-disabled:opacity-50 data-[state=checked]:test-bg-primary data-[state=checked]:test-text-primary-foreground',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('test-flex test-items-center test-justify-center test-text-current')}
    >
      <Check style={{ height: '1rem', width: '1rem' }} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };



