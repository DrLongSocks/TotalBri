'use client';

import { ShoppingCart } from 'lucide-react';
import { useCartDrawer } from './CartDrawerProvider';
import { useCartStore } from './store';
import { useHasMounted } from './useHasMounted';
import { itemCount } from '@/domain/cart/totals';

type Props = {
  variant?: 'icon' | 'header-button';
};

export function CartTrigger({ variant = 'icon' }: Props) {
  const { openDrawer } = useCartDrawer();
  const lines = useCartStore((s) => s.lines);
  const mounted = useHasMounted();
  const count = itemCount({ lines });

  if (variant === 'header-button') {
    return (
      <button
        type="button"
        onClick={openDrawer}
        aria-label="Mi pedido"
        className="flex items-center gap-2.5 rounded-[10px] bg-azure px-4 py-2.5 text-paper transition-colors hover:bg-azure-deep"
      >
        <ShoppingCart className="h-[18px] w-[18px]" />
        <span className="font-display text-[15px] font-extrabold uppercase tracking-wide">
          Mi pedido
        </span>
        {mounted && count > 0 ? (
          <span
            aria-hidden
            className="flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-card px-1.5 text-[11px] font-extrabold leading-none text-ink"
          >
            {count > 99 ? '99+' : count}
          </span>
        ) : null}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label="Mi pedido"
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-paper/80 hover:bg-paper/10"
    >
      <ShoppingCart className="h-5 w-5" />
      {mounted && count > 0 ? (
        <span
          aria-hidden
          className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-azure px-1.5 text-[11px] font-extrabold leading-none text-paper"
        >
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </button>
  );
}
