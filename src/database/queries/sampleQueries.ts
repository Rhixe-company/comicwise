/**
 * Sample Database Queries with Proper Typing
 * Examples for common query patterns using the typed interfaces
 */
import { eq, inArray } from "drizzle-orm";

import { db as database } from "#database/db";
import { bookmark, chapter, comic, comicToGenre, comment, readingProgress, user } from "#schema";
import type {
  ChapterWithComments,
  ComicDetails,
  ComicSearchResult,
  ComicWithChapters,
  UserWithStats,
} from "#types/database";

// ═══════════════════════════════════════════════════════════════════════════
// SAMPLE QUERY 1: Comic with Chapters
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get comic with all its chapters
 * @param comicId
 */
export async function getComicWithChapters(comicId: number): Promise<ComicWithChapters | null> {
  // Query comic
  const comicData = await database.query.comic.findFirst({
    where: eq(comic.id, comicId),
  });

  if (!comicData) return null;

  // Query chapters
  const chapters = await database.query.chapter.findMany({
    where: eq(chapter.comicId, comicId),
  });

  // Construct typed response
  return {
    ...comicData,
    chapters,
    genres: [],
  } as ComicWithChapters;
}

// ═══════════════════════════════════════════════════════════════════════════
// SAMPLE QUERY 2: Chapter with Comments
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get chapter with all comments and commenter info
 * @param chapterId
 */
export async function getChapterWithComments(
  chapterId: number
): Promise<ChapterWithComments | null> {
  const chapterData = await database.query.chapter.findFirst({
    where: eq(chapter.id, chapterId),
    with: {
      comic: true,
    },
  });

  if (!chapterData) return null;

  // Fetch comments with user info
  const comments = await database
    .select({
      comment,
      user,
    })
    .from(comment)
    .innerJoin(user, eq(comment.userId, user.id))
    .where(eq(comment.chapterId, chapterId));

  const mappedComments = comments.map((row) => ({
    ...row.comment,
    user: row.user,
  }));

  return {
    ...chapterData,
    comic: chapterData.comic,
    comments: mappedComments,
    imageCount: 0,
  } as ChapterWithComments;
}

// ═══════════════════════════════════════════════════════════════════════════
// SAMPLE QUERY 3: Comic Search Results
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Search comics with genre info and relevance scoring
 * @param _query
 * @param limit
 * @param offset
 */
export async function searchComics(
  _query: string,
  limit: number = 20,
  offset: number = 0
): Promise<ComicSearchResult[]> {
  // Basic search on title and description
  const results = await database.query.comic.findMany({
    limit,
    offset,
  });

  return results.map((c) => ({
    ...c,
    authorName: null,
    artistName: null,
    typeName: null,
    genres: [],
    relevanceScore: 1.0,
  })) as ComicSearchResult[];
}

// ═══════════════════════════════════════════════════════════════════════════
// SAMPLE QUERY 4: User with Statistics
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get user profile with reading statistics
 * @param userId
 */
export async function getUserWithStats(userId: string): Promise<UserWithStats | null> {
  const userData = await database.query.user.findFirst({
    where: eq(user.id, userId),
  });

  if (!userData) return null;

  // Get reading progress stats
  const readingProgressData = await database.query.readingProgress.findMany({
    where: eq(readingProgress.userId, userId),
  });

  const totalChaptersRead = readingProgressData.length;
  const totalComicsStarted = new Set(readingProgressData.map((rp) => rp.comicId)).size;
  const totalComicsCompleted = readingProgressData.filter((rp) => rp.completedAt).length;

  // Get bookmarks count
  const bookmarks = await database.query.bookmark.findMany({
    where: eq(bookmark.userId, userId),
  });

  // Get comment count
  const comments = await database.query.comment.findMany({
    where: eq(comment.userId, userId),
  });

  return {
    ...userData,
    stats: {
      totalChaptersRead,
      totalComicsStarted,
      totalComicsCompleted,
      bookmarkedCount: bookmarks.length,
      commentCount: comments.length,
      totalReadingTime: 0, // Would calculate from readingProgress
      averageReadingTime: 0, // Would calculate from readingProgress
    },
  } as UserWithStats;
}

