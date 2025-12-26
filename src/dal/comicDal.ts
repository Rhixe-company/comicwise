/**
 * Comic Data Access Layer
 * Handles all database operations for comics
 */

import { db } from "database/db";
import { and, desc, eq, like, sql, type SQL } from "drizzle-orm";
import { logger } from "lib/logger";
import { comic, comicToGenre } from "schema";
import type { Comic } from "types/database";

export class ComicDal {
  private static instance: ComicDal;
  private logger = logger.child({ context: "ComicDal" });

  private constructor() {}

  static getInstance(): ComicDal {
    if (!ComicDal.instance) {
      ComicDal.instance = new ComicDal();
    }
    return ComicDal.instance;
  }

  async create(data: typeof comic.$inferInsert): Promise<Comic | undefined> {
    try {
      this.logger.debug({ data }, "Creating comic");
      const [newComic] = await db.insert(comic).values(data).returning();
      this.logger.info({ comicId: newComic?.id }, "Comic created successfully");
      return newComic;
    } catch (error) {
      this.logger.error({ error, data }, "Failed to create comic");
      throw error;
    }
  }

  async findById(id: number): Promise<Comic | undefined> {
    try {
      this.logger.debug({ id }, "Finding comic by ID");
      const [result] = await db.select().from(comic).where(eq(comic.id, id));
      return result;
    } catch (error) {
      this.logger.error({ error, id }, "Failed to find comic by ID");
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<Comic | undefined> {
    try {
      this.logger.debug({ slug }, "Finding comic by slug");
      const [result] = await db.select().from(comic).where(eq(comic.slug, slug));
      return result;
    } catch (error) {
      this.logger.error({ error, slug }, "Failed to find comic by slug");
      throw error;
    }
  }

  async update(id: number, data: Partial<typeof comic.$inferInsert>): Promise<Comic | undefined> {
    try {
      this.logger.debug({ id, data }, "Updating comic");
      const [updated] = await db.update(comic).set(data).where(eq(comic.id, id)).returning();
      this.logger.info({ comicId: id }, "Comic updated successfully");
      return updated;
    } catch (error) {
      this.logger.error({ error, id, data }, "Failed to update comic");
      throw error;
    }
  }

  async delete(id: number): Promise<Comic | undefined> {
    try {
      this.logger.debug({ id }, "Deleting comic");
      const [deleted] = await db.delete(comic).where(eq(comic.id, id)).returning();
      this.logger.info({ comicId: id }, "Comic deleted successfully");
      return deleted;
    } catch (error) {
      this.logger.error({ error, id }, "Failed to delete comic");
      throw error;
    }
  }

  async list(
    options: {
      limit?: number;
      offset?: number;
      status?: string;
      type?: string;
      search?: string;
      orderBy?: "latest" | "popular" | "rating";
    } = {}
  ): Promise<Comic[]> {
    try {
      const { limit = 20, offset = 0, status, type, search, orderBy = "latest" } = options;
      this.logger.debug({ options }, "Listing comics");

      let query = db.select().from(comic);
      const conditions: SQL[] = [];

      if (status) {
        conditions.push(eq(comic.status, status as any));
      }

      if (type) {
        conditions.push(eq(comic.typeId, Number(type)));
      }

      if (search) {
        conditions.push(like(comic.title, `%${search}%`));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as typeof query;
      }

      switch (orderBy) {
        case "popular":
          query = query.orderBy(desc(comic.views)) as typeof query;
          break;
        case "rating":
          query = query.orderBy(desc(comic.rating)) as typeof query;
          break;
        case "latest":
        default:
          query = query.orderBy(desc(comic.createdAt)) as typeof query;
          break;
      }

      const results = await query.limit(limit).offset(offset);
      return results;
    } catch (error) {
      this.logger.error({ error, options }, "Failed to list comics");
      throw error;
    }
  }

  async assignGenres(comicId: number, genreIds: number[]): Promise<void> {
    try {
      this.logger.debug({ comicId, genreIds }, "Assigning genres to comic");

      // Delete existing associations
      await db.delete(comicToGenre).where(eq(comicToGenre.comicId, comicId));

      // Insert new associations
      if (genreIds.length > 0) {
        await db.insert(comicToGenre).values(genreIds.map((genreId) => ({ comicId, genreId })));
      }

      this.logger.info({ comicId, genreCount: genreIds.length }, "Genres assigned successfully");
    } catch (error) {
      this.logger.error({ error, comicId, genreIds }, "Failed to assign genres");
      throw error;
    }
  }

  async incrementViews(id: number): Promise<void> {
    try {
      this.logger.debug({ id }, "Incrementing comic views");
      await db
        .update(comic)
        .set({ views: sql`${comic.views} + 1` })
        .where(eq(comic.id, id));
    } catch (error) {
      this.logger.error({ error, id }, "Failed to increment views");
      throw error;
    }
  }
}

export const comicDal = ComicDal.getInstance();
