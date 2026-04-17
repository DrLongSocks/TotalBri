'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ShoppingBag, AlertTriangle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCartStore } from './store';
import type { Product } from '@/domain/product/schema';
import { hydrateCart, subtotal } from '@/domain/cart/totals';
import { buildOrderMessage } from '@/domain/whatsapp/templates';
import { buildWhatsAppUrl } from '@/domain/whatsapp/link';
import { formatPrice } from '@/domain/i18n/format';
import type { Locale } from '@/domain/i18n/config';
import { CartLine } from './CartLine';
import { env } from '@/lib/env';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productMap: Map<string, Product>;
};

export function CartDrawer({ open, onOpenChange, productMap }: Props) {
  const t = useTranslations('cart');
  const locale = useLocale() as Locale;
  const lines = useCartStore((s) => s.lines);

  const resolve = (id: string) => productMap.get(id);
  const { hydrated } = hydrateCart({ lines }, resolve);
  const total = subtotal(hydrated);
  const outOfStockLines = hydrated.filter(({ product }) => !product.inStock);

  const waUrl = hydrated.length
    ? buildWhatsAppUrl(
        env.NEXT_PUBLIC_WHATSAPP_PRIMARY,
        buildOrderMessage(hydrated, total, locale),
      )
    : '#';

  const basePath = locale === 'en' ? '/en' : '';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col">
        <header className="flex items-center justify-between border-b border-mist px-6 py-5">
          <SheetTitle>{t('title')}</SheetTitle>
        </header>

        {hydrated.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-porcelain">
              <ShoppingBag className="h-7 w-7 text-slate" />
            </div>
            <SheetTitle className="text-xl">{t('empty')}</SheetTitle>
            <SheetDescription>{t('emptyCopy')}</SheetDescription>
            <SheetClose asChild>
              <Button asChild variant="primary" size="md">
                <Link href={`${basePath}/tienda`}>{t('emptyCta')}</Link>
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {outOfStockLines.length > 0 ? (
                <div className="mb-4 flex items-start gap-2 rounded-lg bg-sale/10 p-3 text-xs text-sale">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{t('outOfStockLine')}</span>
                </div>
              ) : null}
              <ul className="flex flex-col divide-y divide-mist">
                {hydrated.map(({ line, product }) => (
                  <li key={line.productId} className="py-4">
                    <CartLine line={line} product={product} locale={locale} />
                  </li>
                ))}
              </ul>
            </div>

            <footer className="border-t border-mist px-6 py-5">
              <div className="mb-4 flex items-baseline justify-between">
                <span className="text-sm font-medium">{t('subtotal')}</span>
                <span className="display-m">{formatPrice(total, locale)} MXN</span>
              </div>
              <p className="mb-4 text-xs text-slate">{t('subtotalNote')}</p>
              <Button asChild variant="whatsapp" size="lg" className="w-full">
                <a href={waUrl} target="_blank" rel="noopener noreferrer">
                  {t('checkout')}
                </a>
              </Button>
              <SheetClose asChild>
                <button className="mt-2 w-full py-2 text-center text-sm text-slate hover:text-ink">
                  {t('continueShopping')}
                </button>
              </SheetClose>
            </footer>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
