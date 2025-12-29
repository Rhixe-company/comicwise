#!/usr/bin/env tsx
/**
 * Environment Configuration Validator & Optimizer
 * 
 * Validates and optimizes .env.local and appConfig.ts for development/production
 * Usage: pnpm tsx scripts/envValidator.ts [--fix] [--report]
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

interface EnvValidationResult {
  isValid: boolean;
  timestamp: string;
  environment: string;
  variables: {
    name: string;
    status: "required" | "optional" | "recommended";
    value?: string;
    validation: "valid" | "invalid" | "missing";
    message?: string;
  }[];
  summary: {
    required: number;
    optional: number;
    missing: number;
    invalid: number;
  };
}

const REQUIRED_VARS = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "AUTH_URL",
  "NODE_ENV",
  "NEXT_PUBLIC_APP_URL",
];

const OPTIONAL_VARS = [
  "NEON_DATABASE_URL",
  "UPLOAD_PROVIDER",
  "IMAGEKIT_PUBLIC_KEY",
  "IMAGEKIT_PRIVATE_KEY",
  "IMAGEKIT_URL_ENDPOINT",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "AWS_REGION",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_S3_BUCKET_NAME",
  "EMAIL_SERVER_HOST",
  "EMAIL_SERVER_PORT",
  "EMAIL_SERVER_USER",
  "EMAIL_SERVER_PASSWORD",
  "EMAIL_FROM",
  "EMAIL_SECURE",
  "REDIS_HOST",
  "REDIS_PORT",
  "REDIS_PASSWORD",
  "REDIS_DB",
  "REDIS_URL",
  "REDIS_TLS_ENABLED",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "QSTASH_TOKEN",
  "QSTASH_CURRENT_SIGNING_KEY",
  "QSTASH_NEXT_SIGNING_KEY",
  "QSTASH_URL",
  "AUTH_GOOGLE_CLIENT_ID",
  "AUTH_GOOGLE_CLIENT_SECRET",
  "AUTH_GITHUB_CLIENT_ID",
  "AUTH_GITHUB_CLIENT_SECRET",
  "CUSTOM_PASSWORD",
];

const RECOMMENDED_VARS = [
  "IMAGEKIT_ENABLED",
  "EMAIL_SECURE",
  "REDIS_TLS_ENABLED",
];

class EnvValidator {
  private envPath = path.join(ROOT_DIR, ".env.local");
  private envVars: Record<string, string> = {};
  private report: EnvValidationResult = {
    isValid: true,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    variables: [],
    summary: {
      required: 0,
      optional: 0,
      missing: 0,
      invalid: 0,
    },
  };

  private log(message: string, type: "info" | "success" | "error" | "warn" = "info") {
    const colors = {
      info: chalk.blue,
      success: chalk.green,
      error: chalk.red,
      warn: chalk.yellow,
    };
    const symbols = {
      info: "ℹ",
      success: "✓",
      error: "✗",
      warn: "⚠",
    };
    console.log(colors[type](`${symbols[type]} ${message}`));
  }

  async loadEnv(): Promise<void> {
    this.log("Loading environment variables...");

    if (!fs.existsSync(this.envPath)) {
      this.log(".env.local not found", "error");
      throw new Error(".env.local file not found");
    }

    const content = fs.readFileSync(this.envPath, "utf-8");
    const lines = content.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) continue;

      const [key, ...valueParts] = trimmed.split("=");
      if (!key) continue;

      const value = valueParts.join("=").replaceAll(/^"|"$/g, "");
      this.envVars[key] = value;
    }

    this.log(`Loaded ${Object.keys(this.envVars).length} environment variables`, "success");
  }

  validate(): void {
    this.log("Validating environment variables...");

    // Validate required variables
    for (const varName of REQUIRED_VARS) {
      const value = this.envVars[varName];
      const status = "required";

      if (!value) {
        this.report.variables.push({
          name: varName,
          status,
          validation: "missing",
          message: "Required variable not set",
        });
        this.report.summary.missing++;
        this.report.isValid = false;
      } else if (this.validateVariable(varName, value)) {
        this.report.variables.push({
          name: varName,
          status,
          value: this.maskSensitive(varName, value),
          validation: "valid",
        });
        this.report.summary.required++;
      } else {
        this.report.variables.push({
          name: varName,
          status,
          validation: "invalid",
          message: "Variable value is invalid",
        });
        this.report.summary.invalid++;
        this.report.isValid = false;
      }
    }

    // Validate optional variables
    for (const varName of OPTIONAL_VARS) {
      const value = this.envVars[varName];

      if (!value) {
        continue; // Optional, skip if not set
      }

      if (this.validateVariable(varName, value)) {
        this.report.variables.push({
          name: varName,
          status: "optional",
          value: this.maskSensitive(varName, value),
          validation: "valid",
        });
        this.report.summary.optional++;
      } else {
        this.report.variables.push({
          name: varName,
          status: "optional",
          validation: "invalid",
          message: "Variable value is invalid",
        });
        this.report.summary.invalid++;
      }
    }

    // Check for recommended variables
    for (const varName of RECOMMENDED_VARS) {
      const value = this.envVars[varName];

      if (!value) {
        this.log(`Recommended variable not set: ${varName}`, "warn");
      }
    }
  }

  private validateVariable(name: string, value: string): boolean {
    const validations: Record<string, (v: string) => boolean> = {
      DATABASE_URL: (v) => v.startsWith("postgresql://") || v.startsWith("postgres://"),
      NEON_DATABASE_URL: (v) => v.startsWith("postgresql://"),
      AUTH_SECRET: (v) => v.length >= 32,
      AUTH_URL: (v) => this.isValidUrl(v),
      NEXT_PUBLIC_APP_URL: (v) => this.isValidUrl(v),
      UPLOAD_PROVIDER: (v) => ["local", "imagekit", "cloudinary", "aws"].includes(v),
      IMAGEKIT_PUBLIC_KEY: (v) => v.length > 0,
      IMAGEKIT_URL_ENDPOINT: (v) => this.isValidUrl(v),
      EMAIL_SERVER_PORT: (v) => !isNaN(Number.parseInt(v)),
      REDIS_PORT: (v) => !isNaN(Number.parseInt(v)),
      REDIS_DB: (v) => !isNaN(Number.parseInt(v)),
      NODE_ENV: (v) => ["development", "production", "test"].includes(v),
    };

    const validator = validations[name];
    return validator ? validator(value) : true;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private maskSensitive(name: string, value: string): string {
    const sensitive = [
      "SECRET",
      "PASSWORD",
      "KEY",
      "TOKEN",
      "API",
      "PRIVATE",
    ];

    if (sensitive.some((s) => name.includes(s))) {
      return value.slice(0, 3) + "***" + value.slice(Math.max(0, value.length - 3));
    }

    return value;
  }

  async generateReport(): Promise<void> {
    const reportPath = path.join(
      ROOT_DIR,
      "reports",
      `env-validation-${new Date().toISOString().slice(0, 10)}.json`
    );

    const reportsDir = path.dirname(reportPath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2));

    this.log(`Report saved: ${path.relative(ROOT_DIR, reportPath)}`, "success");
  }

  async run(): Promise<void> {
    try {
      await this.loadEnv();
      this.validate();

      console.log("\n" + "=".repeat(60));
      console.log("Environment Validation Report");
      console.log("=".repeat(60));

      if (this.report.isValid) {
        this.log("✓ All required variables are valid", "success");
      } else {
        this.log("✗ Some variables are missing or invalid", "error");
      }

      console.log("\nSummary:");
      console.log(`  Required: ${this.report.summary.required}`);
      console.log(`  Optional: ${this.report.summary.optional}`);
      console.log(`  Missing: ${this.report.summary.missing}`);
      console.log(`  Invalid: ${this.report.summary.invalid}`);

      if (process.argv.includes("--report")) {
        await this.generateReport();
      }

      if (!this.report.isValid) {
        process.exit(1);
      }
    } catch (error) {
      this.log(`Error: ${(error as any).message}`, "error");
      process.exit(1);
    }
  }
}

const validator = new EnvValidator();
validator.run();
