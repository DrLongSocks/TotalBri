import type { Product } from '../product/schema';
import type { CartState, CartLine } from './types';

export type HydratedLine = {
  line: CartLine;
  product: Product;
};

export function hydrateCart(
  state: CartState,
  resolve: (id: string) => Product | undefined,
): { hydrated: HydratedLine[]; missing: CartLine[] } {
  const hydrated: HydratedLine[] = [];
  const missing: CartLine[] = [];
  for (const line of state.lines) {
    const product = resolve(line.productId);
    if (product) hydrated.push({ line, product });
    else missing.push(line);
  }
  return { hydrated, missing };
}

export function subtotal(hydrated: HydratedLine[]): number {
  return hydrated
    .filter(({ product }) => product.inStock)
    .reduce((sum, { line, product }) => sum + line.quantity * product.price, 0);
}

export function itemCount(state: CartState): number {
  return state.lines.reduce((sum, l) => sum + l.quantity, 0);
}

export function uniqueLineCount(state: CartState): number {
  return state.lines.length;
}
