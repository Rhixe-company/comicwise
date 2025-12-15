import { appConfig } from "@/app-config";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

export interface RateLimitConfig {
  requests: number;
  window: number; // seconds
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = appConfig.rateLimit.default
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const windowMs = config.window * 1000;
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    rateLimitMap.set(identifier, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: config.requests - 1,
      resetAt: resetTime,
    };
  }

  if (record.count >= config.requests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.resetTime,
    };
  }

  record.count++;
  return {
    allowed: true,
    remaining: config.requests - record.count,
    resetAt: record.resetTime,
  };
}

export function clearRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier);
}

export function getRateLimitStatus(identifier: string): {
  exists: boolean;
  count?: number;
  resetAt?: number;
} {
  const record = rateLimitMap.get(identifier);
  if (!record) {
    return { exists: false };
  }

  const now = Date.now();
  if (now > record.resetTime) {
    rateLimitMap.delete(identifier);
    return { exists: false };
  }

  return {
    exists: true,
    count: record.count,
    resetAt: record.resetTime,
  };
}

// Cleanup expired entries periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 60000); // Clean up every minute
}
