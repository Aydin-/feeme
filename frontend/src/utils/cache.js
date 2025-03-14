// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const STALE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

class CacheManager {
  constructor(prefix = '') {
    this.prefix = prefix;
  }

  getKey(key) {
    return `${this.prefix}_${key}`;
  }

  get(key) {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (!item) return null;

      const { data, timestamp } = JSON.parse(item);
      const age = Date.now() - timestamp;

      // Return data with freshness status
      return {
        data,
        timestamp,
        isFresh: age < CACHE_DURATION,
        isStale: age >= CACHE_DURATION && age < STALE_DURATION,
        isExpired: age >= STALE_DURATION
      };
    } catch (error) {
      console.error('Cache read error:', error);
      return null;
    }
  }

  set(key, data) {
    try {
      const item = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(this.getKey(key), JSON.stringify(item));
    } catch (error) {
      console.error('Cache write error:', error);
    }
  }

  async fetchWithCache(key, fetchFn, options = {}) {
    const {
      forceFresh = false,
      retryCount = 0
    } = options;

    const cached = this.get(key);

    // Return fresh cache if available and not forcing fresh data
    if (!forceFresh && cached?.isFresh) {
      return cached.data;
    }

    try {
      // Attempt to fetch fresh data
      const freshData = await fetchFn();
      this.set(key, freshData);
      return freshData;
    } catch (error) {
      // If we have stale data, use it
      if (cached && !cached.isExpired) {
        console.warn(`Using stale data for ${key} due to fetch error:`, error);
        return cached.data;
      }

      // Implement exponential backoff for retries
      if (retryCount < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
        console.log(`Retrying fetch for ${key} in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return this.fetchWithCache(key, fetchFn, {
          ...options,
          retryCount: retryCount + 1
        });
      }

      // If all retries failed and we have no cache, throw the error
      throw error;
    }
  }

  clear(key) {
    if (key) {
      localStorage.removeItem(this.getKey(key));
    } else {
      // Clear all items with this prefix
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      }
    }
  }
}

// Create instances for different types of data
export const priceCache = new CacheManager('price');
export const marketCache = new CacheManager('market');
export const networkCache = new CacheManager('network'); 