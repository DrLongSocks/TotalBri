// Edge-triggered: true only on the transaction that pushes stock from above
// the threshold to at-or-below it. Logging further usage while already below
// threshold returns false, so exactly one alert fires per crossing.
export function didCrossLowStockThreshold(before: number, after: number, threshold: number): boolean {
  return before > threshold && after <= threshold;
}
