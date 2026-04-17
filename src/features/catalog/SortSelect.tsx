'use client';

import { useTranslations } from 'next-intl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFilters } from './hooks/useFilters';

export function SortSelect() {
  const t = useTranslations('shop');
  const { filters, setSort } = useFilters();
  const current = filters.sort ?? 'relevance';

  return (
    <Select value={current} onValueChange={setSort}>
      <SelectTrigger className="w-56">
        <SelectValue placeholder={t('sort')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="relevance">{t('sortRelevance')}</SelectItem>
        <SelectItem value="price-asc">{t('sortPriceAsc')}</SelectItem>
        <SelectItem value="price-desc">{t('sortPriceDesc')}</SelectItem>
        <SelectItem value="name-asc">{t('sortNameAsc')}</SelectItem>
      </SelectContent>
    </Select>
  );
}
