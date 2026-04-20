'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-40 bg-ink/50 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out',
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = 'SheetOverlay';

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    side?: 'left' | 'right' | 'bottom';
  }
>(({ side = 'right', className, children, ...props }, ref) => {
  const sideClass = {
    right:
      'right-0 top-0 h-full w-full max-w-sm overflow-hidden data-[state=closed]:translate-x-full data-[state=open]:translate-x-0',
    left: 'left-0 top-0 h-full w-full max-w-[420px] data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0',
    bottom:
      'bottom-0 left-0 w-full max-h-[85vh] data-[state=closed]:translate-y-full data-[state=open]:translate-y-0',
  }[side];
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed z-50 flex flex-col bg-paper text-ink shadow-[var(--shadow-drawer)] transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
          sideClass,
          className,
        )}
        {...props}
      >
        {children}
        <SheetClose
          className="absolute right-4 top-4 rounded-full p-2 text-ink hover:bg-mist focus:outline-none focus-visible:outline-2 focus-visible:outline-azure"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </SheetClose>
      </DialogPrimitive.Content>
    </SheetPortal>
  );
});
SheetContent.displayName = 'SheetContent';

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('display-m', className)}
    {...props}
  />
));
SheetTitle.displayName = 'SheetTitle';

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-slate', className)}
    {...props}
  />
));
SheetDescription.displayName = 'SheetDescription';

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetDescription,
};
