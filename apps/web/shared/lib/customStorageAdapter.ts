interface StorageAdapter {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

const customStorageAdapter: StorageAdapter = {
  getItem: (key: string): string | null => {
    return globalThis.localStorage.getItem(key);
  },
  setItem: (key: string, value: string): void => {
    globalThis.localStorage.setItem(key, value);
  },
  removeItem: (key: string): void => {
    globalThis.localStorage.removeItem(key);
  },
};

export default customStorageAdapter;
