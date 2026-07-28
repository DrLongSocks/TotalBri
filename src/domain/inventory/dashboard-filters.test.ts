import { describe, expect, it } from 'vitest';
import { resolveDashboardFilters } from './dashboard-filters';

const now = new Date('2026-01-15T12:00:00Z');

describe('resolveDashboardFilters', () => {
  it('defaults to a 7-day window ending now when nothing is specified', () => {
    const filters = resolveDashboardFilters({}, now);
    expect(filters.range).toBe('week');
    expect(filters.to).toEqual(now);
    expect(filters.from.toISOString().slice(0, 10)).toBe('2026-01-09');
  });

  it('derives a 1-day window for range=day and a 30-day window for range=month', () => {
    expect(resolveDashboardFilters({ range: 'day' }, now).from.toISOString().slice(0, 10)).toBe(
      '2026-01-15',
    );
    expect(resolveDashboardFilters({ range: 'month' }, now).from.toISOString().slice(0, 10)).toBe(
      '2025-12-17',
    );
  });

  it('an explicit from/to overrides the range-derived window', () => {
    const filters = resolveDashboardFilters({ range: 'week', from: '2026-01-01', to: '2026-01-02' }, now);
    expect(filters.from.toISOString().slice(0, 10)).toBe('2026-01-01');
    expect(filters.to.toISOString().slice(0, 10)).toBe('2026-01-02');
  });

  it('passes through material/product filters when present', () => {
    const filters = resolveDashboardFilters({ material: 'm1', product: 'P001' }, now);
    expect(filters.materialId).toBe('m1');
    expect(filters.productId).toBe('P001');
  });
});
