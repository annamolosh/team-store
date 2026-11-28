import { describe, it, expect, vi } from 'vitest';
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
  it('should remove click event listener when cleanup is called', () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();

    const container = {
      addEventListener,
      removeEventListener,
    } as unknown as HTMLElement;

    const cleanup = setupBookCardEvents(container, [], () => {});

    cleanup();

    expect(addEventListener).toHaveBeenCalledWith('click', expect.any(Function));

    const registeredHandler = addEventListener.mock.calls[0][1];

    expect(removeEventListener).toHaveBeenCalledWith('click', registeredHandler);
  });
});
