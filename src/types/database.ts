// ═══════════════════════════════════════════════════
// DATABASE TYPES & SCHEMAS (Next.js 16 Optimized)
// ═══════════════════════════════════════════════════

import type {
  account,
  artist,
  authenticator,
  author,
  bookmark,
  chapter,
  chapterImage,
  comic,
  comicImage,
  comicToGenre,
  type as comicType,
  comment,
  genre,
  passwordResetToken,
  readingProgress,
  session,
  user,
  verificationToken,
} from "@/database/schema";

// ═══════════════════════════════════════════════════
// TABLE TYPES (Inferred from Drizzle Schema)
// ═══════════════════════════════════════════════════

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;

export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

export type VerificationToken = typeof verificationToken.$inferSelect;
export type NewVerificationToken = typeof verificationToken.$inferInsert;

export type Authenticator = typeof authenticator.$inferSelect;
export type NewAuthenticator = typeof authenticator.$inferInsert;

export type PasswordResetToken = typeof passwordResetToken.$inferSelect;
export type NewPasswordResetToken = typeof passwordResetToken.$inferInsert;

export type Comic = typeof comic.$inferSelect;
export type NewComic = typeof comic.$inferInsert;

export type Chapter = typeof chapter.$inferSelect;
export type NewChapter = typeof chapter.$inferInsert;

export type ComicImage = typeof comicImage.$inferSelect;
export type NewComicImage = typeof comicImage.$inferInsert;

export type ChapterImage = typeof chapterImage.$inferSelect;
export type NewChapterImage = typeof chapterImage.$inferInsert;

export type Genre = typeof genre.$inferSelect;
export type NewGenre = typeof genre.$inferInsert;

export type ComicType = typeof comicType.$inferSelect;
export type NewComicType = typeof comicType.$inferInsert;

export type Author = typeof author.$inferSelect;
export type NewAuthor = typeof author.$inferInsert;

export type Artist = typeof artist.$inferSelect;
export type NewArtist = typeof artist.$inferInsert;

export type Bookmark = typeof bookmark.$inferSelect;
export type NewBookmark = typeof bookmark.$inferInsert;

export type Comment = typeof comment.$inferSelect;
export type NewComment = typeof comment.$inferInsert;

export type ComicToGenre = typeof comicToGenre.$inferSelect;
export type NewComicToGenre = typeof comicToGenre.$inferInsert;

// ═══════════════════════════════════════════════════
// ENHANCED TYPES WITH RELATIONS
// ═══════════════════════════════════════════════════

export interface ComicWithRelations extends Comic {
  author?: Author | null;
  artist?: Artist | null;
  type?: ComicType | null;
  genres?: Genre[];
  chapters?: Chapter[];
  bookmarks?: Bookmark[];
  images?: ComicImage[];
  _count?: {
    chapters: number;
    bookmarks: number;
    comments: number;
  };
}

// Alias for compatibility
export type ComicWithDetails = ComicWithRelations;

export interface ChapterWithRelations extends Chapter {
  comic?: Comic;
  images?: ChapterImage[];
  comments?: Comment[];
  _count?: {
    comments: number;
  };
}

export interface UserWithRelations extends User {
  bookmarks?: Bookmark[];
  comments?: Comment[];
  accounts?: Account[];
  sessions?: Session[];
  _count?: {
    bookmarks: number;
    comments: number;
  };
}

export interface CommentWithRelations extends Comment {
  user?: User;
  chapter?: Chapter;
}

export interface BookmarkWithRelations extends Bookmark {
  user?: User;
  comic?: ComicWithRelations;
  lastReadChapter?: Chapter | null;
}

export type ReadingProgress = typeof readingProgress.$inferSelect;
export type NewReadingProgress = typeof readingProgress.$inferInsert;

export interface ReadingProgressWithRelations extends ReadingProgress {
  user?: User;
  comic?: Comic;
  chapter?: Chapter;
}

export interface GenreWithComics extends Genre {
  comics?: Comic[];
  _count?: {
    comics: number;
  };
}

export interface AuthorWithComics extends Author {
  comics?: Comic[];
  _count?: {
    comics: number;
  };
}

export interface ArtistWithComics extends Artist {
  comics?: Comic[];
  _count?: {
    comics: number;
  };
}

// ═══════════════════════════════════════════════════
// FILTER & PAGINATION TYPES
// ═══════════════════════════════════════════════════

// ═══════════════════════════════════════════════════
// FILTER & PAGINATION TYPES
// ═══════════════════════════════════════════════════

