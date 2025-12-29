/**
 * Type Validation Schema
 * Zod validation schemas for comic type entity
 */

import { z } from "zod";

export const insertTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
}).strict();

export const updateTypeSchema = insertTypeSchema.partial();

export type InsertType = z.infer<typeof insertTypeSchema>;
export type UpdateType = z.infer<typeof updateTypeSchema>;
