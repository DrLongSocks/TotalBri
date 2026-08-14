// Best-guess ml quantity from an invoice line's raw quantity/unit — a
// pre-fill for the review screen, never written to the database without an
// admin confirming it first (see InvoiceUploadForm). Fragrance oil density
// isn't exactly water's, but 1kg ≈ 1000ml is the approximation the user
// chose when entering the Química Boss invoice by hand this same session.
const KG_UNIT_PATTERN = /^(kg|kgm|kilo|kilogram|kilogramo)s?\.?$/i;

export function guessQuantityMl(quantity: number, unit: string): number {
  const normalized = unit.trim();
  if (KG_UNIT_PATTERN.test(normalized)) {
    return quantity * 1000;
  }
  return quantity;
}

export type WorkerEnteredUnit = 'ml' | 'l' | 'kg';

// For the NFC tap-to-log flow: the worker picks a unit from a fixed dropdown
// (not free text) since materials are tracked in ml but a worker might
// measure in liters or kilos. Same 1kg≈1000ml approximation as
// guessQuantityMl above.
export function convertToMl(quantity: number, unit: WorkerEnteredUnit): number {
  if (unit === 'l' || unit === 'kg') {
    return quantity * 1000;
  }
  return quantity;
}
