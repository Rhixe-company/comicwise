/**
 * Artist Validation Schema
 * Zod validation schemas for Artist entity
 */

import { z } from "zod";

// ═══════════════════════════════════════════════════
// Artist/ARTIST SCHEMAS
// ═══════════════════════════════════════════════════

export const insertArtistSchema = z
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

export const ArtistIdSchema = z
  .object({
    id: z.coerce.number().int().positive("Invalid Artist ID"),
  })
  .strict();

export const updateArtistSchema = insertArtistSchema.partial();

export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type UpdateArtist = z.infer<typeof updateArtistSchema>;
