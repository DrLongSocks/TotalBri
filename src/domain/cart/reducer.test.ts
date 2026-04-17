import { describe, expect, it } from 'vitest';
import { cartReducer } from './reducer';
import { EMPTY_CART, MAX_QTY } from './types';

describe('cartReducer', () => {
  it('adds a new product line', () => {
    const next = cartReducer(EMPTY_CART, { type: 'ADD', productId: 'P001', quantity: 2 });
    expect(next.lines).toHaveLength(1);
    expect(next.lines[0]?.productId).toBe('P001');
    expect(next.lines[0]?.quantity).toBe(2);
  });

  it('merges quantity when adding the same product twice', () => {
    let s = cartReducer(EMPTY_CART, { type: 'ADD', productId: 'P001', quantity: 2 });
    s = cartReducer(s, { type: 'ADD', productId: 'P001', quantity: 3 });
    expect(s.lines).toHaveLength(1);
    expect(s.lines[0]?.quantity).toBe(5);
  });

  it('caps quantity at MAX_QTY when merging', () => {
    let s = cartReducer(EMPTY_CART, { type: 'ADD', productId: 'P001', quantity: 80 });
    s = cartReducer(s, { type: 'ADD', productId: 'P001', quantity: 80 });
    expect(s.lines[0]?.quantity).toBe(MAX_QTY);
  });

  it('ignores ADD with 0 quantity', () => {
    const next = cartReducer(EMPTY_CART, { type: 'ADD', productId: 'P001', quantity: 0 });
    expect(next.lines).toHaveLength(0);
  });

  it('ignores ADD with negative quantity', () => {
    const next = cartReducer(EMPTY_CART, { type: 'ADD', productId: 'P001', quantity: -5 });
    expect(next.lines).toHaveLength(0);
  });

  it('removes a line', () => {
    const start = cartReducer(EMPTY_CART, { type: 'ADD', productId: 'P001', quantity: 2 });
    const next = cartReducer(start, { type: 'REMOVE', productId: 'P001' });
    expect(next.lines).toHaveLength(0);
  });

  it('SET_QUANTITY to 0 removes the line', () => {
    const start = cartReducer(EMPTY_CART, { type: 'ADD', productId: 'P001', quantity: 5 });
    const next = cartReducer(start, { type: 'SET_QUANTITY', productId: 'P001', quantity: 0 });
    expect(next.lines).toHaveLength(0);
  });

  it('SET_QUANTITY adds line if not present', () => {
    const next = cartReducer(EMPTY_CART, { type: 'SET_QUANTITY', productId: 'P001', quantity: 3 });
    expect(next.lines).toHaveLength(1);
    expect(next.lines[0]?.quantity).toBe(3);
  });

  it('SET_QUANTITY caps at MAX_QTY', () => {
    const next = cartReducer(EMPTY_CART, { type: 'SET_QUANTITY', productId: 'P001', quantity: 9999 });
    expect(next.lines[0]?.quantity).toBe(MAX_QTY);
  });

  it('CLEAR empties the cart', () => {
    let s = cartReducer(EMPTY_CART, { type: 'ADD', productId: 'P001', quantity: 2 });
    s = cartReducer(s, { type: 'ADD', productId: 'P002', quantity: 1 });
    s = cartReducer(s, { type: 'CLEAR' });
    expect(s.lines).toHaveLength(0);
  });

  it('does not mutate input state', () => {
    const start = { lines: [{ productId: 'P001', quantity: 1, addedAt: 1 }] };
    const next = cartReducer(start, { type: 'ADD', productId: 'P001', quantity: 1 });
    expect(start.lines[0]?.quantity).toBe(1);
    expect(next.lines[0]?.quantity).toBe(2);
  });
});
