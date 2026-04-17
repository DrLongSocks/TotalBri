import { EMPTY_CART, MAX_QTY, type CartAction, type CartState } from './types';

function clampQty(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(Math.floor(n), MAX_QTY));
}

export function cartReducer(state: CartState = EMPTY_CART, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const qty = clampQty(action.quantity);
      if (qty === 0) return state;
      const existing = state.lines.find((l) => l.productId === action.productId);
      if (existing) {
        const nextQty = clampQty(existing.quantity + qty);
        return {
          lines: state.lines.map((l) =>
            l.productId === action.productId ? { ...l, quantity: nextQty } : l,
          ),
        };
      }
      return {
        lines: [
          ...state.lines,
          { productId: action.productId, quantity: qty, addedAt: Date.now() },
        ],
      };
    }
    case 'REMOVE': {
      return { lines: state.lines.filter((l) => l.productId !== action.productId) };
    }
    case 'SET_QUANTITY': {
      const qty = clampQty(action.quantity);
      if (qty === 0) {
        return { lines: state.lines.filter((l) => l.productId !== action.productId) };
      }
      const exists = state.lines.some((l) => l.productId === action.productId);
      if (!exists) {
        return {
          lines: [
            ...state.lines,
            { productId: action.productId, quantity: qty, addedAt: Date.now() },
          ],
        };
      }
      return {
        lines: state.lines.map((l) =>
          l.productId === action.productId ? { ...l, quantity: qty } : l,
        ),
      };
    }
    case 'CLEAR':
      return EMPTY_CART;
    default:
      return state;
  }
}
