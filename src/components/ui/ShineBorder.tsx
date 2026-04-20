'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
  duration?: number;
};

export function ShineBorder({
  children,
  className,
  borderWidth = 2,
  duration = 3,
}: Props) {
  return (
    <div
      className={cn('relative inline-flex w-fit overflow-hidden rounded-xl', className)}
      style={{ padding: borderWidth }}
    >
      <div
        className="pointer-events-none absolute -inset-[100%] blur-sm"
        style={{
          background: 'conic-gradient(from 0deg, #0fb3ac, #1e3a5f, #0fb3ac, #1e3a5f, #0fb3ac)',
          animationName: 'shine-spin',
          animationDuration: `${duration}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
