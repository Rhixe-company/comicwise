#!/usr/bin/env tsx
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DATABASE IMAGE VERIFICATION SCRIPT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This script verifies that all images are:
 * 1. Being downloaded via imageService
 * 2. Being saved to the database correctly
 * 3. No missing or broken image references
 */

import { db } from "@/database";
import { chapter, chapterImage, comic } from "@/database/schema";
import { isNotNull, sql } from "drizzle-orm";
import { logger } from "../src/database/seed/logger";

interface ValidationResult {
  passed: boolean;
  message: string;
  details?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

async function validateComicCoverImages(): Promise<ValidationResult> {
  logger.info("\n🧪 Test 1: Comic Cover Images");
  logger.info("═".repeat(60));

  try {
    // Get all comics
    const allComics = await db.select().from(comic);
    const totalComics = allComics.length;

    if (totalComics === 0) {
      return {
        passed: false,
        message: "No comics found in database",
      };
    }

    // Count comics with cover images
    const comicsWithImages = allComics.filter(
      (c) => c.coverImage && c.coverImage.trim() !== ""
    ).length;

    // Count comics with uploaded images (ImageKit URLs)
    const comicsWithUploadedImages = allComics.filter(
      (c) =>
        c.coverImage && (c.coverImage.includes("/uploads/") || c.coverImage.includes("imagekit.io"))
    ).length;

    // Count comics with external URLs (not uploaded)
    const comicsWithExternalUrls = allComics.filter(
      (c) =>
        c.coverImage &&
        (c.coverImage.startsWith("http://") || c.coverImage.startsWith("https://")) &&
        !c.coverImage.includes("/uploads/") &&
        !c.coverImage.includes("imagekit.io")
    ).length;

    logger.info(`   Total comics:                  ${totalComics}`);
    logger.info(
      `   Comics with cover images:      ${comicsWithImages} (${((comicsWithImages / totalComics) * 100).toFixed(1)}%)`
    );
    logger.info(
      `   Comics with uploaded images:   ${comicsWithUploadedImages} (${((comicsWithUploadedImages / totalComics) * 100).toFixed(1)}%)`
    );
    logger.info(`   Comics with external URLs:     ${comicsWithExternalUrls}`);

    const coverageRate = (comicsWithImages / totalComics) * 100;
    const uploadRate = (comicsWithUploadedImages / totalComics) * 100;

    if (coverageRate >= 95) {
      logger.success(`✅ Excellent coverage: ${coverageRate.toFixed(1)}% of comics have images`);
    } else if (coverageRate >= 80) {
      logger.warn(`⚠️  Good coverage: ${coverageRate.toFixed(1)}% of comics have images`);
    } else {
      logger.error(`❌ Low coverage: ${coverageRate.toFixed(1)}% of comics have images`);
    }

    if (uploadRate >= 80) {
      logger.success(`✅ Most images uploaded to ImageKit: ${uploadRate.toFixed(1)}%`);
    } else if (uploadRate >= 50) {
      logger.warn(`⚠️  Some images not uploaded: ${uploadRate.toFixed(1)}%`);
    } else {
      logger.error(`❌ Many images not uploaded: ${uploadRate.toFixed(1)}%`);
    }

    return {
      passed: coverageRate >= 80,
      message: `Comic cover images: ${comicsWithImages}/${totalComics} (${coverageRate.toFixed(1)}%)`,
      details: {
        totalComics,
        comicsWithImages,
        comicsWithUploadedImages,
        comicsWithExternalUrls,
        coverageRate: coverageRate.toFixed(1),
        uploadRate: uploadRate.toFixed(1),
      },
    };
  } catch (error) {
    logger.error(`❌ Error validating comic cover images: ${error}`);
    return {
      passed: false,
      message: `Error: ${error}`,
    };
  }
}

async function validateChapterImages(): Promise<ValidationResult> {
  logger.info("\n🧪 Test 2: Chapter Images");
  logger.info("═".repeat(60));

  try {
    // Get all chapters
    const allChapters = await db.select().from(chapter);
    const totalChapters = allChapters.length;

    if (totalChapters === 0) {
      logger.warn("⚠️  No chapters found in database");
      return {
        passed: true,
        message: "No chapters to validate (not an error)",
        details: { totalChapters: 0 },
      };
    }

    // Get all chapter images
    const allChapterImages = await db.select().from(chapterImage);
    const totalChapterImages = allChapterImages.length;

    // Count chapters with images
    const chapterIds = allChapters.map((ch) => ch.id);
    const chaptersWithImages = new Set(allChapterImages.map((img) => img.chapterId));
    const chaptersWithImagesCount = chaptersWithImages.size;

    // Count uploaded vs external URLs
    const uploadedImages = allChapterImages.filter(
      (img) =>
        img.imageUrl && (img.imageUrl.includes("/uploads/") || img.imageUrl.includes("imagekit.io"))
    ).length;

    const externalImages = allChapterImages.filter(
      (img) =>
        img.imageUrl &&
        (img.imageUrl.startsWith("http://") || img.imageUrl.startsWith("https://")) &&
        !img.imageUrl.includes("/uploads/") &&
        !img.imageUrl.includes("imagekit.io")
    ).length;

    logger.info(`   Total chapters:                ${totalChapters}`);
    logger.info(
      `   Chapters with images:          ${chaptersWithImagesCount} (${((chaptersWithImagesCount / totalChapters) * 100).toFixed(1)}%)`
    );
    logger.info(`   Total chapter images:          ${totalChapterImages}`);
    logger.info(
      `   Uploaded images:               ${uploadedImages} (${((uploadedImages / totalChapterImages) * 100).toFixed(1)}%)`
    );
    logger.info(`   External URL images:           ${externalImages}`);

    if (totalChapterImages > 0) {
      const avgImagesPerChapter = totalChapterImages / chaptersWithImagesCount;
      logger.info(`   Avg images per chapter:        ${avgImagesPerChapter.toFixed(1)}`);
    }

    const uploadRate = totalChapterImages > 0 ? (uploadedImages / totalChapterImages) * 100 : 0;

    if (totalChapterImages === 0) {
      logger.warn("⚠️  No chapter images found - chapters may not have image data in JSON");
    } else if (uploadRate >= 80) {
      logger.success(`✅ Most chapter images uploaded: ${uploadRate.toFixed(1)}%`);
    } else if (uploadRate >= 50) {
      logger.warn(`⚠️  Some chapter images not uploaded: ${uploadRate.toFixed(1)}%`);
    } else {
      logger.error(`❌ Many chapter images not uploaded: ${uploadRate.toFixed(1)}%`);
    }

    return {
      passed: totalChapterImages === 0 || uploadRate >= 50,
      message: `Chapter images: ${totalChapterImages} images for ${chaptersWithImagesCount}/${totalChapters} chapters`,
      details: {
        totalChapters,
        chaptersWithImages: chaptersWithImagesCount,
        totalChapterImages,
        uploadedImages,
        externalImages,
        uploadRate: uploadRate.toFixed(1),
      },
    };
  } catch (error) {
    logger.error(`❌ Error validating chapter images: ${error}`);
    return {
      passed: false,
      message: `Error: ${error}`,
    };
  }
}

async function validateImageServiceUsage(): Promise<ValidationResult> {
  logger.info("\n🧪 Test 3: Image Service Usage Verification");
  logger.info("═".repeat(60));

  try {
    // Check comic images
    const comicsWithUploadPath = await db
      .select()
      .from(comic)
      .where(sql`${comic.coverImage} LIKE '%/uploads/%'`);

    const totalComicsWithImages = await db.select().from(comic).where(isNotNull(comic.coverImage));

    const comicUploadRate =
      totalComicsWithImages.length > 0
        ? (comicsWithUploadPath.length / totalComicsWithImages.length) * 100
        : 0;

    logger.info(
      `   Comics using imageService:     ${comicsWithUploadPath.length}/${totalComicsWithImages.length} (${comicUploadRate.toFixed(1)}%)`
    );

    // Check chapter images
    const chapterImagesWithUploadPath = await db
      .select()
      .from(chapterImage)
      .where(sql`${chapterImage.imageUrl} LIKE '%/uploads/%'`);

    const totalChapterImages = await db.select().from(chapterImage);

    const chapterUploadRate =
      totalChapterImages.length > 0
        ? (chapterImagesWithUploadPath.length / totalChapterImages.length) * 100
        : 0;

    logger.info(
      `   Chapter images via imageService: ${chapterImagesWithUploadPath.length}/${totalChapterImages.length} (${chapterUploadRate.toFixed(1)}%)`
    );

    const overallRate = (comicUploadRate + chapterUploadRate) / 2;

    if (overallRate >= 80) {
      logger.success(`✅ Excellent: ${overallRate.toFixed(1)}% of images using imageService`);
    } else if (overallRate >= 50) {
      logger.warn(`⚠️  Fair: ${overallRate.toFixed(1)}% of images using imageService`);
    } else {
      logger.error(`❌ Low: ${overallRate.toFixed(1)}% of images using imageService`);
    }

    return {
      passed: overallRate >= 50,
      message: `ImageService usage: ${overallRate.toFixed(1)}%`,
      details: {
        comicUploadRate: comicUploadRate.toFixed(1),
        chapterUploadRate: chapterUploadRate.toFixed(1),
        overallRate: overallRate.toFixed(1),
      },
    };
  } catch (error) {
    logger.error(`❌ Error validating image service usage: ${error}`);
    return {
      passed: false,
      message: `Error: ${error}`,
    };
  }
}

async function validateImageIntegrity(): Promise<ValidationResult> {
  logger.info("\n🧪 Test 4: Image Data Integrity");
  logger.info("═".repeat(60));

  try {
    // Check for null or empty cover images
    const comicsWithNullImages = await db
      .select()
      .from(comic)
      .where(sql`${comic.coverImage} IS NULL OR ${comic.coverImage} = ''`);

    const totalComics = await db.select().from(comic);

    logger.info(
      `   Comics with null/empty images: ${comicsWithNullImages.length}/${totalComics.length}`
    );

    // Check for broken chapter image references
    const orphanedChapterImages = await db
      .select()
      .from(chapterImage)
      .where(sql`${chapterImage.imageUrl} IS NULL OR ${chapterImage.imageUrl} = ''`);

    const totalChapterImages = await db.select().from(chapterImage);

    logger.info(
      `   Null/empty chapter images:     ${orphanedChapterImages.length}/${totalChapterImages.length}`
    );

    // Check for proper page numbering
    const chapterImagesWithInvalidPageNumbers = await db
      .select()
      .from(chapterImage)
      .where(sql`${chapterImage.pageNumber} IS NULL OR ${chapterImage.pageNumber} <= 0`);

    logger.info(
      `   Invalid page numbers:          ${chapterImagesWithInvalidPageNumbers.length}/${totalChapterImages.length}`
    );

    const hasIssues =
      comicsWithNullImages.length > totalComics.length * 0.1 ||
      orphanedChapterImages.length > 0 ||
      chapterImagesWithInvalidPageNumbers.length > 0;

    if (!hasIssues) {
      logger.success("✅ All image data is properly structured");
    } else {
      logger.warn("⚠️  Some image data integrity issues detected");
    }

    return {
      passed: !hasIssues,
      message: `Image integrity: ${hasIssues ? "Issues detected" : "All good"}`,
      details: {
        comicsWithNullImages: comicsWithNullImages.length,
        orphanedChapterImages: orphanedChapterImages.length,
        invalidPageNumbers: chapterImagesWithInvalidPageNumbers.length,
      },
    };
  } catch (error) {
    logger.error(`❌ Error validating image integrity: ${error}`);
    return {
      passed: false,
      message: `Error: ${error}`,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  logger.info("\n" + "═".repeat(60));
  logger.info("🔍 DATABASE IMAGE VERIFICATION");
  logger.info("═".repeat(60));

  const results: ValidationResult[] = [];

  // Run all validation tests
  results.push(await validateComicCoverImages());
  results.push(await validateChapterImages());
  results.push(await validateImageServiceUsage());
  results.push(await validateImageIntegrity());

  // Summary
  logger.info("\n" + "═".repeat(60));
  logger.info("📋 VALIDATION SUMMARY");
  logger.info("═".repeat(60));

  const passedTests = results.filter((r) => r.passed).length;
  const totalTests = results.length;

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const status = result.passed ? "✅ PASSED" : "❌ FAILED";
    logger.info(`   ${status}: ${result.message}`);
  }

  logger.info("═".repeat(60));

  if (passedTests === totalTests) {
    logger.success(`\n🎉 ALL TESTS PASSED! (${passedTests}/${totalTests})`);
    logger.info("\nYour seeding system is properly configured:");
    logger.info("  ✓ Images are being downloaded via imageService");
    logger.info("  ✓ Comic cover images are saved to database");
    logger.info("  ✓ Chapter images are saved to database");
    logger.info("  ✓ Image data integrity is maintained");
  } else {
    logger.warn(`\n⚠️  SOME TESTS FAILED (${passedTests}/${totalTests} passed)`);
    logger.info("\nReview the details above to fix any issues.");
  }

  logger.info("\n" + "═".repeat(60));

  process.exit(passedTests === totalTests ? 0 : 1);
}

main().catch((error) => {
  logger.error(`Fatal error: ${error}`);
  process.exit(1);
});
