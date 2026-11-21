import type { Book } from '../types/book';

export function getRandomBooks(books: Book[]): Book[] {
  const shuffledBooks = [...books];

  for (let i = shuffledBooks.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [shuffledBooks[i], shuffledBooks[randomIndex]] = [shuffledBooks[randomIndex], shuffledBooks[i]];
  }

  return shuffledBooks.slice(0, 3);
}
