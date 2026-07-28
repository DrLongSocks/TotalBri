const MIN_USAGE_DAYS = 3;

export type DaysUntilStockout = number | 'insufficient-data';

// Below 3 distinct days of usage history (or no measurable usage rate at
// all), the trailing-14-day average is too noisy to divide by — report
// honestly rather than showing a wildly wrong number of days.
export function daysUntilStockout({
  currentStock,
  avgDailyUsage,
  usageDaysInWindow,
}: {
  currentStock: number;
  avgDailyUsage: number;
  usageDaysInWindow: number;
}): DaysUntilStockout {
  if (usageDaysInWindow < MIN_USAGE_DAYS || avgDailyUsage <= 0) {
    return 'insufficient-data';
  }
  return currentStock / avgDailyUsage;
}
