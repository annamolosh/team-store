import './book-card.css';

import type { Book } from '../types/book';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getSafeImageUrl(url: string): string {
  const trimmedUrl = url.trim();

  if (trimmedUrl.startsWith('/') && !trimmedUrl.startsWith('//')) {
    return escapeHtml(trimmedUrl);
  }

  try {
    const parsedUrl = new URL(trimmedUrl);

    if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
      return escapeHtml(trimmedUrl);
    }
  } catch {
    // Invalid URL
  }

  return '';
}

export function renderBookCard(book: Book): string {
  return `
    <article class="book-card">
      <img src="${getSafeImageUrl(book.cover)}" alt="${escapeHtml(book.title)}" />
      <h3>${escapeHtml(book.title)}</h3>
      <p>${escapeHtml(book.author)}</p>
      <p>${escapeHtml(book.genre)}</p>
      <p>${book.price.toFixed(2)}</p>
      <button type="button" data-book-id="${escapeHtml(book.id)}">
        Add to cart
      </button>
    </article>
  `;
}

export function renderBookList(books: Book[]): string {
  return books.map(renderBookCard).join('');
}
