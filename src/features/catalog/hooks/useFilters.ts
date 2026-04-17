'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { parseFilterParams, serializeFilterParams, toggleArrayParam, type FilterParams } from '@/lib/url';

export function useFilters() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();

  const filters = useMemo(() => parseFilterParams(new URLSearchParams(params.toString())), [params]);

  const replace = useCallback(
    (next: FilterParams) => {
      const qs = serializeFilterParams(next).toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
    },
    [pathname, router],
  );

  const toggleSub = useCallback(
    (slug: string) => replace({ ...filters, sub: toggleArrayParam(filters.sub, slug), page: 1 }),
    [filters, replace],
  );

  const toggleTag = useCallback(
    (tag: string) => replace({ ...filters, tag: toggleArrayParam(filters.tag, tag), page: 1 }),
    [filters, replace],
  );

  const setSort = useCallback((sort: string) => replace({ ...filters, sort }), [filters, replace]);

  const setPage = useCallback((page: number) => replace({ ...filters, page }), [filters, replace]);

  const setRange = useCallback(
    (min?: number, max?: number) => replace({ ...filters, min, max, page: 1 }),
    [filters, replace],
  );

  const setInStock = useCallback(
    (inStock: boolean) => replace({ ...filters, inStock: inStock || undefined, page: 1 }),
    [filters, replace],
  );

  const clearAll = useCallback(() => replace({}), [replace]);

  return {
    filters,
    toggleSub,
    toggleTag,
    setSort,
    setPage,
    setRange,
    setInStock,
    clearAll,
    activeCount:
      (filters.sub?.length ?? 0) +
      (filters.tag?.length ?? 0) +
      (filters.min !== undefined ? 1 : 0) +
      (filters.max !== undefined ? 1 : 0) +
      (filters.inStock ? 1 : 0),
  };
}
