/**
 * Database Seeding System - Optimized Entry Point
 *
 * Fast, efficient seeding with:
 * - Batch processing with Zod validation
 * - Progress tracking and detailed logging
 * - Selective seeding with CLI flags
 * - Dynamic data loading from JSON files
 * - Transaction support for data integrity
 * - Update/overwrite capabilities
 *
 * Usage:
 *   pnpm seed                    - Seed all entities
 *   pnpm seed --users            - Seed only users
 *   pnpm seed --comics           - Seed only comics
 *   pnpm seed --chapters         - Seed only chapters
 *   pnpm seed --dry-run          - Validate without inserting
 *   pnpm seed --verbose          - Detailed logging
 *   pnpm seed --batch-size=500   - Custom batch size
 */

import { db as database } from "@/database/db";
import { sql } from "drizzle-orm";
import { parseCLIArgs } from "./config";
import { logger } from "./logger";
import type { SeedOptions } from "./seedHelpers";
import { seedAll, seedChapters, seedComics, seedUsers } from "./seedHelpers";

async function seed() {
  const startTime = Date.now();
  let config: ReturnType<typeof parseCLIArgs>;

  try {
    // Parse CLI config
    config = parseCLIArgs(process.argv.slice(2));

    logger.header("Database Seeding System");
    logger.section("Initializing");

    // Test database connection
    logger.info("Testing database connection...");
    await database.execute(sql`SELECT 1`);
    logger.success("Database connection established\n");

    // Prepare seed options
    const options: SeedOptions = {
      batchSize: config.options.batchSize,
      verbose: config.options.verbose,
      dryRun: config.options.dryRun,
      skipValidation: false,
    };

    // Run seeding based on enabled entities
    const { enabled } = config;

    if (enabled.users && enabled.comics && enabled.chapters) {
      // Seed all entities - most efficient
      logger.info("Seeding all entities...\n");
      await seedAll(options);
    } else {
      // Selective seeding
      if (enabled.users) {
        logger.section("Seeding Users");
        const result = await seedUsers(options);
        logger.success(
          `Users: ${result.inserted} inserted, ${result.skipped} skipped (${result.duration}ms)\n`
        );
      }

      if (enabled.comics) {
        logger.section("Seeding Comics");
        const result = await seedComics(options);
        logger.success(
          `Comics: ${result.inserted} inserted, ${result.skipped} skipped (${result.duration}ms)\n`
        );
      }

      if (enabled.chapters) {
        logger.section("Seeding Chapters");
        const result = await seedChapters(options);
        logger.success(
          `Chapters: ${result.inserted} inserted, ${result.skipped} skipped (${result.duration}ms)\n`
        );
      }
    }

    // Complete
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.header("Seeding Complete");
    logger.success(`Total time: ${elapsed}s`);
    logger.footer();

    process.exit(0);
  } catch (error) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.error(`\nSeeding failed after ${elapsed}s`);

    if (error instanceof Error) {
      logger.error(`Error: ${error.message}`);
      if (error.stack && typeof config !== 'undefined' && config.options.verbose) {
        logger.error(`Stack: ${error.stack}`);
      }
    } else {
      logger.error(`Unknown error: ${String(error)}`);
    }

    logger.footer();
    process.exit(1);
  }
}

// Run
seed().catch((error) => {
  console.error("Fatal seeding error:", error);
  process.exit(1);
});
