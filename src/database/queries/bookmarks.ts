import { database } from "@/database";
import { bookmark, chapter, comic, user } from "@/database/schema";
import { and, desc, eq } from "drizzle-orm";

export async function getUserBookmarks(userId: string) {
  const bookmarks = await database
    .select({
      bookmark: bookmark,
      comic: comic,
      chapter: chapter,
    })
    .from(bookmark)
    .leftJoin(comic, eq(bookmark.comicId, comic.id))
    .leftJoin(chapter, eq(bookmark.lastReadChapterId, chapter.id))
    .where(eq(bookmark.userId, userId))
    .orderBy(desc(bookmark.updatedAt));

  return bookmarks;
}

export async function isBookmarked(userId: string, comicId: number): Promise<boolean> {
  const result = await database
    .select()
    .from(bookmark)
    .where(and(eq(bookmark.userId, userId), eq(bookmark.comicId, comicId)))
    .limit(1);

  return result.length > 0;
}

export async function getBookmarkWithProgress(userId: string, comicId: number) {
  const result = await database
    .select({
      bookmark: bookmark,
      chapter: chapter,
    })
    .from(bookmark)
    .leftJoin(chapter, eq(bookmark.lastReadChapterId, chapter.id))
    .where(and(eq(bookmark.userId, userId), eq(bookmark.comicId, comicId)))
    .limit(1);

  return result[0] || null;
}

export async function getBookmarkCount(userId: string): Promise<number> {
  const result = await database
    .select({ comicId: bookmark.comicId })
    .from(bookmark)
    .where(eq(bookmark.userId, userId));

  return result.length;
}

export async function getUsersBookmarkedComic(comicId: number) {
  const bookmarks = await database
    .select({
      userId: bookmark.userId,
      email: user.email,
      name: user.name,
    })
    .from(bookmark)
    .innerJoin(user, eq(bookmark.userId, user.id))
    .where(eq(bookmark.comicId, comicId));

  return bookmarks;
}
