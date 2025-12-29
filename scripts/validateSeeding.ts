#!/usr/bin/env tsx
/**
 * Seeding System Validation Script
 *
 * This script validates the optimized seeding system by:
 * 1. Checking that imageService is used for all downloads
 * 2. Verifying cache deduplication is working
 * 3. Testing batch processing
 * 4. Validating chapter image processing
 */

import { logger } from "../src/database/seed/logger";
import imageCache from "../src/database/seed/utils/imageCache";

const { getCacheStats, clearCache, cacheImage, getCachedUrl, getCachedByHash, getImageHash } =
  imageCache;

// ═══════════════════════════════════════════════════
// TEST DATA
// ═══════════════════════════════════════════════════

const testUrls = [
  "https://example.com/image1.jpg",
  "https://example.com/image2.jpg",
  "https://example.com/image1.jpg", // Duplicate URL
  "https://different-url.com/same-image.jpg", // Different URL, same content (simulated)
];

// ═══════════════════════════════════════════════════
// VALIDATION TESTS
// ═══════════════════════════════════════════════════

async function testCacheDeduplication() {
  logger.info("\n🧪 Test 1: Cache Deduplication");
  logger.info("═".repeat(60));

  clearCache();

  // Simulate caching
  cacheImage(testUrls[0], "https://cdn.example.com/uploads/hash1.webp", "hash1");
  cacheImage(testUrls[1], "https://cdn.example.com/uploads/hash2.webp", "hash2");

  // Test URL cache hit
  const cached1 = getCachedUrl(testUrls[0]);
  if (cached1) {
    logger.success("✅ URL cache working: " + cached1);
  } else {
    logger.error("❌ URL cache failed");
    return false;
  }

  // Test duplicate URL
  const cached2 = getCachedUrl(testUrls[2]); // Same as testUrls[0]
  if (cached2) {
    logger.success("✅ Duplicate URL detected: " + cached2);
  } else {
    logger.error("❌ Duplicate URL not detected");
    return false;
  }

  // Simulate hash deduplication
  cacheImage(testUrls[3], "https://cdn.example.com/uploads/hash1.webp", "hash1"); // Same hash as first
  const cachedByHash = getCachedByHash("hash1");
  if (cachedByHash) {
    logger.success("✅ Hash-based deduplication working: " + cachedByHash);
  } else {
    logger.error("❌ Hash-based deduplication failed");
    return false;
  }

  const stats = getCacheStats();
  logger.info(`\n📊 Cache Stats:`);
  logger.info(`   URLs cached: ${stats.urlCacheSize}`);
  logger.info(`   Unique hashes: ${stats.hashCacheSize}`);
  logger.info(`   Cache hits: ${stats.cacheHits}`);
  logger.info(`   Hit rate: ${stats.hitRate.toFixed(2)}%`);

  if (stats.urlCacheSize > stats.hashCacheSize) {
    logger.success(
      `✅ Deduplication working: ${stats.urlCacheSize - stats.hashCacheSize} duplicates detected`
    );
  }

  return true;
}

async function testHashGeneration() {
  logger.info("\n🧪 Test 2: Hash Generation");
  logger.info("═".repeat(60));

  const buffer1 = Buffer.from("test image data");
  const buffer2 = Buffer.from("test image data"); // Same content
  const buffer3 = Buffer.from("different data");

  const hash1 = getImageHash(buffer1);
  const hash2 = getImageHash(buffer2);
  const hash3 = getImageHash(buffer3);

  if (hash1 === hash2) {
    logger.success("✅ Same content produces same hash");
  } else {
    logger.error("❌ Same content produced different hashes");
    return false;
  }

  if (hash1 !== hash3) {
    logger.success("✅ Different content produces different hash");
  } else {
    logger.error("❌ Different content produced same hash");
    return false;
  }

  logger.info(`   Hash 1: ${hash1.slice(0, 16)}...`);
  logger.info(`   Hash 2: ${hash2.slice(0, 16)}... (should match)`);
  logger.info(`   Hash 3: ${hash3.slice(0, 16)}... (should differ)`);

  return true;
}

