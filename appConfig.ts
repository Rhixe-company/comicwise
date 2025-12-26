/* eslint-disable zod/require-strict */
import { z } from "zod";

// ═══════════════════════════════════════════════════
// ENVIRONMENT SCHEMA (Next.js 16 Optimized)
// ═══════════════════════════════════════════════════

const environmentSchema = z.object({
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
  UPLOAD_PROVIDER: z.enum(["imagekit", "cloudinary", "local", "aws"]).default("local"),

  // ImageKit
  IMAGEKIT_PUBLIC_KEY: z.string().optional(),
  IMAGEKIT_PRIVATE_KEY: z.string().optional(),
  IMAGEKIT_URL_ENDPOINT: z.string().url().optional(),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // AWS S3
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_S3_BUCKET_NAME: z.string().optional(),

  // ═══════════════════════════════════════════════════
  // Email Configuration (Nodemailer)
  // ═══════════════════════════════════════════════════
  EMAIL_SERVER_HOST: z.string().default("smtp.gmail.com"),
  EMAIL_SERVER_PORT: z.coerce.number().int().positive().default(587),
  EMAIL_SERVER_USER: z.string().default(""),
  EMAIL_SERVER_PASSWORD: z.string().default(""),
  EMAIL_FROM: z.string().email().default("noreplycomicwise.com"),
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

export type Environment = z.infer<typeof environmentSchema>;

// ═══════════════════════════════════════════════════
// ENVIRONMENT VALIDATION
// ═══════════════════════════════════════════════════

function validateEnvironment(): Environment {
  try {
    // Parse with fallback support for legacy SMTP variables
    const parsedEnvironment = environmentSchema.parse({
      ...process.env,
      PORT: process.env.PORT ?? "3000",
      EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST ?? process.env.SMTP_HOST ?? "smtp.gmail.com",
      EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT ?? process.env.SMTP_PORT ?? "587",
      EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER ?? process.env.SMTP_USER ?? "",
      EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD ?? process.env.SMTP_PASSWORD ?? "",
      EMAIL_FROM: process.env.EMAIL_FROM ?? process.env.SMTP_FROM ?? "noreplycomicwise.com",
      EMAIL_SECURE: process.env.EMAIL_SECURE ?? process.env.SMTP_SECURE ?? "false",
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    });

    return parsedEnvironment;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVariables = error.issues
        .filter((issue) => {
          const path = issue.path[0]?.toString() ?? "";
          // Filter out optional and legacy SMTP variables
          return (
            !path.startsWith("SMTP_") && !path.includes("OPTIONAL") && issue.code === "invalid_type"
          );
        })
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("\n  ");

      if (missingVariables) {
        console.warn(`⚠️  Environment validation warnings:\n  ${missingVariables}\n`);
      }

      // Return with defaults for non-critical vars
      return environmentSchema.parse({
        ...process.env,
        PORT: process.env.PORT ?? "3000",
        DATABASE_URL: process.env.DATABASE_URL ?? "",
        NEXTAUTH_SECRET: process.env.AUTH_SECRET ?? "",
        NEXTAUTH_URL: process.env.AUTH_URL ?? "",
        EMAIL_SERVER_HOST:
          process.env.EMAIL_SERVER_HOST ?? process.env.SMTP_HOST ?? "smtp.gmail.com",
        EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT ?? process.env.SMTP_PORT ?? "587",
        EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER ?? process.env.SMTP_USER ?? "",
        EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD ?? process.env.SMTP_PASSWORD ?? "",
        EMAIL_FROM: process.env.EMAIL_FROM ?? process.env.SMTP_FROM ?? "noreplycomicwise.com",
        EMAIL_SECURE: process.env.EMAIL_SECURE ?? process.env.SMTP_SECURE ?? "false",
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        NODE_ENV: process.env.NODE_ENV ?? "development",
        UPLOAD_PROVIDER: process.env.UPLOAD_PROVIDER ?? "local",
      });
    }
    throw error;
  }
}

// ═══════════════════════════════════════════════════
// VALIDATED ENVIRONMENT
// ═══════════════════════════════════════════════════

export const env = validateEnvironment();

// ═══════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════

/**
 * Check if a specific environment variable is set
 * param key
 */
export function hasEnvironment(key: keyof Environment): boolean {
  return !!env[key];
}

/**
 * Get environment variable with type safety
 * param key
 * param defaultValue
 */
export function getEnv<K extends keyof Environment>(
  key: K,
  defaultValue?: Environment[K]
): Environment[K] {
  return env[key] ?? (defaultValue as Environment[K]);
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

// Load environment variables early only on the server. We dynamically import
// `dotenv-safe` and `path` at runtime so this module can be imported from
// client code without bundling Node-only modules like `fs`.
if (typeof window === "undefined") {
  (async () => {
    try {
      const dotenvSafe = await import("dotenv-safe");
      const path = await import("path");
      dotenvSafe.config({
        example: (path as typeof import("path")).resolve(process.cwd(), ".env.local"),
      });
    } catch {
      // If dotenv-safe isn't available in the runtime environment, skip config.
      // This keeps client-side and constrained build environments from failing.
    }
  })();
}
// ═══════════════════════════════════════════════════
// APP CONFIGURATION (Next.js 16 Optimized)
// ═══════════════════════════════════════════════════

// re-exported from env.ts

// ═══════════════════════════════════════════════════
// APPLICATION CONFIGURATION
// ═══════════════════════════════════════════════════

const appConfig = {
  // ═══════════════════════════════════════════════════
  // App Metadata
  // ═══════════════════════════════════════════════════
  name: "ComicWise",
  description: "Modern comic reading platform with Next.js 16",
  url: env.NEXT_PUBLIC_APP_URL,
  version: "1.0.0",

  // ═══════════════════════════════════════════════════
  // Environment Flags
  // ═══════════════════════════════════════════════════
  env: {
    isProduction: isProduction,
    isDevelopment: isDevelopment,
    isTest: isTest,
    current: env.NODE_ENV,
  },

  // ═══════════════════════════════════════════════════
  // Database Configuration
  // ═══════════════════════════════════════════════════
  database: {
    url: env.DATABASE_URL,
    neonUrl: env.NEON_DATABASE_URL,
    pooling: isProduction,
  },

  // ═══════════════════════════════════════════════════
  // Authentication Configuration
  // ═══════════════════════════════════════════════════
  auth: {
    secret: env.AUTH_SECRET,
    url: env.AUTH_URL,
    sessionMaxAge: 30 * 24 * 60 * 60, // 30 days
    providers: {
      credentials: true,
      google: hasEnvironment("AUTH_GOOGLE_CLIENT_ID"),
      github: hasEnvironment("AUTH_GITHUB_CLIENT_ID"),
    },
  },

  // ═══════════════════════════════════════════════════
  // Pagination Configuration
  // ═══════════════════════════════════════════════════
  pagination: {
    defaultLimit: 12,
    maxLimit: 100,
    comicsPerPage: 12,
    chaptersPerPage: 20,
    commentsPerPage: 10,
  },

  // ═══════════════════════════════════════════════════
  // Session Configuration
  // ═══════════════════════════════════════════════════
  session: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 1 day
    strategy: "jwt" as const,
  },

  // ═══════════════════════════════════════════════════
  // Rate Limiting Configuration
  // ═══════════════════════════════════════════════════
  rateLimit: {
    default: { requests: 10, window: 10 }, // 10 requests per 10 seconds
    auth: { requests: 5, window: 15 * 60 }, // 5 requests per 15 minutes
    email: { requests: 3, window: 60 * 60 }, // 3 requests per hour
    api: { requests: 100, window: 60 }, // 100 requests per minute
    upload: { requests: 10, window: 60 * 60 }, // 10 uploads per hour
  },

  // ═══════════════════════════════════════════════════
  // Email Configuration
  // ═══════════════════════════════════════════════════
  email: {
    host: env.EMAIL_SERVER_HOST,
    port: env.EMAIL_SERVER_PORT,
    secure: env.EMAIL_SECURE,
    user: env.EMAIL_SERVER_USER ?? "",
    password: env.EMAIL_SERVER_PASSWORD ?? "",
    from: env.EMAIL_FROM,
    enabled: !!(env.EMAIL_SERVER_USER && env.EMAIL_SERVER_PASSWORD),
  },

  // ═══════════════════════════════════════════════════
  // Upload Configuration
  // ═══════════════════════════════════════════════════
  upload: {
    provider: env.UPLOAD_PROVIDER,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"],
    imageKit: {
      publicKey: env.IMAGEKIT_PUBLIC_KEY ?? "",
      privateKey: env.IMAGEKIT_PRIVATE_KEY ?? "",
      urlEndpoint: env.IMAGEKIT_URL_ENDPOINT ?? "",
      enabled: hasEnvironment("IMAGEKIT_PUBLIC_KEY"),
    },
    cloudinary: {
      cloudName: env.CLOUDINARY_CLOUD_NAME ?? "",
      apiKey: env.CLOUDINARY_API_KEY ?? "",
      apiSecret: env.CLOUDINARY_API_SECRET ?? "",
      enabled: hasEnvironment("CLOUDINARY_CLOUD_NAME"),
    },
    aws: {
      region: env.AWS_REGION ?? "",
      accessKeyId: env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY ?? "",
      bucketName: env.AWS_S3_BUCKET_NAME ?? "",
      enabled: hasEnvironment("AWS_ACCESS_KEY_ID"),
    },
  },

  // ═══════════════════════════════════════════════════
  // Background Jobs Configuration (QStash)
  // ═══════════════════════════════════════════════════
  qstash: {
    token: env.QSTASH_TOKEN ?? "",
    currentSigningKey: env.QSTASH_CURRENT_SIGNING_KEY ?? "",
    nextSigningKey: env.QSTASH_NEXT_SIGNING_KEY ?? "",
    url: env.QSTASH_URL ?? "",
    enabled: hasEnvironment("QSTASH_TOKEN"),
  },

  // ═══════════════════════════════════════════════════
  // Redis Configuration (Upstash)
  // ═══════════════════════════════════════════════════
  redis: {
    url: env.UPSTASH_REDIS_REST_URL ?? "",
    token: env.UPSTASH_REDIS_REST_TOKEN ?? "",
    enabled: hasEnvironment("UPSTASH_REDIS_REST_URL"),
  },

  // ═══════════════════════════════════════════════════
  // Security Configuration
  // ═══════════════════════════════════════════════════
  security: {
    bcryptRounds: isProduction ? 12 : 10,
    tokenExpiry: {
      passwordReset: 60 * 60 * 1000, // 1 hour
      emailVerification: 24 * 60 * 60 * 1000, // 24 hours
    },
  },

  // ═══════════════════════════════════════════════════
  // Feature Flags
  // ═══════════════════════════════════════════════════
  features: {
    comments: true,
    bookmarks: true,
    ratings: true,
    email: !!(env.EMAIL_SERVER_USER && env.EMAIL_SERVER_PASSWORD),
    emailVerification: true,
    oauth: hasEnvironment("AUTH_GOOGLE_CLIENT_ID") ?? hasEnvironment("AUTH_GITHUB_CLIENT_ID"),
    backgroundJobs: hasEnvironment("QSTASH_TOKEN"),
    rateLimiting: hasEnvironment("UPSTASH_REDIS_REST_URL"),
    imageUpload: hasEnvironment("IMAGEKIT_PUBLIC_KEY") ?? hasEnvironment("CLOUDINARY_CLOUD_NAME"),
  },
  customPassword: env.CUSTOM_PASSWORD ?? "",
} as const;

// ═══════════════════════════════════════════════════
// HELPER EXPORTS
// ═══════════════════════════════════════════════════

export default appConfig;

// Note: Rate limiting utilities moved to separate import
// import { checkRateLimit, clearRateLimit, getRateLimitStatus } from "@/lib/ratelimit";
