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

  it('it finds books regardless of case', () => {
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
    const query = 'harry';
    const result = searchBooks(books, query);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Harry Potter');
  });

  it('returns all books when query is empty', () => {
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

    const query = '';
    const result = searchBooks(books, query);

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Harry Potter');
  });

  it('returns an empty array when no books match', () => {
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

    const query = 'Twilight';
    const result = searchBooks(books, query);

    expect(result).toHaveLength(0);
  });
});
