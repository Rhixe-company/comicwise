// ═══════════════════════════════════════════════════
// GENRES API - Full CRUD
// ═══════════════════════════════════════════════════

import { createGenericEntity, listGenericEntity, zodToValidationResult } from "@/lib/genericCrud";
import { createGenreSchema, genreFilterSchema } from "@/lib/validations";
import type { NextRequest } from "next/server";
import { createGenre } from "src/database/mutations/genres";
import { getAllGenres } from "src/database/queries/genres";

export async function GET(request: NextRequest) {
  return listGenericEntity(request, {
    listFn: getAllGenres,
    validateFn: zodToValidationResult(genreFilterSchema),
    entityName: "genres",
  });
}

export async function POST(request: NextRequest) {
  return createGenericEntity(request, {
    createFn: createGenre,
    validateFn: zodToValidationResult(createGenreSchema),
    entityName: "genre",
  });
}
