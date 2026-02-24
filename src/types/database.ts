// ═══════════════════════════════════════════════════
// DATABASE TYPES - Single Source of Truth
// ═══════════════════════════════════════════════════
// All database types, relations, and filters in one place

import type * as schema from "@/database/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

// ═══════════════════════════════════════════════════
// BASE MODELS (Select & Insert)
// ═══════════════════════════════════════════════════

// User & Auth
export type User = InferSelectModel<typeof schema.user>;
export type InsertUser = InferInsertModel<typeof schema.user>;
export type Account = InferSelectModel<typeof schema.account>;
export type InsertAccount = InferInsertModel<typeof schema.account>;
export type Session = InferSelectModel<typeof schema.session>;
export type InsertSession = InferInsertModel<typeof schema.session>;
export type VerificationToken = InferSelectModel<typeof schema.verificationToken>;
export type InsertVerificationToken = InferInsertModel<typeof schema.verificationToken>;
export type Authenticator = InferSelectModel<typeof schema.authenticator>;
export type InsertAuthenticator = InferInsertModel<typeof schema.authenticator>;
export type PasswordResetToken = InferSelectModel<typeof schema.passwordResetToken>;
export type InsertPasswordResetToken = InferInsertModel<typeof schema.passwordResetToken>;

// Content Metadata
export type Author = InferSelectModel<typeof schema.author>;
export type InsertAuthor = InferInsertModel<typeof schema.author>;
export type Artist = InferSelectModel<typeof schema.artist>;
export type InsertArtist = InferInsertModel<typeof schema.artist>;
export type Genre = InferSelectModel<typeof schema.genre>;
export type InsertGenre = InferInsertModel<typeof schema.genre>;
export type Type = InferSelectModel<typeof schema.type>;
export type InsertType = InferInsertModel<typeof schema.type>;

// Core Content
export type Comic = InferSelectModel<typeof schema.comic>;
export type InsertComic = InferInsertModel<typeof schema.comic>;
export type Chapter = InferSelectModel<typeof schema.chapter>;
export type InsertChapter = InferInsertModel<typeof schema.chapter>;
export type ComicImage = InferSelectModel<typeof schema.comicImage>;
export type InsertComicImage = InferInsertModel<typeof schema.comicImage>;
export type ChapterImage = InferSelectModel<typeof schema.chapterImage>;
export type InsertChapterImage = InferInsertModel<typeof schema.chapterImage>;
export type ComicToGenre = InferSelectModel<typeof schema.comicToGenre>;
export type InsertComicToGenre = InferInsertModel<typeof schema.comicToGenre>;

// User Interactions
export type Bookmark = InferSelectModel<typeof schema.bookmark>;
export type InsertBookmark = InferInsertModel<typeof schema.bookmark>;
export type Comment = InferSelectModel<typeof schema.comment>;
export type InsertComment = InferInsertModel<typeof schema.comment>;
export type ReadingProgress = InferSelectModel<typeof schema.readingProgress>;
export type InsertReadingProgress = InferInsertModel<typeof schema.readingProgress>;

// ═══════════════════════════════════════════════════
// ENUMS
// ═══════════════════════════════════════════════════

export type UserRole = (typeof schema.userRole.enumValues)[number];
export type ComicStatus = (typeof schema.comicStatus.enumValues)[number];

// ═══════════════════════════════════════════════════
// RELATIONS (With Relations Pattern)
// ═══════════════════════════════════════════════════

export type ComicWithRelations = Comic & {
  artist?: Artist | null;
  artistName?: null | string;
  author?: Author | null;
  authorName?: null | string;
  chapters?: Chapter[];
  genres?: Genre[];
  images?: ComicImage[];
  type?: null | Type;
  typeName?: null | string;
};

export type ChapterWithRelations = Chapter & {
  comic?: Comic;
  images?: ChapterImage[];
};

