import type { Cart } from '../types/cart';

export function addToCart(cart: Cart, bookId: string): Cart {
  void bookId;
  return [...cart];
}
