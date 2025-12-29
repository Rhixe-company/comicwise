/**
 * Enhanced Comic Seeder
 *
 * @module ComicSeeder
 * @description Seeds comic data with relations (authors, artists, genres, types)
 */

import { artist, author, comic, comicToGenre, type as comicType, genre } from "@/database/schema";
import { comicSeedSchema  } from "@/lib/validations";
import type {ComicSeed} from "@/lib/validations";
import { eq } from "drizzle-orm";
import { BaseSeeder, database } from "../baseSeeder";
import { logger } from "../logger";
import type { SeedOptions, SeedResult } from "../types";

// Helper function to create slugs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replaceAll(/[^\s\w-]/g, "")
    .replaceAll(/[\s_-]+/g, "-")
    .replaceAll(/^-+|-+$/g, "");
}

// ═══════════════════════════════════════════════════
// COMIC SEEDER
// ═══════════════════════════════════════════════════

export class ComicSeederEnhanced extends BaseSeeder<ComicSeed> {
  private authorCache: Map<string, number> = new Map();
  private artistCache: Map<string, number> = new Map();
  private genreCache: Map<string, number> = new Map();
  private typeCache: Map<string, number> = new Map();

  constructor(options: SeedOptions = {}) {
    super("comics", comic, comicSeedSchema, options);
  }

  /**
   * Data sources for comics
   */
  protected getDataSources(): string[] {
    return [
      "./comics.json",
      "./comicsdata.json",
      "./comicsdata*.json",
      "./data/comics*.json",
      "./seed-data/comics*.json",
    ];
  }

  /**
   * Get unique field for upsert
   */
  protected getUniqueField(): string {
    return "slug";
  }

