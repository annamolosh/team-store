import type { Cart } from '../types/cart';
import {
  addToCart,
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from '../utils/cart';
import { applyPromoCode } from '../utils/cart-total';

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

const EMPTY_STATE: CartState = { items: [], promoCode: null };

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

export function createCartStore(): CartStore {
  let state = freezeState(EMPTY_STATE);
  const listeners = new Set<Listener>();

  function setState(next: CartState): void {
    if (isSameState(state, next)) return;
    state = freezeState(next);
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

export const cartStore = createCartStore();
