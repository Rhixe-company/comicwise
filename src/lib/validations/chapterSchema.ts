/**
 * Chapter Validation Schema
 * Zod validation schemas for chapter entity
 */

import { z } from "zod";
// ═══════════════════════════════════════════════════
// CHAPTER SCHEMAS
// ═══════════════════════════════════════════════════

export const insertChapterSchema = z
  .object({
    title: z
      .string({ error: "Title is required" })
      .min(1, "Title is required")
      .max(255, "Title must not exceed 255 characters")
      .trim(),
    chapterNumber: z.coerce
      .number({ error: "Chapter number is required" })
      .int("Chapter number must be an integer")
      .positive("Chapter number must be positive"),
    releaseDate: z.coerce.date(),
    comicId: z.coerce.number({ error: "Comic ID is required" }).int().positive(),
    views: z.coerce.number().int().min(0).default(0),
  })
  .strict();

export const updateChapterSchema = insertChapterSchema.partial().extend({
  comicId: z.coerce.number().int().positive().optional(),
});

export type InsertChapter = z.infer<typeof insertChapterSchema>;
export type UpdateChapter = z.infer<typeof updateChapterSchema>;
