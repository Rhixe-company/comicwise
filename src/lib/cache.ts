// Typed cache wrapper to unify Upstash and ioredis usages
import Redis from "ioredis";

import { env } from "appConfig";

export type CacheValue = string | number | object | null;

export interface CacheClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  clear?(): Promise<void>;
  // raw client exposed for advanced operations
  raw?: Redis | Record<string, unknown> | null;
}

export function createCacheClient(rawClient: Redis | Record<string, unknown> | null): CacheClient {
  // Upstash Redis client (REST) detection
  if (
    rawClient &&
    typeof rawClient === "object" &&
    "get" in rawClient &&
    typeof rawClient.get === "function" &&
    "set" in rawClient &&
    typeof rawClient.set === "function"
  ) {
    return {
      raw: rawClient as Record<string, unknown>,
      async get(key: string) {
        const getFn = (rawClient as Record<string, unknown>).get as
          | ((k: string) => Promise<string | null>)
          | undefined;
        if (!getFn) return null;
        const result = await getFn(key);
        return (result as string | null) ?? null;
      },
      async set(key: string, value: string, ttlSeconds?: number) {
        const setFn = (rawClient as Record<string, unknown>).set as
          | ((k: string, v: string, opts?: unknown) => Promise<void>)
          | undefined;
        if (!setFn) return;
        if (ttlSeconds) {
          await setFn(key, value, { ex: ttlSeconds });
        } else {
          await setFn(key, value);
        }
      },
      async del(key: string) {
        const delFn = (rawClient as Record<string, unknown>).del as
          | ((k: string) => Promise<number>)
          | undefined;
        if (delFn) await delFn(key);
      },
      async clear() {
        const client = rawClient as Record<string, unknown>;
        const flushdbFn = client.flushdb as (() => Promise<void>) | undefined;
        if (typeof flushdbFn === "function") {
          await flushdbFn();
        }
      },
    };
  }

  // ioredis client detection
  if (
    (rawClient && typeof (rawClient as Record<string, unknown>).call === "function") ||
    rawClient instanceof Redis
  ) {
    const client: Redis = rawClient as Redis;
    return {
      raw: client,
      async get(key: string) {
        return await client.get(key);
      },
      async set(key: string, value: string, ttlSeconds?: number) {
        if (ttlSeconds) {
          await client.set(key, value, "EX", ttlSeconds);
        } else {
          await client.set(key, value);
        }
      },
      async del(key: string) {
        await client.del(key);
      },
      async clear() {
        await client.flushdb();
      },
    };
  }

  // Fallback in-memory simple map for environments without Redis
  const store = new Map<string, string>();
  return {
    raw: null,
    async get(key: string) {
      return store.has(key) ? (store.get(key) as string) : null;
    },
    async set(key: string, value: string) {
      store.set(key, value);
    },
    async del(key: string) {
      store.delete(key);
    },
    async clear() {
      store.clear();
    },
  };
}
/**
 * Redis Configuration
 * Supports both standalone and cluster modes
 */
const getRedisConfig = (): Record<string, unknown> => {
  const baseConfig: Record<string, unknown> = {
    host: env.REDIS_HOST || "localhost",
    port: Number(env.REDIS_PORT) || 6379,
    password: env.REDIS_PASSWORD || undefined,
    database: Number(env.REDIS_DB) || 0,
    maxRetriesPerRequest: 3,
    retryStrategy(times: number) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    reconnectOnError(err: Error) {
      const targetErrors = ["READONLY", "ECONNRESET"];
      return targetErrors.some((target) => err.message.includes(target));
    },
    lazyConnect: true,
    enableReadyCheck: true,
    showFriendlyErrorStack: env.NODE_ENV === "development",
  };

  // Add TLS for production
  if (env.NODE_ENV === "production" && String(env.REDIS_TLS_ENABLED) === "true") {
    baseConfig.tls = {
      rejectUnauthorized: false,
    };
  }

  return baseConfig;
};

/**
 * Global Redis client singleton
 */
let redisClient: Redis | null = null;

/**
 * Get or create Redis client
 */
export function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = new Redis(getRedisConfig());

    redisClient.on("error", (error) => {
      console.error("Redis Client Error:", error);
    });

    redisClient.on("connect", () => {
      console.log("✅ Redis connected successfully");
    });

    redisClient.on("ready", () => {
      console.log("✅ Redis client ready");
    });

    redisClient.on("close", () => {
      console.warn("⚠️  Redis connection closed");
    });

    redisClient.on("reconnecting", () => {
      console.log("🔄 Redis reconnecting...");
    });
  }

  return redisClient;
}

/**
 * Close Redis connection (for cleanup)
 */
export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log("✅ Redis connection closed");
  }
}

/**
 * Cache key prefixes for different data types
 */
