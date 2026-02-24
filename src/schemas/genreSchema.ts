/**
 * Genre Validation Schema
 * Zod validation schemas for Genre entity
 * ⚠️ DEPRECATED: Use schemas from @/lib/validations/index.ts instead
 * This file maintained for backward compatibility only
 */

import { createGenreSchema, updateGenreSchema } from "@/schemas/index";

// Re-export with legacy names for backward compatibility
export const insertGenreSchema = createGenreSchema;
export { updateGenreSchema };

export interface InsertGenre {
  description?: string;
  name: string;
}
export type UpdateGenre = Partial<InsertGenre>;
