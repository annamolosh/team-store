import { describe, expect, it } from 'vitest';

import { books } from '../../src/data/books';
import { getRandomBooks } from '../../src/utils/random-books';

describe('getRandomBooks', () => {
  it('returns three books', () => {
    const result = getRandomBooks(books);
    expect(result).toHaveLength(3);
  });

  it('does not return dublicate books', () => {
    const result = getRandomBooks(books);
    const uniqueBooks = new Set(result.map((book) => book.id));
    expect(uniqueBooks.size).toBe(result.length);
  });

  it('returns only books from the original array', () => {
    const result = getRandomBooks(books);
    result.forEach((book) => {
      expect(books).toContain(book);
    });
  });

  it('returns all available books when there are fewer then three', () => {
    const result = getRandomBooks(books.slice(0, 2));
    expect(result).toHaveLength(2);
  });
});
