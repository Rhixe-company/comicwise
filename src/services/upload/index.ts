// ═══════════════════════════════════════════════════
// IMAGE UPLOAD SERVICE - Universal Provider Interface
// Next.js 16.0.7 Optimized
// ═══════════════════════════════════════════════════

import { getUploadProvider } from "@/services/upload/factory";

export interface UploadOptions {
  filename?: string;
  folder?: string;
  tags?: string[];
  transformation?: Record<string, unknown>;
}

export interface UploadResult {
  error?: string;
  format?: string;
  height?: number;
  publicId: string;
  size: number;
  success?: boolean;
  thumbnail?: string;
  url: string;
  width?: number;
}

export interface UploadProvider {
  delete(publicId: string): Promise<boolean>;
  getUrl(publicId: string, transformation?: Record<string, unknown>): string;
  upload(file: Buffer | File, options?: UploadOptions): Promise<UploadResult>;
}

// ═══════════════════════════════════════════════════
// PROVIDER FACTORY & IMPORTS
// ═══════════════════════════════════════════════════

export {
  getAvailableProviders,
  getConfiguredProvider,
  getUploadProvider,
  isProviderAvailable,
} from "@/services/upload/factory";

// ═══════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════

/**
 *
 * param file
 * param options
 * @param file
 * @param options
 */
export async function uploadImage(
  file: Buffer | File,
  options?: UploadOptions
): Promise<UploadResult> {
  const provider = await getUploadProvider();
  return provider.upload(file, options);
}

/**
 *
 * param publicId
 * @param publicId
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  const provider = await getUploadProvider();
  return provider.delete(publicId);
}

/**
 *
 * param publicId
 * param transformation
 * @param publicId
 * @param transformation
 */
export async function getImageUrl(
  publicId: string,
  transformation?: Record<string, unknown>
): Promise<string> {
  const provider = await getUploadProvider();
  return provider.getUrl(publicId, transformation);
}

// ═══════════════════════════════════════════════════════════════════════════
// RE-EXPORTS - Make types available from main export
// ═══════════════════════════════════════════════════════════════════════════

export type {
  FileValidationResult,
  ImageTransformation,
  UploadConstraints,
  UploadProviderType,
  UploadType,
} from "@/services/upload/types";
