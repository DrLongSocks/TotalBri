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
