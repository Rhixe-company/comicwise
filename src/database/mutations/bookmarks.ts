import { and, eq } from "drizzle-orm";

import { db as database } from "#database/db";
import { bookmark } from "#schema";

/**
 *
 * @param userId
 * @param comicId
 * @param chapterId
 */
export async function addBookmark(
  userId: string,
  comicId: number,
  chapterId?: number
): Promise<typeof bookmark.$inferSelect | undefined> {
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

/**
 *
 * @param userId
 * @param comicId
 */
export async function removeBookmark(
  userId: string,
  comicId: number
): Promise<typeof bookmark.$inferSelect | undefined> {
  const [deleted] = await database
    .delete(bookmark)
    .where(and(eq(bookmark.userId, userId), eq(bookmark.comicId, comicId)))
    .returning();

  return deleted;
}

/**
 *
 * @param userId
 * @param comicId
 * @param chapterId
 */
export async function updateReadingProgress(
  userId: string,
  comicId: number,
  chapterId: number
): Promise<typeof bookmark.$inferSelect | undefined> {
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

/**
 *
 * @param userId
 * @param comicId
 * @param notes
 */
export async function updateBookmarkNotes(
  userId: string,
  comicId: number,
  notes: string
): Promise<typeof bookmark.$inferSelect | undefined> {
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
