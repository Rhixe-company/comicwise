/**
 * Bookmark Data Access Layer
 * Handles all database operations for bookmarks
 */

import { db } from '#database/db';
import { bookmark } from '#schema';
import { logger } from '#lib/logger';
import { and, desc, eq } from 'drizzle-orm';
import type { Bookmark } from '#types/database-auto';

export class BookmarkDal {
  private static instance: BookmarkDal;
  private logger = logger.child({ context: 'BookmarkDal' });

  private constructor() {}

  static getInstance(): BookmarkDal {
    if (!BookmarkDal.instance) {
      BookmarkDal.instance = new BookmarkDal();
    }
    return BookmarkDal.instance;
  }

  async create(data: typeof bookmark.$inferInsert): Promise<Bookmark | undefined> {
    try {
      this.logger.debug({ data }, 'Creating bookmark');
      const [newBookmark] = await db.insert(bookmark).values(data).returning();
      this.logger.info({ bookmarkId: newBookmark?.id }, 'Bookmark created successfully');
      return newBookmark;
    } catch (error) {
      this.logger.error({ error, data }, 'Failed to create bookmark');
      throw error;
    }
  }

  async findById(id: string): Promise<Bookmark | undefined> {
    try {
      this.logger.debug({ id }, 'Finding bookmark by ID');
      const [result] = await db.select().from(bookmark).where(eq(bookmark.id, id));
      return result;
    } catch (error) {
      this.logger.error({ error, id }, 'Failed to find bookmark by ID');
      throw error;
    }
  }

  async findByUserAndComic(userId: string, comicId: string): Promise<Bookmark | undefined> {
    try {
      this.logger.debug({ userId, comicId }, 'Finding bookmark by user and comic');
      const [result] = await db
        .select()
        .from(bookmark)
        .where(and(eq(bookmark.userId, userId), eq(bookmark.comicId, comicId)));
      return result;
    } catch (error) {
      this.logger.error({ error, userId, comicId }, 'Failed to find bookmark');
      throw error;
    }
  }

  async findByUserId(userId: string, limit = 50, offset = 0): Promise<Bookmark[]> {
    try {
      this.logger.debug({ userId, limit, offset }, 'Finding bookmarks by user ID');
      const results = await db
        .select()
        .from(bookmark)
        .where(eq(bookmark.userId, userId))
        .orderBy(desc(bookmark.createdAt))
        .limit(limit)
        .offset(offset);
      return results;
    } catch (error) {
      this.logger.error({ error, userId }, 'Failed to find bookmarks by user ID');
      throw error;
    }
  }

  async update(id: string, data: Partial<typeof bookmark.$inferInsert>): Promise<Bookmark | undefined> {
    try {
      this.logger.debug({ id, data }, 'Updating bookmark');
      const [updated] = await db.update(bookmark).set(data).where(eq(bookmark.id, id)).returning();
      this.logger.info({ bookmarkId: id }, 'Bookmark updated successfully');
      return updated;
    } catch (error) {
      this.logger.error({ error, id, data }, 'Failed to update bookmark');
      throw error;
    }
  }

  async delete(id: string): Promise<Bookmark | undefined> {
    try {
      this.logger.debug({ id }, 'Deleting bookmark');
      const [deleted] = await db.delete(bookmark).where(eq(bookmark.id, id)).returning();
      this.logger.info({ bookmarkId: id }, 'Bookmark deleted successfully');
      return deleted;
    } catch (error) {
      this.logger.error({ error, id }, 'Failed to delete bookmark');
      throw error;
    }
  }

  async deleteByUserAndComic(userId: string, comicId: string): Promise<Bookmark | undefined> {
    try {
      this.logger.debug({ userId, comicId }, 'Deleting bookmark by user and comic');
      const [deleted] = await db
        .delete(bookmark)
        .where(and(eq(bookmark.userId, userId), eq(bookmark.comicId, comicId)))
        .returning();
      this.logger.info({ userId, comicId }, 'Bookmark deleted successfully');
      return deleted;
    } catch (error) {
      this.logger.error({ error, userId, comicId }, 'Failed to delete bookmark');
      throw error;
    }
  }
}

export const bookmarkDal = BookmarkDal.getInstance();
