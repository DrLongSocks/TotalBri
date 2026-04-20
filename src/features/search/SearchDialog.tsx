'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Search as SearchIcon } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { Input } from '@/components/ui/input';
import { useClientCatalog } from '@/features/cart/CartDrawerProvider';
import { useSearch } from './useSearch';
import type { Locale } from '@/domain/i18n/config';
import { CATEGORY_TREE } from '@/domain/category/tree';
import { formatPrice } from '@/domain/i18n/format';
import { ProductImage } from '@/features/catalog/ProductImage';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SearchDialog({ open, onOpenChange }: Props) {
  const t = useTranslations('search');
  const tn = useTranslations('nav');
  const locale = useLocale() as Locale;
  const { products } = useClientCatalog();
  const [query, setQuery] = useState('');
  const search = useSearch(products);
  const router = useRouter();
  const basePath = '';

  const results = useMemo(() => search(query), [query, search]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onOpenChange(false);
    router.push(`${basePath}/buscar?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-[10%] z-50 w-[min(640px,94vw)] -translate-x-1/2 rounded-2xl bg-paper p-4 shadow-[var(--shadow-card-hover)]"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">{t('title')}</Dialog.Title>
          <form onSubmit={submit} className="flex items-center gap-2">
            <SearchIcon className="ml-3 h-5 w-5 text-slate" aria-hidden />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('placeholder')}
              className="h-12 flex-1 border-transparent text-base focus:border-transparent"
            />
          </form>

          <div className="mt-2 max-h-[60vh] overflow-y-auto pt-2">
            {query.trim() === '' ? (
              <div className="px-2 py-3">
                <div className="eyebrow mb-3 text-slate">{t('popular')}</div>
                <ul className="flex flex-wrap gap-2">
                  {CATEGORY_TREE.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`${basePath}/tienda/${cat.slug}`}
                        onClick={() => onOpenChange(false)}
                        className="rounded-full border border-mist px-3 py-1.5 text-sm hover:bg-mist"
                      >
                        {cat.name[locale]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : results.length === 0 ? (
              <div className="px-2 py-6 text-center text-sm text-slate">
                {t('noResults', { query })}
              </div>
            ) : (
              <ul className="flex flex-col divide-y divide-mist">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`${basePath}/producto/${p.slug}`}
                      onClick={() => onOpenChange(false)}
                      className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-porcelain"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-porcelain">
                        <ProductImage
                          src={p.images[0] ?? ''}
                          fallback={p.images[1] ?? ''}
                          alt={p.name[locale]}
                          sizes="56px"
                          className="p-1.5"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium">{p.name[locale]}</span>
                        <span className="truncate text-xs text-slate">{p.subcategory}</span>
                      </div>
                      <span className="shrink-0 text-sm font-medium">
                        {formatPrice(p.price, locale)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-mist px-3 py-2 text-xs text-slate">
            <span>⌘K</span>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="hover:text-ink"
            >
              {tn('close')}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
