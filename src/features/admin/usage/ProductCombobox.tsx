'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { searchProducts } from '@/domain/inventory/product-search';
import type { Product } from '@/domain/product/schema';

// A small hand-built combobox rather than a dropdown: the real catalog is
// 268 products, too large to scroll, but not large enough to justify pulling
// in a combobox library — Radix has no primitive for this.
export function ProductCombobox({
  products,
  recentProducts = [],
  placeholder,
  recentLabel = '',
  value,
  onSelect,
  name,
  required = true,
}: {
  products: readonly Product[];
  recentProducts?: readonly Product[];
  placeholder: string;
  recentLabel?: string;
  value: Product | null;
  onSelect: (product: Product | null) => void;
  /** When set, renders a hidden input so this participates in a plain GET/POST form. */
  name?: string;
  required?: boolean;
}) {
  const [query, setQuery] = useState(value?.name.es ?? '');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showingRecent = !query.trim();
  const listItems = showingRecent ? recentProducts : searchProducts(products, query);

  function handleSelect(product: Product) {
    onSelect(product);
    setQuery(product.name.es);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      {name && <input type="hidden" name={name} value={value?.id ?? ''} />}
      <Input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          onSelect(null);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        required={required}
      />
      {open && listItems.length > 0 && (
        <div className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-mist bg-paper shadow-[var(--shadow-card-hover)]">
          {showingRecent && <div className="eyebrow px-3 pb-1 pt-2 text-slate">{recentLabel}</div>}
          {listItems.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => handleSelect(product)}
              className="block w-full px-3 py-2 text-left text-sm hover:bg-porcelain"
            >
              {product.name.es}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
