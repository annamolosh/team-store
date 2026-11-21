import { describe, expect, it } from 'vitest';
import type { Cart } from '../src/types/cart';
import {
  addToCart,
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from '../src/utils/cart';

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

describe('removeFromCart', () => {
  it('removes the matching row and keeps the others', () => {
    const cart: Cart = [
      { bookId: '1', quantity: 1 },
      { bookId: '2', quantity: 3 },
    ];

    expect(removeFromCart(cart, '1')).toEqual([{ bookId: '2', quantity: 3 }]);
  });

  it('returns the cart unchanged for a non-existent id', () => {
    const cart: Cart = [{ bookId: '1', quantity: 1 }];

    expect(removeFromCart(cart, '999')).toEqual(cart);
  });

  it('does not mutate the original cart', () => {
    const cart: Cart = [{ bookId: '1', quantity: 1 }];
    const before = structuredClone(cart);

    removeFromCart(cart, '1');

    expect(cart).toEqual(before);
  });
});

describe('increaseQuantity', () => {
  it('increases quantity by 1', () => {
    const cart: Cart = [{ bookId: '1', quantity: 2 }];

    expect(increaseQuantity(cart, '1')).toEqual([{ bookId: '1', quantity: 3 }]);
  });

  it('returns the cart unchanged for a non-existent id', () => {
    const cart: Cart = [{ bookId: '1', quantity: 2 }];

    expect(increaseQuantity(cart, '999')).toEqual(cart);
  });

  it('does not mutate the original cart', () => {
    const cart: Cart = [{ bookId: '1', quantity: 2 }];
    const before = structuredClone(cart);

    increaseQuantity(cart, '1');

    expect(cart).toEqual(before);
  });
});

describe('decreaseQuantity', () => {
  it('decreases quantity by 1', () => {
    const cart: Cart = [{ bookId: '1', quantity: 3 }];

    expect(decreaseQuantity(cart, '1')).toEqual([{ bookId: '1', quantity: 2 }]);
  });

  it('does not go below 1', () => {
    const cart: Cart = [{ bookId: '1', quantity: 1 }];

    expect(decreaseQuantity(cart, '1')).toEqual([{ bookId: '1', quantity: 1 }]);
  });

  it('returns the cart unchanged for a non-existent id', () => {
    const cart: Cart = [{ bookId: '1', quantity: 3 }];

    expect(decreaseQuantity(cart, '999')).toEqual(cart);
  });

  it('does not mutate the original cart', () => {
    const cart: Cart = [{ bookId: '1', quantity: 3 }];
    const before = structuredClone(cart);

    decreaseQuantity(cart, '1');

    expect(cart).toEqual(before);
  });
});

describe('clearCart', () => {
  it('returns an empty cart', () => {
    expect(clearCart()).toEqual([]);
  });
});
