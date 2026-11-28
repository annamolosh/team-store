import type { Cart } from '../types/cart';
import { addToCart } from '../utils/cart';

export function setupBookCardEvents(
  container: HTMLElement,
  cart: Cart,
  onCartChange: (cart: Cart) => void,
): () => void {
  let currentCart = cart;

  const handleClick = (event: Event) => {
    const target = event.target as HTMLElement;
    const button = target.closest<HTMLButtonElement>('[data-book-id]');

    if (!button) return;

    const bookId = button.dataset.bookId;

    if (!bookId) return;

    currentCart = addToCart(currentCart, bookId);

    onCartChange(currentCart);
  };

  container.addEventListener('click', handleClick);

  return () => {
    container.removeEventListener('click', handleClick);
  };
}
