import { describe, it, expect } from 'vitest';
import type { Cart } from '../src/types/cart';
import { setupBookCardEvents } from '../src/components/book-card-events';

describe('setupBookCardEvents', () => {
  it('should add a book to cart when its button is clicked', () => {
    let clickHandler: ((event: Event) => void) | undefined;

    const container = {
      addEventListener: (_event: string, handler: (event: Event) => void) => {
        clickHandler = handler;
      },
    } as unknown as HTMLElement;

    let updatedCart: Cart = [];

    const button = {
      dataset: { bookId: '1' },
      closest: () => button,
    };

    setupBookCardEvents(container, [], (cart) => {
      updatedCart = cart;
    });

    clickHandler?.({ target: button } as unknown as Event);

    expect(updatedCart).toEqual([{ bookId: '1', quantity: 1 }]);
  });
  it('should increase quantity when the same book button is clicked twice', () => {
    let clickHandler: ((event: Event) => void) | undefined;

    const container = {
      addEventListener: (_event: string, handler: (event: Event) => void) => {
        clickHandler = handler;
      },
    } as unknown as HTMLElement;
    let updatedCart: Cart = [];
    const button = {
      dataset: { bookId: '1' },
      closest: () => button,
    };

    setupBookCardEvents(container, [], (cart) => {
      updatedCart = cart;
    });

    clickHandler?.({ target: button } as unknown as Event);
    clickHandler?.({ target: button } as unknown as Event);

    expect(updatedCart).toEqual([{ bookId: '1', quantity: 2 }]);
  });
});
