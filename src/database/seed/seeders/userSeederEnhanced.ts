/**
 * Enhanced User Seeder
 * 
 * @module UserSeeder
 * @description Seeds user data with validation and upsert logic
 */

import { user } from "@/database/schema";
import { userSeedSchema, type UserSeed } from "@/lib/validations";
import { eq, sql } from "drizzle-orm";
import { BaseSeeder, database } from "../baseSeeder";
import { logger } from "../logger";
import type { SeedOptions, SeedResult } from "../types";

// ═══════════════════════════════════════════════════
// USER SEEDER
// ═══════════════════════════════════════════════════

export class UserSeederEnhanced extends BaseSeeder<UserSeed> {
  constructor(options: SeedOptions = {}) {
    super("users", user, userSeedSchema, options);
  }

  /**
   * Data sources for users
   */
  protected getDataSources(): string[] {
    return [
      "./users.json",
      "./data/users.json",
      "./seed-data/users*.json",
    ];
  }

  /**
   * Get unique field for upsert
   */
  protected getUniqueField(): string {
    return "email";
  }

  /**
   * Prepare user data for insertion
   */
  protected prepareData(item: UserSeed): typeof user.$inferInsert {
    return {
      id: item.id,
      email: item.email,
      name: item.name || item.email.split("@")[0],
      image: item.image || null,
      role: item.role || "user",
      emailVerified: item.emailVerified ? new Date(item.emailVerified) : null,
      password: item.password || null,
      createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
    };
  }

  /**
   * Insert batch with upsert logic
   */
  protected async insertBatch(
    batch: UserSeed[],
    options: SeedOptions
  ): Promise<Omit<SeedResult, "duration">> {
    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const item of batch) {
      try {
        const prepared = this.prepareData(item);

        // Check if user exists
        const existing = await database
          .select()
          .from(user)
          .where(eq(user.email, prepared.email))
          .limit(1);

        if (existing.length > 0) {
          if (options.forceOverwrite) {
            // Update existing
            await database
              .update(user)
              .set({
                ...prepared,
                updatedAt: new Date(),
              })
              .where(eq(user.email, prepared.email));
            updated++;
          } else {
            skipped++;
          }
        } else {
          // Insert new
          await database.insert(user).values(prepared);
          inserted++;
        }
      } catch (error) {
        logger.warn(`Failed to insert user: ${error}`);
        errors++;
      }
    }

    return { inserted, updated, skipped, errors };
  }

  /**
   * Bulk insert with conflict resolution
   */
  protected async bulkInsert(batch: UserSeed[]): Promise<number> {
    const prepared = batch.map((item) => this.prepareData(item));

    const result = await database
      .insert(user)
      .values(prepared)
      .onConflictDoUpdate({
        target: user.email,
        set: {
          name: sql`EXCLUDED.name`,
          image: sql`EXCLUDED.image`,
          role: sql`EXCLUDED.role`,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result.length;
  }
}

// ═══════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════

export { UserSeederEnhanced as UserSeeder };

// For backward compatibility
export default UserSeederEnhanced;
