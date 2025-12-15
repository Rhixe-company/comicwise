// ═══════════════════════════════════════════════════
// IMAGEKIT UPLOAD PROVIDER
// Next.js 16.0.7 + ImageKit Integration
// ═══════════════════════════════════════════════════

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck - ImageKit SDK has incomplete type definitions
import { env } from "@/app-config";
import ImageKit from "imagekit";

import type { UploadOptions, UploadProvider, UploadResult } from "@/services/upload/index";

// Validate ImageKit configuration
if (!env.IMAGEKIT_PUBLIC_KEY || !env.IMAGEKIT_PRIVATE_KEY || !env.IMAGEKIT_URL_ENDPOINT) {
  throw new Error(
    "ImageKit configuration missing. Set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT."
  );
}

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: env.IMAGEKIT_PUBLIC_KEY,
  privateKey: env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
});

export class ImageKitProvider implements UploadProvider {
  /**
   * Upload file to ImageKit
   */
  async upload(
    file: File | Buffer,
    options: UploadOptions & { transformation?: Record<string, unknown> } = {}
  ): Promise<UploadResult> {
    try {
      let buffer: Buffer;
      // Convert File to Buffer if needed
      if (typeof File !== "undefined" && file instanceof File) {
        const arrayBuffer = await file.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      } else if (Buffer.isBuffer(file)) {
        buffer = file;
      } else {
        return {
          url: "",
          publicId: "",
          size: 0,
          format: "",
          success: false,
          error: "Invalid file type. Must be Buffer or File.",
        };
      }

      // Prepare transformation options
      const transformation = options.transformation || undefined;

      // Upload to ImageKit
      const result = await imagekit.upload({
        file: buffer,
        fileName: options.filename || `image-${Date.now()}`,
        folder: options.folder || "/comicwise",
        tags: options.tags,
        useUniqueFileName: !options.filename,
        transformation,
      });

      return {
        url: result.url,
        publicId: result.fileId,
        width: result.width,
        height: result.height,
        format: result.fileType,
        size: result.size,
        thumbnail: this.getThumbnailUrl(result.url),
        success: true,
      };
    } catch (error) {
      return {
        url: "",
        publicId: "",
        size: 0,
        format: "",
        success: false,
        error: error instanceof Error ? error.message : "ImageKit upload failed",
      };
    }
  }

  /**
   * Delete file from ImageKit
   */
  async delete(publicId: string): Promise<boolean> {
    try {
      await imagekit.deleteFile(publicId);
      return true;
    } catch (error) {
      console.error("ImageKit delete error:", error);
      return false;
    }
  }

  /**
   * Get optimized URL with transformations
   */
  getUrl(publicId: string, transformation?: Record<string, unknown>): string {
    try {
      // Get file details to construct URL
      const fileDetails = imagekit.url({
        path: publicId,
        transformation: this.buildTransformation(transformation),
      });
      return fileDetails;
    } catch (error) {
      console.error("ImageKit URL generation error:", error);
      return publicId;
    }
  }

  /**
   * Get thumbnail URL
   */
  getThumbnailUrl(url: string, width = 300, height = 300): string {
    return imagekit.url({
      src: url,
      transformation: [
        {
          width: width.toString(),
          height: height.toString(),
          cropMode: "at_max",
          quality: "80",
        },
      ],
    });
  }

  /**
   * Get responsive image URLs
   */
  getResponsiveUrls(url: string): Record<string, string> {
    return {
      small: this.getTransformedUrl(url, { width: 640 }),
      medium: this.getTransformedUrl(url, { width: 1024 }),
      large: this.getTransformedUrl(url, { width: 1920 }),
      thumbnail: this.getThumbnailUrl(url),
    };
  }

  /**
   * Helper: Build transformation string
   */
  private buildTransformation(transformation?: Record<string, unknown>): Array<{
    [key: string]: string;
  }> {
    if (!transformation) {
      return [{ quality: "80", format: "auto" }];
    }

    const transformationArray: Array<{ [key: string]: string }> = [];
    const transformObj: { [key: string]: string } = {};

    const allowedKeys = [
      "width",
      "height",
      "quality",
      "format",
      "cropMode",
      "focus",
      "radius",
      "background",
      "border",
      "rotation",
      "blur",
      "named",
    ];
    for (const allowedKey of allowedKeys) {
      if (
        Object.prototype.hasOwnProperty.call(transformation, allowedKey) &&
        typeof transformation[allowedKey] !== "object" &&
        typeof transformation[allowedKey] !== "function"
      ) {
        transformObj[allowedKey] = String(transformation[allowedKey]);
      }
    }

    transformationArray.push(transformObj);
    return transformationArray;
  }

  /**
   * Helper: Get transformed URL
   */
  private getTransformedUrl(url: string, transformation: Record<string, unknown>): string {
    return imagekit.url({
      src: url,
      transformation: this.buildTransformation(transformation),
    });
  }

  /**
   * Bulk upload images
   */
  async bulkUpload(
    files: Array<File | Buffer>,
    options: UploadOptions = {}
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];

    for (const file of files) {
      try {
        const result = await this.upload(file, options);
        results.push(result);
      } catch (error) {
        console.error("Bulk upload error:", error);
        // Continue with other files
      }
    }

    return results;
  }
}
