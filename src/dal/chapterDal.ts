/**
 * Chapter Data Access Layer
 * Handles all database operations for chapters
 */

import { db } from "@/database/db";
import { chapter } from "@/database/schema";
import { logger } from "@/lib/logger";
import type { Chapter } from "@/types/database";
import { and, asc, desc, eq } from "drizzle-orm";

export class ChapterDal {
  private static instance: ChapterDal;
  private logger = logger.child({ context: "ChapterDal" });

  private constructor() {}

  static getInstance(): ChapterDal {
    if (!ChapterDal.instance) {
      ChapterDal.instance = new ChapterDal();
    }
    return ChapterDal.instance;
  }

  async create(data: typeof chapter.$inferInsert): Promise<Chapter | undefined> {
    try {
      this.logger.debug({ data }, "Creating chapter");
      const [newChapter] = await db.insert(chapter).values(data).returning();
      this.logger.info({ chapterId: newChapter?.id }, "Chapter created successfully");
      return newChapter;
    } catch (error) {
      this.logger.error({ error, data }, "Failed to create chapter");
      throw error;
    }
  }

  async findById(id: number): Promise<Chapter | undefined> {
    try {
      this.logger.debug({ id }, "Finding chapter by ID");
      const [result] = await db.select().from(chapter).where(eq(chapter.id, id));
      return result;
    } catch (error) {
      this.logger.error({ error, id }, "Failed to find chapter by ID");
      throw error;
    }
  }

  async findByComicId(comicId: number, order: "asc" | "desc" = "asc"): Promise<Chapter[]> {
    try {
      this.logger.debug({ comicId, order }, "Finding chapters by comic ID");
      const orderFunction = order === "asc" ? asc : desc;
      const results = await db
        .select()
        .from(chapter)
        .where(eq(chapter.comicId, comicId))
        .orderBy(orderFunction(chapter.chapterNumber));
      return results;
    } catch (error) {
      this.logger.error({ error, comicId }, "Failed to find chapters by comic ID");
      throw error;
    }
  }

  async findBySlug(comicId: number, slug: string): Promise<Chapter | undefined> {
    try {
      this.logger.debug({ comicId, slug }, "Finding chapter by slug");
      const [result] = await db
        .select()
        .from(chapter)
        .where(and(eq(chapter.comicId, comicId), eq(chapter.slug, slug)));
      return result;
    } catch (error) {
      this.logger.error({ error, comicId, slug }, "Failed to find chapter by slug");
      throw error;
    }
  }

  async update(
    id: number,
    data: Partial<typeof chapter.$inferInsert>
  ): Promise<Chapter | undefined> {
    try {
      this.logger.debug({ id, data }, "Updating chapter");
      const [updated] = await db.update(chapter).set(data).where(eq(chapter.id, id)).returning();
      this.logger.info({ chapterId: id }, "Chapter updated successfully");
      return updated;
    } catch (error) {
      this.logger.error({ error, id, data }, "Failed to update chapter");
      throw error;
    }
  }

  async delete(id: number): Promise<Chapter | undefined> {
    try {
      this.logger.debug({ id }, "Deleting chapter");
      const [deleted] = await db.delete(chapter).where(eq(chapter.id, id)).returning();
      this.logger.info({ chapterId: id }, "Chapter deleted successfully");
      return deleted;
    } catch (error) {
      this.logger.error({ error, id }, "Failed to delete chapter");
      throw error;
    }
  }

  async getNextChapter(comicId: number, currentNumber: number): Promise<Chapter | undefined> {
    try {
      this.logger.debug({ comicId, currentNumber }, "Getting next chapter");
      const [result] = await db
        .select()
        .from(chapter)
        .where(and(eq(chapter.comicId, comicId), eq(chapter.chapterNumber, currentNumber + 1)));
      return result;
    } catch (error) {
      this.logger.error({ error, comicId, currentNumber }, "Failed to get next chapter");
      throw error;
    }
  }

  async getPreviousChapter(comicId: number, currentNumber: number): Promise<Chapter | undefined> {
    try {
      this.logger.debug({ comicId, currentNumber }, "Getting previous chapter");
      const [result] = await db
        .select()
        .from(chapter)
        .where(and(eq(chapter.comicId, comicId), eq(chapter.chapterNumber, currentNumber - 1)));
      return result;
    } catch (error) {
      this.logger.error({ error, comicId, currentNumber }, "Failed to get previous chapter");
      throw error;
    }
  }
}

export const chapterDal = ChapterDal.getInstance();
