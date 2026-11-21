import type { Cart } from '../types/cart';

export function addToCart(cart: Cart, bookId: string): Cart {
  const exists = cart.some((item) => item.bookId === bookId);

  if (!exists) {
    return [...cart, { bookId, quantity: 1 }];
  }

  return cart.map((item) =>
    item.bookId === bookId ? { ...item, quantity: item.quantity + 1 } : item,
  );
}

export function removeFromCart(cart: Cart, bookId: string): Cart {
  return cart.filter((item) => item.bookId !== bookId);
}

export function increaseQuantity(cart: Cart, bookId: string): Cart {
  void bookId;
  return [...cart];
}

export function decreaseQuantity(cart: Cart, bookId: string): Cart {
  void bookId;
  return [...cart];
}
