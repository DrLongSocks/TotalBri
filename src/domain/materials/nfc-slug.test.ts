import { describe, expect, it } from 'vitest';
import { slugifyForNfcTag } from './nfc-slug';

describe('slugifyForNfcTag', () => {
  it('lowercases and hyphenates', () => {
    expect(slugifyForNfcTag('Piu Colore')).toBe('piu-colore');
  });

  it('strips accents', () => {
    expect(slugifyForNfcTag('Limón 990')).toBe('limon-990');
  });

  it('strips punctuation and collapses separators', () => {
    expect(slugifyForNfcTag('Ariel Líq.')).toBe('ariel-liq');
    expect(slugifyForNfcTag('Soft Baby (Vel Rosita)')).toBe('soft-baby-vel-rosita');
  });

  it('trims leading/trailing hyphens', () => {
    expect(slugifyForNfcTag('  Blue Moon  ')).toBe('blue-moon');
  });
});
