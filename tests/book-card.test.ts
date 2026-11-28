import { describe, it, expect } from 'vitest';
import { renderBookCard, renderBookList } from '../src/components/book-card';
import { books } from '../src/data/books';

describe('renderBookCard', () => {
  it('should display book information', () => {
    const html = renderBookCard(books[0]);

    expect(html).toContain('The Great Gatsby');
    expect(html).toContain('F. Scott Fitzgerald');
    expect(html).toContain('classic');
    expect(html).toContain('15.99');
    expect(html).toContain(books[0].cover);
  });
});

describe('renderBookList', () => {
  it('should display all books', () => {
    const html = renderBookList(books);

    expect(html).toContain('The Great Gatsby');
    expect(html).toContain('1984');
    expect(html).toContain('The Hobbit');
    expect(html.match(/class="book-card"/g)).toHaveLength(books.length);
  });
});
