// ═══════════════════════════════════════════════════
// DTO TYPES - Data Transfer Objects
// ═══════════════════════════════════════════════════

import type { ActionResponse } from "@/types/api";

/**
 * Base DTO interface
 */
export interface BaseDto {
  createdAt: Date;
  id: number | string;
  updatedAt?: Date;
}

/**
 * Create DTO - Omit system fields
 */
export type CreateDto<T extends BaseDto> = Omit<T, "createdAt" | "id" | "updatedAt">;

/**
 * Update DTO - Partial of Create DTO
 */
export type UpdateDto<T extends BaseDto> = Partial<CreateDto<T>>;

/**
 * DTO Action Response
 */
export type DtoActionResponse<T = unknown> = ActionResponse<T>;

/**
 * DTO List Response
 */
export interface DtoListResponse<T> {
  hasMore: boolean;
  items: T[];
  page: number;
  perPage: number;
  total: number;
}

/**
 * DTO Operation Result
 */
export interface DtoOperationResult {
  error?: string;
  message?: string;
  success: boolean;
}
