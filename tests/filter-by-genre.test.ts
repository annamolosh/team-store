import { describe, expect, it } from 'vitest';
import { filterByGenre } from '../src/utils/catalog-filters';

describe('filterByGenre', () => {
  it('returns books of the selected genre', () => {
    const books = [
      { id: '1', title: 'Harry Potter', genre: 'fantasy' },
      { id: '2', title: 'Pride and Prejudice', genre: 'classic' },
      { id: '3', title: 'The Hobbit', genre: 'fantasy' },
    ];

    const result = filterByGenre(books, 'fantasy');

    expect(result).toHaveLength(2);
    expect(result.map((book) => book.title)).toEqual(['Harry Potter', 'The Hobbit']);
  });
});
