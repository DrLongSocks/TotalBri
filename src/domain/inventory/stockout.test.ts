import { describe, expect, it } from 'vitest';
import { daysUntilStockout } from './stockout';

describe('daysUntilStockout', () => {
  it('divides current stock by the trailing average daily usage', () => {
    expect(daysUntilStockout({ currentStock: 1000, avgDailyUsage: 100, usageDaysInWindow: 10 })).toBe(
      10,
    );
  });

  it('reports insufficient data below the 3-day usage-history gate', () => {
    expect(
      daysUntilStockout({ currentStock: 1000, avgDailyUsage: 100, usageDaysInWindow: 2 }),
    ).toBe('insufficient-data');
  });

  it('reports insufficient data when there is no measurable usage rate', () => {
    expect(daysUntilStockout({ currentStock: 1000, avgDailyUsage: 0, usageDaysInWindow: 10 })).toBe(
      'insufficient-data',
    );
  });
});
