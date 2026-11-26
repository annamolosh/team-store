// Takes input.valueAsNumber, not Number(input.value): an empty field gives NaN, not 0.
export function parsePriceInput(valueAsNumber: number): number | null {
  if (Number.isNaN(valueAsNumber) || valueAsNumber < 0) return null;
  return valueAsNumber;
}

export function isPriceRangeInvalid(min: number | null, max: number | null): boolean {
  return min !== null && max !== null && min > max;
}
