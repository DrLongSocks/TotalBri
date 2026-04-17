export type CartLine = {
  productId: string;
  quantity: number;
  addedAt: number;
};

export type CartState = {
  lines: CartLine[];
};

export type CartAction =
  | { type: 'ADD'; productId: string; quantity: number }
  | { type: 'REMOVE'; productId: string }
  | { type: 'SET_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR' };

export const MAX_QTY = 99;
export const EMPTY_CART: CartState = { lines: [] };
