import type { Book } from '../types/book';

export type SortOrder = 'default' | 'asc' | 'desc';

export interface PriceAndSortOptions {
  min?: number | null;
  max?: number | null;
  sort: SortOrder;
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