  /**
   * Prepare comic data for insertion
   * @param item
   */
  protected prepareData(item: ComicSeed): typeof comic.$inferInsert {
    return {
      title: item.title,
      slug: item.slug || slugify(item.title),
      description: item.description || "",
      coverImage: this.extractCoverImage(item) || "",
      status: this.mapStatus(item.status),
      rating: item.rating ? String(Number.parseFloat(String(item.rating))) : null,
      publicationDate: item.updatedAt ? new Date(item.updatedAt) : new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Extract cover image from various formats
   * @param item
   */
  private extractCoverImage(item: ComicSeed): string | null {
    // Handle different image formats
    if (typeof item.coverImage === "string") {
      return item.coverImage;
    }

    if (Array.isArray((item as Record<string, unknown>).images)) {
      const images = (item as Record<string, unknown>).images as Array<{ url: string }>;
      return images[0]?.url || null;
    }

    return null;
  }

  /**
   * Map status to enum
   * @param status
   */
  private mapStatus(
    status?: string
  ): "Ongoing" | "Completed" | "Hiatus" | "Dropped" | "Coming Soon" {
    if (!status) return "Ongoing";

    const normalized = status.toLowerCase().trim();
    if (normalized.includes("complet")) return "Completed";
    if (normalized.includes("hiatus")) return "Hiatus";
    if (normalized.includes("drop")) return "Dropped";
    if (normalized.includes("coming") || normalized.includes("soon")) return "Coming Soon";
    return "Ongoing";
  }

  /**
   * Get or create author
   * @param name
   */
  private async getOrCreateAuthor(name: string): Promise<number> {
    if (this.authorCache.has(name)) {
      return this.authorCache.get(name)!;
    }

    const existing = await database.select().from(author).where(eq(author.name, name)).limit(1);

    if (existing.length > 0) {
      this.authorCache.set(name, existing[0].id);
      return existing[0].id;
    }

    const [newAuthor] = await database.insert(author).values({ name }).returning();

    this.authorCache.set(name, newAuthor.id);
    return newAuthor.id;
  }

  /**
   * Get or create artist
   * @param name
   */
  private async getOrCreateArtist(name: string): Promise<number> {
    if (this.artistCache.has(name)) {
      return this.artistCache.get(name)!;
    }

    const existing = await database.select().from(artist).where(eq(artist.name, name)).limit(1);

    if (existing.length > 0) {
      this.artistCache.set(name, existing[0].id);
      return existing[0].id;
    }

    const [newArtist] = await database.insert(artist).values({ name }).returning();

    this.artistCache.set(name, newArtist.id);
    return newArtist.id;
  }

  /**
   * Get or create genre
   * @param name
   */
  private async getOrCreateGenre(name: string): Promise<number> {
    if (this.genreCache.has(name)) {
      return this.genreCache.get(name)!;
    }

    const existing = await database.select().from(genre).where(eq(genre.name, name)).limit(1);

    if (existing.length > 0) {
      this.genreCache.set(name, existing[0].id);
      return existing[0].id;
    }

    const [newGenre] = await database.insert(genre).values({ name }).returning();

    this.genreCache.set(name, newGenre.id);
    return newGenre.id;
  }

  /**
   * Get or create type
   * @param name
   */
  private async getOrCreateType(name: string): Promise<number> {
    if (this.typeCache.has(name)) {
      return this.typeCache.get(name)!;
    }

    const existing = await database
      .select()
      .from(comicType)
      .where(eq(comicType.name, name))
      .limit(1);

    if (existing.length > 0) {
      this.typeCache.set(name, existing[0].id);
      return existing[0].id;
    }

    const [newType] = await database.insert(comicType).values({ name }).returning();

    this.typeCache.set(name, newType.id);
    return newType.id;
  }

  /**
   * Insert batch with relations
   * @param batch
   * @param options
   */
  protected async insertBatch(
    batch: ComicSeed[],
    options: SeedOptions
  ): Promise<Omit<SeedResult, "duration">> {
    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const item of batch) {
      try {
        const prepared = this.prepareData(item);

        // Handle author
        if (
          (item as Record<string, unknown>).author &&
          typeof (item as Record<string, unknown>).author === "object"
        ) {
          const authorName = ((item as Record<string, unknown>).author as { name: string }).name;
          if (authorName) {
            prepared.authorId = await this.getOrCreateAuthor(authorName);
          }
        }

        // Handle artist
        if (
          (item as Record<string, unknown>).artist &&
          typeof (item as Record<string, unknown>).artist === "object"
        ) {
          const artistName = ((item as Record<string, unknown>).artist as { name: string }).name;
          if (artistName) {
            prepared.artistId = await this.getOrCreateArtist(artistName);
          }
        }

        // Handle type
        if (
          (item as Record<string, unknown>).type &&
          typeof (item as Record<string, unknown>).type === "object"
        ) {
          const typeName = ((item as Record<string, unknown>).type as { name: string }).name;
          if (typeName) {
            prepared.typeId = await this.getOrCreateType(typeName);
          }
        }

        // Check if comic exists
        const existing = await database
          .select()
          .from(comic)
          .where(eq(comic.slug, prepared.slug))
          .limit(1);

        let comicId: number;

        if (existing.length > 0) {
          if (options.forceOverwrite) {
            // Update existing
            const [updatedComic] = await database
              .update(comic)
              .set({
                ...prepared,
                updatedAt: new Date(),
              })
              .where(eq(comic.slug, prepared.slug))
              .returning();
            comicId = updatedComic.id;
            updated++;
          } else {
            comicId = existing[0].id;
            skipped++;
          }
        } else {
          // Insert new
          const [newComic] = await database.insert(comic).values(prepared).returning();
          comicId = newComic.id;
          inserted++;
        }

        // Handle genres
        if (
          (item as Record<string, unknown>).genres &&
          Array.isArray((item as Record<string, unknown>).genres)
        ) {
          const genres = (item as Record<string, unknown>).genres as Array<{ name: string }>;

          // Collect genre relations
          const genreRelations: Array<{ comicId: number; genreId: number }> = [];

          for (const g of genres) {
            if (g.name) {
              const genreId = await this.getOrCreateGenre(g.name);
              genreRelations.push({
                comicId,
                genreId,
              });
            }
          }

          // Insert all genre relations at once
          if (genreRelations.length > 0) {
            try {
              await database.insert(comicToGenre).values(genreRelations).onConflictDoNothing();
            } catch {
              // Ignore duplicate genre relations
            }
          }
        }
      } catch (error) {
        logger.warn(`Failed to insert comic: ${error}`);
        errors++;
      }
    }

    return { inserted, updated, skipped, errors };
  }
}

// ═══════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════

export { ComicSeederEnhanced as ComicSeeder };
export default ComicSeederEnhanced;
