// ═══════════════════════════════════════════════════
// AWS S3 UPLOAD PROVIDER
// Next.js 16.0.7 + AWS S3 Integration
// ═══════════════════════════════════════════════════

import { env } from "@/app-config";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import type { UploadOptions, UploadProvider, UploadResult } from "@/services/upload/index";

// Validate AWS S3 configuration
if (!env.AWS_REGION || !env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY || !env.AWS_S3_BUCKET_NAME) {
  throw new Error(
    "AWS S3 configuration missing. Set AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET_NAME."
  );
}

// Initialize S3 Client
const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export class S3Provider implements UploadProvider {
  private readonly bucketName = env.AWS_S3_BUCKET_NAME!;
  private readonly region = env.AWS_REGION!;
  
  /**
   * Upload file to AWS S3 with improved error handling
   */
  async upload(
    file: File | Buffer,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      let buffer: Buffer;
      let contentType: string = "application/octet-stream";
      
      // Convert File to Buffer if needed
      if (typeof File !== "undefined" && file instanceof File) {
        const arrayBuffer = await file.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
        contentType = file.type || this.getContentType(file.name);
      } else if (Buffer.isBuffer(file)) {
        buffer = file;
        contentType = this.getContentType(options.filename || "file");
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

      // Validate buffer size (S3 has 5GB limit for PutObject)
      const maxSize = 5 * 1024 * 1024 * 1024; // 5GB limit
      if (buffer.length > maxSize) {
        return {
          url: "",
          publicId: "",
          size: buffer.length,
          format: "",
          success: false,
          error: `File too large: ${(buffer.length / 1024 / 1024 / 1024).toFixed(2)}GB (max 5GB)`,
        };
      }

      // Construct S3 key (path)
      const folder = options.folder || "uploads";
      const timestamp = Date.now();
      const filename = options.filename || `file-${timestamp}`;
      const extension = this.getExtension(filename);
      const key = `${folder}/${filename}${extension}`;

      // Upload to S3
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        Metadata: {
          uploadedAt: new Date().toISOString(),
          ...(options.tags && { tags: options.tags.join(",") }),
        },
      });

      await s3Client.send(uploadCommand);

      // Construct public URL
      const url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;

      return {
        url,
        publicId: key,
        width: undefined,
        height: undefined,
        format: extension.replace(".", ""),
        size: buffer.length,
        thumbnail: url, // S3 doesn't auto-generate thumbnails
        success: true,
      };
    } catch (error) {
      // Extract meaningful error message
      let errorMessage = "AWS S3 upload failed";
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Check for common S3 errors
        if (errorMessage.includes("NoSuchBucket")) {
          errorMessage = "S3 bucket does not exist";
        } else if (errorMessage.includes("AccessDenied") || errorMessage.includes("InvalidAccessKeyId")) {
          errorMessage = "AWS authentication failed - check credentials";
        } else if (errorMessage.includes("NetworkingError") || errorMessage.includes("ECONNREFUSED")) {
          errorMessage = "Network connection failed";
        } else if (errorMessage.includes("EntityTooLarge")) {
          errorMessage = "File size exceeds S3 limits";
        }
      }

      return {
        url: "",
        publicId: "",
        size: 0,
        format: "",
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Delete file from AWS S3
   */
  async delete(publicId: string): Promise<boolean> {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: publicId,
      });

      await s3Client.send(deleteCommand);
      return true;
    } catch (error) {
      console.error("AWS S3 delete error:", error);
      return false;
    }
  }

  /**
   * Get URL for S3 object
   */
  getUrl(publicId: string, transformation?: Record<string, unknown>): string {
    // S3 doesn't support URL transformations natively
    // For transformations, you'd need CloudFront + Lambda@Edge or similar
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${publicId}`;
  }

  /**
   * Get content type from filename
   */
  private getContentType(filename: string): string {
    const ext = this.getExtension(filename).toLowerCase();
    const contentTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
      ".mp4": "video/mp4",
      ".webm": "video/webm",
    };
    return contentTypes[ext] || "application/octet-stream";
  }

  /**
   * Get file extension
   */
  private getExtension(filename: string): string {
    const lastDot = filename.lastIndexOf(".");
    return lastDot !== -1 ? filename.substring(lastDot) : "";
  }
}
