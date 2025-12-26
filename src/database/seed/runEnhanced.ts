/**
 * Enhanced Database Seeding - Main Entry Point
 * 
 * @module SeedRunner
 * @description Dynamic seeding system with CLI support
 * 
 * Usage:
 *   pnpm seed                    - Seed all entities
 *   pnpm seed --users            - Seed only users
 *   pnpm seed --comics           - Seed only comics
 *   pnpm seed --chapters         - Seed only chapters
 *   pnpm seed --clear            - Clear all data
 *   pnpm seed --reset            - Clear and reseed
 *   pnpm seed --dry-run          - Validate without inserting
 *   pnpm seed --force            - Overwrite existing records
 *   pnpm seed --batch-size=500   - Custom batch size
 *   pnpm seed --verbose          - Detailed logging
 */

import { db as database } from "@/database/db";
import { sql } from "drizzle-orm";
import { parseCLIArgs } from "./configEnhanced";
import { logger } from "./logger";
import {
  clearAll,
  resetDatabase,
  seedAll,
  seedChapters,
  seedComics,
  seedUsers,
  validateSeedData,
} from "./seedHelpersEnhanced";
import type { SeedOptions } from "./types";

// ═══════════════════════════════════════════════════
// MAIN SEED FUNCTION
// ═══════════════════════════════════════════════════

async function seed() {
  const startTime = Date.now();

  try {
    // Parse CLI arguments
    const config = parseCLIArgs(process.argv.slice(2));

    logger.header("Enhanced Database Seeding System");
    logger.info(`Mode: ${config.mode}`);
    logger.info(`Entities: ${Object.entries(config.enabled).filter(([, v]) => v).map(([k]) => k).join(", ")}`);
    logger.section("Initializing");

    // Test database connection
    logger.info("Testing database connection...");
    await database.execute(sql`SELECT 1 as test`);
    logger.success("Database connection established\n");

    // Prepare seed options
    const options: SeedOptions = {
      batchSize: config.options.batchSize || 100,
      verbose: config.options.verbose || false,
      dryRun: config.options.dryRun || false,
      skipValidation: config.options.skipValidation || false,
      forceOverwrite: config.options.forceOverwrite || false,
      useTransaction: true,
    };

    // Execute based on mode
    if (config.mode === "clear") {
      await clearAll(options);
    } else if (config.mode === "reset") {
      await resetDatabase(options);
    } else if (options.dryRun) {
      const validation = await validateSeedData(options);
      logger.section("Validation Results");
      logger.info(`Users: ${validation.users.valid} valid, ${validation.users.invalid} invalid`);
      logger.info(`Comics: ${validation.comics.valid} valid, ${validation.comics.invalid} invalid`);
      logger.info(`Chapters: ${validation.chapters.valid} valid, ${validation.chapters.invalid} invalid`);
    } else {
      // Selective seeding
      const { enabled } = config;

      if (enabled.all || (enabled.users && enabled.comics && enabled.chapters)) {
        // Seed all
        logger.info("Seeding all entities...\n");
        const results = await seedAll(options);
        
        logger.section("Summary");
        logger.success(`Users: ${results.users.inserted} inserted, ${results.users.updated} updated, ${results.users.skipped} skipped`);
        logger.success(`Comics: ${results.comics.inserted} inserted, ${results.comics.updated} updated, ${results.comics.skipped} skipped`);
        logger.success(`Chapters: ${results.chapters.inserted} inserted, ${results.chapters.updated} updated, ${results.chapters.skipped} skipped`);
      } else {
        // Individual entities
        if (enabled.users) {
          const result = await seedUsers(options);
          logger.success(
            `Users: ${result.inserted} inserted, ${result.updated} updated, ${result.skipped} skipped (${result.duration}ms)`
          );
        }

        if (enabled.comics) {
          const result = await seedComics(options);
          logger.success(
            `Comics: ${result.inserted} inserted, ${result.updated} updated, ${result.skipped} skipped (${result.duration}ms)`
          );
        }

        if (enabled.chapters) {
          const result = await seedChapters(options);
          logger.success(
            `Chapters: ${result.inserted} inserted, ${result.updated} updated, ${result.skipped} skipped (${result.duration}ms)`
          );
        }
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
      if (error.stack) {
        logger.error(`Stack:\n${error.stack}`);
      }
    } else {
      logger.error(`Unknown error: ${String(error)}`);
    }

    logger.footer();
    process.exit(1);
  }
}

// ═══════════════════════════════════════════════════
// RUN
// ═══════════════════════════════════════════════════

seed().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
