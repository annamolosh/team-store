import type { Book } from '../types/book.ts';

export function searchBooks(books: Book[], query: string) {
  return books.filter((book) => book.title.toLowerCase().includes(query.toLowerCase()));
}
