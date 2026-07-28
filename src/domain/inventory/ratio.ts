const MIN_POINTS_FOR_TREND = 5;

// Null rather than a bogus ratio when nothing was actually produced.
export function fragrancePerUnit(quantity: number, productQuantity: number): number | null {
  if (productQuantity <= 0) {
    return null;
  }
  return quantity / productQuantity;
}

export function hasEnoughPointsForTrend(pointCount: number): boolean {
  return pointCount >= MIN_POINTS_FOR_TREND;
}
