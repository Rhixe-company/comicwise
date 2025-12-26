/**
 * Bookmark Data Access Layer
 * Handles all database operations for bookmarks
 */

import { db } from "database/db";
import { and, desc, eq } from "drizzle-orm";
import { logger } from "lib/logger";
import { bookmark } from "schema";
import type { Bookmark } from "/typesdatabase";

export class BookmarkDal {
  private static instance: BookmarkDal;
  private logger = logger.child({ context: "BookmarkDal" });

  private constructor() {}

  static getInstance(): BookmarkDal {
    if (!BookmarkDal.instance) {
      BookmarkDal.instance = new BookmarkDal();
    }
    return BookmarkDal.instance;
  }

  async create(data: typeof bookmark.$inferInsert): Promise<Bookmark | undefined> {
    try {
      this.logger.debug({ data }, "Creating bookmark");
      const [newBookmark] = await db.insert(bookmark).values(data).returning();
      this.logger.info(
        { userId: newBookmark?.userId, comicId: newBookmark?.comicId },
        "Bookmark created successfully"
      );
      return newBookmark;
    } catch (error) {
      this.logger.error({ error, data }, "Failed to create bookmark");
      throw error;
    }
  }

  async findByUserAndComic(userId: string, comicId: number): Promise<Bookmark | undefined> {
    try {
      this.logger.debug({ userId, comicId }, "Finding bookmark by user and comic");
      const [result] = await db
        .select()
        .from(bookmark)
        .where(and(eq(bookmark.userId, userId), eq(bookmark.comicId, comicId)));
      return result;
    } catch (error) {
      this.logger.error({ error, userId, comicId }, "Failed to find bookmark");
      throw error;
    }
  }

  async findByUserId(userId: string, limit = 50, offset = 0): Promise<Bookmark[]> {
    try {
      this.logger.debug({ userId, limit, offset }, "Finding bookmarks by user ID");
      const results = await db
        .select()
        .from(bookmark)
        .where(eq(bookmark.userId, userId))
        .orderBy(desc(bookmark.createdAt))
        .limit(limit)
        .offset(offset);
      return results;
    } catch (error) {
      this.logger.error({ error, userId }, "Failed to find bookmarks by user ID");
      throw error;
    }
  }

  async updateByUserAndComic(
    userId: string,
    comicId: number,
    data: Partial<typeof bookmark.$inferInsert>
  ): Promise<Bookmark | undefined> {
    try {
      this.logger.debug({ userId, comicId, data }, "Updating bookmark");
      const [updated] = await db
        .update(bookmark)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(bookmark.userId, userId), eq(bookmark.comicId, comicId)))
        .returning();
      this.logger.info({ userId, comicId }, "Bookmark updated successfully");
      return updated;
    } catch (error) {
      this.logger.error({ error, userId, comicId, data }, "Failed to update bookmark");
      throw error;
    }
  }

  async deleteByUserAndComic(userId: string, comicId: number): Promise<Bookmark | undefined> {
    try {
      this.logger.debug({ userId, comicId }, "Deleting bookmark by user and comic");
      const [deleted] = await db
        .delete(bookmark)
        .where(and(eq(bookmark.userId, userId), eq(bookmark.comicId, comicId)))
        .returning();
      this.logger.info({ userId, comicId }, "Bookmark deleted successfully");
      return deleted;
    } catch (error) {
      this.logger.error({ error, userId, comicId }, "Failed to delete bookmark");
      throw error;
    }
  }
}

export const bookmarkDal = BookmarkDal.getInstance();
