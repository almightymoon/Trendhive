import AsyncStorage from '@react-native-async-storage/async-storage';

class CacheService {
  constructor() {
    this.cachePrefix = 'trendhive_cache_';
    this.defaultTTL = 30 * 60 * 1000; // 30 minutes in milliseconds
  }

  // Generate cache key
  generateKey(key) {
    return `${this.cachePrefix}${key}`;
  }

  // Save data to cache with TTL
  async set(key, data, ttl = this.defaultTTL) {
    try {
      const cacheKey = this.generateKey(key);
      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl
      };
      
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
      console.log(`CacheService - Cached data for key: ${key}`);
      return true;
    } catch (error) {
      console.error('CacheService - Error saving to cache:', error);
      return false;
    }
  }

  // Get data from cache
  async get(key) {
    try {
      const cacheKey = this.generateKey(key);
      const cachedItem = await AsyncStorage.getItem(cacheKey);
      
      if (!cachedItem) {
        console.log(`CacheService - No cached data found for key: ${key}`);
        return null;
      }

      const cacheData = JSON.parse(cachedItem);
      const now = Date.now();
      const isExpired = (now - cacheData.timestamp) > cacheData.ttl;

      if (isExpired) {
        console.log(`CacheService - Cache expired for key: ${key}`);
        await this.remove(key);
        return null;
      }

      console.log(`CacheService - Retrieved cached data for key: ${key}`);
      return cacheData.data;
    } catch (error) {
      console.error('CacheService - Error reading from cache:', error);
      return null;
    }
  }

  // Remove specific cache item
  async remove(key) {
    try {
      const cacheKey = this.generateKey(key);
      await AsyncStorage.removeItem(cacheKey);
      console.log(`CacheService - Removed cache for key: ${key}`);
      return true;
    } catch (error) {
      console.error('CacheService - Error removing cache:', error);
      return false;
    }
  }

  // Clear all cache
  async clear() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.cachePrefix));
      await AsyncStorage.multiRemove(cacheKeys);
      console.log('CacheService - Cleared all cache');
      return true;
    } catch (error) {
      console.error('CacheService - Error clearing cache:', error);
      return false;
    }
  }

  // Get cache size (for debugging)
  async getCacheSize() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.cachePrefix));
      return cacheKeys.length;
    } catch (error) {
      console.error('CacheService - Error getting cache size:', error);
      return 0;
    }
  }

  // Check if cache exists and is valid
  async has(key) {
    const data = await this.get(key);
    return data !== null;
  }

  // Cache keys for different data types
  static KEYS = {
    PRODUCTS: 'products',
    PRODUCT_DETAIL: 'product_detail_',
    CATEGORIES: 'categories',
    USER_PROFILE: 'user_profile',
    CART: 'cart',
    ORDERS: 'orders',
    REVIEWS: 'reviews'
  };
}

export default new CacheService(); 