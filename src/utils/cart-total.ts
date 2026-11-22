import type { Book } from '../types/book';
import type { Cart, CartItem } from '../types/cart';

export const PROMO_CODES: Record<string, number> = { SALE10: 0.1 };

export interface PromoResult {
  code: string | null;
  error: string | null;
}

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

export function applyPromoCode(current: string | null, input: string): PromoResult {
  if (current) {
    return { code: current, error: 'Промокод уже применён' };
  }

  const code = input.trim().toUpperCase();

  if (!code) {
    return { code: null, error: 'Введите промокод' };
  }

  if (!Object.hasOwn(PROMO_CODES, code)) {
    return { code: null, error: 'Неизвестный промокод' };
  }

  return { code, error: null };
}
