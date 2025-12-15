/**
 * Seed Orchestrator
 * Coordinates the seeding process
 */

import type { SeedConfig } from "@/database/seed/config";
import { logger } from "@/database/seed/logger";
import { ChapterSeeder } from "@/database/seed/seeders/chapter-seeder";
import { ComicSeeder } from "@/database/seed/seeders/comic-seeder";
import { UserSeeder } from "@/database/seed/seeders/user-seeder";
import { fileUtils } from "@/database/seed/utils/file-utils";
import { deduplicateByKey, normalizeDate } from "@/database/seed/utils/helpers";
import { MetadataCache } from "@/database/seed/utils/metadata-cache";
import { chapterArraySchema, comicArraySchema, userArraySchema } from "@/lib/validations/seed";

export class SeedOrchestrator {
  private config: SeedConfig;
  private metadataCache: MetadataCache;

  constructor(config: SeedConfig) {
    this.config = config;
    this.metadataCache = new MetadataCache();
    logger.setVerbose(config.options.verbose);
  }

  async run() {
    const { enabled, options } = this.config;

    if (options.dryRun) {
      logger.warn("DRY RUN MODE - No changes will be made to the database");
    }

    // Seed users
    if (enabled.users) {
      await this.seedUsers();
    }

    // Seed comics (requires metadata cache)
    if (enabled.comics) {
      await this.seedComics();
    }

    // Seed chapters (requires comics to exist)
    if (enabled.chapters) {
      await this.seedChapters();
    }
  }

  private async seedUsers() {
    logger.section("Processing Users");

    try {
      // Load and validate data
      const rawUsers = await fileUtils.readMultipleJsonFiles(this.config.userFiles);
      logger.info(`Loaded ${rawUsers.length} users from files`);

      const users = userArraySchema.parse(rawUsers);
      const uniqueUsers = deduplicateByKey(users, (u) => u.email);
      logger.info(`Unique users after deduplication: ${uniqueUsers.length}`);

      if (this.config.options.dryRun) {
        logger.info("DRY RUN: Would process ${uniqueUsers.length} users");
        return;
      }

      // Process users
      const seeder = new UserSeeder(this.config.options);
      await seeder.seed(uniqueUsers);
    } catch (error) {
      logger.error(`Failed to process users: ${error}`);
      if (error instanceof Error && this.config.options.verbose) {
        logger.error(error.stack || "");
      }
    }
  }

  private async seedComics() {
    logger.section("Processing Comics");

    try {
      // Load and validate data
      const rawComics = await fileUtils.readMultipleJsonFiles(this.config.comicFiles);
      logger.info(`Loaded ${rawComics.length} comics from files`);

      // Preprocess dates and status

      const preprocessedComics = rawComics.map((comic: any) => {
        // Normalize status to valid enum value or default to "Ongoing"
        const validStatuses = ["Ongoing", "Hiatus", "Completed", "Dropped", "Coming Soon"];
        let status = "Ongoing";
        if (comic.status && typeof comic.status === "string") {
          // Try to match status case-insensitively
          const matchedStatus = validStatuses.find(
            (s) => s.toLowerCase() === comic.status.toLowerCase()
          );
          if (matchedStatus) {
            status = matchedStatus;
          }
        }

        return {
          ...comic,
          status,
          publicationDate: comic.publicationDate ? normalizeDate(comic.publicationDate) : undefined,
          updatedAt: comic.updatedAt ? normalizeDate(comic.updatedAt) : undefined,
          updated_at: comic.updated_at ? normalizeDate(comic.updated_at) : undefined,
        };
      });

      const comics = comicArraySchema.parse(preprocessedComics);
      const uniqueComics = deduplicateByKey(comics, (c) => c.title);
      logger.info(`Unique comics after deduplication: ${uniqueComics.length}`);

      if (this.config.options.dryRun) {
        logger.info(`DRY RUN: Would process ${uniqueComics.length} comics`);
        return;
      }

      // Process comics
      const seeder = new ComicSeeder(this.metadataCache, this.config.options);
      await seeder.seed(uniqueComics);
    } catch (error) {
      logger.error(`Failed to process comics: ${error}`);
      if (error instanceof Error && this.config.options.verbose) {
        logger.error(error.stack || "");
      }
    }
  }

  private async seedChapters() {
    logger.section("Processing Chapters");

    try {
      // Load and validate data
      const rawChapters = await fileUtils.readMultipleJsonFiles(this.config.chapterFiles);
      logger.info(`Loaded ${rawChapters.length} chapters from files`);

      // Preprocess dates

      interface RawChapter {
        releaseDate?: string;
        updatedAt?: string;
        updated_at?: string;
        [key: string]: unknown;
      }

      const preprocessedChapters = (rawChapters as RawChapter[]).map((chapter: RawChapter) => ({
        ...chapter,
        releaseDate: chapter.releaseDate ? normalizeDate(chapter.releaseDate) : undefined,
        updatedAt: chapter.updatedAt ? normalizeDate(chapter.updatedAt) : undefined,
        updated_at: chapter.updated_at ? normalizeDate(chapter.updated_at) : undefined,
      }));

      const chapters = chapterArraySchema.parse(preprocessedChapters);
      logger.info(`Valid chapters: ${chapters.length}`);

      if (this.config.options.dryRun) {
        logger.info(`DRY RUN: Would process ${chapters.length} chapters`);
        return;
      }

      // Process chapters
      const seeder = new ChapterSeeder(this.config.options);
      await seeder.seed(chapters);
    } catch (error) {
      logger.error(`Failed to process chapters: ${error}`);
      if (error instanceof Error && this.config.options.verbose) {
        logger.error(error.stack || "");
      }
    }
  }
}
