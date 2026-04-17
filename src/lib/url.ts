export type FilterParams = {
  sub?: string[];
  tag?: string[];
  min?: number;
  max?: number;
  sort?: string;
  page?: number;
  inStock?: boolean;
};

export function parseFilterParams(params: URLSearchParams): FilterParams {
  const result: FilterParams = {};

  const sub = params.getAll('sub');
  if (sub.length) result.sub = sub;

  const tag = params.getAll('tag');
  if (tag.length) result.tag = tag;

  const min = params.get('min');
  if (min !== null && !Number.isNaN(Number(min))) result.min = Number(min);

  const max = params.get('max');
  if (max !== null && !Number.isNaN(Number(max))) result.max = Number(max);

  const sort = params.get('sort');
  if (sort) result.sort = sort;

  const page = params.get('page');
  if (page !== null && !Number.isNaN(Number(page))) result.page = Number(page);

  const inStock = params.get('inStock');
  if (inStock === 'true') result.inStock = true;

  return result;
}

export function serializeFilterParams(filters: FilterParams): URLSearchParams {
  const params = new URLSearchParams();

  filters.sub?.forEach((s) => params.append('sub', s));
  filters.tag?.forEach((t) => params.append('tag', t));
  if (filters.min !== undefined) params.set('min', String(filters.min));
  if (filters.max !== undefined) params.set('max', String(filters.max));
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.page !== undefined && filters.page > 1) params.set('page', String(filters.page));
  if (filters.inStock) params.set('inStock', 'true');

  return params;
}

export function toggleArrayParam(values: string[] | undefined, value: string): string[] {
  const current = values ?? [];
  if (current.includes(value)) return current.filter((v) => v !== value);
  return [...current, value];
}
