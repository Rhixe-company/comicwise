/**
 * Artist Validation Schema
 * Zod validation schemas for artist entity
 */

import { z } from "zod";

export const insertArtistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().optional().nullable(),
  image: z.string().url("Must be a valid URL").optional().nullable(),
});

export const updateArtistSchema = insertArtistSchema.partial();

export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type UpdateArtist = z.infer<typeof updateArtistSchema>;