export type UserWithRelations = User & {
  bookmarks?: Bookmark[];
  comments?: Comment[];
  readingProgress?: ReadingProgress[];
};

export type BookmarkWithRelations = Bookmark & {
  comic?: Comic;
  lastReadChapter?: Chapter | null;
  user?: User;
};

export type CommentWithRelations = Comment & {
  chapter?: Chapter;
  user?: User;
};

export type ReadingProgressWithRelations = ReadingProgress & {
  chapter?: Chapter;
  comic?: Comic;
  user?: User;
};

// ═══════════════════════════════════════════════════
// SPECIALIZED VIEWS (Use ComicWithRelations as base)
// ═══════════════════════════════════════════════════

// ComicWithDetails is an alias for ComicWithRelations
export type ComicWithDetails = ComicWithRelations;

// Partial views for specific use cases
export type ComicWithChapters = Pick<ComicWithRelations, "chapters" | keyof Comic>;
export type ComicSearchResult = Pick<
  ComicWithRelations,
  "artist" | "author" | "genres" | "type" | keyof Comic
>;
export type ChapterWithComments = Chapter & { comments?: Comment[] };
export type UserWithStats = User & {
  bookmarkCount?: number;
  commentCount?: number;
  readingProgressCount?: number;
};

// ═══════════════════════════════════════════════════
// FILTERS & QUERIES
// ═══════════════════════════════════════════════════

export interface ComicFilters {
  artistId?: number;
  authorId?: number;
  genreIds?: number[];
  limit?: number;
  maxRating?: number;
  minRating?: number;
  page?: number;
  published?: boolean;
  search?: string;
  sortBy?: "latest" | "rating" | "title" | "views";
  status?: ComicStatus;
  typeId?: number;
}

// ═══════════════════════════════════════════════════
// FORM INPUT TYPES (Using Omit pattern)
// ═══════════════════════════════════════════════════

export type CreateComicInput = Omit<
  InsertComic,
  "createdAt" | "id" | "rating" | "updatedAt" | "views"
>;
export type UpdateComicInput = Partial<CreateComicInput> & { id: number };

export type CreateChapterInput = Omit<InsertChapter, "createdAt" | "id" | "views">;
export type UpdateChapterInput = Partial<CreateChapterInput> & { id: number };

export type CreateUserInput = Omit<InsertUser, "createdAt" | "emailVerified" | "id" | "updatedAt">;
export type UpdateUserInput = Partial<CreateUserInput> & { id: string };

export type CreateAuthorInput = Omit<InsertAuthor, "createdAt" | "id" | "search_vector">;
export type UpdateAuthorInput = Partial<CreateAuthorInput> & { id: number };

export type CreateArtistInput = Omit<InsertArtist, "createdAt" | "id" | "search_vector">;
export type UpdateArtistInput = Partial<CreateArtistInput> & { id: number };

export type CreateGenreInput = Omit<InsertGenre, "createdAt" | "id">;
export type UpdateGenreInput = Partial<CreateGenreInput> & { id: number };

export type CreateTypeInput = Omit<InsertType, "createdAt" | "id">;
export type UpdateTypeInput = Partial<CreateTypeInput> & { id: number };

export type CreateCommentInput = Omit<InsertComment, "createdAt" | "id" | "updatedAt">;
export type UpdateCommentInput = Partial<Omit<CreateCommentInput, "chapterId" | "userId">> & {
  id: number;
};

export type CreateBookmarkInput = Omit<InsertBookmark, "createdAt" | "updatedAt">;
export type UpdateBookmarkInput = Partial<Omit<CreateBookmarkInput, "comicId" | "userId">>;

export type CreateReadingProgressInput = Omit<
  InsertReadingProgress,
  "createdAt" | "id" | "lastReadAt" | "updatedAt"
>;
export type UpdateReadingProgressInput = Partial<
  Omit<CreateReadingProgressInput, "comicId" | "userId">
> & { id: number };
