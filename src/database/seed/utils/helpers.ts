/**
 * Helper Utilities
 */

import { z } from "zod";

import {
  artistSeedSchema,
  authorSeedSchema,
  chapterSeedSchema,
  comicSeedSchema,
  genreSeedSchema,
  typeSeedSchema,
  userSeedSchema,
} from "@/schemas/index";

import type { ZodType } from "zod";

/**
 * Validate data against a schema
 * param data
 * param schema
 * @param data
 * @param schema
 */
export function validateData<T>(data: unknown, schema: ZodType<T>): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = (error as z.ZodError<T>).issues.map((err) => ({
        path: err.path.join("."),
        message: err.message,
        code: err.code,
      }));
      // Preserve the original error as the cause to satisfy preserve-caught-error rule
      const validationError = new Error(
        `Validation failed:\n${JSON.stringify(formattedErrors, null, 2)}`
      );
      // attach cause property instead of using Error constructor second arg to avoid Node version syntax issues
      (validationError as any).cause = error;
      throw validationError;
    }
    throw error;
  }
}

/**
 * Validate array of data
 * param data
 * param schema
 * @param data
 * @param schema
 */
export function validateArray<T>(data: unknown[], schema: ZodType<T>): T[] {
  return data.map((item, index) => {
    try {
      return schema.parse(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodError = error as z.ZodError<T>;
        const formattedErrors = zodError.issues.map((error_) => ({
          path: error_.path.join("."),
          message: error_.message,
          code: error_.code,
        }));
        // Preserve original error as cause for better debugging and rule compliance
        const validationErrorAtIndex = new Error(
          `Validation failed at index ${index}:\n${JSON.stringify(formattedErrors, null, 2)}`
        );
        (validationErrorAtIndex as any).cause = error;
        throw validationErrorAtIndex;
      }
      throw error;
    }
  });
}

/**
 * Safe validation that returns result with errors
 * param data
 * param schema
 * @param data
 * @param schema
 */
export function safeValidate<T>(
  data: unknown,
  schema: ZodType<T>
): { data: T; success: true } | { errors: z.ZodError; success: false } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

/**
 * Get validation schema by type
 * param type
 * @param type
 */
export function getValidationSchema(type: string): ZodType {
  const schemas: Record<string, ZodType> = {
    user: userSeedSchema,
    comic: comicSeedSchema,
    chapter: chapterSeedSchema,
    type: typeSeedSchema,
    author: authorSeedSchema,
    artist: artistSeedSchema,
    genre: genreSeedSchema,
  };

  const schema = schemas[type.toLowerCase()];
  if (!schema) {
    throw new Error(`No validation schema found for type: ${type}`);
  }
  return schema;
}

/**
 * Create a URL-friendly slug from text
 * param text
 * @param text
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replaceAll(/[^\s\w-]/g, "")
    .replaceAll(/\s+/g, "-")
    .replaceAll(/-+/g, "-")
    .trim();
}

/**
 * Extract chapter number from chapter name
 * param chapterName
 * @param chapterName
 */
export function extractChapterNumber(chapterName: string): number {
  const match = chapterName.match(/chapter\s*(\d+)/i);
  return match?.[1] ? Number.parseInt(match[1], 10) : 0;
}

/**
 * Normalize date string to Date object
 * param dateStr
 * param dateString
 * @param dateString
 */
export function normalizeDate(dateString: Date | null | string | undefined): Date {
  if (!dateString) {
    return new Date();
  }
  if (dateString instanceof Date) {
    return dateString;
  }

  // Try standard parsing
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date;
  }

  // Handle "August 14th 2025" format
  const monthMap: Record<string, number> = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };

  const match = dateString.match(/(\w+)\s+(\d+)(?:st|nd|rd|th)?\s+(\d{4})/i);
  if (match) {
    const [, month, day, year] = match;
    if (month && day && year) {
      const monthNumber = monthMap[month.toLowerCase()];
      if (monthNumber !== undefined) {
        return new Date(Number.parseInt(year), monthNumber, Number.parseInt(day));
      }
    }
  }

  return new Date();
}

/**
 * Deduplicate array by key function
 * param items
 * param keyFn
 * param keyFunction
 * @param items
 * @param keyFunction
 */
export function deduplicateByKey<T>(items: T[], keyFunction: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = keyFunction(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Process items in batches
 * param items
 * param processor
 * param batchSize
 * @param items
 * @param processor
 * @param batchSize
 */
export async function batchProcess<T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  batchSize: number = 50
): Promise<R[]> {
  const results: R[] = [];

  for (let index = 0; index < items.length; index += batchSize) {
    const batch = items.slice(index, index + batchSize);
    const batchResults = await Promise.allSettled(
      batch.map((item, index_) => processor(item, index + index_))
    );

    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        results.push(result.value);
      } else {
        console.error("Batch processing error:", result.reason);
      }
    }
  }

  return results;
}

/**
 * Sleep for specified milliseconds
 * param ms
 * @param ms
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
