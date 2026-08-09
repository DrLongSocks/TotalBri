'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Plain bilingual-neutral copy rather than admin-i18n/messages.ts — error
// boundaries are client components and the admin locale is read from a
// cookie via an async server call, which isn't available here.
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex min-h-[50vh] items-center py-16">
      <div className="flex flex-col items-start">
        <h1 className="display-l">Algo salió mal · Something went wrong</h1>
        <p className="mt-4 max-w-md text-slate">
          Intenta de nuevo o vuelve al panel. / Try again or head back to the dashboard.
        </p>
        {error.digest ? <p className="mt-2 text-xs text-slate/70">ref: {error.digest}</p> : null}
        <div className="mt-8 flex gap-3">
          <Button type="button" variant="primary" size="md" onClick={() => reset()}>
            Reintentar · Retry
          </Button>
          <Button asChild variant="secondary" size="md">
            <Link href="/admin/dashboard">Panel · Dashboard</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
