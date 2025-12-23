// ═══════════════════════════════════════════════════
// CORE TYPES - ComicWise
// ═══════════════════════════════════════════════════

import type * as schema from "#schema";
import type { InferSelectModel } from "drizzle-orm";

// ═══════════════════════════════════════════════════
// DATABASE MODELS (from schema)
// ═══════════════════════════════════════════════════

export type User = InferSelectModel<typeof schema.user>;
export type Account = InferSelectModel<typeof schema.account>;
export type Session = InferSelectModel<typeof schema.session>;
export type VerificationToken = InferSelectModel<typeof schema.verificationToken>;
export type Authenticator = InferSelectModel<typeof schema.authenticator>;
export type PasswordResetToken = InferSelectModel<typeof schema.passwordResetToken>;

export type Comic = InferSelectModel<typeof schema.comic>;
export type Chapter = InferSelectModel<typeof schema.chapter>;
export type ChapterImage = InferSelectModel<typeof schema.chapterImage>;
export type ComicImage = InferSelectModel<typeof schema.comicImage>;

export type Author = InferSelectModel<typeof schema.author>;
export type Artist = InferSelectModel<typeof schema.artist>;
export type Genre = InferSelectModel<typeof schema.genre>;
export type Type = InferSelectModel<typeof schema.type>;

export type Bookmark = InferSelectModel<typeof schema.bookmark>;
export type Comment = InferSelectModel<typeof schema.comment>;
export type ReadingProgress = InferSelectModel<typeof schema.readingProgress>;
export type ComicToGenre = InferSelectModel<typeof schema.comicToGenre>;

// ═══════════════════════════════════════════════════
// ENUMS
// ═══════════════════════════════════════════════════

export type UserRole = "user" | "admin" | "moderator";
export type ComicStatus = "Ongoing" | "Hiatus" | "Completed" | "Dropped" | "Coming Soon";

// ═══════════════════════════════════════════════════
// RELATIONS & EXTENDED TYPES
// ═══════════════════════════════════════════════════

export interface ComicWithRelations extends Comic {
  author?: Author | null;
  artist?: Artist | null;
  type?: Type | null;
  genres?: Genre[];
  chapters?: Chapter[];
  images?: ComicImage[];
  _count?: {
    chapters: number;
    bookmarks: number;
    comments: number;
  };
}

export interface ChapterWithRelations extends Chapter {
  comic?: Comic | null;
  images?: ChapterImage[];
  _count?: {
    images: number;
    comments: number;
  };
}

export interface UserWithRelations extends User {
  bookmarks?: Bookmark[];
  comments?: Comment[];
  readingProgress?: ReadingProgress[];
  _count?: {
    bookmarks: number;
    comments: number;
  };
}

export interface BookmarkWithRelations extends Bookmark {
  user?: User | null;
  comic?: ComicWithRelations | null;
  lastReadChapter?: Chapter | null;
}

export interface CommentWithRelations extends Comment {
  user?: User | null;
  chapter?: Chapter | null;
}

export interface ReadingProgressWithRelations extends ReadingProgress {
  user?: User | null;
  comic?: Comic | null;
  chapter?: Chapter | null;
}

// ═══════════════════════════════════════════════════
// INSERT TYPES (for creation)
// ═══════════════════════════════════════════════════

export type InsertUser = typeof schema.user.$inferInsert;
export type InsertComic = typeof schema.comic.$inferInsert;
export type InsertChapter = typeof schema.chapter.$inferInsert;
export type InsertAuthor = typeof schema.author.$inferInsert;
export type InsertArtist = typeof schema.artist.$inferInsert;
export type InsertGenre = typeof schema.genre.$inferInsert;
export type InsertType = typeof schema.type.$inferInsert;
export type InsertBookmark = typeof schema.bookmark.$inferInsert;
export type InsertComment = typeof schema.comment.$inferInsert;
export type InsertReadingProgress = typeof schema.readingProgress.$inferInsert;
export type InsertChapterImage = typeof schema.chapterImage.$inferInsert;
export type InsertComicImage = typeof schema.comicImage.$inferInsert;

// ═══════════════════════════════════════════════════
// PAGINATION & FILTERING
// ═══════════════════════════════════════════════════

export interface PaginationParameters {
  page?: number;
  pageSize?: number;
  limit?: number;
  offset?: number;
}

export interface SortParameters {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ComicFilters extends PaginationParameters, SortParameters {
  search?: string;
  status?: ComicStatus;
  genreIds?: number[];
  authorId?: number;
  artistId?: number;
  typeId?: number;
  minRating?: number;
  maxRating?: number;
}
/**
 * Filter parameters
 */
export interface FilterParameters {
  [key: string]: string | number | boolean | string[] | number[] | undefined;
}
/**
 * Search parameters
 */
export interface SearchParameters extends PaginationParameters, SortParameters, FilterParameters {
  q?: string;
  query?: string;
}
export interface ChapterFilters extends PaginationParameters, SortParameters {
  comicId?: number;
  search?: string;
  minChapterNumber?: number;
  maxChapterNumber?: number;
}

// ═══════════════════════════════════════════════════
// FORM DATA TYPES
// ═══════════════════════════════════════════════════

// export interface ComicFormData {
//   title: string;
//   slug: string;
//   description: string;
//   coverImage: string;
//   status: ComicStatus;
//   publicationDate: Date;
//   authorId?: number;
//   artistId?: number;
//   typeId?: number;
//   genreIds?: number[];
// }

// export interface ChapterFormData {
//   title: string;
//   slug: string;
//   chapterNumber: number;
//   releaseDate: Date;
//   comicId: number;
//   images?: string[];
// }

// export interface UserFormData {
//   name?: string;
//   email: string;
//   password?: string;
//   role?: UserRole;
//   image?: string;
// }

// ═══════════════════════════════════════════════════
// API RESPONSE TYPES
// ═══════════════════════════════════════════════════

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  message?: string;
}

// ═══════════════════════════════════════════════════
// UTILITY TYPES
// ═══════════════════════════════════════════════════

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type StrictPick<T, K extends keyof T> = Pick<T, K>;
