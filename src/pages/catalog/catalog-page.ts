import { renderBookList } from '../../components/book-card';
import { setupBookCardEvents } from '../../components/book-card-events';
import { books } from '../../data/books';
import type { Cart } from '../../types/cart';

export function renderCatalogPage(): string {
  return `
    <section class="catalog">
      <h1>Book Catalog</h1>
      <div class="book-list">
        ${renderBookList(books)}
      </div>
    </section>
  `;
}

export function mountCatalogPage(
  container: HTMLElement,
  cart: Cart,
  onCartChange: (cart: Cart) => void,
): void {
  container.innerHTML = renderCatalogPage();
  setupBookCardEvents(container, cart, onCartChange);
}
