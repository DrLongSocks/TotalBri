'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { Locale } from '@/domain/i18n/config';
import { CATEGORY_TREE } from '@/domain/category/tree';
import { cn } from '@/lib/cn';

type Props = {
  locale: Locale;
};

export function MobileNav({ locale }: Props) {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);
  const [openCat, setOpenCat] = useState<string | null>(null);
  const basePath = locale === 'en' ? '/en' : '';

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={t('menu')}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-mist md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-[360px]">
        <div className="px-6 py-5">
          <SheetTitle>{t('menu')}</SheetTitle>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 pb-6">
          <ul className="flex flex-col">
            <li>
              <Link
                href={`${basePath}/tienda`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-base font-medium"
              >
                {t('shop')}
              </Link>
            </li>
            {CATEGORY_TREE.map((cat) => (
              <li key={cat.slug}>
                <button
                  type="button"
                  onClick={() => setOpenCat(openCat === cat.slug ? null : cat.slug)}
                  className="flex w-full items-center justify-between px-4 py-3 text-sm"
                  aria-expanded={openCat === cat.slug}
                >
                  <span>{cat.name[locale]}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-slate transition-transform',
                      openCat === cat.slug && 'rotate-180',
                    )}
                  />
                </button>
                {openCat === cat.slug ? (
                  <ul className="flex flex-col bg-porcelain">
                    <li>
                      <Link
                        href={`${basePath}/tienda/${cat.slug}`}
                        onClick={() => setOpen(false)}
                        className="block px-8 py-2.5 text-sm font-medium"
                      >
                        {t('viewAll')}
                      </Link>
                    </li>
                    {cat.subcategories.map((sub) => (
                      <li key={sub.slug}>
                        <Link
                          href={`${basePath}/tienda/${cat.slug}?sub=${sub.slug}`}
                          onClick={() => setOpen(false)}
                          className="block px-8 py-2 text-sm text-ink/80"
                        >
                          {sub.name[locale]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
            <li>
              <Link
                href={`${basePath}/mayoreo`}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-base font-medium"
              >
                {t('wholesale')}
              </Link>
            </li>
            <li>
              <Link
                href={`${basePath}/nosotros`}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-base font-medium"
              >
                {t('about')}
              </Link>
            </li>
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
