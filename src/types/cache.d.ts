// ═══════════════════════════════════════════════════
// CACHE TYPES - Redis Caching
// ═══════════════════════════════════════════════════

/**
 * Cache key patterns
 */
export type CacheKeyPattern =
  | `chapter:${string}`
  | `comic:${string}`
  | `search:${string}`
  | `session:${string}`
  | `user:${string}`;

/**
 * Cache options
 */
export interface CacheOptions {
  revalidate?: boolean;
  tags?: string[];
  ttl?: number;
}

/**
 * Cache statistics
 */
export interface CacheStats {
  evictions: number;
  hitRate: number;
  hits: number;
  keys: number;
  memoryUsed: number;
  misses: number;
}

/**
 * Cache entry
 */
export interface CacheEntry<T = unknown> {
  expiresAt?: number;
  tags?: string[];
  value: T;
}

/**
 * Cache invalidation options
 */
export interface CacheInvalidationOptions {
  keys?: string[];
  pattern?: string;
  tags?: string[];
}
