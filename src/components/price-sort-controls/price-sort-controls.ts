import './price-sort-controls.css';
import type { SortOrder } from '../../utils/catalog-filters';
import { isPriceRangeInvalid, parsePriceInput } from './price-sort-value';

export interface PriceSortValue {
  min: number | null;
  max: number | null;
  sort: SortOrder;
}

export interface PriceSortControls {
  getValue(): PriceSortValue;
  reset(): void;
  destroy(): void;
}

const DEFAULT_VALUE: PriceSortValue = { min: null, max: null, sort: 'default' };

const SORT_OPTIONS: ReadonlyArray<{ value: SortOrder; label: string }> = [
  { value: 'default', label: 'Default' },
  { value: 'asc', label: 'Price: low to high' },
  { value: 'desc', label: 'Price: high to low' },
];

const RANGE_HINT = "Min price can't be greater than max";

// The component may appear on a page more than once, so ids get a unique prefix.
let instanceCounter = 0;

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

function labelled<T extends HTMLElement>(
  id: string,
  labelText: string,
  control: T,
): HTMLDivElement {
  const label = el('label', 'price-sort-label', labelText);
  label.htmlFor = id;
  control.id = id;

  const field = el('div', 'price-sort-field');
  field.append(label, control);
  return field;
}

function priceInput(placeholder: string, value: number | null): HTMLInputElement {
  const input = el('input', 'price-sort-input');
  input.type = 'number';
  input.min = '0';
  input.step = '0.01';
  input.inputMode = 'decimal';
  input.placeholder = placeholder;
  if (value !== null) input.value = String(value);
  return input;
}

function isSortOrder(value: string): value is SortOrder {
  return SORT_OPTIONS.some((option) => option.value === value);
}

export function renderPriceSortControls(
  container: HTMLElement,
  onChange: (value: PriceSortValue) => void,
  initial?: Partial<PriceSortValue>,
): PriceSortControls {
  instanceCounter += 1;
  const idPrefix = `price-sort-${instanceCounter}`;
  const start = { ...DEFAULT_VALUE, ...initial };

  const minInput = priceInput('0', start.min);
  const maxInput = priceInput('Any', start.max);

  const select = el('select', 'price-sort-select');
  for (const option of SORT_OPTIONS) {
    const node = el('option', undefined, option.label);
    node.value = option.value;
    select.append(node);
  }
  select.value = start.sort;

  const hint = el('p', 'price-sort-hint');
  hint.setAttribute('aria-live', 'polite');

  const fields = el('div', 'price-sort-fields');
  fields.append(
    labelled(`${idPrefix}-min`, 'Min', minInput),
    labelled(`${idPrefix}-max`, 'Max', maxInput),
  );

  const price = el('fieldset', 'price-sort-price');
  price.append(el('legend', 'price-sort-legend', 'Price'), fields, hint);

  const sort = labelled(`${idPrefix}-sort`, 'Sort by', select);
  sort.classList.add('price-sort-sort');

  const root = el('div', 'price-sort-controls');
  root.append(price, sort);
  container.replaceChildren(root);

  function getValue(): PriceSortValue {
    return {
      min: parsePriceInput(minInput.valueAsNumber),
      max: parsePriceInput(maxInput.valueAsNumber),
      sort: isSortOrder(select.value) ? select.value : 'default',
    };
  }

  function update(): void {
    const value = getValue();
    const invalid = isPriceRangeInvalid(value.min, value.max);

    hint.textContent = invalid ? RANGE_HINT : '';
    minInput.toggleAttribute('aria-invalid', invalid);
    maxInput.toggleAttribute('aria-invalid', invalid);

    // Called even when min > max: filterByPrice returns [] and the hint explains why.
    onChange(value);
  }

  // Number fields report on every keystroke (input), the select on change.
  // Select also fires input and number fields fire change on blur, so filter by target.
  function onInput(event: Event): void {
    if (event.target === minInput || event.target === maxInput) update();
  }

  function onSelectChange(event: Event): void {
    if (event.target === select) update();
  }

  root.addEventListener('input', onInput);
  root.addEventListener('change', onSelectChange);

  // Show the hint right away if the initial range is already invalid, without calling onChange.
  if (isPriceRangeInvalid(getValue().min, getValue().max)) hint.textContent = RANGE_HINT;

  return {
    getValue,
    reset() {
      minInput.value = '';
      maxInput.value = '';
      select.value = DEFAULT_VALUE.sort;
      update();
    },
    destroy() {
      root.removeEventListener('input', onInput);
      root.removeEventListener('change', onSelectChange);
      container.replaceChildren();
    },
  };
}
