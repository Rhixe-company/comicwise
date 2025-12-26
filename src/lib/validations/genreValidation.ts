/**
 * Genre Validation Schema
 * Zod validation schemas for genre entity
 */

import { z } from "zod";

export const insertGenreSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
});

export const updateGenreSchema = insertGenreSchema.partial();

export type InsertGenre = z.infer<typeof insertGenreSchema>;
export type UpdateGenre = z.infer<typeof updateGenreSchema>;
