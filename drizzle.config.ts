import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";
import { defineConfig } from "drizzle-kit";

dotenv.config({ path: ".env.local" });
dotenv.config();

const getDatabaseUrl = (): string => {
  const url = process.env.DATABASE_URL ?? process.env.NEON_DATABASE_URL;

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
  databaseCredentials: {
    url: getDatabaseUrl(),
  },
  verbose: true,
  strict: true,
} as Config;

export default defineConfig(cfg);
