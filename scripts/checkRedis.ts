#!/usr/bin/env tsx
/**
 * Check Redis Connection
 */

import IORedis from "ioredis";

import { env } from "../appConfig";

async function checkRedis() {
  console.log("📦 Checking Redis connection...\n");

  try {
    const redis = new IORedis({
      host: typeof env.REDIS_HOST !== "undefined" ? env.REDIS_HOST : "localhost",
      port: typeof env.REDIS_PORT !== "undefined" ? Number(env.REDIS_PORT) : 6379,
      password: typeof env.REDIS_PASSWORD !== "undefined" ? env.REDIS_PASSWORD : undefined,
    });

    const pong = await redis.ping();
    const info = await redis.info("server");

    console.log("✅ Redis connected");
    console.log("📍 Response:", pong);

    // Parse version
    const versionMatch = info.match(/redis_version:([\d.]+)/);
    if (versionMatch) {
      console.log("📊 Version:", versionMatch[1]);
    }

    console.log();
    await redis.quit();
    process.exit(0);
  } catch (error) {
    console.error("❌ Redis connection failed");
    console.error("Error:", error instanceof Error ? error.message : error);
    console.log();
    process.exit(1);
  }
}

checkRedis();
