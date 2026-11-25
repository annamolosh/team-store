import { describe, expect, it } from 'vitest';
import { createCartStore } from '../src/store/cart-store';

describe('cart store: actions', () => {
  it('starts with an empty cart and no promo code', () => {
    expect(createCartStore(null).getState()).toEqual({ items: [], promoCode: null });
  });

  it('adds a book, and a repeated add increases quantity', () => {
    const store = createCartStore(null);

    store.add('1');
    expect(store.getState().items).toEqual([{ bookId: '1', quantity: 1 }]);

    store.add('1');
    expect(store.getState().items).toEqual([{ bookId: '1', quantity: 2 }]);
  });

  it('removes a book', () => {
    const store = createCartStore(null);
    store.add('1');
    store.add('2');

    store.remove('1');

    expect(store.getState().items).toEqual([{ bookId: '2', quantity: 1 }]);
  });

  it('increases and decreases quantity', () => {
    const store = createCartStore(null);
    store.add('1');

    store.increase('1');
    store.increase('1');
    expect(store.getState().items).toEqual([{ bookId: '1', quantity: 3 }]);

    store.decrease('1');
    expect(store.getState().items).toEqual([{ bookId: '1', quantity: 2 }]);
  });

  it('keeps quantity at 1 when decreasing from 1', () => {
    const store = createCartStore(null);
    store.add('1');

    store.decrease('1');

    expect(store.getState().items).toEqual([{ bookId: '1', quantity: 1 }]);
  });

  it('clear empties the cart and resets the promo code', () => {
    const store = createCartStore(null);
    store.add('1');
    store.applyPromo('SALE10');

    store.clear();

    expect(store.getState()).toEqual({ items: [], promoCode: null });
  });

  it('applies a valid promo code and returns null', () => {
    const store = createCartStore(null);

    expect(store.applyPromo('SALE10')).toBeNull();
    expect(store.getState().promoCode).toBe('SALE10');
  });

  it('returns an error for an invalid promo code and keeps the state', () => {
    const store = createCartStore(null);
    store.add('1');
    const before = store.getState();

    const error = store.applyPromo('WRONG');

    expect(typeof error).toBe('string');
    expect(store.getState()).toEqual(before);
  });

  it('mutating the result of getState does not change the store', () => {
    const store = createCartStore(null);
    store.add('1');
    const state = store.getState();

    try {
      state.items.push({ bookId: '2', quantity: 1 });
      state.items[0].quantity = 99;
      state.promoCode = 'HACK';
    } catch {
      // frozen objects throw in strict mode — that is also fine
    }

    expect(store.getState()).toEqual({ items: [{ bookId: '1', quantity: 1 }], promoCode: null });
  });
});
