/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Universal Seeder - Dynamic JSON Data Import System
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Handles multiple JSON data sources:
 * - users.json
 * - comics.json, comicsdata1.json, comicsdata2.json
 * - chapters.json, chaptersdata1.json, chaptersdata2.json
 *
 * Features:
 * - Dynamic data loading from multiple files
 * - Image downloading and uploading to ImageKit
 * - Upsert logic (create or update existing records)
 * - Zod validation
 * - Progress tracking
 * - Error handling and recovery
 */

import appConfig from "@/appConfig";
import { db } from "@/database";
import {
  artist,
  author,
  chapter,
  comic,
  comicToGenre,
  type as comicType,
  genre,
  user,
} from "@/database/schema";
import { imageService } from "@/services/imageService";
import { hashPassword } from "auth";
import { and, eq } from "drizzle-orm";
import fs from "fs/promises";
import { glob } from "glob";
import path from "path";
import { z } from "zod";
import { logger } from "../logger";
import imageCache from "../utils/imageCache";

// Destructure imageCache utilities
const { getImageHash, getCachedUrl, getCachedByHash, cacheImage, getCacheStats, clearCache } =
  imageCache;

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Discover JSON files matching a pattern
 */
async function discoverJSONFiles(pattern: string): Promise<string[]> {
  try {
    const files = await glob(pattern, { cwd: process.cwd() });
    return files.sort(); // Sort alphabetically for consistent processing
  } catch (error) {
    logger.error(`Failed to discover files matching ${pattern}: ${error}`);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

const UserSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email(),
  name: z.string(),
  password: z.string().optional(),
  role: z.enum(["user", "admin", "moderator"]).default("user"),
  image: z.string().nullable().optional(),
  emailVerified: z.coerce.date().nullable().optional(),
  status: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

const ComicSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  coverImage: z.string().optional(),
  status: z.enum(["Ongoing", "Completed", "Hiatus", "Dropped", "Coming Soon"]).default("Ongoing"),
  rating: z.coerce.number().max(9.99).optional(),
  serialization: z.string().optional(),
  updatedAt: z.string().optional(),
  url: z.string().url().optional(),
  images: z.array(z.object({ url: z.string().url() })).optional(),
  image_urls: z.array(z.string().url()).optional(),
  type: z.object({ name: z.string() }).optional(),
  category: z.string().optional(),
  author: z.union([z.object({ name: z.string() }), z.string()]).optional(),
  artist: z.union([z.object({ name: z.string() }), z.string()]).optional(),
  genres: z.array(z.union([z.object({ name: z.string() }), z.string()])).default([]),
});

