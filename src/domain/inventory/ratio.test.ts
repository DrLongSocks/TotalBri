import { describe, expect, it } from 'vitest';
import { fragrancePerUnit, hasEnoughPointsForTrend } from './ratio';

describe('fragrancePerUnit', () => {
  it('divides fragrance quantity by product quantity produced', () => {
    expect(fragrancePerUnit(50, 500)).toBe(0.1);
  });

  it('returns null instead of dividing by zero when nothing was produced', () => {
    expect(fragrancePerUnit(50, 0)).toBeNull();
  });
});

describe('hasEnoughPointsForTrend', () => {
  it('is false below the 5-point gate', () => {
    expect(hasEnoughPointsForTrend(4)).toBe(false);
  });

  it('is true at and above the 5-point gate', () => {
    expect(hasEnoughPointsForTrend(5)).toBe(true);
    expect(hasEnoughPointsForTrend(6)).toBe(true);
  });
});
