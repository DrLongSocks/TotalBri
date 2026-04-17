import { describe, expect, it } from 'vitest';
import {
  findBySlug,
  filterProducts,
  findByCategory,
  findFeatured,
  findRelated,
  paginate,
} from './queries';

describe('product queries (uses real CSV)', () => {
  it('findBySlug returns a real product', () => {
    const p = findBySlug('desinfectante-cloralex-10l');
    expect(p?.id).toBe('P035');
    expect(p?.price).toBe(140);
  });

  it('findBySlug returns undefined for unknown slug', () => {
    expect(findBySlug('no-existe-xxx-foo')).toBeUndefined();
  });

  it('findByCategory returns products of that category', () => {
    const items = findByCategory('jarceria');
    expect(items.length).toBeGreaterThan(10);
    for (const p of items) {
      expect(p.category).toBe('jarceria');
    }
  });

  it('filter by subcategory narrows results', () => {
    const trapeadores = filterProducts({ subcategories: ['trapeadores'] });
    expect(trapeadores.every((p) => p.subcategory === 'trapeadores')).toBe(true);
    expect(trapeadores.length).toBeGreaterThan(0);
  });

  it('filter by price range', () => {
    const cheap = filterProducts({ maxPrice: 15 });
    for (const p of cheap) expect(p.price).toBeLessThanOrEqual(15);
  });

  it('search scoring finds products by name and tags', () => {
    const results = filterProducts({ search: 'cloralex' });
    expect(results[0]?.slug).toBe('desinfectante-cloralex-10l');
  });

  it('search with zero matches returns empty', () => {
    const results = filterProducts({ search: 'zzzzxxxyyyyy' });
    expect(results).toHaveLength(0);
  });

  it('search handles special regex chars safely', () => {
    const results = filterProducts({ search: '(cloro)' });
    expect(Array.isArray(results)).toBe(true);
  });

  it('findFeatured returns only featured products', () => {
    const featured = findFeatured(20);
    expect(featured.every((p) => p.featured)).toBe(true);
  });

  it('findRelated excludes self and matches subcategory', () => {
    const cloralex = findBySlug('desinfectante-cloralex-10l')!;
    const related = findRelated(cloralex);
    expect(related.every((p) => p.id !== cloralex.id)).toBe(true);
    expect(related.every((p) => p.subcategory === cloralex.subcategory)).toBe(true);
  });

  it('paginate returns correct page slice', () => {
    const all = findByCategory('limpieza-hogar');
    const { items, page, totalPages } = paginate(all, 2, 10);
    expect(page).toBe(2);
    expect(totalPages).toBe(Math.ceil(all.length / 10));
    expect(items.length).toBeLessThanOrEqual(10);
    expect(items[0]).toBe(all[10]);
  });

  it('sort price-asc orders by ascending price', () => {
    const sorted = filterProducts({ sort: 'price-asc', subcategories: ['multiusos'] });
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1]!;
      const cur = sorted[i]!;
      expect(cur.price).toBeGreaterThanOrEqual(prev.price);
    }
  });
});
