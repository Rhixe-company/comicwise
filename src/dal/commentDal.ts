/**
 * Comment Data Access Layer
 * Handles all database operations for comments
 */

import { db } from "#database/db";
import { logger } from "#lib/logger";
import { comment } from "#schema";
import type { Comment } from "#types/database";
import { desc, eq } from "drizzle-orm";

export class CommentDal {
  private static instance: CommentDal;
  private logger = logger.child({ context: "CommentDal" });

  private constructor() {}

  static getInstance(): CommentDal {
    if (!CommentDal.instance) {
      CommentDal.instance = new CommentDal();
    }
    return CommentDal.instance;
  }

  async create(data: typeof comment.$inferInsert): Promise<Comment | undefined> {
    try {
      this.logger.debug({ data }, "Creating comment");
      const [newComment] = await db.insert(comment).values(data).returning();
      this.logger.info({ commentId: newComment?.id }, "Comment created successfully");
      return newComment;
    } catch (error) {
      this.logger.error({ error, data }, "Failed to create comment");
      throw error;
    }
  }

  async findById(id: number): Promise<Comment | undefined> {
    try {
      this.logger.debug({ id }, "Finding comment by ID");
      const [result] = await db.select().from(comment).where(eq(comment.id, id));
      return result;
    } catch (error) {
      this.logger.error({ error, id }, "Failed to find comment by ID");
      throw error;
    }
  }

  async findByChapterId(chapterId: number): Promise<Comment[]> {
    try {
      this.logger.debug({ chapterId }, "Finding comments by chapter ID");
      const results = await db
        .select()
        .from(comment)
        .where(eq(comment.chapterId, chapterId))
        .orderBy(desc(comment.createdAt));
      return results;
    } catch (error) {
      this.logger.error({ error, chapterId }, "Failed to find comments by chapter ID");
      throw error;
    }
  }

  async findReplies(parentId: number): Promise<Comment[]> {
    try {
      this.logger.debug({ parentId }, "Finding comment replies");
      // Note: Comment schema doesn't have parentId - this functionality may need to be implemented differently
      return [];
    } catch (error) {
      this.logger.error({ error, parentId }, "Failed to find comment replies");
      throw error;
    }
  }

  async update(
    id: number,
    data: Partial<typeof comment.$inferInsert>
  ): Promise<Comment | undefined> {
    try {
      this.logger.debug({ id, data }, "Updating comment");
      const [updated] = await db.update(comment).set(data).where(eq(comment.id, id)).returning();
      this.logger.info({ commentId: id }, "Comment updated successfully");
      return updated;
    } catch (error) {
      this.logger.error({ error, id, data }, "Failed to update comment");
      throw error;
    }
  }

  async delete(id: number): Promise<Comment | undefined> {
    try {
      this.logger.debug({ id }, "Deleting comment");
      const [deleted] = await db.delete(comment).where(eq(comment.id, id)).returning();
      this.logger.info({ commentId: id }, "Comment deleted successfully");
      return deleted;
    } catch (error) {
      this.logger.error({ error, id }, "Failed to delete comment");
      throw error;
    }
  }
}

export const commentDal = CommentDal.getInstance();
