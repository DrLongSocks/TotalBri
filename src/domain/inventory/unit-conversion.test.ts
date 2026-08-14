import { describe, expect, it } from 'vitest';
import { convertToMl, guessQuantityMl } from './unit-conversion';

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

describe('convertToMl', () => {
  it('passes ml through unchanged', () => {
    expect(convertToMl(500, 'ml')).toBe(500);
  });

  it('converts liters at 1L = 1000ml', () => {
    expect(convertToMl(1.5, 'l')).toBe(1500);
  });

  it('converts kg at 1kg = 1000ml', () => {
    expect(convertToMl(2, 'kg')).toBe(2000);
  });
});
