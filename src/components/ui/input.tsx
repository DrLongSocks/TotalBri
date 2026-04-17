import * as React from 'react';
import { cn } from '@/lib/cn';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-11 w-full rounded-full border border-mist bg-paper px-4 text-sm transition placeholder:text-slate focus:border-azure focus:outline-none focus-visible:outline-2 focus-visible:outline-azure focus-visible:outline-offset-2',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
