/**
 * Generic CRUD Operations
 * Provides reusable CRUD functionality for API routes
 */

import { db as database } from "@/database/db";
import { eq } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import type { z } from "zod";

export interface ValidationResult {
  success: boolean;
  errors?: Record<string, string[]>;
}

export function zodToValidationResult(error: z.ZodError): ValidationResult {
  const errors: Record<string, string[]> = {};
  
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  }
  
  return {
    success: false,
    errors,
  };
}

export async function getGenericEntity<T extends PgTable>(
  table: T,
  id: number | string
): Promise<unknown | null> {
  const results = await database
    .select()
    .from(table)
    .where(eq((table as any).id, id))
    .limit(1);
    
  return results[0] || null;
}

export async function updateGenericEntity<T extends PgTable>(
  table: T,
  id: number | string,
  data: Record<string, unknown>
): Promise<unknown> {
  const [updated] = await database
    .update(table)
    .set(data)
    .where(eq((table as any).id, id))
    .returning();
    
  return updated;
}

export async function deleteGenericEntity<T extends PgTable>(
  table: T,
  id: number | string
): Promise<void> {
  await database
    .delete(table)
    .where(eq((table as any).id, id));
}
