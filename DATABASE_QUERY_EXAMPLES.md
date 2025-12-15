# Sample Queries Using Typed Relations

## Type-Safe Query Examples Using Relation Types

This file demonstrates how to use the new relation types from
`src/types/database-relations.d.ts` in actual database queries.

---

## 1. ComicWithChapters Queries

### Get Comic with All Chapters

```typescript
// src/database/queries/comics.ts
import type { ComicWithChapters } from "@/types/database-relations";
import { db } from "@/database/db";
import {
  comic,
  chapter,
  author,
  artist,
  type as comicType,
} from "@/database/schema";
import { eq } from "drizzle-orm";

export async function getComicWithChapters(
  comicId: number
): Promise<ComicWithChapters | null> {
  const result = await db
    .select()
    .from(comic)
    .leftJoin(author, eq(comic.authorId, author.id))
    .leftJoin(artist, eq(comic.artistId, artist.id))
    .leftJoin(comicType, eq(comic.typeId, comicType.id))
    .where(eq(comic.id, comicId))
    .limit(1);

  if (!result[0]) return null;

  const chapters = await db
    .select()
    .from(chapter)
    .where(eq(chapter.comicId, comicId))
    .orderBy(chapter.chapterNumber);

  return {
    ...result[0].comic,
    chapters,
    author: result[0].author,
    artist: result[0].artist,
    type: result[0].type,
  } as ComicWithChapters;
}
```

### Search Comics with Type Info

```typescript
// src/database/queries/comics.ts
import type { ComicSearchResult } from "@/types/database-relations";
import { db } from "@/database/db";
import { comic, author, artist, type as comicType } from "@/database/schema";
import { like, desc } from "drizzle-orm";

export async function searchComics(
  query: string
): Promise<ComicSearchResult[]> {
  const searchTerm = `%${query}%`;

  return (await db
    .select({
      id: comic.id,
      title: comic.title,
      slug: comic.slug,
      coverImage: comic.coverImage,
      description: comic.description,
      rating: comic.rating,
      views: comic.views,
      status: comic.status,
      authorName: author.name,
      artistName: artist.name,
      typeName: comicType.name,
      createdAt: comic.createdAt,
    })
    .from(comic)
    .leftJoin(author, eq(comic.authorId, author.id))
    .leftJoin(artist, eq(comic.artistId, artist.id))
    .leftJoin(comicType, eq(comic.typeId, comicType.id))
    .where(like(comic.title, searchTerm))
    .orderBy(desc(comic.views))
    .limit(10)) as Promise<ComicSearchResult[]>;
}
```

---

## 2. ChapterWithComic Queries

### Get Chapter with Comic Context

```typescript
// src/database/queries/chapters.ts
import type { ChapterWithComic } from "@/types/database-relations";
import { db } from "@/database/db";
import { chapter, comic, chapterImage } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function getChapterWithComic(
  chapterId: number
): Promise<ChapterWithComic | null> {
  const result = await db
    .select()
    .from(chapter)
    .leftJoin(comic, eq(chapter.comicId, comic.id))
    .where(eq(chapter.id, chapterId))
    .limit(1);

  if (!result[0]) return null;

  const images = await db
    .select()
    .from(chapterImage)
    .where(eq(chapterImage.chapterId, chapterId))
    .orderBy(chapterImage.pageNumber);

  return {
    ...result[0].chapter,
    comic: result[0].comic!,
    images,
  } as ChapterWithComic;
}
```

### List Chapters with Comic Info

```typescript
// src/database/queries/chapters.ts
import type { ChapterWithComic } from "@/types/database-relations";
import { db } from "@/database/db";
import { chapter, comic } from "@/database/schema";
import { eq, desc } from "drizzle-orm";

export async function getComicChapters(
  comicId: number
): Promise<ChapterWithComic[]> {
  return (await db
    .select()
    .from(chapter)
    .leftJoin(comic, eq(chapter.comicId, comic.id))
    .where(eq(chapter.comicId, comicId))
    .orderBy(desc(chapter.chapterNumber))) as Promise<ChapterWithComic[]>;
}
```

---

## 3. UserWithStats Queries

