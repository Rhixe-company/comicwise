/**
 * Refactored Seed System Entry Point
 *
 * Cleaner, simpler seed system that:
 * - Uses individual focused seeders (userSeeder, comicSeeder, chapterSeeder)
 * - Replaces monolithic universalSeeder
 * - Better error handling and logging
 * - More maintainable and testable
 */

import { db } from "@/database/db";
import { logger } from "@/database/seed/logger";
import { seedChaptersFromFiles } from "@/database/seed/seeders/chapterSeeder";
import { seedComicsFromFiles } from "@/database/seed/seeders/comicSeeder";
import { seedUsersFromFiles } from "@/database/seed/seeders/userSeeder";
import { sql } from "drizzle-orm";

async function main() {
  const startTime = Date.now();

  try {
    logger.header("Database Seeding System (Refactored)");
    logger.section("Initializing");

    // Test database connection
    logger.info("Testing database connection...");
    await db.execute(sql`SELECT 1`);
    logger.success("Database connection established\n");

    const stats = {
      users: { total: 0, created: 0, updated: 0, skipped: 0, errors: 0 },
      comics: { total: 0, created: 0, updated: 0, skipped: 0, errors: 0 },
      chapters: { total: 0, created: 0, updated: 0, skipped: 0, errors: 0 },
    };

    // Seed users
    logger.section("Seeding Users");
    stats.users = await seedUsersFromFiles(["users.json"]);
    logger.success(
      `Users: ${stats.users.created} created, ${stats.users.updated} updated, ${stats.users.skipped} skipped\n`
    );

    // Seed comics
    logger.section("Seeding Comics");
    stats.comics = await seedComicsFromFiles("comics*.json");
    logger.success(
      `Comics: ${stats.comics.created} created, ${stats.comics.updated} updated, ${stats.comics.skipped} skipped\n`
    );

    // Seed chapters
    logger.section("Seeding Chapters");
    stats.chapters = await seedChaptersFromFiles([
      "chapters.json",
      "chaptersdata1.json",
      "chaptersdata2.json",
    ]);
    logger.success(
      `Chapters: ${stats.chapters.created} created, ${stats.chapters.updated} updated, ${stats.chapters.skipped} skipped\n`
    );

    // Summary
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.header("Seeding Complete");
    logger.success(`Total time: ${elapsed}s`);
    logger.success(`Users: ${stats.users.created} created, ${stats.users.updated} updated`);
    logger.success(`Comics: ${stats.comics.created} created, ${stats.comics.updated} updated`);
    logger.success(
      `Chapters: ${stats.chapters.created} created, ${stats.chapters.updated} updated`
    );

    const totalErrors = stats.users.errors + stats.comics.errors + stats.chapters.errors;
    if (totalErrors > 0) {
      logger.warn(`Total errors: ${totalErrors}`);
    }

    logger.footer();
    process.exit(0);
  } catch (error) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.error(`\nSeeding failed after ${elapsed}s`);

    if (error instanceof Error) {
      logger.error(`Error: ${error.message}`);
      if (error.stack) {
        logger.error(`Stack: ${error.stack}`);
      }
    }

    logger.footer();
    process.exit(1);
  }
}

await main();
