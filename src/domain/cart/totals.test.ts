import { describe, expect, it } from 'vitest';
import { hydrateCart, itemCount, subtotal, uniqueLineCount } from './totals';
import type { Product } from '../product/schema';

function makeProduct(id: string, price: number, inStock = true): Product {
  return {
    id,
    slug: id.toLowerCase(),
    name: { es: id, en: id },
    description: { es: 'd', en: 'd' },
    category: 'varios',
    subcategory: 'varios',
    price,
    images: ['/x.webp', 'https://placehold.co/1'],
    tags: [],
    inStock,
    featured: false,
  };
}

describe('cart totals', () => {
  const products = new Map<string, Product>([
    ['P001', makeProduct('P001', 10)],
    ['P002', makeProduct('P002', 25)],
    ['P003', makeProduct('P003', 50, false)],
  ]);
  const resolve = (id: string) => products.get(id);

  it('subtotal sums only in-stock lines', () => {
    const { hydrated } = hydrateCart(
      {
        lines: [
          { productId: 'P001', quantity: 2, addedAt: 1 },
          { productId: 'P002', quantity: 1, addedAt: 2 },
          { productId: 'P003', quantity: 3, addedAt: 3 }, // out of stock
        ],
      },
      resolve,
    );
    expect(subtotal(hydrated)).toBe(2 * 10 + 1 * 25);
  });

  it('hydrate separates missing lines', () => {
    const { hydrated, missing } = hydrateCart(
      {
        lines: [
          { productId: 'P001', quantity: 1, addedAt: 1 },
          { productId: 'PXXX', quantity: 1, addedAt: 2 },
        ],
      },
      resolve,
    );
    expect(hydrated).toHaveLength(1);
    expect(missing).toHaveLength(1);
  });

  it('itemCount sums all quantities', () => {
    const count = itemCount({
      lines: [
        { productId: 'A', quantity: 3, addedAt: 1 },
        { productId: 'B', quantity: 2, addedAt: 2 },
      ],
    });
    expect(count).toBe(5);
  });

  it('uniqueLineCount counts lines not quantities', () => {
    const count = uniqueLineCount({
      lines: [
        { productId: 'A', quantity: 3, addedAt: 1 },
        { productId: 'B', quantity: 2, addedAt: 2 },
      ],
    });
    expect(count).toBe(2);
  });

  it('empty cart has zero subtotal', () => {
    expect(subtotal([])).toBe(0);
  });
});
