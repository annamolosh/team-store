import { describe, expect, it } from 'vitest';
import { formatPrice, getCartView } from '../src/pages/cart/cart-view';
import type { CartState } from '../src/store/cart-store';
import type { Book } from '../src/types/book';
import { getDiscount, getSubtotal, getTotal } from '../src/utils/cart-total';

const books: Book[] = [
  {
    id: '1',
    title: 'Book One',
    author: 'Author One',
    genre: 'classic',
    cover: '/images/one.jpg',
    price: 10.5,
    stock: 5,
    rating: 4,
  },
  {
    id: '2',
    title: 'Book Two',
    author: 'Author Two',
    genre: 'mystery',
    cover: '/images/two.jpg',
    price: 12.99,
    stock: 5,
    rating: 5,
  },
];

describe('getCartView', () => {
  it('returns an empty view with zero totals for an empty cart', () => {
    const view = getCartView({ items: [], promoCode: null }, books);

    expect(view).toEqual({
      lines: [],
      isEmpty: true,
      subtotal: 0,
      discount: 0,
      total: 0,
      promoCode: null,
    });
  });

  it('builds lines with book data and a correct line total', () => {
    const view = getCartView({ items: [{ bookId: '1', quantity: 3 }], promoCode: null }, books);

    expect(view.isEmpty).toBe(false);
    expect(view.lines).toEqual([
      {
        bookId: '1',
        title: 'Book One',
        author: 'Author One',
        cover: `${import.meta.env.BASE_URL}images/one.jpg`,
        price: 10.5,
        quantity: 3,
        lineTotal: 31.5,
        canDecrease: true,
      },
    ]);
  });

  it('builds the cover path from BASE_URL without a double slash', () => {
    const view = getCartView({ items: [{ bookId: '1', quantity: 1 }], promoCode: null }, books);

    expect(view.lines[0].cover.startsWith(import.meta.env.BASE_URL)).toBe(true);
    expect(view.lines[0].cover).not.toContain('//');
  });

  it('canDecrease is false at quantity 1 and true at 2', () => {
    const view = getCartView(
      {
        items: [
          { bookId: '1', quantity: 1 },
          { bookId: '2', quantity: 2 },
        ],
        promoCode: null,
      },
      books,
    );

    expect(view.lines.map((line) => line.canDecrease)).toEqual([false, true]);
  });

  it('skips books that are not in the catalog', () => {
    const view = getCartView(
      {
        items: [
          { bookId: 'missing', quantity: 1 },
          { bookId: '2', quantity: 1 },
        ],
        promoCode: null,
      },
      books,
    );

    expect(view.lines.map((line) => line.bookId)).toEqual(['2']);
  });

  it('is empty when every item is missing from the catalog', () => {
    const view = getCartView(
      { items: [{ bookId: 'missing', quantity: 1 }], promoCode: null },
      books,
    );

    expect(view.isEmpty).toBe(true);
  });

  it('uses cart-total for subtotal, discount and total with SALE10', () => {
    const state: CartState = {
      items: [
        { bookId: '1', quantity: 2 },
        { bookId: '2', quantity: 1 },
      ],
      promoCode: 'SALE10',
    };
    const subtotal = getSubtotal(state.items, books);

    const view = getCartView(state, books);

    expect(view.subtotal).toBe(subtotal);
    expect(view.discount).toBe(getDiscount(subtotal, 'SALE10'));
    expect(view.total).toBe(getTotal(state.items, books, 'SALE10'));
    expect(view.discount).toBeGreaterThan(0);
    expect(view.promoCode).toBe('SALE10');
  });
});

describe('formatPrice', () => {
  it.each([
    [12.99, '$12.99'],
    [0, '$0.00'],
    [5, '$5.00'],
    [3.5, '$3.50'],
  ])('formats %s as %s', (value, expected) => {
    expect(formatPrice(value)).toBe(expected);
  });
});
