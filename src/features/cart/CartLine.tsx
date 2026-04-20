'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { X, Minus, Plus } from 'lucide-react';
import type { Product } from '@/domain/product/schema';
import type { CartLine as CartLineType } from '@/domain/cart/types';
import type { Locale } from '@/domain/i18n/config';
import { useCartStore } from './store';
import { formatPrice } from '@/domain/i18n/format';
import { MAX_QTY } from '@/domain/cart/types';

type Props = {
  line: CartLineType;
  product: Product;
  locale: Locale;
};

export function CartLine({ line, product, locale }: Props) {
  const tCart = useTranslations('cart');
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);

  const atMax = line.quantity >= MAX_QTY;
  const basePath = '';
  const productImage = product.images[0] ?? '';

  return (
    <div className="flex gap-3">
      <Link
        href={`${basePath}/producto/${product.slug}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-porcelain"
      >
        <Image
          src={productImage}
          alt={product.name[locale]}
          fill
          sizes="80px"
          className="object-contain p-2"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`${basePath}/producto/${product.slug}`}
            className="line-clamp-2 text-sm font-medium leading-snug hover:text-azure"
          >
            {product.name[locale]}
          </Link>
          <button
            type="button"
            aria-label={tCart('remove')}
            onClick={() => remove(product.id)}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate hover:bg-mist hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {!product.inStock ? (
          <span className="mt-1 text-xs text-sale">{tCart('outOfStockLine')}</span>
        ) : null}

        <div className="mt-2 flex items-center justify-between">
          <div className="inline-flex items-center gap-1 rounded-full border border-mist">
            <button
              type="button"
              onClick={() => setQuantity(product.id, line.quantity - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-mist"
              aria-label="-1"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-[1.5rem] text-center text-sm font-medium">{line.quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(product.id, line.quantity + 1)}
              disabled={atMax}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-mist disabled:opacity-30"
              aria-label="+1"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="text-sm font-medium">
            {formatPrice(product.price * line.quantity, locale)}
          </span>
        </div>
        {atMax ? (
          <div className="mt-1 text-[11px] text-slate">
            {tCart('qtyCapNotice')} ·{' '}
            <Link href={`${basePath}/mayoreo`} className="underline">
              {tCart('qtyCapLink')}
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
