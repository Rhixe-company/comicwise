// ═══════════════════════════════════════════════════
// UPLOAD TYPES - Multi-Cloud Upload System
// ═══════════════════════════════════════════════════

/**
 * Upload provider type
 */
export type UploadProvider = "aws" | "cloudinary" | "imagekit" | "local";

/**
 * Upload options
 */
export interface UploadOptions {
  filename?: string;
  folder?: string;
  metadata?: Record<string, string>;
  provider?: UploadProvider;
  public?: boolean;
  tags?: string[];
  transformation?: ImageTransformation;
}

/**
 * Image transformation options
 */
export interface ImageTransformation {
  blur?: number;
  crop?: "crop" | "fill" | "fit" | "pad" | "scale";
  format?: "avif" | "jpg" | "png" | "webp";
  grayscale?: boolean;
  height?: number;
  quality?: number;
  sharpen?: boolean;
  width?: number;
}

/**
 * Upload result
 */
export interface UploadResult {
  format?: string;
  height?: number;
  metadata?: Record<string, unknown>;
  provider: UploadProvider;
  publicId: string;
  size: number;
  thumbnailUrl?: string;
  url: string;
  width?: number;
}

/**
 * Bulk upload options
 */
export interface BulkUploadOptions extends UploadOptions {
  concurrency?: number;
  onError?(filename: string, error: Error): void;
  onProgress?(current: number, total: number, filename: string): void;
  skipExisting?: boolean;
}

/**
 * Bulk upload result
 */
export interface BulkUploadResult {
  duration: number;
  failed: Array<{
    error: string;
    filename: string;
  }>;
  failedCount: number;
  successCount: number;
  successful: UploadResult[];
  total: number;
}

/**
 * Upload progress
 */
export interface UploadProgress {
  current: number;
  error?: string;
  filename: string;
  percent: number;
  status: "completed" | "failed" | "pending" | "uploading";
  total: number;
}

/**
 * Cloud storage configuration
 */
export interface CloudStorageConfig {
  credentials: Record<string, string>;
  defaults?: UploadOptions;
  provider: UploadProvider;
}

/**
 * Send email options
 */
export interface SendEmailOptions {
  attachments?: Array<{
    content: Buffer | string;
    contentType?: string;
    encoding?: string;
    filename: string;
  }>;
  bcc?: string | string[];
  cc?: string | string[];
  from?: string;
  html: string;
  replyTo?: string;
  subject: string;
  text?: string;
  to: string | string[];
}
