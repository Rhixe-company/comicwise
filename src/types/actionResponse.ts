/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TypeScript Type Definitions - Missing Action Response Types
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Standard action response structure
 */
export interface ActionResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

/**
 * Authentication-specific action response
 */
export interface AuthActionResponse<T = unknown> extends ActionResponse<T> {
  redirectTo?: string;
  user?: {
    email: string;
    id: string;
    name?: null | string;
    role: "admin" | "moderator" | "user";
  };
}

/**
 * Paginated action response
 */
export interface PaginatedActionResponse<T> extends ActionResponse<T[]> {
  pagination: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Form validation error structure
 */
export interface FormValidationError {
  field: string;
  message: string;
}

/**
 * Action response with validation errors
 */
export interface ValidationActionResponse<T = unknown> extends ActionResponse<T> {
  validationErrors?: FormValidationError[];
}
