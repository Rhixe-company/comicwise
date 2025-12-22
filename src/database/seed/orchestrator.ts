/**
 * Seed Orchestrator
 * Coordinates the seeding process
 */

import type { SeedConfig } from "@/database/seed/config";
import { logger } from "@/database/seed/logger";
import { ChapterSeeder } from "@/database/seed/seeders/chapterSeeder";
import { ComicSeeder } from "@/database/seed/seeders/comicSeeder";
import { UserSeeder } from "@/database/seed/seeders/userSeeder";
import { fileUtils } from "@/database/seed/utils/fileUtils";
import { deduplicateByKey, normalizeDate } from "@/database/seed/utils/helpers";
import { MetadataCache } from "@/database/seed/utils/metadataCache";
import { chapterArraySchema, comicArraySchema, userArraySchema } from "@/lib/validations";

interface RawComic {
  status?: string;
  publicationDate?: string;
  updatedAt?: string;
  updated_at?: string;
  [key: string]: unknown;
}

interface RawChapter {
  releaseDate?: string;
  updatedAt?: string;
  updated_at?: string;
  [key: string]: unknown;
}

const VALID_STATUSES = ["Ongoing", "Hiatus", "Completed", "Dropped", "Coming Soon"];

function normalizeComicStatus(status: unknown): string {
  if (!status || typeof status !== "string") {
    return "Ongoing";
  }

  const matchedStatus = VALID_STATUSES.find((s) => s.toLowerCase() === status.toLowerCase());

  return matchedStatus || "Ongoing";
}

function preprocessComic(comic: RawComic): RawComic {
  return {
    ...comic,
    status: normalizeComicStatus(comic.status),
    publicationDate: comic.publicationDate
      ? normalizeDate(comic.publicationDate)?.toISOString()
      : undefined,
    updatedAt: comic.updatedAt ? normalizeDate(comic.updatedAt)?.toISOString() : undefined,
    updated_at: comic.updated_at ? normalizeDate(comic.updated_at)?.toISOString() : undefined,
  };
}

function preprocessChapter(chapter: RawChapter): RawChapter {
  return {
    ...chapter,
    releaseDate: chapter.releaseDate
      ? normalizeDate(chapter.releaseDate)?.toISOString()
      : undefined,
    updatedAt: chapter.updatedAt ? normalizeDate(chapter.updatedAt)?.toISOString() : undefined,
    updated_at: chapter.updated_at ? normalizeDate(chapter.updated_at)?.toISOString() : undefined,
  };
}

/**
 *
 */
export class SeedOrchestrator {
  private config: SeedConfig;
  private metadataCache: MetadataCache;

  /**
   *
   * @param config
   */
  constructor(config: SeedConfig) {
    this.config = config;
    this.metadataCache = new MetadataCache();
    logger.setVerbose(config.options.verbose);
  }

  /**
   *
   */
  async run(): Promise<void> {
    const { enabled, options } = this.config;

    if (options.dryRun) {
      logger.warn("DRY RUN MODE - No changes will be made to the database");
    }

    if (enabled.users) {
      await this.seedUsers();
    }

    if (enabled.comics) {
      await this.seedComics();
    }

    if (enabled.chapters) {
      await this.seedChapters();
    }
  }

  private async seedUsers(): Promise<void> {
    logger.section("Processing Users");

    try {
      const rawUsers = await fileUtils.readMultipleJsonFiles(this.config.userFiles);
      logger.info(`Loaded ${rawUsers.length} users from files`);

      const users = userArraySchema.parse(rawUsers);
      const uniqueUsers = deduplicateByKey(users, (u) => u.email);
      logger.info(`Unique users after deduplication: ${uniqueUsers.length}`);

      if (this.config.options.dryRun) {
        logger.info(`DRY RUN: Would process ${uniqueUsers.length} users`);
        return;
      }

      const seeder = new UserSeeder(this.config.options);
      await seeder.seed(uniqueUsers);
    } catch (error) {
      this.handleSeedError("users", error);
    }
  }

  private async seedComics(): Promise<void> {
    logger.section("Processing Comics");

    try {
      const rawComics = await fileUtils.readMultipleJsonFiles(this.config.comicFiles);
      logger.info(`Loaded ${rawComics.length} comics from files`);

      const preprocessedComics = (rawComics as RawComic[]).map(preprocessComic);
      const comics = comicArraySchema.parse(preprocessedComics);
      const uniqueComics = deduplicateByKey(comics, (c) => c.title);
      logger.info(`Unique comics after deduplication: ${uniqueComics.length}`);

      if (this.config.options.dryRun) {
        logger.info(`DRY RUN: Would process ${uniqueComics.length} comics`);
        return;
      }

      const seeder = new ComicSeeder(this.metadataCache, this.config.options);
      await seeder.seed(uniqueComics);
    } catch (error) {
      this.handleSeedError("comics", error);
    }
  }

  private async seedChapters(): Promise<void> {
    logger.section("Processing Chapters");

    try {
      const rawChapters = await fileUtils.readMultipleJsonFiles(this.config.chapterFiles);
      logger.info(`Loaded ${rawChapters.length} chapters from files`);

      const preprocessedChapters = (rawChapters as RawChapter[]).map(preprocessChapter);
      const chapters = chapterArraySchema.parse(preprocessedChapters);
      logger.info(`Valid chapters: ${chapters.length}`);

      if (this.config.options.dryRun) {
        logger.info(`DRY RUN: Would process ${chapters.length} chapters`);
        return;
      }

      const seeder = new ChapterSeeder(this.config.options);
      await seeder.seed(chapters);
    } catch (error) {
      this.handleSeedError("chapters", error);
    }
  }

  private handleSeedError(entity: string, error: unknown): void {
    logger.error(`Failed to process ${entity}: ${error}`);

    if (error instanceof Error && this.config.options.verbose) {
      logger.error(error.stack ?? "");
    }
  }
}
