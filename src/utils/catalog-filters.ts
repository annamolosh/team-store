import type { Book, Genre } from '../types/book';

export type SortOrder = 'default' | 'asc' | 'desc';

export interface PriceAndSortOptions {
  min?: number | null;
  max?: number | null;
  sort: SortOrder;
}

export function filterByGenre<T extends { genre: string }>(books: T[], genre: Genre | 'all'): T[] {
  if (genre === 'all') {
    return [...books];
  }

  return books.filter((book) => book.genre === genre);
}

const isBound = (value: number | null | undefined): value is number =>
  typeof value === 'number' && !Number.isNaN(value);

export function filterByPrice(books: Book[], min?: number | null, max?: number | null): Book[] {
  const hasMin = isBound(min);
  const hasMax = isBound(max);

  if (hasMin && hasMax && min > max) {
    return [];
  }

  return books.filter((book) => (!hasMin || book.price >= min) && (!hasMax || book.price <= max));
}

export function sortBooks(books: Book[], order: SortOrder): Book[] {
  if (order === 'default') {
    return [...books];
  }

  const direction = order === 'asc' ? 1 : -1;

  // Array.prototype.sort is stable (ES2019+), so equal prices keep their order.
  return [...books].sort((a, b) => (a.price - b.price) * direction);
}

export function applyPriceAndSort(books: Book[], options: PriceAndSortOptions): Book[] {
  const filtered = filterByPrice(books, options.min, options.max);
  return sortBooks(filtered, options.sort);
}
