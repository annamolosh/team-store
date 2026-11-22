import type { Book } from '../types/book';

export type SortOrder = 'default' | 'asc' | 'desc';

export interface PriceAndSortOptions {
  min?: number | null;
  max?: number | null;
  sort: SortOrder;
}

export function filterByPrice(books: Book[], min?: number | null, max?: number | null): Book[] {
  void min;
  void max;
  return [...books];
}
