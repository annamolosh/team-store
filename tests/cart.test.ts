import { describe, expect, it } from 'vitest';
import type { Cart } from '../src/types/cart';
import { addToCart } from '../src/utils/cart';

describe('addToCart', () => {
  it('adds a book to an empty cart', () => {
    expect(addToCart([], '1')).toEqual([{ bookId: '1', quantity: 1 }]);
  });

  it('increases quantity when the book is already in the cart', () => {
    const cart: Cart = [{ bookId: '1', quantity: 1 }];

    expect(addToCart(cart, '1')).toEqual([{ bookId: '1', quantity: 2 }]);
  });

  it('adds a new row for a different book', () => {
    const cart: Cart = [{ bookId: '1', quantity: 1 }];

    expect(addToCart(cart, '2')).toEqual([
      { bookId: '1', quantity: 1 },
      { bookId: '2', quantity: 1 },
    ]);
  });

  it('does not mutate the original cart', () => {
    const cart: Cart = [{ bookId: '1', quantity: 1 }];
    const before = structuredClone(cart);

    const result = addToCart(cart, '1');

    expect(cart).toEqual(before);
    expect(result).not.toBe(cart);
  });
});
