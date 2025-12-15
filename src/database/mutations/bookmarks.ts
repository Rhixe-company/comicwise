import { database } from "@/database";
import { bookmark } from "@/database/schema";
import { and, eq } from "drizzle-orm";

export async function addBookmark(userId: string, comicId: number, chapterId?: number) {
  const [newBookmark] = await database
    .insert(bookmark)
    .values({
      userId,
      comicId,
      lastReadChapterId: chapterId,
    })
    .onConflictDoUpdate({
      target: [bookmark.userId, bookmark.comicId],
      set: {
        lastReadChapterId: chapterId,
        updatedAt: new Date(),
      },
    })
    .returning();

  return newBookmark;
}

export async function removeBookmark(userId: string, comicId: number) {
  const [deleted] = await database
    .delete(bookmark)
    .where(and(eq(bookmark.userId, userId), eq(bookmark.comicId, comicId)))
    .returning();

  return deleted;
}

export async function updateReadingProgress(userId: string, comicId: number, chapterId: number) {
  const [updated] = await database
    .update(bookmark)
    .set({
      lastReadChapterId: chapterId,
      updatedAt: new Date(),
    })
    .where(and(eq(bookmark.userId, userId), eq(bookmark.comicId, comicId)))
    .returning();

  return updated;
}

export async function updateBookmarkNotes(userId: string, comicId: number, notes: string) {
  const [updated] = await database
    .update(bookmark)
    .set({
      notes,
      updatedAt: new Date(),
    })
    .where(and(eq(bookmark.userId, userId), eq(bookmark.comicId, comicId)))
    .returning();

  return updated;
}
