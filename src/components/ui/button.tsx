import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-azure focus-visible:outline-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-ink text-paper hover:bg-ink-soft',
        secondary: 'bg-paper text-ink border border-ink hover:bg-porcelain',
        ghost: 'bg-transparent text-ink hover:bg-mist',
        whatsapp: 'bg-[#25D366] text-white hover:bg-[#1EA955]',
        sale: 'bg-sale text-paper hover:bg-[#b91c1c]',
        onInk: 'bg-paper text-ink hover:bg-porcelain',
      },
      size: {
        sm: 'h-9 px-4',
        md: 'h-11 px-6',
        lg: 'h-14 px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };
