/**
 * Type Validation Schema
 * Zod validation schemas for Type entity
 * ⚠️ DEPRECATED: Use schemas from @/lib/validations/index.ts instead
 * This file maintained for backward compatibility only
 */

import { createTypeSchema, updateTypeSchema } from "@/schemas/index";

// Re-export with legacy names for backward compatibility
export const insertTypeSchema = createTypeSchema;
export { updateTypeSchema };

export interface InsertType {
  description?: string;
  name: string;
}
export type UpdateType = Partial<InsertType>;
