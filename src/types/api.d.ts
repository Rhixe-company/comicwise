// ═══════════════════════════════════════════════════
// API TYPES - ComicWise
// ═══════════════════════════════════════════════════

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: ApiMeta;
}

/**
 * Standard action response type for server actions
 */
export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * API metadata for pagination and additional info
 */
export interface ApiMeta {
  page?: number;
  perPage?: number;
  total?: number;
  totalPages?: number;
  hasMore?: boolean;
  cursor?: string;
}

// /**
//  * Pagination parameters
//  */
// export interface PaginationParams {
//   page?: number;
//   perPage?: number;
//   cursor?: string;
// }

// /**
//  * Sort parameters
//  */
// export interface SortParams {
//   sortBy?: string;
//   sortOrder?: "asc" | "desc";
// }

/**
 * API Error response
 */
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  stack?: string;
}

/**
 * Bulk operation result
 */
export interface BulkOperationResult<T = unknown> {
  success: number;
  failed: number;
  total: number;
  results: T[];
  errors: Array<{
    index: number;
    error: string;
  }>;
}

/**
 * File upload response
 */
export interface UploadResponse {
  url: string;
  publicId?: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  uptime: number;
  services: {
    database: ServiceStatus;
    redis?: ServiceStatus;
    email?: ServiceStatus;
    storage?: ServiceStatus;
  };
}

export interface ServiceStatus {
  status: "up" | "down" | "degraded";
  message?: string;
  latency?: number;
}
