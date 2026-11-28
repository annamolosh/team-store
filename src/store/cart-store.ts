import type { Cart } from '../types/cart';
import {
  addToCart,
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from '../utils/cart';
import { applyPromoCode } from '../utils/cart-total';
import { createSafeStorage, type SafeStorage } from './safe-storage';

export interface CartState {
  items: Cart;
  promoCode: string | null;
}

type Listener = (state: CartState) => void;

export interface CartStore {
  getState(): CartState;
  add(bookId: string): void;
  remove(bookId: string): void;
  increase(bookId: string): void;
  decrease(bookId: string): void;
  clear(): void;
  applyPromo(input: string): string | null;
  subscribe(listener: Listener): () => void;
}

const STORAGE_KEY = 'team-store:cart';

const EMPTY_STATE: CartState = { items: [], promoCode: null };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isCartState(value: unknown): value is CartState {
  if (!isRecord(value) || !Array.isArray(value.items)) return false;

  const promoOk = value.promoCode === null || typeof value.promoCode === 'string';
  const itemsOk = value.items.every(
    (item: unknown) =>
      isRecord(item) &&
      typeof item.bookId === 'string' &&
      item.bookId !== '' &&
      Number.isInteger(item.quantity) &&
      (item.quantity as number) >= 1,
  );

  return promoOk && itemsOk;
}

function parseState(raw: string | null): CartState {
  if (raw === null) return EMPTY_STATE;

  try {
    const parsed: unknown = JSON.parse(raw);
    return isCartState(parsed) ? parsed : EMPTY_STATE;
  } catch {
    // broken JSON: start with an empty cart
    return EMPTY_STATE;
  }
}

function freezeState(state: CartState): CartState {
  return Object.freeze({
    items: Object.freeze(state.items.map((item) => Object.freeze({ ...item }))) as Cart,
    promoCode: state.promoCode,
  });
}

function isSameState(a: CartState, b: CartState): boolean {
  return (
    a.promoCode === b.promoCode &&
    a.items.length === b.items.length &&
    a.items.every(
      (item, i) => item.bookId === b.items[i].bookId && item.quantity === b.items[i].quantity,
    )
  );
}

export function createCartStore(storage: SafeStorage): CartStore {
  let state = freezeState(parseState(storage.getItem(STORAGE_KEY)));
  const listeners = new Set<Listener>();

  function setState(next: CartState): void {
    if (isSameState(state, next)) return;
    state = freezeState(next);
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    listeners.forEach((listener) => listener(state));
  }

  const updateItems = (update: (items: Cart) => Cart): void =>
    setState({ ...state, items: update(state.items) });

  return {
    getState: () => state,
    add: (bookId) => updateItems((items) => addToCart(items, bookId)),
    remove: (bookId) => updateItems((items) => removeFromCart(items, bookId)),
    increase: (bookId) => updateItems((items) => increaseQuantity(items, bookId)),
    decrease: (bookId) => updateItems((items) => decreaseQuantity(items, bookId)),
    clear: () => setState({ items: clearCart(), promoCode: null }),
    applyPromo(input) {
      const { code, error } = applyPromoCode(state.promoCode, input);
      if (error) return error;
      setState({ ...state, promoCode: code });
      return null;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export const cartStore = createCartStore(createSafeStorage(() => localStorage));
