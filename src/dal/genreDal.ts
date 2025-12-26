/**
 * Genre Data Access Layer
 * Handles all database operations for genres
 */

import { db } from "@/database/db";
import { logger } from "@/lib/logger";
import { asc, eq } from "drizzle-orm";
import { genre } from "schema";
import type { Genre } from "/typesdatabase";

export class GenreDal {
  private static instance: GenreDal;
  private logger = logger.child({ context: "GenreDal" });

  private constructor() {}

  static getInstance(): GenreDal {
    if (!GenreDal.instance) {
      GenreDal.instance = new GenreDal();
    }
    return GenreDal.instance;
  }

  async create(data: typeof genre.$inferInsert): Promise<Genre | undefined> {
    try {
      this.logger.debug({ data }, "Creating genre");
      const [newGenre] = await db.insert(genre).values(data).returning();
      this.logger.info({ genreId: newGenre?.id }, "Genre created successfully");
      return newGenre;
    } catch (error) {
      this.logger.error({ error, data }, "Failed to create genre");
      throw error;
    }
  }

  async findById(id: number): Promise<Genre | undefined> {
    try {
      this.logger.debug({ id }, "Finding genre by ID");
      const [result] = await db.select().from(genre).where(eq(genre.id, id));
      return result;
    } catch (error) {
      this.logger.error({ error, id }, "Failed to find genre by ID");
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<Genre | undefined> {
    try {
      this.logger.debug({ slug }, "Finding genre by slug");
      // Note: Genre schema doesn't have a slug field - use name instead
      const [result] = await db.select().from(genre).where(eq(genre.name, slug));
      return result;
    } catch (error) {
      this.logger.error({ error, slug }, "Failed to find genre by slug");
      throw error;
    }
  }

  async update(id: number, data: Partial<typeof genre.$inferInsert>): Promise<Genre | undefined> {
    try {
      this.logger.debug({ id, data }, "Updating genre");
      const [updated] = await db.update(genre).set(data).where(eq(genre.id, id)).returning();
      this.logger.info({ genreId: id }, "Genre updated successfully");
      return updated;
    } catch (error) {
      this.logger.error({ error, id, data }, "Failed to update genre");
      throw error;
    }
  }

  async delete(id: number): Promise<Genre | undefined> {
    try {
      this.logger.debug({ id }, "Deleting genre");
      const [deleted] = await db.delete(genre).where(eq(genre.id, id)).returning();
      this.logger.info({ genreId: id }, "Genre deleted successfully");
      return deleted;
    } catch (error) {
      this.logger.error({ error, id }, "Failed to delete genre");
      throw error;
    }
  }

  async list(): Promise<Genre[]> {
    try {
      this.logger.debug("Listing all genres");
      const results = await db.select().from(genre).orderBy(asc(genre.name));
      return results;
    } catch (error) {
      this.logger.error({ error }, "Failed to list genres");
      throw error;
    }
  }
}

export const genreDal = GenreDal.getInstance();
