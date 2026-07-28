import { describe, expect, it } from 'vitest';
import { computeWeightedAvgCost } from './cost';

describe('computeWeightedAvgCost', () => {
  it('sets the cost directly from the first restock ever', () => {
    expect(
      computeWeightedAvgCost({ currentStock: 0, oldAvgCost: 0, restockQuantity: 100, totalCost: 500 }),
    ).toBe(5);
  });

  it('blends existing stock value with the new purchase', () => {
    // 100 units @ $5 (worth $500) + 50 units for $400 -> $900 / 150 units = $6
    expect(
      computeWeightedAvgCost({ currentStock: 100, oldAvgCost: 5, restockQuantity: 50, totalCost: 400 }),
    ).toBe(6);
  });

  it('returns 0 rather than dividing by zero when the resulting stock is zero', () => {
    expect(
      computeWeightedAvgCost({ currentStock: 0, oldAvgCost: 0, restockQuantity: 0, totalCost: 0 }),
    ).toBe(0);
  });
});
