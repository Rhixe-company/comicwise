import { logger } from "@/database/seed/logger";
/**
 * S3 Upload Provider
 * Handles file uploads to AWS S3
 */

export interface S3Config {
  accessKeyId: string;
  bucket: string;
  region: string;
  secretAccessKey: string;
}

export class S3Provider {
  constructor(private config: S3Config) {}

  async upload(file: File): Promise<{ url: string }> {
    logger.info(`${file}`);
    throw new Error("S3 upload not implemented yet");
  }
}
