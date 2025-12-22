/**
 * TypeScript interfaces for Drizzle ORM models with relations
 * Provides strongly-typed query results for common patterns
 */

import type { InferSelectModel } from "drizzle-orm";

import type { chapter, comic, comicToGenre, comment, readingProgress, user } from "#schema";

// ═══════════════════════════════════════════════════════════════════════════
// BASE MODEL TYPES (Inferred from Schema)
// ═══════════════════════════════════════════════════════════════════════════

/** User model - Authentication and profile */
export type User = InferSelectModel<typeof user>;

/** Comic model - Comic metadata and information */
export type Comic = InferSelectModel<typeof comic>;

/** Chapter model - Individual comic chapter */
export type Chapter = InferSelectModel<typeof chapter>;

/** Comment model - User comments on chapters */
export type Comment = InferSelectModel<typeof comment>;

/** Reading Progress model - User progress tracking */
export type ReadingProgress = InferSelectModel<typeof readingProgress>;

/** ComicToGenre junction model - Comic-genre relation */
export type ComicToGenre = InferSelectModel<typeof comicToGenre>;

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSITE MODELS WITH RELATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Comic with all chapters
 * Used for fetching full comic with its chapters
 */
export interface ComicWithChapters extends Comic {
  chapters: Chapter[];
  genres?: { id: number; name: string }[];
  author?: {
    id: number;
    name: string;
    image: string | null;
  } | null;
  artist?: {
    id: number;
    name: string;
    image: string | null;
  } | null;
  type?: {
    id: number;
    name: string;
  } | null;
}

/**
 * Chapter with parent comic info
 * Used when fetching chapter details with comic context
 */
export interface ChapterWithComic extends Chapter {
  comic: Comic;
}

/**
 * User with reading statistics
 * Used for user dashboard and profile pages
 */
export interface UserWithStats extends User {
  stats: {
    totalChaptersRead: number;
    totalComicsStarted: number;
    totalComicsCompleted: number;
    bookmarkedCount: number;
    commentCount: number;
    totalReadingTime: number; // milliseconds
    averageReadingTime: number; // minutes per comic
  };
  recentlyRead?: Chapter[];
  bookmarks?: Comic[];
}

/**
 * Comic search result with relevance score
 * Used for search functionality and listings
 */
export interface ComicSearchResult extends Comic {
  relevanceScore?: number;
  authorName: string | null;
  artistName: string | null;
  typeName: string | null;
  genres: string[];
  matchContext?: {
    title: boolean;
    description: boolean;
    authorName: boolean;
    genres: boolean;
  };
}

/**
 * Chapter with comments
 * Used for chapter view page
 */
export interface ChapterWithComments extends Chapter {
  comic: Comic;
  comments: Array<Comment & { user: User }>;
  imageCount: number;
}

/**
 * Comic with reading progress
 * Used for resume reading / continue reading lists
 */
export interface ComicWithProgress extends Comic {
  readingProgress: ReadingProgress | null;
  latestChapter: Chapter | null;
  chapterCount: number;
}

/**
 * User bookmark entry with comic details
 * Used for user's bookmark/library page
 */
export interface UserBookmark {
  userId: string;
  comicId: number;
  comic: Comic;
  lastReadChapter?: Chapter | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  progress?: ReadingProgress | null;
}

/**
 * Full comic details for individual comic page
 * All related data in one interface
 */
export interface ComicDetails extends Comic {
  chapters: Chapter[];
  genres: Array<{ id: number; name: string }>;
  author: { id: number; name: string; bio: string | null; image: string | null } | null;
  artist: { id: number; name: string; bio: string | null; image: string | null } | null;
  type: { id: number; name: string } | null;
  totalChapters: number;
  userProgress?: ReadingProgress | null;
  isBookmarked?: boolean;
  commentCount: number;
}

/**
 * Dashboard comic summary for user dashboard
 * Minimal data for display in lists
 */
export interface ComicSummary {
  id: number;
  title: string;
  slug: string;
  coverImage: string;
  status: string;
  rating: string;
  authorName: string | null;
  latestChapter?: Chapter | null;
  userProgress?: {
    progressPercent: number;
    lastReadAt: Date;
  } | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// FILTER & QUERY OPTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Comic filter options for search and listing
 */
export interface ComicFilterOptions {
  search?: string;
  authorId?: number;
  artistId?: number;
  typeId?: number;
  genreIds?: number[];
  status?: string[];
  minRating?: number;
  sortBy?: "latest" | "popular" | "rating" | "title";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  limit: number;
  offset: number;
  total?: number;
  page?: number;
  pageSize?: number;
}

/**
 * Search options with full-text search support
 */
export interface SearchOptions extends PaginationOptions {
  query: string;
  filters?: ComicFilterOptions;
}

// ═══════════════════════════════════════════════════════════════════════════
// API RESPONSE TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Paginated list response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

/**
 * Search response with results and metadata
 */
export interface SearchResponse extends PaginatedResponse<ComicSearchResult> {
  query: string;
  executionTime: number;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: Date;
}

// ═══════════════════════════════════════════════════════════════════════════
// MUTATION TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Input type for creating a comic
 */
export interface CreateComicInput {
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  authorId?: number;
  artistId?: number;
  typeId?: number;
  genreIds?: number[];
  publicationDate: Date;
  status?: string;
}

/**
 * Input type for updating a comic
 */
export interface UpdateComicInput extends Partial<CreateComicInput> {
  id: number;
}

/**
 * Input type for creating a chapter
 */
export interface CreateChapterInput {
  comicId: number;
  title: string;
  slug: string;
  chapterNumber: number;
  releaseDate: Date;
}

/**
 * Input type for updating reading progress
 */
export interface UpdateReadingProgressInput {
  userId: string;
  comicId: number;
  chapterId: number;
  pageNumber: number;
  scrollPosition?: number;
  totalPages: number;
  progressPercent: number;
  completedAt?: Date;
}
