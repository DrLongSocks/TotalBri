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

function rangeHref(filters: DashboardFilters, range: DashboardRange) {
  const params = new URLSearchParams();
  params.set('range', range);
  if (filters.materialId) params.set('material', filters.materialId);
  if (filters.productId) params.set('product', filters.productId);
  return `/admin/dashboard?${params.toString()}`;
}

// The Día/Semana/Mes links — sits next to the hero heading, separate from
// the filter-pills form so the two can be laid out independently on the page.
export function DashboardRangeToggle({
  filters,
  messages,
}: {
  filters: DashboardFilters;
  messages: ReturnType<typeof getAdminMessages>['dashboard'];
}) {
  const rangeLabels: Record<DashboardRange, string> = {
    day: messages.rangeDay,
    week: messages.rangeWeek,
    month: messages.rangeMonth,
  };

  return (
    <div className="flex gap-3 text-xs">
      {(['day', 'week', 'month'] as const).map((range) => (
        <Link
          key={range}
          href={rangeHref(filters, range)}
          className={
            filters.range === range ? 'font-semibold text-azure' : 'text-paper/60 hover:text-paper'
          }
        >
          {rangeLabels[range]}
        </Link>
      ))}
    </div>
  );
}

// The material/product/date-range filter form — full width, below the
// heading row.
export function DashboardFilterForm({
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

  return (
    <form action="/admin/dashboard" className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto_auto] sm:items-end">
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
      <Button type="submit" variant="onInk">
        {messages.apply}
      </Button>
    </form>
  );
}
