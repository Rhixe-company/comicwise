/**
 * Genre Validation Schema
 * Zod validation schemas for Genre entity
 */

import { z } from "zod";

// ═══════════════════════════════════════════════════
// GENRE SCHEMAS
// ═══════════════════════════════════════════════════

export const insertGenreSchema = z
  .object({
    name: z
      .string({ error: "Name is required" })
      .min(1, "Name is required")
      .max(50, "Name must not exceed 50 characters")
      .trim(),
    description: z
      .string()
      .max(500, "Description must not exceed 500 characters")
      .trim()
      .optional(),
  })
  .strict();

export const updateGenreSchema = insertGenreSchema.partial();

export const genreIdSchema = z
  .object({
    id: z.coerce.number().int().positive("Invalid genre ID"),
  })
  .strict();

export type InsertGenre = z.infer<typeof insertGenreSchema>;
export type UpdateGenre = z.infer<typeof updateGenreSchema>;
