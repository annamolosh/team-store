import { books } from '../data/books';

export function getBookById(id: string) {
  return books.find((book) => book.id === id);
}
