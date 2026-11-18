import type { Book } from '../types/book';

export const books: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'novel',
    cover: '/images/great-gatsby.jpg',
    price: 15.99,
    stock: 10,
    rating: 4.5,
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    genre: 'fiction',
    cover: '/images/1984.jpg',
    price: 12.99,
    stock: 5,
    rating: 4.8,
  },
];