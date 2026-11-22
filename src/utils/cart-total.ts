import type { Book } from '../types/book';
import type { Cart, CartItem } from '../types/cart';

export function getLineTotal(item: CartItem, books: Book[]): number {
  void item;
  void books;
  return 0;
}

export function getSubtotal(cart: Cart, books: Book[]): number {
  void cart;
  void books;
  return 0;
}
