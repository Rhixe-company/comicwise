/**
 * Author Data Access Layer
 * Handles all database operations for authors
 */

import { db } from "database/db";
import { desc, eq, like } from "drizzle-orm";
import { logger } from "lib/logger";
import { author } from "schema";
import type { Author } from "types/database";

export class AuthorDal {
  private static instance: AuthorDal;
  private logger = logger.child({ context: "AuthorDal" });

  private constructor() {}

  static getInstance(): AuthorDal {
    if (!AuthorDal.instance) {
      AuthorDal.instance = new AuthorDal();
    }
    return AuthorDal.instance;
  }

  async create(data: typeof author.$inferInsert): Promise<Author | undefined> {
    try {
      this.logger.debug({ data }, "Creating author");
      const [newAuthor] = await db.insert(author).values(data).returning();
      this.logger.info({ authorId: newAuthor?.id }, "Author created successfully");
      return newAuthor;
    } catch (error) {
      this.logger.error({ error, data }, "Failed to create author");
      throw error;
    }
  }

  async findById(id: number): Promise<Author | undefined> {
    try {
      this.logger.debug({ id }, "Finding author by ID");
      const [result] = await db.select().from(author).where(eq(author.id, id));
      return result;
    } catch (error) {
      this.logger.error({ error, id }, "Failed to find author by ID");
      throw error;
    }
  }

  async findByName(name: string): Promise<Author | undefined> {
    try {
      this.logger.debug({ name }, "Finding author by name");
      const [result] = await db.select().from(author).where(eq(author.name, name));
      return result;
    } catch (error) {
      this.logger.error({ error, name }, "Failed to find author by name");
      throw error;
    }
  }

  async update(id: number, data: Partial<typeof author.$inferInsert>): Promise<Author | undefined> {
    try {
      this.logger.debug({ id, data }, "Updating author");
      const [updated] = await db.update(author).set(data).where(eq(author.id, id)).returning();
      this.logger.info({ authorId: id }, "Author updated successfully");
      return updated;
    } catch (error) {
      this.logger.error({ error, id, data }, "Failed to update author");
      throw error;
    }
  }

  async delete(id: number): Promise<Author | undefined> {
    try {
      this.logger.debug({ id }, "Deleting author");
      const [deleted] = await db.delete(author).where(eq(author.id, id)).returning();
      this.logger.info({ authorId: id }, "Author deleted successfully");
      return deleted;
    } catch (error) {
      this.logger.error({ error, id }, "Failed to delete author");
      throw error;
    }
  }

  async list(
    options: { limit?: number; offset?: number; search?: string } = {}
  ): Promise<Author[]> {
    try {
      const { limit = 50, offset = 0, search } = options;
      this.logger.debug({ options }, "Listing authors");

      let query = db.select().from(author);

      if (search) {
        query = query.where(like(author.name, `%${search}%`)) as typeof query;
      }

      const results = await query.orderBy(desc(author.createdAt)).limit(limit).offset(offset);
      return results;
    } catch (error) {
      this.logger.error({ error, options }, "Failed to list authors");
      throw error;
    }
  }
}

export const authorDal = AuthorDal.getInstance();