### Get User Dashboard Stats

```typescript
// src/database/queries/users.ts
import type { UserWithStats } from "@/types/database-relations";
import { db } from "@/database/db";
import { user, bookmark, comment, readingProgress } from "@/database/schema";
import { eq, sql } from "drizzle-orm";

export async function getUserWithStats(
  userId: string
): Promise<UserWithStats | null> {
  const userRecord = await db
    .select()
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (!userRecord[0]) return null;

  const bookmarkCount = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(bookmark)
    .where(eq(bookmark.userId, userId));

  const commentCount = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(comment)
    .where(eq(comment.userId, userId));

  const progressCount = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(readingProgress)
    .where(eq(readingProgress.userId, userId));

  const recentReading = await db
    .select()
    .from(readingProgress)
    .where(eq(readingProgress.userId, userId))
    .orderBy(desc(readingProgress.lastReadAt))
    .limit(5);

  return {
    ...userRecord[0],
    bookmarkCount: bookmarkCount[0]?.count || 0,
    commentCount: commentCount[0]?.count || 0,
    readingProgressCount: progressCount[0]?.count || 0,
    recentReading,
  } as UserWithStats;
}
```

---

## 4. ComicSearchResult Queries

### Search with Pagination

```typescript
// src/database/queries/search.ts
import type { ComicSearchResult } from "@/types/database-relations";
import { db } from "@/database/db";
import { comic, author, artist, type as comicType } from "@/database/schema";
import {
  like,
  desc,
  limit as limitClause,
  offset as offsetClause,
} from "drizzle-orm";

export async function searchComicsWithPagination(
  query: string,
  page: number = 1,
  pageSize: number = 12
): Promise<{ results: ComicSearchResult[]; total: number }> {
  const searchTerm = `%${query}%`;
  const offset = (page - 1) * pageSize;

  const results = (await db
    .select({
      id: comic.id,
      title: comic.title,
      slug: comic.slug,
      coverImage: comic.coverImage,
      description: comic.description,
      rating: comic.rating,
      views: comic.views,
      status: comic.status,
      authorName: author.name,
      artistName: artist.name,
      typeName: comicType.name,
      createdAt: comic.createdAt,
    })
    .from(comic)
    .leftJoin(author, eq(comic.authorId, author.id))
    .leftJoin(artist, eq(comic.artistId, artist.id))
    .leftJoin(comicType, eq(comic.typeId, comicType.id))
    .where(like(comic.title, searchTerm))
    .orderBy(desc(comic.views))
    .limit(pageSize)
    .offset(offset)) as Promise<ComicSearchResult[]>;

  const countResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(comic)
    .where(like(comic.title, searchTerm));

  return {
    results,
    total: countResult[0]?.count || 0,
  };
}
```

---

## 5. CommentWithUser Queries

### Get Chapter Comments with Authors

```typescript
// src/database/queries/comments.ts
import type { CommentWithUser } from "@/types/database-relations";
import { db } from "@/database/db";
import { comment, user } from "@/database/schema";
import { eq, desc } from "drizzle-orm";

export async function getChapterComments(
  chapterId: number
): Promise<CommentWithUser[]> {
  return (await db
    .select()
    .from(comment)
    .leftJoin(user, eq(comment.userId, user.id))
    .where(eq(comment.chapterId, chapterId))
    .orderBy(desc(comment.createdAt))) as Promise<CommentWithUser[]>;
}
```

---

## 6. BookmarkWithComic Queries

### Get User's Library with Comic Details

```typescript
// src/database/queries/bookmarks.ts
import type { BookmarkListItem } from "@/types/database-relations";
import { db } from "@/database/db";
import { bookmark, comic, chapter } from "@/database/schema";
import { eq, desc } from "drizzle-orm";

export async function getUserBookmarks(
  userId: string
): Promise<BookmarkListItem[]> {
  return (await db
    .select({
      userId: bookmark.userId,
      comicId: bookmark.comicId,
      lastReadChapterId: bookmark.lastReadChapterId,
      notes: bookmark.notes,
      createdAt: bookmark.createdAt,
      updatedAt: bookmark.updatedAt,
      comicTitle: comic.title,
      comicSlug: comic.slug,
      comicCoverImage: comic.coverImage,
      lastReadChapterTitle: chapter.title,
      lastReadChapterNumber: chapter.chapterNumber,
    })
    .from(bookmark)
    .leftJoin(comic, eq(bookmark.comicId, comic.id))
    .leftJoin(chapter, eq(bookmark.lastReadChapterId, chapter.id))
    .where(eq(bookmark.userId, userId))
    .orderBy(desc(bookmark.updatedAt))) as Promise<BookmarkListItem[]>;
}
```

