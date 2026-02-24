// ═══════════════════════════════════════════════════
// ACTION TYPES - Server Actions & Response Types
// ═══════════════════════════════════════════════════

import type { z } from "zod";

// ═══════════════════════════════════════════════════
// BASE ACTION RESPONSE
// ═══════════════════════════════════════════════════

export interface ActionResponse<T = unknown> {
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  message?: string;
  statusCode?: number;
  success: boolean;
}

export type ActionResult<T = unknown> = Promise<ActionResponse<T>>;

// ═══════════════════════════════════════════════════
// PAGINATED RESPONSE
// ═══════════════════════════════════════════════════

// export interface PaginatedResponse<T = unknown> {
//   data: T[];
//   pagination: {
//     page: number;
//     pageSize: number;
//     totalItems: number;
//     totalPages: number;
//     hasNextPage: boolean;
//     hasPrevPage: boolean;
//   };
// }

// export type PaginatedActionResult<T = unknown> = ActionResult<PaginatedResponse<T>>;

// ═══════════════════════════════════════════════════
// SEARCH RESPONSE
// ═══════════════════════════════════════════════════

export interface SearchResponse<T = unknown> {
  filters?: Record<string, unknown>;
  query: string;
  results: T[];
  totalResults: number;
}

export type SearchActionResult<T = unknown> = ActionResult<SearchResponse<T>>;

// ═══════════════════════════════════════════════════
// VALIDATION TYPES
// ═══════════════════════════════════════════════════

export type ValidationErrors = Record<string, string[]>;

export interface ValidatedInput<T> {
  data: T;
  errors?: ValidationErrors;
  isValid: boolean;
}

export type ValidationResult<T> = ValidatedInput<T>;

// ═══════════════════════════════════════════════════
// CRUD ACTION TYPES
// ═══════════════════════════════════════════════════

export type CreateAction<TInput, TOutput> = (input: TInput) => ActionResult<TOutput>;
export type ReadAction<TOutput> = (id: number | string) => ActionResult<TOutput>;
export type UpdateAction<TInput, TOutput> = (
  id: number | string,
  input: TInput
) => ActionResult<TOutput>;
export type DeleteAction = (id: number | string) => ActionResult<void>;
export type ListAction<TOutput, TFilters = unknown> = (
  filters?: TFilters
) => ActionResult<TOutput[]>;

// ═══════════════════════════════════════════════════
// AUTH ACTION TYPES
// ═══════════════════════════════════════════════════

export interface AuthActionResponse {
  error?: string;
  message?: string;
  redirectUrl?: string;
  success: boolean;
}

export type AuthActionResult = Promise<AuthActionResponse>;

// ═══════════════════════════════════════════════════
// FILE UPLOAD ACTION TYPES
// ═══════════════════════════════════════════════════

export interface UploadActionResponse {
  error?: string;
  publicId?: string;
  success: boolean;
  url?: string;
}

export type UploadActionResult = Promise<UploadActionResponse>;

export interface BulkUploadActionResponse {
  error?: string;
  failed?: string[];
  success: boolean;
  urls?: string[];
}

export type BulkUploadActionResult = Promise<BulkUploadActionResponse>;

// ═══════════════════════════════════════════════════
// WORKFLOW ACTION TYPES
// ═══════════════════════════════════════════════════

export interface WorkflowStepResult<T = unknown> {
  data?: T;
  error?: string;
  stepName: string;
  success: boolean;
}

export interface WorkflowResult<T = unknown> {
  error?: string;
  finalData?: T;
  results: WorkflowStepResult[];
  success: boolean;
}

export type WorkflowActionResult<T = unknown> = Promise<WorkflowResult<T>>;

// ═══════════════════════════════════════════════════
// CACHE ACTION TYPES
// ═══════════════════════════════════════════════════

export interface CacheActionResponse {
  cached?: boolean;
  data?: unknown;
  error?: string;
  success: boolean;
}

export type CacheActionResult = Promise<CacheActionResponse>;

// ═══════════════════════════════════════════════════
// RATE LIMIT TYPES
// ═══════════════════════════════════════════════════

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number;
  success: boolean;
}

export type RateLimitCheck = (identifier: string) => Promise<RateLimitResult>;

// ═══════════════════════════════════════════════════
// HELPER TYPE FOR ZOD VALIDATED ACTIONS
// ═══════════════════════════════════════════════════

export type ZodValidatedAction<TSchema extends z.ZodTypeAny, TOutput> = (
  input: z.infer<TSchema>
) => ActionResult<TOutput>;