const ChapterSchema = z.object({
  // Format 1: chapters.json (nested comic object)
  name: z.string().optional(), // "Chapter 273"
  title: z.string().optional(), // "91. Divine Relic (1)"
  url: z.string().url().optional(),
  slug: z.string().optional(),
  chapterNumber: z.coerce.number().optional(),
  releaseDate: z.coerce.date().optional(),
  updatedAt: z.string().optional(),
  updated_at: z.string().optional(),
  views: z.number().optional(),
  comic: z
    .object({
      title: z.string(),
      slug: z.string(),
    })
    .optional(),
  comicSlug: z.string().optional(),
  content: z.string().optional(),
  images: z.array(z.object({ url: z.string().url() })).optional(),

  // Format 2: chaptersdata*.json (direct properties)
  comictitle: z.string().optional(),
  comicslug: z.string().optional(),
  chaptername: z.string().optional(),
  chapterslug: z.string().optional(),
  image_urls: z.array(z.string().url()).optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// IMAGE DOWNLOAD & UPLOAD HELPERS - Using Image Service with Cache
// ═══════════════════════════════════════════════════════════════════════════

async function downloadAndUploadImage(
  imageUrl: string,
  folder: string,
  fileName: string
): Promise<string | null> {
  try {
    // Check URL cache first - exact URL match (most efficient)
    const cachedUrl = getCachedUrl(imageUrl);
    if (cachedUrl) {
      logger.info(`✓ Cache hit (URL): ${imageUrl}`);
      return cachedUrl;
    }

    // Use imageService for download and upload (handles all providers)
    // This downloads once and uploads to the configured provider
    const result = await imageService.downloadImage(imageUrl, `comicwise/${folder}`);

    if (!result.success || !result.localPath) {
      logger.warn(`Image service failed: ${result.error || "Unknown error"}`);
      return imageUrl; // Fallback to original URL
    }

    const uploadedUrl = result.localPath;

    // Download again to get hash for deduplication check
    // This is necessary to detect duplicate images from different URLs
    try {
      const response = await fetch(imageUrl);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const imageHash = getImageHash(buffer);

        // Check if we already have this image content
        const cachedByHash = getCachedByHash(imageHash);
        if (cachedByHash && cachedByHash !== uploadedUrl) {
          logger.info(`✓ Duplicate detected after upload (different URL, same content)`);
          logger.info(`  Uploaded: ${uploadedUrl}, Will use: ${cachedByHash}`);
          // Return the already cached version to maintain consistency
          cacheImage(imageUrl, cachedByHash, imageHash);
          return cachedByHash;
        }

        // Cache both URL and hash for future lookups
        cacheImage(imageUrl, uploadedUrl, imageHash);
      }
    } catch (hashError) {
      // Hash calculation failed, but upload succeeded - still cache by URL
      logger.warn(`Hash calculation failed: ${hashError}`);
      cacheImage(imageUrl, uploadedUrl);
    }

    logger.success(`✓ Image uploaded via imageService: ${uploadedUrl}`);
    return uploadedUrl;
  } catch (error) {
    logger.error(`Error processing image ${imageUrl}: ${error}`);
    return imageUrl; // Fallback to original URL
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FIND OR CREATE HELPERS
// ═══════════════════════════════════════════════════════════════════════════

async function findOrCreateAuthor(authorName: string): Promise<number> {
  if (!authorName || authorName === "_") {
    authorName = "Unknown Author";
  }

  const existing = await db.query.author.findFirst({
    where: eq(author.name, authorName),
  });

  if (existing) {
    return existing.id;
  }

  const [newAuthor] = await db
    .insert(author)
    .values({
      name: authorName,
      bio: null,
    })
    .returning();

  return newAuthor!.id;
}

async function findOrCreateArtist(artistName: string): Promise<number> {
  if (!artistName || artistName === "_") {
    artistName = "Unknown Artist";
  }

  const existing = await db.query.artist.findFirst({
    where: eq(artist.name, artistName),
  });

  if (existing) {
    return existing.id;
  }

  const [newArtist] = await db
    .insert(artist)
    .values({
      name: artistName,
      bio: null,
    })
    .returning();

  return newArtist!.id;
}

async function findOrCreateType(typeName: string): Promise<number> {
  if (!typeName || typeName === "_") {
    typeName = "Unknown Type";
  }

  const existing = await db.query.type.findFirst({
    where: eq(comicType.name, typeName),
  });

  if (existing) {
    return existing.id;
  }

  const [newType] = await db
    .insert(comicType)
    .values({
      name: typeName,
      description: null,
    })
    .returning();

  return newType!.id;
}

async function findOrCreateGenre(genreName: string): Promise<number> {
  if (!genreName || genreName === "_") {
    genreName = "Unknown Genre";
  }

  const existing = await db.query.genre.findFirst({
    where: eq(genre.name, genreName),
  });

  if (existing) {
    return existing.id;
  }

  const [newGenre] = await db
    .insert(genre)
    .values({
      name: genreName,
      description: null,
    })
    .returning();

  return newGenre!.id;
}

// ═══════════════════════════════════════════════════════════════════════════
// SEED USERS
// ═══════════════════════════════════════════════════════════════════════════

export async function seedUsersFromJSON(jsonFiles: string[] = ["users.json"]) {
  logger.info("🌱 Seeding users from JSON files...");

  let totalProcessed = 0;
  let totalCreated = 0;
  let totalUpdated = 0;

  for (const jsonFile of jsonFiles) {
    try {
      const filePath = path.join(process.cwd(), jsonFile);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const rawData = JSON.parse(fileContent);
      const usersData = Array.isArray(rawData) ? rawData : [rawData];

      logger.info(`Processing ${usersData.length} users from ${jsonFile}`);

      for (const userData of usersData) {
        try {
          const validatedUser = UserSchema.parse(userData);

          // Check if user exists
          const existingUser = await db.query.user.findFirst({
            where: eq(user.email, validatedUser.email),
          });

          const userPayload = {
            email: validatedUser.email,
            name: validatedUser.name,
            role: validatedUser.role,
            image: validatedUser.image ?? null,
            emailVerified: validatedUser.emailVerified ?? new Date(),
            password: validatedUser.password
              ? await hashPassword(validatedUser.password)
              : await hashPassword(appConfig.customPassword || "Password123!"),
          };

          if (existingUser) {
            // Update existing user
            await db
              .update(user)
              .set({
                ...userPayload,
                updatedAt: new Date(),
              })
              .where(eq(user.id, existingUser.id));
            totalUpdated++;
            logger.success(`✓ Updated user: ${validatedUser.email}`);
          } else {
            // Create new user
            await db.insert(user).values(userPayload);
            totalCreated++;
            logger.success(`✓ Created user: ${validatedUser.email}`);
          }

          totalProcessed++;
        } catch (error) {
          logger.error(`Failed to process user: ${error}`);
        }
      }
    } catch (error) {
      logger.error(`Failed to read ${jsonFile}: ${error}`);
    }
  }

  logger.success(
    `✅ Users seeding complete: ${totalProcessed} processed, ${totalCreated} created, ${totalUpdated} updated`
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SEED COMICS
// ═══════════════════════════════════════════════════════════════════════════

export async function seedComicsFromJSON(pattern: string = "comics*.json") {
  logger.info("🌱 Seeding comics from JSON files...");

  // Discover all matching files
  const jsonFiles = await discoverJSONFiles(pattern);
  if (jsonFiles.length === 0) {
    logger.warn(`No files found matching pattern: ${pattern}`);
    return;
  }

  logger.info(`📁 Discovered ${jsonFiles.length} file(s): ${jsonFiles.join(", ")}`);

  let totalProcessed = 0;
  let totalCreated = 0;
  let totalUpdated = 0;
  let totalErrors = 0;
  const fileResults: Record<
    string,
    { processed: number; created: number; updated: number; errors: number }
  > = {};

  for (const jsonFile of jsonFiles) {
    const fileStats = { processed: 0, created: 0, updated: 0, errors: 0 };

    try {
      const filePath = path.join(process.cwd(), jsonFile);

      const fileContent = await fs.readFile(filePath, "utf-8");
      const rawData = JSON.parse(fileContent);
      const comicsData = Array.isArray(rawData) ? rawData : [rawData];

      logger.info(`📖 Processing ${comicsData.length} comic(s) from ${jsonFile}`);

      for (const comicData of comicsData) {
        try {
          // Preprocess: Normalize status field
          const normalizedData = { ...comicData };
          if (normalizedData.status && typeof normalizedData.status === "string") {
            const validStatuses = ["Ongoing", "Completed", "Hiatus", "Dropped", "Coming Soon"];
            if (!validStatuses.includes(normalizedData.status)) {
              logger.warn(
                `Invalid status "${normalizedData.status}" for ${comicData.title || comicData.slug}, defaulting to "Ongoing"`
              );
              normalizedData.status = "Ongoing";
            }
          }

          // Preprocess: Clamp rating to max 9.99
          if (normalizedData.rating && parseFloat(normalizedData.rating) > 9.99) {
            logger.warn(
              `Rating ${normalizedData.rating} exceeds max for ${comicData.title || comicData.slug}, clamping to 9.99`
            );
            normalizedData.rating = 9.99;
          }

          const validatedComic = ComicSchema.parse(normalizedData);

          // Download and upload cover image if URL exists
          let coverImageUrl = validatedComic.coverImage;
          if (!coverImageUrl && validatedComic.images && validatedComic.images.length > 0) {
            coverImageUrl = validatedComic.images[0]?.url;
          }
          if (!coverImageUrl && validatedComic.image_urls && validatedComic.image_urls.length > 0) {
            coverImageUrl = validatedComic.image_urls[0];
          }

          let uploadedCoverImage = coverImageUrl;
          // Only upload external images (http/https), not local paths
          if (
            coverImageUrl &&
            (coverImageUrl.startsWith("http://") || coverImageUrl.startsWith("https://"))
          ) {
            const uploaded = await downloadAndUploadImage(
              coverImageUrl,
              "covers",
              `${validatedComic.slug}.webp`
            );
            if (uploaded) {
              uploadedCoverImage = uploaded;
            }
          }

          // Process author
          let authorName = "Unknown Author";
          if (validatedComic.author) {
            if (typeof validatedComic.author === "string") {
              authorName = validatedComic.author;
            } else if (validatedComic.author.name) {
              authorName = validatedComic.author.name;
            }
          }
          const authorId = await findOrCreateAuthor(authorName);

          // Process artist
          let artistName = "Unknown Artist";
          if (validatedComic.artist) {
            if (typeof validatedComic.artist === "string") {
              artistName = validatedComic.artist;
            } else if (validatedComic.artist.name) {
              artistName = validatedComic.artist.name;
            }
          }
          const artistId = await findOrCreateArtist(artistName);

          // Process type
          const typeName = validatedComic.type?.name || validatedComic.category || "Unknown Type";
          const typeId = await findOrCreateType(typeName);

          // Process genres
          const genreIds: number[] = [];
          for (const genre of validatedComic.genres || []) {
            const genreName = typeof genre === "string" ? genre : genre.name;
            const genreId = await findOrCreateGenre(genreName);
            genreIds.push(genreId);
          }

          // Check if comic exists by slug or title (both have unique constraints)
          const existingComic = await db.query.comic.findFirst({
            where: (table, { eq, or }) =>
              or(eq(table.slug, validatedComic.slug), eq(table.title, validatedComic.title)),
          });

          const comicPayload = {
            title: validatedComic.title,
            slug: validatedComic.slug,
            description: validatedComic.description,
            coverImage: uploadedCoverImage || "",
            status: validatedComic.status,
            rating: validatedComic.rating ? validatedComic.rating.toString() : "0",
            authorId,
            artistId,
            typeId,
            publicationDate: new Date(),
          };

          let comicId: number;

          if (existingComic) {
            // Update existing comic
            await db
              .update(comic)
              .set({
                title: comicPayload.title,
                description: comicPayload.description,
                coverImage: comicPayload.coverImage,
                status: comicPayload.status,
                rating: comicPayload.rating ? comicPayload.rating.toString() : "0",
                authorId: comicPayload.authorId,
                artistId: comicPayload.artistId,
                typeId: comicPayload.typeId,
                publicationDate: comicPayload.publicationDate,
                updatedAt: new Date(),
              })
              .where(eq(comic.id, existingComic.id));
            comicId = existingComic.id;
            totalUpdated++;
            fileStats.updated++;
            logger.success(`✓ Updated comic: ${validatedComic.title}`);
          } else {
            // Create new comic
            const [newComic] = await db.insert(comic).values(comicPayload).returning();
            comicId = newComic!.id;
            totalCreated++;
            fileStats.created++;
            logger.success(`✓ Created comic: ${validatedComic.title}`);
          }

          // Update comic-genre relationships
          await db.delete(comicToGenre).where(eq(comicToGenre.comicId, comicId));

          for (const genreId of genreIds) {
            await db
              .insert(comicToGenre)
              .values({
                comicId,
                genreId,
              })
              .onConflictDoNothing();
          }

          totalProcessed++;
          fileStats.processed++;
        } catch (error) {
          totalErrors++;
          fileStats.errors++;
          logger.error(`Failed to process comic: ${error}`);
        }
      }

      // Store file results
      fileResults[jsonFile] = fileStats;
      logger.info(
        `✓ ${jsonFile}: ${fileStats.processed} processed, ${fileStats.created} created, ${fileStats.updated} updated, ${fileStats.errors} errors`
      );
    } catch (error) {
      totalErrors++;
      logger.error(`Failed to read ${jsonFile}: ${error}`);
      fileResults[jsonFile] = { processed: 0, created: 0, updated: 0, errors: 1 };
    }
  }

  // Summary report
  logger.success(
    `✅ Comics seeding complete: ${totalProcessed} processed, ${totalCreated} created, ${totalUpdated} updated, ${totalErrors} errors`
  );

  // Detailed file breakdown
  if (Object.keys(fileResults).length > 0) {
    logger.info("\n📊 Detailed File Results:");
    for (const [file, stats] of Object.entries(fileResults)) {
      logger.info(
        `   ${file}: ${stats.processed} processed, ${stats.created} created, ${stats.updated} updated, ${stats.errors} errors`
      );
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SEED CHAPTERS
// ═══════════════════════════════════════════════════════════════════════════

export async function seedChaptersFromJSON(pattern: string = "chapters*.json") {
  logger.info("🌱 Seeding chapters from JSON files...");

  // Discover all matching files
  const jsonFiles = await discoverJSONFiles(pattern);
  if (jsonFiles.length === 0) {
    logger.warn(`No files found matching pattern: ${pattern}`);
    return;
  }

  logger.info(`📁 Discovered ${jsonFiles.length} file(s): ${jsonFiles.join(", ")}`);

  let totalProcessed = 0;
  let totalCreated = 0;
  let totalUpdated = 0;
  let totalErrors = 0;
  let totalSkipped = 0;
  const fileResults: Record<
    string,
    { processed: number; created: number; updated: number; errors: number; skipped: number }
  > = {};

  for (const jsonFile of jsonFiles) {
    const fileStats = { processed: 0, created: 0, updated: 0, errors: 0, skipped: 0 };

    try {
      const filePath = path.join(process.cwd(), jsonFile);

      const fileContent = await fs.readFile(filePath, "utf-8");
      const rawData = JSON.parse(fileContent);
      const chaptersData = Array.isArray(rawData) ? rawData : [rawData];

      logger.info(`📖 Processing ${chaptersData.length} chapter(s) from ${jsonFile}`);

      for (const chapterData of chaptersData) {
        try {
          const validatedChapter = ChapterSchema.parse(chapterData);

          // Transform data: handle both formats
          const chapterName = validatedChapter.chaptername || validatedChapter.name || "";
          const chapterTitle =
            validatedChapter.title || validatedChapter.chaptername || chapterName;
          const chapterNumber = chapterName.match(/chapter\s+(\d+)/i)?.[1]
            ? parseInt(chapterName.match(/chapter\s+(\d+)/i)![1])
            : validatedChapter.chapterNumber || 0;
          const chapterSlug =
            validatedChapter.chapterslug ||
            validatedChapter.slug ||
            `${chapterName}-${chapterTitle}`
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "");
          const comicSlug =
            validatedChapter.comicslug ||
            validatedChapter.comic?.slug ||
            validatedChapter.comicSlug ||
            "";

          if (!comicSlug) {
            logger.warn(`⚠ Missing comic slug for chapter: ${chapterTitle}`);
            totalSkipped++;
            fileStats.skipped++;
            continue;
          }

          // Find comic by slug
          const comicRecord = await db.query.comic.findFirst({
            where: eq(comic.slug, comicSlug),
          });

          if (!comicRecord) {
            logger.warn(`⚠ Comic not found for chapter: ${chapterTitle} (comic: ${comicSlug})`);
            totalSkipped++;
            fileStats.skipped++;
            continue;
          }

          // Check if chapter exists
          const existingChapter = await db.query.chapter.findFirst({
            where: and(eq(chapter.comicId, comicRecord.id), eq(chapter.slug, chapterSlug)),
          });

          const chapterPayload = {
            title: chapterTitle,
            slug: chapterSlug,
            chapterNumber: chapterNumber,
            releaseDate: validatedChapter.releaseDate || new Date(),
            views: validatedChapter.views || 0,
            comicId: comicRecord.id,
          };

          if (existingChapter) {
            // Update existing chapter
            await db.update(chapter).set(chapterPayload).where(eq(chapter.id, existingChapter.id));
            totalUpdated++;
            fileStats.updated++;
            logger.success(`✓ Updated chapter: ${chapterTitle} (${chapterNumber})`);
          } else {
            // Create new chapter
            await db.insert(chapter).values(chapterPayload);
            totalCreated++;
            fileStats.created++;
            logger.success(`✓ Created chapter: ${chapterTitle} (${chapterNumber})`);
          }

          totalProcessed++;
          fileStats.processed++;
        } catch (error) {
          totalErrors++;
          fileStats.errors++;
          logger.error(`Failed to process chapter: ${error}`);
        }
      }

      // Store file results
      fileResults[jsonFile] = fileStats;
      logger.info(
        `✓ ${jsonFile}: ${fileStats.processed} processed, ${fileStats.created} created, ${fileStats.updated} updated, ${fileStats.skipped} skipped, ${fileStats.errors} errors`
      );
    } catch (error) {
      totalErrors++;
      logger.error(`Failed to read ${jsonFile}: ${error}`);
      fileResults[jsonFile] = { processed: 0, created: 0, updated: 0, errors: 1, skipped: 0 };
    }
  }

  // Summary report
  logger.success(
    `✅ Chapters seeding complete: ${totalProcessed} processed, ${totalCreated} created, ${totalUpdated} updated, ${totalSkipped} skipped, ${totalErrors} errors`
  );

  // Detailed file breakdown
  if (Object.keys(fileResults).length > 0) {
    logger.info("\n📊 Detailed File Results:");
    for (const [file, stats] of Object.entries(fileResults)) {
      logger.info(
        `   ${file}: ${stats.processed} processed, ${stats.created} created, ${stats.updated} updated, ${stats.skipped} skipped, ${stats.errors} errors`
      );
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// IMAGE CACHE STATISTICS
// ═══════════════════════════════════════════════════════════════════════════

function logImageCacheStats() {
  const stats = getCacheStats();
  logger.info(`📊 Image Cache Statistics:`);
  logger.info(`   - Unique URLs cached: ${stats.urlCacheSize}`);
  logger.info(`   - Unique images by hash: ${stats.hashCacheSize}`);
  logger.info(`   - Cache hits: ${stats.cacheHits}`);
  logger.info(`   - Cache misses: ${stats.cacheMisses}`);
  logger.info(`   - Hit rate: ${stats.hitRate.toFixed(2)}%`);
  const duplicates = stats.urlCacheSize - stats.hashCacheSize;
  if (duplicates > 0) {
    logger.info(`   - Duplicate images avoided: ${duplicates}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN UNIVERSAL SEEDER
// ═══════════════════════════════════════════════════════════════════════════

export async function seedAllFromJSON() {
  logger.info("🚀 Starting universal JSON seeding...");
  logger.info("═".repeat(80));

  // Clear image cache for fresh start
  clearCache();

  // Seed users
  logger.info("\n" + "═".repeat(80));
  await seedUsersFromJSON(["users.json"]);

  // Seed comics (discover all comics*.json files)
  logger.info("\n" + "═".repeat(80));
  await seedComicsFromJSON("comics*.json");

  // Seed chapters (discover all chapters*.json files)
  logger.info("\n" + "═".repeat(80));
  await seedChaptersFromJSON("chapters*.json");

  // Log cache statistics
  logger.info("\n" + "═".repeat(80));
  logImageCacheStats();

  logger.info("═".repeat(80));
  logger.success("✅ All JSON seeding complete!");
}
