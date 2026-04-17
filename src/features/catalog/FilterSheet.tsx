'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SlidersHorizontal } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { FilterPanel } from './FilterPanel';
import { useFilters } from './hooks/useFilters';
import type { Locale } from '@/domain/i18n/config';

type Props = {
  locale: Locale;
  subcategories: string[];
  tags: string[];
  priceBounds: { min: number; max: number };
};

export function FilterSheet(props: Props) {
  const t = useTranslations('shop');
  const [open, setOpen] = useState(false);
  const { activeCount } = useFilters();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-mist bg-paper px-4 text-sm font-medium lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {activeCount > 0 ? t('filtersActive', { count: activeCount }) : t('filters')}
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[80vh] rounded-t-3xl">
        <div className="px-6 py-5">
          <SheetTitle>{t('filters')}</SheetTitle>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-8">
          <FilterPanel {...props} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
