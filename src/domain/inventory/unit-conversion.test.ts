import { describe, expect, it } from 'vitest';
import { guessQuantityMl } from './unit-conversion';

describe('guessQuantityMl', () => {
  it('converts kg-family units to ml at 1kg = 1000ml', () => {
    expect(guessQuantityMl(10, 'KGM')).toBe(10000);
    expect(guessQuantityMl(5, 'kg')).toBe(5000);
    expect(guessQuantityMl(2.5, 'Kilogramo')).toBe(2500);
  });

  it('passes through non-kg units unchanged', () => {
    expect(guessQuantityMl(500, 'ml')).toBe(500);
    expect(guessQuantityMl(500, 'L')).toBe(500);
    expect(guessQuantityMl(500, '')).toBe(500);
  });
});
