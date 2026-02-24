/**
 * Enhanced Dynamic Seeding System - Core Types & Interfaces
 *
 * @module SeedTypes
 * @description Comprehensive type definitions for the dynamic seeding system
 */

import type { z } from "zod";

// ═══════════════════════════════════════════════════
// CORE SEED OPTIONS
// ═══════════════════════════════════════════════════

export interface SeedOptions {
  /** Batch size for bulk operations */
  batchSize?: number;
  /** Dry run mode (no actual inserts) */
  dryRun?: boolean;
  /** Force overwrite existing records */
  forceOverwrite?: boolean;
  /** Skip image downloads */
  skipImageDownload?: boolean;
  /** Skip Zod validation */
  skipValidation?: boolean;
  /** Transaction mode */
  useTransaction?: boolean;
  /** Enable verbose logging */
  verbose?: boolean;
}

// ═══════════════════════════════════════════════════
// SEED RESULT TRACKING
// ═══════════════════════════════════════════════════

export interface SeedResult {
  /** Execution duration in ms */
  duration: number;
  /** Detailed error messages */
  errorDetails?: Array<{ error: string; record: unknown; }>;
  /** Records with errors */
  errors: number;
  /** Records successfully inserted */
  inserted: number;
  /** Records skipped (already exist) */
  skipped: number;
  /** Records successfully updated */
  updated: number;
}

// ═══════════════════════════════════════════════════
// DATA SOURCE CONFIGURATION
// ═══════════════════════════════════════════════════

export interface DataSourceConfig {
  /** Entity name (users, comics, chapters, etc.) */
  entity: string;
  /** Optional Zod schema for validation */
  schema?: z.ZodType<unknown>;
  /** JSON file paths (supports glob patterns) */
  sources: string[];
  /** Transformation function before seeding */
  transform?(data: unknown): unknown;
  /** Unique identifier field */
  uniqueField?: string;
}

// ═══════════════════════════════════════════════════
// SEEDER INTERFACE
// ═══════════════════════════════════════════════════

export interface ISeeder<T = unknown> {
  /** Clear all data for this entity */
  clear(): Promise<void>;

  /** Entity name */
  readonly entity: string;

  /** Seed data to database */
  seed(data: T[], options?: SeedOptions): Promise<SeedResult>;

  /** Transform data if needed */
  transform(data: T[]): T[];

  /** Validate data against schema */
  validate(data: unknown[]): T[];
}

// ═══════════════════════════════════════════════════
// CLI CONFIGURATION
// ═══════════════════════════════════════════════════

export interface CLIConfig {
  enabled: {
    all: boolean;
    chapters: boolean;
    comics: boolean;
    users: boolean;
  };
  mode: "clear" | "reset" | "seed";
  options: SeedOptions;
}

// ═══════════════════════════════════════════════════
// PROGRESS TRACKING
// ═══════════════════════════════════════════════════

export interface ProgressInfo {
  current: number;
  entity: string;
  operation: "inserting" | "transforming" | "updating" | "validating";
  percentage: number;
  total: number;
}

export type ProgressCallback = (info: ProgressInfo) => void;

// ═══════════════════════════════════════════════════
// VALIDATION ERROR
// ═══════════════════════════════════════════════════

export interface ValidationError {
  data: unknown;
  errors: z.ZodIssue[];
  index: number;
}

// ═══════════════════════════════════════════════════
// EXPORT ALL
// ═══════════════════════════════════════════════════

export type { z as ZodType };
