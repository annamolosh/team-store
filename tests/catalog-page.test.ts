import { describe, it, expect } from 'vitest';
import { renderCatalogPage } from '../src/pages/catalog/catalog-page';
import { books } from '../src/data/books';

describe('renderCatalogPage', () => {
  it('should display all books from mock data', () => {
    const html = renderCatalogPage();

    books.forEach((book) => {
      expect(html).toContain(book.title);
    });
  });
});
