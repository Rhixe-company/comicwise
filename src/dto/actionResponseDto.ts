/**
 * Action Response DTOs
 * Standardized response types for all server actions
 * Ensures type safety and consistency across the application
 *
 * @performance
 * - Minimal type overhead
 * - Generic type support for flexible data payloads
 * - No serialization issues (plain objects only)
 */

/**
 * Generic success response
 * @template T - The data type returned on success
 */
export interface ActionSuccess<T = unknown> {
  data?: T;
  message?: string;
  success: true;
}

/**
 * Generic error response
 */
export interface ActionError {
  code?: string;
  details?: Record<string, unknown>;
  error: string;
  success: false;
}

/**
 * Union type for all action results
 * @template T - The data type for successful responses
 */
export type ActionResult<T = unknown> = ActionError | ActionSuccess<T>;

/**
 * Simple response without data payload
 */
export type SimpleActionResult = ActionError | ActionSuccess<void>;

/**
 * ID response - Common pattern for create operations
 */
export interface IdResponse {
  id: number | string;
}

/**
 * Paginated response metadata
 */
export interface PaginationMeta {
  hasMore?: boolean;
  limit: number;
  page: number;
  total: number;
  totalPages?: number;
}

/**
 * Paginated list response
 */
export interface PaginatedResult<T> {
  data: T[];
  message?: string;
  pagination: PaginationMeta;
  success: true;
}

/**
 * Paginated result or error
 */
export type PaginatedActionResult<T = unknown> = ActionError | PaginatedResult<T>;

/**
 * Auth-specific response
 */
export interface AuthActionResponse {
  code?: string;
  error?: string;
  message?: string;
  success: boolean;
}

/**
 * Create operation response (returns created entity ID)
 */
export type CreateActionResult<T = IdResponse> = ActionResult<T>;

/**
 * Update operation response (no data required, just confirmation)
 */
export type UpdateActionResult = SimpleActionResult;

/**
 * Delete operation response (no data required, just confirmation)
 */
export type DeleteActionResult = SimpleActionResult;

/**
 * Fetch/Read operation response
 */
export type ReadActionResult<T> = ActionResult<T>;

/**
 * Bulk operation response
 */
export interface BulkActionResult {
  errors?: Array<{
    error: string;
    index: number;
    item?: unknown;
  }>;
  failed: number;
  processed: number;
  success: boolean;
}

/**
 * Batch result for multiple items
 * @template T - Individual item type
 */
export interface BatchResult<T> {
  items: T[];
  message?: string;
  skipped?: Array<{
    item: unknown;
    reason: string;
  }>;
  success: true;
}

/**
 * Upload/File response
 */
export interface UploadActionResult {
  error?: string;
  fileName?: string;
  size?: number;
  success: boolean;
  url?: string;
}

/**
 * Validation result with detailed error information
 */
export interface ValidationResult {
  errors?: Record<string, string[]>;
  success: boolean;
  warnings?: Record<string, string[]>;
}

/**
 * Combined validation and action result
 */
export type ValidatedActionResult<T = unknown> = ActionResult<T> & ValidationResult;

/**
 * Response for operations with side effects
 */
export interface SideEffectResult {
  affected: number;
  error?: string;
  message?: string;
  success: boolean;
}

/**
 * Rate limit response
 */
export interface RateLimitResult {
  allowed: boolean;
  message?: string;
  remaining?: number;
  resetAt?: number;
}

/**
 * Cache operation response
 */
export interface CacheActionResult {
  cached: boolean;
  error?: string;
  success: boolean;
  ttl?: number;
}

/**
 * Search results response
 */
export interface SearchResult<T> {
  executionTime?: number;
  query: string;
  results: T[];
  success: true;
  total: number;
}

/**
 * Search result or error
 */
export type SearchActionResult<T = unknown> = ActionError | SearchResult<T>;

/**
 * Health check response
 */
export interface HealthCheckResult {
  message?: string;
  services: Record<string, { latency?: number; status: string; }>;
  status: "degraded" | "healthy" | "unhealthy";
  timestamp: string;
}

/**
 * Common API response wrapper
 * Used when action response types don't match standard patterns
 */
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: {
    code?: string;
    details?: Record<string, unknown>;
    message: string;
  };
  status: number;
  success: boolean;
  timestamp?: string;
}
