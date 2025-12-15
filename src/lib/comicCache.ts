import type { CacheOptions } from "@/lib/cache";
import { cache, CACHE_KEYS, CACHE_TTL } from "@/lib/cache";

import type { Comic } from "src/types/database";

/**
 * Comic Caching Service
 * Provides high-level caching for comics with automatic invalidation
 */
export class ComicCacheService {
  /**
   * Get comic by ID from cache or fetch
   */
  async getComic(comicId: number, fetchFn: () => Promise<Comic | null>): Promise<Comic | null> {
    const key = `${CACHE_KEYS.COMIC}${comicId}`;
    return cache.getOrSet(key, fetchFn, {
      ttl: CACHE_TTL.LONG,
      tags: ["comic", `comic:${comicId}`],
    });
  }

  /**
   * Get comic by slug from cache or fetch
   */
  async getComicBySlug(slug: string, fetchFn: () => Promise<Comic | null>): Promise<Comic | null> {
    const key = `${CACHE_KEYS.COMIC}slug:${slug}`;
    return cache.getOrSet(key, fetchFn, {
      ttl: CACHE_TTL.LONG,
      tags: ["comic", `comic:slug:${slug}`],
    });
  }

  /**
   * Get comics list with filters from cache or fetch
   */
  async getComicsList<T>(
    cacheKey: string,
    fetchFn: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    const key = `${CACHE_KEYS.COMICS_LIST}${cacheKey}`;
    return cache.getOrSet(key, fetchFn, {
      ttl: options?.ttl || CACHE_TTL.MEDIUM,
      tags: ["comics", ...(options?.tags || [])],
    });
  }

  /**
   * Get comic chapters from cache or fetch
   */
  async getComicChapters<T>(comicId: number, fetchFn: () => Promise<T>): Promise<T> {
    const key = `${CACHE_KEYS.COMIC_CHAPTERS}${comicId}`;
    return cache.getOrSet(key, fetchFn, {
      ttl: CACHE_TTL.MEDIUM,
      tags: ["chapters", `comic:${comicId}`],
    });
  }

  /**
   * Get chapter by ID from cache or fetch
   */
  async getChapter<T>(chapterId: number, fetchFn: () => Promise<T>): Promise<T> {
    const key = `${CACHE_KEYS.CHAPTER}${chapterId}`;
    return cache.getOrSet(key, fetchFn, {
      ttl: CACHE_TTL.LONG,
      tags: ["chapter", `chapter:${chapterId}`],
    });
  }

  /**
   * Cache search results
   */
  async getSearchResults<T>(searchKey: string, fetchFn: () => Promise<T>): Promise<T> {
    const key = `${CACHE_KEYS.SEARCH}${searchKey}`;
    return cache.getOrSet(key, fetchFn, {
      ttl: CACHE_TTL.SHORT, // Search results expire quickly
      tags: ["search"],
    });
  }

  /**
   * Get trending comics from cache or fetch
   */
  async getTrendingComics<T>(fetchFn: () => Promise<T>): Promise<T> {
    const key = `${CACHE_KEYS.TRENDING}comics`;
    return cache.getOrSet(key, fetchFn, {
      ttl: CACHE_TTL.MEDIUM,
      tags: ["trending"],
    });
  }

  /**
   * Get popular comics from cache or fetch
   */
  async getPopularComics<T>(fetchFn: () => Promise<T>): Promise<T> {
    const key = `${CACHE_KEYS.POPULAR}comics`;
    return cache.getOrSet(key, fetchFn, {
      ttl: CACHE_TTL.LONG,
      tags: ["popular"],
    });
  }

  /**
   * Get genres list from cache or fetch
   */
  async getGenres<T>(fetchFn: () => Promise<T>): Promise<T> {
    const key = `${CACHE_KEYS.GENRES_LIST}all`;
    return cache.getOrSet(key, fetchFn, {
      ttl: CACHE_TTL.VERY_LONG, // Genres rarely change
      tags: ["genres"],
    });
  }

  /**
   * Invalidate specific comic cache
   */
  async invalidateComic(comicId: number): Promise<void> {
    const patterns = [
      `${CACHE_KEYS.COMIC}${comicId}`,
      `${CACHE_KEYS.COMIC}slug:*`, // Invalidate slug lookups too
      `${CACHE_KEYS.COMIC_CHAPTERS}${comicId}`,
    ];

    await Promise.all(patterns.map((pattern) => cache.deletePattern(pattern)));

    // Invalidate by tag
    await cache.invalidateByTag(`comic:${comicId}`);
  }

  /**
   * Invalidate comics list cache
   */
  async invalidateComicsList(): Promise<void> {
    await cache.deletePattern(`${CACHE_KEYS.COMICS_LIST}*`);
    await cache.invalidateByTag("comics");
  }

  /**
   * Invalidate chapter cache
   */
  async invalidateChapter(chapterId: number, comicId?: number): Promise<void> {
    await cache.delete(`${CACHE_KEYS.CHAPTER}${chapterId}`);
    await cache.invalidateByTag(`chapter:${chapterId}`);

    // Also invalidate comic's chapters list if comicId provided
    if (comicId) {
      await cache.delete(`${CACHE_KEYS.COMIC_CHAPTERS}${comicId}`);
      await cache.invalidateByTag(`comic:${comicId}`);
    }
  }

