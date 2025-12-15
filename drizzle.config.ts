import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";
import { defineConfig } from "drizzle-kit";

// Load .env files when running migrations locally
dotenv.config({ path: ".env" });
dotenv.config();

// Get DATABASE_URL with fallback to NEON_DATABASE_URL
const getDatabaseUrl = (): string => {
  let url = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

  if (!url) {
    try {
      // Try to read validated env from the project's env helper (if present)
      // Prefer dynamic import for compatibility and type safety
      const envModule = import("./src/app-config/env") as {
        env?: { DATABASE_URL?: string };
      };
      if (envModule?.env?.DATABASE_URL) {
        url = envModule.env.DATABASE_URL;
      }
    } catch {
      // ignore - will throw below if still missing
    }
  }

  if (!url) {
    throw new Error(
      "DATABASE_URL or NEON_DATABASE_URL must be defined in environment variables (set in .env.local or environment)."
    );
  }

  return url;
};

const cfg = {
  schema: "./src/database/schema.ts",
  out: "./src/database/drizzle",
  dialect: "postgresql",
  // drizzle-kit typings differ across versions; keep flexible here
  // `databaseCredentials` is used at runtime but may not be in the d.ts
  // Provide multiple credential keys to satisfy different drizzle-kit versions
  databaseCredentials: {
    url: getDatabaseUrl(),
  },
  dbCredentials: {
    url: getDatabaseUrl(),
    connectionString: getDatabaseUrl(),
  },
  connection: {
    url: getDatabaseUrl(),
  },
  verbose: true,
  strict: true,
} as Config;

export default defineConfig(cfg);
