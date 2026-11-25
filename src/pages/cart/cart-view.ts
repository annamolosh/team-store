import type { Book } from '../../types/book';
import type { CartState } from '../../store/cart-store';

export interface CartLineView {
  bookId: string;
  title: string;
  author: string;
  cover: string;
  price: number;
  quantity: number;
  lineTotal: number;
  canDecrease: boolean;
}

export interface CartView {
  lines: CartLineView[];
  isEmpty: boolean;
  subtotal: number;
  discount: number;
  total: number;
  promoCode: string | null;
}

const notImplemented = (): never => {
  throw new Error('Not implemented');
};

export const getCartView: (state: CartState, books: Book[]) => CartView = notImplemented;

export const formatPrice: (value: number) => string = notImplemented;
