/**
 * Enhanced Chapter Seeder
 *
 * @module ChapterSeeder
 * @description Seeds chapter data with comic relations
 */

import { chapter, comic } from "@/database/schema";
import { chapterSeedSchema  } from "@/lib/validations";
import type {ChapterSeed} from "@/lib/validations";
import { eq } from "drizzle-orm";
import { BaseSeeder, database } from "../baseSeeder";
import { logger } from "../logger";
import type { SeedOptions, SeedResult } from "../types";

// ═══════════════════════════════════════════════════
// CHAPTER SEEDER
// ═══════════════════════════════════════════════════

export class ChapterSeederEnhanced extends BaseSeeder<ChapterSeed> {
  private comicCache: Map<string, number> = new Map();

  constructor(options: SeedOptions = {}) {
    super("chapters", chapter, chapterSeedSchema, options);
  }

  /**
   * Data sources for chapters
   */
  protected getDataSources(): string[] {
    return [
      "./chapters.json",
      "./chaptersdata.json",
      "./chaptersdata*.json",
      "./data/chapters*.json",
      "./seed-data/chapters*.json",
    ];
  }

  /**
   * Get unique field for upsert
   */
  protected getUniqueField(): string {
    return "slug";
  }

  /**
   * Prepare chapter data for insertion
   * @param item
   */
  protected prepareData(item: ChapterSeed): typeof chapter.$inferInsert {
    const chapterNumber = this.extractChapterNumber(item);
    const title = item.title || `Chapter ${chapterNumber}`;

    return {
      title,
      slug: this.generateSlug(item),
      chapterNumber: chapterNumber,
      releaseDate: item.updatedAt ? new Date(item.updatedAt) : new Date(),
      comicId: 0, // Will be set later
    };
  }

  /**
   * Generate slug from chapter data
   * @param item
   */
  private generateSlug(item: ChapterSeed): string {
    if (item.slug && typeof item.slug === "string" && item.slug.trim()) {
      return item.slug;
    }

    const comicSlug =
      (item as Record<string, unknown>).comic &&
      typeof (item as Record<string, unknown>).comic === "object"
        ? ((item as Record<string, unknown>).comic as { slug?: string }).slug
        : "";

    const chapterNumber = this.extractChapterNumber(item);

    if (comicSlug) {
      return `${comicSlug}-chapter-${chapterNumber}`;
    }

    return `chapter-${chapterNumber}-${Date.now()}`;
  }

  /**
   * Extract chapter number from various formats
   * @param item
   */
  private extractChapterNumber(item: ChapterSeed): number {
    // Try direct number field
    if (typeof (item as Record<string, unknown>).chapterNumber === "number") {
      return (item as Record<string, unknown>).chapterNumber as number;
    }

    if (typeof (item as Record<string, unknown>).number === "number") {
      return (item as Record<string, unknown>).number as number;
    }

    // Try extracting from name
    if (item.name) {
      const match = item.name.match(/chapter\s*(\d+)/i);
      if (match && match[1]) {
        return Number.parseInt(match[1], 10);
      }

      // Try just number
      const numberMatch = item.name.match(/(\d+)/);
      if (numberMatch && numberMatch[1]) {
        return Number.parseInt(numberMatch[1], 10);
      }
    }

    return 1;
  }

  /**
   * Get comic ID by slug
   * @param slug
   */
  private async getComicIdBySlug(slug: string): Promise<number | null> {
    if (this.comicCache.has(slug)) {
      return this.comicCache.get(slug)!;
    }

    const existing = await database.select().from(comic).where(eq(comic.slug, slug)).limit(1);

    if (existing.length > 0) {
      this.comicCache.set(slug, existing[0].id);
      return existing[0].id;
    }

    return null;
  }

  /**
   * Extract images from chapter data
   * @param item
   */
  private extractImages(item: ChapterSeed): string[] {
    const images: string[] = [];

    if (Array.isArray((item as Record<string, unknown>).images)) {
      const imageArray = (item as Record<string, unknown>).images as Array<
        { url?: string } | string
      >;
      for (const img of imageArray) {
        if (typeof img === "string") {
          images.push(img);
        } else if (img && typeof img === "object" && img.url) {
          images.push(img.url);
        }
      }
    }

    return images;
  }

  /**
   * Insert batch with comic relations
   * @param batch
   * @param options
   */
  protected async insertBatch(
    batch: ChapterSeed[],
    options: SeedOptions
  ): Promise<Omit<SeedResult, "duration">> {
    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const item of batch) {
      try {
        const prepared = this.prepareData(item);

        // Get comic ID
        if (
          (item as Record<string, unknown>).comic &&
          typeof (item as Record<string, unknown>).comic === "object"
        ) {
          const comicSlug = ((item as Record<string, unknown>).comic as { slug?: string }).slug;
          if (comicSlug) {
            const comicId = await this.getComicIdBySlug(comicSlug);
            if (comicId) {
              prepared.comicId = comicId;
            } else {
              logger.warn(`Comic not found for slug: ${comicSlug}`);
              errors++;
              continue;
            }
          }
        }

        if (!prepared.comicId) {
          logger.warn(`No comic ID for chapter: ${prepared.title}`);
          errors++;
          continue;
        }

        // Note: Images are handled separately as chapterImage relation
        // Chapter schema doesn't have a content field

        // Check if chapter exists
        const existing = await database
          .select()
          .from(chapter)
          .where(eq(chapter.slug, prepared.slug))
          .limit(1);

        if (existing.length > 0) {
          if (options.forceOverwrite) {
            // Update existing
            await database
              .update(chapter)
              .set({
                ...prepared,
              })
              .where(eq(chapter.slug, prepared.slug));
            updated++;
          } else {
            skipped++;
          }
        } else {
          // Insert new
          await database.insert(chapter).values(prepared);
          inserted++;
        }
      } catch (error) {
        logger.warn(`Failed to insert chapter: ${error}`);
        errors++;
      }
    }

    return { inserted, updated, skipped, errors };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.comicCache.clear();
  }
}

// ═══════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════

export { ChapterSeederEnhanced as ChapterSeeder };
export default ChapterSeederEnhanced;
