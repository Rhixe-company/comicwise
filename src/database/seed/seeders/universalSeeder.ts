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
import { hashPassword } from "auth";
import { and, eq } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";
import { logger } from "../logger";

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
  rating: z.coerce.number().optional(),
  serialization: z.string().optional(),
  updatedAt: z.string().optional(),
  url: z.string().url().optional(),
  images: z.array(z.object({ url: z.string().url() })).optional(),
  image_urls: z.array(z.string().url()).optional(),
  type: z.object({ name: z.string() }).optional(),
  category: z.string().optional(),
  author: z.union([z.object({ name: z.string() }), z.string()]).optional(),
  artist: z.union([z.object({ name: z.string() }), z.string()]).optional(),
  genres: z.array(z.union([z.object({ name: z.string() }), z.string()])),
});

const ChapterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  chapterNumber: z.coerce.number(),
  releaseDate: z.coerce.date().optional(),
  views: z.number().optional(),
  comicSlug: z.string().optional(),
  content: z.string().optional(),
  images: z.array(z.string().url()).optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// IMAGE DOWNLOAD & UPLOAD HELPERS
// ═══════════════════════════════════════════════════════════════════════════

async function downloadAndUploadImage(
  imageUrl: string,
  folder: string,
  fileName: string
): Promise<string | null> {
  try {
    // If ImageKit is not configured, return original URL
    const imageKitConfig = appConfig.upload.imageKit;
    if (!imageKitConfig || !imageKitConfig.publicKey) {
      logger.info(`ImageKit not configured, using original URL: ${imageUrl}`);
      return imageUrl;
    }

    // Download image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      logger.warn(`Failed to download image: ${imageUrl}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to ImageKit
    const ImageKit = (await import("imagekit")).default;
    const imagekit = new ImageKit({
      publicKey: imageKitConfig.publicKey,
      privateKey: imageKitConfig.privateKey,
      urlEndpoint: imageKitConfig.urlEndpoint,
    });

    const uploadResult = await imagekit.upload({
      file: buffer,
      fileName: fileName,
      folder: `comicwise/${folder}`,
    });

    logger.success(`Uploaded image: ${uploadResult.url}`);
    return uploadResult.url;
  } catch (error) {
    logger.error(`Error uploading image ${imageUrl}:`, error);
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
          logger.error(`Failed to process user:`, error);
        }
      }
    } catch (error) {
      logger.error(`Failed to read ${jsonFile}:`, error);
    }
  }

  logger.success(
    `✅ Users seeding complete: ${totalProcessed} processed, ${totalCreated} created, ${totalUpdated} updated`
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SEED COMICS
// ═══════════════════════════════════════════════════════════════════════════

export async function seedComicsFromJSON(
  jsonFiles: string[] = ["comics.json", "comicsdata1.json", "comicsdata2.json"]
) {
  logger.info("🌱 Seeding comics from JSON files...");

  let totalProcessed = 0;
  let totalCreated = 0;
  let totalUpdated = 0;

  for (const jsonFile of jsonFiles) {
    try {
      const filePath = path.join(process.cwd(), jsonFile);

      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        logger.warn(`File not found: ${jsonFile}, skipping...`);
        continue;
      }

      const fileContent = await fs.readFile(filePath, "utf-8");
      const rawData = JSON.parse(fileContent);
      const comicsData = Array.isArray(rawData) ? rawData : [rawData];

      logger.info(`Processing ${comicsData.length} comics from ${jsonFile}`);

      for (const comicData of comicsData) {
        try {
          const validatedComic = ComicSchema.parse(comicData);

          // Download and upload cover image
          let coverImageUrl = validatedComic.coverImage;
          if (!coverImageUrl && validatedComic.images && validatedComic.images.length > 0) {
            coverImageUrl = validatedComic.images[0]?.url;
          }
          if (!coverImageUrl && validatedComic.image_urls && validatedComic.image_urls.length > 0) {
            coverImageUrl = validatedComic.image_urls[0];
          }

          let uploadedCoverImage = coverImageUrl;
          if (coverImageUrl && appConfig.upload.imageKit?.enabled) {
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

          // Check if comic exists
          const existingComic = await db.query.comic.findFirst({
            where: eq(comic.slug, validatedComic.slug),
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
            logger.success(`✓ Updated comic: ${validatedComic.title}`);
          } else {
            // Create new comic
            const [newComic] = await db.insert(comic).values(comicPayload).returning();
            comicId = newComic!.id;
            totalCreated++;
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
        } catch (error) {
          logger.error(`Failed to process comic:`, error);
        }
      }
    } catch (error) {
      logger.error(`Failed to read ${jsonFile}:`, error);
    }
  }

  logger.success(
    `✅ Comics seeding complete: ${totalProcessed} processed, ${totalCreated} created, ${totalUpdated} updated`
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SEED CHAPTERS
// ═══════════════════════════════════════════════════════════════════════════

export async function seedChaptersFromJSON(
  jsonFiles: string[] = ["chapters.json", "chaptersdata1.json", "chaptersdata2.json"]
) {
  logger.info("🌱 Seeding chapters from JSON files...");

  let totalProcessed = 0;
  let totalCreated = 0;
  let totalUpdated = 0;

  for (const jsonFile of jsonFiles) {
    try {
      const filePath = path.join(process.cwd(), jsonFile);

      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        logger.warn(`File not found: ${jsonFile}, skipping...`);
        continue;
      }

      const fileContent = await fs.readFile(filePath, "utf-8");
      const rawData = JSON.parse(fileContent);
      const chaptersData = Array.isArray(rawData) ? rawData : [rawData];

      logger.info(`Processing ${chaptersData.length} chapters from ${jsonFile}`);

      for (const chapterData of chaptersData) {
        try {
          const validatedChapter = ChapterSchema.parse(chapterData);

          // Find comic by slug
          const comicRecord = await db.query.comic.findFirst({
            where: eq(comic.slug, validatedChapter.comicSlug || ""),
          });

          if (!comicRecord) {
            logger.warn(`Comic not found for chapter: ${validatedChapter.title}`);
            continue;
          }

          // Check if chapter exists
          const existingChapter = await db.query.chapter.findFirst({
            where: and(
              eq(chapter.comicId, comicRecord.id),
              eq(chapter.slug, validatedChapter.slug)
            ),
          });

          const chapterPayload = {
            title: validatedChapter.title,
            slug: validatedChapter.slug,
            chapterNumber: validatedChapter.chapterNumber,
            releaseDate: validatedChapter.releaseDate || new Date(),
            views: validatedChapter.views || 0,
            comicId: comicRecord.id,
          };

          if (existingChapter) {
            // Update existing chapter
            await db.update(chapter).set(chapterPayload).where(eq(chapter.id, existingChapter.id));
            totalUpdated++;
            logger.success(`✓ Updated chapter: ${validatedChapter.title}`);
          } else {
            // Create new chapter
            await db.insert(chapter).values(chapterPayload);
            totalCreated++;
            logger.success(`✓ Created chapter: ${validatedChapter.title}`);
          }

          totalProcessed++;
        } catch (error) {
          logger.error(`Failed to process chapter:`, error);
        }
      }
    } catch (error) {
      logger.error(`Failed to read ${jsonFile}:`, error);
    }
  }

  logger.success(
    `✅ Chapters seeding complete: ${totalProcessed} processed, ${totalCreated} created, ${totalUpdated} updated`
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN UNIVERSAL SEEDER
// ═══════════════════════════════════════════════════════════════════════════

export async function seedAllFromJSON() {
  logger.info("🚀 Starting universal JSON seeding...");

  // Seed users
  await seedUsersFromJSON(["users.json"]);

  // Seed comics
  await seedComicsFromJSON(["comics.json", "comicsdata1.json", "comicsdata2.json"]);

  // Seed chapters
  await seedChaptersFromJSON(["chapters.json", "chaptersdata1.json", "chaptersdata2.json"]);

  logger.success("✅ All JSON seeding complete!");
}
