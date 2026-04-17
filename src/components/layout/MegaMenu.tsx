'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import type { Locale } from '@/domain/i18n/config';
import { CATEGORY_TREE } from '@/domain/category/tree';
import { cn } from '@/lib/cn';

type Props = {
  locale: Locale;
};

export function MegaMenu({ locale }: Props) {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);
  const basePath = locale === 'en' ? '/en' : '';

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <Link
        href={`${basePath}/tienda`}
        aria-expanded={open}
        aria-haspopup="true"
        className="inline-flex h-10 items-center gap-1 rounded-full px-3 text-sm font-medium text-ink transition hover:bg-mist"
        onClick={() => setOpen(false)}
      >
        {t('shop')}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </Link>

      <div
        className={cn(
          'pointer-events-none absolute left-1/2 top-full z-40 mt-1 w-[min(1200px,96vw)] -translate-x-1/2 rounded-2xl border border-mist bg-paper p-8 opacity-0 shadow-[var(--shadow-card-hover)] transition duration-200',
          open && 'pointer-events-auto opacity-100',
        )}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
        }}
      >
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {CATEGORY_TREE.slice(0, 5).map((cat) => (
            <div key={cat.slug}>
              <Link
                href={`${basePath}/tienda/${cat.slug}`}
                className="eyebrow mb-3 block text-slate hover:text-ink"
                onClick={() => setOpen(false)}
              >
                {cat.name[locale]}
              </Link>
              <ul className="flex flex-col gap-2">
                {cat.subcategories.map((sub) => (
                  <li key={sub.slug}>
                    <Link
                      href={`${basePath}/tienda/${cat.slug}?sub=${sub.slug}`}
                      onClick={() => setOpen(false)}
                      className="text-sm text-ink hover:text-azure"
                    >
                      {sub.name[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-8 border-t border-mist pt-6 md:grid-cols-3">
          {CATEGORY_TREE.slice(5).map((cat) => (
            <div key={cat.slug}>
              <Link
                href={`${basePath}/tienda/${cat.slug}`}
                className="eyebrow mb-3 block text-slate hover:text-ink"
                onClick={() => setOpen(false)}
              >
                {cat.name[locale]}
              </Link>
              <ul className="flex flex-col gap-2">
                {cat.subcategories.map((sub) => (
                  <li key={sub.slug}>
                    <Link
                      href={`${basePath}/tienda/${cat.slug}?sub=${sub.slug}`}
                      onClick={() => setOpen(false)}
                      className="text-sm text-ink hover:text-azure"
                    >
                      {sub.name[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
