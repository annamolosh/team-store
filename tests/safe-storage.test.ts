import { describe, expect, it } from 'vitest';
import { createSafeStorage } from '../src/store/safe-storage';

function createFakeStorage(): Storage {
  const data = new Map<string, string>();

  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
  } as Storage;
}

function createThrowingStorage(): Storage {
  const fail = (): never => {
    throw new Error('QuotaExceededError');
  };

  return { getItem: fail, setItem: fail, removeItem: fail } as unknown as Storage;
}

describe('createSafeStorage', () => {
  it('works like a null storage when getStorage returns null', () => {
    const storage = createSafeStorage(() => null);

    expect(() => storage.setItem('key', 'value')).not.toThrow();
    expect(() => storage.removeItem('key')).not.toThrow();
    expect(storage.getItem('key')).toBeNull();
  });

  it('works like a null storage when getStorage throws', () => {
    const storage = createSafeStorage(() => {
      throw new Error('SecurityError');
    });

    expect(() => storage.setItem('key', 'value')).not.toThrow();
    expect(() => storage.removeItem('key')).not.toThrow();
    expect(storage.getItem('key')).toBeNull();
  });

  it('swallows errors thrown by each storage method', () => {
    const storage = createSafeStorage(() => createThrowingStorage());

    expect(storage.getItem('key')).toBeNull();
    expect(() => storage.setItem('key', 'value')).not.toThrow();
    expect(() => storage.removeItem('key')).not.toThrow();
  });

  it('delegates to a working storage', () => {
    const storage = createSafeStorage(() => createFakeStorage());

    storage.setItem('key', 'value');
    expect(storage.getItem('key')).toBe('value');

    storage.removeItem('key');
    expect(storage.getItem('key')).toBeNull();
  });
});
