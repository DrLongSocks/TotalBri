'use client';

import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFilters } from './hooks/useFilters';

type Props = {
  page: number;
  totalPages: number;
};

export function Pagination({ page, totalPages }: Props) {
  const t = useTranslations('shop');
  const { setPage } = useFilters();

  if (totalPages <= 1) return null;

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
        className="inline-flex h-10 items-center gap-1 rounded-full border border-mist bg-paper px-4 text-sm disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
        {t('previousPage')}
      </button>
      <span className="text-sm text-slate">{t('showingPage', { page, total: totalPages })}</span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => setPage(page + 1)}
        className="inline-flex h-10 items-center gap-1 rounded-full border border-mist bg-paper px-4 text-sm disabled:opacity-40"
      >
        {t('nextPage')}
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