export interface PaginationParameters {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
  hasPrevious: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  // Preferred name for pagination metadata
  meta: PaginationMeta;
  // Backwards-compatible alias used across the codebase
  pagination: PaginationMeta;
}

export interface ComicFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: Comic["status"];
  genreIds?: number[];
  typeId?: number;
  authorId?: number;
  artistId?: number;
  minRating?: number;
  sortBy?: "title" | "rating" | "views" | "publicationDate" | "createdAt" | "latest";
  sortOrder?: "asc" | "desc";
}

// ═══════════════════════════════════════════════════
// SAMPLE QUERY TYPES (for queries.sample.ts)
// ═══════════════════════════════════════════════════

export interface ComicSearchResult {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  status: Comic["status"];
  rating: string | null;
  views: number;
  author?: {
    id: number;
    name: string;
  } | null;
  artist?: {
    id: number;
    name: string;
  } | null;
  type?: {
    id: number;
    name: string;
  } | null;
}

export interface ComicWithChapters extends Comic {
  chapters: Chapter[];
}

export interface ChapterWithComic extends Chapter {
  comic: Comic | null;
}

export interface CreateComicPayload {
  title: string;
  slug: string;
  description: string;
  coverImage: string | null;
  status?: Comic["status"];
  publicationDate: Date | string;
  rating?: string;
  authorId?: number | null;
  artistId?: number | null;
  typeId?: number | null;
  genres?: number[];
}

export interface ChapterFilters {
  comicId?: number;
  search?: string;
  sortBy?: "chapterNumber" | "releaseDate" | "views";
  sortOrder?: "asc" | "desc";
}

export interface UserFilters {
  search?: string;
  role?: User["role"];
  sortBy?: "name" | "email" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface CommentFilters {
  chapterId?: number;
  userId?: string;
  search?: string;
  sortBy?: "createdAt";
  sortOrder?: "asc" | "desc";
}

// ═══════════════════════════════════════════════════
// FORM & VALIDATION TYPES
// ═══════════════════════════════════════════════════

export interface ComicFormData {
  title: string;
  description: string;
  coverImage: string;
  status: Comic["status"];
  publicationDate: Date | string;
  authorId?: number;
  artistId?: number;
  typeId?: number;
  genreIds: number[];
}

export interface ChapterFormData {
  title: string;
  chapterNumber: number;
  releaseDate: Date | string;
  comicId: number;
  images: Array<{
    imageUrl: string;
    pageNumber: number;
  }>;
}

export interface UserFormData {
  name?: string;
  email: string;
  password?: string;
  role?: User["role"];
  image?: string;
}

export interface GenreFormData {
  name: string;
  description?: string;
}

export interface AuthorFormData {
  name: string;
  bio?: string;
  image?: string;
}

export interface ArtistFormData {
  name: string;
  bio?: string;
  image?: string;
}

export interface ComicTypeFormData {
  name: string;
  description?: string;
}

export interface CommentFormData {
  content: string;
  chapterId: number;
  userId: string;
}

export interface BookmarkFormData {
  comicId: number;
  userId: string;
  lastReadChapterId?: number;
  notes?: string;
}

// ═══════════════════════════════════════════════════
// API RESPONSE TYPES
// ═══════════════════════════════════════════════════

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
}

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

// ═══════════════════════════════════════════════════
// SEARCH & AUTOCOMPLETE TYPES
// ═══════════════════════════════════════════════════

export interface SearchResult<T> {
  results: T[];
  total: number;
  query: string;
}

export interface AutocompleteOption {
  id: number | string;
  label: string;
  value: string;
  image?: string;
  metadata?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════
// STATISTICS & ANALYTICS TYPES
// ═══════════════════════════════════════════════════

export interface ComicStats {
  totalComics: number;
  totalChapters: number;
  totalViews: number;
  totalBookmarks: number;
  totalComments: number;
  averageRating: number;
  comicsByStatus: Record<Comic["status"], number>;
  comicsByGenre: Array<{ genre: string; count: number }>;
  topComics: ComicWithRelations[];
  recentComics: ComicWithRelations[];
}

export interface UserStats {
  totalUsers: number;
  usersByRole: Record<User["role"], number>;
  recentUsers: User[];
  activeUsers: User[];
}

export interface DashboardStats {
  comics: ComicStats;
  users: UserStats;
  recentActivity: Array<{
    type: "comment" | "bookmark" | "comic" | "chapter";
    id: number | string;
    title: string;
    user?: string;
    timestamp: Date;
  }>;
}

// ═══════════════════════════════════════════════════
// NOTE: All types are already exported via 'export type'
// declarations above. No need for duplicate exports.
// ═══════════════════════════════════════════════════
