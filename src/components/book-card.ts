import type { Book } from '../types/book';

export function renderBookCard(book: Book): string {
  return `
    <article class="book-card">
      <img src="${book.cover}" alt="${book.title}" />
      <h3>${book.title}</h3>
      <p>${book.author}</p>
      <p>${book.genre}</p>
      <p>${book.price.toFixed(2)}</p>
      <button type="button" data-book-id="${book.id}">
        В корзину
      </button>
    </article>
  `;
}

export function renderBookList(books: Book[]): string {
  return books.map(renderBookCard).join('');
}
