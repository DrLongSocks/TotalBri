'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

type Props = {
  children: React.ReactNode;
  className?: string;
  arrows?: boolean;
  ariaLabel?: string;
};

export function ScrollRail({ children, className, arrows = true, ariaLabel }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'l' | 'r') => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'r' ? el.clientWidth * 0.8 : -el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        className={cn('scroll-rail pl-6 pr-6 md:pl-10 md:pr-10 xl:pl-20 xl:pr-20', className)}
        role={ariaLabel ? 'region' : undefined}
        aria-label={ariaLabel}
      >
        {children}
      </div>
      {arrows ? (
        <div className="pointer-events-none absolute inset-y-0 hidden w-full items-center justify-between px-2 md:flex">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scroll('l')}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-paper/90 text-ink shadow-[var(--shadow-card)] backdrop-blur transition hover:shadow-[var(--shadow-card-hover)]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scroll('r')}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-paper/90 text-ink shadow-[var(--shadow-card)] backdrop-blur transition hover:shadow-[var(--shadow-card-hover)]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
