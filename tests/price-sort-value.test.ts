import { describe, expect, it } from 'vitest';
import {
  isPriceRangeInvalid,
  parsePriceInput,
} from '../src/components/price-sort-controls/price-sort-value';

describe('parsePriceInput', () => {
  it.each([
    [NaN, null],
    [0, 0],
    [12.5, 12.5],
    [-5, null],
  ])('parses %s as %s', (input, expected) => {
    expect(parsePriceInput(input)).toBe(expected);
  });
});

describe('isPriceRangeInvalid', () => {
  it.each([
    [10, 5, true],
    [5, 10, false],
    [10, 10, false],
    [null, 5, false],
    [10, null, false],
  ])('min %s, max %s → %s', (min, max, expected) => {
    expect(isPriceRangeInvalid(min, max)).toBe(expected);
  });
});