---

## 7. ReadingProgressItem Queries

### Get User's Continue Reading List

```typescript
// src/database/queries/reading-progress.ts
import type { ReadingProgressItem } from "@/types/database-relations";
import { db } from "@/database/db";
import { readingProgress, comic, chapter } from "@/database/schema";
import { eq, desc } from "drizzle-orm";

export async function getUserContinueReading(
  userId: string
): Promise<ReadingProgressItem[]> {
  return (await db
    .select({
      comicId: comic.id,
      comicTitle: comic.title,
      comicSlug: comic.slug,
      comicCoverImage: comic.coverImage,
      chapterId: chapter.id,
      chapterNumber: chapter.chapterNumber,
      chapterTitle: chapter.title,
      progressPercent: readingProgress.progressPercent,
      lastReadAt: readingProgress.lastReadAt,
      isCompleted: sql<boolean>`${readingProgress.progressPercent} = 100`,
    })
    .from(readingProgress)
    .leftJoin(comic, eq(readingProgress.comicId, comic.id))
    .leftJoin(chapter, eq(readingProgress.chapterId, chapter.id))
    .where(eq(readingProgress.userId, userId))
    .orderBy(desc(readingProgress.lastReadAt))) as Promise<
    ReadingProgressItem[]
  >;
}
```

---

## 8. ComicDetailPage Queries

### Get Full Comic Detail Page Data

```typescript
// src/database/queries/comics.ts
import type { ComicDetailPage } from "@/types/database-relations";
import { db } from "@/database/db";
import {
  comic,
  chapter,
  author,
  artist,
  type as comicType,
  comicToGenre,
  genre,
  bookmark,
  comment,
  sql,
} from "@/database/schema";
import { eq, desc } from "drizzle-orm";

export async function getComicDetailPage(
  comicId: number,
  userId?: string
): Promise<ComicDetailPage | null> {
  // Get comic with relations
  const comicResult = await db
    .select()
    .from(comic)
    .leftJoin(author, eq(comic.authorId, author.id))
    .leftJoin(artist, eq(comic.artistId, artist.id))
    .leftJoin(comicType, eq(comic.typeId, comicType.id))
    .where(eq(comic.id, comicId))
    .limit(1);

  if (!comicResult[0]) return null;

  // Get chapters
  const chapters = await db
    .select()
    .from(chapter)
    .where(eq(chapter.comicId, comicId))
    .orderBy(desc(chapter.chapterNumber));

  // Get genres
  const genreResults = await db
    .select({ genre })
    .from(comicToGenre)
    .leftJoin(genre, eq(comicToGenre.genreId, genre.id))
    .where(eq(comicToGenre.comicId, comicId));

  const genres = genreResults.map((r) => r.genre).filter(Boolean) as Genre[];

  // Get stats
  const bookmarkCount = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(bookmark)
    .where(eq(bookmark.comicId, comicId));

  const commentCount = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(comment)
    .leftJoin(chapter, eq(comment.chapterId, chapter.id))
    .where(eq(chapter.comicId, comicId));

  // Get user bookmark if logged in
  let userBookmark: Bookmark | null = null;
  if (userId) {
    const userBookmarkResult = await db
      .select()
      .from(bookmark)
      .where(eq(bookmark.userId, userId) && eq(bookmark.comicId, comicId))
      .limit(1);

    userBookmark = userBookmarkResult[0] || null;
  }

  // Get recommended comics
  const recommended = await db
    .select({
      id: comic.id,
      title: comic.title,
      slug: comic.slug,
      coverImage: comic.coverImage,
      rating: comic.rating,
      views: comic.views,
      status: comic.status,
      authorName: author.name,
      createdAt: comic.createdAt,
    })
    .from(comic)
    .leftJoin(author, eq(comic.authorId, author.id))
    .where(eq(comic.typeId, comicResult[0].comic.typeId))
    .orderBy(desc(comic.rating))
    .limit(6);

  return {
    ...comicResult[0].comic,
    author: comicResult[0].author,
    artist: comicResult[0].artist,
    type: comicResult[0].type,
    chapters,
    genres,
    relatedComics: recommended as ComicListItem[],
    bookmarkCount: bookmarkCount[0]?.count || 0,
    commentCount: commentCount[0]?.count || 0,
    userBookmark,
  } as ComicDetailPage;
}
```