  /**
   * Invalidate all search cache
   */
  async invalidateSearch(): Promise<void> {
    await cache.deletePattern(`${CACHE_KEYS.SEARCH}*`);
    await cache.invalidateByTag("search");
  }

  /**
   * Invalidate trending cache
   */
  async invalidateTrending(): Promise<void> {
    await cache.deletePattern(`${CACHE_KEYS.TRENDING}*`);
    await cache.invalidateByTag("trending");
  }

  /**
   * Invalidate popular cache
   */
  async invalidatePopular(): Promise<void> {
    await cache.deletePattern(`${CACHE_KEYS.POPULAR}*`);
    await cache.invalidateByTag("popular");
  }

  /**
   * Invalidate genres cache
   */
  async invalidateGenres(): Promise<void> {
    await cache.deletePattern(`${CACHE_KEYS.GENRES_LIST}*`);
    await cache.invalidateByTag("genres");
  }

  /**
   * Track comic view (increment counter)
   */
  async incrementViews(comicId: number, amount = 1): Promise<number> {
    const key = `${CACHE_KEYS.VIEW_COUNT}comic:${comicId}`;
    return cache.increment(key, amount);
  }

  /**
   * Get comic view count from cache
   */
  async getViewCount(comicId: number): Promise<number> {
    const key = `${CACHE_KEYS.VIEW_COUNT}comic:${comicId}`;
    const count = await cache.get<number>(key);
    return count || 0;
  }

  /**
   * Track chapter view
   */
  async incrementChapterViews(chapterId: number, amount = 1): Promise<number> {
    const key = `${CACHE_KEYS.VIEW_COUNT}chapter:${chapterId}`;
    return cache.increment(key, amount);
  }

  /**
   * Add comic to trending sorted set (by views)
   */
  async addToTrending(comicId: number, views: number): Promise<void> {
    const key = `${CACHE_KEYS.TRENDING}sorted`;
    await cache.addToSortedSet(key, views, comicId.toString());

    // Set expiry for trending data (7 days)
    await cache.setTTL(key, CACHE_TTL.WEEKLY);
  }

  /**
   * Get top trending comics from sorted set
   */
  async getTopTrending(limit = 10): Promise<number[]> {
    const key = `${CACHE_KEYS.TRENDING}sorted`;
    const results = await cache.getTopFromSortedSet(key, limit);
    return results.map((item) => parseInt(item.member));
  }

  /**
   * Cache user bookmarks
   */
  async getUserBookmarks<T>(userId: string, fetchFn: () => Promise<T>): Promise<T> {
    const key = `${CACHE_KEYS.USER_BOOKMARKS}${userId}`;
    return cache.getOrSet(key, fetchFn, {
      ttl: CACHE_TTL.SHORT,
      tags: [`user:${userId}`, "bookmarks"],
    });
  }

  /**
   * Invalidate user bookmarks cache
   */
  async invalidateUserBookmarks(userId: string): Promise<void> {
    await cache.delete(`${CACHE_KEYS.USER_BOOKMARKS}${userId}`);
    await cache.invalidateByTag(`user:${userId}`);
  }

  /**
   * Get comment count for a comic
   */
  async getCommentCount(comicId: number): Promise<number> {
    const key = `${CACHE_KEYS.COMMENT_COUNT}${comicId}`;
    const count = await cache.get<number>(key);
    return count || 0;
  }

  /**
   * Set comment count for a comic
   */
  async setCommentCount(comicId: number, count: number): Promise<void> {
    const key = `${CACHE_KEYS.COMMENT_COUNT}${comicId}`;
    await cache.set(key, count, { ttl: CACHE_TTL.SHORT });
  }

  /**
   * Increment comment count
   */
  async incrementCommentCount(comicId: number): Promise<number> {
    const key = `${CACHE_KEYS.COMMENT_COUNT}${comicId}`;
    return cache.increment(key, 1);
  }

  /**
   * Decrement comment count
   */
  async decrementCommentCount(comicId: number): Promise<number> {
    const key = `${CACHE_KEYS.COMMENT_COUNT}${comicId}`;
    return cache.decrement(key, 1);
  }

  /**
   * Warm cache with popular comics (pre-populate)
   */
  async warmCache(popularComics: Comic[]): Promise<void> {
    console.log(`🔥 Warming cache with ${popularComics.length} popular comics...`);

    const promises = popularComics.map((comic) => {
      const key = `${CACHE_KEYS.COMIC}${comic.id}`;
      return cache.set(key, comic, {
        ttl: CACHE_TTL.VERY_LONG,
        tags: ["comic", `comic:${comic.id}`, "popular"],
      });
    });

    await Promise.all(promises);
    console.log("✅ Cache warming completed");
  }

  /**
   * Get cache statistics for comics
   */
  async getComicCacheStats(): Promise<{
    comicsCached: number;
    chaptersCached: number;
    searchesCached: number;
  }> {
    const [comics, chapters, searches] = await Promise.all([
      cache.getKeys(`${CACHE_KEYS.COMIC}*`),
      cache.getKeys(`${CACHE_KEYS.CHAPTER}*`),
      cache.getKeys(`${CACHE_KEYS.SEARCH}*`),
    ]);

    return {
      comicsCached: comics.length,
      chaptersCached: chapters.length,
      searchesCached: searches.length,
    };
  }
}

// Export singleton instance
export const comicCache = new ComicCacheService();
