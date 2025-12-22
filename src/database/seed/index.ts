#!/usr/bin/env tsx

/**
 * Database Seeding System
 *
 * Optimized seeding with:
 * - Batch processing with configurable concurrency
 * - Transaction support for data consistency
 * - Progress tracking and detailed logging
 * - Selective seeding with CLI flags
 * - Image download caching
 */

import { db as database } from '#database/db';
import type { SeedConfig } from '#database/seed/config';
import { parseCLIArgs } from '#database/seed/config';
import { logger } from '#database/seed/logger';
import { SeedOrchestrator } from '#database/seed/orchestrator';
import { isDevelopment } from "appConfig";
import { sql } from "drizzle-orm";

async function seed(config: SeedConfig) {
  const startTime = Date.now();

  try {
    logger.header("Database Seeding System");
    logger.section("Initializing");

    // Test database connection
    logger.info("Testing database connection...");
    await database.execute(sql`SELECT 1`);
    logger.success("Database connection established\n");

    // Initialize orchestrator
    const orchestrator = new SeedOrchestrator(config);

    // Run seeding process
    await orchestrator.run();

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
      if (isDevelopment) {
        logger.error(`Stack: ${error.stack}`);
      }
    } else {
      logger.error(`Unknown error: ${String(error)}`);
    }

    logger.footer();
    process.exit(1);
  }
}

// Parse CLI arguments and run
const config = parseCLIArgs(process.argv.slice(2));
seed(config);
