// ═══════════════════════════════════════════════════
// ENHANCED LOGGING - Using Pino
// ═══════════════════════════════════════════════════

import { env } from "@/lib/env";
import pino from "pino";

const isDevelopment = env.NODE_ENV === "development";
const logLevel = env.LOG_LEVEL || "info";

export const logger = pino({
  level: logLevel,
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
          singleLine: false,
          levelFirst: true,
          messageFormat: "{levelLabel} - {msg}",
        },
      }
    : undefined,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {
    env: env.NODE_ENV,
    pid: process.pid,
  },
});

// ═══════════════════════════════════════════════════
// CHILD LOGGERS FOR DIFFERENT CONTEXTS
// ═══════════════════════════════════════════════════

export const dbLogger = logger.child({ context: "database" });
export const authLogger = logger.child({ context: "auth" });
export const apiLogger = logger.child({ context: "api" });
export const cacheLogger = logger.child({ context: "cache" });
export const uploadLogger = logger.child({ context: "upload" });
export const queueLogger = logger.child({ context: "queue" });
export const seedLogger = logger.child({ context: "seed" });

// ═══════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════

export function logError(error: unknown, context?: string): void {
  const errorLogger = context ? logger.child({ context }) : logger;

  if (error instanceof Error) {
    errorLogger.error({
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
  } else {
    errorLogger.error({ error });
  }
}

export function logRequest(
  method: string,
  url: string,
  statusCode?: number,
  duration?: number
): void {
  apiLogger.info({
    method,
    url,
    statusCode,
    duration: duration ? `${duration}ms` : undefined,
  });
}

export function logDatabaseQuery(query: string, duration?: number): void {
  dbLogger.debug({
    query,
    duration: duration ? `${duration}ms` : undefined,
  });
}

export default logger;
