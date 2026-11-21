export type Genre = 'novel' | 'fiction' | 'romance' | 'fantasy';

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
