/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UNIFIED SEED SCHEMAS - Comprehensive Zod validation for all seed data
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * DRY principle: Single source of truth for all validation rules
 * Supports flexible data formats from multiple JSON sources
 */

import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────
// COMMON SCHEMAS - Reusable building blocks
// ─────────────────────────────────────────────────────────────────────────

const urlOrString = z.string().url().or(z.string().min(1));

const dateString = z.union([
  z.string().datetime(),
  z.string(),
  z.date(),
]).optional();

const numericString = z.union([z.string(), z.number()]).transform((val) => {
  if (typeof val === "string") {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  }
  return val;
});

const imageObject = z.object({ url: z.string().min(1) }).passthrough().optional();

const imageArray = z
  .array(imageObject)
  .or(z.array(z.string()).transform((urls) => urls.map((url) => ({ url }))))
  .optional()
  .default([]);

// ─────────────────────────────────────────────────────────────────────────
// USER SCHEMA - Comprehensive user validation
// ─────────────────────────────────────────────────────────────────────────

export const userSeedSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().min(1).max(100),
    email: z.string().email(),
    image: urlOrString.optional(),
    role: z.enum(["user", "admin", "moderator"]).default("user"),
    emailVerified: dateString,
    createdAt: dateString,
    updatedAt: dateString,
  })
  .passthrough();

export type UserSeedData = z.infer<typeof userSeedSchema>;

// ─────────────────────────────────────────────────────────────────────────
// METADATA SCHEMAS - Reusable for type, author, artist, genre
// ─────────────────────────────────────────────────────────────────────────

const metadataNameSchema = z.object({ name: z.string().min(1).max(255) }).passthrough();

// ─────────────────────────────────────────────────────────────────────────
// COMIC SCHEMA - Flexible comic data validation
// ─────────────────────────────────────────────────────────────────────────

export const comicSeedSchema = z
  .object({
    id: z.string().uuid().optional(),
    title: z.string().min(1).max(255),
    slug: z.string().min(1).max(512),
    description: z.string().min(1).max(5000),
    coverImage: urlOrString.optional(),
    images: imageArray,
    rating: numericString.optional(),
    status: z
      .enum(["Ongoing", "Completed", "Hiatus", "Dropped", "Coming Soon", "Season End"])
      .default("Ongoing"),
    serialization: z.string().optional(),
    url: urlOrString.optional(),
    type: metadataNameSchema.optional(),
    author: metadataNameSchema.optional(),
    artist: metadataNameSchema.optional(),
    genres: z.array(metadataNameSchema).optional().default([]),
    views: numericString.optional(),
    updatedAt: z.string().optional(),
    createdAt: z.string().optional(),
  })
  .passthrough();

export type ComicSeedData = z.infer<typeof comicSeedSchema>;

// ─────────────────────────────────────────────────────────────────────────
// CHAPTER SCHEMA - Comprehensive chapter validation
// ─────────────────────────────────────────────────────────────────────────

export const chapterSeedSchema = z
  .object({
    id: z.string().uuid().optional(),
    title: z.string().min(1).max(255).optional(),
    name: z.string().min(1).max(255).optional(),
    chapterNumber: numericString.optional(),
    releaseDate: dateString,
    url: urlOrString.optional(),
    views: numericString.optional(),
    images: imageArray.optional(),
    comic: z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
    }),
    updatedAt: z.string().optional(),
    createdAt: z.string().optional(),
  })
  .passthrough()
  .transform((data) => {
    // Extract chapter number from name if not explicitly set
    let chapterNumber = data.chapterNumber || 0;

    if (!chapterNumber && data.name) {
      const match = data.name.match(/Chapter\s+(\d+\.?\d*)/i);
      if (match) chapterNumber = parseFloat(match[1]);
    }

    return {
      ...data,
      chapterNumber,
      title: data.title || data.name || "Unknown Chapter",
      images: data.images || [],
    };
  });

export type ChapterSeedData = z.infer<typeof chapterSeedSchema>;

// ─────────────────────────────────────────────────────────────────────────
// ARRAY VALIDATION - Bulk data validation
// ─────────────────────────────────────────────────────────────────────────

export const userArraySchema = z.array(userSeedSchema);
export const comicArraySchema = z.array(comicSeedSchema);
export const chapterArraySchema = z.array(chapterSeedSchema);

// ─────────────────────────────────────────────────────────────────────────
// VALIDATION RESULT TYPE
// ─────────────────────────────────────────────────────────────────────────

export interface ValidationResult<T> {
  data: T[];
  valid: number;
  invalid: number;
  errors: Array<{
    index: number;
    error: string;
  }>;
}

/**
 * Safely validate array of items with error collection
 * Returns detailed error information for debugging
 */
export function validateArray<T>(
  items: unknown[],
  schema: z.ZodSchema<T>
): ValidationResult<T> {
  const data: T[] = [];
  const errors: Array<{ index: number; error: string }> = [];

  items.forEach((item, index) => {
    const result = schema.safeParse(item);
    if (result.success) {
      data.push(result.data);
    } else {
      errors.push({
        index,
        error: result.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join("; "),
      });
    }
  });

  return {
    data,
    valid: data.length,
    invalid: errors.length,
    errors,
  };
}

/**
 * Get schema by data type
 * Used for dynamic validation based on content type
 */
export function getSchemaByType(type: "user" | "comic" | "chapter") {
  const schemas = {
    user: userSeedSchema,
    comic: comicSeedSchema,
    chapter: chapterSeedSchema,
  };
  return schemas[type];
}
