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

  it('should escape HTML in book information', () => {
    const maliciousBook = {
      ...books[0],
      title: '<img src=x onerror=alert(1)>',
      author: '<script>alert(1)</script>',
    };

    const html = renderBookCard(maliciousBook);

    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(html).not.toContain('<img src=x onerror=alert(1)>');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it('should reject unsafe image URLs', () => {
    const javascriptBook = {
      ...books[0],
      cover: 'javascript:alert(1)',
    };

    const dataBook = {
      ...books[0],
      cover: 'data:text/html,<script>alert(1)</script>',
    };

    expect(renderBookCard(javascriptBook)).toContain('<img src=""');
    expect(renderBookCard(dataBook)).toContain('<img src=""');
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
