/**
 * 🌱 Image Service Wrapper - Integration with existing imageService.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * Handles image downloads with caching and deduplication
 */

import { logger } from "@/database/seed/logger";
import { ImageService } from "@/services/imageService";
import fs from "fs/promises";
import path from "path";

// ═══════════════════════════════════════════════════════════════════════════
// IMAGE DOWNLOAD RESULT
// ═══════════════════════════════════════════════════════════════════════════

export interface ImageDownloadResult {
  original: string;
  local?: string;
  cached: boolean;
  success: boolean;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// IMAGE HANDLER SINGLETON
// ═══════════════════════════════════════════════════════════════════════════

let imageService: ImageService | null = null;
const downloadCache = new Map<string, string>();
const fileSystemCache = new Set<string>();

/**
 * Get or initialize image service
 */
export async function getImageHandler(): Promise<ImageService> {
  imageService ??= new ImageService();
  return imageService;
}

/**
 * Build file path for upload directory
 * @param filename
 */
export function getUploadPath(filename: string): string {
  return path.join(process.cwd(), "public", "uploads", filename);
}

/**
 * Check if file exists locally
 * @param filePath
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Load file system cache on startup
 */
async function initializeFileSystemCache(): Promise<void> {
  try {
    const uploadsDirectory = path.join(process.cwd(), "public", "uploads");
    const files = await fs.readdir(uploadsDirectory, { withFileTypes: true });

    files.forEach((file) => {
      if (file.isFile()) {
        fileSystemCache.add(file.name);
      }
    });

    logger.debug(`Initialized file system cache with ${fileSystemCache.size} files`);
  } catch (error) {
    logger.warn(`Failed to initialize file system cache: ${error}`);
  }
}

/**
 * Extract filename from URL
 * @param url
 */
function extractFilename(url: string): string {
  try {
    const urlPath = new URL(url).pathname;
    return path.basename(urlPath);
  } catch {
    return "";
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DOWNLOAD IMAGE WITH CACHING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Download image with triple-layer caching:
 * 1. Session cache (in-memory)
 * 2. File system check
 * 3. Remote download via imageService
 * @param url
 * @param subDirectory
 */
export async function downloadImage(
  url: string,
  subDirectory: string = "uploads"
): Promise<ImageDownloadResult> {
  if (!url) {
    return {
      original: url,
      success: false,
      cached: false,
      error: "Empty URL",
    };
  }

  // Check if it's a local path (starts with / or relative path)
  if (url.startsWith("/") || (!url.startsWith("http://") && !url.startsWith("https://"))) {
    logger.debug(`Using local path: ${url}`);
    downloadCache.set(url, url);
    return {
      original: url,
      local: url,
      success: true,
      cached: true,
    };
  }

  // Layer 1: Check session cache
  if (downloadCache.has(url)) {
    const cached = downloadCache.get(url);
    if (cached) {
      logger.debug(`Image cached (session): ${extractFilename(url)}`);
      return {
        original: url,
        local: cached,
        success: true,
        cached: true,
      };
    }
  }

  try {
    // Layer 2: Check file system
    const filename = extractFilename(url);
    if (filename && fileSystemCache.has(filename)) {
      const localPath = `/uploads/${filename}`;
      downloadCache.set(url, localPath);
      logger.debug(`Image cached (file system): ${filename}`);
      return {
        original: url,
        local: localPath,
        success: true,
        cached: true,
      };
    }

    // Layer 3: Download via imageService
    const imageHandler = await getImageHandler();
    const result = await imageHandler.downloadImage(url, subDirectory);

    if (result.success && result.localPath) {
      downloadCache.set(url, result.localPath);
      fileSystemCache.add(path.basename(result.localPath));
      logger.debug(`Image downloaded: ${extractFilename(url)}`);
      return {
        original: url,
        local: result.localPath,
        success: true,
        cached: false,
      };
    } else {
      return {
        original: url,
        success: false,
        cached: false,
        error: result.error ?? "Download failed",
      };
    }
  } catch (error) {
    logger.warn(`Failed to download image: ${url} - ${error}`);
    return {
      original: url,
      success: false,
      cached: false,
      error: String(error),
    };
  }
}

/**
 * Download multiple images with concurrency control
 * @param urls
 * @param concurrency
 */
export async function downloadImages(
  urls: string[],
  concurrency: number = 3
): Promise<ImageDownloadResult[]> {
  const results: ImageDownloadResult[] = [];
  const chunks: string[][] = [];

  for (let i = 0; i < urls.length; i += concurrency) {
    chunks.push(urls.slice(i, i + concurrency));
  }

  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map((url) => downloadImage(url)));
    results.push(...chunkResults);
  }

  return results;
}

/**
 * Initialize image handler
 */
export async function initializeImageHandler(): Promise<void> {
  await getImageHandler();
  await initializeFileSystemCache();
  logger.info("Image handler initialized");
}

/**
 * Get image statistics
 */
export function getImageStats(): { sessionCached: number; fileSystemCached: number; totalUnique: number } {
  return {
    sessionCached: downloadCache.size,
    fileSystemCached: fileSystemCache.size,
    totalUnique: downloadCache.size + fileSystemCache.size,
  };
}

/**
 * Reset image handler
 */
export function resetImageHandler(): void {
  imageService = null;
  downloadCache.clear();
  fileSystemCache.clear();
  logger.debug("Image handler reset");
}
