/**
 * Author Validation Schema
 * Zod validation schemas for author entity
 */

import { z } from "zod";

export const insertAuthorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().optional().nullable(),
  image: z.string().url("Must be a valid URL").optional().nullable(),
}).strict();

export const updateAuthorSchema = insertAuthorSchema.partial();

export type InsertAuthor = z.infer<typeof insertAuthorSchema>;
export type UpdateAuthor = z.infer<typeof updateAuthorSchema>;
