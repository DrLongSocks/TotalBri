'use client';

import { useTranslations } from 'next-intl';
import type { Locale } from '@/domain/i18n/config';
import { getSubcategoryName } from '@/domain/category/tree';
import { useFilters } from './hooks/useFilters';

type Props = {
  locale: Locale;
  subcategories: string[];
  tags: string[];
  priceBounds: { min: number; max: number };
};

export function FilterPanel({ locale, subcategories, tags, priceBounds }: Props) {
  const t = useTranslations('shop');
  const { filters, toggleSub, toggleTag, setRange, setInStock, clearAll } = useFilters();
  const minVal = filters.min ?? priceBounds.min;
  const maxVal = filters.max ?? priceBounds.max;

  return (
    <div className="flex flex-col gap-6">
      {subcategories.length > 0 ? (
        <fieldset>
          <legend className="eyebrow mb-3 text-slate">{t('subcategories')}</legend>
          <ul className="flex flex-col gap-1.5">
            {subcategories.map((slug) => (
              <li key={slug}>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.sub?.includes(slug) ?? false}
                    onChange={() => toggleSub(slug)}
                    className="h-4 w-4 rounded border-mist text-azure focus:ring-2 focus:ring-azure"
                  />
                  <span>{getSubcategoryName(slug)[locale]}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      ) : null}

      {tags.length > 0 ? (
        <fieldset>
          <legend className="eyebrow mb-3 text-slate">{t('tags')}</legend>
          <ul className="flex flex-wrap gap-1.5">
            {tags.slice(0, 24).map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    filters.tag?.includes(tag)
                      ? 'border-ink bg-ink text-paper'
                      : 'border-mist bg-paper text-ink hover:bg-mist'
                  }`}
                >
                  {tag}
                </button>
              </li>
            ))}
          </ul>
        </fieldset>
      ) : null}

      <fieldset>
        <legend className="eyebrow mb-3 text-slate">{t('priceRange')}</legend>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={minVal}
            onChange={(e) => setRange(Number(e.target.value), filters.max)}
            className="h-9 w-20 rounded-full border border-mist px-3 text-sm"
            aria-label="min"
            min={priceBounds.min}
            max={priceBounds.max}
          />
          <span className="text-xs text-slate">–</span>
          <input
            type="number"
            inputMode="numeric"
            value={maxVal}
            onChange={(e) => setRange(filters.min, Number(e.target.value))}
            className="h-9 w-20 rounded-full border border-mist px-3 text-sm"
            aria-label="max"
            min={priceBounds.min}
            max={priceBounds.max}
          />
        </div>
      </fieldset>

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={filters.inStock ?? false}
          onChange={(e) => setInStock(e.target.checked)}
          className="h-4 w-4 rounded border-mist text-azure focus:ring-2 focus:ring-azure"
        />
        <span>{t('inStockOnly')}</span>
      </label>

      <button
        type="button"
        onClick={clearAll}
        className="self-start text-sm font-medium text-azure hover:underline"
      >
        {t('clearFilters')}
      </button>
    </div>
  );
}
