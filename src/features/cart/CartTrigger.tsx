'use client';

import { ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCartDrawer } from './CartDrawerProvider';
import { useCartStore } from './store';
import { useHasMounted } from './useHasMounted';
import { itemCount } from '@/domain/cart/totals';

export function CartTrigger() {
  const t = useTranslations('nav');
  const { openDrawer } = useCartDrawer();
  const lines = useCartStore((s) => s.lines);
  const mounted = useHasMounted();
  const count = itemCount({ lines });

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={t('cart')}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-mist"
    >
      <ShoppingBag className="h-5 w-5" />
      {mounted && count > 0 ? (
        <span
          aria-hidden
          className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-[11px] font-medium leading-none text-paper"
        >
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
      {mounted && count > 0 ? (
        <span className="sr-only">
          {t('cart')}: {count}
        </span>
      ) : null}
    </button>
  );
}
