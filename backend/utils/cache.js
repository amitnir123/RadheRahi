const store = new Map();

export const cacheGet = (key) => {
    const entry = store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        store.delete(key);
        return null;
    }
    return entry.value;
};

export const cacheSet = (key, value, ttlMs = 60_000) => {
    store.set(key, { value, expiresAt: Date.now() + ttlMs });
};

export const cacheDel = (prefix) => {
    for (const key of store.keys()) {
        if (key.startsWith(prefix)) store.delete(key);
    }
};
