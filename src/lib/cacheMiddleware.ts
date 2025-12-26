import { createHash } from "crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { cache, CACHE_TTL } from "lib/cache";

/**
 * Cache middleware configuration
 */
export interface CacheMiddlewareConfig {
  /** Cache TTL in seconds */
  ttl?: number;
  /** Cache key prefix */
  prefix?: string;
  /** Whether to include query parameters in cache key */
  includeQuery?: boolean;
  /** Whether to include request body in cache key (for POST requests) */
  includeBody?: boolean;
  /** Custom cache key generator */
  keyGenerator?(request: NextRequest): string | Promise<string>;
  /** Whether to cache based on user authentication */
  userSpecific?: boolean;
  /** Tags for grouped invalidation */
  tags?: string[];
  /** Skip caching based on condition */
  skipCache?(request: NextRequest): boolean | Promise<boolean>;
  /** Revalidate cache on specific conditions */
  revalidate?(request: NextRequest): boolean | Promise<boolean>;
}

/**
 * Generate cache key from request
 * param request
 * param config
 */
async function generateCacheKey(
  request: NextRequest,
  config: CacheMiddlewareConfig
): Promise<string> {
  // Use custom key generator if provided
  if (config.keyGenerator) {
    return config.keyGenerator(request);
  }

  const url = new URL(request.url);
  let key = `${config.prefix || "api"}:${url.pathname}`;

  // Include query parameters
  if (config.includeQuery && url.search) {
    const sortedParameters = [...url.searchParams.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("&");
    key += `:${sortedParameters}`;
  }

  // Include request body for POST/PUT/PATCH
  if (config.includeBody && ["POST", "PUT", "PATCH"].includes(request.method)) {
    try {
      const body = await request.clone().text();
      if (body) {
        const bodyHash = createHash("md5").update(body).digest("hex");
        key += `:body:${bodyHash}`;
      }
    } catch (error) {
      console.error("Failed to read request body:", error);
    }
  }

  // Include user ID for user-specific caching
  if (config.userSpecific) {
    // Extract user ID from headers or cookies
    const userId = request.headers.get("x-user-id") || request.cookies.get("userId")?.value;
    if (userId) {
      key += `:user:${userId}`;
    }
  }

  return key;
}

/**
 * Cache middleware for API routes
 * Usage in API route:
 * ```typescript
 * export const GET = withCache(
 *   async (request) => {
 *     const data = await fetchData();
 *     return NextResponse.json(data);
 *   },
 *   { ttl: CACHE_TTL.MEDIUM, prefix: "comics" }
 * );
 * ```
 * param handler
 * param config
 */
export function withCache(
  handler: (request: NextRequest) => Promise<NextResponse>,
  config: CacheMiddlewareConfig = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Check if caching should be skipped
    if (config.skipCache && (await config.skipCache(request))) {
      return handler(request);
    }

    // Only cache GET requests by default (unless configured otherwise)
    if (request.method !== "GET" && !config.includeBody) {
      return handler(request);
    }

    try {
      // Generate cache key
      const cacheKey = await generateCacheKey(request, config);

      // Check if revalidation is needed
      const shouldRevalidate = config.revalidate && (await config.revalidate(request));

      if (!shouldRevalidate) {
        // Try to get from cache
        const cached = await cache.get<{
          body: Record<string, unknown>;
          headers: Record<string, string>;
          status: number;
        }>(cacheKey);

        if (cached) {
          // Return cached response
          console.log(`✅ Cache HIT: ${cacheKey}`);

          const response = NextResponse.json(cached.body, {
            status: cached.status,
          });

          // Restore headers
          Object.entries(cached.headers).forEach(([key, value]) => {
            response.headers.set(key, value);
          });

          // Add cache hit header
          response.headers.set("X-Cache", "HIT");
          response.headers.set("X-Cache-Key", cacheKey);

          return response;
        }
      }

      console.log(`❌ Cache MISS: ${cacheKey}`);

      // Execute handler
      const response = await handler(request);

      // Only cache successful responses
      if (response.ok) {
        try {
          // Clone response to read body
          const clonedResponse = response.clone();
          const body = await clonedResponse.json();

          // Prepare cache data
          const cacheData = {
            body,
            headers: Object.fromEntries(response.headers.entries()),
            status: response.status,
          };

          // Store in cache (don't await)
          cache
            .set(cacheKey, cacheData, {
              ttl: config.ttl || CACHE_TTL.MEDIUM,
              tags: config.tags,
            })
            .catch((error) => {
              console.error(`Failed to cache response for ${cacheKey}:`, error);
            });

          // Add cache miss header
          response.headers.set("X-Cache", "MISS");
          response.headers.set("X-Cache-Key", cacheKey);
        } catch (error) {
          console.error("Failed to cache response:", error);
        }
      }

      return response;
    } catch (error) {
      console.error("Cache middleware error:", error);
      // On error, just execute handler without caching
      return handler(request);
    }
  };
}

/**
 * Invalidate cache for specific patterns
 * Usage:
 * ```typescript
 * await invalidateCache({ prefix: "comics" });
 * await invalidateCache({ pattern: "api:comics:*" });
 * await invalidateCache({ tags: ["comic:123"] });
 * ```
 * param options
 * param options.prefix
 * param options.pattern
 * param options.tags
 */
