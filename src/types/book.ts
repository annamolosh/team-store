export type Genre = 'classic' | 'mystery' | 'romance' | 'fantasy' | 'science-fiction';

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: Genre;
  cover: string;
  price: number;
  stock: number;
  rating: number;
}
