// Weighted-average cost, recomputed on every restock. Blends the value of
// stock already on hand with the cost of what's coming in, so a fluctuating
// purchase price doesn't make old, already-paid-for stock look more/less
// expensive than it was.
export function computeWeightedAvgCost({
  currentStock,
  oldAvgCost,
  restockQuantity,
  totalCost,
}: {
  currentStock: number;
  oldAvgCost: number;
  restockQuantity: number;
  totalCost: number;
}): number {
  const newStock = currentStock + restockQuantity;
  if (newStock <= 0) {
    return 0;
  }
  return (currentStock * oldAvgCost + totalCost) / newStock;
}
