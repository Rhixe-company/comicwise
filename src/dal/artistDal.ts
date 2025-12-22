/**
 * Artist Data Access Layer
 * Handles all database operations for artists
 */

import { db } from '#database/db';
import { artist } from '#schema';
import { logger } from '#lib/logger';
import { desc, eq, like } from 'drizzle-orm';
import type { Artist } from '#types/database-auto';

export class ArtistDal {
  private static instance: ArtistDal;
  private logger = logger.child({ context: 'ArtistDal' });

  private constructor() {}

  static getInstance(): ArtistDal {
    if (!ArtistDal.instance) {
      ArtistDal.instance = new ArtistDal();
    }
    return ArtistDal.instance;
  }

  async create(data: typeof artist.$inferInsert): Promise<Artist | undefined> {
    try {
      this.logger.debug({ data }, 'Creating artist');
      const [newArtist] = await db.insert(artist).values(data).returning();
      this.logger.info({ artistId: newArtist?.id }, 'Artist created successfully');
      return newArtist;
    } catch (error) {
      this.logger.error({ error, data }, 'Failed to create artist');
      throw error;
    }
  }

  async findById(id: string): Promise<Artist | undefined> {
    try {
      this.logger.debug({ id }, 'Finding artist by ID');
      const [result] = await db.select().from(artist).where(eq(artist.id, id));
      return result;
    } catch (error) {
      this.logger.error({ error, id }, 'Failed to find artist by ID');
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<Artist | undefined> {
    try {
      this.logger.debug({ slug }, 'Finding artist by slug');
      const [result] = await db.select().from(artist).where(eq(artist.slug, slug));
      return result;
    } catch (error) {
      this.logger.error({ error, slug }, 'Failed to find artist by slug');
      throw error;
    }
  }

  async update(id: string, data: Partial<typeof artist.$inferInsert>): Promise<Artist | undefined> {
    try {
      this.logger.debug({ id, data }, 'Updating artist');
      const [updated] = await db.update(artist).set(data).where(eq(artist.id, id)).returning();
      this.logger.info({ artistId: id }, 'Artist updated successfully');
      return updated;
    } catch (error) {
      this.logger.error({ error, id, data }, 'Failed to update artist');
      throw error;
    }
  }

  async delete(id: string): Promise<Artist | undefined> {
    try {
      this.logger.debug({ id }, 'Deleting artist');
      const [deleted] = await db.delete(artist).where(eq(artist.id, id)).returning();
      this.logger.info({ artistId: id }, 'Artist deleted successfully');
      return deleted;
    } catch (error) {
      this.logger.error({ error, id }, 'Failed to delete artist');
      throw error;
    }
  }

  async list(options: { limit?: number; offset?: number; search?: string } = {}): Promise<Artist[]> {
    try {
      const { limit = 50, offset = 0, search } = options;
      this.logger.debug({ options }, 'Listing artists');

      let query = db.select().from(artist);

      if (search) {
        query = query.where(like(artist.name, `%${search}%`)) as typeof query;
      }

      const results = await query.orderBy(desc(artist.createdAt)).limit(limit).offset(offset);
      return results;
    } catch (error) {
      this.logger.error({ error, options }, 'Failed to list artists');
      throw error;
    }
  }
}

export const artistDal = ArtistDal.getInstance();
