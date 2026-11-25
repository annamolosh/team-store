import { describe, expect, it } from 'vitest';
import type { Book } from '../src/types/book';
import type { Cart } from '../src/types/cart';
import { applyPromoCode, getSubtotal, getTotal } from '../src/utils/cart-total';

const makeBook = (id: string, price: number): Book => ({
  id,
  title: `Book ${id}`,
  author: 'Author',
  genre: 'Genre',
  cover: '',
  price,
  stock: 10,
  rating: 5,
});

const books: Book[] = [makeBook('1', 10), makeBook('2', 25), makeBook('3', 100)];

describe('getSubtotal', () => {
  it('returns 0 for an empty cart', () => {
    expect(getSubtotal([], books)).toBe(0);
  });

  it('sums line totals for two items', () => {
    const cart: Cart = [
      { bookId: '1', quantity: 2 },
      { bookId: '2', quantity: 1 },
    ];

    expect(getSubtotal(cart, books)).toBe(45);
  });
});

describe('applyPromoCode', () => {
  it('applies SALE10 when no code is applied yet', () => {
    expect(applyPromoCode(null, 'SALE10')).toEqual({ code: 'SALE10', error: null });
  });
});

describe('getTotal', () => {
  it('applies a 10% discount with SALE10', () => {
    const cart: Cart = [{ bookId: '3', quantity: 1 }];

    expect(getTotal(cart, books, 'SALE10')).toBe(90);
  });
});
