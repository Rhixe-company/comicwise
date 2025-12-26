/**
 * User Validation Schema
 * Zod validation schemas for user entity
 */

import { z } from "zod";

export const insertUserSchema = z.object({
  name: z.string().optional().nullable(),
  email: z.string().email("Must be a valid email address"),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().url("Must be a valid URL").optional().nullable(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  role: z.enum(["user", "admin", "moderator"]).default("user"),
});

export const updateUserSchema = insertUserSchema.partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