export async function invalidateCache(options: {
  prefix?: string;
  pattern?: string;
  tags?: string[];
}): Promise<number> {
  let totalInvalidated = 0;

  // Invalidate by pattern
  if (options.pattern) {
    const count = await cache.deletePattern(options.pattern);
    totalInvalidated += count;
    console.log(`🗑️  Invalidated ${count} keys matching ${options.pattern}`);
  }

  // Invalidate by prefix
  if (options.prefix) {
    const pattern = `${options.prefix}:*`;
    const count = await cache.deletePattern(pattern);
    totalInvalidated += count;
    console.log(`🗑️  Invalidated ${count} keys with prefix ${options.prefix}`);
  }

  // Invalidate by tags
  if (options.tags && options.tags.length > 0) {
    for (const tag of options.tags) {
      const count = await cache.invalidateByTag(tag);
      totalInvalidated += count;
      console.log(`🗑️  Invalidated ${count} keys with tag ${tag}`);
    }
  }

  return totalInvalidated;
}

/**
 * Conditional cache invalidation middleware
 * Automatically invalidates cache on POST/PUT/PATCH/DELETE requests
 * param handler
 * param config
 * param config.patterns
 * param config.tags
 * param config.invalidate
 */
export function withCacheInvalidation(
  handler: (request: NextRequest) => Promise<NextResponse>,
  config: {
    /** Patterns to invalidate */
    patterns?: string[];
    /** Tags to invalidate */
    tags?: string[];
    /** Custom invalidation logic */
    invalidate?(request: NextRequest): Promise<void>;
  }
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Execute handler first
    const response = await handler(request);

    // Only invalidate on successful mutations
    if (response.ok && ["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
      try {
        // Custom invalidation
        if (config.invalidate) {
          await config.invalidate(request);
        }

        // Pattern-based invalidation
        if (config.patterns && config.patterns.length > 0) {
          for (const pattern of config.patterns) {
            await cache.deletePattern(pattern);
          }
        }

        // Tag-based invalidation
        if (config.tags && config.tags.length > 0) {
          for (const tag of config.tags) {
            await cache.invalidateByTag(tag);
          }
        }

        console.log("✅ Cache invalidated after mutation");
      } catch (error) {
        console.error("Cache invalidation error:", error);
      }
    }

    return response;
  };
}

/**
 * Combine caching and invalidation middleware
 * param handler
 * param config
 * param config.cache
 * param config.invalidate
 * param config.invalidate.patterns
 * param config.invalidate.tags
 * param config.invalidate.invalidate
 */
export function withSmartCache(
  handler: (request: NextRequest) => Promise<NextResponse>,
  config: {
    cache?: CacheMiddlewareConfig;
    invalidate?: {
      patterns?: string[];
      tags?: string[];
      invalidate?(request: NextRequest): Promise<void>;
    };
  }
) {
  // Wrap with cache invalidation
  let wrappedHandler = handler;
  if (config.invalidate) {
    wrappedHandler = withCacheInvalidation(wrappedHandler, config.invalidate);
  }

  // Wrap with caching
  if (config.cache) {
    wrappedHandler = withCache(wrappedHandler, config.cache);
  }

  return wrappedHandler;
}

/**
 * Rate limiting with Redis
 * param identifier
 * param options
 * param options.window
 * param options.max
 */
export async function rateLimit(
  identifier: string,
  options: {
    window: number; // Time window in seconds
    max: number; // Max requests per window
  }
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const key = `ratelimit:${identifier}`;

  try {
    const current = await cache.increment(key);

    // Set expiry on first request
    if (current === 1) {
      await cache.setTTL(key, options.window);
    }

    const ttl = await cache.getTTL(key);
    const remaining = Math.max(0, options.max - current);

    return {
      success: current <= options.max,
      remaining,
      reset: Date.now() + ttl * 1000,
    };
  } catch (error) {
    console.error("Rate limit error:", error);
    // On error, allow the request
    return { success: true, remaining: options.max, reset: Date.now() };
  }
}

/**
 * Rate limiting middleware
 * param handler
 * param options
 * param options.window
 * param options.max
 * param options.keyGenerator
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    window?: number; // seconds
    max?: number; // requests
    keyGenerator?(request: NextRequest): string;
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Generate rate limit key
    const identifier =
      options.keyGenerator?.(request) ||
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "anonymous";

    // Check rate limit
    const result = await rateLimit(identifier, {
      window: options.window || 60, // 1 minute default
      max: options.max || 100, // 100 requests default
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Too many requests",
          message: "Rate limit exceeded. Please try again later.",
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": options.max?.toString() || "100",
            "X-RateLimit-Remaining": result.remaining.toString(),
            "X-RateLimit-Reset": result.reset.toString(),
            "Retry-After": Math.ceil((result.reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Execute handler
    const response = await handler(request);

    // Add rate limit headers
    response.headers.set("X-RateLimit-Limit", options.max?.toString() || "100");
    response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
    response.headers.set("X-RateLimit-Reset", result.reset.toString());

    return response;
  };
}
