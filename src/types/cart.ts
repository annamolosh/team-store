export interface CartItem {
  bookId: string;
  quantity: number;
}

export type Cart = CartItem[];
