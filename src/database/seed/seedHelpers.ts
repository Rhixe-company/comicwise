/**
 * Seed Helpers - Dynamic seeding utilities with upsert support
 *
 * Provides optimized seeding functions that:
 * - Load data from JSON files
 * - Validate with Zod schemas
 * - Use upsert logic (update if exists, insert if not)
 * - Support batch processing
 * - Track progress with detailed logging
 */

import type { ChapterSeed, ComicSeed, UserSeed } from "lib/validations";
import { parseCLIArgs } from "./config";
import { logger } from "./logger";
import { ChapterSeeder } from "./seeders/chapterSeeder";
import { ComicSeeder } from "./seeders/comicSeeder";
import { UserSeeder } from "./seeders/userSeeder";
import { fileUtils } from "./utils/fileUtils";
import { metadataCache } from "./utils/metadataCache";

export interface SeedOptions {
  batchSize?: number;
  verbose?: boolean;
  dryRun?: boolean;
  skipValidation?: boolean;
  skipImageDownload?: boolean;
}

export interface SeedResult {
  inserted: number;
  updated: number;
  skipped: number;
  errors: number;
  duration: number;
}

/**
 * Seed users from JSON files
 */
export async function seedUsers(options: SeedOptions = {}): Promise<SeedResult> {
  const startTime = Date.now();
  const config = parseCLIArgs([]);

  try {
    logger.section("Loading Users Data");

    const usersData = await fileUtils.readMultipleJsonFiles<unknown>(["./users.json"]);

    logger.info(`Loaded ${usersData.length} users from JSON files`);

    if (options.dryRun) {
      logger.info("DRY RUN MODE - No data will be inserted");
      return {
        inserted: 0,
        updated: 0,
        skipped: usersData.length,
        errors: 0,
        duration: Date.now() - startTime,
      };
    }

    const seeder = new UserSeeder(config.options);
    await seeder.seed(usersData as UserSeed[]);

    return {
      inserted: usersData.length,
      updated: 0,
      skipped: 0,
      errors: 0,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    logger.error(`Failed to seed users: ${error}`);
    throw error;
  }
}

/**
 * Seed comics from JSON files
 */
export async function seedComics(options: SeedOptions = {}): Promise<SeedResult> {
  const startTime = Date.now();
  const config = parseCLIArgs([]);

  try {
    logger.section("Loading Comics Data");

    const comicsData = await fileUtils.readMultipleJsonFiles<unknown>([
      "./comics.json",
      "./comicsdata.json",
      "./comicsdata1.json",
      "./comicsdata2.json",
    ]);

    logger.info(`Loaded ${comicsData.length} comics from JSON files`);

    if (options.dryRun) {
      logger.info("DRY RUN MODE - No data will be inserted");
      return {
        inserted: 0,
        updated: 0,
        skipped: comicsData.length,
        errors: 0,
        duration: Date.now() - startTime,
      };
    }

    const seeder = new ComicSeeder(metadataCache, config.options);
    await seeder.seed(comicsData as ComicSeed[]);

    return {
      inserted: comicsData.length,
      updated: 0,
      skipped: 0,
      errors: 0,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    logger.error(`Failed to seed comics: ${error}`);
    throw error;
  }
}

/**
 * Seed chapters from JSON files
 */
export async function seedChapters(options: SeedOptions = {}): Promise<SeedResult> {
  const startTime = Date.now();
  const config = parseCLIArgs([]);

  try {
    logger.section("Loading Chapters Data");

    const chaptersData = await fileUtils.readMultipleJsonFiles<unknown>([
      "./chapters.json",
      "./chaptersdata.json",
      "./chaptersdata1.json",
      "./chaptersdata2.json",
    ]);

    logger.info(`Loaded ${chaptersData.length} chapters from JSON files`);

    if (options.dryRun) {
      logger.info("DRY RUN MODE - No data will be inserted");
      return {
        inserted: 0,
        updated: 0,
        skipped: chaptersData.length,
        errors: 0,
        duration: Date.now() - startTime,
      };
    }

    const comicSeeder = new ComicSeeder(metadataCache, config.options);
    const chapterSeeder = new ChapterSeeder(config.options);
    await chapterSeeder.seed(chaptersData as ChapterSeed[]);

    return {
      inserted: chaptersData.length,
      updated: 0,
      skipped: 0,
      errors: 0,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    logger.error(`Failed to seed chapters: ${error}`);
    throw error;
  }
}

/**
 * Seed all entities (users, comics, chapters)
 */
export async function seedAll(options: SeedOptions = {}): Promise<void> {
  logger.header("Seeding All Entities");

  const usersResult = await seedUsers(options);
  logger.success(
    `Users: ${usersResult.inserted} inserted, ${usersResult.skipped} skipped (${usersResult.duration}ms)\n`
  );

  const comicsResult = await seedComics(options);
  logger.success(
    `Comics: ${comicsResult.inserted} inserted, ${comicsResult.skipped} skipped (${comicsResult.duration}ms)\n`
  );

  const chaptersResult = await seedChapters(options);
  logger.success(
    `Chapters: ${chaptersResult.inserted} inserted, ${chaptersResult.skipped} skipped (${chaptersResult.duration}ms)\n`
  );
}

export type { ChapterSeed, ComicSeed, UserSeed };
