import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'test-inline-flex test-items-center test-justify-center test-whitespace-nowrap test-rounded-md test-text-sm test-font-medium test-transition-colors test-disabled-pointer-events-none test-disabled-opacity-50',
  {
    variants: {
      variant: {
        default: 'test-bg-primary test-text-primary-foreground test-hover-bg-primary-90',
        destructive:
          'test-bg-destructive test-text-destructive-foreground test-hover-bg-destructive/90',
        outline:
          'test-border test-border-input test-bg-background test-hover-bg-accent test-hover-text-accent-foreground',
        secondary:
          'test-bg-secondary test-text-secondary-foreground test-hover-bg-secondary-80',
        ghost: 'test-hover-bg-accent test-hover-text-accent-foreground',
        link: 'test-text-primary test-underline-offset-4 test-hover-underline',
      },
      size: {
        default: 'test-h-10 test-px-4 test-py-2',
        sm: 'test-h-9 test-rounded-md test-px-3',
        lg: 'test-h-11 test-rounded-md test-px-8',
        icon: 'test-h-10 test-w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };



