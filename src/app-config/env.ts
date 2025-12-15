/* eslint-disable zod/require-strict */
import { z } from "zod";

// ═══════════════════════════════════════════════════
// ENVIRONMENT SCHEMA (Next.js 16 Optimized)
// ═══════════════════════════════════════════════════

const envSchema = z.object({
  // ═══════════════════════════════════════════════════
  // Database Configuration
  // ═══════════════════════════════════════════════════
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  NEON_DATABASE_URL: z.string().url().optional(),

  // ═══════════════════════════════════════════════════
  // Authentication (Next-Auth v5)
  // ═══════════════════════════════════════════════════
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
  AUTH_URL: z.string().url("AUTH_URL must be a valid URL"),

  // ═══════════════════════════════════════════════════
  // Upload Services
  // ═══════════════════════════════════════════════════
  UPLOAD_PROVIDER: z.enum(["imagekit", "cloudinary", "local"]).default("local"),

  // ImageKit
  IMAGEKIT_PUBLIC_KEY: z.string().optional(),
  IMAGEKIT_PRIVATE_KEY: z.string().optional(),
  IMAGEKIT_URL_ENDPOINT: z.string().url().optional(),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // ═══════════════════════════════════════════════════
  // Email Configuration (Nodemailer)
  // ═══════════════════════════════════════════════════
  EMAIL_SERVER_HOST: z.string().default("smtp.gmail.com"),
  EMAIL_SERVER_PORT: z.coerce.number().int().positive().default(587),
  EMAIL_SERVER_USER: z.string().default(""),
  EMAIL_SERVER_PASSWORD: z.string().default(""),
  EMAIL_FROM: z.string().email().default("noreply@comicwise.com"),
  EMAIL_SECURE: z.coerce.boolean().default(false),

  // Legacy SMTP support (backwards compatibility)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),
  SMTP_SECURE: z.coerce.boolean().optional(),

  // ═══════════════════════════════════════════════════
  // Background Jobs (QStash)
  // ═══════════════════════════════════════════════════
  QSTASH_TOKEN: z.string().optional(),
  QSTASH_CURRENT_SIGNING_KEY: z.string().optional(),
  QSTASH_NEXT_SIGNING_KEY: z.string().optional(),
  QSTASH_URL: z.string().url().optional(),

  // ═══════════════════════════════════════════════════
  // Redis Configuration (ioredis for caching & BullMQ)
  // ═══════════════════════════════════════════════════
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.coerce.number().int().nonnegative().default(0),
  REDIS_URL: z.string().optional(),
  REDIS_TLS_ENABLED: z.coerce.boolean().default(false),

  // ═══════════════════════════════════════════════════
  // Rate Limiting (Upstash Redis - Optional Alternative)
  // ═══════════════════════════════════════════════════
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // ═══════════════════════════════════════════════════
  // Application Configuration
  // ═══════════════════════════════════════════════════
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  // ═══════════════════════════════════════════════════
  // OAuth Providers (Optional)
  // ═══════════════════════════════════════════════════
  AUTH_GOOGLE_CLIENT_ID: z.string().optional(),
  AUTH_GOOGLE_CLIENT_SECRET: z.string().optional(),
  AUTH_GITHUB_CLIENT_ID: z.string().optional(),
  AUTH_GITHUB_CLIENT_SECRET: z.string().optional(),
  CUSTOM_PASSWORD: z.string().optional(),
});

// ═══════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════

export type Env = z.infer<typeof envSchema>;

// ═══════════════════════════════════════════════════
// ENVIRONMENT VALIDATION
// ═══════════════════════════════════════════════════

function validateEnv(): Env {
  try {
    // Parse with fallback support for legacy SMTP variables
    const parsedEnv = envSchema.parse({
      ...process.env,
      PORT: process.env.PORT || "3000",
      EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST || process.env.SMTP_HOST || "smtp.gmail.com",
      EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT || process.env.SMTP_PORT || "587",
      EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER || process.env.SMTP_USER || "",
      EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD || process.env.SMTP_PASSWORD || "",
      EMAIL_FROM: process.env.EMAIL_FROM || process.env.SMTP_FROM || "noreply@comicwise.com",
      EMAIL_SECURE: process.env.EMAIL_SECURE || process.env.SMTP_SECURE || "false",
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    });

    return parsedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .filter((issue) => {
          const path = issue.path[0]?.toString() || "";
          // Filter out optional and legacy SMTP variables
          return (
            !path.startsWith("SMTP_") && !path.includes("OPTIONAL") && issue.code === "invalid_type"
          );
        })
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("\n  ");

      if (missingVars) {
        console.warn(`⚠️  Environment validation warnings:\n  ${missingVars}\n`);
      }

      // Return with defaults for non-critical vars
      return envSchema.parse({
        ...process.env,
        PORT: process.env.PORT || "3000",
        DATABASE_URL: process.env.DATABASE_URL || "",
        NEXTAUTH_SECRET: process.env.AUTH_SECRET || "",
        NEXTAUTH_URL: process.env.AUTH_URL || "",
        EMAIL_SERVER_HOST:
          process.env.EMAIL_SERVER_HOST || process.env.SMTP_HOST || "smtp.gmail.com",
        EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT || process.env.SMTP_PORT || "587",
        EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER || process.env.SMTP_USER || "",
        EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD || process.env.SMTP_PASSWORD || "",
        EMAIL_FROM: process.env.EMAIL_FROM || process.env.SMTP_FROM || "noreply@comicwise.com",
        EMAIL_SECURE: process.env.EMAIL_SECURE || process.env.SMTP_SECURE || "false",
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        NODE_ENV: process.env.NODE_ENV || "development",
        UPLOAD_PROVIDER: process.env.UPLOAD_PROVIDER || "local",
      });
    }
    throw error;
  }
}

// ═══════════════════════════════════════════════════
// VALIDATED ENVIRONMENT
// ═══════════════════════════════════════════════════

export const env = validateEnv();

// ═══════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════

/**
 * Check if a specific environment variable is set
 */
export function hasEnv(key: keyof Env): boolean {
  return !!env[key];
}

/**
 * Get environment variable with type safety
 */
export function getEnv<K extends keyof Env>(key: K, defaultValue?: Env[K]): Env[K] {
  return env[key] ?? (defaultValue as Env[K]);
}

/**
 * Check if running in production
 */
export const isProduction = env.NODE_ENV === "production";

/**
 * Check if running in development
 */
export const isDevelopment = env.NODE_ENV === "development";

/**
 * Check if running in test
 */
export const isTest = env.NODE_ENV === "test";
