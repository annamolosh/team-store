import type { Book } from '../../types/book';
import type { CartState } from '../../store/cart-store';
import { getDiscount, getLineTotal, getSubtotal, getTotal } from '../../utils/cart-total';

export interface CartLineView {
  bookId: string;
  title: string;
  author: string;
  cover: string;
  price: number;
  quantity: number;
  lineTotal: number;
  canDecrease: boolean;
}

export interface CartView {
  lines: CartLineView[];
  isEmpty: boolean;
  subtotal: number;
  discount: number;
  total: number;
  promoCode: string | null;
}

function toAssetUrl(path: string): string {
  const relative = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${relative}`;
}

export function getCartView(state: CartState, books: Book[]): CartView {
  const lines = state.items.flatMap((item): CartLineView[] => {
    const book = books.find((b) => b.id === item.bookId);
    if (!book) return [];

    return [
      {
        bookId: book.id,
        title: book.title,
        author: book.author,
        cover: toAssetUrl(book.cover),
        price: book.price,
        quantity: item.quantity,
        lineTotal: getLineTotal(item, books),
        canDecrease: item.quantity > 1,
      },
    ];
  });

  const subtotal = getSubtotal(state.items, books);

  return {
    lines,
    isEmpty: lines.length === 0,
    subtotal,
    discount: getDiscount(subtotal, state.promoCode),
    total: getTotal(state.items, books, state.promoCode),
    promoCode: state.promoCode,
  };
}

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}
