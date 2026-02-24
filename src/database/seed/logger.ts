/**
 * Seed Logger
 * Enhanced logging for seed operations
 * Re-exports from consolidated logger with seed-specific utilities
 */

import { seedLogger } from "@/lib/logger";

export type LogLevel = "debug" | "error" | "info" | "success" | "warn";

/**
 * Seed logger with formatted output
 */
export class SeedLogger {
  private verboseMode = false;

  setVerbose(verbose: boolean) {
    this.verboseMode = verbose;
  }

  header(text: string) {
    seedLogger.info("\n" + "═".repeat(60));
    seedLogger.info(`  ${text}`);
    seedLogger.info("═".repeat(60) + "\n");
  }

  section(text: string) {
    seedLogger.info("\n" + "─".repeat(60));
    seedLogger.info(`  ${text}`);
    seedLogger.info("─".repeat(60));
  }

  footer() {
    seedLogger.info("═".repeat(60) + "\n");
  }

  info(message: string) {
    console.log(`ℹ️  ${message}`);
    seedLogger.info(message);
  }

  success(message: string) {
    console.log(`✅ ${message}`);
    seedLogger.info(message);
  }

  warn(message: string) {
    console.warn(`⚠️  ${message}`);
    seedLogger.warn(message);
  }

  error(message: string) {
    console.error(`❌ ${message}`);
    seedLogger.error(message);
  }

  debug(message: string) {
    if (this.verboseMode) {
      seedLogger.info(`🔍 ${message}`);
      seedLogger.debug(message);
    }
  }

  stat(label: string, value: number | string) {
    seedLogger.info(`   ${label}: ${value}`);
  }
}

export const logger = new SeedLogger();

/**
 * Progress tracker for batch operations
 */
export class ProgressTracker {
  private current = 0;
  private readonly total: number;
  private readonly name: string;
  private readonly startTime: number;
  private created = 0;
  private updated = 0;
  private skipped = 0;
  private errors = 0;

  constructor(name: string, total: number) {
    this.name = name;
    this.total = total;
    this.startTime = Date.now();
  }

  incrementCreated(message?: string) {
    this.current++;
    this.created++;
    this.log("Created", message);
  }

  incrementUpdated(message?: string) {
    this.current++;
    this.updated++;
    this.log("Updated", message);
  }

  incrementSkipped(message?: string) {
    this.current++;
    this.skipped++;
    this.log("Skipped", message);
  }

  incrementError(message?: string) {
    this.current++;
    this.errors++;
    this.log("Error", message);
  }

  private log(status: string, message?: string) {
    const percentage = Math.round((this.current / this.total) * 100);
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
    const message_ = message ? ` - ${message}` : "";
    seedLogger.info(
      `[${this.name}] ${this.current}/${this.total} (${percentage}%) - ${elapsed}s - ${status}${message_}`
    );
  }

  complete() {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    seedLogger.info(`\n[${this.name}] Summary:`);
    seedLogger.info(`   Created:  ${this.created}`);
    seedLogger.info(`   Updated:  ${this.updated}`);
    seedLogger.info(`   Skipped:  ${this.skipped}`);
    seedLogger.info(`   Errors:   ${this.errors}`);
    seedLogger.info(`   Time:     ${elapsed}s`);
    seedLogger.info(`   Total:    ${this.total}`);
  }
}
