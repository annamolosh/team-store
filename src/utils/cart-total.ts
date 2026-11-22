import type { Book } from '../types/book';
import type { Cart, CartItem } from '../types/cart';

const toCents = (value: number): number => Math.round(value * 100);
const fromCents = (cents: number): number => cents / 100;

function getLineCents(item: CartItem, books: Book[]): number {
  const book = books.find((b) => b.id === item.bookId);
  return book ? toCents(book.price) * item.quantity : 0;
}

export function getLineTotal(item: CartItem, books: Book[]): number {
  return fromCents(getLineCents(item, books));
}

export function getSubtotal(cart: Cart, books: Book[]): number {
  const cents = cart.reduce((sum, item) => sum + getLineCents(item, books), 0);
  return fromCents(cents);
}
