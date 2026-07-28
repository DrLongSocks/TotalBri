'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { getAdminMessages } from '@/domain/admin-i18n/messages';
import type { DashboardFilters, DashboardRange } from '@/domain/inventory/dashboard-filters';
import type { Product } from '@/domain/product/schema';
import { ProductCombobox } from '@/features/admin/usage/ProductCombobox';

function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function DashboardFiltersBar({
  filters,
  materials,
  products,
  selectedProduct,
  messages,
}: {
  filters: DashboardFilters;
  materials: { id: string; name: string }[];
  products: readonly Product[];
  selectedProduct: Product | null;
  messages: ReturnType<typeof getAdminMessages>['dashboard'];
}) {
  const [product, setProduct] = useState<Product | null>(selectedProduct);

  function rangeHref(range: DashboardRange) {
    const params = new URLSearchParams();
    params.set('range', range);
    if (filters.materialId) params.set('material', filters.materialId);
    if (filters.productId) params.set('product', filters.productId);
    return `/dashboard?${params.toString()}`;
  }

  const rangeLabels: Record<DashboardRange, string> = {
    day: messages.rangeDay,
    week: messages.rangeWeek,
    month: messages.rangeMonth,
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="flex gap-3 text-xs">
        {(['day', 'week', 'month'] as const).map((range) => (
          <Link
            key={range}
            href={rangeHref(range)}
            className={filters.range === range ? 'font-semibold text-azure' : 'text-slate hover:text-ink'}
          >
            {rangeLabels[range]}
          </Link>
        ))}
      </div>
      <form action="/dashboard" className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto_auto] sm:items-end">
        <input type="hidden" name="range" value={filters.range} />
        <select
          name="material"
          defaultValue={filters.materialId ?? ''}
          className="h-11 rounded-full border border-mist bg-paper px-4 text-sm"
        >
          <option value="">{messages.allMaterials}</option>
          {materials.map((material) => (
            <option key={material.id} value={material.id}>
              {material.name}
            </option>
          ))}
        </select>
        <ProductCombobox
          products={products}
          value={product}
          onSelect={setProduct}
          name="product"
          required={false}
          placeholder={messages.product}
        />
        <input
          type="date"
          name="from"
          defaultValue={toDateInputValue(filters.from)}
          className="h-11 rounded-full border border-mist bg-paper px-4 text-sm"
        />
        <input
          type="date"
          name="to"
          defaultValue={toDateInputValue(filters.to)}
          className="h-11 rounded-full border border-mist bg-paper px-4 text-sm"
        />
        <Button type="submit">{messages.apply}</Button>
      </form>
    </div>
  );
}