export const CACHE_KEYS = {
  COMIC: "comic:",
  COMICS_LIST: "comics:list:",
  COMIC_CHAPTERS: "comic:chapters:",
  CHAPTER: "chapter:",
  AUTHOR: "author:",
  ARTIST: "artist:",
  GENRE: "genre:",
  GENRES_LIST: "genres:list:",
  SEARCH: "search:",
  TRENDING: "trending:",
  POPULAR: "popular:",
  USER_BOOKMARKS: "user:bookmarks:",
  USER_HISTORY: "user:history:",
  COMMENT_COUNT: "comic:comments:",
  VIEW_COUNT: "views:",
  RATING_AVG: "rating:",
} as const;

/**
 * Cache TTL (Time To Live) in seconds
 */
export const CACHE_TTL = {
  // Short-lived cache (5 minutes)
  SHORT: 60 * 5,
  // Medium cache (30 minutes)
  MEDIUM: 60 * 30,
  // Long cache (2 hours)
  LONG: 60 * 60 * 2,
  // Very long cache (12 hours)
  VERY_LONG: 60 * 60 * 12,
  // Daily cache (24 hours)
  DAILY: 60 * 60 * 24,
  // Weekly cache (7 days)
  WEEKLY: 60 * 60 * 24 * 7,
} as const;

/**
 * Cache options for different operations
 */
export interface CacheOptions {
  ttl?: number;
  prefix?: string;
  tags?: string[];
}

/**
 * Redis Cache Service
 * Provides high-level caching operations with type safety
 */
export class RedisCache {
  private redis: Redis;

