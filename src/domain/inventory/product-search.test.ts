import { describe, expect, it } from 'vitest';
import type { Product } from '@/domain/product/schema';
import { searchProducts } from './product-search';

function product(overrides: Partial<Product>): Product {
  return {
    id: 'P001',
    slug: 'placeholder',
    name: { es: 'Placeholder', en: 'Placeholder' },
    description: { es: 'x', en: 'x' },
    category: 'varios',
    subcategory: 'x',
    price: 10,
    images: ['x.jpg'],
    tags: [],
    inStock: true,
    featured: false,
    unit: 'pieza',
    ...overrides,
  };
}

const products: Product[] = [
  product({ id: 'P010', slug: 'detergente-roma', name: { es: 'Detergente Roma', en: 'Roma Detergent' } }),
  product({ id: 'P011', slug: 'detergente-pino', name: { es: 'Detergente Pino', en: 'Pine Detergent' } }),
  product({ id: 'P012', slug: 'suavizante-lila', name: { es: 'Suavizante Lila', en: 'Lila Softener' } }),
];

describe('searchProducts', () => {
  it('matches "roma" against "Detergente Roma" even though the match is not at the start', () => {
    const results = searchProducts(products, 'roma');
    expect(results.map((p) => p.id)).toContain('P010');
  });

  it('returns nothing for an empty query', () => {
    expect(searchProducts(products, '   ')).toEqual([]);
  });

  it('respects the limit', () => {
    expect(searchProducts(products, 'detergente', 1)).toHaveLength(1);
  });
});
