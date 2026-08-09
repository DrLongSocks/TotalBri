import { describe, expect, it } from 'vitest';
import { nextSortDirection, resolveMaterialsSort } from './sort';

describe('resolveMaterialsSort', () => {
  it('defaults to name/asc when nothing is specified', () => {
    expect(resolveMaterialsSort({})).toEqual({ sort: 'name', dir: 'asc' });
  });

  it('accepts a whitelisted column and dir', () => {
    expect(resolveMaterialsSort({ sort: 'currentStock', dir: 'desc' })).toEqual({
      sort: 'currentStock',
      dir: 'desc',
    });
  });

  it('falls back to name for an unknown/unsafe column', () => {
    expect(resolveMaterialsSort({ sort: 'passwordHash', dir: 'desc' })).toEqual({
      sort: 'name',
      dir: 'desc',
    });
  });

  it('falls back to asc for anything other than "desc"', () => {
    expect(resolveMaterialsSort({ sort: 'code', dir: 'nope' })).toEqual({ sort: 'code', dir: 'asc' });
  });
});

describe('nextSortDirection', () => {
  const current = { sort: 'name', dir: 'asc' } as const;

  it('starts a different column at asc', () => {
    expect(nextSortDirection(current, 'code')).toBe('asc');
  });

  it('toggles asc -> desc on the active column', () => {
    expect(nextSortDirection(current, 'name')).toBe('desc');
  });

  it('toggles desc -> asc on the active column', () => {
    expect(nextSortDirection({ sort: 'name', dir: 'desc' }, 'name')).toBe('asc');
  });
});
