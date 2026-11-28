export type SafeStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function resolveStorage(getStorage: () => Storage | null): Storage | null {
  try {
    // In private mode even accessing localStorage may throw a SecurityError.
    return getStorage();
  } catch {
    return null;
  }
}

/**
 * Wraps a Storage so that it never throws: a missing storage behaves like a
 * Null Object, and errors from each call (private mode, quota) are swallowed.
 */
export function createSafeStorage(getStorage: () => Storage | null): SafeStorage {
  const storage = resolveStorage(getStorage);

  return {
    getItem(key) {
      try {
        return storage ? storage.getItem(key) : null;
      } catch {
        return null;
      }
    },
    setItem(key, value) {
      try {
        storage?.setItem(key, value);
      } catch {
        // ignore: keep working in memory
      }
    },
    removeItem(key) {
      try {
        storage?.removeItem(key);
      } catch {
        // ignore: keep working in memory
      }
    },
  };
}
