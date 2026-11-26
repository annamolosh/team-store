const notImplemented = (): never => {
  throw new Error('Not implemented');
};

export const parsePriceInput: (valueAsNumber: number) => number | null = notImplemented;

export const isPriceRangeInvalid: (min: number | null, max: number | null) => boolean =
  notImplemented;
