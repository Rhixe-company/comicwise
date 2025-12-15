import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

export interface ImageDownloadResult {
  success: boolean;
  localPath?: string;
  url: string;
  error?: string;
}

export class ImageService {
  private readonly publicDir: string;
  private readonly downloadedImages = new Map<string, string>();

  constructor(publicDir: string = "public") {
    this.publicDir = publicDir;
  }

  /**
   * Generate a hash for the image URL to use as filename
   */
  private generateHash(url: string): string {
    return crypto.createHash("md5").update(url).digest("hex");
  }

  /**
   * Get file extension from URL
   */
  private getExtension(url: string): string {
    const urlPath = new URL(url).pathname;
    const ext = path.extname(urlPath);
    return ext || ".webp";
  }

  /**
   * Check if image already exists locally
   */
  private async imageExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Download image from URL and save locally
   */
  async downloadImage(url: string, subDirectory: string = "uploads"): Promise<ImageDownloadResult> {
    try {
      // Check if already downloaded
      if (this.downloadedImages.has(url)) {
        return {
          success: true,
          localPath: this.downloadedImages.get(url)!,
          url,
        };
      }

      // Generate unique filename
      const hash = this.generateHash(url);
      const ext = this.getExtension(url);
      const fileName = `${hash}${ext}`;

      // Create directory structure
      const uploadDir = path.join(this.publicDir, subDirectory);
      await fs.mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, fileName);
      const publicPath = `/${subDirectory}/${fileName}`;

      // Check if file already exists
      if (await this.imageExists(filePath)) {
        this.downloadedImages.set(url, publicPath);
        return {
          success: true,
          localPath: publicPath,
          url,
        };
      }

      // Download the image
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(buffer));

      this.downloadedImages.set(url, publicPath);

      return {
        success: true,
        localPath: publicPath,
        url,
      };
    } catch (error) {
      return {
        success: false,
        url,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Download multiple images in batch
   */
  async downloadImageBatch(
    urls: string[],
    subDirectory: string = "uploads",
    concurrency: number = 5
  ): Promise<ImageDownloadResult[]> {
    const results: ImageDownloadResult[] = [];

    for (let i = 0; i < urls.length; i += concurrency) {
      const batch = urls.slice(i, i + concurrency);
      const batchResults = await Promise.all(
        batch.map((url) => this.downloadImage(url, subDirectory))
      );
      results.push(...batchResults);
    }

    return results;
  }

  /**
   * Process image URL - download if remote, keep if local
   */
  async processImageUrl(
    url: string | null | undefined,
    subDirectory: string = "uploads"
  ): Promise<string | null> {
    if (!url) {
      return null;
    }

    // If it's already a local path, return as-is
    if (url.startsWith("/")) {
      return url;
    }

    // Download remote image
    const result = await this.downloadImage(url, subDirectory);
    return result.success ? result.localPath! : null;
  }

  /**
   * Get statistics about downloaded images
   */
  getStats() {
    return {
      totalDownloaded: this.downloadedImages.size,
      images: Array.from(this.downloadedImages.entries()).map(([url, path]) => ({
        url,
        path,
      })),
    };
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.downloadedImages.clear();
  }
}

// Export singleton instance
export const imageService = new ImageService();
