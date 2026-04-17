'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { cartReducer } from '@/domain/cart/reducer';
import { EMPTY_CART, type CartAction, type CartState } from '@/domain/cart/types';

// The badge count must NEVER render during SSR — the persisted state is only
// available after hydration. Consumers that render a count wrap it in a
// `useHasMounted` check to avoid hydration mismatches.
type CartStore = CartState & {
  dispatch: (action: CartAction) => void;
  add: (productId: string, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      ...EMPTY_CART,
      dispatch: (action) =>
        set((state) => {
          const next = cartReducer({ lines: state.lines }, action);
          return { ...state, lines: next.lines };
        }),
      add: (productId, quantity = 1) =>
        set((state) => ({
          ...state,
          lines: cartReducer({ lines: state.lines }, { type: 'ADD', productId, quantity }).lines,
        })),
      remove: (productId) =>
        set((state) => ({
          ...state,
          lines: cartReducer({ lines: state.lines }, { type: 'REMOVE', productId }).lines,
        })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          ...state,
          lines: cartReducer({ lines: state.lines }, { type: 'SET_QUANTITY', productId, quantity }).lines,
        })),
      clear: () => set((state) => ({ ...state, lines: [] })),
    }),
    {
      name: 'total-bri-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }) as Partial<CartStore>,
      version: 1,
    },
  ),
);
