/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UNIFIED SEED LOGGER - Consolidated logging for all seed operations
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Provides consistent, clear logging with semantic prefixes and colors
 * Supports verbose mode for detailed operation tracking
 */

import pino from "pino";

type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

interface LogContext {
  component?: string;
  operation?: string;
  duration?: number;
  itemCount?: number;
  [key: string]: any;
}

/**
 * Unified seed logger with structured output
 */
export class SeedLogger {
  private logger: pino.Logger;
  private verboseMode = false;
  private startTime = Date.now();

  constructor() {
    this.logger = pino({
      level: process.env.LOG_LEVEL || "info",
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore: "pid,hostname",
          singleLine: false,
        },
      },
    });
  }

  setVerbose(verbose: boolean): void {
    this.verboseMode = verbose;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Semantic Logging Methods
  // ─────────────────────────────────────────────────────────────────────────

  header(text: string): void {
    console.log("\n" + "═".repeat(78));
    console.log(`  🌱 ${text}`);
    console.log("═".repeat(78) + "\n");
  }

  section(text: string): void {
    console.log("\n" + "─".repeat(78));
    console.log(`  📍 ${text}`);
    console.log("─".repeat(78));
  }

  subsection(text: string): void {
    console.log(`\n  ├─ ${text}`);
  }

  success(message: string, context?: LogContext): void {
    const formatted = `✅ ${message}`;
    console.log(formatted);
    this.logger.info({ ...context, message }, formatted);
  }

  info(message: string, context?: LogContext): void {
    const formatted = `ℹ️  ${message}`;
    this.verboseMode && console.log(formatted);
    this.logger.info({ ...context, message }, formatted);
  }

  warn(message: string, context?: LogContext): void {
    const formatted = `⚠️  ${message}`;
    console.warn(formatted);
    this.logger.warn({ ...context, message }, formatted);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const formatted = `❌ ${message}`;
    console.error(formatted);
    if (error) console.error(`   Error: ${error.message}`);
    this.logger.error({ ...context, error, message }, formatted);
  }

  debug(message: string, context?: LogContext): void {
    if (this.verboseMode) {
      const formatted = `🔍 ${message}`;
      console.log(formatted);
      this.logger.debug({ ...context, message }, formatted);
    }
  }

  metric(label: string, value: number | string, unit = ""): void {
    const formatted = `📊 ${label}: ${value}${unit ? ` ${unit}` : ""}`;
    console.log(formatted);
    this.logger.info({ label, value, unit }, formatted);
  }

  summary(stats: Record<string, unknown>): void {
    console.log("\n" + "─".repeat(78));
    console.log("  📈 SUMMARY");
    console.log("─".repeat(78));
    Object.entries(stats).forEach(([key, value]) => {
      const formattedKey = key.replace(/([A-Z])/g, " $1").trim();
      console.log(`  • ${formattedKey}: ${value}`);
    });
  }

  timing(operation: string): () => void {
    const start = performance.now();
    return () => {
      const duration = (performance.now() - start).toFixed(2);
      const formatted = `⏱️  ${operation}: ${duration}ms`;
      this.verboseMode && console.log(formatted);
      return parseFloat(duration);
    };
  }

  footer(): void {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    console.log("\n" + "═".repeat(78));
    console.log(`  ✨ Total time: ${elapsed}s`);
    console.log("═".repeat(78) + "\n");
  }
}

// Export singleton instance
export const logger = new SeedLogger();