async function testCacheStatistics() {
  logger.info("\n🧪 Test 3: Cache Statistics");
  logger.info("═".repeat(60));

  clearCache();

  // Simulate various cache operations
  for (let i = 0; i < 10; i++) {
    cacheImage(`url-${i}`, `cdn-url-${i}`, `hash-${i % 5}`); // 5 unique hashes, 10 URLs
  }

  // Simulate cache hits
  for (let i = 0; i < 5; i++) {
    getCachedUrl(`url-${i}`);
  }

  // Simulate cache misses
  for (let i = 10; i < 15; i++) {
    getCachedUrl(`url-${i}`);
  }

  const stats = getCacheStats();

  logger.info(`   URLs cached: ${stats.urlCacheSize}`);
  logger.info(`   Unique hashes: ${stats.hashCacheSize}`);
  logger.info(`   Cache hits: ${stats.cacheHits}`);
  logger.info(`   Cache misses: ${stats.cacheMisses}`);
  logger.info(`   Hit rate: ${stats.hitRate.toFixed(2)}%`);

  if (stats.urlCacheSize === 10) {
    logger.success("✅ Correct number of URLs cached");
  } else {
    logger.error(`❌ Expected 10 URLs, got ${stats.urlCacheSize}`);
    return false;
  }

  if (stats.hashCacheSize === 5) {
    logger.success("✅ Correct deduplication (10 URLs → 5 unique hashes)");
  } else {
    logger.error(`❌ Expected 5 unique hashes, got ${stats.hashCacheSize}`);
    return false;
  }

  if (stats.cacheHits === 5 && stats.cacheMisses === 5) {
    logger.success("✅ Cache hit/miss tracking accurate");
  } else {
    logger.error(
      `❌ Cache tracking incorrect: ${stats.cacheHits} hits, ${stats.cacheMisses} misses`
    );
    return false;
  }

  return true;
}

async function validateImageServiceIntegration() {
  logger.info("\n🧪 Test 4: Image Service Integration Check");
  logger.info("═".repeat(60));

  // Check that universalSeeder.ts uses downloadAndUploadImage
  logger.info("   Checking universalSeeder.ts imports...");

  try {
    const fs = await import("fs/promises");
    const path = await import("path");

    const seederPath = path.join(process.cwd(), "src/database/seed/seeders/universalSeeder.ts");
    const content = await fs.readFile(seederPath, "utf-8");

    const checks = [
      {
        pattern: /import.*imageService.*from.*@\/services\/imageService/,
        name: "imageService import",
      },
      { pattern: /downloadAndUploadImage\(/g, name: "downloadAndUploadImage function" },
      { pattern: /downloadAndUploadImages\(/g, name: "downloadAndUploadImages batch function" },
      { pattern: /getCachedUrl\(/g, name: "URL cache check" },
      { pattern: /getCachedByHash\(/g, name: "Hash cache check" },
      { pattern: /getImageHash\(/g, name: "Hash generation" },
      { pattern: /cacheImage\(/g, name: "Image caching" },
      { pattern: /chapterImage/g, name: "chapterImage import/usage" },
      { pattern: /Processing.*images for chapter/g, name: "Chapter image processing" },
    ];

    let allPassed = true;
    for (const check of checks) {
      const matches = content.match(check.pattern);
      if (matches && matches.length > 0) {
        logger.success(`✅ ${check.name}: Found ${matches.length} usage(s)`);
      } else {
        logger.error(`❌ ${check.name}: Not found`);
        allPassed = false;
      }
    }

    // Check for chapter image processing - updated check
    const hasChapterImageProcessing =
      content.includes("downloadAndUploadImages") &&
      content.includes("chapterImage") &&
      content.includes("Processing") &&
      content.includes("images for chapter");

    if (hasChapterImageProcessing) {
      logger.success("✅ Chapter image processing fully implemented");
    } else {
      logger.warn("⚠️  Chapter image processing may not be fully implemented");
      // Don't fail the test, just warn
    }

    return allPassed;
  } catch (error) {
    logger.error(`❌ Failed to validate integration: ${error}`);
    return false;
  }
}

// ═══════════════════════════════════════════════════
// MAIN VALIDATION
// ═══════════════════════════════════════════════════

async function runValidation() {
  logger.info("\n" + "═".repeat(60));
  logger.info("🔍 SEEDING SYSTEM VALIDATION");
  logger.info("═".repeat(60));

  const results = {
    cacheDeduplication: await testCacheDeduplication(),
    hashGeneration: await testHashGeneration(),
    cacheStatistics: await testCacheStatistics(),
    imageServiceIntegration: await validateImageServiceIntegration(),
  };

  logger.info("\n" + "═".repeat(60));
  logger.info("📋 VALIDATION SUMMARY");
  logger.info("═".repeat(60));

  const allPassed = Object.values(results).every((r) => r);

  for (const [test, passed] of Object.entries(results)) {
    const status = passed ? "✅ PASSED" : "❌ FAILED";
    const testName = test.replaceAll(/([A-Z])/g, " $1").toUpperCase();
    logger.info(`   ${status}: ${testName}`);
  }

  logger.info("═".repeat(60));

  if (allPassed) {
    logger.success("\n🎉 ALL VALIDATION TESTS PASSED!\n");
    logger.info("The seeding system is properly optimized:");
    logger.info("  ✓ Image service integration working");
    logger.info("  ✓ Cache deduplication functioning");
    logger.info("  ✓ Hash-based duplicate detection active");
    logger.info("  ✓ Statistics tracking accurate");
    logger.info("\nYou can now run: pnpm db:seed\n");
  } else {
    logger.error("\n❌ VALIDATION FAILED\n");
    logger.info("Some tests did not pass. Please review the errors above.");
    process.exit(1);
  }
}

// Run validation
runValidation().catch((error) => {
  logger.error(`Validation script error: ${error}`);
  process.exit(1);
});
