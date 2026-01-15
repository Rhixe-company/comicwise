/**
 * Enhanced Chapter Seeder
 *
 * Simplified chapter seeding with:
 * - Schema validation
 * - Image downloading and caching
 * - Upsert logic (insert or update)
 * - Uses ChapterDal for consistency
 * - Zod-based parsing
 */

import { chapterDal } from "@/dal/chapterDal";
import { logger } from "@/database/seed/logger";
import { extractImageUrls, imageCacheManager } from "@/database/seed/utils/imageSeederHelper";
import { logProgress, validateData } from "@/database/seed/utils/seederHelpers";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";

/**
 * Chapter validation schema - flexible to handle multiple formats
 */
const ChapterSchema = z
  .object({
    id: z.number().optional(),
    comicId: z.number(),
    chapterNumber: z.coerce.number().min(0),
    title: z.string().min(1),
    slug: z.string().min(1),
    content: z.string().optional(),
    views: z.coerce.number().default(0),
    status: z.enum(["Draft", "Published", "Archived"]).default("Published"),
    // Image support

    pages: z.array(z.string().url()).optional(),
    coverImage: z.string().url().optional(),
    createdAt: z.coerce.date().optional(),
    publishedAt: z.coerce.date().optional(),
    // Format 1: chapters.json (nested comic object)
    name: z.string().optional(), // "Chapter 273"

    url: z.string().url().optional(),
    releaseDate: z.coerce.date().optional(),
    updatedAt: z.string().optional(),
    updated_at: z.string().optional(),
    comic: z
      .object({
        title: z.string(),
        slug: z.string(),
      })
      .strict()
      .optional(),
    comicSlug: z.string().optional(),
    images: z
      .array(
        z
          .object({
            url: z.string().url(),
            path: z.string().optional(),
            checksum: z.string().optional(),
            status: z.string().optional(),
          })
          .strict()
      )
      .optional(),

    // Format 2: chaptersdata*.json (direct properties)
    comictitle: z.string().optional(),
    comicslug: z.string().optional(),
    chaptername: z.string().optional(),
    chaptertitle: z.string().optional(),
    chapterslug: z.string().optional(),
    image_urls: z.array(z.string().url()).optional(),
    spider: z.string().optional(),
  })
  .strict();

export type ChapterSeedData = z.infer<typeof ChapterSchema>;

/**
 * Seed chapters from JSON files
 * Handles image downloads and caching
 * @param jsonFiles
 */
export async function seedChaptersFromFiles(jsonFiles: string[] = ["chapters.json"]): Promise<{
  total: number;
  created: number;
  updated: number;
  skipped: number;
  errors: number;
}> {
  logger.info("🌱 Starting chapter seeding...");

  let totalProcessed = 0;
  let totalCreated = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const jsonFile of jsonFiles) {
    try {
      const filePath = path.join(process.cwd(), jsonFile);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const rawData = JSON.parse(fileContent);
      const chaptersData = Array.isArray(rawData) ? rawData : [rawData];

      logger.info(`Processing ${chaptersData.length} chapters from ${jsonFile}`);

      // Deduplicate by comicId + chapterNumber
      const dedupedChapters = chaptersData.filter((ch, index, array) => {
        return (
          array.findIndex(
            (c) => c.comicId === ch.comicId && c.chapterNumber === ch.chapterNumber
          ) === index
        );
      });

      const removed = chaptersData.length - dedupedChapters.length;
      if (removed > 0) {
        logger.info(`Removed ${removed} duplicate chapters`);
      }

      for (const chapterData of dedupedChapters) {
        try {
          // Validate chapter data
          const validation = await validateData(
            chapterData,
            ChapterSchema,
            `chapter: ${chapterData.comicId}-${chapterData.chapterNumber}`
          );

          if (!validation.valid) {
            totalErrors++;
            totalSkipped++;
            continue;
          }

          const validatedChapter = validation.data;

          // Extract and cache images
          const imageUrls = extractImageUrls(validatedChapter);
          const downloadedImages = await imageCacheManager.getOrDownloadImages(
            imageUrls,
            `Chapter ${validatedChapter.comicId}-${validatedChapter.chapterNumber}`
          );

          // Check if chapter exists using chapterDal
          const existing = await chapterDal.findBySlug(
            validatedChapter.comicId,
            validatedChapter.slug
          );

          if (!existing) {
            // Create new chapter
            await chapterDal.create({
              comicId: validatedChapter.comicId,
              chapterNumber: validatedChapter.chapterNumber,
              title: validatedChapter.title,
              slug: validatedChapter.slug,
              content: validatedChapter.content || null,
              views: validatedChapter.views,
              status: validatedChapter.status,
              createdAt: validatedChapter.createdAt,
              updatedAt: validatedChapter.updatedAt,
            } as any);

            totalCreated++;
            logger.debug(`Created chapter: ${validatedChapter.slug}`);
          } else {
            // Update existing chapter
            await chapterDal.update(existing.id, {
              title: validatedChapter.title,
              content: validatedChapter.content || null,
              status: validatedChapter.status,
              updatedAt: new Date(),
            } as any);

            totalUpdated++;
            logger.debug(`Updated chapter: ${validatedChapter.slug}`);
          }

          totalProcessed++;

          // Log progress every 50 items
          if (totalProcessed % 50 === 0) {
            logProgress(
              "Chapters",
              {
                processed: totalProcessed,
                created: totalCreated,
                updated: totalUpdated,
                skipped: totalSkipped,
                errors: totalErrors,
              },
              dedupedChapters.length
            );
          }
        } catch (error) {
          totalErrors++;
          logger.error(
            `Error processing chapter ${chapterData.comicId}-${chapterData.chapterNumber}: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      }

      logger.success(
        `Completed ${jsonFile}: ${totalCreated} created, ${totalUpdated} updated, ${totalSkipped} skipped`
      );
    } catch (error) {
      logger.error(
        `Failed to seed from ${jsonFile}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      totalErrors++;
    }
  }

  const result = {
    total: totalProcessed,
    created: totalCreated,
    updated: totalUpdated,
    skipped: totalSkipped,
    errors: totalErrors,
  };

  logger.success(`Chapter seeding complete: ${JSON.stringify(result)}`);
  imageCacheManager.logStats();

  return result;
}

/**
 * Seed a single chapter (useful for manual operations)
 * @param chapterData
 */
export async function seedSingleChapter(chapterData: Partial<ChapterSeedData>): Promise<boolean> {
  try {
    const validation = await validateData(
      chapterData,
      ChapterSchema,
      `single chapter: ${chapterData.comicId}-${chapterData.chapterNumber}`
    );

    if (!validation.valid) {
      return false;
    }

    const validatedChapter = validation.data;

    // Extract and cache images
    const imageUrls = extractImageUrls(validatedChapter);
    await imageCacheManager.getOrDownloadImages(
      imageUrls,
      `Chapter ${validatedChapter.comicId}-${validatedChapter.chapterNumber}`
    );

    // Use chapterDal to find existing chapter
    const existing = await chapterDal.findBySlug(validatedChapter.comicId, validatedChapter.slug);

    if (!existing) {
      await chapterDal.create(validatedChapter as any);
      logger.success(`Created single chapter: ${validatedChapter.slug}`);
    } else {
      logger.info(`Chapter already exists: ${validatedChapter.slug}`);
    }

    return true;
  } catch (error) {
    logger.error(
      `Failed to seed single chapter: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    return false;
  }
}
