import type { Cart } from '../types/cart';

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

const notImplemented = (): never => {
  throw new Error('Not implemented');
};

export function createCartStore(): CartStore {
  return {
    getState: notImplemented,
    add: notImplemented,
    remove: notImplemented,
    increase: notImplemented,
    decrease: notImplemented,
    clear: notImplemented,
    applyPromo: notImplemented,
    subscribe: notImplemented,
  };
}

export const cartStore = createCartStore();
