'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/features/cart/store';
import { cn } from '@/lib/cn';

type Props = {
  productId: string;
  unit: 'litro' | 'pieza';
  inStock: boolean;
};

export function AddToCartRow({ productId, unit, inStock }: Props) {
  const [qty, setQty] = useState(1);
  const add = useCartStore((s) => s.add);

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  const unitLabel = unit === 'litro'
    ? qty === 1 ? '1 litro' : `${qty} litros`
    : qty === 1 ? '1 pieza' : `${qty} piezas`;

  if (!inStock) {
    return (
      <div className="mt-3 flex h-10 items-center justify-center rounded-xl bg-porcelain px-3 text-xs font-medium text-slate">
        Agotado
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <div className="flex items-center rounded-xl border border-mist bg-porcelain">
        <button
          type="button"
          onClick={dec}
          aria-label="Menos"
          className="flex h-9 w-9 items-center justify-center rounded-l-xl text-slate transition hover:bg-mist hover:text-ink"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-16 text-center text-xs font-medium tabular-nums text-ink">
          {unitLabel}
        </span>
        <button
          type="button"
          onClick={inc}
          aria-label="Más"
          className="flex h-9 w-9 items-center justify-center rounded-r-xl text-slate transition hover:bg-mist hover:text-ink"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          add(productId, qty);
          setQty(1);
        }}
        className={cn(
          'flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-azure text-xs font-semibold text-paper transition hover:bg-azure-deep active:scale-95',
        )}
      >
        <ShoppingBag className="h-3.5 w-3.5" />
        Agregar
      </button>
    </div>
  );
}
