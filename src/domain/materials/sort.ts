export const SORTABLE_MATERIAL_COLUMNS = [
  'name',
  'code',
  'provider',
  'category',
  'currentStock',
  'lowStockThreshold',
] as const;

export type MaterialSortColumn = (typeof SORTABLE_MATERIAL_COLUMNS)[number];
export type SortDirection = 'asc' | 'desc';

export type MaterialsSort = {
  sort: MaterialSortColumn;
  dir: SortDirection;
};

function isSortColumn(value: string | undefined): value is MaterialSortColumn {
  return SORTABLE_MATERIAL_COLUMNS.includes(value as MaterialSortColumn);
}

// Pure so the whitelist/default logic is testable without a request context
// — mirrors resolveDashboardFilters. Invalid or missing params fall back to
// the table's original order (name, ascending).
export function resolveMaterialsSort(searchParams: { sort?: string; dir?: string }): MaterialsSort {
  return {
    sort: isSortColumn(searchParams.sort) ? searchParams.sort : 'name',
    dir: searchParams.dir === 'desc' ? 'desc' : 'asc',
  };
}

// Click behavior: a different column always starts at ascending; clicking
// the already-active column toggles asc <-> desc.
export function nextSortDirection(current: MaterialsSort, column: MaterialSortColumn): SortDirection {
  if (current.sort !== column) return 'asc';
  return current.dir === 'asc' ? 'desc' : 'asc';
}
