import Fuse, { type IFuseOptions } from 'fuse.js';
import type { Product } from '@/domain/product/schema';

// Mirrors src/features/search/useSearch.ts's config exactly, so the admin
// log flow's product search behaves identically to the storefront's.
const FUSE_OPTIONS: IFuseOptions<Product> = {
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
};

export function searchProducts(products: readonly Product[], query: string, limit = 8): Product[] {
  if (!query.trim()) {
    return [];
  }
  const fuse = new Fuse(products as Product[], FUSE_OPTIONS);
  return fuse
    .search(query.trim())
    .slice(0, limit)
    .map((result) => result.item);
}
