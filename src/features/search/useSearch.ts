'use client';

import Fuse from 'fuse.js';
import { useMemo } from 'react';
import type { Product } from '@/domain/product/schema';

export function useSearch(products: Product[]) {
  const fuse = useMemo(
    () =>
      new Fuse(products, {
        keys: [
          { name: 'name.es', weight: 0.5 },
          { name: 'name.en', weight: 0.4 },
          { name: 'tags', weight: 0.3 },
          { name: 'subcategory', weight: 0.2 },
          { name: 'description.es', weight: 0.1 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
        includeScore: false,
        minMatchCharLength: 2,
      }),
    [products],
  );

  return (query: string, limit = 8): Product[] => {
    if (!query.trim()) return [];
    return fuse.search(query.trim()).slice(0, limit).map((r) => r.item);
  };
}
