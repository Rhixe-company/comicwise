/**
 * Author Validation Schema
 * Zod validation schemas for author entity
 * ⚠️ DEPRECATED: Use schemas from @/lib/validations/index.ts instead
 * This file maintained for backward compatibility only
 */

import { createAuthorSchema, updateAuthorSchema } from "@/schemas/index";

// Re-export with legacy names for backward compatibility
export const insertAuthorSchema = createAuthorSchema;
export const authorIdSchema = createAuthorSchema;
export { updateAuthorSchema };

export interface InsertAuthor {
  bio?: string;
  image?: string;
  name: string;
}
export type UpdateAuthor = Partial<InsertAuthor>;
