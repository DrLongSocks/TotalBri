import { describe, expect, it } from 'vitest';
import { parseFilterParams, serializeFilterParams, toggleArrayParam } from './url';

describe('filter param serialization', () => {
  it('round-trips sub, tag, range, sort, page, inStock', () => {
    const qs = 'sub=detergentes-liquidos&sub=suavizantes&tag=marca&tag=granel&min=10&max=100&sort=price-asc&page=2&inStock=true';
    const parsed = parseFilterParams(new URLSearchParams(qs));
    expect(parsed.sub).toEqual(['detergentes-liquidos', 'suavizantes']);
    expect(parsed.tag).toEqual(['marca', 'granel']);
    expect(parsed.min).toBe(10);
    expect(parsed.max).toBe(100);
    expect(parsed.sort).toBe('price-asc');
    expect(parsed.page).toBe(2);
    expect(parsed.inStock).toBe(true);

    const rebuilt = serializeFilterParams(parsed).toString();
    expect(rebuilt).toContain('sub=detergentes-liquidos');
    expect(rebuilt).toContain('sub=suavizantes');
    expect(rebuilt).toContain('min=10');
    expect(rebuilt).toContain('sort=price-asc');
    expect(rebuilt).toContain('page=2');
    expect(rebuilt).toContain('inStock=true');
  });

  it('omits page=1 to keep URLs clean', () => {
    const built = serializeFilterParams({ sort: 'relevance', page: 1 }).toString();
    expect(built).not.toContain('page=');
  });

  it('toggleArrayParam adds and removes a value', () => {
    expect(toggleArrayParam(undefined, 'a')).toEqual(['a']);
    expect(toggleArrayParam(['a'], 'b')).toEqual(['a', 'b']);
    expect(toggleArrayParam(['a', 'b'], 'a')).toEqual(['b']);
  });

  it('ignores unknown keys silently', () => {
    const parsed = parseFilterParams(new URLSearchParams('foo=bar&sub=multiusos'));
    expect(parsed.sub).toEqual(['multiusos']);
  });
});
