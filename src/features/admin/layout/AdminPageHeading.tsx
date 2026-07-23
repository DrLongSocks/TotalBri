import type { ReactNode } from 'react';

export function AdminPageHeading({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-3">
      <div className="h-6 w-1.5 flex-shrink-0 rounded-full bg-azure" />
      <h1 className="font-display text-2xl font-extrabold uppercase tracking-wide text-ink">
        {children}
      </h1>
    </div>
  );
}
