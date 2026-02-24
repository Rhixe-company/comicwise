// ═══════════════════════════════════════════════════════════════════════════
// DATABASE RELATION TYPES (Drizzle ORM Inferred Types)
// ═══════════════════════════════════════════════════════════════════════════

import type {
  Artist,
  Author,
  Bookmark,
  Chapter,
  ChapterImage,
  Comic,
  ComicImage,
  ComicType,
  Comment,
  Genre,
  ReadingProgress,
  User,
} from "@/types/database";

// ═══════════════════════════════════════════════════════════════════════════
// COMIC RELATION TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Comic with all related data
 * Includes chapters, genres, author, artist, type, and images
 */
export interface ComicWithChapters extends Comic {
  artist?: Artist | null;
  author?: Author | null;
  chapters: Chapter[];
  genres?: Genre[];
  images?: ComicImage[];
  type?: ComicType | null;
}

/**
 * Comic with search metadata
 * Optimized for search result pages
 */
export interface ComicSearchResult {
  artistName?: null | string;
  authorName?: null | string;
  chapterCount?: number;
  coverImage: string;
  createdAt: Date;
  description: string;
  genreCount?: number;
  id: number;
  rating: null | string;
  slug: string;
  status: Comic["status"];
  title: string;
  typeName?: null | string;
  views: number;
}

/**
 * Comic with brief info and stats
 * For lists and cards
 */
export interface ComicListItem {
  authorName?: null | string;
  chapterCount: number;
  coverImage: string;
  createdAt: Date;
  id: number;
  rating: null | string;
  slug: string;
  status: Comic["status"];
  title: string;
  views: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER RELATION TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Chapter with related comic
 */
export interface ChapterWithComic extends Chapter {
  comic: Comic;
  commentCount?: number;
  comments?: Comment[];
  images?: ChapterImage[];
}

/**
 * Chapter with full context
 * Includes comic, images, and comments
 */
export interface ChapterWithContext extends Chapter {
  comic: Comic & {
    artist?: Artist | null;
    author?: Author | null;
    type?: ComicType | null;
  };
  comments: CommentWithUser[];
  images: ChapterImage[];
  totalComments: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// USER RELATION TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * User with statistics
 * Includes bookmark count, comment count, and reading progress
 */
export interface UserWithStats extends User {
  bookmarkCount: number;
  commentCount: number;
  readingProgressCount: number;
  recentBookmarks?: Bookmark[];
  recentReading?: ReadingProgress[];
}

/**
 * User profile with activity
 */
export interface UserProfile extends User {
  bookmarks: Bookmark[];
  comments: Comment[];
  readingProgress: ReadingProgress[];
  stats: {
    bookmarkCount: number;
    commentCount: number;
    lastActiveAt: Date | null;
    readingProgressCount: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// COMMENT RELATION TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Comment with user information
 */
export interface CommentWithUser extends Comment {
  chapter?: Chapter;
  user: User;
}

/**
 * Comment with full context
 */
export interface CommentWithContext extends Comment {
  chapter: Chapter & {
    comic: Comic;
  };
  user: User;
}

// ═══════════════════════════════════════════════════════════════════════════
// BOOKMARK RELATION TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Bookmark with associated comic
 */
export interface BookmarkWithComic extends Bookmark {
  comic: ComicWithChapters;
  lastReadChapter?: Chapter | null;
}

/**
 * Bookmark with brief comic info
 */
export interface BookmarkListItem extends Bookmark {
  comicCoverImage: string;
  comicSlug: string;
  comicTitle: string;
  lastReadChapterNumber?: null | number;
  lastReadChapterTitle?: null | string;
}

// ═══════════════════════════════════════════════════════════════════════════
// READING PROGRESS RELATION TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Reading progress with comic and chapter context
 */
export interface ReadingProgressWithContext extends ReadingProgress {
  chapter: Chapter;
  comic: Comic;
  user?: User;
}

/**
 * Reading progress for dashboard display
 */
export interface ReadingProgressItem {
  chapterId: number;
  chapterNumber: number;
  chapterTitle: string;
  comicCoverImage: string;
  comicId: number;
  comicSlug: string;
  comicTitle: string;
  isCompleted: boolean;
  lastReadAt: Date;
  progressPercent: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTHOR & ARTIST RELATION TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Author with list of comics
 */
export interface AuthorWithComicsList extends Author {
  comicCount: number;
  comics: ComicListItem[];
}

/**
 * Artist with list of comics
 */
export interface ArtistWithComicsList extends Artist {
  comicCount: number;
  comics: ComicListItem[];
}

/**
 * Genre with associated comics
 */
export interface GenreWithComicsList extends Genre {
  comicCount: number;
  comics: ComicListItem[];
}

// ═══════════════════════════════════════════════════════════════════════════
// AGGREGATE TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Combined relations for comic detail page
 */
export interface ComicDetailPage extends ComicWithChapters {
  bookmarkCount: number;
  commentCount: number;
  relatedComics: ComicListItem[];
  userBookmark?: Bookmark | null;
}

/**
 * Combined relations for chapter detail page
 */
export interface ChapterDetailPage extends ChapterWithContext {
  nextChapter?: Chapter | null;
  previousChapter?: Chapter | null;
  relatedChapters: Chapter[];
}

/**
 * Dashboard data with all relations
 */
export interface DashboardData {
  continueReadingComics: ReadingProgressItem[];
  recentBookmarks: BookmarkListItem[];
  recentReadings: ReadingProgressItem[];
  recommendedComics: ComicSearchResult[];
  user: UserWithStats;
}

// ═══════════════════════════════════════════════════════════════════════════
// SEARCH RESULT TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Unified search result across comics, chapters, authors
 */
export interface UnifiedSearchResult {
  description?: string;
  id: number | string;
  image?: string;
  metadata?: Record<string, unknown>;
  title: string;
  type: "artist" | "author" | "chapter" | "comic" | "genre";
}

/**
 * Search results with pagination
 */
export interface SearchResultsPage {
  hasMore: boolean;
  limit: number;
  offset: number;
  query: string;
  results: UnifiedSearchResult[];
  total: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// READING CONTEXT TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Full context for chapter reading
 */
export interface ChapterReaderContext {
  chapter: ChapterWithContext;
  isBookmarked: boolean;
  nextChapter: Chapter | null;
  previousChapter: Chapter | null;
  userComment?: Comment | null;
  userProgress: null | ReadingProgress;
}

/**
 * Comic browsing context
 */
export interface ComicBrowseContext {
  comic: ComicDetailPage;
  currentChapter?: Chapter | null;
  userBookmark?: Bookmark | null;
  userProgress?: null | ReadingProgress;
}
