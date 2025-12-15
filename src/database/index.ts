// Central database entrypoint — provides convenient named exports for imports like `from "database"`
import type { Database as DrizzleDatabase, Schema as DrizzleSchema } from "@/database/db";
import { db } from "@/database/db";
import * as schema from "@/database/schema";

export * from "@/database/db";
export * from "src/database/schema";

// Provide a `database` named export (many files import { database, ... } )
// Use the typed alias for strict Drizzle typing
export const database: DrizzleDatabase = db;

// Also export a simple object containing schema tables for convenience
export const tables: typeof schema = schema;

// Typed aliases for incremental hardening. Use these in new/updated modules
// to opt into strict Drizzle typings without forcing a global change.
export const databaseTyped: Database = db;
export const tablesTyped: Schema = schema;

// Re-export the concrete Database and Schema types from the DB implementation
export type Database = DrizzleDatabase;
export type Schema = DrizzleSchema;
