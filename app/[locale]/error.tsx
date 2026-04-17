'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('error');
  return (
    <section className="flex min-h-[60vh] items-center py-20">
      <div className="container-shell flex flex-col items-start">
        <h1 className="display-l">{t('title')}</h1>
        <p className="mt-6 max-w-md text-slate">{t('body')}</p>
        {error.digest ? (
          <p className="mt-2 text-xs text-slate/70">ref: {error.digest}</p>
        ) : null}
        <Button type="button" variant="primary" size="md" className="mt-8" onClick={() => reset()}>
          {t('retry')}
        </Button>
      </div>
    </section>
  );
}
