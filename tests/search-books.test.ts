import { searchBooks } from '../src/utils/search-books';
import { describe, expect, it } from 'vitest';

describe('searchBooks', () => {
  it('returns a book when the title matches', () => {
    const books = [
      {
        id: '1',
        title: 'Harry Potter',
      },
      {
        id: '2',
        title: 'Pride and Prejudice',
      },
    ];
    const query = 'Harry';
    const result = searchBooks(books, query);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Harry Potter');
  });
});
