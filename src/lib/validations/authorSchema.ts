/**
 * Author Validation Schema
 * Zod validation schemas for author entity
 */

import { z } from "zod";

// ═══════════════════════════════════════════════════
// AUTHOR/ARTIST SCHEMAS
// ═══════════════════════════════════════════════════

export const insertAuthorSchema = z
  .object({
    name: z
      .string({ error: "Name is required" })
      .min(1, "Name is required")
      .max(100, "Name must not exceed 100 characters")
      .trim(),
    bio: z.string().max(2000, "Bio must not exceed 2000 characters").trim().optional(),
    image: z.string().url("Invalid image URL").optional(),
  })
  .strict();

export const authorIdSchema = z
  .object({
    id: z.coerce.number().int().positive("Invalid author ID"),
  })
  .strict();

export const updateAuthorSchema = insertAuthorSchema.partial();

export type InsertAuthor = z.infer<typeof insertAuthorSchema>;
export type UpdateAuthor = z.infer<typeof updateAuthorSchema>;
