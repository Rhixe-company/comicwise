// ═══════════════════════════════════════════════════
// ACTION UTILITIES (Next.js 16 Optimized)
// ═══════════════════════════════════════════════════

import type { ActionResponse } from "@/types";

/**
 * Create a successful action response
 */
export function success<T>(data: T, message?: string): ActionResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

/**
 * Create an error action response
 */
export function error<T = never>(errorMessage: string): ActionResponse<T> {
  return {
    success: false,
    error: errorMessage,
  };
}

/**
 * Create a validation error response
 */
export function validationError<T = never>(message: string): ActionResponse<T> {
  return {
    success: false,
    error: message,
  };
}
