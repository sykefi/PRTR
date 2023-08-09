const maxCacheSize = 50;

interface Cached {
  timestamp: number;
  maxAgeS: number | null;
  data: any;
}

const cache: Map<string, Cached> = new Map();
const cacheKeys: string[] = [];

const keepCacheUnderMaxSize = (key: string): void => {
  cacheKeys.unshift(key);
  if (cacheKeys.length > maxCacheSize) {
    const keyToRemove = cacheKeys.pop();
    if (keyToRemove && keyToRemove in cache) {
      cache.delete(keyToRemove);
    }
  }
};

const removeCachedItem = (key: string): void => {
  if (cache.has(key)) {
    cache.delete(key);
  }
  const index = cacheKeys.indexOf(key);
  if (index > -1) {
    cacheKeys.splice(index, 1);
  }
};

export const hasKey = (key: string): boolean => cache.has(key);

export const setToCacheWithExpiry = (key: string, data: any, maxAgeS: number | null) => {
  const timestamp = new Date().getTime();
  cache.set(key, { data, timestamp, maxAgeS });
  keepCacheUnderMaxSize(key);
};

export const setToCache = (key: string, data: any): void => {
  setToCacheWithExpiry(key, data, null);
};

export const getFromCache = (key: string): any | null => {
  if (cache.has(key)) {
    const cacheHit = cache.get(key)!;
    const timestamp = new Date().getTime();
    const ageS = Math.round((timestamp - cacheHit.timestamp) / 1000);
    if (!cacheHit.maxAgeS || ageS < cacheHit.maxAgeS!) {
      return cacheHit.data;
    } else {
      removeCachedItem(key);
      return null;
    }
  } else {
    return null;
  }
};
