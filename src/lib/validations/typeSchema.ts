/**
 * Type Validation Schema
 * Zod validation schemas for Type entity
 */

import { z } from "zod";
// ═══════════════════════════════════════════════════
// TYPE SCHEMAS
// ═══════════════════════════════════════════════════

export const insertTypeSchema = z
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

export const updateTypeSchema = insertTypeSchema.partial();

export const typeIdSchema = z
  .object({
    id: z.coerce.number().int().positive("Invalid type ID"),
  })
  .strict();
export type InsertType = z.infer<typeof insertTypeSchema>;
export type UpdateType = z.infer<typeof updateTypeSchema>;
