// ═══════════════════════════════════════════════════
// API TYPES - Response & Request Types
// ═══════════════════════════════════════════════════

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  message?: string;
  meta?: ApiMeta;
  success: boolean;
}

export interface ApiMeta {
  cursor?: string;
  hasMore?: boolean;
  page?: number;
  perPage?: number;
  total?: number;
  totalPages?: number;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  pagination: {
    hasNext: boolean;
    hasPrev: boolean;
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  code: string;
  details?: unknown;
  message: string;
  stack?: string;
}

export interface ApiSuccess<T = unknown> {
  data: T;
  message?: string;
  meta?: ApiMeta;
  success: true;
}
