/**
 * Database Type Definitions
 * TypeScript interfaces for database queries with proper typing
 */

import type {
  artist,
  author,
  chapter,
  chapterImage,
  comic,
  comicImage,
  comicToGenre,
  genre,
  type as typeTable,
  user,
} from "@/database/schema";
import type { InferSelectModel } from "drizzle-orm";

// ═══════════════════════════════════════════════════════════════════════════
// BASE MODEL TYPES (Direct from Drizzle)
// ═══════════════════════════════════════════════════════════════════════════

export type ComicModel = InferSelectModel<typeof comic>;
export type ChapterModel = InferSelectModel<typeof chapter>;
export type GenreModel = InferSelectModel<typeof genre>;
export type AuthorModel = InferSelectModel<typeof author>;
export type ArtistModel = InferSelectModel<typeof artist>;
export type TypeModel = InferSelectModel<typeof typeTable>;
export type UserModel = InferSelectModel<typeof user>;
export type ComicImageModel = InferSelectModel<typeof comicImage>;
export type ChapterImageModel = InferSelectModel<typeof chapterImage>;
export type ComicToGenreModel = InferSelectModel<typeof comicToGenre>;

// ═══════════════════════════════════════════════════════════════════════════
// RELATION TYPES (With Related Records)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Comic with all related data
 * Includes: chapters, genres, author, artist, images
 */
export interface ComicWithRelations extends ComicModel {
  artist?: ArtistModel | null;
  author?: AuthorModel | null;
  chapters?: ChapterModel[];
  genres?: GenreModel[];
  images?: ComicImageModel[];
  type?: null | TypeModel;
}

/**
 * Comic with chapters only
 */
export interface ComicWithChapters extends ComicModel {
  chapters: ChapterModel[];
}

/**
 * Chapter with comic and images
 */
export interface ChapterWithRelations extends ChapterModel {
  comic: ComicModel;
  images?: ChapterImageModel[];
}

/**
 * Chapter with comic reference only
 */
export interface ChapterWithComic extends ChapterModel {
  comic: ComicModel;
}

/**
 * Comic for search results
 * Lightweight version for search/list queries
 */
export interface ComicSearchResult {
  artist?: { id: number; name: string } | null;
  author?: { id: number; name: string } | null;
  coverImage: string;
  description: string;
  genres?: { id: number; name: string }[];
  id: number;
  rating: null | string;
  slug: string;
  status: "Coming Soon" | "Completed" | "Dropped" | "Hiatus" | "Ongoing";
  title: string;
  type?: { id: number; name: string } | null;
  views: number;
}

/**
 * User with reading statistics
 */
export interface UserWithStats extends UserModel {
  stats?: {
    bookmarkedCount: number;
    ratingsCount: number;
    totalChaptersRead: number;
    totalComicsRead: number;
  };
}

/**
 * Genre with comic count
 */
export interface GenreWithCount extends GenreModel {
  comicCount?: number;
}

/**
 * Author with comic count
 */
export interface AuthorWithCount extends AuthorModel {
  comicCount?: number;
}

/**
 * Artist with comic count
 */
export interface ArtistWithCount extends ArtistModel {
  comicCount?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGINATION & LIST TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    hasNext: boolean;
    hasPrev: boolean;
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Cursor-based paginated response
 */
export interface CursorPaginatedResponse<T> {
  data: T[];
  pagination: {
    cursor?: string;
    hasMore: boolean;
    total: number;
  };
}

/**
 * List query options
 */
export interface ListOptions {
  cursor?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ═══════════════════════════════════════════════════════════════════════════
// CREATE/UPDATE TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Comic creation payload
 */
export interface CreateComicPayload {
  artistId?: null | number;
  authorId?: null | number;
  coverImage: string;
  description: string;
  genres?: number[];
  publicationDate: Date;
  rating?: string;
  slug: string;
  status?: "Coming Soon" | "Completed" | "Dropped" | "Hiatus" | "Ongoing";
  title: string;
  typeId?: null | number;
}

/**
 * Comic update payload
 */
export interface UpdateComicPayload extends Partial<CreateComicPayload> {
  id: number;
}

/**
 * Chapter creation payload
 */
export interface CreateChapterPayload {
  chapterNumber: number;
  comicId: number;
  images?: { imageUrl: string; pageNumber: number }[];
  releaseDate: Date;
  slug: string;
  title: string;
}

/**
 * Chapter update payload
 */
export interface UpdateChapterPayload extends Partial<CreateChapterPayload> {
  id: number;
}

/**
 * Author creation payload
 */
export interface CreateAuthorPayload {
  bio?: string;
  image?: string;
  name: string;
}

/**
 * Artist creation payload
 */
export interface CreateArtistPayload {
  bio?: string;
  image?: string;
  name: string;
}

/**
 * Genre creation payload
 */
export interface CreateGenrePayload {
  description?: string;
  name: string;
}

/**
 * Type creation payload
 */
export interface CreateTypePayload {
  description?: string;
  name: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// FILTER TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Comic filter options
 */
export interface ComicFilters {
  artistId?: number;
  authorId?: number;
  genreIds?: number[];
  maxRating?: number;
  minRating?: number;
  published?: boolean;
  search?: string;
  status?: "Coming Soon" | "Completed" | "Dropped" | "Hiatus" | "Ongoing";
  typeId?: number;
}

/**
 * Chapter filter options
 */
export interface ChapterFilters {
  comicId?: number;
  maxChapterNumber?: number;
  minChapterNumber?: number;
  search?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// API RESPONSE TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Standard API response
 */
export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  metadata?: Record<string, unknown>;
  success: boolean;
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    details?: Record<string, unknown>;
    message: string;
  };
  success: false;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT ALL TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type {
  ArtistModel,
  AuthorModel,
  ChapterImageModel,
  ChapterModel,
  ComicImageModel,
  ComicModel,
  ComicToGenreModel,
  GenreModel,
  TypeModel,
  UserModel,
};
