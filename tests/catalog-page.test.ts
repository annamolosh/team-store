import { describe, it, expect } from 'vitest';
import type { Cart } from '../src/types/cart';
import { renderCatalogPage, mountCatalogPage } from '../src/pages/catalog/catalog-page';
import { books } from '../src/data/books';

describe('renderCatalogPage', () => {
  it('should display all books from mock data', () => {
    const html = renderCatalogPage();

    books.forEach((book) => {
      expect(html).toContain(book.title);
    });
  });
});

describe('mountCatalogPage', () => {
  it('should connect book card events and update cart', () => {
    let clickHandler: ((event: Event) => void) | undefined;
    let updatedCart: Cart = [];

    const container = {
      innerHTML: '',
      addEventListener: (_event: string, handler: (event: Event) => void) => {
        clickHandler = handler;
      },
    } as unknown as HTMLElement;

    const button = {
      dataset: { bookId: '1' },
      closest: () => button,
    };

    mountCatalogPage(container, [], (cart) => {
      updatedCart = cart;
    });

    clickHandler?.({ target: button } as unknown as Event);

    expect(container.innerHTML).toContain('The Great Gatsby');
    expect(updatedCart).toEqual([{ bookId: '1', quantity: 1 }]);
  });
});
