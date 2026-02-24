// ═══════════════════════════════════════════════════════════════════════════
// UPLOAD SERVICE TYPES - Unified type definitions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Supported upload providers
 */
export type UploadProviderType = "cloudinary" | "imagekit" | "local";

/**
 * Upload types for categorizing images
 */
export type UploadType = "avatar" | "chapter-image" | "comic-cover" | "general";

/**
 * File upload configuration options
 */
export interface UploadOptions {
  /** Custom filename without extension */
  filename?: string;
  /** Folder path in storage (e.g., "comicwise/comics") */
  folder?: string;
  /** Tags for organizing/filtering uploads */
  tags?: string[];
  /** Image transformation options (provider-specific) */
  transformation?: Record<string, unknown>;
}

/**
 * Result of a successful upload operation
 */
export interface UploadResult {
  /** Error message if upload failed */
  error?: string;
  /** File format/extension */
  format?: string;
  /** Image height in pixels (if available) */
  height?: number;
  /** Provider-specific public ID for file identification */
  publicId: string;
  /** File size in bytes */
  size: number;
  /** Whether upload was successful */
  success?: boolean;
  /** Thumbnail URL (if provider supports) */
  thumbnail?: string;
  /** Public URL to access the uploaded file */
  url: string;
  /** Image width in pixels (if available) */
  width?: number;
}

/**
 * Provider interface for different storage backends
 * Each provider must implement these methods
 */
export interface UploadProvider {
  /**
   * Delete a file from storage
   * param publicId - File ID returned from upload
   * returns true if deletion was successful
   */
  delete(publicId: string): Promise<boolean>;

  /**
   * Get public URL for a file with optional transformations
   * param publicId - File ID
   * param transformation - Transform options (provider-specific)
   * returns Public URL with transformations applied
   */
  getUrl(publicId: string, transformation?: Record<string, unknown>): string;

  /**
   * Upload a file to the storage backend
   * param file - File or Buffer to upload
   * param options - Upload configuration
   * returns Upload result with URL and metadata
   */
  upload(file: Buffer | File, options?: UploadOptions): Promise<UploadResult>;
}

/**
 * Configuration for a specific provider
 */
export interface ProviderConfig {
  /** Provider-specific configuration */
  config?: Record<string, boolean | number | string>;
  /** Whether this provider is enabled */
  enabled: boolean;
  /** Provider type */
  provider: UploadProviderType;
}

/**
 * Validation result for file uploads
 */
export interface FileValidationResult {
  /** Error message if validation failed */
  error?: string;
  /** Whether the file is valid */
  valid: boolean;
}

/**
 * Image transformation options
 */
export interface ImageTransformation {
  /** Crop mode (fill, scale, etc.) */
  crop?: string;
  /** Output format (jpeg, png, webp, etc.) */
  format?: string;
  /** Image height in pixels */
  height?: number;
  /** Image quality (1-100) */
  quality?: number;
  /** Image width in pixels */
  width?: number;
}

/**
 * File upload constraints
 */
export interface UploadConstraints {
  /** Allowed MIME types */
  allowedMimeTypes: string[];
  /** Whether multiple files can be uploaded at once */
  allowMultiple: boolean;
  /** Maximum file size in MB */
  maxSizeMB: number;
}

/**
 * Default upload constraints by type
 */
export const UPLOAD_CONSTRAINTS: Record<UploadType, UploadConstraints> = {
  "comic-cover": {
    maxSizeMB: 10,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    allowMultiple: false,
  },
  "chapter-image": {
    maxSizeMB: 10,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    allowMultiple: true,
  },
  avatar: {
    maxSizeMB: 5,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    allowMultiple: false,
  },
  general: {
    maxSizeMB: 10,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    allowMultiple: true,
  },
};

/**
 * Get upload constraints for a specific upload type
 * param type - Upload type
 * returns Upload constraints
 * @param type
 */
export function getUploadConstraints(type: UploadType): UploadConstraints {
  return UPLOAD_CONSTRAINTS[type] || UPLOAD_CONSTRAINTS.general;
}
