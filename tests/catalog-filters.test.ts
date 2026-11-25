import { describe, expect, it } from 'vitest';
import type { Book } from '../src/types/book';
import { applyPriceAndSort, filterByPrice, sortBooks } from '../src/utils/catalog-filters';

const makeBook = (id: string, price: number): Book => ({
  id,
  title: `Book ${id}`,
  author: 'Author',
  genre: 'Genre',
  cover: '',
  price,
  stock: 10,
  rating: 5,
});

// Unsorted on purpose; 'c' and 'e' share the same price.
const books: Book[] = [
  makeBook('a', 40),
  makeBook('b', 10),
  makeBook('c', 25.5),
  makeBook('d', 99.99),
  makeBook('e', 25.5),
];

const ids = (list: Book[]): string[] => list.map((book) => book.id);

describe('filterByPrice', () => {
  it('returns all books when no bounds are set', () => {
    expect(ids(filterByPrice(books))).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('keeps books from min inclusive', () => {
    expect(ids(filterByPrice(books, 40))).toEqual(['a', 'd']);
  });

  it('keeps books up to max inclusive', () => {
    expect(ids(filterByPrice(books, undefined, 25.5))).toEqual(['b', 'c', 'e']);
  });

  it('keeps books within the range with both bounds inclusive', () => {
    expect(ids(filterByPrice(books, 25.5, 40))).toEqual(['a', 'c', 'e']);
  });

  it('returns an empty array when min is greater than max', () => {
    expect(filterByPrice(books, 50, 20)).toEqual([]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterByPrice(books, 41, 99)).toEqual([]);
  });

  it('ignores null and NaN bounds', () => {
    expect(ids(filterByPrice(books, null, 25.5))).toEqual(['b', 'c', 'e']);
    expect(ids(filterByPrice(books, 40, NaN))).toEqual(['a', 'd']);
    expect(ids(filterByPrice(books, NaN, null))).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('returns an empty array for an empty input', () => {
    expect(filterByPrice([], 10, 50)).toEqual([]);
  });

  it('does not mutate the original array', () => {
    const before = [...books];

    const result = filterByPrice(books, 20, 50);

    expect(books).toEqual(before);
    expect(result).not.toBe(books);
  });
});

describe('sortBooks', () => {
  it('sorts by price ascending', () => {
    expect(ids(sortBooks(books, 'asc'))).toEqual(['b', 'c', 'e', 'a', 'd']);
  });

  it('sorts by price descending', () => {
    expect(ids(sortBooks(books, 'desc'))).toEqual(['d', 'a', 'c', 'e', 'b']);
  });

  it('keeps the original order for default', () => {
    const result = sortBooks(books, 'default');

    expect(ids(result)).toEqual(['a', 'b', 'c', 'd', 'e']);
    expect(result).not.toBe(books);
  });

  it('keeps the original order of books with the same price', () => {
    const asc = ids(sortBooks(books, 'asc'));
    const desc = ids(sortBooks(books, 'desc'));

    expect(asc.indexOf('c')).toBeLessThan(asc.indexOf('e'));
    expect(desc.indexOf('c')).toBeLessThan(desc.indexOf('e'));
  });

  it('does not mutate the original array', () => {
    sortBooks(books, 'asc');
    sortBooks(books, 'desc');

    expect(ids(books)).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('returns an empty array for an empty input', () => {
    expect(sortBooks([], 'asc')).toEqual([]);
  });
});

describe('applyPriceAndSort', () => {
  it('filters by range and then sorts descending', () => {
    expect(ids(applyPriceAndSort(books, { min: 20, max: 50, sort: 'desc' }))).toEqual([
      'a',
      'c',
      'e',
    ]);
  });

  it('returns a copy in the original order with no bounds and default sort', () => {
    const result = applyPriceAndSort(books, { sort: 'default' });

    expect(result).toEqual(books);
    expect(result).not.toBe(books);
  });
});
