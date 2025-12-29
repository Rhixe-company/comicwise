/**
 * Chapter Validation Schema
 * Zod validation schemas for chapter entity
 */

import { z } from "zod";

export const insertChapterSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  chapterNumber: z.number().int().positive("Chapter number must be positive"),
  releaseDate: z.coerce.date(),
  comicId: z.number().int().positive("Comic ID is required"),
  views: z.number().int().nonnegative().default(0).optional(),
}).strict();

export const updateChapterSchema = insertChapterSchema.partial();

export type InsertChapter = z.infer<typeof insertChapterSchema>;
export type UpdateChapter = z.infer<typeof updateChapterSchema>;
