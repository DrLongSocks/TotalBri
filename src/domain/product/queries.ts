import { getAllProducts, getProductBySlug } from './repository';
import type { Product, Category } from './schema';

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'name-asc';

export type ProductQuery = {
  category?: Category;
  subcategories?: string[];
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sort?: SortOption;
  search?: string;
};

const PAGE_SIZE = 24;

export function findBySlug(slug: string): Product | undefined {
  return getProductBySlug(slug);
}

export function filterProducts(query: ProductQuery): Product[] {
  const all = getAllProducts();
  let results = all.filter((p) => {
    if (query.category && p.category !== query.category) return false;
    if (query.subcategories?.length && !query.subcategories.includes(p.subcategory)) return false;
    if (query.tags?.length && !query.tags.some((t) => p.tags.includes(t))) return false;
    if (query.minPrice !== undefined && p.price < query.minPrice) return false;
    if (query.maxPrice !== undefined && p.price > query.maxPrice) return false;
    if (query.inStockOnly && !p.inStock) return false;
    return true;
  });

  if (query.search?.trim()) {
    results = scoreSearch(results, query.search.trim());
  }

  switch (query.sort) {
    case 'price-asc':
      results = [...results].sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      results = [...results].sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      results = [...results].sort((a, b) => a.name.es.localeCompare(b.name.es, 'es'));
      break;
    default:
      break;
  }

  return results;
}

function scoreSearch(products: Product[], raw: string): Product[] {
  const q = raw.toLocaleLowerCase('es').replace(/[.*+?^${}()|[\]\\]/g, '');
  const terms = q.split(/\s+/).filter(Boolean);

  const scored = products.map((p) => {
    const hay = [
      p.name.es.toLocaleLowerCase('es'),
      p.name.en.toLocaleLowerCase('en'),
      p.description.es.toLocaleLowerCase('es'),
      p.tags.join(' ').toLocaleLowerCase('es'),
      p.subcategory,
    ].join(' ');

    let score = 0;
    for (const term of terms) {
      if (!hay.includes(term)) return { product: p, score: -1 };
      if (p.name.es.toLocaleLowerCase('es').includes(term)) score += 10;
      if (p.tags.some((t) => t.includes(term))) score += 4;
      if (p.subcategory.includes(term)) score += 2;
      score += 1;
    }
    return { product: p, score };
  });

  return scored
    .filter((s) => s.score >= 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.product);
}

export function paginate<T>(items: T[], page: number, pageSize: number = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  return {
    items: items.slice(start, end),
    page: currentPage,
    totalPages,
    total: items.length,
    pageSize,
  };
}

export function findRelated(product: Product, limit = 6): Product[] {
  const all = getAllProducts();
  return all
    .filter(
      (p) =>
        p.id !== product.id &&
        p.category === product.category &&
        p.subcategory === product.subcategory,
    )
    .slice(0, limit);
}

export function findFeatured(limit = 12): Product[] {
  return getAllProducts()
    .filter((p) => p.featured && p.inStock)
    .slice(0, limit);
}

export function findByCategory(category: Category, limit?: number): Product[] {
  const results = getAllProducts().filter((p) => p.category === category);
  return limit ? results.slice(0, limit) : results;
}

export function getSubcategoriesFor(category: Category): string[] {
  const set = new Set<string>();
  for (const p of getAllProducts()) {
    if (p.category === category) set.add(p.subcategory);
  }
  return Array.from(set).sort();
}

export function getAllTagsFor(category?: Category): string[] {
  const set = new Set<string>();
  for (const p of getAllProducts()) {
    if (category && p.category !== category) continue;
    p.tags.forEach((t) => set.add(t));
  }
  return Array.from(set).sort();
}

export { PAGE_SIZE };
