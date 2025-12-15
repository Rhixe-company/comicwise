/**
 * Helper Utilities
 */

/**
 * Create a URL-friendly slug from text
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Extract chapter number from chapter name
 */
export function extractChapterNumber(chapterName: string): number {
  const match = chapterName.match(/chapter\s*(\d+)/i);
  return match?.[1] ? parseInt(match[1], 10) : 0;
}

/**
 * Normalize date string to Date object
 */
export function normalizeDate(dateStr: string | Date | null | undefined): Date {
  if (!dateStr) {
    return new Date();
  }
  if (dateStr instanceof Date) {
    return dateStr;
  }

  // Try standard parsing
  const date = new Date(dateStr);
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

  const match = dateStr.match(/(\w+)\s+(\d+)(?:st|nd|rd|th)?\s+(\d{4})/i);
  if (match) {
    const [, month, day, year] = match;
    if (month && day && year) {
      const monthNum = monthMap[month.toLowerCase()];
      if (monthNum !== undefined) {
        return new Date(parseInt(year), monthNum, parseInt(day));
      }
    }
  }

  return new Date();
}

/**
 * Deduplicate array by key function
 */
export function deduplicateByKey<T>(items: T[], keyFn: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Process items in batches
 */
export async function batchProcess<T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  batchSize: number = 50
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(
      batch.map((item, idx) => processor(item, i + idx))
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
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
