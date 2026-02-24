/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UNIFIED SEED LOGGER - Consolidated logging for all seed operations
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Provides consistent, clear logging with semantic prefixes and colors
 * Supports verbose mode for detailed operation tracking
 */

import pino from "pino";

type LogLevel = "debug" | "error" | "fatal" | "info" | "trace" | "warn";

interface LogContext {
  [key: string]: any;
  component?: string;
  duration?: number;
  itemCount?: number;
  operation?: string;
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
      level: process.env["LOG_LEVEL"] || "info",
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
    this.logger.info("\n" + "═".repeat(78));
    this.logger.info(`  🌱 ${text}`);
    this.logger.info("═".repeat(78) + "\n");
  }

  section(text: string): void {
    this.logger.info("\n" + "─".repeat(78));
    this.logger.info(`  📍 ${text}`);
    this.logger.info("─".repeat(78));
  }

  subsection(text: string): void {
    this.logger.info(`\n  ├─ ${text}`);
  }

  success(message: string, context?: LogContext): void {
    const formatted = `✅ ${message}`;
    this.logger.info({ ...context, message }, formatted);
  }

  info(message: string, context?: LogContext): void {
    const formatted = `ℹ️  ${message}`;
    this.verboseMode && this.logger.info(formatted);
    this.logger.info({ ...context, message }, formatted);
  }

  warn(message: string, context?: LogContext): void {
    const formatted = `⚠️  ${message}`;
    console.warn(formatted);
    this.logger.warn({ ...context, message }, formatted);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const formatted = `❌ ${message}`;
    this.logger.error({ ...context, error, message }, formatted);
    if (error) this.logger.error(`   Error: ${error.message}`);
  }

  debug(message: string, context?: LogContext): void {
    if (this.verboseMode) {
      const formatted = `🔍 ${message}`;
      this.logger.info(formatted);
      this.logger.debug({ ...context, message }, formatted);
    }
  }

  metric(label: string, value: number | string, unit = ""): void {
    const formatted = `📊 ${label}: ${value}${unit ? ` ${unit}` : ""}`;
    this.logger.info({ label, value, unit }, formatted);
  }

  summary(stats: Record<string, unknown>): void {
    this.logger.info("\n" + "─".repeat(78));
    this.logger.info("  📈 SUMMARY");
    this.logger.info("─".repeat(78));
    for (const [key, value] of Object.entries(stats)) {
      const formattedKey = key.replaceAll(/([A-Z])/g, " $1").trim();
      this.logger.info(`  • ${formattedKey}: ${value}`);
    }
  }

  timing(operation: string): () => void {
    const start = performance.now();
    return () => {
      const duration = (performance.now() - start).toFixed(2);
      const formatted = `⏱️  ${operation}: ${duration}ms`;
      this.verboseMode && console.log(formatted);
      return Number.parseFloat(duration);
    };
  }

  footer(): void {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    this.logger.info("\n" + "═".repeat(78));
    this.logger.info(`  ✨ Total time: ${elapsed}s`);
    this.logger.info("═".repeat(78) + "\n");
  }
}

// Export singleton instance
export const logger = new SeedLogger();
