#!/usr/bin/env node
/**
 * validate-optimize-env-seed.ts
 *
 * Script to validate and optimize environment configuration and seeding system.
 * - Validates environment variables for dev/prod
 * - Runs universal seeder with validation
 * - Reports issues and suggestions
 *
 * Usage: pnpm tsx scripts/validate-optimize-env-seed.ts
 */

// Ensure .env.local is loaded before any other imports
import "./bootstrap-env";

import { env } from "../appConfig";
import { seedAllFromJSON } from "../src/database/seed/seeders/universalSeeder";

async function main() {
  console.log("\n═══════════════════════════════════════════════════════════════════════════════");
  console.log("🔍 Validating environment configuration...");
  console.log("═══════════════════════════════════════════════════════════════════════════════\n");

  // Print all environment variables used
  for (const key of Object.keys(env)) {
    console.log(`${key}:`, env[key]);
  }

  // Check for missing critical variables
  const required = ["DATABASE_URL", "AUTH_SECRET", "AUTH_URL"];
  let missing = false;
  for (const key of required) {
    if (!env[key as keyof typeof env]) {
      console.warn(`⚠️  Missing required environment variable: ${key}`);
      missing = true;
    }
  }
  if (missing) {
    console.warn("\n❌ Please set all required environment variables before proceeding.\n");
    process.exit(1);
  }

  console.log("\n✅ Environment configuration looks good!\n");

  // Run universal seeder with validation
  console.log("═══════════════════════════════════════════════════════════════════════════════");
  console.log("🚀 Running universal seeder with validation...");
  console.log("═══════════════════════════════════════════════════════════════════════════════\n");

  try {
    await seedAllFromJSON();
    console.log("\n✅ Seeding and validation complete!\n");
  } catch (error) {
    console.error("\n❌ Seeding or validation failed:", error);
    process.exit(1);
  }
}

main();