---

## 9. Dashboard Data Queries

### Get Complete Dashboard Data

```typescript
// src/database/queries/dashboard.ts
import type {
  DashboardData,
  ReadingProgressItem,
  BookmarkListItem,
} from "@/types/database-relations";
import { db } from "@/database/db";
import {
  user,
  readingProgress,
  bookmark,
  comic,
  chapter,
} from "@/database/schema";
import { eq, desc } from "drizzle-orm";

export async function getDashboardData(
  userId: string
): Promise<DashboardData | null> {
  // Get user with stats
  const userWithStats = await getUserWithStats(userId);
  if (!userWithStats) return null;

  // Get recent reading progress
  const recentReadings = (await db
    .select({
      comicId: comic.id,
      comicTitle: comic.title,
      comicSlug: comic.slug,
      comicCoverImage: comic.coverImage,
      chapterId: chapter.id,
      chapterNumber: chapter.chapterNumber,
      chapterTitle: chapter.title,
      progressPercent: readingProgress.progressPercent,
      lastReadAt: readingProgress.lastReadAt,
      isCompleted: sql<boolean>`${readingProgress.progressPercent} = 100`,
    })
    .from(readingProgress)
    .leftJoin(comic, eq(readingProgress.comicId, comic.id))
    .leftJoin(chapter, eq(readingProgress.chapterId, chapter.id))
    .where(eq(readingProgress.userId, userId))
    .orderBy(desc(readingProgress.lastReadAt))
    .limit(10)) as Promise<ReadingProgressItem[]>;

  // Get recent bookmarks
  const recentBookmarks = (await getUserBookmarks(userId)) as Promise<
    BookmarkListItem[]
  >;

  // Get recommended comics
  const recommended = await getRecommendedComics();

  // Get continue reading list (not completed)
  const continueReading = recentReadings.filter((item) => !item.isCompleted);

  return {
    user: userWithStats,
    recentReadings,
    recentBookmarks: recentBookmarks.slice(0, 5),
    recommendedComics: recommended,
    continueReadingComics: continueReading,
  };
}
```

---

## Type Benefits Demonstrated

1. **Type Safety**: All queries return properly typed results
2. **IDE Autocomplete**: Full intellisense for all properties
3. **Compile-time Checking**: TypeScript catches errors before runtime
4. **Self-Documenting**: Return types clearly show what data is included
5. **Maintainability**: Easy to refactor and understand query results

---

## Migration Guide

### Before (Using `any`)

```typescript
// ❌ No type safety
export async function getComic(id: number): Promise<any> {
  const result = await db.select().from(comic).where(eq(comic.id, id));
  return result[0];
}

// ❌ Runtime errors possible
const comic = await getComic(1);
console.log(comic.invalidProperty); // Oops!
```

### After (Using Relation Types)

```typescript
// ✅ Full type safety
export async function getComic(id: number): Promise<Comic | null> {
  const result = await db.select().from(comic).where(eq(comic.id, id));
  return result[0] || null;
}

// ✅ Compile-time error caught
const comic = await getComic(1);
if (comic) {
  console.log(comic.invalidProperty); // TypeScript error!
}
```

---

All queries follow the same pattern:

1. Use typed relation types from `database-relations.d.ts`
2. Compose queries with proper joins
3. Return type-safe results
4. Enjoy IDE autocomplete and compile-time type checking
