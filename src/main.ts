import './style.css';

import { books } from './data/books';
import { getRandomBooks } from './utils/random-books';

const booksContainer = document.querySelector('#books-container');
if (booksContainer) {
  const featuredBooks = getRandomBooks(books);

  console.log('Featured books:', featuredBooks);
}
