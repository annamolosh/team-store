export type SafeStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const notImplemented = (): never => {
  throw new Error('Not implemented');
};

export const createSafeStorage: (getStorage: () => Storage | null) => SafeStorage = notImplemented;
