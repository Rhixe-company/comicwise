// ═══════════════════════════════════════════════════
// IMAGE UPLOAD SERVICE - Universal Provider Interface
// Next.js 16.0.7 Optimized
// ═══════════════════════════════════════════════════

import { env } from "@/app-config";

export interface UploadOptions {
  folder?: string;
  filename?: string;
  transformation?: Record<string, unknown>;
  tags?: string[];
}

export interface UploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  size: number;
  thumbnail?: string;
  success?: boolean;
  error?: string;
}

export interface UploadProvider {
  upload(file: File | Buffer, options?: UploadOptions): Promise<UploadResult>;
  delete(publicId: string): Promise<boolean>;
  getUrl(publicId: string, transformation?: Record<string, unknown>): string;
}

// ═══════════════════════════════════════════════════
// PROVIDER FACTORY
// ═══════════════════════════════════════════════════

export async function getUploadProvider(): Promise<UploadProvider> {
  const provider: "imagekit" | "cloudinary" | "local" = env.UPLOAD_PROVIDER;
  const { CloudinaryProvider } = await import("./providers/cloudinary");
  const { ImageKitProvider } = await import("./providers/imagekit");
  const { LocalProvider } = await import("./providers/local");
  switch (provider) {
    case "cloudinary":
      return new CloudinaryProvider();

    case "imagekit":
      return new ImageKitProvider();

    case "local":
      return new LocalProvider();

    default:
      throw new Error(`Unknown upload provider: ${provider}`);
  }
}

// ═══════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════

export async function uploadImage(
  file: File | Buffer,
  options?: UploadOptions
): Promise<UploadResult> {
  const provider = await getUploadProvider();
  return provider.upload(file, options);
}

export async function deleteImage(publicId: string): Promise<boolean> {
  const provider = await getUploadProvider();
  return provider.delete(publicId);
}

export async function getImageUrl(
  publicId: string,
  transformation?: Record<string, unknown>
): Promise<string> {
  const provider = await getUploadProvider();
  return provider.getUrl(publicId, transformation);
}
