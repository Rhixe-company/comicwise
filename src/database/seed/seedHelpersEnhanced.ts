/**
 * Enhanced Seed Helpers
 * 
 * @module SeedHelpers
 * @description Unified seeding interface with DRY principles
 */

import { logger } from "./logger";
import { ChapterSeeder } from "./seeders/chapterSeederEnhanced";
import { ComicSeeder } from "./seeders/comicSeederEnhanced";
import { UserSeeder } from "./seeders/userSeederEnhanced";
import type { SeedOptions, SeedResult } from "./types";

// ═══════════════════════════════════════════════════
// SEED FUNCTIONS
// ═══════════════════════════════════════════════════

/**
 * Seed users
 */
export async function seedUsers(options: SeedOptions = {}): Promise<SeedResult> {
  const seeder = new UserSeeder(options);
  return seeder.seed([], options);
}

/**
 * Seed comics (with authors, artists, genres, types)
 */
export async function seedComics(options: SeedOptions = {}): Promise<SeedResult> {
  const seeder = new ComicSeeder(options);
  return seeder.seed([], options);
}

/**
 * Seed chapters
 */
export async function seedChapters(options: SeedOptions = {}): Promise<SeedResult> {
  const seeder = new ChapterSeeder(options);
  return seeder.seed([], options);
}

/**
 * Seed all entities in correct order
 */
export async function seedAll(options: SeedOptions = {}): Promise<{
  users: SeedResult;
  comics: SeedResult;
  chapters: SeedResult;
}> {
  logger.header("Seeding All Entities");

  // Seed in dependency order
  logger.section("1/3: Seeding Users");
  const users = await seedUsers(options);
  logger.success(`Users: ✓ ${users.inserted} inserted, ${users.updated} updated`);

  logger.section("2/3: Seeding Comics");
  const comics = await seedComics(options);
  logger.success(`Comics: ✓ ${comics.inserted} inserted, ${comics.updated} updated`);

  logger.section("3/3: Seeding Chapters");
  const chapters = await seedChapters(options);
  logger.success(`Chapters: ✓ ${chapters.inserted} inserted, ${chapters.updated} updated`);

  return { users, comics, chapters };
}

/**
 * Clear all seeded data
 */
export async function clearAll(options: SeedOptions = {}): Promise<void> {
  logger.header("Clearing All Data");

  // Clear in reverse dependency order
  logger.info("Clearing chapters...");
  const chapterSeeder = new ChapterSeeder(options);
  await chapterSeeder.clear();

  logger.info("Clearing comics...");
  const comicSeeder = new ComicSeeder(options);
  await comicSeeder.clear();

  logger.info("Clearing users...");
  const userSeeder = new UserSeeder(options);
  await userSeeder.clear();

  logger.success("All data cleared");
}

/**
 * Reset database (clear + seed)
 */
export async function resetDatabase(options: SeedOptions = {}): Promise<void> {
  logger.header("Resetting Database");

  await clearAll(options);
  await seedAll(options);

  logger.success("Database reset complete");
}

/**
 * Validate all seed data without inserting
 */
export async function validateSeedData(options: SeedOptions = {}): Promise<{
  users: { valid: number; invalid: number };
  comics: { valid: number; invalid: number };
  chapters: { valid: number; invalid: number };
}> {
  logger.header("Validating Seed Data");

  const dryRunOptions = { ...options, dryRun: true, verbose: true };

  const users = await seedUsers(dryRunOptions);
  const comics = await seedComics(dryRunOptions);
  const chapters = await seedChapters(dryRunOptions);

  logger.success("Validation complete");

  return {
    users: { valid: users.skipped, invalid: users.errors },
    comics: { valid: comics.skipped, invalid: comics.errors },
    chapters: { valid: chapters.skipped, invalid: chapters.errors },
  };
}

// ═══════════════════════════════════════════════════
// EXPORT ALL
// ═══════════════════════════════════════════════════

export type { SeedOptions, SeedResult };
export { logger };
