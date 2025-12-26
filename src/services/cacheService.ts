import { env } from "@/app-config";
import { createCacheClient } from "@/lib/cache";
/**
 * Redis Cache Service
 * Provides caching layer for database database/queries and API responses
 */

import { Redis } from "upstash/redis";

// Lazy loader for cache client to avoid forcing dependency at module import
let clientInstance: ReturnType<typeof createCacheClient> | null = null;

export function initCache(rawClient: ReturnType<typeof createCacheClient>) {
  clientInstance = rawClient;
  return clientInstance;
}

export const cache = {
  async get(key: string) {
    if (!clientInstance) return null;
    return clientInstance.get(key);
  },
  async set(key: string, value: string, ttlSeconds?: number) {
    if (!clientInstance) return Promise.resolve(null);
    return clientInstance.set(key, value, ttlSeconds);
  },
  async del(key: string) {
    if (!clientInstance) return Promise.resolve(null);
    return clientInstance.del(key);
  },
  async clear() {
    if (!clientInstance) return Promise.resolve(null);
    return clientInstance.clear?.();
  },
};

export default cache;

// Initialize Redis client
const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL || "",
  token: env.UPSTASH_REDIS_REST_TOKEN || "",
});

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
}

export class CacheService {
  private readonly defaultTTL = 3600; // 1 hour

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get<T>(key);
      return value;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    try {
      const ttl = options?.ttl ?? this.defaultTTL;
      await redis.set(key, JSON.stringify(value), { ex: ttl });

      // Note: Tag-based invalidation not supported in Upstash Redis REST API
      // Tags are stored but not used for invalidation
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error);
    }
  }

  /**
   * Delete multiple keys matching a pattern
   */
  async deletePattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error(`Cache delete pattern error for ${pattern}:`, error);
    }
  }

  /**
   * Invalidate cache by tags
   * Note: Upstash Redis REST API doesn't support set operations
   * Use pattern-based deletion instead
   */
  async invalidateByTag(tag: string): Promise<void> {
    try {
      // Use pattern deletion as workaround
      await this.deletePattern(`*:${tag}:*`);
    } catch (error) {
      console.error(`Cache invalidate by tag error for ${tag}:`, error);
    }
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    try {
      const redisAny = redis as unknown as { flushdatabase(): Promise<void> };
      await redisAny.flushdatabase();
    } catch (error) {
      console.error("Cache clear error:", error);
    }
  }

  /**
   * Get or set cached value with function
   */
  async getOrSet<T>(key: string, fn: () => Promise<T>, options?: CacheOptions): Promise<T> {
    // Try to get from cache
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Execute function and cache result
    const value = await fn();
    await this.set(key, value, options);
    return value;
  }

  /**
   * Check if key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get remaining TTL for a key
   */
  async ttl(key: string): Promise<number> {
    try {
      return await redis.ttl(key);
    } catch (error) {
      console.error(`Cache TTL error for key ${key}:`, error);
      return -1;
    }
  }

  /**
   * Increment a counter in cache
   */
  async increment(key: string, amount: number = 1): Promise<number> {
    try {
      const current = await redis.get<number>(key);
      const newValue = (current || 0) + amount;
      await redis.set(key, newValue);
      return newValue;
    } catch (error) {
      console.error(`Cache increment error for key ${key}:`, error);
      return 0;
    }
  }

  /**
   * Decrement a counter in cache
   */
  async decrement(key: string, amount: number = 1): Promise<number> {
    try {
      const current = await redis.get<number>(key);
      const newValue = (current || 0) - amount;
      await redis.set(key, newValue);
      return newValue;
    } catch (error) {
      console.error(`Cache decrement error for key ${key}:`, error);
      return 0;
    }
  }
}

// Export singleton instance
export const cacheService = new CacheService();

// Cache key builders
export const cacheKeys = {
  // Comics
  comic: (id: number) => `comic:${id}`,
  comics: (filters?: string) => `comics:${filters || "all"}`,
  comicsByGenre: (genreId: number) => `comics:genre:${genreId}`,
  comicsByAuthor: (authorId: number) => `comics:author:${authorId}`,
  comicsByStatus: (status: string) => `comics:status:${status}`,

  // Chapters
  chapter: (id: number) => `chapter:${id}`,
  chapters: (comicId: number) => `chapters:comic:${comicId}`,
  chapterImages: (chapterId: number) => `chapter:${chapterId}:images`,

  // Users
  user: (id: string) => `user:${id}`,
  userByEmail: (email: string) => `user:email:${email}`,

  // Bookmarks
  userBookmarks: (userId: string) => `bookmarks:user:${userId}`,
  comicBookmark: (userId: string, comicId: number) => `bookmark:${userId}:${comicId}`,

  // Comments
  chapterComments: (chapterId: number) => `comments:chapter:${chapterId}`,

  // Search
  searchResults: (query: string) => `search:${query}`,

  // Stats
  comicViews: (comicId: number) => `views:comic:${comicId}`,
  chapterViews: (chapterId: number) => `views:chapter:${chapterId}`,
  popularComics: () => "popular:comics",
  trendingComics: () => "trending:comics",

  // Metadata
  genres: () => "genres:all",
  authors: () => "authors:all",
  artists: () => "artists:all",
  types: () => "types:all",

  // Reading Progress
  userReadingProgress: (userId: string, comicId: number) => `reading:${userId}:${comicId}`,
  userReadingHistory: (userId: string) => `reading:history:${userId}`,
};

// Cache TTL constants (in seconds)
export const cacheTTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
  WEEK: 604800, // 7 days
};
