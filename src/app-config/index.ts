import { env, getEnv, hasEnv, isDevelopment, isProduction, isTest } from "src/app-config/env";

// Load environment variables early only on the server. We dynamically import
// `dotenv-safe` and `path` at runtime so this module can be imported from
// client code without bundling Node-only modules like `fs`.
if (typeof window === "undefined") {
  (async () => {
    try {
      const dotenvSafe = await import("dotenv-safe");
      const path = await import("path");
      dotenvSafe.config({
        example: (path as typeof import("path")).resolve(process.cwd(), ".env"),
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
      google: hasEnv("AUTH_GOOGLE_CLIENT_ID"),
      github: hasEnv("AUTH_GITHUB_CLIENT_ID"),
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
    user: env.EMAIL_SERVER_USER || "",
    password: env.EMAIL_SERVER_PASSWORD || "",
    from: env.EMAIL_FROM,
    enabled: !!(env.EMAIL_SERVER_USER && env.EMAIL_SERVER_PASSWORD),
  },

  // ═══════════════════════════════════════════════════
  // Upload Configuration
  // ═══════════════════════════════════════════════════
  upload: {
    provider: env.UPLOAD_PROVIDER,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    imageKit: {
      publicKey: env.IMAGEKIT_PUBLIC_KEY || "",
      privateKey: env.IMAGEKIT_PRIVATE_KEY || "",
      urlEndpoint: env.IMAGEKIT_URL_ENDPOINT || "",
      enabled: hasEnv("IMAGEKIT_PUBLIC_KEY"),
    },
    cloudinary: {
      cloudName: env.CLOUDINARY_CLOUD_NAME || "",
      apiKey: env.CLOUDINARY_API_KEY || "",
      apiSecret: env.CLOUDINARY_API_SECRET || "",
      enabled: hasEnv("CLOUDINARY_CLOUD_NAME"),
    },
  },

  // ═══════════════════════════════════════════════════
  // Background Jobs Configuration (QStash)
  // ═══════════════════════════════════════════════════
  qstash: {
    token: env.QSTASH_TOKEN || "",
    currentSigningKey: env.QSTASH_CURRENT_SIGNING_KEY || "",
    nextSigningKey: env.QSTASH_NEXT_SIGNING_KEY || "",
    url: env.QSTASH_URL || "",
    enabled: hasEnv("QSTASH_TOKEN"),
  },

  // ═══════════════════════════════════════════════════
  // Redis Configuration (Upstash)
  // ═══════════════════════════════════════════════════
  redis: {
    url: env.UPSTASH_REDIS_REST_URL || "",
    token: env.UPSTASH_REDIS_REST_TOKEN || "",
    enabled: hasEnv("UPSTASH_REDIS_REST_URL"),
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
    oauth: hasEnv("AUTH_GOOGLE_CLIENT_ID") || hasEnv("AUTH_GITHUB_CLIENT_ID"),
    backgroundJobs: hasEnv("QSTASH_TOKEN"),
    rateLimiting: hasEnv("UPSTASH_REDIS_REST_URL"),
    imageUpload: hasEnv("IMAGEKIT_PUBLIC_KEY") || hasEnv("CLOUDINARY_CLOUD_NAME"),
  },
  customPassword: env.CUSTOM_PASSWORD || "",
} as const;

// ═══════════════════════════════════════════════════
// HELPER EXPORTS
// ═══════════════════════════════════════════════════

export { appConfig, env, getEnv, hasEnv, isDevelopment, isProduction, isTest };

export default appConfig;

// Re-export rate limiting utilities
export { checkRateLimit, clearRateLimit, getRateLimitStatus } from "@/lib/ratelimit";
