import './cart-page.css';
import { books } from '../../data/books';
import { cartStore } from '../../store/cart-store';
import { formatPrice, getCartView, type CartLineView, type CartView } from './cart-view';

type PromoMessage = { kind: 'error' | 'success'; text: string } | null;

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function actionButton(
  className: string,
  text: string,
  action: string,
  bookId?: string,
): HTMLButtonElement {
  const button = el('button', className, text);
  button.type = 'button';
  button.dataset.action = action;
  if (bookId) button.dataset.bookId = bookId;
  return button;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

// Trash can icon (stroke uses currentColor), built without innerHTML.
function trashIcon(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'cart-icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  const paths = [
    'M3 6h18',
    'M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2',
    'M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6',
    'M10 11v6',
    'M14 11v6',
  ];
  for (const d of paths) {
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', d);
    svg.append(path);
  }
  return svg;
}

function renderLine(line: CartLineView): HTMLLIElement {
  const item = el('li', 'cart-item');

  const cover = el('img', 'cart-item-cover');
  cover.src = line.cover;
  cover.alt = line.title;
  cover.loading = 'lazy';

  const info = el('div', 'cart-item-info');
  info.append(
    el('h2', 'cart-item-title', line.title),
    el('p', 'cart-item-author', line.author),
    el('p', 'cart-item-price', formatPrice(line.price)),
  );

  const decrease = actionButton('cart-button cart-button-icon', '−', 'decrease', line.bookId);
  decrease.setAttribute('aria-label', `Decrease quantity: ${line.title}`);
  decrease.disabled = !line.canDecrease;

  const increase = actionButton('cart-button cart-button-icon', '+', 'increase', line.bookId);
  increase.setAttribute('aria-label', `Increase quantity: ${line.title}`);

  const quantity = el('div', 'cart-quantity');
  quantity.append(decrease, el('span', 'cart-quantity-value', String(line.quantity)), increase);

  const remove = actionButton(
    'cart-button cart-button-icon cart-button-danger',
    '',
    'remove',
    line.bookId,
  );
  remove.setAttribute('aria-label', `Remove: ${line.title}`);
  remove.append(trashIcon());

  item.append(
    cover,
    info,
    quantity,
    el('p', 'cart-item-total', formatPrice(line.lineTotal)),
    remove,
  );
  return item;
}

function summaryRow(label: string, value: string, className = 'cart-summary-row'): HTMLDivElement {
  const row = el('div', className);
  row.append(el('dt', undefined, label), el('dd', undefined, value));
  return row;
}

function renderSummary(view: CartView): HTMLElement {
  const summary = el('aside', 'cart-summary');
  summary.append(el('h2', 'cart-summary-title', 'Order summary'));

  const list = el('dl', 'cart-summary-list');
  list.append(summaryRow('Subtotal', formatPrice(view.subtotal)));
  if (view.discount > 0) {
    list.append(summaryRow(`Discount (${view.promoCode})`, `−${formatPrice(view.discount)}`));
  }
  list.append(summaryRow('Total', formatPrice(view.total), 'cart-summary-row cart-summary-total'));
  summary.append(list);

  return summary;
}

function renderPromoForm(view: CartView, message: PromoMessage, value: string): HTMLFormElement {
  const form = el('form', 'cart-promo');
  form.noValidate = true;

  const label = el('label', 'cart-promo-label', 'Promo code');
  label.htmlFor = 'cart-promo-input';

  const input = el('input', 'cart-promo-input');
  input.id = 'cart-promo-input';
  input.name = 'promo';
  input.type = 'text';
  input.autocomplete = 'off';
  input.value = value;
  input.disabled = view.promoCode !== null;

  const submit = el('button', 'button', 'Apply');
  submit.type = 'submit';
  submit.disabled = view.promoCode !== null;

  const row = el('div', 'cart-promo-row');
  row.append(input, submit);

  const status = el('p', 'cart-promo-message');
  status.setAttribute('aria-live', 'polite');
  if (message?.kind === 'error') {
    status.classList.add('cart-promo-error');
    status.textContent = message.text;
  } else if (view.promoCode) {
    status.classList.add('cart-promo-success');
    status.textContent = `Promo code ${view.promoCode} applied`;
  }

  form.append(label, row, status);
  return form;
}

function renderEmpty(view: CartView): HTMLElement {
  const empty = el('div', 'cart-empty');

  const link = el('a', 'button', 'Go to catalog');
  link.href = '#/catalog';

  empty.append(el('p', 'cart-empty-text', 'Your cart is empty'), renderSummary(view), link);
  return empty;
}

function renderContent(view: CartView, message: PromoMessage, promoValue: string): HTMLElement {
  if (view.isEmpty) return renderEmpty(view);

  const list = el('ul', 'cart-list');
  list.append(...view.lines.map(renderLine));

  const clear = actionButton('cart-button cart-button-text', 'Clear cart', 'clear');

  const main = el('div', 'cart-main');
  main.append(list, clear);

  const side = el('div', 'cart-side');
  side.append(renderSummary(view), renderPromoForm(view, message, promoValue));

  const layout = el('div', 'cart-layout');
  layout.append(main, side);
  return layout;
}

export function renderCartPage(container: HTMLElement): () => void {
  const page = el('section', 'cart-page');
  const content = el('div', 'cart-content');
  page.append(el('h1', 'cart-title', 'Cart'), content);
  container.replaceChildren(page);

  let message: PromoMessage = null;
  let promoValue = '';

  function render(): void {
    const view = getCartView(cartStore.getState(), books);
    if (view.promoCode) promoValue = '';

    // Re-render recreates the buttons: restore focus to the same button if it still exists.
    const focused = document.activeElement;
    const focusKey =
      focused instanceof HTMLButtonElement && page.contains(focused)
        ? `[data-action="${focused.dataset.action}"][data-book-id="${focused.dataset.bookId}"]`
        : null;

    content.replaceChildren(renderContent(view, message, promoValue));

    if (focusKey) content.querySelector<HTMLButtonElement>(`button${focusKey}:enabled`)?.focus();
  }

  function onClick(event: MouseEvent): void {
    const target = event.target instanceof Element ? event.target : null;
    const button = target?.closest<HTMLButtonElement>('button[data-action]');
    if (!button || !page.contains(button)) return;

    const bookId = button.dataset.bookId ?? '';
    switch (button.dataset.action) {
      case 'increase':
        cartStore.increase(bookId);
        break;
      case 'decrease':
        cartStore.decrease(bookId);
        break;
      case 'remove':
        cartStore.remove(bookId);
        break;
      case 'clear':
        message = null;
        cartStore.clear();
        break;
    }
  }

  function onSubmit(event: SubmitEvent): void {
    const form = event.target instanceof HTMLFormElement ? event.target : null;
    if (!form?.classList.contains('cart-promo')) return;
    event.preventDefault();

    const input = form.elements.namedItem('promo');
    promoValue = input instanceof HTMLInputElement ? input.value : '';

    // Reset before calling the store: on success it calls render() synchronously.
    message = null;
    const error = cartStore.applyPromo(promoValue);
    // On error the state is unchanged and no listener fires, so re-render manually.
    if (error) {
      message = { kind: 'error', text: error };
      render();
      content.querySelector<HTMLInputElement>('.cart-promo-input')?.focus();
    }
  }

  page.addEventListener('click', onClick);
  page.addEventListener('submit', onSubmit);
  const unsubscribe = cartStore.subscribe(render);
  render();

  return () => {
    unsubscribe();
    page.removeEventListener('click', onClick);
    page.removeEventListener('submit', onSubmit);
    container.replaceChildren();
  };
}
