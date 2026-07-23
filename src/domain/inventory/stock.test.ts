import { describe, expect, it } from 'vitest';
import { didCrossLowStockThreshold } from './stock';

describe('didCrossLowStockThreshold', () => {
  it('is true when usage pushes stock from above to at-or-below threshold', () => {
    expect(didCrossLowStockThreshold(1200, 800, 1000)).toBe(true);
    expect(didCrossLowStockThreshold(1200, 1000, 1000)).toBe(true);
  });

  it('is false when stock stays above threshold', () => {
    expect(didCrossLowStockThreshold(1200, 1100, 1000)).toBe(false);
  });

  it('is false when stock was already at-or-below threshold (no new crossing)', () => {
    expect(didCrossLowStockThreshold(1000, 900, 1000)).toBe(false);
    expect(didCrossLowStockThreshold(900, 800, 1000)).toBe(false);
  });

  it('is false for a restock that increases stock', () => {
    expect(didCrossLowStockThreshold(800, 1500, 1000)).toBe(false);
  });
});
