export type DashboardRange = 'day' | 'week' | 'month';

export type DashboardFilters = {
  range: DashboardRange;
  from: Date;
  to: Date;
  materialId?: string;
  productId?: string;
};

const RANGE_DAYS: Record<DashboardRange, number> = { day: 1, week: 7, month: 30 };

// Pure so the date math (default range, explicit from/to override, window
// length) is testable without a request context — `now` is injected rather
// than read from the clock directly.
export function resolveDashboardFilters(
  searchParams: Record<string, string | undefined>,
  now: Date,
): DashboardFilters {
  const range: DashboardRange =
    searchParams.range === 'day' || searchParams.range === 'month' ? searchParams.range : 'week';

  // Explicit UTC (`Z`) so date-only query params parse the same way in dev
  // (whatever the machine's local timezone is) and in production.
  const to = searchParams.to ? new Date(`${searchParams.to}T23:59:59Z`) : now;
  const from = searchParams.from
    ? new Date(`${searchParams.from}T00:00:00Z`)
    : new Date(to.getTime() - (RANGE_DAYS[range] - 1) * 24 * 60 * 60 * 1000);

  return {
    range,
    from,
    to,
    materialId: searchParams.material || undefined,
    productId: searchParams.product || undefined,
  };
}
