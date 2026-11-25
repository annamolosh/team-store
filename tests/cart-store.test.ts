import { describe, expect, it, vi } from 'vitest';
import { createCartStore } from '../src/store/cart-store';

const STORAGE_KEY = 'team-store:cart';

function createFakeStorage(initial: Record<string, string> = {}): Storage {
  const data = new Map(Object.entries(initial));

  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
  } as Storage;
}

function createThrowingStorage(): Storage {
  const fail = (): never => {
    throw new Error('SecurityError');
  };

  return { getItem: fail, setItem: fail, removeItem: fail } as unknown as Storage;
}

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

describe('cart store: subscriptions', () => {
  it('does not call the listener on subscribe', () => {
    const store = createCartStore(null);
    const listener = vi.fn();

    store.subscribe(listener);

    expect(listener).not.toHaveBeenCalled();
  });

  it('calls the listener with the new state on change', () => {
    const store = createCartStore(null);
    const listener = vi.fn();
    store.subscribe(listener);

    store.add('1');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      items: [{ bookId: '1', quantity: 1 }],
      promoCode: null,
    });
  });

  it('does not call the listener when nothing changed', () => {
    const store = createCartStore(null);
    store.add('1');
    const listener = vi.fn();
    store.subscribe(listener);

    store.decrease('1');
    store.remove('missing');
    store.increase('missing');
    store.applyPromo('WRONG');

    expect(listener).not.toHaveBeenCalled();
  });

  it('does not call the listener after unsubscribe', () => {
    const store = createCartStore(null);
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    unsubscribe();
    store.add('1');

    expect(listener).not.toHaveBeenCalled();
  });
});

describe('cart store: localStorage', () => {
  it('saves the cart as JSON after a change', () => {
    const storage = createFakeStorage();
    const store = createCartStore(storage);

    store.add('1');

    expect(JSON.parse(storage.getItem(STORAGE_KEY) ?? 'null')).toEqual({
      items: [{ bookId: '1', quantity: 1 }],
      promoCode: null,
    });
  });

  it('restores the saved cart in a new store with the same storage', () => {
    const storage = createFakeStorage();
    const first = createCartStore(storage);
    first.add('1');
    first.add('1');
    first.applyPromo('SALE10');

    const second = createCartStore(storage);

    expect(second.getState()).toEqual({
      items: [{ bookId: '1', quantity: 2 }],
      promoCode: 'SALE10',
    });
  });

  it('starts empty when the stored JSON is broken', () => {
    const storage = createFakeStorage({ [STORAGE_KEY]: '{not json' });

    expect(() => createCartStore(storage)).not.toThrow();
    expect(createCartStore(storage).getState()).toEqual({ items: [], promoCode: null });
  });

  it.each([
    ['not an object', '42'],
    ['items not an array', '{"items":{},"promoCode":null}'],
    ['bad item', '{"items":[{"bookId":1,"quantity":1}],"promoCode":null}'],
    ['zero quantity', '{"items":[{"bookId":"1","quantity":0}],"promoCode":null}'],
    ['fractional quantity', '{"items":[{"bookId":"1","quantity":1.5}],"promoCode":null}'],
    ['bad promo code', '{"items":[],"promoCode":10}'],
  ])('starts empty when the stored structure is wrong (%s)', (_, raw) => {
    const store = createCartStore(createFakeStorage({ [STORAGE_KEY]: raw }));

    expect(store.getState()).toEqual({ items: [], promoCode: null });
  });

  it('works without throwing when storage throws', () => {
    const store = createCartStore(createThrowingStorage());

    expect(() => store.add('1')).not.toThrow();
    expect(store.getState().items).toEqual([{ bookId: '1', quantity: 1 }]);
  });

  it('works in memory when storage is null', () => {
    const store = createCartStore(null);

    expect(() => {
      store.add('1');
      store.applyPromo('SALE10');
      store.clear();
    }).not.toThrow();
    expect(store.getState()).toEqual({ items: [], promoCode: null });
  });
});