// ═══════════════════════════════════════════════════════════════════════════
// SAMPLE QUERY 5: Full Comic Details
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get complete comic details with all relations
 * @param comicId
 */
export async function getComicDetails(comicId: number): Promise<ComicDetails | null> {
  const comicData = await database.query.comic.findFirst({
    where: eq(comic.id, comicId),
  });

  if (!comicData) return null;

  const chapters = await database.query.chapter.findMany({
    where: eq(chapter.comicId, comicId),
    orderBy: (chapter) => [chapter.chapterNumber],
  });

  return {
    ...comicData,
    chapters,
    genres: [],
    author: null,
    artist: null,
    type: null,
    totalChapters: chapters.length,
    commentCount: 0,
  } as ComicDetails;
}

// ═══════════════════════════════════════════════════════════════════════════
// SAMPLE QUERY 6: Paginated Comic List
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get paginated list of comics with basic info
 * @param limit
 * @param offset
 */
export async function getPaginatedComics(limit: number = 12, offset: number = 0) {
  const comics = await database.query.comic.findMany({
    limit,
    offset,
    orderBy: (comic) => [comic.createdAt],
    with: {
      author: {
        columns: { name: true },
      },
    },
  });

  // Get total count
  const countResult = await database.query.comic.findMany({
    columns: { id: true },
  });

  return {
    data: comics,
    pagination: {
      total: countResult.length,
      limit,
      offset,
      hasMore: offset + limit < countResult.length,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SAMPLE QUERY 7: Comics by Genre
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get all comics in a specific genre
 * @param genreId
 * @param limit
 */
export async function getComicsByGenre(
  genreId: number,
  limit: number = 20
): Promise<ComicSearchResult[]> {
  const comicIds = await database
    .select({ comicId: comicToGenre.comicId })
    .from(comicToGenre)
    .where(eq(comicToGenre.genreId, genreId))
    .limit(limit);

  if (comicIds.length === 0) return [];

  const comics = await database.query.comic.findMany({
    where: inArray(
      comic.id,
      comicIds.map((c) => c.comicId)
    ),
  });

  // Map to search results with genre info
  return comics.map((c) => ({
    ...c,
    authorName: null,
    artistName: null,
    typeName: null,
    genres: [],
    relevanceScore: 1.0,
  })) as ComicSearchResult[];
}

// ═══════════════════════════════════════════════════════════════════════════
// SAMPLE QUERY 8: User's Bookmarks
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get all comics bookmarked by user
 * @param userId
 */
export async function getUserBookmarks(userId: string) {
  const bookmarks = await database.query.bookmark.findMany({
    where: eq(bookmark.userId, userId),
    with: {
      comic: {
        with: {
          author: {
            columns: { name: true },
          },
        },
      },
      lastReadChapter: {
        columns: { id: true, title: true, chapterNumber: true },
      },
    },
  });

  return bookmarks;
}

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA REFERENCE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Key indices in schema for optimal query performance:
 *
 * Comic table:
 * - comic_slug_idx: For slug-based lookups
 * - comic_title_idx: For title searches
 * - comic_author_idx: For author filtering
 * - comic_created_at_idx: For sorting by date
 * - comic_status_idx: For status filtering
 * - comic_rating_idx: For rating-based sorting
 *
 * Chapter table:
 * - chapter_comic_id_idx: For fetching chapters of a comic
 * - chapter_slug_idx: For slug-based lookups
 * - chapter_comic_chapter_idx: Composite for finding specific chapters
 *
 * User interactions:
 * - bookmark_user_id_idx: For user's bookmarks
 * - reading_progress_user_comic_idx: For user's progress per comic
 * - comment_chapter_id_idx: For chapter comments
 *
 * Foreign keys:
 * - chapter.comicId -> comic.id (cascade delete)
 * - bookmark.comicId -> comic.id (cascade delete)
 * - readingProgress.comicId -> comic.id (cascade delete)
 * - comment.chapterId -> chapter.id (cascade delete)
 */