  constructor() {
    this.redis = getRedisClient();
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      if (!value) {
        return null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Cache GET error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache with optional TTL
   */
  async set<T>(key: string, value: T, options?: CacheOptions): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      const ttl = options?.ttl || CACHE_TTL.MEDIUM;

      if (ttl > 0) {
        await this.redis.setex(key, ttl, serialized);
      } else {
        await this.redis.set(key, serialized);
      }

      // Store tags for invalidation
      if (options?.tags && options.tags.length > 0) {
        await this.addTagsToKey(key, options.tags);
      }

      return true;
    } catch (error) {
      console.error(`Cache SET error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<boolean> {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error(`Cache DELETE error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete multiple keys
   */
  async deleteMany(keys: string[]): Promise<boolean> {
    try {
      if (keys.length === 0) {
        return true;
      }
      await this.redis.del(...keys);
      return true;
    } catch (error) {
      console.error(`Cache DELETE MANY error:`, error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Cache EXISTS error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get TTL for a key (in seconds)
   */
  async getTTL(key: string): Promise<number> {
    try {
      return await this.redis.ttl(key);
    } catch (error) {
      console.error(`Cache TTL error for key ${key}:`, error);
      return -1;
    }
  }

  /**
   * Set TTL for a key
   */
  async setTTL(key: string, ttl: number): Promise<boolean> {
    try {
      await this.redis.expire(key, ttl);
      return true;
    } catch (error) {
      console.error(`Cache SET TTL error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete all keys matching a pattern
   */
  async deletePattern(pattern: string): Promise<number> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length === 0) {
        return 0;
      }
      await this.redis.del(...keys);
      return keys.length;
    } catch (error) {
      console.error(`Cache DELETE PATTERN error for ${pattern}:`, error);
      return 0;
    }
  }

  /**
   * Get all keys matching a pattern
   */
  async getKeys(pattern: string): Promise<string[]> {
    try {
      return await this.redis.keys(pattern);
    } catch (error) {
      console.error(`Cache GET KEYS error for ${pattern}:`, error);
      return [];
    }
  }

  /**
   * Increment a counter
   */
  async increment(key: string, amount = 1): Promise<number> {
    try {
      return await this.redis.incrby(key, amount);
    } catch (error) {
      console.error(`Cache INCREMENT error for key ${key}:`, error);
      return 0;
    }
  }

  /**
   * Decrement a counter
   */
  async decrement(key: string, amount = 1): Promise<number> {
    try {
      return await this.redis.decrby(key, amount);
    } catch (error) {
      console.error(`Cache DECREMENT error for key ${key}:`, error);
      return 0;
    }
  }

  /**
   * Add multiple items to a set
   */
  async addToSet(key: string, ...members: string[]): Promise<boolean> {
    try {
      await this.redis.sadd(key, ...members);
      return true;
    } catch (error) {
      console.error(`Cache ADD TO SET error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get all members of a set
   */
  async getSet(key: string): Promise<string[]> {
    try {
      return await this.redis.smembers(key);
    } catch (error) {
      console.error(`Cache GET SET error for key ${key}:`, error);
      return [];
    }
  }

  /**
   * Remove member from set
   */
  async removeFromSet(key: string, member: string): Promise<boolean> {
    try {
      await this.redis.srem(key, member);
      return true;
    } catch (error) {
      console.error(`Cache REMOVE FROM SET error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Check if member exists in set
   */
  async isInSet(key: string, member: string): Promise<boolean> {
    try {
      const result = await this.redis.sismember(key, member);
      return result === 1;
    } catch (error) {
      console.error(`Cache IS IN SET error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Add item to sorted set with score
   */
  async addToSortedSet(key: string, score: number, member: string): Promise<boolean> {
    try {
      await this.redis.zadd(key, score, member);
      return true;
    } catch (error) {
      console.error(`Cache ADD TO SORTED SET error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get top N items from sorted set (highest scores first)
   */
  async getTopFromSortedSet(
    key: string,
    count: number
  ): Promise<Array<{ member: string; score: number }>> {
    try {
      const results = await this.redis.zrevrange(key, 0, count - 1, "WITHSCORES");
      const items: Array<{ member: string; score: number }> = [];

      for (let i = 0; i < results.length; i += 2) {
        items.push({
          member: results[i]!,
          score: parseFloat(results[i + 1]!),
        });
      }

      return items;
    } catch (error) {
      console.error(`Cache GET TOP FROM SORTED SET error for key ${key}:`, error);
      return [];
    }
  }

  /**
   * Increment score in sorted set
   */
  async incrementScoreInSortedSet(key: string, member: string, increment: number): Promise<number> {
    try {
      // zincrby returns string, so parse to number
      const result = await this.redis.zincrby(key, increment, member);
      return typeof result === "number" ? result : Number(result);
    } catch (error) {
      console.error(`Cache INCREMENT SCORE error for key ${key}:`, error);
      return 0;
    }
  }

  /**
   * Cache-aside pattern: get from cache or fetch from source
   */
  async getOrSet<T>(key: string, fetchFn: () => Promise<T>, options?: CacheOptions): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch from source
    const data = await fetchFn();

    // Store in cache (don't wait)
    this.set(key, data, options).catch((error) => {
      console.error(`Failed to cache data for key ${key}:`, error);
    });

    return data;
  }

  /**
   * Add tags to a key for grouped invalidation
   */
  private async addTagsToKey(key: string, tags: string[]): Promise<void> {
    try {
      const pipeline = this.redis.pipeline();

      for (const tag of tags) {
        const tagKey = `tag:${tag}`;
        pipeline.sadd(tagKey, key);
      }

      await pipeline.exec();
    } catch (error) {
      console.error(`Failed to add tags to key ${key}:`, error);
    }
  }

  /**
   * Invalidate all keys with a specific tag
   */
  async invalidateByTag(tag: string): Promise<number> {
    try {
      const tagKey = `tag:${tag}`;
      const keys = await this.redis.smembers(tagKey);

      if (keys.length === 0) {
        return 0;
      }

      // Delete all keys with this tag
      await this.redis.del(...keys);

      // Delete the tag set itself
      await this.redis.del(tagKey);

      return keys.length;
    } catch (error) {
      console.error(`Failed to invalidate by tag ${tag}:`, error);
      return 0;
    }
  }

  async flushAll(): Promise<boolean> {
    try {
      const flushFn = (this.redis as unknown as Record<string, unknown>).flushdatabase as
        | (() => Promise<void>)
        | undefined;
      if (flushFn) {
        await flushFn();
      }
      console.warn("⚠️  Cache flushed");
      return true;
    } catch (error) {
      console.error(`Cache FLUSH error:`, error);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    keys: number;
    memory: string;
    hits: number;
    misses: number;
    hitRate: number;
  }> {
    try {
      const infoFn = (this.redis as unknown as Record<string, unknown>).info as
        | ((type: string) => Promise<string>)
        | undefined;
      const info = infoFn ? await infoFn("stats") : "";
      const memory = infoFn ? await infoFn("memory") : "";
      const databasesizeFn = (this.redis as unknown as Record<string, unknown>).databasesize as
        | (() => Promise<number>)
        | undefined;
      const databasesize = databasesizeFn ? await databasesizeFn() : 0;

      const stats = {
        keys: databasesize,
        memory: memory.match(/used_memory_human:([^\r\n]+)/)?.[1] || "N/A",
        hits: parseInt(info.match(/keyspace_hits:(\d+)/)?.[1] || "0"),
        misses: parseInt(info.match(/keyspace_misses:(\d+)/)?.[1] || "0"),
        hitRate: 0,
      };

      const total = stats.hits + stats.misses;
      stats.hitRate = total > 0 ? (stats.hits / total) * 100 : 0;

      return stats;
    } catch (error) {
      console.error("Failed to get cache stats:", error);
      return {
        keys: 0,
        memory: "N/A",
        hits: 0,
        misses: 0,
        hitRate: 0,
      };
    }
  }

  /**
   * Health check for Redis connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      return result === "PONG";
    } catch (error) {
      console.error("Redis health check failed:", error);
      return false;
    }
  }
}

// Export singleton instance
export const cache = new RedisCache();
