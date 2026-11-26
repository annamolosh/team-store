import type { Cart } from '../types/cart';
import { addToCart } from '../utils/cart';

export function setupBookCardEvents(
  container: HTMLElement,
  cart: Cart,
  onCartChange: (cart: Cart) => void,
): void {
  container.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const button = target.closest<HTMLButtonElement>('[data-book-id]');

    if (!button) return;

    const bookId = button.dataset.bookId;

    if (!bookId) return;

    const updatedCart = addToCart(cart, bookId);

    onCartChange(updatedCart);
  });
}
