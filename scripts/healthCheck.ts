#!/usr/bin/env tsx
/**
 * Health Check Script
 * Checks all system health indicators
 */

import { sql } from "drizzle-orm";
import IORedis from "ioredis";
import { env } from "../appConfig";
import { db } from "@/database/db";

async function healthCheck() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  🏥 System Health Check");
  console.log("═══════════════════════════════════════════════════════════\n");

  let allHealthy = true;

  // Check Database
  console.log("🗄️  Database...");
  try {
    await db.execute(sql`SELECT 1`);
    console.log("   ✅ Connected\n");
  } catch (error) {
    console.log("   ❌ Failed:", error instanceof Error ? error.message : error);
    console.log();
    allHealthy = false;
  }

  // Check Redis
  console.log("📦 Redis...");
  try {
    const redis = new IORedis({
      host: env.REDIS_HOST || "localhost",
      port: Number(env.REDIS_PORT) || 6379,
      password: env.REDIS_PASSWORD || undefined,
    });

    await redis.ping();
    console.log("   ✅ Connected\n");
    await redis.quit();
  } catch (error) {
    console.log("   ❌ Failed:", error instanceof Error ? error.message : error);
    console.log();
    allHealthy = false;
  }

  // Check Environment
  console.log("🔧 Environment...");
  const requiredEnvVars = ["DATABASE_URL", "AUTH_SECRET", "AUTH_URL"];
  const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

  if (missingEnvVars.length === 0) {
    console.log("   ✅ All required variables set\n");
  } else {
    console.log("   ❌ Missing:", missingEnvVars.join(", "));
    console.log();
    allHealthy = false;
  }

  console.log("═══════════════════════════════════════════════════════════");

  if (allHealthy) {
    console.log("✅ All systems healthy");
    process.exit(0);
  } else {
    console.log("❌ Some systems unhealthy");
    process.exit(1);
  }
}

healthCheck();
