export function searchBooks<T extends { title: string }>(books: T[], query: string): T[] {
  return books.filter((book) => book.title.toLowerCase().includes(query.toLowerCase()));
}
